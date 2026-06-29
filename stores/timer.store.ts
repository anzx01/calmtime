import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimerState } from "@/types";
import { minutesToMs } from "@/lib/utils/time";
import { DEFAULT_FOCUS_DURATION } from "@/lib/storage/defaults";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { jsonStorage, validated } from "@/lib/storage/persist";
import { timerStateSchema } from "@/lib/schemas";

interface TimerStore extends TimerState {
  /** 从 idle 或 paused 开始计时。 */
  start: (durationMs: number, now: number) => void;
  pause: (now: number) => void;
  /** 重置为满时长（idle）。 */
  reset: (durationMs: number) => void;
  /** 仅当 idle 时同步剩余时长（设置改时长后调用）。 */
  setIdleRemaining: (durationMs: number) => void;
  /** 一段计时完成：累计 +1，重置到 idle。 */
  complete: (durationMs: number) => void;
}

const INITIAL: TimerState = {
  status: "idle",
  endsAt: null,
  startedAt: null,
  remainingMs: minutesToMs(DEFAULT_FOCUS_DURATION),
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
      setIdleRemaining: (durationMs) =>
        set((s) => (s.status === "idle" ? { remainingMs: durationMs } : {})),
      complete: (durationMs) =>
        set((s) => ({
          status: "idle",
          endsAt: null,
          startedAt: null,
          remainingMs: durationMs,
          totalCompleted: s.totalCompleted + 1,
        })),
    }),
    {
      name: STORAGE_KEYS.timer,
      storage: jsonStorage,
      partialize: (s) => ({
        status: s.status,
        endsAt: s.endsAt,
        startedAt: s.startedAt,
        remainingMs: s.remainingMs,
        totalCompleted: s.totalCompleted,
      }),
      merge: (persisted, current) => {
        const parsed = validated(timerStateSchema, persisted, INITIAL, "timer");
        return { ...current, ...parsed };
      },
    },
  ),
);
