import clsx from "clsx";

type StatusVariant = "success" | "warning" | "error" | "info" | "neutral";

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<StatusVariant, string> = {
  success:
    "bg-avatar-success-subtle text-avatar-success border border-avatar-success/20",
  warning:
    "bg-avatar-warning-subtle text-avatar-warning border border-avatar-warning/20",
  error:
    "bg-avatar-error-subtle text-avatar-error border border-avatar-error/20",
  info: "bg-avatar-info-subtle text-avatar-info border border-avatar-info/20",
  neutral:
    "bg-avatar-accent-subtle text-avatar-accent border border-avatar-accent/20",
};

const dotColors: Record<StatusVariant, string> = {
  success: "bg-avatar-success",
  warning: "bg-avatar-warning",
  error: "bg-avatar-error",
  info: "bg-avatar-info",
  neutral: "bg-avatar-accent",
};

export function StatusChip({
  label,
  variant = "neutral",
  className,
  dot = true,
}: StatusChipProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx("h-1.5 w-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {label}
    </span>
  );
}
