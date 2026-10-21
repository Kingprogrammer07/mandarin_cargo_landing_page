"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-only and split out: the canvas code and land mask stay off the
// critical path. Until it loads, the hero's own glow stands in for it.
const RouteGlobe = dynamic(() => import("./RouteGlobe"), { ssr: false });

/** Mounts the globe once the page has loaded and the main thread is idle, so the headline and buttons are interactive first. */
export default function HeroGlobe(props: { label: string; fromLabel: string; toLabel: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      else timer = window.setTimeout(() => setReady(true), 600);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);

  return ready ? <div className="h-full w-full animate-[fadein_1.2s_ease_both]"><RouteGlobe {...props} /></div> : null;
}
