/**
 * Panel formları için ortak yardımcılar (sunucu): alan okuma, telefon biçimi, liste işlemleri (sırala/gizle/sil).
 */
import type { D1Database } from "@cloudflare/workers-types";

/** Metin alanı: kırpılmış, en fazla `max` karakter */
export function str(form: FormData, key: string, max = 500): string {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

/** Satır satır liste (textarea): boş satırlar atılır */
export function lines(form: FormData, key: string, maxItems = 30, maxLen = 200): string[] {
  return String(form.get(key) ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

/** Virgülle ya da satırla ayrılmış liste (ilçeler, markalar) */
export function items(form: FormData, key: string, maxItems = 30): string[] {
  return String(form.get(key) ?? "")
    .split(/[\n,]/)
    .map((l) => l.trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function checked(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "1";
}

/**
 * Türkiye telefon numarası: "0545 142 31 31", "+90 545 142 3131", "5451423131" → { e164: "+905451423131", wa: "905451423131",
 * display: "0545 142 31 31" }. Geçersizse null.
 */
export function parsePhone(input: string): { e164: string; wa: string; display: string } | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0090")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = "90" + d.slice(1);
  if (d.length === 10) d = "90" + d;
  if (!/^90[2-5]\d{9}$/.test(d)) return null;
  const n = d.slice(2);
  return { e164: `+${d}`, wa: d, display: `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}` };
}

/** Sıralı, gizlenebilir liste tabloları (yorumlar, paketler, ...) */
export type ListTable = "reviews" | "packages";

/**
 * Liste işlemleri. `op`: "up" | "down" | "toggle" | "delete". Sıra değişince tüm satırlar 0,1,2… diye yeniden numaralanır.
 * Döner: yapılan işlemin kısa açıklaması (son hareketler için) ya da null.
 */
export async function listAction(db: D1Database, table: ListTable, id: number, op: string): Promise<"up" | "down" | "toggle" | "delete" | null> {
  const rows = (await db.prepare(`SELECT id, published FROM ${table} ORDER BY sort, id`).all<{ id: number; published: number }>()).results;
  const i = rows.findIndex((r) => r.id === id);
  if (i < 0) return null;

  if (op === "up" || op === "down") {
    const j = op === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= rows.length) return null;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    await db.batch(rows.map((r, k) => db.prepare(`UPDATE ${table} SET sort = ? WHERE id = ?`).bind(k, r.id)));
    return op;
  }
  if (op === "toggle") {
    await db.prepare(`UPDATE ${table} SET published = 1 - published, updated_at = datetime('now') WHERE id = ?`).bind(id).run();
    return "toggle";
  }
  if (op === "delete") {
    await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    return "delete";
  }
  return null;
}

/** Listenin sonuna eklenecek satırın sıra numarası */
export async function nextSort(db: D1Database, table: ListTable): Promise<number> {
  return (await db.prepare(`SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM ${table}`).first<number>("n")) ?? 0;
}

/** JSON dizi alanını textarea için satırlara çevirir */
export function toLines(json: string | null | undefined): string {
  try {
    const v = JSON.parse(json ?? "[]");
    return Array.isArray(v) ? v.join("\n") : "";
  } catch {
    return "";
  }
}
