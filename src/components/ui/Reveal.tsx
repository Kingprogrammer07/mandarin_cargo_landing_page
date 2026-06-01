"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** Portion of the element that must be visible before revealing (0–1). */
  amount?: number;
  className?: string;
}

/**
 * Scroll-reveal wrapper. Device-aware:
 *  - mobile: simple fade + slide-up (fast)
 *  - desktop: slide-up + subtle scale (richer)
 * Disabled entirely under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, amount = 0.2, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const hidden = desktop ? { opacity: 0, y: 40, scale: 0.98 } : { opacity: 0, y: 24 };
  const shown = { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration: desktop ? 0.6 : 0.45, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
