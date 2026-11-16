"use client";

import Link from "next/link";

// 样式：src/styles/components/app/{Shell,Dock,Toast,Tweaks}.css（由 src/app/layout.tsx 统一按序引入）
/**
 * 应用外壳 —— 对应原型 header / nav / drawer / bottom(dock) /
 * progress / toast / tweak-fab / tweak-panel / footer。
 */
import { useApp } from "@/components/app/AppContext";
import { useEffect, useRef } from "react";
import type { PageName } from "@/components/app/AppContext";

const NAV_ITEMS: [PageName, string, string][] = [
  ["home", "首页", "Home"],
  ["projects", "作品", "Work"],
  ["resume", "简历", "Resume"],
  ["knowledge", "知识", "Knowledge"],
  ["about", "关于", "About"],
  ["contact", "联系", "Contact"],
];
const DOCK_PAGES: PageName[] = ["home", "projects", "knowledge", "resume"];

export function Header() {
  const { page, go, lang, toggleLang, pref, toggleTheme, drawerOpen, toggleDrawer } = useApp();
  const navRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ind = indRef.current;
    const nav = navRef.current;
    if (!ind || !nav) return;
    const active = nav.querySelector("button.active") as HTMLElement | null;
    if (!active || getComputedStyle(nav).display === "none") {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [page, lang]);

  useEffect(() => {
    const onResize = () => {
      const ind = indRef.current;
      const nav = navRef.current;
      if (!ind || !nav) return;
      const active = nav.querySelector("button.active") as HTMLElement | null;
      if (!active) return;
      ind.style.width = `${active.offsetWidth}px`;
      ind.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dark = pref.theme === "dark";

  return (
    <>
      <header>
        <div className="logo" role="button" tabIndex={0} onClick={() => go("home")} onKeyDown={(e) => e.key === "Enter" && go("home")}>
          Arise<span> Studio.</span>
        </div>
        <nav id="nav" ref={navRef}>
          <span className="nav-ind" id="navInd" ref={indRef} />
          {NAV_ITEMS.map(([p, z, e]) => (
            <button key={p} className={page === p ? "active" : ""} onClick={() => go(p)}>
              {lang === "zh" ? z : e}
            </button>
          ))}
        </nav>
        <div className="hd-actions">
          <button className="icon-btn" id="themeBtn" onClick={toggleTheme} aria-label={dark ? "切换到浅色" : "切换到深色"}>
            {dark ? (
              <svg viewBox="0 0 24 24">
                <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>
          <button onClick={toggleLang} id="lang" className="btn sm">
            {lang === "zh" ? "EN" : "中文"}
          </button>
          <button className="menuBtn btn sm" onClick={toggleDrawer} aria-label="展开导航">
            菜单
          </button>
        </div>
      </header>
      <div className={`drawer ${drawerOpen ? "open" : ""}`} id="drawer">
        {NAV_ITEMS.map(([p, z, e]) => (
          <button key={p} className={page === p ? "active" : ""} onClick={() => go(p)}>
            {lang === "zh" ? z : e}
          </button>
        ))}
      </div>
    </>
  );
}

export function Dock() {
  const { page, go, lang, toggleTweaks } = useApp();
  const labels: Record<PageName, [string, string]> = {
    home: ["首页", "Home"],
    projects: ["作品", "Work"],
    project: ["作品", "Work"],
    resume: ["简历", "Resume"],
    knowledge: ["知识", "Knowledge"],
    article: ["知识", "Knowledge"],
    about: ["关于", "About"],
    contact: ["联系", "Contact"],
    privacy: ["隐私", "Privacy"],
    "404": ["404", "404"],
  };
  return (
    <div className="bottom" id="bottom">
      {DOCK_PAGES.map((p) => (
        <button key={p} className={page === p ? "is-active" : ""} onClick={() => go(p)}>
          {lang === "zh" ? labels[p][0] : labels[p][1]}
        </button>
      ))}
      <span className="dock-sep" />
      <button onClick={toggleTweaks}>Tweaks</button>
    </div>
  );
}

export function Footer() {
  const { go } = useApp();
  return (
    <footer>
      Arise Studio · 李根 / Li Gen
      <br />
      求职展示 · 工程实践 · 长期记录　
      <button onClick={() => go("privacy")}>隐私说明</button>
    </footer>
  );
}

export function Progress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (ref.current) ref.current.style.width = `${p * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress" id="progress" ref={ref} />;
}

export function Toast() {
  const { toastMsg } = useApp();
  return (
    <div id="toast" role="status" aria-live="polite" style={{ display: toastMsg ? "block" : "none" }}>
      {toastMsg}
    </div>
  );
}

export function ChartTip() {
  return <div id="chartTip" role="tooltip" />;
}

export function TweaksPanel() {
  const { pref, setPref, tweaksOpen, toggleTweaks } = useApp();
  const segTheme: [string, string][] = [
    ["light", "浅色"],
    ["dark", "深色"],
  ];
  const segAccent: [string, string][] = [
    ["blue", "#007AFF"],
    ["indigo", "#5856D6"],
    ["teal", "#30B0C7"],
  ];
  const segMotion: [string, string][] = [
    ["full", "完整"],
    ["lite", "精简"],
    ["off", "关闭"],
  ];
  const segDensity: [string, string][] = [
    ["comfortable", "舒适"],
    ["compact", "紧凑"],
  ];
  return (
    <aside className={`tweak-panel ${tweaksOpen ? "open" : ""}`} id="tweaks" aria-label="Tweaks 设计参数面板">
      <button className="tp-close" onClick={toggleTweaks} aria-label="关闭">
        ×
      </button>
      <h4>Tweaks</h4>
      <div className="tp-sub">现场切换设计变量 · 关闭后面板完全隐藏</div>
      <div className="tp-group">
        <div className="tp-label">外观 / Appearance</div>
        <div className="tp-seg" id="segTheme">
          {segTheme.map(([v, label]) => (
            <button key={v} className={pref.theme === v ? "on" : ""} onClick={() => setPref("theme", v)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="tp-group">
        <div className="tp-label">强调色 / Accent</div>
        <div className="tp-dots" id="segAccent">
          {segAccent.map(([v, color]) => (
            <button
              key={v}
              className={pref.accent === v ? "on" : ""}
              style={{ background: color }}
              aria-label={v}
              onClick={() => setPref("accent", v)}
            />
          ))}
        </div>
      </div>
      <div className="tp-group">
        <div className="tp-label">动效 / Motion</div>
        <div className="tp-seg" id="segMotion">
          {segMotion.map(([v, label]) => (
            <button key={v} className={pref.motion === v ? "on" : ""} onClick={() => setPref("motion", v)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="tp-group">
        <div className="tp-label">密度 / Density</div>
        <div className="tp-seg" id="segDensity">
          {segDensity.map(([v, label]) => (
            <button key={v} className={pref.density === v ? "on" : ""} onClick={() => setPref("density", v)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="tp-foot">所有图表仅统计原型内已有的结构化字段，不代表性能或业务成果。偏好会保存在本地浏览器。</div>
    </aside>
  );
}

export function TweaksFab() {
  const { toggleTweaks } = useApp();
  return (
    <button className="tweak-fab" onClick={toggleTweaks} aria-label="打开 Tweaks 面板" title="Tweaks">
      <svg viewBox="0 0 24 24">
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    </button>
  );
}

export function ToolsBar() {
  const { go, toast } = useApp();
  return (
    <div className="tools">
      <span>桌面端 · 产品评审原型 / 非线上网站　·　iOS 简约风优化版 v2</span>
      <span>
        <Link href="/mobi/home" className="tools-mobi-link">移动 H5 ↗</Link>{" "}
        <button onClick={() => go("404")}>404状态</button>{" "}
        <button onClick={() => go("privacy")}>隐私</button>{" "}
        <button onClick={() => toast("拟写内容与英文译文均需本人审核；没有接入真实服务")}>使用说明</button>
      </span>
    </div>
  );
}