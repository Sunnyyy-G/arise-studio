/**
 * 移动 H5 SPA 入口（catch-all）。
 * 承担 /mobi、/mobi/home、/mobi/project-1、/mobi/knowledge 等全部路径的
 * 直达与刷新：从 slug 解析初始 page / selected，交给 MobiProvider。
 * 之后页面内导航由 history.pushState + popstate 处理（保留 push/pop 转场动效），
 * 不再触发 Next 路由跳转。
 */
import { MobiProvider } from "@/components/mobi/MobiContext";
import { MobiApp } from "@/components/mobi/MobiApp";
import { VALID_PAGES, type MobiPage } from "@/lib/mobiConfig";

export function generateStaticParams() {
  const pages = ["home", "projects", "resume", "knowledge", "about", "contact", "privacy", "404"];
  const details = Array.from({ length: 4 }, (_, i) => `project-${i + 1}`);
  const articles = Array.from({ length: 3 }, (_, i) => `article-${i + 1}`);
  return [{ slug: [] as string[] }, ...[...pages, ...details, ...articles].map((s) => ({ slug: [s] }))];
}

export default async function MobiPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const seg = (slug && slug[0]) || "home";
  const [p0, id] = seg.split("-");
  const initialPage: MobiPage = VALID_PAGES.includes(p0 as MobiPage) ? (p0 as MobiPage) : "home";
  const initialSelected = id ? Number(id) : 1;
  return (
    <MobiProvider initialPage={initialPage} initialSelected={initialSelected}>
      <MobiApp />
    </MobiProvider>
  );
}
