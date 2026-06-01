"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

/**
 * Brand splash shown on first load. Fades out once the page has loaded
 * (or after a short fallback), then unmounts. Skipped under reduced-motion.
 */
export default function Preloader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setGone(true), 0);
      return () => clearTimeout(id);
    }
    const start = () => setFading(true);
    let fallback: number;
    if (document.readyState === "complete") {
      fallback = window.setTimeout(start, 500);
    } else {
      window.addEventListener("load", start);
      fallback = window.setTimeout(start, 1600);
    }
    return () => {
      window.removeEventListener("load", start);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setGone(true), 500);
    return () => clearTimeout(t);
  }, [fading]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="animate-pulse">
          <Logo className="h-12 w-auto" />
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-1/3 rounded-full bg-orange-500 animate-loader" />
        </div>
      </div>
    </div>
  );
}
