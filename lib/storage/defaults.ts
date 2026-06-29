import type { Settings } from "@/types";
import { DEFAULT_THEME_COLORS } from "@/lib/theme/palette";
import { SCHEMA_VERSION } from "./keys";

export const DEFAULT_FOCUS_DURATION = 25;

export const DEFAULT_SETTINGS: Settings = {
  focusDuration: DEFAULT_FOCUS_DURATION,
  sound: {
    alarmSound: "bell",
    alarmVolume: 0.6,
    alarmRepeat: 2,
  },
  theme: {
    pomodoroColor: DEFAULT_THEME_COLORS.pomodoro,
    colorScheme: "system",
  },
  notifications: false,
  schemaVersion: SCHEMA_VERSION,
};
