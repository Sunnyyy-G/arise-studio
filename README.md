# Arise Studio

李根 / Li Gen 的前端工程实践作品集，含 **PC 端**与**移动 H5 端**两套独立还原：

| 端 | 原型稿 | 路由 | 说明 |
|---|---|---|---|
| PC | `07-iOS简约风交互原型.html` | `/`（SPA + hash 路由，如 `/#projects`） | 深浅主题、中英双语、Tweaks、图表/动效 |
| 移动 H5 | `09-iOS简约风移动H5交互原型.html` | `/mobi/home`（如 `/mobi/projects`、`/mobi/project-1`） | 设备框/全屏双模式、push-pop 转场、底部 tabbar、Sheet、状态栏时钟 |

两套页面、两套文件、两套 CSS 完全分离（route group 隔离，互不加载）。
均完整实现中英双语、深浅主题、主题色/密度/动效档位切换，以及图表 0→值过渡、
滚动渐显、进度条等动效。

- 框架：Next.js 16.4.4（App Router）/ React 19 / TypeScript
- 样式：原生 CSS，PC 在 `src/styles/`、移动端在 `src/styles/mobi/`，均按页面/组件拆分（不用 Tailwind 运行时）
- 脚本：`dev` / `build` / `start` / `lint`（见 `package.json`）

### 路由与目录对应

```
src/app/
├── layout.tsx              根 <html>/<body> 骨架（共享初始 data-* 属性）
├── (pc)/
│   ├── layout.tsx          引入 src/styles/*，渲染 PC 外壳 + <App/>
│   └── page.tsx            PC 入口，路径 /
└── mobi/
    ├── layout.tsx          引入 src/styles/mobi/*，与 PC 样式隔离
    └── [[...slug]]/page.tsx catch-all：/mobi、/mobi/home、/mobi/project-1 …（可直达/刷新）
```

移动端内部导航用 `history.pushState` + `popstate`（保留 push/pop 转场动效，不触发 Next 跨树跳转），
**所有跳转目标均为 `/mobi/*`**，页面组件在 `src/components/mobi/`，数据在 `src/lib/mobiData.ts`
（复用 `src/lib/data.ts` 原始数据）。

### 自动切换到移动端

- `src/proxy.ts`（Next 16 起 `middleware` 已更名 `proxy`）：真实移动 UA 访问 PC 路径时返回
  引导页，按 `location.hash` 映射到对应 `/mobi/xxx` 后 `replace`（如 `/#projects` → `/mobi/projects`、
  `/#project-2` → `/mobi/project-2`）。`/mobi/*` 直接放行，静态资源不拦截。
