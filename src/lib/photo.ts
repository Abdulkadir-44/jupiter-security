import type { Photo } from "@/content/media";

/**
 * Fotoğraf adresleri. Tüm fotoğraflar aynı düzende: /medya/foto/<anahtar>-<genişlik>.<webp|avif>
 * - Kodla gelenler: public/medya/foto/ (scripts/media.mjs üretir)
 * - Admin panelinden yüklenenler (5. aşama): R2'de, Worker aynı adresten sunar
 */
export function photoUrl(p: Photo, width: number, format: "webp" | "avif" = "webp"): string {
  return `/medya/foto/${p.key}-${width}.${format}`;
}

export function photoSrcset(p: Photo, format: "webp" | "avif" = "webp"): string {
  return p.widths.map((w) => `${photoUrl(p, w, format)} ${w}w`).join(", ");
}

/** `target` genişliğine eşit ya da büyük ilk kopya (yoksa en büyüğü) */
export function photoSrc(p: Photo, target = 960, format: "webp" | "avif" = "webp"): string {
  const w = p.widths.find((x) => x >= target) ?? p.widths[p.widths.length - 1];
  return photoUrl(p, w, format);
}
