/**
 * Veritabanından (Cloudflare D1) site içeriğini okur. Sadece sunucuda çalışır.
 * Tablolar: db/migrations/0001_init.sql. Okunan satırlar src/lib/data.ts'te içerik dosyasıyla birleştirilir.
 */
import type { D1Database } from "@cloudflare/workers-types";
import type { Photo } from "@/content/media";

export interface SettingsRow {
  phone_display: string;
  phone_e164: string;
  whatsapp: string;
  whatsapp_message_tr: string;
  whatsapp_message_en: string;
  instagram_handle: string;
  instagram_url: string;
  facebook_name: string;
  facebook_url: string;
  hours_tr: string;
  hours_en: string;
  opening_hours: string;
  region_tr: string;
  region_en: string;
  service_areas: string;
  brands_cctv: string;
  brands_solar: string;
}
export interface CampaignRow {
  enabled: number;
  text_tr: string;
  text_en: string;
  cta_tr: string;
  cta_en: string;
  ends_at: string | null;
}
export interface FolderRow {
  id: string;
  title_tr: string;
  title_en: string;
}
interface PhotoCols {
  photo_key: string | null;
  photo_width: number | null;
  photo_height: number | null;
  photo_widths: string | null;
}
export interface PhotoRow extends PhotoCols {
  place: string;
  caption_tr: string;
  caption_en: string;
  area: string;
  alt_tr: string;
  alt_en: string;
}
export interface ProductRow extends PhotoCols {
  name_tr: string;
  name_en: string;
  category_tr: string;
  category_en: string;
  icon: "bullet" | "dome" | "ptz" | "solar" | "wifi" | "nvr";
  specs_tr: string;
  specs_en: string;
  brand: string;
  alt_tr: string;
  alt_en: string;
}
export interface PriceTagRow {
  id: "gunes" | "wifi";
  amount: number;
  published: number;
}
export interface PackageRow {
  name_tr: string;
  name_en: string;
  cameras_tr: string;
  cameras_en: string;
  for_tr: string;
  for_en: string;
  features_tr: string;
  features_en: string;
  price_from: number;
  featured: number;
}
export interface ReviewRow {
  quote_tr: string;
  quote_en: string;
  name: string;
  place_tr: string;
  place_en: string;
}

export interface DbContent {
  settings: SettingsRow | null;
  campaign: CampaignRow | null;
  folders: FolderRow[];
  photos: PhotoRow[];
  products: ProductRow[];
  priceTags: PriceTagRow[];
  packages: PackageRow[];
  reviews: ReviewRow[];
}

/** Tüm içerik tek istekte (D1 batch: tek gidiş-dönüş). Gizli (published = 0) satırlar gelmez. */
export async function loadDbContent(db: D1Database): Promise<DbContent> {
  const [settings, campaign, folders, photos, products, priceTags, packages, reviews] = await db.batch([
    db.prepare("SELECT * FROM settings WHERE id = 1"),
    db.prepare("SELECT * FROM campaign WHERE id = 1"),
    db.prepare("SELECT id, title_tr, title_en FROM folders WHERE published = 1 ORDER BY sort, created_at"),
    db.prepare("SELECT * FROM photos WHERE published = 1 ORDER BY sort, id"),
    db.prepare("SELECT * FROM products WHERE published = 1 ORDER BY sort, id"),
    db.prepare("SELECT id, amount, published FROM price_tags"),
    db.prepare("SELECT * FROM packages WHERE published = 1 ORDER BY sort, id"),
    db.prepare("SELECT * FROM reviews WHERE published = 1 ORDER BY sort, id"),
  ]);
  return {
    settings: (settings.results[0] as unknown as SettingsRow) ?? null,
    campaign: (campaign.results[0] as unknown as CampaignRow) ?? null,
    folders: folders.results as unknown as FolderRow[],
    photos: photos.results as unknown as PhotoRow[],
    products: products.results as unknown as ProductRow[],
    priceTags: priceTags.results as unknown as PriceTagRow[],
    packages: packages.results as unknown as PackageRow[],
    reviews: reviews.results as unknown as ReviewRow[],
  };
}

/** JSON dizi alanını okur; bozuksa boş liste */
export function list<T = string>(json: string | null | undefined): T[] {
  try {
    const v = JSON.parse(json ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Satırdaki fotoğraf sütunlarından Photo; fotoğraf yoksa undefined */
export function rowPhoto(r: PhotoCols): Photo | undefined {
  const widths = list<number>(r.photo_widths).filter((n) => typeof n === "number");
  if (!r.photo_key || !r.photo_width || !r.photo_height || widths.length === 0) return undefined;
  return { key: r.photo_key, width: r.photo_width, height: r.photo_height, widths };
}
