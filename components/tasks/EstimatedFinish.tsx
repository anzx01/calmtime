"use client";
import { useSettingsStore, useTasksStore } from "@/stores";
import { useHydrated } from "@/hooks/useHydrated";
import { useI18n } from "@/hooks/useI18n";

export function EstimatedFinish() {
  const t = useI18n();
  const hydrated = useHydrated();
  const tasks = useTasksStore((s) => s.tasks);
  const durations = useSettingsStore((s) => s.settings.durations);

  if (!hydrated || tasks.length === 0) return null;

  const est = tasks.reduce((a, t) => a + t.estimatedPomodoros, 0);
  const done = tasks.reduce((a, t) => a + t.completedPomodoros, 0);
  const remaining = tasks
    .filter((t) => !t.done)
    .reduce((a, t) => a + Math.max(0, t.estimatedPomodoros - t.completedPomodoros), 0);

  const focusMs = remaining * durations.pomodoro * 60_000;
  const breakMs = Math.max(0, remaining - 1) * durations.shortBreak * 60_000;
  const finish = new Date(Date.now() + focusMs + breakMs);
  const hh = String(finish.getHours()).padStart(2, "0");
  const mm = String(finish.getMinutes()).padStart(2, "0");

  return (
    <div className="mt-2 flex items-center justify-between text-xs text-white/70">
      <span>
        Pomos: <b className="text-white">{done}</b>/{est}
      </span>
      {remaining > 0 && (
        <span>
          {t("estimatedFinish")}{" "}
          <b className="text-white">
            {hh}:{mm}
          </b>
        </span>
      )}
    </div>
  );
}
