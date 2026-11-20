import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/content/site.tr";

type Item = SiteContent["useCases"]["items"][number];

/** Kullanım alanları: erişilebilir sekme yapısı (ok tuşlarıyla gezilebilir). */
export default function UseCaseTabs({ items, camerasLabel = "Önerilen" }: { items: Item[]; camerasLabel?: string }) {
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
        aria-label="Kullanım alanları"
        onKeyDown={onKey}
        className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
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
                "relative flex min-h-12 shrink-0 cursor-pointer snap-start items-center gap-3 rounded-full px-4 py-3 text-left font-semibold transition-colors duration-200",
                selected ? "text-ink" : "text-paper hover:bg-navy-2",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={reduced ? undefined : `${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-teal"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon name={it.icon} className="relative size-5" strokeWidth={2} />
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
            className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_15rem]"
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
            <div className="flex flex-col justify-between gap-6 rounded-[1rem] border border-paper/10 bg-ink/60 p-5">
              <Icon name={current.icon} className="size-14 text-teal" strokeWidth={1.4} />
              <div>
                <p className="text-sm text-mist">{camerasLabel}</p>
                <p className="font-tall text-[2.2rem]">{current.cameras}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
