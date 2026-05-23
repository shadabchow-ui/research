# GPU Serving Architecture — Product Specification

## Status: Specification / Research — not yet implemented

---

## 1. Purpose

Define the future backend architecture for Tavus-quality neural avatar rendering on GPU infrastructure. This is a specification document only — no GPU code, inference servers, Kubernetes manifests, WebRTC SFU, TURN infrastructure, or neural model implementations are included in the current frontend repo.

---

## 2. Strategic Position

GPU serving is a **Stage 9+ capability** per the Upcube execution plan. The correct sequence is:

```
Browser-rendered 3D Ethen (Stage 1–3)
→ Ethen live voice (Stage 3–4)
→ Live Avatar platform beta (Stage 5)
→ Studio Lite (Stage 6)
→ Interactive video pages (Stage 7)
→ Governance and enterprise (Stage 8)
→ Neural video benchmarks (Stage 9 start)
→ GPU serving infrastructure (Stage 9 continued)
```

**Do not build GPU serving first.** Browser-rendered Ethen runs on the user's device and avoids GPU video serving costs entirely. Neural video is reserved for premium replicas, high-end studio export, and enterprise on-prem options after product traction is proven.

Research-reported neural video candidates (not evaluated):

- Wav2Lip — lower GPU cost, lip-sync only
- MuseTalk — higher quality, real-time capable, GPU serving non-trivial
- LivePortrait — high-end, high GPU requirements
- SadTalker, Hallo-Live, LiveTalk, Digital-Avatar-ITRI — additional candidates

Neural video benchmark sequence: Wav2Lip → MuseTalk → LivePortrait + MuseTalk → LiveTalking / Digital-Avatar-ITRI → Hallo-Live / LiveTalk review.

---

## 3. Future Architecture Components

| Component                  | Responsibility                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GPUWorker**              | One or more concurrent avatar rendering sessions on a single GPU instance. Runs the neural video model, receives audio/viseme state, produces video frames.                            |
| **RendererSession**        | Matches one conversation to one GPU worker allocation. Contains region, status, model version, and timing metadata. Already typed in `lib/avatar-cloud/types.ts` as `RendererSession`. |
| **ModelCache**             | LRU cache of loaded and warmed neural models per GPU worker. Avoids reloading model weights between sessions. Keyed by `(modelType, version, personaId)`.                              |
| **WarmPool**               | Pre-allocated GPU workers kept in idle/warm state to absorb demand spikes without cold-start latency. Pool size scales with projected concurrent sessions.                             |
| **InferenceQueue**         | FIFO queue with priority tiers for renderer session requests when no warm worker is available. Sessions time out and fall back to browser 3D renderer.                                 |
| **RegionRouter**           | Routes `createRendererSession` requests to the nearest GPU region based on client latency, GPU availability, and cost. Supports fallback to secondary regions.                         |
| **WebRTCVideoPublisher**   | Accepts encoded H264 frames from a GPU worker and publishes them as a WebRTC video track to the session's media room. Handles simulcast, keyframe requests, and bandwidth adaptation.  |
| **H264Encoder**            | GPU-accelerated (NVENC, VAAPI, or AMF) H264 encoding of neural video frames. Produces low-latency bitstream suitable for WebRTC. Uses NAL unit framing.                                |
| **SessionMeter**           | Records per-session GPU seconds, encoded video seconds, and WebRTC metrics. Publishes billing events and feeds the observability pipeline.                                             |
| **CostEstimator**          | Computes estimated and actual cost per renderer session from GPU allocation duration, model type, region, and encoding overhead. Provides per-conversation and aggregate cost views.   |
| **ObservabilityCollector** | Aggregates metrics, traces, and logs from GPU workers, encoders, WebRTC publishers, and session routers. Exports to dashboard and alerting.                                            |

### Renderer Type Ladder

