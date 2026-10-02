"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects, categoryMeta } from "@/content/projects";
import { bio } from "@/content/bio";
import { toggleTheme } from "@/lib/theme";
import { OPEN_CHAT_EVENT } from "./ChatWidget";

/**
 * ⌘K / Ctrl+K palette: jump to a section, open a case study, grab the resume, or
 * copy the email without touching the mouse. Recruiters who don't know it exists
 * lose nothing; engineers who try it notice immediately.
 */

interface Command {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      close();
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    },
    [close],
  );

  const commands: Command[] = useMemo(() => {
    const sections: Command[] = [
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "ai-ml", label: "Projects · AI / ML" },
      { id: "robotics", label: "Projects · Robotics" },
      { id: "swe", label: "Projects · Software Engineering" },
      { id: "publications", label: "Publications" },
      { id: "contact", label: "Contact" },
    ].map((section) => ({
      id: `section-${section.id}`,
      label: section.label,
      group: "Jump to",
      run: () => goToSection(section.id),
    }));

    const projectCommands: Command[] = projects
      .filter((p) => !p.placeholder)
      .map((project) => ({
        id: `project-${project.slug}`,
        label: project.title,
        group: "Case studies",
        hint: categoryMeta(project.category).label,
        run: () => {
          close();
          router.push(`/projects/${project.slug}`);
        },
      }));

    const actions: Command[] = [
      {
        id: "chat",
        label: "Ask the assistant a question",
        group: "Actions",
        run: () => {
          close();
          window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
        },
      },
      {
        id: "resume",
        label: "Open resume (PDF)",
        group: "Actions",
        run: () => {
          close();
          window.open(bio.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        // Stays open: flipping the lights is the one action worth doing with
        // the palette still up, since the palette itself shows the result.
        id: "theme",
        label: "Toggle light / dark theme",
        group: "Actions",
        run: toggleTheme,
      },
      {
        id: "email",
        label: `Copy email · ${bio.email}`,
        group: "Actions",
        run: () => {
          navigator.clipboard?.writeText(bio.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        },
      },
      ...bio.links.map((link) => ({
        id: `link-${link.label}`,
        label: `Open ${link.label}`,
        group: "Actions",
        hint: link.handle,
        run: () => {
          close();
          window.open(link.href, "_blank", "noopener,noreferrer");
        },
      })),
    ];

    return [...sections, ...projectCommands, ...actions];
  }, [close, goToSection, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreFocusTo.current = document.activeElement as HTMLElement | null;
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus into the palette when it opens, and hand focus back where it came
  // from when it closes.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    restoreFocusTo.current?.focus();
    restoreFocusTo.current = null;
  }, [open]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length === 0 ? 0 : (c + 1) % results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) =>
        results.length === 0 ? 0 : (c - 1 + results.length) % results.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[cursor]?.run();
    }
  };

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-scrim px-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-[4px] border border-ink/20 bg-card"
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-4">
          <span className="font-mono text-[12px] text-marker">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Jump to a section, project, or action…"
            aria-label="Search commands"
            className="w-full bg-transparent py-3.5 font-mono text-[13px] text-ink placeholder:text-graphite/60 focus:outline-none"
          />
          <kbd className="shrink-0 rounded-[2px] border border-ink/20 px-1.5 py-0.5 font-mono text-[10px] text-graphite">
            ESC
          </kbd>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-[12px] text-graphite">
              No matches
            </li>
          )}
          {results.map((command, i) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            return (
              <li key={command.id}>
                {showGroup && (
                  <p className="px-4 pt-3 pb-1 font-mono text-[10px] tracking-[0.18em] text-graphite/70 uppercase">
                    {command.group}
                  </p>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={command.run}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-[13px] ${
                    i === cursor ? "bg-marker/10 text-ink" : "text-graphite"
                  }`}
                >
                  <span className="truncate">{command.label}</span>
                  {command.hint && (
                    <span className="shrink-0 font-mono text-[10px] text-graphite/70 uppercase">
                      {command.hint}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p
          aria-live="polite"
          className="border-t border-ink/10 px-4 py-2 font-mono text-[10px] text-graphite/70"
        >
          {copied ? "Email copied to clipboard" : "↑↓ to move · ↵ to select"}
        </p>
      </div>
    </div>
  );
}
