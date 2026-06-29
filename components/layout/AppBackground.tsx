"use client";
import { useEffect } from "react";

export function AppBackground() {
  useEffect(() => {
    document.body.style.backgroundColor = "#F2F2F7";
  }, []);

  return (
    <div className="fixed inset-0 -z-10" style={{ background: "#F2F2F7" }} />
  );
}
