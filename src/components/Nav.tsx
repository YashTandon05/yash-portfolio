"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
  { href: "/assistant", label: "Assistant" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    pathname === href
      ? "text-accent"
      : "text-muted transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-base hover:border-accent hover:text-accent"
        >
          {/* placeholder wheel/home icon — replaced with SVG wheel in week 3 */}
          ⟲
        </Link>

        {/* Desktop links */}
        <ul className="hidden gap-6 text-sm font-medium sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-base sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <ul
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-border px-4 py-2 sm:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-2 py-2 text-sm font-medium ${linkClass(
                  link.href,
                )}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
