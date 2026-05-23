import clsx from "clsx";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  demo?: boolean;
}

export function MetricCard({ title, value, subtitle, demo }: MetricCardProps) {
  return (
    <div className="avatar-panel-hover relative flex flex-col gap-1.5 p-5">
      {demo && (
        <span className="absolute right-3 top-3 rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
          demo
        </span>
      )}
      <span className="text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
        {title}
      </span>
      <span className="text-3xl font-bold text-avatar-text tabular-nums">
        {value}
      </span>
      {subtitle && (
        <span className="text-xs text-avatar-text-muted">{subtitle}</span>
      )}
    </div>
  );
}
