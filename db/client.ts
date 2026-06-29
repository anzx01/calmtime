/**
 * Drizzle DB 客户端单例。
 * 使用 @libsql/client（纯 JS，跨平台，无需编译 native 模块）。
 * 本地：SQLite 文件（file:./data/calmtime.db）
 * 生产 Turso：设置 DATABASE_URL=libsql://... + DATABASE_AUTH_TOKEN=...
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function getUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && !url.startsWith("file:")) return url;
  return "file:./data/calmtime.db";
}

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    const client = createClient({
      url: getUrl(),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export type Db = ReturnType<typeof getDb>;
