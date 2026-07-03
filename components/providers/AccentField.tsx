"use client";

import { useEffect, type ReactNode } from "react";
import { sectionHues } from "@/lib/data";

/** Shortest-path hue interpolation (handles the 360° wrap). */
function lerpHue(a: number, b: number, t: number) {
  const delta = ((b - a + 540) % 360) - 180;
  return (a + delta * t + 360) % 360;
}

/**
 * Drives the global accent hue from scroll position.
 * Whichever section is most in view sets the target hue; the CSS
 * variable --accent-h eases toward it every frame, so the entire
 * site's accent (links, buttons, cursor, labels) drifts as you
 * move through the "latent space". Color = wayfinding.
 */
export default function AccentField({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ids = Object.keys(sectionHues);
    let targetHue = sectionHues.top;
    let currentHue = sectionHues.top;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // pick the most-visible known section
        let best = "top";
        let bestRatio = -1;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0 && sectionHues[best] !== undefined) {
          targetHue = sectionHues[best];
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    let raf = 0;
    const loop = () => {
      currentHue = reduced ? targetHue : lerpHue(currentHue, targetHue, 0.06);
      root.style.setProperty("--accent-h", currentHue.toFixed(1));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
