/**
 * The graph-paper texture, painted once as a fixed layer behind the whole page.
 * The pattern itself is defined as a CSS custom property in globals.css, so
 * sections don't each re-declare (or re-render) a background.
 *
 * A soft radial mask keeps the ruling densest behind the hero and lets it fade
 * out toward the bottom of the viewport — the whiteboard has a focal point.
 */
export default function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: "var(--graph-paper)",
        backgroundSize: "var(--graph-paper-size)",
        opacity: 0.75,
        maskImage:
          "radial-gradient(120% 90% at 50% 0%, black 20%, rgba(0,0,0,0.55) 60%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 90% at 50% 0%, black 20%, rgba(0,0,0,0.55) 60%, transparent 100%)",
      }}
    />
  );
}
