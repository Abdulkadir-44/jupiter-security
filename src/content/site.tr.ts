/**
 * JÜPİTER — sitedeki TÜM metinler ve bilgiler bu dosyada.
 *
 * ⚠️ Buradaki bilgilerin çoğu YER TUTUCUDUR (telefon, yıl, kurulum sayısı,
 * garanti, yorumlar vb.). Müşteriden gerçek bilgiler gelince sadece bu
 * dosyayı değiştirmeniz yeterli; bileşenlere dokunmanız gerekmez.
 *
 * İleride admin paneli gelince bu veriler veritabanından (Cloudflare D1)
 * okunacak. Bileşenler veriyi doğrudan buradan değil `src/lib/data.ts`
 * üzerinden alır; geçiş tek noktadan yapılacak.
 */

import { media, type Photo } from "./media";

/** Slider karesi. `image` boşsa "fotoğraf yakında" yer tutucusu görünür. */
export type Slide = { caption: string; image?: Photo; alt?: string };

export type IconName =
  | "search"
  | "clipboard"
  | "wrench"
  | "smartphone"
  | "shield"
  | "home"
  | "store"
  | "factory"
  | "building"
  | "solar"
  | "battery"
  | "cctv"
  | "tower"
  | "wifi";

export interface SiteContent {
  /** Dil bilgisi (html lang, paylaşım dili, dil değiştirici) */
  locale: {
    lang: "tr" | "en";
    /** Open Graph dili, örn. tr_TR */
    ogLocale: string;
    /** Sayı biçimi, örn. tr-TR */
    numberLocale: string;
    /** Kısa ad (diğer dildeki sayfanın dil değiştiricisinde görünür) */
    short: string;
    /** Dilin kendi adı, örn. "Türkçe" */
    name: string;
  };
  brand: {
    name: string;
    /** Resmi ad: sitede, Google İşletme Profili'nde, Instagram'da ve haritalarda BİREBİR aynı olmalı */
    fullName: string;
    tagline: string;
  };
  contact: {
    /** Ekranda görünen hali */
    phoneDisplay: string;
    /** tel: linki için, boşluksuz (+90...) */
    phoneE164: string;
    /** wa.me linki için, + ve boşluk olmadan (90...) */
    whatsapp: string;
    whatsappMessage: string;
    instagram: { handle: string; url: string };
    facebook?: { name: string; url: string };
    hours: string;
    /**
     * Google için açılış saatleri (ekrandaki `hours` ile aynı olmalı). Günler: Mo Tu We Th Fr Sa Su.
     * Boş liste = sabit saat yok (esnek çalışma); Google verisine saat yazılmaz.
     */
    openingHours: { days: ("Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su")[]; opens: string; closes: string }[];
    region: string;
    serviceAreas: string[];
  };
  /** Kullanılan markalar (paketler ve güneş enerjili bölümde gösterilir, Google verisine de eklenir) */
  brands: { cctv: string[]; solar: string[] };
  seo: {
    title: string;
    description: string;
    /** Paylaşım görseli (public/ içinde, 1200x630) */
    ogImage: string;
  };
  nav: { label: string; href: string; soon?: boolean }[];
  hero: {
    /** Dev başlığın satırları (büyük harfe otomatik çevrilir) */
    titleLines: string[];
    /** Sloganın üstündeki görünür etiket; H1'in görünen kısmı (SEO: ana anahtar kelime) */
    eyebrow: string;
    /** H1'in devamı (ekran okuyucu ve Google için sloganın düz cümlesi) */
    title: string;
    lead: string;
    meta: { label: string; value: string }[];
    imageAlt: string;
    primaryCta: string;
    secondaryCta: string;
    notes: string[];
    scene: {
      label: string;
      result: string;
      rooms: { mağaza: string; depo: string; kasa: string; giriş: string };
    };
  };
  /** Boş bırakılırsa (null) şerit gizlenir */
  announcement: { text: string; cta?: string } | null;
  process: {
    title: string;
    lead: string;
    /** Adım kartlarındaki etiket (örn. "Adım" → "ADIM 01") */
    stepLabel: string;
    steps: { icon: IconName; title: string; text: string }[];
  };
  useCases: {
    title: string;
    lead: string;
    items: {
      id: string;
      icon: IconName;
      label: string;
      title: string;
      text: string;
      setup: string[];
      cameras: string;
    }[];
  };
  /**
   * Ürün vitrini (kullanım alanları ile güneş enerjili bölüm arasında, açık renkli panel, kaydırmalı kartlar).
   * Fotoğraflar Jüpiter'den gelince `image` doldurulur (src/assets/medya/urunler/ + src/content/media.ts).
   */
  products: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Kartlardaki WhatsApp bağlantısı */
    ask: string;
    /** Özellik listesindeki marka satırının etiketi ("Marka: Dahua · Hikvision") */
    brandLabel: string;
    /** WhatsApp mesajı; {name} ürün adıyla değişir */
    message: string;
    prev: string;
    next: string;
    items: {
      name: string;
      category: string;
      /** Fotoğraf yokken gösterilecek ikon */
      icon: "bullet" | "dome" | "ptz" | "solar" | "wifi" | "nvr";
      specs: string[];
      brand?: string;
      image?: Photo;
      alt?: string;
    }[];
  };
  /** Elektrik/internet olmayan yerler: güneş enerjili 4G (SIM kartlı) kameralar */
  remote: {
    eyebrow: string;
    title: string;
    lead: string;
    places: string[];
    features: string[];
    note: string;
    cta: string;
    /** Asma fiyat etiketi (varsa düz buton yerine gösterilir). `cta` ekran okuyucu/yedek metin olarak kalır. */
    priceTag?: { lead?: string; amount: string; trail?: string; action: string };
    whatsappMessage: string;
    /** Slider kartının üst şeridi */
    screenLabel: string;
    /**
     * Slider fotoğrafları (dikey 4:5). `image` boşsa "fotoğraf yakında" yer tutucusu gösterilir.
     * Fotoğraf eklemek için: src/assets/medya/gunes/ içine koyup src/content/media.ts'e ekleyin.
     */
    slides: Slide[];
  };
  /** Wi-Fi (kablosuz) kameralar: güneş enerjili bölümün altında, sağda fotoğraf slider'ı */
  wifi: {
    eyebrow: string;
    title: string;
    lead: string;
    places: string[];
    features: string[];
    note: string;
    cta: string;
    /** Asma fiyat etiketi (varsa düz buton yerine gösterilir). `cta` ekran okuyucu/yedek metin olarak kalır. */
    priceTag?: { lead?: string; amount: string; trail?: string; action: string };
    whatsappMessage: string;
    /** Slider kartının üst şeridi */
    screenLabel: string;
    /**
     * Slider fotoğrafları. `image` boşsa "fotoğraf yakında" yer tutucusu gösterilir.
     * Fotoğraf eklemek için: src/assets/medya/wifi/ içine koyup src/content/media.ts'e ekleyin.
     */
    slides: Slide[];
  };
  coverage: {
    title: string;
    lead: string;
    points: string[];
    /** Ayrı bölüm (Detection.astro, açık panel): gerçek kayıttan insan algılama klibi (public/medya/video/) */
    detection: {
      /** Başlığın üstündeki küçük etiket */
      eyebrow: string;
      /** Video çerçevesinin üst şeridi */
      label: string;
      title: string;
      text: string;
      points: string[];
      /** Videonun altındaki açıklama */
      caption: string;
      play: string;
      pause: string;
    };
  };
  closing: {
    lines: string[];
    lead: string;
  };
  why: {
    title: string;
    text: string;
    stats: { value: number; suffix: string; label: string }[];
  };
  packages: {
    title: string;
    lead: string;
    priceNote: string;
    /** Fiyat yazısı şablonu; {price} büyük yazılan tutarla değişir (örn. "{price}'den başlayan") */
    priceTemplate: string;
    /** Fiyatın altındaki not (örn. "KDV ve montaj dahil") */
    priceIncludes: string;
    /** "Kullandığımız markalar" satırı */
    brandsLabel: string;
    items: {
      name: string;
      cameras: string;
      for: string;
      /** Başlangıç fiyatı (TL, sayı olarak; ekranda dile göre biçimlenir) */
      priceFrom: number;
      featured?: boolean;
      features: string[];
    }[];
    allLink: string;
  };
  /**
   * "Yaptığımız kamera kurulumları": klasör kartları; tıklayınca fotoğraflar macOS penceresi gibi açılır.
   * Fotoğraflar src/assets/medya/klasorler/<id>/ içinden otomatik okunur (src/content/media.ts → folderPhotos).
   */
  work: {
    title: string;
    lead: string;
    /** "{n} fotoğraf" */
    photosLabel: string;
    /** Klasörü açma düğmesinin ekran okuyucu metni: "{title} klasörünü aç" */
    openLabel: string;
    /** Pencere düğmeleri */
    closeLabel: string;
    minimizeLabel: string;
    prevLabel: string;
    nextLabel: string;
    folders: {
      /** src/assets/medya/klasorler/ altındaki klasör adı */
      id: string;
      title: string;
      /**
       * Fotoğraf açıklamaları, dosya adıyla (uzantısız) eşleşir. `area`: mahalle/semt/ilçe; bilinmiyorsa boş,
       * Jüpiter konum bilgisini verince doldurulacak.
       */
      captions: Record<string, { caption: string; area?: string }>;
    }[];
    allLink: string;
  };
  reviews: {
    title: string;
    stat: { value: string; text: string };
    items: { quote: string; name: string; place: string }[];
  };
  contactSection: {
    title: string;
    lead: string;
    callLabel: string;
    whatsappLabel: string;
    instagramLabel: string;
    /** Instagram kartındaki düğme */
    followLabel: string;
    /** Saat kartındaki küçük etiket */
    hoursLabel: string;
    /** WhatsApp balonundaki saat yerine yazı */
    nowLabel: string;
    areasTitle: string;
  };
  footer: {
    note: string;
  };
  /** 404 sayfası (iki dil aynı sayfada gösterilir) */
  notFound: {
    pageTitle: string;
    code: string;
    titleLines: string[];
    text: string;
    home: string;
    /** Kamera ekranındaki yazılar */
    noSignal: string;
    noRecord: string;
  };
  ui: {
    soon: string;
    menu: string;
    close: string;
    call: string;
    whatsappFloat: string;
    askPackage: string;
    /** Paket içeriği satırlarının sağındaki etiket */
    included: string;
    skipToContent: string;
    /** Logo linki için ekran okuyucu metni ("sayfa başı") */
    backToTop: string;
    mainNav: string;
    mobileNav: string;
    /** Dil değiştirici linkinin ekran okuyucu metni (diğer dile geçiş) */
    switchLanguage: string;
    useCasesTabs: string;
    campaign: string;
    footerMenu: string;
    footerContact: string;
    footerSocial: string;
    /** NVR kanal kutusu */
    recommended: string;
    baseSetup: string;
    optionalSetup: string;
    /** WhatsApp mesaj şablonları: {name}, {cameras}, {text} değişir */
    packageMessage: string;
    campaignMessage: string;
    ogImageAlt: string;
    /** Fotoğraf slider'ı */
    sliderPrev: string;
    sliderNext: string;
    /** {n} fotoğraf numarasıyla değişir */
    sliderGoTo: string;
    photoSoon: string;
  };
}

