"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  Key,
  ShoppingCart,
  Plane,
  MapPin,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Smartphone,
  ShieldCheck,
  Key,
  ShoppingCart,
  Plane,
};

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    { icon: "Smartphone", title: t("steps.0.title"), desc: t("steps.0.desc") },
    { icon: "ShieldCheck", title: t("steps.1.title"), desc: t("steps.1.desc") },
    { icon: "Key", title: t("steps.2.title"), desc: t("steps.2.desc") },
    { icon: "ShoppingCart", title: t("steps.3.title"), desc: t("steps.3.desc") },
    { icon: "Plane", title: t("steps.4.title"), desc: t("steps.4.desc") },
  ];

  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("h2")}
          subtitle={t("subtitle")}
        />

        {/* Steps */}
        <div className="mt-16 relative">
          {/* Connecting line - desktop (centered on the 72px circles), fills on scroll */}
          <div className="hidden lg:block absolute top-9 -translate-y-1/2 left-[10%] right-[10%] h-[3px] bg-slate-200">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.1, ease }}
              className="h-full origin-left bg-orange-400"
            />
          </div>

          {/* Connecting line - mobile (centered on the 64px circles), fills on scroll */}
          <div className="lg:hidden absolute top-8 bottom-8 left-8 -translate-x-1/2 w-[3px] bg-slate-200">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease }}
              className="w-full origin-top bg-orange-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {steps.map((step, i) => {
              const Icon = iconMap[step.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease }}
                  className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0"
                >
                  {/* Number circle */}
                  <div className="relative z-10 shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-orange-100 flex flex-col items-center justify-center text-orange-600 lg:mb-4">
                    {Icon && <Icon size={24} className="text-orange-500 mb-0.5" />}
                    <span className="text-lg font-extrabold leading-none">{i + 1}</span>
                  </div>

                  <div className="lg:text-center">
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-[240px]">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sample China address card — hidden (mock SXXX data) */}
        {false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          className="mt-12 bg-slate-900 rounded-2xl p-6 lg:p-8 relative"
        >
          <MapPin size={24} className="absolute top-6 right-6 text-slate-600 hidden lg:block" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ID Code */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-orange-400">
                {t("idLabel")}
              </span>
              <p className="mt-2 text-3xl font-extrabold text-white font-mono tracking-wider">
                {t("idCode")}
              </p>
              <p className="mt-2 text-sm text-slate-400">{t("idCaption")}</p>
            </div>

            {/* Address */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-orange-400">
                {t("addressLabel")}
              </span>
              <div className="mt-2 text-white font-mono text-sm leading-relaxed space-y-0.5">
                <p>
                  <span className="text-orange-400 font-bold">SXXX</span>{" "}
                  18161955318
                </p>
                <p>{t("address.1")}</p>
                <p>{t("address.2")}</p>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </section>
  );
}
