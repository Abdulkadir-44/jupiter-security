/**
 * Her sayfa isteğinde çalışır (sunucuda):
 *  1. Veritabanından (D1) güncel içeriği tek seferde okur → Astro.locals.site (bileşenler getSiteContent(Astro) ile alır).
 *     Okuma başarısız olursa site içerik dosyalarıyla açılır (asla boş sayfa yok); hata Cloudflare loglarına yazılır.
 *  2. Sunucuda oluşturulan sayfalara güvenlik başlıklarını ekler. (public/_headers sadece statik dosyalara
 *     uygulanır; Worker'ın ürettiği yanıtlara uygulanmaz. İkisi aynı tutulmalı.)
 * Build sırasında hazırlanan sayfalarda (404) veritabanı okunmaz.
 */
import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { loadDbContent } from "@/lib/db";
import { buildSiteContent } from "@/lib/data";

const securityHeaders: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  try {
    context.locals.site = buildSiteContent(await loadDbContent(env.DB));
  } catch (err) {
    console.error("[db] içerik okunamadı, içerik dosyaları kullanılıyor:", err);
  }

  const response = await next();
  for (const [k, v] of Object.entries(securityHeaders)) {
    if (!response.headers.has(k)) response.headers.set(k, v);
  }
  return response;
});
