import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, MapPin, Navigation } from "lucide-react";
import { site } from "@/config/site";
import SectionHeader from "@/components/ui/SectionHeader";

const FACT_COUNT = 4;

const IMAGES = [
  { src: "/warehouse-china-1.jpg", alt: "Warehouse China", className: "col-span-2" },
  { src: "/warehouse-china-2.jpg", alt: "Sorting station" },
  { src: "/office-tashkent-1.jpg", alt: "Tashkent office" },
];

export default function About() {
  const t = useTranslations("about");
  const facts = Array.from({ length: FACT_COUNT }, (_, i) => t(`facts.${i}`));

  return (
    <section id="about" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} centered={false} />
            <p className="mt-6 max-w-[36rem] text-base leading-relaxed text-muted">{t("intro")}</p>
            <ul className="mt-6 space-y-3">
              {facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                  <Check size={16} className="mt-1 shrink-0 text-brand-text" aria-hidden />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {IMAGES.map((img) => (
              <div
                key={img.src}
                className={`relative aspect-[4/3] overflow-hidden rounded-ui-md bg-surface-2 ${img.className ?? ""}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-ui-lg border border-border">
          <iframe
            src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`}
            title={t("mapOverlay")}
            className="block h-72 w-full border-0 lg:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex flex-col gap-3 border-t border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm font-medium text-ink">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-text" aria-hidden />
              {t("mapOverlay")}
            </p>
            <a
              href={`https://3.redirect.appmetrica.yandex.com/route?end-lat=${site.geo.lat}&end-lon=${site.geo.lng}&appmetrica_tracking_id=1178268795219780156`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-surface transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              <Navigation size={16} aria-hidden />
              {t("routeCta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
