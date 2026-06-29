# CalmTime

pomofocus.io 的复刻 + 增强版番茄钟。极简、精致（玻璃拟态）、手机/桌面自适应，内置在线 Lo-fi 电台、PWA 离线可装、本地专注统计。

## 技术栈

Next.js 15.5（App Router）· React 19 · Tailwind CSS v4 · TypeScript（ESM）· Zustand v5 · serwist（PWA）· Recharts · 包管理 pnpm。

## 快速开始

所有 Run & Debug 一律走 `scripts/` 下的 `.sh` 脚本，日志输出到 `logs/`：

```bash
bash scripts/dev.sh      # 开发服务器（Turbopack，http://localhost:3000）
bash scripts/build.sh    # 生产构建（webpack + serwist，PWA 仅生产生效）
bash scripts/start.sh    # 生产服务器（验证 PWA / 离线）
bash scripts/stop.sh     # 停止占用端口的进程
bash scripts/lint.sh     # tsc 类型检查 + ESLint
bash scripts/format.sh   # Prettier 格式化
bash scripts/clean.sh    # 清理 .next / 生成的 sw.js / 日志
node scripts/gen-icons.mjs   # 重新生成 PWA PNG 图标（无依赖）
```

> PWA（Service Worker）在开发模式下禁用，必须 `build.sh` + `start.sh` 才能验证安装与离线。

## 功能

- 三模式番茄钟（Pomodoro / Short Break / Long Break），背景随模式渐变过渡
- **防漂移计时**：基于绝对时间戳，锁屏/切后台回来不丢秒
- 任务管理：增删改、预估番茄、预估完成时间、当前任务高亮、任务模板
- 设置：自定义时长、自动开始、长休息间隔、提醒音（Web Audio 合成）、音量、主题色
- **在线 Lo-fi 电台**：YouTube 多频道，独立播放控制，不打断提醒音
- **PWA**：可安装到桌面/手机、离线可用
- **专注统计**：日/周/月图表、连续天数、CSV 导出（本地 localStorage）

## 文档

- 架构总览：[docs/architecture.md](docs/architecture.md)
- 计时器设计：[docs/timer-design.md](docs/timer-design.md)
- PWA 说明：[docs/pwa.md](docs/pwa.md)
- 技术决策与后续路线：[discuss/tech-decisions.md](discuss/tech-decisions.md)

## 后续阶段（尚未实现）

Phase 3+ 的后端集成（账号、云同步、Todoist、Webhook）见技术决策文档。当前为 Phase 1：纯前端、零后端、可独立部署的 MVP。
