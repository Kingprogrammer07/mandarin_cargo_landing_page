import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";
import HeroGlobe from "@/components/globe/HeroGlobe";
import HeroParallax from "@/components/ui/HeroParallax";
import type { LiveFacts } from "@/lib/landingView";

/**
 * Night over the route: the headline in the middle of the screen and a huge
 * globe rising from the bottom edge, with the Xianyang → Tashkent flight lit
 * across it. Below the fold line, the four numbers that matter.
 */
export default function Hero({ live }: { live?: LiveFacts }) {
  const t = useTranslations("page.hero");

  const price = live?.price ?? `$${site.pricePerKg}`;
  const transit = live?.days ? t("transitLive", { days: live.days }) : t("transitFallback");

  const stats = [
    { label: t("price"), value: price },
    { label: t("transit"), value: transit },
    live?.clients ? { label: t("clients"), value: live.clients } : null,
    { label: t("since"), value: t("sinceValue") },
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <HeroParallax className="relative flex min-h-[max(100svh,640px)] flex-col [--cap:42svh] [--g:230vw] sm:[--g:160vw] lg:[--cap:50svh] lg:[--g:min(1280px,100vw)]">
        <div aria-hidden className="grid-lines absolute inset-0 -z-20" />
        {/* Warm light behind the horizon. */}
        <div
          aria-hidden
          className="absolute bottom-[-20%] left-1/2 -z-20 h-[70%] w-[140%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-rgb)/0.22),transparent)]"
        />

        <div
          className="absolute left-1/2 -z-10 aspect-square w-[var(--g)]"
          style={{ bottom: "calc(var(--cap) - var(--g))", transform: "translate3d(-50%, calc(var(--hero-p, 0) * -90px), 0)" }}
        >
          <HeroGlobe label={t("route")} fromLabel={t("fromShort")} toLabel={t("toCity")} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-night" />

        <div className="hero-copy relative mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pb-[calc(var(--cap)+1rem)] pt-28 text-center sm:px-8 sm:pt-36 lg:pt-40">
          <p className="rise inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-tint/[0.03] py-1.5 pl-2 pr-4 text-sm text-fg-2 backdrop-blur" style={{ "--i": 0 } as React.CSSProperties}>
            <span aria-hidden className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgb(var(--brand-rgb)/0.9)]" />
            <span>
              {t("fromShort")} <span aria-hidden>→</span> {t("toCity")}
              <span className="text-fg-3"> · </span>
              {transit}
            </span>
          </p>

          <h1 id="hero-title" className="t-display ink-fade mt-7 max-w-[14ch] pb-1" style={{ "--i": 1 } as React.CSSProperties}>
            {t("h1")}
          </h1>
          <p className="t-lead mt-6 max-w-[44ch] text-fg-2" style={{ "--i": 2 } as React.CSSProperties}>
            {t("lead")}
          </p>

          <div className="rise mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
              {t("cta")}
              <ArrowRight size={18} aria-hidden />
            </a>
            <a href="#calculator" className="btn btn-ghost">
              {t("calcCta")}
            </a>
          </div>
        </div>
      </HeroParallax>

      <div className="relative border-y border-line bg-night">
        <dl className={`mx-auto grid max-w-[1200px] grid-cols-2 ${stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex min-w-0 flex-col-reverse gap-1 px-5 py-6 sm:px-8 sm:py-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="t-small text-fg-3">{s.label}</dt>
              <dd className="text-[clamp(1.375rem,1rem+1.6vw,2.25rem)] font-semibold leading-tight tracking-tight tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
