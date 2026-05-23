// Observability and Cost Metering v1
// TypeScript-only foundation. No database, billing provider, or telemetry backend.

// Provider name references (kept local to avoid cross-module coupling)
export type SttProviderName = "deepgram" | "assemblyai" | "soniox" | "none";
export type TtsProviderName =
  | "elevenlabs"
  | "cartesia"
  | "azure"
  | "openai"
  | "deepgram"
  | "none";
export type LlmProviderName = "openai" | "anthropic" | "static" | "none";
export type TransportProviderName =
  | "livekit"
  | "daily"
  | "webrtc_custom"
  | "none";
export type RendererProviderName =
  | "browser_3d"
  | "neural_video"
  | "unreal_stream"
  | "vendor_video"
  | "none";

// Cost breakdown per provider category. All values in USD.
// ⚠️ Placeholder pricing used where provider rates are not configured.
export interface CostBreakdown {
  sttUsd: number;
  ttsUsd: number;
  llmUsd: number;
  webrtcUsd: number;
  gpuUsd: number;
  storageUsd: number;
  totalUsd: number;
}

// Latency breakdown per turn. All values in milliseconds.
export interface LatencyBreakdown {
  endpointingMs: number;
  sttMs: number;
  llmTtftMs: number;
  ttsTtfaMs: number;
  firstAudioMs: number;
  interruptionCancelMs?: number;
  totalMs: number;
}

// Per-turn metrics capturing the full lifecycle of one conversation turn.
export interface TurnMetrics {
  id: string;
  sessionId: string;
  conversationId?: string;
  turnIndex: number;
  userSpeechStartedAt?: string;
  userSpeechEndedAt?: string;
  sttFinalAt?: string;
  llmFirstTokenAt?: string;
  ttsFirstAudioAt?: string;
  avatarStartedSpeakingAt?: string;
  avatarStoppedSpeakingAt?: string;
  interrupted: boolean;
  fallbackUsed: boolean;
  errorCode?: string;
}

// Session-level aggregated metrics.
export interface CallMetrics {
  id: string;
  sessionId: string;
  conversationId?: string;
  durationSeconds: number;
  turnCount: number;
  turns: TurnMetrics[];
  cost: CostBreakdown;
  latencyP50: LatencyBreakdown;
  latencyP95: LatencyBreakdown;
  latencyP99: LatencyBreakdown;
  sttProvider: SttProviderName;
  ttsProvider: TtsProviderName;
  llmProvider: LlmProviderName;
  transportProvider: TransportProviderName;
  rendererProvider: RendererProviderName;
  createdAt: string;
}

// WebRTC quality snapshot for a session.
export interface WebRTCQualityMetrics {
  sessionId: string;
  rttMs: number;
  jitterMs: number;
  packetLossPercent: number;
  audioGapCount: number;
  droppedFrames: number;
  iceReconnects: number;
  turnUsed: boolean;
  bitrateKbps: number;
  codec?: string;
  region?: string;
  createdAt: string;
}

// Provider usage counters for a session.
export interface ProviderUsage {
  sttSeconds: number;
  sttProvider: SttProviderName;
  ttsCharacters: number;
  ttsProvider: TtsProviderName;
  llmInputTokens: number;
  llmOutputTokens: number;
  llmProvider: LlmProviderName;
  gpuSeconds: number;
  webrtcSessionMinutes: number;
  transportProvider: TransportProviderName;
  rendererProvider: RendererProviderName;
  storageBytes: number;
}

// Aggregated session quality summary (used in dashboard/analytics).
export interface SessionQualitySummary {
  sessionId: string;
  durationSeconds: number;
  turnCount: number;
  interruptionCount: number;
  fallbackCount: number;
  errorCount: number;
  sttSuccessRate: number;
  ttsSuccessRate: number;
  llmSuccessRate: number;
  userAbandoned: boolean;
  sttProvider: SttProviderName;
  ttsProvider: TtsProviderName;
  llmProvider: LlmProviderName;
  createdAt: string;
}

// Pseudo-pricing constants. These are DEMO/PLACEHOLDER values.
// Update when real provider contracts are in place.
const PLACEHOLDER_PRICING = {
  sttPerSecond: 0.0059,
  ttsPerChar: 0.000015,
  llmInputPer1k: 0.00015,
  llmOutputPer1k: 0.0006,
  webrtcPerMinute: 0.004,
  gpuPerSecond: 0.0013,
  storagePerGbMonth: 0.023,
};

