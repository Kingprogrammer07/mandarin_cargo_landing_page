import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { site } from "@/config/site";

/** Who we are, beside the Tashkent office, with the address and a map link. */
export default function About() {
  const t = useTranslations("page.about");
  const paragraphs = t.raw("paragraphs") as string[];
  const mapUrl = `https://yandex.uz/maps/?pt=${site.geo.lng},${site.geo.lat}&z=17&l=map`;

  return (
    <section id="about" aria-labelledby="about-title" className="px-5 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="r" style={{ "--i": 0 } as React.CSSProperties}>
          <h2 id="about-title" className="t-head">{t("h2")}</h2>
          <div className="t-body mt-8 space-y-5 text-fg-2">
            {paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p className="mt-8 font-medium">{t("signoff")}</p>
          <p className="t-small text-fg-3">{t("role")}</p>
        </div>

        <div className="r card overflow-hidden" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="relative aspect-[3/2] w-full">
            <Image src="/office-tashkent-1.webp" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="photo object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface to-transparent to-50%" />
          </div>
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0">
              <p className="font-medium">{site.address}</p>
              <p className="t-small mt-1 text-fg-3">{t("hours")}</p>
            </div>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost shrink-0">
              <MapPin size={18} aria-hidden />
              {t("route")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
