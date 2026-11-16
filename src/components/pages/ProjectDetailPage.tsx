"use client";

// 样式：src/styles/pages/ProjectDetailPage.css（detail / article / toc，由 src/app/layout.tsx 统一按序引入）
/**
 * PROJECT DETAIL 页 —— 对应原型 render() page==='project' 分支。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { FlowChart, Matrix } from "@/components/charts/Charts";
import { projects } from "@/lib/data";

export function ProjectDetailPage() {
  const { t, go, selected, scrollToId } = useApp();
  const p = projects.find((x) => x.id === selected) || projects[0];

  const backRef = useReveal<HTMLButtonElement>([selected]);
  const headRef = useReveal<HTMLDivElement>([selected]);
  const summaryRef = useReveal<HTMLParagraphElement>([selected]);
  const badgesRef = useReveal<HTMLDivElement>([selected]);
  const roleRef = useReveal<HTMLParagraphElement>([selected]);
  const noteRef = useReveal<HTMLDivElement>([selected]);
  const ctxRef = useReveal<HTMLElement>([selected]);
  const roleSecRef = useReveal<HTMLElement>([selected]);
  const solRef = useReveal<HTMLElement>([selected]);
  const resultRef = useReveal<HTMLElement>([selected]);
  const tocRef = useReveal<HTMLElement>([selected]);

  const toc = [
    ["context", "背景与约束"],
    ["role", "我的贡献"],
    ["solution", "技术方案"],
    ["result", "成果与复盘"],
  ];

  return (
    <>
      <button ref={backRef} className="btn sm reveal" onClick={() => go("projects")}>
        ← {t("返回作品", "Back to work")}
      </button>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / CASE STUDY</span>
        <h1>{t(p.zh, p.en)}</h1>
      </div>
      <p ref={summaryRef} className="reveal" style={{ "--i": 1, fontSize: 18, maxWidth: "70ch" } as React.CSSProperties}>
        {t(p.summary, p.english)}
      </p>
      <div ref={badgesRef} className="badges reveal" style={{ "--i": 2 } as React.CSSProperties}>
        {p.tags.map((x) => (
          <span key={x} className="badge">
            {x}
          </span>
        ))}
      </div>
      <p ref={roleRef} className="muted reveal" style={{ "--i": 2 } as React.CSSProperties}>
        {p.date} · {p.role}
      </p>
      <div ref={noteRef} className="note reveal" style={{ "--i": 3, margin: "24px 0 40px" } as React.CSSProperties}>
        {t(
          "基于简历整理的脱敏案例。未附内部截图、源码与业务数据；英文为评审译文。",
          "A redacted resume-based case study. No internal screenshots, code or business data. Translation pending review."
        )}
      </div>
      <div className="detail">
        <article className="article">
          <section ref={ctxRef} id="context" className="reveal">
            <h2>{t("01 / 背景与约束", "01 / Context")}</h2>
            <p>
              {t(
                "围绕真实业务模块完成多端体验与数据链路交付，兼顾既有架构、维护成本和交互一致性。",
                "Deliver a real business module while preserving existing architecture, maintainability and consistent UX."
              )}
            </p>
          </section>
          <section ref={roleSecRef} id="role" className="reveal">
            <h2>{t("02 / 我的贡献", "02 / Responsibility")}</h2>
            {p.points.map((x) => (
              <p key={x}>— {x}</p>
            ))}
          </section>
          <section ref={solRef} id="solution" className="reveal">
            <h2>{t("03 / 技术方案", "03 / Approach")}</h2>
            <div className="cover" style={{ borderRadius: "var(--r-m)", height: 150, margin: "24px 0" }}>
              <span className="muted">界面层 → 交互状态 → 数据契约 → 服务端校验</span>
              <div className="cover-mark">清晰边界 / 可复用能力</div>
            </div>
            <p>
              {t(
                "通过统一数据契约、组件复用和边界条件校验保证体验一致。这里是产品原型说明，详细方案由本人补齐后公开。",
                "Use explicit data contracts, reusable UI and edge-case validation. Detailed public write-up is pending."
              )}
            </p>
          </section>
          <section ref={resultRef} id="result" className="reveal">
            <h2>{t("04 / 成果与复盘", "04 / Outcomes")}</h2>
            <p>
              {t(
                "成果以简历中的实际交付范围为依据。不提供未经验证的性能百分比或业务增长数字。",
                "Outcomes are limited to the delivery scope stated in the resume; no unverified performance or growth claims."
              )}
            </p>
            <button className="btn" onClick={() => go("contact")}>
              {t("交流项目经验", "Discuss the experience")}
            </button>
          </section>
        </article>
        <aside ref={tocRef} className="toc reveal">
          <div className="toc-title">ON THIS PAGE</div>
          {toc.map(([id, z]) => (
            <button key={id} onClick={() => scrollToId(id)}>
              {z}
            </button>
          ))}
          <button className="toc-next" onClick={() => go("project", (selected % 4) + 1)}>
            下一个案例 →
          </button>
        </aside>
      </div>
      <div style={{ marginTop: 56 }} className="chart-grid">
        <FlowChart i={0} />
        <Matrix i={1} />
      </div>
    </>
  );
}