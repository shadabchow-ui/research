# Upcube Avatar Cloud: Ethen, Tavus-Style Live Avatars, and Synthesia-Style Studio Platform

## Purpose

This document summarizes the current Upcube / Ethen live avatar research and turns it into a unified product strategy.

The goal is to build both:

1. **A personal Upcube avatar named Ethen**
2. **A Tavus-style real-time avatar platform**
3. **A Synthesia-style avatar video studio**

The best product direction is not to copy only Tavus or only Synthesia. The stronger direction is to build a combined platform:

> **Upcube Avatar Cloud: live AI avatars and studio avatar videos for websites, training, sales, education, support, creators, and developers — powered by Ethen as the flagship avatar.**

## What We Have So Far

The research now supports a serious platform vision.

## 1. Personal Product: Ethen

Ethen is Upcube’s own AI avatar guide for upcube.ai.

### Purpose

Ethen should help users:

- understand Upcube
- explore products
- ask questions
- receive product recommendations
- navigate the Upcube ecosystem
- eventually talk and listen in real time

### First Version

The first Ethen version should be:

```text
Browser-rendered 3D Ethen
→ React Three Fiber / Three.js
→ GLB or VRM avatar
→ idle / blink / gaze
→ text chat
→ TTS voice
→ basic mouth movement
→ later real-time voice
```

### Why Ethen First

Ethen is the flagship demo. He proves the product before Upcube tries to sell a full avatar platform to other users.

The goal is not just to make an avatar that talks. Ethen should become a **real-time behavioral presence layer** for Upcube.

That means:

- idle presence
- active listening
- eye contact
- blink behavior
- gaze movement
- head movement
- facial expression states
- speaking and listening states
- smooth transitions
- context-aware reactions

## 2. Platform Product: Upcube Live Avatar

This is the Tavus-style product.

### Purpose

Let companies create real-time AI avatars that can:

- talk
- listen
- respond
- guide users
- sell products
- teach lessons
- support customers
- onboard employees
- collect leads
- hand off to humans
- act inside websites and apps

### Core Use Cases

```text
Website AI avatar
Sales avatar
Support avatar
Training avatar
Tutor avatar
Recruiting avatar
Product demo avatar
Healthcare intake avatar
Real estate avatar
Ecommerce shopping assistant
Founder clone / executive spokesperson
```

### Core Platform Objects

```text
Persona
Replica
Voice
Live Agent
Conversation
Session
Transcript
Usage Record
Consent Record
Webhook
Knowledge Base
Tool
```

### Core Platform Layers

```text
1. Persona layer
   Identity, instructions, behavior, guardrails, knowledge, tools.

2. Replica layer
   Avatar identity, visual model, voice model, rendering engine, consent.

3. Conversation layer
   Session, context, transcript, duration, user state.

4. Media layer
   WebRTC, STUN/TURN, SFU, audio/video transport, reconnection.

5. Intelligence layer
   STT, LLM, tools, RAG, memory, function calling.

6. Turn-taking layer
   VAD, endpointing, interruption, active listening, patience.

7. Rendering layer
   Browser GLB, VRM, neural video, streamed Unreal/MetaHuman, vendor fallback.

8. Observability layer
   Latency, transcripts, traces, recordings, emotion events, errors.

9. Billing layer
   Minutes, GPU seconds, STT/TTS/LLM usage, concurrency, storage.

10. Trust layer
   Consent, watermarking, revocation, audit logs, moderation, safety policy.
```

## 3. Studio Product: Upcube Studio

This is the Synthesia-style product.

### Purpose

Let users generate avatar-led videos from:

```text
Script
PDF
URL
Blog post
Product page
Slide deck
Help docs
Course outline
YouTube transcript
Training manual
```

### Output Types

```text
Avatar video
Voiceover
Captions
Transcript
Short clips
Hosted video page
Interactive Q&A page
Downloadable MP4
Embeddable player
```

### Use Cases

```text
Training videos
Product explainers
Course lessons
Sales enablement videos
Company updates
Social clips
Founder announcement videos
Customer onboarding videos
FAQ videos
Internal policy videos
```

## The Bigger Product Vision

Do not build only a Synthesia clone.

Do not build only a Tavus clone.

Build:

> **Upcube Avatar Cloud — one platform for live AI avatars and generated avatar videos.**

Product map:

```text
Ethen = Upcube’s flagship avatar
Upcube Live = Tavus-style real-time avatar agents
Upcube Studio = Synthesia-style video generation
Upcube Avatar API = developer platform
```

This gives Upcube a bigger and more original category.

## Better-Than-Synthesia Wedge

Most AI video platforms create passive videos.

Upcube should create:

> **Interactive avatar video pages where the avatar can answer questions after the video.**

Example workflow:

