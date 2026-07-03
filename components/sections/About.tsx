"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { manifesto } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/Reveal";

/** One word whose opacity is driven by overall scroll progress. */
function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/** Statement that "reads itself" as you scroll — each word brightens in turn. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const words = text.split(" ");

  if (reduced) {
    return (
      <p className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-[1.15] tracking-[-0.02em]">
        {text}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-[1.15] tracking-[-0.02em]"
    >
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
        />
      ))}
    </p>
  );
}

export default function About() {
  return (
    <section id="about" className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto">
      <SectionHeading index="01" label="About" />

      <div className="max-w-5xl">
        <ScrollStatement text={manifesto.statement} />
      </div>

      <div className="mt-24 md:mt-36 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* narrative — offset editorial column */}
        <div className="lg:col-span-6 lg:col-start-2 space-y-8">
          {manifesto.paragraphs.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <p className="text-muted text-lg md:text-xl leading-relaxed">{p}</p>
            </FadeIn>
          ))}
        </div>

        {/* facts */}
        <FadeIn className="lg:col-span-4 lg:col-start-9" delay={0.15}>
          <dl className="border-t border-line">
            {manifesto.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 py-5 border-b border-line group"
              >
                <dt className="mono-label">{fact.label}</dt>
                <dd className="text-fg text-sm md:text-base text-right group-hover:text-accent transition-colors duration-300">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>

      {/* principles */}
      <div className="mt-28 md:mt-40 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        {manifesto.principles.map((principle, i) => (
          <FadeIn key={principle.title} delay={i * 0.12} className="bg-bg p-8 md:p-10 group">
            <span className="mono-label text-faint">0{i + 1}</span>
            <h3 className="font-display text-xl md:text-2xl font-medium mt-6 mb-4 group-hover:text-accent transition-colors duration-400">
              {principle.title}
            </h3>
            <p className="text-muted leading-relaxed text-[15px]">{principle.body}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
