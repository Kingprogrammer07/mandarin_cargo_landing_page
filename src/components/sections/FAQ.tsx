import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { site } from "@/config/site";

const ITEM_COUNT = 6;

/** Native <details>: keyboard and screen-reader friendly with no script. */
export default function FAQ() {
  const t = useTranslations("faq");
  const tp = useTranslations("page.faq");

  const bot = (chunks: ReactNode) => (
    <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="link text-fg">
      {chunks}
    </a>
  );

  return (
    <section id="faq" aria-labelledby="faq-title" className="px-5 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-12 lg:gap-8">
        <h2 id="faq-title" className="r t-head lg:col-span-4" style={{ "--i": 0 } as React.CSSProperties}>{tp("h2")}</h2>
        <div className="border-t border-line lg:col-span-8">
          {Array.from({ length: ITEM_COUNT }, (_, i) => (
            <details key={i} className="r group border-b border-line" style={{ "--i": i + 1 } as React.CSSProperties}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium tracking-tight transition-colors hover:text-brand-text sm:text-xl">
                {t(`items.${i}.q`)}
                <span aria-hidden className="chev flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-transform duration-300">
                  <Plus size={18} />
                </span>
              </summary>
              <p className="t-body max-w-[62ch] pb-6 pr-12 text-fg-2">{t.rich(`items.${i}.a`, { bot })}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
