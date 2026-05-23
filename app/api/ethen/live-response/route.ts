import { NextRequest, NextResponse } from "next/server";
import { getGuideResponse } from "lib/ethen/ethenGuide";
import { synthesizeSpeech } from "lib/ethen/ethenTts";

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
}

function sseEvent(event: string, data: string): string {
  return `event: ${event}\ndata: ${data}\n\n`;
}

async function buildStreamingResponse(message: string): Promise<Response> {
  const guideResult = getGuideResponse(message);

  const sentences = splitIntoSentences(guideResult.text);

  let fullText = "";
  let sentenceIndex = 0;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          sseEvent(
            "start",
            JSON.stringify({ sentenceCount: sentences.length }),
          ),
        ),
      );

      for (const sentence of sentences) {
        fullText +=
          sentence + (sentenceIndex < sentences.length - 1 ? " " : "");
        controller.enqueue(
          encoder.encode(
            sseEvent(
              "chunk",
              JSON.stringify({
                text: sentence,
                isFinal: sentenceIndex === sentences.length - 1,
                sentenceIndex,
              }),
            ),
          ),
        );
        sentenceIndex++;

        if (sentenceIndex < sentences.length) {
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
      }

      let ttsBase64: string | undefined;
      let ttsContentType: string | undefined;
      let ttsAvailable = false;

      try {
        const ttsResult = await synthesizeSpeech(fullText);
        if (ttsResult.audioAvailable) {
          ttsBase64 = ttsResult.audioBase64;
          ttsContentType = ttsResult.contentType;
          ttsAvailable = true;
        }
      } catch {
        ttsAvailable = false;
      }

      controller.enqueue(
        encoder.encode(
          sseEvent(
            "done",
            JSON.stringify({
              fullText,
              entryId: guideResult.entryId,
              relatedLinks: guideResult.relatedLinks ?? null,
              ttsAvailable,
              ttsAudioBase64: ttsBase64 ?? null,
              ttsContentType: ttsContentType ?? null,
            }),
          ),
        ),
      );

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function buildJsonResponse(message: string): Promise<NextResponse> {
  const guideResult = getGuideResponse(message);

  let ttsAvailable = false;
  let ttsAudioBase64: string | undefined;
  let ttsContentType: string | undefined;

  try {
    const ttsResult = await synthesizeSpeech(guideResult.text);
    if (ttsResult.audioAvailable) {
      ttsAvailable = true;
      ttsAudioBase64 = ttsResult.audioBase64;
      ttsContentType = ttsResult.contentType;
    }
  } catch {
    ttsAvailable = false;
  }

  return NextResponse.json({
    text: guideResult.text,
    entryId: guideResult.entryId,
    relatedLinks: guideResult.relatedLinks ?? null,
    ttsAvailable,
    ttsAudioBase64: ttsAudioBase64 ?? null,
    ttsContentType: ttsContentType ?? null,
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: { message?: string; stream?: boolean };

  try {
    body = (await req.json()) as { message?: string; stream?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: "Message field is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  if (body.stream) {
    return await buildStreamingResponse(message.trim());
  }

  return await buildJsonResponse(message.trim());
}
