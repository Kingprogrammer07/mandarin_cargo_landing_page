import { useTranslations } from "next-intl";
import { BadgeDollarSign, Plane, MapPin, Warehouse, CreditCard, MessageCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Spotlight from "@/components/ui/Spotlight";

const ICONS = [BadgeDollarSign, Plane, MapPin, Warehouse, CreditCard, MessageCircle];

/** Live replacement for the delivery card's text; absent keeps the built-in copy. */
export interface FeaturesLive {
  deliveryDesc?: string;
}

export default function Features({ live }: { live?: FeaturesLive }) {
  const t = useTranslations("features");
  const items = ICONS.map((Icon, i) => ({
    Icon,
    title: t(`items.${i}.title`),
    desc: i === 1 && live?.deliveryDesc ? live.deliveryDesc : t(`items.${i}.desc`),
  }));

  return (
    <section id="features" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} centered={false} />

        <Spotlight className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-ui-lg border border-border bg-border sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {items.map(({ Icon, title, desc }) => (
            <article key={title} data-spot className="bg-surface p-6 lg:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-ui-md bg-brand-soft text-brand-text">
                <Icon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{desc}</p>
            </article>
          ))}
        </Spotlight>
      </div>
    </section>
  );
}
