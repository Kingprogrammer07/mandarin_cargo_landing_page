"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Clock, Users, Package, MessageCircle, CreditCard } from "lucide-react";
import { paymentLogos } from "@/config/site";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const statIcons = {
  years: Clock,
  clients: Users,
  cargo: Package,
  subscribers: MessageCircle,
};

function useCountUp(target: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (target - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration, start]);

  return { count, ref };
}

function AnimatedStat({
  numberRaw,
  label,
  icon: Icon,
  delay,
}: {
  numberRaw: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  delay: number;
}) {
  const prefix = numberRaw.match(/^[^0-9]*/)?.[0] || "";
  const suffix = numberRaw.match(/[^0-9]+$/)?.[0] || "";
  const numeric = parseFloat(numberRaw.replace(/[^0-9.]/g, ""));
  const isFloat = numberRaw.includes(".") && !numberRaw.includes("+");
  const { count, ref } = useCountUp(numeric, 2000);

  const display = isFloat
    ? `${prefix}${(count / 10).toFixed(1)}${suffix}`
    : `${prefix}${count.toLocaleString("ru-RU")}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
          <Icon size={24} />
        </div>
        <span
          ref={ref}
          className="block text-3xl lg:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight"
        >
          {display}
        </span>
        <p className="mt-1.5 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

export default function TrustBar() {
  const t = useTranslations("trustBar");
  const stats = [
    { key: "years", icon: statIcons.years },
    { key: "clients", icon: statIcons.clients },
    { key: "cargo", icon: statIcons.cargo },
    { key: "subscribers", icon: statIcons.subscribers },
  ] as const;

  return (
    <section
      id="trust"
      className="relative bg-slate-50/80 py-16 lg:py-20 overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map(({ key, icon }, i) => (
            <AnimatedStat
              key={key}
              numberRaw={t(`${key}.number`)}
              label={t(`${key}.label`)}
              icon={icon}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-500">
              <CreditCard size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                {t("paymentTitle")}
              </span>
            </div>
            <div className="h-px w-12 bg-slate-200" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 items-center">
            {paymentLogos.map((logo, i) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                className="group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- vector SVG logos, variable aspect, tiny + below-fold; next/image adds no benefit */}
                <img
                  src={`/pay/pay-${logo}.svg`}
                  alt={logo}
                  className="h-9 lg:h-10 w-auto opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