```text
User uploads a training PDF
→ Upcube generates a 5-minute avatar training video
→ adds transcript
→ adds quiz
→ adds live avatar Q&A
→ adds hosted training page
→ adds analytics
```

This combines Synthesia-style video generation with Tavus-style live interaction.

## Product Modules

## A. Ethen AI Avatar

### Modes

```text
Ethen Text Mode
Ethen Voice Mode
Ethen Live Mode
Ethen Demo Mode
Ethen Product Guide Mode
Ethen Founder Mode
```

### Personality

Ethen should feel:

- polished
- calm
- premium
- clear
- confident
- helpful
- trustworthy
- non-gimmicky

He should feel like an AI product guide, not a cartoon chatbot.

## B. Upcube Live Avatar

### User Workflow

```text
Create Live Agent
→ choose avatar
→ choose voice
→ set persona
→ upload knowledge
→ configure greeting
→ configure behavior
→ publish embed
→ view conversations
→ track usage
```

### Real-Time Features

- microphone input
- live voice response
- interruption / barge-in
- active listening
- captions
- transcript
- lead capture
- booking CTA
- product page CTA
- human handoff
- session summary
- webhook events

### Example Embed

```html
<script src="https://avatar.upcube.ai/embed.js" data-agent="agent_id"></script>
```

## C. Upcube Studio

### User Workflow

```text
Create video project
→ paste script or upload document
→ choose avatar
→ choose voice
→ choose template
→ edit scenes
→ generate preview
→ export video
→ publish hosted video page
```

### Studio Features

- script-to-video
- document-to-video
- URL-to-video
- avatar presenter
- scene cards
- captions
- transcript
- templates
- brand kit
- team workspace
- video library
- hosted video page
- downloadable MP4
- share links

## D. Interactive Video Pages

This is the strongest differentiator.

Each generated video page can include:

- video
- transcript
- quiz
- summary
- live avatar Q&A
- lead capture
- analytics
- recommended next steps
- related Upcube apps/products

## E. Avatar API

Developer-facing platform.

Possible API objects:

```text
POST /avatars
POST /personas
POST /voices
POST /live-agents
POST /conversations
POST /video-projects
POST /render-jobs
GET /render-jobs/:id
GET /conversations/:id/transcript
POST /webhooks
```

## Killer Product Ideas

## 1. Website Avatar Concierge

A company embeds a live avatar on its website.

The avatar can:

- greet visitors
- answer questions
- explain products
- collect leads
- book calls
- hand off to sales
- speak or chat

This is the most direct Tavus-style business product.

## 2. AI Product Demo Avatar

For SaaS companies.

User connects:

```text
Website URL
Product docs
Pricing page
FAQ
Demo script
```

Upcube creates an avatar that can demo the product and answer buyer questions.

## 3. Training Video + Live Coach

For businesses and education.

User uploads training material.

Upcube creates:

```text
avatar video lesson
interactive quiz
live avatar coach
completion analytics
```

This combines Synthesia-style videos with Tavus-style live interaction.

## 4. Founder Avatar Pages

For founders and creators.

They can create:

- founder welcome video
- investor pitch page
- product launch page
- recruiting page
- FAQ page
- live Q&A assistant

This also fits Shadab / Upcube founder-brand strategy.

## 5. Ecommerce Shopping Avatar

For commerce sites.

Avatar can:

- explain products
- recommend items
- compare choices
- answer shipping and return questions
- upsell bundles
- collect email/SMS

This connects naturally to Upcube Commerce.

## 6. AI Course Instructor

For Upcube Education and Books.

User uploads:

```text
chapter
article
lesson
course notes
tutorial
```

Upcube generates:

- avatar instructor lesson
- chapter summary
- quiz
- study guide
- live tutor avatar

## 7. Job Interview / Hiring Avatar

For Upcube Jobs.

Avatar can:

- explain job role
- ask structured questions
- summarize candidate responses
- schedule next steps

This must be handled carefully because hiring tools can raise bias and compliance concerns.

## 8. AI News Presenter

For Upcube News.

Avatar reads:

- daily AI news
- finance news
- tech news
- custom briefings

Then users can ask follow-up questions.

## 9. AI Sales Roleplay

For business training.

User chooses a scenario:

```text
angry customer
curious buyer
enterprise CIO
student
patient
job candidate
```

The avatar roleplays the interaction.

This is a strong training and coaching product.

## Architecture Direction

## Start With Browser-Rendered Avatars

The first rendering path should be:

```text
Browser GLB / VRM
React Three Fiber
Three.js
WebGL 2
KTX2 / Basis textures
Meshopt compression
```

Why:

- owned runtime
- no video-minute vendor dependency
- low rendering cost
- browser-native
- scalable
- good enough for first product validation

## Later Add Neural Video

For true Tavus-level realism, browser GLB may not be enough.

Future rendering paths:

