import { useTranslations } from "next-intl";
import { Phone, MapPin, Clock, Instagram, Facebook, Send } from "lucide-react";
import { site } from "@/config/site";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const QUICK_LINKS = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "calculator", href: "#calculator" },
  { key: "pricing", href: "#pricing" },
  { key: "reviews", href: "#reviews" },
  { key: "faq", href: "#faq" },
];

const SOCIALS = [
  { Icon: Send, href: site.channelUrl, label: "Telegram" },
  { Icon: Instagram, href: site.instagram, label: "Instagram" },
  { Icon: Facebook, href: site.facebook, label: "Facebook" },
];

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
          <div>
            <Logo className="h-9 w-auto" />
            <p className="mt-3 text-sm text-muted">{t("footer.tagline")}</p>
            <div className="-ml-2.5 mt-4 flex items-center">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-ink"
                >
                  <Icon size={19} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t("footer.siteTitle")}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t("footer.siteTitle")}</h2>
            <ul className="mt-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="inline-flex min-h-9 items-center text-sm text-ink hover:text-brand-text">
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t("footer.contactTitle")}</h2>
            <a
              href={`tel:${site.phoneRaw}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-lg font-semibold text-ink hover:text-brand-text"
            >
              <Phone size={18} aria-hidden />
              {site.phone}
            </a>
            <p className="mt-1 flex items-start gap-2 text-sm text-muted">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />
              {site.address}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted">
              <Clock size={16} className="mt-0.5 shrink-0" aria-hidden />
              {site.hours}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t("footer.legalTitle")}</h2>
            <p className="mt-3 text-sm text-ink">{t("footer.company")}</p>
            <p className="mt-1 text-sm text-muted">{t("footer.license")}</p>
            <div className="mt-4 -ml-3">
              <LanguageSwitcher openUp />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">{t("footer.copyright", { year: String(year) })}</p>
          <a
            href={site.developer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-ink"
          >
            {t("footer.developer")} @java_strong
          </a>
        </div>
      </div>
    </footer>
  );
}
