"use client";
import { useState } from "react";
import type { TaskDraft } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { useI18n } from "@/hooks/useI18n";

interface TaskEditorProps {
  initial?: TaskDraft;
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
}

export function TaskEditor({ initial, onSubmit, onCancel }: TaskEditorProps) {
  const t = useI18n();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [est, setEst] = useState(initial?.estimatedPomodoros ?? 1);

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({ title, estimatedPomodoros: est, note: note.trim() || undefined });
  };

  return (
    <GlassCard strong className="flex flex-col gap-3 p-4">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="What are you working on?"
        className="bg-transparent text-lg font-semibold placeholder-white/45 outline-none"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add note (optional)"
        rows={2}
        className="resize-none rounded-lg bg-white/10 p-2 text-sm placeholder-white/40 outline-none"
      />
      <div className="flex items-center gap-2 text-sm text-white/80">
        <span>Est. Pomodoros</span>
        <NumberStepper label="Estimated pomodoros" value={est} min={1} max={20} onChange={setEst} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button variant="solid" onClick={submit}>
          {t("save")}
        </Button>
      </div>
    </GlassCard>
  );
}
