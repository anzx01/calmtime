/**
 * 扩展 Auth.js Session 类型，将数据库 user.id 透传到客户端 session。
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
