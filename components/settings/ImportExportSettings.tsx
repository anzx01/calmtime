"use client";

import { useRef } from "react";
import { useSettingsStore } from "@/stores/settings.store";
import { useI18n } from "@/hooks/useI18n";
import { settingsSchema } from "@/lib/schemas";
import { sectionTitle } from "./SettingRow";
import { Button } from "@/components/ui/Button";

export function ImportExportSettings() {
  const t = useI18n();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = JSON.stringify(settings, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calmtime-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = JSON.parse(evt.target?.result as string);
        const parsed = settingsSchema.safeParse(raw);
        if (!parsed.success) {
          alert("Invalid settings file. Some fields may be missing or incorrect.");
          return;
        }
        update(parsed.data);
      } catch {
        alert("Failed to parse settings file.");
      }
    };
    reader.readAsText(file);
    // 清空 input，允许重复导入同一文件
    e.target.value = "";
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className={sectionTitle}>{t("backupRestore")}</h3>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={handleExport}>
          {t("exportSettings")}
        </Button>
        <Button variant="ghost" onClick={() => fileRef.current?.click()}>
          {t("importSettings")}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </section>
  );
}
