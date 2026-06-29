"use client";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores";
import { applyThemeColors } from "@/lib/theme/palette";

/** 把设置中的主题色实时写入 CSS 变量（背景渐变随之变化）。 */
export function useThemeApplier(): void {
  const theme = useSettingsStore((s) => s.settings.theme);
  useEffect(() => {
    applyThemeColors(theme);
  }, [theme]);
}
