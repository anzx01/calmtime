import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModeDurations, Settings, SoundConfig, ThemeConfig } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/storage/defaults";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { jsonStorage, validated } from "@/lib/storage/persist";
import { settingsSchema } from "@/lib/schemas";

interface SettingsStore {
  settings: Settings;
  update: (partial: Partial<Settings>) => void;
  setDurations: (partial: Partial<ModeDurations>) => void;
  setSound: (partial: Partial<SoundConfig>) => void;
  setTheme: (partial: Partial<ThemeConfig>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      update: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
      setDurations: (partial) =>
        set((s) => ({
          settings: { ...s.settings, durations: { ...s.settings.durations, ...partial } },
        })),
      setSound: (partial) =>
        set((s) => ({
          settings: { ...s.settings, sound: { ...s.settings.sound, ...partial } },
        })),
      setTheme: (partial) =>
        set((s) => ({
          settings: { ...s.settings, theme: { ...s.settings.theme, ...partial } },
        })),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: jsonStorage,
      partialize: (s) => ({ settings: s.settings }),
      merge: (persisted, current) => {
        const raw = (persisted as { settings?: unknown } | undefined)?.settings;
        return {
          ...current,
          settings: validated(settingsSchema, raw, current.settings, "settings"),
        };
      },
    },
  ),
);
