"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CalculatorIcon, TrendingUp, Scale } from "lucide-react";
import { site } from "@/config/site";
import { calculateShipping } from "@/lib/calculator";
import type { CalculatorResult } from "@/lib/calculator";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

function formatUzs(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/\./g, " ").replace(/,/g, " ");
}

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Calculator() {
  const t = useTranslations("calculator");
  const [weight, setWeight] = useState("");
  const [volumetric, setVolumetric] = useState(false);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState(false);

  const handleCalculate = useCallback(async () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(false);

    await new Promise((r) => setTimeout(r, 400));

    try {
      const res = calculateShipping({
        weight: w,
        length: volumetric ? parseFloat(length) || undefined : undefined,
        width: volumetric ? parseFloat(width) || undefined : undefined,
        height: volumetric ? parseFloat(height) || undefined : undefined,
      });
      setResult(res);
    } catch {
      setError(true);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [weight, volumetric, length, width, height]);

  // Auto-calculate with debounce
  useEffect(() => {
    const w = parseFloat(weight);
    const timer = setTimeout(() => {
      if (!w || w <= 0) {
        setResult(null);
        setError(false);
      } else {
        handleCalculate();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [weight, volumetric, length, width, height, handleCalculate]);

  const isValidWeight = !!weight && parseFloat(weight) > 0;

  return (
    <section id="calculator" className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} />

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="mt-10 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 lg:p-10 max-w-[640px] mx-auto"
        >
          {/* Weight Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("weightLabel")}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("weightPlaceholder")}
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-lg tabular-nums focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-slate-50/50 hover:bg-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                kg
              </span>
            </div>
          </motion.div>

          {/* Volumetric toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-5"
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={volumetric}
                  onChange={(e) => setVolumetric(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                  {t("volumetricToggle")}
                </span>
                <p className="text-xs text-slate-400">{t("volumetricDesc")}</p>
              </div>
            </label>
          </motion.div>

          {/* Dimensions */}
          <AnimatePresence>
            {volumetric && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 grid grid-cols-3 gap-3 overflow-hidden"
              >
                {[
                  { label: t("length"), value: length, onChange: setLength },
                  { label: t("width"), value: width, onChange: setWidth },
                  { label: t("height"), value: height, onChange: setHeight },
                ].map((dim) => (
                  <div key={dim.label}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {dim.label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dim.value}
                        onChange={(e) => dim.onChange(e.target.value)}
                        placeholder={t("dimPlaceholder")}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm tabular-nums focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-slate-50/50 hover:bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        {t("dimUnit")}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={handleCalculate}
            disabled={loading || !isValidWeight}
            className="mt-6 w-full bg-orange-600 text-white py-4 rounded-full text-base font-bold hover:bg-orange-700 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {!loading && <CalculatorIcon size={20} />}
            {loading ? t("calculating") : t("submit")}
          </motion.button>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="mt-6 max-w-[640px] mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden">
                {/* Top: Primary Price (UZS) */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-8 text-center text-white">
                  <p className="text-sm font-medium text-orange-100 opacity-90">
                    {t("resultLabel")}
                  </p>
                  <p className="text-4xl lg:text-5xl font-extrabold tabular-nums mt-2 tracking-tight">
                    {formatUzs(result.priceUzs)} so&apos;m
                  </p>
                  <p className="text-base text-orange-100 mt-2 opacity-90">
                    ≈ ${formatUsd(result.priceUsd)}
                  </p>
                </div>

                {/* Middle: Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  {/* Price math */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Scale size={16} className="text-orange-500" />
                      {result.chargeableWeight} kg × {t("perKg")}
                    </span>
                    <span className="font-bold text-slate-700 tabular-nums">
                      ${formatUsd(result.priceUsd)}
                    </span>
                  </div>

                  {/* Exchange rate */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <TrendingUp size={16} className="text-green-500" />
                      {t("exchangeRate")}
                    </span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      1 USD = {formatUzs(result.rate)} so&apos;m
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Weight details */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-slate-500">
                      {t("calculatedWeight")}: <strong className="text-slate-700 tabular-nums">{result.chargeableWeight} kg</strong>
                    </span>
                    {(result.volumetricWeight > 0 || volumetric) && (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        {t("real")}: {result.actualWeight} kg · {t("volumetric")}: {result.volumetricWeight} kg
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom: Disclaimer */}
                {result.isFallback && (
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t("fallbackNotice")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: [0, 5, -5, 5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-center text-sm max-w-[640px] mx-auto"
            >
              {t("error")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href={site.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg"
          >
            {t("cta")}
          </a>
          <p className="mt-2 text-sm text-slate-500">{t("ctaSub")}</p>
        </motion.div>
      </div>
    </section>
  );
}
