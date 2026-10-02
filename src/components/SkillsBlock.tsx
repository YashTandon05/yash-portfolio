"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, viewportOnce } from "@/lib/motion";
import { projects } from "@/content/projects";
import { filterProjects, skillFacets } from "@/content/skills";
import { useSkillFilter } from "./SkillFilterProvider";

const REAL_PROJECTS = projects.filter((p) => !p.placeholder);

/**
 * The flat, selectable skill cloud. Sits immediately above Projects on purpose:
 * the thing it filters is the next thing you scroll to, so the interaction needs
 * no explanation and no jumping around the page.
 *
 * Chips are ordered most-used first, which doubles as a ranking — the strongest
 * skills land top-left where the eye starts.
 */
export default function SkillsBlock() {
  const reduce = useReducedMotion();
  const { selected, mode, active, isSelected, toggle, clear, setMode, matchCount, totalCount } =
    useSkillFilter();

  /**
   * Faceted search: in "all" mode, adding some chips to the current selection
   * would produce nothing. Dimming those up front is the difference between a
   * filter that guides and one that dead-ends. "Any" mode can't dead-end, so
   * nothing is dimmed there.
   */
  const deadEnds = useMemo(() => {
    if (!active || mode === "any") return new Set<string>();

    const dead = new Set<string>();
    for (const facet of skillFacets) {
      if (facet.unbacked || selected.includes(facet.name)) continue;
      const wouldMatch = filterProjects(
        REAL_PROJECTS,
        [...selected, facet.name],
        "all",
      );
      if (wouldMatch.length === 0) dead.add(facet.name);
    }
    return dead;
  }, [active, mode, selected]);

  return (
    <motion.div
      variants={fadeIn}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-10"
    >
      <div className="flex items-center justify-end">
        <div
          role="group"
          aria-label="How multiple selected skills combine"
          className="flex shrink-0 items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.18em] text-graphite/70 uppercase">
            Match
          </span>
          <div className="flex overflow-hidden rounded-[3px] border border-ink/15">
            {(["all", "any"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={mode === option}
                className={`px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${
                  mode === option
                    ? "bg-marker/12 text-ink"
                    : "text-graphite hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {skillFacets.map((facet) => {
          const on = isSelected(facet.name);
          const disabled = facet.unbacked || deadEnds.has(facet.name);

          return (
            <li key={facet.name}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggle(facet.name)}
                aria-pressed={facet.unbacked ? undefined : on}
                title={
                  facet.unbacked
                    ? "No project lists this yet"
                    : deadEnds.has(facet.name)
                      ? "No project has this plus everything already selected"
                      : undefined
                }
                className={`group flex items-center gap-2 rounded-[3px] border px-2.5 py-1.5 font-mono text-[12px] transition-colors ${
                  on
                    ? "border-marker bg-marker/10 text-ink"
                    : facet.unbacked
                      ? "cursor-default border-dashed border-ink/12 text-graphite/45"
                      : disabled
                        ? "cursor-default border-ink/8 text-graphite/35"
                        : "border-ink/12 bg-card text-graphite hover:border-ink/30 hover:text-ink"
                }`}
              >
                <span>{facet.name}</span>
                <span
                  aria-hidden="true"
                  className={`text-[10px] ${on ? "text-marker" : "text-graphite/50"}`}
                >
                  {facet.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p
        aria-live="polite"
        className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/8 pt-4 font-mono text-[12px] text-graphite"
      >
        {active ? (
          <>
            <span className="text-ink">
              {matchCount} of {totalCount} projects
            </span>
            <span className="text-grid">·</span>
            <span>
              {selected.length} skill{selected.length === 1 ? "" : "s"}, matching{" "}
              {mode}
            </span>
            <button
              type="button"
              onClick={clear}
              className="group relative tracking-[0.1em] text-graphite uppercase transition-colors hover:text-ink"
            >
              Clear
            </button>
            <a
              href="#projects"
              className="tracking-[0.1em] text-marker uppercase"
            >
              See matches ↓
            </a>
          </>
        ) : (
          <span>Nothing selected, all {totalCount} projects showing below.</span>
        )}
      </p>
    </motion.div>
  );
}
