"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MarkerUnderline from "./MarkerUnderline";
import ResumeButton from "./ResumeButton";
import ThemeToggle from "./ThemeToggle";
import { bio } from "@/content/bio";

// Order must match the page — the active-section logic below picks the
// furthest-down intersecting entry, which only means "current" if this list is
// in document order.
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Transparent over the hero, paper-backed once you start scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section highlight: whichever section owns the middle of the viewport.
  // Contact is a short footer, so near the bottom of the page it and Skills
  // can both graze the detection band at once — track intersection state per
  // section and prefer the one furthest down the page, not whichever entry
  // happened to arrive first in the batch.
  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const intersecting = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => intersecting.set(e.target.id, e.isIntersecting));
        const visibleIds = SECTIONS.map((s) => s.id).filter((id) =>
          intersecting.get(id),
        );
        if (visibleIds.length > 0) setActive(visibleIds[visibleIds.length - 1]);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-ink/10 bg-paper/85 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6"
      >
        <Link
          href="/"
          className="group relative font-display text-sm font-semibold tracking-[-0.02em] text-ink"
          aria-label={`${bio.name} — home`}
        >
          <span className="rounded-[2px] border border-ink/70 px-1.5 py-0.5 font-mono text-[12px]">
            {bio.initials}
          </span>
        </Link>

        <ul className="hidden items-center gap-5 md:flex lg:gap-6">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                className={`group relative font-mono text-[11px] tracking-[0.08em] uppercase transition-colors lg:text-[12px] ${
                  active === section.id
                    ? "text-ink"
                    : "text-graphite hover:text-ink"
                }`}
              >
                {section.label}
                <MarkerUnderline active={active === section.id} />
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <ResumeButton size="sm" />
          </li>
        </ul>

        {/* Theme sits outside the sheet on mobile — switching the lights is a
            one-tap thing, not something to go hunting through a menu for. */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-ink/20"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5L5 15" />
                </>
              ) : (
                <>
                  <path d="M3 6.5h14" />
                  <path d="M3 13.5h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-nav"
          className="mx-auto flex w-full max-w-[1120px] flex-col gap-1 px-6 pb-5 md:hidden"
        >
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/8 py-3 font-mono text-[13px] tracking-[0.1em] text-ink uppercase"
              >
                {section.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <ResumeButton size="sm" />
          </li>
        </ul>
      )}
    </header>
  );
}
