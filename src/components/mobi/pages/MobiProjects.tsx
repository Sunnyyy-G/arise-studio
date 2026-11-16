"use client";

/**
 * 移动端 PROJECTS / PROJECT DETAIL —— 对应 09 原型 render() 的两个分支。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { Heading, ProjectCard } from "@/components/mobi/MobiCards";
import { Donut, Bars, FlowChart, Matrix } from "@/components/mobi/MobiCharts";
import { projects, typeCount } from "@/lib/mobiData";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

function SearchIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>;
}

export function MobiProjects() {
  const { t, query, type, setQuery, setType, resetProjectFilters } = useMobi();
  const results = projects.filter((p) =>
    (type === "全部" || p.type === type) &&
    (p.zh + p.en + p.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <Heading a={t("用真实案例，证明能力。", "Engineering, evidenced.")} b="WORK" />
      <p className="reveal" style={{ "--i": 1, fontSize: 14, marginBottom: 4 } as CSSVars}>
        {t("不只是截图：背景、本人贡献、方案与复盘。", "Context, responsibility, decisions and reflection.")}
      </p>
      <div className="filters reveal" style={{ "--i": 1 } as CSSVars}>
        <div className="search-field">
          <SearchIcon />
          <input aria-label="搜索项目" placeholder={t("搜索项目 / React / SSR", "Search projects / React / SSR")}
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="segmented" role="group" aria-label="项目类型">
          {["全部", "业务系统", "活动网站", "视觉展示"].map((x) => (
            <button key={x} className={type === x ? "on" : ""} onClick={() => setType(x)}>{x}</button>
          ))}
        </div>
        <button className="btn sm" onClick={resetProjectFilters}>{t("重置", "Reset")}</button>
      </div>
      <Donut items={typeCount} title="案例类型分布" sub="点击首页条形图可联动筛选" chip="DONUT" i={0} />
      <Bars title="技术栈出现频次" sub="点击任一行按该标签筛选作品" chip="BARS · CLICKABLE" i={1} />
      <div style={{ marginTop: 18 }}>
        {results.length ? results.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />) : (
          <div className="empty">没有匹配项目 / No results<p>试试其他关键词或重置筛选。</p>
            <button className="btn" onClick={resetProjectFilters}>清空筛选</button></div>
        )}
      </div>
    </>
  );
}

export function MobiProjectDetail() {
  const { t, go, selected, scrollToId } = useMobi();
  const p = projects.find((x) => x.id === selected) || projects[0];
  const toc: [string, string][] = [["context", "背景与约束"], ["role", "我的贡献"], ["solution", "技术方案"], ["result", "成果与复盘"]];
  return (
    <>
      <button className="btn sm reveal" onClick={() => go("projects")}>← {t("返回作品", "Back to work")}</button>
      <Heading a={t(p.zh, p.en)} b="CASE STUDY" />
      <p className="reveal" style={{ "--i": 1, fontSize: 14.5, lineHeight: 1.75 } as CSSVars}>{t(p.summary, p.english)}</p>
      <div className="badges reveal" style={{ "--i": 2 } as CSSVars}>{p.tags.map((x) => <span className="badge" key={x}>{x}</span>)}</div>
      <p className="muted reveal" style={{ "--i": 2 } as CSSVars}>{p.date} · {p.role}</p>
      <div className="note reveal" style={{ "--i": 3, margin: "16px 0 22px" } as CSSVars}>
        {t("基于简历整理的脱敏案例。未附内部截图、源码与业务数据；英文为评审译文。", "A redacted resume-based case study. No internal screenshots, code or business data. Translation pending review.")}
      </div>
      <div className="toc reveal">
        {toc.map(([id, z]) => <button key={id} onClick={() => scrollToId(id)}>{z}</button>)}
        <button className="toc-next" onClick={() => go("project", (selected % 4) + 1)}>下一个案例 →</button>
      </div>
      <article className="article">
        <section id="context" className="reveal"><h2>{t("01 / 背景与约束", "01 / Context")}</h2>
          <p>{t("围绕真实业务模块完成多端体验与数据链路交付，兼顾既有架构、维护成本和交互一致性。", "Deliver a real business module while preserving existing architecture, maintainability and consistent UX.")}</p></section>
        <section id="role" className="reveal"><h2>{t("02 / 我的贡献", "02 / Responsibility")}</h2>
          {p.points.map((x, k) => <p key={k}>— {x}</p>)}</section>
        <section id="solution" className="reveal"><h2>{t("03 / 技术方案", "03 / Approach")}</h2>
          <div className="cover" style={{ borderRadius: "var(--r-m)", height: 108, margin: "16px 0" }}>
            <span className="muted">界面层 → 交互状态 → 数据契约 → 服务端校验</span>
            <div className="cover-mark">清晰边界 / 可复用能力</div>
          </div>
          <p>{t("通过统一数据契约、组件复用和边界条件校验保证体验一致。这里是产品原型说明，详细方案由本人补齐后公开。", "Use explicit data contracts, reusable UI and edge-case validation. Detailed public write-up is pending.")}</p></section>
        <section id="result" className="reveal"><h2>{t("04 / 成果与复盘", "04 / Outcomes")}</h2>
          <p>{t("成果以简历中的实际交付范围为依据。不提供未经验证的性能百分比或业务增长数字。", "Outcomes are limited to the delivery scope stated in the resume; no unverified performance or growth claims.")}</p>
          <button className="btn" onClick={() => go("contact")}>{t("交流项目经验", "Discuss the experience")}</button></section>
      </article>
      <FlowChart i={0} /><Matrix i={1} />
    </>
  );
}
