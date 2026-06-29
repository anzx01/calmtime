import type { AmbientSoundId } from "@/types";

const AMBIENT_SRCS: Record<Exclude<AmbientSoundId, "none">, string> = {
  rain:   "/sounds/rain.mp3",
  ocean:  "/sounds/ocean.mp3",
  forest: "/sounds/forest.mp3",
};

let audioEl: HTMLAudioElement | null = null;

export function playAmbient(id: AmbientSoundId, volume: number): void {
  if (id === "none") {
    stopAmbient();
    return;
  }
  if (!audioEl) audioEl = new Audio();
  const src = AMBIENT_SRCS[id];
  if (audioEl.src !== src || audioEl.paused) {
    audioEl.src = src;
    audioEl.loop = true;
  }
  audioEl.volume = Math.max(0, Math.min(1, volume));
  void audioEl.play().catch(() => undefined);
}

export function setAmbientVolume(volume: number): void {
  if (audioEl) audioEl.volume = Math.max(0, Math.min(1, volume));
}

export function stopAmbient(): void {
  audioEl?.pause();
}
