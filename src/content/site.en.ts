/**
 * JÜPİTER: English content. Same shape as site.tr.ts (TypeScript fails the build if anything is missing).
 *
 * Phone, WhatsApp, Instagram and service areas are shared with the Turkish file,
 * so real contact details only need to be entered once (in site.tr.ts).
 * Placeholder notes (YER TUTUCU) in site.tr.ts apply here too.
 */
import { site as tr, type SiteContent } from "./site.tr";

export const site: SiteContent = {
  locale: { lang: "en", ogLocale: "en_US", numberLocale: "en-US", short: "EN", name: "English" },

  brand: {
    name: "JÜPİTER",
    fullName: "JÜPİTER Security Camera Systems",
    tagline: "Camera systems, turnkey",
  },

  contact: {
    ...tr.contact,
    whatsappMessage: "Hello, I'd like to get information about a camera system.",
    hours: "Every day 08:00 – 20:00",
    region: "İskenderun and surroundings, Hatay",
  },

  seo: {
    ogImage: "/og-en.jpg",
    title: "CCTV Installation in İskenderun | JÜPİTER Security Cameras",
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
      { label: "Support", value: "Long after installation" },
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
        text: "We are just a phone call away after installation. If something breaks, we fix it on site.",
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

  remote: {
    eyebrow: "Solar-powered 4G cameras",
    title: "No power, no internet, no problem",
    lead:
      "Vineyards, gardens, highland houses or summer homes... We install cameras that run on solar power and connect to the internet with a SIM card. No cables, no sockets, and you watch from your phone.",
    places: ["Vineyards & gardens", "Highland houses", "Summer homes", "Fields & land", "Barns & farms", "Building sites"],
    steps: [
      { icon: "solar", title: "Solar panel", text: "Charges from the sun all day" },
      { icon: "battery", title: "Battery", text: "Keeps running at night and on cloudy days" },
      { icon: "cctv", title: "4G camera", text: "Connects to the internet with its SIM card" },
      { icon: "smartphone", title: "Your phone", text: "Live view and motion alerts" },
    ],
    features: [
      "No sockets, cables or fixed internet needed",
      "Unaffected by power cuts",
      "Motion alerts straight to your phone",
      "Night vision in a weatherproof outdoor housing",
    ],
    note: "Before installing, we check the mobile signal on site.",
    cta: "Ask about my land",
    whatsappMessage: "Hello, I'd like information about a solar-powered 4G camera. Location: ",
    screen: { label: "CAM 07 · LAND", signal: "4G", battery: "86%" },
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
      { value: 12, suffix: "+", label: "years of experience" },
      { value: 850, suffix: "+", label: "installations completed" },
      { value: 2, suffix: " yrs", label: "installation warranty" },
    ],
  },

  packages: {
    title: "Ready-made security camera packages",
    lead: "We don't quote a final price without seeing your place. These packages give you an idea; we finalise the details together during the site visit.",
    priceNote: "Final price is set after the site visit",
    items: [
      {
        name: "Starter",
        cameras: "2 cameras",
        for: "Flat, small office",
        price: "Call for price",
        features: ["2 × 2 MP night vision cameras", "4-channel recorder", "1 TB recording drive", "Phone viewing setup"],
      },
      {
        name: "Home and shop",
        cameras: "4 cameras",
        for: "House, shop",
        price: "Call for price",
        featured: true,
        features: [
          "4 × 4 MP night vision cameras",
          "4-channel recorder",
          "2 TB recording drive",
          "Motion detection alerts",
          "Phone viewing setup",
        ],
      },
      {
        name: "Business",
        cameras: "8 cameras",
        for: "Market, warehouse, workshop",
        price: "Call for price",
        features: [
          "8 × 4 MP night vision cameras",
          "8-channel recorder",
          "4 TB recording drive",
          "Remote multi-user access",
          "Yearly maintenance visit",
        ],
      },
    ],
    allLink: "All products",
  },

  work: {
    title: "Our camera installations",
    lead: "We will be sharing photos of our installations here soon.",
    items: [
      { cam: "CAM 01", place: "Market entrance", area: "Çay Mah.", kind: "store" },
      { cam: "CAM 02", place: "Loading dock", area: "Organised Industrial Zone", kind: "factory" },
      { cam: "CAM 03", place: "Complex car park", area: "Modern Evler", kind: "building" },
      { cam: "CAM 04", place: "Garden gate", area: "Arsuz", kind: "home" },
      { cam: "CAM 05", place: "Till area", area: "Savaş Mah.", kind: "store" },
      { cam: "CAM 06", place: "Workshop floor", area: "Payas", kind: "wrench" },
    ],
    allLink: "All projects",
  },

  reviews: {
    title: "What our customers say",
    stat: { value: "850+", text: "installations completed in and around İskenderun. Most customers heard about us from someone they know." },
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
    pageTitle: "Page not found (404) | JÜPİTER Security Cameras",
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
    ogImageAlt: "JÜPİTER Security Camera Systems: We leave no blind spots",
  },
};
