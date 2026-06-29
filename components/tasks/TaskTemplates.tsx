"use client";
import { useTasksStore } from "@/stores";

export function TaskTemplates({ onApply }: { onApply: () => void }) {
  const templates = useTasksStore((s) => s.templates);
  const applyTemplate = useTasksStore((s) => s.applyTemplate);
  const removeTemplate = useTasksStore((s) => s.removeTemplate);

  if (templates.length === 0) {
    return <p className="px-3 py-2 text-xs text-white/50">No templates yet</p>;
  }

  return (
    <div className="flex flex-col">
      {templates.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between px-3 py-1.5 text-sm hover:bg-white/10"
        >
          <button
            type="button"
            onClick={() => {
              applyTemplate(t.id);
              onApply();
            }}
            className="flex-1 text-left"
          >
            {t.name} <span className="text-white/40">({t.items.length})</span>
          </button>
          <button
            type="button"
            aria-label="Delete template"
            onClick={() => removeTemplate(t.id)}
            className="px-1 text-white/40 hover:text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
