"use client";

import { motion, useReducedMotion } from "framer-motion";
import { riseIn, stagger, viewportOnce } from "@/lib/motion";
import { publications } from "@/content/publications";
import { bio } from "@/content/bio";
import MarkerUnderline from "./MarkerUnderline";

/** Bolds the author's own name inside the author list. */
function Authors({ authors }: { authors: string }) {
  const parts = authors.split(bio.name);
  if (parts.length === 1) return <>{authors}</>;

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-medium text-ink">{bio.name}</span>
          )}
        </span>
      ))}
    </>
  );
}

export default function PublicationList() {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-10 space-y-5"
    >
      {publications.map((pub, i) => (
        <motion.li
          key={pub.id}
          variants={riseIn}
          className="rounded-[3px] border border-ink/12 bg-card p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="font-mono text-[11px] tracking-[0.14em] text-graphite uppercase">
              <span className="text-marker">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span className="mx-2 text-grid">·</span>
              {pub.venue} {pub.year}
            </p>
            {pub.status && (
              <span className="rounded-[2px] border border-ink/12 px-2 py-0.5 font-mono text-[10px] tracking-wide text-graphite uppercase">
                {pub.status}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-display text-lg leading-snug font-medium tracking-[-0.02em] text-ink">
            {pub.title}
          </h3>

          <p className="mt-2 text-sm text-graphite">
            <Authors authors={pub.authors} />
          </p>

          <p className="mt-4 text-[15px] leading-relaxed text-ink/85">
            {pub.plain}
          </p>

          {pub.links && pub.links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-5">
              {pub.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative font-mono text-[12px] tracking-[0.1em] text-ink uppercase"
                  >
                    {link.label} ↗
                    <MarkerUnderline />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}
