# Ethen Live Voice — Architecture Spike

## 1. Purpose

Analyze the safest architecture for adding live voice (mic input → STT → LLM → TTS → avatar) to Ethen inside the current repo. This is a spike document only — no voice implementation is added.

---

## 2. Existing Voice Infrastructure (as of spike)

| Layer                        | Status                                                                | Files                                          |
| ---------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| TTS abstraction              | Present — 5 providers (ElevenLabs, Cartesia, Azure, OpenAI, Deepgram) | `lib/ethen/ethenTts.ts`                        |
| TTS API route                | Present — POST `/api/ethen/tts`                                       | `app/api/ethen/tts/route.ts`                   |
| Client TTS playback          | Present — `useEthenSpeech` hook                                       | `components/ethen/useEthenSpeech.ts`           |
| Mouth movement (Web Audio)   | Present — AudioContext analyser                                       | `components/ethen/useWebAudioMouthMovement.ts` |
| Mouth movement (utility)     | Present — amplitude mapping                                           | `components/ethen/ethenMouthMovement.ts`       |
| Demo panel with voice toggle | Present                                                               | `components/ethen/EthenDemoPanel.tsx`          |
| Chat panel (text-only)       | Present — static guide engine                                         | `components/ethen/ethenChatPanel.tsx`          |
| Ethen state system           | Present — 9 states incl. `listening`, `user_speaking`, `interrupted`  | `components/ethen/ethenBehaviorTypes.ts`       |
| **STT**                      | **Not present**                                                       | –                                              |
| **Microphone capture**       | **Not present**                                                       | –                                              |
| **LiveKit**                  | **Not present**                                                       | –                                              |
| **WebRTC**                   | **Not present**                                                       | –                                              |
| **Streaming LLM**            | **Not present** (static guide only)                                   | –                                              |
| **Provider API keys**        | **Not present** (no `.env` file)                                      | –                                              |

---

## 3. Architecture Recommendation

### 3.1 Recommended approach: Staged browser fetch/SSE pipeline (not LiveKit first)

```
Stage 1: Browser mic + Speech-to-Text (STT) + text chat
Stage 2: Replace static guide with streaming LLM (SSE)
Stage 3: Streaming TTS (chunked audio)
Stage 4: Voice Activity Detection + endpointing
Stage 5: Interruption / barge-in state machine
Stage 6: LiveKit migration (if scale / multi-room / platform demand)
```

**Why not LiveKit first:**

- LiveKit requires a server component, TURN credentials, room management, and a running agent.
- Ethen is a single-user first-party avatar, not a multi-room platform. LiveKit overhead is not justified until Upcube sells Live Avatar to external customers.
- A browser-native `getUserMedia` + `SpeechRecognition` / WebSocket STT pipeline can prove the UX before committing to LiveKit infrastructure.
- The current repo has zero LiveKit dependencies. Adding them would require `@livekit/components-react`, `livekit-client`, and a LiveKit Cloud account or self-hosted server.

### 3.2 Provider choice for each stage

| Stage   | Component            | Recommended Provider                                              | Reason                                                 |
| ------- | -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| Stage 1 | STT (browser native) | `SpeechRecognition` API or `@xenova/transformers` Whisper (local) | Zero server cost, privacy, no API key needed           |
| Stage 1 | STT (server)         | Deepgram or Soniox                                                | Higher accuracy, streaming partials, under 300ms       |
| Stage 2 | LLM                  | OpenAI or Anthropic via SSE                                       | Streaming tokens, low TTFB                             |
| Stage 3 | TTS                  | Cartesia or ElevenLabs (streaming)                                | Under 500ms first audio, viseme support                |
| Stage 4 | VAD                  | `@ricky0123/vad-web` or Silero VAD                                | Runs in browser, no server needed                      |
| Stage 5 | Interruption         | Custom state machine                                              | Ties into existing `interrupted` / `recovering` states |
| Stage 6 | Media transport      | LiveKit                                                           | Multi-room, TURN, agent framework                      |

