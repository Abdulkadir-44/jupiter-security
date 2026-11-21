/**
 * Sitedeki gerçek fotoğraflar (iki dil ortak kullanır).
 * Kaynak: proje kökündeki `fotograflar/` (gitignore'da, orijinaller orada). Buradakiler kırpılmış,
 * küçültülmüş ve konum bilgisi silinmiş kopyalardır; plaka, yüz ve başka işletme tabelaları bulanıktır.
 * Astro build sırasında her ekran boyu için WebP üretir.
 * Admin paneli gelince bu fotoğraflar R2'ye taşınacak ve panelden değiştirilebilecek.
 */
import gunesPalmiye from "@/assets/medya/gunes/gunes-enerjili-kamera-palmiye.jpg";
import gunesElektrikDiregi from "@/assets/medya/gunes/gunes-enerjili-kamera-elektrik-diregi-santiye.jpg";
import gunesCamAgaci from "@/assets/medya/gunes/gunes-enerjili-kamera-cam-agaci.jpg";
import gunesSantiyeDiregi from "@/assets/medya/gunes/gunes-enerjili-kamera-santiye-diregi.jpg";
import gunesPalmiyeMontaj from "@/assets/medya/gunes/gunes-enerjili-kamera-palmiye-montaj.jpg";
import gunesKonteyner from "@/assets/medya/gunes/gunes-enerjili-kamera-konteyner-diregi.jpg";

/*
 * Ürün vitrini: GEÇİCİ görseller (Jüpiter ürün fotoğraflarını gönderince değişecek).
 * Bullet, güneş enerjili ve NVR: Jüpiter'in kendi kurulum fotoğrafları.
 * Dome (Alex Knight), PTZ (Miguel A Amutio), Wi-Fi (Jakub Żerdzicki): Unsplash, ücretsiz Unsplash Lisansı
 * (ticari kullanım serbest, kaynak gösterme zorunlu değil). Not: "dome" görseli aslında tavana asılı kutu kamera.
 */
import urunBullet from "@/assets/medya/urunler/bullet-kamera.jpg";
import urunDome from "@/assets/medya/urunler/dome-kamera.jpg";
import urunPtz from "@/assets/medya/urunler/ptz-kamera.jpg";
import urunGunes from "@/assets/medya/urunler/gunes-enerjili-4g-kamera.jpg";
import urunWifi from "@/assets/medya/urunler/wifi-kamera.jpg";
import urunNvr from "@/assets/medya/urunler/nvr-kayit-ekrani.jpg";

export const media = {
  urunler: {
    bullet: urunBullet,
    dome: urunDome,
    ptz: urunPtz,
    gunes: urunGunes,
    wifi: urunWifi,
    nvr: urunNvr,
  },
  gunes: {
    palmiye: gunesPalmiye,
    elektrikDiregi: gunesElektrikDiregi,
    camAgaci: gunesCamAgaci,
    santiyeDiregi: gunesSantiyeDiregi,
    palmiyeMontaj: gunesPalmiyeMontaj,
    konteyner: gunesKonteyner,
  },
};

/**
 * "Yaptığımız kurulumlar" klasörleri: src/assets/medya/klasorler/<klasör-id>/<NN-ad>.jpg
 * Klasöre dosya eklemek yeterli; sıra dosya adındaki numaraya göre. Açıklamalar site.*.ts → work.folders[].captions
 * içinde dosya adıyla (uzantısız) eşleşir.
 */
const folderFiles = import.meta.glob<ImageMetadata>("/src/assets/medya/klasorler/*/*.jpg", { eager: true, import: "default" });

export type FolderPhoto = { slug: string; image: ImageMetadata };

export function folderPhotos(folderId: string): FolderPhoto[] {
  return Object.entries(folderFiles)
    .filter(([path]) => path.includes(`/klasorler/${folderId}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, image]) => ({ slug: path.split("/").pop()!.replace(/\.jpg$/, ""), image }));
}

/** Bir fotoğraf: build sırasında optimize edilen dosya ya da (ileride admin/R2'den gelen) adres */
export type Photo = ImageMetadata | string;
