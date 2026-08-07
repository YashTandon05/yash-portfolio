/**
 * Project content. Everything the UI renders comes from this file — swapping in
 * real copy means editing here only, no component changes.
 *
 * PLACEHOLDER STATUS: titles and categories are real (carried over from the
 * previous build); every `hook`, `description`, `metric`, and link href marked
 * TODO still needs your words. Entries with `placeholder: true` render as an
 * obviously-empty dashed slot so nothing fake ships by accident.
 */

export type Category = "ai-ml" | "robotics" | "swe";

export interface ProjectLink {
  /** Shown on the card; keep to one or two words. */
  label: string;
  href: string;
  kind: "repo" | "demo" | "paper" | "writeup";
}

export interface Project {
  slug: string;
  /** Primary category — decides which block the project is listed under. */
  category: Category;
  title: string;
  /** One-sentence hook — the only line a skimming recruiter is guaranteed to read. */
  hook: string;
  /** 2–3 sentences, used on the case-study page. */
  description: string;
  /** Mono chips. Keep to ~5 so the row doesn't wrap twice. */
  stack: string[];
  /** Extra categories this also belongs to, shown as a small tag on the card. */
  alsoIn?: Category[];
  /** Headline number, e.g. "+12.4 mAP" or "3rd / 48 teams". Optional. */
  metric?: string;
  /** Right-aligned mono timestamp on the card. */
  period?: string;
  links?: ProjectLink[];
  /** Deep-dive fields, used by /projects/[slug]. */
  problem?: string;
  approach?: string;
  result?: string;
  /** Renders an empty "slot reserved" card instead of real content. */
  placeholder?: boolean;
}

export interface CategoryMeta {
  id: Category;
  /** Short label used in headings, nav, and chips. */
  label: string;
  /** One line under the heading explaining what belongs here. */
  blurb: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "ai-ml",
    label: "AI / ML",
    blurb:
      "Machine learning and computer vision work — models, datasets, and the evaluation that says whether any of it actually helped.",
  },
  {
    id: "robotics",
    label: "Robotics",
    blurb:
      "Perception, planning, and control running on real hardware and in simulation.",
  },
  {
    id: "swe",
    label: "Software Engineering",
    blurb:
      "Full-stack products, data pipelines, and internal tooling built to be used by other people.",
  },
];

export const projects: Project[] = [
  // ── AI / ML ──────────────────────────────────────────────────────────────
  {
    slug: "work-zone-detection",
    category: "ai-ml",
    alsoIn: ["robotics"],
    title: "Work-Zone Detection",
    hook: "TODO: one sentence on what this detects and why work zones are hard.",
    description:
      "TODO: 2–3 sentences. What the model sees, what data it learned from, and how it fits into the larger system. Mention the ITSC papers here.",
    stack: ["PyTorch", "TODO: detector", "TODO: dataset", "CUDA"],
    metric: "TODO: headline number",
    period: "TODO — 20XX",
    links: [{ label: "ITSC paper", href: "#", kind: "paper" }],
    problem: "TODO: what problem this solved and why it mattered.",
    approach: "TODO: models, data, and system design used.",
    result: "TODO: measured outcome, tie-in to the ITSC papers.",
  },
  {
    slug: "occluded-pedestrian-detection",
    category: "ai-ml",
    alsoIn: ["robotics"],
    title: "Occluded Pedestrian Detection",
    hook: "TODO: one sentence on the occlusion problem you attacked.",
    description:
      "TODO: 2–3 sentences on the approach and what improved over the baseline.",
    stack: ["PyTorch", "TODO: backbone", "TODO: benchmark"],
    metric: "TODO: headline number",
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "ai-ml-slot",
    category: "ai-ml",
    title: "Slot reserved",
    hook: "Room for another AI/ML project — a model you trained, a paper you reproduced, an eval harness you built.",
    description: "",
    stack: [],
    placeholder: true,
  },

  // ── Robotics ─────────────────────────────────────────────────────────────
  {
    slug: "robocup",
    category: "robotics",
    title: "RoboCup",
    hook: "TODO: one sentence on your role and what the robots had to do.",
    description:
      "TODO: 2–3 sentences on the stack you owned and how the team placed.",
    stack: ["C++", "ROS", "TODO: sim", "TODO: hardware"],
    metric: "TODO: placement or key result",
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "robotics-slot",
    category: "robotics",
    title: "Slot reserved",
    hook: "Room for another robotics project — motion planning, state estimation, controls, or a hardware build.",
    description: "",
    stack: [],
    placeholder: true,
  },

  // ── Software Engineering ─────────────────────────────────────────────────
  {
    slug: "astera-quant",
    category: "swe",
    title: "Astera — Quantitative Research Tooling",
    hook: "TODO: one sentence on what you built and who used it.",
    description:
      "TODO: 2–3 sentences on the system, its scale, and what it made possible.",
    stack: ["Python", "TODO: data store", "TODO: infra"],
    metric: "TODO: headline number",
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "sim-civics",
    category: "swe",
    title: "Sim Civics",
    hook: "TODO: one sentence on the product and the users.",
    description: "TODO: 2–3 sentences on architecture and outcome.",
    stack: ["TypeScript", "Next.js", "TODO: database"],
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "lexi-learn",
    category: "swe",
    alsoIn: ["ai-ml"],
    title: "Lexi Learn",
    hook: "TODO: one sentence on what it teaches and how the ML fits in.",
    description: "TODO: 2–3 sentences on the stack and what shipped.",
    stack: ["TypeScript", "TODO: model", "TODO: infra"],
    period: "TODO — 20XX",
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
];

export function projectsByCategory(category: Category): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && !p.placeholder);
}

export function categoryMeta(category: Category): CategoryMeta {
  // CATEGORIES covers every Category value, so this is total.
  return CATEGORIES.find((c) => c.id === category)!;
}
