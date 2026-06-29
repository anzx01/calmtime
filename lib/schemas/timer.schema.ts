import { z } from "zod";

/** 用于"刷新后继续计时"的持久化片段校验。 */
export const timerStateSchema = z.object({
  mode: z.enum(["pomodoro", "shortBreak", "longBreak"]),
  status: z.enum(["idle", "running", "paused", "completed"]),
  endsAt: z.number().nullable(),
  startedAt: z.number().nullable(),
  remainingMs: z.number().nonnegative(),
  completedInCycle: z.number().int().nonnegative(),
  totalCompleted: z.number().int().nonnegative(),
});
