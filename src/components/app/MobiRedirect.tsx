"use client";

/**
 * PC 端的移动端自动切换兜底（与 src/proxy.ts 服务端重定向互补）。
 *
 * proxy.ts 处理「真实移动设备首次请求」；本组件处理服务端感知不到的场景：
 *   - DevTools 切换设备模拟后不刷新（navigator.userAgent 即时变化，但不会重发请求）
 *   - 把 PC 的 hash 路由映射到对应 /mobi/xxx（如 #projects → /mobi/projects）
 *
 * 只做 location.replace，不修改任何 React 会 diff 的 DOM，无 hydration 冲突。
 * 判断以 UA 为准（桌面浏览器仅缩小窗口不跳转），窄视口为辅助。
 * ?force=pc / cookie arise-force-pc=1 为评审逃生口。
 */
import { useEffect } from "react";

/* PC hash → 移动端路径片段（与 mobi catch-all 的 page 名一致） */
const PC_HASH_TO_MOBI: Record<string, string> = {
  home: "home", projects: "projects", resume: "resume", knowledge: "knowledge",
  about: "about", contact: "contact", privacy: "privacy", "404": "404",
};

function mobiTarget() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return "/mobi/home";
  const [p, id] = hash.split("-");
  const base = PC_HASH_TO_MOBI[p];
  if (base) return "/mobi/" + base;
  // project-N / article-N 等带 id 的详情路由
  if ((p === "project" || p === "article") && id) return "/mobi/" + p + "-" + id;
  return "/mobi/home";
}

function forcedPc() {
  const q = new URLSearchParams(window.location.search);
  if (q.get("force") === "pc") return true;
  return document.cookie.split(";").some((c) => c.trim().startsWith("arise-force-pc=1"));
}

function isMobileUA() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|Windows Phone/i.test(navigator.userAgent);
}

export function MobiRedirect() {
  useEffect(() => {
    const check = () => {
      if (forcedPc()) return;
      const narrow = window.matchMedia("(max-width: 760px)").matches;
      if (isMobileUA() && narrow) {
        const target = mobiTarget() + window.location.search;
        if (window.location.pathname + window.location.search !== target) {
          window.location.replace(target);
        }
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return null;
}
