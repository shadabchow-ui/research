import clsx from "clsx";
import { CTAButton } from "components/ui/cta-button";
import { DEMO_CTA_ACTIONS } from "lib/avatar-cloud/lead-capture";
import type { CTAAction } from "lib/avatar-cloud/lead-capture";

interface CTAStackProps {
  title?: string;
  actions?: CTAAction[];
  columns?: 2 | 3;
  className?: string;
}

export function CTAStack({
  title = "Next steps",
  actions = DEMO_CTA_ACTIONS,
  columns = 3,
  className,
}: CTAStackProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-avatar-text">{title}</h3>
      )}
      <div
        className={clsx(
          "grid gap-3",
          columns === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {actions.map((action) => (
          <div
            key={action.id}
            className={clsx(
              "rounded-xl border bg-avatar-surface/30 p-4 transition-colors",
              action.disabled
                ? "border-avatar-border opacity-60"
                : "border-avatar-border hover:border-avatar-border-light",
            )}
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="text-lg">{action.icon}</span>
              {action.disabled && (
                <span className="rounded bg-avatar-warning-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-warning">
                  Soon
                </span>
              )}
            </div>
            <h4 className="mb-1 text-sm font-medium text-avatar-text">
              {action.label}
            </h4>
            <p className="mb-3 text-xs text-avatar-text-muted">
              {action.description}
            </p>
            <CTAButton
              href={action.href}
              variant={action.disabled ? "ghost" : "secondary"}
              size="sm"
              disabled={action.disabled}
            >
              {action.disabled ? "Coming soon" : "Go"}
            </CTAButton>
          </div>
        ))}
      </div>
    </div>
  );
}
