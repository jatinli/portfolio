"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { experience } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

function TimelineItem({
  item,
  index,
}: {
  item: (typeof experience)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { scale, opacity, y }}
      className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 border border-line rounded-2xl p-8 md:p-12 bg-surface/50 backdrop-blur-sm"
    >
      <div className="md:col-span-3">
        <p className="mono-label text-accent">{item.period}</p>
        <p className="mono-label mt-3 text-faint">{String(index + 1).padStart(2, "0")}</p>
      </div>

      <div className="md:col-span-6">
        <h3 className="font-display text-2xl md:text-4xl font-medium tracking-[-0.02em]">
          {item.role}
        </h3>
        <p className="text-muted mt-1 mb-6">{item.org}</p>
        <p className="text-muted leading-relaxed mb-6">{item.summary}</p>
        <ul className="space-y-3">
          {item.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[15px] text-fg/85 leading-relaxed">
              <span className="text-accent mt-[2px]" aria-hidden>
                →
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-3 flex md:justify-end">
        <ul className="flex flex-wrap md:flex-col md:items-end gap-2 h-fit">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="mono-label !text-[10px] border border-line rounded-full px-3 py-1.5 text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.7", "end 0.7"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto">
      <SectionHeading index="03" label="Experience" />

      <div className="mb-20 md:mb-28">
        <WordReveal
          text="The path so far"
          className="font-display text-[clamp(2rem,5vw,4rem)] font-medium tracking-[-0.02em] leading-[1.05]"
        />
        <FadeIn delay={0.1}>
          <p className="text-muted mt-6 max-w-md">
            Every role sharpened the same conviction: intelligence is a systems problem, not a
            model problem.
          </p>
        </FadeIn>
      </div>

      <div ref={listRef} className="relative">
        {/* scroll-drawn spine */}
        <motion.div
          className="absolute left-[-1.5rem] md:left-[-3rem] top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent origin-top hidden sm:block"
          style={reduced ? undefined : { scaleY: lineScale }}
          aria-hidden
        />
        <div className="space-y-8 md:space-y-12">
          {experience.map((item, i) => (
            <TimelineItem key={item.period} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
