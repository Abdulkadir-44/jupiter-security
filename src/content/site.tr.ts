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
  | "building";

export interface SiteContent {
  brand: {
    name: string;
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
    region: string;
    serviceAreas: string[];
  };
  seo: {
    title: string;
    description: string;
  };
  nav: { label: string; href: string; soon?: boolean }[];
  hero: {
    /** Dev başlığın satırları (büyük harfe otomatik çevrilir) */
    titleLines: string[];
    /** Erişilebilirlik ve SEO için düz başlık */
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
    items: {
      name: string;
      cameras: string;
      for: string;
      price: string;
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
  ui: {
    soon: string;
    menu: string;
    close: string;
    call: string;
    whatsappFloat: string;
    askPackage: string;
    skipToContent: string;
  };
}

export const site: SiteContent = {
  brand: {
    name: "JÜPİTER",
    fullName: "JÜPİTER Kamera Güvenlik Sistemleri",
    tagline: "Kamera sistemleri, anahtar teslim",
  },

  contact: {
    phoneDisplay: "0555 000 00 00", // YER TUTUCU
    phoneE164: "+905550000000", // YER TUTUCU
    whatsapp: "905550000000", // YER TUTUCU
    whatsappMessage: "Merhaba, kamera sistemi hakkında bilgi almak istiyorum.",
    instagram: { handle: "@jupiterkamera", url: "https://instagram.com/jupiterkamera" }, // YER TUTUCU
    hours: "Her gün 08:00 – 20:00", // YER TUTUCU
    region: "İskenderun ve çevresi, Hatay",
    serviceAreas: ["İskenderun", "Arsuz", "Payas", "Dörtyol", "Belen", "Antakya"], // YER TUTUCU
  },

  seo: {
    title: "JÜPİTER Kamera Güvenlik Sistemleri | İskenderun kamera montajı",
    description:
      "İskenderun ve Hatay genelinde ev, dükkan, fabrika ve siteler için anahtar teslim güvenlik kamerası kurulumu. Malzeme, montaj ve telefondan izleme bizden.",
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
    title: "Kör nokta bırakmadan kamera kuruyoruz.",
    meta: [
      { label: "Bölge", value: "İskenderun ve Hatay" },
      { label: "Hizmet", value: "Anahtar teslim kurulum" },
      { label: "Destek", value: "Kurulumdan sonra da" },
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
    title: "Telefonunuzdan izleyene kadar her adım bizde",
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
        title: "Montaj ve kablolama",
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
    title: "Nereyi korumak istiyorsunuz?",
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
      { value: 12, suffix: "+", label: "yıllık tecrübe" }, // YER TUTUCU
      { value: 850, suffix: "+", label: "tamamlanan kurulum" }, // YER TUTUCU
      { value: 2, suffix: " yıl", label: "montaj garantisi" }, // YER TUTUCU
    ],
  },

  packages: {
    title: "Hazır paketler",
    lead: "Mekânınızı görmeden kesin fiyat vermiyoruz. Bu paketler size bir fikir versin, keşifte birlikte netleştirelim.",
    priceNote: "Fiyat keşiften sonra netleşir",
    items: [
      {
        name: "Başlangıç",
        cameras: "2 kamera",
        for: "Daire, küçük ofis",
        price: "Fiyat için arayın", // YER TUTUCU
        features: ["2 adet 2 MP gece görüşlü kamera", "4 kanallı kayıt cihazı", "1 TB kayıt diski", "Telefondan izleme kurulumu"],
      },
      {
        name: "Ev ve dükkan",
        cameras: "4 kamera",
        for: "Müstakil ev, dükkan",
        price: "Fiyat için arayın", // YER TUTUCU
        featured: true,
        features: [
          "4 adet 4 MP gece görüşlü kamera",
          "4 kanallı kayıt cihazı",
          "2 TB kayıt diski",
          "Hareket algılama bildirimi",
          "Telefondan izleme kurulumu",
        ],
      },
      {
        name: "İşletme",
        cameras: "8 kamera",
        for: "Market, depo, atölye",
        price: "Fiyat için arayın", // YER TUTUCU
        features: [
          "8 adet 4 MP gece görüşlü kamera",
          "8 kanallı kayıt cihazı",
          "4 TB kayıt diski",
          "Uzaktan çoklu kullanıcı erişimi",
          "Yıllık bakım ziyareti",
        ],
      },
    ],
    allLink: "Tüm ürünler",
  },

  work: {
    title: "Yapılan işler",
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
    stat: { value: "850+", text: "İskenderun ve çevresinde tamamlanan kurulum. Çoğu müşterimiz bizi bir tanıdığından duydu." }, // YER TUTUCU
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

  ui: {
    soon: "Yakında",
    menu: "Menüyü aç",
    close: "Menüyü kapat",
    call: "Ara",
    whatsappFloat: "WhatsApp'tan yazın",
    askPackage: "Bu paketi sor",
    skipToContent: "İçeriğe geç",
  },
};
