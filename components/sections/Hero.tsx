"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { site, asset } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";

const maskReveal = {
  hidden: { y: "112%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.65 + i * 0.11 },
  }),
};

const STICKER_ROTATIONS = [-6, 4, -3, 7];
const STICKER_COLORS = [
  "bg-elevated",
  "bg-elevated",
  "bg-elevated",
  "bg-accent text-white",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={sectionRef} id="top" className="relative min-h-svh flex flex-col overflow-hidden">
      {/* big soft color blobs, paper-style */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 38% at 82% 18%, rgba(255,77,0,0.28), transparent 70%), radial-gradient(ellipse 40% 35% at 12% 85%, rgba(124,92,255,0.16), transparent 70%), radial-gradient(ellipse 30% 28% at 70% 80%, rgba(31,77,255,0.14), transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-14 max-w-[1500px] mx-auto w-full pt-28 pb-10"
      >
        {/* stickers */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap gap-3 mb-8 md:mb-12"
        >
          {site.stickers.map((s, i) => (
            <span
              key={s}
              className={`sticker ${STICKER_COLORS[i % STICKER_COLORS.length]}`}
              style={{ transform: `rotate(${STICKER_ROTATIONS[i % STICKER_ROTATIONS.length]}deg)` }}
            >
              {i === 0 && <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />}
              {s}
            </span>
          ))}
        </motion.div>

        {/* the statement */}
        <h1 className="font-display font-extrabold tracking-[-0.03em] leading-[0.98] text-[clamp(2.6rem,8.5vw,7.5rem)]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block will-change-transform"
              variants={maskReveal}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              hey, i&apos;m {site.firstName.toLowerCase()}
              <img
                src={asset("/grin-emoji.png")}
                alt=""
                aria-hidden
                className="inline-block h-[0.82em] w-auto align-[-0.1em] ml-[0.18em] select-none origin-[70%_70%] animate-none md:hover:animate-[wiggle_0.4s_ease-in-out]"
              />
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block will-change-transform"
              variants={maskReveal}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              i bully <span className="scribble">datasets</span>
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block will-change-transform"
              variants={maskReveal}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              for a <span className="text-accent">living</span>.
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="overflow-hidden max-w-md">
            <motion.p
              variants={maskReveal}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-muted text-base md:text-lg leading-relaxed"
            >
              AI/ML engineer + data scientist. I train the models, ship the systems,
              and care <em>way</em> too much about how it all feels to use.
            </motion.p>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.25}>
              <a
                href="#work"
                data-cursor="let's go"
                className="btn-hard inline-flex items-center gap-3 rounded-2xl bg-accent text-white font-display font-bold text-base px-7 py-4"
              >
                see the work ↓
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={site.links.resume}
                download="Jatin-Lilani-Resume.pdf"
                data-cursor="pdf"
                className="btn-hard inline-flex items-center rounded-2xl bg-elevated text-fg font-display font-bold text-base px-7 py-4"
              >
                grab the resume
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* ticker */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="relative border-t-2 border-fg bg-orange text-white py-3.5 overflow-hidden select-none"
        aria-hidden
      >
        <div className="animate-marquee flex whitespace-nowrap w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {[...site.roles, ...site.roles].map((role, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center font-mono text-xs md:text-sm font-medium tracking-[0.12em] uppercase text-white"
                >
                  <span className="px-6">{role}</span>
                  <span>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
