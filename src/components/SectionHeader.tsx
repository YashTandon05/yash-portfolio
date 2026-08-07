"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, viewportOnce } from "@/lib/motion";

/**
 * Mono eyebrow ("02 · EXPERIENCE"), heading, hand-drawn rule, and an optional
 * one-line framing. Fade only, no translate — the page stays calm.
 */
export default function SectionHeader({
  index,
  label,
  blurb,
  id,
}: {
  /** "01", "02", … — the mono counter to the left of the label. */
  index: string;
  label: string;
  blurb?: string;
  /** Id for the <h2>, so the parent <section> can point aria-labelledby at it. */
  id?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      variants={fadeIn}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="max-w-2xl"
    >
      <p className="font-mono text-xs tracking-[0.18em] text-graphite uppercase">
        <span className="text-marker">{index}</span>
        <span className="mx-2 text-grid">·</span>
        {label}
      </p>

      <h2
        id={id}
        className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl"
      >
        {label}
      </h2>

      {/* Hand-drawn rule — the pen stroke under a whiteboard heading. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 8"
        preserveAspectRatio="none"
        className="mt-3 h-2 w-40 text-ink/25"
      >
        <path
          d="M1 5 C 60 1.5, 120 6.5, 180 3.5 S 268 1.8, 299 4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {blurb && (
        <p className="mt-5 text-[15px] leading-relaxed text-graphite">{blurb}</p>
      )}
    </motion.header>
  );
}
