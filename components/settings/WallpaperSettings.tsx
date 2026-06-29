"use client";
import { useSettingsStore } from "@/stores";
import { useI18n } from "@/hooks/useI18n";
import { WALLPAPERS, wallpaperUrl } from "@/lib/audio/wallpapers";
import { cn } from "@/lib/utils/cn";
import { sectionTitle } from "./SettingRow";

export function WallpaperSettings() {
  const t = useI18n();
  const wallpaper = useSettingsStore((s) => s.settings.theme.wallpaper);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <section className="flex flex-col">
      <h3 className={sectionTitle}>{t("wallpaper")}</h3>
      <p className="mb-3 text-xs text-white/50">{t("wallpaperBreakOnly")}</p>
      <div className="grid grid-cols-4 gap-2">
        {/* 渐变（无壁纸）选项 */}
        <button
          onClick={() => setTheme({ wallpaper: null })}
          className={cn(
            "relative flex h-16 items-center justify-center rounded-xl border-2 text-xs font-medium transition-all",
            "bg-gradient-to-br from-rose-400 to-violet-500",
            wallpaper === null
              ? "border-white shadow-lg scale-105"
              : "border-transparent opacity-60 hover:opacity-90",
          )}
        >
          <span className="text-white drop-shadow">{t("wallpaperNone")}</span>
        </button>

        {/* 壁纸列表 */}
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            onClick={() => !w.premium && setTheme({ wallpaper: w.id })}
            title={w.premium ? t("wallpaperPremium") : w.label}
            className={cn(
              "relative h-16 overflow-hidden rounded-xl border-2 transition-all",
              wallpaper === w.id
                ? "border-white shadow-lg scale-105"
                : "border-transparent opacity-70 hover:opacity-100",
              w.premium && "cursor-not-allowed",
            )}
          >
            <img
              src={wallpaperUrl(w.id)}
              alt={w.label}
              className="h-full w-full object-cover"
            />
            {w.premium && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-xs text-amber-300">★ {t("wallpaperPremium")}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
