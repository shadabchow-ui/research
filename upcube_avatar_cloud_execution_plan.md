# Upcube Avatar Cloud Execution Plan

## Purpose

This execution plan turns the Upcube Avatar Cloud strategy into a practical build sequence.

The platform vision is:

> **Upcube Avatar Cloud: live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators — powered by Ethen as the flagship avatar.**

The execution priority is:

1. Build **Ethen MVP** first.
2. Upgrade Ethen into **Ethen Live**.
3. Turn Ethen into **Upcube Live Avatar Beta**.
4. Add **Upcube Studio Lite**.
5. Add **Interactive Video Pages**.
6. Research **neural video / replica infrastructure** only after traction.

## Product Tracks

## Track A: Ethen

Ethen is Upcube’s own AI avatar guide for upcube.ai.

### Goal

Create a premium AI guide that can:

- appear on upcube.ai
- explain Upcube products
- answer questions
- speak with voice
- later listen through microphone
- guide users into Upcube apps
- become the flagship demo for the Avatar Cloud platform

### First target experience

```text
User opens upcube.ai
→ sees Ethen as a browser-rendered 3D avatar
→ types a question
→ Ethen answers with text and voice
→ avatar moves mouth while speaking
→ Ethen routes user to the right product/app
```

## Track B: Upcube Live Avatar

This is the Tavus-style platform.

### Goal

Let users create real-time AI avatars that can:

- talk
- listen
- answer questions
- guide website visitors
- support customers
- sell products
- teach users
- collect leads
- book meetings
- hand off to humans

### First target experience

```text
User creates a Live Agent
→ chooses avatar
→ chooses voice
→ sets persona
→ uploads docs
→ gets embed code
→ adds avatar to website
→ views conversations and usage
```

## Track C: Upcube Studio

This is the Synthesia-style platform.

### Goal

Let users generate avatar-led videos from scripts, docs, URLs, and product pages.

### First target experience

```text
User creates a video project
→ pastes script or uploads document
→ chooses avatar and voice
→ generates avatar video
→ gets hosted page with captions and transcript
```

## Track D: Interactive Video Pages

This is the differentiation layer.

### Goal

Combine video generation with live avatar Q&A.

### First target experience

```text
User uploads training PDF
→ Upcube generates avatar training video
→ adds transcript
→ adds quiz
→ adds live avatar Q&A
→ publishes hosted interactive page
```

## Strategic Build Rule

Do not start by cloning Tavus or Synthesia completely.

Start with:

```text
Ethen MVP
→ Ethen Live
→ Live Avatar Beta
→ Studio Lite
→ Interactive Video Pages
→ Neural Video Research
```

This keeps the product useful, demoable, and cost-controlled.

---

# Execution Phases

## Phase 0: Repo and Runtime Audit

### Goal

Understand the existing Upcube repo before implementation.

### Scope

- inspect framework and package manager
- find current Ethen components
- find homepage/product page structure
- find public asset conventions
- inspect styling system
- inspect deployment constraints
- check whether static export or Cloudflare Pages constraints apply

### Deliverables

- source index
- Ethen integration point
- package manager decision
- available routes/pages
- recommended component path
- current validation commands

### Acceptance Criteria

- exact files to modify are known
- no guessed file paths
- no broad redesign
- validation commands are documented

---

## Phase 1: Ethen Browser Avatar MVP

### Goal

Add browser-rendered 3D Ethen to Upcube.

### Core features

- React Three Fiber canvas
- Three.js scene
- GLB/VRM model path convention
- fallback geometric avatar
- lighting/camera framing
- WebGL fallback
- responsive container
- no AI yet
- no voice yet
- no lip-sync yet

### Technical Direction

```text
Next.js / React
React Three Fiber
Three.js
@react-three/drei
GLB or VRM model
WebGL 2 first
WebGPU optional later
```

### Deliverables

- `EthenAvatar3D` component
- model asset README
- integrated visual area in existing Ethen panel/page
- fallback UI for missing model or WebGL failure

### Acceptance Criteria

- avatar area renders without model file
- future model can be placed in `public/models/ethen/ethen.glb`
- no SSR/hydration crash
- build passes or failures are honestly reported
- no vendor avatar dependency is added

---

## Phase 2: Ethen Behavior Engine v1

### Goal

