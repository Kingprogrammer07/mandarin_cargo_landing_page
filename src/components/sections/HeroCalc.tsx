"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { calculateShippingApi, type CalculatorResult } from "@/lib/calculator";

function formatUzs(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/[.,\s]/g, " ");
}

const FIELD =
  "w-full bg-paper text-base tabular-nums text-ink outline-none border-0 border-b-2 border-ink/25 focus:border-brand transition-colors placeholder:text-muted/70";

/**
 * The label's weight field: type a weight, read the price. Recalculates as
 * the visitor types (server price first, local estimate if the API is down).
 */
export default function HeroCalc({ pricePerKg }: { pricePerKg: number }) {
  const t = useTranslations("page.hero");
  const tc = useTranslations("calculator");
  const ids = useId();
  const [weight, setWeight] = useState("1");
  const [withDims, setWithDims] = useState(false);
  const [dims, setDims] = useState({ l: "", w: "", h: "" });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedWeight = parseFloat(weight.replace(",", "."));
  const weightValid = parsedWeight > 0 && parsedWeight <= 10000;
  const shown = weightValid ? result : null;

  useEffect(() => {
    const w = parseFloat(weight.replace(",", "."));
    if (!w || w <= 0 || w > 10000) return;
    const num = (v: string) => parseFloat(v.replace(",", ".")) || undefined;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const next = await calculateShippingApi(
        {
          weight: w,
          length: withDims ? num(dims.l) : undefined,
          width: withDims ? num(dims.w) : undefined,
          height: withDims ? num(dims.h) : undefined,
        },
        pricePerKg,
      );
      if (!cancelled) {
        setResult(next);
        setLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [weight, withDims, dims, pricePerKg]);

  const dimFields = [
    { key: "l" as const, label: tc("length") },
    { key: "w" as const, label: tc("width") },
    { key: "h" as const, label: tc("height") },
  ];

  return (
    <div id="calculator" className="bg-paper-2 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
        <div>
          <label htmlFor={`${ids}-w`} className="t-small block font-medium text-ink">
            {t("weight")}
          </label>
          <div className="relative mt-1">
            <input
              id={`${ids}-w`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/[^\d.,]/g, "").slice(0, 7))}
              className={`${FIELD} h-12 bg-transparent pr-10 font-display text-2xl font-semibold`}
            />
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-medium text-muted">kg</span>
          </div>
        </div>
        <div aria-live="polite">
          <p className="font-display text-[clamp(1.5rem,1rem+1.6vw,2rem)] font-bold leading-tight tracking-tight tabular-nums">
            {shown ? `${formatUzs(shown.priceUzs)} so‘m` : <span className="t-body font-sans font-normal text-muted">{t("resultHint")}</span>}
          </p>
          <p className="t-small flex items-center gap-2 text-muted tabular-nums">
            {t("result")}
            {shown && `: $${shown.priceUsd.toFixed(2)}, ${shown.chargeableWeight} kg`}
            {shown && shown.volumetricWeight > shown.actualWeight ? ` (${tc("volumetric")})` : ""}
            {loading && <Loader2 size={14} className="animate-spin" aria-label={tc("calculating")} />}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={withDims}
        onClick={() => setWithDims((v) => !v)}
        className="mt-4 flex min-h-11 items-center gap-3 text-left"
      >
        <span aria-hidden className={`relative h-6 w-11 shrink-0 transition-colors ${withDims ? "bg-brand" : "bg-ink/25"}`}>
          <span className={`absolute left-1 top-1 h-4 w-4 bg-paper transition-transform ${withDims ? "translate-x-5" : ""}`} />
        </span>
        <span className="t-small font-medium">{t("dims")}</span>
      </button>

      {withDims && (
        <div className="mt-2 grid grid-cols-3 gap-3">
          {dimFields.map((f) => (
            <div key={f.key} className="min-w-0">
              <label htmlFor={`${ids}-${f.key}`} className="t-small block truncate text-muted">
                {f.label}, {tc("dimUnit")}
              </label>
              <input
                id={`${ids}-${f.key}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={dims[f.key]}
                placeholder="30"
                onChange={(e) => setDims((d) => ({ ...d, [f.key]: e.target.value.replace(/[^\d.,]/g, "").slice(0, 5) }))}
                className={`${FIELD} h-11 bg-transparent`}
              />
            </div>
          ))}
        </div>
      )}
      {shown?.isFallback && <p className="t-small mt-3 text-muted">{tc("fallbackNotice")}</p>}
    </div>
  );
}
