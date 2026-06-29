"use client";
import { useTimerStore, useSettingsStore } from "@/stores";
import { useTimerLoop } from "@/hooks/useTimerLoop";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHydrated } from "@/hooks/useHydrated";
import { progressRatio } from "@/lib/timer/format";
import { focusDurationMs } from "@/lib/timer/schedule";
import { ProgressRing } from "./ProgressRing";
import { TimeDisplay } from "./TimeDisplay";

export function TimerCard() {
  const { remainingMs, totalMs } = useTimerLoop();
  const status = useTimerStore((s) => s.status);
  const hydrated = useHydrated();
  const settings = useSettingsStore((s) => s.settings);

  useDocumentTitle(remainingMs, "Focus", status === "running");

  const shownMs = hydrated ? remainingMs : totalMs;
  const progress = hydrated ? progressRatio(remainingMs, totalMs) : 0;
  const running = status === "running";

  function handleRingClick() {
    const timer = useTimerStore.getState();
    if (timer.status === "running") {
      timer.pause(Date.now());
    } else {
      timer.start(focusDurationMs(settings), Date.now());
    }
  }

  return (
    <div className="ios-card flex w-full max-w-sm flex-col items-center px-6 py-10">
      <ProgressRing progress={progress} onClick={handleRingClick} running={running}>
        <TimeDisplay remainingMs={shownMs} />
      </ProgressRing>
    </div>
  );
}
