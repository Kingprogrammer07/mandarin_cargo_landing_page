import { useTranslations } from "next-intl";
import { site } from "@/config/site";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Footer() {
  const t = useTranslations("page.footer");
  const tn = useTranslations("page.nav");
  const year = new Date().getFullYear();

  const contacts = [
    { href: `tel:${site.phoneRaw}`, label: site.phone },
    { href: site.channelUrl, label: "Telegram", external: true },
    { href: site.instagram, label: "Instagram", external: true },
    { href: `mailto:${site.email}`, label: site.email },
  ];
  const nav = [
    { href: "#how-it-works", key: "how" },
    { href: "#track", key: "track" },
    { href: "#pricing", key: "pricing" },
    { href: "#faq", key: "faq" },
  ];

  return (
    <footer id="contact" className="border-t border-line px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo className="h-9 w-auto" />
          <p className="mt-6 text-2xl font-semibold tracking-tight">{t("signoff")}</p>
          <p className="t-body mt-2 max-w-[36ch] text-fg-2">{t("message")}</p>
          <p className="t-small mt-6 max-w-[36ch] text-fg-3">{site.address}</p>
        </div>
        <ul className="space-y-1 lg:col-span-4">
          {contacts.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-11 items-center break-all text-fg-2 transition-colors hover:text-fg"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <nav aria-label={tn("menu")} className="lg:col-span-3">
          <ul className="space-y-1">
            {nav.map((n) => (
              <li key={n.key}>
                <a href={n.href} className="inline-flex min-h-11 items-center text-fg-2 transition-colors hover:text-fg">{tn(n.key)}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small text-fg-3">
          {t("imprint", { year })}.{" "}
          <a href={site.developer} target="_blank" rel="noopener noreferrer" className="link">{t("developer")}</a>
        </p>
        <LanguageSwitcher openUp />
      </div>
    </footer>
  );
}
