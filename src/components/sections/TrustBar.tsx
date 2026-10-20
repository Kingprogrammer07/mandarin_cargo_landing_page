import { useTranslations } from "next-intl";
import { paymentLogos } from "@/config/site";

type StatKey = "years" | "clients" | "cargo" | "subscribers";

/**
 * Live figures keyed by stat; a key missing from the map means an admin hid
 * it (the figure is dropped). Without `live` the built-in copy is shown.
 */
export type TrustBarLive = Partial<Record<StatKey, string>>;

const STAT_KEYS: StatKey[] = ["years", "clients", "cargo", "subscribers"];

const COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  // Odd count on a two-column phone grid: the last figure takes the full row.
  3: "grid-cols-2 lg:grid-cols-3 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * Figures are rendered as final text, never counted up from zero: the static
 * HTML is what crawlers and slow phones see, and "0 clients" is a wrong claim.
 */
export default function TrustBar({ live }: { live?: TrustBarLive }) {
  const t = useTranslations("trustBar");
  const stats = STAT_KEYS.filter((key) => !live || live[key] !== undefined).map((key) => ({
    key,
    value: live?.[key] ?? t(`${key}.number`),
    label: t(`${key}.label`),
  }));

  return (
    <section id="trust" className="bg-canvas py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {stats.length > 0 && (
          <dl
            className={`grid gap-px overflow-hidden rounded-ui-lg border border-border bg-border ${
              COLUMNS[stats.length]
            }`}
          >
            {stats.map(({ key, value, label }) => (
              <div key={key} className="flex flex-col-reverse gap-1.5 bg-surface px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
                <dt className="text-sm font-medium text-muted">{label}</dt>
                <dd className="whitespace-nowrap text-2xl font-extrabold leading-none tracking-tight text-ink tabular-nums min-[400px]:text-[1.75rem] sm:text-4xl lg:text-5xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 flex flex-col items-center gap-5 lg:mt-12 lg:flex-row lg:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {t("paymentTitle")}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-end lg:gap-x-8">
            {paymentLogos.map((logo) => (
              <li key={logo}>
                {/* eslint-disable-next-line @next/next/no-img-element -- small vector logos; next/image adds nothing in a static export */}
                <img
                  src={`/pay/pay-${logo}.svg`}
                  alt={logo}
                  className="h-7 w-auto lg:h-8"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
