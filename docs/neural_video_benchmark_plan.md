# Neural Video Benchmark Plan

## Status: Research / Specification — not implemented

---

## 1. Purpose

This document defines a systematic benchmark plan for evaluating neural video rendering systems as candidates for future Tavus-quality avatar output in Upcube Avatar Cloud. No models have been installed, no weights have been downloaded, and no benchmarks have been run. This is the evaluation framework to use once GPU infrastructure and a benchmark lab are available.

Per the Upcube Avatar Cloud master strategy, neural video is a **later-stage investment** — after Ethen (browser 3D), Ethen Live (real-time voice), and the platform beta show product-market traction. This plan exists to ensure the evaluation is structured and defensible when the time comes.

---

## 2. Candidate Systems

The following systems were identified in the Exa Batch 1 technical synthesis research. Characteristics below are **research-reported** — not locally verified.

| #   | System                    | Type                  | Research-reported profile                                                                                                                                                                           |
| --- | ------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Wav2Lip**               | Lip-sync only         | Fast baseline, lower GPU requirements, basic lip-sync video. Older visual quality, limited expression. Best as benchmark floor.                                                                     |
| 2   | **MuseTalk**              | Lip-sync + identity   | Stronger lip-sync than Wav2Lip, better visual fidelity. Real-time inference possible under right conditions. Identity preservation can drift, jitter/artifacts can appear. GPU serving non-trivial. |
| 3   | **LivePortrait**          | Expression + lip-sync | Expression transfer combined with lip-sync. Higher quality experiments but more moving parts and harder deployment.                                                                                 |
| 4   | **Hallo-Live**            | Streaming avatar gen  | Next-generation streaming avatar generation. Higher complexity, less mature tooling. Future research candidate.                                                                                     |
| 5   | **LiveTalk**              | Streaming avatar gen  | Real-time-style talking head. Similar tier to Hallo-Live.                                                                                                                                           |
| 6   | **Digital-Avatar-ITRI**   | Research system       | Academic talking-head system. Research-grade, not production-hardened.                                                                                                                              |
| 7   | **LiveTalking**           | Streaming avatar gen  | Real-time talking head. Gaze and head motion included.                                                                                                                                              |
| 8   | **Vendor APIs / Partner** | Commercial            | Tavus, D-ID, HeyGen, Synthesia. Per-minute or per-video pricing. Production-hardened but limits platform ownership.                                                                                 |

Additional candidates may be added as the research landscape evolves. New models (Sora, VASA-1, etc.) should be evaluated under the same framework.

---

## 3. Evaluation Criteria

Each candidate is evaluated on a 1–5 scale (1 = fails, 5 = exceeds) across 14 dimensions. Criteria marked `*` are gating — a score below 3 disqualifies the candidate for production consideration.

### 3.1 Visual Quality

| Dimension                           | Description                                                                                 | Gate? |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ----- |
| **Visual realism**                  | Photographic fidelity, skin rendering, lighting response.                                   | No    |
| **Identity consistency**            | How well the output preserves the source replica identity over time and across expressions. | \*    |
| **Lip-sync quality**                | Phoneme/viseme alignment accuracy. Measured via LSE-D / LSE-C or subjective scoring.        | \*    |
| **Temporal stability**              | Frame-to-frame coherence. Jitter, flicker, and artifact frequency.                          | No    |
| **Expression / gaze / head motion** | Natural facial expression range, eye movement, head rotation, idle animation.               | No    |

### 3.2 Performance

| Dimension                   | Description                                                                             | Gate? |
| --------------------------- | --------------------------------------------------------------------------------------- | ----- |
| **Latency (per frame)**     | End-to-end: audio frame in → video frame out. Target <100ms for real-time conversation. | \*    |
| **FPS (sustained)**         | Frames per second under continuous load. Target ≥25 FPS for real-time.                  | \*    |
| **GPU requirement**         | Minimum GPU model, VRAM, and CUDA version. Track T4 / A10G / A100 / H100 tiers.         | No    |
| **Concurrency**             | How many simultaneous streams per GPU. Cost-efficiency driver.                          | No    |
| **Cold start time**         | Time from model load to first frame. Includes weight loading, compilation.              | No    |
| **WebRTC stream readiness** | Can the model output be piped into a WebRTC track without additional encoding delay?    | No    |

### 3.3 Operational

| Dimension                     | Description                                                                           | Gate? |
| ----------------------------- | ------------------------------------------------------------------------------------- | ----- |
| **Cost per minute / session** | Estimated GPU-seconds × unit cost per stream. Cost model must be viable at scale.     | No    |
| **Safety / consent fit**      | Does the system support or hinder watermarking, C2PA, consent verification, takedown? | \*    |
| **Licensing / IP risk**       | Open-source license terms, patent exposure, training-data provenance risk.            | No    |
| **Production complexity**     | Model serving infrastructure, monitoring, failover, versioning, observability.        | No    |

