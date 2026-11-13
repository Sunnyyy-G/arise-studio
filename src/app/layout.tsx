import "./globals.css";
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