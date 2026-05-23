import type { Metadata } from "next";
import { MetricCard } from "components/avatar-cloud/MetricCard";
import { ProviderStatus } from "components/avatar-cloud/ProviderStatus";
import type { AnalyticsColumn } from "components/avatar-cloud/AnalyticsTable";
import { AnalyticsTable } from "components/avatar-cloud/AnalyticsTable";
import {
  SAMPLE_ETHEN_SESSION,
  SAMPLE_CALL_METRICS,
  SAMPLE_PROVIDER_USAGE,
  SAMPLE_SESSION_QUALITY_SUMMARY,
  SAMPLE_COST_BREAKDOWN,
  SAMPLE_LATENCY_P50,
  SAMPLE_LATENCY_P95,
  SAMPLE_COST_BY_PROVIDER,
  estimateSessionCost,
} from "lib/avatar-cloud/metrics";

export const metadata: Metadata = {
  title: "Usage & Quality — Console",
  description: "Upcube Avatar Cloud usage, quality, and cost dashboard (demo).",
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatUsd(value: number): string {
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

const totalMinutes =
  (SAMPLE_ETHEN_SESSION.durationSeconds + SAMPLE_CALL_METRICS.durationSeconds) /
  60;

const costDetailColumns: AnalyticsColumn[] = [
  { key: "service", label: "Service" },
  { key: "usage", label: "Usage", className: "text-right" },
  { key: "rate", label: "Demo Rate", className: "text-right" },
  { key: "cost", label: "Est. Cost", className: "text-right" },
];

const costDetails = [
  {
    service: "STT",
    usage: `${SAMPLE_PROVIDER_USAGE.sttSeconds}s`,
    rate: SAMPLE_COST_BY_PROVIDER.deepgram_stt,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.sttUsd),
  },
  {
    service: "TTS",
    usage: `${SAMPLE_PROVIDER_USAGE.ttsCharacters} chars`,
    rate: SAMPLE_COST_BY_PROVIDER.elevenlabs_tts,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.ttsUsd),
  },
  {
    service: "LLM",
    usage: `${SAMPLE_PROVIDER_USAGE.llmInputTokens} in / ${SAMPLE_PROVIDER_USAGE.llmOutputTokens} out`,
    rate: SAMPLE_COST_BY_PROVIDER.openai_llm_gpt4o_mini,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.llmUsd),
  },
  {
    service: "WebRTC",
    usage: "0 min",
    rate: SAMPLE_COST_BY_PROVIDER.livekit_webrtc,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.webrtcUsd),
  },
  {
    service: "GPU (future)",
    usage: "0 sec",
    rate: SAMPLE_COST_BY_PROVIDER.gpu_rendering,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.gpuUsd),
  },
  {
    service: "Storage",
    usage: "0 B",
    rate: SAMPLE_COST_BY_PROVIDER.storage,
    cost: formatUsd(SAMPLE_COST_BREAKDOWN.storageUsd),
  },
];

const agentColumns: AnalyticsColumn[] = [
  { key: "name", label: "Agent" },
  { key: "turns", label: "Turns", className: "text-right" },
  { key: "latency", label: "Avg Latency", className: "text-right" },
  { key: "cost", label: "Est. Cost", className: "text-right" },
  { key: "status", label: "Status" },
];

const agentRows = [
  {
    name: "Ethen Guide",
    turns: String(SAMPLE_ETHEN_SESSION.turnCount),
    latency: formatLatency(SAMPLE_ETHEN_SESSION.latencyP50.totalMs),
    cost: formatUsd(SAMPLE_ETHEN_SESSION.cost.totalUsd),
    status: "active" as const,
  },
  {
    name: "Website Concierge",
    turns: String(SAMPLE_CALL_METRICS.turnCount),
    latency: formatLatency(SAMPLE_CALL_METRICS.latencyP50.totalMs),
    cost: formatUsd(SAMPLE_CALL_METRICS.cost.totalUsd),
    status: "draft" as const,
  },
  {
    name: "Support Agent",
    turns: "—",
    latency: "—",
    cost: "—",
    status: "template" as const,
  },
  {
    name: "Training Coach",
    turns: "—",
    latency: "—",
    cost: "—",
    status: "template" as const,
  },
];

