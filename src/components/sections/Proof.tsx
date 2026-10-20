import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LiveFacts } from "@/lib/landingView";

/**
 * Proof printed on a card, the way a programme lists its patrons: only real
 * numbers and approved client quotes from the API, nothing invented. The
 * section is shorter than the card, so its bottom edge crops it.
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
    <section id="reviews" aria-labelledby="proof-title" className="overflow-hidden bg-field pt-24 lg:pt-40">
      <div className="r mx-auto -mb-24 w-[92%] max-w-[760px] rotate-1 bg-paper px-7 pb-32 pt-10 text-center text-ink sm:px-14 sm:pt-14" style={{ "--i": 0 } as React.CSSProperties}>
        <h2 id="proof-title" className="t-head">
          {live?.clients ? t("h2", { clients: live.clients }) : t("h2Plain")}
        </h2>
        <div className="relative mt-8 aspect-video w-full overflow-hidden">
          <Image src="/warehouse-china-2.webp" alt={t("photoAlt")} fill sizes="(min-width: 768px) 640px, 90vw" className="object-cover" />
        </div>
        {facts.length > 0 && (
          <ul className="mt-8 space-y-1 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.7]">
            {facts.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
        {quotes.length > 0 && (
          <ul className="mt-10 space-y-8">
            {quotes.map((q) => (
              <li key={q.name + q.text.slice(0, 12)}>
                <blockquote className="t-lead mx-auto max-w-[36ch]">“{q.text}”</blockquote>
                <p className="t-small mt-3 text-muted">{q.name}{q.date ? `, ${q.date}` : ""}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
