import type { TimerMode } from "./timer";

/** 一段计时结束的原因。 */
export type CompletionReason = "finished" | "skipped" | "reset";

/** 一次计时会话记录（用于统计与报告）。 */
export interface SessionRecord {
  id: string;
  mode: TimerMode;
  /** 关联任务（若有）。 */
  taskId?: string;
  startedAt: number;
  endedAt: number;
  /** 计划时长（ms）。 */
  plannedMs: number;
  /** 实际专注时长（ms）。 */
  actualMs: number;
  reason: CompletionReason;
}
