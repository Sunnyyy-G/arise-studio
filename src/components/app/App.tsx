"use client";

// 样式：src/styles/base/motion.css 的 .page 入场动画（由 src/app/layout.tsx 统一按序引入）
/**
 * 主应用壳 —— 对应原型 render() 的页面分发（$('app').innerHTML=...)。
 * 保持原型的单页应用（SPA + hash 路由）架构：一个页面组件树，
 * 根据全局 page 状态渲染对应分支，无服务端路由跳转。
 */
import { useApp } from "@/components/app/AppContext";
import { HomePage } from "@/components/pages/HomePage";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { ProjectDetailPage } from "@/components/pages/ProjectDetailPage";
import { ResumePage } from "@/components/pages/ResumePage";
import { KnowledgePage } from "@/components/pages/KnowledgePage";
import { ArticlePage } from "@/components/pages/ArticlePage";
import { AboutPage, ContactPage, PrivacyPage, NotFoundIosPage } from "@/components/pages/InfoPages";

export function App() {
  const { page, lang, selected } = useApp();
  return (
    <div className="page" key={`${page}-${selected}-${lang}`}>
      {page === "home" && <HomePage />}
      {page === "projects" && <ProjectsPage />}
      {page === "project" && <ProjectDetailPage />}
      {page === "resume" && <ResumePage />}
      {page === "knowledge" && <KnowledgePage />}
      {page === "article" && <ArticlePage />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "404" && <NotFoundIosPage />}
    </div>
  );
}