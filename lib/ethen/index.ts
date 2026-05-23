export { PRODUCT_KNOWLEDGE } from "./ethenProductKnowledge";
export type { KnowledgeEntry } from "./ethenProductKnowledge";
export { getGuideResponse } from "./ethenGuide";
export type { GuideResponse } from "./ethenGuide";
export type {
  ConversationPhase,
  ConversationFlowProfile,
  ConversationFlowEvent,
  InterruptResult,
  InterruptSource,
  TurnTakingPatience,
  Interruptibility,
  IdleEngagement,
  BackchannelTolerance,
  VoiceIsolation,
} from "./ethenConversationFlow";
export { DEFAULT_FLOW_PROFILE } from "./ethenConversationFlow";
export { transcribeAudio } from "./ethenStt";
export type { SttResult, SttProviderName, SttProviderConfig } from "./ethenStt";
export { synthesizeSpeech, isTtsProviderAvailable } from "./ethenTts";
export type { TtsResult, TtsProviderName, TtsProviderConfig } from "./ethenTts";
export { streamResponse, isLlmProviderAvailable } from "./ethenStreamingLlm";
export type {
  LlmProviderName,
  LlmProviderConfig,
  LlmStreamChunk,
  LlmResponseStatus,
  LlmResponse,
} from "./ethenStreamingLlm";
export {
  runVoicePipeline,
  runVoicePipelineSimultaneous,
  getVoicePipelineCapabilities,
} from "./ethenVoicePipeline";
export type {
  VoicePipelineInput,
  VoicePipelineEvent,
  VoicePipelineResult,
} from "./ethenVoicePipeline";

export type {
  VisemeId,
  VisemeFrame,
  VisemeTimeline,
  ProviderAdapter,
  ProviderAdapterResult,
  MorphTargetScheduler,
  OculusVisemeName,
  ArkitBlendshapeName,
  LipSyncQualityMode,
  OculusVisemeMapping,
  ArkitMorphTargetMapping,
} from "./ethenVisemes";

export {
  createEmptyVisemeTimeline,
  sampleTimelineFromText,
  clampVisemeWeight,
  resolveFallbackMouthOpen,
  estimateVisemeDuration,
  DEFAULT_OCULUS_TO_ARKIT,
  PLACEHOLDER_ARKIT_MAPPING,
  ARKIT_BLENDSHAPE_NAMES,
  OCULUS_VISEME_NAMES,
} from "./ethenVisemes";