| Renderer Type   | Description                                                             | GPU Required        | Status            |
| --------------- | ----------------------------------------------------------------------- | ------------------- | ----------------- |
| `browser_3d`    | Client-side GLB/VRM rendering via Three.js/WebGL                        | No                  | Default (planned) |
| `neural_video`  | Server-side talking-head neural model (Wav2Lip, MuseTalk, LivePortrait) | Yes                 | Research          |
| `unreal_stream` | Unreal Engine / MetaHuman Pixel Streaming                               | Yes                 | Research          |
| `vendor_video`  | Third-party rendered video (e.g., Tavus, Synthesia API)                 | No (vendor-managed) | Not configured    |

---

## 4. Session Flow

### 4.1 Create Renderer Session

```
1. Client calls POST /v1/avatar-sessions/:id/renderer
   - Payload: { conversationId, personaId, replicaId, preferredRegion?, rendererType?, maxCostPerMinute? }

2. Server validates:
   - Conversation exists and is active
   - Persona is valid
   - Replica is valid and consent is active
   - Replica modelType is supported by the requested rendererType
   - Session token is valid and scoped

3. RegionRouter selects region:
   - Query nearest GPU region with available capacity
   - Fall back to secondary region if primary is full
   - Return error if no region available (client retries or falls back to browser 3D)

4. WarmPool / InferenceQueue allocation:
   - Try to claim a warm GPU worker
   - If no warm worker: queue the request with priority
   - If queue exceeds timeout: fail and suggest browser 3D fallback

5. GPUWorker initialization:
   - Provision GPU instance if auto-scaling triggers
   - Pull container image if not cached on node
   - Load neural model into GPU memory via ModelCache (if miss: download weights)
   - Initialize encoding pipeline (NVENC → H264)
   - Establish WebRTC peer connection to session media room

6. Return RendererSession:
   - { id, gpuWorkerId, region, status: "starting", startedAt }
   - Client polls GET /v1/renderer-sessions/:id until status → "active"
```

### 4.2 Active Rendering Loop

```
1. Audio pipeline produces:
   - Streaming STT partials / finals
   - TTS audio chunks
   - Viseme / blendshape events (from TTS or independent viseme predictor)

2. Viseme events published to GPU worker:
   - Format: { timestamp, visemeId, weight, audioLevel }
   - Transport: WebSocket or gRPC stream to GPU worker
   - Timing: batched every ~20ms for smooth animation

3. GPU worker per-frame loop (target 25–30 FPS):
   - Receive viseme event batch
   - Run neural model inference (audio → video frame)
   - Post-process frame (color correction, watermark overlay if enabled)
   - Encode frame via H264Encoder
   - Publish encoded NAL units to WebRTCVideoPublisher

4. WebRTC publisher:
   - Send video track to session media room
   - Handle simulcast layers (low/medium/high quality)
   - Respond to PLI (Picture Loss Indication) with keyframe
   - Adapt bitrate based on receiver-estimated bandwidth

5. Metrics collected continuously:
   - GPU inference latency per frame
   - Encoder latency
   - WebRTC RTT / jitter / packet loss
   - Frame rate (target vs actual)
   - Dropped frames

6. SessionMeter increments:
   - GPU active seconds (wall-clock time GPU worker is allocated)
   - Encoded video seconds (total video duration produced)
```

### 4.3 End / Release Session

```
1. Client or server triggers session end:
   - POST /v1/avatar-sessions/:id/end
   - Or: idle timeout (configurable, default 5 minutes of silence)
   - Or: error threshold exceeded

2. GPU worker cleanup:
   - Stop neural model inference
   - Flush and close encoder
   - Close WebRTC peer connection
   - Model stays in GPU memory (ModelCache retains for reuse)
   - GPU worker returns to WarmPool or shuts down

3. SessionMeter finalizes:
   - Total GPU seconds for session
   - Total encoded video seconds
   - CostEstimate computed and recorded

4. Audit log entry created:
   - Action: "renderer.session_ended"
   - Session duration, GPU seconds, region, model info

5. Data retention policy applied:
   - Session metrics: retained per configured policy
   - Encoded video: not stored (ephemeral live stream only)
   - Audit log: retained indefinitely per governance config
```

