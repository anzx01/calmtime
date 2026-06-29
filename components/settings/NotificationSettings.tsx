"use client";
import { useSettingsStore } from "@/stores/settings.store";
import { useI18n } from "@/hooks/useI18n";
import { requestPermission, isSupported } from "@/lib/notification";
import { SettingRow, sectionTitle } from "./SettingRow";
import { Toggle } from "@/components/ui/Toggle";

export function NotificationSettings() {
  const t = useI18n();
  const enabled = useSettingsStore((s) => s.settings.notifications);
  const update = useSettingsStore((s) => s.update);

  async function handleToggle(on: boolean) {
    if (on) {
      const perm = await requestPermission();
      if (perm !== "granted") return;
    }
    update({ notifications: on });
  }

  if (!isSupported()) return null;

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("notifications")}</h3>
      <SettingRow label={t("desktopNotifications")} hint={t("desktopNotificationsHint")}>
        <Toggle checked={enabled} onChange={handleToggle} label={t("desktopNotifications")} />
      </SettingRow>
    </section>
  );
}
