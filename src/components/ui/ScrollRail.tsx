"use client";

import { useEffect, useRef } from "react";

/**
 * Vertical rail that fills as its parent scrolls past the middle of the
 * screen. Purely decorative: the steps it sits beside are static HTML, and
 * without JS (or under reduced motion) the rail is drawn full.
 */
export default function ScrollRail({ className = "" }: { className?: string }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const track = fill?.parentElement;
    if (!fill || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const focus = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (focus - rect.top) / Math.max(1, rect.height)));
      fill.style.transform = `scaleY(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <span aria-hidden className={`absolute w-px bg-border ${className}`}>
      <span ref={fillRef} className="absolute inset-0 origin-top bg-brand" />
    </span>
  );
}
