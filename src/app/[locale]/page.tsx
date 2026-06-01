import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import HowItWorks from "@/components/sections/HowItWorks";
import TrackOrder from "@/components/sections/TrackOrder";
import Calculator from "@/components/sections/Calculator";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import Reviews from "@/components/sections/Reviews";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import FinalCta from "@/components/sections/FinalCta";
import Reveal from "@/components/ui/Reveal";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Map next-intl locales → BCP-47 for og:locale
const OG_LOCALE: Record<string, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  cn: "zh_CN",
  en: "en_US",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t("seo.title");
  const description = t("seo.description");

  return {
    title,
    description,
    keywords: t.raw("seo.keywords"),
    metadataBase: new URL("https://mandarincargo.uz"),
    openGraph: {
      title,
      description,
      url: `https://mandarincargo.uz/${locale}`,
      siteName: site.name,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mandarin Cargo — Xitoydan O'zbekistonga avia cargo" }],
      locale: OG_LOCALE[locale] ?? "uz_UZ",
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== (OG_LOCALE[locale] ?? "uz_UZ")),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://mandarincargo.uz/${locale}`,
      languages: {
        uz: "https://mandarincargo.uz/uz",
        ru: "https://mandarincargo.uz/ru",
        "zh-CN": "https://mandarincargo.uz/cn",
        en: "https://mandarincargo.uz/en",
        "x-default": "https://mandarincargo.uz/uz",
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    q: t(`faq.items.${i}.q`),
    // t.markup resolves the <bot> tag to plain text for JSON-LD
    a: t.markup(`faq.items.${i}.a`, { bot: (chunks) => chunks }),
  }));

  const faqLd = faqJsonLd(faqItems);
  const breadcrumbLd = breadcrumbJsonLd(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Hero />
      <Reveal><TrustBar /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><TrackOrder /></Reveal>
      <Reveal><Calculator /></Reveal>
      <Reveal><Features /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><Reviews /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Reveal><FinalCta /></Reveal>
    </>
  );
}
