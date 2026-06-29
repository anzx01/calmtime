"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { SettingRow, sectionTitle } from "./SettingRow";
import type { ColorScheme } from "@/types";

const swatch = "h-8 w-12 cursor-pointer rounded border border-white/20 bg-transparent";
const schemeBtn = (active: boolean) =>
  `px-3 py-1 text-xs rounded-lg border transition-colors ${
    active
      ? "bg-white/25 border-white/40 text-white"
      : "bg-white/5 border-white/15 text-white/60 hover:bg-white/15"
  }`;

const SCHEME_KEYS = [
  { value: "system" as ColorScheme, key: "colorSchemeAuto" as const },
  { value: "light" as ColorScheme, key: "colorSchemeLight" as const },
  { value: "dark" as ColorScheme, key: "colorSchemeDark" as const },
];

export function ThemeSettings() {
  const t = useI18n();
  const theme = useSettingsStore((s) => s.settings.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("theme")}</h3>
      <SettingRow label={t("colorScheme")}>
        <div className="flex gap-1.5">
          {SCHEME_KEYS.map(({ value, key }) => (
            <button
              key={value}
              className={schemeBtn(theme.colorScheme === value)}
              onClick={() => setTheme({ colorScheme: value })}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </SettingRow>
      <h3 className={`${sectionTitle} mt-3`}>{t("modeColors")}</h3>
      <SettingRow label={t("pomodoro")}>
        <input
          type="color"
          aria-label={t("pomodoro")}
          value={theme.pomodoroColor}
          onChange={(e) => setTheme({ pomodoroColor: e.target.value })}
          className={swatch}
        />
      </SettingRow>
      <SettingRow label={t("shortBreak")}>
        <input
          type="color"
          aria-label={t("shortBreak")}
          value={theme.shortBreakColor}
          onChange={(e) => setTheme({ shortBreakColor: e.target.value })}
          className={swatch}
        />
      </SettingRow>
      <SettingRow label={t("longBreak")}>
        <input
          type="color"
          aria-label={t("longBreak")}
          value={theme.longBreakColor}
          onChange={(e) => setTheme({ longBreakColor: e.target.value })}
          className={swatch}
        />
      </SettingRow>
    </section>
  );
}
