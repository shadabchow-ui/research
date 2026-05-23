# Upcube Avatar Cloud Master Source of Truth

## Document Purpose

This is the final master source-of-truth document for the **Upcube / Ethen / Avatar Cloud** project.

It merges the research and planning from:

- Upcube Avatar Cloud platform strategy
- Upcube Avatar Cloud execution plan
- Ethen live avatar execution plan
- Claude research synthesis
- Gemini research synthesis
- Browser-rendered photorealistic Ethen avatar research
- Additional CC4 / optimization / lip-sync research
- Tavus-quality missing architecture research
- Tavus voice / WebRTC / infrastructure / safety research
- Exa Batch 1 technical synthesis
- Exa Batch 2 platform and market synthesis
- Remaining 40–45% research synthesis
- Observability / API / embed / metering research synthesis

This file should guide the next implementation prompts, product decisions, and roadmap planning.

---

# 1. Final Product Vision

## Core Vision

Build **Upcube Avatar Cloud**:

> A platform for live AI avatars and studio avatar videos for websites, training, sales, education, support, creators, and developers — powered by Ethen as the flagship avatar.

This should combine:

```text
Tavus-style real-time conversational avatars
+
Synthesia-style avatar video creation
+
Upcube’s own interactive video pages
+
Ethen as the flagship Upcube AI avatar
```

## Product Family

```text
Ethen = Upcube’s personal flagship avatar
Upcube Live Avatar = Tavus-style real-time avatar agents
Upcube Studio = Synthesia-style avatar video generation
Interactive Video Pages = Upcube’s differentiation layer
Avatar API = developer platform
Avatar Governance Center = trust, consent, safety, compliance
```

## Strategic Wedge

Do not build only a Synthesia clone.

Do not build only a Tavus clone.

Build:

> **Live avatar agents + generated avatar videos + interactive video pages + developer API.**

The key differentiation is that Upcube videos should not be passive. They should become interactive avatar-powered pages where users can watch, ask questions, take quizzes, submit leads, and continue with a live avatar.

---

# 2. Current Strategic Decision

## Build Ethen First

The correct path is:

```text
Ethen first
→ Ethen Live
→ Upcube Live Avatar Beta
→ Upcube Studio Lite
→ Interactive Video Pages
→ Neural video / replica research
→ Enterprise platform
```

## Why Ethen First

Ethen proves the experience before Upcube sells the platform.

Ethen should become:

```text
browser-rendered 3D avatar
behavioral presence layer
AI product guide
voice assistant
real-time avatar agent
platform demo
```

## What Not To Build First

Do not start with:

```text
full Synthesia video editor
neural video replica training
custom WebRTC SFU
full replica marketplace
user voice cloning
large avatar library
enterprise SSO
C2PA live stream signing
complex timeline editor
GPU video serving
```

Those are later-stage systems.

---

# 3. Product Tracks

## Track A: Ethen

Ethen is Upcube’s own AI avatar guide for upcube.ai.

### Ethen Purpose

Ethen should:

```text
explain Upcube
answer product questions
route users to products/apps
speak with voice
eventually listen through microphone
guide users through the Upcube ecosystem
serve as the flagship demo for Avatar Cloud
```

### Ethen Experience Goal

```text
User opens upcube.ai
→ sees browser-rendered 3D Ethen
→ types or speaks a question
→ Ethen answers with text and voice
→ avatar moves naturally while responding
→ Ethen routes user to the right Upcube product/app
```

### Ethen Positioning

> Ethen is Upcube’s live AI guide — a real-time avatar that helps users understand products, answer questions, and get things done inside the Upcube ecosystem.

---

## Track B: Upcube Live Avatar

This is the Tavus-style product.

### Purpose

Let users create real-time avatar agents that:

```text
talk
listen
answer questions
guide website visitors
support customers
sell products
teach users
collect leads
book meetings
hand off to humans
```

### First Commercial Template

The strongest early commercial use case is:

> Website Concierge / AI SDR Avatar

