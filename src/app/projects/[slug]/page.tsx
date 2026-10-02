import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, categoryMeta } from "@/content/projects";
import { siteMeta } from "@/content/bio";
import ResumeButton from "@/components/ResumeButton";
import MarkerUnderline from "@/components/MarkerUnderline";
import ProjectGallery from "@/components/ProjectGallery";
import LinkKindIcon from "@/components/LinkKindIcon";
import Footer from "@/components/Footer";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.filter((p) => !p.placeholder).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: siteMeta.title };

  return {
    title: `${project.title} | ${siteMeta.title}`,
    description: project.hook,
    openGraph: { title: project.title, description: project.hook },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const category = categoryMeta(project.category);
  const siblings = projects.filter(
    (p) => !p.placeholder && p.category === project.category && p.slug !== slug,
  );

  const sections = [
    { label: "Problem", body: project.problem },
    { label: "Approach", body: project.approach },
    { label: "Result", body: project.result },
  ].filter((s) => Boolean(s.body));

  return (
    <>
      <main className="mx-auto w-full max-w-[760px] px-6 pt-16 pb-24">
        <Link
          href={`/#${category.id}`}
          className="group relative font-mono text-[11px] tracking-[0.14em] text-graphite uppercase transition-colors hover:text-ink"
        >
          ← Back to {category.label}
          <MarkerUnderline />
        </Link>

        <header className="mt-10">
          <p className="font-mono text-xs tracking-[0.18em] text-graphite uppercase">
            <span className="text-marker">{category.label}</span>
            {project.period && (
              <>
                <span className="mx-2 text-grid">/</span>
                <span className="text-graphite/70">{project.period}</span>
              </>
            )}
          </p>

          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.08] font-medium tracking-[-0.035em] text-ink text-balance">
            {project.title}
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-graphite text-pretty">
            {project.hook}
          </p>

          {project.metric && (
            <p className="mt-6 inline-block rounded-[3px] border border-ink/12 bg-card px-4 py-2 font-mono text-sm text-ink">
              <span className="text-marker">▸ </span>
              {project.metric}
            </p>
          )}

          {project.media && project.media.length > 0 && (
            <ProjectGallery media={project.media} title={project.title} />
          )}
        </header>

        {project.description && (
          <p className="mt-10 text-[15px] leading-relaxed text-ink/85">
            {project.description}
          </p>
        )}

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.label}>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-marker uppercase">
                {section.label}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-ink/10 pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-graphite uppercase">
            Stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-[2px] border border-ink/12 px-2 py-1 font-mono text-[11px] tracking-wide text-graphite uppercase"
              >
                {tech}
              </li>
            ))}
          </ul>

          {project.links && project.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-5">
              {project.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.1em] text-ink uppercase"
                  >
                    <LinkKindIcon kind={link.kind} className="h-4 w-4 text-marker" />
                    {link.label} ↗
                    <MarkerUnderline />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {siblings.length > 0 && (
          <nav
            aria-label={`More ${category.label} projects`}
            className="mt-16 border-t border-ink/10 pt-8"
          >
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-graphite uppercase">
              More in {category.label}
            </h2>
            <ul className="mt-4 space-y-2">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    href={`/projects/${sibling.slug}`}
                    className="group relative font-display text-[15px] tracking-tight text-ink"
                  >
                    {sibling.title}
                    <MarkerUnderline />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-ink/10 pt-8">
          <ResumeButton size="sm" />
          <Link
            href="/#projects"
            className="group relative font-mono text-[12px] tracking-[0.1em] text-graphite uppercase transition-colors hover:text-ink"
          >
            All projects
            <MarkerUnderline />
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
