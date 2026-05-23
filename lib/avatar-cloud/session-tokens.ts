import type { AvatarSessionToken, LiveAgent } from "./types";

const DEFAULT_EXPIRY_SECONDS = 300;
const MAX_EXPIRY_SECONDS = 3600;
const ALLOWED_DOMAIN_PATTERN = /^[\w-]+(\.[\w-]+)*(:\d{1,5})?$/;

export const TOKEN_PERMISSIONS = [
  "avatar.read",
  "avatar.speak",
  "session.join",
  "session.leave",
  "event.send",
  "event.receive",
  "transcript.read",
  "lead.capture",
] as const;

export type TokenPermission = (typeof TOKEN_PERMISSIONS)[number];

export interface AvatarSessionTokenRequest {
  liveAgentId: string;
  allowedDomain?: string;
  permissions?: TokenPermission[];
}

export type TokenMode = "demo" | "local" | "production";

export interface AvatarSessionTokenResponse {
  token: AvatarSessionToken;
  tokenMode: TokenMode;
  message?: string;
}

export interface DomainValidationResult {
  valid: boolean;
  sanitized: string;
  reason?: string;
}

export function sanitizeAllowedDomain(
  domain: unknown,
  defaultDomain: string,
): string {
  if (typeof domain !== "string") return defaultDomain;
  const trimmed = domain.trim().toLowerCase();
  if (!trimmed) return defaultDomain;
  const noProtocol = trimmed
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .split("/")[0];
  const noTrailing = (noProtocol ?? defaultDomain).replace(/:\d+$/, "");
  if (ALLOWED_DOMAIN_PATTERN.test(noTrailing)) return noTrailing;
  return defaultDomain;
}

export function validateAllowedDomain(
  domain: string,
  allowedDomains: string[],
): DomainValidationResult {
  const sanitized = sanitizeAllowedDomain(domain, "");
  if (!sanitized) {
    return { valid: false, sanitized, reason: "Domain is empty" };
  }
  const normalized = sanitized.toLowerCase();
  const match = allowedDomains.some((d) => {
    const nd = d.toLowerCase();
    return (
      nd === normalized ||
      nd === `*.${normalized.split(".").slice(-2).join(".")}`
    );
  });
  if (!match) {
    return {
      valid: false,
      sanitized,
      reason: `Domain "${sanitized}" is not in the allowed list`,
    };
  }
  return { valid: true, sanitized };
}

export function createDemoSessionToken(
  input: AvatarSessionTokenRequest,
  agent: LiveAgent | undefined,
  defaultDomain: string,
  lifeSeconds = DEFAULT_EXPIRY_SECONDS,
): AvatarSessionTokenResponse {
  const expiresIn = Math.min(lifeSeconds, MAX_EXPIRY_SECONDS);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresIn * 1000);

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `demo_token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const allowedDomain = sanitizeAllowedDomain(
    input.allowedDomain,
    defaultDomain,
  );

  const permissions = input.permissions?.length
    ? input.permissions.filter((p) => TOKEN_PERMISSIONS.includes(p))
    : ["avatar.read", "session.join", "event.send"];

  const token: AvatarSessionToken = {
    id,
    liveAgentId: input.liveAgentId,
    allowedDomain,
    expiresAt: expiresAt.toISOString(),
    permissions,
    sessionId: undefined,
    issuedAt: now.toISOString(),
  };

  return {
    token,
    tokenMode: agent ? "demo" : "demo",
    message: agent
      ? undefined
      : `Agent "${input.liveAgentId}" not found. Token issued with sample default.`,
  };
}

export function isTokenExpired(token: AvatarSessionToken): boolean {
  return new Date(token.expiresAt) <= new Date();
}

export function validateSessionTokenRequest(
  body: unknown,
):
  | { valid: true; request: AvatarSessionTokenRequest }
  | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  const req = body as Record<string, unknown>;
  if (typeof req.liveAgentId !== "string" || !req.liveAgentId.trim()) {
    return {
      valid: false,
      error: "liveAgentId is required and must be a non-empty string",
    };
  }
  const request: AvatarSessionTokenRequest = {
    liveAgentId: req.liveAgentId.trim(),
    allowedDomain:
      req.allowedDomain === undefined || typeof req.allowedDomain === "string"
        ? (req.allowedDomain as string | undefined)
        : undefined,
    permissions: Array.isArray(req.permissions)
      ? (req.permissions.filter(
          (p) => typeof p === "string",
        ) as TokenPermission[])
      : undefined,
  };
  return { valid: true, request };
}

export type SessionToken = AvatarSessionToken;

export type CreateSessionTokenInput = AvatarSessionTokenRequest;

export const createSessionToken = createDemoSessionToken;

export function validateSessionToken(
  token: AvatarSessionToken,
  domain: string,
): DomainValidationResult {
  if (isTokenExpired(token)) {
    return { valid: false, sanitized: domain, reason: "Token is expired" };
  }
  return validateAllowedDomain(domain, [token.allowedDomain]);
}

export function revokeSessionToken(
  token: AvatarSessionToken,
): AvatarSessionToken {
  return {
    ...token,
    revokedAt: new Date().toISOString(),
  };
}