```text
Renderer 1: Browser GLB / VRM
Renderer 2: Custom CC4 / Blender Ethen model
Renderer 3: Optional vendor fallback
Renderer 4: Neural talking-head research
Renderer 5: Upcube neural replica engine
```

## Avoid Early Mistakes

Do not start with:

- full Synthesia video editor
- custom neural video model
- custom WebRTC SFU
- MetaHuman Pixel Streaming
- full replica marketplace
- user voice cloning
- large avatar library
- complex video timeline editor

These can come later.

## Quality Strategy

Quality is not only photorealism.

Upcube needs quality across:

```text
visual quality
voice quality
latency quality
behavior quality
conversation quality
platform quality
trust quality
```

## Ethen Quality Checklist

### Visual Quality

- premium lighting
- clean camera framing
- realistic eyes
- no frozen stare
- no creepy smile
- subtle breathing
- subtle head movement
- mobile performance

### Voice Quality

- low latency
- natural pacing
- consistent voice identity
- not robotic
- interruption support later
- fallback text mode

### Behavior Quality

- idle
- listening
- thinking
- speaking
- curious
- confirming
- offline
- error
- interruption recovery

### Product Intelligence

- knows Upcube products
- routes users clearly
- avoids unsupported claims
- can summarize
- can recommend next action

### Trust Quality

- clearly AI
- no fake human deception
- consent before clones
- transcript policy
- moderation
- enterprise audit later

## Platform Object Model

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

Defines the avatar identity.

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

## Monetization Ideas

## Free Plan

- 1 Ethen-style avatar demo
- limited chat
- watermark
- limited hosted video pages
- no custom voice
- no custom-domain embed

## Creator Plan

- avatar videos
- no watermark
- basic voices
- basic live agent
- limited monthly minutes
- hosted pages

## Business Plan

- website live agent
- custom knowledge base
- brand kit
- lead capture
- analytics
- team workspace
- more minutes

## Developer Plan

- API keys
- embeddable agents
- webhooks
- SDK
- usage dashboard
- pay-as-you-go

## Enterprise Plan

- SSO
- audit logs
- consent controls
- private knowledge base
- custom avatar
- custom voice
- data retention
- SLA
- compliance package

## Usage Add-Ons

- live conversation minutes
- rendered video minutes
- TTS characters
- STT minutes
- LLM credits
- neural video minutes
- storage
- custom avatar creation
- voice cloning

## Recommended Build Order

## Phase 1: Ethen MVP

Build your own personal Ethen avatar first.

```text
Browser-rendered 3D Ethen
idle / blink / gaze
text chat
TTS response
basic mouth movement
Upcube product guide
```

This validates the experience.

## Phase 2: Ethen Live

Add true real-time voice.

```text
mic input
STT
LLM
TTS
LiveKit
VAD
interruption
transcripts
latency metrics
```

This becomes your Tavus-style foundation.

## Phase 3: Upcube Live Avatar Beta

Turn Ethen into a configurable platform.

```text
create live agent
choose avatar
choose voice
set persona
upload docs
embed on website
view conversations
track usage
```

## Phase 4: Upcube Studio Lite

Add Synthesia-style video creation.

```text
script-to-video
avatar presenter
captions
scene cards
brand kit
hosted video page
```

## Phase 5: Interactive Video Pages

This is the differentiation layer.

```text
video
+ transcript
+ quiz
+ live avatar Q&A
+ lead capture
+ analytics
```

## Phase 6: Replica / Neural Video Research

Only after traction.

```text
custom replicas
human likeness consent
neural video
GPU inference
C2PA
watermarking
developer API
```

## First Public Demo

Build a page like:

```text
/products/live-avatar
```

or:

```text
/upcube-live-avatar
```

It should include:

- live Ethen avatar
- “Ask Ethen about Upcube”
- type-to-talk
- voice response
- animated 3D avatar
- “Coming soon: create your own avatar agent”
- waitlist/signup CTA

## First Dashboard Module

Inside the Upcube console:

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

Each can start as:

```text
Draft
Coming soon
Create agent
```

This lets Upcube build demand before the full platform is complete.

## First Platform Landing Copy

```text
Create AI avatars that talk, listen, guide, and teach.

Upcube Live Avatar helps teams launch real-time AI agents and avatar-led videos for websites, training, product demos, support, and sales.
```

## Honest Recommendation

Upcube should pursue both:

```text
Tavus-style live avatars
+
Synthesia-style video generation
```

But the order matters.

Do not start by building the full Synthesia editor.

Do not start by training neural video replicas.

Start with **Ethen Live** because it proves the hardest and most exciting thing:

> Can Upcube create an avatar people actually want to talk to?

Once Ethen works, platformize it.

## Final Product Vision

> **Upcube Avatar Cloud: live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators — powered by Ethen as the flagship avatar.**

This product can eventually compete with both Tavus and Synthesia, but it should start with a focused Ethen MVP and grow into the platform over time.
