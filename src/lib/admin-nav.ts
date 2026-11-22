/**
 * Panel menüsü (sidebar). `ready: false` olanlar henüz yapılmadı: menüde "yakında" etiketiyle görünür, tıklanmaz.
 * Her aşamada yapılan sayfanın `ready` değeri true yapılır.
 */
export type AdminIcon =
  | "overview"
  | "folders"
  | "products"
  | "sliders"
  | "prices"
  | "packages"
  | "reviews"
  | "contact"
  | "campaign"
  | "account";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: AdminIcon;
  ready: boolean;
  /** Hangi aşamada geleceği (yakında etiketinin açıklaması) */
  phase?: number;
}

export const adminNav: { title?: string; items: AdminNavItem[] }[] = [
  { items: [{ href: "/admin", label: "Genel bakış", icon: "overview", ready: true }] },
  {
    title: "Fotoğraflı içerik",
    items: [
      { href: "/admin/yapilan-isler", label: "Yapılan işler", icon: "folders", ready: false, phase: 5 },
      { href: "/admin/urunler", label: "Ürünler", icon: "products", ready: false, phase: 5 },
      { href: "/admin/sliderlar", label: "Slider fotoğrafları", icon: "sliders", ready: false, phase: 5 },
    ],
  },
  {
    title: "Bilgiler",
    items: [
      { href: "/admin/fiyatlar", label: "Fiyatlar", icon: "prices", ready: false, phase: 6 },
      { href: "/admin/paketler", label: "Paketler", icon: "packages", ready: false, phase: 4 },
      { href: "/admin/yorumlar", label: "Yorumlar", icon: "reviews", ready: false, phase: 4 },
      { href: "/admin/iletisim", label: "İletişim ve markalar", icon: "contact", ready: false, phase: 4 },
      { href: "/admin/kampanya", label: "Kampanya şeridi", icon: "campaign", ready: false, phase: 4 },
    ],
  },
  { title: "Hesap", items: [{ href: "/admin/hesap", label: "Şifre ve güvenlik", icon: "account", ready: true }] },
];
