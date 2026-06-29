export const en = {
  // Settings
  settings: "Settings",
  done: "Done",
  resetDefaults: "Reset defaults",
  focusDuration: "Focus duration (min)",
  notifications: "Notifications",
  desktopNotifications: "Desktop notifications",
  desktopNotificationsHint: "Alert when a session ends",
} as const;

export type I18nKeys = keyof typeof en;
