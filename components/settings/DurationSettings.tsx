"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { SettingRow, sectionTitle } from "./SettingRow";

export function DurationSettings() {
  const t = useI18n();
  const durations = useSettingsStore((s) => s.settings.durations);
  const interval = useSettingsStore((s) => s.settings.longBreakInterval);
  const setDurations = useSettingsStore((s) => s.setDurations);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("timerDurations")}</h3>
      <SettingRow label={t("pomodoro")}>
        <NumberStepper
          label={t("pomodoro")}
          value={durations.pomodoro}
          min={1}
          max={120}
          onChange={(v) => setDurations({ pomodoro: v })}
        />
      </SettingRow>
      <SettingRow label={t("shortBreak")}>
        <NumberStepper
          label={t("shortBreak")}
          value={durations.shortBreak}
          min={1}
          max={60}
          onChange={(v) => setDurations({ shortBreak: v })}
        />
      </SettingRow>
      <SettingRow label={t("longBreak")}>
        <NumberStepper
          label={t("longBreak")}
          value={durations.longBreak}
          min={1}
          max={60}
          onChange={(v) => setDurations({ longBreak: v })}
        />
      </SettingRow>
      <SettingRow label={t("longBreakInterval")}>
        <NumberStepper
          label={t("longBreakInterval")}
          value={interval}
          min={1}
          max={12}
          onChange={(v) => update({ longBreakInterval: v })}
        />
      </SettingRow>
    </section>
  );
}
