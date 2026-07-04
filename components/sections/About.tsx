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
    </section>
  );
}
