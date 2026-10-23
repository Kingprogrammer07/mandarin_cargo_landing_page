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
  available: { dot: "bg-success text-white", text: "text-success" },
  pending: { dot: "bg-brand text-on-brand", text: "text-brand-text" },
  nodata: { dot: "bg-paper-2 text-muted", text: "text-muted" },
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
    <section id="track" aria-labelledby="track-title" className="bg-field py-24 text-on-field lg:py-40">
      <div className="grid gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="track-title" className="r t-head" style={{ "--i": 0 } as React.CSSProperties}>{tp("h2")}</h2>
          <p className="r t-body mt-5 max-w-[40ch] text-on-field" style={{ "--i": 1 } as React.CSSProperties}>{tp("lead")}</p>
        </div>

        <div className="r flex flex-col bg-paper text-ink sm:flex-row lg:col-span-7" style={{ "--i": 2, "--perf": "var(--field)" } as React.CSSProperties}>
          <div className="perf-x sm:hidden" aria-hidden />
          <div className="perf-y hidden sm:block" aria-hidden />
          <div className="min-w-0 flex-1 p-5 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <PackageSearch size={20} aria-hidden className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full border-0 border-b-2 border-ink/25 bg-transparent pl-8 pr-2 text-base uppercase tracking-wide text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70 focus:border-brand"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-ink disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Search size={18} aria-hidden />}
              {loading ? t("checking") : t("button")}
            </button>
          </form>

          <div aria-live="polite">
            {!error && !result && (
              <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3" aria-label={tp("h2")}>
                {stepTitles.map((title) => (
                  <li key={title} className="t-small flex items-center gap-2 text-muted">
                    <span aria-hidden className="h-2 w-2 shrink-0 bg-ink/25" />
                    {title}
                  </li>
                ))}
              </ol>
            )}

            {error && (
              <div className={`mt-6 p-4 t-small ${errorType === "network" ? "bg-danger/10 text-danger" : "bg-paper-2 text-ink"}`}>
                <p className="font-medium">{error}</p>
                {errorType === "network" && (
                  <button type="button" onClick={handleTrack} className="btn btn-paper mt-3 min-h-11 px-5 text-sm">
                    <RefreshCw size={14} aria-hidden />
                    {t("button")}
                  </button>
                )}
              </div>
            )}

            {result && (
              <div className="mt-6">
                <div className="flex flex-wrap items-end justify-between gap-3 bg-paper-2 p-5">
                  <div className="min-w-0">
                    <p className="break-all font-semibold tracking-wide">{result.track_code}</p>
                    {result.weight && (
                      <p className="t-small mt-1 text-muted">
                        {t("weightLabel")}: <span className="font-semibold text-ink">{result.weight} kg</span>
                      </p>
                    )}
                  </div>
                  <p className="text-right">
                    <span className="block font-display text-3xl font-bold leading-none tabular-nums">{result.progress_percentage}%</span>
                    <span className="t-small text-muted">{t("progressLabel")}</span>
                  </p>
                  <div className="h-1.5 w-full bg-paper">
                    <div className="h-full bg-brand transition-[width] duration-700" style={{ width: `${Math.min(100, Math.max(0, result.progress_percentage))}%` }} />
                  </div>
                </div>

                <ol className="mt-4 space-y-4">
                  {result.steps.map((s, i) => {
                    const st = statusStyle[s.status] ?? statusStyle.nodata;
                    return (
                      <li key={s.step} className="flex gap-4">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${st.dot}`}>
                          <StatusIcon status={s.status} />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="font-semibold">{stepTitles[i] ?? s.title}</p>
                          <p className={`t-small font-medium ${st.text}`}>
                            {statusLabel(s.status)}
                            {s.updated_at && <span className="font-normal text-muted">, {formatDate(s.updated_at)}</span>}
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
      </div>
    </section>
  );
}
