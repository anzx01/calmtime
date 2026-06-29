import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./data/calmtime.db";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
