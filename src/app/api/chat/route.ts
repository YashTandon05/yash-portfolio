import { NextRequest, NextResponse } from "next/server";

// TODO: wire up Anthropic SDK call with claude-haiku-4-5, system-prompt knowledge
// base, and per-IP rate limiting. ANTHROPIC_API_KEY must live in a Vercel env var
// and never be exposed to the client.
export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: "TODO: implement assistant response" });
}
