"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ProjectMedia } from "@/content/projects";

/** Clips are told from stills by extension — content just gives a path. */
const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
/** Animated stills must skip the optimizer, which would re-encode to one frame. */
const isAnimatedImage = (src: string) => /\.gif$/i.test(src);

const slideKind = (item: ProjectMedia) =>
  item.embed ? "demo" : isVideo(item.src) ? "clip" : "image";

/**
 * Case-study slideshow: screenshots, clips, and live embeds, sitting directly
 * under the metric so the reader sees the thing before reading about it.
 *
 * Deliberate choices:
 * - **Letterboxed, never cropped.** Slides come from content as bare paths, so
 *   their aspect ratios are unknown and mixed. A fixed 16/10 frame with
 *   `object-contain` keeps every slide fully visible and — more importantly —
 *   keeps the frame a constant height, so paging never shifts the page under a
 *   reader's cursor.
 * - **Crossfade, not slide.** All slides are stacked and toggled by opacity.
 *   The reduced-motion rule in globals.css flattens the transition to nothing,
 *   which leaves a correct finished state rather than a frozen mid-animation.
 * - **Only the visible slide is interactive.** Stacked slides all sit at
 *   `inset-0`, so without `pointer-events-none` the last one in the array would
 *   swallow clicks meant for whichever slide is actually showing.
 * - **One clip plays at a time.** Only the active slide's video runs; paging
 *   away pauses it and rewinds, so returning to a slide restarts it rather than
 *   resuming from wherever the reader left.
 * - **Embeds live in the overlay only.** See `EmbedLauncher` for why.
 * - **No extra tab stop.** Arrow keys are handled on the region, so they work
 *   once focus is anywhere inside it (a nav button, a slide tick, the expand
 *   button) without the region itself becoming something you tab through.
 */
