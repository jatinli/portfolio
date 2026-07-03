"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { site } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";
import LatentField from "@/components/LatentField";

const maskReveal = {
  hidden: { y: "112%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.7 + i * 0.12 },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-svh overflow-hidden flex flex-col md:block"
    >
      {/* ambient wash tinted by the live accent hue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 30%, var(--color-accent-soft), transparent 70%)",
        }}
        aria-hidden
      />

      {/* the navigable embedding — own panel on mobile, full-bleed on desktop */}
      <motion.div
        className="relative h-[46svh] shrink-0 border-b border-line/60 md:border-0 md:absolute md:inset-0 md:h-auto"
        style={reduced ? undefined : { scale: fieldScale }}
      >
        <LatentField />
      </motion.div>

      {/* scrim so the identity block stays legible over the field (desktop overlay only) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 22% 78%, rgba(5,5,6,0.9), transparent 60%)",
        }}
        aria-hidden
      />

      {/* identity block — anchored lower-left, clear of the waypoints */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-1 md:min-h-svh flex-col justify-between px-6 md:px-14 py-7 md:py-12 max-w-[1600px] mx-auto w-full pointer-events-none"
      >
        <div className="overflow-hidden pt-4 md:pt-20">
          <motion.p
            variants={maskReveal}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mono-label"
          >
            {site.location} · Portfolio © 2026
          </motion.p>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-display font-semibold tracking-[-0.045em] leading-[0.9] text-[clamp(3.2rem,12vw,11rem)]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block will-change-transform"
                variants={maskReveal}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                {site.firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block will-change-transform text-gradient-fade"
                variants={maskReveal}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                {site.lastName}
                <span className="text-accent">.</span>
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <div className="overflow-hidden max-w-md">
              <motion.p
                variants={maskReveal}
                initial="hidden"
                animate="visible"
                custom={3}
                className="text-muted text-base md:text-lg leading-relaxed"
              >
                I build <span className="accent-word">intelligent systems</span> — from research
                prototypes to production ML. Every point on the right is a place to go.
              </motion.p>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 pointer-events-auto"
            >
              <Magnetic>
                <a
                  href="#work"
                  data-cursor="Explore"
                  className="group inline-flex items-center gap-3 rounded-full bg-fg text-bg font-medium text-sm px-7 py-4 hover:bg-accent hover:text-white transition-colors duration-400"
                >
                  View Work
                  <span className="inline-block transition-transform duration-400 group-hover:translate-y-1">
                    ↓
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={site.links.resume}
                  download="Jatin-Lilani-Resume.pdf"
                  data-cursor="PDF"
                  className="inline-flex items-center rounded-full border border-fg/20 text-fg text-sm font-medium px-7 py-4 hover:border-fg/60 transition-colors duration-400"
                >
                  Download Resume
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* role marquee */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
          className="border-t border-line/70 pt-5 overflow-hidden select-none"
          aria-hidden
        >
          <div className="animate-marquee flex whitespace-nowrap w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {[...site.roles, ...site.roles].map((role, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="flex items-center font-display text-sm tracking-[0.18em] uppercase text-faint"
                  >
                    <span className="px-8">{role}</span>
                    <span className="text-accent/70">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
