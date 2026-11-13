"use client";

/**
 * 卡片组件 —— 对应原型 card(p,i) 与 note(n,i) 函数。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import type { ProjectData, NoteData } from "@/lib/data";

export function ProjectCard({ p, i = 0 }: { p: ProjectData; i?: number }) {
  const { lang, go } = useApp();
  const ref = useReveal<HTMLElement>([lang]);
  return (
    <article
      ref={ref}
      className="card proj-card reveal"
      style={{ "--i": i } as React.CSSProperties}
      onClick={() => go("project", p.id)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go("project", p.id)}
    >
      <div className="cover">
        <div className="cover-top">
          <span className="muted">
            {p.type} / {p.date}
          </span>
          <span className="cover-no">0{p.id}</span>
        </div>
        <div className="cover-mark">
          ARISE <span>/ 0{p.id}</span>
        </div>
      </div>
      <div className="card-body">
        <h3>{lang === "zh" ? p.zh : p.en}</h3>
        <p>{lang === "zh" ? p.summary : p.english}</p>
        <div className="badges">
          {p.tags.map((x) => (
            <span key={x} className="badge">
              {x}
            </span>
          ))}
        </div>
        <p className="muted">{lang === "zh" ? p.role : "Role details subject to review"}</p>
        <div style={{ marginTop: 14 }}>
          <button
            className="btn sm"
            onClick={(e) => {
              e.stopPropagation();
              go("project", p.id);
            }}
          >
            {lang === "zh" ? "阅读案例 →" : "View case →"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function NoteCard({ n, i = 0 }: { n: NoteData; i?: number }) {
  const { lang, go } = useApp();
  const ref = useReveal<HTMLElement>([lang]);
  return (
    <article ref={ref} className="card note-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="note-top">
        <span className="badge">{lang === "zh" ? n.type : n.type === "博客" ? "Article" : "Note"}</span>
        <span className="muted">{lang === "zh" ? "拟写示例 · 尚未发布" : "Planned content · not published"}</span>
      </div>
      <h3>{lang === "zh" ? n.title : n.en}</h3>
      <p>{lang === "zh" ? n.intro : "A proposed independent technical write-up, pending review."}</p>
      <button className="btn sm" onClick={() => go("article", n.id)}>
        {lang === "zh" ? "查看内容结构" : "Read outline"}
      </button>
    </article>
  );
}