This template should:

```text
greet visitors
answer product questions
qualify leads
explain pricing
book meetings
collect contact info
summarize conversations
send CRM events later
recommend next product page
handoff to human sales/support
```

---

## Track C: Upcube Studio

This is the Synthesia-style product.

### Purpose

Let users create avatar-led videos from:

```text
script
PDF
URL
blog post
product page
slide deck
help docs
course outline
training manual
YouTube transcript
```

### Output Types

```text
avatar video
voiceover
captions
transcript
short clips
hosted video page
interactive Q&A page
downloadable MP4
embeddable player
```

### Build Strategy

Start with **Studio Lite**, not a full timeline editor.

First version:

```text
script editor
scene cards
avatar presenter
voiceover
captions
hosted video page
```

Later:

```text
templates
brand kit
multilingual dubbing
team workspace
media library
render queue
caption editor
MP4 export
approval workflows
```

---

## Track D: Interactive Video Pages

This is Upcube’s best differentiation layer.

### Core Idea

Generated videos should become interactive pages.

A page can include:

```text
video
transcript
summary
quiz
live avatar Q&A
lead capture
analytics
recommended next action
```

### Example

```text
User uploads training PDF
→ Upcube generates avatar training video
→ adds transcript
→ adds quiz
→ adds live avatar Q&A
→ publishes hosted page
→ tracks engagement and leads
```

---

# 4. Current Completion Estimate

## Roadmap Completeness

The research and roadmap now cover approximately:

```text
90–95% roadmap completeness
```

Meaning most major systems needed for a Tavus/Synthesia-class platform have been identified.

## Product Completeness After Implementation

If the full current execution plan is implemented well, Upcube could reach approximately:

```text
75–85% product completeness
```

toward a serious Tavus + Synthesia-style platform.

## Why Not 100% Yet

The remaining 15–25% is difficult execution:

```text
premium avatar model quality
real-time infrastructure reliability
mature Studio editor
neural video / replica rendering
GPU serving at scale
enterprise trust and compliance
global WebRTC reliability
billing enforcement
high-quality developer API and SDKs
```

---

# 5. Platform Object Model

## Persona

Defines who the avatar is and how it behaves.

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

Defines avatar identity and rendering mode.

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

Defines voice identity.

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

Defines a deployable real-time avatar agent.

```ts
LiveAgent {
  id: string
  name: string
  personaId: string
  replicaId: string
  voiceId: string
  knowledgeBaseIds: string[]
  embedConfigId: string
  conversationFlowProfileId?: string
  status: "draft" | "published" | "disabled"
}
```

## StudioVideo

Defines a Synthesia-style generated video project.

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

Defines a live interaction session.

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

## ConversationFlowProfile

Controls turn-taking and behavior style.

```ts
ConversationFlowProfile {
  id: string
  name: string
  turnTakingPatience: "low" | "medium" | "high"
  interruptibility: "low" | "medium" | "high"
  idleEngagement: "off" | "soft" | "eager"
  wakePhrase?: string
  voiceIsolation: "off" | "near" | "strong"
  backchannelTolerance: "low" | "medium" | "high"
}
```

## AvatarSessionToken

Short-lived token for safe embeds.

```ts
AvatarSessionToken {
  id: string
  liveAgentId: string
  allowedDomain: string
  expiresAt: string
  permissions: string[]
  sessionId?: string
  issuedAt: string
  revokedAt?: string
}
```

## EmbedConfig

Defines embeddable widget settings.

```ts
EmbedConfig {
  id: string
  liveAgentId: string
  allowedDomains: string[]
  theme: "light" | "dark" | "system"
  position: "bottom-right" | "bottom-left" | "inline"
  defaultMode: "text" | "voice" | "video"
  showBranding: boolean
  leadCaptureEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

## UsageRecord

Defines billing and metering.

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

Required for custom replicas and cloned voices.

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
  verificationMethod: "manual" | "liveness" | "document" | "enterprise_attestation"
}
```

