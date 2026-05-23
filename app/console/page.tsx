import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Console",
  description: "Upcube Avatar Cloud dashboard.",
};

const MODULES = [
  {
    title: "Avatar Agents",
    description:
      "Create and manage AI avatar agents. Configure personas, replicas, voices, and embed settings.",
    href: "/console/avatar-agents",
    label: "Active",
  },
  {
    title: "Studio Lite",
    description:
      "Script-to-scene editor. Write scripts and split them into editable scene cards.",
    href: "/console/studio",
    label: "Preview",
  },
  {
    title: "Analytics",
    description:
      "Session metrics, latency breakdowns, cost estimates, and provider readiness.",
    href: "/console/analytics",
    label: "Demo",
  },
  {
    title: "Usage & Billing",
    description:
      "Cost breakdowns by provider, session quality summaries, and usage reports.",
    href: "/console/usage",
    label: "Demo",
  },
  {
    title: "Conversations",
    description:
      "View conversation logs, transcripts, event timelines, and lead previews.",
    href: "/console/conversations",
    label: "Demo",
  },
  {
    title: "Governance",
    description:
      "Consent records, verification, data retention, audit logs, and allowed-use policies.",
    href: "/console/governance",
    label: "Spec",
  },
];

export default function ConsolePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-upcube-text">
          Console
        </h1>
        <p className="mt-2 text-upcube-text-muted">
          Your Avatar Cloud dashboard. Manage agents, studio projects,
          analytics, and governance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="rounded-xl border border-upcube-border bg-upcube-surface p-5 transition-colors hover:border-upcube-text-dim"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-sm font-semibold text-upcube-text">
                {mod.title}
              </h3>
              <span className="rounded-full border border-upcube-border px-2 py-0.5 text-[10px] font-medium text-upcube-text-dim">
                {mod.label}
              </span>
            </div>
            <p className="text-sm text-upcube-text-muted">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
