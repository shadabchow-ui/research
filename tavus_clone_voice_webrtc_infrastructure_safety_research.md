# Tavus-Clone Research Update: Voice, WebRTC, Production Infrastructure, and Safety

## Purpose

This document summarizes the latest Exa research batch focused on the missing production layers for a Tavus-style avatar platform.

This batch adds the voice/WebRTC/production infrastructure layer that was missing from the earlier browser-avatar research.

The key conclusion:

> Upcube now has enough research to define the full Tavus-clone product architecture. The smartest first build is still a browser-rendered Ethen, but the long-term platform should be designed around Persona, Replica, Conversation, WebRTC, observability, safety, and billing from day one.

---

# 1. Voice-Agent Pipeline Is Now Clear

A production Tavus-like system needs a streaming real-time voice pipeline:

```text
User audio
→ WebRTC / low-latency transport
→ streaming STT
→ streaming LLM
→ streaming TTS
→ avatar video / render output
```

The research shows that a modern voice agent is built around three core stages:

```text
STT
LLM
TTS
```

The production version overlaps those stages:

```text
STT streams partial transcripts
→ LLM streams tokens
→ TTS starts speaking before the answer is fully complete
```

## Practical Target

The target for a natural conversation is:

```text
under 1 second perceived response time
```

That means Upcube cannot use slow request/response-only architecture for a Tavus-style experience.

---

# 2. Turn-Taking and Interruption Are Not Optional

Tavus-quality means the agent must know:

```text
when the user is done
when the user paused mid-thought
when the user interrupted
when to stop speaking
when to keep listening
```

## Key Finding

Voice Activity Detection is necessary, but not sufficient.

VAD can detect whether someone is speaking, but it does not always know whether a silence is:

```text
a natural pause inside a sentence
or
the end of the user’s turn
```

## Required Turn-Taking Layer

A production system needs:

- VAD
- endpointing
- interruption detection
- barge-in handling
- conversation state machine
- TTS cancellation
- active listening state

## Why It Matters

Without this, the avatar feels robotic.

With this, the avatar feels like it is actually participating in a live conversation.

---

# 3. WebRTC + Backend Control Is the Right Media Architecture

The Azure Voice Live / avatar research points toward a useful hybrid architecture:

```text
Browser audio
→ WebSocket
→ backend
→ realtime AI session

Browser video/avatar stream
← direct WebRTC connection

Backend
→ controls session state, tools, and SDP negotiation
```

## Why This Matters

The backend should control:

- session creation
- auth
- tools
- function calls
- conversation state
- knowledge/RAG
- moderation
- SDP negotiation
- logging
- billing

But media should flow directly over low-latency WebRTC where possible.

## Recommended Pattern

```text
Backend controls intelligence and session state.
WebRTC carries real-time audio/video.
```

This is close to the structure needed for a Tavus-style product.

---

# 4. MetaHuman Quality Is Possible, But Heavy

The MetaHuman research explains why Unreal/MetaHuman looks so realistic:

- Rig Logic
- wrinkle maps
- eye shaders
- subsurface skin shading
- groom hair
- hundreds of joints
- many facial controls
- high-resolution textures
- corrective bones
- advanced materials

## The Downside

MetaHuman-style quality is expensive and heavy.

Mobile is impractical without aggressive simplification. High-end MetaHuman rendering is more realistic as a:

```text
PC / console / GPU server / Pixel Streaming path
```

not as a normal lightweight website widget.

## Upcube Rendering Decision

```text
Browser GLB = practical owned MVP
MetaHuman / Unreal = premium GPU-streaming path later
Neural video = closest Tavus-style realism path
```

---

# 5. Open-Source Avatar SDKs Can Accelerate the Browser Path

The Agentic Avatars research is important because it supports:

- OpenAI Realtime
- Deepgram
- ElevenLabs
- Vapi
- LiveKit
- React Three Fiber
- provider adapters
- audio stream handling
- lip-sync manager
- avatar scene
- custom avatar components

