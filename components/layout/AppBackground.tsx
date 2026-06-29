"use client";
import { useEffect } from "react";
import { useTimerStore, useSettingsStore } from "@/stores";
import { modeToSlug } from "@/lib/utils/time";
import { wallpaperUrl } from "@/lib/audio/wallpapers";
import { cn } from "@/lib/utils/cn";

function Layer({ cls, active }: { cls: string; active: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-in-out",
        cls,
        active ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

/** 三层渐变交叉淡入 + 呼吸光晕。休息模式下叠加 GIF 壁纸。 */
export function AppBackground() {
  const mode = useTimerStore((s) => s.mode);
  const wallpaper = useSettingsStore((s) => s.settings.theme.wallpaper);

  const isBreak = mode === "shortBreak" || mode === "longBreak";
  const showWallpaper = isBreak && wallpaper !== null;

  useEffect(() => {
    document.documentElement.dataset.mode = modeToSlug(mode);
  }, [mode]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 渐变兜底层 */}
      <Layer cls="bg-grad-pomodoro"    active={mode === "pomodoro"} />
      <Layer cls="bg-grad-short-break" active={mode === "shortBreak"} />
      <Layer cls="bg-grad-long-break"  active={mode === "longBreak"} />

      {/* GIF 壁纸：仅休息模式且已选壁纸时显示 */}
      {showWallpaper && (
        <img
          key={wallpaper}
          src={wallpaperUrl(wallpaper)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      )}

      {/* 壁纸遮罩，确保卡片可读 */}
      {showWallpaper && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      {/* 呼吸光晕 */}
      <div className="animate-breathe pointer-events-none absolute top-[-30%] left-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
