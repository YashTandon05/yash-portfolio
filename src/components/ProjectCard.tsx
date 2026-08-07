"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { riseIn } from "@/lib/motion";
import { categoryMeta, type Project } from "@/content/projects";

const LINK_GLYPH: Record<string, string> = {
  repo: "code",
  demo: "demo",
  paper: "paper",
  writeup: "writeup",
};

/**
 * One project. Hover/focus draws a marker stroke down the left edge, echoing the
 * hand-drawn line motif, and the whole card is the link to its case study.
 */
export default function ProjectCard({ project }: { project: Project }) {
  if (project.placeholder) {
    return (
      <motion.div
        variants={riseIn}
        className="flex min-h-[220px] flex-col justify-center rounded-[3px] border border-dashed border-ink/20 p-6"
      >
        <p className="font-mono text-[11px] tracking-[0.18em] text-graphite/70 uppercase">
          Slot reserved
        </p>
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          {project.hook}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.article variants={riseIn} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col rounded-[3px] border border-ink/12 bg-card p-6 transition-colors duration-200 hover:border-ink/25 focus-visible:border-ink/25"
      >
        {/* Marker stroke, drawn top-to-bottom along the left edge on hover. */}
        <span
          aria-hidden="true"
          className="absolute top-0 -left-px h-full w-[2px] origin-top scale-y-0 bg-marker transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />

        <header className="flex items-baseline justify-between gap-4">
          {/* h4: the category heading above this grid is the h3. */}
          <h4 className="relative font-display text-lg leading-snug font-medium tracking-[-0.02em] text-ink">
            {project.title}
          </h4>
          {project.period && (
            <span className="shrink-0 font-mono text-[11px] text-graphite/70">
              {project.period}
            </span>
          )}
        </header>

        <p className="mt-3 text-sm leading-relaxed text-graphite">
          {project.hook}
        </p>

        {project.metric && (
          <p className="mt-4 font-mono text-[13px] text-ink">
            <span className="text-marker">▸ </span>
            {project.metric}
          </p>
        )}

        {project.alsoIn && project.alsoIn.length > 0 && (
          <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-graphite/70 uppercase">
            Also {project.alsoIn.map((c) => categoryMeta(c).label).join(" · ")}
          </p>
        )}

        <div className="mt-auto pt-6">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-[2px] border border-ink/12 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-graphite uppercase"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3">
            <span className="font-mono text-[11px] tracking-[0.12em] text-graphite uppercase transition-colors group-hover:text-marker">
              Read case study →
            </span>
            {project.links && project.links.length > 0 && (
              <span className="flex gap-2 font-mono text-[10px] tracking-wide text-graphite/70 uppercase">
                {project.links.map((l) => (
                  <span key={l.label}>{LINK_GLYPH[l.kind] ?? l.kind}</span>
                ))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
