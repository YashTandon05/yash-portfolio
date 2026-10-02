"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bio } from "@/content/bio";

/**
 * The site assistant: a launcher pinned bottom-right and a docked panel above it.
 *
 * Bottom-right because that corner is where visitors already expect help to live,
 * and because it's the only fixed slot on the page that competes with nothing —
 * the navbar owns the top, the filter pill takes bottom-left. The launcher is
 * card-surfaced rather than marker-filled on purpose: the resume button is the
 * page's one filled CTA and outranks a chat toy for a recruiter.
 *
 * SCAFFOLD: the transport is real; the endpoint behind it is a stub that says so.
 * See src/app/api/chat/route.ts to connect a model.
 */

/** Lets anything on the page open the panel — the ⌘K palette uses this. */
export const OPEN_CHAT_EVENT = "portfolio:open-chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What has he worked on in robotics?",
  "Summarise his research and publications.",
  "Which projects use PyTorch?",
  "What kind of role is he looking for?",
];

/** Mirrors the server's cap, so an over-long history is trimmed rather than 400'd. */
const MAX_HISTORY = 24;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null until the first reply tells us. The scaffold badge is derived rather
  // than hard-coded so it disappears on its own once a model is wired in.
  const [configured, setConfigured] = useState<boolean | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // Open on request from elsewhere (command palette, a link, anything).
  useEffect(() => {
    const onOpen = () => {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      restoreFocusTo.current?.focus();
      restoreFocusTo.current = null;
      return;
    }

    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest turn in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, pending]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      const history = [
        ...messages,
        { role: "user" as const, content: question },
      ].slice(-MAX_HISTORY);

      setMessages(history);
      setInput("");
      setPending(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Request failed.");

        setConfigured(Boolean(data.configured));
        setMessages([
          ...history,
          { role: "assistant", content: String(data.reply) },
        ]);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Couldn't reach the assistant.",
        );
      } finally {
        setPending(false);
      }
    },
    [messages, pending],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          restoreFocusTo.current = null;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close the assistant" : `Ask about ${bio.name}`}
        className="group fixed right-6 bottom-6 z-40 flex h-12 items-center gap-2.5 rounded-[3px] border border-ink/20 bg-card px-4 text-ink transition-colors hover:border-marker"
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full bg-marker transition-transform ${
            open ? "scale-0" : "group-hover:scale-125"
          }`}
        />
        <span className="font-mono text-[12px] tracking-[0.1em] uppercase">
          {open ? "Close" : "Ask"}
        </span>
      </button>

      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label={`Ask about ${bio.name}`}
          className="fixed right-6 bottom-22 z-40 flex max-h-[min(34rem,calc(100dvh-9rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-[4px] border border-ink/20 bg-card"
        >
          <header className="border-b border-ink/10 px-4 py-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-graphite/80 uppercase">
              Ask about {bio.name}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-graphite">
              {configured === false
                ? "Preview. The model isn't connected yet."
                : "Projects, research, stack, availability."}
            </p>
          </header>

          <div
            ref={logRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <ul className="space-y-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => send(question)}
                      className="w-full rounded-[3px] border border-dashed border-ink/15 px-3 py-2 text-left text-[13px] leading-snug text-graphite transition-colors hover:border-marker/60 hover:text-ink"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {messages.map((message, i) => (
              <p
                key={`${i}-${message.role}`}
                className={`max-w-[85%] rounded-[3px] px-3 py-2 text-[13px] leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto border border-marker/40 bg-marker/10 text-ink"
                    : "border border-ink/10 text-graphite"
                }`}
              >
                {message.content}
              </p>
            ))}

            {pending && (
              <p className="font-mono text-[11px] text-graphite/70">Thinking…</p>
            )}
            {error && (
              <p className="rounded-[3px] border border-marker/40 px-3 py-2 font-mono text-[11px] text-marker">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-ink/10 px-3 py-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              rows={2}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a question…"
              aria-label="Your question"
              className="min-w-0 flex-1 resize-none bg-transparent py-1 text-[13px] leading-relaxed text-ink placeholder:text-graphite/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || input.trim().length === 0}
              className="shrink-0 rounded-[3px] border border-ink/20 px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-ink uppercase transition-colors hover:border-marker disabled:opacity-35"
            >
              Send
            </button>
          </form>

          <p className="border-t border-ink/8 px-4 py-2 font-mono text-[10px] text-graphite/70">
            Answers come from this site only ·{" "}
            <a href={`mailto:${bio.email}`} className="text-marker">
              email instead
            </a>
          </p>
        </div>
      )}
    </>
  );
}
