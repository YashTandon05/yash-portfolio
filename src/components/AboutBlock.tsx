"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, viewportOnce } from "@/lib/motion";
import { bio } from "@/content/bio";
import { education } from "@/content/experience";
import MarkerUnderline from "./MarkerUnderline";

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
                <span className="block text-graphite">{entry.org}</span>
                <span className="block font-mono text-[11px] text-graphite/70">
                  {entry.period}
                </span>
              </dd>
            </div>
          ))}

          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
              Based in
            </dt>
            <dd className="mt-1 text-ink">{bio.location}</dd>
          </div>

          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
              Elsewhere
            </dt>
            <dd className="mt-2 flex flex-col gap-2">
              {bio.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-fit text-ink"
                >
                  <span className="font-mono text-[13px]">{link.label}</span>
                  <span className="ml-2 font-mono text-[11px] text-graphite/70">
                    {link.handle}
                  </span>
                  <MarkerUnderline />
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </aside>
    </motion.div>
  );
}
