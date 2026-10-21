"use client";

import { useEffect, useRef } from "react";
import { LAND_DOTS_B64, LAND_POINT_COUNT } from "./landDots";

/**
 * The hero's horizon: a huge dotted night globe whose top rises out of the
 * bottom of the screen, with our route lit across it. Feeder flights run
 * from Chinese cities into the Xianyang warehouse, the main flight goes on
 * to Tashkent.
 *
 * Canvas 2D with an orthographic projection: ~3 000 dots and a handful of
 * arcs draw in well under a frame on a budget phone, with no WebGL context
 * to lose and no 3D library to ship. The loop stops when the globe is off
 * screen or the tab is hidden; reduced motion gets one still frame.
 *
 * Interaction: the globe leans towards the pointer, can be dragged (with
 * inertia, drifting home after a pause), and turns as the hero scrolls away.
 * Touch uses `pan-y`, so a vertical swipe still scrolls the page.
 */

type LatLon = readonly [lat: number, lon: number];
type Vec3 = [number, number, number];

const XIANYANG: LatLon = [34.44, 108.75];
const TASHKENT: LatLon = [41.3, 69.24];
const FEEDERS: LatLon[] = [
  [23.13, 113.26], // Guangzhou
  [22.54, 114.06], // Shenzhen
  [29.31, 120.08], // Yiwu
  [31.23, 121.47], // Shanghai
  [39.9, 116.4], // Beijing
  [30.57, 104.07], // Chengdu
];

const CENTER_LON = 92;
/** Phones see a deep cap of the globe; wide screens a shallow one, so tilt the route higher there. */
const CENTER_LAT = 4;
const CENTER_LAT_WIDE = -12;
const DEG = Math.PI / 180;
const MAIN_MS = 4200;
const FEEDER_MS = 2400;
const FEEDER_GAP_MS = 1400;
const TRAIL = 0.28;
const DOT_SHADES = 6;
const DRAG_GAIN = 0.12;
const INERTIA = 0.93;
const HOME_AFTER_MS = 2500;
/** How far the globe leans towards the pointer, in degrees. */
const POINTER_LON = 7;
const POINTER_LAT = 4;
/** Scroll parallax as the hero leaves: turn west, tilt up. */
const SCROLL_LON = -14;
const SCROLL_LAT = 12;

function toVec(lat: number, lon: number): Vec3 {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return [Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)];
}

function landPoints(): Vec3[] {
  const bytes = Uint8Array.from(atob(LAND_DOTS_B64), (c) => c.charCodeAt(0));
  const view = new DataView(bytes.buffer);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: Vec3[] = [];
  for (let k = 0; k < bytes.length; k += 2) {
    const i = view.getUint16(k, true);
    const y = 1 - ((i + 0.5) * 2) / LAND_POINT_COUNT;
    const r = Math.sqrt(1 - y * y);
    const lambda = i * golden;
    points.push([r * Math.sin(lambda), y, r * Math.cos(lambda)]);
  }
  return points;
}

/** Great-circle path from a to b, lifted off the surface in the middle. */
function arcPath(a: Vec3, b: Vec3, liftScale: number, steps = 72): Vec3[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega) || 1;
  const lift = (0.02 + omega * 0.35) * liftScale;
  const path: Vec3[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    const h = 1 + lift * Math.sin(Math.PI * t);
    path.push([(a[0] * wa + b[0] * wb) * h, (a[1] * wa + b[1] * wb) * h, (a[2] * wa + b[2] * wb) * h]);
  }
  return path;
}

