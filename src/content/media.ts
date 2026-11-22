/**
 * Sitedeki gerçek fotoğraflar (iki dil ortak kullanır).
 * Kaynak: proje kökündeki `fotograflar/` (gitignore'da, orijinaller orada). src/assets/medya/ altındakiler kırpılmış,
 * küçültülmüş ve konum bilgisi silinmiş kopyalardır; plaka, yüz ve başka işletme tabelaları bulanıktır.
 *
 * `scripts/media.mjs` bunlardan WebP kopyalar üretir (public/medya/foto/) ve boyutlarını
 * `media.manifest.json`'a yazar. Burada fotoğraflar o listedeki anahtarlarıyla seçilir.
 * Admin panelinde yönetilen fotoğraflar veritabanında aynı biçimde (anahtar + boyut) tutulur.
 */
import manifest from "./media.manifest.json";

/** Bir fotoğraf: adresi `src/lib/photo.ts` üretir (`/medya/foto/<key>-<genişlik>.webp`). */
export interface Photo {
  key: string;
  width: number;
  height: number;
  /** Üretilmiş genişlikler (küçükten büyüğe) */
  widths: number[];
  /** AVIF kopyası da var mı (sadece hero) */
  avif?: boolean;
}

type ManifestEntry = { width: number; height: number; widths: number[]; avif?: boolean };
const entries = manifest as Record<string, ManifestEntry>;

/** Anahtarla fotoğraf seçer; yoksa build hata verir (yanlış yazılmış dosya adı sessizce kaybolmasın). */
export function photo(key: string): Photo {
  const m = entries[key];
  if (!m) throw new Error(`Fotoğraf bulunamadı: "${key}" (src/assets/medya altında mı? npm run media)`);
  return { key, ...m };
}

export const media = {
  /* Unsplash (ücretsiz Unsplash lisansı), "Security cameras mounted on a pole against clouds" https://unsplash.com/photos/8fLnkZ8Y0eM */
  hero: photo("hero/8fLnkZ8Y0eM"),
  /*
   * Ürün vitrini: GEÇİCİ görseller (Jüpiter ürün fotoğraflarını gönderince değişecek).
   * Bullet, güneş enerjili ve NVR: Jüpiter'in kendi kurulum fotoğrafları.
   * Dome (Alex Knight), PTZ (Miguel A Amutio), Wi-Fi (Jakub Żerdzicki): Unsplash, ücretsiz Unsplash Lisansı
   * (ticari kullanım serbest, kaynak gösterme zorunlu değil). Not: "dome" görseli aslında tavana asılı kutu kamera.
   */
  urunler: {
    bullet: photo("urunler/bullet-kamera"),
    dome: photo("urunler/dome-kamera"),
    ptz: photo("urunler/ptz-kamera"),
    gunes: photo("urunler/gunes-enerjili-4g-kamera"),
    wifi: photo("urunler/wifi-kamera"),
    nvr: photo("urunler/nvr-kayit-ekrani"),
  },
  gunes: {
    palmiye: photo("gunes/gunes-enerjili-kamera-palmiye"),
    elektrikDiregi: photo("gunes/gunes-enerjili-kamera-elektrik-diregi-santiye"),
    camAgaci: photo("gunes/gunes-enerjili-kamera-cam-agaci"),
    santiyeDiregi: photo("gunes/gunes-enerjili-kamera-santiye-diregi"),
    palmiyeMontaj: photo("gunes/gunes-enerjili-kamera-palmiye-montaj"),
    konteyner: photo("gunes/gunes-enerjili-kamera-konteyner-diregi"),
  },
};

/** "Yaptığımız kurulumlar" klasöründeki bir fotoğraf */
export type FolderPhoto = { image: Photo; caption: string; area?: string };

/**
 * Bir klasörün fotoğrafları: src/assets/medya/klasorler/<klasör-id>/<NN-ad>.jpg
 * Klasöre dosya eklemek yeterli; sıra dosya adındaki numaraya göre. `captions` dosya adıyla (uzantısız) eşleşir.
 */
export function folderPhotos(
  folderId: string,
  captions: Record<string, { caption: string; area?: string }>,
): FolderPhoto[] {
  const prefix = `klasorler/${folderId}/`;
  return Object.keys(entries)
    .filter((k) => k.startsWith(prefix))
    .sort()
    .map((k) => {
      const c = captions[k.slice(prefix.length)];
      return { image: photo(k), caption: c?.caption ?? "", ...(c?.area && { area: c.area }) };
    });
}
