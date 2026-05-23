# Upcube / Ethen Claude Research Synthesis

## Purpose

This document converts the Claude deep research report into a practical Upcube / Ethen execution summary.

The goal is to help Upcube build a real-time live avatar platform, starting with **Ethen** as the first owned avatar guide for upcube.ai.

The main question is whether Upcube should build:

- a browser-rendered Ethen avatar first,
- a Tavus-style real-time conversational avatar platform first,
- or a Synthesia-style avatar video platform first.

The answer from the research is clear:

> Build browser-rendered Ethen first, then upgrade into real-time voice, then expand into a full live avatar platform. Do not start with neural video or a full Synthesia/Tavus clone.

## Core Conclusion

Claude’s research confirms the existing strategy:

> Browser-rendered Ethen first → real-time voice agent second → Tavus/Synthesia-level platform later.

A browser-rendered 3D Ethen avatar with speech and basic lip-sync is realistic in roughly **2–3 months** with focused execution.

A Tavus-quality neural video platform is more like a **12–24 month, multi-million-dollar infrastructure bet**.

That means Upcube should not start by trying to clone Tavus video generation. Upcube should start by building an owned live avatar system that can eventually grow into a platform.

## The Three-Track Strategy

Claude’s report gives the cleanest structure so far:

### Track A: Browser-Rendered Ethen

Build now.

This is the owned, low-cost, browser-rendered avatar path.

Includes:

- React / Next.js
- React Three Fiber
- Three.js
- GLB or VRM avatar
- idle motion
- blink
- gaze
- basic speaking state
- text input
- TTS
- WebAudio mouth movement
- WebGL fallback

This is the best first product.

---

### Track B: Real-Time Voice Agent

Build after Track A works.

This adds live conversation ability.

Includes:

- microphone input
- STT
- streaming LLM
- streaming TTS
- VAD
- endpointing
- interruption / barge-in
- LiveKit or equivalent real-time media infrastructure
- session transcripts
- latency tracking

This turns Ethen from an avatar guide into a live voice agent.

---

### Track C: Neural Video / Replica Platform

Build later, only after validation and funding.

Includes:

- neural talking-head video
- replica training
- GPU inference
- WebRTC video streaming
- consent systems
- watermarking
- billing
- observability
- developer APIs

This is the expensive Tavus-style path. It should be researched, not built first.

## What Claude Adds To The Plan

## 1. The MVP Scope Is Now Much Clearer

The first real Ethen MVP should include:

- 3D avatar in the Ethen panel
- idle animation
- blink
- gaze
- text input
- LLM response
- TTS voice
- basic WebAudio mouth movement
- speaking state
- thinking state
- listening state
- WebGL fallback
- mobile support

The MVP should explicitly exclude:

- viseme lip-sync
- custom photorealistic Ethen model
- microphone input
- WebRTC
- Persona / Replica platform APIs
- neural video
- billing and usage metering

This keeps the first build focused.

## 2. Quality Depends On Behavior, Not Just Model Realism

Claude’s research reinforces the Phoenix-4 lesson:

> Ethen should feel alive before he needs to look perfectly photorealistic.

The first quality layer should be behavior.

Important avatar behaviors:

- blinking
- gaze movement
- idle breathing
- subtle head motion
- thinking posture
- speaking posture
- listening posture
- smooth state transitions
- reduced-motion support
- graceful error state

This should become **Job 2** after the first React Three Fiber canvas is working.

## 3. LiveKit Should Come Later, Not Immediately

Claude recommends:

- no WebRTC for MVP
- simple HTTP / SSE first
- LiveKit later for true microphone-based real-time conversation

This is important.

The early Ethen build can use:

- text input
- LLM streaming
- TTS audio playback
- WebAudio mouth movement

No WebRTC is needed until Upcube adds real microphone conversation, interruption, and live media sessions.

## 4. TTS Path Is Clearer

Claude recommends a staged voice strategy:

### MVP

