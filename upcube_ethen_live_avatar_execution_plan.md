# Upcube / Ethen Live Avatar Execution Plan

## Purpose

This document converts the current Upcube / Ethen live avatar research into a practical execution plan.

The goal is to build Upcube’s own live avatar system, starting with **Ethen**, an AI guide for upcube.ai. The near-term path is not to clone Tavus immediately. The smarter path is to build an owned browser-rendered 3D Ethen avatar first, then gradually evolve it into a real-time voice agent and, later, a broader avatar platform.

## Strategic Direction

### Near-Term

Build an owned browser-rendered 3D Ethen avatar.

This should use:

- Next.js / React
- React Three Fiber
- Three.js
- GLB or VRM avatar model
- WebGL fallback
- Basic avatar states
- Text fallback
- Future-ready architecture for TTS, lip-sync, and voice

### Mid-Term

Upgrade Ethen into a real-time AI voice guide.

This should eventually include:

- STT
- LLM response generation
- TTS
- turn-taking
- interruption support
- captions
- transcript memory
- active listening behavior
- basic emotion or intent mapping

### Long-Term

Explore building a Tavus-style avatar platform.

This would include:

- Persona objects
- Replica objects
- Conversation sessions
- WebRTC media infrastructure
- safety and consent
- usage metering
- observability
- developer APIs
- neural video or streamed high-end rendering

## Main Strategic Conclusion

Build **Ethen-first**, not Tavus-clone-first.

A Tavus-quality clone requires much more than an avatar UI. It requires replica training, real-time neural rendering or streamed rendering, WebRTC infrastructure, active perception, turn-taking, consent systems, safety controls, billing, observability, and developer platform objects.

Upcube should first create a strong, owned, browser-rendered Ethen experience. This gives the company a visible product asset while keeping the architecture open for more advanced avatar platform features later.

## Key Lesson From Phoenix-4 Research

The Phoenix-4 material introduces an important product lesson:

> Ethen should not be treated as “an avatar that talks.” Ethen should be treated as a real-time behavioral presence layer.

The important idea is **behavioral realism**, not only photorealism or lip-sync.

A strong avatar system needs:

- idle presence
- active listening
- eye contact
- blink behavior
- gaze shifts
- head motion
- facial expression states
- emotional transitions
- speaking and listening states
- smooth transitions between states
- context-aware reactions over time

For the Upcube MVP, this does not mean building a neural video model immediately. It means designing the browser-rendered avatar as a **behavior system** from the beginning.

## Recommended Product Framing

Instead of saying:

> Build an avatar.

Use:

> Build Ethen as a real-time behavioral presence layer for Upcube.

This is stronger, more serious, and more investor-ready.

## Recommended Roadmap

### Phase 1: Browser 3D Avatar Prototype

Goal:

Add a browser-rendered 3D Ethen avatar inside the existing Upcube/Ethen UI.

Scope:

- React Three Fiber canvas
- Three.js scene
- placeholder GLB/VRM loading
- fallback geometric avatar if no model exists
- lighting
- camera framing
- loading state
- WebGL unsupported fallback
- no AI
- no TTS
- no lip-sync
- no Tavus dependency

Success condition:

Ethen appears as a browser-rendered 3D guide inside upcube.ai without breaking the current site.

---

### Phase 2: Ethen Behavior Engine v1

Goal:

Make Ethen feel alive before adding real speech.

Scope:

- idle breathing/sway
- blink loop
- gaze movement
- head movement
- listening state
- thinking state
- speaking placeholder state
- offline state
- smooth transitions
- reduced-motion support

Success condition:

Ethen has visible life and presence even when silent.

---

### Phase 3: Text + TTS Speaking Prototype

Goal:

Let Ethen speak short scripted or generated lines.

Scope:

- TTS provider abstraction
- audio playback
- speaking state
- captions
- text fallback
- simple scripted prompts
- no real-time microphone yet

Success condition:

A user can trigger Ethen to speak, and the avatar visually enters a speaking state.

---

### Phase 4: AI Product Guide Integration

Goal:

Make Ethen useful on upcube.ai.

Scope:

- Upcube product-family knowledge
- product navigation help
- “What can I do with Upcube?” guidance
- safe assistant boundaries
- CTA routing
- simple conversation UI

Success condition:

Ethen helps visitors understand and navigate the Upcube ecosystem better than a static homepage.

---

### Phase 5: Basic Audio-Reactive Mouth / Jaw

Goal:

Create a first mouth movement system before full viseme lip-sync.

