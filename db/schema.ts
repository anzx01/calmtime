/**
 * Drizzle schema — 所有表定义。
 * 本地驱动: better-sqlite3；生产驱动: postgres（换 driver 不改 schema）。
 *
 * 约定：
 *  - Auth.js 四张表用 { mode: "timestamp_ms" }（Adapter 传 Date 对象）
 *  - 业务表时间戳用纯 integer（存 epoch ms number，与前端 Date.now() 统一）
 */
import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/* ─── Auth.js 必须的四张表 ───────────────────────────────── */

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ─── 业务表（时间戳全部用纯 integer，存 epoch ms） ──────── */

/** 用户的番茄钟 Settings 云端快照。 */
export const userSettings = sqliteTable("user_settings", {
  userId: text("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // JSON string of Settings
  updatedAt: integer("updatedAt")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

/** 云端任务列表（每条对应一个 Task）。 */
export const cloudTasks = sqliteTable("cloud_task", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // JSON string of Task
  updatedAt: integer("updatedAt")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  deletedAt: integer("deletedAt"), // epoch ms，null 表示未删除
});

/** 专注会话记录（不可变，追加写）。 */
export const sessionRecords = sqliteTable("session_record", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // JSON string of SessionRecord
  startedAt: integer("startedAt").notNull(),
  createdAt: integer("createdAt")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});