Make Ethen feel alive before speech.

### Core states

```ts
export type EthenBehaviorState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "greeting"
  | "confirming"
  | "curious"
  | "offline"
  | "error";
```

### Core behaviors

- idle breathing/sway
- blink loop
- gaze movement
- subtle head movement
- thinking posture
- speaking placeholder motion
- listening posture
- reduced-motion support
- smooth state transitions

### Deliverables

- `ethenBehaviorTypes.ts`
- `useEthenBehavior.ts`
- state-controlled avatar behavior
- visible behavior differences per state

### Acceptance Criteria

- Ethen blinks naturally
- gaze does not feel frozen
- state changes are controlled by props
- reduced-motion is respected
- no AI/voice/lip-sync is added yet

---

## Phase 3: Text + TTS Speaking Prototype

### Goal

Let Ethen speak generated or scripted responses.

### Core features

- text input
- TTS provider abstraction
- audio playback
- speaking state while audio plays
- captions/text fallback
- error fallback if TTS fails

### TTS candidates

| Use Case              | Provider Candidate    |
| --------------------- | --------------------- |
| Polished voice        | ElevenLabs            |
| Real-time low latency | Cartesia              |
| Viseme metadata       | Azure Neural TTS      |
| Simple unified stack  | OpenAI TTS / Realtime |

### Deliverables

- `/api/tts` route or equivalent backend service
- client-side audio player utility
- speaking state integration
- fallback text response

### Acceptance Criteria

- audio plays after user action
- avatar enters speaking state
- audio failure degrades to text
- API keys are never exposed to browser

---

## Phase 4: Basic Mouth Movement

### Goal

Add simple mouth movement to Ethen speech.

### Scope

- WebAudio AnalyserNode
- amplitude/RMS extraction
- jawOpen / mouthOpen mapping
- smoothing with lerp
- mouth closes when audio ends

### Deliverables

- `useWebAudioMouthMovement.ts`
- morph-target-safe adapter
- fallback if avatar lacks jaw/mouth morphs

### Acceptance Criteria

- mouth moves while Ethen speaks
- movement is not jittery
- mouth closes naturally
- no full viseme system yet

---

## Phase 5: Ethen Product Guide

### Goal

Make Ethen useful, not just visual.

### Scope

- Upcube product guide prompt
- product-family knowledge
- safe response rules
- off-topic handling
- CTA routing
- simple session memory
- text response streaming

### Deliverables

- `/api/chat` route or equivalent
- `ethenPrompt.ts`
- product knowledge config
- UI connection from prompt to response to TTS

### Acceptance Criteria

- Ethen explains Upcube clearly
- Ethen routes users to relevant apps/pages
- Ethen does not make unsupported claims
- user can complete a full type-to-answer-to-voice flow

---

## Phase 6: Ethen Live Voice

### Goal

Turn Ethen into a real-time voice avatar that talks and listens.

### Scope

- microphone permission UX
- STT
- streaming LLM
- streaming TTS
- LiveKit or equivalent media transport
- VAD
- endpointing
- transcript
- avatar state sync
- latency metrics

### Candidate stack

```text
LiveKit
Deepgram or Soniox STT
GPT-4o-mini or equivalent streaming LLM
Cartesia or equivalent low-latency TTS
WebRTC data/audio channels
```

### Deliverables

- LiveKit room/session setup
- voice agent backend worker
- browser voice mode
- transcript capture
- state sync: listening → thinking → speaking

### Acceptance Criteria

- user can speak to Ethen
- Ethen responds with voice
- state changes are visible
- session latency is measured
- fallback to text mode works

---

## Phase 7: Adaptive Interruption and Barge-In

### Goal

Make live conversation feel natural.

### Scope

- detect intentional interruption
- ignore coughs/noise/backchannels when possible
- stop TTS stream
- clear audio queue
- reset mouth blendshapes
- update avatar state
- record interruption event

### Deliverables

- turn-taking state machine
- audio interruption handler
- client avatar reset handler
- interruption telemetry

### Acceptance Criteria

- user can interrupt Ethen
- accidental noise does not constantly interrupt
- mouth/face resets cleanly
- transcript records interruption event

---

## Phase 8: Better Lip-Sync

### Goal

Upgrade beyond volume-based mouth movement.

### Options

