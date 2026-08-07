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
    title: "TODO: Paper title",
    authors: "TODO: A. Author, Yash Tandon, C. Author",
    venue: "IEEE ITSC",
    year: "20XX",
    status: "Published",
    plain:
      "TODO: one sentence a non-specialist understands — what question the paper asks and what you found.",
    links: [
      { label: "PDF", href: "#" },
      { label: "DOI", href: "#" },
    ],
  },
  {
    id: "itsc-paper-2",
    title: "TODO: Paper title",
    authors: "TODO: A. Author, Yash Tandon",
    venue: "IEEE ITSC",
    year: "20XX",
    status: "Published",
    plain: "TODO: one-sentence plain-English summary.",
    links: [{ label: "PDF", href: "#" }],
  },
];
