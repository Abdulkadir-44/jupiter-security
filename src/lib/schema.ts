import type { SiteContent } from "@/content/site.tr";
import { defaultLocale, getSiteContent, localePath, locales } from "@/lib/data";

/**
 * Google için yapılandırılmış veri (JSON-LD, schema.org).
 *
 * Tek bir @graph içinde üç düğüm:
 *  - İşletme (HomeAndConstructionBusiness): iki dilde AYNI kimlik (@id) ve AYNI resmi ad.
 *    Ad/telefon/bölge her yerde birebir aynı olmalı (NAP tutarlılığı: yerel SEO için önemli).
 *  - WebSite: sitenin kendisi (diller, yayıncı).
 *  - WebPage: bu sayfa (bu dil).
 *
 * Bilerek EKLENMEYENLER:
 *  - Review / AggregateRating: sitedeki yorumlar yer tutucu; ayrıca Google işletmenin kendi
 *    sitesindeki yorumları yıldız olarak göstermiyor (yıldızlar Google İşletme Profili'nden gelir).
 *  - priceRange, tam adres, koordinat: gerçek bilgi gelince (gezici işletme: adres gizli kalır).
 */
export function buildJsonLd(s: SiteContent, site: URL, canonical: URL) {
  const origin = new URL("/", site).href;
  const businessId = `${origin}#business`;
  const websiteId = `${origin}#website`;
  const tr = getSiteContent(defaultLocale); // resmi ad her dilde Türkçe ad

  const business = {
    "@type": "HomeAndConstructionBusiness",
    "@id": businessId,
    name: tr.brand.fullName,
    ...(s.brand.fullName !== tr.brand.fullName && { alternateName: s.brand.fullName }),
    description: s.seo.description,
    slogan: s.hero.title,
    url: new URL(localePath(defaultLocale), site).href,
    telephone: s.contact.phoneE164,
    image: new URL("/og.jpg", site).href,
    logo: new URL("/apple-touch-icon.png", site).href,
    address: {
      "@type": "PostalAddress",
      addressLocality: "İskenderun",
      addressRegion: "Hatay",
      addressCountry: "TR",
    },
    areaServed: s.contact.serviceAreas.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Hatay" },
    })),
    openingHoursSpecification: s.contact.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${DAYS[d]}`),
      opens: h.opens,
      closes: h.closes,
    })),
    knowsLanguage: locales.map((l) => getSiteContent(l).locale.numberLocale),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: s.contact.phoneE164,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: locales.map((l) => getSiteContent(l).locale.name),
    },
    // Hizmetler: kullanım alanları (ev, dükkan, fabrika, site) + hazır paketler
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.useCases.title,
      itemListElement: [
        ...s.useCases.items.map((it) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: it.title, description: it.text, areaServed: "Hatay" },
        })),
        ...s.packages.items.map((p) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${p.name} (${p.cameras})`,
            description: p.features.join(", "),
          },
        })),
      ],
    },
    sameAs: [s.contact.instagram.url, ...(s.contact.facebook ? [s.contact.facebook.url] : [])],
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: origin,
    name: tr.brand.fullName,
    inLanguage: locales.map((l) => getSiteContent(l).locale.numberLocale),
    publisher: { "@id": businessId },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${canonical.href}#webpage`,
    url: canonical.href,
    name: s.seo.title,
    description: s.seo.description,
    inLanguage: s.locale.numberLocale,
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    primaryImageOfPage: { "@type": "ImageObject", url: new URL(s.seo.ogImage, site).href, width: 1200, height: 630 },
  };

  return { "@context": "https://schema.org", "@graph": [business, website, webpage] };
}

const DAYS = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
} as const;
