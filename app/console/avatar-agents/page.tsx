import type { Metadata } from "next";
import {
  SAMPLE_ETHEN_AGENT,
  SAMPLE_WEBSITE_CONCIERGE_TEMPLATE,
} from "lib/avatar-cloud";
import { AgentCard, AgentCardData } from "components/avatar-cloud/agent-card";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";

export const metadata: Metadata = {
  title: "Avatar Agents — Upcube Console",
  description: "Manage your Upcube Avatar Cloud agents.",
};

const AGENTS: AgentCardData[] = [
  {
    id: SAMPLE_ETHEN_AGENT.id,
    name: SAMPLE_ETHEN_AGENT.name,
    purpose:
      "Upcube's flagship AI avatar guide. Explains products, answers questions, and routes users across the Upcube ecosystem.",
    status: "active",
    defaultMode: "text",
    personaName: "Ethen Guide",
    voiceStatus: "not_configured",
    actions: [
      { label: "Open demo", href: "/products/live-avatar", variant: "primary" },
    ],
  },
  {
    id: SAMPLE_WEBSITE_CONCIERGE_TEMPLATE.id,
    name: SAMPLE_WEBSITE_CONCIERGE_TEMPLATE.name,
    purpose:
      "Greet visitors, answer product questions, qualify leads, and book meetings. The first commercial template for Live Avatar.",
    status: "sample",
    defaultMode: "text",
    personaName: "Website Concierge",
    voiceStatus: "not_configured",
    actions: [
      {
        label: "View template",
        href: "/console/avatar-agents/templates/website-concierge",
        variant: "secondary",
      },
      { label: "Configure later", variant: "ghost", disabled: true },
    ],
  },
  {
    id: "template_ai_sdr",
    name: "AI SDR",
    purpose:
      "Engage prospects on your site, explain your product, handle objections, and route hot leads to your sales team.",
    status: "coming_soon",
    defaultMode: "voice",
    personaName: "AI SDR",
    voiceStatus: "sample",
    actions: [{ label: "Coming soon", variant: "ghost", disabled: true }],
  },
  {
    id: "template_support_agent",
    name: "Support Agent",
    purpose:
      "Resolve common support issues, guide users through troubleshooting, and escalate to humans with full context.",
    status: "coming_soon",
    defaultMode: "text",
    personaName: "Support Agent",
    voiceStatus: "not_configured",
    actions: [{ label: "Coming soon", variant: "ghost", disabled: true }],
  },
  {
    id: "template_training_coach",
    name: "Training Coach",
    purpose:
      "Deliver interactive training sessions, quiz learners on the material, and track completion rates.",
    status: "coming_soon",
    defaultMode: "text",
    personaName: "Training Coach",
    voiceStatus: "not_configured",
    actions: [{ label: "Coming soon", variant: "ghost", disabled: true }],
  },
  {
    id: "template_product_demo_agent",
    name: "Product Demo Agent",
    purpose:
      "Demo your product to website visitors, answer buyer questions in real time, and recommend next steps.",
    status: "coming_soon",
    defaultMode: "voice",
    personaName: "Product Demo Agent",
    voiceStatus: "sample",
    actions: [{ label: "Coming soon", variant: "ghost", disabled: true }],
  },
  {
    id: "template_ecommerce_shopping_assistant",
    name: "Ecommerce Shopping Assistant",
    purpose:
      "Recommend products, compare options, answer shipping questions, and upsell relevant bundles.",
    status: "coming_soon",
    defaultMode: "text",
    personaName: "Shopping Assistant",
    voiceStatus: "not_configured",
    actions: [{ label: "Coming soon", variant: "ghost", disabled: true }],
  },
];

function countBy<T>(items: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const val = String(item[key]);
    counts[val] = (counts[val] ?? 0) + 1;
  }
  return counts;
}

export default function AvatarAgentsPage() {
  const totalAgents = AGENTS.length;
  const statusCounts = countBy(AGENTS, "status");
  const activeCount = statusCounts["active"] ?? 0;
  const sampleCount = statusCounts["sample"] ?? 0;
  const comingSoonCount = statusCounts["coming_soon"] ?? 0;
  const voiceConfiguredCount = AGENTS.filter(
    (a) => a.voiceStatus !== "not_configured",
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-avatar-text md:text-4xl">
          Avatar Agents
        </h1>
        <p className="mt-3 text-lg text-avatar-text-muted">
          Create, configure, and manage AI avatar agents for your website.
        </p>
      </div>

      {/* Overview bar */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="avatar-panel flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl font-bold text-avatar-text">
            {totalAgents}
          </span>
          <span className="text-xs text-avatar-text-dim">Total agents</span>
        </div>
        <div className="avatar-panel flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl font-bold text-avatar-success">
            {activeCount + sampleCount}
          </span>
          <span className="text-xs text-avatar-text-dim">Active / Sample</span>
        </div>
        <div className="avatar-panel flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl font-bold text-avatar-warning">
            {comingSoonCount}
          </span>
          <span className="text-xs text-avatar-text-dim">Coming soon</span>
        </div>
        <div className="avatar-panel flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl font-bold text-avatar-text-muted">
            {voiceConfiguredCount}
          </span>
          <span className="text-xs text-avatar-text-dim">Voice ready</span>
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-10 flex flex-wrap gap-3">
        <CTAButton
          href="/console/avatar-agents/builder"
          variant="primary"
          size="sm"
        >
          Build agent
        </CTAButton>
        <CTAButton href="/products/live-avatar" variant="secondary" size="sm">
          Try Ethen
        </CTAButton>
        <CTAButton href="/developers/embed" variant="secondary" size="sm">
          Embed docs
        </CTAButton>
        <CTAButton href="/pricing" variant="ghost" size="sm">
          Pricing
        </CTAButton>
      </div>

      {/* Flagship agent */}
      <h2 className="mb-4 text-xl font-semibold text-avatar-text">Featured</h2>
      <div className="mb-10 max-w-lg">
        {AGENTS.filter((a) => a.status === "active").map((agent) => (
          <AgentCard key={agent.id} agent={agent} flagship />
        ))}
      </div>

      {/* Sample template */}
      <h2 className="mb-4 text-xl font-semibold text-avatar-text">
        Sample template
      </h2>
      <div className="mb-10 max-w-lg">
        {AGENTS.filter((a) => a.status === "sample").map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Coming soon templates */}
      <h2 className="mb-4 text-xl font-semibold text-avatar-text">
        Coming soon templates
      </h2>
      <p className="mb-6 text-sm text-avatar-text-dim">
        These agent templates will be available when Live Avatar enters beta.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.filter((a) => a.status === "coming_soon").map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Embed / API section */}
      <div className="mt-16">
        <div className="avatar-panel flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="text-xl font-semibold text-avatar-text">
            Ready to deploy?
          </h2>
          <p className="max-w-md text-sm text-avatar-text-muted">
            Embed your avatar on any website with a single script tag. Works
            without auth during the preview phase.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <StatusChip label="Embed SDK ready" variant="success" />
            <StatusChip label="No TTS provider" variant="warning" />
            <StatusChip label="Auth not required" variant="info" />
          </div>
          <div className="flex gap-3">
            <CTAButton href="/developers/embed" variant="primary" size="sm">
              View embed docs
            </CTAButton>
            <CTAButton href="#" variant="ghost" size="sm" disabled>
              Embed code (coming soon)
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
