# 技术决策与后续路线

## 已落地选型（Phase 1）

| 领域       | 选型                                           | 理由                                    |
| ---------- | ---------------------------------------------- | --------------------------------------- |
| 框架       | Next.js 15.5 App Router + React 19 + TS（ESM） | 全局规范强制；静态导出即可部署          |
| 样式       | Tailwind v4 CSS-first（`@theme` + CSS 变量）   | 主题色实时可改，无 `tailwind.config.js` |
| 状态       | Zustand v5 多 store + persist                  | 切片清晰、无巨石 Context、避免循环依赖  |
| 计时       | 绝对时间戳 `endsAt`                            | 杜绝后台/锁屏漂移                       |
| PWA        | @serwist/next                                  | next-pwa 继任者，官方推荐               |
| 图表       | Recharts                                       | 响应式声明式，体积适中                  |
| 提醒音     | Web Audio 合成                                 | 零文件、零版权                          |
| Lo-fi 电台 | YouTube IFrame API                             | 真实曲库、多频道可切                    |

## 关键权衡

- **背景音乐用 YouTube 嵌入**（用户选定）：曲库丰富，但受地区/版权/广告与自动播放限制影响。频道 videoId 可能随频道改版失效——维护点集中在 `lib/audio/channels.ts`，注释已说明如何更新。Spotify embed 仅 30s 预览且不可编程控音量，故仅作备选未启用。
- **统计存原始 SessionRecord[] 而非预聚合**：换取灵活的多范围聚合与 CSV 导出；用 5000 条上限兜底体积。
- **timer 持久化以支持刷新继续**：代价是需处理「关闭期间到点」的补偿逻辑（已在 `useTimerLoop` 处理）。

## 已落地选型（Phase 2）

| 特性 | 实现要点 |
|---|---|
| 键盘快捷键 | `hooks/useKeyboardShortcuts.ts`：Space 开始/暂停、R 重置、1/2/3 切模式；焦点在 input/textarea 时自动禁用 |
| 桌面通知 | `lib/notification.ts` + `useTimerLoop` 集成：每段结束触发 `Notification API`，与 Web Audio 独立；Settings 里开关+权限请求 |
| 年度热力图 | `components/stats/YearHeatmap.tsx`：53 列 × 7 行 GitHub 风格，`color-mix` 5 级强度；统计页热力图卡片 |
| 设置 JSON 导出/导入 | `components/settings/ImportExportSettings.tsx`：导出为 `calmtime-settings.json`；导入时 Zod 校验，失败给出提示 |
| 深浅色主题 | `hooks/useColorScheme.ts`：写 `<html data-color-scheme>` + `style.colorScheme`；Settings 三选一（Auto/Light/Dark）；CSS `[data-color-scheme]` 规则调整 glass/body |
| i18n 骨架 | `lib/i18n/` 纯常量字典 en/zh（70+ 字符串）；`stores/i18n.store.ts` 持久化 locale；Settings 切换无需刷新 |

## 待办 / 需用户决策（后续阶段）

以下为路线图后续阶段，启动时需要相应外部凭据/决策：

- **Phase 4 Todoist 集成**：OAuth2 + 双向同步。需注册 Todoist 应用拿 `TODOIST_CLIENT_ID/SECRET` + redirect URL。
- **Phase 5 Webhook + 报告导出**：出站 Webhook（HMAC 签名）需公网部署；服务端报告导出；可选订阅墙。
- **部署**：默认 Vercel（SW/HTTPS/日志最顺）。

## 默认决策（可调整）

项目名 CalmTime；主语言英文 + 预留中文；刷新后继续计时；暂不做付费墙。内置 3 个 Lo-fi 频道（Lofi Beats / Synthwave / Sleep Lofi）。
