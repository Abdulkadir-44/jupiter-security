/**
 * Admin paneli giriş sistemi (sadece sunucuda). Dış kütüphane yok: Web Crypto.
 *
 *  - Şifre: PBKDF2-SHA256, 100.000 tur (Cloudflare Workers'ın izin verdiği en yüksek değer) + rastgele tuz.
 *    scripts/admin.mjs (komut satırı) aynı ayarlarla üretir; ikisi aynı kalmalı.
 *  - 2FA: TOTP (RFC 6238): 30 sn, 6 hane, HMAC-SHA1 (Google/Microsoft Authenticator uyumlu). ±1 adım tolerans,
 *    aynı kod iki kez kabul edilmez.
 *  - Yedek kodlar: 10 adet, tek kullanımlık, veritabanında sadece SHA-256 özetleri.
 *  - Oturum: çerezde rastgele 32 bayt; veritabanında sadece özeti (çerez çalınmadan veritabanından oturum üretilemez).
 *  - Deneme sınırı: aynı IP'den 15 dakikada 5 hatalı deneme → 15 dakika kilit (şifre ve kod adımları birlikte sayılır).
 */
import type { D1Database } from "@cloudflare/workers-types";
import type { AstroCookies } from "astro";

export const PBKDF2_ITER = 100_000;
export const SESSION_COOKIE = "__Host-jupiter_admin";
const SESSION_DAYS = 7;
/** Şifre doğru → 2FA adımı için verilen süre */
const PENDING_MINUTES = 10;
const MAX_FAILS = 5;
const LOCK_MINUTES = 15;

const enc = new TextEncoder();

// ───────────── yardımcılar ─────────────

export function toHex(buf: ArrayBuffer | Uint8Array): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function randomBytes(n: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(n));
}
/** Çerez/adres için güvenli rastgele metin */
export function randomToken(bytes = 32): string {
  return btoa(String.fromCharCode(...randomBytes(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function sha256(text: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}
/** Sabit sürede karşılaştırma (zamanlamadan bilgi sızmasın) */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ───────────── şifre ─────────────

export async function hashPassword(password: string, saltHex: string, iter = PBKDF2_ITER): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations: iter },
    key,
    256,
  );
  return toHex(bits);
}
export async function newPasswordHash(password: string) {
  const salt = toHex(randomBytes(16));
  return { salt, hash: await hashPassword(password, salt), iter: PBKDF2_ITER };
}
export async function verifyPassword(password: string, saltHex: string, hashHex: string, iter: number): Promise<boolean> {
  return safeEqual(await hashPassword(password, saltHex, iter), hashHex);
}

// ───────────── TOTP (2FA) ─────────────

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
export function base32Decode(text: string): Uint8Array<ArrayBuffer> {
  const clean = text.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of clean) {
    value = (value << 5) | B32.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out) as Uint8Array<ArrayBuffer>;
}

/** Yeni 2FA anahtarı (160 bit, base32) */
export function newTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