export function createEmptyCostBreakdown(): CostBreakdown {
  return {
    sttUsd: 0,
    ttsUsd: 0,
    llmUsd: 0,
    webrtcUsd: 0,
    gpuUsd: 0,
    storageUsd: 0,
    totalUsd: 0,
  };
}

export function createEmptyLatencyBreakdown(): LatencyBreakdown {
  return {
    endpointingMs: 0,
    sttMs: 0,
    llmTtftMs: 0,
    ttsTtfaMs: 0,
    firstAudioMs: 0,
    totalMs: 0,
  };
}

export function estimateSessionCost(usage: ProviderUsage): CostBreakdown {
  const sttUsd =
    (usage.sttSeconds / 60) * PLACEHOLDER_PRICING.sttPerSecond * 60;
  const ttsUsd = usage.ttsCharacters * PLACEHOLDER_PRICING.ttsPerChar;
  const llmUsd =
    (usage.llmInputTokens / 1000) * PLACEHOLDER_PRICING.llmInputPer1k +
    (usage.llmOutputTokens / 1000) * PLACEHOLDER_PRICING.llmOutputPer1k;
  const webrtcUsd =
    usage.webrtcSessionMinutes * PLACEHOLDER_PRICING.webrtcPerMinute;
  const gpuUsd = usage.gpuSeconds * PLACEHOLDER_PRICING.gpuPerSecond;
  const storageUsd =
    (usage.storageBytes / 1e9) * PLACEHOLDER_PRICING.storagePerGbMonth;

  return {
    sttUsd: roundUsd(sttUsd),
    ttsUsd: roundUsd(ttsUsd),
    llmUsd: roundUsd(llmUsd),
    webrtcUsd: roundUsd(webrtcUsd),
    gpuUsd: roundUsd(gpuUsd),
    storageUsd: roundUsd(storageUsd),
    totalUsd: roundUsd(
      sttUsd + ttsUsd + llmUsd + webrtcUsd + gpuUsd + storageUsd,
    ),
  };
}

export function aggregateCostBreakdown(
  breakdowns: CostBreakdown[],
): CostBreakdown {
  const sttUsd = breakdowns.reduce((s, b) => s + b.sttUsd, 0);
  const ttsUsd = breakdowns.reduce((s, b) => s + b.ttsUsd, 0);
  const llmUsd = breakdowns.reduce((s, b) => s + b.llmUsd, 0);
  const webrtcUsd = breakdowns.reduce((s, b) => s + b.webrtcUsd, 0);
  const gpuUsd = breakdowns.reduce((s, b) => s + b.gpuUsd, 0);
  const storageUsd = breakdowns.reduce((s, b) => s + b.storageUsd, 0);

  return {
    sttUsd: roundUsd(sttUsd),
    ttsUsd: roundUsd(ttsUsd),
    llmUsd: roundUsd(llmUsd),
    webrtcUsd: roundUsd(webrtcUsd),
    gpuUsd: roundUsd(gpuUsd),
    storageUsd: roundUsd(storageUsd),
    totalUsd: roundUsd(
      sttUsd + ttsUsd + llmUsd + webrtcUsd + gpuUsd + storageUsd,
    ),
  };
}

export function computeLatencyFromTurn(turn: TurnMetrics): LatencyBreakdown {
  const endpointingMs = diffMs(
    turn.userSpeechStartedAt,
    turn.userSpeechEndedAt,
  );
  const sttMs = diffMs(turn.userSpeechEndedAt, turn.sttFinalAt);
  const llmTtftMs = diffMs(turn.sttFinalAt, turn.llmFirstTokenAt);
  const ttsTtfaMs = diffMs(turn.llmFirstTokenAt, turn.ttsFirstAudioAt);
  const firstAudioMs = diffMs(turn.userSpeechEndedAt, turn.ttsFirstAudioAt);
  const totalMs = diffMs(turn.userSpeechEndedAt, turn.avatarStartedSpeakingAt);

  return {
    endpointingMs,
    sttMs,
    llmTtftMs,
    ttsTtfaMs,
    firstAudioMs,
    totalMs,
  };
}

