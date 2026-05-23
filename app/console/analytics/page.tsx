import type { Metadata } from "next";
import { MetricCard } from "components/avatar-cloud/MetricCard";
import {
  AnalyticsTable,
  type AnalyticsColumn,
} from "components/avatar-cloud/AnalyticsTable";
import { ProviderStatus } from "components/avatar-cloud/ProviderStatus";
import {
  SAMPLE_ETHEN_SESSION,
  SAMPLE_COST_BREAKDOWN,
  SAMPLE_LATENCY_P50,
  SAMPLE_CALL_METRICS,
  SAMPLE_SESSION_QUALITY_SUMMARY,
  SAMPLE_PROVIDER_USAGE,
  estimateSessionCost,
} from "lib/avatar-cloud/metrics";
import type {
  SttProviderName,
  TtsProviderName,
  LlmProviderName,
} from "lib/avatar-cloud/metrics";

export const metadata: Metadata = {
  title: "Analytics — Console",
  description: "Upcube Avatar Cloud analytics dashboard (demo).",
};

const SECONDS_PER_MINUTE = 60;

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = Math.round(seconds % SECONDS_PER_MINUTE);
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

function providerStatusLabel(provider: string): string {
  if (provider === "none") return "none";
  if (provider === "static") return "static (local)";
  return provider;
}

function providerConfigured(provider: string): boolean {
  return provider !== "none" && provider !== "not_configured";
}

const sessions = [
  {
    id: "demo_ethen_session_001",
    agent: "Ethen Guide",
    duration: formatDuration(SAMPLE_ETHEN_SESSION.durationSeconds),
    status: "active" as const,
    estimatedCost: formatUsd(SAMPLE_ETHEN_SESSION.cost.totalUsd),
    latency: formatLatency(SAMPLE_ETHEN_SESSION.latencyP50.totalMs),
  },
  {
    id: "demo_session_001",
    agent: "Ethen Guide",
    duration: formatDuration(SAMPLE_CALL_METRICS.durationSeconds),
    status: "active" as const,
    estimatedCost: formatUsd(SAMPLE_CALL_METRICS.cost.totalUsd),
    latency: formatLatency(SAMPLE_CALL_METRICS.latencyP50.totalMs),
  },
];

const tableColumns: AnalyticsColumn[] = [
  { key: "session", label: "Session" },
  { key: "agent", label: "Agent" },
  { key: "duration", label: "Duration", className: "text-right" },
  { key: "status", label: "Status" },
  { key: "cost", label: "Est. Cost", className: "text-right" },
  { key: "latency", label: "P50 Latency", className: "text-right" },
];

export default function AnalyticsPage() {
  const estimatedCost = estimateSessionCost(SAMPLE_PROVIDER_USAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold text-avatar-text">Analytics</h1>
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            demo
          </span>
        </div>
        <p className="text-lg text-avatar-text-muted">
          Session metrics, latency breakdowns, and cost estimates. All data
          shown is demo/sample — production telemetry is not connected yet.
        </p>
      </div>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Sessions"
            value={String(sessions.length)}
            subtitle="demo this period"
            demo={true}
          />
          <MetricCard
            title="Conversation Minutes"
            value={formatDuration(
              SAMPLE_ETHEN_SESSION.durationSeconds +
                SAMPLE_CALL_METRICS.durationSeconds,
            )}
            subtitle="total across sessions"
            demo={true}
          />
          <MetricCard
            title="Avg Latency (P50)"
            value={formatLatency(SAMPLE_LATENCY_P50.totalMs)}
            subtitle="user speech end to avatar start"
            demo={true}
          />
          <MetricCard
            title="Est. Cost"
            value={formatUsd(estimatedCost.totalUsd)}
            subtitle={`STT ${SAMPLE_PROVIDER_USAGE.sttSeconds}s · TTS ${SAMPLE_PROVIDER_USAGE.ttsCharacters}ch`}
            demo={true}
          />
        </div>
      </section>

      {/* Quality */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">Quality</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="TTS Success"
            value={formatPercent(SAMPLE_SESSION_QUALITY_SUMMARY.ttsSuccessRate)}
            demo={true}
          />
          <MetricCard
            title="STT Success"
            value={formatPercent(SAMPLE_SESSION_QUALITY_SUMMARY.sttSuccessRate)}
            demo={true}
          />
          <MetricCard
            title="Fallback Rate"
            value={`${SAMPLE_SESSION_QUALITY_SUMMARY.fallbackCount}/${SAMPLE_SESSION_QUALITY_SUMMARY.turnCount}`}
            subtitle={`${SAMPLE_SESSION_QUALITY_SUMMARY.fallbackCount} of ${SAMPLE_SESSION_QUALITY_SUMMARY.turnCount} turns`}
            demo={true}
          />
          <MetricCard
            title="Interruptions"
            value={String(SAMPLE_SESSION_QUALITY_SUMMARY.interruptionCount)}
            demo={true}
          />
        </div>
      </section>

      {/* Provider Status */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Provider Status
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProviderStatus
            name="STT"
            provider={providerStatusLabel(SAMPLE_ETHEN_SESSION.sttProvider)}
            configured={providerConfigured(SAMPLE_ETHEN_SESSION.sttProvider)}
          />
          <ProviderStatus
            name="TTS"
            provider={providerStatusLabel(SAMPLE_ETHEN_SESSION.ttsProvider)}
            configured={providerConfigured(SAMPLE_ETHEN_SESSION.ttsProvider)}
          />
          <ProviderStatus
            name="LLM"
            provider={providerStatusLabel(SAMPLE_ETHEN_SESSION.llmProvider)}
            configured={providerConfigured(SAMPLE_ETHEN_SESSION.llmProvider)}
          />
        </div>
      </section>

      {/* Recent Sessions Table */}
      <section className="mb-10">
        <AnalyticsTable columns={tableColumns} demo={true}>
          {sessions.map((s) => (
            <tr
              key={s.id}
              className="transition-colors hover:bg-avatar-surface-hover"
            >
              <td className="px-5 py-3 font-mono text-xs text-avatar-text-dim">
                {s.id}
              </td>
              <td className="px-5 py-3 text-avatar-text">{s.agent}</td>
              <td className="px-5 py-3 text-right text-avatar-text tabular-nums">
                {s.duration}
              </td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-avatar-success-subtle px-2 py-0.5 text-xs font-medium text-avatar-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-avatar-success" />
                  {s.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right font-mono text-xs text-avatar-text-muted tabular-nums">
                {s.estimatedCost}
              </td>
              <td className="px-5 py-3 text-right font-mono text-xs text-avatar-text-muted tabular-nums">
                {s.latency}
              </td>
            </tr>
          ))}
        </AnalyticsTable>
      </section>

      {/* Debug Notes */}
      <section className="rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-5">
        <h3 className="mb-2 text-sm font-semibold text-avatar-text-dim">
          Debug Notes
        </h3>
        <ul className="space-y-1 text-xs text-avatar-text-dim">
          <li>
            • All metrics shown are demo/sample values — not production data.
          </li>
          <li>
            • Provider pricing uses placeholders from
            lib/avatar-cloud/metrics.ts.
          </li>
          <li>• Latency data synthesised from demo turn metrics.</li>
          <li>
            • Production telemetry, real analytics backend, and database not
            connected.
          </li>
          <li>
            • No auth, billing enforcement, or WebRTC telemetry collection
            active.
          </li>
        </ul>
      </section>
    </div>
  );
}
