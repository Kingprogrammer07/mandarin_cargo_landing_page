"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Reviews() {
  const t = useTranslations("reviews");
  const testimonials = [
    { name: t("testimonials.0.name"), city: t("testimonials.0.city"), rating: 5, quote: t("testimonials.0.quote") },
    { name: t("testimonials.1.name"), city: t("testimonials.1.city"), rating: 5, quote: t("testimonials.1.quote") },
    { name: t("testimonials.2.name"), city: t("testimonials.2.city"), rating: 5, quote: t("testimonials.2.quote") },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="reviews" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} />

        {/* Aggregate Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mt-8 hidden md:flex flex-col items-center"
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.1 }}
              >
                <Star size={28} className="text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-extrabold text-slate-900 tabular-nums">{t("rating")}</span>
            <span className="text-xl text-slate-400">{t("outOf")}</span>
          </div>
          <p className="text-slate-500 mt-1">{t("reviewCount")}</p>
        </motion.div>

        {/* Testimonials Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-10">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12, ease }}
              className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 text-sm font-bold">
                  {getInitials(item.name)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.city}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Mobile Carousel */}
        <div className="lg:hidden mt-8 relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeSlide * 100}%` }}
              transition={{ duration: 0.4, ease }}
            >
              {testimonials.map((item, i) => (
                <div key={i} className="w-full shrink-0 px-1">
                  <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 text-sm font-bold">
                        {getInitials(item.name)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.city}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(item.rating)].map((_, j) => (
                          <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setActiveSlide((p) => Math.max(0, p - 1))}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30"
              disabled={activeSlide === 0}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeSlide ? "bg-orange-600" : "bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveSlide((p) => Math.min(testimonials.length - 1, p + 1))}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30"
              disabled={activeSlide === testimonials.length - 1}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Review screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <motion.img
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                src={`/review-${i}.jpg`}
                alt={`Review ${i}`}
                className="h-32 w-auto rounded-lg shadow-sm border border-slate-200 snap-start shrink-0"
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{t("screenshotCaption")}</p>
        </motion.div>
      </div>
    </section>
  );
}
