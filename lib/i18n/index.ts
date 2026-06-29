/**
 * i18n 骨架：纯常量字典，无外部依赖。
 * 语言通过 Zustand store 持久化，切换无需刷新。
 *
 * 使用方式：
 *   const t = useI18n();
 *   <button>{t("start")}</button>
 */
import { en } from "./en";
import { zh } from "./zh";
import type { I18nKeys } from "./en";

export type Locale = "en" | "zh";

export const locales: Record<Locale, Record<I18nKeys, string>> = { en, zh };

export function t(locale: Locale, key: I18nKeys): string {
  return locales[locale][key] ?? locales.en[key];
}

export type { I18nKeys };
