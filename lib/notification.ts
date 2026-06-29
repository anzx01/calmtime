/**
 * 桌面通知工具函数。
 * 权限请求需要用户手势，首次开启设置时请求一次即可。
 */

export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";

export function isSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function currentPermission(): NotificationPermissionState {
  if (!isSupported()) return "unsupported";
  return Notification.permission;
}

/** 请求权限（需要用户手势触发，返回最终状态）。 */
export async function requestPermission(): Promise<NotificationPermissionState> {
  if (!isSupported()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  const result = await Notification.requestPermission();
  return result;
}

/** 发送一条桌面通知（仅当已授权时）。 */
export function notify(title: string, body?: string): void {
  if (!isSupported() || Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      silent: true, // 提醒音已由 Web Audio 播放，不叠加系统音
    });
    // 5 秒后自动关闭
    setTimeout(() => n.close(), 5000);
  } catch {
    // 某些浏览器/OS 不允许在 SW 外创建通知，静默忽略
  }
}