```text
Rhubarb WASM in Web Worker
Azure viseme events
Oculus viseme mapping
ARKit 52 blendshape scheduling
provider-neutral viseme timeline
```

### Deliverables

- `VisemeTimeline` type
- `useVisemeScheduler.ts`
- provider adapter
- morph-target mapping config
- graceful degradation if blendshapes are missing

### Acceptance Criteria

- mouth shapes match phonemes better than amplitude
- CPU usage is acceptable
- mobile does not stutter
- avatar works with partial blendshape support

---

## Phase 9: Custom Ethen Model

### Goal

Replace placeholder with branded production Ethen.

### Pipeline

```text
Character Creator 4/5
→ Blender cleanup
→ ARKit blendshape naming
→ Oculus viseme support
→ separate eyes
→ jaw/mouth controls
→ teeth/tongue geometry
→ Meshopt compression
→ KTX2/Basis textures
→ optimized GLB/VRM
```

### Asset requirements

- optimized GLB/VRM
- ARKit 52 blendshapes if possible
- Oculus 15 visemes if possible
- jaw/mouth controls
- separate eyes
- teeth/tongue if visible
- idle animation
- blink/gaze support
- mobile LOD if needed

### Acceptance Criteria

- model loads quickly
- face controls work
- no broken materials
- no mouth/teeth clipping
- mobile performance is acceptable
- file size and draw calls are within budget

---

## Phase 10: Upcube Live Avatar Beta

### Goal

Turn Ethen into a configurable platform product.

### User workflow

```text
Create Live Agent
→ choose avatar
→ choose voice
→ set persona
→ upload docs
→ configure greeting
→ publish embed
→ view conversations
→ track usage
```

### Core objects

- Persona
- Replica
- Voice
- LiveAgent
- KnowledgeBase
- Conversation
- Session
- Transcript
- UsageRecord
- EmbedConfig

### Deliverables

- dashboard module: Avatar Agents
- live agent creation flow
- basic embed config
- public embed script placeholder
- conversation logs
- usage counters

### Acceptance Criteria

- Ethen is represented as platform data
- a second demo agent can be created
- live agent config drives the runtime
- usage is tracked
- platform is still simple and beta-safe

---

## Phase 11: Upcube Studio Lite

### Goal

Add Synthesia-style generated avatar videos.

### First version

Do not build a full timeline editor.

Build a scene-card video generator.

### Scope

- create video project
- paste script
- choose avatar
- choose voice
- split script into scenes
- generate voiceover
- generate captions
- create hosted video page
- export/download later

### Deliverables

- `StudioVideo` object
- scene-card editor
- script-to-scenes flow
- voiceover generation
- caption generation
- hosted page

### Acceptance Criteria

- user can create a simple avatar video project
- scenes are editable
- captions are generated
- hosted page is shareable
- no complex video timeline yet

---

## Phase 12: Interactive Video Pages

### Goal

Create Upcube’s strongest differentiator.

### Scope

- generated video
- transcript
- summary
- quiz
- live avatar Q&A
- lead capture
- analytics
- recommended next action

### Deliverables

- hosted interactive page template
- “Ask this video” chat
- transcript-aware Q&A
- quiz/checklist component
- analytics events

### Acceptance Criteria

- user can publish an interactive video page
- visitor can ask questions about the video
- transcript context is used
- lead capture works
- analytics record engagement

---

## Phase 13: Safety, Billing, Observability

### Goal

Prepare the platform for real customers.

### Scope

- usage metering
- event logs
- latency metrics
- transcript storage policy
- moderation hooks
- API key management
- rate limits
- Stripe billing later
- consent architecture later

### Events to log

```text
session.created
session.started
user.message
user.speech.started
stt.partial
stt.final
llm.first_token
tts.first_audio
avatar.speaking
user.interrupted
session.ended
error
```

### Metrics

- speech stop → first reply audio
- STT latency
- LLM time-to-first-token
- TTS time-to-first-audio
- audio gaps
- WebRTC jitter
- avatar frame drops
- conversation completion rate
- signup/conversion rate
- cost per session

### Acceptance Criteria

- cost per session can be estimated
- session latency can be inspected
- usage limits can be enforced
- abuse attempts can be tracked
- transcripts follow retention policy

---

## Phase 14: Replica and Neural Video Research

### Goal

