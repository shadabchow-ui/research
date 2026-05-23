# Upcube Avatar Cloud Observability, API, Embed, and Metering Research Synthesis

## Purpose

This document summarizes the corrected `1.txt` research findings and folds them into the Upcube Avatar Cloud execution roadmap.

The earlier research focused on:

```text
Ethen MVP
Ethen Live
Live Avatar Beta
Studio Lite
Interactive Video Pages
Neural video research
```

This file adds the missing SaaS/platform layer:

```text
observability
cost metering
WebRTC quality telemetry
short-lived session tokens
embed SDK
developer API
dashboard analytics
```

These systems are what turn a cool avatar demo into a real platform service.

---

# 1. Core Conclusion

The corrected research shows that Upcube Avatar Cloud needs a serious platform operations layer.

Without it, Upcube can build Ethen and even a live avatar demo, but it will not yet be ready to operate as a reliable Tavus/Synthesia-style SaaS platform.

The main additions are:

```text
Avatar Observability and Cost Metering v1
WebRTC Quality Telemetry
Short-Lived Avatar Session Tokens
Embed SDK v1
Developer API v1
Avatar Dashboard Analytics
```

These should be added to the roadmap after the first Ethen Live foundation, but before a serious public platform beta.

---

# 2. Avatar Observability and Cost Metering v1

## Why this matters

Live avatar sessions cost money every minute.

Costs can come from:

```text
STT
TTS
LLM
WebRTC / media transport
GPU rendering later
video storage later
bandwidth / egress
```

If Upcube does not track these costs per session and per user, it cannot price plans correctly or prevent margin loss.

## What to track

### Cost by provider

```text
STT cost
TTS cost
LLM cost
telephony / WebRTC cost
GPU cost later
storage cost later
total session cost
```

### Latency by stage

```text
STT latency
endpointing latency
LLM time-to-first-token
TTS time-to-first-audio
barge-in cancellation time
total end-to-end latency
```

### Quality by session

```text
conversation turns
fallback events
interruptions
TTS failures
STT failures
LLM failures
audio gaps
dropped frames
user abandoned session
```

---

# 3. Proposed Metrics Object Model

## CallMetrics

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

## TurnMetrics

```ts
TurnMetrics {
  id: string
  sessionId: string
  turnIndex: number
  userSpeechStartedAt?: string
  userSpeechEndedAt?: string
  sttFinalAt?: string
  llmFirstTokenAt?: string
  ttsFirstAudioAt?: string
  avatarStartedSpeakingAt?: string
  avatarStoppedSpeakingAt?: string
  interrupted: boolean
  fallbackUsed: boolean
  errorCode?: string
}
```

## CostBreakdown

```ts
CostBreakdown {
  sttUsd: number
  ttsUsd: number
  llmUsd: number
  webrtcUsd: number
  gpuUsd: number
  storageUsd: number
  totalUsd: number
}
```

## LatencyBreakdown

```ts
LatencyBreakdown {
  endpointingMs: number
  sttMs: number
  llmTtftMs: number
  ttsTtfaMs: number
  firstAudioMs: number
  interruptionCancelMs?: number
  totalMs: number
}
```

---

# 4. WebRTC Quality Telemetry

## Why this matters

When users say an avatar feels slow or broken, the problem may not be the model.

It could be:

```text
packet loss
jitter
TURN relay routing
bad microphone input
audio gaps
dropped video frames
WebRTC reconnects
STT delay
TTS delay
LLM delay
```

Upcube needs visibility into all of these.

## WebRTC metrics to track

```text
RTT
jitter
packet loss
audio gaps
dropped frames
connection state
ICE reconnects
TURN usage
media bitrate
audio level
codec
region
```

## WebRTCQualityMetrics

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

## Dashboard use

The admin dashboard should make it clear whether a bad session was caused by:

```text
network
STT
LLM
TTS
WebRTC
avatar renderer
user device
provider outage
```

---

