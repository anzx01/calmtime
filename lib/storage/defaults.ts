import type { Settings } from "@/types";
import { DEFAULT_THEME_COLORS } from "@/lib/theme/palette";
import { SCHEMA_VERSION } from "./keys";

export const DEFAULT_SETTINGS: Settings = {
  durations: { pomodoro: 25, shortBreak: 5, longBreak: 15 },
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  sound: {
    alarmSound: "bell",
    alarmVolume: 0.6,
    alarmRepeat: 2,
    tickingSound: "none",
    tickingVolume: 0.4,
    ambientSound: "none",
    ambientVolume: 0.3,
  },
  theme: {
    pomodoroColor: DEFAULT_THEME_COLORS.pomodoro,
    shortBreakColor: DEFAULT_THEME_COLORS.shortBreak,
    longBreakColor: DEFAULT_THEME_COLORS.longBreak,
    colorScheme: "system",
    wallpaper: null,
  },
  notifications: false,
  schemaVersion: SCHEMA_VERSION,
};