Use **ElevenLabs Turbo** or another high-quality low-latency TTS provider for Ethen’s first speaking voice.

Reason:

- strong voice quality
- fast first audio
- good enough for Ethen’s first public experience

### Phase 2 / Lip-Sync Upgrade

Consider **Azure Neural TTS** later because Azure can provide viseme events for better mouth animation.

Reason:

- better lip-sync metadata
- easier mapping to visemes / blendshapes
- useful for high-quality speaking animation

## 5. TalkingHead May Save Development Time

Claude flags **TalkingHead** as an important open-source browser avatar runtime to evaluate.

It may support:

- GLB / VRM avatars
- ARKit 52 blendshapes
- Oculus 15 visemes
- Mixamo animation compatibility
- real-time audio / viseme input
- avatar speaking animation patterns

Upcube should not blindly depend on it, but it is worth a dedicated evaluation job.

Potential benefit:

- saves weeks of avatar runtime and lip-sync development

Potential risk:

- dependency quality
- project maintenance
- integration complexity
- long-term platform control

Recommended next research/build step:

> Run a Job 0 evaluation of TalkingHead before going too deep into custom lip-sync and behavior architecture.

## Updated Build Roadmap

## Job 0: TalkingHead Evaluation

### Goal

Decide whether Upcube should use TalkingHead as the browser avatar runtime layer or only use it as a reference.

### Scope

Evaluate:

- current GitHub activity
- license
- package health
- GLB / VRM support
- ARKit blendshape support
- Oculus viseme support
- React / Next.js compatibility
- bundle size
- SSR issues
- ability to fit Upcube’s own UI
- whether it can be wrapped cleanly in an Ethen component

### Decision output

Choose one:

1. adopt TalkingHead as runtime,
2. use TalkingHead only as reference,
3. ignore TalkingHead and build custom R3F runtime.

## Job 1: R3F Avatar Canvas Bootstrap

### Goal

Load a placeholder GLB avatar inside the existing Ethen panel.

### Scope

- add Three.js / R3F / Drei if missing
- create reusable Ethen canvas component
- load placeholder GLB if present
- provide geometric fallback avatar if no GLB exists
- add lighting
- add camera framing
- add loading state
- add WebGL unsupported fallback
- no AI
- no voice
- no lip-sync

### Acceptance criteria

- avatar renders in browser
- no SSR/hydration crash
- existing Ethen panel still works
- fallback appears if model is missing
- future GLB can be placed in `public/models/ethen/ethen.glb`

## Job 2: Blink and Gaze System

### Goal

Make Ethen feel alive before speech.

### Scope

- procedural blink
- gaze target
- micro-saccades
- reduced-motion support
- smooth idle presence
- configurable behavior settings

### Acceptance criteria

- Ethen blinks naturally
- gaze does not look frozen
- reduced-motion disables unnecessary movement
- no frame drops

## Job 3: Avatar State Machine

### Goal

Create the first Ethen behavior state model.

### Required states

- idle
- listening
- thinking
- speaking
- error

Optional states:

- greeting
- confirming
- curious
- offline

### Acceptance criteria

- state can be controlled by props
- visual difference exists per state
- transitions feel smooth
- future voice/TTS/lip-sync can connect to the same state machine

## Job 4: Chat API Route

### Goal

Create a streaming LLM endpoint for Ethen.

### Scope

- `/api/chat`
- SSE streaming
- system prompt for Upcube product guide behavior
- API key stays server-side
- basic rate limiting
- session ID support

### Acceptance criteria

- client receives streamed text
- no API keys exposed
- Ethen can answer basic Upcube questions
- off-topic questions are handled safely

## Job 5: TTS API Route + Audio Playback

### Goal

Let Ethen speak generated responses.

### Scope

- `/api/tts`
- TTS provider abstraction
- audio playback in browser
- autoplay policy handling
- speaking state while audio plays
- return to idle/listening when audio ends

### Acceptance criteria

- Ethen can speak a response
- audio works after user interaction
- errors degrade to text-only mode