### 3.3 Data flow (target)

```
Browser mic
  → getUserMedia stream
  → AudioWorklet / MediaRecorder chunks
  → WebSocket / fetch stream to STT provider (or browser SpeechRecognition)
  → STT partials emitted as text events
  → LLM SSE endpoint receives partial transcript
  → LLM streams tokens back
  → TTS endpoint receives tokens
  → TTS streams audio chunks (base64 or binary)
  → AudioContext plays chunks
  → useWebAudioMouthMovement syncs mouth from analyser
  → Avatar state machine: user_speaking → thinking → speaking → listening
```

---

## 4. Provider/Config Gaps

| Required Config        | Status                                                     |
| ---------------------- | ---------------------------------------------------------- |
| STT provider API key   | **Not provided**                                           |
| LLM provider API key   | **Not provided**                                           |
| Streaming TTS API key  | **Not provided** (TTS abstraction exists but keys not set) |
| LiveKit server URL     | **Not provided**                                           |
| LiveKit API key        | **Not provided**                                           |
| `.env` / `.env.local`  | **Not provided**                                           |
| `NEXT_PUBLIC_*` config | **Not provided**                                           |

### Proposed env placeholders (future)

```env
# STT
DEEPGRAM_API_KEY=
SONIOX_API_KEY=

# LLM
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# TTS (already expected by ethenTts.ts)
ELEVENLABS_API_KEY=
CARTESIA_API_KEY=
OPENAI_TTS_API_KEY=
AZURE_TTS_API_KEY=
AZURE_TTS_REGION=
DEEPGRAM_TTS_API_KEY=

# LiveKit (proposed)
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

---

## 5. Implementation Sequence (Proposed)

```
Job A: Browser microphone capture + SpeechRecognition STT → text in chat
  - Files: components/ethen/useEthenMic.ts (new)
  - No server changes needed
  - Falls back to text input if SpeechRecognition unavailable

Job B: Server-side streaming STT (Deepgram/Soniox)
  - Files: lib/ethen/ethenStt.ts (new), app/api/ethen/stt/route.ts (new)
  - Replace browser STT with server WebSocket for accuracy

Job C: Replace static guide with streaming LLM
  - Files: lib/ethen/ethenLlm.ts (new), app/api/ethen/chat/route.ts (new)
  - SSE streaming response
  - Keep static guide as fallback

Job D: Streaming TTS response (chunked audio)
  - Files: lib/ethen/ethenTtsStream.ts (new)
  - Update useEthenSpeech for streaming play

Job E: VAD + endpointing
  - Files: components/ethen/useEthenVad.ts (new)
  - Auto-detect when user stops speaking

Job F: Interruption/barge-in state machine
  - Update ethenBehaviorTypes (interrupted/recovering transitions)
  - Wire user_speaking detection → interrupt TTS → trigger thinking

Job G: LiveKit migration (if needed)
  - Add @livekit dependencies
  - Replace custom pipeline with LiveKit agent
  - Multi-room support
```

---

## 6. State/Event Model Recommendation

### 6.1 EthenVoiceState

```typescript
type EthenVoiceState =
  | "inactive" // no voice session
  | "mic_requesting" // asking for mic permission
  | "mic_denied" // permission denied
  | "listening" // mic active, waiting for speech
  | "user_speaking" // VAD detects user speech
  | "processing" // STT complete, waiting for LLM
  | "responding" // TTS playing response
  | "interrupted" // user spoke while Ethen was responding
  | "error"; // unrecoverable error
```

### 6.2 EthenVoiceEvent

```typescript
type EthenVoiceEvent =
  | { type: "mic_permission"; granted: boolean }
  | { type: "user_speech_start" }
  | { type: "user_speech_end"; transcript: string; isFinal: boolean }
  | { type: "stt_partial"; text: string }
  | { type: "stt_final"; text: string }
  | { type: "llm_start" }
  | { type: "llm_token"; text: string }
  | { type: "llm_done"; fullText: string }
  | { type: "tts_start" }
  | { type: "tts_chunk"; audioBase64: string }
  | { type: "tts_done" }
  | { type: "interruption_detected" }
  | { type: "error"; message: string };
