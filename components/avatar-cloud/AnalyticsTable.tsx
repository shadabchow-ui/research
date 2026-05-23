import clsx from "clsx";

export interface AnalyticsColumn {
  key: string;
  label: string;
  className?: string;
}

interface AnalyticsTableProps {
  columns: AnalyticsColumn[];
  children: React.ReactNode;
  demo?: boolean;
}

export function AnalyticsTable({
  columns,
  children,
  demo,
}: AnalyticsTableProps) {
  return (
    <div className="avatar-panel-hover overflow-hidden">
      {demo && (
        <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
          <h3 className="text-sm font-medium text-avatar-text">Sessions</h3>
          <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
            demo
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-avatar-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    "px-5 py-3 text-xs font-medium uppercase tracking-wider text-avatar-text-dim",
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-avatar-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
