"use client";

/**
 * 移动 H5 图表构件 —— 逐一对应 09 原型函数：
 * metric / donut / bars / timeline(stepper) / matrix / flowChart / notesChart / dashboard
 * 全部用 className="reveal"（.in 由 MobiApp 的 mount() 集中添加），
 * 图表 0→值过渡与 PC 同一机制（CSS .chart-card.in / .metric.in / .cap.in）。
 */
import { useMobi } from "@/components/mobi/MobiContext";
import { projects, notes, STACK_ORDER, stackCount, typeCount, tagTotal, DATA_NOTE, timelineRows } from "@/lib/mobiData";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function Metric({ label, num, unit, sub, pts, i }: {
  label: string; num: number; unit: string; sub: string; pts: number[]; i: number;
}) {
  const poly = pts.map((v, k) => `${(k / (pts.length - 1)) * 100},${18 - v * 14}`).join(" ");
  return (
    <div className="metric reveal" data-count={num} style={{ "--i": i } as CSSVars}>
      <div className="m-label">{label}</div>
      <div className="m-value"><span className="num">0</span><em>{unit}</em></div>
      <div className="m-sub">{sub}</div>
      <svg className="spark" viewBox="0 0 100 18" preserveAspectRatio="none"><polyline points={poly} /></svg>
    </div>
  );
}

