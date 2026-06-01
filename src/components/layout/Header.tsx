"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
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
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center gap-4 lg:gap-8">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
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
                className="relative text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors duration-150 group whitespace-nowrap"
              >
                {t(link.key)}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-orange-600 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <span className="h-5 w-px bg-slate-200" aria-hidden />
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-700 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              {t("cta")}
            </a>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-3 ml-auto">
            <a
              href={site.botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition-all duration-150"
            >
              {t("cta")}
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-slate-700 p-1"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <LanguageSwitcher />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={24} className="text-slate-700" />
                </button>
              </div>

              <nav className="flex flex-col flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={`/${locale}${link.href}`}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-lg font-medium text-slate-700 py-3 border-b border-slate-100 hover:text-orange-600 transition-colors"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>

              <a
                href={site.botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full bg-orange-600 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-700 transition-all"
              >
                {t("cta")}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
