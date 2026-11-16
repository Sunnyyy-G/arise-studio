"use client";

/**
 * 移动 H5 卡片与列表 —— 对应 09 原型 card(p,i) / note(n,i) / heading(a,b)。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import type { ProjectData, NoteData } from "@/lib/data";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function Heading({ a, b }: { a: string; b: string }) {
  return <div className="page-head reveal"><span className="eyebrow">ARISE / {b}</span><h1>{a}</h1></div>;
}

export function ProjectCard({ p, i = 0 }: { p: ProjectData; i?: number }) {
  const { t, go } = useMobi();
  return (
    <article className="card proj-card reveal" style={{ "--i": i } as CSSVars}
      onClick={() => go("project", p.id)} tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") go("project", p.id); }}>
      <div className="cover">
        <div className="cover-top"><span className="muted">{p.type} / {p.date}</span><span className="cover-no">0{p.id}</span></div>
        <div className="cover-mark">ARISE / 0{p.id}</div>
      </div>
      <div className="card-body">
        <h3>{t(p.zh, p.en)}</h3>
        <p>{t(p.summary, p.english)}</p>
        <div className="badges">{p.tags.map((x) => <span className="badge" key={x}>{x}</span>)}</div>
        <p className="muted">{t(p.role, "Role details subject to review")}</p>
        <div style={{ marginTop: 12 }}>
          <button className="btn sm" onClick={(e) => { e.stopPropagation(); go("project", p.id); }}>
            {t("阅读案例 →", "View case →")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function NoteCard({ n, i = 0 }: { n: NoteData; i?: number }) {
  const { t, go } = useMobi();
  return (
    <article className="card note-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="note-top">
        <span className="badge">{t(n.type, n.type === "博客" ? "Article" : "Note")}</span>
        <span className="muted">{t("拟写示例 · 尚未发布", "Planned content · not published")}</span>
      </div>
      <h3>{t(n.title, n.en)}</h3>
      <p>{t(n.intro, "A proposed independent technical write-up, pending review.")}</p>
      <button className="btn sm" onClick={() => go("article", n.id)}>{t("查看内容结构", "Read outline")}</button>
    </article>
  );
}
