import Image from "next/image";
import { useTranslations } from "next-intl";
import { marketplaces, site } from "@/config/site";

const PAYMENTS = ["Click", "Payme", "Uzum", "Uzcard", "Humo", "NBU", "Alipay"];

/** A sample receipt for the payment sheet: weight × rate, paid on arrival. */
function Receipt({ price }: { price: number }) {
  const kg = 2.4;
  return (
    <div className="mx-auto w-full max-w-[400px] bg-paper p-7 text-ink [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),95%_100%,90%_calc(100%-10px),85%_100%,80%_calc(100%-10px),75%_100%,70%_calc(100%-10px),65%_100%,60%_calc(100%-10px),55%_100%,50%_calc(100%-10px),45%_100%,40%_calc(100%-10px),35%_100%,30%_calc(100%-10px),25%_100%,20%_calc(100%-10px),15%_100%,10%_calc(100%-10px),5%_100%,0_calc(100%-10px))]">
      <p className="font-display text-2xl font-bold tracking-tight">Mandarin Cargo</p>
      <dl className="t-body mt-6 space-y-2 tabular-nums">
        <div className="flex justify-between gap-4"><dt className="text-muted">XIY → TAS</dt><dd>{kg} kg</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">${price} × {kg}</dt><dd>${(price * kg).toFixed(2)}</dd></div>
      </dl>
      <div className="perf-x mt-5" style={{ "--perf": "var(--paper-2)" } as React.CSSProperties} aria-hidden />
      <ul className="t-lead mt-5 flex flex-wrap gap-x-5 gap-y-1 pb-5 font-medium">
        {PAYMENTS.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </div>
  );
}

/**
 * What the service takes on, as full-width sheets of coloured card, each
 * with its title band on top and its picture on the right.
 */
export default function Features({ price }: { price?: string | null }) {
  const t = useTranslations("page.sheets");
  const tHow = useTranslations("howItWorks");
  const tTrack = useTranslations("track");
  const address = tHow.raw("address") as string[];
  const stages = tTrack.raw("steps") as string[];
  const items = t.raw("items") as { title: string; desc: string }[];
  const perKg = Number((price ?? "").replace("$", "")) || site.pricePerKg;

  const sheets = [
    {
      tone: "bg-brand text-on-brand",
      pictureFrame: "",
      picture: (
        <div className="flex h-full flex-col justify-center gap-1 p-6 sm:p-10">
          {marketplaces.map((m) => (
            <p key={m} className="font-display text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-tight">{m}</p>
          ))}
        </div>
      ),
    },
    {
      tone: "bg-field text-on-field",
      detail: (
        <p lang="zh" className="t-body max-w-[30ch] text-on-field-2">{address.slice(1).join(" ")}</p>
      ),
      picture: <Image src="/warehouse-china-1.webp" alt={items[1]?.title ?? ""} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />,
    },
    {
      tone: "bg-paper text-ink",
      detail: (
        <ol className="space-y-1">
          {stages.map((stage, n) => (
            <li key={stage} className={`font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-semibold tracking-tight ${n < 3 ? "text-ink" : "text-muted"}`}>
              {stage}
            </li>
          ))}
        </ol>
      ),
      picture: (
        <div className="relative h-full bg-field">
          <Image src="/hero-app-light-v2.webp" alt={t("appAlt")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-2 sm:p-4" />
        </div>
      ),
    },
    {
      tone: "bg-paper-2 text-ink",
      picture: (
        <div className="flex h-full items-center bg-ground p-6 sm:p-10">
          <Receipt price={perKg} />
        </div>
      ),
    },
  ];

  return (
    <section id="features" aria-labelledby="features-title" className="bg-ground pt-24 lg:pt-40">
      <h2 id="features-title" className="r t-head px-5 pb-12 sm:px-8" style={{ "--i": 0 } as React.CSSProperties}>
        {t("h2")}
      </h2>
      <div>
        {sheets.map((sheet, i) => (
          <article
            key={i}
            className={`sheet lg:min-h-[64svh] ${sheet.tone}`}
          >
            <h3 className="flex h-[var(--sheet-band)] items-center px-5 font-display text-[clamp(1.25rem,2.6vw,2.5rem)] font-bold leading-none tracking-tight [grid-area:title] sm:px-8">
              {items[i]?.title}
            </h3>
            <div className={`relative w-full [grid-area:pic] lg:aspect-auto ${"pictureFrame" in sheet ? sheet.pictureFrame : "aspect-[4/3]"}`}>{sheet.picture}</div>
            <div className="flex flex-col gap-10 px-5 pb-10 pt-6 [grid-area:text] sm:px-8 lg:pb-14 lg:pt-2">
              <p className="max-w-[40ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-[1.45]">{items[i]?.desc}</p>
              {"detail" in sheet && sheet.detail ? <div className="lg:mt-auto">{sheet.detail}</div> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
