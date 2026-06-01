"use client";

import { useEffect } from "react";

/**
 * Mobile debug console (eruda). Loaded ONLY on demand — never for normal traffic,
 * so it costs nothing for real users / SEO.
 *
 *   ?eruda=<TOKEN>  → enable (persists across navigation via localStorage)
 *   ?eruda=off      → disable
 *
 * Security notes:
 * - Gated by a secret TOKEN, not a guessable flag, so a `?eruda` link cannot be
 *   weaponized against ordinary visitors.
 * - Script is pinned to an exact version + Subresource Integrity hash + crossOrigin,
 *   so a compromised CDN cannot inject altered code.
 *
 * Use it to inspect network requests (Track / Calculator API) + console on a phone.
 */

// Change this if it ever leaks. Keep it unguessable.
const TOKEN = "mc-dbg-7h3xq2";
const ERUDA_SRC = "https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js";
const ERUDA_SRI = "sha384-HLDsaa31HjuN7tEsKVEpAV7fgp5VmiFQW6h2RIwXA9LPW1XpyjzTbNExDYs9YfHB";

export default function Eruda() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const param = new URLSearchParams(window.location.search).get("eruda");

    if (param === "off") {
      window.localStorage.removeItem("eruda");
      return;
    }

    // Only the correct token (or a prior token-authorized session) may enable it.
    const enabled = param === TOKEN || window.localStorage.getItem("eruda") === TOKEN;
    if (!enabled) return;

    window.localStorage.setItem("eruda", TOKEN);

    const script = document.createElement("script");
    script.src = ERUDA_SRC;
    script.integrity = ERUDA_SRI;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      (window as unknown as { eruda?: { init: () => void } }).eruda?.init();
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
