import type { ThemeConfig } from "@/types";

/** 默认主题色（与 globals.css 的 @theme 保持一致）。 */
export const DEFAULT_THEME_COLORS = {
  pomodoro: "#ba4949",
} as const;

/** 把主题色写入 :root CSS 变量，背景渐变会随之实时变化。 */
export function applyThemeColors(theme: ThemeConfig): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--color-pomodoro", theme.pomodoroColor);
}
