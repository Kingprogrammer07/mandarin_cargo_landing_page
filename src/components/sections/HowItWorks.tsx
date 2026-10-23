import Image from "next/image";
import { useTranslations } from "next-intl";
import { marketplaces } from "@/config/site";
import StepRow from "@/components/sections/StepRow";

/** Varying empty space above each picture, so their top edges rise and fall. */
const DROP = ["sm:pt-24", "sm:pt-8", "sm:pt-32", "sm:pt-16", "sm:pt-28"];
const DROP_PHONE = ["pt-12", "pt-6", "pt-14", "pt-8", "pt-10"];

export default function HowItWorks() {
  const t = useTranslations("page.how");
  const tOld = useTranslations("howItWorks");
  const tSheets = useTranslations("page.sheets");
  const steps = t.raw("steps") as { title: string; desc: string }[];
  const address = tOld.raw("address") as string[];

  const pictures = [
    <div key="app" className="relative h-full w-full bg-field">
      <Image src="/hero-app-dark-v2.webp" alt={tSheets("appAlt")} fill sizes="300px" className="object-contain p-4" />
    </div>,
    <Image key="office" src="/office-tashkent-1.webp" alt="" fill sizes="300px" className="object-cover" />,
    <div key="code" className="flex h-full w-full flex-col justify-between bg-ground p-5">
      <div>
        <p className="font-display text-[clamp(2.5rem,13vw,3.75rem)] font-bold leading-none tracking-tight">{tOld("idCode")}</p>
        <p className="t-small mt-2 text-muted">{t("codeLabel")}</p>
      </div>
      <div>
        <p className="t-small text-muted">{t("addressLabel")}</p>
        <p lang="zh" className="t-small mt-1 font-medium leading-snug">{address.join(" ")}</p>
      </div>
    </div>,
    <div key="shops" className="flex h-full w-full flex-col justify-center gap-1 bg-brand p-5 text-on-brand">
      {marketplaces.slice(0, 6).map((m) => (
        <p key={m} className="font-display text-2xl font-bold tracking-tight">{m}</p>
      ))}
    </div>,
    <Image key="warehouse" src="/warehouse-china-2.webp" alt="" fill sizes="300px" className="object-cover" />,
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-paper py-24 lg:py-40">
      <StepRow
        prevLabel={t("prev")}
        nextLabel={t("next")}
        heading={
          <div className="r max-w-3xl" style={{ "--i": 0 } as React.CSSProperties}>
            <h2 id="how-title" className="t-head">{t("h2")}</h2>
            <p className="t-body mt-4 max-w-[44ch]">{t("lead")}</p>
          </div>
        }
      >
        {steps.map((s, i) => (
          <li key={s.title} className="r flex w-[72vw] shrink-0 flex-col sm:w-[300px]" style={{ "--i": i + 1 } as React.CSSProperties}>
            <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
            <p className="t-body mt-2 text-ink/80">{s.desc}</p>
            <div className={`${DROP_PHONE[i]} ${DROP[i]} mt-auto`}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">{pictures[i]}</div>
            </div>
          </li>
        ))}
      </StepRow>
    </section>
  );
}
