"use client";

import { useEffect, useRef } from "react";
import { LAND_DOTS_B64, LAND_POINT_COUNT } from "./landDots";

/**
 * Dotted globe with cargo arcs from Chinese cities to Tashkent.
 *
 * Canvas 2D with an orthographic projection: ~3 000 dots and a handful of
 * arcs draw in well under a frame on a budget phone, with no WebGL context
 * to lose and no 3D library to ship. The loop stops when the globe is off
 * screen or the tab is hidden; reduced motion gets one still frame.
 *
 * Interaction: drag to spin (with inertia; the view drifts back home after a
 * pause so the routes stay in front), and scrolling the hero away turns the
 * globe towards Tashkent and zooms in a little. Touch uses `pan-y`, so a
 * vertical swipe still scrolls the page and only a sideways drag spins.
 */

type LatLon = readonly [lat: number, lon: number];

const TASHKENT: LatLon = [41.3, 69.24];
const ORIGINS: LatLon[] = [
  [23.13, 113.26], // Guangzhou
  [22.54, 114.06], // Shenzhen
  [29.31, 120.08], // Yiwu
  [31.23, 121.47], // Shanghai
  [39.9, 116.4], // Beijing
  [30.57, 104.07], // Chengdu
  [43.83, 87.62], // Urumqi
];

/** View centre: between Tashkent and the east coast, tilted so both sit in front. */
const CENTER_LON = 92;
const CENTER_LAT = 28;
const SWAY_DEG = 12;
const SWAY_PERIOD_MS = 26_000;
const ARC_MS = 2600;
const ARC_GAP_MS = 900;
const TRAIL = 0.32;
const DEG = Math.PI / 180;
/** Degrees of rotation per pixel dragged. */
const DRAG_GAIN = 0.25;
const INERTIA = 0.93;
const HOME_AFTER_MS = 2500;
/** Scroll parallax: how far the view turns, tilts and zooms as the hero leaves. */
const SCROLL_LON = TASHKENT[1] - CENTER_LON;
const SCROLL_LAT = 12;
const SCROLL_ZOOM = 0.22;

type Vec3 = [number, number, number];

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
function arcPath(a: Vec3, b: Vec3, steps = 64): Vec3[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega) || 1;
  const lift = 0.08 + omega * 0.22;
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

function cssColor(el: Element, name: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

export default function RouteGlobe({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ink = cssColor(canvas, "--text", "#14161A");
    const brand = cssColor(canvas, "--brand", "#EA580C");
    const surface = cssColor(canvas, "--surface", "#FFFFFF");
    const line = cssColor(canvas, "--border", "#E6E4DE");

    const land = landPoints();
    const target = toVec(...TASHKENT);
    const origins = ORIGINS.map(([lat, lon]) => toVec(lat, lon));
    const arcs = origins.map((o) => arcPath(o, target));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let size = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.min(rect.width, rect.height);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    resize();

    // User rotation on top of the idle sway, in degrees.
    let dragLon = 0;
    let dragLat = 0;
    let velLon = 0;
    let velLat = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let releasedAt = 0;

    /** 0 while the hero is on screen at the top, 1 once it has scrolled away. */
    const scrollProgress = (): number => {
      const section = canvas.closest("section") ?? canvas;
      const rect = section.getBoundingClientRect();
      return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)));
    };

    const draw = (now: number) => {
      const still = reduceMotion.matches;
      const scroll = still ? 0 : scrollProgress();
      const eased = scroll * scroll * (3 - 2 * scroll);

      if (!still && !dragging) {
        dragLon += velLon;
        dragLat += velLat;
        velLon *= INERTIA;
        velLat *= INERTIA;
        if (now - releasedAt > HOME_AFTER_MS) {
          dragLon *= 0.96;
          dragLat *= 0.96;
        }
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const radius = size * 0.42 * (1 + SCROLL_ZOOM * eased);
      const cx = w / 2;
      const cy = h / 2;

      const sway = still ? 0 : SWAY_DEG * Math.sin((now / SWAY_PERIOD_MS) * Math.PI * 2) * (1 - eased);
      const lon0 = (CENTER_LON + sway + SCROLL_LON * eased - dragLon) * DEG;
      const lat0 = Math.min(70, Math.max(-20, CENTER_LAT + SCROLL_LAT * eased + dragLat)) * DEG;
      const cosL = Math.cos(lon0);
      const sinL = Math.sin(lon0);
      const cosP = Math.cos(lat0);
      const sinP = Math.sin(lat0);

      // Rotate the world so (lat0, lon0) faces the viewer; returns screen x, y and depth.
      const project = (v: Vec3): Vec3 => {
        const x1 = v[0] * cosL - v[2] * sinL;
        const z1 = v[0] * sinL + v[2] * cosL;
        const y2 = v[1] * cosP - z1 * sinP;
        const z2 = v[1] * sinP + z1 * cosP;
        return [cx + x1 * radius, cy - y2 * radius, z2];
      };
      // A lifted arc point is visible in front of the globe or outside its disc.
      const visible = (p: Vec3): boolean => p[2] > 0 || Math.hypot(p[0] - cx, p[1] - cy) > radius;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = surface;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = line;
      ctx.stroke();

      ctx.fillStyle = ink;
      const dot = Math.max(1.25, radius / 170);
      for (const v of land) {
        const p = project(v);
        if (p[2] <= 0.02) continue;
        ctx.globalAlpha = 0.18 + 0.62 * p[2];
        ctx.fillRect(p[0] - dot / 2, p[1] - dot / 2, dot, dot);
      }
      ctx.globalAlpha = 1;

      ctx.lineCap = "round";
      const cycle = ARC_MS + ARC_GAP_MS;
      arcs.forEach((path, index) => {
        const projected = path.map(project);

        // Faint full route.
        ctx.strokeStyle = brand;
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let open = false;
        projected.forEach((p) => {
          if (!visible(p)) {
            open = false;
            return;
          }
          if (open) ctx.lineTo(p[0], p[1]);
          else ctx.moveTo(p[0], p[1]);
          open = true;
        });
        ctx.stroke();

        // Moving head with a fading trail.
        const t = still ? 1 : ((now + (index * cycle) / arcs.length) % cycle) / ARC_MS;
        if (t <= 1 + TRAIL) {
          const last = projected.length - 1;
          const head = Math.min(t, 1) * last;
          const tail = Math.max(0, t - TRAIL) * last;
          ctx.lineWidth = 1.75;
          for (let s = Math.floor(tail); s < Math.min(head, last); s++) {
            const a = projected[s];
            const b = projected[s + 1];
            if (!visible(a) || !visible(b)) continue;
            ctx.globalAlpha = still ? 0.9 : 0.25 + 0.75 * ((s - tail) / Math.max(1, head - tail));
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
          }
          // Arrival ripple at Tashkent.
          if (!still && t > 1) {
            const k = (t - 1) / TRAIL;
            const end = projected[last];
            ctx.globalAlpha = 0.5 * (1 - k);
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.arc(end[0], end[1], 3 + k * 14, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });

      ctx.fillStyle = brand;
      for (const v of origins) {
        const p = project(v);
        if (p[2] <= 0) continue;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.25, 0, Math.PI * 2);
        ctx.fill();
      }
      const hub = project(target);
      if (hub[2] > 0) {
        ctx.beginPath();
        ctx.arc(hub[0], hub[1], 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(hub[0], hub[1], 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
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
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", start);
    reduceMotion.addEventListener("change", start);

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
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    start();

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", start);
      reduceMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="block h-full w-full cursor-grab touch-pan-y select-none motion-reduce:cursor-default"
    />
  );
}