## Architecture Pattern to Copy

```text
Provider adapter
→ audio stream
→ lip-sync manager
→ avatar renderer
→ UI shell
```

This confirms that Upcube should not tightly couple the AI provider, voice system, and avatar renderer.

The avatar system should be modular.

---

# 6. LiveKit Is a Strong Infrastructure Candidate

LiveKit appears to be one of the best infrastructure candidates for the Tavus-clone path.

It can handle:

- real-time infrastructure
- global routing
- scaling
- observability
- session recordings
- transcripts
- traces
- logs
- metrics
- virtual avatar plugins
- WebRTC rooms
- media transport

## Strategic Recommendation

Do not build all WebRTC infrastructure from scratch first.

Research and prototype around:

```text
LiveKit first
custom avatar renderer later
self-host only when scale/cost requires it
```

## Why

Building WebRTC infrastructure from scratch means owning:

- signaling
- SFU
- TURN/STUN
- reconnection
- NAT traversal
- browser compatibility
- mobile edge cases
- packet loss handling
- metrics
- scaling
- failover

That is too much for the first Upcube avatar release.

---

# 7. Consent and Safety Must Become First-Class Product Objects

The final batch adds the trust/safety layer.

If Upcube ever lets users create replicas, it needs:

```text
Consent
Revocation
Identity verification
Watermark / provenance
Audit log
Moderation
Forensics export
Webhook events
```

## Core Safety Architecture

A responsible avatar platform needs:

- explicit consent
- signed consent receipts
- consent revocation
- immutable audit logs
- watermarking
- cryptographic provenance
- moderation callbacks
- takedown workflows
- evidence bundles
- webhook events
- abuse reporting
- identity verification / liveness check

## Why It Matters

For a replica platform, this is not legal polish. It is core architecture.

A platform that can create realistic digital humans must prove:

```text
who consented
what was generated
when it was generated
which model generated it
whether consent was revoked
where the asset was used
```

---

# Updated Tavus-Clone Architecture

A Tavus-style platform should be designed as these layers:

```text
1. Persona layer
   Identity, instructions, voice, behavior, guardrails, knowledge.

2. Replica layer
   Avatar / face / voice identity, rendering model, permissions.

3. Conversation layer
   Session, room, participant, context, greeting, duration, timeout.

4. Media layer
   WebRTC, STUN/TURN/SFU, audio/video transport, reconnection.

5. Intelligence layer
   STT, LLM, tools, RAG, memory, function calling.

6. Turn-taking layer
   VAD, endpointing, interruption, active listening, patience.

7. Rendering layer
   Browser GLB, neural video, or Unreal/MetaHuman stream.

8. Observability layer
   Latency, transcripts, traces, recordings, emotion events.

9. Billing layer
   Minutes, GPU seconds, STT/TTS/LLM usage, concurrency.

10. Trust layer
   Consent, watermarking, revocation, audit logs, moderation.
```

---

# Recommended Build Order for Upcube

## Phase 1 — Browser-Rendered Ethen

Goal:

```text
Build a useful, owned avatar guide that does not depend on Tavus/D-ID video minutes.
```

Scope:

```text
React Three Fiber
GLB / VRM avatar
basic voice
lip-sync
text fallback
Ethen product guide
```

## Phase 2 — Realtime Voice Agent

Goal:

```text
Make Ethen feel conversational.
```

Scope:

```text
LiveKit or WebRTC
streaming STT
streaming LLM
streaming TTS
VAD
interruption handling
```

## Phase 3 — Platform Objects

Goal:

```text
Turn the assistant from a widget into an avatar-agent platform.
```

Scope:

```text
Persona
Replica
Conversation
Transcript
Session events
Usage records
```

## Phase 4 — Photorealistic Renderer Upgrade

Goal:

```text
Increase realism after the runtime works.
```

Options:

```text
CC / Reallusion GLB
MetaHuman / Unreal stream
Neural talking-head video model
```

