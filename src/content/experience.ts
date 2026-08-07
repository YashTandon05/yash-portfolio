/**
 * Experience and education, newest first. Both render as the same timeline
 * component, so the shape is shared.
 */

export interface Role {
  /** Job title, or degree for education entries. */
  title: string;
  org: string;
  /** e.g. "Jun 2025 — Aug 2025" or "2023 — Present". */
  period: string;
  location?: string;
  /** 2–4 bullets. Lead with the outcome, not the task. */
  bullets: string[];
  /** Optional mono chips for the stack used in the role. */
  stack?: string[];
  href?: string;
}

export const experience: Role[] = [
  {
    title: "TODO: Role title",
    org: "TODO: Lab / group name",
    period: "TODO — Present",
    location: "TODO: City, State",
    bullets: [
      "TODO: what you built or researched, and the measurable result.",
      "TODO: a second bullet — scope, scale, or who used it.",
      "TODO: a third bullet only if it says something new.",
    ],
    stack: ["Python", "PyTorch", "TODO"],
  },
  {
    title: "TODO: Role title",
    org: "TODO: Company",
    period: "TODO — TODO",
    location: "TODO: City, State",
    bullets: [
      "TODO: what you shipped and its impact.",
      "TODO: a second bullet.",
    ],
    stack: ["TODO", "TODO"],
  },
  {
    title: "TODO: Role title",
    org: "TODO: Organization",
    period: "TODO — TODO",
    bullets: ["TODO: what you did and what came of it."],
  },
];

export const education: Role[] = [
  {
    title: "TODO: B.S. in <major>",
    org: "TODO: University",
    period: "TODO — 20XX",
    location: "TODO: City, State",
    bullets: [
      "TODO: GPA if it helps you, honors, or relevant coursework.",
      "TODO: teaching assistantships, clubs, or competition teams.",
    ],
  },
];
