/**
 * PC 端布局 —— 对应「07-iOS简约风交互原型.html」。
 * 仅在此路由树引入 PC 样式（src/styles/*），与 src/app/mobi 的移动端样式互相隔离。
 * 全站 SPA + hash 路由：页面内容由 <App /> 依据全局 page 状态渲染。
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
import { AppProvider } from "@/components/app/AppContext";
import { Header, Dock, Footer, Progress, Toast, ChartTip, TweaksFab, TweaksPanel, ToolsBar } from "@/components/app/Shell";
import { App } from "@/components/app/App";
import { MobiRedirect } from "@/components/app/MobiRedirect";

/* 禁用脚本时的静态兜底（与原型 render()/mount() 依赖 JS 一致） */
const NO_JS_CSS = `.reveal{opacity:1!important;transform:none!important}
.stat .stat-bar i{width:var(--bar,72%)!important}
.donut-seg{stroke-dasharray:var(--dash)!important}
.bar-fill{width:var(--w)!important}
.tl-svg .tl-bar{transform:scaleX(1)!important}
.matrix .mx-cell{opacity:1!important;transform:scale(1)!important}
.flow-node{opacity:1!important;transform:none!important}
.spark polyline{stroke-dashoffset:0!important}`;

export default function PcLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <noscript><style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} /></noscript>
      <MobiRedirect />
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
        {children}
      </AppProvider>
    </>
  );
}
