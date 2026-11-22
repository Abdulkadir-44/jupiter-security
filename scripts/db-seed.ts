/**
 * İlk içerik aktarımı: site.tr.ts / site.en.ts'teki panelden yönetilecek bilgileri SQL'e çevirir.
 *   Çıktı: db/seed.sql (gitignore'da; her çalıştırmada yeniden üretilir)
 *
 *   npm run db:seed:local    → bilgisayardaki veritabanına
 *   npm run db:seed:remote   → canlı veritabanına
 *
 * GÜVENLİ: Her satır sabit kimlikle "INSERT OR IGNORE" yazılır. Veritabanında zaten olan satırlar
 * DEĞİŞMEZ; panelden yapılan düzenlemeler tekrar çalıştırınca ezilmez. Sadece eksik satırlar eklenir.
 * Yerel veritabanını sıfırdan kurmak için: .wrangler/state klasörünü silip migrate + seed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { site as tr, type SiteContent } from "../src/content/site.tr";
import { site as en } from "../src/content/site.en";
import type { Photo } from "../src/content/media";

type Value = string | number | null | undefined | boolean | unknown[];

const q = (v: Value): string => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "1" : "0";
  if (typeof v === "number") return String(Math.trunc(v));
  if (Array.isArray(v)) return q(JSON.stringify(v));
  return `'${String(v).replace(/'/g, "''")}'`;
};

const lines: string[] = [];
function insert(table: string, row: Record<string, Value>) {
  const cols = Object.keys(row);
  lines.push(`INSERT OR IGNORE INTO ${table} (${cols.join(", ")}) VALUES (${cols.map((c) => q(row[c])).join(", ")});`);
}

const photoCols = (p?: Photo) => ({
  photo_key: p?.key ?? null,
  photo_width: p?.width ?? null,
  photo_height: p?.height ?? null,
  photo_widths: p ? p.widths : null,
});

/** İki dildeki listelerin aynı sırada olduğunu kontrol eder (eşleşmezse yanlış çeviri eşleşir) */
function pair<T>(name: string, a: T[], b: T[]): [T, T][] {
  if (a.length !== b.length) throw new Error(`${name}: TR ${a.length} öğe, EN ${b.length} öğe. Aynı sayıda olmalı.`);
  return a.map((x, i) => [x, b[i]]);
}

// ── settings ──
const c = tr.contact;
insert("settings", {
  id: 1,
  phone_display: c.phoneDisplay,
  phone_e164: c.phoneE164,
  whatsapp: c.whatsapp,
  whatsapp_message_tr: c.whatsappMessage,
  whatsapp_message_en: en.contact.whatsappMessage,
  instagram_handle: c.instagram.handle,
  instagram_url: c.instagram.url,
  facebook_name: c.facebook?.name ?? "",
  facebook_url: c.facebook?.url ?? "",
  hours_tr: c.hours,
  hours_en: en.contact.hours,
  opening_hours: c.openingHours,
  region_tr: c.region,
  region_en: en.contact.region,
  service_areas: c.serviceAreas,
  brands_cctv: tr.brands.cctv,
  brands_solar: tr.brands.solar,
});

// ── campaign ──
insert("campaign", {
  id: 1,
  // Şerit şu an sayfada yok (hazır, kapalı). 4. aşamada panelden açılınca görünecek.
  enabled: false,
  text_tr: tr.announcement?.text ?? "",
  text_en: en.announcement?.text ?? "",
  cta_tr: tr.announcement?.cta ?? "",
  cta_en: en.announcement?.cta ?? "",
  ends_at: null,
});

// ── price_tags ──
insert("price_tags", { id: "gunes", amount: tr.remote.price, published: tr.remote.priceTag !== undefined });
insert("price_tags", { id: "wifi", amount: tr.wifi.price, published: tr.wifi.priceTag !== undefined });

// ── packages ──
pair("packages", tr.packages.items, en.packages.items).forEach(([t, e], i) =>
  insert("packages", {
    id: i + 1,
    name_tr: t.name,
    name_en: e.name,
    cameras_tr: t.cameras,
    cameras_en: e.cameras,
    for_tr: t.for,
    for_en: e.for,
    features_tr: t.features,
    features_en: e.features,
    price_from: t.priceFrom,
    featured: t.featured ?? false,
    sort: i,
  }),
);

// ── reviews ──
pair("reviews", tr.reviews.items, en.reviews.items).forEach(([t, e], i) =>
  insert("reviews", { id: i + 1, quote_tr: t.quote, quote_en: e.quote, name: t.name, place_tr: t.place, place_en: e.place, sort: i }),
);

// ── products ──
pair("products", tr.products.items, en.products.items).forEach(([t, e], i) =>
  insert("products", {
    id: i + 1,
    name_tr: t.name,
    name_en: e.name,
    category_tr: t.category,
    category_en: e.category,
    icon: t.icon,
    specs_tr: t.specs,
    specs_en: e.specs,
    brand: t.brand ?? "",
    alt_tr: t.alt ?? "",
    alt_en: e.alt ?? "",
    ...photoCols(t.image),
    sort: i,
  }),
);

// ── folders + photos ──
let photoId = 0;
pair("work.folders", tr.work.folders, en.work.folders).forEach(([t, e], i) => {
  if (t.id !== e.id) throw new Error(`Klasör sırası farklı: ${t.id} / ${e.id}`);
  insert("folders", { id: t.id, title_tr: t.title, title_en: e.title, sort: i });
  pair(`folder ${t.id}`, t.photos, e.photos).forEach(([tp, ep], j) =>
    insert("photos", {
      id: ++photoId,
      place: `folder:${t.id}`,
      caption_tr: tp.caption,
      caption_en: ep.caption,
      area: tp.area ?? "",
      ...photoCols(tp.image),
      sort: j,
    }),
  );
});

// ── slider fotoğrafları ──
const sliders: [string, SiteContent["remote"]["slides"], SiteContent["remote"]["slides"]][] = [
  ["slider:gunes", tr.remote.slides, en.remote.slides],
  ["slider:wifi", tr.wifi.slides, en.wifi.slides],
];
for (const [place, ts, es] of sliders) {
  pair(place, ts, es).forEach(([t, e], j) =>
    insert("photos", {
      id: ++photoId,
      place,
      caption_tr: t.caption,
      caption_en: e.caption,
      alt_tr: t.alt ?? "",
      alt_en: e.alt ?? "",
      ...photoCols(t.image),
      sort: j,
    }),
  );
}

const out = path.resolve(import.meta.dirname, "../db/seed.sql");
await mkdir(path.dirname(out), { recursive: true });
await writeFile(
  out,
  `-- OTOMATİK ÜRETİLDİ (scripts/db-seed.ts). Elle düzenlemeyin.\n-- INSERT OR IGNORE: var olan satırlar değişmez.\n${lines.join("\n")}\n`,
);
console.log(`[seed] ${lines.length} satır → db/seed.sql`);
