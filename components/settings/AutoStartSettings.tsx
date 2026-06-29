"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { Toggle } from "@/components/ui/Toggle";
import { SettingRow, sectionTitle } from "./SettingRow";

export function AutoStartSettings() {
  const t = useI18n();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("autoStart")}</h3>
      <SettingRow label={t("autoStartBreaks")}>
        <Toggle
          label={t("autoStartBreaks")}
          checked={settings.autoStartBreaks}
          onChange={(v) => update({ autoStartBreaks: v })}
        />
      </SettingRow>
      <SettingRow label={t("autoStartPomodoros")}>
        <Toggle
          label={t("autoStartPomodoros")}
          checked={settings.autoStartPomodoros}
          onChange={(v) => update({ autoStartPomodoros: v })}
        />
      </SettingRow>
    </section>
  );
}
