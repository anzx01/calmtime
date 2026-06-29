"use client";
import type { TimerMode } from "@/types";
import { useSettingsStore, useTimerStore } from "@/stores";
import { durationMsForMode } from "@/lib/timer/schedule";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKeys } from "@/lib/i18n";

const MODES: { mode: TimerMode; key: I18nKeys }[] = [
  { mode: "pomodoro", key: "pomodoro" },
  { mode: "shortBreak", key: "shortBreak" },
  { mode: "longBreak", key: "longBreak" },
];

export function ModeTabs() {
  const t = useI18n();
  const mode = useTimerStore((s) => s.mode);
  const selectMode = useTimerStore((s) => s.selectMode);
  const settings = useSettingsStore((s) => s.settings);

  return (
    <div className="flex justify-center gap-1 rounded-full bg-black/15 p-1">
      {MODES.map(({ mode: m, key }) => (
        <button
          key={m}
          type="button"
          onClick={() => selectMode(m, durationMsForMode(settings, m))}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm",
            mode === m ? "bg-white/20 text-white" : "text-white/70 hover:text-white",
          )}
        >
          {t(key)}
        </button>
      ))}
    </div>
  );
}