# 5. Short-Lived Avatar Session Tokens

## Why this matters

An embeddable avatar platform must not expose long-lived API keys in the browser.

The correct pattern is:

```text
Frontend requests short-lived avatar session token
→ backend validates domain/user/agent
→ backend returns temporary session token
→ embed widget connects using token
→ token expires
```

## AvatarSessionToken

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

## Token rules

```text
Tokens should be short-lived.
Tokens should be scoped to one LiveAgent.
Tokens should be restricted to allowed domains.
Tokens should not expose provider secrets.
Tokens should be revocable.
Tokens should be logged for abuse detection.
```

---

# 6. Embed SDK v1

## Purpose

The embed SDK lets businesses place a live avatar on their website.

Future embed example:

```html
<script src="https://avatar.upcube.ai/embed.js" data-agent="agent_id"></script>
```

## Behind the script tag

The SDK needs:

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

## EmbedConfig

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

## Embed SDK events

```text
avatar.ready
conversation.started
conversation.ended
user.message
lead.submitted
error
fallback.used
```

## Acceptance criteria for Embed SDK v1

```text
No long-lived API key is exposed.
Embed only works on allowed domains.
Session token expires.
Agent can load from script tag.
Events are emitted for analytics.
Text fallback works if WebGL or voice fails.
```

---

# 7. Developer API v1

## Purpose

The API turns Upcube Avatar Cloud into a platform developers can build on.

## Future API endpoints

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

## Developer API requirements

```text
API keys must be scoped.
Rate limits must exist.
Webhook signatures must be verifiable.
Session tokens must be short-lived.
Errors must be predictable.
Usage must be metered.
Docs should be generated from schemas.
```

## Core developer objects

```text
Persona
Replica
Voice
LiveAgent
Conversation
SessionToken
Transcript
Metrics
Webhook
StudioVideo
RenderJob
```

---

# 8. Avatar Dashboard Analytics

## Purpose

Users need to understand how their avatars are performing.

