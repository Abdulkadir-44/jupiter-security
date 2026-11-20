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
  /** Elektrik/internet olmayan yerler: güneş enerjili 4G (SIM kartlı) kameralar */
  remote: {
    eyebrow: string;
    title: string;
    lead: string;
    places: string[];
    features: string[];
    note: string;
    cta: string;
    whatsappMessage: string;
    /** Slider kartının üst şeridi */
    screenLabel: string;
    /**
     * Slider fotoğrafları. `image` boşsa "fotoğraf yakında" yer tutucusu gösterilir.
     * Fotoğraf eklemek için: dosyayı public/medya/gunes/ içine koyun, image: "/medya/gunes/dosya.webp" yazın.
     */
    slides: { caption: string; image?: string; alt?: string }[];
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
    whatsappMessage: string;
    /** Slider kartının üst şeridi */
    screenLabel: string;
    /**
     * Slider fotoğrafları. `image` boşsa "fotoğraf yakında" yer tutucusu gösterilir.
     * Fotoğraf eklemek için: dosyayı public/medya/wifi/ içine koyun, image: "/medya/wifi/dosya.webp" yazın.
     */
    slides: { caption: string; image?: string; alt?: string }[];
  };
  coverage: {
    title: string;
    lead: string;
    points: string[];
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
  work: {
    title: string;
    lead: string;
    items: { cam: string; place: string; area: string; kind: IconName }[];
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
    note: "Kurulumdan önce yerinde operatör çekimini kontrol ediyoruz.",
    cta: "Arazim için bilgi al",
    whatsappMessage: "Merhaba, güneş enerjili 4G kamera hakkında bilgi almak istiyorum. Kurulum yeri: ",
    screenLabel: "CAM 07 · ARAZİ",
    slides: [
      { caption: "Bağ" },
      { caption: "Bahçe" },
      { caption: "İnşaat şantiyesi" },
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
    note: "Kurulum yerinde Wi-Fi çekimini kontrol ediyoruz.",
    cta: "Wi-Fi kamera için bilgi al",
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
    lead: "Kurulum fotoğraflarımızı yakında burada paylaşacağız.",
    items: [
      { cam: "CAM 01", place: "Market girişi", area: "Çay Mah.", kind: "store" }, // YER TUTUCU
      { cam: "CAM 02", place: "Depo rampası", area: "Organize Sanayi", kind: "factory" }, // YER TUTUCU
      { cam: "CAM 03", place: "Site otoparkı", area: "Modern Evler", kind: "building" }, // YER TUTUCU
      { cam: "CAM 04", place: "Bahçe kapısı", area: "Arsuz", kind: "home" }, // YER TUTUCU
      { cam: "CAM 05", place: "Kasa önü", area: "Savaş Mah.", kind: "store" }, // YER TUTUCU
      { cam: "CAM 06", place: "Atölye içi", area: "Payas", kind: "wrench" }, // YER TUTUCU
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
