// Provider-neutral viseme/lip-sync pipeline types for Ethen.
// This defines the shape of viseme timelines, morph target mappings,
// and provider adapter interfaces — without implementing any specific
// provider SDK (Rhubarb, Azure, Oculus, ARKit, AnimaSync).
//
// Current state: WebAudio amplitude → mouthOpen/jawOpen only.
// Next state: provider-neutral VisemeTimeline → morph target scheduler.

export const OCULUS_VISEME_NAMES = [
  "sil", // silence
  "PP", // bilabial plosive
  "FF", // labiodental fricative
  "TH", // dental fricative
  "DD", // alveolar plosive
  "kk", // velar plosive
  "CH", // postalveolar affricate
  "SS", // alveolar fricative
  "nn", // alveolar nasal
  "RR", // rhotic
  "aa", // open back vowel
  "E", // open-mid front vowel
  "ih", // lax close front vowel
  "oh", // open-mid back vowel
  "ou", // close-mid back vowel
] as const;

export type OculusVisemeName = (typeof OCULUS_VISEME_NAMES)[number];

export const ARKIT_BLENDSHAPE_NAMES = [
  "mouthSmileLeft",
  "mouthSmileRight",
  "mouthFrownLeft",
  "mouthFrownRight",
  "mouthDimpleLeft",
  "mouthDimpleRight",
  "mouthStretchLeft",
  "mouthStretchRight",
  "mouthRollLower",
  "mouthRollUpper",
  "mouthShrugLower",
  "mouthShrugUpper",
  "mouthPressLeft",
  "mouthPressRight",
  "mouthLowerDownLeft",
  "mouthLowerDownRight",
  "mouthUpperUpLeft",
  "mouthUpperUpRight",
  "mouthLeft",
  "mouthRight",
  "mouthFunnel",
  "mouthPucker",
  "mouthClose",
  "jawOpen",
  "jawLeft",
  "jawRight",
  "jawForward",
  "cheekSquintLeft",
  "cheekSquintRight",
  "cheekPuff",
  "noseSneerLeft",
  "noseSneerRight",
  "tongueOut",
  "eyeLookDownLeft",
  "eyeLookDownRight",
  "eyeLookUpLeft",
  "eyeLookUpRight",
  "eyeLookInLeft",
  "eyeLookInRight",
  "eyeLookOutLeft",
  "eyeLookOutRight",
  "eyeBlinkLeft",
  "eyeBlinkRight",
  "eyeSquintLeft",
  "eyeSquintRight",
  "eyeWideLeft",
  "eyeWideRight",
  "browDownLeft",
  "browDownRight",
  "browInnerUp",
  "browOuterUpLeft",
  "browOuterUpRight",
] as const;

export type ArkitBlendshapeName = (typeof ARKIT_BLENDSHAPE_NAMES)[number];

export type VisemeId = string;

export type LipSyncQualityMode =
  | "amplitude_only" // WebAudio amplitude → jawOpen (current)
  | "basic_viseme" // timed viseme frames scheduled manually
  | "provider_viseme" // Azure/Oculus/AnimaSync provider events
  | "arkit_blendshapes" // full ARKit 52 blendshape animation
  | "server_streaming"; // server-side ARKit blendshape streaming

export interface VisemeFrame {
  timeMs: number;
  visemeId: VisemeId;
  weight: number;
}

export interface VisemeTimeline {
  id: string;
  sourceText: string;
  totalDurationMs: number;
  qualityMode: LipSyncQualityMode;
  frames: VisemeFrame[];
  createdAt: string;
  providerMetadata?: Record<string, unknown>;
}

export interface ProviderAdapterResult {
  timeline: VisemeTimeline;
  audioBase64?: string;
  providerName: string;
  providerLatencyMs: number;
  warnings: string[];
}

export interface ProviderAdapter {
  name: string;
  qualityMode: LipSyncQualityMode;
  isAvailable: () => boolean;
  generateTimeline: (
    text: string,
    audioBase64?: string,
    options?: Record<string, unknown>,
  ) => Promise<ProviderAdapterResult>;
}