## RendererSession

Future neural/video renderer session.

```ts
RendererSession {
  id: string
  conversationId: string
  rendererType: "browser_3d" | "neural_video" | "unreal_stream" | "vendor_video"
  region: string
  status: "starting" | "active" | "recovering" | "ended" | "failed"
  gpuWorkerId?: string
  streamUrl?: string
  startedAt: string
  endedAt?: string
}
```

## AvatarEvent

Real-time event protocol object.

```ts
AvatarEvent {
  id: string
  sessionId: string
  conversationId?: string
  agentId?: string
  type: string
  seq: number
  turnIndex?: number
  timestamp: string
  payload: Record<string, unknown>
}
```

---

# 6. Ethen Runtime State Model

Ethen should be structured around runtime states, not one-off animations.

```ts
export type EthenRuntimeState =
  | "idle"
  | "listening"
  | "user_speaking"
  | "thinking"
  | "speaking"
  | "interrupted"
  | "recovering"
  | "offline"
  | "error";
```

## Behavior State Controls

Each state can eventually control:

```text
blink rate
gaze target
head movement
breathing/sway intensity
mouth/jaw movement
facial expression
emotion intensity
UI status label
audio sync
viseme timeline
listening behavior
interruption recovery
```

## Key Principle

Ethen should not be treated as “an avatar that talks.”

Ethen should be a:

> Real-time behavioral presence layer for Upcube.

---

# 7. Technical Architecture Decisions

## First Rendering Path

Use browser-rendered 3D first.

```text
React / Next.js
React Three Fiber
Three.js
GLB or VRM
WebGL 2 first
WebGPU optional later
KTX2/Basis textures
Meshopt compression
```

## Avatar Runtime Candidates

Evaluate before locking implementation:

```text
Raw React Three Fiber + Three.js
R3F + three-vrm
TalkingHead
Omote R3F
AnimaSync
Khavee SDK
Rhubarb WASM
```

## Current Runtime Recommendation

For MVP, compare:

```text
Raw R3F + three-vrm
TalkingHead wrapper
Omote R3F
AnimaSync
```

Do not blindly build everything custom until runtime evaluation is complete.

## Lip-Sync Ladder

```text
1. WebAudio amplitude
2. Rhubarb WASM
3. Azure viseme events
4. Oculus viseme mapping
5. ARKit 52 blendshape scheduling
6. server-side ARKit blendshape streaming
7. custom audio-to-face model later
```

## TTS Candidates

| Use Case                      | Candidate                                |
| ----------------------------- | ---------------------------------------- |
| Polished scripted Ethen voice | ElevenLabs                               |
| Real-time low-latency voice   | Cartesia                                 |
| Viseme metadata               | Azure Neural TTS                         |
| Simple unified stack          | OpenAI TTS / Realtime                    |
| Cost-sensitive fallback       | Deepgram / OpenAI / Kokoro-type fallback |

## Real-Time Voice Stack

Likely future stack:

```text
LiveKit
Deepgram or Soniox STT
GPT-4o-mini or equivalent streaming LLM
Cartesia or equivalent low-latency TTS
VAD / semantic endpointing
adaptive interruption
transcript capture
latency metrics
```

## Streaming Voice Principle

Bad:

```text
wait for full STT
→ wait for full LLM
→ wait for full TTS
→ play response
```

Good:

```text
stream STT partials
→ start LLM early
→ stream tokens to TTS
→ stream audio back
→ sync avatar states in parallel
```

---

# 8. Ethen Model and Asset Pipeline

## Prototype Asset Path

Use placeholder initially:

```text
public/models/ethen/ethen.glb
public/models/ethen/placeholder.glb
```

If no model exists, render a clean fallback avatar.

## Production Pipeline

Recommended pipeline:

```text
Character Creator / Reallusion
→ Blender cleanup
→ optimized GLB/VRM export
→ ARKit blendshape validation
→ Oculus viseme validation
→ Meshopt compression
→ KTX2/Basis textures
→ mobile budget testing
```

