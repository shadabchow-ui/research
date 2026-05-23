# Implementation Status / Roadmap QA Pass

Generated during Job 42 — Final Integration QA

---

## 1. Build and Test Results

| Command                      | Result |
| ---------------------------- | ------ |
| `pnpm build`                 | PASS   |
| `pnpm test` (prettier:check) | PASS   |
| `npx tsc --noEmit`           | PASS   |

---

## 2. Implemented

These feature areas have real code that compiles and renders actual functionality.

| Area                                | Files                                                                                                                          | Notes                                                                                                                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js app scaffold**            | `app/layout.tsx`, `next.config.ts`, `app/globals.css`                                                                          | Vercel-compatible, Next.js 15.6 canary, Turbopack, Tailwind v4, dark-theme CSS variables                                                                                                                                           |
| **Homepage**                        | `app/page.tsx`                                                                                                                 | Hero, product cards, metrics, waitlist, EthenChatPanel embedded                                                                                                                                                                    |
| **Ethen behavior engine**           | `components/ethen/ethen-behavior-panel.tsx`, `useEthenBehavior.ts`, `ethenBehaviorTypes.ts`                                    | 9 states (idle, listening, speaking, thinking, etc.), breathing, blink, mouth wave, reduced-motion support. CSS-only fallback — no 3D model loaded.                                                                                |
| **Ethen product guide / text chat** | `components/ethen/ethenChatPanel.tsx`, `lib/ethen/ethenGuide.ts`, `lib/ethen/ethenProductKnowledge.ts`                         | Keyword-based response matching, 20+ knowledge entries, CTA link routing, suggestion chips, thinking/speaking state transitions                                                                                                    |
| **TTS abstraction + API**           | `lib/ethen/ethenTts.ts`, `lib/ethen/ethenMouthMovement.ts`, `app/api/ethen/tts/route.ts`, `components/ethen/useEthenSpeech.ts` | Provider-neutral: ElevenLabs, Cartesia, Azure, OpenAI, Deepgram adapters coded. Returns fallback `{ audioAvailable: false, reason: "not provided" }` when no env keys set.                                                         |
| **WebAudio mouth movement**         | `components/ethen/useWebAudioMouthMovement.ts`                                                                                 | RMS amplitude extraction from Audio element, lerp smoothing, mouth open width/height animation                                                                                                                                     |
| **STT abstraction + API**           | `lib/ethen/ethenStt.ts`, `app/api/ethen/stt/route.ts`                                                                          | Provider-neutral: Deepgram, AssemblyAI, Soniox adapters. Returns fallback when no provider configured.                                                                                                                             |
| **Microphone hook**                 | `components/ethen/useEthenMicrophone.ts`                                                                                       | VAD (voice activity detection), audio chunks as base64, audio level metering, silence timeout                                                                                                                                      |
| **Streaming LLM abstraction**       | `lib/ethen/ethenStreamingLlm.ts`                                                                                               | Provider-neutral: OpenAI, Anthropic with streaming support. Static fallback using guide responses.                                                                                                                                 |
| **Voice pipeline**                  | `lib/ethen/ethenVoicePipeline.ts`                                                                                              | Sequential and simultaneous modes, SSE event types, LLM → TTS orchestration                                                                                                                                                        |
| **Live response API route**         | `app/api/ethen/live-response/route.ts`                                                                                         | POST with `{ message, stream }` — SSE streaming or JSON, TTS attempted as secondary output                                                                                                                                         |
| **Conversation flow profiles**      | `lib/ethen/ethenConversationFlow.ts`, `components/ethen/useEthenConversationFlow.ts`                                           | Turn-taking patience, interruptibility, idle engagement, voice isolation                                                                                                                                                           |
| **Viseme types + reference data**   | `lib/ethen/ethenVisemes.ts`                                                                                                    | Oculus 15 viseme names, ARKit 52 blendshape names, default Oculus→ARKit mappings, word→viseme lookup, sample timeline generator                                                                                                    |
| **Platform object model**           | `lib/avatar-cloud/types.ts`                                                                                                    | 21 interfaces: Persona, Replica, Voice, LiveAgent, Conversation, Session, Transcript, UsageRecord, EmbedConfig, KnowledgeBase, ConversationFlowProfile, ConsentRecord, StudioVideo, VideoScene, AvatarEvent, RendererSession, etc. |
| **Platform sample data**            | `lib/avatar-cloud/sample-data.ts`                                                                                              | Ethen persona/replica/voice/agent, Website Concierge persona/template, knowledge base                                                                                                                                              |
| **Avatar event protocol**           | `lib/avatar-cloud/events.ts`                                                                                                   | 35+ event types, discriminated union, event creation helpers, type guards                                                                                                                                                          |
| **Observability/cost metering**     | `lib/avatar-cloud/metrics.ts`                                                                                                  | CostBreakdown, LatencyBreakdown, CallMetrics, WebRTCQualityMetrics, session cost estimator, sample data                                                                                                                            |
| **Session tokens API**              | `lib/avatar-cloud/session-tokens.ts`, `app/api/avatar-cloud/session-token/route.ts`                                            | Demo token creation, domain validation, CORS, POST + OPTIONS                                                                                                                                                                       |
| **Embed SDK foundation**            | `lib/avatar-cloud/embed.ts`, `app/developers/embed/page.tsx`                                                                   | Config creation/validation/snippet generation                                                                                                                                                                                      |
| **Live Avatar product page**        | `app/products/live-avatar/page.tsx`                                                                                            | Use case grid, how-it-works steps, EthenChatPanel embedded                                                                                                                                                                         |
| **Studio Lite editor**              | `app/console/studio/page.tsx`, `components/avatar-cloud/StudioScriptEditor.tsx`, `lib/avatar-cloud/studio-scene.ts`            | Script-to-scene client editor, paragraph splitting, editable cards, word count, duration estimates                                                                                                                                 |
| **Model pipeline spec**             | `public/models/ethen/README.md`                                                                                                | Model conventions, blendshape requirements, optimization budgets, licensing/QA checklists                                                                                                                                          |
| **Model manifest type**             | `lib/avatar-cloud/model-assets.ts`                                                                                             | ModelAssetManifest, blendshape standard, current placeholder entry                                                                                                                                                                 |

