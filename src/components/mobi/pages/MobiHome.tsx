"use client";

/**
 * 移动端 HOME 页 —— 对应 09 原型 render() 的 page==='home' 分支。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { ProjectCard, NoteCard } from "@/components/mobi/MobiCards";
import { Dashboard, Stepper } from "@/components/mobi/MobiCharts";
import { projects, notes } from "@/lib/mobiData";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function MobiHome() {
  const { lang, t, go } = useMobi();
  const h1 = lang === "zh"
    ? ["把复杂需求，", "做成清晰可靠的", "产品体验。"]
    : ["Turning complexity", "into reliable", "experiences."];
  const capLabels = lang === "zh"
    ? ["React & SSR", "表单与数据契约", "多端与国际化", "交互与工程质量"]
    : ["React & SSR", "Form & data contract", "Multi-device & i18n", "Interaction & quality"];
  const capBars = [92, 78, 70, 86];

  return (
    <>
      <div className="hero">
        <span className="eyebrow reveal" style={{ "--i": 0 } as CSSVars}>FRONTEND ENGINEER / SHENZHEN</span>
        <h1>
          {h1.map((x, idx) => (
            <span className="ln" key={idx}><span style={{ "--n": idx } as CSSVars}>{x}</span></span>
          ))}
        </h1>
        <p className="reveal" style={{ "--i": 1 } as CSSVars}>
          {t("我是李根，专注 React、SSR、多端体验与复杂业务交付的前端开发工程师。", "I am Li Gen, a frontend engineer focused on React, SSR and multi-device product delivery.")}
        </p>
        <div className="actions reveal" style={{ "--i": 2 } as CSSVars}>
          <button className="btn primary" onClick={() => go("projects")}>{t("查看代表作品 →", "Explore work →")}</button>
          <button className="btn" onClick={() => go("resume")}>{t("查看简历", "View resume")}</button>
        </div>
        <div className="portrait reveal" style={{ "--i": 2 } as CSSVars}>
          <div className="grid-lines" />
          <span className="badge darkbadge">ENGINEER × CRAFT</span>
          <p>Arise Studio / Li Gen</p>
          <strong>设计理解。<br />工程落地。</strong>
          <div className="p-spacer" />
          <p>React · TypeScript · SSR<br />表单契约 / 多端适配 / 交互细节</p>
          <span className="muted">视觉品牌占位，非本人头像</span>
        </div>
      </div>

      <Dashboard i={0} />

      <section className="section">
        <div className="section-head reveal">
          <span className="eyebrow">CAPABILITY / 02</span>
          <h2 style={{ marginTop: 8 }}>{t("能力，由案例举证", "Capability, evidenced")}</h2>
        </div>
        <div className="cap-list">
          {capLabels.map((x, idx) => (
            <div className="cap reveal" key={x} style={{ "--i": idx, "--bar": `${capBars[idx]}%` } as CSSVars}>
              <span className="cap-no">0{idx + 1} / CAPABILITY</span>
              <strong>{x}</strong>
              <div className="cap-bar"><i /></div>
              <span className="muted">{t("通过项目证据体现", "Proven through case studies")}</span>
            </div>
          ))}
        </div>
        <div className="data-note">进度条仅用于视觉分组与节奏表达，不代表能力评分或测评结果。</div>
      </section>

      <section className="section">
        <div className="section-head reveal"><h2>{t("精选案例", "Selected work")}</h2></div>
        {projects.slice(0, 3).map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
        <div style={{ marginTop: 12 }}>
          <button className="btn block" onClick={() => go("projects")}>{t("全部作品 →", "All projects →")}</button>
        </div>
      </section>

      <Stepper i={0} />

      <section className="section">
        <div className="section-head reveal">
          <span className="eyebrow">KNOWLEDGE / 03</span>
          <h2 style={{ marginTop: 8 }}>{t("知识与实践", "Knowledge & practice")}</h2>
          <p className="sub">{t("以下为内容规划示例，发布前需独立整理与审核。", "The following are planned topics, not published posts.")}</p>
        </div>
        {notes.map((n, i) => <NoteCard key={n.id} n={n} i={i} />)}
      </section>

      <section className="card row reveal" style={{ marginTop: 20 } as CSSVars}>
        <h2 style={{ fontSize: 19 }}>{t("想了解我的工程实践？", "Let us talk about engineering.")}</h2>
        <p style={{ margin: "8px 0 16px", fontSize: 13 }}>{t("从简历与代表项目开始。", "Start with my resume and selected projects.")}</p>
        <button className="btn primary block" onClick={() => go("contact")}>{t("联系我", "Contact")}</button>
      </section>
    </>
  );
}