export function Donut({ items, title, sub, chip, i, size = 126 }: {
  items: { label: string; value: number; color: string }[];
  title: string; sub: string; chip: string; i: number; size?: number;
}) {
  const th = 15, r = (size - th) / 2, c = 2 * Math.PI * r;
  const total = items.reduce((n, x) => n + x.value, 0);
  /* 用前缀和计算偏移，避免在 render 中重新赋值变量 */
  const offsets = items.reduce<number[]>((arr, x, k) => {
    arr.push(k === 0 ? 0 : arr[k - 1] + (c * items[k - 1].value) / total);
    return arr;
  }, []);
  const segs = items.map((x, k) => {
    const len = Math.max(0, (c * x.value) / total - 3);
    const off = -offsets[k];
    return (
      <circle key={k} className="donut-seg" cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={x.color} strokeWidth={th} strokeLinecap="round"
        style={{ "--dash": `${len} ${c - len}` } as CSSVars} strokeDashoffset={off} />
    );
  });
  return (
    <div className="chart-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="c-head">
        <div><div className="c-title">{title}</div><div className="c-sub">{sub}</div></div>
        <span className="c-chip">{chip}</span>
      </div>
      <div className="donut-wrap">
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
          {segs}
          <text className="donut-center" x={size / 2} y={size / 2 + 3} textAnchor="middle">{total}</text>
          <text className="donut-center-s" x={size / 2} y={size / 2 + 19} textAnchor="middle">TOTAL</text>
        </svg>
        <div className="legend">
          {items.map((x, k) => (
            <div className="legend-item" key={k}><i style={{ background: x.color }} /><span>{x.label}</span><b>{x.value}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Bars({ title, sub, chip, i }: { title: string; sub: string; chip: string; i: number }) {
  const { filterByTag } = useMobi();
  const max = Math.max(...stackCount.map((x) => x.value));
  return (
    <div className="chart-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="c-head">
        <div><div className="c-title">{title}</div><div className="c-sub">{sub}</div></div>
        <span className="c-chip">{chip}</span>
      </div>
      <div className="bars">
        {stackCount.map((x, k) => (
          <div className="bar-row" key={x.label} style={{ "--d": `${k * 55}ms` } as CSSVars} onClick={() => filterByTag(x.label)}>
            <span className="bar-label">{x.label}</span>
            <div className="bar-track">
              <span className="bar-fill" style={{ "--w": `${((x.value / max) * 100).toFixed(1)}%`, "--c": k === 0 ? "var(--c-blue)" : k === 1 ? "var(--c-indigo)" : "var(--c-orange)" } as CSSVars} />
            </div>
            <span className="bar-val">{x.value}</span>
          </div>
        ))}
      </div>
      <div className="data-note">{DATA_NOTE}</div>
    </div>
  );
}

export function Stepper({ i }: { i: number }) {
  return (
    <div className="chart-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="c-head">
        <div><div className="c-title">经历与案例时间轴</div><div className="c-sub">按简历与案例中的原始日期排布 · 前 3 条为工作经历</div></div>
        <span className="c-chip">STEPPER</span>
      </div>
      <div className="stepper">
        {timelineRows.map((r, k) => (
          <div className="step" key={k} style={{ "--step-c": r.c, "--sw": r.w, "--d": `${k * 80}ms` } as CSSVars}>
            <div className="st-date">{r.d}</div>
            <div className="st-name">{r.n}</div>
            <div className="st-sub">{r.s}</div>
            <div className="st-bar" />
          </div>
        ))}
      </div>
      <div className="data-note">条长仅表达时间先后与区间相对长度，不表示精确工期；「至今」按原型演示时点 2026.11 收束。</div>
    </div>
  );
}

export function Matrix({ i }: { i: number }) {
  const cols = STACK_ORDER.length;
  return (
    <div className="chart-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="c-head">
        <div><div className="c-title">案例 × 技术栈矩阵</div><div className="c-sub">4 个案例 / {cols} 类技术标签 / 共 {tagTotal} 个标注</div></div>
        <span className="c-chip">MATRIX</span>
      </div>
      <div className="matrix-scroll">
        <div className="matrix" style={{ "--cols": cols } as CSSVars}>
          <div className="mx-corner">CASE / STACK</div>
          {STACK_ORDER.map((k) => <div className="mx-h" key={k}>{k}</div>)}
          {projects.map((p, ri) => (
            <div key={`row-${p.id}`} style={{ display: "contents" }}>
              <div className="mx-row" title={p.zh}>{p.zh}</div>
              {STACK_ORDER.map((k, ci) => (
                <div key={ci} className={`mx-cell ${p.tags.includes(k) ? "on" : ""}`}
                  style={{ "--d": `${(ri * cols + ci) * 20}ms` } as CSSVars} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-hint">← 左右滑动查看全部技术标签 →</div>
    </div>
  );
}

export function FlowChart({ i }: { i: number }) {
  const steps = ["界面层", "交互状态", "数据契约", "服务端校验"];
  return (
    <div className="chart-card reveal" style={{ "--i": i } as CSSVars}>
      <div className="c-head">
        <div><div className="c-title">交付链路 · 分层示意</div><div className="c-sub">原型「03 / 技术方案」中的原始链路可视化</div></div>
        <span className="c-chip">FLOW</span>
      </div>
      <div className="flow">
        {steps.map((s, k) => (
          <div className="flow-node" key={k} style={{ "--d": `${k * 130}ms` } as CSSVars}>
            <div className="f-dot">0{k + 1}</div><div className="f-name">{s}</div>
          </div>
        ))}
      </div>
      <div className="flow-cap">界面层 → 交互状态 → 数据契约 → 服务端校验<br />清晰边界 / 可复用能力</div>
    </div>
  );
}

export function NotesChart({ i }: { i: number }) {
  const items = [
    { label: "博客", value: notes.filter((n) => n.type === "博客").length, color: "var(--c-blue)" },
    { label: "笔记", value: notes.filter((n) => n.type === "笔记").length, color: "var(--c-indigo)" },
  ];
  return <Donut items={items} title="拟写内容结构分布" sub={`共 ${notes.length} 篇 · 均为未发布示例`} chip="OUTLINE" i={i} />;
}

export function Dashboard({ i }: { i: number }) {
  const { t } = useMobi();
  return (
    <section className="section" style={{ "--i": i } as CSSVars}>
      <div className="section-head reveal">
        <span className="eyebrow">DATA SNAPSHOT / 01</span>
        <h2 style={{ marginTop: 8 }}>{t("一眼看懂这份作品集", "A snapshot of this portfolio")}</h2>
        <p className="sub">{t("以下数字全部来自本原型内已有的条目计数，不引入任何未经验证的指标。", "Every figure below is a count of entries already present in this prototype.")}</p>
      </div>
      <div className="dash">
        <Metric label="CASES" num={projects.length} unit={t("个案例", "cases")} sub={t("业务系统 / 活动网站 / 视觉展示", "Business / campaign / exhibition")} pts={[0.25, 0.4, 0.35, 0.6, 0.8, 1]} i={0} />
        <Metric label="EXPERIENCE" num={3} unit={t("段经历", "roles")} sub={t("简历所列工作经历", "Roles listed in the resume")} pts={[0.2, 0.45, 0.5, 0.75, 0.9, 1]} i={1} />
        <Metric label="STACK TAGS" num={tagTotal} unit={t("个标注", "tags")} sub={t("4 个案例的技术标签总数", "Total tags across 4 cases")} pts={[0.3, 0.45, 0.6, 0.55, 0.8, 1]} i={2} />
        <Metric label="OUTLINES" num={notes.length} unit={t("篇拟写", "outlines")} sub={t("拟写示例 · 尚未发布", "Planned · not published")} pts={[0.2, 0.4, 0.6, 0.7, 0.85, 1]} i={3} />
      </div>
      <Donut items={typeCount} title="案例类型分布" sub="按 projects 的 type 字段计数" chip="DONUT" i={0} />
      <Bars title="技术栈出现频次" sub="按 projects 的 tags 字段计数 · 点击任一行可跳转筛选" chip="BARS · CLICKABLE" i={1} />
    </section>
  );
}
