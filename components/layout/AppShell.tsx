"use client";
import { useState } from "react";
import { useThemeApplier } from "@/hooks/useThemeApplier";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAutoplayUnlock } from "@/hooks/useAutoplayUnlock";
import { TopBar } from "./TopBar";
import { InstallPrompt } from "./InstallPrompt";
import { TimerCard } from "@/components/timer/TimerCard";
import { SettingsModal } from "@/components/settings/SettingsModal";

export function AppShell() {
  useThemeApplier();
  useKeyboardShortcuts();
  useColorScheme();
  useAutoplayUnlock();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="grid min-h-dvh place-items-center px-4">
        <TimerCard />
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InstallPrompt />
    </div>
  );
}
