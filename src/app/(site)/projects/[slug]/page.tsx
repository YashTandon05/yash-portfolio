import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";

// Pre-render a static page per project at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const sections = [
    { label: "Problem", body: project.problem },
    { label: "Approach", body: project.approach },
    { label: "Result", body: project.result },
  ];

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/projects" className="text-sm text-muted hover:text-accent">
        ← Back to projects
      </Link>

      <header className="mt-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p className="mt-2 text-muted">{project.summary}</p>
      </header>

      {/* Media placeholder */}
      <div className="mt-6 flex aspect-video items-center justify-center rounded-xl border border-border bg-surface font-mono text-xs text-muted">
        media / demo
      </div>

      {/* Problem → Approach → Result */}
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.label}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
              {section.label}
            </h2>
            <p className="text-foreground/90">{section.body}</p>
          </section>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <footer className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </footer>
      )}
    </article>
  );
}
