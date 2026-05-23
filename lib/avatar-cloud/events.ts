// ─── Avatar Event Protocol v1 ───────────────────────────────────────────────
// Provider-neutral event protocol for Upcube Avatar Cloud sessions.
// All events are client-generated or session-runtime generated.
// No persistence, database, streaming backend, or telemetry wiring included.

// ─── Base event shape ────────────────────────────────────────────────────────

export interface AvatarEventBase {
  /** Unique event ID. Generate with crypto.randomUUID() or equivalent. */
  id: string;
  /** Session this event belongs to. */
  sessionId: string;
  /** Event type discriminator. */
  type: AvatarEventType;
  /** Monotonic sequence number within the session. */
  seq: number;
  /** ISO-8601 timestamp of event creation. */
  timestamp: string;
  /** Optional conversation ID when a specific conversation is active. */
  conversationId?: string;
  /** Optional agent/persona ID when multiple agents may exist per session. */
  agentId?: string;
  /** Optional turn index within the conversation. */
  turnIndex?: number;
}

// ─── Event type literal union ────────────────────────────────────────────────

export type AvatarEventType =
  | SessionEventType
  | UserEventType
  | SttEventType
  | LlmEventType
  | TtsEventType
  | AvatarStateEventType
  | ToolEventType
  | BillingEventType
  | "error";

export type SessionEventType =
  | "session.created"
  | "session.started"
  | "session.ended";

export type UserEventType =
  | "user.message"
  | "user.started_speaking"
  | "user.stopped_speaking"
  | "user.interrupted";

export type SttEventType = "stt.partial" | "stt.final";

export type LlmEventType =
  | "llm.started"
  | "llm.first_token"
  | "llm.completed"
  | "llm.cancelled";

export type TtsEventType =
  | "tts.started"
  | "tts.first_audio"
  | "tts.completed"
  | "tts.cancelled";

export type AvatarStateEventType =
  | "avatar.idle"
  | "avatar.listening"
  | "avatar.thinking"
  | "avatar.started_speaking"
  | "avatar.stopped_speaking"
  | "avatar.interrupted"
  | "avatar.error";

export type ToolEventType = "tool.called" | "tool.completed" | "tool.failed";

export type BillingEventType = "billing.usage_incremented";

// ─── Payload types per event ─────────────────────────────────────────────────

export interface SessionCreatedPayload {
  metadata?: Record<string, string>;
}

export interface SessionStartedPayload {
  startedAt: string;
}

export interface SessionEndedPayload {
  endedAt: string;
  durationMs?: number;
  reason?: "user_disconnected" | "timeout" | "error" | "admin";
}

export interface UserMessagePayload {
  text: string;
}

export interface UserStartedSpeakingPayload {
  /** Empty — the event itself serves as the timestamp marker. */
}

export interface UserStoppedSpeakingPayload {
  durationMs?: number;
}

export interface UserInterruptedPayload {
  source?: "user_button" | "user_speech" | "audio_end" | "reset";
}

export interface SttPartialPayload {
  text: string;
  confidence?: number;
  language?: string;
}

export interface SttFinalPayload {
  text: string;
  confidence?: number;
  language?: string;
  durationMs?: number;
}

export interface LlmStartedPayload {
  inputText?: string;
}

export interface LlmFirstTokenPayload {
  /** Latency from llm.started to first token in ms. */
  latencyMs: number;
}

export interface LlmCompletedPayload {
  fullText: string;
  totalTokens?: number;
  /** Latency from llm.started to completion in ms. */
  totalLatencyMs?: number;
}

export interface LlmCancelledPayload {
  reason?: "user_interrupted" | "timeout" | "error";
}

export interface TtsStartedPayload {
  text: string;
  voiceId?: string;
}

export interface TtsFirstAudioPayload {
  /** Latency from tts.started to first audio in ms. */
  latencyMs: number;
}

export interface TtsCompletedPayload {
  audioLengthMs?: number;
  contentType?: string;
}

export interface TtsCancelledPayload {
  reason?: "user_interrupted" | "timeout" | "error";
}

