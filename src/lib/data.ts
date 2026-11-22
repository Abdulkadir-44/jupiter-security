import type { SiteContent } from "@/content/site.tr";
import { site as tr } from "@/content/site.tr";
import { site as en } from "@/content/site.en";
import { list, rowPhoto, type DbContent } from "@/lib/db";

/** Sitenin dilleri. İlki varsayılan dil (adres öneki yok: "/"), diğerleri "/en/" gibi önekli. */
export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

function toLocale(locale?: string): Locale {
  return (locales as readonly string[]).includes(locale ?? "") ? (locale as Locale) : defaultLocale;
}

/** Fiyat şablonlarındaki {price} yerine dile göre biçimlenmiş tutar (8.999 / 8,999) */
function resolvePrices(s: SiteContent): SiteContent {
  const fmt = (n: number) => n.toLocaleString(s.locale.numberLocale);
  const section = <T extends SiteContent["remote"]>(r: T): T => ({
    ...r,
    cta: r.cta.replaceAll("{price}", fmt(r.price)),
    ...(r.priceTag && { priceTag: { ...r.priceTag, amount: r.priceTag.amount.replaceAll("{price}", fmt(r.price)) } }),
  });
  return { ...s, remote: section(s.remote), wifi: section(s.wifi) };
}

/** İçerik dosyalarındaki hali (veritabanı yoksa ya da ulaşılamazsa bu gösterilir) */
const fileContent: Record<Locale, SiteContent> = { tr: resolvePrices(tr), en: resolvePrices(en) };

/** Türkiye saatiyle bugünün tarihi: "2026-11-22" */
function todayInTurkey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
}

/**
 * Veritabanındaki (admin panelinden yönetilen) bilgileri içerik dosyasının üstüne yazar.
 * Sabit metinler (başlıklar, açıklamalar, düğme yazıları) içerik dosyasından kalır.
 * İngilizce alan boşsa İngilizce sayfada Türkçe gösterilir.
 * Veritabanı hiç doldurulmamışsa (settings satırı yok) içerik dosyası olduğu gibi kullanılır.
 */
export function mergeDbContent(base: SiteContent, d: DbContent): SiteContent {
  if (!d.settings) return resolvePrices(base);
  const isEn = base.locale.lang === "en";
  const t = (trText: string, enText: string) => (isEn && enText.trim() ? enText : trText);
  const tl = (trJson: string, enJson: string) => {
    const e = list(enJson);
    return isEn && e.length ? e : list(trJson);
  };
  const st = d.settings;

  // Kampanya: açık + metni var + bitiş tarihi geçmemiş
  const c = d.campaign;
  const campaignText = c ? t(c.text_tr, c.text_en) : "";
  const campaignOn = !!c && c.enabled === 1 && campaignText.trim() !== "" && (!c.ends_at || todayInTurkey() <= c.ends_at);
  const campaignCta = c ? t(c.cta_tr, c.cta_en) : "";

  // Fiyat etiketleri: gizlenmişse etiket yerine düz düğme
  const withPrice = <T extends SiteContent["remote"]>(r: T, id: "gunes" | "wifi"): T => {
    const row = d.priceTags.find((p) => p.id === id);
    if (!row) return r;
    if (row.published !== 1) return { ...r, price: row.amount, priceTag: undefined, cta: r.ctaNoPrice };
    return { ...r, price: row.amount };
  };
  const slides = (place: string) =>
    d.photos
      .filter((p) => p.place === place)
      .map((p) => {
        const image = rowPhoto(p);
        const alt = t(p.alt_tr, p.alt_en);
        return { caption: t(p.caption_tr, p.caption_en), ...(image && { image }), ...(alt && { alt }) };
      });

  const merged: SiteContent = {
    ...base,
    contact: {
      ...base.contact,
      phoneDisplay: st.phone_display,
      phoneE164: st.phone_e164,
      whatsapp: st.whatsapp,
      whatsappMessage: t(st.whatsapp_message_tr, st.whatsapp_message_en),
      instagram: { handle: st.instagram_handle, url: st.instagram_url },
      facebook: st.facebook_url ? { name: st.facebook_name || "Facebook", url: st.facebook_url } : undefined,
      hours: t(st.hours_tr, st.hours_en),
      openingHours: list(st.opening_hours),
      region: t(st.region_tr, st.region_en),
      serviceAreas: list(st.service_areas),
    },
    brands: { cctv: list(st.brands_cctv), solar: list(st.brands_solar) },
    announcement: campaignOn ? { text: campaignText, ...(campaignCta && { cta: campaignCta }) } : null,
    products: {
      ...base.products,
      items: d.products.map((p) => {
        const image = rowPhoto(p);
        const alt = t(p.alt_tr, p.alt_en);
        return {
          name: t(p.name_tr, p.name_en),
          category: t(p.category_tr, p.category_en),
          icon: p.icon,
          specs: tl(p.specs_tr, p.specs_en),
          ...(p.brand && { brand: p.brand }),
          ...(image && { image }),
          ...(alt && { alt }),
        };
      }),
    },
    remote: { ...withPrice(base.remote, "gunes"), slides: slides("slider:gunes") },
    wifi: { ...withPrice(base.wifi, "wifi"), slides: slides("slider:wifi") },
    packages: {
      ...base.packages,
      items: d.packages.map((p) => ({
        name: t(p.name_tr, p.name_en),
        cameras: t(p.cameras_tr, p.cameras_en),
        for: t(p.for_tr, p.for_en),
        priceFrom: p.price_from,
        ...(p.featured === 1 && { featured: true }),
        features: tl(p.features_tr, p.features_en),
      })),
    },
    work: {
      ...base.work,
      folders: d.folders.map((f) => ({
        id: f.id,
        title: t(f.title_tr, f.title_en),
        photos: d.photos
          .filter((p) => p.place === `folder:${f.id}`)
          .flatMap((p) => {
            const image = rowPhoto(p);
            if (!image) return [];
            return [{ image, caption: t(p.caption_tr, p.caption_en), ...(p.area && { area: p.area }) }];
          }),
      })),
    },
    reviews: {
      ...base.reviews,
      items: d.reviews.map((r) => ({ quote: t(r.quote_tr, r.quote_en), name: r.name, place: t(r.place_tr, r.place_en) })),
    },
  };
  return resolvePrices(merged);
}

/** Bir isteğin iki dildeki içeriği (src/middleware.ts veritabanından okuyup Astro.locals.site'a koyar) */
export function buildSiteContent(d: DbContent): Record<Locale, SiteContent> {
  return { tr: mergeDbContent(tr, d), en: mergeDbContent(en, d) };
}

type AstroLike = { currentLocale?: string | undefined; locals: App.Locals };

/**
 * Sitenin tek veri kaynağı.
 *  - Sayfa bileşenlerinde: `getSiteContent(Astro)` → veritabanındaki güncel içerik (middleware okur);
 *    veritabanına ulaşılamazsa ya da sayfa build'de hazırlanıyorsa (404) içerik dosyası.
 *  - `getSiteContent("tr")`: sadece içerik dosyası (dil adı gibi hiç değişmeyen bilgiler için).
 */
export function getSiteContent(from?: AstroLike | string): SiteContent {
  if (typeof from === "object") {
    const locale = toLocale(from.currentLocale);
    return from.locals.site?.[locale] ?? fileContent[locale];
  }
  return fileContent[toLocale(from)];
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
