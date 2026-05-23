# Upcube Avatar Cloud — New Execution Plan

## Purpose

This is the implementation-ready execution plan for **Upcube Avatar Cloud**, based on the full research set:

- Ethen live avatar execution plan
- Claude research synthesis
- Gemini research synthesis
- Tavus architecture and voice/WebRTC research
- browser photorealistic avatar research
- CC4 / lip-sync / optimization research
- Avatar Cloud platform strategy
- Avatar Cloud execution plan
- remaining 40–45% research synthesis
- observability / API / embed research synthesis
- Exa Batch 1 technical synthesis
- Exa Batch 2 platform and market synthesis
- master source-of-truth roadmap

The goal is to move from planning into implementation.

## Product Vision

> **Upcube Avatar Cloud: live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators — powered by Ethen as the flagship avatar.**

The system should eventually combine:

```text
Ethen = Upcube’s flagship personal AI avatar
Upcube Live Avatar = Tavus-style real-time avatar agents
Upcube Studio = Synthesia-style avatar video generation
Interactive Video Pages = Upcube’s better-than-both wedge
Avatar API = developer platform
Avatar Governance Center = consent, trust, safety, enterprise controls
```

## Execution Principle

Do not start by trying to build a full Tavus or Synthesia clone.

Start with:

```text
Ethen visible, alive, speaking, and useful on upcube.ai.
```

Then platformize.

---

# 1. Current Strategic Position

## What We Are Building First

The first product is **Ethen**, a browser-rendered AI avatar guide for Upcube.

First public target:

```text
User opens upcube.ai
→ sees Ethen as a browser-rendered 3D avatar
→ types a question
→ Ethen answers with text and voice
→ avatar shows listening/thinking/speaking states
→ mouth moves while speaking
→ Ethen routes user to relevant Upcube products
```

## What We Are Building Later

After Ethen works:

```text
Ethen Live Voice
→ Live Avatar Builder
→ Website Concierge / AI SDR template
→ Studio Lite
→ Interactive Video Pages
→ Developer API
→ Governance Center
→ Neural Video Research
→ GPU Serving Architecture
```

## What We Are Not Building First

Do not start with:

```text
custom neural video model
full Synthesia timeline editor
public replica cloning
voice cloning marketplace
custom WebRTC SFU
enterprise SSO
C2PA live stream signing
full billing engine
large avatar marketplace
```

These are later stages.

---

# 2. Product Tracks

## Track A: Ethen

### Goal

Make Ethen the flagship avatar for Upcube.

### Capabilities

```text
browser-rendered 3D avatar
idle / blink / gaze / breathing
text chat
TTS speech
basic mouth movement
Upcube product guide
real-time mic mode later
interruption later
analytics and session metrics
```

## Track B: Upcube Live Avatar

### Goal

Let users create real-time AI avatars for websites, product demos, support, training, and sales.

### First Commercial Wedge

```text
Website Concierge / AI SDR Avatar
```

Capabilities:

```text
greet visitors
answer product questions
qualify leads
book meetings
capture email
summarize conversations
route to pricing/support/demo
handoff to human
```

## Track C: Upcube Studio

### Goal

Create Synthesia-style avatar videos.

### First Version

```text
script-to-video
scene cards
avatar presenter
voiceover
captions
hosted video page
```

### Later Version

```text
document-to-video
URL-to-video
brand kit
templates
multilingual dubbing
team workspace
render queue
MP4 export
```

## Track D: Interactive Video Pages

### Goal

Differentiate from passive video tools.

Each page can include:

```text
avatar video
transcript
summary
quiz
live avatar Q&A
lead capture
analytics
next action CTA
```

## Track E: Platform / API / Governance

### Goal

Turn the product into a real SaaS platform.

Includes:

```text
developer API
embed SDK
short-lived session tokens
usage metering
observability
WebRTC telemetry
governance center
consent records
audit logs
data retention controls
billing later
```

---

# 3. Recommended Implementation Order

## Stage 0 — Planning and Repo Grounding

```text
Job 0A: Repo + Product Surface Audit
Job 0B: Avatar Runtime Evaluation
Job 0C: Voice Pipeline Architecture
Job 0D: Competitive Positioning Matrix
Job 0E: Website Concierge / AI SDR Product Template
```

## Stage 1 — Ethen Visual MVP

