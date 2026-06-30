import type { Settings } from "@/types";
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
    pomodoroColor: "#ba4949",
    colorScheme: "system",
  },
  notifications: true,
  schemaVersion: SCHEMA_VERSION,
};
