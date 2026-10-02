"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ProjectGrid from "./ProjectGrid";
import { useSkillFilter } from "./SkillFilterProvider";
import type { CategoryMeta, Project } from "@/content/projects";

/** Three fills exactly one grid row at `lg`, so a collapsed block reads as a unit. */
const COLLAPSED_COUNT = 3;

/**
 * One discipline's block: heading, the three newest projects, and an expander for
 * the rest.
 *
 * The expander disappears while a skill filter is active — capping a filtered list
 * would hide matches the visitor explicitly asked for, which is the one thing a
 * filter must never do.
 */
export default function ProjectCategoryBlock({
  category,
  projects,
}: {
  category: CategoryMeta;
  /** Every project in this category, already sorted newest-first. */
  projects: Project[];
}) {
  const reduce = useReducedMotion();
  const { active, filter } = useSkillFilter();
  const [expanded, setExpanded] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const visible = filter(projects);
  const collapsible = !active && visible.length > COLLAPSED_COUNT;
  const shown =
    collapsible && !expanded ? visible.slice(0, COLLAPSED_COUNT) : visible;
  const hidden = visible.length - shown.length;

  const gridId = `${category.id}-grid`;

  // Collapsing removes rows *above* the button, so the page yanks upward and the
  // visitor loses their place. Pull the heading back into view when that happens.
  const collapse = () => {
    setExpanded(false);
    requestAnimationFrame(() => {
      const el = blockRef.current;
      if (el && el.getBoundingClientRect().top < 0) {
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  };

  return (
    <div
      id={category.id}
      ref={blockRef}
      className="mt-16 scroll-mt-24 first:mt-12"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/10 pb-3">
        <h3 className="flex items-baseline gap-3 font-display text-xl font-medium tracking-[-0.02em] text-ink">
          {category.label}
          <span className="font-mono text-[11px] font-normal tracking-[0.1em] text-graphite/70">
            {active
              ? `${visible.length} / ${projects.length}`
              : String(projects.length)}
          </span>
        </h3>
        <p className="max-w-lg text-sm text-graphite">{category.blurb}</p>
      </div>

      {shown.length > 0 ? (
        <ProjectGrid id={gridId} projects={shown} />
      ) : (
        <p className="mt-12 rounded-[3px] border border-dashed border-ink/15 px-6 py-8 text-center font-mono text-[12px] text-graphite">
          No {category.label} project matches that combination.
        </p>
      )}

      {collapsible && (
        <button
          type="button"
          onClick={expanded ? collapse : () => setExpanded(true)}
          aria-expanded={expanded}
          aria-controls={gridId}
          className="group mt-5 flex w-full items-center justify-center gap-3 rounded-[3px] border border-dashed border-ink/20 px-4 py-3.5 font-mono text-[12px] tracking-[0.12em] text-graphite uppercase transition-colors hover:border-marker hover:text-ink focus-visible:border-marker"
        >
          <span>
            {expanded
              ? `Show fewer ${category.label} projects`
              : `Show ${hidden} more ${category.label} project${hidden === 1 ? "" : "s"}`}
          </span>
          <span
            aria-hidden="true"
            className={`text-marker transition-transform duration-200 ${
              expanded ? "rotate-180" : "group-hover:translate-y-0.5"
            }`}
          >
            ↓
          </span>
        </button>
      )}
    </div>
  );
}