Explore Tavus-level quality after traction.

### Do not build this first.

### Scope

- MuseTalk
- LivePortrait
- SadTalker
- Hallo2
- Wav2Lip
- neural talking-head inference
- GPU serving cost
- WebRTC video stream
- C2PA provenance
- consent and liveness verification

### Deliverables

- internal benchmark report
- GPU cost model
- quality comparison
- latency test
- consent architecture proposal
- build/buy/partner recommendation

### Acceptance Criteria

- quality gap is documented
- cost per neural video minute is estimated
- safety obligations are understood
- decision is made whether neural video is worth funding

---

# Implementation Jobs

## Job 0: Repo + Avatar Runtime Evaluation

### Goal

Inspect the Upcube repo and decide the avatar runtime.

### Evaluate

- raw React Three Fiber + Three.js
- `@pixiv/three-vrm`
- TalkingHead
- Khavee SDK as reference only

### Output

Choose one runtime direction:

```text
raw R3F/GLB
R3F + three-vrm
TalkingHead wrapper
custom hybrid
```

### Acceptance Criteria

- repo structure is mapped
- Ethen integration point is identified
- runtime choice is justified
- validation commands are documented

---

## Job 1: Browser 3D Ethen Canvas

### Goal

Add the first visual avatar runtime.

### Deliverables

- `EthenAvatar3D`
- WebGL fallback
- model path convention
- integrated Ethen visual panel

### Non-Scope

- no AI
- no voice
- no TTS
- no lip-sync
- no WebRTC
- no platform objects

---

## Job 2: Ethen Behavior Engine

### Goal

Add state-driven life behavior.

### Deliverables

- behavior types
- behavior hook
- blink/gaze/idle motion
- state transitions

---

## Job 3: TTS Speaking Prototype

### Goal

Let Ethen speak.

### Deliverables

- TTS provider abstraction
- TTS API route
- client audio playback
- speaking state

---

## Job 4: WebAudio Mouth Movement

### Goal

Add basic mouth movement.

### Deliverables

- audio analysis hook
- jawOpen/mouthOpen mapping
- mouth reset

---

## Job 5: Ethen Product Guide

### Goal

Make Ethen useful.

### Deliverables

- chat route
- Ethen system prompt
- Upcube product context
- CTA routing

---

## Job 6: Full Ethen MVP Polish

### Goal

Make the first demo public-ready.

### Deliverables

- loading states
- error states
- mobile checks
- copy polish
- waitlist CTA
- analytics events

---

## Job 7: LiveKit Voice Mode Spike

### Goal

Prototype real-time voice.

### Deliverables

- LiveKit session
- STT/LLM/TTS pipeline
- microphone UX
- transcript
- state sync

---

## Job 8: Adaptive Interruption

### Goal

Add barge-in and turn-taking.

### Deliverables

- interruption detection
- audio cancellation
- state reset
- logs

---

## Job 9: Platform Data Model

### Goal

Introduce platform-ready objects.

### Deliverables

- Persona
- Replica
- Voice
- LiveAgent
- Conversation
- Session
- UsageRecord
- Transcript

---

## Job 10: Live Agent Builder Beta

### Goal

Create the first user-facing platform builder.

### Deliverables

- create agent flow
- choose avatar/voice
- set prompt/persona
- upload/add knowledge
- publish/embed placeholder

---

## Job 11: Studio Lite

### Goal

Create first Synthesia-style workflow.

### Deliverables

- video project object
- scene cards
- script editor
- voiceover generation
- captions
- hosted page

---

## Job 12: Interactive Video Page

### Goal

Combine studio + live avatar.

### Deliverables

- published video page
- transcript Q&A
- quiz/checklist
- analytics
- lead capture

---

# Platform Object Model

## Persona

```ts
Persona {
  id: string
  name: string
  systemPrompt: string
  tone: string
  guardrails: string[]
  knowledgeBaseIds: string[]
  tools: Tool[]
  defaultVoiceId: string
  defaultReplicaId: string
}
```

## Replica

```ts
Replica {
  id: string
  name: string
  modelType: "browser_glb" | "vrm_3d" | "neural_video" | "vendor_video"
  assetUri: string
  voiceId?: string
  consentRecordId?: string
  trainingStatus?: "none" | "queued" | "training" | "ready" | "failed"
  status: "draft" | "active" | "suspended"
}
```

