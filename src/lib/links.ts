import type { SiteContent } from "@/content/site.tr";

/** Şablondaki {anahtar} yerlerini doldurur: fill("Merhaba {name}", { name: "Ali" }) */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);
}

export function telHref(c: SiteContent["contact"]): string {
  return `tel:${c.phoneE164}`;
}

export function whatsappHref(c: SiteContent["contact"], message?: string): string {
  const text = encodeURIComponent(message ?? c.whatsappMessage);
  return `https://wa.me/${c.whatsapp}?text=${text}`;
}