Scope:

- audio amplitude analysis
- jaw movement
- simple mouth movement
- speaking-state animation
- no complex viseme timeline yet

Success condition:

Ethen’s mouth movement reacts to speech audio in a basic but believable way.

---

### Phase 6: Viseme Lip-Sync

Goal:

Match mouth shapes to speech.

Possible paths:

- Oculus visemes
- ARKit 52 blendshapes
- TTS provider timing metadata
- Rhubarb-style offline viseme extraction for testing
- browser-side viseme controller

Success condition:

Ethen’s mouth shapes align with spoken words closely enough for a polished public demo.

---

### Phase 7: Real-Time Voice Agent

Goal:

Move from click-to-speak to live conversation.

Scope:

- microphone input
- STT
- VAD
- endpointing
- interruption support
- streaming TTS if possible
- transcript panel
- permission UX
- latency instrumentation

Success condition:

A user can talk to Ethen and interrupt naturally.

---

### Phase 8: Custom Photorealistic Ethen Model

Goal:

Replace placeholder model with an owned Upcube character.

Pipeline:

- Character Creator / Reallusion
- Blender cleanup
- optimized GLB export
- face morphs
- jaw/mouth controls
- teeth/tongue if possible
- separate eyes
- blink and gaze support
- Meshopt or Draco optimization
- KTX2/Basis textures
- strict mobile budgets

Success condition:

Ethen becomes a recognizable Upcube-owned avatar instead of a generic placeholder.

---

### Phase 9: Persona / Replica / Conversation Platform Layer

Goal:

Turn Ethen into the first instance of a reusable avatar platform.

Objects:

- Persona
- Replica
- Conversation
- Runtime
- Session
- Transcript
- Usage record

Success condition:

Ethen is no longer a hardcoded assistant. He becomes a configured instance of a broader Upcube avatar system.

---

### Phase 10: Safety, Billing, and Observability

Goal:

Prepare the system for serious use.

Scope:

- consent rules
- identity policy
- watermarking/disclosure
- moderation boundaries
- transcript storage policy
- usage metering
- STT/TTS/LLM cost tracking
- latency traces
- session logs
- admin/debug console

Success condition:

Upcube can operate avatar sessions responsibly and measure cost, quality, and safety.

---

### Phase 11: Neural Video / Tavus-Like Research Prototype

Goal:

Explore high-end avatar realism later.

Possible paths:

- neural talking-head model
- streamed Unreal / MetaHuman renderer
- WebRTC video stream
- GPU render workers
- replica training pipeline
- consent-protected face/voice training
- full behavioral video generation research

Success condition:

Upcube understands whether it should build a true Tavus-style product or keep Ethen browser-rendered.

## Ethen Behavior State Model

The browser avatar should be structured around a behavior state model from the beginning.

Suggested states:

```ts
export type EthenBehaviorState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "greeting"
  | "confirming"
  | "curious"
  | "concerned"
  | "excited"
  | "offline";
```

Each state can eventually control:

- blink rate
- gaze target
- head movement
- breathing/sway intensity
- mouth/jaw movement
- facial expression
- emotion intensity
- UI status label
- audio sync
- viseme timeline
- listening behavior

## Recommended First Build

The first implementation job should be:

> Add browser-rendered 3D Ethen avatar runtime prototype to the Upcube repo.

This job should only create the visual runtime foundation. It should not add AI, voice, TTS, lip-sync, WebRTC, Tavus, D-ID, HeyGen, billing, safety dashboards, or backend platform objects.

## DeepSeek / OpenCode Prompt: Job 1

