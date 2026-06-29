export const en = {
  // Timer
  start: "Start",
  pause: "Pause",
  reset: "Reset",
  skip: "Skip",
  pomodoro: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",

  // Tasks
  tasks: "Tasks",
  addTask: "Add Task",
  editTask: "Edit task",
  deleteTask: "Delete task",
  markDone: "Mark as done",
  noTasks: "No tasks yet. Add one above.",
  estimatedFinish: "Est. finish",
  clearCompleted: "Clear completed",
  clearAll: "Clear all",
  templates: "Templates",
  saveTemplate: "Save as template",
  applyTemplate: "Apply",

  // Stats
  totalPomodoros: "Total Pomodoros",
  totalFocusTime: "Focus Time",
  streak: "Streak",
  dailyAverage: "Daily Average",
  focusHistory: "Focus history",
  pastYear: "Past year",
  activeDays: "active days",
  bestDay: "best day",
  exportCsv: "Export CSV",
  clearData: "Clear data",
  clearDataConfirm: "Clear all focus stats? This cannot be undone.",

  // Settings
  settings: "Settings",
  done: "Done",
  resetDefaults: "Reset defaults",
  timerDurations: "Timer (minutes)",
  autoStart: "Auto start",
  autoStartBreaks: "Auto start breaks",
  autoStartPomodoros: "Auto start pomodoros",
  longBreakInterval: "Long break interval",
  sound: "Sound",
  alarmSound: "Alarm sound",
  alarmVolume: "Volume",
  alarmRepeat: "Repeat",
  tickingSound: "Ticking sound",
  tickingVolume: "Ticking volume",
  testSound: "Test",
  theme: "Theme",
  colorScheme: "Color scheme",
  colorSchemeAuto: "Auto",
  colorSchemeLight: "Light",
  colorSchemeDark: "Dark",
  modeColors: "Mode colors",
  notifications: "Notifications",
  desktopNotifications: "Desktop notifications",
  desktopNotificationsHint: "Alert when a session ends",
  backupRestore: "Backup & restore",
  exportSettings: "Export settings",
  importSettings: "Import settings",

  // Wallpaper
  wallpaper: "Wallpaper",
  wallpaperNone: "Gradient",
  wallpaperPremium: "Premium",
  wallpaperBreakOnly: "Shown during breaks only",

  // Ambient sound
  ambientSound: "Ambient Sound",
  ambientVolume: "Ambient Volume",

  // Auth
  signIn: "Sign in",
  signOut: "Sign out",
  syncEnabled: "Cloud sync enabled",
  welcomeBack: "Welcome back",
  signInSubtitle: "Sign in to sync your focus data",
  continueWithGitHub: "Continue with GitHub",
  continueWithGoogle: "Continue with Google",
  localOnlyNote: "Your data stays local. Sign in only to enable cloud backup.",

  // Common actions
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  language: "Language",
  displayLanguage: "Display language",

  // Keyboard shortcuts hint
  shortcutSpace: "Space to start/pause",
  shortcutR: "R to reset",
  shortcutModes: "1/2/3 to switch modes",
} as const;

export type I18nKeys = keyof typeof en;
