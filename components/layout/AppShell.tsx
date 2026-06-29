"use client";
import { useState } from "react";
import { useThemeApplier } from "@/hooks/useThemeApplier";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAutoplayUnlock } from "@/hooks/useAutoplayUnlock";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { TopBar } from "./TopBar";
import { InstallPrompt } from "./InstallPrompt";
import { TimerCard } from "@/components/timer/TimerCard";
import { TasksPanel } from "@/components/tasks/TasksPanel";
import { SettingsModal } from "@/components/settings/SettingsModal";

export function AppShell() {
  useThemeApplier();
  useCloudSync();
  useKeyboardShortcuts();
  useColorScheme();
  useAutoplayUnlock();
  useAmbientSound();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-4 pt-2 pb-10">
        <TimerCard />
        <TasksPanel />
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InstallPrompt />
    </div>
  );
}
