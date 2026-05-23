# Browser-Rendered Photorealistic Ethen Avatar Research

## Purpose

This document summarizes the first four Exa research batches for building a **photorealistic, browser-rendered, live 3D avatar** for Upcube.

The goal is to move away from expensive live video-avatar providers like Tavus/D-ID as the default experience and build an owned Upcube avatar system that runs in the user’s browser using GPU/WebGL/WebGPU over time.

## Core Direction

The recommended long-term direction is:

```text
Upcube static site
→ Ethen assistant panel
→ browser-rendered 3D avatar
→ React Three Fiber / Three.js
→ GLB avatar with facial blendshapes
→ AI text/voice pipeline
→ local lip-sync and animation
```

This avoids video-minute charges and gives Upcube more product ownership.

---

# 1. Browser-Rendered Avatar Stack

## Key Finding

A browser-rendered avatar stack is realistic enough to prototype now.

The strongest early stack is:

```text
Next.js
React
React Three Fiber
Three.js
GLB avatar model
ARKit/Oculus blendshapes
WebAudio-driven lip sync
```

Research surfaced browser-native avatar systems using React Three Fiber and Three.js, including avatar rendering, facial expressions, gaze, animation, voice, and LLM integration. Some open-source and package-based options already support GLB models, lip-sync, gestures, and backend-agnostic AI/voice pipelines.

## Recommended Decision

Start with:

```text
React Three Fiber + Three.js + GLB
```

Do **not** make WebGPU a hard MVP requirement. Use WebGL/Three.js first, then upgrade rendering performance later.

## Why

WebGPU may become important for future performance, but the MVP should prove:

- the avatar can load fast
- the model can blink and idle
- the mouth can move while speaking
- the assistant panel feels premium
- the system works inside the current Upcube static site

---

# 2. Avatar Model Pipeline

## Key Finding

Ready Player Me is useful for fast web prototypes, but **Character Creator / Reallusion + Blender** is a better path for photorealism.

Ready Player Me documentation shows support for custom “Hero Characters,” GLB upload, facial animation support, and avatar downloads with morph target options such as ARKit and Oculus visemes.

However, for a more photorealistic Ethen, Reallusion Character Creator appears stronger because it supports realistic human generation, facial/body animation, skin material systems, Blender workflows, and fully rigged characters designed for animation.

## Recommended Pipeline

```text
Character Creator 4 / Reallusion
→ create photorealistic Ethen character
→ export FBX with rig and facial morphs
→ clean up in Blender
→ optimize materials/textures
→ export GLB
→ load into React Three Fiber
```

## Fast Prototype Pipeline

```text
Ready Player Me
→ export avatar with ARKit/Oculus morph targets
→ load into React Three Fiber
→ test idle, blink, gaze, and mouth movement
```

## Production Pipeline

```text
Character Creator 4
→ Blender cleanup
→ custom GLB
→ ARKit/Oculus blendshape mapping
→ optimized web avatar package
```

---

# 3. Lip-Sync and Audio-to-Face

## Key Finding

Lip-sync should be built in stages.

There are three realistic levels:

| Level    | Method                              | Use Case              |
| -------- | ----------------------------------- | --------------------- |
| MVP      | WebAudio volume → jawOpen/mouthOpen | Fast prototype        |
| Better   | Oculus-style viseme mapping         | Natural avatar speech |
| Advanced | ARKit blendshapes / Audio2Face      | Higher realism        |

Azure Speech can produce viseme events, SVG, and 3D blendshape animation data for avatar animation. Its documentation describes visemes as the visual mouth/face positions that correspond to spoken phonemes, and it supports blendshape frames for 3D characters.

NVIDIA Audio2Face is a high-end option that processes audio and outputs synchronized facial animation/blendshape data. It is better suited for advanced realism, but it adds infrastructure complexity.

## Recommended Lip-Sync Roadmap

### Phase 1: Simple Mouth Movement

```text
TTS audio plays
→ WebAudio analyzes volume
→ jawOpen/mouthOpen changes based on loudness
```

This is not perfect, but it makes the avatar feel alive quickly.

### Phase 2: Viseme-Based Lip Sync

```text
TTS text/audio
→ phoneme/viseme timeline
→ map visemes to avatar blendshapes
→ schedule mouth shapes in sync with audio
```

### Phase 3: ARKit Blendshape Animation

```text
Azure Speech / custom viseme service
→ blendshape frames
→ React Three Fiber avatar face compositor
```

### Phase 4: Audio2Face-Style System

```text
audio stream
→ Audio2Face / A2F-style inference
→ ARKit blendshape output
→ avatar facial animation
```

## Recommended Decision

Start with volume-based mouth movement, but choose a model that supports ARKit/Oculus morph targets so you can upgrade without rebuilding the avatar.

---

# 4. Conversational Avatar Architecture

## Key Finding

The avatar renderer should be separated from the AI voice brain.

The long-term system should not depend on streaming a video avatar from a vendor. Instead, the browser should render Ethen locally.

