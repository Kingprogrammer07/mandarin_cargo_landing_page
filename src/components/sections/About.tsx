"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Navigation } from "lucide-react";
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
                className={`${img.className || ""} relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-[1.02] transition-transform duration-200"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-10 relative rounded-xl overflow-hidden shadow-sm"
        >
          <iframe
            src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`}
            title={t("mapOverlay")}
            className="block w-full h-72 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Address chip */}
          <div className="pointer-events-none absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
            <MapPin size={16} className="text-orange-600" />
            {t("mapOverlay")}
          </div>

          {/* Route button */}
          <a
            href={`https://3.redirect.appmetrica.yandex.com/route?end-lat=${site.geo.lat}&end-lon=${site.geo.lng}&appmetrica_tracking_id=1178268795219780156`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-orange-700 transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Navigation size={16} />
            {t("routeCta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
