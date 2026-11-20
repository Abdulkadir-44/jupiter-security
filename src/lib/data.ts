import { site, type SiteContent } from "@/content/site.tr";

/**
 * Sitenin tek veri kaynağı.
 * Şimdilik içerik dosyasından okur. Admin paneli eklendiğinde burası
 * Cloudflare D1'den okuyacak şekilde değiştirilecek; bileşenler etkilenmez.
 */
export function getSiteContent(): SiteContent {
  return site;
}

export function telHref(c: SiteContent["contact"]): string {
  return `tel:${c.phoneE164}`;
}

export function whatsappHref(c: SiteContent["contact"], message?: string): string {
  const text = encodeURIComponent(message ?? c.whatsappMessage);
  return `https://wa.me/${c.whatsapp}?text=${text}`;
}
