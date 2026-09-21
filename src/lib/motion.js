import { useEffect, useRef } from "react";

export const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Adds class "in" when the element scrolls into view. Children with [data-stagger] animate one after another. */
export function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion() || !("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

/**
 * 3D tilt that follows the pointer. Sets CSS vars --rx/--ry (rotation) and --mx/--my (pointer % for glare).
 * Touch devices get a gentle press effect instead.
 */
export function useTilt(max = 10) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
        el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
      });
    };
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [max]);
  return ref;
}

/** Whole-section pointer parallax: children with data-depth="N" drift by N * pointer offset. */
export function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const layers = el.querySelectorAll("[data-depth]");
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate3d(${dx * d}px, ${dy * d}px, 0)${l.dataset.tilt ? ` rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)` : ""}`;
      }));
    };
    const leave = () => layers.forEach((l) => { l.style.transform = ""; });
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return ref;
}
