import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import type { PricingTier } from "@/lib/landingView";
import Tilt from "@/components/ui/Tilt";

const INCLUDED_COUNT = 5;

/**
 * Each rate is a boarding pass: what you ship on top, a torn perforation,
 * the price on the stub. The popular one glows.
 */
export default function Pricing({ tiers: liveTiers, days }: { tiers?: PricingTier[] | null; days?: number | null }) {
  const t = useTranslations("page.pricing");
  const old = useTranslations("pricing");
  const live = useTranslations("live");

  const tiers: PricingTier[] =
    liveTiers ??
    [0, 1, 2].map((i) => ({
      name: old(`tiers.${i}.name`),
      price: old(`tiers.${i}.price`),
      oldPrice: old.has(`tiers.${i}.oldPrice`) ? old(`tiers.${i}.oldPrice`) : null,
      desc: old(`tiers.${i}.desc`),
      badges: old.has(`tiers.${i}.badges`) ? (old.raw(`tiers.${i}.badges`) as string[]) : [],
      popular: i === 0,
    }));

  const included = Array.from({ length: INCLUDED_COUNT }, (_, i) =>
    i === 0 && days ? live("includedDelivery", { days }) : old(`included.${i}`),
  );
  const cols = tiers.length >= 3 ? "lg:grid-cols-3" : tiers.length === 2 ? "lg:grid-cols-2 lg:max-w-[860px] lg:mx-auto" : "lg:max-w-[460px] lg:mx-auto";

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-32">
      <div aria-hidden className="absolute left-1/2 top-1/3 -z-10 h-[600px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 id="pricing-title" className="r t-head" style={{ "--i": 0 } as React.CSSProperties}>{t("h2")}</h2>
          <p className="r t-lead mt-5 text-fg-2" style={{ "--i": 1 } as React.CSSProperties}>{t("lead")}</p>
        </div>

        <ul className={`mt-14 grid gap-5 ${cols}`}>
          {tiers.map((tier, i) => {
            const edge = tier.popular ? "border-brand/60" : "border-line";
            return (
            <li key={tier.name} className="r" style={{ "--i": i + 2 } as React.CSSProperties}>
              <Tilt max={5} className="h-full">
                <article
                  className={`relative flex h-full flex-col rounded-card border ${
                    tier.popular
                      ? "border-brand/60 bg-gradient-to-b from-brand/[0.12] to-surface shadow-[0_0_0_1px_rgb(var(--brand-rgb)/0.2),0_30px_80px_-30px_rgb(var(--brand-rgb)/0.55)]"
                      : "border-line bg-surface"
                  }`}
                >
                  <div className="flex-1 p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold tracking-tight">{tier.name}</h3>
                    <p className="t-body mt-3 text-fg-2">{tier.desc}</p>
                    {tier.badges.length > 0 && (
                      <ul className="t-small mt-5 space-y-2">
                        {tier.badges.map((b) => (
                          <li key={b} className="flex gap-2.5">
                            <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-brand-text" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Perforation with two bites out of the edges. */}
                  <div aria-hidden className="relative h-0">
                    <span className={`absolute -left-px top-0 h-6 w-3 -translate-y-1/2 rounded-r-full border border-l-0 bg-night ${edge}`} />
                    <span className={`absolute -right-px top-0 h-6 w-3 -translate-y-1/2 rounded-l-full border border-r-0 bg-night ${edge}`} />
                    <span className="absolute inset-x-5 top-0 border-t border-dashed border-line-2" />
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="flex items-baseline gap-2 whitespace-nowrap">
                      {tier.oldPrice && <s className="text-lg text-fg-3">{tier.oldPrice}</s>}
                      <span className="text-[clamp(2.75rem,2rem+3vw,3.75rem)] font-semibold leading-none tracking-tight tabular-nums">{tier.price}</span>
                      <span className="text-fg-2">/ kg</span>
                    </p>
                    <a
                      href={site.botUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn mt-6 w-full ${tier.popular ? "btn-brand" : "btn-ghost"}`}
                    >
                      {t("cta")}
                    </a>
                  </div>
                </article>
              </Tilt>
            </li>
            );
          })}
        </ul>

        <div className="r mt-14 rounded-card border border-line p-6 sm:p-8" style={{ "--i": 0 } as React.CSSProperties}>
          <h3 className="text-lg font-semibold">{t("included")}</h3>
          <ul className="t-body mt-5 grid gap-x-10 gap-y-3 text-fg-2 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <Check size={18} aria-hidden className="mt-1 shrink-0 text-brand-text" />
                {item}
              </li>
            ))}
          </ul>
          <p className="t-small mt-6 border-t border-line pt-5 text-fg-3">{old("note")} {old("bonus")}</p>
        </div>
      </div>
    </section>
  );
}