```

### 6.3 State machine wiring to existing Ethen states

| Voice State      | EthenBehavior State | Notes                                |
| ---------------- | ------------------- | ------------------------------------ |
| `inactive`       | `idle`              | Default, no voice session            |
| `mic_requesting` | `idle`              | UI shows permission prompt           |
| `mic_denied`     | `idle`              | Fall back to text-only               |
| `listening`      | `listening`         | Awaiting speech, subtle glow         |
| `user_speaking`  | `user_speaking`     | User has mic, avatar attentive       |
| `processing`     | `thinking`          | STT→LLM, thinking glow               |
| `responding`     | `speaking`          | TTS playing, mouth animating         |
| `interrupted`    | `interrupted`       | → `recovering` → back to `listening` |
| `error`          | `error`             | Show error in chat                   |

---

## 7. Latency/Observability Recommendation

### 7.1 Target metrics

| Metric                    | Target                   | Measurement                                               |
| ------------------------- | ------------------------ | --------------------------------------------------------- |
| STT first partial         | < 300ms                  | Timestamp from mic chunk → STT text event                 |
| STT final (end-of-speech) | < 500ms after user stops | Timestamp from VAD endpoint → final transcript            |
| LLM first token (TTFB)    | < 500ms                  | Timestamp from STT final → first SSE chunk                |
| TTS first audio           | < 1s                     | Timestamp from LLM first token → first audio chunk played |
| E2E perceived latency     | < 2s                     | User stops speaking → Ethen starts responding             |
| Interruption detection    | < 300ms                  | User starts speaking → TTS stops                          |

### 7.2 Captured events

```typescript
interface VoiceLatencyEvent {
  sessionId: string;
  micStartMs: number;
  sttFirstPartialMs: number;
  sttFinalMs: number;
  llmFirstTokenMs: number;
  llmDoneMs: number;
  ttsFirstChunkMs: number;
  ttsDoneMs: number;
  interrupted: boolean;
  interruptionCancelMs?: number;
  error?: string;
}
```

### 7.3 Implementation principle

Log all timestamps to `console.debug` during development, then route to a telemetry endpoint in production. Do not block the voice pipeline on telemetry.

---

## 8. Non-Scope

- Microphone capture: not implemented here
- STT provider integration: not implemented here
- Streaming LLM: not implemented here
- Streaming TTS: not implemented here
- LiveKit/WebRTC: not implemented here
- Interruption/barge-in: not implemented here
- VAD: not implemented here
- Provider credentials: not added here
- Billing/database/platform objects: not added here

---

## 9. Key Risks

1. **Browser `SpeechRecognition` is non-standard** — works in Chrome/Edge but not Firefox/Safari. Must have text fallback.
2. **AudioContext autoplay policy** — browsers require user gesture before AudioContext works. Plan mic button click as the gesture.
3. **TTS streaming is harder than TTS request/response** — most TTS providers support streaming but the current architecture buffers full audio. Streaming requires chunked HTTP or WebSocket.
4. **Interruption is the hardest part** — the existing `interrupted` → `recovering` state is wired but no pipeline logic connects user speech detection to TTS cancellation.
5. **No env file exists** — every provider integration requires a `.env` setup step before it will work.

---

## 10. Open Questions

- Should the initial STT use browser `SpeechRecognition` (free, Chrome-only) or Deepgram server-side (cost, works everywhere)?
- Should the LLM be the same provider as the text chat (static guide remains for text, LLM only for voice)?
- Should streaming TTS use the existing `/api/ethen/tts` route (modified for streaming) or a new route?
- Should the voice session be managed by a React Context or passed through props?
