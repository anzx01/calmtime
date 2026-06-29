# 架构总览

## 分层

```
types/        强类型契约（无运行时逻辑）
lib/          纯逻辑（无 React）：timer / audio / storage / stats / theme / schemas / utils / logger
stores/       Zustand 状态切片（settings / tasks / timer / radio / stats）
hooks/        React 适配层（计时循环、主题应用、hydration、媒体查询、自动播放解锁）
components/   UI：ui / layout / timer / tasks / settings / radio / stats
app/          App Router 页面与入口（layout / page / stats / offline / manifest / sw）
```

依赖方向单向向下：`components → hooks → stores → lib → types`。lib 不依赖 React/stores，便于单测与复用。

## 状态管理（Zustand）

5 个独立 store，各自用 `persist` 中间件落 localStorage（key 前缀 `calmtime:v1:*`）：

| store    | 持久化内容                | 关键说明                                     |
| -------- | ------------------------- | -------------------------------------------- |
| settings | 全量设置                  | 改主题色经 `useThemeApplier` 实时写 CSS 变量 |
| tasks    | 任务 / 模板 / 当前任务 id | 番茄完成时累加当前任务                       |
| timer    | 计时状态机                | 持久化以支持「刷新后继续计时」               |
| radio    | 频道 / 音量               | 刷新后强制 `playing=false`（自动播放限制）   |
| stats    | 会话记录 SessionRecord[]  | 聚合在读取时计算，最多保留 5000 条           |

**跨 store 不互相 import**（避免循环依赖）。需要协作的场景（如番茄完成）在 hook 层编排：`useTimerLoop` 检测到完成 → 读取各 store 的 `getState()` → 依次调用 `stats.addSession`、`tasks.incrementActive`、`timer.complete`。

每个 store 的 `merge` 选项用对应 Zod schema（`lib/schemas`）校验持久化数据，损坏时回退默认值并告警，杜绝脏数据导致崩溃。

## 数据校验

`types/` 手写类型契约，`lib/schemas/` 提供等价的 Zod schema。读取 localStorage 时运行时校验；类型与 schema 结构一一对应。

## 渲染与 hydration

持久化数据仅存在于客户端，首屏 SSR 用默认值。关键展示（计时数字、任务列表、统计）用 `useHydrated` 守卫，hydrate 前显示满时长/占位，避免 hydration mismatch 与首屏闪烁。

## 主题与背景

- 模式主题色是 CSS 变量（`--color-pomodoro/short-break/long-break`），设置页可实时覆盖。
- 背景渐变由主题色经 `color-mix()` 推导（`globals.css`），改色即变。
- `AppBackground` 渲染三层模式渐变，用 `opacity` 交叉淡入实现 ~600ms 平滑过渡；并把 `data-mode` 同步到 `<html>` 驱动 `--mode-color`。
- 玻璃拟态：`.glass` 工具类（`backdrop-blur` + 半透明白 + 描边 + 阴影），`prefers-reduced-transparency` 下降级为半透明纯色。
