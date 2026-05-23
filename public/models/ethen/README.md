# Ethen 3D Model Pipeline

> **Status**: No model file exists yet at `ethen.glb`. The runtime gracefully falls back to a procedural geometric avatar.
> The fallback is always active when the model file is absent, loading, or fails to parse.

---

## 1. File Convention

Place the model in this directory:

```
public/models/ethen/
  ethen.glb          # Primary Ethen model (production)
  placeholder.glb    # Development / fallback model (optional)
  README.md          # This file
```

The runtime attempts to load `/models/ethen/ethen.glb` via `@react-three/drei/useGLTF` on mount. If the file is missing or fails to load, the component transitions to `fallback_active` state and renders the procedural geometric avatar.

## 2. Accepted Formats

| Format             | Priority | Loader                             |
| ------------------ | -------- | ---------------------------------- |
| `.glb` (GL Binary) | Primary  | `useGLTF` from `@react-three/drei` |
| `.vrm`             | Planned  | `@pixiv/three-vrm` if added later  |

GLB is preferred because it packages geometry, textures, materials, and animations into a single binary file. No missing-asset problems during web loading.

## 3. Model State Machine

When the component mounts, it transitions through these states:

| State             | Description                                             | Visual                                           |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `starting`        | Initial — component not yet mounted                     | Empty placeholder                                |
| `model_loading`   | `useGLTF` fetching model from `/models/ethen/ethen.glb` | Wireframe octahedron spinner (Suspense fallback) |
| `model_loaded`    | Model parsed successfully, rendering the GLB            | Full 3D model                                    |
| `model_missing`   | Model file not found (404)                              | Procedural geometric fallback                    |
| `model_error`     | Model found but parse failed                            | Procedural geometric fallback                    |
| `fallback_active` | No model or load failed — using CSS geometric avatar    | Procedural geometric fallback                    |

## 4. Required Visual Parts

The model must include these structural elements. The runtime probes the loaded model for morph targets and bone names to determine available controls:

### Required

- Face / head / bust geometry
- Separate eyes (for blink and gaze)
- Jaw / mouth controls (morph target or bone)
- Neck joint

### Recommended

- Teeth geometry (visible during speech)
- Tongue geometry (visible during speech)
- Hair (separate mesh)
- Upper body / full torso rig
- Shoulder joints

## 5. Blendshape / Morph Target Requirements

### Minimum (guarantees basic speech and blink)

| Blendshape      | Source | Purpose                  | Detection                                                    |
| --------------- | ------ | ------------------------ | ------------------------------------------------------------ |
| `jawOpen`       | ARKit  | Mouth opening for speech | Runtime checks morph dictionary for `jawOpen` or `mouthOpen` |
| `eyeBlinkLeft`  | ARKit  | Left eye blink           | Runtime checks morph dictionary for `eyeBlink` pattern       |
| `eyeBlinkRight` | ARKit  | Right eye blink          | Runtime checks morph dictionary for `eyeBlink` pattern       |

### Preferred (ARKit 52)

The full ARKit 52 blendshape set. Runtime diagnostics report whether morph targets are detected but do not require any specific set to render.

### Oculus Viseme Support (for TTS-timed lip-sync)

If using Azure Neural TTS or another provider that emits viseme events, the model should support Oculus 15-viseme mapping. The viseme-to-blendshape mapping reference is in `lib/ethen/ethenVisemes.ts` (`DEFAULT_OCULUS_TO_ARKIT`).

## 6. Bone / Skeleton Requirements

The runtime scans the model's bone hierarchy for these names (case-insensitive) and reports findings in the diagnostics pane:

| Bone Pattern           | Purpose                 |
| ---------------------- | ----------------------- |
| `jaw`, `mouth`, `chin` | Jaw movement for speech |
| `blink`, `eye`         | Eye blink and gaze      |

If no matching bones or morph targets are found, the model still renders but without runtime-driven facial animation.

## 7. Animation Expectations

The model should support these runtime animations:

| Animation      | Driver                           | Notes                                                        |
| -------------- | -------------------------------- | ------------------------------------------------------------ |
| Idle breathing | Bone animation or morph          | Subtle Y-axis body sway — procedural in fallback             |
| Blink          | `eyeBlinkLeft` / `eyeBlinkRight` | Procedural via runtime timer                                 |
| Gaze           | Eye bone rotation                | Controlled by runtime gaze system                            |
| Speaking jaw   | `jawOpen` morph or jaw bone      | Driven by WebAudio amplitude from `useWebAudioMouthMovement` |

The runtime does not yet schedule keyframe or animation clip playback. Model-provided animations are preserved in `gltf.animations` but not automatically played.

## 8. Production Pipeline

Recommended authoring workflow:

```
Character Creator 4 / 5 (Reallusion)
  → Blender (cleanup, rig validation)
  → ARKit blendshape validation
  → Oculus viseme validation
  → optimized GLB export
  → Meshopt compression
  → KTX2 / Basis texture conversion
  → Place here as ethen.glb
  → Verify in devtools: model loads, morphs detected, jaw moves
```

## 9. Optimization Budgets

### Geometry Compression

