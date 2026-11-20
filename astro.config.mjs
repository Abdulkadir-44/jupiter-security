// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Sitenin yayındaki adresi: canonical, sitemap, robots.txt ve paylaşım görseli buradan üretilir.
  // TODO: Alan adı alınınca burayı gerçek adresle değiştirin (örn. "https://jupiterkamera.com").
  site: "https://jupiter-kamera.abdulkadirozenc-freelance-44e.workers.dev",
  // Diller: Türkçe varsayılan ("/"), İngilizce "/en/". Dil listesi src/lib/data.ts ile aynı olmalı.
  i18n: {
    defaultLocale: "tr",
    locales: ["tr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  // "preserve": src/pages/en/404.astro → dist/client/en/404.html (Cloudflare /en/ altındaki
  // bulunamayan adreslerde bunu bulur). index sayfalarının adresleri değişmez (/ ve /en/).
  build: { format: "preserve" },
  // Güvenlik: Content-Security-Policy. Astro her sayfaya <meta> ekler ve kendi satır içi
  // script/stillerini otomatik izinli (hash) yapar. Diğer başlıklar: public/_headers.
  // Yeni bir dış kaynak (font, harita, video vb.) eklenirse buraya izin eklenmeli, yoksa tarayıcı engeller.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com", // Cloudflare Web Analytics veri gönderimi
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ],
      scriptDirective: {
        resources: ["'self'", "https://static.cloudflareinsights.com"], // Cloudflare Web Analytics betiği
      },
      styleDirective: {
        // style="..." öznitelikleri (animasyon değişkenleri, Framer Motion başlangıç değerleri) için
        resources: ["'self'", { resource: "'unsafe-inline'", kind: "attribute" }],
      },
    },
  },
  integrations: [
    react(),
    sitemap({
      // 404 sayfaları sitemap'e girmez
      filter: (page) => !/\/404(\.html)?\/?$/.test(page),
      // "preserve" biçiminde /en/ sayfası sitemap'e "/en" olarak yazılıyor; canonical ve hreflang ile
      // aynı olsun diye dil ana sayfalarının sonuna "/" eklenir.
      serialize(item) {
        const url = new URL(item.url);
        if (!url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) url.pathname += "/";
        item.url = url.href;
        item.links = item.links?.map((l) => {
          const u = new URL(l.url);
          if (!u.pathname.endsWith("/")) u.pathname += "/";
          return { ...l, url: u.href };
        });
        return item;
      },
      i18n: { defaultLocale: "tr", locales: { tr: "tr-TR", en: "en-US" } },
    }),
  ],
  adapter: cloudflare({
    // Görseller build sırasında optimize edilir (ücretli Cloudflare Images kullanılmaz)
    imageService: "compile",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
