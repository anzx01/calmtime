"use client";
import { useTimerStore, useSettingsStore } from "@/stores";
import { useTimerLoop } from "@/hooks/useTimerLoop";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHydrated } from "@/hooks/useHydrated";
import { progressRatio } from "@/lib/timer/format";
import { focusDurationMs } from "@/lib/timer/schedule";
import { clamp } from "@/lib/utils/time";
import { ProgressRing } from "./ProgressRing";
import { TimeDisplay } from "./TimeDisplay";

const MIN_DURATION = 1;
const MAX_DURATION = 99;

export function TimerCard() {
  const { remainingMs, totalMs } = useTimerLoop();
  const status = useTimerStore((s) => s.status);
  const hydrated = useHydrated();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  useDocumentTitle(remainingMs, "Focus", status === "running");

  const idle = status === "idle";
  const running = status === "running";
  const shownMs = hydrated ? remainingMs : totalMs;
  const progress = hydrated ? progressRatio(remainingMs, totalMs) : 0;

  // idle 时进度环表示"已设置时长 / 最大时长"
  const idleProgress = settings.focusDuration / MAX_DURATION;

  function handleRingClick() {
    const timer = useTimerStore.getState();
    if (timer.status === "running") {
      timer.pause(Date.now());
    } else {
      timer.start(focusDurationMs(settings), Date.now());
    }
  }

  function handleDrag(ratio: number) {
    const minutes = clamp(Math.round(ratio * MAX_DURATION), MIN_DURATION, MAX_DURATION);
    updateSettings({ focusDuration: minutes });
  }

  return (
    <div className="flex flex-col items-center">
      <ProgressRing
        progress={idle && hydrated ? idleProgress : progress}
        onClick={handleRingClick}
        running={running}
        onDrag={idle ? handleDrag : undefined}
      >
        <TimeDisplay remainingMs={shownMs} />
      </ProgressRing>
    </div>
  );
}
