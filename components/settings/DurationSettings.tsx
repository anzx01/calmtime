"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { SettingRow, sectionTitle } from "./SettingRow";

export function DurationSettings() {
  const t = useI18n();
  const focusDuration = useSettingsStore((s) => s.settings.focusDuration);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("focusDuration")}</h3>
      <SettingRow label={t("focusDuration")}>
        <NumberStepper
          label={t("focusDuration")}
          value={focusDuration}
          min={1}
          max={120}
          onChange={(v) => update({ focusDuration: v })}
        />
      </SettingRow>
    </section>
  );
}
