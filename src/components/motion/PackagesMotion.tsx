import { useState, type MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, type Variants } from "motion/react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { fill, whatsappHref } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/content/site.tr";

type Pkg = SiteContent["packages"]["items"][number];

const ease = [0.22, 1, 0.36, 1] as const;


function PackageCard({
  it,
  index,
  reduced,
  contact,
  askLabel,
  includedLabel,
  message,
  priceTemplate,
  priceIncludes,
  numberLocale,
}: {
  it: Pkg;
  index: number;
  reduced: boolean;
  contact: SiteContent["contact"];
  askLabel: string;
  includedLabel: string;
  message: string;
  priceTemplate: string;
  priceIncludes: string;
  numberLocale: string;
}) {
  const featured = !!it.featured;
  const [seen, setSeen] = useState(reduced);
  // Fareyi takip eden ışık
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${
    featured ? "color-mix(in srgb, var(--color-teal) 28%, transparent)" : "color-mix(in srgb, var(--color-teal) 14%, transparent)"
  }, transparent 60%)`;
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    mx.set(-200);
    my.set(-200);
  };

  // Öne çıkan paket en son ve biraz daha yüksekten gelir
  const order = featured ? 2 : index > 1 ? 1 : 0;
  const baseDelay = order * 0.16;

  const card: Variants = {
    hidden: { opacity: 0, y: featured ? 140 : 90, scale: featured ? 0.9 : 0.96, rotateX: 12 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 65, damping: 15, mass: 1, delay: baseDelay },
    },
  };

  const [count, ...rest] = it.cameras.split(" ");
  const unit = rest.join(" ");

  return (
    <motion.li
      style={{ perspective: 1000 }}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      onViewportEnter={() => setSeen(true)}
      variants={card}
      className={cn("relative", featured && "lg:z-10")}
    >
      <motion.div
        onMouseMove={reduced ? undefined : onMove}
        onMouseLeave={reduced ? undefined : onLeave}
        whileHover={reduced ? undefined : { y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-6 sm:p-8",
          featured && "lg:-my-4 lg:h-[calc(100%+2rem)] lg:py-10",
          featured
            ? "bg-navy text-paper shadow-[0_40px_80px_-30px_color-mix(in_srgb,var(--color-ink)_70%,transparent)]"
            : "bg-paper text-ink ring-1 ring-ink/10 shadow-[0_24px_50px_-30px_color-mix(in_srgb,var(--color-ink)_35%,transparent)]",
        )}
      >
        {/* Fare ışığı */}
        {!reduced && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />}

        {/* Öne çıkan pakette giriş parlaması */}
        {featured && !reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-paper/15 to-transparent"
            initial={{ x: "0%" }}
            animate={seen ? { x: "420%" } : undefined}
            transition={{ duration: 1.3, ease: "easeInOut", delay: baseDelay + 0.7 }}
          />
        )}
        {featured && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-2 ring-teal"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: [0, 1, 0.6] }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: baseDelay + 0.6 }}
          />
        )}

        <div className="relative flex items-baseline justify-between gap-4">
          <h3 className="font-title text-[1.75rem]">{it.name}</h3>
          <span className={cn("text-right text-sm", featured ? "text-mist" : "text-ink-soft")}>{it.for}</span>
        </div>

        {/* Kamera sayısı: alttan kayarak gelir */}
        <p className={cn("relative mt-4 flex items-end gap-3 font-tall", featured ? "text-teal" : "text-teal-ink")}>
          <span className="overflow-hidden pt-[0.1em]">
            <motion.span
              className="block text-[5rem]"
              initial={reduced ? false : { y: "105%" }}
              animate={seen ? { y: "0%" } : undefined}
              transition={{ duration: 0.9, ease, delay: baseDelay + 0.35 }}
            >
              {count}
            </motion.span>
          </span>
          <span className="overflow-hidden pb-[0.55em]">
            <motion.span
              className="block text-[2.2rem]"
              initial={reduced ? false : { y: "105%" }}
              animate={seen ? { y: "0%" } : undefined}
              transition={{ duration: 0.8, ease, delay: baseDelay + 0.5 }}
            >
              {unit}
            </motion.span>
          </span>
        </p>

        {/*
          Paket içeriği: fiş gibi. Numara · madde · noktalı çizgi · "Dahil".
          Ekrana girince satırlar yazıcıdan çıkan fiş gibi yukarıdan aşağıya tek tek basılır, noktalı çizgi uzanır.
        */}
        <motion.ul
          className={cn("relative mt-6 grid flex-1 content-start gap-3 border-t border-dashed pt-6", featured ? "border-paper/20" : "border-ink/15")}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.11, delayChildren: baseDelay + 0.55 } } }}
        >
          {it.features.map((f, i) => (
            <motion.li
              key={f}
              className="flex items-baseline gap-2.5 text-[0.97rem]"
              variants={{
                hidden: { opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" },
                show: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.4, ease } },
              }}
            >
              <span className={cn("shrink-0 font-mono text-[11px]", featured ? "text-paper/45" : "text-ink-soft/70")} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">{f}</span>
              <motion.span
                aria-hidden="true"
                className={cn("min-w-4 flex-1 origin-left border-b-2 border-dotted", featured ? "border-paper/25" : "border-ink/20")}
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.5, ease, delay: 0.12 } } }}
              />
              <span
                className={cn(
                  "shrink-0 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase",
                  featured ? "text-teal" : "text-teal-ink",
                )}
              >
                {includedLabel}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Fiyat: şablondaki {price} büyük yazılır ("9.999 TL'den başlayan" / "From 9,999 TL") */}
        <p className={cn("relative mt-8 text-sm", featured ? "text-mist" : "text-ink-soft")}>
          {priceTemplate.split("{price}").map((part, i) => (
            <span key={i}>
              {i > 0 && (
                <span className={cn("font-tall text-[2.4rem] leading-none", featured ? "text-paper" : "text-ink")}>
                  {it.priceFrom.toLocaleString(numberLocale)} TL
                </span>
              )}
              {part}
            </span>
          ))}
          <span className="mt-1 block text-xs">{priceIncludes}</span>
        </p>
        <motion.a
          href={whatsappHref(contact, message)}
          target="_blank"
          rel="noopener"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className={cn(
            "relative mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200",
            featured ? "bg-teal text-ink hover:bg-teal-soft" : "bg-ink text-paper hover:bg-navy-3",
          )}
        >
          <WhatsAppIcon className="size-[1.1rem]" />
          {askLabel}
        </motion.a>
      </motion.div>
    </motion.li>
  );
}

export default function PackagesMotion({
  items,
  contact,
  askLabel,
  includedLabel,
  messageTemplate,
  priceTemplate,
  priceIncludes,
  numberLocale,
}: {
  items: Pkg[];
  contact: SiteContent["contact"];
  askLabel: string;
  /** Paket içeriği satırlarının sağındaki etiket ("Dahil") */
  includedLabel: string;
  /** WhatsApp mesaj şablonu: {name} ve {cameras} paket bilgisiyle değişir */
  messageTemplate: string;
  priceTemplate: string;
  priceIncludes: string;
  numberLocale: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <ul className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3 lg:items-stretch">
      {items.map((it, i) => (
        <PackageCard key={it.name} it={it} index={i} reduced={reduced} contact={contact}
          askLabel={askLabel}
          includedLabel={includedLabel}
          message={fill(messageTemplate, { name: it.name, cameras: it.cameras })}
          priceTemplate={priceTemplate}
          priceIncludes={priceIncludes}
          numberLocale={numberLocale}
        />
      ))}
    </ul>
  );
}