---

## 3. Demo/Static Only

These pages use real components and sample data but have no backend persistence, auth, or live data.

| Page                                                 | What it shows                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/console/analytics`                                 | MetricCards, AnalyticsTable, ProviderStatus — all sample data, labeled "demo"          |
| `/console/avatar-agents`                             | Agent cards (1 active, 1 sample, 5 coming-soon) — sample data                          |
| `/console/avatar-agents/builder`                     | Interactive AgentBuilder form, step-by-step config, all sample data                    |
| `/console/avatar-agents/templates/website-concierge` | Goals, lead fields, qualification questions, demo lead — all from templates.ts         |
| `/console/conversations`                             | Conversation log viewer, transcript, event timeline — sample-conversations.ts          |
| `/console/usage`                                     | MetricCards, cost tables, quality metrics, provider readiness — metrics.ts sample data |
| `/console/governance`                                | Modules, consent records, allowed-use policy, retention controls — all "spec" planning |
| `/videos/demo`                                       | Transcript Q&A, quiz, checklists, lead capture, handoff, analytics — demo components   |
| `/developers/embed`                                  | Embed config validation, snippet preview, architecture, roadmap — scaffold only        |
| `/pricing`                                           | Static pricing cards with placeholder prices ("Not provided" for Pro)                  |

---

## 4. Not Configured

Provider abstractions exist in code but no API keys are set (`.env.example` has only Shopify vars).

| Provider Area | Env Keys Checked                                                                                  | Fallback Behavior                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **TTS**       | ELEVENLABS_API_KEY, CARTESIA_API_KEY, AZURE_TTS_API_KEY, OPENAI_TTS_API_KEY, DEEPGRAM_TTS_API_KEY | Returns `audioAvailable: false, reason: "not provided"`                     |
| **STT**       | DEEPGRAM_API_KEY, ASSEMBLYAI_API_KEY, SONIOX_API_KEY                                              | Returns `transcriptAvailable: false, reason: "STT provider not configured"` |
| **LLM**       | OPENAI_API_KEY, ANTHROPIC_API_KEY                                                                 | Falls back to `ethenGuide` static responses                                 |
| **Voice**     | Voice object `provider: "not_configured"`                                                         | Chat panel shows "Voice unavailable"                                        |

---

## 5. Missing

These roadmap items have zero implementation (no code, types, or pages).

| Area                            | Status                                                             |
| ------------------------------- | ------------------------------------------------------------------ |
| **Browser 3D Ethen Canvas**     | Missing — no Three.js, no R3F dependency, no GLB loading component |
| **Custom Ethen 3D model file**  | Missing — no model file exists in `public/models/ethen/`           |
| **LiveKit / WebRTC**            | Missing — no real-time media transport                             |
| **Neural video rendering**      | Missing                                                            |
| **GPU serving infrastructure**  | Missing                                                            |
| **Database / persistence**      | Missing — no ORM, no database                                      |
| **Authentication**              | Missing                                                            |
| **Billing / Stripe**            | Missing                                                            |
| **Studio video rendering**      | Missing — no TTS generation, no video compositing                  |
| **Studio voiceover generation** | Missing                                                            |
| **Studio captions generation**  | Missing                                                            |
| **Studio MP4 export**           | Missing                                                            |
| **Transcript-aware Q&A (live)** | Types exist (`transcript-qa.ts`) but no live integration           |
| **Quiz / checklist runtime**    | Components exist but use demo data only                            |
| **Governance runtime**          | Types and sample data only, no enforcement                         |

---

## 6. Small Fixes Made

| Fix                                                                           | File               | Issue                                                                          |
| ----------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| Nav links `/products/avatar-api` → `/developers`                              | `lib/constants.ts` | Broken link — Developers route is at `/developers`, not `/products/avatar-api` |
| Nav links `/products/interactive-pages` → `/products/interactive-video-pages` | `lib/constants.ts` | Broken link — actual route uses `interactive-video-pages`                      |
| Footer "Pricing" link `#` → `/pricing`                                        | `lib/constants.ts` | Dead link — pricing page exists at `/pricing`                                  |
| Live Avatar status `coming-soon` → `preview`                                  | `lib/constants.ts` | Card said "Soon" but Ethen demo is live on the page                            |
| Homepage status-chip logic updated                                            | `app/page.tsx`     | Ternary now handles `"preview"` status explicitly                              |

