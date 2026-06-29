"use client";
import { useState } from "react";
import { useTasksStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { TaskItem } from "./TaskItem";
import { TaskEditor } from "./TaskEditor";

export function TaskList() {
  const t = useI18n();
  const tasks = useTasksStore((s) => s.tasks);
  const activeId = useTasksStore((s) => s.activeTaskId);
  const updateTask = useTasksStore((s) => s.updateTask);
  const removeTask = useTasksStore((s) => s.removeTask);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-white/55">
        {t("noTasks")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) =>
        editingId === task.id ? (
          <TaskEditor
            key={task.id}
            initial={{
              title: task.title,
              note: task.note,
              estimatedPomodoros: task.estimatedPomodoros,
            }}
            onCancel={() => setEditingId(null)}
            onSubmit={(draft) => {
              updateTask(task.id, draft);
              setEditingId(null);
            }}
          />
        ) : (
          <TaskItem
            key={task.id}
            task={task}
            active={task.id === activeId}
            onEdit={() => setEditingId(task.id)}
          />
        ),
      )}
      {editingId && (
        <button
          type="button"
          onClick={() => {
            removeTask(editingId);
            setEditingId(null);
          }}
          className="self-center text-xs text-white/50 underline hover:text-white"
        >
          Delete editing task
        </button>
      )}
    </div>
  );
}
