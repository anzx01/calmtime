import type { Settings, TimerMode } from "@/types";
import { minutesToMs } from "@/lib/utils/time";

/** 指定模式的计划时长（ms）。 */
export function durationMsForMode(settings: Settings, mode: TimerMode): number {
  return minutesToMs(settings.durations[mode]);
}

export interface ModeAdvance {
  nextMode: TimerMode;
  /** 流转后的本轮已完成番茄数。 */
  completedInCycle: number;
  /** 下一段是否自动开始。 */
  autoStart: boolean;
}

/**
 * 一段计时完成后的模式流转（纯函数，可单测）。
 * pomodoro 完成计数 +1，达到 longBreakInterval 进长休息；
 * 长休息结束后重置本轮计数。
 */
export function advanceAfterComplete(
  mode: TimerMode,
  completedInCycle: number,
  settings: Settings,
): ModeAdvance {
  if (mode === "pomodoro") {
    const completed = completedInCycle + 1;
    const longDue = completed % settings.longBreakInterval === 0;
    return {
      nextMode: longDue ? "longBreak" : "shortBreak",
      completedInCycle: completed,
      autoStart: settings.autoStartBreaks,
    };
  }

  return {
    nextMode: "pomodoro",
    completedInCycle: mode === "longBreak" ? 0 : completedInCycle,
    autoStart: settings.autoStartPomodoros,
  };
}