export default function UsagePage() {
  const estimatedCost = estimateSessionCost(SAMPLE_PROVIDER_USAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold text-avatar-text">
            Usage &amp; Quality
          </h1>
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            demo
          </span>
        </div>
        <p className="text-lg text-avatar-text-muted">
          Aggregated usage, cost estimates, quality metrics, and provider
          readiness. All data shown is demo/sample — production metering is not
          connected yet.
        </p>
      </div>

      {/* Usage Overview */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Usage Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Sessions"
            value="28"
            subtitle="demo this period"
            demo
          />
          <MetricCard
            title="Conversation Minutes"
            value={formatDuration(
              SAMPLE_ETHEN_SESSION.durationSeconds +
                SAMPLE_CALL_METRICS.durationSeconds,
            )}
            subtitle="across all agents"
            demo
          />
          <MetricCard
            title="Rendered Video Minutes"
            value="0"
            subtitle="Studio not yet active"
            demo
          />
          <MetricCard
            title="Active Agents"
            value="1"
            subtitle="Ethen Guide (published)"
            demo
          />
        </div>
      </section>

      {/* Cost Estimate */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Cost Estimate
        </h2>
        <div className="mb-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            title="STT"
            value={formatUsd(SAMPLE_COST_BREAKDOWN.sttUsd)}
            demo
          />
          <MetricCard
            title="TTS"
            value={formatUsd(SAMPLE_COST_BREAKDOWN.ttsUsd)}
            demo
          />
          <MetricCard
            title="LLM"
            value={formatUsd(SAMPLE_COST_BREAKDOWN.llmUsd)}
            demo
          />
          <MetricCard
            title="WebRTC"
            value={formatUsd(SAMPLE_COST_BREAKDOWN.webrtcUsd)}
            demo
          />
          <MetricCard
            title="GPU"
            value={formatUsd(SAMPLE_COST_BREAKDOWN.gpuUsd)}
            demo
          />
          <MetricCard
            title="Total"
            value={formatUsd(estimatedCost.totalUsd)}
            subtitle="per session avg"
            demo
          />
        </div>
        <AnalyticsTable columns={costDetailColumns} demo>
          {costDetails.map((row) => (
            <tr
              key={row.service}
              className="transition-colors hover:bg-avatar-surface-hover"
            >
              <td className="px-5 py-3 text-sm font-medium text-avatar-text">
                {row.service}
              </td>
              <td className="px-5 py-3 text-right text-xs text-avatar-text-muted tabular-nums">
                {row.usage}
              </td>
              <td className="max-w-[260px] truncate px-5 py-3 text-right text-xs text-avatar-text-dim tabular-nums">
                {row.rate}
              </td>
              <td className="px-5 py-3 text-right font-mono text-xs text-avatar-text-muted tabular-nums">
                {row.cost}
              </td>
            </tr>
          ))}
        </AnalyticsTable>
      </section>

      {/* Quality */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">Quality</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Avg Latency (P50)"
            value={formatLatency(SAMPLE_LATENCY_P50.totalMs)}
            subtitle="end to first audio"
            demo
          />
          <MetricCard
            title="P95 Latency"
            value={formatLatency(SAMPLE_LATENCY_P95.totalMs)}
            subtitle="end to first audio"
            demo
          />
          <MetricCard
            title="Fallback Rate"
            value={`${SAMPLE_SESSION_QUALITY_SUMMARY.fallbackCount}/${SAMPLE_SESSION_QUALITY_SUMMARY.turnCount}`}
            subtitle={`${SAMPLE_SESSION_QUALITY_SUMMARY.fallbackCount} of ${SAMPLE_SESSION_QUALITY_SUMMARY.turnCount} turns`}
            demo
          />
          <MetricCard
            title="Interruptions"
            value={String(SAMPLE_SESSION_QUALITY_SUMMARY.interruptionCount)}
            subtitle="per session"
            demo
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="TTS Success"
            value={formatPercent(SAMPLE_SESSION_QUALITY_SUMMARY.ttsSuccessRate)}
            subtitle="demo sample"
            demo
          />
          <MetricCard
            title="STT Success"
            value={formatPercent(SAMPLE_SESSION_QUALITY_SUMMARY.sttSuccessRate)}
            subtitle="demo sample"
            demo
          />
          <MetricCard
            title="LLM Success"
            value={formatPercent(SAMPLE_SESSION_QUALITY_SUMMARY.llmSuccessRate)}
            subtitle="demo sample"
            demo
          />
          <MetricCard
            title="Errors"
            value={String(SAMPLE_SESSION_QUALITY_SUMMARY.errorCount)}
            subtitle="demo sample"
            demo
          />
        </div>
      </section>

      {/* Provider Readiness */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Provider Readiness
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProviderStatus
            name="STT"
            provider={SAMPLE_ETHEN_SESSION.sttProvider}
            configured={SAMPLE_ETHEN_SESSION.sttProvider !== "none"}
          />
          <ProviderStatus
            name="TTS"
            provider={SAMPLE_ETHEN_SESSION.ttsProvider}
            configured={SAMPLE_ETHEN_SESSION.ttsProvider !== "none"}
          />
          <ProviderStatus
            name="LLM"
            provider={SAMPLE_ETHEN_SESSION.llmProvider}
            configured={SAMPLE_ETHEN_SESSION.llmProvider !== "none"}
          />
          <ProviderStatus
            name="WebRTC"
            provider={SAMPLE_ETHEN_SESSION.transportProvider}
            configured={SAMPLE_ETHEN_SESSION.transportProvider !== "none"}
          />
        </div>
      </section>

      {/* Agent Performance */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Agent Performance
        </h2>
        <AnalyticsTable columns={agentColumns} demo>
          {agentRows.map((row) => (
            <tr
              key={row.name}
              className="transition-colors hover:bg-avatar-surface-hover"
            >
              <td className="px-5 py-3 text-sm font-medium text-avatar-text">
                {row.name}
              </td>
              <td className="px-5 py-3 text-right text-xs text-avatar-text-muted tabular-nums">
                {row.turns}
              </td>
              <td className="px-5 py-3 text-right text-xs text-avatar-text-muted tabular-nums">
                {row.latency}
              </td>
              <td className="px-5 py-3 text-right font-mono text-xs text-avatar-text-muted tabular-nums">
                {row.cost}
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.status === "active"
                      ? "bg-avatar-success-subtle text-avatar-success"
                      : row.status === "draft"
                        ? "bg-avatar-info-subtle text-avatar-info"
                        : "bg-avatar-accent-subtle text-avatar-accent"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.status === "active"
                        ? "bg-avatar-success"
                        : row.status === "draft"
                          ? "bg-avatar-info"
                          : "bg-avatar-accent"
                    }`}
                  />
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </AnalyticsTable>
      </section>

      {/* Limitations */}
      <section className="rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-5">
        <h3 className="mb-2 text-sm font-semibold text-avatar-text-dim">
          Limitations
        </h3>
        <ul className="space-y-1 text-xs text-avatar-text-dim">
          <li>
            • Production metering is not connected yet. All usage and cost data
            shown is demo/sample.
          </li>
          <li>
            • Provider pricing uses placeholder estimates from
            lib/avatar-cloud/metrics.ts.
          </li>
          <li>
            • Rendered video minutes, WebRTC session time, and GPU seconds are
            zero — these services are not active.
          </li>
          <li>• No database, auth, Stripe, or billing enforcement active.</li>
          <li>
            • Agent performance data for Support Agent and Training Coach is
            placeholder — these agents are templates only.
          </li>
        </ul>
      </section>
    </div>
  );
}
