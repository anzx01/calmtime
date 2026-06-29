/**
 * useCloudSync — 离线优先云同步 hook。
 *
 * 行为：
 * 1. 应用挂载后检测登录状态（GET /api/user）
 * 2. 登录时自动触发一次完整同步
 * 3. 此后每隔 5 分钟触发增量同步（online 状态下）
 * 4. 监听 online 事件，网络恢复时立即同步
 *
 * 本地始终是真相源；未登录时所有功能完全正常（渐进增强）。
 */
"use client";

import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/stores/settings.store";
import { useTasksStore } from "@/stores/tasks.store";
import { useStatsStore } from "@/stores/stats.store";
import { useSyncStore } from "@/stores/sync.store";
import { fullSync, fetchUser } from "@/lib/sync";
import type { SyncHandlers } from "@/lib/sync";

const SYNC_INTERVAL_MS = 5 * 60 * 1000;

export function useCloudSync() {
  const syncStore = useSyncStore();
  const settingsStore = useSettingsStore();
  const tasksStore = useTasksStore();
  const statsStore = useStatsStore();

  const didInit = useRef(false);

  const buildHandlers = (): SyncHandlers => ({
    getLocalSettings: () => ({
      settings: settingsStore.settings,
      updatedAt: syncStore.lastSyncedAt,
    }),
    applyCloudSettings: (settings) => settingsStore.update(settings),

    getLocalTasks: () => ({
      tasks: tasksStore.tasks,
      updatedAt: Object.fromEntries(tasksStore.tasks.map((t) => [t.id, t.createdAt])),
    }),
    mergeCloudTasks: (rows) => {
      for (const row of rows) {
        if (row.deletedAt) {
          tasksStore.removeTask(row.id);
        } else {
          const existing = tasksStore.tasks.find((t) => t.id === row.id);
          if (!existing) {
            tasksStore.addTask({
              title: row.data.title,
              note: row.data.note,
              estimatedPomodoros: row.data.estimatedPomodoros,
            });
          }
        }
      }
    },

    getUnsyncedSessions: () => {
      const ids = syncStore.unsyncedSessionIds;
      return statsStore.sessions.filter((s) => ids.has(s.id));
    },
    getLastSyncedAt: () => syncStore.lastSyncedAt,
    mergeCloudSessions: (records) => {
      const existing = new Set(statsStore.sessions.map((s) => s.id));
      for (const r of records) {
        if (!existing.has(r.id)) statsStore.addSession(r);
      }
    },
    setLastSyncedAt: (ts) => {
      syncStore.setLastSyncedAt(ts);
      syncStore.clearUnsyncedSessions();
    },
  });

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    async function init() {
      try {
        const user = await fetchUser().catch(() => null);
        syncStore.setUser(user);
        if (user) await fullSync(buildHandlers());
      } catch {
        // 未登录或网络不可用，静默忽略
      }
    }

    void init();

    const interval = setInterval(() => {
      if (navigator.onLine) void fullSync(buildHandlers());
    }, SYNC_INTERVAL_MS);

    const handleOnline = () => void fullSync(buildHandlers());
    window.addEventListener("online", handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
