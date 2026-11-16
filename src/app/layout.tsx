import type { Metadata } from "next";

/**
 * 根布局：只提供 <html>/<body> 骨架与共享初始 data-* 属性。
 * PC 与移动端是两套独立路由树、两套独立样式：
 *   - PC：src/app/(pc)/layout.tsx 引入 src/styles/* 并渲染 PC 外壳
 *   - 移动端：src/app/mobi/layout.tsx 引入 src/styles/mobi/* 并渲染设备框外壳
 * 两者 CSS 互不影响（不同 layout 树，不会同时加载）。
 */
export const metadata: Metadata = {
  title: "Arise Studio · 公共端交互原型 / iOS 简约风优化版 v2",
  description: "Arise Studio · 李根 / Li Gen — 前端工程实践作品集交互原型（iOS 简约风优化版）",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      data-theme="light"
      data-accent="blue"
      data-density="comfortable"
      data-motion="full"
      data-frame="on"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