| Tool    | Priority     | Notes                                                    |
| ------- | ------------ | -------------------------------------------------------- |
| Meshopt | **Required** | Faster decode, better for runtime morph-target animation |
| Draco   | Fallback     | Smaller file size, slower decode                         |

### Texture Compression

| Format                 | Priority     | Notes                                              |
| ---------------------- | ------------ | -------------------------------------------------- |
| KTX2 / Basis Universal | **Required** | Stays compressed on GPU. Use `gltf-transform ktx2` |
| WebP                   | Fallback     | Use `gltf-transform resize --width 1024`           |

### Performance Targets

| Asset Area            | Target              | Strictness  |
| --------------------- | ------------------- | ----------- |
| Desktop triangles     | Under 75k           | Strict      |
| Mobile triangles      | Under 30k           | Strict      |
| Desktop file size     | Under 15 MB         | Recommended |
| Mobile file size      | Under 5 MB          | Strict      |
| Desktop draw calls    | Under 25            | Recommended |
| Mobile draw calls     | Under 10            | Strict      |
| Texture format        | KTX2 / Basis        | Required    |
| Geometry compression  | Meshopt             | Required    |
| Mobile DPR cap        | 1.0–1.5             | Strict      |
| Mobile shadows        | Disabled or reduced | Strict      |
| Mobile texture memory | Under 50 MB         | Recommended |

### Reference Commands

```sh
# Compress geometry with Meshopt
gltf-transform meshopt ethen.glb ethen.glb

# Convert textures to KTX2
gltf-transform ktx2 ethen.glb ethen.glb
gltf-transform resize --width 1024 --height 1024 ethen.glb ethen.glb

# Draco fallback
gltf-transform draco ethen.glb ethen.glb
```

## 10. Runtime Diagnostics

When running in `NODE_ENV=development`, the avatar canvas overlays a small diagnostics pane (bottom-left corner) showing:

- `model`: current model state (`starting`, `model_loading`, `model_loaded`, `model_missing`, `model_error`, `fallback_active`)
- `path`: model file path being loaded
- `morph`: whether morph targets were detected on any mesh
- `jaw`: whether a jaw/mouth bone or `jawOpen`/`mouthOpen` morph was found
- `blink`: whether `eyeBlink` morphs were found

These diagnostics help verify that a deployed model has the expected controls.

## 11. QA Checklist

### Loading and Rendering

- [ ] Model loads without console errors when `ethen.glb` is present
- [ ] Procedural fallback renders when `ethen.glb` is absent
- [ ] Loading spinner (wireframe octahedron) appears briefly during fetch
- [ ] Transition from loading to render is smooth (no flash of fallback then model)
- [ ] Materials render correctly (no missing textures, no pink surfaces)
- [ ] Lighting matches the Three.js scene setup (ambient + point + spot + environment)

### Facial Controls

- [ ] Jaw opens and closes during speech
- [ ] Eyes blink independently
- [ ] Gaze follows targets correctly
- [ ] When `mouthOpen` prop is 0, mouth is closed
- [ ] When `mouthOpen` prop is > 0, jaw moves proportionally
- [ ] No geometry clipping when mouth is fully open
- [ ] Teeth do not clip through lips (if teeth are modeled)

### Animation and State

- [ ] Idle breathing is subtle but visible
- [ ] Speaking state shows exaggerated motion
- [ ] Thinking state shows head sway and slower breathing
- [ ] No unnatural jitter during transitions
- [ ] Reduced-motion preference disables unnecessary movement

### Model Diagnostics

- [ ] In dev mode, diagnostics pane shows correct state after model loads
- [ ] `morph: yes` appears when the model has ARKit blendshapes
- [ ] `jaw: yes` appears when `jawOpen` or jaw bone is detected
- [ ] `blink: yes` appears when `eyeBlinkLeft`/`eyeBlinkRight` morphs are found
- [ ] Diagnostics pane is hidden in production builds

### Mobile

- [ ] Model loads on mobile Safari and Chrome
- [ ] Triangle and draw-call budgets are met
- [ ] No stutter or frame drops during speech
- [ ] Fallback displays if `ethen.glb` fails to load on low-end devices
- [ ] WebGL detection correctly falls back when WebGL is unavailable

## 12. Licensing and Rights Checklist

Before the model is deployed to production:

- [ ] Ethen is an Upcube-owned character — all rights held by Upcube
- [ ] No real person's likeness is used
- [ ] No celebrity or public figure resemblance
- [ ] No third-party model assets without license
- [ ] If AI-assisted modeling was used, no training-data rights issues
- [ ] Consent record exists if any reference photography was used
- [ ] Model is cleared for web deployment (CDN, embedding)

## 13. Implementation Notes

- The model directory contains **documentation only** until a final 3D model is placed here.
- Adding `ethen.glb` to this directory will cause the runtime to load it automatically — no code changes needed.
- If `ethen.glb` is absent, the runtime silently falls back to the procedural avatar with no error surface visible to the user.
- The procedural fallback geometric avatar includes: breathing animation, head sway, jaw movement, blink simulation, and state-based color changes.
- The diagnostics pane is the recommended tool for verifying model capabilities during development.
