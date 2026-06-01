"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Pricing() {
  const t = useTranslations("pricing");

  const included = [
    t("included.0"),
    t("included.1"),
    t("included.2"),
    t("included.3"),
    t("included.4"),
  ];

  return (
    <section id="pricing" className="bg-orange-50 py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          className="mt-10 max-w-[480px] mx-auto"
        >
          {/* Card */}
          <div className="rounded-2xl border-2 border-orange-200 overflow-hidden">
            {/* Top band */}
            <div className="bg-orange-100 py-3 text-center">
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                {t("badge")}
              </span>
            </div>

            {/* Body */}
            <div className="bg-white p-8">
              <div className="text-center">
                <span className="text-6xl font-extrabold text-slate-900 tabular-nums">
                  {t("price")}
                </span>
                <span className="text-xl text-slate-500 ml-1">{t("unit")}</span>
                <p className="mt-2 text-slate-500">{t("subtitle")}</p>
              </div>

              <hr className="my-6 border-slate-100" />

              {/* Included list */}
              <ul className="space-y-3">
                {included.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <Check size={16} className="text-green-500 mt-1 shrink-0" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Gabarit explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-6 bg-slate-50 rounded-xl p-4"
              >
                <h4 className="text-sm font-semibold text-slate-800">{t("gabaritTitle")}</h4>
                <div className="mt-2 bg-white rounded-lg p-3 font-mono text-sm text-slate-600">
                  {t("gabaritFormula")}
                </div>
                <p className="mt-2 text-xs text-slate-500">{t("gabaritRule")}</p>
              </motion.div>

              {/* CTA */}
              <a
                href="#calculator"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-8 block w-full text-center bg-orange-600 text-white py-4 rounded-full font-semibold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                {t("cta")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