## Phase 5 — Safety and Commercial Platform

Goal:

```text
Prepare the system for real users, customers, and developers.
```

Scope:

```text
consent receipts
watermarking
revocation
audit logs
billing
developer SDK
moderation
usage limits
```

---

# Updated Strategic Direction

## Do First

```text
Build browser-rendered Ethen.
```

This gives Upcube an owned, low-cost avatar layer.

## Do Next

```text
Add real-time voice infrastructure using LiveKit or a similar media layer.
```

This creates a path toward natural conversations.

## Do Later

```text
Add photorealistic neural video / MetaHuman / replica training.
```

This is the Tavus-quality path, but it should not be the first engineering bet.

---

# Platform Object Model

The future Upcube avatar platform should include these core objects:

## Persona

Defines:

- instructions
- behavior
- tone
- voice
- knowledge
- guardrails
- tools
- greeting
- objectives

## Replica

Defines:

- avatar identity
- face model
- voice model
- rendering engine
- consent status
- allowed use
- owner

## Conversation

Defines:

- session ID
- persona
- replica
- user
- transcript
- start/end time
- media room
- tool calls
- usage records

## Session Event

Tracks:

- user joined
- mic enabled
- avatar started
- STT partial
- LLM response started
- TTS first audio
- user interrupted
- avatar stopped
- error occurred

## Usage Record

Meters:

- session minutes
- STT seconds
- TTS seconds / characters
- LLM tokens
- GPU seconds
- media bandwidth
- recordings
- storage

## Consent Record

Stores:

- user consent
- identity verification
- consent text version
- signature
- revocation status
- asset linkage
- audit log

---

# Engineering Implications

## Avoid Hard-Coupling

Do not hard-code one provider.

Use interfaces:

```text
SpeechToTextProvider
LLMProvider
TextToSpeechProvider
AvatarRenderer
MediaTransport
TurnDetector
ConsentStore
UsageMeter
```

## Keep Rendering Swappable

Rendering should support:

```text
BrowserGLBRenderer
VRMRenderer
NeuralVideoRenderer
MetaHumanStreamRenderer
VendorAvatarRenderer
```

## Keep Media Swappable

Media should support:

```text
NoMedia / local audio
WebSocket audio
LiveKit room
Daily room
Custom WebRTC
```

## Keep Safety Central

Every replica path should check:

```text
consent
owner
usage policy
revocation status
watermark/provenance
moderation state
```

---

# Risks

## Product Risks

- A realistic avatar that is slow feels worse than a simple assistant.
- Users may prefer fast useful answers over visual realism.
- Overbuilding Tavus clone infrastructure too early could delay Upcube’s core product.

## Technical Risks

- Low latency is difficult across STT, LLM, TTS, and rendering.
- WebRTC debugging is complex.
- Mobile browser support can be inconsistent.
- Photorealistic models can be too heavy.
- Neural video requires expensive GPU inference.
- Lip-sync and turn-taking are easy to underestimate.

## Legal / Trust Risks

- Replica creation creates deepfake and consent issues.
- Voice cloning requires consent and revocation controls.
- Recordings and transcripts create privacy obligations.
- Enterprise buyers will expect auditability and moderation.

---

# Final Recommendation

The Tavus-clone path should be split into two tracks:

## Track A — Upcube Ethen Product

This is the near-term product.

```text
Browser-rendered 3D Ethen
product guide
text + voice
local lip-sync
low cost
Upcube-owned UX
```

## Track B — Upcube Avatar Platform

This is the long-term platform.

```text
Personas
Replicas
Conversations
WebRTC
realtime voice
photorealistic rendering
consent
billing
developer API
```

## Final Decision

```text
Do not clone Tavus directly first.

Build the owned browser avatar now.
Architect the backend as if it can grow into a Tavus-style platform later.
Use LiveKit or similar infrastructure for real-time media.
Keep renderers and AI providers swappable.
Make consent, observability, and usage metering first-class from the beginning.
```
