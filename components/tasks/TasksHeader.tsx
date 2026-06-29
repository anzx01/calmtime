"use client";
import { useState } from "react";
import { useTasksStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { GlassCard } from "@/components/ui/GlassCard";
import { MoreIcon } from "@/components/ui/icons";
import { TaskTemplates } from "./TaskTemplates";

const menuItem = "block w-full px-3 py-2 text-left text-sm hover:bg-white/10";

export function TasksHeader() {
  const t = useI18n();
  const [open, setOpen] = useState(false);
  const clearCompleted = useTasksStore((s) => s.clearCompleted);
  const clearAll = useTasksStore((s) => s.clearAll);
  const saveTemplate = useTasksStore((s) => s.saveTemplate);
  const close = () => setOpen(false);

  return (
    <div className="relative flex items-center justify-between border-b border-white/15 pb-2">
      <h2 className="text-base font-bold">{t("tasks")}</h2>
      <button
        type="button"
        aria-label="Task menu"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-1.5 text-white/80 hover:bg-white/15"
      >
        <MoreIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} role="presentation" />
          <GlassCard strong className="absolute top-9 right-0 z-20 w-56 overflow-hidden p-0">
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                const name = window.prompt(t("saveTemplate"));
                if (name) saveTemplate(name);
                close();
              }}
            >
              {t("saveTemplate")}
            </button>
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                clearCompleted();
                close();
              }}
            >
              {t("clearCompleted")}
            </button>
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                clearAll();
                close();
              }}
            >
              {t("clearAll")}
            </button>
            <div className="border-t border-white/10 py-1">
              <p className="px-3 py-1 text-xs text-white/40 uppercase">{t("templates")}</p>
              <TaskTemplates onApply={close} />
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