## Metrics to show by agent

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
average conversation length
```

## Admin/debug metrics

```text
slow sessions
failed provider calls
WebRTC packet loss
TURN usage
high-cost sessions
stuck sessions
TTS timeout rate
STT timeout rate
LLM timeout rate
```

## Dashboard pages

```text
Overview
Agents
Conversations
Transcripts
Usage
Costs
Latency
Quality
Errors
Webhooks
```

---

# 9. New Jobs To Add To The Roadmap

## Job G: Avatar Observability and Cost Metering v1

### Goal

Track latency, cost, provider usage, and quality per avatar session.

### Scope

```text
CallMetrics
TurnMetrics
CostBreakdown
LatencyBreakdown
WebRTCQualityMetrics
event logging
session cost estimate
provider model tracking
```

### Acceptance criteria

```text
Each session records duration.
Each turn records latency.
STT/TTS/LLM provider/model is tracked.
Estimated cost is calculated.
Dashboard can show p50/p95/p99 latency.
Errors are tied to provider/stage.
```

---

## Job H: Embed SDK and Short-Lived Session Tokens

### Goal

Create the safe foundation for third-party website embeds.

### Scope

```text
embed.js
domain allowlist
session token endpoint
widget config
agent bootstrap
conversation start event
conversation end event
lead capture hook
fallback mode
```

### Acceptance criteria

```text
No long-lived API key is exposed.
Embed only works on allowed domains.
Token expires.
Agent can load from script tag.
Events are emitted for analytics.
Fallback UI appears when voice/video/avatar fails.
```

---

## Job I: Developer API v1

### Goal

Expose the first public platform API for avatar agents.

### Scope

```text
personas
replicas
voices
live agents
conversations
session tokens
transcripts
metrics
webhooks
```

### Acceptance criteria

```text
API keys are scoped.
Basic rate limits exist.
API docs can be generated.
Webhook events are defined.
Developer can create a live agent and start a session.
Metrics can be retrieved by conversation.
```

---

## Job J: Avatar Dashboard Analytics

### Goal

Let users and admins understand avatar performance, cost, and quality.

### Scope

```text
session count
average latency
conversation minutes
estimated cost
TTS success rate
STT success rate
interruption count
fallback rate
lead captures
agent conversion
```

### Acceptance criteria

```text
User can see usage by agent.
User can see estimated cost.
User can see conversation quality metrics.
Admin can debug slow sessions.
Admin can identify expensive sessions.
```

---

# 10. Updated Remaining-Gap List

The remaining 40–45% now breaks down more clearly:

```text
1. Neural video / replica rendering
2. GPU serving / WebRTC video track infrastructure
3. Turn-taking / adaptive interruption
4. Facial animation / lip-sync quality
5. Trust / consent / deepfake prevention
6. Observability / cost metering
7. Embed SDK / session tokens
8. Developer API
9. Mature Studio editor/render pipeline
10. Enterprise controls
```

---

# 11. Updated Roadmap Placement

These jobs should not block the first Ethen visual MVP.

Recommended order:

```text
1. Browser 3D Ethen
2. Ethen Behavior Engine
3. Text + TTS Speaking
4. WebAudio Mouth Movement
5. Ethen Product Guide
6. Ethen Live Voice
7. Adaptive Interruption
8. Avatar Observability and Cost Metering v1
9. Embed SDK and Short-Lived Session Tokens
10. Developer API v1
11. Avatar Dashboard Analytics
12. Live Avatar Platform Beta
13. Studio Lite
14. Interactive Video Pages
15. Neural Video Benchmark
16. GPU Serving Architecture
17. Trust and Consent Architecture
```

## Why this order works

It lets Upcube:

```text
ship visible value early
measure cost before scale
support safe embeds
create API structure
debug live sessions
prepare for paid plans
```

---

# 12. What This Means For Ethen

For Ethen personally, this means the public demo should eventually include:

```text
avatar states
chat/voice session ID
latency measurement
provider tracking
fallback mode
conversation transcript
session cost estimate
error logging
analytics events
```

Ethen should be the first real testbed for the platform’s observability layer.

## Ethen-specific events

```text
ethen.loaded
ethen.webgl_fallback_used
ethen.message_sent
ethen.response_started
ethen.tts_started
ethen.tts_failed
ethen.avatar_started_speaking
ethen.avatar_stopped_speaking
ethen.cta_clicked
ethen.signup_clicked
```

---

# 13. What This Means For Upcube Live Avatar

For the broader Live Avatar product, this research means the platform must support:

```text
embeddable agents
domain allowlists
short-lived session tokens
agent usage dashboards
conversation metrics
provider cost tracking
quality debugging
developer API
webhooks
```

This is what separates a demo from a SaaS product.

---

# 14. What This Means For Upcube Studio

For Studio Lite, the same metering system should track:

```text
rendered video minutes
TTS characters
caption generation cost
LLM script generation tokens
storage usage
video page views
interactive Q&A usage
```

Studio should reuse the same:

```text
UsageRecord
CostBreakdown
AvatarEvent
Webhook
```

where possible.

---

# 15. Final Recommendation

This research should be merged into the master execution plan as the **platform operations layer**.

The top priority remains:

> **Ethen visible, alive, speaking, and useful on upcube.ai.**

But before scaling to customers, Upcube must add:

```text
observability
cost metering
session tokens
embed SDK
developer API
dashboard analytics
```

These systems will determine whether Upcube Avatar Cloud can become a real platform service instead of only a polished demo.

## Immediate next action

Create or update the master roadmap to include:

```text
Job G: Avatar Observability and Cost Metering v1
Job H: Embed SDK and Short-Lived Session Tokens
Job I: Developer API v1
Job J: Avatar Dashboard Analytics
```

Then continue with:

```text
Job 0: Repo + Avatar Runtime Evaluation
Job 1: Browser 3D Ethen Canvas
Job 2: Ethen Behavior Engine
```
