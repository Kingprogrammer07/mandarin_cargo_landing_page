"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sets --spot-x / --spot-y on each `[data-spot]` child from the pointer, so a
 * CSS radial gradient can follow the cursor across a card grid. Mouse and pen
 * only: on touch screens the cards stay plain, there is nothing to follow.
 */
export default function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      if (!last) return;
      for (const card of root.querySelectorAll<HTMLElement>("[data-spot]")) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${last.clientX - rect.left}px`);
        card.style.setProperty("--spot-y", `${last.clientY - rect.top}px`);
      }
    };
    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    root.addEventListener("pointermove", onMove);
    root.dataset.spotOn = "";
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      delete root.dataset.spotOn;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
