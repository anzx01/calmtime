"use client";
import { useTimerStore } from "@/stores";
import { useTimerLoop } from "@/hooks/useTimerLoop";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHydrated } from "@/hooks/useHydrated";
import { useI18n } from "@/hooks/useI18n";
import { GlassCard } from "@/components/ui/GlassCard";
import { progressRatio } from "@/lib/timer/format";
import type { I18nKeys } from "@/lib/i18n";
import { ModeTabs } from "./ModeTabs";
import { ProgressRing } from "./ProgressRing";
import { TimeDisplay } from "./TimeDisplay";
import { TimerControls } from "./TimerControls";
import { CycleIndicator } from "./CycleIndicator";

const MODE_LABEL_KEYS: Record<string, I18nKeys> = {
  pomodoro: "pomodoro",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
};

export function TimerCard() {
  const t = useI18n();
  const { remainingMs, totalMs } = useTimerLoop();
  const mode = useTimerStore((s) => s.mode);
  const status = useTimerStore((s) => s.status);
  const hydrated = useHydrated();

  useDocumentTitle(remainingMs, t(MODE_LABEL_KEYS[mode] ?? "pomodoro"), status === "running");

  // hydrate 前显示满时长，避免首屏闪 0
  const shownMs = hydrated ? remainingMs : totalMs;
  const progress = hydrated ? progressRatio(remainingMs, totalMs) : 0;

  return (
    <GlassCard className="flex w-full flex-col items-center gap-6 px-6 py-8 sm:px-8">
      <ModeTabs />
      <ProgressRing progress={progress}>
        <TimeDisplay remainingMs={shownMs} />
      </ProgressRing>
      <TimerControls />
      <CycleIndicator />
    </GlassCard>
  );
}
