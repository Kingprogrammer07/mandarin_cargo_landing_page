"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { site } from "@/config/site";
import { calculateShipping } from "@/lib/calculator";
import type { CalculatorResult } from "@/lib/calculator";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

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
    if (!w || w <= 0) return;

    setLoading(true);
    setError(false);
    setResult(null);

    await new Promise((r) => setTimeout(r, 600));

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
    } finally {
      setLoading(false);
    }
  }, [weight, volumetric, length, width, height]);

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
          className="mt-10 bg-white rounded-2xl shadow-lg p-6 lg:p-10 max-w-[640px] mx-auto"
        >
          {/* Weight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-lg tabular-nums focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
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
            className="mt-4"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={volumetric}
                onChange={(e) => setVolumetric(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">{t("volumetricToggle")}</span>
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
                className="mt-4 grid grid-cols-3 gap-4 overflow-hidden"
              >
                {[
                  { label: t("length"), value: length, onChange: setLength },
                  { label: t("width"), value: width, onChange: setWidth },
                  { label: t("height"), value: height, onChange: setHeight },
                ].map((dim) => (
                  <div key={dim.label}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
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
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm tabular-nums focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
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
            disabled={loading || !weight || parseFloat(weight) <= 0}
            className="mt-6 w-full bg-orange-600 text-white py-4 rounded-full text-base font-semibold hover:bg-orange-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? t("calculating") : t("submit")}
          </motion.button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-6 max-w-[640px] mx-auto"
            >
              <p className="text-sm text-slate-500">{t("resultLabel")}</p>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
                ${result.priceUsd.toLocaleString()}
              </p>
              <p className="text-lg font-semibold text-slate-600 tabular-nums mt-1">
                ~{(result.priceUzs / 1000000).toFixed(2)}M so&apos;m
              </p>
              <p className="text-xs text-orange-600 font-medium mt-1">{t("perKg")}</p>

              <div className="mt-4 pt-4 border-t border-orange-200 flex flex-wrap gap-4 text-sm">
                <span className="text-slate-600">
                  {t("calculatedWeight")}: <strong className="tabular-nums">{result.chargeableWeight} kg</strong>
                </span>
                <span className="text-slate-400 text-xs">
                  {t("real")}: {result.actualWeight} kg | {t("volumetric")}: {result.volumetricWeight} kg
                </span>
              </div>

              {result.isFallback && (
                <p className="mt-3 text-xs text-slate-400 italic">{t("fallbackNotice")}</p>
              )}
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
            className="inline-flex items-center bg-orange-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg"
          >
            {t("cta")}
          </a>
          <p className="mt-2 text-sm text-slate-500">{t("ctaSub")}</p>
        </motion.div>
      </div>
    </section>
  );
}
