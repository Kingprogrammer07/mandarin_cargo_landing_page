/**
 * Turns the API payload into the strings each section renders.
 *
 * Rule: without API data every section keeps its built-in copy. With API data
 * a metric that is `null` (an admin hid it) is left out, never replaced by the
 * old hardcoded claim.
 */

import type { FeaturesLive } from "@/components/sections/Features";
import type { HeroLive } from "@/components/sections/Hero";
import type { PricingLive } from "@/components/sections/Pricing";
import type { ReviewsLive } from "@/components/sections/Reviews";
import type { TrustBarLive } from "@/components/sections/TrustBar";
import { formatCount, formatPrice, localized, type LandingData } from "@/lib/landingData";

type Translate = (key: string, values?: Record<string, string | number>) => string;

/** Shown on the page; the rest stay in the admin panel only. */
const MAX_TESTIMONIALS = 6;

export interface LiveSections {
  hero: HeroLive;
  features: FeaturesLive;
  trustBar: TrustBarLive;
  pricing: PricingLive;
  reviews: ReviewsLive;
}

const INTL_LOCALE: Record<string, string> = { uz: "uz-Latn-UZ", ru: "ru-RU", en: "en-US", cn: "zh-CN" };

/** "2026-10-19" → "October 2026" in the page's language; "" when unknown. */
function formatMonth(date: string | null, locale: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function buildLiveSections(data: LandingData, locale: string, t: Translate): LiveSections {
  const { stats, reviews } = data;
  const clients = stats.clients != null ? formatCount(stats.clients, locale) : null;
  const price = data.pricing.price_per_kg_usd;
  const days = stats.delivery_days_median != null ? Math.round(stats.delivery_days_median) : null;
  const years = stats.years != null ? Math.floor(stats.years) : null;

  const trust: string[] = [];
  if (years != null && years > 0) trust.push(t("live.years", { years }));
  if (clients) trust.push(t("live.clients", { clients }));
  if (days != null && days > 0) trust.push(t("live.delivery", { days }));

  const hero: HeroLive = {
    trust,
    channelBadge:
      stats.channel_subscribers != null
        ? t("live.subscribers", { count: formatCount(stats.channel_subscribers, locale) })
        : t("live.channelCta"),
  };
  if (price != null) {
    hero.subheadline = clients
      ? t("live.subheadline", { price: formatPrice(price), clients })
      : t("live.subheadlineNoClients", { price: formatPrice(price) });
  }

  const trustBar: TrustBarLive = {};
  if (years != null && years > 0) trustBar.years = String(years);
  if (clients) trustBar.clients = clients;
  if (stats.cargo_kg != null && stats.cargo_kg >= 1000) {
    trustBar.cargo = formatCount(stats.cargo_kg / 1000, locale);
  }
  if (stats.channel_subscribers != null) {
    trustBar.subscribers = formatCount(stats.channel_subscribers, locale);
  }

  // Quotes in the visitor's language first, then the rest, newest first within each.
  const quotes = [...reviews.items].sort(
    (a, b) => Number(b.language === locale) - Number(a.language === locale),
  );

  const pricing = data.tiers
    .filter((tier) => tier.price_usd != null && localized(tier.name, locale))
    .map((tier) => ({
      name: localized(tier.name, locale) ?? "",
      price: formatPrice(tier.price_usd as number),
      oldPrice: tier.old_price_usd != null ? formatPrice(tier.old_price_usd) : null,
      desc: localized(tier.description, locale) ?? "",
      badges: localized(tier.badges, locale) ?? [],
      popular: tier.is_popular,
    }));

  const features: FeaturesLive = {};
  if (days != null && days > 0) features.deliveryDesc = t("live.featureDelivery", { days });

  return {
    hero,
    features,
    trustBar,
    pricing: {
      tiers: pricing.length > 0 ? pricing : undefined,
      subtitle: pricing.length > 0 ? t("live.pricingSubtitle") : undefined,
      includedDelivery: days != null && days > 0 ? t("live.includedDelivery", { days }) : undefined,
    },
    reviews: {
      h2: clients ? t("live.reviewsH2", { clients }) : t("live.reviewsH2Plain"),
      rating: reviews.count > 0 && reviews.average != null ? reviews.average.toFixed(1) : null,
      countText: t("live.reviewCount", { count: reviews.count }),
      testimonials: quotes.slice(0, MAX_TESTIMONIALS).map((r) => ({
        name: r.author_name,
        city: formatMonth(r.date, locale),
        rating: r.rating,
        quote: r.text,
      })),
    },
  };
}