```text
Cost/cache control: Keep this stable instruction block first and unchanged across jobs. Do not prepend changing repo status, timestamps, logs, screenshots, or summaries before it. Use targeted file reads only. Do not paste large file contents unless required. After initial repo inspection, summarize findings briefly instead of repeatedly sending raw logs. Use DeepSeek V4 Flash for routine implementation unless this job is explicitly escalated to V4 Pro.

I’ll be using ChatGPT 5.5 to design, supervise, and review the implementation strategy, and DeepSeek will be the implementation agent running inside OpenCode against my connected local Git repo. ChatGPT 5.5 is the planner, spec writer, validator, and final reviewer. DeepSeek is the scoped implementation worker.

Job name:
Add browser-rendered 3D Ethen avatar runtime prototype to the Upcube repo

Model to use:
DeepSeek V4 Flash

Mode to use:
Medium

Repo path:
/Users/sha/Documents/AI/upcube

Implementation mandate:
Build the first owned browser-rendered 3D avatar runtime for Ethen inside the existing Upcube/Ethen experience. This is only the visual runtime prototype. Do not build AI, voice, Tavus integration, lip-sync, WebRTC, billing, or platform objects in this job.

Primary goal:
Add a reusable React component that renders a 3D Ethen avatar using React Three Fiber / Three.js, loads a placeholder GLB or VRM asset if present, provides a clean fallback if no asset exists, and integrates into the existing Ethen panel or Ethen-related UI without breaking the current website.

Repo-drift rule:
Do not assume exact file paths before inspecting the repo. First locate the existing Ethen components, homepage sections, app structure, package manager, framework version, and asset/public folder conventions. Use the current repo as the source of truth.

Required first repo actions:
1. cd /Users/sha/Documents/AI/upcube
2. pwd
3. ls
4. Find package manager files: package.json, pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lockb.
5. Inspect package.json scripts and dependencies.
6. Search for existing Ethen/avatar/assistant components:
   - rg -n "Ethen|ethen|avatar|assistant|guide|chat|agent" .
7. Search for app/page/component structure:
   - find . -maxdepth 3 -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "*.tsx" -o -name "*.jsx" \) | head -200
8. Search for public/assets/md folders:
   - find . -maxdepth 4 -type d \( -name "public" -o -name "assets" -o -name "md" -o -name "models" \)

Exact files/directories to inspect:
- package.json
- app/ or pages/ directory if present
- components/ directory if present
- public/ directory if present
- any files matching Ethen, assistant, guide, avatar, chat, or product console
- existing styling system: globals.css, Tailwind config, CSS Modules, or component styles

Implementation scope:
Create the first runtime slice for browser-rendered 3D Ethen.

Expected code changes:
1. Add required dependencies only if missing:
   - three
   - @react-three/fiber
   - @react-three/drei
   If the repo uses pnpm, use pnpm. If npm, use npm. If yarn, use yarn. Do not mix package managers.

2. Create a reusable avatar runtime component, likely one of:
   - components/ethen/EthenAvatar3D.tsx
   - components/avatar/EthenAvatar3D.tsx
   - app/components/ethen/EthenAvatar3D.tsx
   Choose the path that best fits the repo structure.

3. The component must:
   - be client-side safe for Next.js if needed using "use client"
   - use React Three Fiber Canvas
   - use Suspense for model loading
   - load a placeholder model from a predictable public path if present, such as:
     /models/ethen/ethen.glb
     /models/ethen/placeholder.glb
     /ethen.glb
   - if no model is present, render a clean simple geometric fallback avatar form inside the 3D scene so the component still works
   - include camera/framing appropriate for a bust/guide avatar
   - include basic lighting
   - include subtle idle motion on the fallback object
   - expose props for state even if only visually basic for now:
     state?: "idle" | "listening" | "thinking" | "speaking" | "offline"
     className?: string
   - avoid heavy postprocessing
   - avoid GPU-expensive defaults
   - use dpr capped for mobile, for example [1, 1.5] or similar
   - avoid breaking server-side rendering

4. Add a WebGL capability/fallback layer:
   - If WebGL is unsupported or Canvas fails, show a polished non-3D fallback card.
   - The fallback should still say Ethen is available as an Upcube guide, without claiming AI voice is already active.

5. Integrate the component into the existing Ethen UI:
   - Find the current Ethen panel/card/section.
   - Replace only the visual/avatar area or add the 3D avatar as an enhancement.
   - Preserve existing layout, links, copy, and CTA behavior unless needed for clean integration.
   - Do not redesign the whole homepage.
   - Do not remove existing Ethen functionality.

6. Add a small model asset convention:
   - Create public/models/ethen/README.md or similar if appropriate.
   - Explain that a future GLB/VRM model can be placed at public/models/ethen/ethen.glb.
   - Do not add large binary model files.
   - Do not download models from the internet.
   - Do not commit placeholder binaries.

7. Add minimal styles:
   - The avatar container should look premium and fit the existing Upcube design.
   - Keep it dark-mode/light-mode compatible if the app supports themes.
   - Avoid flashy toy-like visuals.
   - Avoid copying Tavus, D-ID, HeyGen, Apple, Google, or any third-party avatar branding.

Behavior-system foundation:
Although this job does not implement real AI, TTS, lip-sync, or emotional intelligence, the component must be structured as the foundation for a future behavior engine, not as a one-off decorative 3D model.

The EthenAvatar3D component should accept a state prop such as:
"idle" | "listening" | "thinking" | "speaking" | "offline"

For now, these states may only produce subtle visual differences, such as status text, motion intensity, or fallback object animation. However, the component architecture should make it easy for later jobs to connect:
- active listening
- gaze
- blinking
- head motion
- speaking animation
- emotion tags
- lip-sync / visemes
- real-time voice state

Do not overbuild these systems in this job. Only create the clean foundation.

Explicit non-scope:
- Do not add AI chat logic.
- Do not add OpenAI, Tavus, D-ID, HeyGen, ElevenLabs, WebRTC, STT, TTS, lip-sync, VAD, or streaming code.
- Do not create Persona/Replica/Conversation backend objects yet.
- Do not create billing, usage metering, observability, safety dashboards, consent flows, or admin panels yet.
- Do not add a real human likeness.
- Do not use celebrity/person likenesses.
- Do not add large binary assets.
- Do not redesign the full site.
- Do not create commits, branches, PRs, zip files, copied bundles, or downloadable artifacts.

Architecture constraints:
- Keep the component reusable.
- Keep avatar state controlled by props so future jobs can connect speaking/listening/thinking states.
- Keep model-loading logic isolated from the rest of the UI.
- Avoid hydration errors.
- Avoid direct window/document access outside safe client effects.
- Keep rendering budget mobile-conscious.
- Prefer typed TypeScript interfaces if the repo uses TypeScript.
- Follow existing code style and import aliases.

Suggested component structure:
- EthenAvatar3D.tsx
  - top-level exported component
  - WebGL support detection
  - Canvas scene
  - Suspense loader
  - Model component using useGLTF if available
  - Fallback avatar mesh if model load fails or no model path is usable
  - State-based subtle visual differences

Optional but useful:
- Add a tiny EthenAvatarFallback component.
- Add an EthenAvatarScene internal component.
- Add a small status label below or over the avatar only if it fits existing UI.

Validation commands:
Run the repo’s actual validation commands based on package.json. At minimum, try:
1. install dependencies using the repo’s package manager if needed
2. npm run lint or pnpm lint if available
3. npm run build or pnpm build if available
4. npx tsc --noEmit if TypeScript is configured and this command is appropriate

Do not invent success. If a command fails because of unrelated pre-existing repo issues, report that clearly and include the relevant error summary.

Pass conditions:
- The app builds, or any build failure is clearly identified as pre-existing/unrelated.
- Ethen UI now includes a browser-rendered 3D avatar area.
- The avatar component does not require an actual GLB file to render.
- A future GLB can be dropped into public/models/ethen/ethen.glb without changing the public API.
- No Tavus, D-ID, HeyGen, STT, TTS, WebRTC, or AI vendor dependency is introduced.
- No large binary files are added.
- No full-site redesign is performed.

Required final response format:
Return a concise implementation report with these sections:

1. Summary
- What was added and where.

2. Files changed
- List every changed file with a one-line purpose.

3. Dependencies
- List any added dependencies.
- If none were needed, say so.

4. Ethen integration point
- Explain exactly where the 3D avatar was inserted.

5. Model asset convention
- Explain where a future GLB/VRM should be placed.

6. Validation
- List commands run.
- Mark pass/fail.
- Include short error summaries if any failed.

7. Non-scope confirmation
- Confirm no AI, TTS, lip-sync, WebRTC, Tavus, D-ID, HeyGen, or large binary assets were added.

8. Next recommended job
- Recommend the next implementation job, likely Avatar Life States: idle, blink, gaze, breathing/sway, and state controller.
```

