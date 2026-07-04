"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillNodes } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

// blue-led: signature blue + paper + ink, with a single tangerine spark
const GROUP_COLORS = [
  "bg-accent text-white",
  "bg-elevated",
  "bg-fg text-bg",
  "bg-accent text-white",
  "bg-elevated",
  "bg-orange text-white",
  "bg-fg text-bg",
  "bg-elevated",
];

/**
 * The toolkit — a wall of chunky pills grouped by domain.
 * Click a domain chip to spotlight it; everything else steps back.
 */
export default function Skills() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="skills" className="relative px-6 md:px-14 py-28 md:py-40 max-w-[1500px] mx-auto">
      <SectionHeading index="02" label="the toolkit" />

      <div className="mb-14 md:mb-20">
        <WordReveal
          text="Things that pay my rent (hopefully)"
          className="font-display font-extrabold text-[clamp(2rem,5.5vw,4.5rem)] tracking-[-0.02em] leading-[1.02]"
        />
        <FadeIn delay={0.1}>
          <p className="text-muted mt-5 max-w-md text-lg">
            Tap a domain to see what&apos;s inside. No skill bars, no percentages —
            you either ship with it or you don&apos;t.
          </p>
        </FadeIn>
      </div>

      {/* domain chips */}
      <FadeIn>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {skillNodes.map((node, i) => {
            const isActive = active === node.id;
            const isDimmed = active !== null && !isActive;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActive(isActive ? null : node.id)}
                data-cursor={isActive ? "close" : "peek"}
                aria-expanded={isActive}
                className={`btn-hard hover-wiggle rounded-2xl px-5 py-3.5 md:px-6 md:py-4 font-display font-bold text-base md:text-xl transition-opacity duration-300 ${
                  GROUP_COLORS[i % GROUP_COLORS.length]
                } ${isDimmed ? "opacity-40" : ""}`}
                style={{ transform: `rotate(${((i * 7) % 5) - 2}deg)` }}
              >
                {node.label.toLowerCase()}
                <span className="ml-2 font-mono text-xs align-middle opacity-60">
                  {node.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* expanded domain */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 border-2 border-fg rounded-3xl bg-elevated shadow-hard p-7 md:p-10"
          >
            {(() => {
              const node = skillNodes.find((n) => n.id === active)!;
              return (
                <>
                  <div className="flex items-baseline justify-between gap-4 mb-6">
                    <h3 className="font-display font-extrabold text-2xl md:text-3xl">
                      {node.label.toLowerCase()}
                    </h3>
                    <span className="mono-label">{node.items.length} tools</span>
                  </div>
                  <ul className="flex flex-wrap gap-2.5">
                    {node.items.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.04, duration: 0.25 }}
                        className="border-2 border-fg rounded-full px-4 py-2 text-sm font-medium bg-bg shadow-hard-sm"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                  {node.connections.length > 0 && (
                    <p className="mt-6 text-sm text-muted">
                      plays well with:{" "}
                      {node.connections
                        .map((id) => skillNodes.find((n) => n.id === id)?.label.toLowerCase())
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
