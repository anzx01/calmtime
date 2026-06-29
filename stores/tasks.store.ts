import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskDraft, TaskTemplate } from "@/types";
import { createId } from "@/lib/utils/id";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { jsonStorage, validated } from "@/lib/storage/persist";
import { tasksSchema, taskTemplatesSchema } from "@/lib/schemas";

interface TasksStore {
  tasks: Task[];
  templates: TaskTemplate[];
  activeTaskId: string | null;
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, partial: Partial<TaskDraft>) => void;
  removeTask: (id: string) => void;
  toggleDone: (id: string) => void;
  setActiveTask: (id: string | null) => void;
  /** 当前任务完成一个番茄。 */
  incrementActive: () => void;
  clearCompleted: () => void;
  clearAll: () => void;
  saveTemplate: (name: string) => void;
  applyTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;
}

function makeTask(draft: TaskDraft, order: number): Task {
  return {
    id: createId(),
    title: draft.title.trim(),
    note: draft.note?.trim() || undefined,
    estimatedPomodoros: Math.max(1, Math.round(draft.estimatedPomodoros)),
    completedPomodoros: 0,
    done: false,
    createdAt: Date.now(),
    order,
  };
}

function nextActive(tasks: Task[], removedId: string, current: string | null): string | null {
  if (current !== removedId) return current;
  return tasks.find((t) => !t.done && t.id !== removedId)?.id ?? null;
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: [],
      templates: [],
      activeTaskId: null,
      addTask: (draft) =>
        set((s) => {
          const task = makeTask(draft, s.tasks.length);
          return {
            tasks: [...s.tasks, task],
            activeTaskId: s.activeTaskId ?? task.id,
          };
        }),
      updateTask: (id, partial) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...partial,
                  title: partial.title?.trim() ?? t.title,
                  estimatedPomodoros:
                    partial.estimatedPomodoros !== undefined
                      ? Math.max(1, Math.round(partial.estimatedPomodoros))
                      : t.estimatedPomodoros,
                }
              : t,
          ),
        })),
      removeTask: (id) =>
        set((s) => {
          const tasks = s.tasks.filter((t) => t.id !== id);
          return { tasks, activeTaskId: nextActive(tasks, id, s.activeTaskId) };
        }),
      toggleDone: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      setActiveTask: (id) => set({ activeTaskId: id }),
      incrementActive: () =>
        set((s) => {
          if (!s.activeTaskId) return {};
          return {
            tasks: s.tasks.map((t) =>
              t.id === s.activeTaskId ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t,
            ),
          };
        }),
      clearCompleted: () => set((s) => ({ tasks: s.tasks.filter((t) => !t.done) })),
      clearAll: () => set({ tasks: [], activeTaskId: null }),
      saveTemplate: (name) =>
        set((s) => {
          const items: TaskDraft[] = s.tasks
            .filter((t) => !t.done)
            .map((t) => ({
              title: t.title,
              note: t.note,
              estimatedPomodoros: t.estimatedPomodoros,
            }));
          if (items.length === 0) return {};
          const template: TaskTemplate = { id: createId(), name: name.trim() || "Template", items };
          return { templates: [...s.templates, template] };
        }),
      applyTemplate: (id) =>
        set((s) => {
          const tpl = s.templates.find((t) => t.id === id);
          if (!tpl) return {};
          const added = tpl.items.map((d, i) => makeTask(d, s.tasks.length + i));
          return {
            tasks: [...s.tasks, ...added],
            activeTaskId: s.activeTaskId ?? added[0]?.id ?? null,
          };
        }),
      removeTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
    }),
    {
      name: STORAGE_KEYS.tasks,
      storage: jsonStorage,
      partialize: (s) => ({
        tasks: s.tasks,
        templates: s.templates,
        activeTaskId: s.activeTaskId,
      }),
      merge: (persisted, current) => {
        const p = persisted as
          { tasks?: unknown; templates?: unknown; activeTaskId?: unknown } | undefined;
        return {
          ...current,
          tasks: validated(tasksSchema, p?.tasks, current.tasks, "tasks"),
          templates: validated(taskTemplatesSchema, p?.templates, current.templates, "templates"),
          activeTaskId: typeof p?.activeTaskId === "string" ? p.activeTaskId : null,
        };
      },
    },
  ),
);
