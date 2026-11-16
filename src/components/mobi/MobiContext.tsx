"use client";

/**
 * ================================================================
 * Arise Studio · 移动 H5 · 全局状态
 * 对应 09 原型顶层变量：lang / page / selected / query / queryOwner /
 * type / nk、PREF（theme/accent/motion/density/frame）、go/render 等。
 *
 * 路由差异：原型用 location.hash；本版按需求用 /mobi/* 路径。
 * 采用 history.pushState + popstate 实现无刷新路径跳转（保留 push/pop
 * 转场动效），直达/刷新由 app/mobi/[[...slug]]/page.tsx 承接初始状态。
 * ================================================================
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VALID_PAGES, pathFor, type MobiPage } from "@/lib/mobiConfig";

export type { MobiPage } from "@/lib/mobiConfig";
export type Lang = "zh" | "en";
export type Theme = "light" | "dark";
export type Accent = "blue" | "indigo" | "teal";
export type Motion = "full" | "lite" | "off";
export type Density = "comfortable" | "compact";
export type Frame = "on" | "off";
export type Sheet = "menu" | "tweaks" | null;

interface Pref { theme: Theme; accent: Accent; motion: Motion; density: Density; frame: Frame }
const DEFAULT_PREF: Pref = { theme: "light", accent: "blue", motion: "full", density: "comfortable", frame: "on" };

interface MobiState {
  lang: Lang;
  page: MobiPage;
  selected: number;
  query: string;
  type: string;
  nk: string;
  pref: Pref;
  sheet: Sheet;
  toastMsg: string | null;
  navKey: number;        // 每次 render() 自增，用于整页重建重播动效
  dir: "push" | "pop";
  t: (zh: string, en: string) => string;
  go: (p: MobiPage, id?: number, dir?: "push" | "pop") => void;
  toggleLang: () => void;
  toggleTheme: () => void;
  toggleFrame: () => void;
  setPref: (key: keyof Pref, value: string) => void;
  openSheet: (k: Exclude<Sheet, null>) => void;
  closeSheet: () => void;
  setQuery: (q: string) => void;
  setType: (v: string) => void;
  setNk: (v: string) => void;
  resetProjectFilters: () => void;
  resetNoteFilters: () => void;
  filterByTag: (tag: string) => void;
  toast: (msg: string) => void;
  copyText: (text: string) => void;
  scrollToId: (id: string) => void;
}

const Ctx = createContext<MobiState | null>(null);

export function MobiProvider({
  children,
  initialPage = "home",
  initialSelected = 1,
}: {
  children: React.ReactNode;
  initialPage?: MobiPage;
  initialSelected?: number;
}) {
  /* 初始值 SSR 安全：默认 zh / 默认 pref；localStorage 在 effect 里应用，避免 hydration 文本不匹配 */
  const [lang, setLang] = useState<Lang>("zh");
  const [pref, setPrefState] = useState<Pref>(DEFAULT_PREF);
  const [page, setPage] = useState<MobiPage>(initialPage);
  const [selected, setSelected] = useState<number>(initialSelected);
  const [query, setQueryState] = useState("");
  const [type, setTypeState] = useState("全部");
  const [nk, setNkState] = useState("全部");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [navKey, setNavKey] = useState(0);
  const [dir, setDir] = useState<"push" | "pop">("push");

  const toastTimer = useRef<number | undefined>(undefined);
  const queryOwnerRef = useRef("");
  const pageRef = useRef<MobiPage>(initialPage);

  const t = useCallback((zh: string, en: string) => (lang === "zh" ? zh : en), [lang]);
  const bump = useCallback((d: "push" | "pop") => { setDir(d); setNavKey((n) => n + 1); }, []);

  /* ---------- 偏好：应用 document + 本地保存（对应 applyPref） ---------- */
  useEffect(() => {
    const d = document.documentElement;
    (["theme", "accent", "motion", "density", "frame"] as const).forEach((k) => { d.dataset[k] = pref[k]; });
    try { window.localStorage.setItem("arise-ios-pref", JSON.stringify(pref)); } catch {}
  }, [pref]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try { window.localStorage.setItem("arise-ios-lang", lang); } catch {}
  }, [lang]);

  /* 首次挂载：读取本地偏好与语言。
     放入 microtask 异步执行，避免 effect 内同步 setState 造成级联渲染（react-hooks/set-state-in-effect）。
     首帧 SSR 与 hydration 都用默认值，microtask 后才应用偏好，文本一致性不受影响。 */
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem("arise-ios-pref");
        if (raw) setPrefState({ ...DEFAULT_PREF, ...JSON.parse(raw) });
        const l = window.localStorage.getItem("arise-ios-lang");
        if (l === "en" || l === "zh") setLang(l);
      } catch {}
    });
    // 规范化首次 URL 与 history.state，保证 popstate 有据可依
    const p = pageRef.current;
    const st = { __mobi: true, page: p, selected };
    window.history.replaceState(st, "", pathFor(p, p === "project" || p === "article" ? selected : undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅首次挂载
  }, []);

  /* ---------- 搜索词按页面隔离（对应 render() 开头） ---------- */
  const isolateQuery = useCallback((p: MobiPage) => {
    setQueryState((q) => {
      if ((p === "projects" || p === "knowledge") && queryOwnerRef.current !== p) {
        queryOwnerRef.current = p;
        return "";
      }
      return q;
    });
  }, []);

  /* ---------- 应用一个路由（go 与 popstate 共用） ---------- */
  const applyRoute = useCallback((p: MobiPage, id: number | undefined, d: "push" | "pop") => {
    pageRef.current = p;
    setPage(p);
    if (id) setSelected(id);
    setSheet(null);
    isolateQuery(p);
    bump(d);
    const app = document.getElementById("mobiApp");
    if (app) app.scrollTop = 0;
    const screen = document.getElementById("screen");
    screen?.classList.remove("compact");
  }, [isolateQuery, bump]);

  /* ---------- popstate（浏览器前进/后退） ---------- */
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const st = e.state as { __mobi?: boolean; page?: MobiPage; selected?: number } | null;
      if (st && st.__mobi && st.page) { applyRoute(st.page, st.selected, "pop"); return; }
      // 兜底：解析当前路径
      const seg = window.location.pathname.replace(/^\/mobi\/?/, "").split("-");
      const p = seg[0] as MobiPage;
      if (VALID_PAGES.includes(p)) applyRoute(p, seg[1] ? Number(seg[1]) : undefined, "pop");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute]);

  /* ---------- 交互原语 ---------- */
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 3500);
  }, []);

  const go = useCallback((p: MobiPage, id?: number, d?: "push" | "pop") => {
    const prev = pageRef.current;
    const dirFinal = d ?? ((p === "home" || (p === "projects" && prev === "project") || (p === "knowledge" && prev === "article")) ? "pop" : "push");
    const st = { __mobi: true, page: p, selected: id ?? selected };
    window.history.pushState(st, "", pathFor(p, id));
    applyRoute(p, id, dirFinal);
  }, [selected, applyRoute]);

  const toggleLang = useCallback(() => { setLang((l) => (l === "zh" ? "en" : "zh")); bump("push"); }, [bump]);
  const toggleTheme = useCallback(() => setPrefState((pr) => ({ ...pr, theme: pr.theme === "dark" ? "light" : "dark" })), []);
  const toggleFrame = useCallback(() => setPrefState((pr) => ({ ...pr, frame: pr.frame === "on" ? "off" : "on" })), []);
  const setPref = useCallback((key: keyof Pref, value: string) => setPrefState((pr) => ({ ...pr, [key]: value } as Pref)), []);

  const openSheet = useCallback((k: Exclude<Sheet, null>) => setSheet(k), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const setQuery = useCallback((q: string) => setQueryState(q), []);
  const setType = useCallback((v: string) => { setTypeState(v); bump("push"); }, [bump]);
  const setNk = useCallback((v: string) => { setNkState(v); bump("push"); }, [bump]);
  const resetProjectFilters = useCallback(() => { setQueryState(""); setTypeState("全部"); bump("push"); }, [bump]);
  const resetNoteFilters = useCallback(() => { setQueryState(""); setNkState("全部"); bump("push"); }, [bump]);

  const filterByTag = useCallback((tag: string) => {
    queryOwnerRef.current = "projects";       // 使 go 内 isolateQuery 不清空
    setQueryState(tag);
    setTypeState("全部");
    go("projects");
    toast(t(`已按「${tag}」筛选作品`, `Filtered by ${tag}`));
  }, [go, t, toast]);

  const copyText = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast(t("已复制", "Copied")); }
    catch { toast(t("当前环境无法自动复制，请选中文本手动复制", "Please select and copy manually")); }
  }, [t, toast]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    const app = document.getElementById("mobiApp");
    if (!el || !app) return;
    app.scrollTo({ top: el.getBoundingClientRect().top - app.getBoundingClientRect().top + app.scrollTop - 12, behavior: "smooth" });
  }, []);

  const value: MobiState = {
    lang, page, selected, query, type, nk, pref, sheet, toastMsg, navKey, dir, t, go,
    toggleLang, toggleTheme, toggleFrame, setPref, openSheet, closeSheet,
    setQuery, setType, setNk, resetProjectFilters, resetNoteFilters, filterByTag,
    toast, copyText, scrollToId,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMobi() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMobi must be used within MobiProvider");
  return ctx;
}