```text
Job 1: Browser 3D Ethen Canvas
Job 2: Ethen Behavior Engine
Job 3: Ethen Product Surface Integration
```

## Stage 2 — Ethen Speaking MVP

```text
Job 4: Text Chat + Upcube Product Guide
Job 5: TTS Speaking Prototype
Job 6: Basic WebAudio Mouth Movement
Job 7: Ethen MVP Polish and Public Demo Page
```

## Stage 3 — Ethen Live Voice

```text
Job 8: Live Voice Architecture Spike
Job 9: Microphone + Streaming STT
Job 10: Streaming LLM + Streaming TTS
Job 11: Adaptive Interruption and Conversation Flow
Job 12: Ethen Live Voice Polish
```

## Stage 4 — Platform Foundations

```text
Job 13: Platform Object Model
Job 14: Avatar Event Protocol
Job 15: Observability and Cost Metering v1
Job 16: Short-Lived Session Tokens
Job 17: Embed SDK v1
Job 18: Avatar Dashboard Analytics
```

## Stage 5 — Live Avatar Beta

```text
Job 19: Avatar Agents Dashboard
Job 20: Live Agent Builder Beta
Job 21: Website Concierge / AI SDR Template
Job 22: Conversation Logs and Transcripts
Job 23: Usage and Quality Dashboard
```

## Stage 6 — Studio Lite

```text
Job 24: Studio Video Object Model
Job 25: Script-to-Scene Editor
Job 26: Avatar Presenter + Voiceover
Job 27: Captions + Transcript
Job 28: Hosted Video Page
```

## Stage 7 — Interactive Video Pages

```text
Job 29: Transcript-Aware Q&A
Job 30: Quiz / Checklist Layer
Job 31: Lead Capture and CTA Layer
Job 32: Interactive Page Analytics
```

## Stage 8 — Governance and Enterprise Foundation

```text
Job 33: Avatar Governance Center Spec
Job 34: Consent Records and Revocation
Job 35: Data Retention Controls
Job 36: Audit Log Foundation
```

## Stage 9 — Advanced Research Tracks

```text
Job 37: Neural Video Benchmark
Job 38: GPU Serving Architecture Spec
Job 39: Custom Ethen Model Pipeline
Job 40: Better Lip-Sync / Viseme Pipeline
```

---

# 4. Detailed Job Plan

## Job 0A: Repo + Product Surface Audit

### Goal

Map the existing Upcube repo before implementation.

### Required first actions

```bash
cd /Users/sha/Documents/AI/upcube
pwd
ls
find . -maxdepth 3 -name package.json -o -name pnpm-lock.yaml -o -name package-lock.json -o -name yarn.lock -o -name bun.lockb
rg -n "Ethen|ethen|avatar|assistant|guide|chat|agent|console|products" .
find . -maxdepth 4 -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.css" -o -name "*.module.css" \) | head -300
find . -maxdepth 4 -type d \( -name "public" -o -name "components" -o -name "app" -o -name "pages" -o -name "md" -o -name "assets" -o -name "models" \)
```

### Deliverables

```text
repo map
package manager
framework version
current Ethen integration point
public asset conventions
styling system
validation commands
risk notes
```

### Acceptance Criteria

```text
No guessed paths.
Exact files for Job 1 are identified.
Validation commands are documented.
Ethen integration point is known.
```

---

## Job 0B: Avatar Runtime Evaluation

### Goal

Choose the best browser avatar runtime path before building too much custom logic.

### Evaluate

```text
Raw React Three Fiber + Three.js
R3F + three-vrm
TalkingHead
Omote R3F
AnimaSync
Rhubarb WASM
Khavee SDK as reference only
```

### Decision categories

```text
adopt
wrap
reference only
reject
```

### Evaluation criteria

```text
Next.js compatibility
SSR safety
bundle size
mobile performance
GLB/VRM support
ARKit 52 support
Oculus viseme support
gaze/blink support
lip-sync support
licensing
maintenance
TypeScript quality
ability to fit Upcube UI
vendor lock-in risk
```

### Acceptance Criteria

```text
One runtime path is recommended.
Fallback path is recommended.
Reasoning is documented.
No implementation beyond evaluation unless safe and scoped.
```

---

## Job 0C: Voice Pipeline Architecture

### Goal

Define the real-time voice stack before implementing Ethen Live.

### Candidate stack

