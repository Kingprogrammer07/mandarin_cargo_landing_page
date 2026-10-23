"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * A row of moments read left to right. Native horizontal scroll with snap
 * (thumb-friendly on phones); the buttons and the progress bar only help.
 */
export default function StepRow({
  heading,
  prevLabel,
  nextLabel,
  children,
}: {
  heading: ReactNode;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
}) {
  const row = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const width = first ? first.offsetWidth + 32 : 320;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex items-end justify-between gap-6 px-5 sm:px-8">
        {heading}
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => step(-1)} aria-label={prevLabel} disabled={progress <= 0.001}
            className="flex h-12 w-12 items-center justify-center bg-ink text-paper transition-[opacity,transform] active:scale-95 disabled:opacity-30">
            <ArrowLeft size={20} aria-hidden />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={nextLabel} disabled={progress >= 0.999}
            className="flex h-12 w-12 items-center justify-center bg-ink text-paper transition-[opacity,transform] active:scale-95 disabled:opacity-30">
            <ArrowRight size={20} aria-hidden />
          </button>
        </div>
      </div>
      <div aria-hidden className="mx-5 mt-6 h-1.5 bg-paper-2 sm:mx-8">
        <div className="h-full origin-left bg-ink transition-transform duration-150" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
      </div>
      <ol ref={row} className="snap-row mt-10 flex gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:gap-8 sm:scroll-px-8 sm:px-8">
        {children}
      </ol>
    </>
  );
}
