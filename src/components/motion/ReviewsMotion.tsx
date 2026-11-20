import { useEffect, useState, type MouseEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import type { SiteContent } from "@/content/site.tr";

type Reviews = SiteContent["reviews"];

const ease = [0.22, 1, 0.36, 1] as const;

/** Kartı fare konumuna göre hafifçe 3D eğer (sadece fareyle, dokunmatikte değil). */
function useTilt(reduced: boolean) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 220, damping: 20 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };
  return { rx, ry, onMove, onLeave };
}

/** Alıntıyı kelime kelime gösterir */
function Words({ text, reduced, delay }: { text: string; reduced: boolean; delay: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      className="inline"
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.5em", filter: "blur(4px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

function ReviewCard({ item, index, reduced }: { item: Reviews["items"][number]; index: number; reduced: boolean }) {
  const fromLeft = index % 2 === 0;
  const { rx, ry, onMove, onLeave } = useTilt(reduced);

  const variants: Variants = {
    hidden: { opacity: 0, x: fromLeft ? -140 : 140, rotate: fromLeft ? -5 : 5, filter: "blur(8px)" },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 70, damping: 16, mass: 0.9, delay: index * 0.12 },
    },
  };

  return (
    <motion.li
      style={{ perspective: 900 }}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    >
      <motion.figure
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[1.25rem] bg-cream p-7 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] sm:p-9"
      >
        <span aria-hidden="true" className="pointer-events-none absolute top-3 right-6 font-title text-[7rem] leading-[0.8] text-teal-ink/20">
          “
        </span>
        <blockquote className="relative font-title text-[1.5rem] leading-snug sm:text-[1.7rem]">
          <p>
            <Words text={item.quote} reduced={reduced} delay={0.35 + index * 0.12} />
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <motion.span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-ink font-semibold text-teal"
            initial={reduced ? false : { scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.6 + index * 0.12 }}
          >
            {item.name.charAt(0)}
          </motion.span>
          <span>
            <span className="block font-semibold">{item.name}</span>
            <span className="block text-sm text-ink-soft">{item.place}</span>
          </span>
        </figcaption>
      </motion.figure>
    </motion.li>
  );
}

/** "850+" gibi değerleri sayarak gösterir */
function CountUp({ value, reduced, play, locale }: { value: string; reduced: boolean; play: boolean; locale: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const n = useMotionValue(reduced || !match ? target : 0);
  const text = useTransform(n, (v) => Math.round(v).toLocaleString(locale));

  useEffect(() => {
    if (!play || reduced || !match) return;
    const c = animate(n, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 });
    return () => c.stop();
  }, [play, reduced, match, n, target]);

  if (!match) return <span>{value}</span>;
  return (
    <span className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        <motion.span>{text}</motion.span>
        <motion.span
          className="inline-block"
          initial={reduced ? false : { scale: 0, rotate: -180 }}
          animate={play ? { scale: 1, rotate: 0 } : undefined}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.8 }}
        >
          {suffix}
        </motion.span>
      </span>
    </span>
  );
}

function StatCard({
  stat,
  reduced,
  index,
  locale,
}: {
  stat: Reviews["stat"];
  reduced: boolean;
  index: number;
  locale: string;
}) {
  const [seen, setSeen] = useState(reduced);
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, scale: 0.85, rotate: 4 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={() => setSeen(true)}
      transition={{ type: "spring", stiffness: 90, damping: 14, delay: index * 0.12 }}
    >
      <motion.div
        className="relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[1.25rem] bg-teal p-7 text-ink sm:p-9"
        initial={reduced ? false : { clipPath: "circle(0% at 100% 100%)" }}
        animate={seen ? { clipPath: "circle(150% at 100% 100%)" } : undefined}
        transition={{ duration: 1.1, ease, delay: index * 0.12 }}
        whileHover={reduced ? undefined : { scale: 1.015 }}
      >
        {/* Arka planda yavaşça dönen gezegen bantları */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-16 -bottom-16 size-72 text-ink/10"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 10" />
          <circle cx="100" cy="100" r="44" fill="currentColor" />
        </motion.svg>
        <p className="relative font-tall text-[clamp(5rem,12vw,8.5rem)]">
          <CountUp value={stat.value} reduced={reduced} play={seen} locale={locale} />
        </p>
        <motion.p
          className="relative max-w-[34ch] text-[1.05rem] font-medium"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={seen ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease, delay: 0.9 }}
        >
          {stat.text}
        </motion.p>
      </motion.div>
    </motion.li>
  );
}

export default function ReviewsMotion({ reviews, numberLocale }: { reviews: Reviews; numberLocale: string }) {
  const reduced = useReducedMotion() ?? false;
  const items = reviews.items.slice(0, 3);

  return (
    <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
      {items.map((it, i) => (
        <ReviewCard key={it.name} item={it} index={i} reduced={reduced} />
      ))}
      <StatCard stat={reviews.stat} reduced={reduced} index={items.length} locale={numberLocale} />
    </ul>
  );
}
