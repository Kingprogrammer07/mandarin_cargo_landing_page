"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, Clock, Circle, PackageSearch } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
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

const statusStyle: Record<StepStatus, { dot: string; ring: string; text: string }> = {
  available: { dot: "bg-green-500 text-white", ring: "ring-green-100", text: "text-green-600" },
  pending: { dot: "bg-amber-400 text-white", ring: "ring-amber-100", text: "text-amber-600" },
  nodata: { dot: "bg-slate-200 text-slate-400", ring: "ring-slate-100", text: "text-slate-400" },
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
  const [result, setResult] = useState<TrackResult | null>(null);

  const stepTitles = [0, 1, 2, 3, 4, 5].map((i) => t(`steps.${i}`));
  const statusLabel = (s: StepStatus) =>
    s === "available" ? t("statusAvailable") : s === "pending" ? t("statusPending") : t("statusNodata");

  const handleTrack = async () => {
    const value = code.trim();
    if (value.length < 3) {
      setError(t("tooShort"));
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API + encodeURIComponent(value), { headers: { Accept: "application/json" } });
      if (res.status === 429) {
        setError(t("rateLimit"));
        setResult(null);
        return;
      }
      if (res.status === 400) {
        setError(t("tooShort"));
        setResult(null);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data: TrackResult = await res.json();
      if (!data.found) {
        setError(t("notFound"));
        setResult(null);
        return;
      }
      setResult(data);
    } catch {
      setError(t("errorGeneric"));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="track" className="bg-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} />

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <PackageSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder={t("placeholder")}
              className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-base focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-slate-50/50 hover:bg-white uppercase tracking-wide"
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-150 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? t("checking") : t("button")}
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm font-medium text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="mt-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-900 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-orange-400">{result.track_code}</p>
                    {result.weight && (
                      <p className="mt-1 text-sm text-slate-300">
                        {t("weightLabel")}: <span className="font-semibold text-white">{result.weight} kg</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-white tabular-nums">{result.progress_percentage}%</p>
                    <p className="text-xs text-slate-400">{t("progressLabel")}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.progress_percentage}%` }}
                    transition={{ duration: 0.8, ease }}
                    className="h-full rounded-full bg-orange-500"
                  />
                </div>
              </div>

              {/* Steps */}
              <ol className="p-6 space-y-1">
                {result.steps.map((s, i) => {
                  const st = statusStyle[s.status] ?? statusStyle.nodata;
                  const isLast = i === result.steps.length - 1;
                  return (
                    <li key={s.step} className="relative flex gap-4 pb-5 last:pb-0">
                      {!isLast && <span className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-100" />}
                      <span className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ${st.dot} ${st.ring}`}>
                        <StatusIcon status={s.status} />
                      </span>
                      <div className="pt-0.5">
                        <p className="text-sm font-semibold text-slate-900">{stepTitles[i] ?? s.title}</p>
                        <p className={`text-xs font-medium ${st.text}`}>
                          {statusLabel(s.status)}
                          {s.updated_at && <span className="text-slate-400 font-normal"> · {formatDate(s.updated_at)}</span>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
