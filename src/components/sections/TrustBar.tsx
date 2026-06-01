"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { paymentLogos } from "@/config/site";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const prefix = target.match(/^[^0-9]*/)?.[0] || "";

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl lg:text-5xl font-extrabold text-orange-600 tabular-nums"
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {target.replace(/[^0-9+]/g, "")}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

export default function TrustBar() {
  const t = useTranslations("trustBar");
  const stats = [
    { key: "years", suffix: "" },
    { key: "clients", suffix: "" },
    { key: "cargo", suffix: "" },
    { key: "subscribers", suffix: "" },
  ] as const;

  return (
    <section id="trust" className="bg-orange-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="text-center"
            >
              <AnimatedCounter target={t(`${key}.number`)} />
              <p className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t(`${key}.label`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Payment logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-4xl mx-auto text-center"
        >
          <p className="text-sm text-slate-400 mb-6">{t("paymentTitle")}</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {paymentLogos.map((logo, i) => (
              <motion.img
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                src={`/pay/pay-${logo}.svg`}
                alt={logo}
                className="h-8 w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
