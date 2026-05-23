export type ModelType =
  | "browser_glb"
  | "vrm_3d"
  | "neural_video"
  | "vendor_video";

export type ReplicaStatus = "draft" | "active" | "suspended";

export type TrainingStatus =
  | "none"
  | "queued"
  | "training"
  | "ready"
  | "failed";

export type VoiceProvider =
  | "elevenlabs"
  | "cartesia"
  | "azure"
  | "openai"
  | "deepgram"
  | "custom"
  | "not_configured";

export type LiveAgentStatus = "draft" | "published" | "disabled";

export type ConversationStatus = "active" | "ended" | "failed";

export type SessionProvider = "none" | "livekit" | "daily" | "custom";

export type TurnTakingPatience = "low" | "medium" | "high";

export type Interruptibility = "low" | "medium" | "high";

export type IdleEngagement = "off" | "soft" | "eager";

export type BackchannelTolerance = "low" | "medium" | "high";

export type VoiceIsolation = "off" | "near" | "strong";

export type EmbedTheme = "light" | "dark" | "system";

export type EmbedPosition = "bottom-right" | "bottom-left" | "inline";

export type EmbedDefaultMode = "text" | "voice" | "video";

export type KnowledgeBaseIndexType = "static" | "vector" | "hybrid";

export type ConsentVerificationMethod =
  | "manual"
  | "liveness"
  | "document"
  | "enterprise_attestation";

export interface Tool {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  tone: string;
  guardrails: string[];
  knowledgeBaseIds: string[];
  tools: Tool[];
  defaultVoiceId: string;
  defaultReplicaId: string;
}

export interface Replica {
  id: string;
  name: string;
  modelType: ModelType;
  assetUri: string;
  voiceId?: string;
  consentRecordId?: string;
  trainingStatus?: TrainingStatus;
  status: ReplicaStatus;
}

export interface Voice {
  id: string;
  provider: VoiceProvider;
  externalVoiceId: string;
  language: string;
  style?: string;
  isCloned: boolean;
  consentRecordId?: string;
}

export interface LiveAgent {
  id: string;
  name: string;
  personaId: string;
  replicaId: string;
  voiceId: string;
  knowledgeBaseIds: string[];
  embedConfigId: string;
  conversationFlowProfileId?: string;
  status: LiveAgentStatus;
}

export interface Conversation {
  id: string;
  liveAgentId: string;
  userId?: string;
  sessionId: string;
  transcriptId?: string;
  startedAt: string;
  endedAt?: string;
  status: ConversationStatus;
}

export interface Session {
  id: string;
  conversationId: string;
  mediaRoomId?: string;
  provider: SessionProvider;
  reconnectCount: number;
  clientInfo: Record<string, unknown>;
  startedAt: string;
  endedAt?: string;
}

export interface TranscriptMessage {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export interface Transcript {
  id: string;
  conversationId: string;
  messages: TranscriptMessage[];
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  ownerId: string;
  conversationId?: string;
  videoId?: string;
  sessionMinutes: number;
  renderedVideoMinutes: number;
  sttSeconds: number;
  ttsCharacters: number;
  llmInputTokens: number;
  llmOutputTokens: number;
  gpuSeconds: number;
  recordedAt: string;
}

export interface EmbedConfig {
  id: string;
  liveAgentId: string;
  allowedDomains: string[];
  theme: EmbedTheme;
  position: EmbedPosition;
  defaultMode: EmbedDefaultMode;
  showBranding: boolean;
  leadCaptureEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  indexType: KnowledgeBaseIndexType;
  documentCount: number;
  lastUpdated: string;
}

export interface ConversationFlowProfile {
  id: string;
  name: string;
  turnTakingPatience: TurnTakingPatience;
  interruptibility: Interruptibility;
  idleEngagement: IdleEngagement;
  backchannelTolerance: BackchannelTolerance;
  voiceIsolation: VoiceIsolation;
  wakePhrase?: string;
}

export interface ConsentRecord {
  id: string;
  ownerId: string;
  replicaId: string;
  subjectName: string;
  consentTextVersion: string;
  signedAt: string;
  revocationStatus: "active" | "revoked";
  revokedAt?: string;
  verificationMethod: ConsentVerificationMethod;
}

export interface StudioVideo {
  id: string;
  title: string;
  personaId: string;
  replicaId: string;
  script: string;
  scenes: VideoScene[];
  renderStatus: "draft" | "queued" | "rendering" | "complete" | "failed";
  outputUrl?: string;
}

export interface VideoScene {
  index: number;
  personaId: string;
  replicaId: string;
  script: string;
  voiceoverId?: string;
  durationSeconds?: number;
}

export interface AvatarSessionToken {
  id: string;
  liveAgentId: string;
  allowedDomain: string;
  expiresAt: string;
  permissions: string[];
  sessionId?: string;
  issuedAt: string;
  revokedAt?: string;
}

export interface AvatarEvent {
  id: string;
  sessionId: string;
  conversationId?: string;
  agentId?: string;
  type: string;
  seq: number;
  turnIndex?: number;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface RendererSession {
  id: string;
  conversationId: string;
  rendererType:
    | "browser_3d"
    | "neural_video"
    | "unreal_stream"
    | "vendor_video";
  region: string;
  status: "starting" | "active" | "recovering" | "ended" | "failed";
  gpuWorkerId?: string;
  streamUrl?: string;
  startedAt: string;
  endedAt?: string;
}
