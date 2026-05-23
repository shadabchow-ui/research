# Upcube / Ethen Gemini Research Synthesis

## Purpose

This document converts the Gemini deep research report into a practical execution summary for the Upcube / Ethen live avatar project.

The goal is to identify what Gemini adds beyond the earlier Claude and Phoenix-4 research, what should influence the roadmap, and what should be treated carefully before implementation.

## Core Conclusion

Gemini does not change the main strategy.

The strongest path remains:

> Build Ethen as a browser-rendered 3D avatar first, but architect it from day one for LiveKit real-time voice, adaptive interruption, low-latency TTS, and future neural video.

The key improvement from Gemini is that it gives a more specific real-time voice path.

Gemini pushes faster toward:

```text
Client-side avatar rendering
+ LiveKit real-time media
+ Deepgram / Soniox STT
+ GPT-4o-mini or similar streaming LLM
+ Cartesia Sonic TTS
+ Rhubarb WASM lip-sync
```

This is closer to the target product: a real-time avatar that talks, listens, and responds like a Tavus-style live avatar system.

## Biggest Useful Takeaways From Gemini

## 1. Gemini Pushes A More Real-Time-First Architecture

Claude was more conservative:

```text
Browser avatar first
→ text/TTS first
→ LiveKit later
```

Gemini pushes a faster real-time stack:

```text
Browser-rendered avatar
→ LiveKit media transport
→ Deepgram / Soniox STT
→ GPT-4o-mini or another streaming LLM
→ Cartesia Sonic TTS
→ adaptive interruption
```

This is useful because the long-term goal is not just a talking web mascot. The goal is a true live avatar platform.

Recommended interpretation:

- Keep Job 1 simple.
- Do not add LiveKit immediately.
- But design the avatar state system so LiveKit can connect later without a rewrite.

## 2. Cartesia Becomes A Serious Real-Time TTS Candidate

Earlier research leaned toward:

- ElevenLabs for quality
- Azure for viseme metadata
- OpenAI TTS for simple platform integration

Gemini adds:

- Cartesia Sonic for very low-latency real-time voice

Updated TTS decision table:

| Use Case                      | Best Candidate               |
| ----------------------------- | ---------------------------- |
| Polished Ethen scripted voice | ElevenLabs                   |
| Real-time voice agent         | Cartesia                     |
| Viseme event support          | Azure Neural TTS             |
| Unified simple OpenAI stack   | OpenAI Realtime / OpenAI TTS |
| Cost-sensitive fallback       | Deepgram Aura or OpenAI TTS  |

Recommended implementation direction:

- For early text-to-speech: evaluate ElevenLabs and Cartesia.
- For real-time voice: strongly evaluate Cartesia.
- For lip-sync with provider metadata: keep Azure as a later option.

## 3. Rhubarb WASM Becomes A Mid-Stage Lip-Sync Option

Claude recommended:

```text
WebAudio amplitude first
→ Azure visemes later
```

Gemini recommends a more flexible lip-sync ladder:

```text
WebAudio amplitude
→ Rhubarb WASM
→ MFCC / phoneme classifier
→ neural audio-to-expression later
```

This is useful because Rhubarb can improve mouth animation without locking Upcube into Azure.

Recommended lip-sync ladder:

### Phase 1: WebAudio Amplitude

Fastest MVP.

- Use WebAudio AnalyserNode
- Extract audio amplitude
- Map amplitude to jawOpen
- Smooth with lerp

Good enough for first demo.

### Phase 2: Rhubarb WASM

Better phoneme-style cues.

- Run Rhubarb in a Web Worker
- Feed 16kHz mono PCM chunks
- Map A-F/X mouth cues to viseme blendshapes
- Avoid blocking main UI thread

Useful if mobile performance is acceptable.

### Phase 3: Azure Visemes

Provider-driven viseme timing.

- Use Azure Neural TTS
- Capture viseme events
- Map to ARKit/Oculus blendshapes
- More stable than client-side phoneme extraction

### Phase 4: Custom Audio-To-Face

Later research.

- MFCC features
- lightweight classifier
- ONNX/WASM/WebGPU model
- eventually neural audio-to-expression

## 4. Gemini Makes VRM / three-vrm More Important

