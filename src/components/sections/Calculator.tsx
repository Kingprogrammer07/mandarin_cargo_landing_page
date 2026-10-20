"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, RefreshCw } from "lucide-react";
import { site } from "@/config/site";
import { calculateShippingApi } from "@/lib/calculator";
import type { CalculatorResult } from "@/lib/calculator";
import SectionHeader from "@/components/ui/SectionHeader";

function formatUzs(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/[.,\s]/g, "\u00a0");
}

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const INPUT =
  "w-full rounded-ui-md border border-border bg-surface text-base tabular-nums text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand-soft";

export default function Calculator() {
  const t = useTranslations("calculator");
  const ids = useId();
  const [weight, setWeight] = useState("");
  const [volumetric, setVolumetric] = useState(false);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState(false);

  const calculate = useCallback(async () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) {
      setResult(null);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setResult(
        await calculateShippingApi({
          weight: w,
          length: volumetric ? parseFloat(length) || undefined : undefined,
          width: volumetric ? parseFloat(width) || undefined : undefined,
          height: volumetric ? parseFloat(height) || undefined : undefined,
        }),
      );
    } catch {
      setError(true);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [weight, volumetric, length, width, height]);

  // Recalculate as the visitor types; no submit button to hunt for.
  useEffect(() => {
    const timer = setTimeout(calculate, 450);
    return () => clearTimeout(timer);
  }, [calculate]);

  const dims = [
    { key: "l", label: t("length"), value: length, onChange: setLength },
    { key: "w", label: t("width"), value: width, onChange: setWidth },
    { key: "h", label: t("height"), value: height, onChange: setHeight },
  ];

  return (
    <section id="calculator" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} centered={false} />

        <div className="mt-10 grid overflow-hidden rounded-ui-lg border border-border bg-surface shadow-card lg:mt-12 lg:grid-cols-2">
          {/* Inputs */}
          <div className="p-5 sm:p-8 lg:p-10">
            <label htmlFor={`${ids}-weight`} className="block text-sm font-semibold text-ink">
              {t("weightLabel")}
            </label>
            <div className="relative mt-2">
              <input
                id={`${ids}-weight`}
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("weightPlaceholder")}
                className={`${INPUT} h-14 px-4 pr-12 text-lg`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                kg
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={volumetric}
              onClick={() => setVolumetric((v) => !v)}
              className="mt-6 flex min-h-11 w-full items-center gap-3 text-left"
            >
              <span
                aria-hidden
                className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${
                  volumetric ? "bg-brand" : "bg-border"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform ${
                    volumetric ? "translate-x-5" : ""
                  }`}
                />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{t("volumetricToggle")}</span>
                <span className="block text-sm text-muted">{t("volumetricDesc")}</span>
              </span>
            </button>

            {volumetric && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {dims.map((dim) => (
                  <div key={dim.key} className="min-w-0">
                    <label htmlFor={`${ids}-${dim.key}`} className="block truncate text-xs font-semibold text-muted">
                      {dim.label}, {t("dimUnit")}
                    </label>
                    <input
                      id={`${ids}-${dim.key}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={dim.value}
                      onChange={(e) => dim.onChange(e.target.value)}
                      placeholder={t("dimPlaceholder")}
                      className={`${INPUT} mt-1.5 h-12 px-2 sm:px-3`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result */}
          <div
            aria-live="polite"
            className="flex flex-col justify-between gap-6 border-t border-border bg-surface-2 p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
          >
            {error ? (
              <div>
                <p className="font-semibold text-ink">{t("errorTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t("error")}</p>
                <button
                  type="button"
                  onClick={calculate}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-ink"
                >
                  <RefreshCw size={14} aria-hidden />
                  {t("retry")}
                </button>
              </div>
            ) : (
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-muted">
                  {t("resultLabel")}
                  {loading && <Loader2 size={14} className="animate-spin" aria-label={t("calculating")} />}
                </p>
                <p
                  className={`mt-2 whitespace-nowrap text-[clamp(1.75rem,9vw,3rem)] font-extrabold leading-none tracking-tight tabular-nums ${
                    result ? "text-ink" : "text-muted/40"
                  }`}
                >
                  {result ? `${formatUzs(result.priceUzs)} so‘m` : "—"}
                </p>
                <p className="mt-2 text-base text-muted tabular-nums">
                  {result ? `≈ $${formatUsd(result.priceUsd)}` : t("perKg")}
                </p>

                {result && (
                  <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
                    <Row label={`${result.chargeableWeight} kg × ${t("perKg")}`} value={`$${formatUsd(result.priceUsd)}`} />
                    <Row label={t("exchangeRate")} value={`1 USD = ${formatUzs(result.rate)} so‘m`} />
                    <Row
                      label={t("calculatedWeight")}
                      value={
                        result.volumetricWeight > 0 || volumetric
                          ? `${result.chargeableWeight} kg (${t("real")} ${result.actualWeight} · ${t("volumetric")} ${result.volumetricWeight})`
                          : `${result.chargeableWeight} kg`
                      }
                    />
                  </dl>
                )}
                {result?.isFallback && (
                  <p className="mt-3 text-xs leading-relaxed text-muted">{t("fallbackNotice")}</p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-base font-semibold text-on-brand transition-colors hover:bg-brand-hover active:scale-[0.98]"
              >
                {t("cta")}
              </a>
              <span className="text-sm text-muted">{t("ctaSub")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}
