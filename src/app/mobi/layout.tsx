/**
 * 移动 H5 布局 —— 对应「09-iOS简约风移动H5交互原型.html」。
 * 仅在此路由树引入移动端样式（src/styles/mobi/*），与 PC (pc) 路由树完全隔离。
 * 路由：/mobi、/mobi/home、/mobi/project-1 等由 [[...slug]] catch-all 承接。
 */
import "@/styles/mobi/base/tokens.css";
import "@/styles/mobi/base/base.css";
import "@/styles/mobi/base/motion.css";
import "@/styles/mobi/components/app/chrome.css";
import "@/styles/mobi/components/ui/common.css";
import "@/styles/mobi/pages/HomePage.css";
import "@/styles/mobi/components/charts/Cards.css";
import "@/styles/mobi/components/charts/Charts.css";
import "@/styles/mobi/components/app/Sheets.css";
import "@/styles/mobi/fullscreen.css";

export const metadata = {
  title: "Arise Studio · 公共端交互原型 / iOS 简约风移动 H5 优化版 v2",
  description: "Arise Studio · 李根 / Li Gen — 移动 H5 端交互原型（iOS 简约风优化版）",
};

/* 禁用脚本时的静态兜底（移动端图表 0 态依赖 mount() 加 .in） */
const NO_JS_CSS = `.reveal{opacity:1!important;transform:none!important}
.chart-card.in .donut-seg,.donut-seg{stroke-dasharray:var(--dash)!important}
.chart-card.in .bar-fill,.bar-fill{width:var(--w)!important}
.chart-card.in .step .st-bar,.step .st-bar{width:var(--sw)!important}
.chart-card.in .matrix .mx-cell,.matrix .mx-cell{opacity:1!important;transform:scale(1)!important}
.chart-card.in .flow-node,.flow-node{opacity:1!important;transform:none!important}
.cap.in .cap-bar i,.cap .cap-bar i{width:var(--bar,72%)!important}
.metric.in .spark polyline,.spark polyline{stroke-dashoffset:0!important}`;

export default function MobiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <noscript><style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} /></noscript>
      {children}
    </>
  );
}
