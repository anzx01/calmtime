# 计时器设计

## 防漂移核心

计时**不累加 interval**，而是以绝对结束时间戳 `endsAt`（epoch ms）为唯一真相源：

- 开始计时：`endsAt = Date.now() + 剩余毫秒`，状态 `running`。
- 任意时刻剩余 = `endsAt - Date.now()`（`lib/timer/engine.ts` 的 `remainingMsAt`）。
- `useTimerLoop` 每 250ms 重算并重渲染，**只读不累加**，所以即使浏览器节流后台定时器，剩余值也始终正确。
- 监听 `visibilitychange` / `focus`：锁屏或切后台回到前台时立即重算，误差被一次性补偿（验收要求 < 1s）。
- 暂停：把 `endsAt - now` 存入 `remainingMs`，`endsAt` 置 null；恢复时以 `remainingMs` 重新计算 `endsAt`。

## 状态机

`TimerStatus`：`idle → running ⇄ paused → completed`。

- `idle`：显示当前模式满时长（设置改时长时经 `setIdleRemaining` 同步）。
- `running`：依赖 `endsAt`。
- `paused`：依赖 `remainingMs`。
- 完成：`isExpiredAt` 为真时触发编排。

## 模式流转（纯函数）

`lib/timer/schedule.ts` 的 `advanceAfterComplete(mode, completedInCycle, settings)` 是纯函数，便于单测：

- 完成一个 pomodoro：`completedInCycle + 1`；若达到 `longBreakInterval` 的整数倍 → 进 `longBreak`，否则 `shortBreak`；是否自动开始取 `autoStartBreaks`。
- 完成一段 break → 回 `pomodoro`；若刚结束的是 `longBreak` 则把 `completedInCycle` 归零；是否自动开始取 `autoStartPomodoros`。

## 完成编排

在 `useTimerLoop` 的 `handleComplete(now)` 中（hook 层，避免 store 互相依赖）：

1. 读当前模式、`startedAt`、计划时长。
2. 写一条 `SessionRecord` 到 stats store（`reason: "finished"`，pomodoro 的 `actualMs = plannedMs`）。
3. 若刚结束的是 pomodoro，`tasks.incrementActive()` 给当前任务 +1。
4. `timer.complete(advance, nextDurationMs, now)` 应用流转（可能自动开始下一段）。
5. `playAlarm(...)` 播放提醒音。

`completing` ref 防止一次过期被重复处理。

## 提醒音

`lib/audio/alarm.ts` 用 Web Audio API **实时合成**（零音频文件、零版权）。每种 `SoundId` 对应一组振荡器参数（频率/波形/节奏），按 `alarmRepeat` 轮次、`alarmVolume` 音量调度。首个用户手势经 `useAutoplayUnlock` 解锁 AudioContext。提醒音与 Lo-fi 电台是不同音频通道，互不打断。

## 刷新后继续计时

timer store 持久化整个状态。重开页面时 zustand 同步 rehydrate，`useTimerLoop` 首个 tick 即检测是否已过期：若关闭期间到点，则补一次完成流转（下一段基于当前 `now` 重新计算，不会连环过期）。
