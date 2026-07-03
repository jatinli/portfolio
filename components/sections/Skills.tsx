"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { skillNodes, type SkillNode } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/Reveal";

const SIZE_PX: Record<SkillNode["size"], number> = { lg: 18, md: 13, sm: 10 };

/**
 * Interactive knowledge constellation.
 * Nodes gently float (JS-driven so canvas edges stay attached);
 * signal pulses travel along connections; hovering or focusing a
 * node reveals its expertise and lights up its neighborhood.
 */
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const activeRef = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const phases = new Map(skillNodes.map((n, i) => [n.id, i * 1.7]));
    const edges: [SkillNode, SkillNode][] = [];
    for (const node of skillNodes) {
      for (const targetId of node.connections) {
        const target = skillNodes.find((n) => n.id === targetId);
        if (target) edges.push([node, target]);
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const posOf = (n: SkillNode, t: number) => {
      const phase = phases.get(n.id) ?? 0;
      const fx = reduced ? 0 : Math.sin(t * 0.0006 + phase) * 7;
      const fy = reduced ? 0 : Math.cos(t * 0.0005 + phase * 1.3) * 7;
      return { x: n.x * width + fx, y: n.y * height + fy };
    };

    const step = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const current = activeRef.current;

      for (const [a, b] of edges) {
        const pa = posOf(a, t);
        const pb = posOf(b, t);
        const isHot = current !== null && (a.id === current || b.id === current);
        const dim = current !== null && !isHot;

        ctx.strokeStyle = isHot
          ? "hsl(190 85% 60% / 0.6)"
          : `rgba(140,160,175,${dim ? 0.05 : 0.14})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();

        // signal pulse traveling along the edge
        if (!reduced && !dim) {
          const phase = (phases.get(a.id) ?? 0) + (phases.get(b.id) ?? 0);
          const u = ((t * 0.00012 + phase * 0.11) % 1 + 1) % 1;
          const px = pa.x + (pb.x - pa.x) * u;
          const py = pa.y + (pb.y - pa.y) * u;
          ctx.fillStyle = isHot ? "hsl(190 90% 70% / 0.9)" : "hsl(190 80% 65% / 0.35)";
          ctx.beginPath();
          ctx.arc(px, py, isHot ? 2.2 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // move the DOM nodes with the same float so everything stays attached
      for (const node of skillNodes) {
        const el = nodeRefs.current.get(node.id);
        if (!el) continue;
        const p = posOf(node, t);
        el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(container);

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  const activeNode = skillNodes.find((n) => n.id === active);

  return (
    <section id="skills" className="relative px-6 md:px-14 py-32 md:py-48 max-w-[1600px] mx-auto">
      <SectionHeading index="02" label="Capabilities" />

      <FadeIn>
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-medium tracking-[-0.02em] leading-[1.05] max-w-3xl">
          One region of the space,{" "}
          <span className="accent-word">expanded</span>
        </h2>
        <p className="text-muted mt-6 max-w-md">
          Zoom into the capability cluster: eight domains, wired together. Hover a node — the
          neighborhood it activates is the point.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div
          ref={containerRef}
          className="relative mt-16 h-[520px] md:h-[640px] border border-line rounded-2xl overflow-hidden bg-surface/40"
        >
          {/* faint grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,242,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,239,0.03) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
            aria-hidden
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

          {skillNodes.map((node) => {
            const isActive = active === node.id;
            const isDim = active !== null && !isActive && !node.connections.includes(active) &&
              !(skillNodes.find((n) => n.id === active)?.connections.includes(node.id));
            return (
              <button
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                type="button"
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
                className="absolute left-0 top-0 flex items-center gap-3 group outline-offset-8"
                style={{
                  transform: `translate(${node.x * 100}%, ${node.y * 100}%) translate(-50%,-50%)`,
                  transition: "opacity 0.4s ease",
                  opacity: isDim ? 0.3 : 1,
                }}
                aria-expanded={isActive}
                aria-label={`${node.label}: ${node.items.join(", ")}`}
              >
                <span
                  className={`relative rounded-full transition-all duration-300 ${
                    isActive ? "bg-accent shadow-[0_0_24px_rgba(77,124,254,0.7)]" : "bg-fg/80"
                  }`}
                  style={{ width: SIZE_PX[node.size], height: SIZE_PX[node.size] }}
                >
                  <span
                    className={`absolute inset-0 rounded-full border border-accent/50 ${
                      isActive ? "animate-ping" : "opacity-0"
                    }`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap font-display text-sm md:text-base transition-colors duration-300 ${
                    isActive ? "text-fg" : "text-muted group-hover:text-fg"
                  }`}
                >
                  {node.label}
                </span>
              </button>
            );
          })}

          {/* expertise panel */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-5 left-5 right-5 md:right-auto md:w-80 glass rounded-xl p-5 pointer-events-none"
                role="status"
              >
                <p className="mono-label text-accent mb-3">{activeNode.label}</p>
                <ul className="flex flex-wrap gap-2">
                  {activeNode.items.map((item) => (
                    <li
                      key={item}
                      className="text-[13px] text-fg/90 border border-fg/15 rounded-full px-3 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>
    </section>
  );
}
