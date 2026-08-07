import type { Variants } from "framer-motion";

/**
 * Shared motion variants. The animation budget is deliberately lopsided: the
 * hero diagram gets the one memorable moment, everything else is a calm fade.
 */

/** Project cards and similar: fade + 12px rise, staggered by the parent. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section headers: fade only, no translate — keeps the page quiet. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/** Parent for card grids: ~60ms between children. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/** Shared viewport config: reveal once, slightly before fully in frame. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
