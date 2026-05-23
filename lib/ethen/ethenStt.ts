export type SttProviderName = "deepgram" | "assemblyai" | "soniox";

export interface SttProviderConfig {
  name: SttProviderName;
  apiKey: string;
}

export type SttResult =
  | { transcriptAvailable: true; transcript: string; confidence?: number }
  | { transcriptAvailable: false; reason: string };

const STT_PROVIDER_ENV_MAP: Record<SttProviderName, { apiKey: string }> = {
  deepgram: { apiKey: "DEEPGRAM_API_KEY" },
  assemblyai: { apiKey: "ASSEMBLYAI_API_KEY" },
  soniox: { apiKey: "SONIOX_API_KEY" },
};

function detectSttProvider(): SttProviderConfig | null {
  for (const [name, envKeys] of Object.entries(STT_PROVIDER_ENV_MAP)) {
    const apiKey = process.env[envKeys.apiKey];
    if (apiKey) {
      return { name: name as SttProviderName, apiKey };
    }
  }
  return null;
}

export async function transcribeAudio(audioBase64: string): Promise<SttResult> {
  if (!audioBase64 || audioBase64.length === 0) {
    return { transcriptAvailable: false, reason: "Audio data is empty" };
  }

  if (audioBase64.length > 5 * 1024 * 1024) {
    return {
      transcriptAvailable: false,
      reason: "Audio exceeds maximum size of 5MB",
    };
  }

  const provider = detectSttProvider();

  if (!provider) {
    return {
      transcriptAvailable: false,
      reason: "STT provider not configured",
    };
  }

  switch (provider.name) {
    case "deepgram":
      return await transcribeDeepgram(audioBase64, provider);
    case "assemblyai":
      return await transcribeAssemblyAI(audioBase64, provider);
    case "soniox":
      return await transcribeSoniox(audioBase64, provider);
    default: {
      const _exhaustive: never = provider.name;
      return {
        transcriptAvailable: false,
        reason: `Unsupported provider: ${_exhaustive}`,
      };
    }
  }
}

async function transcribeDeepgram(
  audioBase64: string,
  config: SttProviderConfig,
): Promise<SttResult> {
  try {
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${config.apiKey}`,
          "Content-Type": "audio/webm",
        },
        body: audioBuffer,
      },
    );

    if (!response.ok)
      return {
        transcriptAvailable: false,
        reason: `Deepgram STT returned ${response.status}`,
      };

    const data = (await response.json()) as {
      results?: {
        channels?: {
          alternatives?: { transcript?: string; confidence?: number }[];
        }[];
      };
    };

    const transcript =
      data.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    const confidence =
      data.results?.channels?.[0]?.alternatives?.[0]?.confidence;

    if (!transcript) {
      return { transcriptAvailable: false, reason: "No transcript returned" };
    }

    return {
      transcriptAvailable: true,
      transcript,
      confidence,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deepgram STT failed";
    return { transcriptAvailable: false, reason: message };
  }
}

async function transcribeAssemblyAI(
  audioBase64: string,
  config: SttProviderConfig,
): Promise<SttResult> {
  try {
    const submit = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_data: audioBase64 }),
    });

    if (!submit.ok)
      return {
        transcriptAvailable: false,
        reason: `AssemblyAI submission returned ${submit.status}`,
      };

    const { id } = (await submit.json()) as { id?: string };
    if (!id) {
      return {
        transcriptAvailable: false,
        reason: "No transcription ID returned",
      };
    }

    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise((r) => setTimeout(r, 1000));

      const pollResponse = await fetch(
        `https://api.assemblyai.com/v2/transcript/${id}`,
        { headers: { Authorization: config.apiKey } },
      );

      if (!pollResponse.ok) continue;

      const pollData = (await pollResponse.json()) as {
        status?: string;
        text?: string;
        confidence?: number;
      };

      if (pollData.status === "completed") {
        const transcript = pollData.text;
        if (!transcript) {
          return {
            transcriptAvailable: false,
            reason: "No transcript text returned",
          };
        }
        return {
          transcriptAvailable: true,
          transcript,
          confidence: pollData.confidence,
        };
      }

      if (pollData.status === "error") {
        return {
          transcriptAvailable: false,
          reason: "AssemblyAI transcription returned error status",
        };
      }
    }

    return {
      transcriptAvailable: false,
      reason: "AssemblyAI transcription timed out",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "AssemblyAI STT failed";
    return { transcriptAvailable: false, reason: message };
  }
}

async function transcribeSoniox(
  audioBase64: string,
  config: SttProviderConfig,
): Promise<SttResult> {
  try {
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const response = await fetch("https://api.soniox.com/v1/transcribe", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "audio/webm",
      },
      body: audioBuffer,
    });

    if (!response.ok)
      return {
        transcriptAvailable: false,
        reason: `Soniox STT returned ${response.status}`,
      };

    const data = (await response.json()) as {
      text?: string;
      confidence?: number;
    };

    const transcript = data.text;
    if (!transcript) {
      return { transcriptAvailable: false, reason: "No transcript returned" };
    }

    return {
      transcriptAvailable: true,
      transcript,
      confidence: data.confidence,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Soniox STT failed";
    return { transcriptAvailable: false, reason: message };
  }
}
