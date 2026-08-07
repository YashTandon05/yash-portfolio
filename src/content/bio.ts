/**
 * Identity, hero copy, and links. TODO markers are content you still owe — the
 * layout is final, the words are not.
 */

export interface Link {
  label: string;
  href: string;
  handle: string;
}

export interface Bio {
  name: string;
  initials: string;
  /** Role line under the name — what you are, in five words or fewer. */
  role: string;
  /** Hero headline. One sentence, plain language, no metaphors. */
  headline: string;
  /** 2–3 sentences directly under the headline. The elevator pitch. */
  intro: string;
  /** Longer bio for the About section, one string per paragraph. */
  about: string[];
  /** Mono status line in the hero — what you're looking for right now. */
  status: string;
  location: string;
  email: string;
  resume: string;
  /**
   * Path to your headshot in /public, e.g. "/images/headshot.jpg".
   * Leave null and the hero renders a labelled placeholder instead of a 404.
   */
  photo: string | null;
  links: Link[];
}

export const bio: Bio = {
  name: "Yash Tandon",
  initials: "YT",
  role: "TODO: e.g. CS + Robotics @ <University>",
  headline: "TODO: one sentence on what you build and what you're good at.",
  intro:
    "TODO: 2–3 sentences. What you work on now (research group, company), the kinds of problems you like, and what you're looking for next. Write it the way you'd say it out loud.",
  about: [
    "TODO: paragraph one — your background, where you study or work, and the through-line across your projects.",
    "TODO: paragraph two — what you want to do next, and one genuinely human sentence so this doesn't read like a resume.",
  ],
  status: "TODO: Open to Summer 20XX internships — AI/ML, Robotics, SWE",
  location: "TODO: City, State",
  email: "yashtandon2005@gmail.com",
  resume: "/resume.pdf",
  photo: null,
  links: [
    { label: "GitHub", href: "https://github.com/TODO", handle: "@TODO" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/TODO",
      handle: "/in/TODO",
    },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=TODO",
      handle: "TODO",
    },
  ],
};

/** Used for <title>, OG tags, and the generated OG image. */
export const siteMeta = {
  title: `${bio.name} — AI/ML, Robotics, Software`,
  description:
    "Portfolio of Yash Tandon — machine learning and perception research, robotics, and software engineering projects.",
  // TODO: swap for the real domain before deploying; OG images need an absolute URL.
  url: "https://yashtandon.dev",
} as const;
