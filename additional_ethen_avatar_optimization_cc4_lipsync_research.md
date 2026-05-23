# Additional Exa Research: Browser 3D Avatar Optimization, CC4 Pipeline, and Lip-Sync Runtime

## Purpose

This section expands the Ethen avatar research with new Exa findings focused on:

- Web GLB optimization
- React Three Fiber avatar runtimes
- Character Creator 4 to Blender to GLB workflow
- ARKit / Oculus viseme support
- Browser-native lip-sync engines
- WebGPU/WebGL performance limits
- Open-source avatar agent projects

The key takeaway is clear:

> A browser-rendered photorealistic avatar is possible, but only if Upcube treats asset optimization, blendshape support, and performance budgets as core architecture — not polish.

---

# 5. Web Avatar Asset Optimization

## Key Finding

For web delivery, the production avatar format should be:

```text
GLB
+ Meshopt or Draco compression
+ KTX2/Basis texture compression
+ optimized texture sizes
+ limited draw calls
+ clear mobile performance budgets
```

GLB is preferred because it packages geometry, textures, materials, and animations into one binary file. Multiple sources confirm that GLB is the right delivery format for Three.js / React Three Fiber because it reduces missing-asset problems and keeps web loading simpler.

## Compression Strategy

The research points to two geometry compression options:

| Compression | Best For                       | Notes                                       |
| ----------- | ------------------------------ | ------------------------------------------- |
| Meshopt     | Animated/skinned/morph avatars | Faster decode, better for runtime animation |
| Draco       | Smallest file size             | Strong compression, sometimes slower decode |

For Upcube’s avatar, **Meshopt should be preferred for animated/morph-target avatars**, with Draco as a fallback if file size is the bigger issue.

## Texture Strategy

Use:

```text
KTX2 / Basis Universal
```

for production avatar textures.

Why:

- PNG/JPEG decompress into large GPU memory usage.
- KTX2 stays compressed on the GPU.
- KTX2 can reduce VRAM use heavily, especially on mobile.
- This matters for skin, hair, eyes, clothing, and normal maps.

## Recommended Asset Pipeline

```bash
gltf-transform optimize input.glb output.glb \
  --compress meshopt \
  --texture-compress ktx2
```

Fallback compatibility version:

```bash
gltf-transform optimize input.glb output.glb \
  --compress meshopt \
  --texture-compress webp \
  --texture-resize 1024
```

## Target Budgets

For the first Ethen web avatar:

| Target                 |                             Budget |
| ---------------------- | ---------------------------------: |
| Mobile file size       |             under 5 MB if possible |
| Desktop file size      |                        under 20 MB |
| Mobile triangles       |                         under 100K |
| Desktop triangles      |                         under 500K |
| Mobile texture memory  |                        under 50 MB |
| Desktop texture memory |                       under 200 MB |
| Draw calls             | under 50 mobile, under 100 desktop |
| FPS                    |                          30–60 FPS |

These budgets matter because high-fidelity avatars can easily crash or stutter on phones if textures and draw calls are not controlled.

---

# 6. React Three Fiber Runtime Direction

## Key Finding

React Three Fiber remains the best fit for Upcube because the current Upcube app is already React/Next.js-based.

The useful runtime stack is:

```text
Next.js
React
React Three Fiber
Three.js
@react-three/drei
gltfjsx
GLB / VRM model
WebAudio
TTS / LLM backend
```

## Useful Open-Source Projects Found

### 1. Avatoon

Avatoon is a lightweight React Three Fiber avatar component with:

- GLB model support
- viseme-driven lip-sync
- head motion
- morph target control
- optional gesture states

This is useful as a reference for a first Ethen speaking-avatar component. It supports `visemeJson`, which is close to the type of timeline Upcube will need for TTS-driven mouth animation.

### 2. TalkingHead

TalkingHead is highly relevant because it supports:

- full-body GLB avatars
- real-time lip-sync
- Mixamo animations
- ARKit blendshapes
- Oculus viseme blendshapes
- audio/viseme timeline input

Its model requirements are very important: the avatar should have a Mixamo-compatible rig plus ARKit and Oculus viseme blendshapes.

### 3. Agentic Avatars

Agentic Avatars is useful as a modern reference for AI voice-agent integration. It uses React Three Fiber and can connect to providers like OpenAI Realtime, Deepgram, ElevenLabs, Vapi, and LiveKit. Its architecture separates:

```text
provider adapter
audio stream
lip-sync manager
avatar scene
custom avatar component
```

This is close to the kind of modular architecture Upcube should eventually build.

### 4. AnimaSync

