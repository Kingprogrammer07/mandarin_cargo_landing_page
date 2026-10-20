import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

/** A tariff as managed in the admin panel, already in the page's language. */
export interface PricingTierLive {
  name: string;
  price: string;
  oldPrice: string | null;
  desc: string;
  badges: string[];
  popular: boolean;
}

/** Live pricing; any missing field keeps the built-in copy. */
export interface PricingLive {
  tiers?: PricingTierLive[];
  subtitle?: string;
  includedDelivery?: string;
}

const INCLUDED_COUNT = 5;

export default function Pricing({ live }: { live?: PricingLive }) {
  const t = useTranslations("pricing");
  const unit = t("tiers.0.unit");

  const tiers: PricingTierLive[] =
    live?.tiers ??
    [0, 1, 2].map((i) => ({
      name: t(`tiers.${i}.name`),
      price: t(`tiers.${i}.price`),
      oldPrice: t.has(`tiers.${i}.oldPrice`) ? t(`tiers.${i}.oldPrice`) : null,
      desc: t(`tiers.${i}.desc`),
      badges: t.has(`tiers.${i}.badges`) ? (t.raw(`tiers.${i}.badges`) as string[]) : [],
      popular: i === 0,
    }));

  const included = Array.from({ length: INCLUDED_COUNT }, (_, i) =>
    i === 0 && live?.includedDelivery ? live.includedDelivery : t(`included.${i}`),
  );

  const columns = tiers.length >= 3 ? "md:grid-cols-3" : tiers.length === 2 ? "md:grid-cols-2" : "";

  return (
    <section id="pricing" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("h2")}
          subtitle={live?.subtitle ?? t("subtitle")}
          centered={false}
        />

        <div className={`mt-10 grid grid-cols-1 gap-4 lg:mt-12 lg:gap-6 ${columns}`}>
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-ui-lg bg-surface p-6 lg:p-8 ${
                tier.popular ? "border-2 border-ink" : "border border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">{tier.name}</h3>
                {tier.popular && (
                  <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-surface">
                    {t("popularBadge")}
                  </span>
                )}
              </div>

              <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
                {tier.oldPrice && (
                  <span className="text-xl font-semibold text-muted line-through tabular-nums">{tier.oldPrice}</span>
                )}
                <span className="whitespace-nowrap text-5xl font-extrabold tracking-tight text-ink tabular-nums">
                  {tier.price}
                </span>
                <span className="text-base text-muted">{unit}</span>
              </p>

              {tier.desc && <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{tier.desc}</p>}

              {tier.badges.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {tier.badges.map((badge) => (
                    <li key={badge} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand-text" aria-hidden />
                      {badge}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex-1" />
              <a
                href="#calculator"
                className={`mt-7 inline-flex h-12 items-center justify-center rounded-full text-base font-semibold transition-colors active:scale-[0.98] ${
                  tier.popular
                    ? "bg-brand text-on-brand hover:bg-brand-hover"
                    : "border border-border text-ink hover:border-ink/25"
                }`}
              >
                {t("cta")}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 rounded-ui-lg border border-border bg-surface p-6 lg:grid-cols-[0.8fr_2fr] lg:p-8">
          <div>
            <h3 className="text-base font-semibold text-ink">{t("includedTitle")}</h3>
            <p className="mt-2 text-sm font-medium text-brand-text">{t("bonus")}</p>
          </div>
          <div>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
