import Image from "next/image";
import { useTranslations } from "next-intl";
import { site } from "@/config/site";

/**
 * The invitation to act is a reply card lying on the orange field, tilted,
 * its bottom edge cropped by the section.
 */
export default function Cta() {
  const t = useTranslations("page.cta");

  return (
    <section id="start" aria-labelledby="cta-title" className="overflow-hidden bg-brand text-on-brand">
      <div className="grid gap-12 px-5 pt-24 sm:px-8 lg:min-h-[80svh] lg:grid-cols-12 lg:gap-8 lg:pt-32">
        <p className="r t-lead max-w-[22ch] self-end lg:col-span-4 lg:mb-16" style={{ "--i": 0 } as React.CSSProperties}>
          {t("lead")}
        </p>
        <div className="r -mb-16 self-end lg:col-span-7 lg:col-start-6" style={{ "--i": 1 } as React.CSSProperties}>
          <article className="mx-auto w-[94%] rotate-1 bg-paper p-5 pb-24 text-center text-ink sm:p-12 sm:pb-28 lg:w-full lg:rotate-2">
            <h2 id="cta-title" className="t-head">{t("h2")}</h2>
            <p className="t-body mt-4">{t("text")}</p>
            <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-8 w-full">
              {t("button")}
            </a>
            <a href={site.adminContact} target="_blank" rel="noopener noreferrer" className="link t-body mt-5 inline-flex min-h-11 items-center">
              {t("admin")}
            </a>
            <div className="mt-6 hidden items-center justify-center gap-4 sm:flex">
              <Image src="/qr-bot.png" alt="" width={96} height={96} className="h-24 w-24" />
              <p className="t-small max-w-[18ch] text-left text-muted">{t("qr")}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
