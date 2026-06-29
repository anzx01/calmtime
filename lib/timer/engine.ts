import type { TimerState } from "@/types";

/**
 * 防漂移核心：running 时剩余时间永远由绝对时间戳 endsAt 重算，
 * 而非累加 interval。锁屏/切后台回前台调用即可得到正确剩余。
 */
export function remainingMsAt(state: TimerState, now: number): number {
  if (state.status === "running" && state.endsAt !== null) {
    return Math.max(0, state.endsAt - now);
  }
  return Math.max(0, state.remainingMs);
}

/** running 且已越过 endsAt，即本段计时完成。 */
export function isExpiredAt(state: TimerState, now: number): boolean {
  return state.status === "running" && state.endsAt !== null && now >= state.endsAt;
}
