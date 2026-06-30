# CalmTime

极简番茄钟。拖动进度环设置时长，点击启动/暂停。

## 技术栈

Next.js 15.5（App Router）· React 19 · Tailwind CSS v4 · TypeScript · Zustand v5 · serwist（PWA）· 包管理 pnpm

## 快速开始

```bash
bash scripts/dev.sh      # 开发服务器（http://localhost:3000）
bash scripts/build.sh    # 生产构建（PWA 仅生产生效）
bash scripts/start.sh    # 生产服务器
bash scripts/stop.sh     # 停止占用端口的进程
bash scripts/lint.sh     # tsc 类型检查 + ESLint
bash scripts/clean.sh    # 清理 .next / 日志
```

## 功能

- **拖动设置时长**：idle 状态下拖动进度环，1–99 分钟，默认 25 分钟
- **防漂移计时**：基于绝对时间戳，锁屏/切后台回来不丢秒
- **提醒音**：计时结束时 Web Audio 合成铃声，默认开启
- **桌面通知**：计时结束时系统通知，默认开启（首次需授权）
- **PWA**：可安装到桌面/手机，离线可用
- **键盘快捷键**：空格键启动/暂停

## 使用说明

| 操作 | 行为 |
|------|------|
| 拖动进度环（idle） | 调整时长（1–99 分钟） |
| 点击进度环 | 启动 / 暂停 |
| 空格键 | 启动 / 暂停 |

## 静态导出部署

应用无任何服务端逻辑，支持静态导出：

```ts
// next.config.ts
output: "export"
```

构建后将 `out/` 目录用 Nginx 托管即可。
