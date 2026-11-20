# JÜPİTER Kamera Güvenlik Sistemleri: Web Sitesi Planı (Faz 1: Ana Sayfa)

## Context
Kullanıcı, müşterisi olan **JÜPİTER Kamera Güvenlik Sistemleri** (İskenderun, Hatay) için animasyonlu, etkili ve güzel görünen bir tanıtım sitesi yapmak istiyor. Firma yalnızca kamera sistemleri kuruyor: malzemeyi temin edip sıfırdan, anahtar teslim montaj yapıyor. Alarm, diafon ya da akıllı ev hizmeti yok. Her kesime (ev, dükkan, işyeri, fabrika, site) hizmet veriyor. Gereksinimler soru-cevapla toplandı. **Bu fazın önceliği tasarım**, kapsamı ise sadece ana sayfa. Görsel tasarım, kullanıcının plan modundan sonra yükleyeceği skill'ler doğrultusunda yapılacak. Kullanılacak araçları (Framer Motion vb.) da kullanıcı o aşamada söyleyecek.

## Kararlar (toplanan bilgiler)
| Konu | Karar |
|---|---|
| Kapsam (şimdi) | **Sadece ana sayfa.** Uzun, kaydırmalı ve reklam niteliğinde. Ürünler ile Yapılan İşler sayfaları gerçek içerik gelince yapılacak. Menüde bu sayfalara şimdiden yer bırakılacak. |
| Yapı (ileride) | Karma: ana sayfa + ayrı "Ürünler" ve "Yapılan İşler" sayfaları |
| Teknoloji | **Astro** + React island'ları (kullanıcı React biliyor) |
| Animasyon | **Orta yoğunluk (B)**, **Framer Motion** (`motion` paketi) ile. Animasyonlu parçalar React island olarak yazılacak. |
| Deploy | Cloudflare ücretsiz katmanı, `@astrojs/cloudflare` adapter. Şimdilik statik çıktı. |
| Backend/Admin | **Sonra.** Bu fazda D1, R2 ve admin paneli yok. |
| Formlar | **Hiç form yok** (ne iletişim ne teklif formu); ileride eklenecek |
| İletişim | Tıkla-ara telefon, sabit WhatsApp butonu, Instagram ve sosyal medya linkleri |
| Stil altyapısı | Tailwind CSS v4. 21st.dev bileşenleri (React + Tailwind) doğrudan eklenebilsin diye. `cn()` yardımcı fonksiyonu `src/lib/utils.ts`, `@/` kısayolu hazır. |
| Konum | Firma **gezici**: sabit dükkan yok, iş aracıyla hizmet veriyor. Bu yüzden **Google Maps şimdilik yok**, sabit adres de gösterilmeyecek. Bunun yerine "Hizmet bölgesi: İskenderun ve çevresi / Hatay" ifadesi ve "Adresinize geliyoruz" mesajı kullanılacak. Harita ileride eklenebilir. |
| Dil | Şimdilik Türkçe. Yapı i18n'e hazır olacak (metinler ayrı dosyada, RTL için CSS mantıksal özellikleri). |
| Marka | Logo ve renk yok, Claude üretecek. **MOR/EFLATUN YASAK** ("AI yapımı" görünmesin). Ön fikir: koyu antrasit/lacivert zemin + turuncu/kehribar vurgu. Nihai seçim skill'lere göre yapılacak. |
| İçerik | Gerçek bilgi yok. Claude gerçekçi yer tutucu içerik yazacak. **Tüm metinler tek içerik dosyasında** toplanacak, kullanıcı ya da Claude sonradan değiştirecek. |

## Önerilen ana sayfa bölümleri (skill'lere göre netleşecek)
1. **Header/Nav:** logo, menü (Ana Sayfa, Hizmetler, Ürünler*, Yapılan İşler*, İletişim; * = ileride ayrı sayfa), telefon CTA
2. **Hero / giriş sahnesi:** kamera merceği dönüp odaklanma + tarama çizgisi animasyonu, ana slogan, "Hemen Ara" ve "WhatsApp" butonları
3. **Kampanya/duyuru şeridi** (içerik dosyasından; boşsa gizlenir)
4. **Hizmetler:** keşif → malzeme temini → montaj → telefondan izleme kurulumu → bakım (süreç adımları animasyonlu)
5. **Kullanım alanları:** Ev, Dükkan/İşyeri, Fabrika/Depo, Site/Apartman kartları
6. **Neden JÜPİTER:** animasyonlu sayaçlar (yıl, kurulum sayısı, garanti; yer tutucu)
7. **Ürün/paket önizleme:** birkaç örnek paket kartı ve ileride "Tüm Ürünler" sayfasına bağlantı
8. **Yapılan İşler önizleme:** yer tutucu galeri ve ileride "Tüm İşler" sayfasına bağlantı
9. **Müşteri yorumları:** kaydırmalı yorum kartları
10. **İletişim:** telefon, WhatsApp, hizmet bölgesi ("Adresinize geliyoruz"), sosyal medya (harita yok)
11. **Footer** ve **sabit WhatsApp butonu**

## Proje yapısı (taslak)
```
website-plan/
  astro.config.mjs          # @astrojs/react + @astrojs/cloudflare
  src/
    content/site.tr.ts      # TÜM metinler + iletişim bilgileri + paketler + yorumlar (tek düzenleme noktası)
    lib/data.ts             # İçeriği okuyan tek katman; ileride D1/API'ye geçiş buradan yapılır
    components/             # Astro bileşenleri (statik bölümler)
    components/motion/      # React + Framer Motion island'ları (hero, sayaçlar, reveal'ler)
    layouts/BaseLayout.astro
    pages/index.astro
    styles/tokens.css       # renk/tipografi token'ları
  public/                   # logo SVG, favicon, görseller
```
- Veri katmanı (`lib/data.ts`) ileride admin paneli için D1'e bağlanacak. Bu yüzden bileşenler veriyi doğrudan dosyadan değil, bu katmandan okuyacak.
- Animasyonlarda `prefers-reduced-motion` desteği olacak. Hero animasyonu mobilde hafifletilecek.

