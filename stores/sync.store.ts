/**
 * 同步状态 store（不持久化）。
 * 追踪：当前登录用户、上次同步时间、同步状态、未同步会话 ID 集合。
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jsonStorage } from "@/lib/storage/persist";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { CloudUser } from "@/lib/sync";

interface SyncStore {
  /** 当前登录用户，null 表示未登录 */
  user: CloudUser | null;
  /** 上次成功同步的时间戳（毫秒），0 = 从未同步 */
  lastSyncedAt: number;
  /** 是否正在同步 */
  syncing: boolean;
  /** 已记录但未推送到云端的 session record ID 集合 */
  unsyncedSessionIds: Set<string>;

  setUser: (user: CloudUser | null) => void;
  setLastSyncedAt: (ts: number) => void;
  setSyncing: (v: boolean) => void;
  markSessionUnsynced: (id: string) => void;
  clearUnsyncedSessions: () => void;
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set) => ({
      user: null,
      lastSyncedAt: 0,
      syncing: false,
      unsyncedSessionIds: new Set(),

      setUser: (user) => set({ user }),
      setLastSyncedAt: (ts) => set({ lastSyncedAt: ts }),
      setSyncing: (v) => set({ syncing: v }),
      markSessionUnsynced: (id) =>
        set((s) => ({
          unsyncedSessionIds: new Set([...s.unsyncedSessionIds, id]),
        })),
      clearUnsyncedSessions: () => set({ unsyncedSessionIds: new Set() }),
    }),
    {
      name: STORAGE_KEYS.sync,
      storage: jsonStorage,
      partialize: (s) => ({
        lastSyncedAt: s.lastSyncedAt,
        // Set 不能直接 JSON.stringify，转数组
        unsyncedSessionIds: [...s.unsyncedSessionIds],
      }),
      merge: (persisted, current) => {
        const p = persisted as { lastSyncedAt?: number; unsyncedSessionIds?: string[] } | undefined;
        return {
          ...current,
          lastSyncedAt: typeof p?.lastSyncedAt === "number" ? p.lastSyncedAt : 0,
          unsyncedSessionIds: new Set(
            Array.isArray(p?.unsyncedSessionIds) ? p.unsyncedSessionIds : [],
          ),
        };
      },
    },
  ),
);