export interface OculusVisemeMapping {
  oculusViseme: OculusVisemeName;
  morphTarget: ArkitBlendshapeName;
  weight: number;
}

export interface ArkitMorphTargetMapping {
  arkitBlendshape: ArkitBlendshapeName;
  modelMorphTarget: string;
  weightMultiplier: number;
}

export interface MorphTargetScheduler {
  targetFps: number;
  interpolationMs: number;
  applyFrame: (frame: VisemeFrame) => void;
  applyTimeline: (timeline: VisemeTimeline) => void;
  stop: () => void;
}

// Default Oculus viseme to ARKit blendshape mappings.
// These are reference-only; actual model morph target names
// depend on the GLB/VRM file.
export const DEFAULT_OCULUS_TO_ARKIT: OculusVisemeMapping[] = [
  { oculusViseme: "PP", morphTarget: "mouthPucker", weight: 1.0 },
  { oculusViseme: "FF", morphTarget: "mouthStretchRight", weight: 0.6 },
  { oculusViseme: "TH", morphTarget: "mouthStretchLeft", weight: 0.4 },
  { oculusViseme: "DD", morphTarget: "mouthClose", weight: 0.5 },
  { oculusViseme: "kk", morphTarget: "mouthFunnel", weight: 0.5 },
  { oculusViseme: "CH", morphTarget: "mouthPucker", weight: 0.7 },
  { oculusViseme: "SS", morphTarget: "mouthStretchRight", weight: 0.7 },
  { oculusViseme: "nn", morphTarget: "mouthClose", weight: 0.3 },
  { oculusViseme: "RR", morphTarget: "mouthFunnel", weight: 0.6 },
  { oculusViseme: "aa", morphTarget: "jawOpen", weight: 1.0 },
  { oculusViseme: "E", morphTarget: "mouthSmileLeft", weight: 0.8 },
  { oculusViseme: "ih", morphTarget: "mouthSmileLeft", weight: 0.5 },
  { oculusViseme: "oh", morphTarget: "mouthFunnel", weight: 0.6 },
  { oculusViseme: "ou", morphTarget: "mouthPucker", weight: 0.5 },
];

// These are placeholder morph target names.
// Replace with actual names from the GLB/VRM model once available.
export const PLACEHOLDER_ARKIT_MAPPING: ArkitMorphTargetMapping[] = [
  {
    arkitBlendshape: "jawOpen",
    modelMorphTarget: "jawOpen",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthClose",
    modelMorphTarget: "mouthClose",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthPucker",
    modelMorphTarget: "mouthPucker",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthFunnel",
    modelMorphTarget: "mouthFunnel",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthSmileLeft",
    modelMorphTarget: "mouthSmileLeft",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthSmileRight",
    modelMorphTarget: "mouthSmileRight",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthStretchLeft",
    modelMorphTarget: "mouthStretchLeft",
    weightMultiplier: 1.0,
  },
  {
    arkitBlendshape: "mouthStretchRight",
    modelMorphTarget: "mouthStretchRight",
    weightMultiplier: 1.0,
  },
];

export function createEmptyVisemeTimeline(
  sourceText: string,
  qualityMode: LipSyncQualityMode = "amplitude_only",
): VisemeTimeline {
  return {
    id: `viseme_${Date.now()}`,
    sourceText,
    totalDurationMs: 0,
    qualityMode,
    frames: [],
    createdAt: new Date().toISOString(),
  };
}

export function sampleTimelineFromText(
  text: string,
  estimatedDurationMs: number,
  visemeCount = 8,
): VisemeTimeline {
  const timeline = createEmptyVisemeTimeline(text, "basic_viseme");
  timeline.totalDurationMs = estimatedDurationMs;

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return timeline;

  const intervalMs = estimatedDurationMs / visemeCount;

  for (let i = 0; i < visemeCount; i++) {
    const wordIdx = Math.floor((i / visemeCount) * words.length);
    const word = words[wordIdx] ?? words[words.length - 1] ?? "";
    const lowerWord = word.toLowerCase();

    const visemeId = SAMPLE_WORD_TO_VISEME[lowerWord] ?? "aa";

    timeline.frames.push({
      timeMs: Math.round(i * intervalMs),
      visemeId,
      weight: 0.3 + Math.random() * 0.7,
    });
  }

  return timeline;
}

