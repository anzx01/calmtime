import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionRecord } from "@/types";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { jsonStorage, validated } from "@/lib/storage/persist";
import { sessionsSchema } from "@/lib/schemas";

const MAX_SESSIONS = 5000;

interface StatsStore {
  sessions: SessionRecord[];
  addSession: (record: SessionRecord) => void;
  clear: () => void;
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (record) =>
        set((s) => {
          const next = [...s.sessions, record];
          return { sessions: next.length > MAX_SESSIONS ? next.slice(-MAX_SESSIONS) : next };
        }),
      clear: () => set({ sessions: [] }),
    }),
    {
      name: STORAGE_KEYS.sessions,
      storage: jsonStorage,
      partialize: (s) => ({ sessions: s.sessions }),
      merge: (persisted, current) => {
        const raw = (persisted as { sessions?: unknown } | undefined)?.sessions;
        return {
          ...current,
          sessions: validated(sessionsSchema, raw, current.sessions, "sessions"),
        };
      },
    },
  ),
);
