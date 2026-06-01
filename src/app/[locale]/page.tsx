import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import HowItWorks from "@/components/sections/HowItWorks";
import Calculator from "@/components/sections/Calculator";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import Reviews from "@/components/sections/Reviews";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import FinalCta from "@/components/sections/FinalCta";
import { faqJsonLd, aggregateRatingJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

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
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      locale,
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

  const faqItems = [
    { q: t("faq.items.0.q"), a: t("faq.items.0.a") },
    { q: t("faq.items.1.q"), a: t("faq.items.1.a") },
    { q: t("faq.items.2.q"), a: t("faq.items.2.a") },
    { q: t("faq.items.3.q"), a: t("faq.items.3.a") },
    { q: t("faq.items.4.q"), a: t("faq.items.4.a") },
    { q: t("faq.items.5.q"), a: t("faq.items.5.a") },
    { q: t("faq.items.6.q"), a: t("faq.items.6.a") },
  ];

  const faqLd = faqJsonLd(faqItems);
  const ratingLd = aggregateRatingJsonLd();
  const breadcrumbLd = breadcrumbJsonLd(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Calculator />
      <Features />
      <Pricing />
      <Reviews />
      <About />
      <FAQ />
      <FinalCta />
    </>
  );
}