export function summarizeLatency(turns: TurnMetrics[]): {
  p50: LatencyBreakdown;
  p95: LatencyBreakdown;
  p99: LatencyBreakdown;
} {
  const latencies = turns.map(computeLatencyFromTurn);

  if (latencies.length === 0) {
    const empty = createEmptyLatencyBreakdown();
    return { p50: empty, p95: empty, p99: empty };
  }

  function percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0]!;
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.min(idx, sorted.length - 1)]!;
  }

  function buildLatency(
    getValue: (sorted: number[]) => number,
  ): LatencyBreakdown {
    return {
      endpointingMs: getValue(
        latencies.map((l) => l.endpointingMs).sort((a, b) => a - b),
      ),
      sttMs: getValue(latencies.map((l) => l.sttMs).sort((a, b) => a - b)),
      llmTtftMs: getValue(
        latencies.map((l) => l.llmTtftMs).sort((a, b) => a - b),
      ),
      ttsTtfaMs: getValue(
        latencies.map((l) => l.ttsTtfaMs).sort((a, b) => a - b),
      ),
      firstAudioMs: getValue(
        latencies.map((l) => l.firstAudioMs).sort((a, b) => a - b),
      ),
      totalMs: getValue(latencies.map((l) => l.totalMs).sort((a, b) => a - b)),
    };
  }

  return {
    p50: buildLatency((sorted) => percentile(sorted, 50)),
    p95: buildLatency((sorted) => percentile(sorted, 95)),
    p99: buildLatency((sorted) => percentile(sorted, 99)),
  };
}

export function createTurnMetrics(params: {
  id?: string;
  sessionId: string;
  conversationId?: string;
  turnIndex: number;
  userSpeechStartedAt?: string;
  userSpeechEndedAt?: string;
  sttFinalAt?: string;
  llmFirstTokenAt?: string;
  ttsFirstAudioAt?: string;
  avatarStartedSpeakingAt?: string;
  avatarStoppedSpeakingAt?: string;
  interrupted?: boolean;
  fallbackUsed?: boolean;
  errorCode?: string;
}): TurnMetrics {
  return {
    id: params.id ?? makeMetricId("turn"),
    sessionId: params.sessionId,
    conversationId: params.conversationId,
    turnIndex: params.turnIndex,
    userSpeechStartedAt: params.userSpeechStartedAt,
    userSpeechEndedAt: params.userSpeechEndedAt,
    sttFinalAt: params.sttFinalAt,
    llmFirstTokenAt: params.llmFirstTokenAt,
    ttsFirstAudioAt: params.ttsFirstAudioAt,
    avatarStartedSpeakingAt: params.avatarStartedSpeakingAt,
    avatarStoppedSpeakingAt: params.avatarStoppedSpeakingAt,
    interrupted: params.interrupted ?? false,
    fallbackUsed: params.fallbackUsed ?? false,
    errorCode: params.errorCode,
  };
}