export default function ProjectGallery({
  media,
  title,
}: {
  media: ProjectMedia[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const count = media.length;
  const current = media[index];

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  const openZoom = useCallback(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setZoomed(true);
  }, []);

  // Focus into the overlay when it opens and hand focus back on close, matching
  // the command palette's contract.
  useEffect(() => {
    if (zoomed) {
      closeRef.current?.focus();
      return;
    }
    restoreFocusTo.current?.focus();
    restoreFocusTo.current = null;
  }, [zoomed]);

  // The overlay covers the page, so its keys are global while it's up.
  //
  // Caveat worth knowing: once focus moves *inside* an embedded demo, its
  // keystrokes belong to that document and never reach this handler — Escape
  // included. That's why the overlay always shows a visible Close button rather
  // than relying on the shortcut.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, go]);

  if (count === 0) return null;

  // Arrow keys inside the inline region. Skipped while the overlay is open so a
  // single press doesn't get counted twice by both handlers.
  const onRegionKeyDown = (e: React.KeyboardEvent) => {
    if (zoomed || count < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  // Horizontal swipe. Tracked with pointer events (one path for touch, pen, and
  // click-drag) and ignored unless the gesture is decisively sideways, so it
  // can't hijack a vertical scroll that happens to start on the image.
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || count < 2) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const label = `${title} — ${slideKind(current)} ${index + 1} of ${count}`;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(
    count,
  ).padStart(2, "0")}`;

  return (
    <>
      <section
        role="group"
        aria-roledescription="slideshow"
        aria-label={`${title} media`}
        onKeyDown={onRegionKeyDown}
        className="mt-8"
      >
        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="group relative aspect-[16/10] w-full overflow-hidden rounded-[3px] border border-ink/12 bg-card"
        >
          {media.map((item, i) => (
            <Slide
              key={item.src}
              item={item}
              variant="inline"
              // Inline clips pause while the overlay is up: the same slide is
              // mounted twice there, and two copies of one clip playing out of
              // sync behind a scrim is just noise.
              active={i === index && !zoomed}
              mounted={i === index}
              eager={i === 0}
              autoPlay={!reduceMotion}
              sizes="(min-width: 808px) 760px, calc(100vw - 3rem)"
              onLaunch={openZoom}
              className={`transition-opacity duration-300 ${
                i === index
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            />
          ))}

          {count > 1 && (
            <>
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
            </>
          )}

          {/* Embeds carry their own full-frame launch button, so a second
              affordance in the corner would just be a duplicate. */}
          {!current.embed && (
            <button
              type="button"
              onClick={openZoom}
              aria-label={`Expand ${label}`}
              // Dimmed rather than hidden until hover: a hover-only control is
              // unreachable on touch, where expanding a screenshot matters most.
              className="absolute top-2 right-2 rounded-[2px] border border-ink/15 bg-card/85 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-graphite uppercase opacity-60 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              Expand ⤢
            </button>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-6">
          <p className="text-[13px] leading-relaxed text-graphite text-pretty">
            {current.caption}
          </p>

          {count > 1 && (
            <div className="flex shrink-0 items-center gap-3">
              {/* Ticks rather than dots — flat rules read as part of the
                  graph-paper motif, and they stay legible at eight slides. */}
              <ul className="flex items-center">
                {media.map((item, i) => (
                  <li key={item.src}>
                    {/* The tick is a 3px rule, but the button padding around it
                        carries the hit area up to a tappable size. */}
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${slideKind(item)} ${i + 1}`}
                      aria-current={i === index}
                      className="group/tick flex h-6 w-6 items-center justify-center"
                    >
                      <span
                        className={`block h-[3px] w-4 rounded-full transition-colors ${
                          i === index
                            ? "bg-marker"
                            : "bg-ink/20 group-hover/tick:bg-ink/40"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <span className="font-mono text-[11px] text-graphite/70 tabular-nums">
                {counter}
              </span>
            </div>
          )}
        </div>

        {/* Announces slide changes for screen-reader users; the visible counter
            above is decorative to them. */}
        <p aria-live="polite" className="sr-only">
          {label}
        </p>
      </section>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} media, expanded`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 flex flex-col bg-scrim p-4 backdrop-blur-[2px] sm:p-8"
        >
          <div className="flex items-center justify-end gap-4">
            {current.embed && (
              <a
                href={current.src}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-[2px] border border-ink/20 bg-card px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-graphite uppercase"
              >
                Open in new tab ↗
              </a>
            )}
            <span className="font-mono text-[11px] text-ink/80 tabular-nums">
              {counter}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setZoomed(false)}
              className="rounded-[2px] border border-ink/20 bg-card px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-graphite uppercase"
            >
              Close esc
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative min-h-0 flex-1"
          >
            <Slide
              key={current.src}
              item={current}
              variant="overlay"
              active
              mounted
              eager
              autoPlay={!reduceMotion}
              sizes="100vw"
              onLaunch={openZoom}
            />

            {count > 1 && (
              <>
                <NavButton side="left" onClick={() => go(-1)} />
                <NavButton side="right" onClick={() => go(1)} />
              </>
            )}
          </div>

          {current.caption && (
            <p className="mt-4 text-center text-[13px] text-ink/80 text-pretty">
              {current.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}

/**
 * One slide: still, clip, or live embed. `active` drives playback, `mounted`
 * drives whether it's the visible one — they differ only while the overlay is
 * open, where the inline copy stays mounted for the crossfade but must not play.
 */
function Slide({
  item,
  variant,
  active,
  mounted,
  eager,
  autoPlay,
  sizes,
  onLaunch,
  className = "",
}: {
  item: ProjectMedia;
  variant: "inline" | "overlay";
  active: boolean;
  mounted: boolean;
  eager: boolean;
  autoPlay: boolean;
  sizes: string;
  onLaunch: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active && autoPlay) {
      // Set muted on the element as well as via the attribute: autoplay is only
      // permitted for muted video, and a play() on an unmuted element rejects.
      el.muted = true;
      void el.play().catch(() => {});
    } else {
      el.pause();
      if (!active) el.currentTime = 0;
    }
  }, [active, autoPlay]);

  // `select-none` so a swipe drag doesn't leave the slide highlighted.
  const shared = `absolute inset-0 h-full w-full select-none object-contain p-2 ${className}`;

  if (item.embed) {
    return variant === "overlay" ? (
      <EmbedFrame item={item} className={className} />
    ) : (
      <EmbedLauncher item={item} onLaunch={onLaunch} className={shared} />
    );
  }

  if (isVideo(item.src)) {
    return (
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        // Loops silently like a GIF, but pausable — and `controls` is what makes
        // it pausable, which matters most under reduced motion, where the clip
        // does not start on its own.
        loop
        muted
        playsInline
        controls
        preload={eager ? "metadata" : "none"}
        aria-label={item.alt}
        aria-hidden={!mounted}
        className={shared}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      sizes={sizes}
      // Animated GIFs are passed through rather than resized: the optimizer
      // would otherwise hand back a single frame.
      unoptimized={isAnimatedImage(item.src)}
      // The first slide is the one a reader lands on; the rest can wait until
      // they page to them.
      loading={eager ? "eager" : "lazy"}
      // Stacked slides stay mounted for the crossfade, so the inactive ones have
      // to be hidden from screen readers.
      aria-hidden={!mounted}
      className={shared}
    />
  );
}

/**
 * The inline face of an embed slide: a poster and a button, never a live frame.
 *
 * Embeds are deliberately *not* mounted inline. Three reasons, in order of how
 * much they'd hurt:
 *
 * 1. **Cost.** An iframe inside the stack would load on every case-study view —
 *    third-party JS, and for a demo backed by a sleeping host, a cold start —
 *    for readers who never page to it. Mounting on demand means an embed costs
 *    nothing until someone asks for it.
 * 2. **Room.** The gallery frame is a constant-height 16/10 band, roughly 475px
 *    tall at full width. That is not enough for a real interactive tool, and
 *    growing the band for one slide would make every other slide jump.
 * 3. **Identity.** A slide mounted in both places would be two separate
 *    documents — paging or expanding would silently reload the demo and discard
 *    whatever the reader had set up. One mount, in the overlay, means one
 *    session.
 */
function EmbedLauncher({
  item,
  onLaunch,
  className,
}: {
  item: ProjectMedia;
  onLaunch: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onLaunch}
      className={`${className} group/embed flex flex-col items-center justify-center gap-3 !p-6 text-center`}
    >
      {item.poster && (
        <Image
          src={item.poster}
          alt=""
          fill
          sizes="(min-width: 808px) 760px, calc(100vw - 3rem)"
          // Backdrop only — the real subject here is the button.
          className="object-cover opacity-15"
        />
      )}

      <span className="relative font-mono text-[10px] tracking-[0.18em] text-marker uppercase">
        Interactive demo
      </span>
      <span className="relative max-w-sm text-[13px] leading-relaxed text-graphite text-pretty">
        {item.alt}
      </span>
      <span className="relative mt-1 rounded-[2px] border border-ink/20 bg-card px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-ink uppercase transition-colors group-hover/embed:border-marker group-hover/embed:text-marker">
        Launch demo ⤢
      </span>
    </button>
  );
}

/** The live frame, mounted only inside the overlay. */
function EmbedFrame({
  item,
  className = "",
}: {
  item: ProjectMedia;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {!loaded && (
        <p className="absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.14em] text-ink/70 uppercase">
          Loading demo…
        </p>
      )}
      <iframe
        src={item.src}
        // Required for assistive tech, and the one place `alt` earns its keep on
        // an embed.
        title={item.alt}
        onLoad={() => setLoaded(true)}
        // Cross-origin already, so `allow-same-origin` grants the demo its own
        // origin (and a real `Origin` header for its API calls) without giving
        // it any reach into this page.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="strict-origin-when-cross-origin"
        // Third-party pages bring their own background; painting white keeps a
        // light-themed demo from looking broken behind a dark-mode scrim.
        className={`h-full w-full rounded-[3px] border border-ink/15 bg-white transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-[2px] border border-ink/15 bg-card/85 px-2 py-3 font-mono text-[13px] text-ink backdrop-blur-[2px] transition-colors hover:border-ink/35 hover:text-marker ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}
