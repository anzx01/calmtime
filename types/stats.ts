/** 报告时间范围。 */
export type ReportRange = "day" | "week" | "month";

/** 单日聚合统计。date 为本地时区 YYYY-MM-DD。 */
export interface DailyStat {
  date: string;
  pomodoros: number;
  focusMs: number;
}

/** 用于图表渲染的一个数据点（柱/线）。 */
export interface ChartPoint {
  /** X 轴标签（如 "Mon"、"06-29"、"Week 26"）。 */
  label: string;
  pomodoros: number;
  /** 专注分钟数。 */
  focusMinutes: number;
}

/** 报告汇总指标。 */
export interface StatsSummary {
  totalPomodoros: number;
  totalFocusMinutes: number;
  /** 当前连续达标天数。 */
  streakDays: number;
  /** 范围内日均番茄数。 */
  dailyAverage: number;
}
