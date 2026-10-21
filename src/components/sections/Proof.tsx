import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import Spotlight from "@/components/ui/Spotlight";
import type { LiveFacts } from "@/lib/landingView";

/**
 * Only real numbers and approved client quotes from the API, nothing
 * invented. Hidden entirely when there is nothing to show.
 */
export default function Proof({ live }: { live?: LiveFacts }) {
  const t = useTranslations("page.proof");

  const facts = [
    live?.years ? t("years", { years: live.years }) : null,
    live?.tons ? t("cargo", { tons: live.tons }) : null,
    live?.subscribers ? t("subscribers", { count: live.subscribers }) : null,
    live?.rating ? t("rating", { rating: live.rating.average, count: live.rating.count }) : null,
  ].filter((f): f is string => Boolean(f));
  const quotes = live?.quotes ?? [];

  if (!live?.clients && facts.length === 0 && quotes.length === 0) return null;

  return (
    <section id="reviews" aria-labelledby="proof-title" className="px-5 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="proof-title" className="r t-display ink-fade lg:col-span-7" style={{ "--i": 0 } as React.CSSProperties}>
            {live?.clients ? t("h2", { clients: live.clients }) : t("h2Plain")}
          </h2>
          {facts.length > 0 && (
            <ul className="r t-lead space-y-2 text-fg-2 lg:col-span-5 lg:pb-3" style={{ "--i": 1 } as React.CSSProperties}>
              {facts.map((f) => (
                <li key={f} className="flex gap-3"><span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{f}</li>
              ))}
            </ul>
          )}
        </div>

        {quotes.length > 0 && (
          <Spotlight className="mt-14 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {quotes.map((q, i) => (
              <figure key={q.name + q.text.slice(0, 12)} data-spot className="r card flex flex-col p-6 sm:p-8" style={{ "--i": i + 2 } as React.CSSProperties}>
                <div role="img" className="flex gap-0.5 text-amber" aria-label={`${q.rating} / 5`}>
                  {Array.from({ length: 5 }, (_, n) => (
                    <Star key={n} size={16} aria-hidden className={n < q.rating ? "fill-current" : "opacity-25"} />
                  ))}
                </div>
                <blockquote className="t-lead mt-4 flex-1">“{q.text}”</blockquote>
                <figcaption className="t-small mt-6 text-fg-3">{q.name}{q.date ? ` · ${q.date}` : ""}</figcaption>
              </figure>
            ))}
          </Spotlight>
        )}
      </div>
    </section>
  );
}