## Production Model Requirements

```text
face morph targets
jaw/mouth controls
teeth/tongue if visible
separate eyes
blink/gaze support
idle animation
speaking animation support
mobile LOD if needed
clean materials
optimized textures
```

## Asset Budgets

Use strict mobile-first budgets:

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
| Mobile DPR           |              cap at 1.0–1.5 |
| Mobile shadows       | disabled or heavily reduced |

---

# 9. API and Session Lifecycle

## Session Lifecycle API

```text
POST /v1/avatar-sessions
POST /v1/avatar-sessions/:id/start
POST /v1/avatar-sessions/:id/end
POST /v1/avatar-sessions/:id/interrupt
GET  /v1/avatar-sessions/:id/events
GET  /v1/avatar-sessions/:id/metrics
GET  /v1/avatar-sessions/:id/transcript
```

## Developer API

```text
POST /v1/personas
GET  /v1/personas/:id
POST /v1/replicas
GET  /v1/replicas/:id
POST /v1/voices
GET  /v1/voices/:id
POST /v1/live-agents
GET  /v1/live-agents/:id
POST /v1/session-tokens
POST /v1/conversations
GET  /v1/conversations/:id
GET  /v1/conversations/:id/transcript
GET  /v1/conversations/:id/metrics
POST /v1/studio-videos
POST /v1/render-jobs
GET  /v1/render-jobs/:id
POST /v1/webhooks
```

## API Security Rules

```text
API keys must be scoped.
Rate limits must exist.
Webhook signatures must be verifiable.
Session tokens must be short-lived.
Provider secrets must stay server-side.
Usage must be metered.
Errors must be predictable.
Docs should be generated from schemas.
```

---

# 10. Embed SDK

## Future Embed Example

```html
<script src="https://avatar.upcube.ai/embed.js" data-agent="agent_id"></script>
```

## Embed SDK Requirements

```text
domain allowlist
session token exchange
theme config
agent config
widget position
voice/text/video mode
event callbacks
lead capture
conversation start/end callbacks
fallback UI
```

## Embed SDK Events

```text
avatar.ready
conversation.started
conversation.ended
user.message
lead.submitted
error
fallback.used
```

## Security Rule

No long-lived API key should ever be exposed in the browser.

Correct flow:

```text
browser loads embed
→ backend validates domain and agent
→ backend issues short-lived session token
→ widget connects with limited token
→ provider secrets remain server-side
```

---

# 11. Observability and Cost Metering

## Why It Matters

To become a real SaaS platform, Upcube must track:

```text
session duration
provider usage
cost per session
latency per stage
WebRTC quality
fallback rate
conversation success/failure
transcripts
data retention mode
```

## Metrics Objects

```ts
CallMetrics {
  sessionId: string
  durationSeconds: number
  turns: TurnMetrics[]
  cost: CostBreakdown
  latencyP50: LatencyBreakdown
  latencyP95: LatencyBreakdown
  latencyP99: LatencyBreakdown
  sttProvider: string
  ttsProvider: string
  llmProvider: string
  createdAt: string
}
```

```ts
WebRTCQualityMetrics {
  sessionId: string
  rttMs: number
  jitterMs: number
  packetLossPercent: number
  audioGapCount: number
  droppedFrames: number
  iceReconnects: number
  turnUsed: boolean
  bitrateKbps: number
  codec?: string
  region?: string
  createdAt: string
}
```

## Events To Log

```text
session.created
session.started
session.ended
user.started_speaking
user.stopped_speaking
user.interrupted
stt.partial
stt.final
llm.started
llm.first_token
llm.completed
llm.cancelled
tts.started
tts.first_audio
tts.completed
tts.cancelled
avatar.idle
avatar.listening
avatar.thinking
avatar.started_speaking
avatar.stopped_speaking
avatar.interrupted
tool.called
tool.completed
tool.failed
billing.usage_incremented
error
```

---

