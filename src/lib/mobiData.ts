/**
 * ================================================================
 * Arise Studio · 移动 H5 数据层
 * 对应「09-iOS简约风移动H5交互原型.html」内联脚本的 projects / notes
 * 及派生计数。原始数据与 PC（07 原型）逐字一致，从 lib/data.ts 复用；
 * 此处仅补充移动端特有的 stepper 时间轴行数据与 DATA_NOTE 文案。
 * ================================================================
 */
import { projects, notes, STACK_ORDER, stackCount, typeCount, tagTotal, C } from "@/lib/data";

export { projects, notes, STACK_ORDER, stackCount, typeCount, tagTotal, C };

export const DATA_NOTE =
  "※ 数据口径：图表仅对原型内已有的结构化字段（项目类型、技术标签、日期）做计数与排布，不代表性能、业务增长或任何未经验证的数字。原站「成果以简历中的实际交付范围为依据，不提供未经验证的性能百分比或业务增长数字」的约定在本版中继续保留。";

/** 移动端 stepper 时间轴行（timeline() 函数内数据，逐字对应原型） */
export const timelineRows = [
  { d: "2020.07 — 2021.10", n: "深圳市前海云恒丰科技有限公司", s: "前端开发工程师 · 后台管理、可视化与 H5 交互", c: C.orange, w: "22%" },
  { d: "2021.11 — 2022.09", n: "深圳市思迪信息技术股份有限公司", s: "前端重构工程师 · 金融机构站点、视觉还原与兼容性", c: C.orange, w: "18%" },
  { d: "2022.09 — 至今", n: "腾讯 IEG · 自研体系管理部", s: "前端开发工程师 · React / Remix / 多端与国际化 / 复杂表单", c: C.blue, w: "74%" },
  { d: "2023 — 2025", n: "IMDT 线上毕业展厅", s: "视觉展示 · Vue / TypeScript / H5", c: C.green, w: "44%" },
  { d: "2026.08", n: "共创工作坊报名站", s: "活动网站 · React / Prisma / Zod", c: C.teal, w: "12%" },
  { d: "2026.09 — 2026.10", n: "天工计划互动体验", s: "活动网站 · React / Canvas / H5", c: C.teal, w: "16%" },
  { d: "2026.10 — 2026.11", n: "AI 专区个人中心", s: "业务系统 · React / Remix / SSR", c: C.teal, w: "18%" },
];

/** 移动端 tabbar 图标（09 原型 ICONS 常量） */
export const ICONS: Record<string, string> = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  projects: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  knowledge: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  resume: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h4"/>',
};
