import Image from "next/image";
import { useTranslations } from "next-intl";
import { site } from "@/config/site";
import Logo from "@/components/Logo";

/** Twelve half-round scallops along the top edge of the postcard. */
function scallopPath(count: number) {
  const w = 100 / count;
  let d = "M0 8";
  for (let i = 0; i < count; i++) d += ` a${w / 2} 8 0 0 1 ${w} 0`;
  return `${d} V9 H0 Z`;
}

/**
 * The back of the card: a sign-off on the left, the address block on the
 * right with a stamp above it, and the imprint along the bottom.
 */
export default function Footer() {
  const t = useTranslations("page.footer");
  const year = new Date().getFullYear();

  const lines = [
    { href: `tel:${site.phoneRaw}`, label: site.phone },
    { href: site.channelUrl, label: "Telegram: @mandarin_cargo", external: true },
    { href: site.instagram, label: "Instagram: mandarin_cargo", external: true },
    { href: `mailto:${site.email}`, label: site.email },
  ];

  return (
    <footer id="contact" className="bg-ground pt-24 sm:px-8 sm:pb-8 lg:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <svg aria-hidden viewBox="0 0 100 9" preserveAspectRatio="none" className="block h-4 w-full text-paper sm:h-5">
          <path d={scallopPath(6)} fill="currentColor" className="sm:hidden" />
          <path d={scallopPath(12)} fill="currentColor" className="hidden sm:block" />
        </svg>
        <div className="grid gap-12 bg-paper px-5 pb-8 pt-8 sm:px-12 sm:pt-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Logo className="h-10 w-auto" />
            <p className="t-head mt-8">{t("signoff")}</p>
            <p className="t-body mt-4 max-w-[36ch]">{t("message")}</p>
          </div>
          <div className="relative">
            <div className="absolute right-0 top-0 w-16 bg-paper-2 p-1.5 sm:w-[88px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src="/warehouse-china-2.webp" alt={t("stampAlt")} fill sizes="88px" className="object-cover" />
              </div>
            </div>
            <ul className="space-y-3 pr-20 pt-2 text-[1.0625rem] sm:pr-28 sm:text-lg lg:pt-24">
              <li className="text-muted">{site.address}</li>
              {lines.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="link inline-flex min-h-11 items-center break-all"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="t-small text-center text-muted lg:col-span-2">
            {t("imprint", { year })}.{" "}
            <a href={site.developer} target="_blank" rel="noopener noreferrer" className="link">{t("developer")}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
