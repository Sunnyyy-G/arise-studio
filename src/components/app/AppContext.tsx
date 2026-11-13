"use client";

/**
 * ================================================================
 * Arise Studio · 全局应用状态
 * 完整对应原型顶层可变量：lang / page / selected / query / queryOwner /
 * type / nk，以及 Tweaks 偏好 PREF（theme/accent/motion/density）。
 * 所有跳转函数（go/toggleLang/toggleTheme/...）与原型同名同义。
 * ================================================================
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type PageName =
  | "home"
  | "projects"
  | "project"
  | "resume"
  | "knowledge"
  | "article"
  | "about"
  | "contact"
  | "privacy"
  | "404";

export type Lang = "zh" | "en";
export type Theme = "light" | "dark";
export type Accent = "blue" | "indigo" | "teal";
export type Motion = "full" | "lite" | "off";
export type Density = "comfortable" | "compact";

interface Pref {
  theme: Theme;
  accent: Accent;
  motion: Motion;
  density: Density;
}

const DEFAULT_PREF: Pref = { theme: "light", accent: "blue", motion: "full", density: "comfortable" };
const VALID_PAGES: PageName[] = [
  "home",
  "projects",
  "resume",
  "knowledge",
  "about",
  "contact",
  "privacy",
  "404",
  "project",
  "article",
];

interface AppState {
  lang: Lang;
  page: PageName;
  selected: number;
  query: string;
  type: string;
  nk: string;
  pref: Pref;
  drawerOpen: boolean;
  tweaksOpen: boolean;
  toastMsg: string | null;
  t: (zh: string, en: string) => string;
  go: (page: PageName, id?: number) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
  setPref: (key: keyof Pref, value: string) => void;
  toggleTweaks: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
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

const Ctx = createContext<AppState | null>(null);

function readPref(): Pref {
  if (typeof window === "undefined") return DEFAULT_PREF;
  try {
    const raw = window.localStorage.getItem("arise-ios-pref");
    if (!raw) return DEFAULT_PREF;
    return { ...DEFAULT_PREF, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREF;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  /* 惰性初始化：读取本地偏好 + 解析 hash（避免 effect 中调用 setState） */
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "zh";
    try {
      const saved = window.localStorage.getItem("arise-ios-lang");
      return saved === "en" || saved === "zh" ? saved : "zh";
    } catch {
      return "zh";
    }
  });
  const [pref, setPrefState] = useState<Pref>(() => readPref());
  const [page, setPage] = useState<PageName>(() => {
    if (typeof window === "undefined") return "home";
    const hash = window.location.hash.slice(1);
    const [p0] = hash.split("-");
    return VALID_PAGES.includes(p0 as PageName) ? (p0 as PageName) : "home";
  });
  const [selected, setSelected] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const hash = window.location.hash.slice(1);
    const [, id] = hash.split("-");
    return id ? Number(id) : 1;
  });
  const [query, setQueryState] = useState("");
  const [type, setTypeState] = useState("全部");
  const [nk, setNkState] = useState("全部");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const goHash = useRef<string | null>(null);
  const queryOwnerRef = useRef("");

  /* ---------- 文案函数：t(zh,en) ---------- */
  const t = useCallback((zh: string, en: string) => (lang === "zh" ? zh : en), [lang]);

  /* ---------- 偏好应用到 document + 本地保存 ---------- */
  useEffect(() => {
    const d = document.documentElement;
    d.dataset.theme = pref.theme;
    d.dataset.accent = pref.accent;
    d.dataset.motion = pref.motion;
    d.dataset.density = pref.density;
    try {
      window.localStorage.setItem("arise-ios-pref", JSON.stringify(pref));
    } catch {}
  }, [pref]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem("arise-ios-lang", lang);
    } catch {}
  }, [lang]);

  /* ---------- 搜索词按页面隔离（与原型 render() 开头逻辑一致） ---------- */
  const isolateQuery = useCallback((p: PageName) => {
    setQueryState((q) => {
      if ((p === "projects" || p === "knowledge") && queryOwnerRef.current !== p) {
        queryOwnerRef.current = p;
        return "";
      }
      return q;
    });
  }, []);

  /* ---------- hash 路由监听 ---------- */
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (h && h === goHash.current) {
        goHash.current = null;
        return;
      }
      goHash.current = null;
      if (!h) return;
      const [p0, id] = h.split("-");
      if (VALID_PAGES.includes(p0 as PageName)) {
        const p = p0 as PageName;
        setPage(p);
        if (id) setSelected(Number(id));
        isolateQuery(p);
        setDrawerOpen(false);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isolateQuery]);

  /* ---------- 交互原语 ---------- */
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 3500);
  }, []);

  const go = useCallback((p: PageName, id?: number) => {
    setPage(p);
    if (id) setSelected(id);
    setDrawerOpen(false);
    isolateQuery(p);
    window.scrollTo(0, 0);
    const h = p + (id ? "-" + id : "");
    goHash.current = h;
    window.location.hash = h;
  }, [isolateQuery]);

  const toggleLang = useCallback(() => setLang((l) => (l === "zh" ? "en" : "zh")), []);
  const toggleTheme = useCallback(() => {
    setPrefState((pr) => ({ ...pr, theme: pr.theme === "dark" ? "light" : "dark" }));
  }, []);
  const setPref = useCallback((key: keyof Pref, value: string) => {
    setPrefState((pr) => ({ ...pr, [key]: value } as Pref));
  }, []);
  const toggleTweaks = useCallback(() => setTweaksOpen((v) => !v), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((v) => !v), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const setQuery = useCallback((q: string) => setQueryState(q), []);
  const setType = useCallback((v: string) => setTypeState(v), []);
  const setNk = useCallback((v: string) => setNkState(v), []);
  const resetProjectFilters = useCallback(() => {
    setQueryState("");
    setTypeState("全部");
  }, []);
  const resetNoteFilters = useCallback(() => {
    setQueryState("");
    setNkState("全部");
  }, []);

  const filterByTag = useCallback(
    (tag: string) => {
      setQueryState(tag);
      queryOwnerRef.current = "projects";
      setTypeState("全部");
      setPage("projects");
      window.scrollTo(0, 0);
      toast(t(`已按「${tag}」筛选作品`, `Filtered by ${tag}`));
    },
    [t, toast]
  );

  const copyText = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast(t("已复制", "Copied"));
      } catch {
        toast(t("当前环境无法自动复制，请选中文本手动复制", "Please select and copy manually"));
      }
    },
    [t, toast]
  );

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  }, []);

  const value: AppState = {
    lang,
    page,
    selected,
    query,
    type,
    nk,
    pref,
    drawerOpen,
    tweaksOpen,
    toastMsg,
    t,
    go,
    toggleLang,
    toggleTheme,
    setPref,
    toggleTweaks,
    toggleDrawer,
    closeDrawer,
    setQuery,
    setType,
    setNk,
    resetProjectFilters,
    resetNoteFilters,
    filterByTag,
    toast,
    copyText,
    scrollToId,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}