Gemini emphasizes:

- `@pixiv/three-vrm`
- VRM 1.0-style humanoid runtime
- expression management
- gaze / blink / humanoid bone control

This matters because Ethen is a humanoid avatar. VRM may provide cleaner expression, gaze, and bone conventions than a raw GLB-only approach.

Recommended runtime evaluation:

```text
Option A: Raw R3F + Three.js + GLB
Option B: R3F + @pixiv/three-vrm
Option C: TalkingHead
Option D: Khavee SDK as reference only
```

Recommendation:

> Use React Three Fiber and Three.js as the foundation, but evaluate `three-vrm` and TalkingHead before locking the avatar runtime.

## 5. Gemini Gives Stricter Mobile Asset Budgets

Gemini sets stricter performance budgets than Claude.

Recommended budgets:

| Asset Area           |                      Target |
| -------------------- | --------------------------: |
| Desktop triangles    |                   under 75k |
| Mobile triangles     |                   under 30k |
| Desktop file size    |                 under 15 MB |
| Mobile file size     |                  under 5 MB |
| Desktop draw calls   |                    under 25 |
| Mobile draw calls    |                    under 10 |
| Texture format       |                KTX2 / Basis |
| Geometry compression |                     Meshopt |
| Mobile DPR           |           cap at 1.0 or 1.5 |
| Mobile shadows       | disabled or heavily reduced |

Use Gemini’s numbers as the mobile-first target.

Claude’s higher budgets may still be acceptable for desktop, but Gemini’s stricter numbers are safer for the upcube.ai homepage and console.

## 6. Adaptive Interruption Should Become A Real Job

Gemini emphasizes that real-time avatars must handle interruption properly.

Bad behavior:

```text
AI stops speaking because user coughs, types, or says "uh-huh"
```

Good behavior:

```text
AI speaking
→ user intentionally interrupts
→ stop TTS
→ flush audio queue
→ reset mouth blendshapes
→ return avatar to listening/thinking
```

This should become its own later implementation job.

Recommended future job:

> Adaptive Interruption and Barge-In Handling

Scope:

- detect intentional interruption
- ignore coughs and accidental background noise
- stop TTS stream
- clear audio queue
- reset mouth blendshapes
- update avatar state
- resume listening

## 7. Gemini Adds Useful C2PA / Live Provenance Detail

Claude mentioned synthetic media safety and C2PA generally.

Gemini adds an important detail:

> Live stream provenance is harder than signing a finished file.

For future neural video or user-created replicas, Upcube may need:

- fMP4 segment signing
- hash-chained segment integrity
- KMS/HSM-backed signing keys
- metadata injection into live media fragments
- browser-side verification indicators

This is not needed for the first Ethen MVP.

But it matters later for:

- cloned avatars
- neural video streams
- downloadable avatar videos
- enterprise trust
- public safety
- synthetic media disclosure

## Things From Gemini To Treat Carefully

## 1. Do Not Make WebGPU A Hard MVP Requirement

Gemini claims WebGPU support is broad enough to accelerate the roadmap.

Even if WebGPU support is improving, the Ethen MVP should not depend on it.

Recommended decision:

```text
WebGL 2 first.
WebGPU optional later.
```

Why:

- WebGL 2 is safer across devices.
- The avatar must work on real user phones.
- WebGPU can become an enhancement path, not a baseline dependency.

## 2. Rhubarb WASM May Be Too Heavy For Early Mobile

Rhubarb is useful, but real-time phoneme extraction on-device can use meaningful CPU.

Recommended decision:

```text
Job 1: no Rhubarb
Job 2: no Rhubarb
Job 3/4: WebAudio amplitude only
Later: Rhubarb in Web Worker
```

If Rhubarb is used, it should run off the main thread.

## 3. Gemini’s Cost Model Is Directional, Not Final

Gemini estimates a browser-rendered real-time voice session at roughly a few cents per active minute, with TTS being the main cost driver.

This is useful directionally, but not investor-grade proof.

Actual cost depends on:

- provider pricing
- output length
- average conversation duration
- average turns per minute
- TTS characters
- STT minutes
- LLM tokens
- LiveKit pricing
- concurrency
- caching
- whether audio is streamed or regenerated