## DeepSeek / OpenCode Prompt: Job 2

```text
Cost/cache control: Keep this stable instruction block first and unchanged across jobs. Do not prepend changing repo status, timestamps, logs, screenshots, or summaries before it. Use targeted file reads only. Do not paste large file contents unless required. After initial repo inspection, summarize findings briefly instead of repeatedly sending raw logs. Use DeepSeek V4 Flash for routine implementation unless this job is explicitly escalated to V4 Pro.

I’ll be using ChatGPT 5.5 to design, supervise, and review the implementation strategy, and DeepSeek will be the implementation agent running inside OpenCode against my connected local Git repo. ChatGPT 5.5 is the planner, spec writer, validator, and final reviewer. DeepSeek is the scoped implementation worker.

Job name:
Add Ethen Behavior Engine v1: idle presence, active listening, thinking, speaking placeholder, gaze, blink, and smooth state transitions

Model to use:
DeepSeek V4 Flash

Mode to use:
High

Repo path:
/Users/sha/Documents/AI/upcube

Goal:
Upgrade the first Ethen 3D avatar prototype from a static visual component into a lightweight browser-side behavior system. This job should not add AI, TTS, STT, lip-sync, WebRTC, or vendor APIs. It should only add state-driven avatar behavior.

Repo-drift rule:
Do not assume exact file paths. First inspect the current Ethen avatar files created in Job 1 and integrate with the existing structure.

Implementation scope:
Create a reusable Ethen behavior controller that maps avatar states to visual behaviors.

Required states:
- idle
- listening
- thinking
- speaking
- greeting
- confirming
- curious
- offline

Expected behavior controls:
- blink loop
- subtle idle breathing/sway
- gaze movement
- head movement
- state transition timing
- speaking placeholder motion without real audio sync
- reduced-motion support
- mobile-safe animation budget

Architecture:
The behavior system should be cleanly separated from the rendering component where possible.

Suggested files:
- components/ethen/EthenAvatar3D.tsx
- components/ethen/useEthenBehavior.ts
- components/ethen/ethenBehaviorTypes.ts
- components/ethen/EthenAvatarFallback.tsx

Do not hardcode future AI logic. The behavior controller should be ready for later voice, TTS, viseme, and emotion systems, but this job only builds the local visual state machine.

Explicit non-scope:
- Do not add AI chat logic.
- Do not add TTS, STT, WebRTC, VAD, or lip-sync.
- Do not add Tavus, D-ID, HeyGen, ElevenLabs, or other avatar vendor dependencies.
- Do not create backend platform objects.
- Do not add large binary model assets.
- Do not redesign the homepage.

Validation:
Run lint, build, and TypeScript validation if available.

Pass conditions:
- Ethen has visible idle/life behavior.
- State changes can be controlled by props.
- Reduced motion is respected.
- No AI, TTS, STT, WebRTC, Tavus, D-ID, HeyGen, or large assets are added.
- Build passes or failures are clearly reported.

Required final response format:
Return a concise implementation report with these sections:

1. Summary
2. Files changed
3. Behavior states added
4. Integration point
5. Validation
6. Non-scope confirmation
7. Next recommended job
```

