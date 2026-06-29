"use client";
import { useEffect, useRef, useState } from "react";
import type { SessionRecord } from "@/types";
import { useSettingsStore, useStatsStore, useTasksStore, useTimerStore } from "@/stores";
import { isExpiredAt, remainingMsAt } from "@/lib/timer/engine";
import { advanceAfterComplete, durationMsForMode } from "@/lib/timer/schedule";
import { playAlarm } from "@/lib/audio/alarm";
import { notify } from "@/lib/notification";
import { createId } from "@/lib/utils/id";

export interface TimerLoopValue {
  remainingMs: number;
  totalMs: number;
}

/** 一段计时自然完成时的编排：记录会话、累加任务番茄、流转模式、响铃。 */
function handleComplete(now: number): void {
  const timer = useTimerStore.getState();
  const settings = useSettingsStore.getState().settings;
  const tasks = useTasksStore.getState();
  const stats = useStatsStore.getState();

  const finishedMode = timer.mode;
  const plannedMs = durationMsForMode(settings, finishedMode);
  const startedAt = timer.startedAt ?? now - plannedMs;
  const advance = advanceAfterComplete(finishedMode, timer.completedInCycle, settings);
  const nextDurationMs = durationMsForMode(settings, advance.nextMode);

  const record: SessionRecord = {
    id: createId(),
    mode: finishedMode,
    taskId: tasks.activeTaskId ?? undefined,
    startedAt,
    endedAt: now,
    plannedMs,
    actualMs: plannedMs,
    reason: "finished",
  };
  stats.addSession(record);
  if (finishedMode === "pomodoro") tasks.incrementActive();

  timer.complete(advance, nextDurationMs, now);
  playAlarm(settings.sound.alarmSound, settings.sound.alarmVolume, settings.sound.alarmRepeat);

  if (settings.notifications) {
    const modeLabel =
      finishedMode === "pomodoro"
        ? "Pomodoro"
        : finishedMode === "shortBreak"
          ? "Short Break"
          : "Long Break";
    const nextLabel =
      advance.nextMode === "pomodoro"
        ? "Pomodoro"
        : advance.nextMode === "shortBreak"
          ? "Short Break"
          : "Long Break";
    notify(`${modeLabel} complete!`, `Time for ${nextLabel}.`);
  }
}

/** 计时主循环：返回随时间刷新的剩余/总时长。 */
export function useTimerLoop(): TimerLoopValue {
  const [remainingMs, setRemainingMs] = useState(0);
  const completing = useRef(false);

  const durations = useSettingsStore((s) => s.settings.durations);
  const mode = useTimerStore((s) => s.mode);
  const status = useTimerStore((s) => s.status);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (isExpiredAt(useTimerStore.getState(), now) && !completing.current) {
        completing.current = true;
        handleComplete(now);
        completing.current = false;
      }
      setRemainingMs(remainingMsAt(useTimerStore.getState(), now));
    };

    tick();
    const id = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, []);

  // 设置改时长 / 切模式后，idle 状态下同步剩余与显示
  useEffect(() => {
    const settings = useSettingsStore.getState().settings;
    const st = useTimerStore.getState();
    if (st.status === "idle") {
      st.setIdleRemaining(durationMsForMode(settings, st.mode));
    }
    setRemainingMs(remainingMsAt(useTimerStore.getState(), Date.now()));
  }, [durations, mode, status]);

  const settings = useSettingsStore((s) => s.settings);
  return { remainingMs, totalMs: durationMsForMode(settings, mode) };
}