```text
LiveKit or Pipecat for transport/orchestration
Deepgram / Soniox / AssemblyAI for STT
GPT-4o-mini or equivalent streaming LLM
Cartesia / ElevenLabs / OpenAI / Deepgram for TTS
semantic endpointing
VAD
barge-in handling
fallback providers
```

### Output

```text
transport choice
STT choice
TTS choice
LLM choice
endpointing strategy
barge-in strategy
latency budget
fallback model
session event model
```

### Acceptance Criteria

```text
Architecture supports streaming.
Architecture supports interruption.
Architecture supports transcript capture.
Architecture supports latency measurement.
Architecture can degrade to text mode.
```

---

## Job 0D: Competitive Positioning Matrix

### Goal

Lock positioning against Tavus, Synthesia, HeyGen, D-ID, VEED, DeepBrain, ElevenLabs Studio, and open-source alternatives.

### Output

```text
feature comparison
pricing comparison
API comparison
market wedge
Upcube differentiation
what to copy
what to avoid
what to beat
```

### Acceptance Criteria

```text
Clear first commercial wedge is defined.
Clear studio roadmap is defined.
Clear live-avatar roadmap is defined.
```

---

## Job 0E: Website Concierge / AI SDR Product Template

### Goal

Define the first monetizable Live Avatar template.

### Output

```text
Sales Concierge template
lead capture flow
meeting booking flow
pricing page CTA behavior
CRM handoff object
conversation summary object
qualification questions
analytics events
```

### Acceptance Criteria

```text
Template can be implemented later in Live Agent Builder.
Ethen can demo it conceptually.
Business use case is clear.
```

---

# Stage 1 Jobs

## Job 1: Browser 3D Ethen Canvas

### Goal

Add first browser-rendered Ethen avatar visual runtime.

### Scope

```text
React Three Fiber Canvas
Three.js scene
GLB/VRM model path convention
fallback geometric avatar
lighting
camera framing
loading state
WebGL unsupported fallback
responsive container
```

### Non-scope

```text
No AI
No TTS
No STT
No WebRTC
No lip-sync
No platform objects
No large binary avatar asset
```

### Deliverables

```text
EthenAvatar3D component
EthenAvatarFallback component
public/models/ethen/README.md
integration into existing Ethen panel/page
```

### Acceptance Criteria

```text
Avatar area renders without model file.
Future GLB can be placed at public/models/ethen/ethen.glb.
No SSR/hydration crash.
WebGL fallback works.
Build/lint/typecheck pass or failures are honestly reported.
```

---

## Job 2: Ethen Behavior Engine

### Goal

Make Ethen feel alive before speech.

### States

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

### Behaviors

```text
blink loop
gaze movement
idle breathing/sway
subtle head movement
thinking posture
listening posture
speaking placeholder motion
smooth transitions
reduced-motion support
```

### Deliverables

```text
ethenBehaviorTypes.ts
useEthenBehavior.ts
state-driven avatar behavior
reduced-motion handling
```

### Acceptance Criteria

```text
State changes can be controlled by props.
Ethen blinks naturally.
Gaze does not feel frozen.
Motion is subtle and premium.
Reduced motion is respected.
```

---

## Job 3: Ethen Product Surface Integration

### Goal

Make the Ethen avatar fit the Upcube UI without redesigning the whole site.

### Scope

```text
insert avatar into existing Ethen area
preserve existing nav/copy/CTA behavior
add status label if appropriate
add fallback text mode
keep mobile layout clean
```

### Acceptance Criteria

```text
Avatar feels part of Upcube brand.
No full-site redesign.
No broken responsive layout.
Existing functionality remains intact.
```

---

# Stage 2 Jobs

## Job 4: Text Chat + Upcube Product Guide

### Goal

Make Ethen useful through text first.

### Scope

```text
chat input
streaming response if available
Upcube product guide prompt
product-family context
safe routing
off-topic handling
CTA suggestions
```

### Deliverables

```text
/api/chat or equivalent route
ethenPrompt.ts
product knowledge config
client chat UI integration
```

### Acceptance Criteria

```text
Ethen explains Upcube products clearly.
Ethen routes users to useful pages/apps.
No unsupported claims.
Text fallback works without voice.
```

---

## Job 5: TTS Speaking Prototype

### Goal

Let Ethen speak responses.

### Candidate providers

```text
ElevenLabs for polished voice
Cartesia for low-latency real-time voice
OpenAI TTS for simpler stack
Azure later for viseme metadata
```

