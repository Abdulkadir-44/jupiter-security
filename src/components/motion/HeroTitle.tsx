import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SCAN_START = 0.75; // 2. satırda tarama çubuğunun başladığı an (sn)
const SCAN_DURATION = 0.9;

/**
 * Hero sloganı (görsel; ekran okuyucu için ayrı sr-only h1 var).
 * 1. satır: harfler bulanıktan netleşir (kamera odaklanması).
 * 2. satır: turkuaz tarama çubuğu geçerken harfler beyaz parlayıp turkuaza döner; çubuk ara ara tekrar geçer.
 * Sonunda sloganın köşelerine vizör çerçevesi oturur.
 */
export default function HeroTitle({ lines }: { lines: string[] }) {
  const reduced = useReducedMotion() ?? false;
  const first = lines.slice(0, -1);
  const last = lines[lines.length - 1] ?? "";

  if (reduced) {
    return (
      <span className="block">
        {lines.map((l, i) => (
          <span key={l} className={i === lines.length - 1 ? "block text-teal" : "block"}>
            {l}
          </span>
        ))}
      </span>
    );
  }

  let n = 0; // 1. satırlardaki harf sırası (gecikme için)
  const lastChars = [...last];

  return (
    <span className="relative block w-fit">
      {first.map((line) => (
        <span key={line} className="block">
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {wi > 0 && <span className="inline-block w-[0.22em]" />}
              {[...word].map((ch, ci) => {
                const i = n++;
                return (
                  <motion.span
                    key={ci}
                    className="inline-block will-change-transform"
                    initial={{ opacity: 0, y: "0.3em", filter: "blur(14px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </span>
      ))}

      {/* Son satır: tarama ile açılır */}
      <span className="relative inline-block whitespace-nowrap">
        {lastChars.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, color: "var(--color-paper)" }}
            animate={{ opacity: 1, color: ["var(--color-paper)", "var(--color-paper)", "var(--color-teal)"] }}
            transition={{
              opacity: { duration: 0.12, delay: SCAN_START + (i / lastChars.length) * SCAN_DURATION },
              color: {
                duration: 0.7,
                times: [0, 0.3, 1],
                delay: SCAN_START + (i / lastChars.length) * SCAN_DURATION,
              },
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
        {/* Tarama çubuğu */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-[0.06em] w-[3px] rounded-full bg-teal-soft shadow-[0_0_18px_4px_color-mix(in_srgb,var(--color-teal)_75%,transparent)]"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{
            left: { duration: SCAN_DURATION, ease: "linear", delay: SCAN_START, repeat: Infinity, repeatDelay: 5 },
            opacity: {
              duration: SCAN_DURATION,
              times: [0, 0.08, 0.9, 1],
              delay: SCAN_START,
              repeat: Infinity,
              repeatDelay: 5,
            },
          }}
        />
      </span>

      {/* Vizör köşelikleri */}
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <motion.span
          key={c}
          aria-hidden="true"
          className={[
            "pointer-events-none absolute size-[0.22em] border-paper/55",
            c === "tl" && "-top-[0.12em] -left-[0.16em] border-t-2 border-l-2",
            c === "tr" && "-top-[0.12em] -right-[0.16em] border-t-2 border-r-2",
            c === "bl" && "-bottom-[0.06em] -left-[0.16em] border-b-2 border-l-2",
            c === "br" && "-bottom-[0.06em] -right-[0.16em] border-r-2 border-b-2",
          ]
            .filter(Boolean)
            .join(" ")}
          initial={{
            opacity: 0,
            x: c.endsWith("l") ? "-0.25em" : "0.25em",
            y: c.startsWith("t") ? "-0.25em" : "0.25em",
          }}
          animate={{ opacity: [0, 1, 0.5, 1], x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: SCAN_START + SCAN_DURATION + 0.1 }}
        />
      ))}
    </span>
  );
}
