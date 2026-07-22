// Project data model. UI reads from here, so dropping in real content later
// means editing this file only — no component changes.
//
// NOTE: titles + tags come from the spec's suggested lead order (structural).
// Every stat/summary/problem/approach/result below is PLACEHOLDER copy to be
// replaced during the content pass.

export type Tag = "AI-ML" | "Robotics" | "SWE";

export const ALL_TAGS: Tag[] = ["AI-ML", "Robotics", "SWE"];

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  /** one-line result stat shown on the card */
  stat: string;
  /** short blurb for the card + detail intro */
  summary: string;
  tags: Tag[];
  /** mock detection confidence for the hover effect (0–1) */
  confidence: number;
  problem: string;
  approach: string;
  result: string;
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    slug: "work-zone-detection",
    title: "Work-Zone Detection (AV Lab)",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the work-zone perception project.",
    tags: ["AI-ML", "Robotics"],
    confidence: 0.98,
    problem: "TODO: what problem this solved and why it mattered.",
    approach: "TODO: models, data, and system design used.",
    result: "TODO: measured outcome, tie-in to the ITSC papers.",
    links: [{ label: "Paper (ITSC)", href: "#" }],
  },
  {
    slug: "robocup",
    title: "RoboCup",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the RoboCup robotics work.",
    tags: ["Robotics"],
    confidence: 0.95,
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "occluded-pedestrian-detection",
    title: "Occluded Pedestrian Detection",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the occluded pedestrian detection work.",
    tags: ["AI-ML", "Robotics"],
    confidence: 0.93,
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "astera-quant",
    title: "Astera — Quant Work",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the Astera quantitative work.",
    tags: ["SWE"],
    confidence: 0.91,
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "sim-civics",
    title: "Sim Civics",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the Sim Civics project.",
    tags: ["SWE"],
    confidence: 0.9,
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
  {
    slug: "lexi-learn",
    title: "Lexi Learn",
    stat: "TODO: headline result stat",
    summary: "Placeholder summary of the Lexi Learn project.",
    tags: ["SWE", "AI-ML"],
    confidence: 0.9,
    problem: "TODO: problem statement.",
    approach: "TODO: approach.",
    result: "TODO: result.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
