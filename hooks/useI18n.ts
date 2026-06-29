"use client";
import { useHydrated } from "./useHydrated";
import { useI18nStore } from "@/stores/i18n.store";
import { locales } from "@/lib/i18n";
import type { I18nKeys } from "@/lib/i18n";

const tEn = (key: I18nKeys): string => locales.en[key] as string;

/**
 * 返回当前语言的翻译函数。
 * Hydration 完成前始终返回英文，避免 SSR/客户端 mismatch。
 */
export function useI18n(): (key: I18nKeys) => string {
  const hydrated = useHydrated();
  const t = useI18nStore((s) => s.t);
  return hydrated ? t : tEn;
}
