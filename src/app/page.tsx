import Link from "next/link";

// TODO (week 3): driver's-seat dashboard scene (SVG scene, screen tabs, drive
// transitions). This placeholder just proves the route/theme split works —
// home has no persistent nav, every other route gets one via (site)/layout.tsx.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Yash Tandon</h1>
      <p className="max-w-md text-muted">
        Dashboard home page placeholder — themed scene coming in week 3.
      </p>
      <Link href="/resume" className="text-sm text-accent underline">
        Skip intro →
      </Link>
    </div>
  );
}
