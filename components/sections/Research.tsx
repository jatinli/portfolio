"use client";

import { useState } from "react";
import { publications, type Publication } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

const STATUS_STYLE: Record<Publication["status"], string> = {
  Published: "text-emerald-400 border-emerald-400/30",
  "Under Review": "text-amber-400 border-amber-400/30",
  Preprint: "text-sky-400 border-sky-400/30",
  "In Progress": "text-accent border-accent/30",
};

function PaperCard({ paper }: { paper: Publication }) {
  const [copied, setCopied] = useState(false);

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(paper.bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <FadeIn>
      <article className="group border-t border-line py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4">
          <span className="font-mono text-faint text-sm">{paper.index}</span>
          <span
            className={`mono-label !text-[10px] border rounded-full px-3 py-1.5 ${STATUS_STYLE[paper.status]}`}
          >
            {paper.status}
          </span>
          <span className="mono-label">{paper.year}</span>
        </div>

        <div className="lg:col-span-7">
          <h3 className="font-display font-medium tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] text-fg group-hover:text-accent transition-colors duration-500">
            {paper.title}
          </h3>
          <p className="mono-label mt-5">{paper.venue}</p>
          <p className="text-muted leading-relaxed mt-6 text-[15px] max-w-2xl">
            <span className="text-fg/70 font-medium">Abstract — </span>
            {paper.abstract}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {paper.pdf && (
              <a
                href={paper.pdf}
                className="link-line text-sm text-fg"
                data-cursor="PDF"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read PDF ↗
              </a>
            )}
            {paper.code && (
              <a
                href={paper.code}
                className="link-line text-sm text-fg ml-4"
                data-cursor="Code"
                target="_blank"
                rel="noopener noreferrer"
              >
                Repository ↗
              </a>
            )}
            <button
              type="button"
              onClick={copyCitation}
              className="link-line text-sm text-fg ml-4"
              data-cursor="BibTeX"
            >
              {copied ? "Copied ✓" : "Cite"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <dl className="space-y-4 lg:border-l lg:border-line lg:pl-8">
            {paper.metrics.map((m) => (
              <div key={m.label}>
                <dd className="font-display text-3xl md:text-4xl font-medium text-fg">
                  {m.value}
                </dd>
                <dt className="mono-label mt-1">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </FadeIn>
  );
}

export default function Research() {
  return (
    <section id="research" className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto">
      <SectionHeading index="05" label="Research" />

      <div className="mb-16 md:mb-24">
        <WordReveal
          text="Questions worth asking"
          className="font-display text-[clamp(2.2rem,6vw,5rem)] font-medium tracking-[-0.03em] leading-[1]"
        />
        <FadeIn delay={0.1}>
          <p className="text-muted mt-6 max-w-md">
            Research keeps engineering honest. These are the problems I&apos;m actively
            investigating.
          </p>
        </FadeIn>
      </div>

      <div className="border-b border-line">
        {publications.map((paper) => (
          <PaperCard key={paper.index} paper={paper} />
        ))}
      </div>
    </section>
  );
}