export const site: SiteContent = {
  locale: { lang: "tr", ogLocale: "tr_TR", numberLocale: "tr-TR", short: "TR", name: "Türkçe" },

  brand: {
    name: "JÜPİTER",
    fullName: "Jüpiter Güvenlik Sistemleri",
    tagline: "Kamera sistemleri, anahtar teslim",
  },

  contact: {
    phoneDisplay: "0545 142 31 31",
    phoneE164: "+905451423131",
    whatsapp: "905451423131",
    whatsappMessage: "Merhaba, kamera sistemi hakkında bilgi almak istiyorum.",
    instagram: { handle: "@jupiterkamera", url: "https://instagram.com/jupiterkamera" }, // YER TUTUCU
    // Esnek çalışma: saat WhatsApp'tan müşteriyle birlikte belirleniyor (müşteri kararı)
    hours: "Esnek saatler, WhatsApp'tan randevuyla",
    openingHours: [],
    region: "İskenderun ve çevresi, Hatay",
    serviceAreas: ["İskenderun", "Arsuz", "Payas", "Dörtyol", "Belen", "Antakya"],
  },

  brands: {
    cctv: ["Dahua", "Hikvision", "ZTEC", "IOMA"],
    solar: ["O-KAM", "IOMA"],
  },

  seo: {
    ogImage: "/og.jpg",
    title: "İskenderun Kamera Montajı ve Güvenlik Kamerası | JÜPİTER",
    description:
      "İskenderun ve Hatay'da ev, dükkan, fabrika ve siteler için anahtar teslim güvenlik kamerası montajı. Keşif, malzeme, kurulum ve telefondan izleme tek elden.",
  },

  nav: [
    { label: "Nasıl çalışıyoruz", href: "#surec" },
    { label: "Kullanım alanları", href: "#alanlar" },
    { label: "Paketler", href: "#paketler" },
    { label: "Yapılan işler", href: "#isler" },
    { label: "İletişim", href: "#iletisim" },
  ],

  hero: {
    titleLines: ["Kör nokta", "bırakmıyoruz"],
    eyebrow: "İskenderun Kamera Montajı",
    title: "Kör nokta bırakmadan güvenlik kamerası kuruyoruz",
    meta: [
      { label: "Bölge", value: "İskenderun ve Hatay" },
      { label: "Hizmet", value: "Anahtar teslim kurulum" },
      { label: "Garanti", value: "2 yıl destek ve garanti" },
    ],
    imageAlt: "Bulutlu gökyüzü önünde direğe monte edilmiş güvenlik kameraları",
    lead:
      "Malzemeyi biz alırız, kabloyu biz çekeriz, kameraları telefonunuza biz bağlarız. Siz sadece nereyi görmek istediğinizi söyleyin.",
    primaryCta: "Hemen ara",
    secondaryCta: "WhatsApp'tan yaz",
    notes: ["Adresinize geliyoruz", "Malzeme ve montaj dahil", "Telefondan canlı izleme"],
    scene: {
      label: "Örnek yerleşim: dükkan",
      result: "4 kamera, kör nokta yok",
      rooms: { mağaza: "Mağaza", depo: "Depo", kasa: "Kasa", giriş: "Giriş" },
    },
  },

  announcement: {
    text: "Kasım ayına özel: 4 kameralı pakette kurulum ücretsiz.", // YER TUTUCU kampanya
    cta: "Detayı sor",
  },

  process: {
    title: "Keşiften telefonunuza, kamera kurulumunun her adımı bizde",
    lead: "Tek bir firmayla konuşursunuz. Keşiften bakıma kadar aynı ekip ilgilenir.",
    stepLabel: "Adım",
    steps: [
      {
        icon: "search",
        title: "Yerinde keşif",
        text: "Mekânınıza gelip nereleri görmek istediğinizi dinleriz, kamera yerlerini birlikte belirleriz.",
      },
      {
        icon: "clipboard",
        title: "Plan ve malzeme",
        text: "İhtiyaca göre kamera, kayıt cihazı ve kabloyu seçeriz. Malzemeyi biz temin ederiz.",
      },
      {
        icon: "wrench",
        title: "Montaj",
        text: "Kabloları düzgünce gizler, kameraları sağlam şekilde sabitler, açıları tek tek ayarlarız.",
      },
      {
        icon: "smartphone",
        title: "Telefona bağlama",
        text: "Uygulamayı telefonunuza kurar, canlı izlemeyi ve geçmiş kayıtları nasıl açacağınızı gösteririz.",
      },
      {
        icon: "shield",
        title: "Bakım ve destek",
        text: "Kurulumdan sonra da bir telefon uzağınızdayız. Arıza olursa yerinde çözeriz.",
      },
    ],
  },

  useCases: {
    title: "Ev, dükkan, fabrika: nereyi korumak istiyorsunuz?",
    lead: "Her mekânın kör noktası farklıdır. Bir alan seçin, size uygun kurulumu görün.",
    items: [
      {
        id: "ev",
        icon: "home",
        label: "Ev",
        title: "Ev ve müstakil konut",
        text: "Kapı önü, bahçe ve otopark. Evde yokken de telefondan bakarsınız, gece görüşüyle karanlıkta bile net görürsünüz.",
        setup: ["Gece görüşlü dış mekân kameraları", "Kapı önüne yüz seçebilen kamera", "Telefona anlık hareket bildirimi"],
        cameras: "2–4 kamera",
      },
      {
        id: "dukkan",
        icon: "store",
        label: "Dükkan",
        title: "Dükkan ve işyeri",
        text: "Kasa, giriş ve raflar. Hırsızlığı caydırır, olası bir anlaşmazlıkta kayıt elinizde olur.",
        setup: ["Kasa üstüne yüksek çözünürlüklü kamera", "Girişi ve vitrini gören geniş açı", "En az 30 gün kayıt saklama"],
        cameras: "4–8 kamera",
      },
      {
        id: "fabrika",
        icon: "factory",
        label: "Fabrika / depo",
        title: "Fabrika, depo ve şantiye",
        text: "Geniş alanlar, yükleme rampaları ve çevre duvarı. Uzun mesafede plaka ve yüz okuyabilen kameralarla.",
        setup: ["Uzun mesafe zoom kameralar", "Çevre hattı için gece görüşü", "Yedekli kayıt cihazı"],
        cameras: "8–32 kamera",
      },
      {
        id: "site",
        icon: "building",
        label: "Site / apartman",
        title: "Site ve apartman",
        text: "Giriş kapısı, otopark, asansör önü. Yönetim ve sakinler için ortak, düzenli bir izleme sistemi.",
        setup: ["Otopark ve giriş kapısı kameraları", "Yönetime özel izleme ekranı", "Her blok için ayrı kayıt kanalı"],
        cameras: "6–16 kamera",
      },
    ],
  },

  // YER TUTUCU ürünler: Jüpiter ürün fotoğraflarını ve listesini gönderince güncellenecek.
  // (Bullet kameranın özellikleri Jüpiter'in kendi tanıtım videosundan.)
  products: {
    eyebrow: "Ürünlerimiz",
    title: "Taktığımız kameralar ve cihazlar",
    lead: "Kurulumlarda kullandığımız ürünlerden bazıları. Hepsi garantili; hangisinin size uygun olduğunu keşifte birlikte seçiyoruz.",
    ask: "WhatsApp'tan sor",
    brandLabel: "Marka",
    message: "Merhaba, {name} hakkında bilgi almak istiyorum.",
    prev: "Önceki ürün",
    next: "Sonraki ürün",
    items: [
      { name: "5 MP bullet kamera", category: "Dış mekân", icon: "bullet", image: media.urunler.bullet, alt: "Ağaca monte edilmiş beyaz bullet kameralar", specs: ["Metal kasa", "2.8 mm geniş açı lens", "Sesli kayıt", "Gece renkli görüntü"], brand: "Dahua · Hikvision" },
      { name: "5 MP dome kamera", category: "İç mekân", icon: "dome", image: media.urunler.dome, alt: "Tavana monte edilmiş iç mekân kamerası", specs: ["Tavana montaj, göze batmaz", "Gece görüşü", "Geniş görüş açısı"], brand: "Dahua · Hikvision" },
      { name: "PTZ dönebilen kamera", category: "360° görüş", icon: "ptz", image: media.urunler.ptz, alt: "Direğe monte edilmiş dönebilen PTZ kamera", specs: ["Telefondan sağa sola çevirme", "Yakınlaştırma", "Hareket takibi"] },
      { name: "Güneş enerjili 4G kamera", category: "Elektriksiz alan", icon: "solar", image: media.urunler.gunes, alt: "Palmiyeye monte edilmiş güneş panelli 4G kamera", specs: ["Güneş paneli ve batarya", "SIM kartla internet", "Prize gerek yok"], brand: "O-KAM · IOMA" },
      { name: "Wi-Fi kamera", category: "Kablosuz", icon: "wifi", image: media.urunler.wifi, alt: "Telefonun yanında beyaz Wi-Fi kamera", specs: ["Prize takılır, kablo çekilmez", "İki yönlü konuşma", "Telefondan canlı izleme"] },
      { name: "NVR kayıt cihazı", category: "Kayıt", icon: "nvr", image: media.urunler.nvr, alt: "Kayıt cihazına bağlı monitörde 13 kamera görüntüsü", specs: ["4, 8 ve 16 kanal", "500 GB – 1 TB disk", "Uzaktan izleme"], brand: "ZTEC" },
    ],
  },

  remote: {
    eyebrow: "Güneş enerjili 4G kameralar",
    title: "Elektrik yok, internet yok, sorun değil",
    lead:
      "Bağ, bahçe, inşaat şantiyesi, yayla evi ya da yazlık... Elektriğin ve internetin olmadığı yerlere güneş paneliyle çalışan, SIM kartla internete bağlanan kameralar kuruyoruz. Kablo çekmeden, prize ihtiyaç duymadan telefonunuzdan izlersiniz.",
    places: ["Bağ ve bahçe", "İnşaat şantiyesi", "Yayla evi", "Yazlık", "Tarla ve arazi", "Ahır ve çiftlik"],
    features: [
      "Prize, kabloya ve sabit internete gerek yok",
      "Elektrik kesintisinden etkilenmez",
      "Hareket algılayınca telefonunuza bildirim gelir",
      "Gece görüşlü, her mevsime dayanıklı dış mekân kasası",
      "SIM kartı biz temin edip kuruyoruz, ayrıca hat almanıza gerek yok",
    ],
    note: "KDV ve montaj dahil. Kurulumdan önce yerinde operatör çekimini kontrol ediyoruz.",
    cta: "8.999 TL'den başlayan fiyatlarla",
    priceTag: { amount: "8.999 TL'den", trail: "başlayan fiyatlarla", action: "WhatsApp'tan sor" },
    whatsappMessage: "Merhaba, güneş enerjili 4G kamera hakkında bilgi almak istiyorum. Kurulum yeri: ",
    screenLabel: "CAM 07 · ARAZİ",
    slides: [
      { caption: "Palmiye ağacına montaj", image: media.gunes.palmiye, alt: "Palmiye ağacına monte edilmiş, üstünde güneş paneli olan 4G kamera" },
      { caption: "Şantiye yanında elektrik direğine", image: media.gunes.elektrikDiregi, alt: "İnşaat halindeki binanın önünde, demir direğe takılmış güneş panelli 4G kamera" },
      { caption: "Çam ağacına, güneş paneliyle", image: media.gunes.camAgaci, alt: "Çam ağacının gövdesine takılmış 4G kamera ve yanındaki güneş paneli" },
      { caption: "Şantiyede direğe montaj", image: media.gunes.santiyeDiregi, alt: "Şantiyede yüksek bir direğin tepesine kurulan güneş enerjili kamera" },
      { caption: "Yüksek palmiyeye merdivenle montaj", image: media.gunes.palmiyeMontaj, alt: "Uzun palmiye ağaçları ve gövdeye dayalı merdivenle yapılan kamera montajı" },
      { caption: "Konteyner üstüne direkle", image: media.gunes.konteyner, alt: "Gün batımında şantiye konteynerinin üstündeki direğe takılmış kamera" },
    ],
  },

  // ŞABLON: metin taslak, müşteri ürün özelliklerini teyit edecek; fotoğraflar gelecek
  wifi: {
    eyebrow: "Wi-Fi kameralar",
    title: "Kablo yok, duvar delmek yok, kurulumu kolay",
    lead:
      "Evde, dükkanda ya da ofiste kablo çekmeden kamera isteyenler için: Wi-Fi kameralar mevcut internetinize bağlanır, prize takılır ve telefonunuzdan izlenir. Kiracılar ve sık yer değiştirenler için de ideal.",
    places: ["Ev içi", "Bebek ve çocuk odası", "Evcil hayvan takibi", "Küçük dükkan", "Ofis", "Kiralık ev"],
    features: [
      "Kablo çekmeye gerek yok, sadece prize takılır",
      "Evinizdeki Wi-Fi internete bağlanır",
      "Telefondan canlı izleme ve iki yönlü konuşma",
      "Hareket algılayınca telefonunuza bildirim",
      "Taşınırken yanınızda götürebilirsiniz",
    ],
    note: "KDV ve montaj dahil. Kurulum yerinde Wi-Fi çekimini kontrol ediyoruz.",
    cta: "6.999 TL'den başlayan fiyatlarla",
    priceTag: { amount: "6.999 TL'den", trail: "başlayan fiyatlarla", action: "WhatsApp'tan sor" },
    whatsappMessage: "Merhaba, Wi-Fi kamera hakkında bilgi almak istiyorum. Kurulum yeri: ",
    screenLabel: "CAM 08 · WI-FI",
    slides: [
      { caption: "Ev içi kurulum" },
      { caption: "Bebek odası" },
      { caption: "Dükkan girişi" },
      { caption: "Ofis" },
    ],
  },

  coverage: {
    title: "Kameraları rastgele değil, plana göre takıyoruz",
    lead:
      "Keşifte mekânınızın planını çıkarır, her kameranın neyi göreceğini önceden hesaplarız. Görmediği köşe kalmayana kadar yerleşimi değiştiririz.",
    points: ["Kasa, giriş ve depo ayrı ayrı görülür", "Açılar üst üste binmeden birbirini tamamlar", "Gece görüşünün menzili hesaba katılır"],
    detection: {
      eyebrow: "Yapay zekâlı kameralar",
      label: "CAM 04 · İNSAN ALGILAMA",
      title: "İnsanı algılar, telefonunuza haber verir",
      text: "Yapay zekâlı kameralarımız rüzgârda sallanan dalı değil, insanı ayırt eder. Biri alana girdiği anda telefonunuza bildirim gelir, kayıtta o an işaretlenir.",
      points: ["Gereksiz alarm yerine gerçek uyarı", "Kayıtta insanlı anları hızlıca bulursunuz", "Gece de çalışır"],
      caption: "Gerçek kayıt: kurduğumuz bir kameranın görüntüsü",
      play: "Videoyu oynat",
      pause: "Videoyu durdur",
    },
  },

  closing: {
    lines: ["Kameranızı", "biz kuralım"],
    lead: "Arayın, uygun saatte keşfe gelelim. Malzeme, montaj ve telefon kurulumu bizden.",
  },

  why: {
    title: "Kurduğumuz sistemin arkasında dururuz",
    text:
      "Kamerayı takıp gitmiyoruz. Kayıtların düzgün tutulduğunu, gece görüntüsünün net olduğunu ve telefonunuzdan rahatça izleyebildiğinizi görmeden işi bitmiş saymıyoruz.",
    stats: [
      { value: 3, suffix: " yıl", label: "tecrübe" },
      { value: 600, suffix: "+", label: "tamamlanan kurulum" },
      { value: 2, suffix: " yıl", label: "destek ve garanti" },
    ],
  },

  packages: {
    title: "Hazır kamera sistemi paketleri",
    lead: "Mekânınızı görmeden kesin fiyat vermiyoruz. Bu paketler size bir fikir versin, keşifte birlikte netleştirelim.",
    priceNote: "Fiyat keşiften sonra netleşir",
    priceTemplate: "{price}'den başlayan",
    priceIncludes: "KDV ve montaj dahil",
    brandsLabel: "Kullandığımız markalar",
    items: [
      {
        name: "Başlangıç",
        cameras: "2 kamera",
        for: "Daire, küçük ofis",
        priceFrom: 9999,
        features: [
          "2 adet 5 MP gece görüşlü kamera",
          "4 kanallı kayıt cihazı",
          "500 GB kayıt diski",
          "Hareket algılama bildirimi",
          "Telefondan izleme",
        ],
      },
      {
        name: "Ev ve dükkan",
        cameras: "4 kamera",
        for: "Müstakil ev, dükkan",
        priceFrom: 14999,
        featured: true,
        features: [
          "4 adet 5 MP gece görüşlü kamera",
          "4 kanallı kayıt cihazı",
          "500 GB kayıt diski",
          "Hareket algılama bildirimi",
          "Telefondan izleme",
        ],
      },
      {
        name: "İşletme",
        cameras: "8 kamera",
        for: "Market, depo, atölye",
        priceFrom: 29999,
        features: [
          "8 adet 5 MP gece görüşlü kamera",
          "8 kanallı kayıt cihazı",
          "1 TB kayıt diski",
          "Uzaktan çoklu kullanıcı erişimi",
          "Telefondan izleme",
        ],
      },
    ],
    allLink: "Tüm ürünler",
  },

  work: {
    title: "Yaptığımız kamera kurulumları",
    lead: "Kurduğumuz sistemlerden gerçek fotoğraflar ve kamera görüntüleri. Bir klasör açın. Gizlilik için plakaları ve yüzleri bulanıklaştırdık.",
    photosLabel: "{n} fotoğraf",
    openLabel: "{title} klasörünü aç",
    closeLabel: "Kapat",
    minimizeLabel: "Küçült",
    prevLabel: "Önceki fotoğraf",
    nextLabel: "Sonraki fotoğraf",
    folders: [
      {
        id: "kafe-isyeri",
        title: "Kafe ve işyeri",
        captions: {
          "01-kafe-ic-mekan-gunduz": { caption: "İç mekan, gündüz" },
          "02-kafe-ic-mekan-gece": { caption: "İç mekan, gece" },
          "03-kafe-onu-gunduz": { caption: "Kafe önü, gündüz" },
          "04-kafe-onu-gece": { caption: "Aynı kamera, gece" },
          "05-kafe-bahcesi-gunduz": { caption: "Bahçe, gündüz" },
          "06-kafe-bahcesi-aksam": { caption: "Bahçe, akşam" },
          "07-yol-tarafi-gunduz": { caption: "Yol tarafı, gündüz" },
          "08-yol-tarafi-gece": { caption: "Yol tarafı, gece" },
          "09-dortlu-ekran": { caption: "Dört kamera tek ekranda" },
        },
      },
      {
        id: "gunes-enerjili",
        title: "Güneş enerjili kurulumlar",
        captions: {
          "01-palmiye": { caption: "Palmiye ağacına, güneş paneliyle" },
          "02-elektrik-diregi-santiye": { caption: "Şantiye yanında elektrik direğine" },
          "03-cam-agaci-gunes-paneli": { caption: "Çam ağacına, paneli yanında" },
          "04-cam-agaci-yakin": { caption: "Çam ağacı, yakından" },
          "05-santiye-diregi": { caption: "Şantiyede direğe montaj" },
          "06-palmiye-montaj": { caption: "Yüksek palmiyeye merdivenle" },
          "07-konteyner-diregi": { caption: "Konteyner üstüne direkle" },
          "08-elektrik-diregi-bina": { caption: "Yeni binanın önünde direğe" },
        },
      },
      {
        id: "kayit-ekranlari",
        title: "Kayıt ekranları",
        captions: {
          "01-13-kamerali-ekran": { caption: "13 kamera tek ekranda" },
          "02-monitor-ve-kayit-cihazi": { caption: "Monitör ve kayıt cihazı kutusu" },
          "03-monitor-yakin": { caption: "Tavana askılı monitör" },
          "04-monitor-kapi-ustu": { caption: "Kapı üstüne monitör montajı" },
        },
      },
      {
        id: "agac-direk-montaj",
        title: "Ağaca ve direğe montaj",
        captions: {
          "01-agaca-uc-kamera": { caption: "Bir ağaçta üç kamera" },
          "02-agaca-baglanti-kutusu": { caption: "Bağlantı kutusuyla düzenli kablolama" },
          "03-merdivenle-montaj": { caption: "Montaj sırasında" },
          "04-cam-agaci-merdiven": { caption: "Yüksek çam ağacına montaj" },
          "05-palmiye-govdesi": { caption: "Palmiye gövdesine" },
          "06-palmiye-gunes-paneli": { caption: "Palmiyede güneş paneliyle" },
          "07-cam-agaci-gunes-paneli": { caption: "Çam ağacında güneş paneliyle" },
        },
      },
    ],
    allLink: "Tüm işler",
  },

  reviews: {
    title: "Müşterilerimiz ne diyor",
    stat: { value: "600+", text: "İskenderun ve çevresinde 3 yılda tamamlanan kurulum. Her birine 2 yıl destek ve garanti." },
    items: [
      // YER TUTUCU yorumlar: gerçek müşteri yorumlarıyla değiştirin
      {
        quote: "Kabloları o kadar düzgün gizlediler ki dükkanda kamera olduğunu ancak bakınca fark ediyorsunuz.",
        name: "Mehmet K.",
        place: "Market sahibi, İskenderun",
      },
      {
        quote: "Telefondan izlemeyi annem bile kullanabiliyor. Kurulumdan sonra tek tek gösterdiler.",
        name: "Elif D.",
        place: "Ev sahibi, Arsuz",
      },
      {
        quote: "Gece görüntüsü beklediğimizden çok daha net. Bir arızada aynı gün gelip çözdüler.",
        name: "Hasan T.",
        place: "Depo işletmecisi, Payas",
      },
      {
        quote: "Site yönetimi olarak otopark ve girişleri tek ekrandan izliyoruz. Çok memnunuz.",
        name: "Ayşe Y.",
        place: "Site yöneticisi, İskenderun",
      },
    ],
  },

  contactSection: {
    title: "Adresinize geliyoruz",
    lead: "Sabit bir dükkanımız yok, ekibimiz araçla sahada. Arayın ya da yazın, uygun saatte keşfe gelelim.",
    callLabel: "Telefonla arayın",
    whatsappLabel: "WhatsApp'tan yazın",
    instagramLabel: "Instagram'da takip edin",
    followLabel: "Takip et",
    hoursLabel: "Çalışma saatleri",
    nowLabel: "şimdi",
    areasTitle: "Hizmet verdiğimiz yerler",
  },

  footer: {
    note: "İskenderun merkezli, Hatay geneline kamera kurulumu.",
  },

  notFound: {
    pageTitle: "Sayfa bulunamadı (404) | Jüpiter Güvenlik Sistemleri",
    code: "Hata 404",
    titleLines: ["Burası", "kör nokta"],
    text: "Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Ana sayfaya dönün ya da bizi arayın, kameranızı kuralım.",
    home: "Ana sayfaya dön",
    noSignal: "Sinyal yok",
    noRecord: "Kayıt bulunamadı",
  },

  ui: {
    soon: "Yakında",
    menu: "Menüyü aç",
    close: "Menüyü kapat",
    call: "Ara",
    whatsappFloat: "WhatsApp'tan yazın",
    askPackage: "Bu paketi sor",
    included: "Dahil",
    skipToContent: "İçeriğe geç",
    backToTop: "sayfa başı",
    mainNav: "Ana menü",
    mobileNav: "Mobil menü",
    switchLanguage: "Sayfanın İngilizce sürümü",
    useCasesTabs: "Kullanım alanları",
    campaign: "Kampanya",
    footerMenu: "Menü",
    footerContact: "İletişim",
    footerSocial: "Sosyal",
    recommended: "Önerilen",
    baseSetup: "Temel kurulum",
    optionalSetup: "İhtiyaca göre",
    packageMessage: 'Merhaba, "{name}" paketi ({cameras}) hakkında bilgi almak istiyorum.',
    campaignMessage: "Merhaba, kampanya hakkında bilgi almak istiyorum: {text}",
    ogImageAlt: "Jüpiter Güvenlik Sistemleri: Kör nokta bırakmıyoruz",
    sliderPrev: "Önceki fotoğraf",
    sliderNext: "Sonraki fotoğraf",
    sliderGoTo: "{n}. fotoğrafa git",
    photoSoon: "Fotoğraf yakında",
  },
};
