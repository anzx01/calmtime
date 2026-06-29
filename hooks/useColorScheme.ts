"use client";

/**
 * 监听用户 colorScheme 设置，动态写入 <html data-color-scheme="...">
 * 配合 CSS 里的 [data-color-scheme="dark"] / light 规则实现深浅色切换。
 * system = 跟随 prefers-color-scheme 媒体查询。
 */
import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings.store";
import type { ColorScheme } from "@/types";

function applyScheme(scheme: ColorScheme) {
  const html = document.documentElement;
  if (scheme === "system") {
    html.removeAttribute("data-color-scheme");
    // 让 CSS color-scheme: light dark 自动跟随系统
    html.style.colorScheme = "light dark";
  } else {
    html.dataset.colorScheme = scheme;
    html.style.colorScheme = scheme;
  }
}

export function useColorScheme() {
  const colorScheme = useSettingsStore((s) => s.settings.theme.colorScheme);

  useEffect(() => {
    applyScheme(colorScheme);
  }, [colorScheme]);
}
