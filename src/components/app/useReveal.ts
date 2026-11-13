"use client";

/**
 * 对应原型 mount() / __mountCards() / IntersectionObserver。
 * - 视口内元素：读 getBoundingClientRect() 强制 reflow 锚定 0 态，再同步加 .in，
 *   使 .reveal/.chart-card 的 CSS transition 从 0 态绘到完成态（图表进度条 0→值）。
 * - 视口外元素：纯 IntersectionObserver，滚动进入视口才渐显，无定时兜底。
 * 组件重建 / deps 变化时会重置 .in 并重播，等价于原型 render() 全量重建后 mount()。
 */
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("in");

    const show = () => el.classList.add("in");
    /* 强制同步 reflow，确保浏览器以 0 态为 transition 起点（原型 __mountCards
       里对视口内 chart/metric/stat 逐个读 getBoundingClientRect 的作用一致） */
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if ((document.documentElement.getAttribute("data-motion") === "off") ||
        (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
        (rect.top < vh && rect.bottom > 0)) {
      show();
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.unobserve(el);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps 由调用方显式传入
  }, deps);

  return ref;
}

/** 数字滚动动画 —— 对应原型 animateNumbers() */
export function useCountUp(target: number, active: boolean, motionOff: boolean) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    if (motionOff) {
      node.textContent = String(target);
      return;
    }
    /* 从 0 起步，但只在 effect 内改写 textContent（SSR 与首帧均为终值，不触发 hydration 文本不匹配） */
    const dur = 900;
    const st = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - st) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      node.textContent = String(Math.round(target * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    node.textContent = "0";
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, motionOff]);
  return ref;
}
