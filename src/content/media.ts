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

import kafeIcMekan from "@/assets/medya/isler/kafe-ic-mekan-kamera-goruntusu.jpg";
import kafeOnuGunduz from "@/assets/medya/isler/kafe-onu-gunduz-kamera-goruntusu.jpg";
import kafeOnuGece from "@/assets/medya/isler/kafe-onu-gece-kamera-goruntusu.jpg";
import kafeBahcesiGece from "@/assets/medya/isler/kafe-bahcesi-gece-kamera-goruntusu.jpg";
import kayitEkrani from "@/assets/medya/isler/kayit-ekrani-13-kamera.jpg";
import kayitCihazi from "@/assets/medya/isler/kayit-cihazi-monitor-montaji.jpg";

export const media = {
  gunes: {
    palmiye: gunesPalmiye,
    elektrikDiregi: gunesElektrikDiregi,
    camAgaci: gunesCamAgaci,
    santiyeDiregi: gunesSantiyeDiregi,
    palmiyeMontaj: gunesPalmiyeMontaj,
    konteyner: gunesKonteyner,
  },
  isler: {
    kafeIcMekan,
    kafeOnuGunduz,
    kafeOnuGece,
    kafeBahcesiGece,
    kayitEkrani,
    kayitCihazi,
  },
};

/** Bir fotoğraf: build sırasında optimize edilen dosya ya da (ileride admin/R2'den gelen) adres */
export type Photo = ImageMetadata | string;
