import Link from "next/link";
import type { Project } from "@/lib/projects";

// The hover "bounding-box" effect nods to the CV/perception work: hovering a
// card draws a detection frame with corner ticks + a mock confidence score
// over the (placeholder) thumbnail. Built with CSS group-hover so it inherits
// the global prefers-reduced-motion reset automatically.
export default function ProjectCard({ project }: { project: Project }) {
  const confidenceLabel = project.confidence.toFixed(2);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
    >
      {/* Thumbnail / detection frame (placeholder until real media) */}
      <div className="relative aspect-video overflow-hidden bg-foreground/[0.04]">
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">
          thumbnail
        </div>

        {/* Bounding box, revealed on hover */}
        <div className="pointer-events-none absolute inset-4 rounded-sm border-2 border-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {/* corner ticks */}
          <span className="absolute -left-0.5 -top-0.5 h-2 w-2 border-l-2 border-t-2 border-accent" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 border-r-2 border-t-2 border-accent" />
          <span className="absolute -bottom-0.5 -left-0.5 h-2 w-2 border-b-2 border-l-2 border-accent" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 border-b-2 border-r-2 border-accent" />
          {/* confidence label */}
          <span className="absolute -top-6 left-0 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-foreground">
            {project.slug} {confidenceLabel}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-4">
        <h3 className="font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-muted">{project.stat}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
