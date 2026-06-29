import type { TimerMode } from "./timer";

/** 各模式时长（分钟）。key 与 TimerMode 一致。 */
export type ModeDurations = Record<TimerMode, number>;

/** 内置提醒/滴答声标识。 */
export type SoundId = "bell" | "digital" | "kitchen" | "bird" | "wood" | "none";

/** 环境音标识。none = 关闭。 */
export type AmbientSoundId = "rain" | "ocean" | "forest" | "none";

/** 主题配色方案。 */
export type ColorScheme = "system" | "light" | "dark";

export interface SoundConfig {
  alarmSound: SoundId;
  /** 0..1 */
  alarmVolume: number;
  /** 提醒音重复次数（1..n）。 */
  alarmRepeat: number;
  tickingSound: SoundId;
  /** 0..1 */
  tickingVolume: number;
  ambientSound: AmbientSoundId;
  /** 0..1 */
  ambientVolume: number;
}

export interface ThemeConfig {
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  colorScheme: ColorScheme;
  /** 壁纸文件名（如 "lake.gif"），null = 渐变模式。仅在休息模式下显示。 */
  wallpaper: string | null;
}

/** 全量用户设置，持久化于 localStorage。 */
export interface Settings {
  durations: ModeDurations;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  /** 每 N 个番茄后进入长休息。 */
  longBreakInterval: number;
  sound: SoundConfig;
  theme: ThemeConfig;
  /** 是否启用桌面通知（Phase 2）。 */
  notifications: boolean;
  /** schema 版本，用于迁移。 */
  schemaVersion: number;
}