# 12. Trust, Consent, and Governance

## Avatar Governance Center

Required before custom human replicas or cloned voices.

Modules:

```text
Consent Records
Identity Verification
Voice Clone Permissions
Replica Revocation
Watermarking / C2PA
Audit Logs
Policy Templates
Takedown Requests
Content Moderation
Allowed Use Policies
Data Retention Controls
```

## Safety Rules

Start with:

```text
Upcube-owned Ethen
stock/stylized avatars
business-safe avatars
no broad user-created human replicas yet
no celebrity/public figure cloning
no cloned voices without consent
clear AI disclosure
```

## Enterprise Controls

Later:

```text
SSO
RBAC
audit logs
custom retention windows
zero data retention mode
workspace roles
SOC2 readiness
exportable audit logs
API key controls
billing limits
```

---

# 13. GPU and Neural Video Track

## Neural Video Is Later

Do not use neural video for Ethen MVP.

Research candidates:

```text
Wav2Lip
MuseTalk
LivePortrait
SadTalker
Hallo-Live
LiveTalk
Digital-Avatar-ITRI
LiveTalking
```

## Practical Order

```text
Wav2Lip benchmark
→ MuseTalk benchmark
→ LivePortrait + MuseTalk benchmark
→ LiveTalking / Digital-Avatar-ITRI evaluation
→ Hallo-Live / LiveTalk research review
```

## Future GPU Serving Components

```text
GPUWorker
RendererSession
ModelCache
WarmPool
InferenceQueue
RegionRouter
WebRTCVideoPublisher
SessionMeter
CostEstimator
```

## Use Cases For Neural Video

```text
premium replicas
high-end studio export
enterprise on-prem avatar
future Tavus-quality rendering
```

---

# 14. Product Modules

## Public Product Page

Route:

```text
/products/live-avatar
```

or:

```text
/upcube-live-avatar
```

Sections:

```text
hero
live Ethen demo
use cases
platform preview
waitlist/signup CTA
```

Suggested copy:

```text
Create AI avatars that talk, listen, guide, and teach.

Upcube Live Avatar helps teams launch real-time AI agents and avatar-led videos for websites, training, product demos, support, and sales.
```

## Dashboard Module

Module:

```text
Avatar Agents
```

Cards:

```text
Ethen Guide
Sales Agent
Support Agent
Training Coach
Product Demo Agent
```

## Live Agent Builder Templates

```text
Website Concierge
AI SDR
Support Agent
Training Coach
Product Demo Agent
Recruiting Screener
Ecommerce Shopping Assistant
```

## Studio Workflows

```text
Script to Video
Document to Video
URL to Video
Training Video
Product Explainer
Multilingual Dub
Interactive Video Page
```

---

# 15. Monetization

## Free Plan

```text
1 demo avatar
limited chat
watermark
limited hosted video pages
no custom voice
no custom-domain embed
```

## Creator Plan

```text
avatar videos
no watermark
basic voices
basic live agent
limited monthly minutes
hosted pages
```

## Business Plan

```text
website live agent
custom knowledge base
brand kit
lead capture
analytics
team workspace
more minutes
```

## Developer Plan

```text
API keys
embeddable agents
webhooks
SDK
usage dashboard
pay-as-you-go
```

## Enterprise Plan

```text
SSO
audit logs
consent controls
private knowledge base
custom avatar
custom voice
data retention
SLA
compliance package
```

## Usage Add-ons

```text
live conversation minutes
rendered video minutes
TTS characters
STT minutes
LLM credits
neural video minutes
storage
custom avatar creation
voice cloning
```

---

# 16. Master Execution Roadmap

## Phase 0: Planning and Architecture Lock

```text
Job 0A: Competitive Positioning Matrix
Job 0B: Avatar Runtime Evaluation
Job 0C: Voice Pipeline Architecture
Job 0D: Neural Video Benchmark Plan
Job 0E: GPU Serving Architecture Plan
Job 0F: Studio Competitor and Workflow Matrix
Job 0G: Website Concierge / AI SDR Product Template
Job 0H: Avatar Governance Center Spec
Job 0I: Session Lifecycle API Spec
Job 0J: Observability and Enterprise Ops Spec
```

