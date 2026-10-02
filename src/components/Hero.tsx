import Image from "next/image";
import ResumeButton from "./ResumeButton";
import MarkerUnderline from "./MarkerUnderline";
import { bio } from "@/content/bio";

/**
 * Photo, name, one-line pitch, and the three things a recruiter reaches for
 * first (resume, email, profiles).
 *
 * Server-rendered on purpose: the reveal is a CSS animation, not a JS one, so
 * the headline is on screen from the first paint whether or not the bundle has
 * landed.
 */
export default function Hero() {
  return (
    <section className="pt-28 pb-4 md:pt-32">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
        {/* Photo — first on mobile, right-hand column on desktop. */}
        <div className="rise-in shrink-0 md:order-2" style={{ animationDelay: "60ms" }}>
          {bio.photo ? (
            <Image
              src={bio.photo}
              alt={`${bio.name}, portrait`}
              width={240}
              height={288}
              priority
              className="h-[240px] w-[200px] rounded-[3px] border border-ink/15 object-cover md:h-[288px] md:w-[240px]"
            />
          ) : (
            <div className="flex h-[240px] w-[200px] flex-col items-center justify-center gap-2 rounded-[3px] border border-dashed border-ink/25 bg-card px-4 text-center md:h-[288px] md:w-[240px]">
              <span className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
                Headshot
              </span>
              <span className="font-mono text-[10px] leading-relaxed text-graphite/70">
                add public/images/headshot.jpg, then set{" "}
                <span className="text-ink">bio.photo</span>
              </span>
            </div>
          )}
        </div>

        <div className="md:order-1">
          <p
            className="rise-in font-mono text-[11px] tracking-[0.22em] text-graphite uppercase"
            style={{ animationDelay: "0ms" }}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-marker align-middle" />
            {bio.status}
          </p>

          <h1
            className="rise-in mt-6 font-display text-[clamp(2.25rem,5.4vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.04em] text-ink text-balance"
            style={{ animationDelay: "60ms" }}
          >
            {bio.name}
          </h1>

          <p
            className="rise-in mt-3 font-mono text-[13px] tracking-[0.06em] text-marker"
            style={{ animationDelay: "90ms" }}
          >
            {bio.role}
          </p>

          <p
            className="rise-in mt-6 max-w-xl text-[17px] leading-relaxed text-ink/85 text-pretty"
            style={{ animationDelay: "120ms" }}
          >
            {bio.headline}
          </p>

          <p
            className="rise-in mt-4 max-w-xl text-[15px] leading-relaxed text-graphite text-pretty"
            style={{ animationDelay: "150ms" }}
          >
            {bio.intro}
          </p>

          <div
            className="rise-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ animationDelay: "180ms" }}
          >
            <ResumeButton />
            <a
              href={`mailto:${bio.email}`}
              className="group relative font-display text-[15px] font-medium tracking-tight text-ink"
            >
              Email me
              <MarkerUnderline />
            </a>
            {bio.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-display text-[15px] font-medium tracking-tight text-graphite transition-colors hover:text-ink"
              >
                {link.label}
                <MarkerUnderline />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
