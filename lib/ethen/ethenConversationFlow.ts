import type { EthenBehaviorState } from "components/ethen/ethenBehaviorTypes";

export type ConversationPhase = EthenBehaviorState;

export type TurnTakingPatience = "low" | "medium" | "high";

export type Interruptibility = "low" | "medium" | "high";

export type IdleEngagement = "off" | "soft" | "eager";

export type BackchannelTolerance = "low" | "medium" | "high";

export type VoiceIsolation = "off" | "near" | "strong";

export interface ConversationFlowProfile {
  turnTakingPatience: TurnTakingPatience;
  interruptibility: Interruptibility;
  idleEngagement: IdleEngagement;
  backchannelTolerance: BackchannelTolerance;
  voiceIsolation: VoiceIsolation;
}

export const DEFAULT_FLOW_PROFILE: ConversationFlowProfile = {
  turnTakingPatience: "medium",
  interruptibility: "high",
  idleEngagement: "soft",
  backchannelTolerance: "medium",
  voiceIsolation: "near",
};

export type InterruptSource =
  | "user_button"
  | "user_speech"
  | "audio_end"
  | "error"
  | "reset";

export interface ConversationFlowEvent {
  type: "phase_change";
  from: ConversationPhase;
  to: ConversationPhase;
  timestamp: number;
  source?: InterruptSource;
}

export interface InterruptResult {
  wasInterrupted: boolean;
  source: InterruptSource;
  previousPhase: ConversationPhase;
}
