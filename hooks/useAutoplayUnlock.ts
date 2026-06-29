"use client";
import { useEffect, useState } from "react";
import { ensureAudioContext } from "@/lib/audio/alarm";

/**
 * 监听首个用户手势以解锁音频上下文（绕过浏览器自动播放限制）。
 * 返回是否已解锁，可用于提示"点击播放"。
 */
export function useAutoplayUnlock(): boolean {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) return;
    const unlock = () => {
      ensureAudioContext();
      setUnlocked(true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [unlocked]);

  return unlocked;
}
