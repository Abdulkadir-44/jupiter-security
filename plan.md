# Jüpiter Güvenlik Sistemleri: Web Sitesi Planı

> **Bu dosya sade plandır:** sadece bugün ve sonrası için gerekenler. Bitmiş işlerin ayrıntısı `plan-arsiv.md` içinde (22.11.2026'da donduruldu, **hiç değişmez**, satır numaraları sabit).
> **Arşivi okuma kuralı:** Arşivin tamamı asla okunmaz. Bir konunun geçmişi gerekirse en alttaki **Arşiv dizini**nden ilgili satır aralığı bulunur ve sadece o aralık okunur (Read: offset/limit).

## 1. Proje özeti ve kesin kurallar

- **Müşteri:** Jüpiter Güvenlik Sistemleri (resmi ad; limited şirket), İskenderun/Hatay. Gezici kamera kurulum firması (iş aracıyla; sabit dükkan/adres yok). Sadece kamera sistemleri (malzeme + anahtar teslim montaj).
- **Teknoloji:** Astro + React island'ları + Tailwind v4 + motion; Cloudflare Workers (ücretsiz katman). Diller: Türkçe (varsayılan, `/`) + İngilizce (`/en/`). İçerik: `src/content/site.tr.ts`, `site.en.ts` (EN iletişim ve markaları TR'den alır), `src/lib/data.ts` tek veri katmanı.
- **Kesin kurallar:**
  - **MOR/EFLATUN YOK** (Instagram'ın kendi geçişi dahil). Palet adaçayı yeşili + `sun` sarısı; tüm renkler `src/styles/global.css` token'larında.
  - **Form yok, Google Maps yok** (şimdilik).
  - **Commit / push / deploy sadece kullanıcı isteyince.** Kullanıcının diğer Cloudflare sitesine dokunulmaz.
  - `musteri-bilgileri.txt` ve `fotograflar/` **gitignore'da**, asla commit edilmez.
  - Playwright sadece kullanıcı isteyince (veya ölçüm/hata ayıklama gerekip kullanıcı onaylayınca).
  - Tasarım işlerinde sadece **ui-ux-pro-max** skill'i (frontend-design değil).
  - Kullanıcının bilmediği teknik konular (JSON-LD vb.) burada **sade Türkçe** yazılır; planlar dosyaya yazılır, sorular tek tek sorulur.
  - Yerel sunucu açıldıysa iş bitince `npm run stop` ile kapatılır.
  - Kullanıcı tasarımda: jenerik/"AI gibi" görünümü sevmiyor (tik işaretleri, hap butonlar); her bölüme konusuna uygun özgün detay istiyor. Mobilde mevcut düzen bozulmadan çalışılır; "masaüstüne dokunma" denirse sadece mobil kodlar değişir. Kullanıcının telefonu Redmi 13C = **360 px** genişlik.

## 2. Şu anki durum (22.11.2026)

- **Canlı:** https://jupiter-kamera.abdulkadirozenc-freelance-44e.workers.dev (Worker: `jupiter-kamera`), son deploy `3cff294` (sürüm 72478d6d, 22.11.2026; sayfalar artık D1'den). Yayın: `npm run deploy`. Repo: https://github.com/Abdulkadir-44/jupiter-security (main).
- **Google'a kapalı (noindex):** `*.workers.dev` adresinde otomatik. Alan adına geçince kendiliğinden açılır; **sahte yorumlar ve Instagram yer tutucusu dururken açılmamalı** (bkz. bölüm 5).
- **Canlı içerik veritabanından:** telefon, fiyatlar, paketler, yorumlar, ürünler, fotoğraf açıklamaları D1'de. `site.*.ts`'te bunları değiştirmek canlıya yansımaz (panel gelene kadar Claude D1'e SQL ile girer). Deploy'da Astro oturumları için `jupiter-kamera-session` KV alanı otomatik oluştu (kullanılmıyor, ücretsiz).
- **Sitede olanlar (kısaca):** hero, hizmet bölgeleri, süreç ("iş emri" kartları), kapsama (görüş konili maddeler), insan algılama videosu (açık bölüm), kullanım alanları (kanal satırları), ürün vitrini (geçici görseller), güneş enerjili 4G (6 gerçek fotoğraf, 8.999 TL etiketi), Wi-Fi (açık bölüm, fotoğraflar bekleniyor, 6.999 TL etiketi), paketler (9.999 / 14.999 / 29.999 TL, KDV ve montaj dahil), yorumlar (SAHTE, yer tutucu), yaptığımız kurulumlar (4 klasör + macOS penceresi, 28 gerçek fotoğraf), iletişim (gelen arama, WhatsApp balonu, Instagram profil satırı, randevu kartı), 404 TR/EN.
- **Logo:** müşteri mevcut logoyu beğenmedi; **profesyonel tasarımcıya yaptırılacak**. Claude'un 4 SVG konsepti (fikir olarak gösterilebilir): https://claude.ai/artifact/8Mr3Y3eshAY1K2wPp4CR3G. Gelince: `Logo.astro`, favicon, apple-touch-icon, `og.jpg` / `og-en.jpg`. Tasarımcıdan SVG istenmeli.

## 3. Sıradaki iş: Admin paneli (tasarım dokümanı aşağıda, ONAYLANDI)

**1. aşama (veritabanı): BİTTİ ve CANLIDA (22.11.2026, `3cff294`).** Yapılanlar:
- D1 `jupiter-kamera` (EEUR, id `5fdf08a9-…`), `wrangler.jsonc` → binding `DB`. Tablolar `db/migrations/0001_init.sql` (aşağıdaki veri modelinin tamamı; admin tabloları boş). Yerel + canlı veritabanına uygulandı ve dolduruldu.
- Seed: `scripts/db-seed.ts` içerik dosyalarından `db/seed.sql` üretir; `INSERT OR IGNORE` + sabit kimlik (tekrar çalıştırmak panel düzenlemelerini ezmez).
- `/` ve `/en/` artık her istekte sunucuda oluşturuluyor (`prerender = false`); 404 ve robots.txt build'de. `src/middleware.ts` her istekte tek D1 batch okur → `Astro.locals.site`; hata olursa içerik dosyaları (test edildi). Bileşenler `getSiteContent(Astro)`. Güvenlik başlıkları da middleware'de (`_headers` Worker yanıtlarına uygulanmaz).
- Birleştirme `src/lib/data.ts → mergeDbContent`: iletişim, markalar, kampanya, ürünler, slider'lar, fiyat etiketleri, paketler, yorumlar, klasörler + fotoğraflar. EN boşsa TR. `settings` satırı yoksa tamamen içerik dosyası.
- Fiyat etiketleri: içerikte `price` + `{price}` şablonu; gizlenince `ctaNoPrice` düz düğme.
- **Fotoğraflar:** sunucuda oluşturulan sayfada Astro görsel küçültmesi çalışmadığı için `scripts/media.mjs` (sharp) WebP 480/960/1600 (hero: AVIF+WebP 640-2400) üretir → `public/medya/foto/<anahtar>-<w>.webp` + `src/content/media.manifest.json` (ikisi gitignore'da, dev/build'de kendiliğinden). `Img.astro` + `src/lib/photo.ts`. 5. aşamada R2 aynı adres düzenini kullanacak.
- Kampanya şeridi sayfada hiç yoktu: veritabanında kapalı (`enabled = 0`). **4. aşamada `Announcement.astro` HomePage'e eklenecek** (kapalıyken hiçbir şey göstermez).
- Doğrulama: metin canlıyla birebir (tek fark ürün kartı "WhatsApp"), 120 görsel adresi 200, yerelde DB değişikliği anında sayfada, preview'da sayfa ~55 ms.
- Canlı ölçüm: ana sayfa ilk yanıtı statik dosyalardan ~0,05-0,2 sn fazla; loglarda D1 hatası yok. Lighthouse tekrar ölçülmedi (istenirse).

**Sıradaki: 2. aşama (giriş sistemi).** Kullanıcı "başla" deyince.

**Admin paneli tasarım kararları (karar defteri, 20.11.2026'dan itibaren)**
Kararlar kullanıcıyla tek tek soru-cevapla alındı (1-10). Ayrıntılar aşağıdaki **tasarım dokümanında**; kullanıcı onayından sonra uygulama aşamalarına geçilecek.
1. **Kapsam:** Panelden 5 bölüm yönetilecek: yapılan işler galerisi, iletişim bilgileri, paketler, müşteri yorumları, kampanya şeridi.
   - **Güncelleme (22.11.2026, sitede sonradan eklenen bölümler):** Kapsam genişledi: **8 bölüm**:
     1. **Yapılan işler (klasörler):** klasör ekle/sil/sırala/adlandır, klasöre fotoğraf ekle, her fotoğrafa açıklama + konum (semt/ilçe)
     2. **Ürünler:** ürün ekle/sil/sırala; ad, kategori, ikon tipi, özellikler, marka, fotoğraf
     3. **Slider fotoğrafları:** güneş enerjili ve Wi-Fi bölümlerindeki fotoğraflar + alt yazıları
     4. **Fiyatlar:** paket fiyatları (sayı) + güneş enerjili ve Wi-Fi "…TL'den başlayan" fiyat etiketleri
     5. **Paketler** (içerik), 6. **Yorumlar**, 7. **İletişim** (+ marka listeleri), 8. **Kampanya şeridi**
2. **Görünüm:** Basit, göze hoş, hafif animasyonlu; **özellikle responsive** (telefondan da rahat kullanılmalı).
3. **Düzen (masaüstü):** Solda **sidebar**, her başlık **ayrı sayfa** (tek sayfaya her şey konmaz). Örn. `/admin/yapilan-isler`, `/admin/iletisim`, `/admin/paketler`, `/admin/yorumlar`, `/admin/kampanya`. Mobilde sidebar açılır menüye dönüşür.
4. **İlk açılış:** `/admin` = **"Genel bakış"**: kampanya şeridi durumu + tek tıkla aç/kapa, içerik sayıları (iş fotoğrafı, yorum, paket; tıklanınca ilgili sayfa), son değişiklikler, bu haftanın ziyaretçi sayısı (Cloudflare Web Analytics), "Siteyi görüntüle".
5. **Yansıma: B, anında.** Sayfalar her istekte güncel veriyi D1'den okur (Astro sunucu tarafı render, Cloudflare Workers). Panelde kaydedilen değişiklik sayfa yenilenince görünür; build/deploy gerekmez. Gerekirse kısa süreli önbellek. Ücretsiz katman yeterli (günde 100.000 istek, 5 milyon D1 okuma).
6. **Resimler: tarayıcıda optimizasyon.** Panel, fotoğrafı yüklemeden önce müşterinin cihazında **WebP**'ye çevirir ve 3 boyut üretir (~480 / 960 / 1600 px); sitede `srcset` ile ekrana uygun olan yüklenir. Ücretli Cloudflare Images gerekmez. Dönüştürme sırasında **EXIF/GPS konum bilgisi silinir** (KVKK). AVIF tarayıcıda üretilemediği için WebP.
7. **Fotoğraf deposu: R2.** Kullanıcı kendi Cloudflare hesabına **düşük limitli sanal kart** ekleyecek (R2'yi açmak için gerekli; ücretsiz sınırlar altında para çekilmez). Kullanıcı yapacak: R2'yi etkinleştirme + kart, Billing → Notifications'ta kullanım uyarısı. Claude yapacak: bucket oluşturma, fotoğrafları Worker + Cloudflare önbelleği üzerinden sunma (önbellekten dönen istekler R2 kotasından düşmez, kötüye kullanıma karşı koruma). Not: hesap şimdilik kullanıcıda; ileride müşteriye devir düşünülebilir.
8. **Giriş: e-posta + şifre + 2FA (TOTP).** Şifre hash'li saklanır (PBKDF2, Web Crypto), 5 hatalı denemede geçici kilit, oturum çerezi HttpOnly + Secure + SameSite, CSRF koruması. 2FA: Google/Microsoft Authenticator; ilk girişte QR ile kurulum, 10 tek kullanımlık yedek kod. Kurtarma: `npm` komutuyla şifre/2FA sıfırlama (komut satırından). Kullanıcı 2FA'yı bilmiyor → panel bitince müşteri için adım adım **"Panele ilk giriş" rehberi** yazılacak.
9. **İki dil: Türkçe yazılır, "İngilizceye çevir" butonu.** Çeviri Cloudflare Workers AI ile (ücretsiz günlük kota); sonuç elle düzeltilebilir. İngilizce alan boşsa İngilizce sayfada Türkçe metin gösterilir. Maliyet güvencesi: buton sadece giriş yapmış admin'de çalışır + kodda günlük üst sınır (örn. 200 çeviri/gün). Kullanıcı ücret çıkmasından endişeli: uygulamada Cloudflare'in güncel fiyatlandırması tekrar doğrulanacak (ücretsiz planda kota aşımı = hata, ücret değil).
10. **Sabit metinler kodda kalır** (hero, bölüm başlıkları/açıklamaları, süreç adımları, kullanım alanı sekmeleri, güneş enerjili 4G bölümü). Değişiklik gerekirse Claude/geliştirici `site.tr.ts` / `site.en.ts` üzerinden yapar. Panel sade kalır, müşteri tasarımı bozamaz.
   - **Güncelleme (22.11.2026):** İnsan algılama videosu, bölüm tasarımları ve madde listeleri de kodda kalır (onaylandı). Video nadiren değişir ve dönüştürmek için ffmpeg gerekir; panelden yükletmek gereksiz karmaşıklık.

**d) Admin paneli: tasarım dokümanı (ONAYLANDI 22.11.2026; sıradaki iş: 1. aşama veritabanı)**

> **22.11.2026 güncellemesi özeti:** Site, doküman yazıldıktan sonra büyüdü. Panelin yönetmesi gereken yeni şeyler eklendi: ürünler vitrini, kurulum klasörleri (macOS penceresi), güneş enerjili/Wi-Fi slider fotoğrafları ve fiyat etiketleri, sayı olarak paket fiyatları. Aşağıdaki veri modeli, panel sayfaları ve aşamalar buna göre güncellendi. Değişmeyenler: mimari (Astro sunucu tarafı + D1 + R2), güvenlik, giriş (şifre + 2FA), tarayıcıda WebP, Türkçe yaz + "İngilizceye çevir".

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
| `settings` (tek satır) | telefon (görünen + E.164), WhatsApp, Instagram, Facebook, çalışma saatleri (TR/EN metin + gün/saat), ilçeler (liste), WhatsApp karşılama mesajı (TR/EN), **kullanılan markalar** (CCTV listesi, güneş enerjili listesi) |
| `campaign` (tek satır) | açık/kapalı, metin (TR/EN), buton metni (TR/EN), bitiş tarihi (opsiyonel, geçince otomatik kapanır) |
| `folders` (yapılan işler klasörleri) | ad (TR/EN), sıra, yayında mı. Kapak: içindeki ilk 3 fotoğraf |
| `photos` (tüm fotoğraflar tek tabloda) | **nerede**: `klasör:<id>` / `slider:gunes` / `slider:wifi`, açıklama (TR/EN), konum (semt/ilçe), alt metin (TR/EN), fotoğraf anahtarları (480/960/1600 WebP + genişlik/yükseklik), sıra, yayında mı, tarih |
| `products` (ürün vitrini) | ad (TR/EN), kategori etiketi (TR/EN), ikon tipi (bullet/dome/ptz/güneş/wifi/nvr: fotoğraf yoksa), özellikler (liste, TR/EN), marka, fotoğraf (anahtarlar), sıra, yayında mı |
| `price_tags` (2 satır: güneş enerjili, Wi-Fi) | başlangıç fiyatı (sayı, TL), yayında mı. Metin kalıbı kodda ("…TL'den başlayan fiyatlarla", "KDV ve montaj dahil") |
| `packages` | ad, kamera sayısı, kimler için, özellikler (liste), **başlangıç fiyatı (sayı, TL)**, öne çıkan mı, sıra, yayında mı. "KDV ve montaj dahil" notu kodda |
| `reviews` | alıntı (TR/EN), isim (Mehmet K.), unvan/semt (TR/EN), sıra, yayında mı |
| `admin_user` (tek satır) | e-posta, şifre hash + salt, TOTP gizli anahtarı, yedek kod hash'leri |
| `sessions` | oturum id hash, son kullanma, IP/cihaz özeti |
| `login_attempts` | IP, zaman (5 hatalı → 15 dk kilit) |
| `activity_log` | ne değişti, ne zaman (Genel bakış'taki "son değişiklikler") |
| `ai_usage` | gün, çeviri sayısı (günlük üst sınır) |
- İlk kurulumda mevcut içerik (`site.tr.ts`/`site.en.ts`'teki paketler, yorumlar, iletişim, ürünler, klasörler + açıklamalar, fiyatlar) D1'e aktarılır (seed); mevcut fotoğraflar (klasörler, slider'lar, ürünler) R2'ye yüklenir. Site görünümü değişmez.

*Panel sayfaları*
- `/admin/giris` (e-posta + şifre → 2FA kodu), ilk girişte `/admin/2fa-kurulum` (QR + yedek kodlar).
- `/admin` **Genel bakış**: kampanya aç/kapa, içerik sayıları, son değişiklikler, haftalık ziyaretçi (Cloudflare analytics API, sunucu tarafında; bunun için kısıtlı bir API token'ı `wrangler secret` olarak).
- `/admin/yapilan-isler`: klasör kartları (sitedeki gibi). Klasör ekle/yeniden adlandır/sırala/gizle/sil. Klasöre girince fotoğraf ızgarası: çoklu fotoğraf yükleme (tarayıcıda WebP + önizleme + ilerleme), her fotoğrafa açıklama + konum, sürükle-bırak ya da okla sıralama, yayında/gizli, sil. Fotoğrafı başka klasöre taşıma.
- `/admin/sliderlar`: iki sekme (güneş enerjili, Wi-Fi). Fotoğraf + alt yazı ekle/sırala/sil. Wi-Fi fotoğrafları gelince buradan girilecek.
- `/admin/urunler`: ürün kartları listesi; ekle/düzenle/sırala/gizle/sil. Form: ad, kategori, ikon tipi, özellikler (satır satır), marka, fotoğraf.
- `/admin/fiyatlar`: tek sayfada tüm fiyatlar: 3 paket + güneş enerjili + Wi-Fi başlangıç fiyatı. Sadece sayı girilir (ör. 9999); site "9.999 TL'den başlayan" diye biçimler.
- `/admin/iletisim` (+ marka listeleri), `/admin/paketler` (içerik), `/admin/yorumlar`, `/admin/kampanya`: liste + düzenleme formu.
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
5. R2 + fotoğraf modülleri: yapılan işler klasörleri, slider'lar, ürünler (fotoğraf işleme, yükleme; mevcut fotoğrafların R2'ye aktarılması). Kullanıcı: R2'yi etkinleştirip sanal kart ekleme.
6. Fiyatlar sayfası (paketler + güneş enerjili + Wi-Fi tek ekranda).
7. Son kontroller: güvenlik testi, mobil test, Lighthouse, "Panele ilk giriş" rehberi, deploy.
- Not (22.11.2026): Aşama 4 artık iletişim (+ markalar), kampanya, yorumlar, paketler; ürünler fotoğraflı olduğu için 5. aşamada.

**e) Sonra**
- [ ] Ürünler ve Yapılan İşler ayrı sayfaları (gerçek içerik gelince)
- [ ] Formlar (iletişim/teklif) + gelen mesajlar modülü + spam koruması (Cloudflare Turnstile)
- [ ] Google Maps (gerekirse)

## 4. Müşteriden beklenenler

Gelince Claude girer (iki dil + Google'a giden bilgi). Kullanıcı "müşteri bilgileri geldi" deyip yapıştırır. Dosyalarda ilgili yerlerde `YER TUTUCU` yazar.

| Bilgi | Nereye gidecek |
|---|---|
| **Gerçek müşteri yorumları** (3-4 adet: isim + soyadı baş harfi + semt) | `reviews.items` (iki dil). **Google'a açılmadan önce şart.** |
| **Instagram hesabı** (varsa Facebook) | `contact.instagram` (yer tutucu `@jupiterkamera`) |
| **Ürün fotoğrafları + ürün listesi** (ad, marka, model, özellik) | `src/assets/medya/urunler/` + `products` (şu an geçici görseller; "dome" görseli aslında kutu kamera, ilk değişecek) |
| **Wi-Fi markası + Wi-Fi kurulum fotoğrafları** | `wifi` slider + marka satırı (Wi-Fi bölümünde marka satırı henüz yok) |
| **Kurulum konumları** (fotoğraf başına mahalle/semt/ilçe) | `work.folders[].captions[...].area` (boş, doldurulunca görünür) |
| **Resmi unvan** (vergi levhasındaki, "Ltd. Şti." dahil) **+ yazışma adresi** | KVKK sayfası (adres sitede/haritada gizli kalabilir; Google İşletme Profili doğrulaması da ister) |
| **E-posta** | Alan adı gelince `info@jupiterguvenlik.com` → Cloudflare Email Routing ile müşterinin Gmail'ine |
| **Kampanya** (olursa) | Kampanya şeridi (hazır, kapalı; admin panelinden aç/kapa) |
| **Logo** (tasarımcıdan) | bkz. bölüm 2 |

**Açık sorular (müşteriye sorulacak):**
- Jüpiter'in tanıtım videosundaki özellikler (5 MP metal kasa, 2.8 mm lens, sesli, gece renkli, yapay zekâ) paket kartlarına da eklensin mi? (Bullet ürün kartına eklendi.)
- Foto 34'teki kutuda "Jüpiter Güvenlik & **Internet**" yazıyor: firma internet hizmeti de veriyor mu?
- Usta fotoğrafları (`fotograflar/g-usta/`) ileride "Hakkımızda" alanında kullanılsın mı? (Şimdilik hayır.)

**Bilerek boş bırakılanlar (gerçek bilgi gelmeden eklenmez):** Google'da yorum yıldızları (sadece Google İşletme Profili'ndeki gerçek yorumlardan gelir; sahte yorumla eklemek ceza sebebi), tam adres ve harita koordinatı (gezici işletme), ilçe ve hizmet sayfaları (gerçek iş örneği olmadan açılırsa Google cezası).

**Bilgiler girilince kontrol:** ekrandaki saat yazısı ile Google'a giden bilgi aynı mı; ad / telefon / bölge sitede, Google İşletme Profili'nde, Instagram'da birebir aynı mı (resmi ad: "Jüpiter Güvenlik Sistemleri"); İngilizce sayfa doğru mu; og görseli güncellenmeli mi.

## 5. Yayın ve Google'a açılış (alan adı: `jupiterguvenlik.com`, Natro)

- [ ] Kullanıcı: alan adını Natro'dan alıp nameserver'ları Cloudflare'e yönlendirir.
- [ ] Claude: Worker'a özel alan adı; `astro.config.mjs` → `site` (canonical, hreflang, sitemap, og otomatik güncellenir); `*.workers.dev` → alan adı 301 yönlendirme; Web Analytics'e yeni adres.
- [ ] **Google'a açma koşulu:** `site` değişince noindex kendiliğinden kalkar. Sahte yorumlar ve Instagram yer tutucusu duruyorsa kalkmamalı: o zaman noindex'i elle tutan bir ayar eklenecek, gerçek yorumlar girilince açılacak.
- [ ] Google Search Console + Bing Webmaster Tools, `sitemap-index.xml` gönderimi.
- [ ] Google İşletme Profili (müşterinin hesabıyla): hizmet bölgesi işletmesi (adres gizli, ilçeler), kategori "Güvenlik sistemi kurulum hizmeti", video ile doğrulama; yorum toplama için QR kart; haftalık iş fotoğrafı; NAP tutarlılığı (Yandex, Apple Business Connect, Bing Places, Instagram, Facebook). Claude adım adım rehber hazırlayabilir.
- [ ] **KVKK / gizlilik sayfası** + footer linki (unvan ve adres gelince; yayından önce müşterinin muhasebeci/avukatına gösterilmeli).
- [ ] Canlıda Lighthouse tekrar ölçümü; gerçek telefonda test (iPhone + Android).

**Sonraya kalanlar / fikirler:**
- [ ] Ara / WhatsApp tıklama sayımı (Workers Analytics Engine ya da Zaraz).
- [ ] Hero sloganını JS'siz (saf CSS) animasyona çevirmek (~200 KB JS tasarrufu; kullanıcı şimdilik React kalsın dedi).
- [ ] Sık sorulan sorular bölümü (gerçek sorularla).
- [ ] İlçe / hizmet sayfaları, rehber yazıları (gerçek içerik gelince; hedef aramalar arşivde).
- [ ] Header sığması: 320 px telefon ve 1024-1100 px laptopta hiç ölçülmedi.
- [ ] Ara ara `npm audit`.

## 6. Teknik notlar

- **Windows yol sorunu:** proje küçük harfli sürücüyle (`c:\...`) açılınca Vite build'de CSS bağlantısı eklemiyordu. `scripts/astro.mjs` sürücü harfini büyütür. Her zaman `npm run dev/build/preview/deploy` kullanılır, `npx astro ...` değil.
- **Sunucuyu durdurma:** `npm run stop` (4321-4330 portlarındaki Astro/wrangler süreçleri). Yeni bileşen dosyası eklenince açık dev sunucusu "Cannot find module" verebilir: durdurup yeniden başlat.
- **Dev sunucusu sadece IPv6'da dinler** (`[::1]:4321`); Playwright `http://localhost:4321` ile açabilir.
- **CSP:** `astro.config.mjs` → `security.csp`. Yeni dış kaynak (font, harita, video, dış görsel, form servisi) eklenirse izin eklenmeli, yoksa tarayıcı engeller. Diğer güvenlik başlıkları `public/_headers`.
- **404:** `wrangler.jsonc` → `not_found_handling: "404-page"`; `build.format: "preserve"`; `trailingSlash: "always"` KULLANILMAZ.
- **Fotoğraflar:**
  - Orijinaller `fotograflar/` (gitignore'da) gruplara göre: `a-gunes-enerjili/` … `h-videolar/`; eski WhatsApp adları `fotograflar/_liste.txt`. Düzenlenmiş kopya orijinalin yanında `NN-duzenlenmis.jpg`. Orijinaller asla değiştirilmez.
  - **Bulanıklaştırma kuralı:** plaka, yüz, başka işletme tabelaları ve başka markalar bulanık. Satılan kamera markaları (O-KAM, ZTECH) kalır. Foto 34 olduğu gibi kullanılır. Telefon ekran görüntüleri (10: çocuklar, 48: plakalar) kullanılmaz.
  - Sitedekiler: `src/assets/medya/` (gunes, klasorler/<id>, urunler) + `src/assets/hero/`. `npm run media` WebP kopyaları üretir (`public/medya/foto/`, gitignore). `src/content/media.ts` → `photo("gunes/...")` anahtarla seçer; klasörler `folderPhotos(id, captions)`, açıklamalar dosya adıyla eşleşir. **Canlıda bu bilgiler veritabanından gelir**: içerik dosyasındaki değişiklik canlıya yansımaz, ya panelden ya da DB'ye SQL ile girilir (seed sadece eksik satırları ekler).
  - Video: `public/medya/video/insan-algilama.mp4` (V02'nin 3-12. saniyesi, sessiz) + kapak. Video kodda kalır (panelden değişmez).
- **Yükleme göstergesi:** gecikmeli görsellerde parıltı (`global.css` → `img-wait` / `img-in`, `BaseLayout.astro` script; JS ile eklenen görseller için `window.watchImage(img)`).
- **Veritabanı komutları:** `npm run db:migrate:local|remote` (tablolar), `npm run db:seed:local|remote` (ilk içerik, var olanı ezmez). Yerel DB `.wrangler/state` (dev bunu kullanır, canlıyı değil); sıfırlamak için o klasörü silip migrate + seed. Yeni tablo/sütun = yeni migration dosyası (`0002_...sql`), eskiler değiştirilmez. Bağlantı tipleri `src/env.d.ts` (Cloudflare'in global tipleri tarayıcı tipleriyle çakıştığı için `wrangler types` kullanılmıyor).
- **Web Analytics verisi:** Cloudflare GraphQL + wrangler token ile okunabilir (Claude'un notlarında).

## Arşiv dizini (`plan-arsiv.md`, donmuş; sadece ilgili aralığı oku)

| Konu | Satırlar |
|---|---|
| İlk plan: bağlam, toplanan kararlar, önerilen bölümler, proje yapısı | 1-75 |
| Faz 1 ilk sürüm: tasarım kararları, dosya haritası | 76-97 |
| Tasarım v2 (Super 8 ilhamı): renkler, fontlar, header, sayfa akışı, animasyon bütçesi | 98-149 |
| Tasarım onayı, mobil düzenlemeler, yeşil palete geçiş | 150-175 |
| Müşteri bilgileri: alınan kararlar, net bilgiler (paket tablosu, markalar), açık sorular ve cevapları | 176-220 |
| 22.11 durum özeti (o günkü hali) | 221-230 |
| Bugünkü bölümlerin ayrıntısı: klasörler, ürün vitrini, fiyat etiketi, madde tasarımları, video, geçici ürün görselleri (kaynak ve lisans) | 231-256 |
| Fotoğraf ve video planı: dosya grupları, nereye kondu, gizlilik, bulanıklaştırma karşılaştırması, teknik yol | 257-321 |
| Eski önerilen sıra; müşteriden istenecek bilgiler tablosu (alan adları ile) | 322-366 |
| Git, yayına alma, yayın öncesi kontrol (Lighthouse 20.11 sonuçları) | 367-385 |
| Faz 1 kapanışı, İngilizce dil desteği nasıl eklendi, tema kararı | 386-392 |
| SEO stratejisi: noindex, H1, title, JSON-LD, 404, Lighthouse/CLS düzeltmesi, Web Analytics, hedef aramalar ve site yapısı, İşletme Profili | 393-437 |
| Güvenlik: başlıklar, CSP, bağımlılık taraması, gizli bilgiler | 438-444 |
| Admin paneli kararları ve tasarım dokümanı (bu dosyada güncel hali var) | 445-533 |
| Windows yol sorunu | 534-535 |
