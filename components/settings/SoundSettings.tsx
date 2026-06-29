"use client";
import type { SoundId, AmbientSoundId } from "@/types";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { Slider } from "@/components/ui/Slider";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Button } from "@/components/ui/Button";
import { playAlarm } from "@/lib/audio/alarm";
import { SettingRow, sectionTitle } from "./SettingRow";

const SOUND_IDS: SoundId[] = ["bell", "digital", "kitchen", "bird", "wood", "none"];
const AMBIENT_IDS: AmbientSoundId[] = ["none", "rain", "ocean", "forest"];

const AMBIENT_LABELS: Record<AmbientSoundId, string> = {
  none: "None",
  rain: "Rain",
  ocean: "Ocean",
  forest: "Forest",
};

export function SoundSettings() {
  const t = useI18n();
  const sound = useSettingsStore((s) => s.settings.sound);
  const setSound = useSettingsStore((s) => s.setSound);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("sound")}</h3>

      {/* 提醒音 */}
      <SettingRow label={t("alarmSound")}>
        <select
          aria-label={t("alarmSound")}
          value={sound.alarmSound}
          onChange={(e) => setSound({ alarmSound: e.target.value as SoundId })}
          className="rounded-lg bg-white/15 px-2 py-1 text-sm text-white outline-none"
        >
          {SOUND_IDS.map((id) => (
            <option key={id} value={id} className="text-black">
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </option>
          ))}
        </select>
      </SettingRow>
      <SettingRow label={t("alarmVolume")}>
        <div className="w-32">
          <Slider
            label={t("alarmVolume")}
            value={Math.round(sound.alarmVolume * 100)}
            min={0}
            max={100}
            onChange={(v) => setSound({ alarmVolume: v / 100 })}
          />
        </div>
      </SettingRow>
      <SettingRow label={t("alarmRepeat")}>
        <NumberStepper
          label={t("alarmRepeat")}
          value={sound.alarmRepeat}
          min={1}
          max={10}
          onChange={(v) => setSound({ alarmRepeat: v })}
        />
      </SettingRow>
      <Button
        variant="ghost"
        className="mt-2 self-start"
        onClick={() => playAlarm(sound.alarmSound, sound.alarmVolume, sound.alarmRepeat)}
      >
        {t("testSound")}
      </Button>

      {/* 环境音 */}
      <h3 className={`${sectionTitle} mt-5`}>{t("ambientSound")}</h3>
      <SettingRow label={t("ambientSound")}>
        <select
          aria-label={t("ambientSound")}
          value={sound.ambientSound}
          onChange={(e) => setSound({ ambientSound: e.target.value as AmbientSoundId })}
          className="rounded-lg bg-white/15 px-2 py-1 text-sm text-white outline-none"
        >
          {AMBIENT_IDS.map((id) => (
            <option key={id} value={id} className="text-black">
              {AMBIENT_LABELS[id]}
            </option>
          ))}
        </select>
      </SettingRow>
      {sound.ambientSound !== "none" && (
        <SettingRow label={t("ambientVolume")}>
          <div className="w-32">
            <Slider
              label={t("ambientVolume")}
              value={Math.round(sound.ambientVolume * 100)}
              min={0}
              max={100}
              onChange={(v) => setSound({ ambientVolume: v / 100 })}
            />
          </div>
        </SettingRow>
      )}
    </section>
  );
}
