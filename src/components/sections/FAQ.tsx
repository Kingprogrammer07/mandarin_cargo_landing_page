import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { site } from "@/config/site";
import SectionHeader from "@/components/ui/SectionHeader";

const ITEM_COUNT = 6;

/**
 * Native <details>: every answer is in the HTML (search engines and Ctrl+F
 * find it), keyboard and screen readers work without any script.
 */
export default function FAQ() {
  const t = useTranslations("faq");

  const bot = (chunks: ReactNode) => (
    <a
      href={site.botUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-brand-text underline decoration-brand/40 underline-offset-2"
    >
      {chunks}
    </a>
  );

  const items = Array.from({ length: ITEM_COUNT }, (_, i) => ({
    q: t(`items.${i}.q`),
    a: t.rich(`items.${i}.a`, { bot }),
  }));

  return (
    <section id="faq" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} centered={false} />
        </div>

        <div className="border-t border-border">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-border">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold text-ink">{item.q}</span>
                <Plus
                  size={20}
                  aria-hidden
                  className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-[40rem] pb-6 pr-8 text-[0.9375rem] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