### 3.4 Scoring rubric

| Score | Label     | Description                                                   |
| ----- | --------- | ------------------------------------------------------------- |
| 1     | Fails     | Does not meet minimum viable threshold.                       |
| 2     | Poor      | Significant gaps, unlikely to close without major investment. |
| 3     | Adequate  | Meets minimum threshold with known trade-offs.                |
| 4     | Good      | Solid across most dimensions with acceptable trade-offs.      |
| 5     | Excellent | Industry-leading on this dimension.                           |

---

## 4. Benchmark Phases

Benchmarks should be run sequentially. A candidate must pass Phase N before advancing to Phase N+1.

### Phase 1: Desktop / Offline Clip Test

- **Environment**: Single GPU workstation, offline inference.
- **Input**: 10–30 second audio clips + source portrait images.
- **Output**: Recorded video clips.
- **Measured**: Visual realism, identity consistency, lip-sync quality (LSE-D/LSE-C), temporal stability, expression quality.
- **Pass**: ≥3 on all visual quality dimensions, ≥3 on lip-sync.

### Phase 2: GPU Inference Performance Test

- **Environment**: Cloud GPU instance (T4 or A10G minimum).
- **Input**: 60-second continuous audio stream.
- **Output**: Streamed video frames, latency histogram, FPS over time.
- **Measured**: Latency (P50, P95, P99), FPS sustained, GPU memory usage, cold start time.
- **Pass**: Latency P95 <200ms, FPS ≥25 sustained, VRAM fits within target GPU tier.

### Phase 3: Long Conversation Stability Test

- **Environment**: Cloud GPU with 5-minute continuous sessions.
- **Input**: Simulated conversation audio (alternating silence and speech).
- **Output**: 5-minute video stream, drift measurements, crash/stall log.
- **Measured**: Identity drift over time, artifact accumulation, memory leak detection, crash frequency.
- **Pass**: Zero crashes, identity drift within acceptable threshold, no progressive quality degradation.

### Phase 4: WebRTC Streaming Integration Test

- **Environment**: Full pipeline — STT → LLM → TTS → Neural Renderer → WebRTC → browser.
- **Input**: Real-time conversation audio from microphone.
- **Output**: WebRTC video track in a browser.
- **Measured**: End-to-end audio-in to video-out latency, stream bitrate, packet loss resilience, reconnection behavior.
- **Pass**: End-to-end latency <1.5s (P95), stream stable for 10+ minute sessions, graceful degradation on packet loss.

### Phase 5: Safety / Consent Gate (pre-production)

- **Requirement**: The selected neural video system must integrate with Upcube's governance controls before any user replica goes live.
- **Checks**: Consent record verification, watermarking compatibility, C2PA content credential path, replica revocation within system, takedown request process.
- **Pass**: All governance checks pass. No user replicas allowed without Phase 5 completion.

---

## 5. Build / Buy / Partner / Defer Framework

### 5.1 Options

| Path        | Description                                                          | When to choose                                                                                                         |
| ----------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Build**   | Deploy and operate an open-source model as owned infrastructure.     | Candidate scores 4+ on all gating criteria, licensing is clean, team has ML ops capability.                            |
| **Buy**     | License a vendor API (Tavus, D-ID, HeyGen). Pay per minute/video.    | Fastest time to market. Acceptable for prototypes and MVPs. Limits long-term margins and platform ownership.           |
| **Partner** | Co-develop with a model provider or research lab. Share costs/risks. | Candidate is promising but not yet production-hardened. Partner provides ops expertise.                                |
| **Defer**   | Wait. Do not invest in neural video yet.                             | Current business does not yet require neural video. Browser 3D is sufficient. This is the recommended default for now. |

### 5.2 Recommended Decision (per current strategy)

**Defer.** Neural video rendering should not be the first engineering bet for Upcube Avatar Cloud.

The recommended sequence is:

1. **Phase 1–3**: Ethen browser 3D avatar + behavior engine (built)
2. **Phase 4–5**: Real-time voice via LiveKit + STT/LLM/TTS pipeline
3. **Phase 6–8**: Platform beta with browser 3D rendering, analytics, governance
4. **After traction**: Evaluate neural video candidates using this benchmark plan

Neural video requires expensive GPU inference infrastructure ($0.50–$2.00+ per session by research estimates), specialised ML ops teams, and production model serving. Ethen's browser 3D path avoids these costs entirely while building the platform foundation.

### 5.3 When to revisit

Re-evaluate the build/buy/partner/defer decision when:

- Ethen browser 3D is live and serving real users
- Platform beta has measurable usage (1000+ sessions/month)
- Customer demand for photorealism exceeds what browser 3D delivers
- GPU inference costs have dropped (track GPU cloud pricing quarterly)
- A candidate model scores 4+ on all gating criteria in Phase 1–3 benchmarks
- Consent/safety infrastructure (governance center modules) is active

