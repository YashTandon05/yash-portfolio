/**
 * A hand-drawn marker underline that wipes in from the left when its parent
 * (`.group`) is hovered or focused. Pure CSS — no JS, and it degrades to "just
 * appears" under prefers-reduced-motion because the global reset zeroes
 * transition durations.
 *
 * The reveal is a scaleX transform rather than a stroke-dashoffset transition:
 * dashoffset has an inherited default of 0, so on first paint the browser
 * transitions *from* a fully drawn line and every underline on the page flashes
 * orange before erasing itself. A transform starts where it ends (0 → 0), so
 * there is nothing to animate until the pointer arrives.
 *
 * Usage: put `group relative` on the link/heading and drop this inside.
 */
export default function MarkerUnderline({
  className = "",
  active = false,
}: {
  className?: string;
  /** Force the drawn state (e.g. the current nav section). */
  active?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-1.5 left-0 h-[6px] w-full origin-left overflow-visible text-marker transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
        active ? "scale-x-100" : "scale-x-0"
      } ${className}`}
    >
      <path
        d="M1 4.2 C 18 1.8, 34 5.2, 52 3.2 S 82 1.6, 99 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
