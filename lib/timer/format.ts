import { clamp } from "@/lib/utils/time";

/** 剩余毫秒 -> "MM:SS"（向上取整秒，避免提前归零）。 */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** 标签页标题文案。 */
export function formatTitle(ms: number, modeLabel: string): string {
  return `${formatClock(ms)} · ${modeLabel}`;
}

/** 已过去比例 0..1（用于进度环）。 */
export function progressRatio(remainingMs: number, totalMs: number): number {
  if (totalMs <= 0) return 0;
  return clamp(1 - remainingMs / totalMs, 0, 1);
}
