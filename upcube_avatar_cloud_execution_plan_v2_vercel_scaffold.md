# Upcube Avatar Cloud Execution Plan v2 — Vercel Commerce Scaffold

## Purpose

This document updates the Upcube Avatar Cloud execution plan to reflect the actual implementation starting point:

```text
Local repo/archive:
/Users/sha/Documents/AI/avatar/avatar.zip

Uploaded sandbox file:
avatar.zip

Detected project root inside zip:
commerce-main/
```

The repo is originally a **Vercel / Next.js Commerce scaffold**. We will build the Upcube Avatar Cloud frontend from this scaffold instead of assuming a clean custom Upcube repo.

This changes the execution plan.

The project is no longer:

```text
Start from blank app
```

It is now:

```text
Take a Vercel ecommerce scaffold
→ remove or repurpose commerce-specific structure
→ rebuild product surface from scratch as Avatar Cloud
→ preserve useful Next.js/Vercel performance foundation
→ add Ethen and Avatar Cloud platform modules
```

---

# 1. Detected Scaffold Summary

The uploaded archive contains:

```text
commerce-main/
```

Important detected files and directories:

```text
commerce-main/package.json
commerce-main/pnpm-lock.yaml
commerce-main/next.config.ts
commerce-main/tsconfig.json
commerce-main/app/
commerce-main/components/
commerce-main/lib/
commerce-main/lib/shopify/
commerce-main/app/product/
commerce-main/app/search/
commerce-main/components/cart/
```

Detected stack:

```text
Next.js 15.6.0-canary.60
React 19
React DOM 19
Tailwind CSS 4
pnpm
Vercel-oriented app structure
App Router
Shopify commerce integration
```

Current package scripts:

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "prettier": "prettier --write --ignore-unknown .",
  "prettier:check": "prettier --check --ignore-unknown .",
  "test": "pnpm prettier:check"
}
```

## Important implication

This is a strong performance scaffold, but the product domain is wrong.

The existing app is ecommerce-oriented. Avatar Cloud should be built from scratch on top of this foundation.

---

# 2. Revised Product Direction

The product remains:

> **Upcube Avatar Cloud: live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators — powered by Ethen as the flagship avatar.**

But the first implementation work now includes a scaffold conversion phase:

```text
Commerce scaffold
→ Avatar Cloud product shell
→ Ethen visible
→ Ethen alive
→ Ethen speaking
→ Ethen useful
→ Ethen live voice
→ Avatar platform beta
→ Studio Lite
→ Interactive video pages
```

---

# 3. What To Preserve From The Commerce Scaffold

Keep useful infrastructure:

```text
Next.js App Router
Vercel deployment compatibility
React Server Components where useful
Tailwind setup
layout structure
SEO helpers where useful
image/component patterns where useful
grid/card UI patterns if reusable
performance-first defaults
pnpm lockfile
TypeScript config
```

Possible reusable UI pieces:

```text
components/grid/
components/icons/
components/carousel.tsx
app/layout.tsx
app/globals.css
lib/utils.ts
lib/constants.ts
SEO / sitemap / robots patterns
```

---

# 4. What To Remove Or Replace

Commerce-specific systems should be removed, disabled, or replaced as the plan progresses.

Likely commerce-specific areas:

```text
lib/shopify/
components/cart/
app/product/
app/search/
cart actions/context
Shopify env requirements
product queries/fragments
collection pages
product detail pages
commerce-specific metadata
```

## Do not delete blindly

First audit dependencies and routes.

Some components may be reused visually, but Shopify/cart logic should not remain part of the core Avatar Cloud product unless intentionally repurposed.

---

# 5. New Phase 0: Scaffold Conversion

## Phase 0A: Repo Extraction and Baseline Validation

### Goal

Extract and validate the Vercel Commerce scaffold before modification.

### Local path assumption

```text
/Users/sha/Documents/AI/avatar
```

### Archive

```text
/Users/sha/Documents/AI/avatar/avatar.zip
```

### Expected root after extraction

```text
/Users/sha/Documents/AI/avatar/commerce-main
```

### Required first commands

```bash
cd /Users/sha/Documents/AI/avatar
ls -la
unzip -l avatar.zip | head -80
unzip -o avatar.zip
cd commerce-main
pwd
ls -la
cat package.json
pnpm install
pnpm build
pnpm test
```

### Acceptance criteria

```text
Repo extracts cleanly.
Dependencies install.
Baseline build result is recorded.
Existing failures are documented before edits.
Package manager remains pnpm.
```

---

## Phase 0B: Commerce Scaffold Audit

### Goal

Map what commerce code exists and decide what to keep, remove, or repurpose.

### Required commands

```bash
cd /Users/sha/Documents/AI/avatar/commerce-main

