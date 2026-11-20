// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://jupiterkamera.com", // TODO: gerçek alan adı alınınca güncelleyin
  integrations: [react()],
  adapter: cloudflare({
    // Görseller build sırasında optimize edilir (ücretli Cloudflare Images kullanılmaz)
    imageService: "compile",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