### Scope

```text
TTS provider abstraction
server-side API route
audio playback
speaking state
caption/text fallback
provider error fallback
```

### Acceptance Criteria

```text
API keys stay server-side.
Audio plays after user gesture.
Ethen enters speaking state.
Failure degrades to text-only mode.
```

---

## Job 6: Basic WebAudio Mouth Movement

### Goal

Add basic mouth movement before full visemes.

### Scope

```text
WebAudio AnalyserNode
RMS/amplitude extraction
jawOpen/mouthOpen mapping
smoothing with lerp
mouth closes after audio ends
fallback if model lacks morph targets
```

### Acceptance Criteria

```text
Mouth moves while Ethen speaks.
Movement is not jittery.
Mouth closes naturally.
No full viseme system required yet.
```

---

## Job 7: Ethen MVP Polish and Public Demo Page

### Goal

Create a public demo surface for Ethen.

### Route

```text
/products/live-avatar
```

or:

```text
/upcube-live-avatar
```

### Page sections

```text
hero
live Ethen demo
use cases
platform preview
waitlist/signup CTA
```

### Acceptance Criteria

```text
Public demo looks premium.
Ethen can answer basic Upcube questions.
Voice/text fallback works.
CTA routes to signup/waitlist/product pages.
Mobile layout is usable.
```

---

# Stage 3 Jobs

## Job 8: Live Voice Architecture Spike

### Goal

Prototype real-time voice without committing to full production stack.

### Scope

```text
transport spike
mic permission UX
streaming STT test
streaming TTS test
state sync test
latency logging
```

### Acceptance Criteria

```text
Spike proves feasibility.
Latency bottlenecks are documented.
Provider choices are validated or rejected.
```

---

## Job 9: Microphone + Streaming STT

### Goal

Let user speak to Ethen.

### Scope

```text
mic permission flow
stream audio capture
STT partials
STT final transcript
user_speaking state
text transcript display
```

### Acceptance Criteria

```text
User speech appears as transcript.
STT errors degrade gracefully.
No audio starts without user permission.
```

---

## Job 10: Streaming LLM + Streaming TTS

### Goal

Make Ethen respond in a streaming conversational way.

### Scope

```text
streaming LLM
sentence/token buffering
streaming TTS
audio queue
speaking state
first-audio latency metric
```

### Acceptance Criteria

```text
Ethen starts responding quickly.
Audio can begin before full response completes.
Latency is measured.
Text fallback works.
```

---

## Job 11: Adaptive Interruption and Conversation Flow

### Goal

Make conversation feel natural.

### Scope

```text
barge-in detection
backchannel filtering
cough/noise rejection
TTS cancellation
audio queue flush
LLM cancellation when needed
avatar state reset
interruption event log
```

### Acceptance Criteria

```text
User can interrupt Ethen.
Short backchannels do not always interrupt.
Avatar recovers cleanly.
Transcript/event log records interruption.
```

---

## Job 12: Ethen Live Voice Polish

### Goal

Make Ethen Live demo-ready.

### Scope

```text
state transitions
latency display/debug mode
error recovery
text fallback
mobile voice permission handling
basic session metrics
```

### Acceptance Criteria

```text
Ethen can hold a basic live voice conversation.
Failures are graceful.
Demo feels polished enough for public preview.
```

---

# Stage 4 Jobs

## Job 13: Platform Object Model

### Goal

Turn Ethen from hardcoded demo into platform data.

### Core objects

```ts
Persona;
Replica;
Voice;
LiveAgent;
Conversation;
Session;
Transcript;
UsageRecord;
EmbedConfig;
KnowledgeBase;
ConversationFlowProfile;
ConsentRecord;
```

### Acceptance Criteria

```text
Ethen can be represented as platform data.
A second demo agent can be configured later.
Schemas support browser 3D now and neural video later.
```

---

## Job 14: Avatar Event Protocol

### Goal

Define real-time events across browser, backend, avatar runtime, and dashboard.

### Events

```text
session.created
session.started
session.ended
user.started_speaking
user.stopped_speaking
stt.partial
stt.final
llm.first_token
tts.first_audio
avatar.started_speaking
avatar.stopped_speaking
conversation.interrupted
tool.called
error
billing.usage_incremented
```

### Event shape

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

### Acceptance Criteria

