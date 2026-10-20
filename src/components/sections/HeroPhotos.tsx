"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const HOLD_MS = 5500;

/**
 * Photographs of the route that crossfade slowly, like light changing in a
 * room. Pauses while the tab is hidden; reduced motion keeps the first one.
 */
export default function HeroPhotos({ photos }: { photos: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(1);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The other photographs load only after the page has settled, so they
    // never compete with the first one for the first paint.
    const start = window.setTimeout(() => setLoaded(photos.length), 2500);
    const tick = () => {
      if (!document.hidden) setActive((i) => (i + 1) % photos.length);
    };
    timer.current = window.setInterval(tick, HOLD_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer.current);
    };
  }, [photos.length]);

  return (
    <div className="xfade relative h-full w-full overflow-hidden bg-field">
      {photos.slice(0, loaded).map((photo, i) => (
        <div key={photo.src} data-on={i === active ? "" : undefined} className="absolute inset-0" aria-hidden={i !== active}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="kenburns object-cover"
          />
        </div>
      ))}
    </div>
  );
}
