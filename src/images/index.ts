/**
 * ================================================================
 * Arise Studio · 全站静态素材清单
 *
 * 目录约定：
 *   src/images/icons/        通用图标素材（跨页面共享，静态 import）
 *   public/resume/           简历页 PDF（需要公开 URL 直链，按 Next 规范留在 public）
 *   src/app/favicon.ico      站点图标（Next 文件约定，只能在 app 顶层自动注入 <head>）
 *
 * 原型中实际渲染的图形并不来自外部图片文件，而是内联 SVG + CSS 渐变：
 *   - src/components/app/Shell.tsx     主题日/月图标、Tweaks 滑块图标（内联 SVG，继承 currentColor）
 *   - src/components/charts/Charts.tsx spark / donut / gantt 图表（内联 SVG，随主题变量着色）
 *   - src/styles/pages/HomePage.css    .portrait 品牌占位视觉（渐变 + 伪元素 + 网格线）
 *   - src/styles/components/charts/Cards.css .cover 项目封面（渐变 + 圆环伪元素）
 * 这些图形依赖 CSS 变量与 currentColor，故保留内联实现，不拆成静态图片。
 * ================================================================
 */
import fileIcon from "./icons/file.svg";
import globeIcon from "./icons/globe.svg";
import nextIcon from "./icons/next.svg";
import vercelIcon from "./icons/vercel.svg";
import windowIcon from "./icons/window.svg";

/** 站点级品牌素材：favicon 由 src/app/favicon.ico 文件约定自动注入，无需手动 import */
export const BRAND_ASSETS = {
  favicon: "/favicon.ico",
} as const;

/** 通用图标素材：create-next-app 模板遗留，当前页面未引用，供后续 UI 取用 */
export const ICON_ASSETS = {
  file: fileIcon,
  globe: globeIcon,
  next: nextIcon,
  vercel: vercelIcon,
  window: windowIcon,
} as const;

/** 简历页文档：public/ 下的直链路径；当前原型标注「公开脱敏 PDF 尚未配置」，故未在页面启用 */
export const RESUME_ASSETS = {
  zh: "/resume/李根-前端开发工程师简历202611.pdf",
  en: "/resume/Gen-Li-Frontend-Developer-Resume-202611.pdf",
} as const;