export interface AvatarIdlePayload {
  previousState?: string;
}

export interface AvatarListeningPayload {
  previousState?: string;
}

export interface AvatarThinkingPayload {
  previousState?: string;
}

export interface AvatarStartedSpeakingPayload {
  previousState?: string;
}

export interface AvatarStoppedSpeakingPayload {
  previousState?: string;
}

export interface AvatarInterruptedPayload {
  previousState?: string;
  source?: "user_button" | "user_speech" | "audio_end" | "error" | "reset";
}

export interface AvatarErrorPayload {
  message: string;
  previousState?: string;
  recoverable?: boolean;
}

export interface ToolCalledPayload {
  toolName: string;
  args?: Record<string, unknown>;
}

export interface ToolCompletedPayload {
  toolName: string;
  result?: unknown;
  durationMs?: number;
}

export interface ToolFailedPayload {
  toolName: string;
  error: string;
  durationMs?: number;
}

export interface BillingUsageIncrementedPayload {
  provider: string;
  metric: string;
  units: number;
  estimatedCost?: number;
}

export interface ErrorPayload {
  message: string;
  code?: string;
  context?: string;
  recoverable?: boolean;
}

// ─── Discriminated event union ───────────────────────────────────────────────

export interface AvatarEventSessionCreated extends AvatarEventBase {
  type: "session.created";
  payload: SessionCreatedPayload;
}

export interface AvatarEventSessionStarted extends AvatarEventBase {
  type: "session.started";
  payload: SessionStartedPayload;
}

export interface AvatarEventSessionEnded extends AvatarEventBase {
  type: "session.ended";
  payload: SessionEndedPayload;
}

export interface AvatarEventUserMessage extends AvatarEventBase {
  type: "user.message";
  payload: UserMessagePayload;
}

export interface AvatarEventUserStartedSpeaking extends AvatarEventBase {
  type: "user.started_speaking";
  payload: UserStartedSpeakingPayload;
}

export interface AvatarEventUserStoppedSpeaking extends AvatarEventBase {
  type: "user.stopped_speaking";
  payload: UserStoppedSpeakingPayload;
}

export interface AvatarEventUserInterrupted extends AvatarEventBase {
  type: "user.interrupted";
  payload: UserInterruptedPayload;
}

export interface AvatarEventSttPartial extends AvatarEventBase {
  type: "stt.partial";
  payload: SttPartialPayload;
}

export interface AvatarEventSttFinal extends AvatarEventBase {
  type: "stt.final";
  payload: SttFinalPayload;
}

export interface AvatarEventLlmStarted extends AvatarEventBase {
  type: "llm.started";
  payload: LlmStartedPayload;
}

export interface AvatarEventLlmFirstToken extends AvatarEventBase {
  type: "llm.first_token";
  payload: LlmFirstTokenPayload;
}

export interface AvatarEventLlmCompleted extends AvatarEventBase {
  type: "llm.completed";
  payload: LlmCompletedPayload;
}

export interface AvatarEventLlmCancelled extends AvatarEventBase {
  type: "llm.cancelled";
  payload: LlmCancelledPayload;
}

export interface AvatarEventTtsStarted extends AvatarEventBase {
  type: "tts.started";
  payload: TtsStartedPayload;
}

export interface AvatarEventTtsFirstAudio extends AvatarEventBase {
  type: "tts.first_audio";
  payload: TtsFirstAudioPayload;
}

export interface AvatarEventTtsCompleted extends AvatarEventBase {
  type: "tts.completed";
  payload: TtsCompletedPayload;
}

export interface AvatarEventTtsCancelled extends AvatarEventBase {
  type: "tts.cancelled";
  payload: TtsCancelledPayload;
}

export interface AvatarEventAvatarIdle extends AvatarEventBase {
  type: "avatar.idle";
  payload: AvatarIdlePayload;
}

export interface AvatarEventAvatarListening extends AvatarEventBase {
  type: "avatar.listening";
  payload: AvatarListeningPayload;
}

