"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Loader2, CheckCircle2, Clock, Circle, PackageSearch, RefreshCw } from "lucide-react";

const API = "https://bot.webmandarin.uz/api/v1/public/track/";

type StepStatus = "available" | "pending" | "nodata";

interface TrackStep {
  step: number;
  title: string;
  status: StepStatus;
  updated_at: string | null;
  delivery_method: string | null;
}

interface TrackResult {
  found: boolean;
  track_code: string;
  service_type: string;
  weight: string;
  import_date: string | null;
  progress_percentage: number;
  steps: TrackStep[];
}

const statusStyle: Record<StepStatus, { dot: string; text: string }> = {
  available: { dot: "bg-success/15 text-success", text: "text-success" },
  pending: { dot: "bg-brand/15 text-brand-text", text: "text-brand-text" },
  nodata: { dot: "bg-tint/5 text-fg-3", text: "text-fg-3" },
};

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "available") return <CheckCircle2 size={16} />;
  if (status === "pending") return <Clock size={16} />;
  return <Circle size={16} />;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TrackOrder() {
  const t = useTranslations("track");
  const tp = useTranslations("page.track");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"notfound" | "validation" | "network">("network");
  const [result, setResult] = useState<TrackResult | null>(null);

  const fail = (msg: string, type: "notfound" | "validation" | "network") => {
    setError(msg);
    setErrorType(type);
    setResult(null);
  };

  const stepTitles = [0, 1, 2, 3, 4, 5].map((i) => t(`steps.${i}`));
  const statusLabel = (s: StepStatus) =>
    s === "available" ? t("statusAvailable") : s === "pending" ? t("statusPending") : t("statusNodata");

  const handleTrack = async () => {
    const value = code.trim();
    if (value.length < 3) {
      fail(t("tooShort"), "validation");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API + encodeURIComponent(value), { headers: { Accept: "application/json" } });
      if (res.status === 429) {
        fail(t("rateLimit"), "network");
        return;
      }
      if (res.status === 400) {
        fail(t("tooShort"), "validation");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data: TrackResult = await res.json();
      if (!data.found) {
        fail(t("notFound"), "notfound");
        return;
      }
      setResult(data);
    } catch {
      fail(t("errorGeneric"), "network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <h2 id="track-title" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{tp("h2")}</h2>
      <p className="t-small mt-2 max-w-[46ch] text-fg-2">{tp("lead")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrack();
        }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative min-w-0 flex-1">
          <PackageSearch size={20} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-3" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="field h-14 pl-12 font-mono uppercase tracking-wide placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-ghost h-14 disabled:opacity-60">
          {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Search size={18} aria-hidden />}
          {loading ? t("checking") : t("button")}
        </button>
      </form>

      <div aria-live="polite" className="mt-auto">
        {!error && !result && (
          <ol className="relative mt-8 space-y-0" aria-label={tp("h2")}>
            {stepTitles.map((title, i) => (
              <li key={title} className="relative flex items-center gap-4 py-2.5">
                {i < stepTitles.length - 1 && <span aria-hidden className="absolute left-[5px] top-1/2 h-full w-px bg-line-2" />}
                <span aria-hidden className={`relative h-[11px] w-[11px] shrink-0 rounded-full border ${i === 0 ? "border-brand bg-brand shadow-[0_0_12px_rgb(var(--brand-rgb)/0.8)]" : "border-line-2 bg-night"}`} />
                <span className={`t-small ${i === 0 ? "text-fg" : "text-fg-3"}`}>{title}</span>
              </li>
            ))}
          </ol>
        )}

        {error && (
          <div className={`mt-6 rounded-2xl border p-4 t-small ${errorType === "network" ? "border-danger/30 bg-danger/10 text-danger" : "border-line bg-tint/[0.03] text-fg"}`}>
            <p className="font-medium">{error}</p>
            {errorType === "network" && (
              <button type="button" onClick={handleTrack} className="btn btn-ghost mt-3 min-h-11 px-5 text-sm">
                <RefreshCw size={14} aria-hidden />
                {t("button")}
              </button>
            )}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="rounded-2xl border border-line bg-tint/[0.03] p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-all font-mono font-medium tracking-wide">{result.track_code}</p>
                  {result.weight && (
                    <p className="t-small mt-1 text-fg-3">
                      {t("weightLabel")}: <span className="text-fg">{result.weight} kg</span>
                    </p>
                  )}
                </div>
                <p className="text-right">
                  <span className="block text-3xl font-semibold leading-none tabular-nums">{result.progress_percentage}%</span>
                  <span className="t-small text-fg-3">{t("progressLabel")}</span>
                </p>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-tint/10">
                <div className="h-full rounded-full bg-brand shadow-[0_0_12px_rgb(var(--brand-rgb)/0.8)] transition-[width] duration-700" style={{ width: `${Math.min(100, Math.max(0, result.progress_percentage))}%` }} />
              </div>
            </div>

            <ol className="mt-4 space-y-3">
              {result.steps.map((s, i) => {
                const st = statusStyle[s.status] ?? statusStyle.nodata;
                return (
                  <li key={s.step} className="flex gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${st.dot}`}>
                      <StatusIcon status={s.status} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-medium">{stepTitles[i] ?? s.title}</p>
                      <p className={`t-small ${st.text}`}>
                        {statusLabel(s.status)}
                        {s.updated_at && <span className="text-fg-3">, {formatDate(s.updated_at)}</span>}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