find app -maxdepth 4 -type f | sort
find components -maxdepth 4 -type f | sort
find lib -maxdepth 4 -type f | sort

rg -n "shopify|cart|product|collection|checkout|storefront|commerce|variant|price|addToCart|Cart" .
rg -n "SITE_NAME|SHOPIFY|COMPANY_NAME|STORE" .
```

### Deliverables

```text
route inventory
component inventory
commerce dependency map
safe-removal list
reuse list
risk list
```

### Acceptance criteria

```text
No blind deletion.
Commerce-specific files are classified.
Avatar Cloud target app structure is proposed.
```

---

## Phase 0C: Replatform To Avatar Cloud Shell

### Goal

Convert the homepage and navigation into an Avatar Cloud product shell.

### New app surface

```text
/
  Avatar Cloud homepage with Ethen hero

/products/live-avatar
  public product page for real-time avatars

/products/studio
  public product page for Studio Lite

/products/interactive-video-pages
  public product page for interactive avatar video pages

/console
  future dashboard shell

/console/avatar-agents
  Avatar Agents module

/console/studio
  Studio module placeholder

/console/analytics
  Analytics placeholder
```

### Remove/replace ecommerce UX

Replace:

```text
product cards
cart drawer
checkout actions
search collections
Shopify product routes
```

With:

```text
avatar platform cards
Ethen demo panel
Live Agent use cases
Studio workflow cards
interactive video page preview
waitlist/signup CTA
```

### Acceptance criteria

```text
Homepage no longer looks like ecommerce.
No cart UI is visible.
No Shopify env is required for basic build if possible.
Upcube Avatar Cloud messaging is visible.
Vercel deployment remains supported.
```

---

# 6. Revised Execution Stages

## Stage 0 — Scaffold Conversion and Grounding

```text
Job 0A: Extract and Baseline Validate Vercel Commerce Scaffold
Job 0B: Commerce Scaffold Audit
Job 0C: Replatform Homepage to Avatar Cloud Shell
Job 0D: Route and Navigation Reset
Job 0E: Avatar Cloud Design Tokens and UI Foundation
```

## Stage 1 — Ethen Visual MVP

```text
Job 1: Avatar Runtime Evaluation
Job 2: Browser 3D Ethen Canvas
Job 3: Ethen Behavior Engine
Job 4: Ethen Product Surface Integration
```

## Stage 2 — Ethen Speaking MVP

```text
Job 5: Text Chat + Upcube Product Guide
Job 6: TTS Speaking Prototype
Job 7: Basic WebAudio Mouth Movement
Job 8: Ethen MVP Polish and Public Demo Page
```

## Stage 3 — Ethen Live Voice

```text
Job 9: Live Voice Architecture Spike
Job 10: Microphone + Streaming STT
Job 11: Streaming LLM + Streaming TTS
Job 12: Adaptive Interruption and Conversation Flow
Job 13: Ethen Live Voice Polish
```

## Stage 4 — Platform Foundations

```text
Job 14: Platform Object Model
Job 15: Avatar Event Protocol
Job 16: Observability and Cost Metering v1
Job 17: Short-Lived Session Tokens
Job 18: Embed SDK v1
Job 19: Avatar Dashboard Analytics
```

## Stage 5 — Live Avatar Beta

```text
Job 20: Avatar Agents Dashboard
Job 21: Live Agent Builder Beta
Job 22: Website Concierge / AI SDR Template
Job 23: Conversation Logs and Transcripts
Job 24: Usage and Quality Dashboard
```

## Stage 6 — Studio Lite

```text
Job 25: Studio Video Object Model
Job 26: Script-to-Scene Editor
Job 27: Avatar Presenter + Voiceover
Job 28: Captions + Transcript
Job 29: Hosted Video Page
```

## Stage 7 — Interactive Video Pages

```text
Job 30: Transcript-Aware Q&A
Job 31: Quiz / Checklist Layer
Job 32: Lead Capture and CTA Layer
Job 33: Interactive Page Analytics
```

## Stage 8 — Governance and Enterprise Foundation

```text
Job 34: Avatar Governance Center Spec
Job 35: Consent Records and Revocation
Job 36: Data Retention Controls
Job 37: Audit Log Foundation
```

## Stage 9 — Advanced Research and Premium Rendering

```text
Job 38: Neural Video Benchmark
Job 39: GPU Serving Architecture Spec
Job 40: Custom Ethen Model Pipeline
Job 41: Better Lip-Sync / Viseme Pipeline
```

---

# 7. Updated Milestone Count

The full plan now becomes:

```text
10 major milestones
10 execution stages
42 implementation/research jobs
```

The additional work comes from converting the ecommerce scaffold into an Avatar Cloud app.

## Updated Milestones

```text
Milestone 1: Commerce Scaffold Converted
Milestone 2: Ethen Visible
Milestone 3: Ethen Alive
Milestone 4: Ethen Speaking
Milestone 5: Ethen Useful
Milestone 6: Ethen Live
Milestone 7: Avatar Platform Beta
Milestone 8: Studio Lite
Milestone 9: Interactive Video Pages
Milestone 10: Enterprise / Governance / Advanced Rendering Foundation
```

---

# 8. New Job Details

## Job 0A: Extract and Baseline Validate Vercel Commerce Scaffold

### Goal

Confirm the scaffold builds before modifications.

### Model

```text
DeepSeek V4 Flash
Mode: Medium
```

### Scope

```text
extract avatar.zip
enter commerce-main
install dependencies with pnpm
run baseline build/test
record current state
```

### Non-scope

```text
No redesign
No dependency swaps
No avatar implementation
No code deletion yet
```

### Acceptance criteria

```text
Build/test status recorded.
Package manager confirmed as pnpm.
Any scaffold errors are documented.
```

---

## Job 0B: Commerce Scaffold Audit

### Goal

Create a safe map of ecommerce-specific files and reusable infrastructure.

### Model

```text
DeepSeek V4 Flash
Mode: Medium
```

### Scope

```text
inventory routes
inventory components
inventory lib/shopify usage
inventory cart/product/search dependencies
identify safe removals
identify reusable UI patterns
```

### Acceptance criteria

```text
Commerce dependency map exists.
Safe removal plan exists.
Avatar Cloud route map exists.
```

---

## Job 0C: Replatform Homepage to Avatar Cloud Shell

### Goal

Replace ecommerce homepage with Upcube Avatar Cloud homepage.

### Model

```text
DeepSeek V4 Flash
Mode: High
```

### New homepage sections

```text
Hero: Create AI avatars that talk, listen, guide, and teach
Ethen preview panel
Live Avatar use cases
Studio Lite preview
Interactive Video Pages preview
Platform modules preview
Waitlist / signup CTA
```

### Acceptance criteria

```text
Homepage no longer references ecommerce.
Cart/product UI is not visible on homepage.
Avatar Cloud messaging is clear.
Build passes.
```

---

## Job 0D: Route and Navigation Reset

### Goal

Replace commerce navigation with Avatar Cloud navigation.

### Model

```text
DeepSeek V4 Flash
Mode: Medium
```

### Navigation

```text
Live Avatar
Studio
Interactive Pages
Developers
Pricing
Console
```

### Footer

```text
Products
Use Cases
Developers
Company
Legal
```

### Acceptance criteria

```text
Navigation is Avatar Cloud-specific.
Commerce routes are removed, hidden, or clearly deprecated.
No broken nav links.
```

---

## Job 0E: Avatar Cloud Design Tokens and UI Foundation

### Goal

Create a premium UI foundation using the existing Tailwind setup.

### Model

```text
DeepSeek V4 Flash
Mode: High
```

### Scope

```text
dark premium product shell
cards
panels
status chips
CTA buttons
console shell primitives
avatar panel surface
responsive layout rules
```

### Acceptance criteria

```text
UI feels like AI platform, not store template.
Styles are consistent.
No overbuilt design system yet.
```

---

# 9. Updated Job 1: Avatar Runtime Evaluation

Because this repo is a Vercel/Next scaffold, runtime evaluation must check App Router and React 19 compatibility.

## Evaluate

```text
Raw React Three Fiber + Three.js
R3F + three-vrm
TalkingHead
Omote R3F
AnimaSync
Rhubarb WASM
```

## Extra checks

```text
Next.js 15 canary compatibility
React 19 compatibility
client component requirements
SSR/hydration risk
bundle size
Turbopack compatibility
Vercel deployment risk
```

## Acceptance criteria

```text
runtime recommendation is made before implementation
fallback recommendation is made
required dependencies are listed
risk notes are included
```

---

# 10. Updated Architecture Constraints

## Repo path

Use:

```text
/Users/sha/Documents/AI/avatar/commerce-main
```

not:

```text
/Users/sha/Documents/AI/upcube
```

unless the user explicitly changes the repo.

## Package manager

Use:

```text
pnpm
```

Do not mix npm, yarn, or bun.

## Deployment target

Assume:

```text
Vercel
```

Do not design around Cloudflare Pages unless the user changes deployment target.

## Current scaffold

Treat ecommerce code as scaffold only.

Do not preserve Shopify/cart/product behavior unless intentionally repurposed.

## Product goal

The repo should become:

```text
Upcube Avatar Cloud frontend
```

not:

```text
ecommerce store with avatar features
```

---

# 11. Updated First Implementation Prompt Target

The next implementation prompt should not start with Ethen 3D immediately.

It should be:

```text
Job 0A + Job 0B: Extract, Baseline Validate, and Audit Vercel Commerce Scaffold
```

Then:

```text
Job 0C: Replatform Homepage to Avatar Cloud Shell
```

Then:

```text
Job 1: Avatar Runtime Evaluation
```

Then:

```text
Job 2: Browser 3D Ethen Canvas
```

---

# 12. Updated Public Beta Target

For a strong public beta on this scaffold, complete:

```text
Stage 0
Stage 1
Stage 2
Stage 3
```

That means:

```text
Commerce scaffold converted
Ethen visible
Ethen alive
Ethen speaking
Ethen useful
Ethen live voice
```

Approximate scope:

```text
Jobs 0A–13
```

Full platform scope remains:

```text
Jobs 0A–41
```

---

# 13. Updated Validation Standards

Every implementation job should run the repo’s actual commands.

Detected likely commands:

```bash
pnpm build
pnpm test
pnpm prettier:check
```

If TypeScript check is available or appropriate:

```bash
pnpm tsc --noEmit
```

If no `tsc` script exists, use:

```bash
npx tsc --noEmit
```

Do not invent success.

Report:

```text
commands run
pass/fail
errors
whether errors are pre-existing or introduced
```

---

# 14. Final Recommendation

This change is good.

The Vercel Commerce scaffold gives us:

```text
Next.js App Router
Vercel deployment compatibility
React 19
Tailwind 4
performance-oriented page structure
usable UI primitives
```

But it also means we need a careful conversion phase.

The correct next move is:

> **Do not start with the avatar component yet. First convert the ecommerce scaffold into an Avatar Cloud shell.**

Then add Ethen.

Immediate build order:

```text
Job 0A: Extract and Baseline Validate Vercel Commerce Scaffold
Job 0B: Commerce Scaffold Audit
Job 0C: Replatform Homepage to Avatar Cloud Shell
Job 0D: Route and Navigation Reset
Job 0E: Avatar Cloud Design Tokens and UI Foundation
Job 1: Avatar Runtime Evaluation
Job 2: Browser 3D Ethen Canvas
Job 3: Ethen Behavior Engine
```

First real milestone:

```text
Commerce scaffold converted into a premium Upcube Avatar Cloud frontend.
```

Second real milestone:

```text
Ethen visible and alive inside that frontend.
```
