# Arise Studio

李根 / Li Gen 的前端工程实践作品集，按 `07-iOS简约风交互原型.html` 原型稿 100% 还原。
单页应用（SPA + hash 路由），完整实现中英双语、深浅主题、主题色/密度/动效档位切换，
以及图表 0→值过渡、滚动渐显、顶部滚动进度条等动效。

- 框架：Next.js 16.4.4（App Router）/ React 19 / TypeScript
- 样式：原生 CSS，按页面/组件拆分到 `src/styles/`（不用 Tailwind 运行时）
- 脚本：`dev` / `build` / `start` / `lint`（见 `package.json`）

## 本地运行（推荐：生产模式）

```bash
npm run build     # 生成 .next 生产产物
npm run start     # 以生产模式启动，默认 http://localhost:3000
```

局域网访问：`http://<本机IP>:3000`（如 `http://192.168.255.10:3000`）。

开发调试也可用 `npm run dev`，但**务必看下面的注意事项**。

## ⚠️ 运行注意事项（重要）

本项目多次出现「整页白屏 / 样式全丢 / 动效消失 / 交互失效」，根因都不是还原逻辑，
而是 **dev 与生产模式混跑、共用 `.next` 目录**导致 CSS/JS chunk 失配或 hydration 中断。
请遵守：

1. **同一时间只跑一个服务。** `next dev` 和 `next start` 不能同时存在，也不要留着上一次的
   dev worker 进程。两者共用 `.next`，互相覆盖产物会导致：
   - CSS 请求返回 `HTTP 500` → `--accent` 为空、body 背景透明、`.reveal` 过渡失效 → 大片空白；
   - React hydration 中断 → `.reveal` 一直停在 `opacity:0`、语言/主题/路由点击无反应。
2. **不要在 dev 开着时跑 `npm run build`。** 这会覆盖正在运行的 dev 所依赖的 `.next`，
   产生完全相同的白屏问题。
3. **改完代码按固定顺序重启：** 停服务 → `npm run build` → `npm run start`。
   改了 CSS / 组件后，`start` 读的是构建产物，不重新 build 就看不到更新。
4. **局域网 / 非 localhost 访问请用生产模式。** dev 模式从 `192.168.x.x` 这类非 localhost
   主机访问时，Next 16 的 HMR WebSocket 会握手失败（控制台
   `ws://.../_next/hmr failed: ERR_INVALID_HTTP_RESPONSE`），并可能连带 hydration 异常。
   生产模式无 HMR，无此问题。
5. **确认服务真的起来了。** `next start`/`next dev` 后台启动偶发竞态，端口未监听时先重跑，
   看到 `✓ Ready` 再访问。
6. **改完用浏览器硬刷新**（Ctrl/Cmd+Shift+R），避免旧 CSS/JS 缓存。

### 排查速查

| 现象 | 先检查 |
|---|---|
| 大面积空白、`--accent` 为空、CSS 请求 500 | 是否同时有 `dev` + `start`；停全部进程、删 `.next`、重新 build → start |
| 内容占位但不可见、交互失效 | 是否从局域网用 dev 模式访问；改用生产模式 |
| `ws://.../_next/hmr failed` | 同上，非 localhost 的 dev 访问固有现象，生产模式无 |
| 改动没生效 | `start` 读产物，需重新 `build` |

一键停掉所有相关进程（PowerShell）：

```powershell
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
  Where-Object { $_.CommandLine -match 'arise-studio' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

## 目录结构

```
src/
├── app/
│   ├── layout.tsx          全站样式唯一入口：按层叠顺序引入 src/styles/ 下所有 CSS
│   ├── page.tsx            SPA 入口（返回 null，内容由 <App /> 渲染）
│   └── favicon.ico         站点图标（Next 文件约定，自动注入 <head>）
├── components/
│   ├── app/                App / AppContext / Shell / useReveal / useTip
│   ├── charts/             Charts.tsx / Cards.tsx（图表与卡片组件）
│   └── pages/              Home / Projects / ProjectDetail / Resume / Knowledge / Article / Info
├── styles/                 ← CSS 按「页面 / 组件」拆分，全部在 layout.tsx 按序引入
│   ├── base/               tokens.css（设计变量）/ base.css（基线）/ motion.css（动效）
│   ├── components/
│   │   ├── app/            Shell / Dock / Toast / Tweaks
│   │   ├── charts/         Cards / Charts（含图表 0→值过渡）
│   │   └── ui/             common.css（通用按钮/区块/栅格/卡片/徽标）
│   ├── pages/              各页面同名 .css
│   ├── responsive.css      响应式（必须靠后）
│   └── print.css           打印（必须最后）
├── images/                 ← 图片素材
│   ├── icons/              通用图标 svg
│   └── index.ts            素材清单（BRAND_ASSETS / ICON_ASSETS / RESUME_ASSETS）
└── lib/data.ts             全站数据（项目 / 知识 / 经历，中英双语）
public/resume/               简历 PDF（需公开 URL 直链，按 Next 规范放 public）
```

### CSS 拆分约定

- **所有 `@/styles/*.css` 的 import 只写在 `src/app/layout.tsx`**，组件内不要各自 import CSS，
  否则构建后的层叠顺序不稳定，会破坏动效与主题覆盖。
- 引入顺序固定：`tokens → base → motion → components → pages → responsive → print`。
  其中 `common.css` 必须早于 `Cards.css` / `Charts.css`，`responsive.css` / `print.css` 必须最后。
- 新增页面/组件样式时：在对应 `styles/pages/` 或 `styles/components/` 建同名文件，
  再到 `layout.tsx` 按上述顺序补一行 import。

### 图片素材说明

原型里实际渲染的图形**不是外部位图**，而是内联 SVG + CSS 渐变，且依赖主题变量与
`currentColor`，因此保留内联实现、不拆成静态图片：

| 视觉 | 位置 |
|---|---|
| 主题日/月、Tweaks 滑块图标 | `src/components/app/Shell.tsx`（内联 SVG） |
| spark / donut / gantt / matrix / flow 图表 | `src/components/charts/Charts.tsx`（内联 SVG） |
| Hero 品牌展示卡 | `src/styles/pages/HomePage.css`（`.portrait` 渐变 + 伪元素） |
| 项目封面 | `src/styles/components/charts/Cards.css`（`.cover` 渐变 + 圆环） |

`src/images/icons/` 为 create-next-app 遗留的通用图标，当前页面未直接引用，供后续 UI 取用。

## 动效与交互

- 入场渐显：`.reveal` 初始 `opacity:0`，视口内元素挂载即加 `.in`，视口外由
  `IntersectionObserver`（`src/components/app/useReveal.ts`）滚入触发，无定时兜底。
- 图表 0→值：条/环/时间轴/matrix/flow 初始为 0 态，`.in` 后经 CSS transition 过渡到目标值；
  数字 `0→N` 由 `useCountUp` 缓出计数。
- 顶部进度条：`src/components/app/Shell.tsx` 监听 `scroll` 写入宽度。
- 进页 / 刷新 / 切页 / 切语言都会重播动效（对应原型 `render() + mount()` 全量重建）。
- 主题 / 主题色 / 密度 / 动效档位（完整·精简·关闭）在 `AppContext` 中管理，写入
  `<html data-*>`，并持久化到 localStorage。

> 说明：全页长截图（fullPage）在 reveal 元素未滚入视口时会显示大片空白，这是滚动渐显的
> 预期行为，不是内容缺失。验证请实际滚动，或用视口截图逐屏查看。

## 校验命令

```bash
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript 类型检查
npm run build      # 生产构建（含静态预渲染）
```
