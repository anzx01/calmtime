/**
 * 数据库迁移入口（由 scripts/migrate.sh 调用）。
 * 使用 drizzle-kit push 更简单，此文件仅备用。
 */
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "./client";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, "migrations");

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder });
  console.log("[migrate] done");
}

main().catch((err) => {
  console.error("[migrate] failed", err);
  process.exit(1);
});
