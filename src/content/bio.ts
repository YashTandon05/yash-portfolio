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
  /** Current campus involvements — org + role, shown as a compact list in the About sidebar. */
  involvements: { org: string; role: string }[];
  /** Mono status line in the hero — what you're looking for right now. */
  status: string;
  location: string;
  email: string;
  secondaryEmail: string;
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
  role: "Data Science & Cognitive Science (ML) @ UC San Diego",
  headline: "",
  intro:
    "",
  about: [
    "It started with FIRST Robotics in high school: a rookie team that flew from the UK to NYC with a robot that was falling apart by the time we got there. We rebuilt it until 4am the night before, borrowed spare parts from competitors to fix an arm that turned out too weak, and ended up winning matches not by playing the game well but by figuring out what our robot could actually do and strategizing around it instead. We won Rookie All-Star and nearly qualified for finals. What stuck with me wasn't the result, it was realizing that good engineering is less about building something that does everything, and more about understanding exactly what your system is good at. That's the question I keep coming back to: at LISA, it's how autonomous vehicles perceive and plan safely in the real world; at Z-Lab, it's making VLA models fast enough to react in time; at TritonAI, it's an autonomous cart actually driving around campus.",
    "I'm looking for teams building AI systems that have to work in the physical world. To me, \"it works\" means it's safe, fast, and interpretable, not just accurate.",
  ],
  involvements: [
    { org: "Laboratory for Intelligent and Safe Automobiles (CVRRxLISA)", role: "Undergraduate Researcher" },
    { org: "Z-Lab", role: "Undergraduate Researcher" },
    { org: "IEEE: RoboCup Competition", role: "AI Subteam Lead" },
    { org: "TritonAI Racing", role: "Robotics Engineer, JeepBot Project" },
  ],
  status: "Open to opportunities in AI/ML, Robotics, and SWE",
  location: "San Diego, CA, USA",
  email: "ytandon@ucsd.edu",
  secondaryEmail: "yashtandon2005@gmail.com",
  resume: "/resume.pdf",
  photo: "/images/headshot.jpeg",
  links: [
    { label: "GitHub", href: "https://github.com/YashTandon05", handle: "@YashTandon05" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yashtandon05",
      handle: "/in/yashtandon05",
    },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=5V5BDuMAAAAJ",
      handle: "5V5BDuMAAAAJ",
    },
  ],
};

/** Used for <title>, OG tags, and the generated OG image. */
export const siteMeta = {
  title: `${bio.name} | AI/ML, Robotics, Software`,
  description:
    "Machine learning and perception research, robotics, and software engineering projects by Yash Tandon.",
  // TODO: swap for the real domain before deploying; OG images need an absolute URL.
  url: "https://yashtandon.dev",
} as const;
