import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import HeroGlobe from "@/components/globe/HeroGlobe";

/** Texts built from live API numbers; omitted fields keep the built-in copy. */
export interface HeroLive {
  subheadline?: string;
  trust?: string[];
  channelBadge?: string;
}

export default function Hero({ live }: { live?: HeroLive }) {
  const t = useTranslations("hero");
  const facts = live?.trust ?? [t("trust1"), t("trust2"), t("trust3")];
  const channelBadge = live?.channelBadge ?? t("channelBadge");

  return (
    <section id="hero" className="relative -mt-16 overflow-hidden border-b border-border bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-14 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-36">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-text">
            {t("eyebrow")}
          </p>

          <h1 className="mt-4 max-w-[13ch] text-[clamp(1.875rem,10vw,2.5rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[4rem]">
            {t("h1")}
          </h1>

          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted">
            {live?.subheadline ?? t("subheadline")}
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row">
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-base font-semibold text-on-brand transition-colors duration-150 hover:bg-brand-hover active:scale-[0.98]"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface px-7 text-base font-semibold text-ink transition-colors duration-150 hover:border-ink/25 active:scale-[0.98]"
            >
              {t("ctaSecondary")}
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
                {fact}
              </li>
            ))}
          </ul>

          <a
            href={site.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <TelegramIcon />
            {channelBadge}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>

        <div className="mx-auto aspect-square w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[580px]">
          <HeroGlobe label={t("globeLabel")} />
        </div>
      </div>
    </section>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
