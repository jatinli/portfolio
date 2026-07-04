"use client";

import { useMemo } from "react";
import type { Project } from "@/lib/data";

/**
 * Round to 2dp. Math.sin/cos aren't guaranteed bit-identical across V8 builds,
 * so the server (Node) and client (browser) can differ in the last decimals and
 * trip React's hydration check. Rounding the serialized coordinates collapses
 * that drift so SSR and client markup match exactly.
 */
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Deterministic pseudo-random generator so visuals are stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generative editorial artwork for a project — no stock images, no screenshots.
 * Each pattern is drawn as inline SVG, tinted by the project's hue.
 */
export default function ProjectVisual({ project }: { project: Project }) {
  const { hue, pattern, id } = project;

  const art = useMemo(() => {
    const rand = mulberry32([...id].reduce((a, c) => a + c.charCodeAt(0), 0));
    const stroke = `hsl(${hue} 75% 38%)`;
    const faint = `hsl(${hue} 55% 38% / 0.3)`;

    if (pattern === "nodes") {
      const pts = Array.from({ length: 26 }, () => ({
        x: 40 + rand() * 720,
        y: 40 + rand() * 420,
        r: 1.5 + rand() * 3.5,
      }));
      return (
        <g>
          {pts.map((p, i) =>
            pts.slice(i + 1).map((q, j) => {
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              return dx * dx + dy * dy < 150 * 150 ? (
                <line key={`${i}-${j}`} x1={r2(p.x)} y1={r2(p.y)} x2={r2(q.x)} y2={r2(q.y)} stroke={faint} strokeWidth="1" />
              ) : null;
            })
          )}
          {pts.map((p, i) => (
            <circle key={i} cx={r2(p.x)} cy={r2(p.y)} r={r2(p.r)} fill={i % 5 === 0 ? stroke : "#17150f"} opacity={i % 5 === 0 ? 1 : 0.6} />
          ))}
        </g>
      );
    }

    if (pattern === "grid") {
      return (
        <g>
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 42} x2="800" y2={i * 42} stroke={faint} strokeWidth="1" />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`v${i}`} x1={i * 42} y1="0" x2={i * 42} y2="500" stroke={faint} strokeWidth="1" />
          ))}
          {Array.from({ length: 9 }, (_, i) => {
            const x = Math.floor(rand() * 19) * 42 + 42;
            const y = Math.floor(rand() * 11) * 42 + 42;
            return <rect key={i} x={x - 15} y={y - 15} width="30" height="30" fill={i % 3 === 0 ? stroke : "none"} stroke={stroke} strokeWidth="1.5" opacity={0.5 + rand() * 0.5} />;
          })}
        </g>
      );
    }

    if (pattern === "waves") {
      return (
        <g fill="none">
          {Array.from({ length: 11 }, (_, i) => {
            const yBase = 60 + i * 38;
            const amp = 14 + rand() * 26;
            const freq = 0.008 + rand() * 0.006;
            const phase = rand() * Math.PI * 2;
            const points = Array.from({ length: 81 }, (_, k) => {
              const x = k * 10;
              return `${x},${r2(yBase + Math.sin(x * freq + phase) * amp)}`;
            }).join(" ");
            return <polyline key={i} points={points} stroke={i === 5 ? stroke : faint} strokeWidth={i === 5 ? 2 : 1} />;
          })}
        </g>
      );
    }

    // orbits
    return (
      <g fill="none">
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i} cx="400" cy="250" rx={60 + i * 52} ry={(60 + i * 52) * 0.55} stroke={i === 3 ? stroke : faint} strokeWidth="1" transform={`rotate(${-12 + i * 4} 400 250)`} />
        ))}
        {Array.from({ length: 10 }, (_, i) => {
          const angle = rand() * Math.PI * 2;
          const ring = 60 + Math.floor(rand() * 7) * 52;
          return <circle key={`d${i}`} cx={r2(400 + Math.cos(angle) * ring)} cy={r2(250 + Math.sin(angle) * ring * 0.55)} r={r2(2 + rand() * 3)} fill={i % 3 === 0 ? stroke : "#17150f"} opacity="0.8" />;
        })}
      </g>
    );
  }, [hue, pattern, id]);

  return (
    <svg
      viewBox="0 0 800 500"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Generative artwork for ${project.title}`}
    >
      <rect width="800" height="500" fill={`hsl(${hue} 55% 91%)`} />
      <rect width="800" height="500" fill={`url(#glow-${id})`} />
      <defs>
        <radialGradient id={`glow-${id}`} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor={`hsl(${hue} 85% 55% / 0.25)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {art}
    </svg>
  );
}
