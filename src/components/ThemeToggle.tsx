"use client";

import { useEffect } from "react";
import { toggleTheme, watchSystemTheme } from "@/lib/theme";

/**
 * Light/dark switch, styled to match the mobile menu button so the two sit
 * together in the bar without competing.
 *
 * Deliberately stateless: it writes `data-theme` to <html> and lets CSS decide
 * which glyph and label are visible (see the `.theme-icon-*` rules in
 * globals.css). Holding the theme in useState would mean the server renders
 * "light" while the inline script has already made the page dark — a hydration
 * mismatch and a visible icon flip on every cold load.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Keep following the OS until the visitor picks a side themselves.
  useEffect(() => watchSystemTheme(), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-[3px] border border-ink/20 text-ink transition-colors hover:border-ink/45 ${className}`}
    >
      {/* Shown while light — clicking goes dark. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="theme-icon-moon h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16.4 12.5A7.1 7.1 0 0 1 7.5 3.6a7.1 7.1 0 1 0 8.9 8.9Z" />
      </svg>

      {/* Shown while dark — clicking goes light. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="theme-icon-sun h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2.4v1.5M10 16.1v1.5M17.6 10h-1.5M3.9 10H2.4M15.4 4.6l-1.1 1.1M5.7 14.3l-1.1 1.1M15.4 15.4l-1.1-1.1M5.7 5.7 4.6 4.6" />
      </svg>

      {/* The button's accessible name. CSS hides one outright, so exactly one
          reaches the accessibility tree — and it always names the destination. */}
      <span className="theme-icon-moon sr-only">Switch to dark theme</span>
      <span className="theme-icon-sun sr-only">Switch to light theme</span>
    </button>
  );
}
