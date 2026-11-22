/**
 * "İngilizceye çevir": Cloudflare Workers AI, model @cf/google/gemma-4-26b-a4b-it (sunucuda).
 * Formun tüm Türkçe alanları tek istekte, işletme bağlamıyla çevrilir (kelime kelime değil, doğal site İngilizcesi).
 * İlk denenen çeviri modeli (m2m100) "Telefondan izleme" → "Watch the phone" gibi sonuçlar verdiği için bırakıldı.
 *
 * Maliyet güvencesi (Cloudflare fiyat sayfası, 18.11.2026; ölçüm: bir form çevirisi ~1,5 neuron, ~1 sn):
 *  - Günde 10.000 "neuron" ücretsiz. Bu model: 1 milyon girdi parçası ~9.091, çıktı ~27.273 neuron
 *    (0,10 $ / 0,30 $). Bir form çevirisi birkaç yüz parça: günlük ücretsiz kotanın binde biri bile değil.
 *  - Ücretsiz planda sınır aşılırsa ücret alınmaz, işlem hata verir. Model ücretli ödeme yöntemi istemiyor.
 *  - Ayrıca burada günlük üst sınır: DAILY_LIMIT tıklama (ai_usage tablosu). Sadece giriş yapmış admin kullanabilir.
 */
import type { Ai, D1Database } from "@cloudflare/workers-types";

export const DAILY_LIMIT = 200;
const MODEL = "@cf/google/gemma-4-26b-a4b-it";

const SYSTEM = `You translate Turkish website copy into natural, concise English for the website of "Jüpiter Güvenlik Sistemleri",
a CCTV / security camera installation company in İskenderun, Hatay (Turkey). Visitors are home owners, shop owners and businesses.
Rules:
- Input is a JSON object of field keys to Turkish text. Reply with ONLY a JSON object with exactly the same keys and the English text.
- Some values have several lines (one list item per line). Keep exactly the same number of lines, in the same order.
- Keep place names (İskenderun, Arsuz, Payas, Hatay...), person names (e.g. "Mehmet K.") and brand names (Dahua, Hikvision, ZTEC, IOMA, O-KAM) unchanged.
- Use TL for prices, keep numbers. Do not add, explain or omit anything.`;

/** Bugünkü kullanım +1; sınır aşıldıysa false */
export async function takeQuota(db: D1Database): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const r = await db
    .prepare(
      `INSERT INTO ai_usage (day, count) VALUES (?, 1)
       ON CONFLICT(day) DO UPDATE SET count = count + 1 WHERE count < ?
       RETURNING count`,
    )
    .bind(day, DAILY_LIMIT)
    .first<number>("count");
  return r !== null;
}

/** Modelin cevabından JSON nesnesini ayıklar (kod bloğu ya da açıklama eklese bile) */
function parseJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** Anahtar → Türkçe metin alır, anahtar → İngilizce döner. Çok satırlı alanlarda satır sayısı korunur. */
export async function translateFields(ai: Ai, fields: Record<string, string>): Promise<Record<string, string>> {
  const r = (await ai.run(MODEL as Parameters<Ai["run"]>[0], {
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: JSON.stringify(fields) },
    ],
    max_tokens: 2048,
    temperature: 0.2,
    // "Düşünme" kapalı: açıkken cevap 10-20 sn sürüyordu, kapalıyken ~1 sn (çeviride kalite farkı yok)
    chat_template_kwargs: { enable_thinking: false },
  } as never)) as { response?: unknown; choices?: { message?: { content?: string } }[] };

  const raw = typeof r.response === "string" ? r.response : (r.choices?.[0]?.message?.content ?? JSON.stringify(r.response ?? ""));
  const parsed = typeof r.response === "object" && r.response ? (r.response as Record<string, unknown>) : parseJson(raw);
  if (!parsed) throw new Error("Çeviri cevabı okunamadı");

  const out: Record<string, string> = {};
  for (const [k, tr] of Object.entries(fields)) {
    const v = parsed[k];
    if (typeof v !== "string" || !v.trim()) continue;
    // Liste alanında satır sayısı tutmazsa o alanı yazma (yanlış eşleşme olmasın)
    const want = tr.split(/\r?\n/).filter((l) => l.trim()).length;
    const got = v.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (want > 1 && got.length !== want) continue;
    out[k] = got.join("\n");
  }
  if (!Object.keys(out).length) throw new Error("Çeviri boş döndü");
  return out;
}
