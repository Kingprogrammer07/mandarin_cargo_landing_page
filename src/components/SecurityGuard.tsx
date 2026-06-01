"use client";

import { useEffect } from "react";

/**
 * Client-side deterrent against casual inspection.
 * NOTE: This is NOT real security. Source code is always accessible
 * to anyone with technical knowledge. This only discourages
 * non-technical users from right-clicking or pressing F12.
 */
export default function SecurityGuard() {
  useEffect(() => {
    // Only run in production builds, never in dev
    if (process.env.NODE_ENV === "development") return;

    const blockKeys = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect DevTools open by measuring window size difference
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > threshold || heightDiff > threshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        // Optional: clear console on open
        // console.clear();
      } else if (!isOpen) {
        devtoolsOpen = false;
      }
    };

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", blockContextMenu);
    window.addEventListener("resize", detectDevTools);

    // Subtle console message for curious users
    // eslint-disable-next-line no-console
    console.log("%cStop!", "color:#EA580C;font-size:40px;font-weight:bold;");
    // eslint-disable-next-line no-console
    console.log("%cThis is a browser feature intended for developers. Do not paste any code here.", "font-size:14px;");

    return () => {
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  return null;
}