Use Gemini’s model for planning, but verify vendor pricing before using it in business materials.

## Updated Combined Execution Plan

This execution order merges Claude + Gemini + Phoenix-4.

## Job 0: Avatar Runtime Evaluation

### Goal

Decide the avatar runtime before building too much custom code.

### Evaluate

- raw React Three Fiber + Three.js
- `@pixiv/three-vrm`
- TalkingHead
- Khavee SDK as reference only

### Decision Criteria

- Next.js compatibility
- SSR safety
- bundle size
- GLB/VRM support
- ARKit 52 support
- Oculus viseme support
- gaze/blink support
- clean TypeScript integration
- ability to fit Upcube UI
- no unnecessary vendor lock-in
- long-term maintainability

### Output

Choose one:

1. raw R3F/GLB runtime
2. R3F + three-vrm runtime
3. TalkingHead runtime
4. custom hybrid

## Job 1: Browser 3D Ethen Canvas

### Goal

Render Ethen in the browser.

### Scope

- R3F Canvas
- WebGL 2 renderer
- placeholder GLB/VRM
- fallback geometric avatar
- lighting
- camera framing
- Suspense loading state
- WebGL unsupported fallback
- no AI
- no voice
- no lip-sync

### Acceptance Criteria

- avatar renders without crashing
- fallback works if no model exists
- no SSR/hydration failure
- future model can be placed in `public/models/ethen/ethen.glb` or equivalent
- build passes or failures are honestly reported

## Job 2: Avatar Life States

### Goal

Make Ethen feel alive before speech.

### Scope

- blink
- gaze
- micro-saccades
- breathing/sway
- idle motion
- reduced-motion support
- state prop foundation

### States

- idle
- listening
- thinking
- speaking
- error
- offline

### Acceptance Criteria

- Ethen blinks naturally
- gaze is not frozen
- motion feels subtle
- reduced-motion preference is respected
- no obvious frame drops

## Job 3: Text + TTS Speaking Prototype

### Goal

Let Ethen speak generated or scripted text.

### Scope

- text input
- TTS route
- provider abstraction
- audio playback
- speaking state
- text fallback

### Candidate TTS Providers

- ElevenLabs for voice quality
- Cartesia for real-time speed
- OpenAI TTS for platform simplicity

### Acceptance Criteria

- Ethen can speak after a user gesture
- audio playback works reliably
- avatar enters speaking state
- fallback text appears if audio fails

## Job 4: WebAudio Mouth Movement

### Goal

Add simple mouth movement.

### Scope

- WebAudio AnalyserNode
- amplitude/RMS extraction
- map to jawOpen
- smooth with lerp
- close mouth when audio ends

### Acceptance Criteria

- mouth moves while audio plays
- movement is not jittery
- mouth closes naturally
- no full viseme system yet

## Job 5: Upcube Product Guide Integration

### Goal

Make Ethen useful on upcube.ai.

### Scope

- Ethen product guide prompt
- Upcube product-family context
- simple routing/CTA suggestions
- off-topic handling
- safe response behavior
- conversation history within session

### Acceptance Criteria

- Ethen can explain Upcube products
- Ethen can guide users to relevant apps/pages
- Ethen does not hallucinate unsupported product claims
- Ethen avoids legal/medical/financial overclaiming

## Job 6: Real-Time Voice Agent

### Goal

Turn Ethen into a live avatar that listens and responds.

### Scope

- microphone permission UX
- LiveKit integration
- STT with Deepgram or Soniox
- streaming LLM
- TTS with Cartesia or equivalent
- VAD
- session state
- transcript
- avatar state sync

### Acceptance Criteria

- user can speak to Ethen
- Ethen responds with voice
- state changes are visible: listening, thinking, speaking
- response latency is measured
- failures degrade to text mode

## Job 7: Adaptive Interruption And Barge-In

### Goal

Make conversation feel natural.

### Scope

- detect user interruption while Ethen speaks
- ignore coughs, keyboard noise, and minor backchannels when possible
- stop TTS
- flush audio queue
- reset mouth blendshapes
- return avatar to listening/thinking
- log interruption events

### Acceptance Criteria

