"use client";
import type { TimerMode } from "@/types";
import { useSettingsStore, useTimerStore } from "@/stores";
import { durationMsForMode } from "@/lib/timer/schedule";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ForwardIcon } from "@/components/ui/icons";
import { useI18n } from "@/hooks/useI18n";

export function TimerControls() {
  const t = useI18n();
  const status = useTimerStore((s) => s.status);
  const mode = useTimerStore((s) => s.mode);
  const settings = useSettingsStore((s) => s.settings);
  const running = status === "running";
  const started = running || status === "paused";

  const onPrimary = () => {
    const store = useTimerStore.getState();
    if (running) store.pause(Date.now());
    else store.start(durationMsForMode(settings, store.mode), Date.now());
  };

  const onSkip = () => {
    const nextMode: TimerMode = mode === "pomodoro" ? "shortBreak" : "pomodoro";
    useTimerStore.getState().skip(nextMode, durationMsForMode(settings, nextMode));
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="primary" size="lg" onClick={onPrimary}>
        {running ? t("pause") : t("start")}
      </Button>
      {started && (
        <IconButton label={t("skip")} onClick={onSkip}>
          <ForwardIcon />
        </IconButton>
      )}
    </div>
  );
}
