import Image from "next/image";
import { useTranslations } from "next-intl";
import { Instagram, Facebook, Send } from "lucide-react";
import { site } from "@/config/site";

const SOCIALS = [
  { Icon: Send, href: site.telegram, label: "Telegram" },
  { Icon: Instagram, href: site.instagram, label: "Instagram" },
  { Icon: Facebook, href: site.facebook, label: "Facebook" },
];

export default function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section id="start" className="bg-canvas px-4 pb-20 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-ui-lg bg-ink px-6 pt-12 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-6 lg:px-16 lg:pt-0">
        <div className="lg:py-20">
          <h2 className="text-[1.875rem] font-extrabold leading-[1.1] tracking-tight text-white text-balance lg:text-[2.75rem]">
            {t("h2")}
          </h2>
          <p className="mt-4 max-w-[32rem] text-lg leading-relaxed text-white/70">{t("subtitle")}</p>

          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row">
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-base font-semibold text-on-brand transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={site.adminContact}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-base font-semibold text-white transition-colors hover:border-white/50 active:scale-[0.98]"
            >
              {t("ctaSecondary")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon size={18} aria-hidden />
                </a>
              ))}
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <Image src="/qr-bot.png" alt="Telegram bot QR code" width={64} height={64} className="h-16 w-16 rounded-ui-sm bg-white p-1" />
              <p className="max-w-[10rem] text-sm leading-snug text-white/60">{t("qrCaption")}</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto -mb-24 w-full max-w-[300px] sm:max-w-[340px] lg:-mb-32 lg:mt-12 lg:max-w-[380px]">
          <Image
            src="/hero-app-light-v2.webp"
            alt={t("appAlt")}
            width={420}
            height={626}
            sizes="(max-width: 1024px) 300px, 380px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
