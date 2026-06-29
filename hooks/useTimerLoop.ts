"use client";
import { useEffect, useRef, useState } from "react";
import { useSettingsStore, useTimerStore } from "@/stores";
import { isExpiredAt, remainingMsAt } from "@/lib/timer/engine";
import { focusDurationMs } from "@/lib/timer/schedule";
import { playAlarm } from "@/lib/audio/alarm";
import { notify } from "@/lib/notification";

export interface TimerLoopValue {
  remainingMs: number;
  totalMs: number;
}

function handleComplete(): void {
  const timer = useTimerStore.getState();
  const settings = useSettingsStore.getState().settings;

  timer.complete(focusDurationMs(settings));
  playAlarm(settings.sound.alarmSound, settings.sound.alarmVolume, settings.sound.alarmRepeat);

  if (settings.notifications) {
    notify("Focus complete!", "Great work. Take a break.");
  }
}

export function useTimerLoop(): TimerLoopValue {
  const [remainingMs, setRemainingMs] = useState(0);
  const completing = useRef(false);

  const focusDuration = useSettingsStore((s) => s.settings.focusDuration);
  const status = useTimerStore((s) => s.status);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (isExpiredAt(useTimerStore.getState(), now) && !completing.current) {
        completing.current = true;
        handleComplete();
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

  useEffect(() => {
    const settings = useSettingsStore.getState().settings;
    const st = useTimerStore.getState();
    if (st.status === "idle") {
      st.setIdleRemaining(focusDurationMs(settings));
    }
    setRemainingMs(remainingMsAt(useTimerStore.getState(), Date.now()));
  }, [focusDuration, status]);

  const settings = useSettingsStore((s) => s.settings);
  return { remainingMs, totalMs: focusDurationMs(settings) };
}
