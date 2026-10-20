"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const navLinks = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "calculator", href: "#calculator" },
  { key: "pricing", href: "#pricing" },
  { key: "reviews", href: "#reviews" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
];

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 10);
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
        className={`sticky top-0 z-50 h-16 transition-all duration-200 ${
          scrolled
            ? "border-b border-border bg-canvas/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center gap-4 lg:gap-8">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" prefetch={false} aria-label="Mandarin Cargo" className="flex items-center">
              <Logo className="h-9 w-auto" />
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="whitespace-nowrap text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <span className="h-5 w-px bg-border" aria-hidden />
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-on-brand transition-colors duration-150 hover:bg-brand-hover active:scale-[0.98]"
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
              className="inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-on-brand transition-colors duration-150 hover:bg-brand-hover active:scale-[0.98]"
            >
              {t("cta")}
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
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
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!mobileOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(18rem,85vw)] flex-col overflow-y-auto overscroll-contain bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-card transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
              <div className="flex justify-between items-center mb-6">
                <LanguageSwitcher />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
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
                    className="border-b border-border py-3.5 text-lg font-medium text-ink"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>

              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand font-semibold text-on-brand"
              >
                {t("cta")}
              </a>
      </div>
    </>
  );
}
