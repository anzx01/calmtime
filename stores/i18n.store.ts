import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jsonStorage } from "@/lib/storage/persist";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import type { I18nKeys } from "@/lib/i18n";

interface I18nStore {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** 翻译函数，减少组件中的引用层数。 */
  t: (key: I18nKeys) => string;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      t: (key) => locales[get().locale][key] ?? (locales.en[key] as string),
    }),
    {
      name: STORAGE_KEYS.i18n,
      storage: jsonStorage,
      partialize: (s) => ({ locale: s.locale }),
      merge: (persisted, current) => {
        const p = persisted as { locale?: string } | undefined;
        const locale: Locale = p?.locale === "zh" ? "zh" : "en";
        return { ...current, locale };
      },
    },
  ),
);
