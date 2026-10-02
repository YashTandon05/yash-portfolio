/**
 * Publications, newest first.
 *
 * `plain` is the part recruiters actually read: one sentence explaining the
 * paper to someone who won't open the PDF. Write it without jargon.
 */

export interface Publication {
  /** Stable unique id, used as the React key. Kebab-case, never reused. */
  id: string;
  title: string;
  /** Full author list. Your own name is bolded automatically. */
  authors: string;
  /** Conference or journal, e.g. "IEEE ITSC". */
  venue: string;
  year: string;
  /** One-sentence plain-English summary. */
  plain: string;
  /** Where it stands, if it isn't published yet. */
  status?: "Published" | "Accepted" | "Under review" | "Preprint";
  links?: { label: string; href: string }[];
}

export const publications: Publication[] = [
  {
    id: "itsc-paper-1",
    title: "When Stopping Fails: Rethinking Minimal Risk Conditions through Human-Interactive Autonomous Driving for Safe Transportation Systems",
    authors: "Yash Tandon, Giovanni Tapia Lopez, Marcus Blennemann, Mohan Trivedi, Ross Greer",
    venue: "IEEE ITSC",
    year: "2026",
    status: "Published",
    plain:
      "Looks at real-world cases where autonomous vehicles fail by defaulting to 'stop and wait,' and argues for AVs that can instead read authority, accessibility needs, language, and the social dynamics of city streets.",
    links: [
      { label: "PDF", href: "https://arxiv.org/pdf/2606.29115" },
      { label: "DOI", href: "#" },
    ],
  },
  {
    id: "itsc-paper-2",
    title: "Vision-Language Work Zone Intelligence for Safety-Critical Speed Regulation of Mixed-Autonomy Vehicles in Dynamic Environments",
    authors: "Angel Martinez-Sanchez, Kianna Ng, Wesley Maia, Laura Fleig, Maitrayee Keskar, Erika Maquiling, Yash Tandon, Parthib Roy, Mohan Trivedi, Ross Greer",
    venue: "IEEE ITSC",
    year: "2026",
    status: "Published",
    plain: "Built a real-time, embedded AI perception system that gives autonomous vehicles map-independent, law-aware awareness of temporary work-zone speed limits, combining visual detection, semantic reasoning, and temporal state modeling to achieve 96.5% recall while running on low-cost hardware.",
    links: [
      { label: "PDF", href: "https://arxiv.org/pdf/2606.08860" },
      { label: "DOI", href: "#"}
    ],
  },
];
