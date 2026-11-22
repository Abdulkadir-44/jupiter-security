/**
 * Admin hesabı komutları (komut satırından; panelde bu işlemler yok):
 *
 *   npm run admin:create                  → ilk hesabı oluşturur (varsa üzerine yazmaz)
 *   npm run admin:reset-password          → şifreyi (ve istenirse e-postayı) değiştirir, tüm oturumları kapatır
 *   npm run admin:reset-2fa               → 2FA'yı ve yedek kodları siler; sonraki girişte QR yeniden kurulur
 *
 * Varsayılan: bilgisayardaki (yerel) veritabanı. Canlı için sona `-- --remote` ekleyin:
 *   npm run admin:create -- --remote
 *
 * E-posta ve şifre terminalde sorulur, şifre ekranda görünmez. (Otomasyon için ADMIN_EMAIL / ADMIN_PASSWORD
 * ortam değişkenleri de okunur.) Şifre hiçbir dosyaya ya da loga yazılmaz; veritabanına sadece özeti gider.
 * Şifre ayarları src/lib/auth.ts ile aynı olmalı (PBKDF2-SHA256, 100.000 tur, 16 bayt tuz).
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import readline from "node:readline";

const PBKDF2_ITER = 100_000;
const DB_NAME = "jupiter-kamera";
const root = path.resolve(import.meta.dirname, "..");

const [command, ...flags] = process.argv.slice(2);
const remote = flags.includes("--remote");
const where = remote ? "CANLI veritabanı" : "yerel veritabanı";

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else if (s === "\r\n" || s === "\n") rl.output.write(s);
        else rl.output.write("*".repeat(s.length));
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const q = (v) => (v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

/** SQL'i geçici dosyaya yazıp wrangler ile çalıştırır (komut satırında kaçış sorunu olmasın diye) */
function runSql(sql, { json = false } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "jupiter-admin-"));
  const file = path.join(dir, "q.sql");
  writeFileSync(file, sql);
  try {
    const wrangler = path.join(root, "node_modules/wrangler/bin/wrangler.js");
    const args = [wrangler, "d1", "execute", DB_NAME, remote ? "--remote" : "--local", "--file", file, "--yes"];
    if (json) args.push("--json");
    const r = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
    if (r.status !== 0) {
      console.error(r.stdout, r.stderr);
      throw new Error("Veritabanı komutu başarısız.");
    }
    return r.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function adminExists() {
  const out = runSql("SELECT COUNT(*) AS n FROM admin_user;", { json: true });
  const parsed = JSON.parse(out.slice(out.indexOf("[")));
  return parsed[0].results[0].n > 0;
}

async function askEmail(current) {
  const env = process.env.ADMIN_EMAIL;
  if (env) return env.trim();
  const e = (await ask(current ? `E-posta (boş = ${current} kalsın): ` : "E-posta: ")).trim();
  if (!e && current) return current;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error("Geçerli bir e-posta girin.");
  return e;
}

async function askPassword() {
  const env = process.env.ADMIN_PASSWORD;
  const p1 = env ?? (await ask("Şifre (en az 10 karakter): ", { hidden: true }));
  if (p1.length < 10) throw new Error("Şifre en az 10 karakter olmalı.");
  if (!env) {
    const p2 = await ask("Şifre (tekrar): ", { hidden: true });
    if (p1 !== p2) throw new Error("Şifreler aynı değil.");
  }
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(p1, Buffer.from(salt, "hex"), PBKDF2_ITER, 32, "sha256").toString("hex");
  return { salt, hash };
}

async function main() {
  console.log(`[admin] ${where}`);
  if (command === "create") {
    if (adminExists()) throw new Error("Admin hesabı zaten var. Şifreyi değiştirmek için: npm run admin:reset-password");
    const email = await askEmail();
    const { salt, hash } = await askPassword();
    runSql(
      `INSERT INTO admin_user (id, email, password_hash, password_salt, pbkdf2_iter) VALUES (1, ${q(email)}, ${q(hash)}, ${q(salt)}, ${PBKDF2_ITER});
       INSERT INTO activity_log (action) VALUES ('Admin hesabı oluşturuldu');`,
    );
    console.log(`[admin] Hesap oluşturuldu: ${email}. İlk girişte 2FA kurulumu istenecek (/admin/giris).`);
  } else if (command === "reset-password") {
    if (!adminExists()) throw new Error("Henüz hesap yok. Önce: npm run admin:create");
    const current = JSON.parse(
      (() => {
        const o = runSql("SELECT email FROM admin_user WHERE id = 1;", { json: true });
        return o.slice(o.indexOf("["));
      })(),
    )[0].results[0].email;
    const email = await askEmail(current);
    const { salt, hash } = await askPassword();
    runSql(
      `UPDATE admin_user SET email = ${q(email)}, password_hash = ${q(hash)}, password_salt = ${q(salt)},
         pbkdf2_iter = ${PBKDF2_ITER}, updated_at = datetime('now') WHERE id = 1;
       DELETE FROM sessions;
       INSERT INTO activity_log (action) VALUES ('Şifre komut satırından değiştirildi');`,
    );
    console.log("[admin] Şifre değişti, tüm oturumlar kapatıldı.");
  } else if (command === "reset-2fa") {
    if (!adminExists()) throw new Error("Henüz hesap yok. Önce: npm run admin:create");
    runSql(
      `UPDATE admin_user SET totp_secret = NULL, totp_pending = NULL, totp_last_step = 0, backup_codes = '[]',
         updated_at = datetime('now') WHERE id = 1;
       DELETE FROM sessions;
       INSERT INTO activity_log (action) VALUES ('2FA komut satırından sıfırlandı');`,
    );
    console.log("[admin] 2FA sıfırlandı. Sonraki girişte QR ile yeniden kurulacak; tüm oturumlar kapatıldı.");
  } else {
    console.log("Kullanım: npm run admin:create | admin:reset-password | admin:reset-2fa   (canlı için: -- --remote)");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(`[admin] HATA: ${e.message}`);
  process.exitCode = 1;
});
