"use client";
import { useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useTasksStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { PlusIcon } from "@/components/ui/icons";
import { TasksHeader } from "./TasksHeader";
import { EstimatedFinish } from "./EstimatedFinish";
import { TaskList } from "./TaskList";
import { TaskEditor } from "./TaskEditor";

export function TasksPanel() {
  const t = useI18n();
  const hydrated = useHydrated();
  const addTask = useTasksStore((s) => s.addTask);
  const [adding, setAdding] = useState(false);

  return (
    <section className="w-full">
      <TasksHeader />
      <EstimatedFinish />
      <div className="mt-3">{hydrated && <TaskList />}</div>
      <div className="mt-3">
        {adding ? (
          <TaskEditor
            onCancel={() => setAdding(false)}
            onSubmit={(draft) => {
              addTask(draft);
              setAdding(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/30 py-4 font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            <PlusIcon size={18} /> {t("addTask")}
          </button>
        )}
      </div>
    </section>
  );
}
