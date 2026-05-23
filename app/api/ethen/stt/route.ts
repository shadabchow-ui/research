import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "lib/ethen/ethenStt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { audioBase64?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { transcriptAvailable: false, reason: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const audioBase64 = body.audioBase64;

  if (!audioBase64 || typeof audioBase64 !== "string") {
    return NextResponse.json(
      { transcriptAvailable: false, reason: "audioBase64 field is required" },
      { status: 400 },
    );
  }

  const result = await transcribeAudio(audioBase64);

  if (result.transcriptAvailable) {
    return NextResponse.json({
      transcriptAvailable: true,
      transcript: result.transcript,
      confidence: result.confidence,
    });
  }

  return NextResponse.json({
    transcriptAvailable: false,
    reason: result.reason,
  });
}
