/** 内置提醒声标识。 */
export type SoundId = "bell" | "digital" | "kitchen" | "bird" | "wood" | "none";

/** 主题配色方案。 */
export type ColorScheme = "system" | "light" | "dark";

export interface SoundConfig {
  alarmSound: SoundId;
  /** 0..1 */
  alarmVolume: number;
  /** 提醒音重复次数（1..n）。 */
  alarmRepeat: number;
}

export interface ThemeConfig {
  pomodoroColor: string;
  colorScheme: ColorScheme;
}

/** 全量用户设置，持久化于 localStorage。 */
export interface Settings {
  /** 专注时长（分钟）。 */
  focusDuration: number;
  sound: SoundConfig;
  theme: ThemeConfig;
  /** 是否启用桌面通知。 */
  notifications: boolean;
  /** schema 版本，用于迁移。 */
  schemaVersion: number;
}
