import { bio } from "@/content/bio";

/**
 * The one marker-filled CTA on the page. Opens the resume PDF in a new tab
 * (recruiters skim before they download).
 */
export default function ResumeButton({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-[13px]" : "px-5 py-2.5 text-sm";

  return (
    <a
      href={bio.resume}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center gap-2 rounded-[3px] bg-marker font-medium tracking-tight text-paper transition-transform duration-200 hover:-translate-y-0.5 ${pad} ${className}`}
    >
      <span>Resume</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
      {/* Offset "ink" edge — the taped-marker look, without a drop shadow. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-[3px] translate-y-[3px] rounded-[3px] border border-ink/25 transition-transform duration-200 group-hover:translate-x-[5px] group-hover:translate-y-[5px]"
      />
    </a>
  );
}
