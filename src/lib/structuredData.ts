import { site } from "@/config/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: "https://webmandarin.uz",
    logo: "https://webmandarin.uz/logo.svg",
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
    image: "https://webmandarin.uz/og-image.png",
    url: "https://webmandarin.uz",
    telephone: site.phoneRaw,
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

export function aggregateRatingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Organization",
      name: site.name,
    },
    ratingValue: "4.9",
    bestRating: "5",
    reviewCount: "1200",
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
        item: `https://webmandarin.uz/${locale}`,
      },
    ],
  };
}