## Sonraki fazlar (şimdi yapılmayacak)
- Ürünler ve Yapılan İşler sayfaları
- Backend: D1 (SQLite), R2 (fotoğraf; ücretsiz 10 GB, ödeme yöntemi eklemek gerekebilir), yüklemeden önce tarayıcıda görsel sıkıştırma
- Admin paneli (tek kullanıcı, rol yok; şifre hash'i, oturum çerezi, giriş denemesi sınırlaması). Modüller: Yapılan İşler galerisi, site/iletişim ayarları, ürünler/paketler (fiyatlı), müşteri yorumları, kampanya/duyurular
- Formlar (iletişim/teklif) ve "gelen mesajlar" modülü
- Çoklu dil (Arapça/İngilizce)
- Google Maps / konum gösterimi (firma sabit bir adrese geçerse veya hizmet bölgesi haritası istenirse)

## Uygulama adımları (plan onayından sonra)
1. Kullanıcının söyleyeceği araçları ve yükleyeceği skill'leri al, tasarım yönünü skill'lere göre belirle (renk, tipografi, logo).
2. Astro projesini kur (`npm create astro`), React, Cloudflare adapter ve Framer Motion'ı ekle.
3. Token'ları, logo SVG'yi ve içerik dosyasını oluştur.
4. Bölümleri sırayla yaz, animasyonları ekle.
5. Doğrula ve kullanıcıya göster.

## Doğrulama
- `npm run dev` ile yerelde aç. Masaüstü ve 375px mobil genişlikte görsel kontrol yap: yatay kaydırma olmamalı, animasyonlar akıcı olmalı.
- `npm run build` hatasız tamamlanmalı. Mümkünse `wrangler pages dev`/`wrangler dev` ile Cloudflare ortamında da test et.
- Lighthouse: performans ve erişilebilirlik kontrolü. `prefers-reduced-motion` açıkken animasyonların kapandığını doğrula.
- Telefon (tel:), WhatsApp (wa.me) ve sosyal medya linklerinin çalıştığını kontrol et. İçerik dosyasında bir metni değiştirip sayfaya yansıdığını doğrula.

---

## Durum (20.11.2026): Faz 1 ana sayfa ilk sürüm hazır

**Çalıştırma:** `npm run dev` → http://localhost:4321  ·  **Build:** `npm run build` (astro check + build, 0 hata)

### Tasarım kararları
- **Renkler** (`src/styles/global.css`): Gece #0D1B26 (zemin), Güverte #13283A (yüzey), Hat #23405A, Sis #E4ECF1 (metin), Kurşun #8DA2B4, Kehribar #F0A23B (vurgu), Kireç #E9EEEC (açık bölümler). Mor yok.
- **Font:** Archivo (değişken genişlik; başlıklar geniş kesim 125), kamera ekranı yazıları için IBM Plex Mono. Türkçe karakter destekli, siteden yükleniyor (Google'a istek yok).
- **İmza an:** Hero'da mercek açılıp netleşiyor, dükkan planı çiziliyor, 4 kameranın görüş alanı sırayla yayılıyor ("kör nokta yok").
- **Diğer animasyonlar:** süreç bölümünde kaydırdıkça dolan kablo hattı, kullanım alanı sekmelerinde geçiş, sayaçlar. Hepsi `prefers-reduced-motion` ile kapanıyor.

### Dosya haritası
| Ne değiştirmek istiyorsanız | Dosya |
|---|---|
| Tüm metinler, telefon, WhatsApp, paketler, yorumlar, kampanya | `src/content/site.tr.ts` (YER TUTUCU yazanlar sahte) |
| Renk / font token'ları | `src/styles/global.css` |
| Bölüm sırası | `src/pages/index.astro` |
| Bölümler | `src/components/sections/*.astro` |
| Animasyonlu parçalar (React + motion) | `src/components/motion/*.tsx` |
| Logo | `src/components/Logo.astro`, `public/favicon.svg` |

---

## Yeniden tasarım (v2): Super 8 ilhamlı, sakin animasyon

**Referanslar:** supereightstudio.com (renk, panel düzeni, fontlar, header, footer) ve kullanıcının attığı kamera şablonu (tam ekran fotoğraflı hero). Birebir kopya yok; header davranışı kullanıcının isteğiyle aynı mantıkta yeniden yazılacak.
**Skill:** sadece ui-ux-pro-max (frontend-design kullanılmayacak).

### Renkler (Super 8'den daha açık)
| Ad | Hex | Kullanım |
|---|---|---|
| Lacivert | #1B2A44 | Koyu bölümler, hero karartma |
| Derin lacivert | #13203A | Metin (açık zeminde), footer |
| Turkuaz | #17A8A2 | Tek vurgu: buton, ikon, istatistik kartı |
| Koyu turkuaz | #0F766E | Açık zeminde turkuaz metin (kontrast için) |
| Krem | #F3F1EB | Açık bölümler, paneller |
| Kırık beyaz | #F6F5F1 | Koyu zeminde metin |
| Mercan | #E8573A | Sadece logodaki "Büyük Kırmızı Leke" (Jüpiter'in gerçek lekesi) |

ui-ux-pro-max kaynağı: "Real Estate/Property" paleti (güven turkuazı + profesyonel mavi + açık zemin). Mor yok.

### Fontlar (üçü de Türkçe destekli, siteden yüklenir)
- **Big Shoulders** (dar, uzun): dev başlıklar, büyük harf
- **Instrument Serif**: bölüm başlıkları, alıntılar
- **Instrument Sans**: gövde metni, menü, butonlar

### Header (Super 8 davranışı)
- Sayfa başında: şeffaf, tam genişlik, 80px, altında ince çizgi.
- Aşağı kaydırınca: yüzen "hap" şekline dönüşür. Ortalanır (en fazla 1040px), 66px, üstten 12px boşluk, tam yuvarlak köşeler, %86 lacivert + bulanık cam efekti + gölge. Alt çizgi ortadan kapanır.
- "Hemen ara" butonu hap içinde krem renkli yuvarlak butona dönüşür; ok ikonu hover'da çapraz kayar.
- Logo işareti birkaç saniyede bir kendi etrafında döner (gezegen dönüşü).
- Mobilde aynı davranış + açılır menü. Hareketi azalt ayarında animasyonlar kapalı.

### Sayfa akışı
1. **Hero:** tam ekran fotoğraf (Unsplash, ücretsiz lisans: `src/assets/hero/8fLnkZ8Y0eM.jpg`), lacivert karartma, solda dev dar başlık "KÖR NOKTA BIRAKMIYORUZ", kısa açıklama, Ara / WhatsApp butonları, altta bilgi satırı (Bölge, Hizmet, Destek).
2. **Hizmet bölgeleri şeridi** (sade, animasyonsuz).
3. **Nasıl çalışıyoruz:** krem panel, 5 adım.
4. **Kör nokta bırakmıyoruz:** eski hero'daki kamera planı animasyonu buraya taşınır, yeni renklere uyarlanır, ekrana girince oynar. Üst üste binen alanlar düzeltilir.
5. **Kullanım alanları:** sekmeler.
6. **Paketler.**
7. **Yorumlar + büyük turkuaz istatistik kartı** (sayaç animasyonu kalkıyor).
8. **Yapılan işler.**
9. **Kapanış:** dev çağrı "KAMERANIZI KURALIM." + dev logolu footer.

### Animasyon bütçesi (az ve hafif)
Kalanlar: header dönüşümü, logo dönüşü, hero'da başlığın bir kez yükselmesi, kamera planı sahnesi, sekme geçişi. Kalkanlar: kaydırmaya bağlı süreç çizgisi, sayaçlar, yumuşak kaydırma kütüphanesi.

### Durum (v2 uygulandı)
- Header (Super 8 davranışı), fotoğraflı hero, krem paneller, yeni fontlar ve renkler, kamera planı kendi bölümünde, dev logolu footer tamam.
- Kaldırılanlar: sayaçlar (Counter), kaydırmaya bağlı süreç çizgisi (ProcessTimeline), "Neden JÜPİTER" bölümü (istatistik artık yorumların yanında).
- Kampanya şeridi (`Announcement.astro`) sayfadan çıkarıldı ama dosyası duruyor; istenirse `index.astro`'ya geri eklenir.
- Hero fotoğrafı: Unsplash 8fLnkZ8Y0eM (ücretsiz lisans). Yedekler: `src/assets/hero/oQD9uq4Rd4I.jpg`, `0869R4ncaH8.jpg`.

---

## Durum (20.11.2026): Tasarım onaylandı ✅

Kullanıcı ana sayfa tasarımını onayladı. Son eklenenler:
- **Müşterilerimiz ne diyor** (`src/components/motion/ReviewsMotion.tsx`): kartlar sağdan/soldan yaylanarak gelir, alıntılar kelime kelime belirir, 850+ kartı dairesel açılır ve sayar, fareyle 3D eğilme.
- **Hazır paketler** (`src/components/motion/PackagesMotion.tsx`): kartlar aşağıdan yükselir, kamera sayıları kayarak gelir, tikler çizilerek belirir, öne çıkan pakette parlama, fareyi takip eden ışık.

## Durum (20.11.2026): Mobil düzenlemeler ✅ (yayında)
- **Kenar boşluğu:** mobilde tüm içerik ekran kenarından 32px içeride (`wrap` = 2rem; panel içinde 0.5rem margin + 1.5rem padding). Masaüstü değişmedi.
- **Hero:** başlık mobilde küçültüldü (`clamp(3rem,15vw,4.5rem)`, 320px'te bile taşmıyor); Bölge/Hizmet/Destek mobilde ortalı.
- **Footer:** panel değil, tam genişlik ve köşesiz; mobilde içerik ortalı.
- **Kullanım alanları sekmeleri:** mobilde 2×2 ızgara (yatay kaydırma kaldırıldı), küçük yazı/buton; masaüstünde dikey liste aynı.
- **Önerilen kamera kutusu → NVR kanal ızgarası** (`UseCaseTabs.tsx` içinde `ChannelGrid`): 32 kanallık ızgarada alt sınır dolu sarı, üst sınıra kadar "ihtiyaca göre" çerçeveli; sekme değişince kanallar sırayla yanar, tarama çizgisi geçer. Aralık `site.tr.ts` → `cameras` ("2–4 kamera") alanından okunur.
- Kontrol: Playwright ile 320 / 390 / 1440px, yatay taşma yok. Yayına almak için: `npm run deploy`.

## Durum (20.11.2026): Yeni palet ve son düzenlemeler ✅ (yayında)
- **Palet: adaçayı yeşili** (kullanıcı onayladı, "eski mavi halinden daha iyi"). Kullanıcının renkleri: #5C7057 #89A482 #ACC5A6 #D1EDD3; koyu tonlar #5C7057'den türetildi (#2B3828 zemin, #364633 kart, #1A2418 koyu metin). Token adları (navy, teal, cream) eskisi gibi, değerleri yeşil. Tüm renkler `src/styles/global.css` `@theme` içinde; bileşenlerde sabit renk kodu yok.
- **Sarı vurgu `sun` #E8C872:** "çalışan kamera" rengi. Kamera planındaki ışık konileri ve NVR kanal ızgarası. NVR kutusu koyu ekran görünümünde.
- **Hero sloganı animasyonu** (`src/components/motion/HeroTitle.tsx`): "KÖR NOKTA" harfleri bulanıktan netleşir, "BIRAKMIYORUZ" tarama çubuğuyla açılır (6 sn'de bir tekrar geçer), köşelere vizör çerçevesi oturur.
- **Masaüstü:** paneller (süreç, paketler, yapılan işler) kenardan kenara ve köşesiz; kapanış başlığı ve footer logosu küçültüldü, logo ortalı.
- **"Nasıl çalışıyoruz" mobil/tablet:** her adım ayrı kart, sırayla sola/sağa yatık; kaydırınca yukarıdan düşüp yaylanarak oturur (hafif script + CSS, `Process.astro`). Masaüstü aynı.
- **İçerik:** süreç adımı "Montaj ve kablolama" → "Montaj" (kullanıcı değiştirdi).
- **og.jpg** ve **apple-touch-icon.png** yeşil palette yeniden üretildi.
- **"Hizmet verdiğimiz yerler" mobil:** ilçeler 2 sütunlu, satır başına ip hattı; her kart sarı pinli bir iple asılı ve hafif yatık. Kaydırınca yukarıdan düşüp sarkaç gibi sallanarak oturur (CSS + küçük script, `Areas.astro`). Masaüstü/tablet aynı. Yayında (`cb0cfc8`).
- **Yeni bölüm: güneş enerjili 4G kameralar** (müşteri isteği; bağ, bahçe, yayla, yazlık): `RemoteSites.astro`, "Nereyi korumak istiyorsunuz?" ile "Hazır paketler" arasında. Sol: metin, yer etiketleri, avantajlar, sarı WhatsApp butonu. Sağ: animasyonlu sistem kartı (güneş, tepeler, direkte panel + kamera, baz istasyonuna sinyal) + "Güneş paneli → Batarya → 4G kamera → Telefon" zinciri. Saf CSS animasyon. Google'a giden hizmet listesine de eklendi.
- Geri dönüş noktaları: mavi palet `bd4b283`, yeşil palet ilk hali `4bc8bb7`.

## Müşteri bilgileri geldi: içerik ve yeni bölümler planı (TASLAK, KONUŞULUYOR)

Kaynak: `musteri-bilgileri.txt` (müşteri bilgisi içerdiği için **gitignore'da, GitHub'a gitmez**). Bu bölüm kullanıcıyla konuşulup netleşince uygulanıyor.

**Alınan kararlar:**
- ✅ **Alan adı: `jupiterguvenlik.com`** (Türkçe karakter yok; Natro'dan alınacak). Bölüm 6a/4'teki `.com.tr` önerisinin yerine geçer.
- ✅ **Görseller:** kullanıcı fotoğrafları kategorilere ayırıp verecek; o zamana kadar slider'lı bölümler **şablon** (yer tutucu) olarak kalır.
- ✅ **Sıra:** önce kesin bilgiler (A) güncellenir, açık sorular (B) sonra tek tek konuşulur.

### A) Net olanlar (onaylanınca doğrudan uygulanacak)
- ✅ **Telefon / WhatsApp:** gerçek numara sitede (WhatsApp aynı numara).
- ✅ **İstatistik:** 3 yıl tecrübe, **600+** kurulum, **2 yıl destek ve garanti** (hero'daki bilgi satırında "Garanti: 2 yıl destek ve garanti", süreç adımı 5 ve 600+ kartında).
- ✅ **İlçeler:** mevcut liste kalıyor (İskenderun, Arsuz, Payas, Dörtyol, Belen, Antakya).
- ✅ **Paketler (fiyatlı):** kartta fiyat büyük yazılıyor (`priceFrom` sayı + `priceTemplate`), Google verisinde `minPrice`. 4/8 kanallı kayıt cihazı maddeleri korundu; İşletme paketine yıllık bakım yerine "Telefondan izleme" eklendi.
  | Paket | Kamera | Kayıt | Diğer | Fiyat |
  |---|---|---|---|---|
  | Başlangıç | 2 × 5 MP gece görüşlü | 500 GB | Telefondan izleme, **hareket algılama bildirimi (yeni)** | **9.999 TL'den başlayan** |
  | Ev ve dükkan | 4 × 5 MP gece görüşlü | 500 GB | Telefondan izleme, hareket algılama bildirimi | **14.999 TL'den başlayan** |
  | İşletme | 8 × 5 MP gece görüşlü | 1 TB | Uzaktan çoklu kullanıcı erişimi (yıllık bakım ziyareti **kaldırıldı**) | **29.999 TL'den başlayan** |
  - "Telefondan izleme **kurulumu**" → "Telefondan izleme".
- ✅ **Markalar** (yazımlar müşteri onaylı): Dahua, Hikvision, ZTEC, IOMA; güneş enerjili: O-KAM, IOMA. `site.tr.ts` → `brands`. Gösterim: paketlerin altında "Kullandığımız markalar", güneş enerjili bölümde avantajların altında; Google verisinde `brand`.
- ✅ **Güneş enerjili bölüm:** içerik doğru; **inşaat şantiyesi** vurgusu eklendi (açıklama + ikinci etiket). Sağdaki animasyonlu çizim **kaldırıldı** (git geçmişinde: `48fd8ff`), yerine `PhotoSlider` (vurgu sarı, 4G sinyal ikonu) geldi: şimdilik 3 yer tutucu slayt (Bağ, Bahçe, İnşaat şantiyesi). Fotoğraf eklemek: `public/medya/gunes/` + `site.*.ts` → `remote.slides[].image`.
- ✅ **Yeni bölüm: Wi-Fi (kablosuz) kameralar** (ŞABLON, `WifiCameras.astro`): güneş enerjili bölümün altında, aynı düzen (solda içerik, sağda fotoğraf slider kartı); vurgu rengi yeşil (güneş enerjili sarı). Metin taslak, müşteri ürün özelliklerini (iki yönlü konuşma vb.) teyit edecek. Slider: `PhotoSlider.astro` (yeniden kullanılabilir; kaydırma, oklar, noktalar, otomatik ilerleme). Fotoğraf eklemek: `public/medya/wifi/` + `site.*.ts` → `wifi.slides[].image`.
- **Yeni bölüm: Ürünler slider'ı:** müşterinin kendi çektiği ürün fotoğraflarıyla (telif sorunu yok).
- **Kampanya:** kampanya olduğunda header'ın üstünde banner; olmadığında görünmez (admin panelinden aç/kapa).
- **Alan adı:** `jupiterguvenlik.com`, Natro'dan alınacak.
- **Logo:** "JÜPİTER" yazısının yanına şık ve animasyonlu yeni bir logo işareti.
- **Firma:** kaşede "Jüpiter Güvenlik Sistemleri", limited şirket. E-posta ve sosyal medya hesapları açılacak.

### B) Açık sorular (kullanıcıyla tek tek konuşulacak)
1. ✅ **Alan adı:** `jupiterguvenlik.com` (Türkçe karakterli IDN alan adı yerine; e-posta ve yazım sorunları yüzünden).
2. ✅ **Resmi ad: "Jüpiter Güvenlik Sistemleri"** (kaşe ve alan adıyla aynı; iki dilde de aynı ad). Sitede tam ad, Google verisi, paylaşım etiketleri, footer © satırı, 404 başlığı güncellendi. Logo ve görünen yazı "JÜPİTER" kalıyor. **Google İşletme Profili, Instagram ve haritalarda da birebir bu ad kullanılmalı.**
3. ✅ **Fiyatlar KDV ve montaj dahil.** Her paket kartında fiyatın altında "KDV ve montaj dahil" (EN: "VAT and installation included"); Google verisinde `valueAddedTaxIncluded: true`.
4. ✅ **Paket kartı:** fiyat (büyük) + "Bu paketi sor" WhatsApp butonu birlikte.
5. ✅ **Çalışma saatleri:** "Esnek saatler, WhatsApp'tan randevuyla" (EN: "Flexible hours, book on WhatsApp"); saat müşteriyle WhatsApp'tan belirleniyor. Google verisine saat yazılmıyor (`openingHours: []`).
6. ⏸ **Sahte yorumlar:** kullanıcı kararı: şimdilik **kalacak**, gerçek yorumlar gelince değiştirilecek. (Not: alan adına geçip site Google'a açılmadan önce mutlaka değiştirilmeli.)
7. ⏸ **Instagram:** kullanıcı kararı: şimdilik **kalacak**, hesap açılınca gerçek adresle değiştirilecek.
8. **Ürünler slider'ı:** hangi ürünler, her üründe ne yazacak (ad, marka, model, kısa özellik, fiyat?), sayfada nerede (öneri: "Hazır paketler"in hemen altı)?
9. ✅ **Güneş enerjili bölüm:** animasyonlu çizim kaldırıldı, yerine slider. **SIM kartı Jüpiter temin edip kuruyor** (avantajlara eklendi). Hâlâ eksik: örnek fiyat.
10. ✅ **Wi-Fi bölümü:** metin müşteri tarafından **onaylandı**, olduğu gibi kalıyor. Eksik: marka/model ve fiyat (sonra), fotoğraflar.
11. ✅ **Slider fotoğrafları admin panelinden yönetilecek** → admin tasarım dokümanında galeri kategorili olacak: yapılan işler / güneş enerjili / Wi-Fi / ürünler.
12. **Logo:** mevcut gezegen logosu beğenilmedi mi, yoksa onun daha şık/animasyonlu bir hali mi isteniyor? Tamamen yeni bir konsept mi (ör. gezegen + kamera merceği)?
13. **Yazışma adresi neden gerekli?** (müşteri sordu) KVKK aydınlatma metninde "veri sorumlusu"nun adresi yazılmak zorunda; Google İşletme Profili doğrulaması da adres ister (sitede ve haritada gizli kalabilir). Tam resmi unvan için vergi levhasındaki ad gerekli ("... Ltd. Şti." dahil).
14. **E-posta:** alan adı alınınca `info@jupiterguvenlik.com` gibi bir adres, Cloudflare Email Routing (ücretsiz) ile müşterinin Gmail'ine yönlendirilebilir; e-posta göndermek için ek ayar ya da ücretli posta servisi gerekir.

### C) Önerilen sıra (konuşmaya göre değişebilir)
1. **Net içerik güncellemeleri** (telefon, istatistik, paketler + fiyatlar, sahte yorumların kaldırılması, Instagram gizleme, saat metni) → hemen, kod dosyalarından.
2. **Yeni bölümlerin iskeleti:** güneş enerjili slider, Wi-Fi bölümü, ürünler slider'ı; fotoğraflar gelene kadar şık yer tutucularla.
3. **Logo** (konsept netleşince).
4. **Alan adı + Cloudflare bağlantısı** (Natro'da DNS → Cloudflare), noindex kalkar, Search Console, e-posta yönlendirme.
5. **Admin paneli** (tasarım dokümanına slider galerileri eklenerek).
6. **KVKK sayfası** (unvan + adres gelince), Google İşletme Profili.

## Sıradaki adımlar (önerilen sıra)

### 1. Gerçek içerik: müşteriden bilgi gelince yapılacaklar

> **En kolay yol:** Müşteriden bilgiler gelince Claude'a "müşteri bilgileri geldi" deyip bilgileri yapıştırın. Aşağıdaki listenin hepsini Claude girer: hem Türkçe hem İngilizce, hem ekrandaki metin hem Google'a giden bilgi. Sizin dosyalara dokunmanız gerekmez.
> Liste, neyin nereye gittiğini unutmamak için. Dosyalardaki ilgili satırlarda `YER TUTUCU` yazar.

**A) Müşteriden istenecek bilgiler**

| # | Bilgi | Sitede nereyi etkiler | Dosya / alan (Claude için) |
|---|---|---|---|
| 1 | Telefon ve WhatsApp numarası | Tüm "Ara" ve "WhatsApp" butonları, Google bilgisi | `site.tr.ts` → `contact.phoneDisplay`, `phoneE164`, `whatsapp` (İngilizce otomatik) |
| 2 | Instagram (varsa Facebook) | Footer, iletişim bölümü, Google bilgisi | `site.tr.ts` → `contact.instagram`, `contact.facebook` (İngilizce otomatik) |
| 3 | Çalışma saatleri | İletişim ve footer'daki saat yazısı + Google'daki açılış saatleri | `site.tr.ts` → `contact.hours` **ve** `contact.openingHours`; `site.en.ts` → `contact.hours` (üçü aynı olmalı) |
| 4 | Hizmet verilen ilçeler | Hero altındaki ilçe şeridi + Google'daki hizmet bölgesi | `site.tr.ts` → `contact.serviceAreas` (İngilizce otomatik) |
| 5 | Gerçek istatistik (kurulum sayısı, yıl, garanti) | Yorumlar yanındaki "850+" kartı | `reviews.stat` ve `why.stats`, iki dilde |
| 6 | Gerçek müşteri yorumları (3-4 adet: isim + soyadı baş harfi + semt) | "Müşterilerimiz ne diyor" | `reviews.items`, iki dilde (İngilizceye Claude çevirir) |
| 7 | Paket içerikleri ve fiyat kararı | "Hazır kamera sistemi paketleri" + Google'daki hizmet listesi | `packages.items`, iki dilde |
| 8 | Fiyat aralığı (fiyat yazılacaksa; örn. "4 kamera 15.000 TL'den başlayan") | Paketler + Google'daki fiyat bilgisi (`priceRange`, şu an bilerek boş) | `packages.items[].price` + `src/lib/schema.ts` |
| 9 | Kampanya var mı? | Sayfa üstündeki kampanya şeridi (hazır, şu an kapalı) | `announcement` + `HomePage.astro`'ya geri ekleme |
| 10 | Kurulum fotoğrafları (en az 6, mümkünse hangi ilçe/mekân olduğu yazılı) | "Yaptığımız kamera kurulumları" kareleri, ileride ilçe sayfaları | `work.items` + görseller `src/assets/` |
| 11 | ✅ Alan adı: `jupiterguvenlik.com` | Her şey (bkz. bölüm 6a/4) | `astro.config.mjs` → `site` |

| 12 | **Güneş enerjili 4G kamera bölümü** için onay: metindeki iddialar (gece/bulutlu havada çalışma, kesintiden etkilenmeme, bildirim, gece görüşü) müşterinin kullandığı ürünle uyumlu mu; varsa marka/model, örnek fiyat ve bu tür kurulumların fotoğrafları | "Elektrik yok, internet yok, sorun değil" bölümü | `remote`, iki dilde |

**B) Bilerek boş bırakılanlar (gerçek bilgi gelmeden EKLENMEYECEK)**
- **Google'da yorum yıldızları:** Sitedeki yorumlarla eklenmez (Google kendi sitesindeki yorumları yıldız olarak göstermiyor, sahte yorumla eklemek ceza sebebi). Yıldızlar Google İşletme Profili'ndeki gerçek yorumlardan gelir (bölüm 6a/3).
- **Fiyat aralığı (`priceRange`):** Müşteri fiyat kararını verince (madde 8).
- **Tam adres ve harita koordinatı:** Gezici işletme olduğu için adres gizli kalacak; sadece "İskenderun, Hatay" ve ilçeler. Sabit bir yer açılırsa eklenir.
- **İlçe sayfaları ve hizmet sayfaları:** Gerçek fotoğraf ve iş örnekleri gelmeden açılmaz (şablon kopya sayfa Google cezası).

**C) Bilgiler girildikten sonra Claude'un kontrol edeceği şeyler**
- [ ] Ekrandaki saat yazısı ile Google'a giden açılış saatleri aynı mı
- [ ] Ad / telefon / bölge sitede, Google İşletme Profili'nde, Instagram'da ve haritalarda **birebir aynı** mı
- [ ] İngilizce sayfada da yeni bilgiler doğru görünüyor mu
- [ ] Paylaşım görseli (og.jpg) güncellenmeli mi (gerçek fotoğraf gelirse)

### 2. Git ve GitHub
- [x] Git + GitHub: https://github.com/Abdulkadir-44/jupiter-security (main)

### 3. Yayına alma (Cloudflare ücretsiz)
- [x] Cloudflare hesabı + `npx wrangler login`
- [x] İlk yayın: https://jupiter-kamera.abdulkadirozenc-freelance-44e.workers.dev (Worker adı: `jupiter-kamera`). Sonraki yayınlar: `npm run deploy`
- [ ] Alan adı alınıp Cloudflare'e bağlanması
- [ ] `astro.config.mjs` içindeki `site` adresinin gerçek alan adıyla güncellenmesi

### 4. Yayın öncesi kontrol
- [x] SEO: sitemap (`@astrojs/sitemap`), `robots.txt`, paylaşım görseli `public/og.jpg` (1200x630), Open Graph + X etiketleri, apple-touch-icon. Alan adı gelince sadece `astro.config.mjs` → `site` değişecek; hepsi otomatik güncellenir.
- [x] Lighthouse (20.11.2026, canlı site): Mobil Performans 97 / Erişilebilirlik 100 / En iyi uygulamalar 100 / SEO 100. Masaüstü 100/100/100/100. Mobil LCP 1.7 sn, CLS 0.
- [x] Mobil görünüm düzeltmeleri (kenar boşlukları, hero, footer, sekmeler); Playwright ile 320/390px kontrol
- [x] Mobil düzeltmelerin ve yeni paletin yayına alınması
- [ ] Gerçek telefonda test (iPhone + Android)
- [ ] Google İşletme Profili (gezici işletme için "hizmet bölgesi" olarak açılabilir; yerel aramalarda çok etkili)
- [ ] Google Search Console: alan adı bağlanınca (ayrıntı: bölüm 6a/4)
- [ ] Yerel SEO içerik: gerçek fotoğraflar (açıklamalı), Google'da müşteri yorumları, ileride ilçe/hizmet bazlı sayfalar

### 5. Faz 1 kapanışı: tasarım ve responsive BİTTİ ✅ (20.11.2026)
- [x] Tasarım (v2 + adaçayı yeşili palet), animasyonlar, mobil/tablet/masaüstü düzen
- [x] İngilizce dil desteği (`/en/`): içerik `src/content/site.en.ts`, iletişim bilgileri Türkçe dosyadan paylaşılır; header'da TR/EN düğmesi; hreflang + sitemap dil etiketleri. Yeni dil = yeni `site.xx.ts` + `src/lib/data.ts` ve `astro.config.mjs` dil listesi + `src/pages/xx/index.astro`.
- [x] Tema kararı: **açık/koyu tema seçeneği olmayacak**, mevcut tek tema kalıyor.
- Arapça şimdilik istenmiyor (gerekirse: sağdan sola düzen + Arapça font).
- Geri kalan tek "içerik" işi: bölüm 1'deki gerçek bilgiler (müşteriden).

### 6. Faz 2: teknik işler (SIRADAKİ)
Önerilen sıra (her biri ayrı konuşulup planlanacak):

**a) SEO stratejisi: İskenderun'da öne çıkmak** (müşteri için öncelikli)

Temel gerçek: yerel hizmet aramalarında trafiğin büyük kısmı haritadaki "3'lü paketten" gelir; onu belirleyen **Google İşletme Profili + yorumlar**. Web sitesi bunu destekleyen ikinci ayak. İkisi birlikte kurulacak.

*1) Alan adından önce, içerik beklemeden (teknik):*
- [x] **noindex**: geçici adres (`*.workers.dev`) Google'a kapalı (sahte telefon/yorum dizine girmesin, alan adı gelince içerik iki adreste olmasın). `BaseLayout.astro`'da otomatik: `astro.config.mjs` → `site` gerçek alan adı olunca kendiliğinden `index, follow` olur. robots.txt'de bilerek `Disallow` yok (Google noindex'i görebilsin).
- [x] **H1 ve başlıklar** (yapıldı: görünür "● İSKENDERUN KAMERA MONTAJI" etiketi + H1, anahtar kelimeli bölüm başlıkları): H1'de "İskenderun" yok ve görünmez (`sr-only`). Hero'ya görünür üst etiket ("İskenderun Kamera Montajı") + anahtar kelimeli görünür H1; bölüm başlıklarına doğal anahtar kelimeler (örn. "Hazır kamera sistemi paketleri"). Slogan tasarımı aynı kalır.
- [x] **Title / meta açıklama** (yapıldı): TR "İskenderun Kamera Montajı ve Güvenlik Kamerası | JÜPİTER", EN "CCTV Installation in İskenderun | JÜPİTER Security Cameras"; açıklamalar ~150 karakter.
- [x] **JSON-LD zenginleştirme** (yapıldı, `src/lib/schema.ts`; açılış saatleri `site.tr.ts` → `contact.openingHours`): `@id`, hizmet listesi (`hasOfferCatalog`), hizmet bölgesi, çalışma saatleri, `priceRange`, `sameAs`, her dilde kendi dilinde. Sahte yorumlarla `Review`/`AggregateRating` EKLENMEZ (Google cezalandırır; yıldızlar İşletme Profili'nden gelir).
- [x] **404 sayfası** (yapıldı; tasarım `src/components/NotFound.astro`): "Sinyal yok" kamera ekranı + "Burası kör nokta"; ana sayfa / ara / WhatsApp butonları. **Dil adresten belirlenir:** `/` altındaki her bulunamayan adres → Türkçe 404 (`src/pages/404.astro`), `/en/` altındakiler → İngilizce 404 (`src/pages/en/404.astro`). Google'a kapalı, sitemap'te yok. Gerçek 404 durum kodu için `wrangler.jsonc` → `assets.not_found_handling: "404-page"`; `/en/404.html` üretilsin diye `astro.config.mjs` → `build.format: "preserve"` (sitemap'te `/en/` için `serialize`; `trailingSlash: "always"` KULLANILMAZ, dev sunucusunda Astro'nun kendi 404'ünü gösteriyor). İleride çok sayfalı yapıya geçilirse adres yapısı yeniden ele alınacak.
- [x] **Lighthouse tekrar ölçümü** (20.11.2026, yerel preview; canlıda tekrar ölçülecek):
  - Bulunan ve düzeltilen: **CLS 0.41 → 0** (slogan fontu geç yükleniyordu → Big Shoulders latin dosyası `preload`; tarama çubuğu `left` yerine transform ile kayıyor), dil düğmesinin erişilebilir adı "EN"i içermiyordu.
  - Masaüstü: Performans 96 / Erişilebilirlik 100 / En iyi uygulamalar 100. SEO 69 **beklenen**: noindex yüzünden ("sayfa dizine kapalı"); alan adıyla 100'e döner.
  - Mobil yerelde 61-71: yerel sunucu dosyaları sıkıştırmıyor (canlıda Cloudflare sıkıştırır), gerçek sayı için canlı ölçüm gerekli.
- [ ] **Hero sloganını JS'siz (saf CSS) animasyona çevirmek** (öneri): şu an slogan React + Framer Motion ile sayfa açılır açılmaz ~200 KB JS yüklüyor; mobilde ilk görüntüyü ve etkileşimi geciktiriyor. Aynı görünüm CSS ile yapılabilir, slogan JS beklemeden görünür.
- [x] **İngilizce paylaşım görseli** (`public/og-en.jpg`, "WE LEAVE NO / BLIND SPOTS"); dil başına görsel `site.*.ts` → `seo.ogImage`.
- [x] **favicon.ico** (16/32/48 px, `public/favicon.ico`; eski tarayıcılar ve bazı araçlar için, SVG ikon da duruyor).
- [ ] **Gizlilik / KVKK aydınlatma metni** sayfası + footer linki (gerçek firma unvanı ve iletişim bilgisi gelince; yayından önce müşterinin muhasebeci/avukatına gösterilmeli). Kullanım koşulları: form/admin paneli gelince.
- Kontrol listesi (20 madde, 20.11.2026): 12 tamam; form gelince yapılacak 3 (yükleme durumu, form hataları, teşekkür sayfası); çerez banner'ı gerekmiyor (site çerez kullanmıyor; Google Analytics eklenirse gerekir).
- [x] **Cloudflare Web Analytics** (`BaseLayout.astro` → `CF_ANALYTICS_TOKEN`; sadece build'de, dev sayılmaz; çerezsiz → banner gerekmez). Panel: dash.cloudflare.com → Analytics & Logs → Web Analytics. Gösterir: ziyaretçi, sayfa görüntüleme, nereden gelindiği, ülke/cihaz, gerçek kullanıcı hızı. **Buton tıklamalarını (Ara / WhatsApp) SAYMAZ.** Alan adı gelince panelde yeni adres eklenecek.
- [ ] **Ara / WhatsApp tıklama sayımı** (backend aşamasında): Cloudflare Workers Analytics Engine (ücretsiz) ile küçük bir sayaç ucu; ya da alan adı Cloudflare'e bağlanınca Cloudflare Zaraz.

*2) Anahtar kelimeler ve site yapısı (gerçek içerikle birlikte):*
- Hedef aramalar: konum ("iskenderun kamera montajı", "iskenderun güvenlik kamerası", "hatay kamera sistemleri"), ilçe ("dörtyol / arsuz / payas / belen / antakya kamera"), fiyat ("4 kameralı sistem fiyatı", "ev kamera sistemi fiyatları"), mekân ("dükkan / apartman kamera sistemi"), bilgi ("kamera kaç gün kayıt yapar", "işyerinde kamera KVKK").
- Hedef yapı: ana sayfa = İskenderun; **hizmet sayfaları** (ev, dükkan/işyeri, fabrika/depo, site/apartman); **ilçe sayfaları** (Arsuz, Dörtyol, Payas, Belen, Antakya); **rehber yazıları** (özellikle "İşyerinde kamera ve KVKK").
- ⚠️ İlçe sayfaları şablon kopya olursa "doorway page" cezası. Her birinde o ilçeden gerçek iş fotoğrafı ve gerçek bilgi olmalı; gerçek içerik gelince açılacak.
- [ ] Sık sorulan sorular bölümü (gerçek sorularla; zengin sonuç beklentisi yok ama uzun aramalarda değerli).
- Fiyat notu: "Fiyat için arayın" fiyat aramalarında dezavantaj; en azından "başlayan fiyatlar" yazmak SEO'ya yardım eder (müşteri kararı).

*3) Google İşletme Profili (alan adı beklemeden, müşterinin kendi Google hesabıyla):*
- [ ] **Hizmet bölgesi işletmesi** olarak açılış (adres gizli, ilçeler ekli); kategori "Güvenlik sistemi kurulum hizmeti"; doğrulama genelde video ile (iş aracı, ekipman). Claude adım adım rehber hazırlayabilir.
- [ ] **Yorum stratejisi**: her kurulumdan sonra yorum linkine giden QR kart. Yorum sayısı ve tazeliği harita sıralamasında belirleyici.
- [ ] Haftada bir yapılan iş fotoğrafı paylaşımı.
- [ ] **NAP tutarlılığı** (ad, telefon, bölge her yerde birebir aynı): Yandex Haritalar, Apple Business Connect, Bing Places, Instagram, Facebook.

*4) Alan adı alınınca:*
- Alan adı: **`jupiterguvenlik.com`** (karar verildi).
- [ ] `astro.config.mjs` → `site` = alan adı (noindex otomatik kalkar; canonical, hreflang, sitemap, og otomatik güncellenir)
- [ ] `*.workers.dev` → alan adı **301 kalıcı yönlendirme**
- [ ] Google Search Console + Bing Webmaster Tools doğrulama, `sitemap-index.xml` gönderimi
- [ ] İşletme Profili'ne web sitesi linki

**b) Güvenlik (backend'den önce temel)**
- [x] **Güvenlik başlıkları** (yapıldı): Content-Security-Policy `astro.config.mjs` → `security.csp` (Astro her sayfaya `<meta>` ekler, kendi satır içi scriptlerini otomatik hash'ler; izinli dış kaynak sadece Cloudflare Web Analytics). Diğerleri `public/_headers`: HSTS, X-Content-Type-Options, X-Frame-Options + frame-ancestors, Referrer-Policy, Permissions-Policy, COOP. Tarayıcıda test edildi, CSP ihlali yok.
  - ⚠️ **Yeni bir dış kaynak eklenirse** (Google Fonts, harita, YouTube, dış görsel, form servisi vb.) `security.csp` içine izin eklenmeli, yoksa tarayıcı engeller.
  - Not: CSP `<meta>` ile; tüm script kurallarının HTTP başlığına taşınması (daha katı) ileride sunucu tarafı render'a geçilirse.
- [x] Bağımlılık taraması (20.11.2026): `npm audit` → 0 açık. Gereksiz paket yok (`@astrojs/check`, `typescript`, `react-dom`, `@types/*` araç olarak gerekli). Ara ara `npm audit` tekrar çalıştırılmalı.
- [x] Gizli bilgiler kontrolü: repoda ve kodda gizli anahtar yok; `.env*` ve `.dev.vars` gitignore'da. Analytics token'ı gizli değil (HTML'de herkese görünür). Backend gelince şifre/anahtarlar sadece `wrangler secret` ile (asla repoya değil).

**c) Veritabanı ve depolama (Cloudflare ücretsiz katman)**
- [ ] D1 (SQLite): tablolar (iletişim ayarları, paketler, yorumlar, yapılan işler, kampanya); `site.tr.ts`/`site.en.ts` yapısıyla uyumlu (iki dil alanı)
- [ ] R2: kurulum fotoğrafları; yüklemeden önce tarayıcıda sıkıştırma
- [ ] `src/lib/data.ts` → D1'den okuyacak (bileşenler değişmez); sayfa statik mi kalır, sunucuda mı üretilir kararı (önbellek stratejisi)

**Admin paneli tasarım kararları (karar defteri, 20.11.2026'dan itibaren)**
Kararlar kullanıcıyla tek tek soru-cevapla alındı (1-10). Ayrıntılar aşağıdaki **tasarım dokümanında**; kullanıcı onayından sonra uygulama aşamalarına geçilecek.
1. **Kapsam:** Panelden 5 bölüm yönetilecek: yapılan işler galerisi, iletişim bilgileri, paketler, müşteri yorumları, kampanya şeridi.
2. **Görünüm:** Basit, göze hoş, hafif animasyonlu; **özellikle responsive** (telefondan da rahat kullanılmalı).
3. **Düzen (masaüstü):** Solda **sidebar**, her başlık **ayrı sayfa** (tek sayfaya her şey konmaz). Örn. `/admin/yapilan-isler`, `/admin/iletisim`, `/admin/paketler`, `/admin/yorumlar`, `/admin/kampanya`. Mobilde sidebar açılır menüye dönüşür.
4. **İlk açılış:** `/admin` = **"Genel bakış"**: kampanya şeridi durumu + tek tıkla aç/kapa, içerik sayıları (iş fotoğrafı, yorum, paket; tıklanınca ilgili sayfa), son değişiklikler, bu haftanın ziyaretçi sayısı (Cloudflare Web Analytics), "Siteyi görüntüle".
5. **Yansıma: B, anında.** Sayfalar her istekte güncel veriyi D1'den okur (Astro sunucu tarafı render, Cloudflare Workers). Panelde kaydedilen değişiklik sayfa yenilenince görünür; build/deploy gerekmez. Gerekirse kısa süreli önbellek. Ücretsiz katman yeterli (günde 100.000 istek, 5 milyon D1 okuma).
6. **Resimler: tarayıcıda optimizasyon.** Panel, fotoğrafı yüklemeden önce müşterinin cihazında **WebP**'ye çevirir ve 3 boyut üretir (~480 / 960 / 1600 px); sitede `srcset` ile ekrana uygun olan yüklenir. Ücretli Cloudflare Images gerekmez. Dönüştürme sırasında **EXIF/GPS konum bilgisi silinir** (KVKK). AVIF tarayıcıda üretilemediği için WebP.
7. **Fotoğraf deposu: R2.** Kullanıcı kendi Cloudflare hesabına **düşük limitli sanal kart** ekleyecek (R2'yi açmak için gerekli; ücretsiz sınırlar altında para çekilmez). Kullanıcı yapacak: R2'yi etkinleştirme + kart, Billing → Notifications'ta kullanım uyarısı. Claude yapacak: bucket oluşturma, fotoğrafları Worker + Cloudflare önbelleği üzerinden sunma (önbellekten dönen istekler R2 kotasından düşmez, kötüye kullanıma karşı koruma). Not: hesap şimdilik kullanıcıda; ileride müşteriye devir düşünülebilir.
8. **Giriş: e-posta + şifre + 2FA (TOTP).** Şifre hash'li saklanır (PBKDF2, Web Crypto), 5 hatalı denemede geçici kilit, oturum çerezi HttpOnly + Secure + SameSite, CSRF koruması. 2FA: Google/Microsoft Authenticator; ilk girişte QR ile kurulum, 10 tek kullanımlık yedek kod. Kurtarma: `npm` komutuyla şifre/2FA sıfırlama (komut satırından). Kullanıcı 2FA'yı bilmiyor → panel bitince müşteri için adım adım **"Panele ilk giriş" rehberi** yazılacak.
9. **İki dil: Türkçe yazılır, "İngilizceye çevir" butonu.** Çeviri Cloudflare Workers AI ile (ücretsiz günlük kota); sonuç elle düzeltilebilir. İngilizce alan boşsa İngilizce sayfada Türkçe metin gösterilir. Maliyet güvencesi: buton sadece giriş yapmış admin'de çalışır + kodda günlük üst sınır (örn. 200 çeviri/gün). Kullanıcı ücret çıkmasından endişeli: uygulamada Cloudflare'in güncel fiyatlandırması tekrar doğrulanacak (ücretsiz planda kota aşımı = hata, ücret değil).
10. **Sabit metinler kodda kalır** (hero, bölüm başlıkları/açıklamaları, süreç adımları, kullanım alanı sekmeleri, güneş enerjili 4G bölümü). Değişiklik gerekirse Claude/geliştirici `site.tr.ts` / `site.en.ts` üzerinden yapar. Panel sade kalır, müşteri tasarımı bozamaz.

**d) Admin paneli: tasarım dokümanı (ONAY BEKLİYOR)**

*Mimari*
- Astro sunucu tarafı render (`@astrojs/cloudflare`, Workers). Halka açık sayfalar (`/`, `/en/`) her istekte veriyi **D1**'den okur; sabit metinler yine `site.tr.ts`/`site.en.ts`'ten gelir. `src/lib/data.ts` tek veri katmanı: D1 verisi + sabit metinleri birleştirir (bileşenler değişmez).
- D1 boşsa / hata verirse: içerik dosyasındaki değerlere düşer (site asla boş görünmez).
- Fotoğraflar **R2**'de; site `/medya/...` adresinden Worker üzerinden sunar, Cloudflare önbelleği ile (uzun süreli önbellek, R2 kotası korunur).
- Panel `/admin/...` altında: her sayfa **noindex**, sitemap'te yok, sitede hiçbir yerden link yok. Tüm `/admin` istekleri oturum kontrolünden geçer (Astro middleware).
- CSP: panelin ihtiyaçları (`blob:` görseller, form gönderimi) `security.csp`'ye eklenecek; dış kaynak yok.
- Panel dili: **sadece Türkçe**.

*Veri modeli (D1 tabloları, taslak)*
| Tablo | Alanlar |
|---|---|
| `settings` (tek satır) | telefon (görünen + E.164), WhatsApp, Instagram, Facebook, çalışma saatleri (TR/EN metin + gün/saat), ilçeler (liste), WhatsApp karşılama mesajı (TR/EN) |
| `campaign` (tek satır) | açık/kapalı, metin (TR/EN), buton metni (TR/EN), bitiş tarihi (opsiyonel, geçince otomatik kapanır) |
| `works` (galeri: yapılan işler + slider'lar) | **kategori** (yapılan işler / güneş enerjili / Wi-Fi / ürünler), başlık/yer (TR/EN), ilçe/semt, tür (ev, dükkan, fabrika, site, arazi), fotoğraf anahtarları (480/960/1600 WebP + genişlik/yükseklik), alt metin (TR/EN), sıra, yayında mı, tarih |
| `packages` | ad, kamera sayısı, kimler için, özellikler (liste), fiyat metni (TR/EN), öne çıkan mı, sıra, yayında mı |
| `reviews` | alıntı (TR/EN), isim (Mehmet K.), unvan/semt (TR/EN), sıra, yayında mı |
| `admin_user` (tek satır) | e-posta, şifre hash + salt, TOTP gizli anahtarı, yedek kod hash'leri |
| `sessions` | oturum id hash, son kullanma, IP/cihaz özeti |
| `login_attempts` | IP, zaman (5 hatalı → 15 dk kilit) |
| `activity_log` | ne değişti, ne zaman (Genel bakış'taki "son değişiklikler") |
| `ai_usage` | gün, çeviri sayısı (günlük üst sınır) |
- İlk kurulumda mevcut içerik (`site.tr.ts`/`site.en.ts`'teki paketler, yorumlar, iletişim) D1'e aktarılır (seed); site görünümü değişmez.

*Panel sayfaları*
- `/admin/giris` (e-posta + şifre → 2FA kodu), ilk girişte `/admin/2fa-kurulum` (QR + yedek kodlar).
- `/admin` **Genel bakış**: kampanya aç/kapa, içerik sayıları, son değişiklikler, haftalık ziyaretçi (Cloudflare analytics API, sunucu tarafında; bunun için kısıtlı bir API token'ı `wrangler secret` olarak).
- `/admin/yapilan-isler` (galeri; kategori sekmeleri: yapılan işler, güneş enerjili slider, Wi-Fi slider, ürünler slider): ızgara görünüm, sürükle-bırak ya da ok ile sıralama, yayında/gizli, ekle/düzenle/sil; fotoğraf seçince tarayıcıda WebP'ye çevirme + önizleme + yükleme ilerlemesi.
- `/admin/iletisim`, `/admin/paketler`, `/admin/yorumlar`, `/admin/kampanya`: liste + düzenleme formu.
- Her formda: Türkçe alanlar + "İngilizceye çevir" butonu + İngilizce alanlar (düzenlenebilir), kaydedilmemiş değişiklik uyarısı, başarılı kayıtta küçük bildirim, form hataları (alan altında, anlaşılır Türkçe).
- Tasarım: sitenin paleti (koyu yeşil sidebar, açık içerik alanı), sitenin fontları, hafif geçişler; masaüstünde sol sidebar, mobilde üstte menü düğmesi + açılır sidebar. Büyük dokunma alanları (telefondan kullanım).
- Ayrıca: "Çıkış yap", "Siteyi görüntüle", şifre değiştirme.

*Güvenlik*
- Şifre: PBKDF2-SHA256 (Web Crypto, yüksek iterasyon) + salt. TOTP: RFC 6238 (30 sn, 6 hane), yedek kodlar hash'li.
- Oturum çerezi: `__Host-` önekli, HttpOnly, Secure, SameSite=Strict; 7 gün; çıkışta silinir.
- Tüm değiştiren istekler: oturum + CSRF token + Origin kontrolü. Girdi doğrulama (zod), dosya türü/boyut kontrolü (sadece WebP, en fazla birkaç MB).
- Giriş denemesi sınırı (IP başına), çeviri günlük sınırı.
- Kurtarma komutları (komut satırı): `npm run admin:create` (ilk kullanıcı), `admin:reset-password`, `admin:reset-2fa`.

*Uygulama aşamaları (her aşama sonunda kullanıcıya gösterilir)*
1. Altyapı: D1 veritabanı + tablolar + mevcut içeriğin aktarılması; halka açık sayfaların D1'den okuması (görünüm aynı). Kullanıcı: yok.
2. Giriş sistemi: şifre + 2FA + oturum + kilit + kurtarma komutları.
3. Panel iskeleti: sidebar, responsive düzen, Genel bakış.
4. Basit modüller: iletişim, kampanya, yorumlar, paketler (+ çeviri butonu).
5. R2 + yapılan işler galerisi (fotoğraf işleme, yükleme). Kullanıcı: R2'yi etkinleştirip sanal kart ekleme.
6. Son kontroller: güvenlik testi, mobil test, Lighthouse, "Panele ilk giriş" rehberi, deploy.

**e) Sonra**
- [ ] Ürünler ve Yapılan İşler ayrı sayfaları (gerçek içerik gelince)
- [ ] Formlar (iletişim/teklif) + gelen mesajlar modülü + spam koruması (Cloudflare Turnstile)
- [ ] Google Maps (gerekirse)

### Not: Windows yol sorunu (çözüldü)
Proje küçük harfli sürücüyle (`c:\...`, VS Code bazen böyle açıyor) açıldığında Vite, build'deki HTML'e CSS bağlantısı eklemiyordu; canlı site stilsiz görünüyordu. `scripts/astro.mjs` sarmalayıcısı sürücü harfini büyütüp Astro'yu öyle başlatıyor; `npm run dev/build/preview/deploy` bu sarmalayıcıyı kullanır. `npx astro ...` yerine her zaman `npm run ...` kullanın.
