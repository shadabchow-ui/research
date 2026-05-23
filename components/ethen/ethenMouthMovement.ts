export const MOUTH_MIN = 0;
export const MOUTH_MAX = 1;
export const MOUTH_SMOOTH_FACTOR = 0.3;

export interface MouthMovementConfig {
  smoothFactor: number;
  minOpen: number;
  maxOpen: number;
}

export const DEFAULT_MOUTH_CONFIG: MouthMovementConfig = {
  smoothFactor: MOUTH_SMOOTH_FACTOR,
  minOpen: MOUTH_MIN,
  maxOpen: MOUTH_MAX,
};

export function amplitudeToMouthLevel(amplitude: number): number {
  return Math.max(MOUTH_MIN, Math.min(MOUTH_MAX, amplitude));
}

export interface MorphTargetMap {
  jawOpen?: string;
  mouthClose?: string;
  mouthSmileLeft?: string;
  mouthSmileRight?: string;
  mouthFrownLeft?: string;
  mouthFrownRight?: string;
  mouthPucker?: string;
  mouthFunnel?: string;
  mouthStretchLeft?: string;
  mouthStretchRight?: string;
  mouthRollLower?: string;
  mouthRollUpper?: string;
  mouthPressLeft?: string;
  mouthPressRight?: string;
  mouthLowerDownLeft?: string;
  mouthLowerDownRight?: string;
  mouthUpperUpLeft?: string;
  mouthUpperUpRight?: string;
  mouthLeft?: string;
  mouthRight?: string;
  mouthDimpleLeft?: string;
  mouthDimpleRight?: string;
  mouthShrugLower?: string;
  mouthShrugUpper?: string;
  cheekSquintLeft?: string;
  cheekSquintRight?: string;
  cheekPuff?: string;
  noseSneerLeft?: string;
  noseSneerRight?: string;
  tongueOut?: string;
}

export const PLACEHOLDER_MORPH_TARGETS: MorphTargetMap = {
  jawOpen: undefined,
  mouthClose: undefined,
};
