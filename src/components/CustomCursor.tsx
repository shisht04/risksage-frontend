"use client";

import { useEffect, useRef, useState } from "react";

// Elements that grow the cursor ring on hover.
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, [data-cursor="pointer"], .cursor-pointer';

/**
 * Custom cursor: a small accent dot that follows the mouse exactly, plus a
 * ring that trails behind it and grows over clickable things. The dots
 * always render and the stylesheet hides them on touch devices and for
 * reduced motion, so there is no state gate that can leave the mouse
 * listeners unattached. All browser APIs are touched inside useEffect, so
 * the static export prerenders cleanly.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let shown = false;

    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!shown) {
        shown = true;
        setVisible(true);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest(INTERACTIVE_SELECTOR));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`rs-cursor-ring${hovering ? " is-hover" : ""}${visible ? "" : " is-hidden"}`}
      >
        <div className="rs-cursor-ring-inner" />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`rs-cursor-dot${hovering ? " is-hover" : ""}${visible ? "" : " is-hidden"}`}
      >
        <div className="rs-cursor-dot-inner" />
      </div>
    </>
  );
}
