"use client";

/**
 * 全局键盘快捷键：
 *   Space      — 开始 / 暂停
 *   R          — 重置当前模式
 *   1 / 2 / 3  — 切换到 Pomodoro / Short Break / Long Break
 *
 * 当焦点在 input/textarea/select/contenteditable 内时禁用，避免干扰输入。
 */
import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer.store";
import { useSettingsStore } from "@/stores/settings.store";
import { durationMsForMode } from "@/lib/timer/schedule";
import type { TimerMode } from "@/types";

function isFocusedOnInput(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isFocusedOnInput()) return;

      const timer = useTimerStore.getState();
      const settings = useSettingsStore.getState().settings;

      if (e.code === "Space") {
        e.preventDefault();
        if (timer.status === "running") {
          timer.pause(Date.now());
        } else {
          timer.start(durationMsForMode(settings, timer.mode), Date.now());
        }
        return;
      }

      if (e.key === "r" || e.key === "R") {
        timer.reset(durationMsForMode(settings, timer.mode));
        return;
      }

      const modeMap: Record<string, TimerMode> = {
        "1": "pomodoro",
        "2": "shortBreak",
        "3": "longBreak",
      };
      const targetMode = modeMap[e.key];
      if (targetMode) {
        timer.selectMode(targetMode, durationMsForMode(settings, targetMode));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