```text
Events have sequence ordering.
Events can be grouped by turn.
Events can power observability and billing later.
```

---

## Job 15: Observability and Cost Metering v1

### Goal

Track quality, latency, and cost per session.

### Scope

```text
CallMetrics
TurnMetrics
CostBreakdown
LatencyBreakdown
WebRTCQualityMetrics
provider/model tracking
session cost estimate
p50/p95/p99 latency
```

### Acceptance Criteria

```text
Each session records duration.
Each turn records latency.
STT/TTS/LLM provider is tracked.
Estimated cost is calculated.
Slow sessions can be debugged.
```

---

## Job 16: Short-Lived Session Tokens

### Goal

Prepare safe embedded avatars.

### Flow

```text
frontend requests token
backend validates domain/user/agent
backend returns temporary token
widget connects using token
token expires
```

### Acceptance Criteria

```text
No long-lived API key is exposed.
Tokens are scoped to one agent/session.
Tokens expire.
Domain allowlist is enforced.
```

---

## Job 17: Embed SDK v1

### Goal

Let customers embed an avatar widget.

### Example

```html
<script src="https://avatar.upcube.ai/embed.js" data-agent="agent_id"></script>
```

### Scope

```text
embed.js
widget bootstrap
session token exchange
domain allowlist
theme config
position config
conversation events
fallback mode
```

### Acceptance Criteria

```text
Widget loads on allowed domains.
Widget emits analytics events.
Text fallback works.
No provider secrets are exposed.
```

---

## Job 18: Avatar Dashboard Analytics

### Goal

Let users and admins understand avatar performance.

### Metrics

```text
session count
conversation minutes
average latency
estimated cost
TTS success rate
STT success rate
LLM success rate
interruption count
fallback rate
lead captures
agent conversion
```

### Acceptance Criteria

```text
Usage is visible by agent.
Estimated cost is visible.
Slow/bad sessions can be debugged.
```

---

# Stage 5 Jobs

## Job 19: Avatar Agents Dashboard

### Goal

Create platform surface inside Upcube console.

### Cards

```text
Ethen Guide
Sales Agent
Support Agent
Training Coach
Product Demo Agent
```

### Acceptance Criteria

```text
Dashboard makes Avatar Cloud feel like a real product area.
Ethen Guide appears as first active agent.
Other templates can be draft/coming soon.
```

---

## Job 20: Live Agent Builder Beta

### Goal

Let users configure basic avatar agents.

### Flow

```text
choose template
choose avatar
choose voice
set persona
add knowledge
configure greeting
preview
publish/embed
```

### Acceptance Criteria

```text
User can create a draft agent.
Ethen-style runtime can load agent config.
Embed config can be generated.
```

---

## Job 21: Website Concierge / AI SDR Template

### Goal

Implement first commercial template.

### Features

```text
lead capture
qualification questions
pricing/product page routing
meeting booking placeholder
conversation summary
handoff CTA
```

### Acceptance Criteria

```text
Template can be selected in builder.
Agent has clear sales/support behavior.
Conversation summary is generated.
```

---

## Job 22: Conversation Logs and Transcripts

### Goal

Let users review conversations.

### Scope

```text
conversation list
transcript view
turn timeline
events view
lead capture record
export later
```

### Acceptance Criteria

```text
User can inspect conversations by agent.
Transcript and key events are visible.
```

---

## Job 23: Usage and Quality Dashboard

### Goal

Display usage and quality metrics.

### Scope

```text
minutes
sessions
cost estimate
latency
fallback rate
provider failures
WebRTC quality later
```

### Acceptance Criteria

```text
User can see usage by agent.
Admin can identify costly/slow sessions.
```

---

# Stage 6 Jobs

## Job 24: Studio Video Object Model

### Goal

Add Synthesia-style object foundation.

### Objects

```ts
StudioVideo;
Scene;
Script;
AvatarTrack;
VoiceTrack;
CaptionTrack;
RenderJob;
HostedVideoPage;
```

### Acceptance Criteria

```text
Studio projects can be saved as data.
Scenes can be represented without a full timeline editor.
```

---

## Job 25: Script-to-Scene Editor

### Goal

Create scene-card editor.

### Scope

```text
paste script
split into scenes
edit scene text
choose layout/template
reorder scenes
```

### Acceptance Criteria

```text
User can create simple scene-based video project.
No complex timeline required.
```

---

## Job 26: Avatar Presenter + Voiceover

