import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "expected #rrggbb");

export const soundIdSchema = z.enum(["bell", "digital", "kitchen", "bird", "wood", "none"]);

export const ambientSoundIdSchema = z.enum(["rain", "ocean", "forest", "none"]);

export const durationsSchema = z.object({
  pomodoro: z.number().int().min(1).max(180),
  shortBreak: z.number().int().min(1).max(180),
  longBreak: z.number().int().min(1).max(180),
});

export const soundConfigSchema = z.object({
  alarmSound: soundIdSchema,
  alarmVolume: z.number().min(0).max(1),
  alarmRepeat: z.number().int().min(1).max(10),
  tickingSound: soundIdSchema,
  tickingVolume: z.number().min(0).max(1),
  ambientSound: ambientSoundIdSchema,
  ambientVolume: z.number().min(0).max(1),
});

export const themeConfigSchema = z.object({
  pomodoroColor: hexColor,
  shortBreakColor: hexColor,
  longBreakColor: hexColor,
  colorScheme: z.enum(["system", "light", "dark"]),
  wallpaper: z.string().nullable(),
});

export const settingsSchema = z.object({
  durations: durationsSchema,
  autoStartBreaks: z.boolean(),
  autoStartPomodoros: z.boolean(),
  longBreakInterval: z.number().int().min(1).max(12),
  sound: soundConfigSchema,
  theme: themeConfigSchema,
  notifications: z.boolean(),
  schemaVersion: z.number().int().nonnegative(),
});
