"use client";

import dynamic from "next/dynamic";

/** Placeholder with the globe's outline so the layout never shifts. */
function GlobeShell() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="aspect-square w-[84%] rounded-full border border-border bg-surface" />
    </div>
  );
}

// Client-only and split out: the canvas code and land mask stay off the
// critical path; the headline paints first.
const RouteGlobe = dynamic(() => import("./RouteGlobe"), { ssr: false, loading: GlobeShell });

export default function HeroGlobe({ label }: { label: string }) {
  return <RouteGlobe label={label} />;
}
