import clsx from "clsx";

interface ProviderStatusProps {
  name: string;
  provider: string;
  configured: boolean;
}

export function ProviderStatus({
  name,
  provider,
  configured,
}: ProviderStatusProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-avatar-border bg-avatar-surface/50 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-avatar-text">{name}</span>
        <span
          className={clsx(
            "text-xs",
            configured ? "text-avatar-text-muted" : "text-avatar-text-dim",
          )}
        >
          {provider}
        </span>
      </div>
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          configured
            ? "bg-avatar-success-subtle text-avatar-success"
            : "bg-avatar-warning-subtle text-avatar-warning",
        )}
      >
        <span
          className={clsx(
            "h-1.5 w-1.5 rounded-full",
            configured ? "bg-avatar-success" : "bg-avatar-warning",
          )}
        />
        {configured ? "active" : "not_configured"}
      </span>
    </div>
  );
}
