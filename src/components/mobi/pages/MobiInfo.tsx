"use client";

/**
 * 移动端 ABOUT / CONTACT / PRIVACY / 404 —— 对应 09 原型 render() 的四个分支。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { Heading } from "@/components/mobi/MobiCards";
import { FlowChart } from "@/components/mobi/MobiCharts";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function MobiAbout() {
  const { t, go } = useMobi();
  return (
    <>
      <Heading a={t("工程师，也是一位持续学习者。", "Engineering, with curiosity.")} b="ABOUT" />
      <article className="article">
        <p className="reveal">{t("我是李根。Arise Studio 是我展示工程实践、记录技术理解和建立长期个人品牌的空间。", "I am Li Gen. Arise Studio is a space for engineering work, technical learning and a long-term personal brand.")}</p>
        <section className="reveal"><h2>{t("我的工作方法", "How I work")}</h2>
          <div className="card" style={{ marginTop: 14 }}>
            <h3 style={{ fontSize: 16 }}>理解需求 → 明确边界 → 验证方案 → 打磨体验</h3>
            <p style={{ marginTop: 8, fontSize: 13 }}>关注组件复用、数据契约、交互一致性和规范化交付；AI 是辅助工具，方案判断与代码审查仍由本人负责。</p>
          </div>
        </section>
        <section className="reveal"><h2>当前关注 / Focus</h2><p>React、SSR、复杂表单、多端体验、AI 辅助工程实践。</p></section>
        <section className="reveal"><h2>生活与兴趣 / Beyond code</h2>
          <p>此区域由本人后续填写，可隐藏；不根据简历社团经历推断当前兴趣。</p>
          <button className="btn primary" onClick={() => go("resume")}>查看职业经历 →</button>
        </section>
      </article>
      <FlowChart i={0} />
    </>
  );
}

export function MobiContact() {
  const { t, go, toast } = useMobi();
  return (
    <>
      <Heading a={t("从一次交流开始。", "Start a conversation.")} b="CONTACT" />
      <p className="reveal" style={{ "--i": 1, fontSize: 14, lineHeight: 1.75 } as CSSVars}>
        {t("招聘沟通与技术交流的公开渠道，发布前由本人确认。", "Public channels for recruiting and technical conversation will be confirmed before launch.")}
      </p>
      <div className="group reveal" style={{ "--i": 2, margin: "22px 0" } as CSSVars}>
        <div className="group-title">PUBLIC CHANNELS</div>
        <div className="g-item"><div className="g-main"><b>Email</b><small>公开邮箱待确认</small></div>
          <button className="btn sm" onClick={() => toast("简历邮箱提取不完整，尚未配置 mailto；不会生成虚假联系方式")}>{t("查看配置状态", "Check availability")}</button></div>
        <div className="g-item"><div className="g-main"><b>GitHub / 微信</b><small>{t("GitHub 待提供；微信默认私密。", "GitHub pending; WeChat private by default.")}</small></div>
          <button className="btn sm" onClick={() => toast("尚未配置公开社交渠道")}>{t("渠道状态", "Channel status")}</button></div>
        <div className="g-item"><div className="g-main"><b>{t("招聘信息", "Recruiting")}</b><small>{t("目标岗位、城市、入职时间待本人确认。", "Role preference, location and availability pending confirmation.")}</small></div>
          <button className="btn sm" onClick={() => go("resume")}>查看简历 →</button></div>
      </div>
      <div className="note reveal">不公开手机号、身份证、生日、证书编号。此原型不提交留言、不收集个人数据。</div>
    </>
  );
}

export function MobiPrivacy() {
  const { go } = useMobi();
  return (
    <>
      <Heading a="隐私与公开边界" b="PRIVACY" />
      <article className="article">
        <p className="reveal">此离线公共原型不收集访客信息，不接入第三方统计。真实上线时按实际 Cookie、统计与联系渠道更新声明。</p>
        <p className="reveal">公开资料只含本人授权的求职内容。私密字段由服务端过滤。原型素材为示意，不复制内部业务系统截图。</p>
        <button className="btn reveal" onClick={() => go("home")}>返回首页</button>
      </article>
    </>
  );
}

export function Mobi404() {
  const { go } = useMobi();
  return (
    <div className="empty reveal">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>这一页还没有升起。</h1>
      <p>链接可能已失效，或内容尚未发布。</p>
      <button className="btn primary" onClick={() => go("home")}>返回首页</button>{" "}
      <button className="btn" onClick={() => go("projects")}>浏览作品</button>
    </div>
  );
}
