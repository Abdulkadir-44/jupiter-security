/**
 * Her sayfa isteğinde çalışır (sunucuda):
 *  1. Site sayfaları: veritabanından (D1) güncel içeriği tek seferde okur → Astro.locals.site
 *     (bileşenler getSiteContent(Astro) ile alır). Okuma başarısız olursa site içerik dosyalarıyla açılır
 *     (asla boş sayfa yok); hata Cloudflare loglarına yazılır.
 *  2. Admin paneli (/admin): oturum kontrolü + form güvenliği (aşağıda).
 *  3. Sunucuda oluşturulan her yanıta güvenlik başlıkları. (public/_headers sadece statik dosyalara
 *     uygulanır; Worker'ın ürettiği yanıtlara uygulanmaz. İkisi aynı tutulmalı.)
 * Build sırasında hazırlanan sayfalarda (404) hiçbiri çalışmaz.
 */
import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { loadDbContent } from "@/lib/db";
import { buildSiteContent } from "@/lib/data";
import { getSession, type Stage } from "@/lib/auth";

const securityHeaders: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/** Panel sayfalarının hangi oturum aşamasında açılabildiği. Listede olmayan /admin sayfaları "full" ister. */
const adminAccess: Record<string, Stage | "public" | "any"> = {
  "/admin/giris": "public",
  "/admin/dogrulama": "password",
  "/admin/2fa-kurulum": "setup",
  "/admin/cikis": "any",
};
/** Bir aşamadaki oturumun gitmesi gereken sayfa */
const stageHome: Record<Stage, string> = {
  password: "/admin/dogrulama",
  setup: "/admin/2fa-kurulum",
  full: "/admin",
};

function withHeaders(response: Response, extra: Record<string, string> = {}): Response {
  for (const [k, v] of Object.entries({ ...securityHeaders, ...extra })) {
    if (!response.headers.has(k)) response.headers.set(k, v);
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  const path = context.url.pathname.replace(/\/+$/, "") || "/";

  // ───────── Admin paneli ─────────
  if (path === "/admin" || path.startsWith("/admin/")) {
    // Arama motorlarına kapalı, tarayıcı önbelleğine alınmaz
    const adminHeaders = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
    const redirect = (to: string) => withHeaders(context.redirect(to, 303), adminHeaders);
    const forbidden = () => withHeaders(new Response("İzin verilmedi", { status: 403 }), adminHeaders);

    // Form gönderimleri sadece bu siteden (Astro da kontrol eder; burada ayrıca kesin kural)
    const isPost = context.request.method === "POST";
    if (isPost && context.request.headers.get("origin") !== context.url.origin) return forbidden();

    const session = await getSession(env.DB, context.cookies);
    const need = adminAccess[path] ?? "full";

    if (need === "public") {
      if (session) return redirect(stageHome[session.stage]); // zaten giriş adımında/içeride
    } else if (!session) {
      return redirect("/admin/giris");
    } else if (need !== "any" && session.stage !== need) {
      return redirect(stageHome[session.stage]);
    }

    // Oturumlu formlar: gizli güvenlik anahtarı (CSRF) oturumdakiyle aynı olmalı
    if (isPost && session && need !== "public") {
      const form = await context.request.clone().formData().catch(() => null);
      if (form?.get("csrf") !== session.csrf) return forbidden();
    }

    if (session) context.locals.admin = session;
    return withHeaders(await next(), adminHeaders);
  }

  // ───────── Site sayfaları ─────────
  try {
    context.locals.site = buildSiteContent(await loadDbContent(env.DB));
  } catch (err) {
    console.error("[db] içerik okunamadı, içerik dosyaları kullanılıyor:", err);
  }
  return withHeaders(await next());
});
