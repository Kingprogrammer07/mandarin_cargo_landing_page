"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Instagram, Facebook, Send } from "lucide-react";
import { site } from "@/config/site";

const socials = [
  { Icon: Send, href: site.telegram, label: "Telegram" },
  { Icon: Instagram, href: site.instagram, label: "Instagram" },
  { Icon: Facebook, href: site.facebook, label: "Facebook" },
];

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative bg-orange-600 py-16 lg:py-24 overflow-hidden">
      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
        }}
      />

      {/* Floating sphere blobs */}
      <span
        className="absolute w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-white/10 pointer-events-none will-change-transform animate-float-1"
        style={{
          boxShadow: "0 0 60px 20px rgba(255,255,255,0.08), inset 0 0 40px rgba(255,255,255,0.05)",
        }}
      />
      <span
        className="absolute w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-orange-300/20 pointer-events-none will-change-transform animate-float-2"
        style={{
          boxShadow: "0 0 50px 15px rgba(255,200,150,0.1), inset 0 0 30px rgba(255,200,150,0.05)",
        }}
      />
      <span
        className="absolute w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-white/5 pointer-events-none will-change-transform animate-float-3"
        style={{
          boxShadow: "0 0 40px 10px rgba(255,255,255,0.06), inset 0 0 20px rgba(255,255,255,0.03)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="text-3xl lg:text-4xl font-bold text-white"
        >
          {t("h2")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease }}
          className="mt-4 text-lg text-orange-100 font-normal"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4, ease }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href={site.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href={site.adminContact}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border-2 border-white/40 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-150"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>

        {/* Social channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5, ease }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-sm text-orange-100">{t("followUs")}</p>
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white hover:text-orange-600 transition-all duration-150 hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* QR Code - desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          className="mt-8 hidden lg:flex flex-col items-center"
        >
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <Image
              src="/qr-bot.png"
              alt="Telegram bot QR code"
              width={160}
              height={160}
              className="w-40 h-40"
            />
          </div>
          <p className="mt-3 text-sm text-orange-200">{t("qrCaption")}</p>
        </motion.div>
      </div>
    </section>
  );
}
