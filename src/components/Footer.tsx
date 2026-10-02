import { bio } from "@/content/bio";
import MarkerUnderline from "./MarkerUnderline";
import SectionHeader from "./SectionHeader";

export default function Footer() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-ink/10"
    >
      <div className="mx-auto w-full max-w-[1120px] px-6 py-16">
        <SectionHeader
          index="06"
          label="Contact"
          id="contact-heading"
          blurb="Working on something similar, curious about the research, or hiring? Reach out. I read everything that lands here."
        />

        <a
          href={`mailto:${bio.email}`}
          className="group relative mt-8 inline-block font-display text-[clamp(1.5rem,4.5vw,2.5rem)] font-medium tracking-[-0.03em] text-ink"
        >
          {bio.email}
          <MarkerUnderline className="-bottom-2" />
        </a>

        <a
          href={`mailto:${bio.secondaryEmail}`}
          className="group relative mt-2 block font-mono text-sm text-graphite transition-colors hover:text-ink w-fit"
        >
          {bio.secondaryEmail}
          <MarkerUnderline />
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ink/8 pt-6">
          <ul className="flex flex-wrap gap-5">
            {bio.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative font-mono text-[12px] tracking-[0.1em] text-graphite uppercase transition-colors hover:text-ink"
                >
                  {link.label}
                  <MarkerUnderline />
                </a>
              </li>
            ))}
            <li>
              <a
                href={bio.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-mono text-[12px] tracking-[0.1em] text-graphite uppercase transition-colors hover:text-ink"
              >
                Resume
                <MarkerUnderline />
              </a>
            </li>
          </ul>

          <p className="font-mono text-[11px] text-graphite/70">
            Built with Next.js · press{" "}
            <kbd className="rounded-[2px] border border-ink/20 px-1 py-0.5">
              ⌘K
            </kbd>{" "}
            to navigate
          </p>
        </div>
      </div>
    </footer>
  );
}
