"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

/**
 * Latent-probe cursor.
 * - a precise reticle that reads out its normalized position in the
 *   viewport, like probing a coordinate in embedding space
 * - morphs into a labeled pill over [data-cursor] / links / buttons
 * - inherits the live accent hue
 * - disabled on touch + reduced-motion
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coord, setCoord] = useState({ x: "0.00", y: "0.00" });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.55 });
  const labelX = useTransform(ringX, (v) => v + 22);
  const labelY = useTransform(ringY, (v) => v + 22);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.dataset.customCursor = "true";

    let rafPending = false;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = -((e.clientY / window.innerHeight) * 2 - 1);
          setCoord({
            x: (nx >= 0 ? "+" : "") + nx.toFixed(2),
            y: (ny >= 0 ? "+" : "") + ny.toFixed(2),
          });
        });
      }

      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']"
      );
      if (el) {
        setHovering(true);
        setLabel(el.dataset.cursor ?? null);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      delete document.body.dataset.customCursor;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  const ringSize = label ? 74 : hovering ? 52 : 30;

  return (
    <div aria-hidden className="fixed inset-0 z-[110] pointer-events-none">
      {/* reticle / pill */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale: pressed ? 0.85 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? "var(--color-accent)" : "rgba(244,244,241,0)",
          borderColor: label ? "rgba(244,244,241,0)" : "var(--color-accent)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        initial={false}
      >
        {/* crosshair ticks when idle */}
        {!label && (
          <>
            <span className="absolute w-full h-px bg-accent/30" />
            <span className="absolute h-full w-px bg-accent/30" />
          </>
        )}
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-black whitespace-nowrap px-2"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* coordinate readout trailing the probe */}
      <motion.div
        className="absolute coord text-[10px] text-accent/70 whitespace-nowrap"
        style={{ x: labelX, y: labelY }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        [{coord.x}, {coord.y}]
      </motion.div>
    </div>
  );
}
