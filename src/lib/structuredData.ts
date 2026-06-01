import { site } from "@/config/site";

const SITE_URL = "https://mandarincargo.uz";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.company,
    alternateName: ["Cargo Mandarin", "Mandarin Cargo Uzbekistan", "Mandarin Cargo Tashkent"],
    url: SITE_URL,
    logo: `${SITE_URL}/mandarin-icon.png`,
    image: `${SITE_URL}/og-image.png`,
    description: "Air cargo delivery from China to Uzbekistan. From $9.5/kg.",
    sameAs: [site.instagram, site.facebook, site.telegram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneRaw,
      contactType: "customer service",
      areaServed: "UZ",
      availableLanguage: ["Uzbek", "Russian", "Chinese", "English"],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    alternateName: ["Cargo Mandarin", "Mandarin Cargo Uzbekistan"],
    image: `${SITE_URL}/og-image.png`,
    url: SITE_URL,
    telephone: site.phoneRaw,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Arnasoy ko'chasi 5A",
      addressLocality: "Toshkent",
      addressRegion: "Chilonzor",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "18:30",
    },
    priceRange: "$$",
    // Rating nested here (not standalone) so Google associates stars with the business
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      reviewCount: "1200",
    },
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${site.name} Air Cargo`,
    provider: {
      "@type": "Organization",
      name: site.name,
    },
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    description: "Air cargo delivery from China to Uzbekistan",
    offers: {
      "@type": "Offer",
      price: "9.50",
      priceCurrency: "USD",
      unitText: "kg",
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/${locale}`,
      },
    ],
  };
}
