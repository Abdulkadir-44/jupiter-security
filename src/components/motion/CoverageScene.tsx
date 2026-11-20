import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/**
 * "Kör nokta bırakmıyoruz" sahnesi: Bir dükkanın kuşbakışı planı.
 * Ekrana girince mercek (iris) açılır, duvarlar çizilir ve kameraların
 * görüş alanları tek tek yayılır.
 */

type Cam = {
  x: number;
  y: number;
  /** derece, SVG yönü (0 = sağ, 90 = aşağı) */
  from: number;
  to: number;
  r: number;
  clip: "shop" | "depot";
};

const CAMS: Cam[] = [
  { x: 54, y: 54, from: 6, to: 84, r: 360, clip: "shop" },
  { x: 54, y: 406, from: 276, to: 354, r: 250, clip: "shop" },
  { x: 586, y: 406, from: 186, to: 268, r: 330, clip: "shop" },
  { x: 586, y: 54, from: 96, to: 174, r: 240, clip: "depot" },
];

const rad = (d: number) => (d * Math.PI) / 180;

function sector(c: Cam, p: number) {
  const r = Math.max(0.01, c.r * p);
  const x0 = c.x + r * Math.cos(rad(c.from));
  const y0 = c.y + r * Math.sin(rad(c.from));
  const x1 = c.x + r * Math.cos(rad(c.to));
  const y1 = c.y + r * Math.sin(rad(c.to));
  const large = c.to - c.from > 180 ? 1 : 0;
  return `M${c.x} ${c.y} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
}

function Cone({ cam, index, delay, play }: { cam: Cam; index: number; delay: number; play: boolean | "instant" }) {
  const p = useMotionValue(play === "instant" ? 1 : 0);
  const d = useTransform(p, (v) => sector(cam, v));

  useEffect(() => {
    if (play !== true) return;
    const controls = animate(p, 1, { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [p, delay, play]);

  return (
    <g clipPath={`url(#clip-${cam.clip})`}>
      <motion.path d={d} fill={`url(#cone-${index})`} stroke="var(--color-sun)" strokeOpacity={0.7} strokeWidth={1.4} />
    </g>
  );
}

function useClock(active: boolean) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    if (!active) return;
    const fmt = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    setNow(fmt());
    const t = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

interface Props {
  label: string;
  result: string;
  rooms: { mağaza: string; depo: string; kasa: string; giriş: string };
}

