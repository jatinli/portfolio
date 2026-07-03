"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { navLinks, site } from "@/lib/data";
import Magnetic from "./ui/Magnetic";

/**
 * Floating glass navigation.
 * - hides when scrolling down, reappears scrolling up
 * - tracks the active section (desktop pill)
 * - on mobile, a hamburger opens a full-screen menu
 */
export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 160 && !open);
  });

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // close the mobile menu on resize up to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-5 inset-x-0 z-[90] flex justify-center px-4"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className="glass rounded-full pl-5 pr-2 py-2 flex items-center gap-1 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          aria-label="Primary"
        >
          <a
            href="#top"
            className="font-display font-semibold tracking-tight text-sm text-fg mr-3"
            aria-label="Back to top"
            onClick={() => setOpen(false)}
          >
            JL<span className="text-accent">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[13px] tracking-wide rounded-full transition-colors duration-300 ${
                    active === link.href ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-fg/[0.07]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <Magnetic strength={0.25}>
            <a
              href={`mailto:${site.email}`}
              className="ml-2 hidden sm:inline-flex items-center gap-2 rounded-full bg-fg text-bg text-[13px] font-medium px-4 py-2 hover:bg-accent hover:text-white transition-colors duration-300"
              data-cursor="Say hi"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft transition-colors duration-700" />
              Available
            </a>
          </Magnetic>

          {/* mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden ml-1 flex h-9 w-9 items-center justify-center rounded-full hover:bg-fg/[0.07] transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <motion.span
                className="absolute left-0 top-0 h-px w-full bg-fg"
                animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 h-px w-full bg-fg"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 bottom-0 h-px w-full bg-fg"
                animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      {/* full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] md:hidden glass flex flex-col justify-between px-8 pt-28 pb-12"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-baseline gap-4 border-b border-line py-5"
                >
                  <span className="coord text-xs text-faint">0{i + 1}</span>
                  <span className="font-display text-4xl font-medium tracking-[-0.02em] text-fg group-hover:text-accent transition-colors">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4"
            >
              <a
                href={`mailto:${site.email}`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-between rounded-full bg-fg text-bg px-6 py-4 font-medium"
              >
                {site.email}
                <span>↗</span>
              </a>
              <div className="flex gap-6 mono-label">
                <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