export interface AvatarEventAvatarThinking extends AvatarEventBase {
  type: "avatar.thinking";
  payload: AvatarThinkingPayload;
}

export interface AvatarEventAvatarStartedSpeaking extends AvatarEventBase {
  type: "avatar.started_speaking";
  payload: AvatarStartedSpeakingPayload;
}

export interface AvatarEventAvatarStoppedSpeaking extends AvatarEventBase {
  type: "avatar.stopped_speaking";
  payload: AvatarStoppedSpeakingPayload;
}

export interface AvatarEventAvatarInterrupted extends AvatarEventBase {
  type: "avatar.interrupted";
  payload: AvatarInterruptedPayload;
}

export interface AvatarEventAvatarError extends AvatarEventBase {
  type: "avatar.error";
  payload: AvatarErrorPayload;
}

export interface AvatarEventToolCalled extends AvatarEventBase {
  type: "tool.called";
  payload: ToolCalledPayload;
}

export interface AvatarEventToolCompleted extends AvatarEventBase {
  type: "tool.completed";
  payload: ToolCompletedPayload;
}

export interface AvatarEventToolFailed extends AvatarEventBase {
  type: "tool.failed";
  payload: ToolFailedPayload;
}

export interface AvatarEventBillingUsageIncremented extends AvatarEventBase {
  type: "billing.usage_incremented";
  payload: BillingUsageIncrementedPayload;
}

export interface AvatarEventError extends AvatarEventBase {
  type: "error";
  payload: ErrorPayload;
}

export type AvatarEvent =
  | AvatarEventSessionCreated
  | AvatarEventSessionStarted
  | AvatarEventSessionEnded
  | AvatarEventUserMessage
  | AvatarEventUserStartedSpeaking
  | AvatarEventUserStoppedSpeaking
  | AvatarEventUserInterrupted
  | AvatarEventSttPartial
  | AvatarEventSttFinal
  | AvatarEventLlmStarted
  | AvatarEventLlmFirstToken
  | AvatarEventLlmCompleted
  | AvatarEventLlmCancelled
  | AvatarEventTtsStarted
  | AvatarEventTtsFirstAudio
  | AvatarEventTtsCompleted
  | AvatarEventTtsCancelled
  | AvatarEventAvatarIdle
  | AvatarEventAvatarListening
  | AvatarEventAvatarThinking
  | AvatarEventAvatarStartedSpeaking
  | AvatarEventAvatarStoppedSpeaking
  | AvatarEventAvatarInterrupted
  | AvatarEventAvatarError
  | AvatarEventToolCalled
  | AvatarEventToolCompleted
  | AvatarEventToolFailed
  | AvatarEventBillingUsageIncremented
  | AvatarEventError;

// ─── Sequence tracker (lightweight, no external state) ───────────────────────

export interface EventSeqCounter {
  next(): number;
  current(): number;
  reset(): void;
}

export function createEventSeqCounter(start = 1): EventSeqCounter {
  let seq = start;
  return {
    next: () => seq++,
    current: () => seq - 1,
    reset: () => {
      seq = 1;
    },
  };
}

// ─── Helper functions ────────────────────────────────────────────────────────

