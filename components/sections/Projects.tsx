"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { projects, type Project } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectVisual from "@/components/ui/ProjectVisual";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

/** Perspective-tilting visual panel with a scroll-linked mask reveal. */
function TiltPanel({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(12% 8% 12% 8% round 20px)", "inset(0% 0% 0% 0% round 20px)"]);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 8);
      rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 8);
    },
    [reduced, rx, ry]
  );
  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="View"
        style={reduced ? undefined : { rotateX: srx, rotateY: sry, clipPath: clip }}
        className="relative aspect-[8/5] overflow-hidden rounded-[20px] border border-line will-change-transform"
      >
        <motion.div style={reduced ? undefined : { scale: innerScale }} className="absolute inset-0">
          <ProjectVisual project={project} />
        </motion.div>
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.06), transparent 40%)",
          }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <FadeIn>
          <TiltPanel project={project} />
        </FadeIn>
      </div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <FadeIn delay={0.1}>
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-display text-faint text-lg">{project.index}</span>
            <span className="mono-label text-accent">{project.category}</span>
            <span className="mono-label">{project.year}</span>
          </div>

          <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-medium tracking-[-0.02em] leading-[1.05] mb-10">
            {project.title}
          </h3>

          <dl className="space-y-7">
            {(
              [
                ["Problem", project.problem],
                ["Solution", project.solution],
                ["Impact", project.impact],
              ] as const
            ).map(([label, body]) => (
              <div key={label} className="grid grid-cols-[90px_1fr] gap-4">
                <dt className="mono-label pt-1">{label}</dt>
                <dd className="text-muted text-[15px] leading-relaxed">{body}</dd>
              </div>
            ))}
          </dl>

          <ul className="flex flex-wrap gap-2 mt-10">
            {project.tech.map((t) => (
              <li
                key={t}
                className="text-[12px] font-mono text-muted border border-line rounded-full px-3 py-1.5 hover:border-accent/50 hover:text-fg transition-colors duration-300"
              >
                {t}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto">
      <SectionHeading index="04" label="Selected Work" />

      <div className="mb-24 md:mb-36 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <WordReveal
          text="Work that shipped"
          className="font-display text-[clamp(2.2rem,6vw,5rem)] font-medium tracking-[-0.03em] leading-[1]"
        />
        <FadeIn delay={0.15}>
          <p className="text-muted max-w-sm md:text-right">
            Case studies, not screenshots. Each one framed the way I think:{" "}
            <span className="accent-word">problem, solution, impact.</span>
          </p>
        </FadeIn>
      </div>

      <div className="space-y-32 md:space-y-48">
        {projects.map((project, i) => (
          <CaseStudy key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
