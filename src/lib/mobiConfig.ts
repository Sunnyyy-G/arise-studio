/**
 * 移动 H5 路由常量与类型（纯数据，无 "use client"）。
 * Server Component（catch-all page）与 Client 模块（MobiContext）共用，
 * 避免从 "use client" 模块导出常量给 Server 端时 Next 的 client 代理问题。
 */
export type MobiPage =
  | "home" | "projects" | "project" | "resume" | "knowledge"
  | "article" | "about" | "contact" | "privacy" | "404";

export const VALID_PAGES: MobiPage[] = [
  "home", "projects", "resume", "knowledge", "about", "contact",
  "privacy", "404", "project", "article",
];

export function pathFor(p: MobiPage, id?: number) {
  return "/mobi/" + p + (id ? "-" + id : "");
}
