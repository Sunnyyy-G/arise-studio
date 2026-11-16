"use client";

// 样式：src/styles/pages/HomePage.css（hero / portrait / stats，由 src/app/layout.tsx 统一按序引入）
/**
 * HOME 页 —— 对应原型 render() 中 page==='home' 分支，逐段还原。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { ProjectCard, NoteCard } from "@/components/charts/Cards";
import { Dashboard, Gantt } from "@/components/charts/Charts";
import { projects, notes } from "@/lib/data";

export function HomePage() {
  const { lang, t, go } = useApp();
  const h1 =
    lang === "zh"
      ? ["把复杂需求，", "做成清晰可靠的", "产品体验。"]
      : ["Turning complexity", "into reliable", "experiences."];

  const eyebrowRef = useReveal<HTMLSpanElement>();
  const heroPRef = useReveal<HTMLParagraphElement>([lang]);
  const actionsRef = useReveal<HTMLDivElement>([lang]);
  const portraitRef = useReveal<HTMLDivElement>([lang]);
  const capHeadRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLElement>([lang]);

  const capLabels =
    lang === "zh"
      ? ["React & SSR", "表单与数据契约", "多端与国际化", "交互与工程质量"]
      : ["React & SSR", "Form & data contract", "Multi-device & i18n", "Interaction & quality"];
  const capBars = [92, 78, 70, 86];

  return (
    <>
      <div className="hero">
        <div>
          <span ref={eyebrowRef} className="eyebrow reveal" style={{ "--i": 0 } as React.CSSProperties}>
            FRONTEND ENGINEER / SHENZHEN
          </span>
          <h1>
            {h1.map((x, idx) => (
              <span className="ln" key={idx}>
                <span style={{ "--n": idx } as React.CSSProperties}>{x}</span>
              </span>
            ))}
          </h1>
          <p ref={heroPRef} className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
            {t(
              "我是李根，专注 React、SSR、多端体验与复杂业务交付的前端开发工程师。",
              "I am Li Gen, a frontend engineer focused on React, SSR and multi-device product delivery."
            )}
          </p>
          <div ref={actionsRef} className="actions reveal" style={{ "--i": 3 } as React.CSSProperties}>
            <button className="btn primary" onClick={() => go("projects")}>
              {t("查看代表作品 →", "Explore work →")}
            </button>
            <button className="btn" onClick={() => go("resume")}>
              {t("查看简历", "View resume")}
            </button>
          </div>
        </div>
        <div ref={portraitRef} className="portrait reveal" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="grid-lines" />
          <span className="badge darkbadge">ENGINEER × CRAFT</span>
          <p>Arise Studio / Li Gen</p>
          <strong>
            设计理解。
            <br />
            工程落地。
          </strong>
          <div className="p-spacer" />
          <p>
            React · TypeScript · SSR
            <br />
            表单契约 / 多端适配 / 交互细节
          </p>
          <span className="muted">视觉品牌占位，非本人头像</span>
        </div>
      </div>

      <Dashboard i={0} />

      <section className="section">
        <div ref={capHeadRef} className="section-head reveal">
          <div>
            <span className="eyebrow">CAPABILITY / 02</span>
            <h2 style={{ marginTop: 12 }}>{t("能力，由案例举证", "Capability, evidenced")}</h2>
          </div>
        </div>
        <div className="stats">
          {capLabels.map((x, idx) => (
            <CapStat key={x} label={x} bar={capBars[idx]} i={idx} />
          ))}
        </div>
        <div className="data-note">进度条仅用于视觉分组与节奏表达，不代表能力评分或测评结果。</div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t("精选案例", "Selected work")}</h2>
          <button className="btn sm" onClick={() => go("projects")}>
            {t("全部作品 →", "All projects →")}
          </button>
        </div>
        <div className="grid">
          {projects.slice(0, 3).map((p, idx) => (
            <ProjectCard key={p.id} p={p} i={idx} />
          ))}
        </div>
      </section>

      <Gantt i={0} />

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">KNOWLEDGE / 03</span>
            <h2 style={{ marginTop: 12 }}>{t("知识与实践", "Knowledge & practice")}</h2>
            <p className="sub">
              {t("以下为内容规划示例，发布前需独立整理与审核。", "The following are planned topics, not published posts.")}
            </p>
          </div>
        </div>
        <div className="grid">
          {notes.map((n, idx) => (
            <NoteCard key={n.id} n={n} i={idx} />
          ))}
        </div>
      </section>

      <section ref={ctaRef} className="card row reveal">
        <div>
          <h2>{t("想了解我的工程实践？", "Let us talk about engineering.")}</h2>
          <p style={{ marginTop: 8 }}>{t("从简历与代表项目开始。", "Start with my resume and selected projects.")}</p>
        </div>
        <button className="btn primary" onClick={() => go("contact")}>
          {t("联系我", "Contact")}
        </button>
      </section>
    </>
  );
}

function CapStat({ label, bar, i }: { label: string; bar: number; i: number }) {
  const { t } = useApp();
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="stat reveal" style={{ "--i": i, "--bar": `${bar}%` } as React.CSSProperties}>
      <span className="stat-no">0{i + 1} / CAPABILITY</span>
      <div className="stat-bar">
        <i />
      </div>
      <strong>{label}</strong>
      <span className="muted">{t("通过项目证据体现", "Proven through case studies")}</span>
    </div>
  );
}