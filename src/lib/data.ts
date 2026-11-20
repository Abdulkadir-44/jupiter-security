import type { SiteContent } from "@/content/site.tr";
import { site as tr } from "@/content/site.tr";
import { site as en } from "@/content/site.en";

/** Sitenin dilleri. İlki varsayılan dil (adres öneki yok: "/"), diğerleri "/en/" gibi önekli. */
export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

const content: Record<Locale, SiteContent> = { tr, en };

function toLocale(locale?: string): Locale {
  return (locales as readonly string[]).includes(locale ?? "") ? (locale as Locale) : defaultLocale;
}

/**
 * Sitenin tek veri kaynağı. Bileşenler `getSiteContent(Astro.currentLocale)` ile çağırır.
 * Şimdilik içerik dosyalarından okur. Admin paneli eklendiğinde burası
 * Cloudflare D1'den okuyacak şekilde değiştirilecek; bileşenler etkilenmez.
 */
export function getSiteContent(locale?: string): SiteContent {
  return content[toLocale(locale)];
}

/** Bir dilin ana sayfa yolu: "tr" → "/", "en" → "/en/" */
export function localePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}/`;
}

/** Şu anki dil dışındaki diller (dil değiştirici için) */
export function otherLocales(locale?: string): Locale[] {
  const current = toLocale(locale);
  return locales.filter((l) => l !== current);
}

// Link ve şablon yardımcıları ayrı dosyada (React island'ları içerik dosyalarını tarayıcıya taşımasın diye)
export { fill, telHref, whatsappHref } from "@/lib/links";
