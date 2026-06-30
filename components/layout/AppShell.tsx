"use client";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutoplayUnlock } from "@/hooks/useAutoplayUnlock";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { InstallPrompt } from "./InstallPrompt";
import { TimerCard } from "@/components/timer/TimerCard";

export function AppShell() {
  useKeyboardShortcuts();
  useAutoplayUnlock();
  useTimeOfDay();

  return (
    <div className="min-h-dvh">
      <main className="grid min-h-dvh place-items-center px-4">
        <TimerCard />
      </main>
      <InstallPrompt />
    </div>
  );
}
