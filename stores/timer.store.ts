import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimerMode, TimerState } from "@/types";
import type { ModeAdvance } from "@/lib/timer/schedule";
import { minutesToMs } from "@/lib/utils/time";
import { DEFAULT_SETTINGS } from "@/lib/storage/defaults";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { jsonStorage, validated } from "@/lib/storage/persist";
import { timerStateSchema } from "@/lib/schemas";

interface TimerStore extends TimerState {
  /** 从 idle 或 paused 开始计时。 */
  start: (durationMs: number, now: number) => void;
  pause: (now: number) => void;
  /** 重置当前模式为满时长（idle）。 */
  reset: (durationMs: number) => void;
  /** 用户手动切换模式（idle，满时长）。 */
  selectMode: (mode: TimerMode, durationMs: number) => void;
  /** 仅当 idle 时同步剩余时长（设置改时长后调用）。 */
  setIdleRemaining: (durationMs: number) => void;
  /** 一段计时完成，应用模式流转（可能自动开始下一段）。 */
  complete: (advance: ModeAdvance, nextDurationMs: number, now: number) => void;
  /** 跳过当前段到下一模式（idle，不计入完成）。 */
  skip: (nextMode: TimerMode, nextDurationMs: number) => void;
}

const INITIAL: TimerState = {
  mode: "pomodoro",
  status: "idle",
  endsAt: null,
  startedAt: null,
  remainingMs: minutesToMs(DEFAULT_SETTINGS.durations.pomodoro),
  completedInCycle: 0,
  totalCompleted: 0,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      ...INITIAL,
      start: (durationMs, now) =>
        set((s) => {
          const remaining = s.status === "paused" ? s.remainingMs : durationMs;
          return {
            status: "running",
            endsAt: now + remaining,
            startedAt: s.startedAt ?? now,
            remainingMs: remaining,
          };
        }),
      pause: (now) =>
        set((s) =>
          s.status === "running" && s.endsAt !== null
            ? { status: "paused", remainingMs: Math.max(0, s.endsAt - now), endsAt: null }
            : {},
        ),
      reset: (durationMs) =>
        set({ status: "idle", endsAt: null, startedAt: null, remainingMs: durationMs }),
      selectMode: (mode, durationMs) =>
        set({
          mode,
          status: "idle",
          endsAt: null,
          startedAt: null,
          remainingMs: durationMs,
        }),
      setIdleRemaining: (durationMs) =>
        set((s) => (s.status === "idle" ? { remainingMs: durationMs } : {})),
      complete: (advance, nextDurationMs, now) =>
        set((s) => ({
          mode: advance.nextMode,
          completedInCycle: advance.completedInCycle,
          totalCompleted: s.mode === "pomodoro" ? s.totalCompleted + 1 : s.totalCompleted,
          status: advance.autoStart ? "running" : "idle",
          startedAt: advance.autoStart ? now : null,
          endsAt: advance.autoStart ? now + nextDurationMs : null,
          remainingMs: nextDurationMs,
        })),
      skip: (nextMode, nextDurationMs) =>
        set({
          mode: nextMode,
          status: "idle",
          endsAt: null,
          startedAt: null,
          remainingMs: nextDurationMs,
        }),
    }),
    {
      name: STORAGE_KEYS.timer,
      storage: jsonStorage,
      partialize: (s) => ({
        mode: s.mode,
        status: s.status,
        endsAt: s.endsAt,
        startedAt: s.startedAt,
        remainingMs: s.remainingMs,
        completedInCycle: s.completedInCycle,
        totalCompleted: s.totalCompleted,
      }),
      merge: (persisted, current) => {
        const parsed = validated(timerStateSchema, persisted, INITIAL, "timer");
        return { ...current, ...parsed };
      },
    },
  ),
);
