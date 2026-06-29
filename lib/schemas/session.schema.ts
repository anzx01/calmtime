import { z } from "zod";

export const sessionRecordSchema = z.object({
  id: z.string().min(1),
  mode: z.enum(["pomodoro", "shortBreak", "longBreak"]),
  taskId: z.string().optional(),
  startedAt: z.number(),
  endedAt: z.number(),
  plannedMs: z.number().nonnegative(),
  actualMs: z.number().nonnegative(),
  reason: z.enum(["finished", "skipped", "reset"]),
});

export const sessionsSchema = z.array(sessionRecordSchema);
