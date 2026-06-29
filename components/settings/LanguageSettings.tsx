"use client";
import { useI18nStore } from "@/stores/i18n.store";
import { useI18n } from "@/hooks/useI18n";
import { SettingRow, sectionTitle } from "./SettingRow";
import type { Locale } from "@/lib/i18n";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

const btn = (active: boolean) =>
  `px-3 py-1 text-xs rounded-lg border transition-colors ${
    active
      ? "bg-white/25 border-white/40 text-white"
      : "bg-white/5 border-white/15 text-white/60 hover:bg-white/15"
  }`;

export function LanguageSettings() {
  const t = useI18n();
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("language")}</h3>
      <SettingRow label={t("displayLanguage")}>
        <div className="flex gap-1.5">
          {LOCALES.map(({ value, label }) => (
            <button key={value} className={btn(locale === value)} onClick={() => setLocale(value)}>
              {label}
            </button>
          ))}
        </div>
      </SettingRow>
    </section>
  );
}
