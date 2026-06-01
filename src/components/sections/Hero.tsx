"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { site } from "@/config/site";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease },
  });

  // Auto crossfade between light/dark app screens (same phone, same framing)
  const [showDark, setShowDark] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setShowDark((v) => !v), 4000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      id="hero"
      className="relative -mt-16 overflow-hidden bg-gradient-to-b from-orange-100 via-white to-orange-50"
    >
      {/* Warm depth glow behind the phone — also blends the mockup's backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-[640px] w-[640px] rounded-full bg-orange-200/45 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-amber-100/50 blur-[120px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 min-h-[70vh] lg:min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left: Text */}
          <div className="order-1">
            <motion.span
              {...rise(0.1)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600"
            >
              {t("eyebrow")}
            </motion.span>

            <h1
              className="mt-4 font-extrabold text-slate-900 leading-[1.05] tracking-tight max-w-[600px]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("h1").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease }}
                  className="inline-block whitespace-nowrap mr-[0.25em]"
                >
                  {word}
                  {i < t("h1").split(" ").length - 1 ? " " : ""}
                </motion.span>
              ))}
            </h1>

            <motion.p
              {...rise(0.25)}
              className="mt-4 text-lg text-slate-500 leading-relaxed max-w-[520px]"
            >
              {t("subheadline")}
            </motion.p>

            {/* CTA Row */}
            <motion.div {...rise(0.35)} className="mt-8 flex flex-wrap gap-4">
              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                {t("ctaPrimary")}
              </a>
              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-slate-200 text-slate-900 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all duration-150"
              >
                {t("ctaSecondary")}
              </a>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              {...rise(0.45)}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-600" />
                {t("trust1")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-600" />
                {t("trust2")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-green-600" />
                {t("trust3")}
              </span>
            </motion.div>

            {/* Channel badge */}
            <motion.a
              {...rise(0.5)}
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
            initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            className="order-2 flex flex-col items-center lg:items-end"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative w-full max-w-[340px] lg:max-w-[480px]">
                {/* Light screen — base layer */}
                <Image
                  src="/hero-app-light-v2.webp"
                  alt="Mandarin Cargo app"
                  width={420}
                  height={626}
                  priority
                  className="h-auto w-full drop-shadow-2xl"
                />
                {/* Dark screen — crossfades on top */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: showDark ? 1 : 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <Image
                    src="/hero-app-dark-v2.webp"
                    alt=""
                    width={420}
                    height={626}
                    className="h-auto w-full drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile caption under the phone — links to the bot, shimmering text */}
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm transition-all hover:border-orange-300 hover:shadow-md lg:hidden"
            >
              <span className="text-orange-600">
                <SendIcon />
              </span>
              <span className="text-shimmer text-sm font-bold">{t("appCaption")}</span>
              <ArrowRight
                size={15}
                className="text-orange-500 transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>
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
