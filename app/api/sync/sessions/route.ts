/**
 * GET  /api/sync/sessions?since=<ms>  — 拉取指定时间后的会话记录
 * POST /api/sync/sessions              — 批量推送会话记录（仅追加，不覆盖）
 */
import { auth } from "@/auth";
import { getDb, sessionRecords } from "@/db";
import { and, eq, gt } from "drizzle-orm";
import { ok, err, unauthorized } from "@/lib/api/response";
import type { SessionRecord } from "@/types";
import { z } from "zod";

const sessionRecordSchema = z.object({
  id: z.string(),
  mode: z.enum(["pomodoro", "shortBreak", "longBreak"]),
  taskId: z.string().optional(),
  startedAt: z.number(),
  endedAt: z.number(),
  plannedMs: z.number(),
  actualMs: z.number(),
  reason: z.enum(["finished", "skipped", "reset"]),
});

const batchSchema = z.object({
  records: z.array(sessionRecordSchema).max(200),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { searchParams } = new URL(req.url);
  const since = Number(searchParams.get("since") ?? "0");

  const db = getDb();
  const rows = await db
    .select()
    .from(sessionRecords)
    .where(
      and(
        eq(sessionRecords.userId, session.user.id),
        since > 0 ? gt(sessionRecords.startedAt, since) : undefined,
      ),
    );

  return ok(rows.map((r) => JSON.parse(r.data) as SessionRecord));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON");

  const parsed = batchSchema.safeParse(body);
  if (!parsed.success) return err("Invalid payload");

  const db = getDb();
  const userId = session.user.id;
  const now = Date.now();
  const inserted: string[] = [];

  for (const record of parsed.data.records) {
    // 会话记录不可变，只在不存在时插入
    await db
      .insert(sessionRecords)
      .values({
        id: record.id,
        userId,
        data: JSON.stringify(record),
        startedAt: record.startedAt,
        createdAt: now,
      })
      .onConflictDoNothing();
    inserted.push(record.id);
  }

  return ok({ inserted: inserted.length });
}
