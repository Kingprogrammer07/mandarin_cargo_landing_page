"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Sun/moon switch. The first visit follows the device (and keeps following
 * it if the device changes); once the visitor picks, the choice is saved.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("page.nav");
  // null until mounted: the server cannot know the theme, so render the
  // icon only on the client to avoid a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    // Syncs React with the theme the boot script already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);

    if (readStored()) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (readStored()) return;
      const next: Theme = media.matches ? "light" : "dark";
      apply(next);
      setTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the switch still works for this page view.
    }
  };

  const label = theme === "light" ? t("toDark") : t("toLight");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg-2 transition-colors hover:bg-tint/5 hover:text-fg active:scale-95 ${className}`}
    >
      {theme === null ? <span className="h-[18px] w-[18px]" aria-hidden /> : theme === "light" ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
    </button>
  );
}
