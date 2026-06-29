"use client";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores";
import { useAutoplayUnlock } from "./useAutoplayUnlock";
import { playAmbient, stopAmbient } from "@/lib/audio/ambient";

export function useAmbientSound(): void {
  const ambientSound = useSettingsStore((s) => s.settings.sound.ambientSound);
  const ambientVolume = useSettingsStore((s) => s.settings.sound.ambientVolume);
  const unlocked = useAutoplayUnlock();

  useEffect(() => {
    if (!unlocked) return;
    playAmbient(ambientSound, ambientVolume);
    return () => stopAmbient();
  }, [ambientSound, ambientVolume, unlocked]);
}
