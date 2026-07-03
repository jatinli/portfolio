"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/lib/data";

/**
 * Cinematic entry: counter + name mask reveal, then the curtain lifts.
 * Shown once per session; skipped entirely for reduced-motion users.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced || sessionStorage.getItem("jl-visited")) {
      setPhase("done");
      return;
    }
    setPhase("loading");
    document.documentElement.style.overflow = "hidden";

    let value = 0;
    const tick = () => {
      // ease toward 100 with decreasing step sizes
      value = Math.min(100, value + Math.max(1, Math.round((100 - value) * 0.12)));
      setCount(value);
      if (value < 100) {
        timer = window.setTimeout(tick, 34);
      } else {
        window.setTimeout(() => {
          setPhase("done");
          sessionStorage.setItem("jl-visited", "1");
          document.documentElement.style.overflow = "";
        }, 450);
      }
    };
    let timer = window.setTimeout(tick, 200);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          className="fixed inset-0 z-[120] bg-bg flex items-end justify-between p-8 md:p-14"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="font-display text-2xl md:text-4xl tracking-tight text-fg"
            >
              {site.name}
              <span className="text-accent">.</span>
            </motion.p>
          </div>
          <p className="font-mono text-5xl md:text-7xl text-faint tabular-nums leading-none">
            {count}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