### Goal

Generate voiceover and assign avatar presenter to scenes.

### Scope

```text
choose avatar
choose voice
generate voiceover
preview audio
scene-level presenter settings
```

### Acceptance Criteria

```text
Scene can play voiceover.
Avatar presenter config is stored.
```

---

## Job 27: Captions + Transcript

### Goal

Add caption generation and transcript display.

### Scope

```text
caption text
timing placeholder
transcript view
caption export later
```

### Acceptance Criteria

```text
Video page can show captions/transcript.
```

---

## Job 28: Hosted Video Page

### Goal

Publish first Studio output as hosted page.

### Scope

```text
video/project preview
avatar presenter
captions
transcript
share page
CTA
```

### Acceptance Criteria

```text
User can share a hosted video page.
```

---

# Stage 7 Jobs

## Job 29: Transcript-Aware Q&A

### Goal

Let visitors ask questions about a video.

### Scope

```text
video transcript context
RAG-style answer
Ask this video UI
avatar response optional
```

### Acceptance Criteria

```text
Visitor can ask questions based on transcript.
Answers cite or reference transcript context internally.
```

---

## Job 30: Quiz / Checklist Layer

### Goal

Make training pages interactive.

### Scope

```text
quiz questions
checklist
completion state
training summary
```

### Acceptance Criteria

```text
Interactive page supports lightweight learning flow.
```

---

## Job 31: Lead Capture and CTA Layer

### Goal

Make interactive pages useful for sales.

### Scope

```text
lead form
CTA buttons
book call placeholder
download resource
conversation summary
```

### Acceptance Criteria

```text
Lead capture works.
CTA events are tracked.
```

---

## Job 32: Interactive Page Analytics

### Goal

Track engagement.

### Metrics

```text
views
video completion
questions asked
quiz completion
lead captures
CTA clicks
```

### Acceptance Criteria

```text
User can see page performance.
```

---

# Stage 8 Jobs

## Job 33: Avatar Governance Center Spec

### Goal

Define trust and safety product surface.

### Modules

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
```

### Acceptance Criteria

```text
Governance architecture is documented.
User-created replicas remain disabled until governance exists.
```

---

## Job 34: Consent Records and Revocation

### Goal

Prepare for custom replicas and cloned voices.

### Scope

```text
ConsentRecord
verification method
revocation status
audit trail
disabled replica behavior
```

### Acceptance Criteria

```text
Replica consent can be tracked.
Revoked replicas can be disabled.
```

---

## Job 35: Data Retention Controls

### Goal

Prepare enterprise controls.

### Modes

```text
store transcripts
do not store audio
do not store video
zero data retention
custom retention window
delete session data
export audit logs
```

### Acceptance Criteria

```text
Retention mode is represented in config.
Session storage behavior can later honor it.
```

---

## Job 36: Audit Log Foundation

### Goal

Track sensitive platform actions.

### Events

```text
replica.created
replica.revoked
voice.created
consent.signed
consent.revoked
api_key.created
session.deleted
data_exported
admin.changed_setting
```

### Acceptance Criteria

```text
Audit log object exists.
Sensitive actions can be recorded.
```

---

# Stage 9 Research Jobs

## Job 37: Neural Video Benchmark

### Goal

Benchmark future Tavus-quality rendering path.

### Evaluate

```text
Wav2Lip
MuseTalk
LivePortrait
Hallo-Live
LiveTalk
Digital-Avatar-ITRI
LiveTalking
```

### Output

```text
visual quality
lip-sync quality
FPS
GPU requirements
preprocessing needs
identity preservation
jitter/artifacts
serving complexity
cost estimate
```

---

## Job 38: GPU Serving Architecture Spec

### Goal

Design future neural video backend.

### Scope

```text
GPU workers
warm pools
model cache
WebRTC output
H264 encoding
autoscaling
cost per stream
region routing
observability
```

---

## Job 39: Custom Ethen Model Pipeline

### Goal

Replace placeholder avatar with branded production Ethen.

### Pipeline

```text
Character Creator / Reallusion
→ Blender cleanup
→ ARKit blendshape naming
→ Oculus viseme support
→ separate eyes
→ jaw/mouth controls
→ teeth/tongue geometry
→ Meshopt
→ KTX2/Basis textures
→ optimized GLB/VRM
```

### Acceptance Criteria

```text
Model loads fast.
Facial controls work.
Materials are clean.
Mobile performance is acceptable.
No mouth/teeth clipping.
```

---

## Job 40: Better Lip-Sync / Viseme Pipeline

### Goal

Upgrade beyond amplitude mouth movement.

### Evaluate

```text
Rhubarb WASM
Azure viseme events
Oculus viseme mapping
ARKit 52 scheduling
AnimaSync
Omote frame pipeline
server-side Wav2Arkit
```

### Acceptance Criteria

```text
Lip-sync quality improves.
Mobile CPU/GPU remains acceptable.
System degrades gracefully.
```

---

# 5. Validation Standards

Every implementation job should report:

```text
files changed
dependencies added
commands run
build result
lint result
typecheck result
manual checks
known failures
non-scope confirmation
next recommended job
```

## Common validation commands

Use the repo’s actual package manager. Typical commands:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

or:

```bash
pnpm build
pnpm lint
pnpm tsc --noEmit
```

Do not invent success.

If failures are pre-existing or unrelated, report them clearly.

---

# 6. Prompt Operating Rules

All implementation prompts should include:

```text
Cost/cache control: Keep this stable instruction block first and unchanged across jobs. Do not prepend changing repo status, timestamps, logs, screenshots, or summaries before it. Use targeted file reads only. Do not paste large file contents unless required. After initial repo inspection, summarize findings briefly instead of repeatedly sending raw logs. Use DeepSeek V4 Flash for routine implementation unless this job is explicitly escalated to V4 Pro.
```

## Default model choices

```text
DeepSeek V4 Flash:
routine implementation, narrow UI work, simple APIs, small refactors

