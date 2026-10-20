import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import { marketplaces } from "@/config/site";

/**
 * Endless strip of the shops clients buy from. Pure CSS: the list is drawn
 * twice and slides by exactly one copy. Under reduced motion it becomes a
 * still, wrapping row and the duplicate is hidden.
 */
export default function Stores() {
  const t = useTranslations("stores");

  const row = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={`flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 ${copy ? "marquee-copy" : ""}`}
    >
      {marketplaces.map((name) => (
        <li key={name} className="whitespace-nowrap text-2xl font-bold tracking-tight text-ink/70 sm:text-3xl">
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <section id="stores" className="overflow-hidden bg-canvas py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} subtitle={t("subtitle")} />
      </div>
      <div className="marquee mt-10 lg:mt-12">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
