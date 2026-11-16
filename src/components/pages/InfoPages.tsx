"use client";

// 样式：src/styles/pages/InfoPages.css 为本页样式归属索引，规则复用 common / ProjectDetailPage / ProjectsPage
/**
 * ABOUT / CONTACT / PRIVACY / 404 页
 * —— 对应原型 render() page==='about'|'contact'|'privacy'|'404' 分支。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { FlowChart } from "@/components/charts/Charts";

/* ================= ABOUT ================= */
export function AboutPage() {
  const { t, go } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const p0 = useReveal<HTMLParagraphElement>();
  const s1 = useReveal<HTMLElement>();
  const s2 = useReveal<HTMLElement>();
  const s3 = useReveal<HTMLElement>();

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / ABOUT</span>
        <h1>{t("工程师，也是一位持续学习者。", "Engineering, with curiosity.")}</h1>
      </div>
      <article className="article">
        <p ref={p0} className="reveal">
          {t(
            "我是李根。Arise Studio 是我展示工程实践、记录技术理解和建立长期个人品牌的空间。",
            "I am Li Gen. Arise Studio is a space for engineering work, technical learning and a long-term personal brand."
          )}
        </p>
        <section ref={s1} className="reveal">
          <h2>{t("我的工作方法", "How I work")}</h2>
          <div className="card" style={{ marginTop: 20 }}>
            <h3>理解需求 → 明确边界 → 验证方案 → 打磨体验</h3>
            <p style={{ marginTop: 10 }}>
              关注组件复用、数据契约、交互一致性和规范化交付；AI 是辅助工具，方案判断与代码审查仍由本人负责。
            </p>
          </div>
        </section>
        <section ref={s2} className="reveal">
          <h2>当前关注 / Focus</h2>
          <p>React、SSR、复杂表单、多端体验、AI 辅助工程实践。</p>
        </section>
        <section ref={s3} className="reveal">
          <h2>生活与兴趣 / Beyond code</h2>
          <p>此区域由本人后续填写，可隐藏；不根据简历社团经历推断当前兴趣。</p>
          <button className="btn primary" onClick={() => go("resume")}>
            查看职业经历 →
          </button>
        </section>
      </article>
      <FlowChart i={0} />
    </>
  );
}

/* ================= CONTACT ================= */
export function ContactPage() {
  const { t, go, toast } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const pRef = useReveal<HTMLParagraphElement>();
  const gridRef = useReveal<HTMLDivElement>();
  const noteRef = useReveal<HTMLDivElement>();

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / CONTACT</span>
        <h1>{t("从一次交流开始。", "Start a conversation.")}</h1>
      </div>
      <p ref={pRef} className="reveal" style={{ "--i": 1, fontSize: 18, maxWidth: "70ch" } as React.CSSProperties}>
        {t(
          "招聘沟通与技术交流的公开渠道，发布前由本人确认。",
          "Public channels for recruiting and technical conversation will be confirmed before launch."
        )}
      </p>
      <div ref={gridRef} className="grid reveal" style={{ "--i": 2, margin: "40px 0" } as React.CSSProperties}>
        <div className="card">
          <h3>Email</h3>
          <p style={{ margin: "10px 0 18px" }}>公开邮箱待确认</p>
          <button
            className="btn sm"
            onClick={() => toast("简历邮箱提取不完整，尚未配置 mailto；不会生成虚假联系方式")}
          >
            {t("查看配置状态", "Check availability")}
          </button>
        </div>
        <div className="card">
          <h3>GitHub / 微信</h3>
          <p style={{ margin: "10px 0 18px" }}>
            {t("GitHub 待提供；微信默认私密。", "GitHub pending; WeChat private by default.")}
          </p>
          <button className="btn sm" onClick={() => toast("尚未配置公开社交渠道")}>
            {t("渠道状态", "Channel status")}
          </button>
        </div>
        <div className="card">
          <h3>{t("招聘信息", "Recruiting")}</h3>
          <p style={{ margin: "10px 0 18px" }}>
            {t("目标岗位、城市、入职时间待本人确认。", "Role preference, location and availability pending confirmation.")}
          </p>
          <button className="btn sm" onClick={() => go("resume")}>
            查看简历 →
          </button>
        </div>
      </div>
      <div ref={noteRef} className="note section reveal">
        不公开手机号、身份证、生日、证书编号。此原型不提交留言、不收集个人数据。
      </div>
    </>
  );
}

/* ================= PRIVACY ================= */
export function PrivacyPage() {
  const { go } = useApp();
  const headRef = useReveal<HTMLDivElement>();
  const p1 = useReveal<HTMLParagraphElement>();
  const p2 = useReveal<HTMLParagraphElement>();
  const btnRef = useReveal<HTMLButtonElement>();

  return (
    <>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / PRIVACY</span>
        <h1>隐私与公开边界</h1>
      </div>
      <article className="article">
        <p ref={p1} className="reveal">
          此离线公共原型不收集访客信息，不接入第三方统计。真实上线时按实际 Cookie、统计与联系渠道更新声明。
        </p>
        <p ref={p2} className="reveal">
          公开资料只含本人授权的求职内容。私密字段由服务端过滤。原型素材为示意，不复制内部业务系统截图。
        </p>
        <button ref={btnRef} className="btn reveal" onClick={() => go("home")}>
          返回首页
        </button>
      </article>
    </>
  );
}

/* ================= 404 ================= */
export function NotFoundIosPage() {
  const { go } = useApp();
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="empty reveal">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>这一页还没有升起。</h1>
      <p style={{ margin: "16px 0 28px" }}>链接可能已失效，或内容尚未发布。</p>
      <button className="btn primary" onClick={() => go("home")}>
        返回首页
      </button>{" "}
      <button className="btn" onClick={() => go("projects")}>
        浏览作品
      </button>
    </div>
  );
}