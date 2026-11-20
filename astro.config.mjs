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
  integrations: [
    react(),
    sitemap({
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