AnimaSync is interesting because it claims browser-native WASM audio-to-face animation with ARKit blendshape output. If stable, this type of engine could let Upcube process audio into facial animation without relying on a cloud avatar-video provider.

---

# 7. Character Creator 4 to Blender to GLB Pipeline

## Key Finding

For photorealism, the strongest model creation path remains:

```text
Character Creator 4 / 5
→ Blender
→ optimized GLB
→ React Three Fiber
```

The CC/iC Blender Tools ecosystem is especially important because it helps import Character Creator and iClone exports into Blender while preserving materials, facial profiles, expression blendshapes, and ARKit-style facial workflows.

## Why CC4 Matters

Ready Player Me is faster, but CC4/Reallusion is better for:

- realistic human faces
- skin materials
- facial animation rigs
- custom morph editing
- Blender pipeline
- higher-quality production avatar creation

## Important CC4 Pipeline Notes

Research found useful tools for:

- importing CC4/iClone characters into Blender
- auto-setting up complex materials
- handling facial expression rigs
- supporting ARKit proxy workflows
- supporting visemes
- round-tripping characters between CC4 and Blender

This matters because the hardest part of a photorealistic avatar is not just loading a model. It is preserving:

```text
face rig
blendshapes
skin materials
eyes
hair
jaw
teeth
tongue
visemes
animation compatibility
```

## ARKit Naming Issue

One result focused on converting CC4.2 shape keys into ARKit naming convention. That matters because web avatar systems often expect known blendshape names. If CC4 exports different names, Upcube may need a Blender script or conversion step to rename blendshapes into standard ARKit names.

---

# 8. Lip-Sync Runtime Options

## Key Finding

The best long-term lip-sync strategy is:

```text
TTS audio
+ viseme or blendshape timeline
+ browser-rendered GLB/VRM avatar
```

Azure Speech is especially useful because it can output viseme events and 3D blendshape data. Microsoft’s docs say Neural TTS output can include viseme IDs, SVG, or blend shapes, and those events can be used to animate a 2D or 3D avatar.

## Azure Speech Benefit

Azure can provide:

```text
text input
→ neural speech audio
→ viseme events
→ 3D blendshape frames
```

That makes it a strong candidate for the first serious Ethen speaking prototype because it can provide both voice and facial timing.

## Runtime Choices

| Option              | Best For                      | Notes                                |
| ------------------- | ----------------------------- | ------------------------------------ |
| WebAudio amplitude  | Fast MVP                      | Mouth opens/closes based on loudness |
| Rhubarb / WASM      | Offline or generated audio    | Good for file-based TTS              |
| Azure viseme events | Better real-time TTS sync     | Strong practical option              |
| TalkingHead         | Browser avatar runtime        | Useful reference/possible dependency |
| AnimaSync           | Browser-native audio-to-ARKit | Interesting, needs testing           |
| NVIDIA Audio2Face   | High-end realism              | Likely too heavy for MVP             |

## Recommended First Lip-Sync Implementation

```text
Text response
→ Azure/OpenAI/ElevenLabs TTS
→ audio plays in browser
→ WebAudio detects amplitude
→ jawOpen/mouthOpen morph target moves
```

## Recommended Second Implementation

```text
Text response
→ Azure Speech TTS
→ viseme events / blendshape frames
→ avatar morph targets animate on schedule
```

---

# 9. WebGPU / WebGL Performance Lessons

## Key Finding

Do not make the first Ethen avatar WebGPU-only.

Use:

```text
WebGL 2 first
WebGPU later
```

WebGPU is promising for future high-performance rendering, but the avatar MVP should work broadly across browsers and mobile devices. Three.js/WebGL 2 with a well-optimized GLB is enough for the first version.

## Performance Rules

For React Three Fiber:

- Never allocate objects inside `useFrame`.
- Do not call React state setters every frame.
- Cap device pixel ratio with `dpr={[1, 2]}`.
- Use `useGLTF.preload` for critical models.
- Lazy-load non-critical models.
- Avoid too many transparent materials.
- Reuse materials and geometries.
- Dispose unused GPU resources.
- Keep draw calls under budget.
- Profile with `renderer.info`, `stats-gl`, or `r3f-perf`.

## Important Mobile Warning

Photorealistic avatars can fail on mobile if:

```text
textures are too large
draw calls are too high
DPR is uncapped
KTX2 is not used
materials are too complex
GPU memory is not managed
```

So the first Ethen avatar should support quality tiers:

```text
low
medium
high
```

---

# 10. Updated Upcube Architecture Recommendation

## Short-Term

Keep Tavus only as a temporary demo or optional live-video mode.

## Near-Term

Build an owned browser-rendered Ethen avatar.

