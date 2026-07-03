"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { site, experience, skillNodes } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Magnetic from "@/components/ui/Magnetic";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

/** A miniature, stylized preview of the resume document. */
function ResumePreview() {
  return (
    <div className="relative bg-[#0e0e13] border border-line rounded-xl p-7 md:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.5)] select-none">
      <div className="flex items-start justify-between pb-5 border-b border-line">
        <div>
          <p className="font-display font-semibold text-lg text-fg">{site.name}</p>
          <p className="text-muted text-xs mt-1">
            AI/ML Engineer · Data Scientist · Researcher
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-accent mt-1.5" aria-hidden />
      </div>

      <div className="mt-5 space-y-4" aria-hidden>
        {experience.slice(0, 2).map((e) => (
          <div key={e.period}>
            <div className="flex justify-between text-[11px] font-mono text-faint">
              <span className="text-fg/80">{e.role}</span>
              <span>{e.period}</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 rounded bg-fg/[0.07] w-full" />
              <div className="h-1.5 rounded bg-fg/[0.07] w-4/5" />
              <div className="h-1.5 rounded bg-fg/[0.07] w-3/5" />
            </div>
          </div>
        ))}
        <div>
          <p className="text-[11px] font-mono text-fg/80 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skillNodes.slice(0, 6).map((s) => (
              <span key={s.id} className="h-4 rounded-full bg-fg/[0.07] px-6" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-line flex justify-between items-center">
        <span className="text-[10px] font-mono text-faint">PDF · 1 page</span>
        <span className="text-[10px] font-mono text-accent">↓ resume.pdf</span>
      </div>
    </div>
  );
}

export default function Resume() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const previewY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const previewRotate = useTransform(scrollYProgress, [0, 1], [4, -4]);

  return (
    <section
      ref={ref}
      id="resume"
      className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto"
    >
      <SectionHeading index="06" label="Resume" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <WordReveal
            text="The one-page version"
            className="font-display text-[clamp(2.2rem,6vw,5rem)] font-medium tracking-[-0.03em] leading-[1]"
          />
          <FadeIn delay={0.12}>
            <p className="text-muted mt-8 max-w-md text-lg leading-relaxed">
              Everything on this site, distilled to a single page —{" "}
              <span className="accent-word">for the humans and the ATS parsers.</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-12">
              <Magnetic strength={0.3}>
                <a
                  href={site.links.resume}
                  download="Jatin-Lilani-Resume.pdf"
                  data-cursor="Download"
                  className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-fg/20 px-10 py-6 text-fg font-medium transition-colors duration-500 hover:text-bg"
                >
                  <span className="absolute inset-0 bg-fg scale-y-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                  <span className="relative font-display text-lg">Download Resume</span>
                  <span className="relative inline-flex w-8 h-8 items-center justify-center rounded-full border border-current transition-transform duration-500 group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>
              </Magnetic>
              <p className="mono-label mt-6">PDF · Updated 2026</p>
            </div>
          </FadeIn>
        </div>

        <motion.div
          className="lg:col-span-4 lg:col-start-9 max-w-sm mx-auto w-full"
          style={reduced ? undefined : { y: previewY, rotate: previewRotate }}
        >
          <FadeIn delay={0.1}>
            <ResumePreview />
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
}
