"use client";

// 样式：src/styles/pages/KnowledgePage.css 为本页样式归属索引，规则复用 ProjectsPage / Cards / Charts
/**
 * KNOWLEDGE 页 —— 对应原型 render() page==='knowledge' + drawNotes()。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { NoteCard } from "@/components/charts/Cards";
import { NoteChart, TagBars } from "@/components/charts/Charts";
import { notes } from "@/lib/data";
import { useMemo } from "react";

export function KnowledgePage() {
  const { t, query, setQuery, nk, setNk, resetNoteFilters } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const noteRef = useReveal<HTMLDivElement>();
  const filtersRef = useReveal<HTMLDivElement>();

  const results = useMemo(
    () =>
      notes.filter(
        (n) => (nk === "全部" || n.type === nk) && (n.title + n.en + n.tag).toLowerCase().includes(query.toLowerCase())
      ),
    [query, nk]
  );

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / KNOWLEDGE</span>
        <h1>{t("记录理解，分享实践。", "Notes from practice.")}</h1>
      </div>
      <div ref={noteRef} className="note reveal" style={{ "--i": 1, margin: "24px 0" } as React.CSSProperties}>
        {t("以下均为拟写内容结构示例，不表示已发布文章。", "All entries are planned outlines, not published articles.")}
      </div>
      <div className="chart-grid" style={{ marginBottom: 40 }}>
        <NoteChart i={0} />
        <TagBars i={1} />
      </div>
      <div ref={filtersRef} className="filters reveal">
        <input
          aria-label="搜索知识"
          value={query}
          placeholder="搜索知识 / Search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label="知识类型" value={nk} onChange={(e) => setNk(e.target.value)}>
          {["全部", "博客", "笔记"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="btn" onClick={resetNoteFilters}>
          重置 / Reset
        </button>
      </div>
      <div className="grid" id="results">
        {results.length ? (
          results.map((n, idx) => <NoteCard key={n.id} n={n} i={idx} />)
        ) : (
          <div className="empty" style={{ gridColumn: "1/-1" }}>
            没有匹配内容 / No results
            <button className="btn" style={{ marginTop: 18 }} onClick={resetNoteFilters}>
              清空筛选
            </button>
          </div>
        )}
      </div>
    </>
  );
}