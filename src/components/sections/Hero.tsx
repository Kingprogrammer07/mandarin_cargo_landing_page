import { useTranslations } from "next-intl";
import { Plane } from "lucide-react";
import { site } from "@/config/site";
import Logo from "@/components/Logo";
import Stripe from "@/components/label/Stripe";
import Barcode from "@/components/label/Barcode";
import HeroCalc from "@/components/sections/HeroCalc";
import HeroPhotos from "@/components/sections/HeroPhotos";
import type { LiveFacts } from "@/lib/landingView";

const PHOTOS = ["/warehouse-china-1.webp", "/warehouse-china-2.webp", "/office-tashkent-1.webp"];

/**
 * The first screen is the parcel label every shipment carries: route codes,
 * the exact fields, a weight box that prints the price, and the action. The
 * photographs of the route sit beside it and stay in view.
 */
export default function Hero({ live }: { live?: LiveFacts }) {
  const t = useTranslations("page.hero");
  const tn = useTranslations("page.nav");

  const price = live?.price ?? `$${site.pricePerKg}`;
  const pricePerKg = Number(price.replace("$", "")) || site.pricePerKg;
  const transit = live?.days ? t("transitLive", { days: live.days }) : t("transitFallback");
  const photoAlts = t.raw("photos") as string[];

  const fields = [
    { label: t("price"), value: price },
    { label: t("transit"), value: transit },
    live?.clients ? { label: t("clients"), value: live.clients } : { label: t("since"), value: t("sinceValue") },
  ];

  return (
    <section id="hero" aria-labelledby="hero-title" className="grid grid-cols-[minmax(0,1fr)] gap-0 lg:gap-3 lg:px-3 lg:pb-3 lg:grid-cols-2">
      <div className="relative h-[34svh] min-h-[220px] lg:order-2 lg:h-auto">
        <div className="h-full lg:sticky lg:top-[76px] lg:h-[calc(100svh-88px)]">
          <HeroPhotos photos={PHOTOS.map((src, i) => ({ src, alt: photoAlts[i] ?? "" }))} />
        </div>
      </div>

      <article className="relative z-10 -mt-9 flex flex-col bg-paper lg:order-1 lg:mt-0 lg:min-h-[calc(100svh-88px)]">
        <Stripe className="h-10 sm:h-14" />
        <div className="flex flex-1 flex-col px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-5 xl:px-5">
          <div className="flex items-center justify-between gap-4">
            <Logo className="h-9 w-auto sm:h-10" />
            <Barcode value="MANDARIN-XIY-TAS" className="h-8 w-28 text-ink sm:w-36" />
          </div>

          <p className="mt-8 flex items-end justify-between gap-2 sm:mt-10" aria-label={t("route")}>
            <span className="min-w-0">
              <span className="t-display block text-[15.5vw] lg:text-[min(8vw,8.5rem)]">XIY</span>
              <span className="t-small mt-2 block text-muted">{t("fromCity")}</span>
            </span>
            <Plane aria-hidden className="mb-10 h-8 w-8 shrink-0 rotate-45 text-brand sm:h-12 sm:w-12" strokeWidth={1.75} />
            <span className="min-w-0 text-right">
              <span className="t-display block text-[15.5vw] lg:text-[min(8vw,8.5rem)]">TAS</span>
              <span className="t-small mt-2 block text-muted">{t("toCity")}</span>
            </span>
          </p>

          <h1 id="hero-title" className="t-head mt-8 max-w-[18ch] sm:mt-10">
            {t("h1")}
          </h1>
          <p className="t-body mt-4 max-w-[46ch]">{t("lead")}</p>

          <dl className="mt-8 grid grid-cols-3 gap-px bg-paper-2">
            {fields.map((f) => (
              <div key={f.label} className="min-w-0 bg-paper py-3 pr-2">
                <dt className="t-small text-muted">{f.label}</dt>
                <dd className="mt-1 whitespace-nowrap font-display text-[clamp(1rem,4.2vw,1.5rem)] font-semibold tracking-tight">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <HeroCalc pricePerKg={pricePerKg} />
          </div>

          <a
            href={site.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-brand mt-6 w-full"
          >
            {t("cta")}
          </a>

          <nav aria-label={tn("menu")} className="mt-auto flex flex-wrap justify-center gap-x-8 gap-y-2 pt-6">
            <a href="#track" className="link t-small inline-flex min-h-11 items-center">{tn("track")}</a>
            <a href="#pricing" className="link t-small inline-flex min-h-11 items-center">{tn("pricing")}</a>
            <a href="#faq" className="link t-small inline-flex min-h-11 items-center">{tn("faq")}</a>
          </nav>
        </div>
      </article>
    </section>
  );
}
