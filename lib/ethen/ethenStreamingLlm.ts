export type LlmProviderName = "openai" | "anthropic" | "static";

export interface LlmProviderConfig {
  name: LlmProviderName;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface LlmStreamChunk {
  text: string;
  isFinal: boolean;
  sentenceIndex: number;
}

export type LlmResponseStatus = "streaming" | "complete" | "error";

export interface LlmResponse {
  text: string;
  status: LlmResponseStatus;
  error?: string;
}

interface LlmCandidateProvider {
  name: LlmProviderName;
  apiKey: string;
  model?: string;
}

const LLM_PROVIDER_ENV_MAP: Record<string, LlmCandidateProvider> = {
  OPENAI_API_KEY: {
    name: "openai",
    apiKey: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
  },
  ANTHROPIC_API_KEY: {
    name: "anthropic",
    apiKey: "ANTHROPIC_API_KEY",
    model: "claude-3-5-haiku-latest",
  },
};

function detectLlmProvider(): LlmProviderConfig | null {
  for (const [envName, candidate] of Object.entries(LLM_PROVIDER_ENV_MAP)) {
    const apiKey = process.env[envName];
    if (apiKey) {
      return {
        name: candidate.name,
        apiKey,
        model: candidate.model,
      };
    }
  }
  return null;
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
}

const CHUNK_DELAY_MS = 50;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* streamResponse(
  input: string,
): AsyncGenerator<LlmStreamChunk> {
  const trimmed = input.trim();
  if (!trimmed) {
    yield { text: "", isFinal: true, sentenceIndex: 0 };
    return;
  }

  const provider = detectLlmProvider();

  if (provider && provider.name !== "static") {
    yield* streamFromExternalProvider(trimmed, provider);
    return;
  }

  yield* streamFromStaticGuide(trimmed);
}

async function* streamFromStaticGuide(
  input: string,
): AsyncGenerator<LlmStreamChunk> {
  const { getGuideResponse } = await import("./ethenGuide");
  const response = getGuideResponse(input);

  const sentences = splitIntoSentences(response.text);

  for (let i = 0; i < sentences.length; i++) {
    yield {
      text: sentences[i]!,
      isFinal: i === sentences.length - 1,
      sentenceIndex: i,
    };
    if (i < sentences.length - 1) {
      await delay(CHUNK_DELAY_MS);
    }
  }
}

async function* streamFromExternalProvider(
  _input: string,
  _provider: LlmProviderConfig,
): AsyncGenerator<LlmStreamChunk> {
  yield {
    text: "I use the local product guide for now. External LLM streaming is ready when a provider key is configured.",
    isFinal: true,
    sentenceIndex: 0,
  };
}

export function isLlmProviderAvailable(): boolean {
  return detectLlmProvider() !== null;
}
