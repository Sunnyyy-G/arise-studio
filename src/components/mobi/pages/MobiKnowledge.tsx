"use client";

/**
 * 移动端 KNOWLEDGE / ARTICLE —— 对应 09 原型 render() 的两个分支。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { Heading, NoteCard } from "@/components/mobi/MobiCards";
import { NotesChart } from "@/components/mobi/MobiCharts";
import { notes, DATA_NOTE } from "@/lib/mobiData";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

function SearchIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>;
}

export function MobiKnowledge() {
  const { t, query, nk, setQuery, setNk, resetNoteFilters } = useMobi();
  const results = notes.filter((n) =>
    (nk === "全部" || n.type === nk) &&
    (n.title + n.en + n.tag).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <Heading a={t("记录理解，分享实践。", "Notes from practice.")} b="KNOWLEDGE" />
      <div className="note reveal" style={{ "--i": 1, marginBottom: 16 } as CSSVars}>
        {t("以下均为拟写内容结构示例，不表示已发布文章。", "All entries are planned outlines, not published articles.")}
      </div>
      <NotesChart i={0} />
      <div className="chart-card reveal" style={{ "--i": 1 } as CSSVars}>
        <div className="c-head">
          <div><div className="c-title">拟写主题标签</div><div className="c-sub">notes 的 tag 字段 · 每篇 1 个主题</div></div>
          <span className="c-chip">TAGS</span>
        </div>
        <div className="bars">
          {notes.map((n, k) => (
            <div className="bar-row" key={n.id} style={{ "--d": `${k * 80}ms` } as CSSVars} onClick={() => { setQuery(n.tag); }}>
              <span className="bar-label">{n.tag}</span>
              <div className="bar-track"><span className="bar-fill" style={{ "--w": "100%", "--c": ["var(--c-blue)", "var(--c-indigo)", "var(--c-orange)"][k] } as CSSVars} /></div>
              <span className="bar-val">1</span>
            </div>
          ))}
        </div>
        <div className="data-note">{DATA_NOTE}</div>
      </div>
      <div className="filters reveal">
        <div className="search-field">
          <SearchIcon />
          <input aria-label="搜索知识" value={query} placeholder="搜索知识 / Search" onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="segmented" role="group" aria-label="知识类型">
          {["全部", "博客", "笔记"].map((x) => (
            <button key={x} className={nk === x ? "on" : ""} onClick={() => setNk(x)}>{x}</button>
          ))}
        </div>
        <button className="btn sm" onClick={resetNoteFilters}>重置 / Reset</button>
      </div>
      <div>
        {results.length ? results.map((n, i) => <NoteCard key={n.id} n={n} i={i} />) : (
          <div className="empty">没有匹配内容 / No results
            <button className="btn" style={{ marginTop: 16 } as CSSVars} onClick={resetNoteFilters}>清空筛选</button></div>
        )}
      </div>
    </>
  );
}

export function MobiArticle() {
  const { t, go, selected, copyText } = useMobi();
  const n = notes.find((x) => x.id === selected) || notes[0];
  return (
    <>
      <button className="btn sm reveal" onClick={() => go("knowledge")}>← {t("返回知识", "Back to knowledge")}</button>
      <Heading a={t(n.title, n.en)} b="WRITING OUTLINE" />
      <div className="note reveal" style={{ "--i": 1, marginBottom: 22 } as CSSVars}>拟写内容示例 · 非已发布博文 · 代码仅为独立教学占位。</div>
      <article className="article">
        <section className="reveal"><h2>问题场景 / Context</h2><p>{n.intro}</p></section>
        <section className="reveal"><h2>方案结构 / Approach</h2>
          <p>1. 定义数据与状态的责任边界。<br />2. 统一接口契约并处理边界情况。<br />3. 用可重复的测试确认行为。</p>
          <button className="btn sm" onClick={() => copyText("type PageResult = { total: number; hasMore: boolean };")}>复制示例 / Copy</button>
          <pre>{`type PageResult = {\n  total: number;\n  hasMore: boolean;\n};`}</pre>
        </section>
        <section className="reveal"><h2>测试与复盘 / Reflection</h2>
          <p>验证空数据、重复请求、加载失败和状态恢复。正文、参考链接及可公开代码待本人整理。</p>
          <button className="btn" onClick={() => go("project", 1)}>相关案例 →</button>
        </section>
      </article>
    </>
  );
}
