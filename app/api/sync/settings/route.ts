/**
 * GET  /api/sync/settings  — 拉取云端设置（返回 {data, updatedAt}）
 * PUT  /api/sync/settings  — 推送本地设置（body: {data: Settings, updatedAt: number}）
 *
 * 合并策略：updatedAt 较新的一方胜出（last-write-wins per entity）。
 */
import { auth } from "@/auth";
import { getDb, userSettings } from "@/db";
import { eq } from "drizzle-orm";
import { ok, err, unauthorized } from "@/lib/api/response";
import { settingsSchema } from "@/lib/schemas";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const db = getDb();
  const rows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (rows.length === 0) return ok(null);
  return ok({ data: JSON.parse(rows[0].data), updatedAt: rows[0].updatedAt });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON");

  const parsed = settingsSchema.safeParse(body.data);
  if (!parsed.success) return err("Invalid settings payload");

  const clientUpdatedAt: number = typeof body.updatedAt === "number" ? body.updatedAt : Date.now();

  const db = getDb();
  const userId = session.user.id;

  // 检查服务端版本是否更新
  const rows = await db
    .select({ updatedAt: userSettings.updatedAt })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  const serverUpdatedAt = rows[0]?.updatedAt ?? 0;

  // 服务端更新，返回服务端版本让客户端合并
  if (serverUpdatedAt > clientUpdatedAt) {
    const serverRows = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);
    return ok({
      merged: false,
      server: { data: JSON.parse(serverRows[0].data), updatedAt: serverUpdatedAt },
    });
  }

  // 客户端更新，保存
  const now = Date.now();
  await db
    .insert(userSettings)
    .values({ userId, data: JSON.stringify(parsed.data), updatedAt: now })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { data: JSON.stringify(parsed.data), updatedAt: now },
    });

  return ok({ merged: true, updatedAt: now });
}
