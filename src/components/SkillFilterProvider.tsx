"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { projects, type Project } from "@/content/projects";
import {
  filterProjects,
  selectableSkills,
  type MatchMode,
} from "@/content/skills";

/**
 * One selection, shared by the Skills chips (which set it), the Projects grids
 * (which honour it), and the floating status pill (which reports it).
 *
 * It lives in context rather than in the Skills section because the filter's whole
 * value is that it acts on something *else* on the page. Provider wraps the page
 * body; `page.tsx` stays a server component because the sections are passed
 * through as children rather than rendered by the provider.
 */

interface SkillFilterValue {
  selected: string[];
  mode: MatchMode;
  /** Anything selected — every conditional in the UI keys off this. */
  active: boolean;
  isSelected(skill: string): boolean;
  toggle(skill: string): void;
  clear(): void;
  setMode(mode: MatchMode): void;
  /** Apply the current selection to a list. Identity when nothing is selected. */
  filter(list: readonly Project[]): Project[];
  /** Matches across the whole site, for counts. */
  matchCount: number;
  /** Real (non-placeholder) projects, for "N of M". */
  totalCount: number;
}

const SkillFilterContext = createContext<SkillFilterValue | null>(null);

const REAL_PROJECTS = projects.filter((p) => !p.placeholder);

/** Query keys. `?skills=PyTorch,ROS&match=any` — a filter view is a shareable URL. */
const SKILLS_PARAM = "skills";
const MATCH_PARAM = "match";

/**
 * One object rather than three `useState`s so the URL restore lands atomically —
 * a partial restore would flash a filtered grid with the wrong match mode.
 * `hydrated` starts false so the first client render matches the server HTML.
 */
interface FilterState {
  selected: string[];
  mode: MatchMode;
  hydrated: boolean;
}

const INITIAL: FilterState = { selected: [], mode: "all", hydrated: false };

export default function SkillFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ selected, mode, hydrated }, setState] =
    useState<FilterState>(INITIAL);

  // Restore from the URL once. Unknown names are dropped rather than trusted —
  // the query string is user-editable, and a chip that matches nothing would sit
  // in the filter bar with no way to remove it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Reading `window` is a one-shot read of an external system, and it has to
    // happen after hydration: seeding the initial state from the URL instead
    // would make the client's first render disagree with the server's HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      selected: (params.get(SKILLS_PARAM) ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => selectableSkills.has(s)),
      mode: params.get(MATCH_PARAM) === "any" ? "any" : "all",
      hydrated: true,
    });
  }, []);

  // Mirror the selection back into the URL. `replaceState` rather than a router
  // push: filtering is a view adjustment, not a navigation, and 20 chip clicks
  // should not mean 20 back-button presses to leave the page.
  useEffect(() => {
    if (!hydrated) return;

    const params = new URLSearchParams(window.location.search);
    if (selected.length > 0) {
      params.set(SKILLS_PARAM, selected.join(","));
    } else {
      params.delete(SKILLS_PARAM);
    }
    if (selected.length > 0 && mode === "any") {
      params.set(MATCH_PARAM, "any");
    } else {
      params.delete(MATCH_PARAM);
    }

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [hydrated, selected, mode]);

  const toggle = useCallback((skill: string) => {
    setState((current) => ({
      ...current,
      selected: current.selected.includes(skill)
        ? current.selected.filter((s) => s !== skill)
        : [...current.selected, skill],
    }));
  }, []);

  const clear = useCallback(
    () => setState((current) => ({ ...current, selected: [] })),
    [],
  );

  const setMode = useCallback(
    (next: MatchMode) => setState((current) => ({ ...current, mode: next })),
    [],
  );

  const value = useMemo<SkillFilterValue>(() => {
    const matchCount = filterProjects(REAL_PROJECTS, selected, mode).length;

    return {
      selected,
      mode,
      active: selected.length > 0,
      isSelected: (skill) => selected.includes(skill),
      toggle,
      clear,
      setMode,
      filter: (list) => filterProjects(list, selected, mode),
      matchCount,
      totalCount: REAL_PROJECTS.length,
    };
  }, [selected, mode, toggle, clear, setMode]);

  return (
    <SkillFilterContext.Provider value={value}>
      {children}
    </SkillFilterContext.Provider>
  );
}

export function useSkillFilter(): SkillFilterValue {
  const value = useContext(SkillFilterContext);
  if (!value) {
    throw new Error("useSkillFilter must be used inside <SkillFilterProvider>");
  }
  return value;
}
