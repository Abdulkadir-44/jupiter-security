/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Bu isteğin iki dildeki içeriği (veritabanı + içerik dosyası). src/middleware.ts doldurur. */
    site?: Record<import("@/lib/data").Locale, import("@/content/site.tr").SiteContent>;
  }
}

/**
 * Worker ortamındaki bağlantılar (wrangler.jsonc). Cloudflare'in tüm global tipleri tarayıcı tipleriyle çakıştığı
 * için sadece kullanılanlar burada tanımlı. Yeni bağlantı (R2 vb.) eklenince buraya da eklenir.
 */
declare module "cloudflare:workers" {
  export const env: {
    DB: import("@cloudflare/workers-types").D1Database;
  };
}
