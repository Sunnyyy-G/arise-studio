"use client";

/**
 * 图表悬浮提示 Hook —— 对应原型 data-tip + initTips()。
 * 用法：<div {...tip("文本")}>...</div>
 */
export function useTip() {
  return (text: string) => ({
    "data-tip": text,
    onMouseEnter: () => {
      const el = document.getElementById("chartTip");
      if (!el) return;
      el.textContent = text;
      el.style.opacity = "1";
    },
    onMouseMove: (e: React.MouseEvent<Element>) => {
      const el = document.getElementById("chartTip");
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    },
    onMouseLeave: () => {
      const el = document.getElementById("chartTip");
      if (!el) return;
      el.style.opacity = "0";
    },
  });
}