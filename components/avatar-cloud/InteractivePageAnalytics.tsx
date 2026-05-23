import { StatusChip } from "components/ui/status-chip";
import {
  SAMPLE_PAGE_ANALYTICS,
  FUNNEL_STAGE_LABELS,
  type InteractivePageAnalyticsSummary,
  type InteractivePageEvent,
} from "lib/avatar-cloud/interactive-analytics";

function FunnelBar({
  label,
  count,
  rate,
  maxCount,
}: {
  label: string;
  count: number;
  rate: number;
  maxCount: number;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 flex-shrink-0 text-right text-xs text-avatar-text-muted">
        {label}
      </span>
      <div className="flex h-6 flex-1 overflow-hidden rounded-full bg-avatar-surface">
        <div
          className="flex items-center justify-end rounded-full bg-avatar-accent/60 px-2 transition-all"
          style={{ width: `${Math.max(pct, 2)}%` }}
        >
          <span className="text-[10px] font-medium text-white">{count}</span>
        </div>
      </div>
      <span className="w-12 flex-shrink-0 text-left text-xs tabular-nums text-avatar-text-dim">
        {rate}%
      </span>
    </div>
  );
}

function formatEventType(type: string): string {
  return type
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

function EventRow({ event }: { event: InteractivePageEvent }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-avatar-border bg-avatar-surface/30 px-4 py-2.5 text-xs">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-avatar-accent" />
        <span className="font-medium text-avatar-text">
          {formatEventType(event.type)}
        </span>
      </div>
      <div className="flex items-center gap-3 text-avatar-text-dim">
        {(event.metadata?.ctaLabel as string | undefined) && (
          <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] text-avatar-accent">
            {event.metadata?.ctaLabel as string}
          </span>
        )}
        <span className="tabular-nums">{formatTimestamp(event.timestamp)}</span>
      </div>
    </div>
  );
}

interface InteractivePageAnalyticsProps {
  summary?: InteractivePageAnalyticsSummary;
}

export function InteractivePageAnalytics({
  summary = SAMPLE_PAGE_ANALYTICS,
}: InteractivePageAnalyticsProps) {
  const maxFunnelCount = Math.max(...summary.funnel.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Overview metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Views
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {summary.totalViews.toLocaleString()}
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Sessions
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {summary.uniqueSessions.toLocaleString()}
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Avg Watch
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {summary.avgWatchSeconds}s
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Completion
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {(summary.completionRate * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Second row: engagement metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Q&A Asked
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {summary.totalQuestionsAsked}
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Quiz Rate
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {(summary.quizCompletionRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            CTA Click
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {(summary.ctaClickRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="avatar-panel-hover relative flex flex-col gap-1 p-4">
          <span className="absolute right-2 top-2 rounded bg-avatar-accent-subtle px-1 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
            Lead Conv.
          </span>
          <span className="text-2xl font-bold text-avatar-text tabular-nums">
            {(summary.leadConversionRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Funnel */}
      <div className="avatar-panel p-5">
        <h3 className="mb-4 text-sm font-semibold text-avatar-text">
          Engagement Funnel
        </h3>
        <div className="flex flex-col gap-2">
          {summary.funnel.map((step) => (
            <FunnelBar
              key={step.stage}
              label={FUNNEL_STAGE_LABELS[step.stage]}
              count={step.count}
              rate={step.conversionRate}
              maxCount={maxFunnelCount}
            />
          ))}
        </div>
      </div>

      {/* Recent events */}
      <div className="avatar-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-avatar-text">
            Recent Events
          </h3>
          <StatusChip label="Sample events" variant="neutral" />
        </div>
        <div className="flex flex-col gap-2">
          {summary.recentEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-dashed border-avatar-border-light bg-avatar-surface/20 px-5 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusChip label="Demo analytics" variant="neutral" />
          <StatusChip label="No production tracking" variant="warning" />
          <StatusChip label="Sample data only" variant="info" />
        </div>
        <p className="text-xs text-avatar-text-dim leading-relaxed">
          All metrics shown are sample/demo values. No real user tracking,
          analytics provider, cookies, or database are connected. These numbers
          illustrate the analytics surface that will become available when
          production video pages are deployed with telemetry.
        </p>
      </div>
    </div>
  );
}
