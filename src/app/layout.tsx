/**
 * 全站样式唯一入口：按「设计变量 → 基础 → 动效 → 组件 → 页面 → 响应式 → 打印」
 * 的层叠顺序引入 src/styles/ 下按组件/页面拆分的样式文件。
 * Next.js 建议把 CSS import 收敛到单一 TS 入口以保证顺序稳定
 * （见 node_modules/next/dist/docs/01-app/01-getting-started/11-css.md）。
 * 注意：common.css 必须早于 Cards.css / Charts.css，responsive.css / print.css 必须最后。
 */
import "@/styles/base/tokens.css";
import "@/styles/base/base.css";
import "@/styles/base/motion.css";
import "@/styles/components/app/Shell.css";
import "@/styles/components/app/Dock.css";
import "@/styles/components/app/Toast.css";
import "@/styles/components/ui/common.css";
import "@/styles/pages/ProjectsPage.css";
import "@/styles/pages/ProjectDetailPage.css";
import "@/styles/pages/HomePage.css";
import "@/styles/components/charts/Cards.css";
import "@/styles/components/charts/Charts.css";
import "@/styles/pages/ResumePage.css";
import "@/styles/pages/KnowledgePage.css";
import "@/styles/pages/ArticlePage.css";
import "@/styles/pages/InfoPages.css";
import "@/styles/components/app/Tweaks.css";
import "@/styles/responsive.css";
import "@/styles/print.css";
import type { Metadata } from "next";
import { AppProvider } from "@/components/app/AppContext";
import { Header, Dock, Footer, Progress, Toast, ChartTip, TweaksFab, TweaksPanel, ToolsBar } from "@/components/app/Shell";
import { App } from "@/components/app/App";

export const metadata: Metadata = {
  title: "Arise Studio · 公共端交互原型 / iOS 简约风优化版 v2",
  description: "Arise Studio · 李根 / Li Gen — 前端工程实践作品集交互原型（iOS 简约风优化版）",
};

/* 仅在脚本被禁用时生效的兜底：原型内容依赖 JS 的 render()/mount() 才呈现，
   禁用脚本时让静态内容保持可见。JS 启用时浏览器不解析 <noscript> 内容，
   因此下面的 !important 完成态完全不会进入 CSSOM，不影响任何入场动画。 */
const NO_JS_CSS = `.reveal{opacity:1!important;transform:none!important}
.stat .stat-bar i{width:var(--bar,72%)!important}
.donut-seg{stroke-dasharray:var(--dash)!important}
.bar-fill{width:var(--w)!important}
.tl-svg .tl-bar{transform:scaleX(1)!important}
.matrix .mx-cell{opacity:1!important;transform:scale(1)!important}
.flow-node{opacity:1!important;transform:none!important}
.spark polyline{stroke-dashoffset:0!important}`;

export default function RootLayout() {
  return (
    <html lang="zh-CN" data-theme="light" data-accent="blue" data-density="comfortable" data-motion="full" suppressHydrationWarning>
      <body>
        <noscript><style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} /></noscript>
        <AppProvider>
          <ToolsBar />
          <Progress />
          <div className="shell">
            <Header />
            <main id="app">
              <App />
            </main>
            <Footer />
            <Dock />
          </div>
          <Toast />
          <ChartTip />
          <TweaksFab />
          <TweaksPanel />
        </AppProvider>
      </body>
    </html>
  );
}