"use client";
import { useSettingsStore, useTimerStore } from "@/stores";
import { MODE_MESSAGES } from "@/lib/theme/palette";
import { cn } from "@/lib/utils/cn";

export function CycleIndicator() {
  const mode = useTimerStore((s) => s.mode);
  const total = useTimerStore((s) => s.totalCompleted);
  const completedInCycle = useTimerStore((s) => s.completedInCycle);
  const interval = useSettingsStore((s) => s.settings.longBreakInterval);

  const inCycle = completedInCycle % interval;
  const filled = inCycle === 0 && completedInCycle > 0 ? interval : inCycle;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: interval }).map((_, i) => (
          <span
            key={i}
            className={cn("h-2 w-2 rounded-full", i < filled ? "bg-white" : "bg-white/30")}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-white/85">
        {mode === "pomodoro" ? `#${total + 1} · ` : ""}
        {MODE_MESSAGES[mode]}
      </p>
    </div>
  );
}
