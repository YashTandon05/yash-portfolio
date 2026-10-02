/**
 * Experience and education, newest first. Both render as the same timeline
 * component, so the shape is shared.
 */

export interface Role {
  /** Job title, or degree for education entries. */
  title: string;
  /** Optional second degree/title, e.g. for a double major. */
  title2?: string;
  org: string;
  /** Optional second org, e.g. a sister lab on another campus. Rendered beneath org. */
  org2?: string;
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
    title: "Undergraduate Researcher",
    org: "Laboratory for Intelligent and Safe Automobiles (CVRRxLISA)",
    org2: "Machine Intelligence, Interaction, and Imagination Lab (Mi3)",
    period: "July 2025 — Present",
    location: "San Diego, CA",
    bullets: [
      "TODO: what you built or researched, and the measurable result.",
      "TODO: a second bullet — scope, scale, or who used it.",
      "TODO: a third bullet only if it says something new.",
    ],
    stack: ["Python", "PyTorch", "TODO"],
  },
  {
    title: "Quantitative Researcher Intern",
    org: "Astera Holdings",
    period: "June 2025 — Sep 2025",
    location: "Remote, US",
    bullets: [
      "TODO: what you built or researched, and the measurable result.",
      "TODO: a second bullet — scope, scale, or who used it.",
      "TODO: a third bullet only if it says something new.",
    ],
    stack: ["TODO", "TODO"],
  },
  {
    title: "Data Scientist Intern",
    org: "Data Science Alliance",
    period: "June 2025 — Aug 2025",
    location: "San Diego, CA",
    bullets: [
      "TODO: what you built or researched, and the measurable result.",
      "TODO: a second bullet — scope, scale, or who used it.",
      "TODO: a third bullet only if it says something new.",
    ],
    stack: ["TODO", "TODO"],
  },
  {
    title: "Machine Learning Researcher",
    org: "Data Science Alliance",
    period: "July 2024 — May 2025",
    location: "San Diego, CA",
    bullets: [
      "TODO: what you built or researched, and the measurable result.",
      "TODO: a second bullet — scope, scale, or who used it.",
      "TODO: a third bullet only if it says something new.",
    ],
    stack: ["TODO", "TODO"],
  },
];

export const education: Role[] = [
  {
    title: "B.S. in Data Science",
    title2:
      "B.S. in Cognitive Science w/ Specialization in Machine Learning and Neural Computation",
    org: "University of California, San Diego",
    period: "2023-present (Expected Graduation: June 2027)",
    location: "San Diego, CA",
    bullets: [
      "GPA: 4.0/4.0",
      "Institute of Electrical Engineers, RoboCup AI Subteam Lead",
      "Triton AI Racing, JeepBot Team Engineer",
      "Recipient of Halıcıoğlu Data Science Institute Undergraduate Research Scholarship",
      "9x Provost Honours recipient",
    ],
  },
];
