import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "expected #rrggbb");

export const soundIdSchema = z.enum(["bell", "digital", "kitchen", "bird", "wood", "none"]);

export const soundConfigSchema = z.object({
  alarmSound: soundIdSchema,
  alarmVolume: z.number().min(0).max(1),
  alarmRepeat: z.number().int().min(1).max(10),
});

export const themeConfigSchema = z.object({
  pomodoroColor: hexColor,
  colorScheme: z.enum(["system", "light", "dark"]),
});

export const settingsSchema = z.object({
  focusDuration: z.number().int().min(1).max(180),
  sound: soundConfigSchema,
  theme: themeConfigSchema,
  notifications: z.boolean(),
  schemaVersion: z.number().int().nonnegative(),
});
