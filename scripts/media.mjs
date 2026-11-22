/**
 * Sitedeki fotoğrafları yayına hazırlar: src/assets/ altındaki JPG'lerden WebP (hero için ayrıca AVIF)
 * kopyalar üretir ve boyut bilgilerini bir listeye yazar.
 *
 *   Çıktı:  public/medya/foto/<klasör>/<ad>-<genişlik>.webp   (gitignore'da, her build'de yeniden üretilir)
 *   Liste:  src/content/media.manifest.json                    (gitignore'da)
 *
 * Neden: Sayfalar artık her istekte sunucuda oluşturuluyor (veritabanından okumak için). Astro'nun görsel
 * küçültmesi sadece build'de hazırlanan sayfalarda çalıştığı için fotoğraflar burada önceden hazırlanır.
 * Admin panelinden yüklenen fotoğraflar (5. aşama, R2) da aynı adres düzenini ve genişlikleri kullanır.
 *
 * Sadece değişen fotoğraflar yeniden işlenir. `npm run dev` / `npm run build` bunu kendiliğinden çalıştırır.
 * Elle: `npm run media`
 */
import { mkdir, readdir, stat, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcRoot = path.join(root, "src/assets");
const outRoot = path.join(root, "public/medya/foto");
const manifestPath = path.join(root, "src/content/media.manifest.json");

/** Kaynak klasörler. `widths`: üretilecek genişlikler (orijinalden büyükleri atlanır). */
const groups = [
  // Hero: sayfanın ilk görseli, büyük ekranlar için 2400 px ve AVIF de üretilir
  { dir: "hero", files: ["8fLnkZ8Y0eM.jpg"], widths: [640, 1024, 1600, 2400], formats: ["avif", "webp"] },
  { dir: "medya/gunes" },
  { dir: "medya/urunler" },
  { dir: "medya/klasorler", nested: true },
];
const DEFAULT_WIDTHS = [480, 960, 1600];
const quality = { webp: 78, avif: 52 };

async function listJpgs(dir, nested) {
  const abs = path.join(srcRoot, dir);
  const entries = await readdir(abs, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (e.isDirectory() && nested) out.push(...(await listJpgs(path.join(dir, e.name), false)));
    else if (e.isFile() && /\.jpe?g$/i.test(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

const mtime = async (p) => (await stat(p).catch(() => null))?.mtimeMs ?? 0;

const manifest = {};
let made = 0;

for (const g of groups) {
  const files = g.files ? g.files.map((f) => path.join(g.dir, f)) : await listJpgs(g.dir, g.nested);
  for (const rel of files.sort()) {
    const src = path.join(srcRoot, rel);
    // Anahtar: "medya/" öneki olmadan, uzantısız ve "/" ile (ör. "klasorler/kafe-isyeri/01-kafe-ic-mekan-gunduz")
    const key = rel.replace(/\\/g, "/").replace(/^medya\//, "").replace(/\.jpe?g$/i, "");
    const meta = await sharp(src).metadata();
    const w0 = meta.autoOrient?.width ?? meta.width;
    const h0 = meta.autoOrient?.height ?? meta.height;
    const wanted = g.widths ?? DEFAULT_WIDTHS;
    let widths = wanted.filter((w) => w < w0);
    if (widths.length < wanted.length) widths.push(w0); // orijinal boyut en büyük kopya olur
    const formats = g.formats ?? ["webp"];
    const srcTime = await mtime(src);

    for (const w of widths) {
      for (const f of formats) {
        const out = path.join(outRoot, `${key}-${w}.${f}`);
        if ((await mtime(out)) > srcTime) continue;
        await mkdir(path.dirname(out), { recursive: true });
        // rotate(): telefon fotoğraflarındaki yön bilgisini uygular. Konum (EXIF/GPS) bilgisi kopyalanmaz.
        const img = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
        await (f === "avif" ? img.avif({ quality: quality.avif }) : img.webp({ quality: quality.webp })).toFile(out);
        made++;
      }
    }
    manifest[key] = { width: w0, height: h0, widths, ...(formats.includes("avif") && { avif: true }) };
  }
}

// Kaynağı silinmiş fotoğrafların eski kopyalarını temizle
async function cleanup(dir) {
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await cleanup(p);
    else {
      const m = path.relative(outRoot, p).replace(/\\/g, "/").match(/^(.*)-(\d+)\.(webp|avif)$/);
      if (!m || !manifest[m[1]]?.widths.includes(Number(m[2]))) await rm(p);
    }
  }
}
await cleanup(outRoot);

const json = JSON.stringify(manifest, null, 2) + "\n";
const old = await readFile(manifestPath, "utf8").catch(() => "");
if (old !== json) await writeFile(manifestPath, json);
console.log(`[media] ${Object.keys(manifest).length} fotoğraf hazır${made ? `, ${made} dosya üretildi` : ""}.`);
