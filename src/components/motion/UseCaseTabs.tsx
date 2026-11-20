import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/content/site.tr";

type Item = SiteContent["useCases"]["items"][number];
/** Arayüz metinleri (dile göre içerik dosyasından gelir) */
type Labels = { tabs: string; recommended: string; base: string; optional: string };

const CHANNELS = 32; // Ölçek tüm sekmelerde aynı: alanlar birbiriyle kıyaslanabilsin
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Kayıt cihazı (NVR) kanal ızgarası: önerilen kamera aralığını gösterir.
 * Alt sınıra kadar kanallar dolu yanar, üst sınıra kadar olanlar "ihtiyaca göre" (çerçeveli).
 */
function ChannelGrid({ cameras, labels, reduced }: { cameras: string; labels: Labels; reduced: boolean }) {
  const m = cameras.match(/^(\d+)\D+(\d+)\s*(.*)$/);
  const min = m ? Number(m[1]) : 0;
  const max = m ? Number(m[2]) : 0;
  const unit = m?.[3] || "kamera";
  const range = m ? `${m[1]}–${m[2]}` : cameras;

  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-paper/[0.07] bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_20px_40px_-24px_rgb(0_0_0/0.6)] p-5">
      {/* Üst bilgi satırı: kayıt cihazı ekranı gibi */}
      <div className="flex items-center justify-between font-mono text-[11px] text-paper/60">
        <span className="flex items-center gap-1.5">
          <motion.span
            className="size-1.5 rounded-full bg-coral"
            animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          NVR · {CHANNELS} CH
        </span>
        <span>CH 01–{String(max).padStart(2, "0")}</span>
      </div>

      <p className="mt-4 text-sm text-mist">{labels.recommended}</p>
      <p className="mt-0.5 flex items-baseline gap-2 overflow-hidden">
        <motion.span
          className="font-tall text-[3.25rem] leading-[0.9] text-paper"
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
        >
          {range}
        </motion.span>
        <motion.span
          className="font-tall text-[1.35rem] text-sun"
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
        >
          {unit}
        </motion.span>
      </p>

      {/* Kanal ızgarası */}
      <div className="relative mt-5" aria-hidden="true">
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: CHANNELS }, (_, i) => {
            const state = i < min ? "on" : i < max ? "opt" : "off";
            return (
              <motion.span
                key={i}
                className={cn(
                  "aspect-square rounded-[4px]",
                  state === "on" && "bg-sun shadow-[0_0_10px_color-mix(in_srgb,var(--color-sun)_50%,transparent)]",
                  state === "opt" && "border border-sun/60 bg-sun/10",
                  state === "off" && "bg-paper/[0.05]",
                )}
                initial={reduced || state === "off" ? false : { scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.2 + i * 0.035 }}
              />
            );
          })}
        </div>
        {/* Tarama çizgisi */}
        {!reduced && (
          <motion.span
            className="pointer-events-none absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-sun/15 to-transparent"
            initial={{ top: "-25%" }}
            animate={{ top: "105%" }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
          />
        )}
      </div>

      {/* Açıklama */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-mist">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-sun" /> {labels.base}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] border border-sun/60 bg-sun/10" /> {labels.optional}
        </span>
      </div>
    </div>
  );
}

/** Kullanım alanları: erişilebilir sekme yapısı (ok tuşlarıyla gezilebilir). */
export default function UseCaseTabs({ items, labels }: { items: Item[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active]!;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:gap-10">
      <div
        role="tablist"
        aria-label={labels.tabs}
        onKeyDown={onKey}
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:flex-col lg:flex-nowrap"
      >
        {items.map((it, i) => {
          const selected = i === active;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${it.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                // Mobil: 2x2 ızgara, küçük yazı ve kenarlıklı buton. lg: dikey liste (masaüstü aynı)
                "relative flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2 py-2.5 text-xs font-semibold min-[360px]:gap-2 min-[360px]:px-3 min-[360px]:text-[0.8125rem] transition-colors duration-200",
                "sm:justify-start sm:px-4 sm:text-[0.95rem] lg:min-h-12 lg:gap-3 lg:border-transparent lg:py-3 lg:text-left lg:text-base",
                selected ? "border-transparent text-ink" : "border-paper/15 text-paper hover:bg-navy-2",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={reduced ? undefined : `${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-teal"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon name={it.icon} className="relative size-4 shrink-0 lg:size-5" strokeWidth={2} />
              <span className="relative whitespace-nowrap">{it.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="relative min-h-[22rem] overflow-hidden rounded-[1.25rem] border border-paper/10 bg-navy-2 sm:min-h-[19rem]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_17rem] md:items-start"
          >
            <div>
              <h3 className="font-title text-[2rem] sm:text-[2.4rem]">{current.title}</h3>
              <p className="mt-3 max-w-[56ch] text-mist">{current.text}</p>
              <ul className="mt-6 grid gap-2.5">
                {current.setup.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-teal" strokeWidth={3} aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ChannelGrid cameras={current.cameras} labels={labels} reduced={reduced} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
