"use client";

/**
 * ================================================================
 * Arise Studio · 移动 H5 · 应用外壳 + 动效挂载
 * 对应 09 原型 body 结构（stage/device/screen/statusbar/navbar/tabbar/
 * sheets/tweaks）与脚本 mount() / animateNumbers() / tick() / scroll /
 * bindSeg() / updateSegments() / applyPref() / pageLabel()。
 *
 * 动效集中式：每次页面重建（navKey 变化）调用 mountCards()，
 * root = #mobiApp 滚动容器，与原型 IntersectionObserver 完全一致。
 * ================================================================
 */
import { useEffect, useRef } from "react";
import { useMobi, type MobiPage } from "@/components/mobi/MobiContext";
import { MobiHome } from "@/components/mobi/pages/MobiHome";
import { MobiProjects, MobiProjectDetail } from "@/components/mobi/pages/MobiProjects";
import { MobiResume } from "@/components/mobi/pages/MobiResume";
import { MobiKnowledge, MobiArticle } from "@/components/mobi/pages/MobiKnowledge";
import { MobiAbout, MobiContact, MobiPrivacy, Mobi404 } from "@/components/mobi/pages/MobiInfo";
import { ICONS } from "@/lib/mobiData";

const NAV_ITEMS: [MobiPage, string, string][] = [
  ["home", "首页", "Home"],
  ["projects", "作品", "Work"],
  ["resume", "简历", "Resume"],
  ["knowledge", "知识", "Knowledge"],
  ["about", "关于", "About"],
  ["contact", "联系", "Contact"],
];
const TAB_PAGES: MobiPage[] = ["home", "projects", "knowledge", "resume"];

function pageLabel(p: MobiPage, t: (z: string, e: string) => string): string {
  const map: Record<MobiPage, [string, string]> = {
    home: ["首页", "Home"], projects: ["作品", "Work"], resume: ["简历", "Resume"],
    knowledge: ["知识", "Knowledge"], about: ["关于", "About"], contact: ["联系", "Contact"],
    project: ["案例", "Case"], article: ["内容结构", "Outline"], privacy: ["隐私", "Privacy"], "404": ["404", "404"],
  };
  return t(map[p][0], map[p][1]);
}

