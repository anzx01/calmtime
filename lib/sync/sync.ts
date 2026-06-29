/**
 * 离线优先同步编排器。
 * 策略：本地为真相源，登录后触发一次完整同步；之后每次产生写操作时触发增量推送。
 *
 * 合并规则（last-write-wins per entity）：
 *  - Settings：updatedAt 较新的一方胜出
 *  - Tasks：逐条按 updatedAt 合并，服务端软删除优先
 *  - Sessions：追加写，客户端不覆盖服务端已有记录
 */
import {
  fetchUser,
  pullSettings,
  pushSettings,
  pullTasks,
  pushTasks,
  pullSessions,
  pushSessions,
  SyncError,
} from "./client";
import type { Settings, Task, SessionRecord } from "@/types";
import { clientLogger } from "@/lib/logger/client";

export interface SyncHandlers {
  /** 读取本地设置和其 updatedAt 时间戳 */
  getLocalSettings: () => { settings: Settings; updatedAt: number };
  /** 将云端设置覆写到本地 */
  applyCloudSettings: (settings: Settings) => void;

  /** 读取所有本地任务，及各任务的 updatedAt */
  getLocalTasks: () => { tasks: Task[]; updatedAt: Record<string, number> };
  /** 将云端任务合并到本地（upsert + 软删除处理） */
  mergeCloudTasks: (
    rows: { id: string; data: Task; updatedAt: number; deletedAt: number | null }[],
  ) => void;

  /** 读取尚未同步的本地会话记录 */
  getUnsyncedSessions: () => SessionRecord[];
  /** 读取最近一次同步时间（毫秒时间戳），用于增量拉取 */
  getLastSyncedAt: () => number;
  /** 读取云端会话，合并到本地统计 */
  mergeCloudSessions: (records: SessionRecord[]) => void;
  /** 更新最近同步时间 */
  setLastSyncedAt: (ts: number) => void;
}

let _syncing = false;

export async function fullSync(handlers: SyncHandlers): Promise<boolean> {
  if (_syncing) return false;
  _syncing = true;

  try {
    // 验证登录
    const user = await fetchUser().catch(() => null);
    if (!user) return false;

    const now = Date.now();
    const since = handlers.getLastSyncedAt();

    // ── Settings ──
    const { settings: localSettings, updatedAt: localSettingsAt } = handlers.getLocalSettings();

    const cloudSettingsResult = await pullSettings();

    if (cloudSettingsResult && cloudSettingsResult.updatedAt > localSettingsAt) {
      handlers.applyCloudSettings(cloudSettingsResult.data);
    } else {
      const pushResult = await pushSettings(localSettings, localSettingsAt);
      if (!pushResult.merged && pushResult.server) {
        // 服务端更新
        handlers.applyCloudSettings(pushResult.server.data);
      }
    }

    // ── Tasks ──
    const cloudTaskRows = await pullTasks(since);
    if (cloudTaskRows.length > 0) {
      handlers.mergeCloudTasks(cloudTaskRows);
    }

    const { tasks: localTasks, updatedAt: taskUpdatedAts } = handlers.getLocalTasks();
    if (localTasks.length > 0) {
      await pushTasks(localTasks, taskUpdatedAts);
    }

    // ── Sessions ──
    const unsyncedSessions = handlers.getUnsyncedSessions();
    if (unsyncedSessions.length > 0) {
      await pushSessions(unsyncedSessions);
    }

    const cloudSessions = await pullSessions(since);
    if (cloudSessions.length > 0) {
      handlers.mergeCloudSessions(cloudSessions);
    }

    handlers.setLastSyncedAt(now);
    clientLogger.info("[sync] full sync completed", { now });
    return true;
  } catch (e) {
    if (e instanceof SyncError && e.status === 401) {
      clientLogger.info("[sync] not authenticated, skipping");
    } else {
      clientLogger.warn("[sync] sync error", e);
    }
    return false;
  } finally {
    _syncing = false;
  }
}
