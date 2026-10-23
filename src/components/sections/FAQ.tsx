import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/config/site";

const ITEM_COUNT = 6;

/**
 * Questions and answers set as reading text, like the notes at the back of a
 * programme: the question is a run-in, the answer follows on the same line.
 * Everything is answered at a glance, no toggles.
 */
export default function FAQ() {
  const t = useTranslations("faq");
  const tp = useTranslations("page.faq");

  const bot = (chunks: ReactNode) => (
    <a href={site.botUrl} target="_blank" rel="noopener noreferrer" className="link font-medium">
      {chunks}
    </a>
  );

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper py-24 lg:py-40">
      <div className="grid gap-8 px-5 sm:px-8 lg:grid-cols-12">
        <h2 id="faq-title" className="r t-head lg:col-span-4" style={{ "--i": 0 } as React.CSSProperties}>{tp("h2")}</h2>
        <div className="t-body lg:col-span-8 lg:col-start-5 lg:columns-2 lg:gap-14">
          {Array.from({ length: ITEM_COUNT }, (_, i) => (
            <p key={i} className="r mb-5 break-inside-avoid sm:mb-6" style={{ "--i": i + 1 } as React.CSSProperties}>
              <strong className="font-semibold">{t(`items.${i}.q`)}</strong>{" "}
              {t.rich(`items.${i}.a`, { bot })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
