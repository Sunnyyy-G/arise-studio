"use client";

// 样式：src/styles/pages/ProjectsPage.css（filters / empty，由 src/app/layout.tsx 统一按序引入）
/**
 * PROJECTS 页 —— 对应原型 render() page==='projects' + drawProjects()。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { ProjectCard } from "@/components/charts/Cards";
import { Donut, Bars } from "@/components/charts/Charts";
import { projects, typeCount } from "@/lib/data";
import { useMemo } from "react";

export function ProjectsPage() {
  const { t, query, setQuery, type, setType, resetProjectFilters } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const pRef = useReveal<HTMLParagraphElement>();
  const filtersRef = useReveal<HTMLDivElement>();

  const results = useMemo(
    () =>
      projects.filter(
        (p) =>
          (type === "全部" || p.type === type) &&
          (p.zh + p.en + p.tags.join(" ")).toLowerCase().includes(query.toLowerCase())
      ),
    [query, type]
  );

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / WORK</span>
        <h1>{t("用真实案例，证明能力。", "Engineering, evidenced.")}</h1>
      </div>
      <p ref={pRef} className="reveal" style={{ "--i": 1, marginBottom: 24 } as React.CSSProperties}>
        {t("不只是截图：背景、本人贡献、方案与复盘。", "Context, responsibility, decisions and reflection.")}
      </p>
      <div ref={filtersRef} className="filters reveal" style={{ "--i": 2 } as React.CSSProperties}>
        <input
          aria-label="搜索项目"
          placeholder={t("搜索项目 / React / SSR", "Search projects / React / SSR")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label="项目类型" value={type} onChange={(e) => setType(e.target.value)}>
          {["全部", "业务系统", "活动网站", "视觉展示"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="btn" onClick={resetProjectFilters}>
          {t("重置", "Reset")}
        </button>
      </div>
      <div className="chart-grid" style={{ marginBottom: 40 }}>
        <Donut items={typeCount} title="案例类型分布" sub="点击图例或首页条形图可联动筛选" chip="DONUT" i={0} />
        <Bars title="技术栈出现频次" sub="点击任一行按该标签筛选作品" chip="BARS · CLICKABLE" i={1} />
      </div>
      <div className="grid" id="results">
        {results.length ? (
          results.map((p, idx) => <ProjectCard key={p.id} p={p} i={idx} />)
        ) : (
          <div className="empty" style={{ gridColumn: "1/-1" }}>
            没有匹配项目 / No results
            <p style={{ margin: "12px 0 20px" }}>试试其他关键词或重置筛选。</p>
            <button className="btn" onClick={resetProjectFilters}>
              清空筛选
            </button>
          </div>
        )}
      </div>
    </>
  );
}