function cssVar(el: Element, name: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

interface RouteGlobeProps {
  label: string;
  fromLabel: string;
  toLabel: string;
}

export default function RouteGlobe({ label, fromLabel, toLabel }: RouteGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const font = getComputedStyle(document.body).fontFamily;
    const rgb = (name: string, fallback: string) => cssVar(canvas, name, fallback).split(" ").join(",");
    // Re-read whenever the theme flips (ThemeToggle sets data-theme on <html>).
    const readPalette = () => ({
      brand: cssVar(canvas, "--brand", "#f26b1d"),
      amberRgb: rgb("--amber-rgb", "255 154 60"),
      brandRgb: rgb("--brand-rgb", "242 107 29"),
      fg2: cssVar(canvas, "--fg-2", "#a3a9b5"),
      hi: cssVar(canvas, "--globe-hi", "#1a1712"),
      mid: cssVar(canvas, "--globe-mid", "#0e1015"),
      lo: cssVar(canvas, "--globe-lo", "#07090c"),
      dotRgb: rgb("--globe-dot-rgb", "255 255 255"),
      dotMax: Number(cssVar(canvas, "--globe-dot-max", "0.6")) || 0.6,
      glow: Number(cssVar(canvas, "--globe-glow", "1")) || 1,
      light: document.documentElement.dataset.theme === "light",
    });
    let pal = readPalette();

    const land = landPoints();
    const hub = toVec(...XIANYANG);
    const dest = toVec(...TASHKENT);
    const feeders = FEEDERS.map(([lat, lon]) => toVec(lat, lon));
    const feederArcs = feeders.map((f) => arcPath(f, hub, 0.8, 40));
    const mainArc = arcPath(hub, dest, 1.25);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    // Halo, night side and rim never change with rotation: paint them once
    // per size on a second canvas and copy them in each frame.
    const backdrop = document.createElement("canvas");
    const paintBackdrop = () => {
      const bctx = backdrop.getContext("2d");
      if (!bctx) return;
      backdrop.width = canvas.width;
      backdrop.height = canvas.height;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const radius = width * 0.46;
      const cx = width / 2;
      const cy = height / 2;

      // Atmosphere: warm light along the rim, fading into space.
      const halo = bctx.createRadialGradient(cx, cy, radius * 0.94, cx, cy, radius * 1.16);
      const { amberRgb, brandRgb } = pal;
      halo.addColorStop(0, `rgba(${amberRgb},0)`);
      halo.addColorStop(0.28, `rgba(${amberRgb},${0.28 * pal.glow})`);
      halo.addColorStop(0.5, `rgba(${brandRgb},${0.1 * pal.glow})`);
      halo.addColorStop(1, `rgba(${brandRgb},0)`);
      bctx.fillStyle = halo;
      bctx.beginPath();
      bctx.arc(cx, cy, radius * 1.16, 0, Math.PI * 2);
      bctx.fill();

      // The night side: lit faintly from above.
      const body = bctx.createRadialGradient(cx, cy - radius * 0.9, radius * 0.1, cx, cy, radius);
      body.addColorStop(0, pal.hi);
      body.addColorStop(0.45, pal.mid);
      body.addColorStop(1, pal.lo);
      bctx.fillStyle = body;
      bctx.beginPath();
      bctx.arc(cx, cy, radius, 0, Math.PI * 2);
      bctx.fill();

      const rim = bctx.createLinearGradient(0, cy - radius, 0, cy - radius * 0.2);
      rim.addColorStop(0, `rgba(${amberRgb},0.75)`);
      rim.addColorStop(1, `rgba(${amberRgb},0)`);
      bctx.strokeStyle = rim;
      bctx.lineWidth = 1.25;
      bctx.stroke();
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      paintBackdrop();
    };
    resize();

    let dragLon = 0;
    let dragLat = 0;
    let velLon = 0;
    let velLat = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let releasedAt = 0;
    // Pointer lean, eased towards its target every frame.
    let leanLon = 0;
    let leanLat = 0;
    let targetLon = 0;
    let targetLat = 0;

    const scrollProgress = (): number => {
      const section = canvas.closest("section") ?? canvas;
      const rect = section.getBoundingClientRect();
      return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.9)));
    };

    const draw = (now: number) => {
      const still = reduceMotion.matches;
      const scroll = still ? 0 : scrollProgress();
      const eased = scroll * scroll * (3 - 2 * scroll);

      if (!still) {
        leanLon += (targetLon - leanLon) * 0.06;
        leanLat += (targetLat - leanLat) * 0.06;
        if (!dragging) {
          dragLon += velLon;
          dragLat += velLat;
          velLon *= INERTIA;
          velLat *= INERTIA;
          if (now - releasedAt > HOME_AFTER_MS) {
            dragLon *= 0.97;
            dragLat *= 0.97;
          }
        }
      }

      const radius = width * 0.46;
      const cx = width / 2;
      const cy = height / 2;

      const drift = still ? 0 : 3 * Math.sin((now / 30_000) * Math.PI * 2);
      const lon0 = (CENTER_LON + drift + leanLon + SCROLL_LON * eased - dragLon) * DEG;
      const lat0 = Math.min(60, Math.max(-30, (window.innerWidth >= 1024 ? CENTER_LAT_WIDE : CENTER_LAT) + leanLat + SCROLL_LAT * eased + dragLat)) * DEG;
      const cosL = Math.cos(lon0);
      const sinL = Math.sin(lon0);
      const cosP = Math.cos(lat0);
      const sinP = Math.sin(lat0);

      const project = (v: Vec3): Vec3 => {
        const x1 = v[0] * cosL - v[2] * sinL;
        const z1 = v[0] * sinL + v[2] * cosL;
        const y2 = v[1] * cosP - z1 * sinP;
        const z2 = v[1] * sinP + z1 * cosP;
        return [cx + x1 * radius, cy - y2 * radius, z2];
      };
      const visible = (p: Vec3): boolean => p[2] > 0 || Math.hypot(p[0] - cx, p[1] - cy) > radius;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Only the top cap shows above the hero's bottom edge; skip the rest.
      const section = canvas.closest("section");
      const shownBottom = section
        ? Math.min(height, section.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top)
        : height;
      if (shownBottom <= 0) return;
      const sourceRows = Math.min(backdrop.height, Math.ceil(shownBottom * dpr));
      if (sourceRows > 0) ctx.drawImage(backdrop, 0, 0, backdrop.width, sourceRows, 0, 0, width, sourceRows / dpr);

      // Dots grouped by depth into a few shades: one fill per shade instead
      // of a state change per dot.
      const dot = Math.max(1.2, radius / 300);
      const shades: Path2D[] = Array.from({ length: DOT_SHADES }, () => new Path2D());
      for (const v of land) {
        const p = project(v);
        if (p[2] <= 0.04 || p[1] > shownBottom + dot) continue;
        shades[Math.min(DOT_SHADES - 1, Math.floor(p[2] * DOT_SHADES))].rect(p[0] - dot / 2, p[1] - dot / 2, dot, dot);
      }
      const { brand, amberRgb, brandRgb, fg2 } = pal;
      // The comet's hot core: near-white at night, deep orange by day.
      const core = pal.light ? brand : "#fff4e6";
      ctx.fillStyle = `rgb(${pal.dotRgb})`;
      shades.forEach((path, i) => {
        ctx.globalAlpha = 0.1 + (pal.dotMax - 0.1) * ((i + 0.5) / DOT_SHADES);
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";

      const strokePath = (points: Vec3[], from = 0, to = points.length - 1) => {
        ctx.beginPath();
        let open = false;
        for (let i = from; i <= to; i++) {
          const p = points[i];
          if (!visible(p)) {
            open = false;
            continue;
          }
          if (open) ctx.lineTo(p[0], p[1]);
          else ctx.moveTo(p[0], p[1]);
          open = true;
        }
        ctx.stroke();
      };

      // Feeder flights into the warehouse.
      const feederCycle = FEEDER_MS + FEEDER_GAP_MS;
      feederArcs.forEach((path, index) => {
        const projected = path.map(project);
        ctx.strokeStyle = brand;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1;
        strokePath(projected);

        const t = still ? 1 : ((now + (index * feederCycle) / feederArcs.length) % feederCycle) / FEEDER_MS;
        if (t <= 1 + TRAIL) {
          const last = projected.length - 1;
          const head = Math.min(t, 1) * last;
          const tail = Math.max(0, t - TRAIL) * last;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.9;
          strokePath(projected, Math.floor(tail), Math.ceil(head));
        }
      });

      // Main flight: a glowing line with a bright comet riding it.
      const main = mainArc.map(project);
      ctx.strokeStyle = `rgba(${brandRgb},1)`;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 7;
      strokePath(main);
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = `rgba(${amberRgb},1)`;
      strokePath(main);
      ctx.globalAlpha = 1;

      const mt = still ? 0.62 : (now % MAIN_MS) / MAIN_MS;
      const last = main.length - 1;
      const headIndex = Math.min(last, Math.floor(mt * last));
      const headPoint = main[headIndex];
      if (visible(headPoint)) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = core;
        strokePath(main, Math.max(0, headIndex - Math.round(last * 0.12)), headIndex);
        const glow = ctx.createRadialGradient(headPoint[0], headPoint[1], 0, headPoint[0], headPoint[1], 26);
        glow.addColorStop(0, pal.light ? `rgba(${brandRgb},0.95)` : "rgba(255,244,230,0.95)");
        glow.addColorStop(0.2, `rgba(${amberRgb},0.6)`);
        glow.addColorStop(1, `rgba(${amberRgb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(headPoint[0], headPoint[1], 26, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = brand;
      for (const v of feeders) {
        const p = project(v);
        if (p[2] <= 0) continue;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // The two ends of the route, with a slow pulse and a name.
      const pulse = still ? 0.5 : (now % 2400) / 2400;
      const labelSize = Math.round(Math.min(15, Math.max(12, radius / 50)));
      ctx.font = `500 ${labelSize}px ${font}`;
      ctx.textBaseline = "middle";
      const marker = (v: Vec3, text: string, align: "left" | "right") => {
        const p = project(v);
        if (p[2] <= 0.05) return;
        ctx.fillStyle = `rgba(${amberRgb},${0.45 * (1 - pulse)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4 + pulse * 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fg2;
        // Keep the name inside the canvas's visible width on narrow phones.
        const textWidth = ctx.measureText(text).width;
        const view = canvas.getBoundingClientRect();
        const minX = -view.left + 8;
        const maxX = window.innerWidth - view.left - 8;
        let x = align === "left" ? p[0] + 14 : p[0] - 14 - textWidth;
        x = Math.min(maxX - textWidth, Math.max(minX, x));
        ctx.textAlign = "left";
        ctx.fillText(text, x, p[1] - 14);
      };
      marker(hub, fromLabel, "left");
      marker(dest, toLabel, "right");
    };

    let frame = 0;
    let onScreen = true;
    const tick = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion.matches || !onScreen || document.hidden) {
        draw(0);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      pal = readPalette();
      paintBackdrop();
      start();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", start);
    reduceMotion.addEventListener("change", start);

    const onLean = (e: PointerEvent) => {
      if (!finePointer.matches) return;
      targetLon = -((e.clientX / window.innerWidth) - 0.5) * 2 * POINTER_LON;
      targetLat = ((e.clientY / window.innerHeight) - 0.5) * 2 * POINTER_LAT;
    };
    const onDown = (e: PointerEvent) => {
      if (reduceMotion.matches) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velLon = 0;
      velLat = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      velLon = (e.clientX - lastX) * DRAG_GAIN;
      velLat = (e.clientY - lastY) * DRAG_GAIN;
      dragLon += velLon;
      dragLat += velLat;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      releasedAt = performance.now();
      canvas.style.cursor = "";
    };
    window.addEventListener("pointermove", onLean, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    start();

    return () => {
      window.removeEventListener("pointermove", onLean);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", start);
      reduceMotion.removeEventListener("change", start);
    };
  }, [fromLabel, toLabel]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="block h-full w-full cursor-grab touch-pan-y select-none motion-reduce:cursor-default"
    />
  );
}