---

## 5. Scaling Concerns

### 5.1 Cold Start

| Concern                   | Mitigation                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| GPU instance provisioning | WarmPool keeps idle instances; auto-scaling triggers at 80% pool utilization                              |
| Container image pull      | Pre-cached on GPU node image; layer caching in container registry                                         |
| Model weight download     | ModelCache persists hot models across sessions; cold pull from S3/GCS/registry (1–5 GB, target <60s)      |
| CUDA / driver init        | WarmPool workers pre-initialize CUDA context at boot                                                      |
| First frame latency       | Benchmark target: <3s from `startRenderer` to first video frame (research-reported; not locally verified) |

### 5.2 Warm Pool Sizing

- **Baseline**: 0 warm workers (cold start on first session)
- **Dev/Staging**: 1–2 warm workers in single region
- **Early Production**: Pool = projected peak concurrent sessions + 20% buffer
- **Concurrency per GPU**: Not provided — depends on model complexity, resolution, and target frame rate. Research benchmarks needed.
- **Pool metrics**: warm workers allocated, warm workers idle, cold starts triggered, pool drain rate

### 5.3 Queue Limits

- **Max queue depth**: Configurable (default: 50 concurrent pending sessions)
- **Queue timeout per session**: Configurable (default: 30 seconds)
- **Timeout behavior**: Fail renderer allocation, client notified to fall back to `browser_3d`
- **Priority tiers**:
  - Tier 1 (enterprise SLA): skip queue, always allocate or fail fast
  - Tier 2 (paid): standard queue position
  - Tier 3 (free/trial): lowest priority, most likely to time out

### 5.4 Region Routing

- **Regions**: Not provided — depends on GPU cloud provider availability (AWS, GCP, Azure, Paperspace, RunPod)
- **Latency budget**: GPU region ≤50ms RTT from client for acceptable WebRTC performance
- **Fallback chain**: Primary region → secondary region → error (client falls back to browser 3D)
- **Data residency**: Future consideration — some enterprise customers may require in-region GPU processing

### 5.5 Fallback Strategy

```
Preferred: neural_video (GPU server rendering)
  → fallback: unreal_stream (GPU server rendering)
    → fallback: vendor_video (third-party via API)
      → fallback: browser_3d (client-side WebGL rendering)
```

Browser 3D rendering is the universal fallback — no GPU cost, works on any modern browser, and is the default for Ethen MVP.

### 5.6 Cost Estimation

**Per-session cost model (conceptual — not priced)**:

```
cost = (gpuCostPerSecond × activeGpuSeconds)
     + (encoderCostPerSecond × encodedVideoSeconds)
     + (networkEgressCostPerGB × egressGB)
     + (warmPoolIdleCost × idlePoolSeconds / activeSessions)
     + (modelCacheStorageCost)
```

**Example GPU instance types (not configured — list for reference)**:

| Provider   | Instance Type | GPU   | Estimated Cost/Hour |
| ---------- | ------------- | ----- | ------------------- |
| AWS        | g5.xlarge     | A10G  | Not provided        |
| AWS        | g4dn.xlarge   | T4    | Not provided        |
| GCP        | g2-standard-4 | L4    | Not provided        |
| RunPod     | A100-80GB     | A100  | Not provided        |
| Paperspace | A4000         | A4000 | Not provided        |

All cost estimates require benchmark data on model-specific GPU utilization, concurrency, and frame rate targets.

---

## 6. Safety and Governance Gates

### 6.1 Consent Enforcement

- **Custom replica requires active consent record** with `avatar_visual_replica` or `live_agent_use` scope
- **Voice clone requires active consent record** with `voice_clone` scope
- **Revoked consent immediately blocks** renderer session allocation
- **Governance check**: `POST /v1/avatar-sessions/:id/renderer` returns 403 if consent record is revoked, pending, or missing

### 6.2 Audit Trail

Every renderer session lifecycle event is logged:

