/**
 * The assistant's knowledge base, serialised from the same `content/` modules the
 * page renders. Nothing is duplicated by hand: edit a project, and the bot knows
 * about the edit on the next request.
 *
 * Deliberately deterministic — no timestamps, no shuffling, no request-specific
 * interpolation. The system prompt is the cacheable prefix of every chat request,
 * and a single varying byte anywhere in it would mean paying full price on every
 * message instead of ~10% (see the caching note in the route handler).
 */

import { bio } from "@/content/bio";
import { experience, education, type Role } from "@/content/experience";
import { projects, categoryMeta } from "@/content/projects";
import { publications } from "@/content/publications";
import { skillFacets } from "@/content/skills";

function roleBlock(role: Role): string {
  const lines = [
    `- ${role.title} — ${role.org} (${role.period}${role.location ? `, ${role.location}` : ""})`,
    ...role.bullets.map((b) => `  · ${b}`),
  ];
  if (role.stack?.length) lines.push(`  · Stack: ${role.stack.join(", ")}`);
  return lines.join("\n");
}

export function buildKnowledgeBase(): string {
  const sections: string[] = [];

  sections.push(
    [
      "## Identity",
      `Name: ${bio.name}`,
      `Role: ${bio.role}`,
      `Location: ${bio.location}`,
      `Current status: ${bio.status}`,
      `Email: ${bio.email}`,
      `Links: ${bio.links.map((l) => `${l.label} (${l.href})`).join(", ")}`,
      "",
      bio.headline,
      bio.intro,
      ...bio.about,
    ].join("\n"),
  );

  sections.push(["## Experience", ...experience.map(roleBlock)].join("\n\n"));
  sections.push(["## Education", ...education.map(roleBlock)].join("\n\n"));

  sections.push(
    [
      "## Projects",
      ...projects
        .filter((p) => !p.placeholder)
        .map((project) =>
          [
            `### ${project.title}`,
            `Category: ${categoryMeta(project.category).label}${
              project.alsoIn?.length
                ? ` (also ${project.alsoIn.map((c) => categoryMeta(c).label).join(", ")})`
                : ""
            }`,
            `Page: /projects/${project.slug}`,
            project.period ? `When: ${project.period}` : null,
            project.metric ? `Headline result: ${project.metric}` : null,
            `Stack: ${project.stack.join(", ")}`,
            project.hook,
            project.description,
            project.problem ? `Problem: ${project.problem}` : null,
            project.approach ? `Approach: ${project.approach}` : null,
            project.result ? `Result: ${project.result}` : null,
            project.links?.length
              ? `Links: ${project.links.map((l) => `${l.label} — ${l.href}`).join(", ")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n"),
        ),
    ].join("\n\n"),
  );

  sections.push(
    [
      "## Publications",
      ...publications.map((pub) =>
        [
          `### ${pub.title}`,
          `${pub.authors} — ${pub.venue} ${pub.year}${pub.status ? ` (${pub.status})` : ""}`,
          pub.plain,
          pub.links?.length
            ? `Links: ${pub.links.map((l) => `${l.label} — ${l.href}`).join(", ")}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    ].join("\n\n"),
  );

  sections.push(
    [
      "## Skills",
      skillFacets
        .filter((f) => !f.unbacked)
        .map((f) => `${f.name} (${f.count} project${f.count === 1 ? "" : "s"})`)
        .join(", "),
    ].join("\n"),
  );

  return sections.join("\n\n");
}

/**
 * The system prompt. The anti-fabrication rule is the load-bearing part: the site
 * ships with `TODO:` placeholders where real copy hasn't landed, and a chatbot that
 * cheerfully invents a metric for one of them would be worse than no chatbot at
 * all — a recruiter would take the invention as Yash's own claim.
 */
export function buildSystemPrompt(): string {
  return `You are the assistant on ${bio.name}'s portfolio site. You answer questions from recruiters, hiring managers, and engineers about his background, projects, research, and skills.

Everything you know is in the reference below. Rules:

- Answer only from the reference. If it does not cover something, say so plainly and point the visitor at ${bio.email} — never guess, never fill a gap with a plausible-sounding detail.
- Text marked "TODO:" is a placeholder for copy that has not been written yet. Treat it as *absent*, not as content: say the detail isn't published on the site yet. Never quote, paraphrase, or complete a TODO.
- You are not ${bio.name} and do not speak as him. Refer to him in the third person.
- Keep answers to two or three sentences unless asked for depth. Recruiters skim.
- When a project is relevant, name it and give its page path (e.g. /projects/robocup) so the visitor can read the case study.
- Decline anything unrelated to ${bio.name}'s work — you are not a general-purpose assistant.
- Never state or imply an availability, salary, visa, or start-date commitment on his behalf. Direct those to email.

# Reference

${buildKnowledgeBase()}`;
}
