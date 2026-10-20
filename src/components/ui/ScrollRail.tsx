"use client";

import { useEffect, useRef } from "react";
import { Plane } from "lucide-react";

/**
 * Vertical rail that fills as its parent scrolls past the middle of the
 * screen, with a plane riding the leading edge. Purely decorative: the steps
 * beside it are static HTML. Without JS or under reduced motion the rail is
 * drawn full and the plane rests at the end.
 */
export default function ScrollRail({ className = "" }: { className?: string }) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const plane = planeRef.current;
    const track = fill?.parentElement;
    if (!fill || !plane || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const focus = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (focus - rect.top) / Math.max(1, rect.height)));
      fill.style.transform = `scaleY(${progress})`;
      plane.style.top = `${progress * 100}%`;
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
      <span
        ref={planeRef}
        className="absolute left-1/2 top-full z-[5] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-on-brand shadow-card"
      >
        <Plane size={14} className="rotate-90" />
      </span>
    </span>
  );
}
