import {
  streamResponse,
  LlmStreamChunk,
  isLlmProviderAvailable,
} from "./ethenStreamingLlm";
import type { GuideResponse } from "./ethenGuide";
import { getGuideResponse } from "./ethenGuide";
import { synthesizeSpeech, isTtsProviderAvailable } from "./ethenTts";

export interface VoicePipelineInput {
  text: string;
}

export type VoicePipelineEvent =
  | { type: "llm_start" }
  | { type: "llm_chunk"; chunk: LlmStreamChunk }
  | {
      type: "llm_done";
      fullText: string;
      entryId: string;
      relatedLinks?: { label: string; href: string }[];
    }
  | { type: "tts_start" }
  | {
      type: "tts_result";
      audioAvailable: boolean;
      audioBase64?: string;
      contentType?: string;
      reason?: string;
    }
  | { type: "error"; message: string };

export interface VoicePipelineResult {
  responseText: string;
  entryId: string;
  relatedLinks?: { label: string; href: string }[];
  ttsAvailable: boolean;
  ttsAudioBase64?: string;
  ttsContentType?: string;
}

export async function* runVoicePipeline(
  input: VoicePipelineInput,
): AsyncGenerator<VoicePipelineEvent> {
  const trimmed = input.text.trim();
  if (!trimmed) {
    yield { type: "error", message: "Input text is empty" };
    return;
  }

  yield { type: "llm_start" };

  let fullText = "";
  let guideResult: GuideResponse;

  try {
    guideResult = getGuideResponse(trimmed);

    for await (const chunk of streamResponse(trimmed)) {
      fullText += chunk.text + (chunk.isFinal ? "" : " ");
      yield { type: "llm_chunk", chunk };
    }

    yield {
      type: "llm_done",
      fullText: guideResult.text,
      entryId: guideResult.entryId,
      relatedLinks: guideResult.relatedLinks,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "LLM response failed";
    yield { type: "error", message };
    return;
  }

  yield { type: "tts_start" };

  try {
    const { synthesizeSpeech } = await import("./ethenTts");
    const ttsResult = await synthesizeSpeech(fullText);

    yield {
      type: "tts_result",
      audioAvailable: ttsResult.audioAvailable,
      audioBase64: ttsResult.audioAvailable ? ttsResult.audioBase64 : undefined,
      contentType: ttsResult.audioAvailable ? ttsResult.contentType : undefined,
      reason: ttsResult.audioAvailable ? undefined : ttsResult.reason,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS synthesis failed";
    yield {
      type: "tts_result",
      audioAvailable: false,
      reason: message,
    };
  }
}

export async function runVoicePipelineSimultaneous(
  input: VoicePipelineInput,
): Promise<VoicePipelineResult> {
  const trimmed = input.text.trim();
  if (!trimmed) {
    return {
      responseText: "",
      entryId: "",
      ttsAvailable: false,
    };
  }

  const guideResult = getGuideResponse(trimmed);

  let ttsAudioBase64: string | undefined;
  let ttsContentType: string | undefined;
  let ttsAvailable = false;

  try {
    const { synthesizeSpeech } = await import("./ethenTts");
    const ttsResult = await synthesizeSpeech(guideResult.text);
    if (ttsResult.audioAvailable) {
      ttsAudioBase64 = ttsResult.audioBase64;
      ttsContentType = ttsResult.contentType;
      ttsAvailable = true;
    }
  } catch {
    ttsAvailable = false;
  }

  return {
    responseText: guideResult.text,
    entryId: guideResult.entryId,
    relatedLinks: guideResult.relatedLinks,
    ttsAvailable,
    ttsAudioBase64,
    ttsContentType,
  };
}

export function getVoicePipelineCapabilities(): {
  llmProvider: string | null;
  llmConfigured: boolean;
  ttsConfigured: boolean;
  streamingSupported: boolean;
} {
  return {
    llmProvider: isLlmProviderAvailable() ? "configured" : null,
    llmConfigured: isLlmProviderAvailable(),
    ttsConfigured: isTtsProviderAvailable(),
    streamingSupported: true,
  };
}
