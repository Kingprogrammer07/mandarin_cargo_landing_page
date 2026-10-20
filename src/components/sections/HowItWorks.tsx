import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollRail from "@/components/ui/ScrollRail";

const STEP_COUNT = 5;

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
    title: t(`steps.${i}.title`),
    desc: t(`steps.${i}.desc`),
  }));

  return (
    <section id="how-it-works" className="border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} centered={false} />
        </div>

        <ol className="relative">
          <ScrollRail className="bottom-6 left-[19px] top-6" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-6">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-sm font-bold tabular-nums text-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-1.5">
                <h3 className="text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-muted">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
