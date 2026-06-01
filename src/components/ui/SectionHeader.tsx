"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className={`${centered ? "text-center" : ""}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
        {eyebrow}
      </span>
      <h2
        className={`mt-2 text-3xl lg:text-4xl font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
