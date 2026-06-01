"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Package, Tag, Boxes, Sparkles } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const tierIcons = [Package, Tag, Boxes];

export default function Pricing() {
  const t = useTranslations("pricing");

  const tiers = [0, 1, 2].map((i) => ({
    name: t(`tiers.${i}.name`),
    price: t(`tiers.${i}.price`),
    unit: t(`tiers.${i}.unit`),
    desc: t(`tiers.${i}.desc`),
    popular: i === 0,
    Icon: tierIcons[i],
  }));

  const included = [
    t("included.0"),
    t("included.1"),
    t("included.2"),
    t("included.3"),
    t("included.4"),
  ];

  return (
    <section id="pricing" className="bg-orange-50 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} />

        {/* Tier cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-2xl bg-white p-7 flex flex-col ${
                tier.popular
                  ? "border-2 border-orange-500 shadow-lg shadow-orange-100"
                  : "border border-slate-200 shadow-sm"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t("popularBadge")}
                </span>
              )}

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  tier.popular ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600"
                }`}
              >
                <tier.Icon size={22} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{tier.name}</h3>

              <div className="mt-3 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  {tier.price}
                </span>
                <span className="text-base text-slate-500 ml-1">{tier.unit}</span>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{tier.desc}</p>

              <a
                href="#calculator"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`mt-6 block w-full text-center py-3 rounded-full font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                  tier.popular
                    ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg"
                    : "border border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("cta")}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Shared: included in every tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 p-7 max-w-3xl mx-auto"
        >
          <h4 className="text-sm font-semibold text-slate-800">{t("includedTitle")}</h4>
          <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2.5 text-sm font-semibold text-orange-700">
            <Sparkles size={16} className="shrink-0 text-orange-500" />
            {t("bonus")}
          </div>
          <p className="mt-4 text-xs text-slate-400">{t("note")}</p>
        </motion.div>
      </div>
    </section>
  );
}