export default function CoverageScene({ label, result, rooms }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion() ?? false;
  const play: boolean | "instant" = reduced ? "instant" : inView;
  const clock = useClock(inView || reduced);

  const camStart = 1.0;
  const camGap = 0.3;
  const doneAt = camStart + camGap * CAMS.length + 0.5;

  const on = play !== false;
  const instant = play === "instant";
  const t = (delay: number, duration: number) => (instant ? { duration: 0 } : { delay, duration });

  return (
    <div ref={ref} className="overflow-hidden rounded-[1.25rem] bg-ink ring-1 ring-paper/10">
      {/* Ekran üstü bilgi (OSD) */}
      <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-4 py-3 font-mono text-[11px] text-paper/80 sm:text-xs">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-coral" aria-hidden="true" />
          {label}
        </span>
        <span className="tabular-nums" aria-hidden="true">
          {clock}
        </span>
      </div>

      {/* Mercek açılışı + odaklanma */}
      <motion.div
        className="relative"
        initial={instant ? false : { clipPath: "circle(0% at 50% 50%)", filter: "blur(12px)" }}
        animate={on ? { clipPath: "circle(75% at 50% 50%)", filter: "blur(0px)" } : undefined}
        transition={instant ? { duration: 0 } : { clipPath: { duration: 1.0, ease: [0.22, 1, 0.36, 1] }, filter: { duration: 1.2, delay: 0.15 } }}
      >
        <svg viewBox="0 0 640 460" className="block h-auto w-full" role="img" aria-label={`${label}. ${result}.`}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="var(--color-paper)" strokeOpacity="0.06" strokeWidth="0.8" />
            </pattern>
            {CAMS.map((c, i) => (
              <radialGradient key={i} id={`cone-${i}`} cx={c.x} cy={c.y} r={c.r} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--color-sun)" stopOpacity="0.38" />
                <stop offset="1" stopColor="var(--color-sun)" stopOpacity="0.03" />
              </radialGradient>
            ))}
            <clipPath id="clip-shop">
              <path d="M40 40H430V250H600V420H40Z" />
            </clipPath>
            <clipPath id="clip-depot">
              <rect x="430" y="40" width="170" height="210" />
            </clipPath>
          </defs>

          <rect width="640" height="460" fill="url(#grid)" />

          {CAMS.map((c, i) => (
            <Cone key={i} cam={c} index={i} delay={camStart + i * camGap} play={play} />
          ))}

          {/* Raflar, kasa */}
          <motion.g
            fill="var(--color-navy-2)"
            stroke="var(--color-paper)"
            strokeOpacity="0.18"
            strokeWidth="1.2"
            initial={instant ? false : { opacity: 0 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={t(0.7, 0.6)}
          >
            <rect x="120" y="96" width="210" height="22" rx="3" />
            <rect x="120" y="156" width="210" height="22" rx="3" />
            <rect x="120" y="216" width="210" height="22" rx="3" />
            <rect x="84" y="326" width="128" height="40" rx="4" />
            <rect x="458" y="72" width="22" height="150" rx="3" />
            <rect x="556" y="72" width="22" height="150" rx="3" />
          </motion.g>

          {/* Duvarlar */}
          <g fill="none" stroke="var(--color-paper)" strokeWidth="5" strokeLinecap="square">
            {["M262 420H40V40H600V420H338", "M430 40V168M430 214V250H600"].map((d) => (
              <motion.path
                key={d}
                d={d}
                initial={instant ? false : { pathLength: 0 }}
                animate={on ? { pathLength: 1 } : undefined}
                transition={instant ? { duration: 0 } : { delay: 0.3, duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}
          </g>

          {/* Oda adları */}
          <motion.g
            fontSize="14"
            fontWeight="600"
            fill="var(--color-mist)"
            style={{ fontFamily: "var(--font-sans)" }}
            initial={instant ? false : { opacity: 0 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={t(0.9, 0.5)}
          >
            <text x="225" y="292" textAnchor="middle">{rooms.mağaza}</text>
            <text x="515" y="242" textAnchor="middle">{rooms.depo}</text>
            <text x="148" y="392" textAnchor="middle">{rooms.kasa}</text>
            <text x="300" y="448" textAnchor="middle">{rooms.giriş}</text>
          </motion.g>

          {/* Kameralar */}
          {CAMS.map((c, i) => (
            <motion.g
              key={i}
              initial={instant ? false : { opacity: 0, scale: 0.2 }}
              animate={on ? { opacity: 1, scale: 1 } : undefined}
              transition={instant ? { duration: 0 } : { delay: camStart + i * camGap - 0.1, type: "spring", stiffness: 420, damping: 22 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px`, transformBox: "view-box" }}
            >
              <circle cx={c.x} cy={c.y} r="11" fill="var(--color-ink)" stroke="var(--color-sun)" strokeWidth="2.5" />
              <circle cx={c.x} cy={c.y} r="4" fill="var(--color-sun)" />
            </motion.g>
          ))}
        </svg>
        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />
      </motion.div>

      {/* Sonuç */}
      <div className="flex items-center gap-2.5 border-t border-paper/10 px-4 py-3 font-mono text-[11px] text-paper sm:text-xs">
        <motion.span
          className="flex items-center gap-2.5"
          initial={instant ? false : { opacity: 0 }}
          animate={on ? { opacity: 1 } : undefined}
          transition={t(doneAt, 0.4)}
        >
          <span className="size-2 rounded-full bg-sun" aria-hidden="true" />
          {result}
        </motion.span>
      </div>
    </div>
  );
}
