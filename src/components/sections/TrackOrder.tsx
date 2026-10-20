"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Loader2, CheckCircle2, Clock, Circle, PackageSearch, RefreshCw } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

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
  available: { dot: "bg-success text-white", text: "text-success" },
  pending: { dot: "bg-brand text-on-brand", text: "text-brand-text" },
  nodata: { dot: "bg-surface-2 text-muted border border-border", text: "text-muted" },
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
    <section id="track" className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} centered={false} />

        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <PackageSearch size={20} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="h-12 w-full rounded-ui-md border border-border bg-surface pl-12 pr-4 text-base uppercase tracking-wide text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand-soft"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Search size={18} aria-hidden />}
              {loading ? t("checking") : t("button")}
            </button>
          </form>

          <div aria-live="polite">
            {error && (
              <div
                className={`mt-4 rounded-ui-md border p-4 text-sm leading-relaxed ${
                  errorType === "network" ? "border-danger/30 bg-danger/5 text-danger" : "border-border bg-surface-2 text-ink"
                }`}
              >
                <p className="font-medium">{error}</p>
                {errorType === "network" && (
                  <button
                    type="button"
                    onClick={handleTrack}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 font-semibold text-ink"
                  >
                    <RefreshCw size={14} aria-hidden />
                    {t("button")}
                  </button>
                )}
              </div>
            )}

            {result && (
              <div className="mt-4 overflow-hidden rounded-ui-lg border border-border">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border bg-surface-2 p-5">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold tracking-wide text-ink">{result.track_code}</p>
                    {result.weight && (
                      <p className="mt-1 text-sm text-muted">
                        {t("weightLabel")}: <span className="font-semibold text-ink">{result.weight} kg</span>
                      </p>
                    )}
                  </div>
                  <p className="text-right">
                    <span className="block text-3xl font-extrabold leading-none text-ink tabular-nums">
                      {result.progress_percentage}%
                    </span>
                    <span className="text-xs text-muted">{t("progressLabel")}</span>
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-700"
                      style={{ width: `${Math.min(100, Math.max(0, result.progress_percentage))}%` }}
                    />
                  </div>
                </div>

                <ol className="p-5">
                  {result.steps.map((s, i) => {
                    const st = statusStyle[s.status] ?? statusStyle.nodata;
                    const isLast = i === result.steps.length - 1;
                    return (
                      <li key={s.step} className="relative flex gap-4 pb-5 last:pb-0">
                        {!isLast && <span aria-hidden className="absolute bottom-0 left-[15px] top-8 w-px bg-border" />}
                        <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${st.dot}`}>
                          <StatusIcon status={s.status} />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-sm font-semibold text-ink">{stepTitles[i] ?? s.title}</p>
                          <p className={`text-xs font-medium ${st.text}`}>
                            {statusLabel(s.status)}
                            {s.updated_at && <span className="font-normal text-muted"> · {formatDate(s.updated_at)}</span>}
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
      </div>
    </section>
  );
}
