export const ETHEN_STATES = [
  "idle",
  "listening",
  "user_speaking",
  "thinking",
  "speaking",
  "interrupted",
  "recovering",
  "offline",
  "error",
] as const;

export type EthenBehaviorState = (typeof ETHEN_STATES)[number];

export interface EthenBehaviorConfig {
  blinkIntervalMs: number;
  idleSwayIntensity: number;
  transitionSpeedMs: number;
  reducedMotion: boolean;
}

export interface EthenBehaviorControls {
  blink: boolean;
  gazeTarget: "center" | "slight_left" | "slight_right" | "down";
  headMovementIntensity: number;
  breathingIntensity: number;
  mouthOpen: number;
  statusLabel: string;
  glowIntensity: "off" | "subtle" | "medium" | "strong";
}

export const STATE_CONTROLS: Record<EthenBehaviorState, EthenBehaviorControls> =
  {
    idle: {
      blink: true,
      gazeTarget: "center",
      headMovementIntensity: 0.2,
      breathingIntensity: 0.3,
      mouthOpen: 0,
      statusLabel: "Idle",
      glowIntensity: "subtle",
    },
    listening: {
      blink: false,
      gazeTarget: "center",
      headMovementIntensity: 0.1,
      breathingIntensity: 0.15,
      mouthOpen: 0,
      statusLabel: "Listening",
      glowIntensity: "medium",
    },
    user_speaking: {
      blink: true,
      gazeTarget: "center",
      headMovementIntensity: 0.05,
      breathingIntensity: 0.1,
      mouthOpen: 0,
      statusLabel: "User speaking",
      glowIntensity: "medium",
    },
    thinking: {
      blink: true,
      gazeTarget: "slight_right",
      headMovementIntensity: 0.05,
      breathingIntensity: 0.1,
      mouthOpen: 0,
      statusLabel: "Thinking",
      glowIntensity: "strong",
    },
    speaking: {
      blink: false,
      gazeTarget: "center",
      headMovementIntensity: 0.15,
      breathingIntensity: 0.4,
      mouthOpen: 0.5,
      statusLabel: "Speaking",
      glowIntensity: "strong",
    },
    interrupted: {
      blink: true,
      gazeTarget: "down",
      headMovementIntensity: 0.05,
      breathingIntensity: 0.1,
      mouthOpen: 0,
      statusLabel: "Interrupted",
      glowIntensity: "subtle",
    },
    recovering: {
      blink: true,
      gazeTarget: "center",
      headMovementIntensity: 0.1,
      breathingIntensity: 0.15,
      mouthOpen: 0,
      statusLabel: "Recovering",
      glowIntensity: "subtle",
    },
    offline: {
      blink: false,
      gazeTarget: "down",
      headMovementIntensity: 0,
      breathingIntensity: 0.05,
      mouthOpen: 0,
      statusLabel: "Offline",
      glowIntensity: "off",
    },
    error: {
      blink: false,
      gazeTarget: "down",
      headMovementIntensity: 0,
      breathingIntensity: 0.05,
      mouthOpen: 0,
      statusLabel: "Error",
      glowIntensity: "off",
    },
  };

export const STATE_TRANSITIONS: Partial<
  Record<EthenBehaviorState, EthenBehaviorState[]>
> = {
  idle: ["listening", "speaking", "offline", "error"],
  listening: ["user_speaking", "thinking", "speaking", "idle", "error"],
  user_speaking: ["thinking", "listening", "idle", "error"],
  thinking: ["speaking", "idle", "error"],
  speaking: ["interrupted", "idle", "error"],
  interrupted: ["recovering"],
  recovering: ["idle", "listening", "speaking", "error"],
  offline: ["idle", "error"],
  error: ["recovering", "offline"],
};