---

## 7. Drift Found

| Drift                                   | Details                                                                                                                                                                                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No 3D avatar runtime**                | Master source of truth (section 7) specifies R3F/Three.js as first rendering path. The Ethen avatar is CSS-based — breathing circle, eye dots, mouth wave. No `three`, `@react-three/fiber`, or `@react-three/drei` in dependencies.                                   |
| **No ecommerce connection**             | The original Shopify cart/pages still exist in the file tree (`components/cart/`, `app/product/[handle]/`, `lib/shopify/`) but are disconnected from the Avatar Cloud navigation. Not removed, not integrated — passive heritage.                                      |
| **Events.ts naming conflict**           | `AvatarEvent` exists in both `lib/avatar-cloud/types.ts` (simple interface) and `lib/avatar-cloud/events.ts` (discriminated union). Both compile because the barrel only exports from types.ts. Not a bug, but should be resolved in a future type consolidation pass. |
| **ConversationFlowProfile duplication** | Defined in `lib/ethen/ethenConversationFlow.ts` (simpler, runtime-oriented) and `lib/avatar-cloud/types.ts` (richer, platform-model). The runtime version lacks `id`, `name`, `wakePhrase`.                                                                            |
| **Console says "coming soon"**          | `app/console/page.tsx` says "Authentication and dashboard features coming soon" but sub-pages (analytics, agents, studio) are already implemented. The console landing page needs updating.                                                                            |
| **Pricing "Not provided"**              | Pro plan shows "Not provided" for pricing — honest but could be confused with `not_configured` provider status. Should display as "Coming soon" to match other placeholder pricing.                                                                                    |

---

## 8. Blockers / Unknowns

- **No known build breakers** — the app compiles, builds, and passes prettier
- **No 3D model file** — the model pipeline README is comprehensive but no model exists; Ethen renders via CSS fallback
- **No provider API keys** — all voice/STT/LLM features degrade gracefully to text-only
- **No real-time infrastructure** — LiveKit/WebRTC, streaming video, GPU rendering entirely absent

---

## 9. Critical Risks

1. **3D avatar not started**: The first visual differentiator (browser-rendered 3D Ethen) was never implemented. The CSS fallback is polished but not what the product vision describes.
2. **No auth**: Console pages would need auth before any production deployment.
3. **No persistent storage**: Sample data won't scale — every agent configuration, conversation, and studio project needs persistence.
4. **Provider costs unknown**: The metering types exist but no real TTS/STT/LLM calls have been tested at scale, so cost models are unvalidated.
5. **Shopify heritage**: Ecommerce cart/product pages are visible in the route tree (`/product/[handle]`, `/search/[collection]`) but are disconnected from the Avatar Cloud navigation and purpose.

---

## 10. Recommended Next Implementation Priorities

1. **Add Three.js / React Three Fiber** — the highest-priority missing feature. Without 3D rendering, Ethen isn't an avatar.
2. **Add auth** — required before console can be more than a local demo.
3. **Add persistence** — start with lightweight storage (KV, D1, or in-memory for dev).
4. **Configure one TTS provider** — pick ElevenLabs or Cartesia, add a dev API key, run cost tests.
5. **Upgrade Ethen product guide to real LLM** — wire OpenAI or Anthropic via the existing `ethenStreamingLlm` abstraction.
6. **Remove or hide disconnected ecommerce routes** — the `app/product/[handle]/` and `app/search/` Shopify routes are visible but irrelevant to the Avatar Cloud product.

---

Generated: 2025-05-23