## Tavus-Style Platform Layers For Later

These layers should not be built in Job 1 or Job 2, but they should guide future architecture.

### 1. Persona Layer

Controls:

- instructions
- personality
- behavior
- guardrails
- knowledge
- product routing

### 2. Replica Layer

Controls:

- avatar identity
- model asset
- voice identity
- rendering mode
- consent metadata
- identity revocation

### 3. Conversation Layer

Controls:

- session
- room
- context
- transcript
- duration
- user state

### 4. Media Layer

Controls:

- WebRTC
- STUN/TURN
- SFU
- reconnection
- audio/video routing

### 5. Intelligence Layer

Controls:

- STT
- LLM
- tools
- RAG
- memory
- product knowledge

### 6. Turn-Taking Layer

Controls:

- VAD
- endpointing
- interruption
- active listening
- silence handling

### 7. Rendering Layer

Controls:

- browser GLB
- neural video
- streamed Unreal/MetaHuman
- Gaussian splatting research later

### 8. Observability Layer

Controls:

- latency
- traces
- transcripts
- recordings
- error logs
- session analytics

### 9. Billing Layer

Controls:

- minutes
- GPU seconds
- STT usage
- TTS usage
- LLM tokens
- subscription limits

### 10. Trust Layer

Controls:

- consent
- watermarking
- revocation
- audit logs
- moderation
- safety policy

## Current Missing Decisions

Before moving beyond Job 1 and Job 2, Upcube still needs to decide:

1. Actual avatar model asset
2. First TTS provider
3. Lip-sync implementation path
4. Whether the first Ethen model should be stylized, semi-realistic, or photorealistic
5. Whether Ethen should appear only on the homepage or across the full Upcube console
6. How much conversation memory Ethen should have
7. How to disclose that Ethen is AI
8. Whether Ethen should become a product guide only or a broader Upcube operating assistant

## Recommended Immediate Next Step

Run Job 1 first.

After Job 1 passes, run Job 2.

Do not start with Tavus-style neural video, WebRTC infrastructure, Persona/Replica backend objects, or billing yet. Those are important, but they are later platform layers.

The immediate goal is simple:

> Make Ethen visible, owned, browser-rendered, alive, and architecturally ready for voice.
