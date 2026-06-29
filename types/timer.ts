/** 番茄钟三种模式（内部使用 camelCase；DOM/CSS 用 slug，见 lib/utils/time）。 */
export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

/** 计时器运行状态机。 */
export type TimerStatus = "idle" | "running" | "paused" | "completed";

/**
 * 计时器状态。防漂移核心：running 时以绝对时间戳 endsAt 为真相源，
 * 剩余时间永远 = endsAt - Date.now()，绝不累加 interval。
 */
export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  /** 绝对结束时刻（epoch ms）。running 时有效，否则为 null。 */
  endsAt: number | null;
  /** 当前这段计时的开始时刻（用于统计实际专注时长）。 */
  startedAt: number | null;
  /** 暂停/空闲时的剩余毫秒；running 时不依赖它。 */
  remainingMs: number;
  /** 本轮已完成的番茄数（决定何时进入长休息）。 */
  completedInCycle: number;
  /** 累计完成番茄数（用于显示）。 */
  totalCompleted: number;
}
