import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "lib/ethen/ethenTts";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { text?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { audioAvailable: false, reason: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text = body.text;

  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { audioAvailable: false, reason: "Text field is required" },
      { status: 400 },
    );
  }

  const result = await synthesizeSpeech(text);

  if (result.audioAvailable) {
    return NextResponse.json({
      audioAvailable: true,
      audioBase64: result.audioBase64,
      contentType: result.contentType,
    });
  }

  return NextResponse.json({
    audioAvailable: false,
    reason: result.reason,
  });
}