## Job 6: WebAudio Lip-Sync

### Goal

Add basic mouth movement without full phoneme/viseme support.

### Scope

- WebAudio AnalyserNode
- read TTS audio amplitude
- map RMS amplitude to `jawOpen`
- smooth with lerp
- close mouth when audio ends

### Acceptance criteria

- mouth moves while Ethen speaks
- movement is not jittery
- mouth closes naturally
- no viseme system required yet

## Job 7: Full Chat-To-Speech Flow

### Goal

Wire the complete first public Ethen experience.

### Flow

```text
User types message
→ /api/chat streams response
→ response text appears
→ /api/tts generates audio
→ audio plays
→ avatar enters speaking state
→ WebAudio drives mouth movement
→ avatar returns to idle/listening
```

### Acceptance criteria

- full flow works end-to-end
- loading/thinking/speaking states are clear
- text fallback works
- errors are handled gracefully

## Job 8: Mobile Performance Optimization

### Goal

Make the avatar usable on real phones.

### Scope

- device-tier detection
- DPR cap
- shadow reduction
- post-processing disabled
- lower rendering budget on mobile
- optional avatar hide/fallback on very small screens

### Acceptance criteria

- stable performance on modern mobile devices
- no site-breaking slowdown
- text fallback works on weak devices

## Job 9: Product Guide System Prompt + Retrieval

### Goal

Make Ethen useful as a real Upcube product guide.

### Scope

- detailed Ethen system prompt
- Upcube product-family knowledge
- static structured product context first
- retrieval later if needed
- off-topic handling
- CTA routing

### Acceptance criteria

- Ethen answers Upcube product questions correctly
- Ethen explains what Upcube offers
- Ethen routes users toward useful product pages
- Ethen does not hallucinate unsupported product claims

## Job 10: Azure TTS Viseme Integration

### Goal

Upgrade from amplitude-based mouth movement to viseme-based lip-sync.

### Scope

- Azure Neural TTS
- capture viseme events
- map viseme IDs to ARKit / Oculus mouth shapes
- schedule blendshape animation on audio timeline
- smooth transitions between mouth shapes

### Acceptance criteria

- lip-sync is noticeably better than WebAudio amplitude
- mouth shapes correspond to phonemes
- system gracefully degrades if some blendshapes are missing

## Job 11: Custom Ethen GLB Integration

### Goal

Replace placeholder model with production Ethen.

### Scope

- add production GLB
- validate materials
- validate morph targets
- validate idle animation
- validate eyes/blink/gaze
- validate jaw/mouth
- optimize with Meshopt / KTX2
- mobile performance check

### Acceptance criteria

- production Ethen renders correctly
- all behavior states still work
- all mouth/face controls work or degrade gracefully
- file size and triangle count are acceptable

## Job 12: LiveKit Voice Agent Integration

### Goal

Make Ethen a true real-time voice avatar.

### Scope

- microphone permission flow
- LiveKit room
- STT
- LLM
- TTS
- VAD
- interruption / barge-in
- avatar state sync
- transcript
- latency tracking

### Acceptance criteria

- user can talk to Ethen
- Ethen responds with voice
- Ethen can be interrupted
- median perceived response latency target is under roughly 1.2 seconds
- conversation transcript is captured

## Platform Object Model For Later

Do not build all of this in the first MVP, but design toward it.

## Persona

Defines who the avatar is and how it behaves.

Fields:

```ts
Persona {
  id: string
  name: string
  systemPrompt: string
  tone: string
  knowledgeBaseIds: string[]
  guardrails: string[]
  greeting: string
}
```

## Replica

Defines what the avatar looks and sounds like.

Fields:

```ts
Replica {
  id: string
  displayName: string
  avatarModelUrl: string
  voiceModelId: string
  renderingEngine: "browser_glb" | "neural_video" | "pixel_streaming"
  consentRecordId?: string
  status: "active" | "suspended" | "deleted"
}
```

## Conversation

