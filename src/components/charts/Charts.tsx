"use client";

/**
 * 数据可视化构件 —— 逐一对应原型函数：
 * metric() / donut() / bars() / gantt() / matrix() / flowChart() / noteChart() / dashboard()
 */
import { useApp } from "@/components/app/AppContext";
import { useReveal, useCountUp } from "@/components/app/useReveal";
import { useTip } from "@/components/app/useTip";
import { Fragment } from "react";
import {
  projects,
  notes,
  stackCount,
  typeCount,
  tagTotal,
  DATA_NOTE,
  ganttRows,
  STACK_ORDER,
  C,
} from "@/lib/data";

/* ================= Metric ================= */
export function Metric({
  label,
  num,
  unit,
  sub,
  pts,
  i,
}: {
  label: string;
  num: number;
  unit: string;
  sub: string;
  pts: number[];
  i: number;
}) {
  const { pref } = useApp();
  const ref = useReveal<HTMLDivElement>();
  const countRef = useCountUp(num, true, pref.motion === "off");
  const poly = pts.map((v, k) => `${(k / (pts.length - 1)) * 100},${24 - v * 20}`).join(" ");
  return (
    <div ref={ref} className="metric reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="m-label">{label}</div>
      <div className="m-value">
        <span className="num" ref={countRef}>
          0
        </span>
        <em>{unit}</em>
      </div>
      <div className="m-sub">{sub}</div>
      <svg className="spark" viewBox="0 0 100 24" preserveAspectRatio="none">
        <polyline points={poly} />
      </svg>
    </div>
  );
}

