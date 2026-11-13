"use client";

/**
 * RESUME 页 —— 对应原型 render() page==='resume' 分支。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { ProjectCard } from "@/components/charts/Cards";
import { Gantt, Matrix } from "@/components/charts/Charts";
import { projects } from "@/lib/data";

export function ResumePage() {
  const { t, go, toast } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const subRef = useReveal<HTMLParagraphElement>();
  const actionsRef = useReveal<HTMLDivElement>();
  const noteRef = useReveal<HTMLDivElement>();
  const h2Ref = useReveal<HTMLHeadingElement>();
  const edu2Ref = useReveal<HTMLHeadingElement>();
  const eduCardRef = useReveal<HTMLDivElement>();
  const tl0 = useReveal<HTMLDivElement>();
  const tl1 = useReveal<HTMLDivElement>();
  const tl2 = useReveal<HTMLDivElement>();

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / RESUME</span>
        <h1>{t("李根 / 前端开发工程师", "Li Gen / Frontend Engineer")}</h1>
      </div>
      <p ref={subRef} className="reveal" style={{ "--i": 1, fontSize: 18 } as React.CSSProperties}>
        深圳 · React / TypeScript / SSR · {t("公开联系信息待本人确认", "Public contacts pending confirmation")}
      </p>
      <div ref={actionsRef} className="actions reveal" style={{ "--i": 2, margin: "24px 0" } as React.CSSProperties}>
        <button className="btn primary" onClick={() => go("contact")}>
          {t("联系我", "Contact")}
        </button>
        <button className="btn" onClick={() => window.print()}>
          {t("打印简历", "Print resume")}
        </button>
        <button className="btn" onClick={() => toast("公开脱敏 PDF 尚未配置，可先查看或打印在线简历")}>
          {t("PDF 下载状态", "PDF availability")}
        </button>
      </div>
      <div ref={noteRef} className="note reveal" style={{ "--i": 2 } as React.CSSProperties}>
        招聘状态、雇佣称谓、教育与学位时间需本人最终核实。未公开原始 PDF 的敏感信息。
      </div>
      <section className="section">
        <h2 ref={h2Ref} className="reveal">
          {t("工作经历", "Experience")}
        </h2>
        <div className="timeline-list">
          <div ref={tl0} className="tl-item reveal" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="muted">2022.09 — 至今</span>
            <h3>腾讯 IEG · 自研体系管理部</h3>
            <p>前端开发工程师 · React / Remix / 多端与国际化 / 复杂表单</p>
            <button className="btn sm" onClick={() => go("project", 1)}>
              查看代表案例 →
            </button>
          </div>
          <div ref={tl1} className="tl-item reveal" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="muted">2021.11 — 2022.09</span>
            <h3>深圳市思迪信息技术股份有限公司</h3>
            <p>前端重构工程师 · 金融机构站点、视觉还原与兼容性</p>
          </div>
          <div ref={tl2} className="tl-item reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="muted">2020.07 — 2021.10</span>
            <h3>深圳市前海云恒丰科技有限公司</h3>
            <p>前端开发工程师 · 后台管理、可视化与 H5 交互</p>
          </div>
        </div>
      </section>

      <Gantt i={0} />

      <section className="section">
        <div className="section-head">
          <h2>{t("能力证据", "Evidence of capability")}</h2>
        </div>
        <div className="grid">
          {projects.slice(0, 3).map((p, idx) => (
            <ProjectCard key={p.id} p={p} i={idx} />
          ))}
        </div>
      </section>

      <Matrix i={0} />

      <section className="section">
        <h2 ref={edu2Ref} className="reveal">
          {t("教育背景", "Education")}
        </h2>
        <div ref={eduCardRef} className="card reveal" style={{ marginTop: 24 }}>
          <h3>广东技术师范大学 · 计算机科学与技术本科</h3>
          <p style={{ marginTop: 10 }}>2018.09 — 2022.07（简历所述）</p>
          <p className="muted" style={{ marginTop: 6 }}>
            学位授予时间：2024.12；具体表述待核实。
          </p>
        </div>
      </section>
    </>
  );
}