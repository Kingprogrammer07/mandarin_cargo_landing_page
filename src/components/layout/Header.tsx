"use client";

import { useEffect, useState } from "react";
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

/**
 * Floats over the hero with no background; once the page scrolls it turns
 * into a blurred glass bar with a hairline under it.
 */
export default function Header() {
  const t = useTranslations("page.nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    const el = document.getElementById(href.replace("#", ""));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || mobileOpen
            ? "border-line bg-night/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-4 px-4 min-[360px]:px-5 sm:px-8 lg:gap-8">
          <Link href="/" prefetch={false} className="flex shrink-0 items-center">
            <span className="sr-only">Mandarin Cargo</span>
            <Logo className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] text-fg-2 transition-colors hover:bg-white/5 hover:text-fg"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand min-h-10 px-5 text-[0.9375rem]">
              {t("cta")}
            </a>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand min-h-10 px-3.5 text-sm min-[360px]:px-4 min-[360px]:text-[0.9375rem]"
            >
              {t("cta")}
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t("menu")}
              aria-expanded={mobileOpen}
              className="-mr-1.5 flex h-11 w-11 items-center justify-center rounded-full text-fg active:bg-white/10"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: always mounted so CSS can animate both ways; `inert`
          keeps it out of the tab order and screen readers while closed. */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-[opacity,visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        inert={!mobileOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(20rem,88vw)] flex-col overflow-y-auto overscroll-contain border-l border-line bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={t("close")}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-fg active:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={`/${locale}${link.href}`}
              onClick={(e) => handleAnchor(e, link.href)}
              className="border-b border-line py-4 text-2xl font-medium tracking-tight text-fg"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="btn btn-brand mt-8 w-full">
          {t("cta")}
        </a>
      </div>
    </>
  );
}
