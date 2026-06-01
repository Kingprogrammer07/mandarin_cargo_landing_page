"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { site } from "@/config/site";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function About() {
  const t = useTranslations("about");

  const facts = [
    t("facts.0"),
    t("facts.1"),
    t("facts.2"),
    t("facts.3"),
  ];

  const images = [
    { src: "/warehouse-china-1.jpg", alt: "Warehouse China", className: "md:col-span-2" },
    { src: "/warehouse-china-2.jpg", alt: "Sorting station" },
    { src: "/office-tashkent-1.jpg", alt: "Tashkent office" },
    { src: "/team.jpg", alt: "Team" },
  ];

  return (
    <section id="about" className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-slate-600 leading-relaxed">{t("intro")}</p>
            <ul className="mt-6 space-y-3">
              {facts.map((fact, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={16} className="text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm text-slate-600">{fact}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease }}
                className={img.className || ""}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 aspect-[4/3]"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-10 relative rounded-xl overflow-hidden shadow-sm"
        >
          <a
            href={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative"
          >
            <img
              src="/map-tashkent.jpg"
              alt="Office location"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
              <span className="text-orange-600">
                <MapPinIcon />
              </span>
              {t("mapOverlay")}
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
