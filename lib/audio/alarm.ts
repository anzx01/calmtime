import type { SoundId } from "@/types";
import { clamp } from "@/lib/utils/time";

/**
 * 提醒音用 Web Audio 实时合成 —— 零音频文件、零版权、体积最小。
 * 与背景电台（YouTube）是不同音频通道，互不打断。
 */

interface TonePreset {
  freq: number;
  endFreq?: number;
  type: OscillatorType;
  beeps: number;
  beepDur: number;
  beepGap: number;
  cycleGap: number;
}

const SOUND_PRESETS: Record<Exclude<SoundId, "none">, TonePreset> = {
  bell: { freq: 880, type: "sine", beeps: 1, beepDur: 0.7, beepGap: 0.15, cycleGap: 0.35 },
  digital: { freq: 1245, type: "square", beeps: 2, beepDur: 0.12, beepGap: 0.1, cycleGap: 0.4 },
  kitchen: { freq: 660, type: "triangle", beeps: 4, beepDur: 0.09, beepGap: 0.07, cycleGap: 0.45 },
  bird: {
    freq: 1600,
    endFreq: 2600,
    type: "sine",
    beeps: 3,
    beepDur: 0.14,
    beepGap: 0.1,
    cycleGap: 0.4,
  },
  wood: { freq: 320, type: "triangle", beeps: 1, beepDur: 0.18, beepGap: 0.12, cycleGap: 0.3 },
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** 首个用户手势时调用，解锁/恢复音频上下文。 */
export function ensureAudioContext(): void {
  getContext();
}

function scheduleBeep(ac: AudioContext, preset: TonePreset, start: number, volume: number): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = preset.type;
  osc.frequency.setValueAtTime(preset.freq, start);
  if (preset.endFreq) {
    osc.frequency.linearRampToValueAtTime(preset.endFreq, start + preset.beepDur);
  }
  const peak = clamp(volume, 0, 1) * 0.5;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + preset.beepDur);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + preset.beepDur + 0.03);
}

/** 播放提醒音：sound 音色、volume(0..1)、repeat 轮数。 */
export function playAlarm(sound: SoundId, volume: number, repeat: number): void {
  if (sound === "none") return;
  const ac = getContext();
  if (!ac) return;
  const preset = SOUND_PRESETS[sound];
  let t = ac.currentTime + 0.03;
  const rounds = Math.max(1, Math.min(10, Math.round(repeat)));
  for (let r = 0; r < rounds; r++) {
    for (let b = 0; b < preset.beeps; b++) {
      scheduleBeep(ac, preset, t, volume);
      t += preset.beepDur + preset.beepGap;
    }
    t += preset.cycleGap;
  }
}
