import type { ProjectLink } from "@/content/projects";

/**
 * One glyph per link kind. Silhouettes are deliberately unalike — code brackets,
 * portrait page, landscape board, play circle — so the four stay tellable apart
 * at 14px without labels.
 */
const PATHS: Record<ProjectLink["kind"], React.ReactNode> = {
  repo: <path d="M7.6 6.2 3.8 10l3.8 3.8M12.4 6.2 16.2 10l-3.8 3.8" />,
  paper: (
    <>
      <path d="M11.5 2.8H6.2A1.4 1.4 0 0 0 4.8 4.2v11.6a1.4 1.4 0 0 0 1.4 1.4h7.6a1.4 1.4 0 0 0 1.4-1.4V6.8Z" />
      <path d="M11.5 2.8v4h3.7M7.6 10.6h4.8M7.6 13.4h4.8" />
    </>
  ),
  writeup: (
    <>
      <rect x="2.8" y="4" width="14.4" height="9.6" rx="1.2" />
      <path d="M10 13.6v3.2M7.2 16.8h5.6" />
    </>
  ),
  demo: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M8.4 7.2l4.4 2.8-4.4 2.8Z" />
    </>
  ),
};

export default function LinkKindIcon({
  kind,
  className = "h-3.5 w-3.5",
}: {
  kind: ProjectLink["kind"];
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[kind]}
    </svg>
  );
}
