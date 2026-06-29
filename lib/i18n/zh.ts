import type { I18nKeys } from "./en";

export const zh: Record<I18nKeys, string> = {
  // 计时器
  start: "开始",
  pause: "暂停",
  reset: "重置",
  skip: "跳过",
  pomodoro: "专注",
  shortBreak: "短休息",
  longBreak: "长休息",

  // 任务
  tasks: "任务",
  addTask: "添加任务",
  editTask: "编辑任务",
  deleteTask: "删除任务",
  markDone: "标记完成",
  noTasks: "还没有任务，在上方添加一个吧。",
  estimatedFinish: "预计完成",
  clearCompleted: "清除已完成",
  clearAll: "清除全部",
  templates: "模板",
  saveTemplate: "另存为模板",
  applyTemplate: "应用",

  // 统计
  totalPomodoros: "番茄总数",
  totalFocusTime: "专注时间",
  streak: "连续天数",
  dailyAverage: "日均番茄",
  focusHistory: "专注历史",
  pastYear: "过去一年",
  activeDays: "活跃天",
  bestDay: "最高单日",
  exportCsv: "导出 CSV",
  clearData: "清除数据",
  clearDataConfirm: "确认清除所有专注统计？此操作不可撤销。",

  // 设置
  settings: "设置",
  done: "完成",
  resetDefaults: "恢复默认",
  timerDurations: "时长（分钟）",
  autoStart: "自动开始",
  autoStartBreaks: "自动开始休息",
  autoStartPomodoros: "自动开始专注",
  longBreakInterval: "长休息间隔",
  sound: "声音",
  alarmSound: "提醒音",
  alarmVolume: "音量",
  alarmRepeat: "重复次数",
  tickingSound: "滴答声",
  tickingVolume: "滴答音量",
  testSound: "测试",
  theme: "主题",
  colorScheme: "配色方案",
  colorSchemeAuto: "跟随系统",
  colorSchemeLight: "浅色",
  colorSchemeDark: "深色",
  modeColors: "模式颜色",
  notifications: "通知",
  desktopNotifications: "桌面通知",
  desktopNotificationsHint: "会话结束时弹出提醒",
  backupRestore: "备份与恢复",
  exportSettings: "导出设置",
  importSettings: "导入设置",

  // 壁纸
  wallpaper: "动态壁纸",
  wallpaperNone: "渐变背景",
  wallpaperPremium: "高级",
  wallpaperBreakOnly: "仅在休息时显示",

  // 环境音
  ambientSound: "环境音",
  ambientVolume: "环境音音量",

  // 认证
  signIn: "登录",
  signOut: "退出登录",
  syncEnabled: "云端同步已开启",
  welcomeBack: "欢迎回来",
  signInSubtitle: "登录以同步你的专注数据",
  continueWithGitHub: "使用 GitHub 登录",
  continueWithGoogle: "使用 Google 登录",
  localOnlyNote: "数据默认存在本地，登录仅用于云端备份。",

  // 通用操作
  cancel: "取消",
  save: "保存",
  delete: "删除",
  language: "语言",
  displayLanguage: "显示语言",

  // 快捷键提示
  shortcutSpace: "Space 开始/暂停",
  shortcutR: "R 重置",
  shortcutModes: "1/2/3 切换模式",
};