export function createSessionQualitySummary(params: {
  sessionId: string;
  durationSeconds: number;
  turnCount: number;
  interruptionCount?: number;
  fallbackCount?: number;
  errorCount?: number;
  sttSuccessRate?: number;
  ttsSuccessRate?: number;
  llmSuccessRate?: number;
  userAbandoned?: boolean;
  sttProvider?: SttProviderName;
  ttsProvider?: TtsProviderName;
  llmProvider?: LlmProviderName;
  createdAt?: string;
}): SessionQualitySummary {
  return {
    sessionId: params.sessionId,
    durationSeconds: params.durationSeconds,
    turnCount: params.turnCount,
    interruptionCount: params.interruptionCount ?? 0,
    fallbackCount: params.fallbackCount ?? 0,
    errorCount: params.errorCount ?? 0,
    sttSuccessRate: params.sttSuccessRate ?? 1,
    ttsSuccessRate: params.ttsSuccessRate ?? 1,
    llmSuccessRate: params.llmSuccessRate ?? 1,
    userAbandoned: params.userAbandoned ?? false,
    sttProvider: params.sttProvider ?? "none",
    ttsProvider: params.ttsProvider ?? "none",
    llmProvider: params.llmProvider ?? "static",
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
}

function roundUsd(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function diffMs(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.max(0, Math.round(b - a));
}

function makeMetricId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// Demo / sample metrics — not production data.

export const SAMPLE_COST_BREAKDOWN: CostBreakdown = {
  sttUsd: 0.0354,
  ttsUsd: 0.0075,
  llmUsd: 0.0039,
  webrtcUsd: 0,
  gpuUsd: 0,
  storageUsd: 0,
  totalUsd: 0.0468,
};

export const SAMPLE_LATENCY_P50: LatencyBreakdown = {
  endpointingMs: 320,
  sttMs: 180,
  llmTtftMs: 250,
  ttsTtfaMs: 380,
  firstAudioMs: 890,
  totalMs: 1130,
};

export const SAMPLE_LATENCY_P95: LatencyBreakdown = {
  endpointingMs: 620,
  sttMs: 410,
  llmTtftMs: 510,
  ttsTtfaMs: 680,
  firstAudioMs: 1640,
  totalMs: 2120,
};

export const SAMPLE_LATENCY_P99: LatencyBreakdown = {
  endpointingMs: 980,
  sttMs: 710,
  llmTtftMs: 830,
  ttsTtfaMs: 1020,
  firstAudioMs: 2480,
  totalMs: 3140,
};

const sampleNow = new Date().toISOString();
const sampleSec = (s: number): string =>
  new Date(Date.now() + s * 1000).toISOString();

export const SAMPLE_TURN: TurnMetrics = {
  id: "demo_turn_001",
  sessionId: "demo_session_001",
  turnIndex: 0,
  userSpeechStartedAt: sampleNow,
  userSpeechEndedAt: sampleSec(2.1),
  sttFinalAt: sampleSec(2.4),
  llmFirstTokenAt: sampleSec(2.7),
  ttsFirstAudioAt: sampleSec(3.1),
  avatarStartedSpeakingAt: sampleSec(3.2),
  avatarStoppedSpeakingAt: sampleSec(7.8),
  interrupted: false,
  fallbackUsed: false,
};

export const SAMPLE_TURN_INTERRUPTED: TurnMetrics = {
  id: "demo_turn_002",
  sessionId: "demo_session_001",
  turnIndex: 1,
  userSpeechStartedAt: sampleSec(8.0),
  userSpeechEndedAt: sampleSec(9.5),
  sttFinalAt: sampleSec(9.8),
  llmFirstTokenAt: sampleSec(10.1),
  ttsFirstAudioAt: sampleSec(10.5),
  avatarStartedSpeakingAt: sampleSec(10.6),
  avatarStoppedSpeakingAt: sampleSec(14.0),
  interrupted: true,
  fallbackUsed: false,
};

export const SAMPLE_CALL_METRICS: CallMetrics = {
  id: "demo_call_001",
  sessionId: "demo_session_001",
  durationSeconds: 28.5,
  turnCount: 2,
  turns: [SAMPLE_TURN, SAMPLE_TURN_INTERRUPTED],
  cost: SAMPLE_COST_BREAKDOWN,
  latencyP50: SAMPLE_LATENCY_P50,
  latencyP95: SAMPLE_LATENCY_P95,
  latencyP99: SAMPLE_LATENCY_P99,
  sttProvider: "deepgram",
  ttsProvider: "elevenlabs",
  llmProvider: "static",
  transportProvider: "none",
  rendererProvider: "browser_3d",
  createdAt: sampleNow,
};

export const SAMPLE_WEBRTC_QUALITY_METRICS: WebRTCQualityMetrics = {
  sessionId: "demo_session_002",
  rttMs: 34,
  jitterMs: 8,
  packetLossPercent: 0.2,
  audioGapCount: 0,
  droppedFrames: 0,
  iceReconnects: 0,
  turnUsed: false,
  bitrateKbps: 128,
  codec: "opus",
  region: "us-east-1",
  createdAt: sampleNow,
};

export const SAMPLE_PROVIDER_USAGE: ProviderUsage = {
  sttSeconds: 45,
  sttProvider: "deepgram",
  ttsCharacters: 500,
  ttsProvider: "elevenlabs",
  llmInputTokens: 120,
  llmOutputTokens: 450,
  llmProvider: "static",
  gpuSeconds: 0,
  webrtcSessionMinutes: 0,
  transportProvider: "none",
  rendererProvider: "browser_3d",
  storageBytes: 0,
};

export const SAMPLE_SESSION_QUALITY_SUMMARY: SessionQualitySummary = {
  sessionId: "demo_session_001",
  durationSeconds: 28.5,
  turnCount: 2,
  interruptionCount: 1,
  fallbackCount: 0,
  errorCount: 0,
  sttSuccessRate: 1,
  ttsSuccessRate: 1,
  llmSuccessRate: 1,
  userAbandoned: false,
  sttProvider: "deepgram",
  ttsProvider: "elevenlabs",
  llmProvider: "static",
  createdAt: sampleNow,
};

export const SAMPLE_COST_BY_PROVIDER: Record<string, string> = {
  deepgram_stt: "$0.0059/min (demo estimate)",
  elevenlabs_tts: "$0.015 per 1k chars (demo estimate)",
  openai_llm_gpt4o_mini:
    "$0.00015 input / $0.0006 output per 1k tokens (demo estimate)",
  anthropic_llm_claude_haiku:
    "$0.00025 input / $0.00125 output per 1k tokens (demo estimate)",
  cartesia_tts: "$0.012 per cycle (demo estimate)",
  livekit_webrtc: "$0.004/min (demo estimate)",
  gpu_rendering: "$0.0013/sec (demo estimate)",
  storage: "$0.023/GB-month (demo estimate)",
};

export const SAMPLE_ETHEN_SESSION: CallMetrics = {
  id: "demo_ethen_session_001",
  sessionId: "demo_ethen_session_001",
  durationSeconds: 35.2,
  turnCount: 3,
  turns: [
    {
      id: "demo_ethen_turn_001",
      sessionId: "demo_ethen_session_001",
      turnIndex: 0,
      userSpeechEndedAt: sampleSec(1.5),
      sttFinalAt: sampleSec(1.8),
      llmFirstTokenAt: sampleSec(2.2),
      ttsFirstAudioAt: sampleSec(2.6),
      avatarStartedSpeakingAt: sampleSec(2.7),
      avatarStoppedSpeakingAt: sampleSec(8.1),
      interrupted: false,
      fallbackUsed: false,
    },
    {
      id: "demo_ethen_turn_002",
      sessionId: "demo_ethen_session_001",
      turnIndex: 1,
      userSpeechEndedAt: sampleSec(10.0),
      sttFinalAt: sampleSec(10.3),
      llmFirstTokenAt: sampleSec(10.7),
      ttsFirstAudioAt: sampleSec(11.1),
      avatarStartedSpeakingAt: sampleSec(11.2),
      avatarStoppedSpeakingAt: sampleSec(19.5),
      interrupted: false,
      fallbackUsed: false,
    },
    {
      id: "demo_ethen_turn_003",
      sessionId: "demo_ethen_session_001",
      turnIndex: 2,
      userSpeechEndedAt: sampleSec(22.0),
      sttFinalAt: sampleSec(22.3),
      llmFirstTokenAt: sampleSec(22.6),
      ttsFirstAudioAt: sampleSec(23.0),
      avatarStartedSpeakingAt: sampleSec(23.1),
      avatarStoppedSpeakingAt: sampleSec(30.0),
      interrupted: true,
      fallbackUsed: false,
    },
  ],
  cost: {
    sttUsd: 0.0531,
    ttsUsd: 0.0113,
    llmUsd: 0.0059,
    webrtcUsd: 0,
    gpuUsd: 0,
    storageUsd: 0,
    totalUsd: 0.0703,
  },
  latencyP50: {
    endpointingMs: 280,
    sttMs: 150,
    llmTtftMs: 220,
    ttsTtfaMs: 340,
    firstAudioMs: 790,
    totalMs: 990,
  },
  latencyP95: {
    endpointingMs: 560,
    sttMs: 380,
    llmTtftMs: 480,
    ttsTtfaMs: 620,
    firstAudioMs: 1430,
    totalMs: 1850,
  },
  latencyP99: {
    endpointingMs: 870,
    sttMs: 650,
    llmTtftMs: 760,
    ttsTtfaMs: 940,
    firstAudioMs: 2210,
    totalMs: 2750,
  },
  sttProvider: "deepgram",
  ttsProvider: "elevenlabs",
  llmProvider: "static",
  transportProvider: "none",
  rendererProvider: "browser_3d",
  createdAt: sampleNow,
};