- intentional interruptions stop Ethen
- accidental noise does not constantly interrupt
- mouth/face resets cleanly
- transcript records interruption state

## Job 8: Better Lip-Sync

### Goal

Upgrade beyond amplitude jaw movement.

### Evaluate

- Rhubarb WASM in a Web Worker
- Azure viseme events
- Oculus viseme mapping
- ARKit 52 blendshape scheduling
- provider-neutral viseme timeline object

### Acceptance Criteria

- lip-sync visibly improves
- CPU usage remains acceptable
- mobile does not stutter
- system degrades gracefully if model lacks some blendshapes

## Job 9: Custom Ethen Model

### Goal

Replace placeholder avatar with a branded production Ethen model.

### Pipeline

- Character Creator 4/5
- Blender cleanup
- ARKit blendshape naming
- Oculus viseme support
- separate eyes
- jaw/mouth controls
- teeth/tongue geometry
- Meshopt compression
- KTX2/Basis textures
- gltfjsx component generation if useful

### Acceptance Criteria

- model loads quickly
- mobile performance is acceptable
- file size meets budget
- facial controls work
- no broken materials
- no mouth/teeth clipping

## Job 10: Platform Object Model

### Goal

Move from single Ethen demo to platform foundation.

### Objects

- Persona
- Replica
- Voice
- LiveAgent
- Conversation
- Session
- Transcript
- Event
- UsageRecord
- ConsentRecord
- Webhook
- KnowledgeBase
- Tool

### Acceptance Criteria

- Ethen can be represented as platform data
- a second test avatar/persona can be configured later
- schemas support browser GLB now and neural video later
- no premature full platform build

## Job 11: Safety, Billing, Observability

### Goal

Prepare for real usage and eventually enterprise trust.

### Scope

- usage metering
- event logs
- latency metrics
- transcript storage policy
- moderation hooks
- rate limits
- API keys
- Stripe billing later
- consent architecture later

### Acceptance Criteria

- cost per session can be estimated
- latency can be inspected
- abuse can be detected
- API usage can be limited

## Job 12: Neural Video Research Track

### Goal

Explore Tavus-level rendering later.

### Evaluate

- MuseTalk
- LivePortrait
- SadTalker
- Hallo2
- Wav2Lip
- GPU serving cost
- quality limits
- inference latency
- LiveKit video streaming
- C2PA provenance requirements

### Acceptance Criteria

- internal benchmark completed
- GPU cost understood
- quality gap documented
- decision made whether neural video is worth funding

## Updated Technical Decisions

| Decision Area        | Recommended Direction                     |
| -------------------- | ----------------------------------------- |
| First rendering path | Browser-rendered 3D                       |
| First graphics API   | WebGL 2                                   |
| Future graphics path | WebGPU optional                           |
| Runtime to evaluate  | R3F, three-vrm, TalkingHead               |
| Model format         | GLB/VRM depending on runtime decision     |
| Compression          | Meshopt                                   |
| Texture format       | KTX2 / Basis                              |
| First TTS            | ElevenLabs or Cartesia                    |
| Real-time TTS        | Cartesia candidate                        |
| Viseme TTS           | Azure candidate                           |
| First lip-sync       | WebAudio amplitude                        |
| Better lip-sync      | Rhubarb WASM or Azure visemes             |
| Real-time media      | LiveKit                                   |
| STT                  | Deepgram or Soniox                        |
| LLM                  | GPT-4o-mini or equivalent streaming model |
| Interruption         | Dedicated barge-in state machine          |
| Neural video         | Research only, not MVP                    |
| Safety provenance    | C2PA later for generated video/replicas   |

## Final Recommendation

Gemini’s research makes the real-time path more specific, but it does not change the core strategy.

The strongest combined plan is:

> Build Ethen as an owned browser-rendered 3D avatar first. Make him feel alive with behavior states. Add text-to-speech. Add basic mouth movement. Then add real-time voice with LiveKit, low-latency STT/TTS, and adaptive interruption. Only after the product is validated should Upcube invest in neural video or Tavus-style replica infrastructure.

The immediate next move should be:

> Create the final combined execution plan and then run Job 0: Avatar Runtime Evaluation.

After that, start Job 1: Browser 3D Ethen Canvas.