## Voice

```ts
Voice {
  id: string
  provider: "elevenlabs" | "cartesia" | "azure" | "openai" | "deepgram" | "custom"
  externalVoiceId: string
  language: string
  style?: string
  isCloned: boolean
  consentRecordId?: string
}
```

## LiveAgent

```ts
LiveAgent {
  id: string
  name: string
  personaId: string
  replicaId: string
  voiceId: string
  knowledgeBaseIds: string[]
  embedConfigId: string
  status: "draft" | "published" | "disabled"
}
```

## StudioVideo

```ts
StudioVideo {
  id: string
  title: string
  personaId: string
  replicaId: string
  script: string
  scenes: Scene[]
  renderStatus: "draft" | "queued" | "rendering" | "complete" | "failed"
  outputUrl?: string
}
```

## Conversation

```ts
Conversation {
  id: string
  liveAgentId: string
  userId?: string
  sessionId: string
  transcriptId?: string
  startedAt: string
  endedAt?: string
  status: "active" | "ended" | "failed"
}
```

## UsageRecord

```ts
UsageRecord {
  id: string
  ownerId: string
  conversationId?: string
  videoId?: string
  sessionMinutes: number
  renderedVideoMinutes: number
  sttSeconds: number
  ttsCharacters: number
  llmInputTokens: number
  llmOutputTokens: number
  gpuSeconds: number
}
```

## ConsentRecord

```ts
ConsentRecord {
  id: string
  ownerId: string
  replicaId: string
  subjectName: string
  consentTextVersion: string
  signedAt: string
  revocationStatus: "active" | "revoked"
  revokedAt?: string
}
```

---

# First Public Demo Spec

## Route

```text
/products/live-avatar
```

or:

```text
/upcube-live-avatar
```

## Page Sections

1. Hero

   - headline
   - short explanation
   - live Ethen demo panel
   - waitlist/signup CTA

2. Ethen Demo

   - “Ask Ethen about Upcube”
   - text input
   - voice response
   - animated 3D avatar
   - product routing buttons

3. Use Cases

   - sales
   - support
   - training
   - product demos
   - education
   - ecommerce

4. Platform Preview

   - live agents
   - studio videos
   - interactive pages
   - developer API

5. Waitlist CTA
   - “Create your own avatar agent soon”

## Initial Landing Copy

```text
Create AI avatars that talk, listen, guide, and teach.

Upcube Live Avatar helps teams launch real-time AI agents and avatar-led videos for websites, training, product demos, support, and sales.
```

---

# First Dashboard Module Spec

## Module Name

```text
Avatar Agents
```

## Cards

```text
Ethen Guide
Sales Agent
Support Agent
Training Coach
Product Demo Agent
```

## Card Statuses

```text
Draft
Coming Soon
Create Agent
```

## Purpose

This lets Upcube show the platform direction before every feature is complete.

---

# What Not To Build Yet

Do not build these first:

- full Synthesia timeline editor
- custom neural video model
- custom WebRTC SFU
- MetaHuman Pixel Streaming
- full replica marketplace
- user voice cloning
- large avatar library
- enterprise SSO
- complex video editor
- full billing engine
- C2PA live stream signing
- public developer API marketplace

These come later.

---

# Success Metrics

## Ethen MVP Metrics

- avatar load success rate
- page load impact
- first interaction rate
- conversation start rate
- TTS success rate
- fallback rate
- average response latency
- signups from Ethen page
- product CTA clicks

## Ethen Live Metrics

- mic permission acceptance rate
- speech stop to first audio
- interruption success rate
- audio dropout rate
- transcript completion rate
- user satisfaction feedback
- average conversation length

## Platform Beta Metrics

- agents created
- embeds installed
- conversations per agent
- leads captured
- average session minutes
- cost per session
- paid conversion

## Studio Lite Metrics

- videos created
- render success rate
- hosted page views
- share rate
- completion rate
- Q&A engagement

---

# Recommended Immediate Next Step

Run:

```text
Job 0: Repo + Avatar Runtime Evaluation
```

Then run:

```text
Job 1: Browser 3D Ethen Canvas
```

The first real public milestone is:

> **Ethen visible, alive, speaking, and useful on upcube.ai.**

Everything else should build from that.
