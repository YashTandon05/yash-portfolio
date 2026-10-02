import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/knowledge";

/**
 * Chat endpoint for the site assistant.
 *
 * SCAFFOLD: everything around the model call is real — validation, abuse limits,
 * the serialised knowledge base, the response shape the widget consumes. The model
 * call itself is the single `generateReply` function below, and it currently
 * returns an honest "not wired up yet" message. See the comment there for the exact
 * call to drop in.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  /** False while the endpoint is a stub — the widget labels itself accordingly. */
  configured: boolean;
}

/** A portfolio Q&A turn that needs more than this is a question for email. */
const MAX_CHARS_PER_MESSAGE = 2_000;
/** Keeps one visitor from replaying a long history to inflate input tokens. */
const MAX_MESSAGES = 24;

const RATE_LIMIT = { windowMs: 10 * 60 * 1_000, max: 20 };

/**
 * Per-instance rate limit.
 *
 * A public endpoint that spends money on every request needs *a* brake, and an
 * in-process Map is the one that costs nothing to run. It resets on redeploy and
 * is per-instance, so it throttles casual abuse rather than a determined attacker
 * — swap in Vercel KV / Upstash if this ever gets real traffic.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    // Opportunistic sweep — without it the Map is an unbounded leak on a
    // long-lived instance.
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return null;
  }

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_CHARS_PER_MESSAGE) return null;
    messages.push({ role, content: trimmed });
  }

  // The Messages API requires the conversation to end on a user turn.
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

const NOT_CONFIGURED =
  "The assistant isn't connected to a model yet. This is the scaffolding for it. " +
  "In the meantime, everything it will know is already on this page, and Yash " +
  "reads every email.";

/**
 * The one place that talks to Claude. Everything else in this file is transport.
 *
 * To turn the assistant on:
 *
 *   1. npm install @anthropic-ai/sdk
 *   2. put ANTHROPIC_API_KEY in .env.local (see .env.example)
 *   3. replace the body of this function with:
 *
 *      import Anthropic from "@anthropic-ai/sdk";
 *      const client = new Anthropic();   // module scope, not per request
 *
 *      const response = await client.messages.create({
 *        model: "claude-opus-5",
 *        max_tokens: 2048,
 *        // `low` keeps a two-sentence FAQ answer snappy. Thinking stays on
 *        // (the default on Opus 5) — disabling it is the more expensive lever
 *        // in every sense, and effort is the one that actually cuts latency.
 *        output_config: { effort: "low" },
 *        system: [
 *          {
 *            type: "text",
 *            text: buildSystemPrompt(),
 *            // The prompt is byte-identical on every request, so each message
 *            // after the first reads it from cache at ~10% of input price.
 *            cache_control: { type: "ephemeral" },
 *          },
 *        ],
 *        messages,
 *      });
 *
 *      const text = response.content.find((b) => b.type === "text");
 *      return text ? text.text : NOT_CONFIGURED;
 *
 * Streaming is the natural follow-up once it works: switch to
 * `client.messages.stream(...)` here and have the widget read the response body
 * incrementally instead of awaiting `res.json()`.
 */
async function generateReply(messages: ChatMessage[]): Promise<ChatResponse> {
  void messages;
  void buildSystemPrompt;

  if (!process.env.ANTHROPIC_API_KEY) {
    return { reply: NOT_CONFIGURED, configured: false };
  }

  return { reply: NOT_CONFIGURED, configured: false };
}

export async function POST(request: NextRequest) {
  if (rateLimited(clientKey(request))) {
    return Response.json(
      { error: "Too many messages. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON." }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return Response.json({ error: "Malformed conversation." }, { status: 400 });
  }

  try {
    return Response.json(await generateReply(messages));
  } catch (error) {
    // Never surface the upstream error text — it can carry request ids, model
    // names, and prompt fragments.
    console.error("[api/chat]", error);
    return Response.json(
      { error: "The assistant is unavailable right now." },
      { status: 502 },
    );
  }
}