## Phase 1: Ethen MVP

```text
Job 1: Browser 3D Ethen Canvas
Job 2: Ethen Behavior Engine
Job 3: Text + TTS Speaking Prototype
Job 4: WebAudio Mouth Movement
Job 5: Ethen Product Guide
Job 6: Full Ethen MVP Polish
```

## Phase 2: Ethen Live

```text
Job 7: LiveKit Voice Mode Spike
Job 8: Adaptive Interruption
Job 9: Conversation Flow Profile
Job 10: Avatar Event Protocol
Job 11: Observability and Cost Metering v1
```

## Phase 3: Live Avatar Platform Beta

```text
Job 12: Platform Data Model
Job 13: Embed SDK and Short-Lived Session Tokens
Job 14: Developer API v1
Job 15: Avatar Dashboard Analytics
Job 16: Live Agent Builder Beta
```

## Phase 4: Studio Lite

```text
Job 17: StudioVideo Data Model
Job 18: Scene Card Editor
Job 19: Script to Video Flow
Job 20: Voiceover + Captions
Job 21: Hosted Video Page
```

## Phase 5: Interactive Video Pages

```text
Job 22: Transcript Q&A
Job 23: Quiz / Checklist Module
Job 24: Lead Capture
Job 25: Video Page Analytics
Job 26: Live Avatar Q&A Overlay
```

## Phase 6: Enterprise and Governance

```text
Job 27: Avatar Governance Center
Job 28: Consent and Revocation Flow
Job 29: Data Retention Controls
Job 30: Workspace Roles / RBAC
Job 31: Audit Logs
```

## Phase 7: Neural Video Research

```text
Job 32: Neural Video Benchmark
Job 33: GPU Serving Architecture Spec
Job 34: RendererSession Prototype
Job 35: Wav2Lip/MuseTalk Research Prototype
Job 36: Build/Buy/Partner Recommendation
```

---

# 17. Immediate Next Step

The next implementation prompt should be:

> **Job 0: Repo + Avatar Runtime Evaluation + Ethen Integration Audit**

## Job 0 Purpose

Before coding the avatar runtime, inspect the actual Upcube repo and decide the best Ethen runtime path.

## Job 0 Must Evaluate

```text
current repo structure
current Ethen components
homepage/product page integration point
package manager
Next.js/React version
styling system
public asset conventions
deployment constraints
Raw R3F + three-vrm
TalkingHead
Omote R3F
AnimaSync
Khavee SDK
Rhubarb WASM
```

## Job 0 Output

```text
repo source index
Ethen integration point
runtime recommendation
dependencies recommendation
risk list
validation commands
Job 1 implementation plan
```

---

# 18. First Public Milestone

The first real milestone is:

> **Ethen visible, alive, speaking, and useful on upcube.ai.**

This means:

```text
3D avatar visible
blink/gaze/idle motion working
text input working
Ethen can answer Upcube questions
voice playback works
basic mouth movement works
product routing works
fallback works
mobile does not break
```

This is enough for:

```text
public demo
investor preview
waitlist page
Upcube product credibility
first platform proof
```

---

# 19. Final Recommendation

Stop broad research for now.

The roadmap is now complete enough to begin implementation.

The best sequence is:

```text
1. Run Job 0
2. Decide avatar runtime
3. Build browser 3D Ethen
4. Add behavior engine
5. Add text + TTS + mouth movement
6. Add Upcube product guide
7. Add live voice
8. Platformize into Live Avatar Beta
9. Add Studio Lite
10. Add Interactive Video Pages
```

The long-term vision remains:

> **Upcube Avatar Cloud becomes the platform for live AI avatars, studio avatar videos, and interactive avatar-powered pages — with Ethen as the flagship proof.**
