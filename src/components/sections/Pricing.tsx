import { useTranslations } from "next-intl";
import { site } from "@/config/site";
import type { PricingTier } from "@/lib/landingView";

const INCLUDED_COUNT = 5;

/** The two half-round bites where the ticket's parts meet, in the ground colour. */
function Notches() {
  return (
    <>
      {/* phone: left and right edges */}
      <span aria-hidden className="absolute -left-3.5 top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-brand lg:hidden" />
      <span aria-hidden className="absolute -right-3.5 top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-brand lg:hidden" />
      {/* desktop: top and bottom edges */}
      <span aria-hidden className="absolute -top-3.5 left-0 hidden h-7 w-7 -translate-x-1/2 rounded-full bg-brand lg:block" />
      <span aria-hidden className="absolute -bottom-3.5 left-0 hidden h-7 w-7 -translate-x-1/2 rounded-full bg-brand lg:block" />
    </>
  );
}

/**
 * Each rate is printed on a ticket: what you ship on the main part, the price
 * on the tear-off stub. The ground is the mandarin orange.
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

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="bg-brand py-24 text-on-brand lg:py-40">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <h2 id="pricing-title" className="r t-head" style={{ "--i": 0 } as React.CSSProperties}>{t("h2")}</h2>
        <p className="r t-body mt-5 max-w-[48ch]" style={{ "--i": 1 } as React.CSSProperties}>{t("lead")}</p>

        <ul className="mt-14 space-y-8 lg:space-y-10">
          {tiers.map((tier, i) => (
            <li
              key={tier.name}
              className="r grid overflow-hidden bg-paper text-ink lg:grid-cols-[6fr_4fr]"
              style={{ "--i": i + 2, "--perf": "var(--brand)" } as React.CSSProperties}
            >
              <div className="flex min-w-0 flex-col p-6 sm:p-10">
                <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-bold leading-none tracking-tight">{tier.name}</h3>
                <p className="t-body mt-5 max-w-[56ch]">{tier.desc}</p>
                {tier.badges.length > 0 && (
                  <ul className="t-body mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                    {tier.badges.map((b) => (
                      <li key={b} className="flex gap-2"><span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand" />{b}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative flex flex-col items-center justify-center bg-paper-2 px-6 pb-6 pt-16 sm:px-8 sm:pb-8 lg:bg-paper lg:pt-8">
                <Notches />
                <div className="perf-x absolute inset-x-5 top-0 lg:hidden" aria-hidden />
                <div className="perf-y absolute inset-y-5 left-0 hidden lg:block" aria-hidden />
                <p className="flex items-baseline gap-2 whitespace-nowrap">
                  {tier.oldPrice && <s className="t-lead text-muted">{tier.oldPrice}</s>}
                  <span className="font-display text-[clamp(3.25rem,13vw,4.75rem)] font-bold leading-none tracking-tight tabular-nums">{tier.price}</span>
                  <span className="t-lead font-medium">/ kg</span>
                </p>
                <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-6 w-full">
                  {t("cta")}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          <h3 className="r text-xl font-semibold lg:col-span-4" style={{ "--i": 0 } as React.CSSProperties}>{t("included")}</h3>
          <ul className="r t-body grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:col-span-8" style={{ "--i": 1 } as React.CSSProperties}>
            {included.map((item) => (
              <li key={item} className="flex gap-3"><span aria-hidden className="mt-[0.55em] h-2 w-2 shrink-0 bg-paper" />{item}</li>
            ))}
          </ul>
        </div>
        <p className="t-small mt-10 max-w-[60ch]">{old("note")} {old("bonus")}</p>
      </div>
    </section>
  );
}
