import { useTranslations } from "next-intl";
import { marketplaces } from "@/config/site";
import ScrollRail from "@/components/ui/ScrollRail";

/**
 * Five steps down a rail that fills as you scroll, a plane riding its tip.
 * The heading stays pinned beside them on wide screens.
 */
export default function HowItWorks() {
  const t = useTranslations("page.how");
  const tOld = useTranslations("howItWorks");
  const steps = t.raw("steps") as { title: string; desc: string }[];
  const address = tOld.raw("address") as string[];

  const details: Record<number, React.ReactNode> = {
    2: (
      <div className="mt-5 grid gap-4 rounded-2xl border border-line bg-tint/[0.02] p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <div>
          <p className="t-small text-fg-3">{t("codeLabel")}</p>
          <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-brand-text">{tOld("idCode")}</p>
        </div>
        <div className="min-w-0">
          <p className="t-small text-fg-3">{t("addressLabel")}</p>
          <p lang="zh" className="t-small mt-1 text-fg-2">{address.join(" ")}</p>
        </div>
      </div>
    ),
    3: (
      <ul className="mt-5 flex flex-wrap gap-2">
        {marketplaces.slice(0, 6).map((m) => (
          <li key={m} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-fg-2">{m}</li>
        ))}
      </ul>
    ),
  };

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="px-5 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="how-title" className="r t-head" style={{ "--i": 0 } as React.CSSProperties}>{t("h2")}</h2>
            <p className="r t-lead mt-5 max-w-[34ch] text-fg-2" style={{ "--i": 1 } as React.CSSProperties}>{t("lead")}</p>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <ScrollRail className="bottom-6 left-5 top-6" />
          <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.title} className="r relative pb-12 pl-16 last:pb-0 sm:pl-20" style={{ "--i": i + 1 } as React.CSSProperties}>
              <span aria-hidden className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-night font-mono text-sm text-fg-2">
                {i + 1}
              </span>
              <h3 className="pt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{s.title}</h3>
              <p className="t-body mt-2 max-w-[48ch] text-fg-2">{s.desc}</p>
              {details[i]}
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
