import Image from "next/image";
import { useTranslations } from "next-intl";
import { marketplaces, site } from "@/config/site";
import Spotlight from "@/components/ui/Spotlight";
import Tilt from "@/components/ui/Tilt";

const PAYMENTS = ["Click", "Payme", "Uzum", "Uzcard", "Humo", "NBU", "Alipay"];

function CardText({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative">
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
      <p className="t-body mt-2 max-w-[42ch] text-fg-2">{desc}</p>
    </div>
  );
}

/**
 * What the service takes on, as a bento of lit cards: the warehouse photo
 * wide, the app tall, shops drifting past, and a sample bill.
 */
export default function Features({ price }: { price?: string | null }) {
  const t = useTranslations("page.sheets");
  const tHow = useTranslations("howItWorks");
  const items = t.raw("items") as { title: string; desc: string }[];
  const address = tHow.raw("address") as string[];
  const perKg = Number((price ?? "").replace("$", "")) || site.pricePerKg;
  const sampleKg = 2.4;

  return (
    <section id="features" aria-labelledby="features-title" className="px-5 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="features-title" className="r t-head max-w-[16ch]" style={{ "--i": 0 } as React.CSSProperties}>{t("h2")}</h2>

        <Spotlight className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {/* Warehouse: photo, wide. */}
          <article data-spot className="r card overflow-hidden lg:col-span-2" style={{ "--i": 1 } as React.CSSProperties}>
            <div className="relative aspect-[16/9] w-full lg:aspect-[2/1]">
              <Image src="/warehouse-china-1.webp" alt={items[1]?.title ?? ""} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover opacity-80" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
            </div>
            <div className="-mt-16 p-6 sm:p-8">
              <CardText title={items[1]?.title ?? ""} desc={items[1]?.desc ?? ""} />
              <p lang="zh" className="t-small relative mt-4 text-fg-3">{address.slice(1).join(" ")}</p>
            </div>
          </article>

          {/* Tracking: the app, tall. */}
          <article data-spot className="r card flex flex-col overflow-hidden lg:row-span-2" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="p-6 sm:p-8">
              <CardText title={items[2]?.title ?? ""} desc={items[2]?.desc ?? ""} />
            </div>
            <div className="relative mt-auto flex h-[420px] justify-center overflow-hidden sm:h-[480px] lg:h-auto lg:flex-1">
              <div aria-hidden className="absolute bottom-0 left-1/2 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
              {/* Position lives on the wrapper: Tilt writes its own inline
                  transform, which would otherwise wipe out the centring. */}
              <div className="absolute -top-[6%] left-[54%] w-[125%] max-w-[520px] -translate-x-1/2 lg:-top-[18%] lg:w-[150%]">
                <Tilt max={6} className="duration-500">
                  <Image src="/hero-app-dark-v2.webp" alt={t("appAlt")} width={1696} height={2528} sizes="560px" className="h-auto w-full" />
                </Tilt>
              </div>
            </div>
          </article>

          {/* Shops: names drifting past. */}
          <article data-spot className="r card flex flex-col justify-between gap-8 overflow-hidden p-6 sm:p-8" style={{ "--i": 3 } as React.CSSProperties}>
            <CardText title={items[0]?.title ?? ""} desc={items[0]?.desc ?? ""} />
            <div className="marquee-wrap fade-x -mx-6 overflow-hidden sm:-mx-8">
              <ul className="marquee gap-2 px-6">
                {[...marketplaces, ...marketplaces].map((m, i) => (
                  <li
                    key={`${m}-${i}`}
                    aria-hidden={i >= marketplaces.length || undefined}
                    className={`shrink-0 rounded-full border border-line px-4 py-2 text-[0.9375rem] text-fg-2 ${i >= marketplaces.length ? "motion-reduce:hidden" : ""}`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Payment: a sample bill. */}
          <article data-spot className="r card flex flex-col justify-between gap-8 p-6 sm:p-8" style={{ "--i": 4 } as React.CSSProperties}>
            <CardText title={items[3]?.title ?? ""} desc={items[3]?.desc ?? ""} />
            <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
              <dl className="t-small space-y-1.5 tabular-nums">
                <div className="flex justify-between gap-4"><dt className="text-fg-3">{sampleKg} kg × ${perKg}</dt><dd className="font-medium">${(perKg * sampleKg).toFixed(2)}</dd></div>
              </dl>
              <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                {PAYMENTS.map((p) => (
                  <li key={p} className="rounded-md bg-white/5 px-2 py-1 text-xs text-fg-2">{p}</li>
                ))}
              </ul>
            </div>
          </article>
        </Spotlight>
      </div>
    </section>
  );
}
