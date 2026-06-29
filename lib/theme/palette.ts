import type { ThemeConfig, TimerMode } from "@/types";

export const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export const MODE_MESSAGES: Record<TimerMode, string> = {
  pomodoro: "Time to focus!",
  shortBreak: "Time for a short break!",
  longBreak: "Time for a long break!",
};

/** 默认主题色（与 globals.css 的 @theme 保持一致）。 */
export const DEFAULT_THEME_COLORS = {
  pomodoro: "#ba4949",
  shortBreak: "#38858a",
  longBreak: "#397097",
} as const;

/** 把主题色写入 :root CSS 变量，背景渐变会随之实时变化。 */
export function applyThemeColors(theme: ThemeConfig): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--color-pomodoro", theme.pomodoroColor);
  root.setProperty("--color-short-break", theme.shortBreakColor);
  root.setProperty("--color-long-break", theme.longBreakColor);
}
