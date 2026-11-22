/**
 * Panel formlarındaki "İngilizceye çevir" düğmesi buraya istek atar (FormData: csrf + fields = JSON {anahtar: Türkçe metin}).
 * Oturum ve güvenlik anahtarı kontrolü src/middleware.ts'te. En fazla 25 alan, alan başına 2.000 karakter.
 */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { DAILY_LIMIT, takeQuota, translateFields } from "@/lib/translate";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  let fields: Record<string, string>;
  try {
    const raw = JSON.parse(String(form.get("fields") ?? "{}")) as Record<string, unknown>;
    fields = Object.fromEntries(
      Object.entries(raw)
        .filter(([k, v]) => /^[a-z_]{1,40}$/.test(k) && typeof v === "string" && v.trim())
        .slice(0, 25)
        .map(([k, v]) => [k, (v as string).slice(0, 2000)]),
    );
  } catch {
    return json({ error: "Geçersiz istek." }, 400);
  }
  if (!Object.keys(fields).length) return json({ error: "Çevrilecek Türkçe metin yok." }, 400);
  if (!env.AI) return json({ error: "Çeviri servisi bu ortamda kapalı." }, 503);
  if (!(await takeQuota(env.DB))) return json({ error: `Günlük çeviri sınırı (${DAILY_LIMIT}) doldu. Yarın tekrar deneyin ya da elle yazın.` }, 429);

  try {
    return json({ fields: await translateFields(env.AI, fields) });
  } catch (err) {
    console.error("[ceviri]", err);
    return json({ error: "Çeviri şu an yapılamadı. Biraz sonra tekrar deneyin ya da elle yazın." }, 502);
  }
};
