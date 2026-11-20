# Rapor: HeroScrub (21st.dev) bileşeni

## Bu bileşen ne yapıyor?
Apple ürün sayfalarındaki etkinin aynısı. Bir videonun karelerinden oluşan bir resim dizisi, sayfa kaydırıldıkça kare kare oynatılıyor. Video, aslında 300 ayrı resmin sırayla bir `<canvas>`'a çizilmesi.

Kaydırınca olanlar:
1. Ortada küçük bir kart duruyor, kartın üstünde ve altında iki dev başlık var (demoda "FERRARI" ve "AMALFI").
2. Kaydırmaya başlayınca başlıklar sağa ve sola kayıp kayboluyor, kart büyüyüp tüm ekranı kaplıyor ve video kaydırmayla birlikte oynuyor.
3. Sonunda kart küçülüyor ve başlıklar geri geliyor.

Bölüm yaklaşık 4 ekran boyu uzunluğunda (420vh). Yani bu etki için kullanıcı 4 ekran boyu kaydırıyor.

## Yapılabilir mi?
**Evet.** Projemiz gereken her şeyi zaten karşılıyor:

| Gereksinim | Bizde durum |
|---|---|
| React + TypeScript | Var (Astro içinde React adası olarak çalışır) |
| Tailwind CSS | Var (v4) |
| shadcn yapısı (`components/ui`, `@/` kısayolu, `cn()`) | Var: `src/components/ui/` ve `src/lib/utils.ts` hazır. shadcn CLI kurmaya gerek yok. |
| `gsap` paketi | **Yok, kurulacak.** Ücretsiz (v3.15.1), ScrollTrigger dahil. Ben kurarım. |

## Ekstra kaynak gerekiyor mu?
**Evet, tek ama çok önemli bir kaynak gerekiyor: video ya da kare dizisi.**

- Demodaki 300 Ferrari karesi başkasının GitHub hesabından çekiliyor ve telif hakkı bize ait değil. **Kullanamayız.** Ayrıca bir kamera firmasında Ferrari göstermek anlamsız olur.
- Bizim için kısa bir video lazım (5–10 saniye, yatay). Örnekler:
  - **En iyisi:** Müşterinizin gerçek bir montajından çekim. Kameranın direğe takılması, kablo çekme, aracın gelişi ya da bir binanın etrafında dönen telefon/drone çekimi.
  - **Alternatif:** Ücretsiz lisanslı stok video (Pexels, Pixabay). "security camera", "cctv rotating" gibi aramalarla iyi çekimler bulunuyor.
  - **Alternatif:** Yapay zekâ ile üretilmiş video (Veo, Kling, Runway vb.). Ama "AI hissi" vermesin diye dikkatli seçmek gerekir.
- **Videoyu karelere bölmek için ffmpeg gerekiyor, bilgisayarınızda kurulu değil.** Kurmak için:
  `! winget install Gyan.FFmpeg`
  Siz kurun ya da onay verin, ben kurayım. Video gelince kareye bölme, boyutlandırma ve webp'ye çevirme işini ben yaparım.

Ben kendi başıma gerçekçi bir video üretemiyorum. Videoyu sizin bulmanız ya da seçmeniz gerekiyor. İsterseniz stok video sitelerinde aday linkler arayıp size sunabilirim.

## Uyarlamam gereken yerler
1. **Prompt'taki CSS bloğunu eklemeyeceğim.** Bileşen o değişkenlerin hiçbirini kullanmıyor. Üstelik blok hatalı: `var(----...)` şeklinde dört tire var, yani değişkenler hiçbir yere bağlanmıyor. Ayrıca kırmızı vurgu rengi ve Inter, Boldonse, EB Garamond fontlarını dayatıyor. Renk ve fontları ui-ux-pro-max ile yeniden belirleyeceğiz.
2. **Hareketi azaltma ve hata durumu:** Kullanıcı "hareketi azalt" ayarını açmışsa ya da kareler yüklenemezse kart **boş** kalıyor. Videodan bir kapak resmi (poster) ekleyip boş görünmesini engelleyeceğim.
3. **Performans:** 300 kare × ~80 KB ≈ 24 MB. Telefonda çok ağır olur. Önerim:
   - Masaüstünde ~150 kare, 1280px genişlik
   - Mobilde ~90 kare, 720px genişlik
   - Hedef toplam boyut: masaüstü 4–6 MB, mobil 2 MB civarı
   - Cloudflare'in ücretsiz katmanında statik dosyalar ücretsiz servis ediliyor. Maliyet sorunu yok, sorun sadece hız.
4. **Erişilebilirlik:** Başlıklar `aria-hidden` ve bölüm etiketi İngilizce. Bölüm etiketini Türkçeye çevirip ekran okuyucular için gizli bir başlık ekleyeceğim.
5. **İki animasyon kütüphanesi:** GSAP ve Motion birlikte çalışır, çakışmaz. Sayfaya ~35–40 KB (sıkıştırılmış) ek yük getirir. Sorun değil, ama ileride tek kütüphaneye geçmek isterseniz söyleyin.
6. **Türkçe büyük harf:** Başlıklar büyük harfe çevriliyor. Sayfa `lang="tr"` olduğu için "i" doğru şekilde "İ" oluyor (JÜPİTER, GÜVENLİK). Bu konuda sorun yok.

## Kurallarımızla çelişki var mı?
Yok. Bileşende mor, form ya da harita yok. Demodaki yeşil arka plan (`#3a9b8a`) ayarlanabiliyor, yeni renklerimize göre seçeceğiz.

## Başlık önerileri (üst / alt)
- JÜPİTER / GÜVENLİK
- KÖR NOKTA / YOK
- GÖZÜMÜZ / ÜZERİNDE

## Önerim ve sıradaki adım
Bileşeni **hero olarak, uyarlayarak** kullanalım. Kurulum, poster resmi ve performans düzenlemeleri benden. Sizden gereken tek şey **video**.

Sıra:
1. Video kaynağına karar verin (gerçek çekim, stok ya da AI). İsterseniz stok aday linkleri ben bulayım.
2. ffmpeg kurulsun.
3. Ben gsap'i kurayım, bileşeni uyarlayayım, renk ve fontları ui-ux-pro-max ile yeniden belirleyeyim.
4. Video gelene kadar geçici bir kare dizisiyle çalışır halde hazırlayabilirim, video gelince sadece kareler değişir.
