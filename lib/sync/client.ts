/**
 * 云同步 HTTP 客户端工具函数。
 * 所有请求均为 JSON，失败时抛出 SyncError（包含 status 字段）。
 */
import type { SessionRecord, Settings, Task } from "@/types";

export class SyncError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "SyncError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json().catch(() => ({ ok: false, error: "parse error" }));
  if (!json.ok) throw new SyncError(json.error ?? "Unknown error", res.status);
  return json.data as T;
}

/* ── 用户 ── */

export interface CloudUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export const fetchUser = () => request<CloudUser | null>("/api/user");

/* ── 设置 ── */

export interface SettingsPullResult {
  data: Settings;
  updatedAt: number;
}

export const pullSettings = () => request<SettingsPullResult | null>("/api/sync/settings");

export const pushSettings = (data: Settings, updatedAt: number) =>
  request<{ merged: boolean; updatedAt?: number; server?: SettingsPullResult }>(
    "/api/sync/settings",
    { method: "PUT", body: JSON.stringify({ data, updatedAt }) },
  );

/* ── 任务 ── */

export interface CloudTaskRow {
  id: string;
  data: Task;
  updatedAt: number;
  deletedAt: number | null;
}

export const pullTasks = (since = 0) => request<CloudTaskRow[]>(`/api/sync/tasks?since=${since}`);

export const pushTasks = (tasks: Task[], updatedAt: Record<string, number>) =>
  request<{ upserted: number; total: number }>("/api/sync/tasks", {
    method: "POST",
    body: JSON.stringify({ tasks, updatedAt }),
  });

export const deleteTask = (id: string) =>
  request<{ id: string; deletedAt: number }>(`/api/sync/tasks?id=${id}`, {
    method: "DELETE",
  });

/* ── 会话记录 ── */

export const pullSessions = (since = 0) =>
  request<SessionRecord[]>(`/api/sync/sessions?since=${since}`);

export const pushSessions = (records: SessionRecord[]) =>
  request<{ inserted: number }>("/api/sync/sessions", {
    method: "POST",
    body: JSON.stringify({ records }),
  });
