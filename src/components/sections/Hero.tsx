"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink } from "lucide-react";
import { site } from "@/config/site";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 min-h-[70vh] lg:min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left: Text */}
          <div className="order-1">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600"
            >
              {t("eyebrow")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="mt-4 text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight max-w-[600px]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("h1")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease }}
              className="mt-4 text-lg text-slate-500 leading-relaxed max-w-[520px]"
            >
              {t("subheadline")}
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                {t("ctaPrimary")}
              </a>
              <a
                href={site.cabinetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-slate-200 text-slate-900 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all duration-150"
              >
                {t("ctaSecondary")}
              </a>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9, ease }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-400"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-500" />
                {t("trust1")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-500" />
                {t("trust2")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-500" />
                {t("trust3")}
              </span>
            </motion.div>

            {/* Channel badge */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0, ease }}
              href={site.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all"
            >
              <SendIcon />
              {t("channelBadge")}
              <ExternalLink size={14} className="text-slate-400" />
            </motion.a>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            className="order-2 flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src="/hero-real-app-light.png"
                alt="Mandarin Cargo Telegram app"
                className="w-full max-w-[300px] lg:max-w-[420px] h-auto drop-shadow-2xl"
                loading="eager"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