```text
Ethen assistant panel
→ React Three Fiber Canvas
→ GLB avatar
→ idle / blink / gaze animation
→ text chat
→ TTS voice
→ basic mouth movement
```

## Mid-Term

Upgrade to real viseme-driven lip-sync.

```text
GLB avatar with ARKit/Oculus morph targets
→ TTS with viseme events
→ timed morph target scheduler
→ facial expressions
→ speaking/listening/thinking states
```

## Long-Term

Create a custom photorealistic Ethen model.

```text
Character Creator 4/5
→ Blender
→ ARKit-compatible blendshapes
→ optimized GLB with Meshopt/KTX2
→ React Three Fiber runtime
→ WebGPU enhancement later
```

---

# 11. Updated Technical Decision

## Best Model Format

```text
GLB for production web avatar
VRM for fast avatar-specific prototype if needed
```

## Best Model Creation Path

```text
Character Creator 4/5 + Blender
```

## Best Runtime

```text
React Three Fiber + Three.js + Drei
```

## Best Avatar Requirements

The Ethen model should include:

```text
skinned body rig
head mesh
separate eyes
jaw/mouth support
teeth/tongue if possible
ARKit 52 blendshapes
Oculus 15 visemes
idle animation
optional Mixamo-compatible body rig
optimized materials
KTX2 textures
Meshopt-compressed geometry
```

## Best First Implementation

```text
Browser-rendered 3D Ethen panel
with placeholder GLB
no paid avatar video minutes
simple TTS + basic mouth movement
```

---

# 12. Risks

## Technical Risks

- Photorealistic GLB may be too heavy for mobile.
- Hair realism is difficult in browser rendering.
- Skin shader quality may not match Unreal/MetaHuman.
- ARKit blendshape naming may need cleanup.
- KTX2 support can be tricky in React Three Fiber loaders.
- WebGPU browser support is improving but should not be required for MVP.

## Product Risks

- A bad avatar looks worse than no avatar.
- Overbuilding avatar tech too early could slow the main Upcube product.
- Users may prefer fast useful answers over realistic visuals.
- Live voice UX must be fast, or it will feel awkward.

## Cost Risks

The browser-rendered approach avoids Tavus/D-ID video-minute charges, but it still has costs:

```text
3D artist / model creation
LLM usage
TTS usage
speech-to-text usage
engineering time
asset optimization
testing across devices
```

---

# 13. Recommended Build Sequence

## Job 1: 3D Avatar Runtime Prototype

Goal:

```text
Load a GLB avatar inside the existing Ethen panel.
```

Scope:

- Add React Three Fiber dependencies.
- Create avatar canvas.
- Load placeholder GLB.
- Add lighting/camera.
- Add idle animation if present.
- Add fallback if WebGL fails.
- No AI yet.
- No lip-sync yet.

## Job 2: Avatar Life States

Goal:

```text
Make Ethen feel alive without speaking yet.
```

Scope:

- blinking
- idle breathing/sway
- subtle gaze
- hover/focus state
- loading state
- low-motion fallback

## Job 3: Text-to-Speech Speaking Prototype

Goal:

```text
Make Ethen speak a scripted response.
```

Scope:

- use local/sample audio first
- play audio
- WebAudio amplitude analysis
- drive jaw/mouth morph target
- add speaking state

## Job 4: AI Response + TTS

Goal:

```text
User asks question → Ethen answers with voice.
```

Scope:

- text input
- backend worker/API for AI response
- TTS generation
- audio playback
- mouth movement

## Job 5: Viseme-Based Lip-Sync

Goal:

```text
Replace amplitude-only mouth movement with timed visemes.
```

Scope:

- test Azure Speech viseme output or another viseme provider
- map visemes to avatar morph targets
- schedule mouth shapes
- smooth transitions

## Job 6: Custom Photorealistic Ethen Model

Goal:

```text
Replace prototype avatar with custom branded Ethen model.
```

Scope:

- CC4/Reallusion model creation
- Blender cleanup
- ARKit/Oculus morph target validation
- GLB export
- Meshopt/KTX2 optimization
- mobile/desktop performance testing

---

# Final Updated Recommendation

The best path is now clearer:

```text
Do not use Tavus or D-ID as the default assistant.
Do not start with Unreal/Pixel Streaming.
Do not make WebGPU mandatory yet.

Build browser-rendered 3D Ethen first.
Use React Three Fiber.
Use optimized GLB.
Require ARKit/Oculus blendshapes.
Start with simple mouth motion.
Upgrade to viseme-driven lip-sync.
Create a photorealistic CC4/Blender model once the runtime works.
```

The strategic bet:

```text
Upcube should own the avatar runtime.
Vendors can be temporary demos, but Ethen should become an Upcube-native browser-rendered AI guide.
```
