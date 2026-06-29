/**
 * GET  /api/sync/tasks           — 拉取云端任务（含软删除，客户端按 deletedAt 过滤）
 * POST /api/sync/tasks           — 批量 upsert 任务（增量推送，按 id + updatedAt 合并）
 * DELETE /api/sync/tasks?id=xxx  — 软删除单条任务
 */
import { auth } from "@/auth";
import { getDb, cloudTasks } from "@/db";
import { and, eq, gt, isNull } from "drizzle-orm";
import { ok, err, unauthorized } from "@/lib/api/response";
import { tasksSchema } from "@/lib/schemas";
import type { Task } from "@/types";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { searchParams } = new URL(req.url);
  const since = Number(searchParams.get("since") ?? "0");

  const db = getDb();
  const rows = await db
    .select()
    .from(cloudTasks)
    .where(
      and(
        eq(cloudTasks.userId, session.user.id),
        since > 0 ? gt(cloudTasks.updatedAt, since) : undefined,
      ),
    );

  return ok(
    rows.map((r) => ({
      id: r.id,
      data: JSON.parse(r.data) as Task,
      updatedAt: r.updatedAt,
      deletedAt: r.deletedAt,
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON");

  const parsed = tasksSchema.safeParse(body.tasks);
  if (!parsed.success) return err("Invalid tasks payload");

  const db = getDb();
  const userId = session.user.id;
  const now = Date.now();

  const upserted: string[] = [];

  for (const task of parsed.data) {
    const clientUpdatedAt: number =
      typeof body.updatedAt?.[task.id] === "number" ? body.updatedAt[task.id] : now;

    // 检查服务端版本
    const existing = await db
      .select({ updatedAt: cloudTasks.updatedAt })
      .from(cloudTasks)
      .where(and(eq(cloudTasks.userId, userId), eq(cloudTasks.id, task.id)))
      .limit(1);

    if (existing.length > 0 && existing[0].updatedAt > clientUpdatedAt) {
      // 服务端更新，跳过本条（由 GET 拉取最新）
      continue;
    }

    await db
      .insert(cloudTasks)
      .values({
        id: task.id,
        userId,
        data: JSON.stringify(task),
        updatedAt: now,
        deletedAt: null,
      })
      .onConflictDoUpdate({
        target: cloudTasks.id,
        set: { data: JSON.stringify(task), updatedAt: now, deletedAt: null },
      });

    upserted.push(task.id);
  }

  return ok({ upserted, total: parsed.data.length });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return err("Missing id");

  const db = getDb();
  const now = Date.now();

  await db
    .update(cloudTasks)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(cloudTasks.userId, session.user.id),
        eq(cloudTasks.id, id),
        isNull(cloudTasks.deletedAt),
      ),
    );

  return ok({ id, deletedAt: now });
}
