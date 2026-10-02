"use client";

import { useEffect, useState } from "react";
import { useSkillFilter } from "./SkillFilterProvider";

/**
 * Floating filter status, bottom-left.
 *
 * Only appears when a filter is active *and* the Skills section is off-screen —
 * i.e. exactly when the visitor can see filtered results but not the control that
 * filtered them. While the chips are in view it would be noise, so it hides.
 *
 * Bottom-*left* keeps it clear of the chat launcher in the opposite corner; the
 * two never negotiate for space, on any viewport.
 */
export default function FilterPill() {
  const { active, selected, matchCount, clear } = useSkillFilter();
  const [skillsInView, setSkillsInView] = useState(true);

  useEffect(() => {
    const target = document.getElementById("skills");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSkillsInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!active || skillsInView) return null;

  return (
    <div className="fixed bottom-6 left-6 z-30 flex items-center gap-3 rounded-[3px] border border-ink/20 bg-card px-3 py-2 font-mono text-[11px] shadow-[3px_3px_0_0_rgba(0,0,0,0.06)]">
      <a href="#skills" className="text-ink transition-colors hover:text-marker">
        <span className="text-marker">▸ </span>
        {matchCount} project{matchCount === 1 ? "" : "s"}
        {/* At 375px the full label runs into the chat launcher opposite. The
            count and the way back to the chips are what matter on a phone —
            the skill tally and Clear both still live in the filter bar. */}
        <span className="hidden sm:inline">
          {" "}
          · {selected.length} skill{selected.length === 1 ? "" : "s"}
        </span>
      </a>
      <span aria-hidden="true" className="hidden text-ink/15 sm:inline">
        |
      </span>
      <button
        type="button"
        onClick={clear}
        className="hidden tracking-[0.1em] text-graphite uppercase transition-colors hover:text-ink sm:inline"
      >
        Clear
      </button>
    </div>
  );
}
