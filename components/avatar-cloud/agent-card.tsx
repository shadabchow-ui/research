import clsx from "clsx";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";

type AgentCardStatus = "active" | "sample" | "draft" | "coming_soon";

type AgentDefaultMode = "text" | "voice" | "video";

type VoiceStatus = "configured" | "not_configured" | "sample";

interface AgentCardAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

export interface AgentCardData {
  id: string;
  name: string;
  purpose: string;
  status: AgentCardStatus;
  defaultMode: AgentDefaultMode;
  personaName: string;
  voiceStatus: VoiceStatus;
  actions: AgentCardAction[];
}

interface AgentCardProps {
  agent: AgentCardData;
  flagship?: boolean;
  className?: string;
}

const statusChipConfig: Record<
  AgentCardStatus,
  { label: string; variant: "success" | "info" | "neutral" | "warning" }
> = {
  active: { label: "Active", variant: "success" },
  sample: { label: "Sample", variant: "info" },
  draft: { label: "Draft", variant: "neutral" },
  coming_soon: { label: "Coming Soon", variant: "warning" },
};

const voiceStatusLabel: Record<VoiceStatus, string> = {
  configured: "Voice configured",
  not_configured: "Voice not configured",
  sample: "Sample voice",
};

const defaultModeLabel: Record<AgentDefaultMode, string> = {
  text: "Text",
  voice: "Voice",
  video: "Video",
};

export function AgentCard({
  agent,
  flagship = false,
  className,
}: AgentCardProps) {
  const statusCfg = statusChipConfig[agent.status];

  return (
    <div
      className={clsx(
        "avatar-panel flex flex-col gap-4 p-5 transition-all duration-200",
        "hover:border-avatar-border-light",
        flagship && "ring-1 ring-avatar-accent/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
              flagship
                ? "bg-avatar-accent text-white"
                : "bg-avatar-surface-hover text-avatar-text-muted",
            )}
          >
            {agent.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-avatar-text">
              {agent.name}
            </h3>
            {flagship && (
              <span className="text-xs text-avatar-accent">Flagship</span>
            )}
          </div>
        </div>
        <StatusChip label={statusCfg.label} variant={statusCfg.variant} />
      </div>

      <p className="text-sm leading-relaxed text-avatar-text-muted">
        {agent.purpose}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-avatar-text-dim">
        <span>
          Persona:{" "}
          <span className="text-avatar-text-muted">{agent.personaName}</span>
        </span>
        <span>
          Mode:{" "}
          <span className="text-avatar-text-muted">
            {defaultModeLabel[agent.defaultMode]}
          </span>
        </span>
        <span>
          Voice:{" "}
          <span className="text-avatar-text-muted">
            {voiceStatusLabel[agent.voiceStatus]}
          </span>
        </span>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {agent.actions.map((action) => (
          <CTAButton
            key={action.label}
            href={action.href}
            variant={action.variant ?? "secondary"}
            size="sm"
            disabled={action.disabled}
          >
            {action.label}
          </CTAButton>
        ))}
      </div>
    </div>
  );
}
