import type {
  ConsentRecord as BaseConsentRecord,
  ConsentVerificationMethod,
} from "./types";

// ─── Scope and subject types ──────────────────────────────────────────────

export type ConsentScope =
  | "avatar_visual_replica"
  | "voice_clone"
  | "studio_video_use"
  | "live_agent_use"
  | "training_data_use";

export type ConsentRevocationStatus = "active" | "pending" | "revoked";

export interface ConsentSubject {
  id: string;
  name: string;
  email?: string;
  organizationId?: string;
  country?: string;
  verifiedAt?: string;
}

export interface ConsentGrant {
  id: string;
  scope: ConsentScope;
  grantedAt: string;
  expiresAt?: string;
  constraints?: Record<string, unknown>;
}

export interface ConsentAuditEntry {
  id: string;
  consentRecordId: string;
  action: "granted" | "revoked" | "expired" | "renewed" | "rejected";
  timestamp: string;
  performedBy: string;
  reason?: string;
  previousStatus?: ConsentRevocationStatus;
  newStatus: ConsentRevocationStatus;
}

export interface ConsentRecord
  extends Omit<BaseConsentRecord, "revocationStatus"> {
  revocationStatus: ConsentRevocationStatus;
  subjectId: string;
  scopes: ConsentGrant[];
  auditTrail: ConsentAuditEntry[];
  customReplicaEnabled: boolean;
  customVoiceEnabled: boolean;
  notes?: string;
}

// ─── Scope labels ─────────────────────────────────────────────────────────

export const CONSENT_SCOPE_LABELS: Record<ConsentScope, string> = {
  avatar_visual_replica: "Avatar Visual Replica",
  voice_clone: "Voice Clone",
  studio_video_use: "Studio Video Use",
  live_agent_use: "Live Agent Use",
  training_data_use: "Training Data Use",
};

export const CONSENT_SCOPE_DESCRIPTIONS: Record<ConsentScope, string> = {
  avatar_visual_replica:
    "Permission to create and display a visual replica of the subject's likeness in avatar form.",
  voice_clone:
    "Permission to clone the subject's voice using AI for text-to-speech and real-time synthesis.",
  studio_video_use:
    "Permission to use the subject's replica in pre-rendered studio videos.",
  live_agent_use:
    "Permission to deploy the subject's replica in real-time conversational avatar agents.",
  training_data_use:
    "Permission to use recordings of the subject for AI training and improvement.",
};

export const STATUS_LABELS: Record<ConsentRevocationStatus, string> = {
  active: "Active",
  pending: "Pending verification",
  revoked: "Revoked",
};

export const VERIFICATION_METHOD_LABELS: Record<
  ConsentVerificationMethod,
  string
> = {
  manual: "Manual review",
  liveness: "Liveness check",
  document: "Document verification",
  enterprise_attestation: "Enterprise attestation",
};

// ─── Helper functions ─────────────────────────────────────────────────────

export function isConsentActive(record: ConsentRecord): boolean {
  return record.revocationStatus === "active";
}

export function isConsentRevoked(record: ConsentRecord): boolean {
  return record.revocationStatus === "revoked";
}

export function isConsentPending(record: ConsentRecord): boolean {
  return record.revocationStatus === "pending";
}

export function revokeConsentRecord(
  record: ConsentRecord,
  performedBy: string,
  reason?: string,
): { record: ConsentRecord; auditEntry: ConsentAuditEntry } {
  const now = new Date().toISOString();

  const auditEntry: ConsentAuditEntry = {
    id: `audit_${Date.now()}`,
    consentRecordId: record.id,
    action: "revoked",
    timestamp: now,
    performedBy,
    reason: reason || "No reason provided",
    previousStatus: record.revocationStatus,
    newStatus: "revoked",
  };

  const revoked: ConsentRecord = {
    ...record,
    revocationStatus: "revoked",
    revokedAt: now,
    customReplicaEnabled: false,
    customVoiceEnabled: false,
    auditTrail: [...record.auditTrail, auditEntry],
  };

  return { record: revoked, auditEntry };
}

export function canUseReplica(record: ConsentRecord): boolean {
  return (
    isConsentActive(record) &&
    record.customReplicaEnabled &&
    record.scopes.some(
      (s) =>
        s.scope === "avatar_visual_replica" ||
        s.scope === "studio_video_use" ||
        s.scope === "live_agent_use",
    )
  );
}

export function canUseVoice(record: ConsentRecord): boolean {
  return (
    isConsentActive(record) &&
    record.customVoiceEnabled &&
    record.scopes.some(
      (s) => s.scope === "voice_clone" || s.scope === "studio_video_use",
    )
  );
}

export function createDemoConsentRecord(
  overrides?: Partial<ConsentRecord>,
): ConsentRecord {
  const now = new Date().toISOString();
  const subjectId = overrides?.subjectId || `subject_demo_${Date.now()}`;

  return {
    id: `consent_demo_${Date.now()}`,
    ownerId: "demo_owner",
    replicaId: "",
    subjectId,
    subjectName: "Demo Subject",
    consentTextVersion: "v1.0-demo",
    signedAt: now,
    revocationStatus: "active",
    scopes: [
      {
        id: `grant_${Date.now()}_visual`,
        scope: "avatar_visual_replica",
        grantedAt: now,
      },
      {
        id: `grant_${Date.now()}_voice`,
        scope: "voice_clone",
        grantedAt: now,
      },
    ],
    customReplicaEnabled: false,
    customVoiceEnabled: false,
    verificationMethod: "manual",
    auditTrail: [
      {
        id: `audit_${Date.now()}_created`,
        consentRecordId: `consent_demo_${Date.now()}`,
        action: "granted",
        timestamp: now,
        performedBy: "system",
        previousStatus: "pending",
        newStatus: "active",
      },
    ],
    notes:
      "Demo consent record for development purposes only. Not legally binding.",
    ...overrides,
  };
}

export function getActiveScopes(record: ConsentRecord): ConsentScope[] {
  if (!isConsentActive(record)) return [];
  return record.scopes
    .filter((grant) => {
      if (!grant.expiresAt) return true;
      return new Date(grant.expiresAt) > new Date();
    })
    .map((grant) => grant.scope);
}

export function hasScope(record: ConsentRecord, scope: ConsentScope): boolean {
  return getActiveScopes(record).includes(scope);
}

export function getConsentStatusLabel(record: ConsentRecord): string {
  return STATUS_LABELS[record.revocationStatus];
}
