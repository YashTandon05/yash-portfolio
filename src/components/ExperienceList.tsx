"use client";

import { motion, useReducedMotion } from "framer-motion";
import { riseIn, stagger, viewportOnce } from "@/lib/motion";
import type { Role } from "@/content/experience";

/**
 * Reverse-chronological timeline. The rule down the left is the same ink line
 * used elsewhere; each role gets a marker tick on it.
 */
export default function ExperienceList({ roles }: { roles: Role[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-10 border-l border-ink/12"
    >
      {roles.map((role) => (
        <motion.li
          key={`${role.org}-${role.title}`}
          variants={riseIn}
          className="relative pb-10 pl-6 last:pb-0 md:pl-8"
        >
          <span
            aria-hidden="true"
            className="absolute top-2 -left-[3px] h-1.5 w-1.5 rounded-full bg-marker"
          />

          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">
              {role.title}
              <span className="text-graphite"> · </span>
              {role.href ? (
                <a
                  href={role.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-graphite underline decoration-ink/20 underline-offset-4 transition-colors hover:text-marker"
                >
                  {role.org}
                </a>
              ) : (
                <span className="text-graphite">{role.org}</span>
              )}
            </h3>
            <p className="font-mono text-[11px] tracking-wide text-graphite/80">
              {role.period}
              {role.location && (
                <>
                  <span className="mx-2 text-grid">·</span>
                  {role.location}
                </>
              )}
            </p>
          </div>

          <ul className="mt-3 space-y-2">
            {role.bullets.map((bullet) => (
              <li
                key={bullet}
                className="relative pl-4 text-[15px] leading-relaxed text-graphite"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[0.6em] left-0 h-1 w-1 rounded-full bg-ink/30"
                />
                {bullet}
              </li>
            ))}
          </ul>

          {role.stack && role.stack.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {/* Index key: a role's stack is static and never reordered, and
                  the same tech name can legitimately appear twice. */}
              {role.stack.map((tech, i) => (
                <li
                  key={i}
                  className="rounded-[2px] border border-ink/12 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-graphite uppercase"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}
