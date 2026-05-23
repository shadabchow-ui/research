import { StatusChip } from "components/ui/status-chip";
import type { HandoffAction } from "lib/avatar-cloud/templates";
import { WEBSITE_CONCIERGE_HANDOFFS } from "lib/avatar-cloud/templates";

interface HandoffPreviewProps {
  title?: string;
  handoffs?: HandoffAction[];
}

const handoffIcons: Record<string, string> = {
  book_demo: "📅",
  transfer_support: "🎧",
  send_email: "📧",
  schedule_call: "📞",
  custom: "🔧",
};

export function HandoffPreview({
  title = "Handoff actions",
  handoffs = WEBSITE_CONCIERGE_HANDOFFS,
}: HandoffPreviewProps) {
  return (
    <div>
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-avatar-text">{title}</h3>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {handoffs.map((handoff) => (
          <div
            key={handoff.type}
            className="rounded-xl border border-avatar-border bg-avatar-surface/30 p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="text-lg">
                {handoffIcons[handoff.type] ?? "🔗"}
              </span>
              <StatusChip
                label={
                  handoff.placeholderUrl === "not provided"
                    ? "Not configured"
                    : "Ready"
                }
                variant={
                  handoff.placeholderUrl === "not provided"
                    ? "warning"
                    : "success"
                }
                dot={false}
              />
            </div>
            <h4 className="mb-1 text-sm font-medium text-avatar-text">
              {handoff.label}
            </h4>
            <p className="text-xs text-avatar-text-muted">
              {handoff.description}
            </p>
            {handoff.placeholderUrl &&
              handoff.placeholderUrl !== "not provided" && (
                <p className="mt-2 text-xs text-avatar-text-dim">
                  URL: {handoff.placeholderUrl}
                </p>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