Recommended architecture:

```text
User speaks or types
→ speech-to-text or text input
→ LLM response
→ TTS audio
→ lip-sync timeline
→ browser-rendered 3D Ethen speaks
```

Research on real-time digital human systems shows that production conversational avatars often use multi-stage pipelines involving ASR, LLM, TTS, lip-sync, animation, rendering, and WebRTC/WebSocket transport. NVIDIA Tokkio, for example, uses WebRTC, streaming audio, an AI controller, TTS, Audio2Face, animation services, and rendering/streaming layers.

For Upcube, the MVP should be simpler:

```text
text or mic input
→ AI response
→ TTS
→ local avatar animation
```

Do not start with full WebRTC unless the product proves the need.

---

# Recommended Upcube Avatar System

## MVP: Owned 3D Ethen

```text
Static Upcube site
→ Ethen panel
→ React Three Fiber GLB avatar
→ idle animation
→ blink animation
→ gaze/focus
→ TTS response
→ WebAudio mouth movement
```

## V2: Better Speaking Avatar

```text
GLB avatar with ARKit/Oculus morphs
→ TTS with viseme events
→ timed mouth shapes
→ idle/listening/thinking/speaking states
```

## V3: Photorealism Pass

```text
Character Creator 4 / Reallusion model
→ Blender cleanup
→ optimized GLB
→ KTX2 compressed textures
→ improved skin/eye/hair shaders
→ ARKit 52 blendshape support
```

## V4: Advanced Voice Agent

```text
real-time voice model
→ interruption/barge-in
→ streaming TTS
→ viseme lookahead
→ emotion-driven facial animation
```

---

# Implementation Strategy

## Phase 1 — Avatar Runtime Prototype

Build a small Ethen panel that loads a GLB avatar.

Milestones:

1. Add React Three Fiber.
2. Load a GLB/VRM avatar.
3. Add lighting and camera framing.
4. Add idle animation.
5. Add blink animation.
6. Add WebGL fallback state.
7. Keep the main site static-export compatible.

## Phase 2 — Speaking Prototype

Milestones:

1. Add text input.
2. Send text to AI endpoint.
3. Generate TTS response.
4. Play audio.
5. Use WebAudio to drive mouth movement.
6. Add speaking/thinking/listening states.

## Phase 3 — Real Lip-Sync

Milestones:

1. Use avatar with ARKit/Oculus morph targets.
2. Add viseme mapping.
3. Add viseme scheduler.
4. Smooth mouth shapes.
5. Sync mouth movement to audio timeline.

## Phase 4 — Photorealistic Ethen Model

Milestones:

1. Create Ethen in Character Creator 4 or similar.
2. Export to Blender.
3. Clean topology/materials.
4. Export optimized GLB.
5. Add skin/eye/hair shader improvements.
6. Test desktop and mobile performance.

---

# Tooling Candidates

## Runtime

```text
React Three Fiber
Three.js
@react-three/drei
GLTFLoader
VRM loader if using VRM
```

## Avatar Model

```text
GLB
FBX source converted to GLB
VRM for prototype
ARKit 52 blendshapes preferred
Oculus visemes helpful
```

## Creation Pipeline

```text
Character Creator 4
Reallusion Headshot
Blender
Ready Player Me for prototype
Faceit for Blender blendshape work
```

## Lip-Sync

```text
WebAudio volume analysis
Rhubarb Lip Sync WASM
Azure Speech viseme events
NVIDIA Audio2Face later
```

## Voice

```text
Browser SpeechRecognition for cheap prototype
OpenAI / Gemini / other LLM for response
OpenAI TTS / ElevenLabs / Azure TTS for voice
```

---

# Strategic Recommendation

Do not use Tavus/D-ID as the default Upcube assistant. Keep them only as optional live-video demos.

The main product direction should be:

```text
Browser-rendered 3D Ethen
+ AI chat
+ voice output
+ local lip-sync
+ product routing
```

This is more scalable, more ownable, and better aligned with Upcube as a technology ecosystem.

---

# Next Research Queries

Run these next:

```text
photorealistic GLB avatar skin shader eyes hair KTX2 Draco optimization Three.js React Three Fiber web performance
```

```text
Character Creator 4 to Blender to GLB ARKit blendshapes Oculus visemes web avatar pipeline
```

```text
Azure Speech viseme events 3D blendshapes React Three Fiber avatar lip sync implementation
```

```text
open source React Three Fiber GLB avatar lip sync ARKit blendshapes WebAudio TTS GitHub
```

---

# Final Decision

The best path for Upcube is:

```text
Short term:
Use Tavus only as an optional live demo.

Near term:
Build browser-rendered 3D Ethen in the assistant panel.

Long term:
Create a custom photorealistic Ethen model with ARKit blendshapes and local GPU rendering.
```

The key technical bet:

```text
Browser-rendered GLB/WebGPU avatar over vendor video minutes.
```

This gives Upcube its own avatar platform instead of renting one forever.