| Event                | Action                     | Recorded Fields                                            |
| -------------------- | -------------------------- | ---------------------------------------------------------- |
| Session created      | `renderer.session_created` | sessionId, conversationId, replicaId, rendererType, region |
| GPU worker allocated | `renderer.gpu_allocated`   | gpuWorkerId, instanceType, region                          |
| Model loaded         | `renderer.model_loaded`    | modelType, modelVersion, cacheHit, loadTimeMs              |
| First frame sent     | `renderer.first_frame`     | latencyMs from session start                               |
| Session ended        | `renderer.session_ended`   | durationSeconds, gpuSeconds, encodedVideoSeconds, cost     |
| Session error        | `renderer.session_error`   | errorCode, errorMessage, gpuWorkerId                       |

### 6.3 Watermarking / Provenance (Future)

- Visual watermark overlay: optional per embedding config
- Audio fingerprint: optional per voice track
- C2PA content credentials: planned for studio video export
- Watermarking mode stored in `WatermarkingStatus` (from `governance.ts`)

### 6.4 Data Retention Compliance

- Encoded video: **ephemeral** — not stored after session ends (live stream only)
- Session metrics: retained per `DataRetentionMode.metricsRetention`
- Audit log events: retained per `DataRetentionMode.auditLogRetention`
- GPU worker disk: tmpfs/ephemeral — no session data persists on worker after release

---

## 7. Observability

### 7.1 Core Metrics

| Metric                      | Unit  | Description                                               |
| --------------------------- | ----- | --------------------------------------------------------- |
| `gpu_allocation_latency_ms` | ms    | Time from renderer session request to GPU worker assigned |
| `time_to_first_frame_ms`    | ms    | Time from session start to first video frame sent         |
| `frame_rate_actual`         | fps   | Actual frames produced per second                         |
| `frame_rate_target`         | fps   | Target frame rate (typically 25 or 30)                    |
| `frames_dropped`            | count | Frames skipped or too late to encode                      |
| `inference_latency_ms`      | ms    | Neural model inference time per frame                     |
| `encoder_latency_ms`        | ms    | H264 encoding time per frame                              |
| `webrtc_rtt_ms`             | ms    | WebRTC round-trip time                                    |
| `webrtc_jitter_ms`          | ms    | WebRTC receive jitter                                     |
| `webrtc_packet_loss_pct`    | %     | WebRTC packet loss percentage                             |
| `gpu_active_seconds`        | s     | Wall-clock seconds GPU worker is allocated                |
| `encoded_video_seconds`     | s     | Total video duration produced                             |
| `warm_pool_idle_workers`    | count | Warm workers not currently in use                         |
| `model_cache_hit_rate`      | %     | Requests served from model cache vs cold load             |
| `session_errors_total`      | count | Renderer session errors by error code                     |

### 7.2 Distributed Tracing

- **Trace context**: Propagated from API gateway → region router → GPU worker → WebRTC publisher
- **Span types**: `create_renderer_session`, `gpu_inference_frame`, `encode_frame`, `webrtc_send`
- **Attributes**: sessionId, conversationId, replicaId, modelType, region, gpuWorkerId

### 7.3 Alerting Rules (Recommended)

| Alert                              | Threshold                    | Severity |
| ---------------------------------- | ---------------------------- | -------- |
| GPU allocation latency > threshold | P95 > 5s for 5 minutes       | Warning  |
| Time to first frame > threshold    | P95 > 10s for 5 minutes      | Warning  |
| Frame rate below target            | Actual < 20fps for 2 minutes | Warning  |
| WebRTC packet loss                 | > 5% for 2 minutes           | Warning  |
| Session error rate                 | > 2% for 5 minutes           | Critical |
| Warm pool exhausted                | 0 warm workers for 2 minutes | Warning  |
| Model cache miss rate spike        | > 30% for 5 minutes          | Info     |

All thresholds are recommended defaults — not calibrated against production data.

---

## 8. Recommended Sequencing

