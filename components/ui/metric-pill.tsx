import clsx from "clsx";

interface MetricPillProps {
  value: string;
  label: string;
  className?: string;
  accent?: boolean;
}

export function MetricPill({
  value,
  label,
  className,
  accent = false,
}: MetricPillProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center rounded-2xl border px-6 py-4",
        accent
          ? "border-avatar-accent/20 bg-avatar-accent-subtle"
          : "border-avatar-border bg-avatar-surface",
        className,
      )}
    >
      <span
        className={clsx(
          "text-2xl font-bold md:text-3xl",
          accent ? "text-avatar-accent" : "text-avatar-text",
        )}
      >
        {value}
      </span>
      <span className="mt-1 text-sm text-avatar-text-muted">{label}</span>
    </div>
  );
}