export function clampVisemeWeight(weight: number): number {
  return Math.max(0, Math.min(1, weight));
}

export function resolveFallbackMouthOpen(
  amplitude: number,
  visemeWeight: number | undefined,
  qualityMode: LipSyncQualityMode,
): number {
  if (qualityMode === "amplitude_only") {
    return clampVisemeWeight(amplitude);
  }

  if (visemeWeight !== undefined) {
    const blended = amplitude * 0.3 + visemeWeight * 0.7;
    return clampVisemeWeight(blended);
  }

  return clampVisemeWeight(amplitude);
}

export function estimateVisemeDuration(
  text: string,
  wordsPerSecond = 2.5,
  phonemesPerWord = 3,
): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) return 0;
  return Math.round(((wordCount * phonemesPerWord) / wordsPerSecond) * 1000);
}

// Simple word-to-viseme mapping for the sampleTimelineFromText helper.
// This is a rough lookup table, not phoneme-based NLP.
const SAMPLE_WORD_TO_VISEME: Record<string, VisemeId> = {
  i: "aa",
  we: "ou",
  you: "ou",
  they: "aa",
  the: "nn",
  a: "aa",
  an: "aa",
  and: "aa",
  is: "ih",
  are: "aa",
  am: "aa",
  be: "ih",
  was: "oh",
  were: "E",
  been: "ih",
  have: "aa",
  has: "aa",
  had: "aa",
  do: "ou",
  does: "ou",
  did: "ih",
  will: "ih",
  would: "ou",
  can: "aa",
  could: "ou",
  should: "ou",
  may: "aa",
  might: "ih",
  not: "oh",
  no: "ou",
  yes: "E",
  hello: "E",
  hi: "ih",
  hey: "aa",
  this: "TH",
  that: "TH",
  there: "TH",
  then: "nn",
  think: "TH",
  thing: "TH",
  thank: "TH",
  for: "FF",
  from: "FF",
  first: "FF",
  very: "FF",
  visit: "FF",
  what: "oh",
  when: "nn",
  where: "E",
  which: "ih",
  who: "ou",
  how: "aa",
  help: "E",
  explain: "E",
  describe: "ih",
  show: "ou",
  see: "ih",
  say: "aa",
  good: "ou",
  great: "aa",
  nice: "ih",
  build: "ih",
  create: "aa",
  make: "aa",
  work: "E",
  works: "E",
  working: "E",
  use: "ou",
  using: "ou",
  used: "ou",
  need: "ih",
  want: "oh",
  like: "ih",
  know: "ou",
  new: "ou",
  now: "aa",
  page: "PP",
  pages: "PP",
  product: "PP",
  platform: "PP",
  person: "PP",
  persona: "PP",
  avatar: "aa",
  avatars: "aa",
  live: "ih",
  studio: "ou",
  video: "ih",
  interactive: "ih",
  agent: "aa",
  agents: "aa",
  guide: "ih",
  chat: "CH",
  check: "CH",
  choose: "CH",
  browser: "PP",
  three: "TH",
  webgl: "E",
  api: "aa",
  embed: "E",
  webhook: "E",
  session: "SS",
  sessions: "SS",
  streaming: "SS",
  pricing: "PP",
  price: "PP",
  plan: "PP",
  start: "PP",
  started: "PP",
  stop: "PP",
  speak: "PP",
  speaking: "PP",
  speech: "PP",
  ask: "aa",
  answer: "aa",
  question: "kk",
  render: "RR",
  renderer: "RR",
  rendering: "RR",
  real: "RR",
  right: "RR",
  run: "RR",
};
