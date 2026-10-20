/**
 * Live numbers for the landing page, read once at build time.
 *
 * The site is a static export, so this runs during `next build` (and on each
 * Vercel rebuild triggered from the admin panel). Any failure returns `null`
 * and the page falls back to the copy in `src/content/*` — a backend outage
 * must never break a deploy.
 */

const API_URL = process.env.LANDING_API_URL ?? "https://bot.webmandarin.uz";
const TIMEOUT_MS = 10_000;

export type LandingLang = "uz" | "ru" | "en" | "cn";

export interface LandingStats {
  /** `null` = hidden by an admin or not available: do not show it. */
  clients: number | null;
  cargo_kg: number | null;
  flights: number | null;
  delivery_days_median: number | null;
  delivery_days_p90: number | null;
  years: number | null;
  channel_subscribers: number | null;
}

export interface LandingReview {
  author_name: string;
  rating: number;
  text: string;
  language: string;
  date: string | null;
}

export interface LandingTier {
  name: Partial<Record<LandingLang, string>>;
  description: Partial<Record<LandingLang, string>>;
  badges: Partial<Record<LandingLang, string[]>>;
  price_usd: number | null;
  old_price_usd: number | null;
  is_popular: boolean;
}

export interface LandingData {
  stats: LandingStats;
  reviews: { average: number | null; count: number; items: LandingReview[] };
  pricing: { price_per_kg_usd: number | null };
  tiers: LandingTier[];
}

const num = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const texts = (value: unknown): Partial<Record<LandingLang, string>> => {
  const out: Partial<Record<LandingLang, string>> = {};
  for (const [k, v] of Object.entries(record(value))) {
    if (typeof v === "string" && v.trim()) out[k as LandingLang] = v;
  }
  return out;
};

/** Validates the API payload; anything unexpected becomes "not available". */
export function parseLandingData(raw: unknown): LandingData | null {
  const body = record(raw);
  if (!body.stats || !body.reviews) return null;
  const stats = record(body.stats);
  const reviews = record(body.reviews);

  return {
    stats: {
      clients: num(stats.clients),
      cargo_kg: num(stats.cargo_kg),
      flights: num(stats.flights),
      delivery_days_median: num(stats.delivery_days_median),
      delivery_days_p90: num(stats.delivery_days_p90),
      years: num(stats.years),
      channel_subscribers: num(stats.channel_subscribers),
    },
    reviews: {
      average: num(reviews.average),
      count: num(reviews.count) ?? 0,
      items: (Array.isArray(reviews.items) ? reviews.items : [])
        .map(record)
        .filter((r) => typeof r.text === "string" && typeof r.author_name === "string")
        .map((r) => ({
          author_name: r.author_name as string,
          rating: Math.min(5, Math.max(1, Math.round(num(r.rating) ?? 5))),
          text: r.text as string,
          language: typeof r.language === "string" ? r.language : "uz",
          date: typeof r.date === "string" ? r.date : null,
        })),
    },
    pricing: { price_per_kg_usd: num(record(body.pricing).price_per_kg_usd) },
    tiers: (Array.isArray(body.tiers) ? body.tiers : []).map(record).map((t) => {
      const badges: Partial<Record<LandingLang, string[]>> = {};
      for (const [k, v] of Object.entries(record(t.badges))) {
        if (Array.isArray(v)) badges[k as LandingLang] = v.filter((b): b is string => typeof b === "string");
      }
      return {
        name: texts(t.name),
        description: texts(t.description),
        badges,
        price_usd: num(t.price_usd),
        old_price_usd: num(t.old_price_usd),
        is_popular: t.is_popular === true,
      };
    }),
  };
}

let cached: Promise<LandingData | null> | undefined;

/** One request per build, shared by every locale and component. */
export function getLandingData(): Promise<LandingData | null> {
  cached ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/public/landing`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.warn(`[landing] ${res.status} from the API, using built-in copy`);
        return null;
      }
      return parseLandingData(await res.json());
    } catch (error) {
      console.warn("[landing] API unavailable, using built-in copy:", (error as Error).message);
      return null;
    }
  })();
  return cached;
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/**
 * Rounds down to two significant digits so a claim stays true until the next
 * rebuild: 48 312 → 48 000, 10 450 → 10 000, 167 → 160.
 */
export function niceFloor(value: number): number {
  const n = Math.floor(value);
  if (n < 100) return n;
  const magnitude = 10 ** (String(n).length - 2);
  return Math.floor(n / magnitude) * magnitude;
}

/** "48 000+" for uz/ru, "48,000+" for en/cn. */
export function formatCount(value: number, locale: string): string {
  const grouped = niceFloor(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" || locale === "cn" ? "," : " ");
  return `${grouped}+`;
}

export function formatPrice(usd: number): string {
  return `$${Math.round(usd * 100) / 100}`;
}

export function localized<T>(map: Partial<Record<LandingLang, T>>, locale: string): T | undefined {
  return map[locale as LandingLang] ?? map.uz;
}
