"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Magnetic from "@/components/ui/Magnetic";
import { FadeIn, WordReveal } from "@/components/ui/Reveal";

function LocalTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: site.timezone,
        }).format(new Date())
      );
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  return <span suppressHydrationWarning>{time || "—"}</span>;
}

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="relative px-6 md:px-14 pt-32 md:pt-48 max-w-[1600px] mx-auto">
      <SectionHeading index="07" label="Contact" />

      <div className="text-center py-10 md:py-20">
        <FadeIn>
          <p className="mono-label mb-8">Have an idea worth building?</p>
        </FadeIn>

        <WordReveal
          text="Let's make something"
          className="font-display text-[clamp(2.6rem,8vw,7.5rem)] font-semibold tracking-[-0.04em] leading-[0.95]"
        />
        <WordReveal
          text="intelligent together"
          delay={0.25}
          className="font-display font-medium text-[clamp(2.6rem,8vw,7.5rem)] leading-[1.05] text-accent"
        />

        <FadeIn delay={0.35}>
          <div className="mt-16">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${site.email}`}
                data-cursor="Write"
                className="group inline-flex items-center gap-4 rounded-full bg-fg text-bg px-10 py-6 font-display text-lg font-medium hover:bg-accent hover:text-white transition-colors duration-500"
              >
                {site.email}
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </FadeIn>
      </div>

      {/* footer */}
      <footer className="mt-24 md:mt-36 border-t border-line py-10 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        <p className="text-sm text-muted col-span-2 md:col-span-1">
          © {year} {site.name}
        </p>

        <div className="flex gap-6 text-sm">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line text-muted hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line text-muted hover:text-fg transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-sm text-muted">
          {site.location} · <LocalTime /> IST
        </p>

        <div className="md:text-right">
          <a href="#top" className="link-line text-sm text-muted hover:text-fg transition-colors" data-cursor="Top">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
