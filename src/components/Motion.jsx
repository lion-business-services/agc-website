import { useReveal, useTilt } from "../lib/motion";

/** Scroll-reveal wrapper. variant: "up" (default) | "left" | "right" | "zoom". Add data-stagger on children for sequence. */
export function Reveal({ as: Tag = "div", variant = "up", className = "", children, ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal reveal-${variant} ${className}`} {...rest}>{children}</Tag>;
}

/** 3D tilt card. Wrap any block; it rotates toward the cursor with a moving glare. */
export function Tilt({ as: Tag = "div", max = 8, className = "", children, ...rest }) {
  const ref = useTilt(max);
  return <Tag ref={ref} className={`tilt ${className}`} {...rest}><span className="glare" aria-hidden />{children}</Tag>;
}
