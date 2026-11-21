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

export const media = {
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
