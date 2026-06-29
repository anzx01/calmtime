"use client";
import type { Task } from "@/types";
import { useTasksStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils/cn";
import { CheckIcon, MoreIcon } from "@/components/ui/icons";

interface TaskItemProps {
  task: Task;
  active: boolean;
  onEdit: () => void;
}

export function TaskItem({ task, active, onEdit }: TaskItemProps) {
  const t = useI18n();
  const toggleDone = useTasksStore((s) => s.toggleDone);
  const setActive = useTasksStore((s) => s.setActiveTask);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setActive(task.id)}
      onKeyDown={(e) => e.key === "Enter" && setActive(task.id)}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border-l-4 bg-white/10 px-3 py-3 transition-colors",
        active ? "border-white" : "border-transparent hover:bg-white/15",
      )}
    >
      <button
        type="button"
        aria-label={t("markDone")}
        onClick={(e) => {
          e.stopPropagation();
          toggleDone(task.id);
        }}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          task.done ? "border-white bg-white text-[var(--mode-color)]" : "border-white/50",
        )}
      >
        {task.done && <CheckIcon size={12} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-medium", task.done && "line-through opacity-60")}>
          {task.title}
        </p>
        {task.note && <p className="truncate text-xs text-white/60">{task.note}</p>}
      </div>
      <span className="tabular text-sm text-white/70">
        {task.completedPomodoros}/{task.estimatedPomodoros}
      </span>
      <button
        type="button"
        aria-label={t("editTask")}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="shrink-0 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
      >
        <MoreIcon size={16} />
      </button>
    </div>
  );
}
