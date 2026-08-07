/**
 * Theme plumbing. The `data-theme` attribute on <html> is the single source of
 * truth — not React state — so the toggle stays a stateless button and there is
 * nothing to hydrate. globals.css keys the color tokens off that attribute, and
 * every component already paints from tokens, so no `dark:` variants exist.
 */

export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme:dark)";

/**
 * Runs inline in <head>, synchronously during HTML parsing, so the resolved
 * theme lands on <html> before the first paint. Anything that waits for React —
 * an effect, a lazy initializer — paints the light default first and flashes on
 * a cold load. See next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.
 *
 * try/catch because reading localStorage throws outright (not returns null) in
 * some privacy modes; falling through to the OS preference is the right answer.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});var t=s==="light"||s==="dark"?s:(window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function storedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** Whatever <html> is currently wearing. */
export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * @param persist false when the change came *from* the OS — writing it back
 * would silently promote a system preference into an explicit choice and
 * permanently detach the visitor from their OS setting.
 */
export function setTheme(theme: Theme, persist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (!persist) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Preference is lost on reload; the current page still switches.
  }
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

/**
 * Track the OS preference for as long as the visitor hasn't picked a side —
 * matches the init script, which only consults the OS when nothing is stored.
 * Returns an unsubscribe suitable for returning straight from useEffect.
 */
export function watchSystemTheme(): () => void {
  const query = window.matchMedia(DARK_QUERY);

  const onChange = (e: MediaQueryListEvent) => {
    if (storedTheme()) return;
    setTheme(e.matches ? "dark" : "light", false);
  };

  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
