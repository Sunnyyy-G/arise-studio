"use client";

/**
 * 移动端 RESUME —— 对应 09 原型 render() 的 page==='resume' 分支。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { Heading, ProjectCard } from "@/components/mobi/MobiCards";
import { Stepper, Matrix } from "@/components/mobi/MobiCharts";
import { projects } from "@/lib/mobiData";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function MobiResume() {
  const { t, go, toast } = useMobi();
  return (
    <>
      <Heading a={t("李根 / 前端开发工程师", "Li Gen / Frontend Engineer")} b="RESUME" />
      <p className="reveal" style={{ "--i": 1, fontSize: 14 } as CSSVars}>
        深圳 · React / TypeScript / SSR · {t("公开联系信息待本人确认", "Public contacts pending confirmation")}
      </p>
      <div className="actions reveal" style={{ "--i": 2, margin: "16px 0" } as CSSVars}>
        <button className="btn primary" onClick={() => go("contact")}>{t("联系我", "Contact")}</button>
        <button className="btn" onClick={() => window.print()}>{t("打印简历", "Print resume")}</button>
        <button className="btn" onClick={() => toast("公开脱敏 PDF 尚未配置，可先查看或打印在线简历")}>{t("PDF 下载状态", "PDF availability")}</button>
      </div>
      <div className="note reveal" style={{ "--i": 2 } as CSSVars}>招聘状态、雇佣称谓、教育与学位时间需本人最终核实。未公开原始 PDF 的敏感信息。</div>
      <section className="section">
        <h2 className="reveal">{t("工作经历", "Experience")}</h2>
        <div className="timeline-list">
          <div className="tl-item reveal" style={{ "--i": 0 } as CSSVars}><span className="muted">2022.09 — 至今</span>
            <h3>腾讯 IEG · 自研体系管理部</h3>
            <p>前端开发工程师 · React / Remix / 多端与国际化 / 复杂表单</p>
            <button className="btn sm" onClick={() => go("project", 1)}>查看代表案例 →</button></div>
          <div className="tl-item reveal" style={{ "--i": 1 } as CSSVars}><span className="muted">2021.11 — 2022.09</span>
            <h3>深圳市思迪信息技术股份有限公司</h3>
            <p>前端重构工程师 · 金融机构站点、视觉还原与兼容性</p></div>
          <div className="tl-item reveal" style={{ "--i": 2 } as CSSVars}><span className="muted">2020.07 — 2021.10</span>
            <h3>深圳市前海云恒丰科技有限公司</h3>
            <p>前端开发工程师 · 后台管理、可视化与 H5 交互</p></div>
        </div>
      </section>
      <Stepper i={0} />
      <section className="section">
        <div className="section-head reveal"><h2>{t("能力证据", "Evidence of capability")}</h2></div>
        {projects.slice(0, 3).map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </section>
      <Matrix i={0} />
      <section className="section">
        <h2 className="reveal">{t("教育背景", "Education")}</h2>
        <div className="card reveal" style={{ marginTop: 14 }}>
          <h3 style={{ fontSize: 16 }}>广东技术师范大学 · 计算机科学与技术本科</h3>
          <p style={{ marginTop: 8, fontSize: 13 }}>2018.09 — 2022.07（简历所述）</p>
          <p className="muted" style={{ marginTop: 5 }}>学位授予时间：2024.12；具体表述待核实。</p>
        </div>
      </section>
    </>
  );
}
