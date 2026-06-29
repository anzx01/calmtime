"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DurationSettings } from "./DurationSettings";
import { NotificationSettings } from "./NotificationSettings";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useI18n();
  const reset = useSettingsStore((s) => s.reset);

  return (
    <Modal open={open} onClose={onClose} title={t("settings")}>
      <div className="flex flex-col divide-y divide-white/10 [&>section]:py-4 [&>section:first-child]:pt-0">
        <DurationSettings />
        <NotificationSettings />
      </div>
      <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
        <Button variant="ghost" onClick={reset}>
          {t("resetDefaults")}
        </Button>
        <Button variant="solid" onClick={onClose}>
          {t("done")}
        </Button>
      </div>
    </Modal>
  );
}
