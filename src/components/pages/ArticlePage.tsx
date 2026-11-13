"use client";

/**
 * ARTICLE 页 —— 对应原型 render() page==='article' 分支。
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal } from "@/components/app/useReveal";
import { notes } from "@/lib/data";

export function ArticlePage() {
  const { t, go, selected, copyText } = useApp();
  const n = notes.find((x) => x.id === selected) || notes[0];

  const backRef = useReveal<HTMLButtonElement>([selected]);
  const headRef = useReveal<HTMLDivElement>([selected]);
  const noteRef = useReveal<HTMLDivElement>([selected]);
  const s1 = useReveal<HTMLElement>([selected]);
  const s2 = useReveal<HTMLElement>([selected]);
  const s3 = useReveal<HTMLElement>([selected]);

  return (
    <>
      <button ref={backRef} className="btn sm reveal" onClick={() => go("knowledge")}>
        ← {t("返回知识", "Back to knowledge")}
      </button>
      <div ref={headRef} className="page-head reveal">
        <span className="eyebrow">ARISE / WRITING OUTLINE</span>
        <h1>{t(n.title, n.en)}</h1>
      </div>
      <div ref={noteRef} className="note reveal" style={{ "--i": 1, marginBottom: 40 } as React.CSSProperties}>
        拟写内容示例 · 非已发布博文 · 代码仅为独立教学占位。
      </div>
      <article className="article">
        <section ref={s1} className="reveal">
          <h2>问题场景 / Context</h2>
          <p>{n.intro}</p>
        </section>
        <section ref={s2} className="reveal">
          <h2>方案结构 / Approach</h2>
          <p>
            1. 定义数据与状态的责任边界。
            <br />
            2. 统一接口契约并处理边界情况。
            <br />
            3. 用可重复的测试确认行为。
          </p>
          <button
            className="btn sm"
            onClick={() => copyText("type PageResult = { total: number; hasMore: boolean };")}
          >
            复制示例 / Copy
          </button>
          <pre>{`type PageResult = {
  total: number;
  hasMore: boolean;
};`}</pre>
        </section>
        <section ref={s3} className="reveal">
          <h2>测试与复盘 / Reflection</h2>
          <p>验证空数据、重复请求、加载失败和状态恢复。正文、参考链接及可公开代码待本人整理。</p>
          <button className="btn" onClick={() => go("project", 1)}>
            相关案例 →
          </button>
        </section>
      </article>
    </>
  );
}