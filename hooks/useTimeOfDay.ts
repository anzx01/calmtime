"use client";
import { useEffect } from "react";

function isNight(hour: number) {
  return hour >= 20 || hour < 7;
}

export function useTimeOfDay() {
  useEffect(() => {
    const check = () => {
      document.documentElement.dataset.night = String(isNight(new Date().getHours()));
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
}
