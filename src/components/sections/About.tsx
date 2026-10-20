import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { site } from "@/config/site";

const SCALLOPS =
  "polygon(" +
  Array.from({ length: 33 }, (_, i) => `${(i / 32) * 100}% ${i % 2 === 0 ? "100%" : "calc(100% - 10px)"}`)
    .reverse()
    .concat(["0 0", "100% 0"])
    .reverse()
    .join(",") +
  ")";

/**
 * Who we are, written as a letter on a sheet whose bottom edge is cut in
 * scallops, with the office address on a tear-off strip below.
 */
export default function About() {
  const t = useTranslations("page.about");
  const paragraphs = t.raw("paragraphs") as string[];
  const mapUrl = `https://yandex.uz/maps/?pt=${site.geo.lng},${site.geo.lat}&z=17&l=map`;

  return (
    <section id="about" aria-labelledby="about-title" className="bg-ground px-5 py-24 sm:px-8 lg:pb-40 lg:pt-28">
      <div className="mx-auto max-w-[640px]">
        <article className="r bg-paper px-6 pb-14 pt-10 sm:px-14 sm:pt-14" style={{ "--i": 0, clipPath: SCALLOPS } as React.CSSProperties}>
          <div className="flex items-center gap-4">
            <Image src="/mandarin-icon.webp" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
            <h2 id="about-title" className="font-display text-2xl font-bold tracking-tight">{t("h2")}</h2>
          </div>
          <div className="t-body mt-7 space-y-5">
            {paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p className="mt-8 text-xl font-semibold">{t("signoff")}</p>
          <p className="t-small text-muted">{t("role")}</p>
        </article>

        <div className="perf-x mx-3 mt-3" style={{ "--perf": "var(--paper)" } as React.CSSProperties} aria-hidden />

        <div className="r mt-3 flex flex-col gap-4 bg-paper p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="min-w-0">
            <p className="font-medium">{site.address}</p>
            <p className="t-small text-muted">{t("hours")}</p>
          </div>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink shrink-0">
            <MapPin size={18} aria-hidden />
            {t("route")}
          </a>
        </div>
      </div>
    </section>
  );
}
