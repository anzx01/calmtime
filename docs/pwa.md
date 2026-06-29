# PWA 说明

## 方案

使用 **@serwist/next**（next-pwa 官方继任者，Next 文档推荐）。

- `next.config.ts` 用 `withSerwistInit` 包裹：`swSrc: "app/sw.ts"`、`swDest: "public/sw.js"`、开发模式 `disable`。
- `app/sw.ts`：基于 `Serwist`，`precacheEntries: self.__SW_MANIFEST`，`skipWaiting`、`clientsClaim`、`navigationPreload`、`runtimeCaching: defaultCache`，离线兜底页 `/offline`。
- `app/manifest.ts`：用 `MetadataRoute.Manifest` 输出 `/manifest.webmanifest`，含 192/512/maskable 图标、`display: standalone`、主题色。
- `tsconfig.json`：加入 `@serwist/next/typings`、`lib: webworker`，并 `exclude: public/sw.js`。

## 关键注意

- **开发模式 SW 禁用**：`scripts/dev.sh`（Turbopack）下无 PWA。验证安装/离线必须 `scripts/build.sh` + `scripts/start.sh`。
- `next build` 默认即 webpack（serwist 需要）；`--turbopack` 才切 Turbopack，故 dev 用 Turbopack、build 用默认 webpack。
- PWA 需 HTTPS（localhost 例外）。部署到 Vercel 等自带 HTTPS 的平台即可安装。
- 离线策略：静态资源预缓存 + 导航网络优先回退缓存；本地数据（任务/设置/统计）本就在 localStorage，断网完全可用。Lo-fi 电台依赖网络，断网不可播。

## 图标

`node scripts/gen-icons.mjs` 无依赖生成（纯 zlib 手写 PNG，不需 sharp）：
`icon-192.png` / `icon-512.png` / `maskable-512.png` / `apple-touch-icon.png`，外加矢量 `public/icons/icon.svg`。
修改图案直接改脚本里的 `render()` 后重跑。

## 安装入口

`components/layout/InstallPrompt.tsx` 捕获 `beforeinstallprompt`，在右上角显示「Install」按钮调起原生安装。iOS Safari 无此事件，需用户手动「添加到主屏幕」。