async function totpAt(secret: string, step: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", base32Decode(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new Uint8Array(8);
  let n = step;
  for (let i = 7; i >= 0; i--) {
    msg[i] = n & 255;
    n = Math.floor(n / 256);
  }
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = h[h.length - 1] & 15;
  const code = (((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1_000_000;
  return String(code).padStart(6, "0");
}

/**
 * Kodu doğrular. Doğruysa kabul edilen zaman adımını döner (tekrar kullanımı engellemek için saklanır), değilse null.
 * `lastStep`: en son kabul edilen adım; ondan eski ya da eşit adımlar reddedilir.
 */
export async function verifyTotp(secret: string, code: string, lastStep = 0): Promise<number | null> {
  const c = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(c)) return null;
  const now = Math.floor(Date.now() / 30_000);
  for (const step of [now, now - 1, now + 1]) {
    if (step <= lastStep) continue;
    if (safeEqual(await totpAt(secret, step), c)) return step;
  }
  return null;
}

/** Authenticator uygulamasının QR'da okuduğu adres */
export function totpUri(secret: string, email: string): string {
  const issuer = "Jüpiter Panel";
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${email}`)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// ───────────── yedek kodlar ─────────────

/** 10 yedek kod: "k7m2-q9xt" biçiminde (karışabilecek harfler yok) */
export function newBackupCodes(): string[] {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => {
    const b = randomBytes(8);
    const s = [...b].map((x) => alphabet[x % alphabet.length]).join("");
    return `${s.slice(0, 4)}-${s.slice(4)}`;
  });
}
export function normalizeBackupCode(code: string): string {
  const s = code.toLowerCase().replace(/[^a-z0-9]/g, "");
  return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4)}` : "";
}

// ───────────── veritabanı: kullanıcı ─────────────

export interface AdminUser {
  email: string;
  password_hash: string;
  password_salt: string;
  pbkdf2_iter: number;
  totp_secret: string | null;
  totp_pending: string | null;
  totp_last_step: number;
  backup_codes: string;
}
export async function getAdmin(db: D1Database): Promise<AdminUser | null> {
  return await db.prepare("SELECT * FROM admin_user WHERE id = 1").first<AdminUser>();
}

export async function logActivity(db: D1Database, action: string) {
  await db.prepare("INSERT INTO activity_log (action) VALUES (?)").bind(action).run();
}

// ───────────── deneme sınırı ─────────────

/** Kilitliyse kalan dakika, değilse 0 */
export async function lockedMinutes(db: D1Database, ip: string): Promise<number> {
  const r = await db
    .prepare(
      `SELECT COUNT(*) AS n, MIN(created_at) AS first FROM login_attempts
       WHERE ip = ? AND success = 0 AND created_at > datetime('now', ?)`,
    )
    .bind(ip, `-${LOCK_MINUTES} minutes`)
    .first<{ n: number; first: string | null }>();
  if (!r || r.n < MAX_FAILS || !r.first) return 0;
  const unlockAt = new Date(r.first.replace(" ", "T") + "Z").getTime() + LOCK_MINUTES * 60_000;
  return Math.max(1, Math.ceil((unlockAt - Date.now()) / 60_000));
}
export async function recordAttempt(db: D1Database, ip: string, success: boolean) {
  await db.batch([
    db.prepare("INSERT INTO login_attempts (ip, success) VALUES (?, ?)").bind(ip, success ? 1 : 0),
    // Başarılı girişte bu IP'nin hatalı sayacı sıfırlanır; 1 günden eski kayıtlar silinir
    ...(success ? [db.prepare("DELETE FROM login_attempts WHERE ip = ? AND success = 0").bind(ip)] : []),
    db.prepare("DELETE FROM login_attempts WHERE created_at < datetime('now', '-1 day')"),
  ]);
}

// ───────────── oturum ─────────────

export type Stage = "password" | "setup" | "full";
export interface Session {
  idHash: string;
  stage: Stage;
  csrf: string;
}

function cookieOptions(maxAgeSec: number) {
  return { path: "/", httpOnly: true, secure: true, sameSite: "strict" as const, maxAge: maxAgeSec };
}

/** Yeni oturum açar (eski oturum çerezi varsa onu siler) ve çerezi yazar */
export async function createSession(
  db: D1Database,
  cookies: AstroCookies,
  stage: Stage,
  meta: { ip: string; userAgent: string },
): Promise<void> {
  await destroySession(db, cookies);
  const token = randomToken();
  const minutes = stage === "full" ? SESSION_DAYS * 24 * 60 : PENDING_MINUTES;
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')"),
    db
      .prepare(
        "INSERT INTO sessions (id_hash, stage, csrf, expires_at, ip, user_agent) VALUES (?, ?, ?, datetime('now', ?), ?, ?)",
      )
      .bind(await sha256(token), stage, randomToken(24), `+${minutes} minutes`, meta.ip, meta.userAgent.slice(0, 200)),
  ]);
  cookies.set(SESSION_COOKIE, token, cookieOptions(minutes * 60));
}

/** Çerezdeki oturumu okur (süresi geçmişse null) */
export async function getSession(db: D1Database, cookies: AstroCookies): Promise<Session | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const idHash = await sha256(token);
  const row = await db
    .prepare("SELECT stage, csrf FROM sessions WHERE id_hash = ? AND expires_at > datetime('now')")
    .bind(idHash)
    .first<{ stage: Stage; csrf: string }>();
  return row ? { idHash, stage: row.stage, csrf: row.csrf } : null;
}

export async function destroySession(db: D1Database, cookies: AstroCookies): Promise<void> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) await db.prepare("DELETE FROM sessions WHERE id_hash = ?").bind(await sha256(token)).run();
  cookies.delete(SESSION_COOKIE, { path: "/", httpOnly: true, secure: true, sameSite: "strict" });
}

/** Tüm oturumları kapatır (şifre/2FA değişince) */
export async function destroyAllSessions(db: D1Database): Promise<void> {
  await db.prepare("DELETE FROM sessions").run();
}
