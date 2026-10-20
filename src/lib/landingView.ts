/**
 * Turns the API payload into the facts the page prints.
 *
 * Rule: without API data every section keeps its built-in copy. With API data
 * a metric that is `null` (an admin hid it) is left out, never replaced by an
 * old hardcoded claim.
 */

import { formatCount, formatPrice, localized, type LandingData } from "@/lib/landingData";

/** Shown on the page; the rest stay in the admin panel only. */
const MAX_QUOTES = 4;

export interface PricingTier {
  name: string;
  price: string;
  oldPrice: string | null;
  desc: string;
  badges: string[];
  popular: boolean;
}

export interface Quote {
  name: string;
  date: string;
  rating: number;
  text: string;
}

export interface LiveFacts {
  price: string | null;
  days: number | null;
  clients: string | null;
  years: number | null;
  tons: string | null;
  subscribers: string | null;
  rating: { average: string; count: number } | null;
  quotes: Quote[];
  tiers: PricingTier[] | null;
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

export function buildLiveFacts(data: LandingData, locale: string): LiveFacts {
  const { stats, reviews } = data;
  const positive = (n: number | null) => (n != null && n > 0 ? n : null);

  const tiers = data.tiers
    .filter((tier) => tier.price_usd != null && localized(tier.name, locale))
    .map((tier) => ({
      name: localized(tier.name, locale) ?? "",
      price: formatPrice(tier.price_usd as number),
      oldPrice: tier.old_price_usd != null ? formatPrice(tier.old_price_usd) : null,
      desc: localized(tier.description, locale) ?? "",
      badges: localized(tier.badges, locale) ?? [],
      popular: tier.is_popular,
    }));

  // Quotes in the visitor's language first.
  const quotes = [...reviews.items]
    .sort((a, b) => Number(b.language === locale) - Number(a.language === locale))
    .slice(0, MAX_QUOTES)
    .map((r) => ({ name: r.author_name, date: formatMonth(r.date, locale), rating: r.rating, text: r.text }));

  const days = positive(stats.delivery_days_median);
  const years = positive(stats.years);

  return {
    price: data.pricing.price_per_kg_usd != null ? formatPrice(data.pricing.price_per_kg_usd) : null,
    days: days != null ? Math.round(days) : null,
    clients: stats.clients != null ? formatCount(stats.clients, locale) : null,
    years: years != null ? Math.floor(years) : null,
    tons: stats.cargo_kg != null && stats.cargo_kg >= 1000 ? formatCount(stats.cargo_kg / 1000, locale) : null,
    subscribers: stats.channel_subscribers != null ? formatCount(stats.channel_subscribers, locale) : null,
    rating:
      reviews.count > 0 && reviews.average != null
        ? { average: reviews.average.toFixed(1), count: reviews.count }
        : null,
    quotes,
    tiers: tiers.length > 0 ? tiers : null,
  };
}