export function MobiApp() {
  const m = useMobi();
  const { page, lang, selected, navKey, dir, t, go, pref, sheet } = m;
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ---------- 动效挂载：对应原型 mount() / __mountCards() / animateNumbers() ---------- */
  useEffect(() => {
    const app = document.getElementById("mobiApp");
    if (!app) return;
    observerRef.current?.disconnect();

    const off = document.documentElement.getAttribute("data-motion") === "off";
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { root: app, threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    observerRef.current = io;

    const reveals = Array.from(app.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    const mRect = app.getBoundingClientRect();
    reveals.forEach((el) => {
      if (off || reduce) { el.classList.add("in"); return; }
      const r = el.getBoundingClientRect();
      /* chart-card / metric / cap 视口内同步加 .in（锚定 0 态，触发 0→值 transition） */
      if (el.matches(".chart-card,.metric,.cap") && r.top < mRect.bottom + 40 && r.bottom > mRect.top - 40) {
        el.classList.add("in");
      } else {
        io.observe(el);
      }
    });

    /* 数字 0→N */
    app.querySelectorAll<HTMLElement>(".metric").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = Number(el.dataset.count);
      const node = el.querySelector<HTMLElement>(".num");
      if (!node) return;
      if (off || reduce) { node.textContent = String(target); return; }
      const dur = 900, st = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - st) / dur), e = 1 - Math.pow(1 - k, 3);
        node.textContent = String(Math.round(target * e));
        if (k < 1) requestAnimationFrame(step);
      };
      node.textContent = "0";
      requestAnimationFrame(step);
    });

    return () => io.disconnect();
  }, [navKey, page, lang, selected]);

  /* ---------- 应用偏好后强制图表完成态（对应 applyPref 的 add('in')） ---------- */
  useEffect(() => {
    if (pref.motion !== "off") return;
    document.querySelectorAll<HTMLElement>(".chart-card,.metric,.cap").forEach((el) => el.classList.add("in"));
  }, [pref]);

  /* ---------- 顶部进度条 + 紧凑 navbar（对应 app scroll 监听） ---------- */
  useEffect(() => {
    const app = document.getElementById("mobiApp");
    const prog = document.getElementById("progress");
    const screen = document.getElementById("screen");
    if (!app) return;
    const onScroll = () => {
      const p = app.scrollTop / (app.scrollHeight - app.clientHeight || 1);
      if (prog) prog.style.width = Math.min(100, p * 100) + "%";
      screen?.classList.toggle("compact", app.scrollTop > 56);
    };
    app.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => app.removeEventListener("scroll", onScroll);
  }, [navKey]);

  /* ---------- 状态栏时钟（对应 tick） ---------- */
  useEffect(() => {
    const clock = document.getElementById("clock");
    const tick = () => {
      const d = new Date();
      if (clock) clock.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const themeDark = pref.theme === "dark";
  const segBtn = (key: keyof typeof pref, value: string, label: string) => (
    <button className={pref[key] === value ? "on" : ""} data-v={value}
      onClick={() => m.setPref(key, value)}>{label}</button>
  );

  return (
    <div className="stage">
      <div className="stage-badge">DEVICE PREVIEW / MOBILE H5<b>iPhone 393 × 852 · 可切全屏预览</b><span>移动H5端 · 产品评审原型 / 非线上网站</span></div>
      <div className="stage-tools">
        <button onClick={() => go("404")}>404状态</button>
        <button onClick={() => go("privacy")}>隐私</button>
        <button onClick={() => m.toast("拟写内容与英文译文均需本人审核；没有接入真实服务")}>使用说明</button>
        <button className={pref.frame === "on" ? "on" : ""} onClick={m.toggleFrame}>设备框：{pref.frame === "on" ? "开" : "关"}</button>
      </div>

      <div className="device">
        <div className="screen" id="screen">
          <div className="statusbar">
            <span id="clock">--:--</span>
            <span className="island"><i /></span>
            <span className="sb-right">
              <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="6" width="3" height="6" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
              <svg viewBox="0 0 16 12"><path d="M1 4.2a10 10 0 0 1 14 0M3.4 6.8a6.4 6.4 0 0 1 9.2 0M6 9.3a2.6 2.6 0 0 1 4 0" /><circle cx="8" cy="11" r="1" /></svg>
              <svg viewBox="0 0 26 12"><rect x="0.6" y="0.6" width="21" height="10.8" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" /><rect x="2.2" y="2.2" width="16" height="7.6" rx="1.6" /><path d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6z" /></svg>
            </span>
          </div>

          <div className="navbar">
            <div className="nav-logo" role="button" tabIndex={0} onClick={() => go("home")}
              onKeyDown={(e) => { if (e.key === "Enter") go("home"); }}>Arise<span> Studio.</span></div>
            <div className="nav-title" id="navTitle">{pageLabel(page, t)}</div>
            <div className="nav-actions">
              <button id="themeBtn" onClick={m.toggleTheme} aria-label={themeDark ? "切换到浅色" : "切换到深色"}
                dangerouslySetInnerHTML={{ __html: themeDark
                  ? '<svg viewBox="0 0 24 24"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>'
                  : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' }} />
              <button className="lang-btn" onClick={m.toggleLang} id="lang">{lang === "zh" ? "EN" : "中文"}</button>
              <button onClick={() => m.openSheet("menu")} aria-label="展开导航"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
              <button onClick={() => m.openSheet("tweaks")} aria-label="打开 Tweaks 面板"><svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg></button>
            </div>
            <div className="nav-progress" id="progress" />
          </div>

          <main id="mobiApp">
            <div className={`page ${dir === "pop" ? "pop" : ""}`} key={navKey}>
              {page === "home" && <MobiHome />}
              {page === "projects" && <MobiProjects />}
              {page === "project" && <MobiProjectDetail />}
              {page === "resume" && <MobiResume />}
              {page === "knowledge" && <MobiKnowledge />}
              {page === "article" && <MobiArticle />}
              {page === "about" && <MobiAbout />}
              {page === "contact" && <MobiContact />}
              {page === "privacy" && <MobiPrivacy />}
              {page === "404" && <Mobi404 />}
              <footer className="page-footer">Arise Studio · 李根 / Li Gen<br />求职展示 · 工程实践 · 长期记录　<button onClick={() => go("privacy")}>隐私说明</button></footer>
            </div>
          </main>

          <div className="tabbar" id="bottom">
            {NAV_ITEMS.filter(([p]) => TAB_PAGES.includes(p)).map(([p, z, e]) => (
              <button key={p} className={page === p ? "on" : ""} onClick={() => go(p)}>
                <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS[p] }} />
                <span>{t(z, e)}</span>
              </button>
            ))}
          </div>
          <div className="home-ind"><i /></div>

          <div id="toast" role="status" aria-live="polite" style={{ display: m.toastMsg ? "block" : "none" }}>{m.toastMsg}</div>
          <div className={`backdrop ${sheet ? "open" : ""}`} id="backdrop" onClick={m.closeSheet} />

          <div className={`sheet ${sheet === "menu" ? "open" : ""}`} id="menuSheet" aria-label="导航菜单">
            <div className="grabber" />
            <h4>全部页面</h4>
            <div className="s-sub">ARDS / 公共端 · 6 个主导航与辅助状态</div>
            <div className="s-list" id="drawer">
              {NAV_ITEMS.map(([p, z, e]) => (
                <button key={p} className={page === p ? "on" : ""} onClick={() => go(p)}>{t(z, e)}<span className="s-chev">›</span></button>
              ))}
              <button onClick={() => go("privacy")}>{t("隐私说明", "Privacy")}<span className="s-chev">›</span></button>
              <button onClick={() => go("404")}>404 {t("状态", "state")}<span className="s-chev">›</span></button>
              <button onClick={() => m.toast("拟写内容与英文译文均需本人审核；没有接入真实服务")}>{t("使用说明", "Usage notice")}<span className="s-chev">›</span></button>
            </div>
          </div>

          <div className={`sheet ${sheet === "tweaks" ? "open" : ""}`} id="tweaks" aria-label="Tweaks 设计参数面板">
            <div className="grabber" />
            <h4>Tweaks</h4>
            <div className="s-sub">现场切换设计变量 · 关闭后完全隐藏</div>
            <div className="tp-group"><div className="tp-label">外观 / Appearance</div>
              <div className="tp-seg" id="segTheme">{segBtn("theme", "light", "浅色")}{segBtn("theme", "dark", "深色")}</div></div>
            <div className="tp-group"><div className="tp-label">强调色 / Accent</div>
              <div className="tp-dots" id="segAccent">
                <button data-v="blue" className={pref.accent === "blue" ? "on" : ""} style={{ background: "#007AFF" }} aria-label="系统蓝" onClick={() => m.setPref("accent", "blue")} />
                <button data-v="indigo" className={pref.accent === "indigo" ? "on" : ""} style={{ background: "#5856D6" }} aria-label="靛蓝" onClick={() => m.setPref("accent", "indigo")} />
                <button data-v="teal" className={pref.accent === "teal" ? "on" : ""} style={{ background: "#30B0C7" }} aria-label="青绿" onClick={() => m.setPref("accent", "teal")} />
              </div></div>
            <div className="tp-group"><div className="tp-label">动效 / Motion</div>
              <div className="tp-seg" id="segMotion">{segBtn("motion", "full", "完整")}{segBtn("motion", "lite", "精简")}{segBtn("motion", "off", "关闭")}</div></div>
            <div className="tp-group"><div className="tp-label">密度 / Density</div>
              <div className="tp-seg" id="segDensity">{segBtn("density", "comfortable", "舒适")}{segBtn("density", "compact", "紧凑")}</div></div>
            <div className="tp-group"><div className="tp-label">预览 / Preview</div>
              <div className="tp-seg" id="segFrame">{segBtn("frame", "on", "设备框")}{segBtn("frame", "off", "全屏")}</div></div>
            <div className="tp-foot">所有图表仅统计原型内已有的结构化字段，不代表性能或业务成果。偏好保存在本地浏览器。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
