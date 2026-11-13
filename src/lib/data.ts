/**
 * ================================================================
 * Arise Studio · 数据层
 * 100% 对应「07-iOS简约风交互原型.html」内联 <script> 中的
 * projects / notes 原始数据与派生计数逻辑，未增删改一字。
 * ================================================================
 */

export interface ProjectData {
  id: number;
  zh: string;
  en: string;
  type: string;
  tags: string[];
  date: string;
  role: string;
  summary: string;
  english: string;
  points: string[];
}

export interface NoteData {
  id: number;
  title: string;
  en: string;
  type: "博客" | "笔记";
  tag: string;
  intro: string;
}

/** ---------- 原始数据（与原型逐字一致） ---------- */
export const projects: ProjectData[] = [
  {
    id: 1,
    zh: "AI 专区个人中心",
    en: "AI Knowledge Profile",
    type: "业务系统",
    tags: ["React", "Remix", "SSR"],
    date: "2026.10 — 2026.11",
    role: "独立负责个人中心模块",
    summary: "6 类分页、SSR 首屏、未读状态一致性与公共 Hook 抽取。",
    english: "Six profile lists, server rendering, unread-state consistency and reusable hooks.",
    points: [
      "从零搭建用户信息卡、导航与六类列表。",
      "统一分页协议与未读数据来源，解决预取提前消费和计数不同步。",
      "抽取无限滚动、查阅落库与统计同步能力。",
    ],
  },
  {
    id: 2,
    zh: "共创工作坊报名站",
    en: "Co-creation Registration",
    type: "活动网站",
    tags: ["React", "Prisma", "Zod"],
    date: "2026.08",
    role: "独立承接 PC / 移动端开发",
    summary: "动态表单、条件必填、活动数据隔离与重复报名约束。",
    english: "Dynamic forms, conditional validation and activity-scoped data integrity.",
    points: [
      "PC 与移动端双端开发，完成从原型到发布闭环。",
      "Zod 与动态数组管理统一复合校验规则。",
      "活动 ID 隔离与数据库唯一约束兜底防重复。",
    ],
  },
  {
    id: 3,
    zh: "天工计划互动体验",
    en: "Creative Contest Experience",
    type: "活动网站",
    tags: ["React", "Canvas", "H5"],
    date: "2026.09 — 2026.10",
    role: "负责报名、作品表单与分享等链路",
    summary: "多面板日期选择、比例定位海报合成与移动端体验。",
    english: "Multi-panel date selection, proportional poster composition and mobile UX.",
    points: [
      "双端报名与作品提交表单。",
      "多面板日期选择器和可选区间约束。",
      "Canvas 海报按比例定位，维持不同设备输出一致性。",
    ],
  },
  {
    id: 4,
    zh: "IMDT 线上毕业展厅",
    en: "IMDT Online Exhibition",
    type: "视觉展示",
    tags: ["Vue", "TypeScript", "H5"],
    date: "2023 — 2025",
    role: "负责前端开发与年度迭代",
    summary: "数据驱动展陈、横屏视差与 iOS 视口稳定性治理。",
    english: "Data-driven exhibitions, landscape parallax and iOS viewport stability.",
    points: [
      "结构化作品数据与展区数据复用。",
      "移动横屏布局与视差交互。",
      "定位 iOS 导航条导致的视口变化。",
    ],
  },
];

export const notes: NoteData[] = [
  {
    id: 1,
    title: "SSR 首屏与无限滚动，如何衔接？",
    en: "Connecting SSR and infinite scrolling",
    type: "博客",
    tag: "SSR",
    intro: "拟写选题：从数据契约、初始状态和翻页边界梳理实现思路。",
  },
  {
    id: 2,
    title: "未读状态不是一个布尔值",
    en: "Unread state is more than a boolean",
    type: "笔记",
    tag: "React",
    intro: "拟写选题：拆分全局计数与单条查阅状态，避免错误消费。",
  },
  {
    id: 3,
    title: "动态表单的统一校验契约",
    en: "A shared validation contract",
    type: "博客",
    tag: "Zod",
    intro: "拟写选题：字段数组、条件必填与服务端兜底的组织方法。",
  },
];

/** ---------- 派生数据（客观计数，无虚构） ---------- */
export const STACK_ORDER = ["React", "H5", "Remix", "SSR", "Prisma", "Zod", "Canvas", "Vue", "TypeScript"];

export const stackCount = STACK_ORDER.map((k) => ({
  label: k,
  value: projects.filter((p) => p.tags.includes(k)).length,
}));

export const C = {
  blue: "var(--c-blue)",
  indigo: "var(--c-indigo)",
  orange: "var(--c-orange)",
  green: "var(--c-green)",
  teal: "var(--c-teal)",
};

export const typeCount = [
  { label: "业务系统", value: projects.filter((p) => p.type === "业务系统").length, color: C.blue },
  { label: "活动网站", value: projects.filter((p) => p.type === "活动网站").length, color: C.indigo },
  { label: "视觉展示", value: projects.filter((p) => p.type === "视觉展示").length, color: C.orange },
];

export const tagTotal = projects.reduce((n, p) => n + p.tags.length, 0);

export const DATA_NOTE =
  "※ 数据口径：以上图表仅对原型内已有的结构化字段（项目类型、技术标签、日期）做计数与排布，不代表性能、业务增长或任何未经验证的数字。原站「成果以简历中的实际交付范围为依据，不提供未经验证的性能百分比或业务增长数字」的约定在本版中继续保留。";

/** 甘特图行数据（经历与案例时间轴，与原型 gantt() 一致） */
export const ganttRows = [
  { l: "腾讯 IEG · 自研体系管理部", s: 2022.67, e: 2026.95, c: C.blue, d: "2022.09 — 至今" },
  { l: "深圳市思迪信息技术", s: 2021.83, e: 2022.67, c: C.indigo, d: "2021.11 — 2022.09" },
  { l: "深圳市前海云恒丰科技", s: 2020.5, e: 2021.83, c: C.orange, d: "2020.07 — 2021.10" },
  { l: "IMDT 线上毕业展厅", s: 2023, e: 2025.9, c: C.green, d: "2023 — 2025" },
  { l: "共创工作坊报名站", s: 2026.58, e: 2026.72, c: C.teal, d: "2026.08" },
  { l: "天工计划互动体验", s: 2026.67, e: 2026.82, c: C.teal, d: "2026.09 — 2026.10" },
  { l: "AI 专区个人中心", s: 2026.75, e: 2026.95, c: C.teal, d: "2026.10 — 2026.11" },
];

export function getProjectById(id: number): ProjectData | undefined {
  return projects.find((p) => p.id === id);
}
export function getNoteById(id: number): NoteData | undefined {
  return notes.find((n) => n.id === id);
}