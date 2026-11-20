import type { APIRoute } from "astro";

// robots.txt: arama motorlarına tüm siteyi taramalarına izin verir ve site haritasını gösterir.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
