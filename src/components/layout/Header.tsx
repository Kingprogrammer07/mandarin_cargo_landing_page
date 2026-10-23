"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const navLinks = [
  { key: "how", href: "#how-it-works" },
  { key: "track", href: "#track" },
  { key: "pricing", href: "#pricing" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
];

export default function Header() {
  const t = useTranslations("page.nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 h-16 bg-ground"
      >
        <div className="mx-auto flex h-full max-w-none px-4 min-[360px]:px-5 sm:px-8 flex items-center gap-4 lg:gap-8">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" prefetch={false} aria-label="Mandarin Cargo" className="flex items-center">
              <Logo className="h-8 w-auto sm:h-9" />
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-9">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="link whitespace-nowrap text-[0.9375rem] font-medium decoration-transparent hover:decoration-current"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand ml-2 min-h-11 px-5 text-[0.9375rem]"
            >
              {t("cta")}
            </a>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand min-h-11 whitespace-nowrap px-3 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem]"
            >
              {t("cta")}
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t("menu")}
              aria-expanded={mobileOpen}
              className="-mr-1.5 flex h-11 w-11 items-center justify-center text-ink"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: always mounted so CSS can animate both ways; `inert`
          keeps it out of the tab order and screen readers while closed. */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/40 transition-[opacity,visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        inert={!mobileOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(18rem,85vw)] flex-col overflow-y-auto overscroll-contain bg-paper p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
              <div className="flex justify-between items-center mb-6">
                <LanguageSwitcher />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label={t("close")}
                  className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={`/${locale}${link.href}`}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="py-3 font-display text-2xl font-bold tracking-tight text-ink"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>

              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-brand mt-6 w-full"
              >
                {t("cta")}
              </a>
      </div>
    </>
  );
}
