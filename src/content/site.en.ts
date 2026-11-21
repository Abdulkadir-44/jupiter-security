/**
 * JÜPİTER: English content. Same shape as site.tr.ts (TypeScript fails the build if anything is missing).
 *
 * Phone, WhatsApp, Instagram and service areas are shared with the Turkish file,
 * so real contact details only need to be entered once (in site.tr.ts).
 * Placeholder notes (YER TUTUCU) in site.tr.ts apply here too.
 */
import { site as tr, type SiteContent } from "./site.tr";
import { media } from "./media";

export const site: SiteContent = {
  locale: { lang: "en", ogLocale: "en_US", numberLocale: "en-US", short: "EN", name: "English" },

  brand: {
    name: "JÜPİTER",
    fullName: "Jüpiter Güvenlik Sistemleri",
    tagline: "Camera systems, turnkey",
  },

  contact: {
    ...tr.contact,
    whatsappMessage: "Hello, I'd like to get information about a camera system.",
    hours: "Flexible hours, book on WhatsApp",
    region: "İskenderun and surroundings, Hatay",
  },

  brands: tr.brands,

  seo: {
    ogImage: "/og-en.jpg",
    title: "CCTV Installation in İskenderun | Jüpiter Güvenlik Sistemleri",
    description:
      "Turnkey CCTV installation for homes, shops, factories and apartments in İskenderun and Hatay. Site visit, equipment, installation and phone setup.",
  },

  nav: [
    { label: "How we work", href: "#surec" },
    { label: "Use cases", href: "#alanlar" },
    { label: "Packages", href: "#paketler" },
    { label: "Our work", href: "#isler" },
    { label: "Contact", href: "#iletisim" },
  ],

  hero: {
    titleLines: ["We leave no", "blind spots"],
    eyebrow: "CCTV Installation in İskenderun",
    title: "Security camera installation that leaves no blind spots",
    meta: [
      { label: "Area", value: "İskenderun and Hatay" },
      { label: "Service", value: "Turnkey installation" },
      { label: "Warranty", value: "2-year support and warranty" },
    ],
    imageAlt: "Security cameras mounted on a pole against a cloudy sky",
    lead:
      "We buy the equipment, run the cables and connect the cameras to your phone. All you do is tell us what you want to see.",
    primaryCta: "Call now",
    secondaryCta: "WhatsApp us",
    notes: ["We come to you", "Equipment and installation included", "Live view on your phone"],
    scene: {
      label: "Sample layout: shop",
      result: "4 cameras, no blind spots",
      rooms: { mağaza: "Shop floor", depo: "Storage", kasa: "Till", giriş: "Entrance" },
    },
  },

  announcement: {
    text: "November only: free installation with the 4-camera package.",
    cta: "Ask for details",
  },

  process: {
    title: "From site visit to your phone, every step of the installation is on us",
    lead: "You deal with one company. The same team handles everything from the site visit to maintenance.",
    stepLabel: "Step",
    steps: [
      {
        icon: "search",
        title: "Site visit",
        text: "We come to your place, listen to what you want to see and decide on camera positions together.",
      },
      {
        icon: "clipboard",
        title: "Plan and equipment",
        text: "We choose the cameras, recorder and cabling for your needs, and we source all the equipment.",
      },
      {
        icon: "wrench",
        title: "Installation",
        text: "We hide the cables neatly, mount the cameras securely and adjust every angle one by one.",
      },
      {
        icon: "smartphone",
        title: "Phone setup",
        text: "We install the app on your phone and show you how to open the live view and past recordings.",
      },
      {
        icon: "shield",
        title: "Maintenance and support",
        text: "Every installation comes with a 2-year support and warranty. If something breaks, we fix it on site.",
      },
    ],
  },

  useCases: {
    title: "Home, shop or factory: what do you want to protect?",
    lead: "Every place has different blind spots. Pick an area and see the setup that suits it.",
    items: [
      {
        id: "ev",
        icon: "home",
        label: "Home",
        title: "Homes and houses",
        text: "Front door, garden and parking. Check in from your phone while you are away, and see clearly even in the dark with night vision.",
        setup: ["Outdoor night vision cameras", "Face-level camera at the front door", "Instant motion alerts on your phone"],
        cameras: "2–4 cameras",
      },
      {
        id: "dukkan",
        icon: "store",
        label: "Shop",
        title: "Shops and offices",
        text: "Till, entrance and shelves. Deters theft, and if there is ever a dispute, the recording is in your hands.",
        setup: ["High-resolution camera over the till", "Wide angle covering the entrance and window", "At least 30 days of recording"],
        cameras: "4–8 cameras",
      },
      {
        id: "fabrika",
        icon: "factory",
        label: "Factory / warehouse",
        title: "Factories, warehouses and sites",
        text: "Large areas, loading docks and perimeter walls. With cameras that read plates and faces at long range.",
        setup: ["Long-range zoom cameras", "Night vision along the perimeter", "Redundant recorder"],
        cameras: "8–32 cameras",
      },
      {
        id: "site",
        icon: "building",
        label: "Apartments",
        title: "Apartment complexes",
        text: "Gates, car parks and lift lobbies. A shared, well-organised monitoring system for management and residents.",
        setup: ["Car park and gate cameras", "Dedicated monitoring screen for management", "Separate recording channel per block"],
        cameras: "6–16 cameras",
      },
    ],
  },

  products: {
    eyebrow: "Our products",
    title: "The cameras and devices we install",
    lead: "Some of the products we use in our installations. All come with a warranty; we pick the right one together during the site visit.",
    ask: "Ask on WhatsApp",
    message: "Hello, I'd like information about the {name}.",
    prev: "Previous product",
    next: "Next product",
    items: [
      { name: "5 MP bullet camera", category: "Outdoor", icon: "bullet", specs: ["Metal housing", "2.8 mm wide-angle lens", "Audio recording", "Full-colour night vision"], brand: "Dahua · Hikvision" },
      { name: "5 MP dome camera", category: "Indoor", icon: "dome", specs: ["Ceiling mount, discreet", "Night vision", "Wide field of view"], brand: "Dahua · Hikvision" },
      { name: "PTZ camera", category: "360° view", icon: "ptz", specs: ["Pan and tilt from your phone", "Zoom", "Motion tracking"] },
      { name: "Solar 4G camera", category: "Off-grid", icon: "solar", specs: ["Solar panel and battery", "Internet via SIM card", "No socket needed"], brand: "O-KAM · IOMA" },
      { name: "Wi-Fi camera", category: "Wireless", icon: "wifi", specs: ["Plugs in, no cabling", "Two-way talk", "Live view on your phone"] },
      { name: "NVR recorder", category: "Recording", icon: "nvr", specs: ["4, 8 and 16 channels", "500 GB – 1 TB drive", "Remote viewing"], brand: "ZTEC" },
    ],
  },

  remote: {
    eyebrow: "Solar-powered 4G cameras",
    title: "No power, no internet, no problem",
    lead:
      "Vineyards, gardens, construction sites, highland houses or summer homes... For places without power or internet, we install cameras that run on solar power and connect to the internet with a SIM card. No cables, no sockets, and you watch from your phone.",
    places: ["Vineyards & gardens", "Construction sites", "Highland houses", "Summer homes", "Fields & land", "Barns & farms"],
    features: [
      "No sockets, cables or fixed internet needed",
      "Unaffected by power cuts",
      "Motion alerts straight to your phone",
      "Night vision in a weatherproof outdoor housing",
      "We supply and set up the SIM card, no separate line needed",
    ],
    note: "VAT and installation included. Before installing, we check the mobile signal on site.",
    cta: "From 8,999 TL",
    priceTag: { lead: "Starting from", amount: "8,999 TL", action: "Ask on WhatsApp" },
    whatsappMessage: "Hello, I'd like information about a solar-powered 4G camera. Location: ",
    screenLabel: "CAM 07 · LAND",
    slides: [
      { caption: "Mounted on a palm tree", image: media.gunes.palmiye, alt: "4G camera mounted on a palm tree with a solar panel above it" },
      { caption: "Utility pole next to a building site", image: media.gunes.elektrikDiregi, alt: "Solar-powered 4G camera on a steel pole in front of a building under construction" },
      { caption: "Pine tree, with its solar panel", image: media.gunes.camAgaci, alt: "4G camera on a pine trunk with its solar panel next to it" },
      { caption: "Pole mount on a construction site", image: media.gunes.santiyeDiregi, alt: "Solar-powered camera being installed on top of a tall pole at a construction site" },
      { caption: "Installing high up on a palm", image: media.gunes.palmiyeMontaj, alt: "Tall palm trees with a ladder against the trunk during a camera installation" },
      { caption: "Pole on top of a site container", image: media.gunes.konteyner, alt: "Camera on a pole above a site container at sunset" },
    ],
  },

  wifi: {
    eyebrow: "Wi-Fi cameras",
    title: "No cables, no drilling, easy setup",
    lead:
      "For homes, shops or offices that want cameras without running cables: Wi-Fi cameras join your existing internet, plug into a socket and stream to your phone. Ideal for tenants and anyone who moves often.",
    places: ["Indoors", "Baby & kids' rooms", "Pet monitoring", "Small shops", "Offices", "Rented homes"],
    features: [
      "No cabling, just plug it in",
      "Connects to your home Wi-Fi",
      "Live view and two-way talk on your phone",
      "Motion alerts straight to your phone",
      "Take it with you when you move",
    ],
    note: "VAT and installation included. We check the Wi-Fi signal on site before installing.",
    cta: "From 6,999 TL",
    priceTag: { lead: "Starting from", amount: "6,999 TL", action: "Ask on WhatsApp" },
    whatsappMessage: "Hello, I'd like information about Wi-Fi cameras. Location: ",
    screenLabel: "CAM 08 · WI-FI",
    slides: [
      { caption: "Indoor installation" },
      { caption: "Baby room" },
      { caption: "Shop entrance" },
      { caption: "Office" },
    ],
  },

  coverage: {
    title: "We place cameras by plan, not by guesswork",
    lead:
      "During the site visit we map out your place and work out what each camera will see before installing. We keep adjusting the layout until no corner is left unseen.",
    points: [
      "Till, entrance and storage are each covered",
      "Angles complement each other without overlapping",
      "Night vision range is taken into account",
    ],
    detection: {
      eyebrow: "AI cameras",
      label: "CAM 04 · PERSON DETECTION",
      title: "It spots people and alerts your phone",
      text: "Our AI cameras tell a person apart from a branch swaying in the wind. The moment someone enters the area, you get a notification and the moment is marked in the recording.",
      points: ["Real alerts instead of false alarms", "Find the moments with people fast", "Works at night too"],
      caption: "Real footage from a camera we installed",
      play: "Play video",
      pause: "Pause video",
    },
  },

  closing: {
    lines: ["Call us,", "we install"],
    lead: "Give us a call and we will visit at a time that suits you. Equipment, installation and phone setup are on us.",
  },

  why: {
    title: "We stand behind every system we install",
    text:
      "We don't just mount a camera and leave. The job isn't done until recordings are stored properly, night images are sharp and you can watch comfortably from your phone.",
    stats: [
      { value: 3, suffix: " yrs", label: "experience" },
      { value: 600, suffix: "+", label: "installations completed" },
      { value: 2, suffix: " yrs", label: "support and warranty" },
    ],
  },

  packages: {
    title: "Ready-made security camera packages",
    lead: "We don't quote a final price without seeing your place. These packages give you an idea; we finalise the details together during the site visit.",
    priceNote: "Final price is set after the site visit",
    priceTemplate: "From {price}",
    priceIncludes: "VAT and installation included",
    brandsLabel: "Brands we use",
    items: [
      {
        name: "Starter",
        cameras: "2 cameras",
        for: "Flat, small office",
        priceFrom: 9999,
        features: [
          "2 × 5 MP night vision cameras",
          "4-channel recorder",
          "500 GB recording drive",
          "Motion detection alerts",
          "Phone viewing",
        ],
      },
      {
        name: "Home and shop",
        cameras: "4 cameras",
        for: "House, shop",
        priceFrom: 14999,
        featured: true,
        features: [
          "4 × 5 MP night vision cameras",
          "4-channel recorder",
          "500 GB recording drive",
          "Motion detection alerts",
          "Phone viewing",
        ],
      },
      {
        name: "Business",
        cameras: "8 cameras",
        for: "Market, warehouse, workshop",
        priceFrom: 29999,
        features: [
          "8 × 5 MP night vision cameras",
          "8-channel recorder",
          "1 TB recording drive",
          "Remote multi-user access",
          "Phone viewing",
        ],
      },
    ],
    allLink: "All products",
  },

  work: {
    title: "Our camera installations",
    lead: "Real photos and camera footage from systems we installed. Open a folder. Number plates and faces are blurred for privacy.",
    photosLabel: "{n} photos",
    openLabel: "Open the {title} folder",
    closeLabel: "Close",
    minimizeLabel: "Minimise",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
    folders: [
      {
        id: "kafe-isyeri",
        title: "Café and business",
        captions: {
          "01-kafe-ic-mekan-gunduz": { caption: "Indoors, daytime" },
          "02-kafe-ic-mekan-gece": { caption: "Indoors, at night" },
          "03-kafe-onu-gunduz": { caption: "Café front, daytime" },
          "04-kafe-onu-gece": { caption: "Same camera, at night" },
          "05-kafe-bahcesi-gunduz": { caption: "Garden, daytime" },
          "06-kafe-bahcesi-aksam": { caption: "Garden, evening" },
          "07-yol-tarafi-gunduz": { caption: "Street side, daytime" },
          "08-yol-tarafi-gece": { caption: "Street side, at night" },
          "09-dortlu-ekran": { caption: "Four cameras on one screen" },
        },
      },
      {
        id: "gunes-enerjili",
        title: "Solar installations",
        captions: {
          "01-palmiye": { caption: "On a palm tree, with its solar panel" },
          "02-elektrik-diregi-santiye": { caption: "Utility pole next to a building site" },
          "03-cam-agaci-gunes-paneli": { caption: "Pine tree, panel alongside" },
          "04-cam-agaci-yakin": { caption: "Pine tree, close up" },
          "05-santiye-diregi": { caption: "Pole mount on a construction site" },
          "06-palmiye-montaj": { caption: "High up a palm, by ladder" },
          "07-konteyner-diregi": { caption: "Pole on top of a site container" },
          "08-elektrik-diregi-bina": { caption: "Pole in front of a new building" },
        },
      },
      {
        id: "kayit-ekranlari",
        title: "Recorder screens",
        captions: {
          "01-13-kamerali-ekran": { caption: "13 cameras on one screen" },
          "02-monitor-ve-kayit-cihazi": { caption: "Monitor and recorder box" },
          "03-monitor-yakin": { caption: "Ceiling-mounted monitor" },
          "04-monitor-kapi-ustu": { caption: "Monitor mounted above a door" },
        },
      },
      {
        id: "agac-direk-montaj",
        title: "Tree and pole mounts",
        captions: {
          "01-agaca-uc-kamera": { caption: "Three cameras on one tree" },
          "02-agaca-baglanti-kutusu": { caption: "Tidy wiring with a junction box" },
          "03-merdivenle-montaj": { caption: "During installation" },
          "04-cam-agaci-merdiven": { caption: "Mounting high on a pine" },
          "05-palmiye-govdesi": { caption: "On a palm trunk" },
          "06-palmiye-gunes-paneli": { caption: "On a palm with a solar panel" },
          "07-cam-agaci-gunes-paneli": { caption: "On a pine with a solar panel" },
        },
      },
    ],
    allLink: "All projects",
  },

  reviews: {
    title: "What our customers say",
    stat: { value: "600+", text: "installations completed in and around İskenderun in 3 years. Each with a 2-year support and warranty." },
    items: [
      {
        quote: "They hid the cables so neatly that you only notice the cameras in the shop if you look for them.",
        name: "Mehmet K.",
        place: "Market owner, İskenderun",
      },
      {
        quote: "Even my mum can use the phone app. They walked us through it after the installation.",
        name: "Elif D.",
        place: "Homeowner, Arsuz",
      },
      {
        quote: "The night picture is much sharper than we expected. When something broke, they came and fixed it the same day.",
        name: "Hasan T.",
        place: "Warehouse operator, Payas",
      },
      {
        quote: "As the complex management, we watch the car park and entrances from a single screen. Very happy.",
        name: "Ayşe Y.",
        place: "Complex manager, İskenderun",
      },
    ],
  },

  contactSection: {
    title: "We come to you",
    lead: "We don't have a fixed shop; our team works on site from a van. Call or message us and we'll visit at a time that suits you.",
    callLabel: "Call us",
    whatsappLabel: "Message on WhatsApp",
    instagramLabel: "Follow on Instagram",
    areasTitle: "Where we work",
  },

  footer: {
    note: "Based in İskenderun, installing cameras across Hatay.",
  },

  notFound: {
    pageTitle: "Page not found (404) | Jüpiter Güvenlik Sistemleri",
    code: "Error 404",
    titleLines: ["This is a", "blind spot"],
    text: "The page you are looking for may have moved or never existed. Head back to the homepage or give us a call and we will install your cameras.",
    home: "Back to homepage",
    noSignal: "No signal",
    noRecord: "No recording found",
  },

  ui: {
    soon: "Coming soon",
    menu: "Open menu",
    close: "Close menu",
    call: "Call",
    whatsappFloat: "Message on WhatsApp",
    askPackage: "Ask about this package",
    included: "Included",
    skipToContent: "Skip to content",
    backToTop: "back to top",
    mainNav: "Main menu",
    mobileNav: "Mobile menu",
    switchLanguage: "Turkish version of this page",
    useCasesTabs: "Use cases",
    campaign: "Offer",
    footerMenu: "Menu",
    footerContact: "Contact",
    footerSocial: "Social",
    recommended: "Recommended",
    baseSetup: "Basic setup",
    optionalSetup: "As needed",
    packageMessage: 'Hello, I\'d like to get information about the "{name}" package ({cameras}).',
    campaignMessage: "Hello, I'd like to get information about the offer: {text}",
    ogImageAlt: "Jüpiter Güvenlik Sistemleri: We leave no blind spots",
    sliderPrev: "Previous photo",
    sliderNext: "Next photo",
    sliderGoTo: "Go to photo {n}",
    photoSoon: "Photo coming soon",
  },
};
