# Ethen Lip-Sync / Viseme Pipeline

## Current State

**WebAudio amplitude mouth movement** — the only active lip-sync level.

- `useWebAudioMouthMovement` extracts audio amplitude via `AnalyserNode.getByteTimeDomainData`
- Output: `mouthLevel` (0–1) smoothed with lerp
- Fed into `useEthenBehavior.mouthOpenOverride` which drives `mouthOpen`
- Visual fallback: CSS-animated oval below avatar eyes in `ethen-behavior-panel.tsx`
- No morph targets, no viseme scheduling, no provider integration

## Provider-Neutral Viseme Types

Defined in `lib/ethen/ethenVisemes.ts`:

- **VisemeFrame** — `{ timeMs, visemeId, weight }` — a single timed viseme keyframe
- **VisemeTimeline** — `{ id, sourceText, totalDurationMs, qualityMode, frames[], createdAt }`
- **ProviderAdapter** — interface for viseme generation: `{ name, qualityMode, isAvailable(), generateTimeline() }`
- **ProviderAdapterResult** — `{ timeline, audioBase64, providerName, providerLatencyMs, warnings }`
- **MorphTargetScheduler** — interface for applying viseme timelines to a 3D model: `{ targetFps, applyFrame(), applyTimeline(), stop() }`

## Quality Modes (LipSyncQualityMode)

1. **amplitude_only** (current) — WebAudio RMS → jawOpen/mouthOpen
2. **basic_viseme** — manually scheduled viseme frames (sampleTimelineFromText)
3. **provider_viseme** — Azure/Oculus/AnimaSync provider viseme events
4. **arkit_blendshapes** — full ARKit 52 blendshape animation
5. **server_streaming** — server-side ARKit blendshape streaming

## Morph Target Names

Defined in `components/ethen/ethenMouthMovement.ts` — `MorphTargetMap` with 30 face/mouth morph target slots:

```
jawOpen, mouthClose, mouthSmileLeft, mouthSmileRight,
mouthFrownLeft, mouthFrownRight, mouthPucker, mouthFunnel,
mouthStretchLeft, mouthStretchRight, mouthRollLower, mouthRollUpper,
mouthPressLeft, mouthPressRight, mouthLowerDownLeft, mouthLowerDownRight,
mouthUpperUpLeft, mouthUpperUpRight, mouthLeft, mouthRight,
mouthDimpleLeft, mouthDimpleRight, mouthShrugLower, mouthShrugUpper,
cheekSquintLeft, cheekSquintRight, cheekPuff, noseSneerLeft,
noseSneerRight, tongueOut
```

Currently all set to `undefined` (no GLB model with morph targets exists).

## Future Integration Options

### Option 1: Rhubarb WASM

- Run off main thread in a Web Worker
- Input: audio file/arraybuffer
- Output: A–F/X mouth cue phoneme classes
- Map phoneme classes to viseme IDs
- Suitable for offline/pre-generated TTS audio
- **Status**: not integrated. Requires Rhubarb WASM binary (~4MB)

### Option 2: Azure Neural TTS Viseme Events

- Azure Speech SDK provides viseme event stream alongside audio
- Each event has `visemeId` (0–21), `audioOffset`, `animation`
- Maps directly to viseme timeline
- Also provides 3D blendshape frame arrays
- **Status**: not integrated. Requires Azure Speech key and SDK

### Option 3: Oculus Viseme Mapping

- 15 Oculus viseme names: `sil, PP, FF, TH, DD, kk, CH, SS, nn, RR, aa, E, ih, oh, ou`
- Each maps to 1+ ARKit blendshape morph targets with weights
- Reference mapping in `DEFAULT_OCULUS_TO_ARKIT` in `ethenVisemes.ts`
- **Status**: types defined. No model with Oculus visemes available

### Option 4: ARKit 52 Blendshapes

- 52 standard ARKit blendshape names (documented in `ethenVisemes.ts`)
- Requires GLB/VRM model with named morph targets matching ARKit spec
- Full face animation including eyes, brows, cheeks, nose, tongue
- **Status**: types defined. No model with ARKit blendshapes available

### Option 5: AnimaSync

- Browser-native audio-to-ARKit library
- Processes audio in browser, outputs blendshape weights
- **Status**: not evaluated

### Option 6: Custom Audio-to-Face Model

- Run a small ML model (e.g., transformer) for audio → blendshape inference
- Can be served via WebWorker or WebGPU
- **Status**: future research

## Model Requirements

To advance beyond `amplitude_only`, the GLB/VRM model must have:

- Named morph targets (at minimum: `jawOpen`, `mouthClose`)
- Ideally: ARKit 52 blendshape names or Oculus viseme names
- Mouth interior geometry (teeth/tongue) for realistic speaking

If morph targets are absent, the system degrades gracefully to the CSS-based fallback.

## Fallback Behavior

- If `qualityMode === "amplitude_only"`: use WebAudio amplitude for `mouthOpen`
- If viseme timeline has frames but model lacks morph targets: fall back to `resolveFallbackMouthOpen()` which blends amplitude with viseme weight (70/30)
- If `qualityMode` is higher but model has no morph targets: treat as `amplitude_only`
- Always respect `prefers-reduced-motion`: freeze mouth at closed position

## Helper Functions

| Function                                                         | Purpose                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| `createEmptyVisemeTimeline(text, qualityMode)`                   | Bootstrap timeline with defaults                                  |
| `sampleTimelineFromText(text, durationMs, count)`                | Generate demo viseme frames from text using word-to-viseme lookup |
| `clampVisemeWeight(weight)`                                      | Clamp 0–1                                                         |
| `resolveFallbackMouthOpen(amplitude, visemeWeight, qualityMode)` | Blend WebAudio amplitude with viseme weight based on quality mode |
| `estimateVisemeDuration(text, wordsPerSecond, phonemesPerWord)`  | Rough duration estimate for viseme generation                     |

## Next Implementation Steps

1. Add a real 3D avatar model with morph targets to `public/models/ethen/`
2. Implement `MorphTargetScheduler` using React Three Fiber `useFrame`
3. Integrate Azure TTS viseme events → `ProviderAdapter` → `VisemeTimeline`
4. Add Rhubarb WASM Web Worker for offline audio processing
5. Build viseme preview panel in console for testing