/* ================= Donut ================= */
export interface DonutItem {
  label: string;
  value: number;
  color: string;
}
export function Donut({
  items,
  title,
  sub,
  chip,
  i,
}: {
  items: DonutItem[];
  title: string;
  sub: string;
  chip: string;
  i: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const tip = useTip();
  const size = 178;
  const th = 20;
  const total = items.reduce((n, x) => n + x.value, 0);
  const r = (size - th) / 2;
  const c = 2 * Math.PI * r;
  /* 预计算每段偏移量，避免 render 中累加可变变量 */
  const offsets = items.map((x) => (c * x.value) / total);

  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">{title}</div>
          <div className="c-sub">{sub}</div>
        </div>
        <span className="c-chip">{chip}</span>
      </div>
      <div className="donut-wrap">
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
          {items.map((x, idx) => {
            const len = Math.max(0, (c * x.value) / total - 3);
            const offset = -offsets.slice(0, idx).reduce((n, v) => n + v, 0);
            return (
              <circle
                key={idx}
                className="donut-seg"
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={x.color}
                strokeWidth={th}
                strokeLinecap="round"
                style={{ "--dash": `${len} ${c - len}`, "--p": offset } as React.CSSProperties}
                strokeDashoffset={offset}
                {...tip(`${x.label} · ${x.value} / ${total}`)}
              />
            );
          })}
          <text className="donut-center" x={size / 2} y={size / 2 + 4} textAnchor="middle">
            {total}
          </text>
          <text className="donut-center-s" x={size / 2} y={size / 2 + 24} textAnchor="middle">
            TOTAL
          </text>
        </svg>
        <div className="legend">
          {items.map((x, idx) => (
            <div key={idx} className="legend-item" {...tip(`${x.label} · ${x.value} / ${total}`)}>
              <i style={{ background: x.color }} />
              <span>{x.label}</span>
              <b>{x.value}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Bars（技术栈出现频次） ================= */
export function Bars({ title, sub, chip, i }: { title: string; sub: string; chip: string; i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const tip = useTip();
  const { filterByTag } = useApp();
  const max = Math.max(...stackCount.map((x) => x.value));
  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">{title}</div>
          <div className="c-sub">{sub}</div>
        </div>
        <span className="c-chip">{chip}</span>
      </div>
      <div className="bars">
        {stackCount.map((x, k) => (
          <div
            key={x.label}
            className="bar-row"
            style={{ "--d": `${k * 60}ms` } as React.CSSProperties}
            onClick={() => filterByTag(x.label)}
            {...tip(`${x.label} · 出现 ${x.value} 次 · 点击筛选作品`)}
          >
            <span className="bar-label">{x.label}</span>
            <div className="bar-track">
              <span
                className="bar-fill"
                style={
                  {
                    "--w": `${((x.value / max) * 100).toFixed(1)}%`,
                    "--c": k === 0 ? "var(--c-blue)" : k === 1 ? "var(--c-indigo)" : "var(--c-orange)",
                  } as React.CSSProperties
                }
              />
            </div>
            <span className="bar-val">{x.value}</span>
          </div>
        ))}
      </div>
      <div className="data-note">{DATA_NOTE}</div>
    </div>
  );
}

/* ================= Gantt（经历与案例时间轴） ================= */
export function Gantt({ i }: { i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const tip = useTip();
  const W = 820;
  const left = 128;
  const right = 18;
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const min = 2020.5;
  const max = 2026.95;
  const xOf = (y: number) => left + (Math.min(max, Math.max(min, y)) - min) / (max - min) * (W - left - right);
  const barH = 16;
  const gap = 29;
  const top = 34;

  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">经历与案例时间轴</div>
          <div className="c-sub">按简历与案例中的原始日期排布 · 上 3 行为工作经历，下 4 行为案例</div>
        </div>
        <span className="c-chip">TIMELINE</span>
      </div>
      <svg className="tl-svg" viewBox={`0 0 ${W} 250`} role="img" aria-label="经历与案例时间轴">
        {years.map((y) => (
          <g key={y}>
            <line className="tl-grid" x1={xOf(y)} y1={26} x2={xOf(y)} y2={232} />
            <text className="tl-sub" x={xOf(y)} y={16} textAnchor="middle">
              {y}
            </text>
          </g>
        ))}
        {ganttRows.map((r, k) => {
          const x = xOf(r.s);
          const w = Math.max(6, xOf(r.e) - x);
          const y = top + k * gap;
          return (
            <g key={r.l}>
              <text className="tl-label" x={0} y={y + 12}>
                {r.l}
              </text>
              <rect
                className="tl-bar"
                x={x}
                y={y}
                width={w}
                height={barH}
                rx={8}
                fill={r.c}
                style={{ "--d": `${k * 70}ms` } as React.CSSProperties}
                {...tip(`${r.l} · ${r.d}`)}
              />
            </g>
          );
        })}
        <line className="tl-grid" x1={left} y1={26} x2={left} y2={232} />
      </svg>
      <div className="data-note">
        时间刻度按年份近似映射，用于呈现先后关系，不表示精确工期；「至今」按原型演示时点 2026.11 收束。
      </div>
    </div>
  );
}

/* ================= Matrix（案例 × 技术栈） ================= */
export function Matrix({ i }: { i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const tip = useTip();
  const cols = STACK_ORDER.length;
  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">案例 × 技术栈矩阵</div>
          <div className="c-sub">
            4 个案例 / {cols} 类技术标签 / 共 {tagTotal} 个标注 · 亮色格表示案例标签中出现
          </div>
        </div>
        <span className="c-chip">MATRIX</span>
      </div>
      <div className="matrix" style={{ "--cols": cols } as React.CSSProperties}>
        <div className="mx-corner">CASE / STACK</div>
        {STACK_ORDER.map((k) => (
          <div key={k} className="mx-h">
            {k}
          </div>
        ))}
        {projects.map((p, ri) => (
          <Fragment key={p.id}>
            <div className="mx-row" title={p.zh}>
              {p.zh}
            </div>
            {STACK_ORDER.map((k, ci) => {
              const on = p.tags.includes(k);
              return (
                <div
                  key={`${p.id}-${k}`}
                  className={`mx-cell ${on ? "on" : ""}`}
                  style={{ "--d": `${(ri * cols + ci) * 22}ms` } as React.CSSProperties}
                  {...tip(`${p.zh} × ${k} · ${on ? "使用该技术" : "未标注"}`)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/* ================= Flow（交付链路） ================= */
export function FlowChart({ i }: { i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const steps = ["界面层", "交互状态", "数据契约", "服务端校验"];
  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">交付链路 · 分层示意</div>
          <div className="c-sub">原型「03 / 技术方案」中的原始链路可视化</div>
        </div>
        <span className="c-chip">FLOW</span>
      </div>
      <div className="flow">
        {steps.map((s, k) => (
          <div key={s} className="flow-node" style={{ "--d": `${k * 140}ms` } as React.CSSProperties}>
            <div className="f-no">0{k + 1}</div>
            <div className="f-name">{s}</div>
            <span className="f-line" />
            <span className="f-dot" style={{ "--d": `${k * 0.5}s` } as React.CSSProperties} />
          </div>
        ))}
      </div>
      <div className="flow-cap">界面层 → 交互状态 → 数据契约 → 服务端校验　·　清晰边界 / 可复用能力</div>
    </div>
  );
}

/* ================= NoteChart（拟写内容结构分布 donut） ================= */
export function NoteChart({ i }: { i: number }) {
  const items: DonutItem[] = [
    { label: "博客", value: notes.filter((n) => n.type === "博客").length, color: "var(--c-blue)" },
    { label: "笔记", value: notes.filter((n) => n.type === "笔记").length, color: "var(--c-indigo)" },
  ];
  return <Donut items={items} title="拟写内容结构分布" sub={`共 ${notes.length} 篇 · 均为未发布示例`} chip="OUTLINE" i={i} />;
}

/* ================= TagBars（拟写主题标签） ================= */
export function TagBars({ i }: { i: number }) {
  const ref = useReveal<HTMLDivElement>();
  const tip = useTip();
  const { go, setQuery } = useApp();
  return (
    <div ref={ref} className="chart-card reveal" style={{ "--i": i } as React.CSSProperties}>
      <div className="c-head">
        <div>
          <div className="c-title">拟写主题标签</div>
          <div className="c-sub">notes 的 tag 字段 · 每篇 1 个主题</div>
        </div>
        <span className="c-chip">TAGS</span>
      </div>
      <div className="bars">
        {notes.map((n, k) => (
          <div
            key={n.id}
            className="bar-row"
            style={{ "--d": `${k * 90}ms` } as React.CSSProperties}
            onClick={() => {
              setQuery(n.tag);
              go("knowledge");
            }}
            {...tip(`${n.tag} · ${n.title}`)}
          >
            <span className="bar-label">{n.tag}</span>
            <div className="bar-track">
              <span
                className="bar-fill"
                style={{ "--w": "100%", "--c": ["var(--c-blue)", "var(--c-indigo)", "var(--c-orange)"][k] } as React.CSSProperties}
              />
            </div>
            <span className="bar-val">1</span>
          </div>
        ))}
      </div>
      <div className="data-note">{DATA_NOTE}</div>
    </div>
  );
}

/* ================= Dashboard（首页数据快照区块） ================= */
export function Dashboard({ i }: { i: number }) {
  const { t } = useApp();
  return (
    <section className="section" style={{ "--i": i } as React.CSSProperties}>
      <div className="section-head">
        <div>
          <span className="eyebrow">DATA SNAPSHOT / 01</span>
          <h2 style={{ marginTop: 12 }}>{t("一眼看懂这份作品集", "A snapshot of this portfolio")}</h2>
          <p className="sub">
            {t(
              "以下数字全部来自本原型内已有的条目计数，不引入任何未经验证的指标。",
              "Every figure below is a count of entries already present in this prototype."
            )}
          </p>
        </div>
        <span className="badge neutral">{t("可点击联动", "Interactive")}</span>
      </div>
      <div className="dash">
        <Metric
          label="CASES"
          num={projects.length}
          unit={t("个案例", "cases")}
          sub={t("业务系统 / 活动网站 / 视觉展示", "Business / campaign / exhibition")}
          pts={[0.25, 0.4, 0.35, 0.6, 0.8, 1]}
          i={0}
        />
        <Metric
          label="EXPERIENCE"
          num={3}
          unit={t("段经历", "roles")}
          sub={t("简历所列工作经历", "Roles listed in the resume")}
          pts={[0.2, 0.45, 0.5, 0.75, 0.9, 1]}
          i={1}
        />
        <Metric
          label="STACK TAGS"
          num={tagTotal}
          unit={t("个标注", "tags")}
          sub={t("4 个案例的技术标签总数", "Total tags across 4 cases")}
          pts={[0.3, 0.45, 0.6, 0.55, 0.8, 1]}
          i={2}
        />
        <Metric
          label="OUTLINES"
          num={notes.length}
          unit={t("篇拟写", "outlines")}
          sub={t("拟写示例 · 尚未发布", "Planned · not published")}
          pts={[0.2, 0.4, 0.6, 0.7, 0.85, 1]}
          i={3}
        />
      </div>
      <div className="chart-grid">
        <Donut items={typeCount} title="案例类型分布" sub="按 projects 的 type 字段计数" chip="DONUT" i={0} />
        <Bars title="技术栈出现频次" sub="按 projects 的 tags 字段计数 · 点击任一行可跳转筛选" chip="BARS · CLICKABLE" i={1} />
      </div>
    </section>
  );
}

export { C };