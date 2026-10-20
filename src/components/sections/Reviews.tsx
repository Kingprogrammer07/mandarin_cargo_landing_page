import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  quote: string;
}

/** Real reviews collected by the bot; `rating` null hides the average block. */
export interface ReviewsLive {
  h2?: string;
  rating: string | null;
  countText: string;
  testimonials: Testimonial[];
}

const GRID: Record<number, string> = { 1: "lg:grid-cols-1 lg:max-w-2xl", 2: "lg:grid-cols-2" };

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden
          className={i < Math.round(value) ? "fill-brand text-brand" : "fill-border text-border"}
        />
      ))}
    </span>
  );
}

/**
 * Without live data the built-in quotes are shown but no average: a rating
 * figure is only ever printed when it comes from real client votes.
 */
export default function Reviews({ live }: { live?: ReviewsLive }) {
  const t = useTranslations("reviews");
  const testimonials: Testimonial[] =
    live?.testimonials ??
    [0, 1, 2].map((i) => ({
      name: t(`testimonials.${i}.name`),
      city: t(`testimonials.${i}.city`),
      rating: 5,
      quote: t(`testimonials.${i}.quote`),
    }));
  const rating = live?.rating ?? null;

  return (
    <section id="reviews" className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={t("eyebrow")} title={live?.h2 ?? t("h2")} centered={false} />
          {rating && live && (
            <div className="flex items-center gap-4">
              <span className="text-5xl font-extrabold leading-none tracking-tight text-ink tabular-nums">{rating}</span>
              <span>
                <Stars value={Number(rating)} size={18} />
                <span className="mt-1 block text-sm text-muted">
                  {t("outOf")} · {live.countText}
                </span>
              </span>
            </div>
          )}
        </div>

        {testimonials.length > 0 && (
          <ul
            className={`-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:mt-12 lg:grid lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0 ${
              GRID[testimonials.length] ?? "lg:grid-cols-3"
            }`}
          >
            {testimonials.map((item) => (
              <li
                key={`${item.name}-${item.quote.slice(0, 24)}`}
                className="flex w-[85%] max-w-[22rem] shrink-0 snap-start flex-col rounded-ui-lg border border-border bg-canvas p-6 lg:w-auto lg:max-w-none"
              >
                <Stars value={item.rating} size={14} />
                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink">
                  {item.quote}
                </blockquote>
                <p className="mt-5 text-sm">
                  <span className="font-semibold text-ink">{item.name}</span>
                  {item.city && <span className="text-muted"> · {item.city}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
