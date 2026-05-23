import { NextRequest, NextResponse } from "next/server";
import {
  validateSessionTokenRequest,
  createDemoSessionToken,
} from "lib/avatar-cloud/session-tokens";
import { SAMPLE_LIVE_AGENTS } from "lib/avatar-cloud/sample-data";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON",
        tokenMode: "demo",
        message: "Request body must be valid JSON",
      },
      { status: 400 },
    );
  }

  const validation = validateSessionTokenRequest(body);
  if (!validation.valid) {
    return NextResponse.json(
      {
        error: "Invalid request",
        tokenMode: "demo",
        message: validation.error,
      },
      { status: 400 },
    );
  }

  const { request } = validation;

  const origin = req.headers.get("origin") ?? "localhost";
  const originDomain =
    origin
      .replace(/^https?:\/\//, "")
      .split(":")[0]
      ?.split("/")[0] ?? "localhost";

  const agent = SAMPLE_LIVE_AGENTS.find((a) => a.id === request.liveAgentId);

  if (!agent) {
    const fallbackToken = createDemoSessionToken(
      request,
      undefined,
      originDomain,
    );
    return NextResponse.json(fallbackToken, { status: 200 });
  }

  const embedConfig =
    typeof agent.embedConfigId === "string" && agent.embedConfigId.length > 0
      ? undefined
      : undefined;

  const result = createDemoSessionToken(request, agent, originDomain);

  return NextResponse.json(
    {
      ...result,
      message: result.message ?? "Demo token issued. Not for production use.",
    },
    { status: 200 },
  );
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
