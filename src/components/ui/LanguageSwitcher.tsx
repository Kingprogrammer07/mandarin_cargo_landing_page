"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Globe, ChevronDown, Check } from "lucide-react";
import { usePathname, Link } from "@/i18n/navigation";

const locales = [
  { code: "uz", label: "UZ", name: "O‘zbekcha" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "cn", label: "CN", name: "中文" },
  { code: "en", label: "EN", name: "English" },
];

interface LanguageSwitcherProps {
  dark?: boolean;
}

export default function LanguageSwitcher({ dark = false }: LanguageSwitcherProps) {
  const pathname = usePathname(); // locale-stripped path (next-intl)
  const currentLocale = useLocale();
  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
          dark
            ? "text-slate-300 hover:text-white hover:bg-white/10"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        <Globe size={16} className="shrink-0" />
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute right-0 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50 ${
            dark ? "bottom-full mb-2 origin-bottom-right" : "mt-2 origin-top-right"
          }`}
        >
          {locales.map((locale) => {
            const isActive = currentLocale === locale.code;
            return (
              <li key={locale.code} role="option" aria-selected={isActive}>
                <Link
                  href={pathname}
                  locale={locale.code}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2 text-sm transition-colors ${
                    isActive
                      ? "font-semibold text-orange-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-7 text-xs font-semibold text-slate-400">{locale.label}</span>
                    <span>{locale.name}</span>
                  </span>
                  {isActive && <Check size={15} className="shrink-0 text-orange-600" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
