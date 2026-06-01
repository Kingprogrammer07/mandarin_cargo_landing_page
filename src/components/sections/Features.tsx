"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  DollarSign,
  Plane,
  MapPin,
  Warehouse,
  CreditCard,
  Headphones,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  DollarSign,
  Plane,
  MapPin,
  Warehouse,
  CreditCard,
  Headphones,
};

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function Features() {
  const t = useTranslations("features");
  const items = [
    { icon: "DollarSign", title: t("items.0.title"), desc: t("items.0.desc") },
    { icon: "Plane", title: t("items.1.title"), desc: t("items.1.desc") },
    { icon: "MapPin", title: t("items.2.title"), desc: t("items.2.desc") },
    { icon: "Warehouse", title: t("items.3.title"), desc: t("items.3.desc") },
    { icon: "CreditCard", title: t("items.4.title"), desc: t("items.4.desc") },
    { icon: "Headphones", title: t("items.5.title"), desc: t("items.5.desc") },
  ];

  return (
    <section id="features" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-200">
                  {Icon && <Icon size={24} />}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
