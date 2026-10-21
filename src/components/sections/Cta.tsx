import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";

/** The last screen: a lit panel with the one action, and a QR for desktop visitors. */
export default function Cta() {
  const t = useTranslations("page.cta");

  return (
    <section id="start" aria-labelledby="cta-title" className="px-5 pb-20 pt-10 sm:px-8 lg:pb-32">
      <div className="r relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-line-2 bg-surface" style={{ "--i": 0 } as React.CSSProperties}>
        <div aria-hidden className="grid-lines absolute inset-0" />
        <div aria-hidden className="absolute -bottom-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-rgb)/0.35),transparent)]" />
        <div className="relative grid gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-16">
          <div>
            <h2 id="cta-title" className="t-head ink-fade">{t("h2")}</h2>
            <p className="t-lead mt-5 max-w-[40ch] text-fg-2">{t("lead")}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand whitespace-normal text-center">
                {t("button")}
                <ArrowRight size={18} aria-hidden />
              </a>
              <a href={site.adminContact} target="_blank" rel="noopener noreferrer" className="btn btn-ghost whitespace-normal text-center">
                {t("admin")}
              </a>
            </div>
          </div>
          <div className="hidden flex-col items-center gap-3 lg:flex">
            <div className="rounded-2xl bg-white p-3 shadow-[0_20px_60px_-20px_rgb(var(--brand-rgb)/0.6)]">
              <Image src="/qr-bot.png" alt="" width={150} height={150} className="h-[150px] w-[150px]" />
            </div>
            <p className="t-small max-w-[18ch] text-center text-fg-3">{t("qr")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
