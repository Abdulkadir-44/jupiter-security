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
- Geri dönüş noktaları: mavi palet `bd4b283`, yeşil palet ilk hali `4bc8bb7`.

## Sıradaki adımlar (önerilen sıra)

### 1. Gerçek içerik (müşteriden alınacak)
Hepsi `src/content/site.tr.ts` içinde, `YER TUTUCU` yazan satırlar:
- [ ] Telefon numarası ve WhatsApp numarası
- [ ] Instagram hesabı (varsa Facebook)
- [ ] Çalışma saatleri ve hizmet verilen ilçeler
- [ ] Gerçek istatistik (kurulum sayısı, kaç yıllık tecrübe, garanti süresi)
- [ ] Gerçek müşteri yorumları (3 adet, isim + baş harf + semt)
- [ ] Paket içerikleri ve fiyat yaklaşımı (fiyat yazılacak mı, "arayın" mı kalacak)
- [ ] Kampanya var mı? (şerit hazır, `Announcement.astro`)
- [ ] Kurulum fotoğrafları ("Yapılan işler" kareleri için, en az 6 adet)
- [ ] Alan adı tercihi (örn. jupiterkamera.com / jupiterguvenlik.com)

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
- [ ] **H1 ve başlıklar**: H1'de "İskenderun" yok ve görünmez (`sr-only`). Hero'ya görünür üst etiket ("İskenderun Kamera Montajı") + anahtar kelimeli görünür H1; bölüm başlıklarına doğal anahtar kelimeler (örn. "Hazır kamera sistemi paketleri"). Slogan tasarımı aynı kalır.
- [ ] **Title / meta açıklama**: anahtar kelime araştırmasına göre yeniden (iki dilde).
- [ ] **JSON-LD zenginleştirme**: `@id`, hizmet listesi (`hasOfferCatalog`), hizmet bölgesi, çalışma saatleri, `priceRange`, `sameAs`, her dilde kendi dilinde. Sahte yorumlarla `Review`/`AggregateRating` EKLENMEZ (Google cezalandırır; yıldızlar İşletme Profili'nden gelir).
- [ ] **404 sayfası**: iki dilde, tasarıma uygun, ana bölümlere ve telefona yönlendiren.
- [ ] **Lighthouse tekrar ölçümü** (yeşil palet, hero animasyonu JS'e bağlı slogan, `/en/`); gerekirse CSS satır içi.
- [ ] **İngilizce paylaşım görseli** (`og-en.jpg`).
- [ ] **Cloudflare Web Analytics** (ücretsiz, çerezsiz, KVKK dostu): ziyaret + "Ara"/"WhatsApp" tıklamaları.

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
- Alan adı önerisi: `.com.tr` (artık belgesiz; Türkiye sinyali), örn. `jupiterkamera.com.tr`.
- [ ] `astro.config.mjs` → `site` = alan adı (noindex otomatik kalkar; canonical, hreflang, sitemap, og otomatik güncellenir)
- [ ] `*.workers.dev` → alan adı **301 kalıcı yönlendirme**
- [ ] Google Search Console + Bing Webmaster Tools doğrulama, `sitemap-index.xml` gönderimi
- [ ] İşletme Profili'ne web sitesi linki

**b) Güvenlik (backend'den önce temel)**
- [ ] Güvenlik başlıkları: Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (`public/_headers` veya Worker)
- [ ] Bağımlılık taraması (`npm audit`), gereksiz paketlerin temizliği
- [ ] Gizli bilgiler: `.dev.vars` / `wrangler secret` (asla repoya değil)

**c) Veritabanı ve depolama (Cloudflare ücretsiz katman)**
- [ ] D1 (SQLite): tablolar (iletişim ayarları, paketler, yorumlar, yapılan işler, kampanya); `site.tr.ts`/`site.en.ts` yapısıyla uyumlu (iki dil alanı)
- [ ] R2: kurulum fotoğrafları; yüklemeden önce tarayıcıda sıkıştırma
- [ ] `src/lib/data.ts` → D1'den okuyacak (bileşenler değişmez); sayfa statik mi kalır, sunucuda mı üretilir kararı (önbellek stratejisi)

**d) Admin paneli (tek kullanıcı, rol yok)**
- [ ] Giriş: şifre hash'i (PBKDF2/Argon2), güvenli oturum çerezi (HttpOnly, Secure, SameSite), giriş denemesi sınırlaması, CSRF koruması
- [ ] Modüller: yapılan işler galerisi, iletişim ayarları, paketler, yorumlar, kampanya şeridi
- [ ] Değişiklik sonrası sitenin güncellenmesi (yeniden build veya sunucu tarafı okuma)

**e) Sonra**
- [ ] Ürünler ve Yapılan İşler ayrı sayfaları (gerçek içerik gelince)
- [ ] Formlar (iletişim/teklif) + gelen mesajlar modülü + spam koruması (Cloudflare Turnstile)
- [ ] Google Maps (gerekirse)

### Not: Windows yol sorunu (çözüldü)
Proje küçük harfli sürücüyle (`c:\...`, VS Code bazen böyle açıyor) açıldığında Vite, build'deki HTML'e CSS bağlantısı eklemiyordu; canlı site stilsiz görünüyordu. `scripts/astro.mjs` sarmalayıcısı sürücü harfini büyütüp Astro'yu öyle başlatıyor; `npm run dev/build/preview/deploy` bu sarmalayıcıyı kullanır. `npx astro ...` yerine her zaman `npm run ...` kullanın.