- `src/components/app/MobiRedirect.tsx`（仅 PC 路由树）：兜底 DevTools 切换设备不刷新的场景。
- PC ToolsBar 有「移动 H5 ↗」显式入口（`/mobi/home`）。
- **评审逃生口**：`/?force=pc` 或 cookie `arise-force-pc=1` 可强制留在 PC（桌面浏览器仅缩小窗口不会跳转，
  判断以 UA 为准）。

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
│   ├── layout.tsx          根 <html>/<body> 骨架（共享初始 data-* 属性）
│   ├── (pc)/
│   │   ├── layout.tsx      引入 src/styles/*，渲染 PC 外壳 + <App/>（路径 /）
│   │   └── page.tsx        PC SPA 入口
│   ├── mobi/
│   │   ├── layout.tsx      引入 src/styles/mobi/*，与 PC 样式隔离
│   │   └── [[...slug]]/    catch-all：/mobi、/mobi/home、/mobi/project-1 …
│   └── favicon.ico         站点图标（Next 文件约定，自动注入 <head>）
├── components/
│   ├── app/                PC：App / AppContext / Shell / useReveal / useTip
│   ├── charts/             PC：Charts.tsx / Cards.tsx
│   ├── pages/              PC：Home / Projects / ProjectDetail / Resume / Knowledge / Article / Info
│   └── mobi/               移动端全套（独立文件，与 PC 不共用组件）
│       ├── MobiContext.tsx / MobiApp.tsx / MobiCharts.tsx / MobiCards.tsx
│       └── pages/          MobiHome / MobiProjects / MobiResume / MobiKnowledge / MobiInfo
├── styles/                 ← PC CSS，按「页面 / 组件」拆分，仅在 (pc)/layout.tsx 按序引入
│   ├── base/               tokens.css / base.css / motion.css
│   ├── components/{app,charts,ui}/  Shell / Dock / Toast / Tweaks / Cards / Charts / common
│   ├── pages/              各页面同名 .css
│   ├── responsive.css      响应式（必须靠后）
│   └── print.css           打印（必须最后）
├── styles/mobi/            ← 移动 H5 CSS，仅在 mobi/layout.tsx 按序引入（与 PC 隔离）
│   ├── base/               tokens / base / motion
│   ├── components/{app,charts,ui}/  chrome / Sheets / Cards / Charts / common
│   ├── pages/HomePage.css  Hero / Capability
│   └── fullscreen.css      全屏 H5 模式 + 打印（必须最后）
├── images/                 ← 图片素材
│   ├── icons/              通用图标 svg
│   └── index.ts            素材清单
└── lib/
    ├── data.ts             全站原始数据（项目 / 知识 / 经历，中英双语，PC 与移动端共用）
    ├── mobiData.ts         移动端数据（复用 data.ts + stepper 时间轴行 / ICONS）
    └── mobiConfig.ts       移动端路由常量与类型（Server/Client 共用的纯数据）
public/resume/               简历 PDF（需公开 URL 直链，按 Next 规范放 public）
```

### CSS 拆分约定

- **两套 CSS 由各自 layout 独立引入**（`(pc)/layout.tsx` 引 `styles/*`，`mobi/layout.tsx` 引
  `styles/mobi/*`）。两个路由树不会同时加载，因此同名类（`.card/.btn/.reveal/.metric` 等）互不覆盖。
  **不要把移动端 CSS 引到 PC 的 layout，也不要把 `@/styles/*.css` 从 `"use client"` 组件里 import。**
- 每个 layout 内 import 只集中在自己文件，组件内不各自 import CSS，保证层叠顺序稳定。
- PC 引入顺序：`tokens → base → motion → components → pages → responsive → print`
  （`common.css` 早于 `Cards/Charts`，`responsive/print` 最后）。
- 移动端引入顺序：`tokens → base → motion → chrome → common → HomePage → Cards → Charts → Sheets → fullscreen`
  （`fullscreen.css` 必须最后，覆盖设备框）。
- 新增样式：在对应 `styles/pages/`（或 `styles/mobi/...`）建同名文件，再到对应 layout 按序补一行 import。

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

移动端（`/mobi/*`）额外：

- 设备框 / 全屏双模式：`data-frame` + `@media(max-width:760px)`；窄屏（真机）自动全屏，
  隐藏 statusbar / home-ind / stage-tools，navbar 与 tabbar 适配 safe-area。
- push/pop 转场：`.page`(pushIn) / `.page.pop`(popIn)，由 `MobiContext.go()` 依据页面关系判定方向；
  浏览器前进/后退经 `popstate` 用 pop 方向重放。
- 动效集中挂载：`MobiApp.tsx` 的 `mount()` 以 `#mobiApp` 为 IntersectionObserver 的 root
  （不是 window），对视口内 chart-card/metric/cap 同步加 `.in` 触发 0→值；数字 `0→N` 缓出计数。
- 图表形态与 PC 不同：stepper 纵向时间轴、横向滚动 matrix、纵向 flow、2 列 metric/cap 列表。
- 顶部进度条随 `#mobiApp` 滚动变化，滚动 >56px 时 navbar 切紧凑态（`.screen.compact`）。
- 状态栏时钟、菜单 Sheet、Tweaks（含设备框/全屏预览档）、搜索筛选、图表点击联动全部还原。
- **navbar 贴顶过渡**：`#mobiApp` 滚动 >56px 时 `#screen` 加 `.compact`，`.nav-logo` 淡出、
  `.nav-title` 淡入（CSS 过渡），`.nav-progress` 随滚动增长；与 09 原型逐帧一致。
  注意这是**移动端 `/mobi/*` 的 navbar**，与 PC 的 `<header>` 是两套完全不同的组件。
- 偏好 `PREF`（theme/accent/motion/density/frame）与语言写 localStorage，键名与原型一致。

> 说明：全页长截图（fullPage）在 reveal 元素未滚入视口时会显示大片空白，这是滚动渐显的
> 预期行为，不是内容缺失。移动端 `#mobiApp` 是**独立滚动容器**，验证须滚动该容器
> （不是 window），或用视口截图逐屏查看。

## 校验命令

```bash
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript 类型检查
npm run build      # 生产构建（含静态预渲染）
```
