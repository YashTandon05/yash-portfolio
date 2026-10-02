/**
 * Skills — one flat, selectable list instead of the old Languages / ML & Perception
 * / Robotics / Systems & Tools grouping.
 *
 * The grouping was decorative: it told a recruiter nothing the names didn't already
 * say, and it left the section a dead end at the bottom of the page. Flat and
 * selectable turns it into the control surface for the Projects section directly
 * below it — click PyTorch, see the PyTorch work.
 *
 * The list is *derived from what the projects actually use* (`Project.stack`), so a
 * chip can never point at zero projects by accident and there is exactly one place
 * to edit when a project's stack changes. `extraSkills` is the escape hatch for
 * things you'd defend in an interview but haven't shipped a project with yet; they
 * render greyed out and can't be selected, which is the honest presentation.
 */

import { projects, type Project } from "./projects";

/**
 * Skills with no project behind them yet. Keep this short — a wall of unselectable
 * chips reads as padding. The moment a project's `stack` names one, it graduates
 * to a real chip automatically and the entry here becomes redundant.
 */
export const extraSkills: string[] = ["Git", "TODO: cloud", "TODO: database"];

/**
 * Lowercased stack-chip spelling → canonical skill name, for when a card wants to
 * say one thing and the skill list another. Without an entry here, "torch" and
 * "PyTorch" would be two chips for one skill.
 */
export const SKILL_ALIASES: Record<string, string> = {
  torch: "PyTorch",
  pytorch: "PyTorch",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  cpp: "C++",
  "c++": "C++",
  nextjs: "Next.js",
  "next.js": "Next.js",
  ros2: "ROS",
  ros: "ROS",
  opencv: "OpenCV",
};

/** How multiple selected skills combine. */
export type MatchMode = "all" | "any";

export interface SkillFacet {
  name: string;
  /** Real projects using it. Zero only for `extraSkills` entries. */
  count: number;
  /** `extraSkills` entries — shown for breadth, but nothing to filter to. */
  unbacked: boolean;
}

/**
 * `null` for anything that isn't a real skill yet — placeholder stack entries read
 * "TODO: detector", and a chip labelled TODO is worse than no chip at all.
 */
function canonical(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || /^todo\b/i.test(trimmed)) return null;
  return SKILL_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

/** The canonical skills one project claims, deduped. */
export function projectSkills(project: Project): string[] {
  const seen = new Set<string>();
  for (const entry of project.stack) {
    const name = canonical(entry);
    if (name) seen.add(name);
  }
  return [...seen];
}

/**
 * Every chip in the Skills section, most-used first then alphabetical.
 *
 * Frequency-first is the point: the skills backing the most work land at the top
 * left, where a recruiter's eye starts. Computed once at module load — the content
 * is static, so re-deriving it per render would be pure waste.
 */
export const skillFacets: SkillFacet[] = (() => {
  const counts = new Map<string, number>();

  for (const project of projects) {
    if (project.placeholder) continue;
    for (const name of projectSkills(project)) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  const backed: SkillFacet[] = [...counts].map(([name, count]) => ({
    name,
    count,
    unbacked: false,
  }));

  const unbacked: SkillFacet[] = extraSkills
    .map(canonical)
    .filter((name): name is string => name !== null && !counts.has(name))
    .map((name) => ({ name, count: 0, unbacked: true }));

  backed.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  unbacked.sort((a, b) => a.name.localeCompare(b.name));

  return [...backed, ...unbacked];
})();

/** Chip names that can actually be selected — used to validate restored URLs. */
export const selectableSkills: ReadonlySet<string> = new Set(
  skillFacets.filter((f) => !f.unbacked).map((f) => f.name),
);

export function matchesSkills(
  project: Project,
  selected: readonly string[],
  mode: MatchMode,
): boolean {
  if (selected.length === 0) return true;
  if (project.placeholder) return false;

  const owned = new Set(projectSkills(project));
  return mode === "all"
    ? selected.every((skill) => owned.has(skill))
    : selected.some((skill) => owned.has(skill));
}

/**
 * Filter a list against a selection. Returns the input untouched when nothing is
 * selected, so callers can use it unconditionally and placeholders keep showing
 * in the unfiltered view.
 */
export function filterProjects(
  list: readonly Project[],
  selected: readonly string[],
  mode: MatchMode,
): Project[] {
  if (selected.length === 0) return [...list];
  return list.filter((p) => matchesSkills(p, selected, mode));
}