DeepSeek V4 Pro:
architecture-heavy jobs, real-time voice, WebRTC, security, observability, billing, platform object model, difficult debugging

GPT-5.4 / Codex-style:
deep repo implementation, cross-cutting TypeScript changes, complex architecture

GPT-5.5 Chat:
planner, spec writer, validator, final reviewer
```

---

# 7. Current Best Next Move

The next immediate job should be:

```text
Job 0: Repo + Avatar Runtime Evaluation + Ethen Integration Audit
```

This combines:

```text
repo audit
Ethen integration point discovery
avatar runtime evaluation
initial implementation path recommendation
```

Do this before Job 1.

Reason:

```text
The research surfaced multiple strong runtime candidates:
Raw R3F + Three.js
three-vrm
TalkingHead
Omote R3F
AnimaSync
Rhubarb WASM
```

We should not blindly start with raw R3F without checking fit.

---

# 8. Success Milestones

## Milestone 1: Ethen Visible

```text
3D Ethen renders on upcube.ai.
Fallback works.
No AI/voice yet.
```

## Milestone 2: Ethen Alive

```text
Blink, gaze, idle movement, state transitions.
```

## Milestone 3: Ethen Speaking

```text
Text chat + TTS + captions + basic mouth movement.
```

## Milestone 4: Ethen Useful

```text
Product guide answers + CTA routing.
```

## Milestone 5: Ethen Live

```text
Mic input + STT + LLM + TTS + interruption.
```

## Milestone 6: Avatar Platform Beta

```text
Create agent, configure persona, choose voice/avatar, publish embed.
```

## Milestone 7: Studio Lite

```text
Script-to-video scene cards with avatar presenter and hosted page.
```

## Milestone 8: Interactive Video Pages

```text
Video + transcript + Q&A + quiz + lead capture + analytics.
```

## Milestone 9: Enterprise Platform Foundation

```text
Observability, cost metering, governance, API, session tokens, audit logs.
```

## Milestone 10: Advanced Rendering Research

```text
Neural video benchmark, GPU serving design, custom Ethen model, better lip-sync.
```

---

# 9. Final Recommendation

Start implementation now.

The research is enough.

Do not run more broad Exa research unless a specific implementation decision is blocked.

The immediate path is:

```text
Job 0: Repo + Avatar Runtime Evaluation + Ethen Integration Audit
→ Job 1: Browser 3D Ethen Canvas
→ Job 2: Ethen Behavior Engine
→ Job 3: Ethen Product Surface Integration
→ Job 4: Text Chat + Upcube Product Guide
→ Job 5: TTS Speaking Prototype
```

The first real target is:

> **Ethen visible, alive, speaking, and useful on upcube.ai.**

Once that works, Upcube has something real to demo, test, sell, and platformize.
