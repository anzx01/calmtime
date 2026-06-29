/**
 * GET /api/user — 返回当前登录用户信息（用于客户端判断登录状态）
 */
import { auth } from "@/auth";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  return ok({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  });
}
