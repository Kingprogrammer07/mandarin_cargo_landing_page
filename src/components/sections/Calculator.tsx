"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { calculateShippingApi, type CalculatorResult } from "@/lib/calculator";

function formatUzs(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/[.,\s]/g, " ");
}

const QUICK_WEIGHTS = ["0.5", "1", "3", "5", "10"];

/**
 * Type a weight (or tap a preset), read the price. Recalculates as the
 * visitor types: server price first, local estimate if the API is down.
 */
export default function Calculator({ pricePerKg }: { pricePerKg: number }) {
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
    }, 350);
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
    <div className="flex h-full flex-col p-6 sm:p-8">
      <h2 id="calc-title" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{tc("h2")}</h2>
      <p className="t-small mt-2 text-fg-2">{tc("subtitle")}</p>

      <label htmlFor={`${ids}-w`} className="t-small mt-8 block text-fg-2">{t("weight")}</label>
      <div className="relative mt-2">
        <input
          id={`${ids}-w`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={weight}
          onChange={(e) => setWeight(e.target.value.replace(/[^\d.,]/g, "").slice(0, 7))}
          className="field h-16 pr-14 text-[1.75rem] font-semibold tabular-nums tracking-tight"
        />
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-fg-3">kg</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-label={t("weight")}>
        {QUICK_WEIGHTS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWeight(w)}
            aria-pressed={weight === w}
            className={`min-h-11 whitespace-nowrap rounded-full text-[0.8125rem] tabular-nums sm:text-sm transition-colors active:scale-95 ${
              weight === w ? "bg-white/10 text-fg shadow-[inset_0_0_0_1px_var(--line-2)]" : "text-fg-2 shadow-[inset_0_0_0_1px_var(--line)] hover:text-fg"
            }`}
          >
            {w} kg
          </button>
        ))}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={withDims}
        onClick={() => setWithDims((v) => !v)}
        className="mt-5 flex min-h-11 items-center gap-3 self-start text-left"
      >
        <span aria-hidden className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${withDims ? "bg-brand" : "bg-white/15"}`}>
          <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${withDims ? "translate-x-5" : ""}`} />
        </span>
        <span className="t-small text-fg-2">{t("dims")}</span>
      </button>

      {withDims && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
          {dimFields.map((f) => (
            <div key={f.key} className="min-w-0">
              <label htmlFor={`${ids}-${f.key}`} className="t-small block truncate text-fg-3">
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
                className="field mt-1.5 px-3 tabular-nums"
              />
            </div>
          ))}
        </div>
      )}

      <div aria-live="polite" className="mt-auto pt-8">
        <div className="rounded-2xl border border-line bg-gradient-to-b from-brand/[0.08] to-transparent p-5">
          <p className="t-small flex items-center gap-2 text-fg-2">
            {t("result")}
            {loading && <Loader2 size={14} className="animate-spin" aria-label={tc("calculating")} />}
          </p>
          <p className="mt-1 text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-semibold leading-tight tracking-tight tabular-nums">
            {shown ? `${formatUzs(shown.priceUzs)} so‘m` : <span className="t-body font-normal text-fg-3">{t("resultHint")}</span>}
          </p>
          {shown && (
            <p className="t-small mt-1 text-fg-3 tabular-nums">
              ${shown.priceUsd.toFixed(2)} · {shown.chargeableWeight} kg
              {shown.volumetricWeight > shown.actualWeight ? ` (${tc("volumetric")})` : ""}
            </p>
          )}
        </div>
        {shown?.isFallback && <p className="t-small mt-3 text-fg-3">{tc("fallbackNotice")}</p>}
      </div>
    </div>
  );
}
