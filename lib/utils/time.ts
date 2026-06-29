import type { TimerMode } from "@/types";

export const MINUTE_MS = 60_000;

export function minutesToMs(minutes: number): number {
  return Math.round(minutes * MINUTE_MS);
}

export function msToMinutes(ms: number): number {
  return ms / MINUTE_MS;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** TimerMode -> DOM/CSS 用的 slug。 */
const MODE_SLUG: Record<TimerMode, string> = {
  pomodoro: "pomodoro",
  shortBreak: "short-break",
  longBreak: "long-break",
};

export function modeToSlug(mode: TimerMode): string {
  return MODE_SLUG[mode];
}

/** 本地时区的 YYYY-MM-DD（用于按天聚合统计）。 */
export function localDateKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 当天 00:00 的时间戳。 */
export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** 周一作为一周起点的偏移天数。 */
export function mondayIndex(ts: number): number {
  const day = new Date(ts).getDay(); // 0=Sun
  return (day + 6) % 7;
}
