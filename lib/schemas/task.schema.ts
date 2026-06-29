import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  note: z.string().optional(),
  estimatedPomodoros: z.number().int().min(0).max(99),
  completedPomodoros: z.number().int().min(0),
  done: z.boolean(),
  createdAt: z.number(),
  order: z.number(),
});

export const taskDraftSchema = z.object({
  title: z.string(),
  note: z.string().optional(),
  estimatedPomodoros: z.number().int().min(0).max(99),
});

export const taskTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  items: z.array(taskDraftSchema),
});

export const tasksSchema = z.array(taskSchema);
export const taskTemplatesSchema = z.array(taskTemplateSchema);
