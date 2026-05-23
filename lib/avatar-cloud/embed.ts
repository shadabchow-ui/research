import type {
  EmbedConfig,
  EmbedTheme,
  EmbedPosition,
  EmbedDefaultMode,
} from "./types";

export type { EmbedConfig, EmbedTheme, EmbedPosition, EmbedDefaultMode };

export interface EmbedBootstrapConfig {
  agentId: string;
  sessionToken: string;
  allowedDomains: string[];
  theme: EmbedTheme;
  position: EmbedPosition;
  defaultMode: EmbedDefaultMode;
  showBranding: boolean;
  leadCaptureEnabled: boolean;
}

export interface EmbedValidationError {
  field: string;
  message: string;
}

export interface EmbedValidationResult {
  valid: boolean;
  errors: EmbedValidationError[];
}

export function createDefaultEmbedConfig(
  overrides?: Partial<EmbedConfig>,
): EmbedConfig {
  const now = new Date().toISOString();
  return {
    id: `embed_${Date.now()}`,
    liveAgentId: "",
    allowedDomains: [],
    theme: "system",
    position: "bottom-right",
    defaultMode: "text",
    showBranding: true,
    leadCaptureEnabled: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function validateEmbedConfig(
  config: Partial<EmbedConfig>,
): EmbedValidationResult {
  const errors: EmbedValidationError[] = [];

  if (!config.liveAgentId || config.liveAgentId.trim().length === 0) {
    errors.push({
      field: "liveAgentId",
      message: "liveAgentId is required",
    });
  }

  if (
    !config.allowedDomains ||
    config.allowedDomains.length === 0 ||
    config.allowedDomains.every((d) => d.trim().length === 0)
  ) {
    errors.push({
      field: "allowedDomains",
      message: "At least one allowed domain is required",
    });
  }

  const validPositions: EmbedPosition[] = [
    "bottom-right",
    "bottom-left",
    "inline",
  ];
  if (
    config.position &&
    !validPositions.includes(config.position as EmbedPosition)
  ) {
    errors.push({
      field: "position",
      message: `position must be one of: ${validPositions.join(", ")}`,
    });
  }

  const validThemes: EmbedTheme[] = ["light", "dark", "system"];
  if (config.theme && !validThemes.includes(config.theme as EmbedTheme)) {
    errors.push({
      field: "theme",
      message: `theme must be one of: ${validThemes.join(", ")}`,
    });
  }

  const validModes: EmbedDefaultMode[] = ["text", "voice", "video"];
  if (
    config.defaultMode &&
    !validModes.includes(config.defaultMode as EmbedDefaultMode)
  ) {
    errors.push({
      field: "defaultMode",
      message: `defaultMode must be one of: ${validModes.join(", ")}`,
    });
  }

  return { valid: errors.length === 0, errors };
}

export function getEmbedSnippet(config: EmbedBootstrapConfig): string {
  const configJson = JSON.stringify(
    {
      agentId: config.agentId,
      sessionToken: config.sessionToken,
      allowedDomains: config.allowedDomains,
      theme: config.theme,
      position: config.position,
      defaultMode: config.defaultMode,
      showBranding: config.showBranding,
      leadCaptureEnabled: config.leadCaptureEnabled,
    },
    null,
    2,
  );

  return [
    "<!-- Upcube Avatar Cloud Embed SDK (Demo) -->",
    "<!-- This is a demo SDK foundation — not a production CDN release. -->",
    "<!-- In production, replace src with the official SDK bundle URL. -->",
    '<div id="upcube-avatar-cloud-root"></div>',
    '<script type="application/json" id="upcube-embed-config">',
    configJson,
    "</script>",
    '<script src="/embed.js" defer></script>',
  ].join("\n");
}
