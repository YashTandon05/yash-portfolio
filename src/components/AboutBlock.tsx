"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, viewportOnce } from "@/lib/motion";
import { bio } from "@/content/bio";
import { education } from "@/content/experience";

/** Longer bio on the left, the facts a recruiter scans for on the right. */
export default function AboutBlock() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={fadeIn}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]"
    >
      <div className="space-y-4 text-[15px] leading-relaxed text-graphite">
        {bio.about.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>

      <aside className="h-fit rounded-[3px] border border-ink/12 bg-card p-6">
        <dl className="space-y-5 text-sm">
          {education.map((entry) => (
            <div key={entry.title}>
              <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
                Education
              </dt>
              <dd className="mt-1 text-ink">
                {entry.title}
                {entry.title2 && (
                  <span className="block">{entry.title2}</span>
                )}
                <span className="block text-graphite">{entry.org}</span>
                <span className="block font-mono text-[11px] text-graphite/70">
                  {entry.period}
                </span>
              </dd>
            </div>
          ))}

          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
              Involved in
            </dt>
            <dd className="mt-1 space-y-1.5 text-ink">
              {bio.involvements.map((entry) => (
                <div key={entry.org}>
                  {entry.org}
                  <span className="block font-mono text-[11px] text-graphite/70">
                    {entry.role}
                  </span>
                </div>
              ))}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
              Based in
            </dt>
            <dd className="mt-1 text-ink">{bio.location}</dd>
          </div>
        </dl>
      </aside>
    </motion.div>
  );
}
