"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { latentClusters, latentMeta, type LatentCluster } from "@/lib/data";

type Pt = {
  hx: number; // home position (normalized)
  hy: number;
  x: number;
  y: number;
  hue: number;
  base: number; // base radius
  seed: number;
};

/** Box-Muller gaussian sample. */
function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * The signature interaction: a navigable 2D projection of a
 * high-dimensional "identity embedding". Background points cluster
 * around labeled waypoints (the site's sections), each tinted by its
 * region hue. The cursor is a probe — nearby points brighten, lift,
 * and thread to it. Clicking a waypoint decodes you into that region.
 */
export default function LatentField({
  onNavigate,
}: {
  onNavigate?: (href: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  // track the mobile breakpoint so points + labels share one layout
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = (c: LatentCluster) => (isMobile ? c.mx : c.x);
    const cy = (c: LatentCluster) => (isMobile ? c.my : c.y);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    // build the point cloud — gaussian blobs per cluster + uniform noise
    const points: Pt[] = [];
    const perCluster = isMobile ? 22 : 34;
    const spread = isMobile ? 0.07 : 0.055;
    for (const c of latentClusters) {
      for (let i = 0; i < perCluster; i++) {
        const hx = Math.min(0.98, Math.max(0.02, cx(c) + gauss() * spread));
        const hy = Math.min(0.98, Math.max(0.02, cy(c) + gauss() * spread));
        points.push({
          hx,
          hy,
          x: hx,
          y: hy,
          hue: c.hue,
          base: Math.random() * 1.3 + 0.5,
          seed: Math.random() * 1000,
        });
      }
    }
    // sparse background noise (unassigned latent points)
    for (let i = 0; i < (isMobile ? 45 : 90); i++) {
      const hx = Math.random();
      const hy = Math.random();
      points.push({ hx, hy, x: hx, y: hy, hue: 224, base: Math.random() * 0.9 + 0.3, seed: Math.random() * 1000 });
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.offsetWidth;
      height = wrap.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const step = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const hov = hoveredRef.current;

      for (const p of points) {
        // gentle drift around home
        const drift = reduced ? 0 : 0.006;
        p.x = p.hx + Math.sin(t * 0.0004 + p.seed) * drift;
        p.y = p.hy + Math.cos(t * 0.00033 + p.seed * 1.3) * drift;

        const px = p.x * width;
        const py = p.y * height;

        // probe response
        const dm = Math.hypot(px - mouse.x, py - mouse.y);
        const probe = mouse.active ? Math.max(0, 1 - dm / 190) : 0;

        // region highlight when its label is hovered
        const inHovered = hov !== null &&
          latentClusters.some((c) => c.id === hov && Math.hypot((cx(c) - p.hx), (cy(c) - p.hy)) < 0.12);
        const boost = inHovered ? 0.55 : 0;

        const alpha = 0.16 + probe * 0.7 + boost;
        const r = p.base + probe * 1.6 + boost * 0.8;
        const light = 60 + probe * 15;

        ctx.fillStyle = `hsl(${p.hue} 78% ${light}% / ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();

        // thread bright points to the probe
        if (probe > 0.25) {
          ctx.strokeStyle = `hsl(${p.hue} 80% 68% / ${probe * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(wrap);

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, isMobile]);

  const go = (c: LatentCluster) => {
    if (onNavigate) onNavigate(c.href);
    else document.querySelector(c.href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* projection frame — tick marks reinforce "this is a plot" */}
      <div className="absolute inset-6 md:inset-10 border border-line/60 rounded-sm pointer-events-none" aria-hidden>
        <span className="absolute -top-2 left-4 h-4 w-px bg-line" />
        <span className="absolute -top-2 right-1/3 h-4 w-px bg-line" />
        <span className="absolute top-1/2 -left-2 w-4 h-px bg-line" />
        <span className="absolute bottom-1/3 -right-2 w-4 h-px bg-line" />
      </div>

      <span className="absolute top-8 md:top-12 right-8 md:right-14 mono-label !text-[10px] text-faint pointer-events-none">
        {latentMeta.dims}-D → 2-D
      </span>

      {/* labeled waypoints — the navigation */}
      {latentClusters.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => go(c)}
          onMouseEnter={() => setHovered(c.id)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(c.id)}
          onBlur={() => setHovered(null)}
          data-cursor="Decode"
          className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 outline-offset-8"
          style={{
            left: `${(isMobile ? c.mx : c.x) * 100}%`,
            top: `${(isMobile ? c.my : c.y) * 100}%`,
          }}
          aria-label={`Go to ${c.label}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inset-0 rounded-full transition-transform duration-500 group-hover:scale-[2.4]"
              style={{ background: `hsl(${c.hue} 85% 65%)`, opacity: 0.25 }}
            />
            <span
              className="relative h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:shadow-[0_0_18px_currentColor]"
              style={{ background: `hsl(${c.hue} 85% 66%)`, color: `hsl(${c.hue} 85% 66%)` }}
            />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span
              className="font-display text-[13px] md:text-sm font-medium text-fg/90 group-hover:text-fg transition-colors"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              {c.label}
            </span>
            <span className="coord text-[9px] text-faint mt-1 hidden md:block">
              {c.meta}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