```
1. Keep browser 3D Ethen as default renderer (no GPU cost, no backend)
2. Ship Ethen live voice with browser rendering (Stage 3–4)
3. Ship Live Avatar platform beta with browser rendering (Stage 5)
4. Prove product traction with browser-rendered avatars
5. Run offline neural video benchmarks (Wav2Lip, MuseTalk, LivePortrait)
   - Measure quality, GPU requirements, concurrency, latency
6. Prototype GPU worker with single benchmark-winning model
7. Load test, measure cost per session, define pricing
8. Add neural video renderer option for paid/enterprise tiers
9. Scale GPU infrastructure: autoscaling, multi-region, warm pools

Vendor/partner fallback option:
  - Before building GPU infra: integrate Tavus, Synthesia, or another
    neural video vendor via API for premium rendering
  - Use vendor API as benchmark for cost/quality comparison
  - Transition to owned GPU infra when scale justifies investment
```

---

## 9. Constraints and Non-Goals

### 9.1 In Scope (This Spec)

- Future component taxonomy
- Session lifecycle flows
- Scaling and cost models
- Governance/safety integration points
- Observability metrics taxonomy

### 9.2 Out of Scope (Entire Frontend Repo)

- GPU code, inference servers, model weights
- Kubernetes manifests, Docker configurations
- WebRTC SFU, TURN/STUN server deployment
- LiveKit or any media server integration
- Cloud provider account configuration
- CI/CD for GPU infrastructure
- Any backend or infrastructure-as-code

---

## 10. Alignment with Existing Types

The frontend repo already types foundational concepts used by this spec:

| Frontend Type          | Location                             | GPU Serving Alignment                              |
| ---------------------- | ------------------------------------ | -------------------------------------------------- |
| `RendererSession`      | `lib/avatar-cloud/types.ts:243`      | Matches this spec's GPU worker allocation record   |
| `Replica.modelType`    | `lib/avatar-cloud/types.ts:76`       | `"neural_video"` designates GPU-rendered replicas  |
| `ConsentRecord`        | `lib/avatar-cloud/types.ts:188`      | Consent gate for custom replica rendering          |
| `GovernanceSnapshot`   | `lib/avatar-cloud/governance.ts:192` | Tracks `customReplicasAllowed`, `watermarkingMode` |
| `DataRetentionMode`    | `lib/avatar-cloud/governance.ts:90`  | Video/audio retention policies                     |
| `WebRTCQualityMetrics` | `lib/avatar-cloud/metrics.ts:88`     | Per-session WebRTC quality recording               |
| `TurnMetrics`          | `lib/avatar-cloud/metrics.ts:82`     | Per-turn latency and provider usage                |
| `CostBreakdown`        | `lib/avatar-cloud/metrics.ts:53`     | Per-session cost by provider                       |
| `AvatarSessionToken`   | `lib/avatar-cloud/types.ts:220`      | Scoped token for renderer session auth             |
| `Session`              | `lib/avatar-cloud/types.ts:117`      | Media room association (`mediaRoomId`, `provider`) |

---

## 11. Open Questions / Unknowns

| Question                                                         | Status                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Which neural video model wins the benchmark?                     | Not evaluated — requires offline testing                           |
| What is the actual concurrency per GPU instance type?            | Not provided — model-dependent                                     |
| What is the per-minute cost of neural video rendering?           | Not provided — depends on model, GPU, and region                   |
| Which cloud GPU provider is preferred?                           | Not provided — list neutrally: AWS, GCP, Azure, RunPod, Paperspace |
| Should Upcube build or buy WebRTC infrastructure?                | Not decided — LiveKit, Daily, or custom SFU are options            |
| What is the acceptable latency for a live avatar?                | Research-reported: WebRTC under 50ms; not verified                 |
| Will GPU workers use Kubernetes or a simpler orchestration?      | Not decided — depends on scale and team ops                        |
| Is offline batch rendering (studio video export) in scope?       | Yes, but separate from real-time GPU serving                       |
| How are model weights versioned, stored, and distributed?        | Not implemented — model registry / object storage candidates       |
| What is the data residency requirement for enterprise customers? | Not provided — product requirements needed                         |
