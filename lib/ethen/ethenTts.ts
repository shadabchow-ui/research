export type TtsProviderName = "openai" | "elevenlabs";

export interface TtsProviderConfig {
  name: TtsProviderName;
  apiKey: string;
  voiceId?: string;
  model?: string;
}

export type TtsResult =
  | { audioAvailable: true; audioBase64: string; contentType: string }
  | { audioAvailable: false; reason: string };

export function isTtsProviderAvailable(): boolean {
  const provider = detectProvider();
  return provider !== null;
}

function detectProvider(): TtsProviderConfig | null {
  const explicitProvider = process.env.ETHEN_TTS_PROVIDER?.toLowerCase();

  if (explicitProvider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return {
      name: "openai",
      apiKey,
      model: process.env.OPENAI_TTS_MODEL || "tts-1",
      voiceId: process.env.OPENAI_TTS_VOICE || "alloy",
    };
  }

  if (explicitProvider === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return null;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!voiceId) return null;
    return {
      name: "elevenlabs",
      apiKey,
      voiceId,
      model: process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5",
    };
  }

  if (explicitProvider) {
    return null;
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      name: "openai",
      apiKey: openaiKey,
      model: process.env.OPENAI_TTS_MODEL || "tts-1",
      voiceId: process.env.OPENAI_TTS_VOICE || "alloy",
    };
  }

  return null;
}

function validateText(text: string): string | null {
  if (!text || text.trim().length === 0) return "Text is empty";
  if (text.length > 1000)
    return "Text exceeds maximum length of 1000 characters";
  return null;
}

export async function synthesizeSpeech(text: string): Promise<TtsResult> {
  const validationError = validateText(text);
  if (validationError) {
    return { audioAvailable: false, reason: validationError };
  }

  const provider = detectProvider();
  if (!provider) {
    return { audioAvailable: false, reason: "not provided" };
  }

  try {
    switch (provider.name) {
      case "openai":
        return await synthesizeOpenAI(text, provider);
      case "elevenlabs":
        return await synthesizeElevenLabs(text, provider);
      default: {
        const _exhaustive: never = provider.name;
        return {
          audioAvailable: false,
          reason: `Unsupported provider: ${String(_exhaustive)}`,
        };
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS synthesis failed";
    return { audioAvailable: false, reason: message };
  }
}

async function synthesizeOpenAI(
  text: string,
  config: TtsProviderConfig,
): Promise<TtsResult> {
  const body: Record<string, unknown> = {
    model: config.model || "tts-1",
    input: text,
    voice: config.voiceId || "alloy",
    response_format: "mp3",
  };

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `OpenAI TTS failed (${response.status}): ${errorText.slice(0, 200)}`,
    );
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");

  return {
    audioAvailable: true,
    audioBase64: base64,
    contentType: "audio/mpeg",
  };
}

async function synthesizeElevenLabs(
  text: string,
  config: TtsProviderConfig,
): Promise<TtsResult> {
  const voiceId = config.voiceId;
  if (!voiceId) {
    return {
      audioAvailable: false,
      reason: "ElevenLabs voice ID is not configured",
    };
  }

  const modelId = config.model || "eleven_flash_v2_5";

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        output_format: "mp3_44100_128",
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `ElevenLabs TTS failed (${response.status}): ${errorText.slice(0, 200)}`,
    );
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString("base64");

  return {
    audioAvailable: true,
    audioBase64: base64,
    contentType: "audio/mpeg",
  };
}
