"use client";

import { useSkillFilter } from "./SkillFilterProvider";

/**
 * Restates the active filter at the top of the Projects section.
 *
 * Without it, a visitor arriving on a shared `?skills=…` link — or scrolling back
 * down later — sees short grids with no explanation and assumes the portfolio is
 * thin. Each chip removes itself, so the filter is adjustable from here too.
 */
export default function ProjectFilterBar() {
  const { selected, mode, active, toggle, clear, matchCount, totalCount } =
    useSkillFilter();

  if (!active) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[3px] border border-ink/12 bg-card px-4 py-3">
      <span className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
        Filtered
      </span>

      <ul className="flex flex-wrap gap-1.5">
        {selected.map((skill) => (
          <li key={skill}>
            <button
              type="button"
              onClick={() => toggle(skill)}
              aria-label={`Remove ${skill} from the filter`}
              className="flex items-center gap-1.5 rounded-[2px] border border-marker/50 bg-marker/10 px-2 py-0.5 font-mono text-[11px] text-ink transition-colors hover:border-marker"
            >
              {skill}
              <span aria-hidden="true" className="text-marker">
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>

      <span className="font-mono text-[11px] text-graphite">
        matching {mode} · {matchCount} of {totalCount}
      </span>

      <div className="ml-auto flex items-center gap-4 font-mono text-[11px] tracking-[0.1em] uppercase">
        <a href="#skills" className="text-graphite transition-colors hover:text-ink">
          Edit ↑
        </a>
        <button
          type="button"
          onClick={clear}
          className="text-marker transition-opacity hover:opacity-75"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