Defines a single user/avatar interaction.

Fields:

```ts
Conversation {
  id: string
  personaId: string
  replicaId: string
  userId?: string
  startedAt: string
  endedAt?: string
  transcriptId?: string
  usageId?: string
  status: "active" | "ended" | "failed"
}
```

## Session

Defines the technical connection/media session.

Fields:

```ts
Session {
  id: string
  conversationId: string
  mediaRoomId?: string
  provider?: "none" | "livekit" | "daily" | "custom"
  reconnectCount: number
  clientInfo: Record<string, unknown>
}
```

## Voice

Defines TTS voice identity.

Fields:

```ts
Voice {
  id: string
  provider: "elevenlabs" | "azure" | "openai" | "deepgram" | "custom"
  externalVoiceId: string
  language: string
  isCloned: boolean
  consentRecordId?: string
}
```

## Knowledge Base

Defines product or document knowledge.

Fields:

```ts
KnowledgeBase {
  id: string
  name: string
  indexType: "static" | "vector" | "hybrid"
  documentCount: number
  lastUpdated: string
}
```

## Usage Record

Defines billing and cost metrics.

Fields:

```ts
UsageRecord {
  id: string
  conversationId: string
  sessionMinutes: number
  sttSeconds: number
  ttsCharacters: number
  llmInputTokens: number
  llmOutputTokens: number
  gpuSeconds?: number
}
```

## Consent Record

Needed later for real human replicas or cloned voices.

Fields:

```ts
ConsentRecord {
  id: string
  replicaId: string
  subjectName: string
  consentTextVersion: string
  signedAt: string
  revocationStatus: "active" | "revoked"
  revokedAt?: string
}
```

## Safety And Trust Notes

Safety is not optional once Upcube moves beyond Ethen into user-created avatars or replicas.

Eventually required:

- consent receipts
- liveness verification
- identity revocation
- audit logs
- use-case restrictions
- voice cloning safeguards
- watermarking / provenance
- moderation
- enterprise data retention controls

For the first Ethen MVP, keep it simple:

- disclose Ethen is AI
- avoid human impersonation
- do not clone real people
- do not support user-uploaded replica training yet
- log errors and abuse attempts
- keep API keys server-side

## Cost Insight

Browser-rendered Ethen is the right first path because rendering cost is effectively zero.

The user's GPU renders the avatar.

Upcube pays mainly for:

- LLM tokens
- TTS characters
- STT minutes later
- LiveKit minutes later
- CDN delivery of avatar model

Neural video is much more expensive because Upcube or a vendor must generate and stream video frames.

This is the core cost advantage of browser-rendered Ethen.

## What Not To Build Yet

Do not build these first:

- neural video infrastructure
- Tavus-style replica training
- custom WebRTC SFU
- MetaHuman Pixel Streaming
- full platform API
- full billing layer
- voice cloning marketplace
- user-created human replicas
- large avatar library
- complex video editor

These are later-stage features.

## Best Immediate Next Step

The next best step is:

> Run Job 0: TalkingHead Evaluation.

Then:

1. Job 1: R3F Avatar Canvas Bootstrap
2. Job 2: Blink and Gaze System
3. Job 3: Avatar State Machine
4. Job 4: Chat API Route
5. Job 5: TTS API Route
6. Job 6: WebAudio Lip-Sync
7. Job 7: Full Chat-To-Speech Flow

## Final Recommendation

The strongest Upcube path is:

> Build Ethen Live first as an owned browser-rendered real-time avatar agent. Then expand into a full Upcube Live Avatar Platform. Much later, explore neural video if user demand and funding justify the infrastructure.

This gives Upcube:

- visible product differentiation
- cost control
- platform ownership
- real user validation
- a path toward Tavus-style live agents
- a path toward Synthesia-style studio tools later

The first product should not be “another Synthesia clone.”

The first product should be:

> **Upcube Live Avatar: real-time AI avatars that talk, listen, guide, and act across websites, products, training, support, and apps.**
