"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import type { InteractiveChecklist } from "lib/avatar-cloud/interactive-layers";
import { calculateChecklistCompletion } from "lib/avatar-cloud/interactive-layers";

interface ChecklistCardProps {
  checklist: InteractiveChecklist;
}

export function ChecklistCard({ checklist }: ChecklistCardProps) {
  const [items, setItems] = useState(checklist.items);

  const toggle = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    );
  }, []);

  const { completed, total, percent, done } = calculateChecklistCompletion({
    ...checklist,
    items,
  });

  return (
    <div className="rounded-2xl border border-avatar-border bg-avatar-surface">
      <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
        <h3 className="text-sm font-medium text-avatar-text">
          {checklist.title}
        </h3>
        <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
          local progress
        </span>
      </div>

      <div className="px-5 py-3">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-avatar-border">
            <div
              className="h-full rounded-full bg-avatar-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs tabular-nums text-avatar-text-dim">
            {completed}/{total}
          </span>
        </div>

        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  item.completed
                    ? "text-avatar-text-muted"
                    : "text-avatar-text hover:bg-avatar-surface-hover",
                )}
              >
                <span
                  className={clsx(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-colors",
                    item.completed
                      ? "border-avatar-success bg-avatar-success text-white"
                      : "border-avatar-border-light bg-avatar-bg text-transparent",
                  )}
                >
                  {item.completed && "✓"}
                </span>
                <span
                  className={clsx(
                    item.completed &&
                      "line-through decoration-avatar-text-dim/30",
                  )}
                >
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {done && (
        <div className="border-t border-avatar-border px-5 py-3">
          <p className="text-center text-sm font-medium text-avatar-success">
            All steps complete
          </p>
        </div>
      )}

      <div className="border-t border-dashed border-avatar-border-light px-5 py-2">
        <p className="text-[10px] text-avatar-text-dim">
          Progress is local only and not saved or synced.
        </p>
      </div>
    </div>
  );
}