---

## 6. GPU / Cost Questions (unanswered)

The following must be answered before committing to any neural video build:

| Question                                                       | Current status                    |
| -------------------------------------------------------------- | --------------------------------- |
| Cloud GPU provider preference (AWS / GCP / Azure / CoreWeave)? | not provided                      |
| Target GPU tier (T4 / A10G / A100 / H100)?                     | not provided                      |
| Estimated sessions per month at launch?                        | not provided                      |
| Target cost per session for neural rendering?                  | not provided                      |
| Cold-start tolerance (pre-warmed instances or on-demand)?      | not provided                      |
| Multi-region GPU deployment required?                          | not provided                      |
| Max acceptable end-to-end latency (audio in → video out)?      | ≤1.5s P95 (target, not validated) |
| GPU budget for benchmark phase?                                | not provided                      |
| Preference for managed GPU service vs. self-managed?           | not provided                      |

---

## 7. Licensing / IP Risk (per candidate, research-reported only)

| Candidate           | License (research-reported) | IP risk notes                                                                       |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| Wav2Lip             | MIT-like (varies by fork)   | Low risk. Widely used for research. Training data provenance not fully audited.     |
| MuseTalk            | Apache 2.0 / research       | Moderate risk. Training data and identity sources need audit before commercial use. |
| LivePortrait        | Research / custom           | Risk unknown. Check specific fork and training data compliance.                     |
| Hallo-Live          | Research / custom           | Risk unknown. Newer system with unverified licensing chain.                         |
| LiveTalk            | Research / custom           | Risk unknown.                                                                       |
| Digital-Avatar-ITRI | Academic                    | Verify commercial-use terms with ITRI.                                              |
| LiveTalking         | Research / custom           | Risk unknown.                                                                       |
| Vendor APIs         | Commercial                  | Low licensing risk. Covered by vendor agreement. Higher per-unit cost.              |

**Critical rule**: No candidate whose training data provenance cannot be verified should be used for production replicas. This includes models trained on datasets with unclear consent for faces/voices.

---

## 8. Alignment with Platform Architecture

Neural video rendering fits into Upcube's rendering layer:

```text
Rendering Layer
├── Browser 3D (React Three Fiber + GLB)   ← current
├── VRM 3D (browser-based)                  ← planned
├── Neural Video (Tavus-quality)            ← future (this plan)
├── Vendor Video (D-ID / HeyGen / Tavus)    ← possible bridge
└── Unreal / MetaHuman Stream               ← premium future option
```

The neural video renderer would replace or sit alongside the browser 3D renderer for sessions requiring photorealism. The platform object model already supports this via `Replica.modelType: "neural_video"` and `RendererSession.rendererType: "neural_video"`.

---

## 9. Integration Points (speculative — not built)

When a neural video candidate is selected and benchmarked:

1. **Model serving**: REST or gRPC endpoint accepting audio chunks and returning video frames.
2. **WebRTC bridge**: Video frames → encoded track → LiveKit SFU → browser.
3. **Session orchestration**: `RendererSession` object tracks GPU worker, stream URL, status.
4. **Governance hooks**: Consent check before session start, watermarking in rendering pipeline, C2PA manifest generation.
5. **Observability**: Per-frame latency, GPU utilization, stream bitrate, artifact detection — all logged as `AvatarEvent` types.

---

## 10. Document Maintenance

- **Owner**: Avatar Cloud engineering (not assigned — research phase)
- **Review cadence**: Quarterly, or when a new candidate model is published
- **Version**: v1.0 — initial research/spec
- **Last updated**: May 2026

---

## Appendix A: Benchmark Lab Requirements (not configured)

| Requirement                                         | Status         |
| --------------------------------------------------- | -------------- |
| GPU workstation or cloud GPU instance               | not configured |
| Model weight storage (HuggingFace, S3, or local)    | not configured |
| Benchmark harness (scripted audio/video test suite) | not built      |
| WebRTC test rig (STUN/TURN, signaling server)       | not configured |
| Latency measurement tooling                         | not built      |
| Identity consistency scoring tool                   | not built      |
| Consent/safety integration test harness             | not built      |

## Appendix B: Research References

- Exa Batch 1 Technical Synthesis: neural video candidates and GPU serving (repo: `upcube_avatar_cloud_exa_batch_1_technical_synthesis.md`)
- Remaining 45% Research: GPU/SFU/replica infrastructure (repo: `upcube_avatar_cloud_remaining_45_percent_research_synthesis.md`)
- Tavus Architecture Research: WebRTC + safety layers (repo: `tavus_clone_voice_webrtc_infrastructure_safety_research.md`)
- Master Source of Truth: neural video as Phase 11 (repo: `upcube_avatar_cloud_master_source_of_truth.md`)