export interface CreateEventOptions {
  id?: string;
  seq?: number;
  timestamp?: string;
  sessionId: string;
  conversationId?: string;
  agentId?: string;
  turnIndex?: number;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeTimestamp(): string {
  return new Date().toISOString();
}

export function createAvatarEvent<T extends AvatarEventType, P = unknown>(
  type: T,
  payload: P,
  options: CreateEventOptions,
): AvatarEventBase & { type: T; payload: P } {
  return {
    id: options.id ?? makeId(),
    sessionId: options.sessionId,
    type,
    seq: options.seq ?? 0,
    timestamp: options.timestamp ?? makeTimestamp(),
    conversationId: options.conversationId,
    agentId: options.agentId,
    turnIndex: options.turnIndex,
    payload,
  };
}

export function createSessionEvent(
  type: SessionEventType,
  payload: SessionCreatedPayload | SessionStartedPayload | SessionEndedPayload,
  options: CreateEventOptions,
) {
  return createAvatarEvent(type, payload, options);
}

export function createErrorEvent(
  message: string,
  options: CreateEventOptions & {
    code?: string;
    context?: string;
    recoverable?: boolean;
  },
) {
  return createAvatarEvent(
    "error",
    {
      message,
      code: options.code,
      context: options.context,
      recoverable: options.recoverable,
    } satisfies ErrorPayload,
    options,
  );
}

// ─── Type helpers for filtering ──────────────────────────────────────────────

export function isEventType<T extends AvatarEventType>(
  event: AvatarEvent,
  type: T,
): event is Extract<AvatarEvent, { type: T }> {
  return event.type === type;
}

export function isSessionEvent(
  event: AvatarEvent,
): event is
  | AvatarEventSessionCreated
  | AvatarEventSessionStarted
  | AvatarEventSessionEnded {
  return event.type.startsWith("session.");
}

export function isUserEvent(
  event: AvatarEvent,
): event is
  | AvatarEventUserMessage
  | AvatarEventUserStartedSpeaking
  | AvatarEventUserStoppedSpeaking
  | AvatarEventUserInterrupted {
  return event.type.startsWith("user.");
}

export function isSttEvent(
  event: AvatarEvent,
): event is AvatarEventSttPartial | AvatarEventSttFinal {
  return event.type.startsWith("stt.");
}

export function isLlmEvent(
  event: AvatarEvent,
): event is
  | AvatarEventLlmStarted
  | AvatarEventLlmFirstToken
  | AvatarEventLlmCompleted
  | AvatarEventLlmCancelled {
  return event.type.startsWith("llm.");
}

export function isTtsEvent(
  event: AvatarEvent,
): event is
  | AvatarEventTtsStarted
  | AvatarEventTtsFirstAudio
  | AvatarEventTtsCompleted
  | AvatarEventTtsCancelled {
  return event.type.startsWith("tts.");
}

export function isAvatarStateEvent(
  event: AvatarEvent,
): event is
  | AvatarEventAvatarIdle
  | AvatarEventAvatarListening
  | AvatarEventAvatarThinking
  | AvatarEventAvatarStartedSpeaking
  | AvatarEventAvatarStoppedSpeaking
  | AvatarEventAvatarInterrupted
  | AvatarEventAvatarError {
  return event.type.startsWith("avatar.");
}

export function isToolEvent(
  event: AvatarEvent,
): event is
  | AvatarEventToolCalled
  | AvatarEventToolCompleted
  | AvatarEventToolFailed {
  return event.type.startsWith("tool.");
}

export function isBillingEvent(
  event: AvatarEvent,
): event is AvatarEventBillingUsageIncremented {
  return event.type.startsWith("billing.");
}

// ─── Event categories for grouping / filtering ───────────────────────────────

export const EVENT_CATEGORIES = {
  session: ["session.created", "session.started", "session.ended"] as const,
  user: [
    "user.message",
    "user.started_speaking",
    "user.stopped_speaking",
    "user.interrupted",
  ] as const,
  stt: ["stt.partial", "stt.final"] as const,
  llm: [
    "llm.started",
    "llm.first_token",
    "llm.completed",
    "llm.cancelled",
  ] as const,
  tts: [
    "tts.started",
    "tts.first_audio",
    "tts.completed",
    "tts.cancelled",
  ] as const,
  avatar: [
    "avatar.idle",
    "avatar.listening",
    "avatar.thinking",
    "avatar.started_speaking",
    "avatar.stopped_speaking",
    "avatar.interrupted",
    "avatar.error",
  ] as const,
  tool: ["tool.called", "tool.completed", "tool.failed"] as const,
  billing: ["billing.usage_incremented"] as const,
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORIES;

export function getEventCategory(type: AvatarEventType): EventCategory {
  const prefix = type.split(".")[0] ?? "";
  if (prefix === "error") return "session";
  if (prefix in EVENT_CATEGORIES) return prefix as EventCategory;
  return "session";
}
