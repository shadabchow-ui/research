import type { ConsentRecord, ConsentVerificationMethod } from "./types";

// ─── Governance readiness ───────────────────────────────────────────────────

export type GovernanceReadiness =
  | "not_configured"
  | "planned"
  | "demo"
  | "live";

// ─── Governance modules ─────────────────────────────────────────────────────

export type GovernanceModuleId =
  | "consent_records"
  | "identity_verification"
  | "voice_clone_permissions"
  | "replica_revocation"
  | "watermarking_c2pa"
  | "audit_logs"
  | "policy_templates"
  | "takedown_requests"
  | "data_retention";

export interface GovernanceModuleDef {
  id: GovernanceModuleId;
  title: string;
  description: string;
  readiness: GovernanceReadiness;
  warning?: string;
  dependencies: GovernanceModuleId[];
}

// ─── Identity verification ──────────────────────────────────────────────────

export type IdentityVerificationLevel =
  | "none"
  | "manual_review"
  | "liveness_check"
  | "document_scan"
  | "enterprise_attestation";

export interface IdentityVerificationStatus {
  level: IdentityVerificationLevel;
  lastVerifiedAt?: string;
  reviewerId?: string;
  notes?: string;
}

// ─── Replica revocation ─────────────────────────────────────────────────────

export type ReplicaRevocationAction = "revoke" | "suspend" | "reinstate";

export interface ReplicaRevocationRecord {
  id: string;
  replicaId: string;
  action: ReplicaRevocationAction;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  status: "pending" | "completed" | "failed";
}

// ─── Watermarking / C2PA ────────────────────────────────────────────────────

export type WatermarkingMode =
  | "none"
  | "visible_overlay"
  | "audio_fingerprint"
  | "c2pa_manifest"
  | "full_c2pa";

export interface WatermarkingStatus {
  mode: WatermarkingMode;
  c2paReady: boolean;
  installedSignerId?: string;
  notes?: string;
}

// ─── Data retention ─────────────────────────────────────────────────────────

export type DataRetentionDuration =
  | "indefinite"
  | "days_30"
  | "days_90"
  | "days_180"
  | "days_365"
  | "custom";

export interface DataRetentionMode {
  transcriptionRetention: DataRetentionDuration;
  audioRetention: DataRetentionDuration;
  videoRetention: DataRetentionDuration;
  leadDataRetention: DataRetentionDuration;
  consentRecordRetention: DataRetentionDuration;
  auditLogRetention: DataRetentionDuration;
}

export type RetainedDataCategory =
  | "transcription"
  | "audio_recording"
  | "video_output"
  | "lead_data"
  | "consent_record"
  | "audit_log";

export const RETAINED_DATA_CATEGORIES: {
  key: RetainedDataCategory;
  label: string;
  retentionField: keyof DataRetentionMode;
}[] = [
  {
    key: "transcription",
    label: "Transcriptions",
    retentionField: "transcriptionRetention",
  },
  {
    key: "audio_recording",
    label: "Audio recordings",
    retentionField: "audioRetention",
  },
  {
    key: "video_output",
    label: "Video output",
    retentionField: "videoRetention",
  },
  { key: "lead_data", label: "Lead data", retentionField: "leadDataRetention" },
  {
    key: "consent_record",
    label: "Consent records",
    retentionField: "consentRecordRetention",
  },
  {
    key: "audit_log",
    label: "Audit logs",
    retentionField: "auditLogRetention",
  },
];

export type RetentionAction = "purge" | "export" | "extend" | "lock";

export type RetentionPolicyStatus = "active" | "planned" | "expired" | "locked";

export interface RetentionWindow {
  startDate?: string;
  endDate?: string;
  customDays?: number;
}

export interface DataRetentionPolicy {
  id: string;
  name: string;
  description: string;
  mode: DataRetentionMode;
  status: RetentionPolicyStatus;
  effectiveAt?: string;
  expiresAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface DataDeletionRequest {
  id: string;
  type: "deletion";
  targetCategory: RetainedDataCategory;
  targetId?: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "completed";
  reviewerId?: string;
  completedAt?: string;
}

export interface DataExportRequest {
  id: string;
  type: "export";
  targetCategory: RetainedDataCategory;
  targetId?: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "completed";
  format: "json" | "csv";
  downloadUrl?: string;
  expiresAt?: string;
}

export const DURATION_LABELS: Record<DataRetentionDuration, string> = {
  indefinite: "Indefinite",
  days_30: "30 days",
  days_90: "90 days",
  days_180: "180 days",
  days_365: "365 days",
  custom: "Custom",
};

// ─── Retention helper functions ──────────────────────────────────────────────

export function createDefaultRetentionPolicy(
  overrides?: Partial<DataRetentionPolicy>,
): DataRetentionPolicy {
  const now = new Date().toISOString();
  return {
    id: `retention_policy_default`,
    name: "Default Retention Policy",
    description:
      "Standard 90-day retention for audio, video, and transcriptions. Lead data kept 365 days. Consent and audit records retained indefinitely.",
    mode: {
      transcriptionRetention: "days_90",
      audioRetention: "days_90",
      videoRetention: "days_90",
      leadDataRetention: "days_365",
      consentRecordRetention: "indefinite",
      auditLogRetention: "indefinite",
    },
    status: "planned",
    effectiveAt: now,
    notes: "Demo policy. Not enforced in production.",
    ...overrides,
  };
}

export function isZeroDataRetention(mode: DataRetentionMode): boolean {
  return (
    mode.transcriptionRetention === "days_30" &&
    mode.audioRetention === "days_30" &&
    mode.videoRetention === "days_30" &&
    mode.leadDataRetention === "days_30" &&
    mode.consentRecordRetention === "days_90" &&
    mode.auditLogRetention === "days_180"
  );
}

export function describeRetentionDuration(
  duration: DataRetentionDuration,
): string {
  return DURATION_LABELS[duration];
}

export function shouldRetainTranscript(mode: DataRetentionMode): boolean {
  return mode.transcriptionRetention !== "days_30";
}

export function shouldRetainAudio(mode: DataRetentionMode): boolean {
  return mode.audioRetention !== "days_30";
}

export function shouldRetainVideo(mode: DataRetentionMode): boolean {
  return mode.videoRetention !== "days_30";
}

export function describeRetentionPolicy(policy: DataRetentionPolicy): string {
  const lines: string[] = [
    `Policy: ${policy.name} (${policy.status})`,
    policy.description,
    "",
  ];
  for (const cat of RETAINED_DATA_CATEGORIES) {
    lines.push(
      `  ${cat.label}: ${describeRetentionDuration(policy.mode[cat.retentionField])}`,
    );
  }
  return lines.join("\n");
}

// ─── Demo retention policies ─────────────────────────────────────────────────

export const DEFAULT_RETENTION_POLICY: DataRetentionPolicy =
  createDefaultRetentionPolicy({
    id: "demo_policy_default",
    notes:
      "Demo policy — not enforced in production. Purely for specification and planning.",
  });

export const ZERO_DATA_RETENTION_POLICY: DataRetentionPolicy = {
  id: "demo_policy_zero_retention",
  name: "Zero Data Retention (Enterprise)",
  description:
    "Minimizes data retention for privacy-sensitive enterprise deployments. Audio, video, and transcriptions deleted after 30 days. Consent records kept 90 days. Audit logs kept 180 days.",
  mode: {
    transcriptionRetention: "days_30",
    audioRetention: "days_30",
    videoRetention: "days_30",
    leadDataRetention: "days_30",
    consentRecordRetention: "days_90",
    auditLogRetention: "days_180",
  },
  status: "planned",
  notes:
    "Demo enterprise zero-data-retention policy. Not enforced in production. No automated deletion pipeline exists.",
};

export const CUSTOM_30_DAY_POLICY: DataRetentionPolicy = {
  id: "demo_policy_custom_30",
  name: "Custom 30-Day Retention",
  description:
    "Keeps all categories at a flat 30-day retention window. Suitable for quick-turn data sensitivity use cases.",
  mode: {
    transcriptionRetention: "days_30",
    audioRetention: "days_30",
    videoRetention: "days_30",
    leadDataRetention: "days_30",
    consentRecordRetention: "days_90",
    auditLogRetention: "days_180",
  },
  status: "planned",
  notes:
    "Demo custom 30-day flat retention policy. Not enforced. No automated purge pipeline is active.",
};

export const DEMO_RETENTION_POLICIES: DataRetentionPolicy[] = [
  DEFAULT_RETENTION_POLICY,
  ZERO_DATA_RETENTION_POLICY,
  CUSTOM_30_DAY_POLICY,
];

export const DEMO_DELETION_REQUESTS: DataDeletionRequest[] = [
  {
    id: "del_demo_001",
    type: "deletion",
    targetCategory: "transcription",
    targetId: "conv_demo_001",
    reason: "User requested deletion of transcript data under privacy policy.",
    requestedBy: "demo_user",
    requestedAt: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "del_demo_002",
    type: "deletion",
    targetCategory: "audio_recording",
    targetId: "session_demo_001",
    reason: "Consent revoked for audio retention.",
    requestedBy: "demo_admin",
    requestedAt: new Date().toISOString(),
    status: "pending",
  },
];

export const DEMO_EXPORT_REQUESTS: DataExportRequest[] = [
  {
    id: "exp_demo_001",
    type: "export",
    targetCategory: "transcription",
    targetId: "conv_demo_001",
    requestedBy: "demo_user",
    requestedAt: new Date().toISOString(),
    status: "pending",
    format: "json",
  },
];

export function isRetentionDurationIndefinite(
  d: DataRetentionDuration,
): boolean {
  return d === "indefinite";
}

export function getRetentionDays(
  duration: DataRetentionDuration,
): number | "unlimited" {
  switch (duration) {
    case "indefinite":
      return "unlimited";
    case "days_30":
      return 30;
    case "days_90":
      return 90;
    case "days_180":
      return 180;
    case "days_365":
      return 365;
    case "custom":
      return "unlimited";
  }
}

// ─── Audit log ──────────────────────────────────────────────────────────────

export type AuditLogAction =
  | "consent.signed"
  | "consent.revoked"
  | "identity.verified"
  | "identity.failed"
  | "replica.created"
  | "replica.revoked"
  | "replica.reinstated"
  | "replica.deleted"
  | "voice.cloned"
  | "voice.clone_revoked"
  | "policy.updated"
  | "policy.approved"
  | "takedown.requested"
  | "takedown.approved"
  | "takedown.rejected"
  | "takedown.completed"
  | "retention.updated"
  | "retention.purge_initiated"
  | "watermark.applied"
  | "watermark.verified"
  | "access.granted"
  | "access.revoked"
  | "safety.flag_raised"
  | "safety.flag_resolved";

export interface AuditLogEvent {
  id: string;
  sessionId?: string;
  moduleId: GovernanceModuleId;
  action: AuditLogAction;
  actor: string;
  targetId?: string;
  targetType?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// ─── Allowed-use policy ─────────────────────────────────────────────────────

export interface PolicyRule {
  id: string;
  category: "content" | "identity" | "voice" | "replica" | "data" | "safety";
  rule: string;
  enforcement: "block" | "review" | "warn";
  active: boolean;
}

export interface AllowedUsePolicy {
  id: string;
  name: string;
  version: string;
  effectiveAt: string;
  rules: PolicyRule[];
  approvedBy?: string;
  notes?: string;
}

// ─── Takedown requests ──────────────────────────────────────────────────────

export type TakedownScope =
  | "replica"
  | "voice"
  | "video"
  | "transcript"
  | "session";

export type TakedownStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export interface TakedownRequest {
  id: string;
  targetType: TakedownScope;
  targetId: string;
  reason: string;
  submittedBy: string;
  submittedAt: string;
  status: TakedownStatus;
  reviewerId?: string;
  reviewedAt?: string;
  resolutionNotes?: string;
}

// ─── Governance snapshot / aggregate ────────────────────────────────────────

export interface GovernanceSnapshot {
  consentRecords: number;
  consentActive: number;
  consentRevoked: number;
  identityVerificationLevel: IdentityVerificationLevel;
  voiceCloneAllowed: boolean;
  customReplicasAllowed: boolean;
  watermarkingMode: WatermarkingMode;
  dataRetention: DataRetentionMode;
  activePolicies: AllowedUsePolicy[];
  pendingTakedowns: number;
  completedTakedowns: number;
  lastAuditEventAt?: string;
  totalAuditEvents: number;
}

// ─── Module definitions ─────────────────────────────────────────────────────

export const GOVERNANCE_MODULES: GovernanceModuleDef[] = [
  {
    id: "consent_records",
    title: "Consent Records",
    description:
      "Manage consent for replicas, voice clones, and data subjects. Each replica and voice must have an active consent record before use in production.",
    readiness: "demo",
    dependencies: [],
  },
  {
    id: "identity_verification",
    title: "Identity Verification",
    description:
      "Verify the identity of replica owners and voice subjects. Required before custom replicas or cloned voices are approved.",
    readiness: "planned",
    warning:
      "User-created replicas disabled until consent architecture and identity verification are active.",
    dependencies: ["consent_records"],
  },
  {
    id: "voice_clone_permissions",
    title: "Voice Clone Permissions",
    description:
      "Control which users and agents can clone voices. Voice cloning requires explicit consent, identity verification, and an approved permission record.",
    readiness: "planned",
    warning:
      "Voice cloning disabled until consent records, identity verification, and clone-specific permissions are active.",
    dependencies: ["consent_records", "identity_verification"],
  },
  {
    id: "replica_revocation",
    title: "Replica Revocation",
    description:
      "Revoke or suspend replicas when consent is withdrawn or misuse is detected. Reinstatement requires new consent and identity re-verification.",
    readiness: "demo",
    dependencies: ["consent_records"],
  },
  {
    id: "watermarking_c2pa",
    title: "Watermarking / C2PA",
    description:
      "Apply visual and audio watermarks to avatar output. C2PA content credentials for provenance and disclosure are planned for a future update.",
    readiness: "not_configured",
    warning:
      "Watermarking and C2PA content credentials are not yet implemented. Avatar output should be clearly disclosed as AI-generated.",
    dependencies: [],
  },
  {
    id: "audit_logs",
    title: "Audit Logs",
    description:
      "Immutable governance audit trail for consent, identity, replica lifecycle, takedowns, policy changes, and safety flags.",
    readiness: "planned",
    warning:
      "Audit log storage and immutability are planned. Current session events are local-only and not durable.",
    dependencies: [],
  },
  {
    id: "policy_templates",
    title: "Policy Templates",
    description:
      "Allowed-use policies covering content safety, identity misuse, voice clone boundaries, and data handling. Templates require approval before enforcement.",
    readiness: "demo",
    dependencies: [],
  },
  {
    id: "takedown_requests",
    title: "Takedown Requests",
    description:
      "Submit and process takedown requests for replicas, voices, videos, transcripts, or sessions. Review workflow requires authorized reviewer assignment.",
    readiness: "demo",
    warning:
      "Takedown workflow is demo-only. Real takedown processing requires legal team integration and manual review.",
    dependencies: ["audit_logs"],
  },
  {
    id: "data_retention",
    title: "Data Retention Controls",
    description:
      "Configure how long transcriptions, audio, video, lead data, consent records, and audit logs are retained. Purge and export controls coming in a later update.",
    readiness: "planned",
    warning:
      "Data retention controls are planned. Currently no automated purge or export pipeline exists.",
    dependencies: ["audit_logs"],
  },
];

// ─── Policy template examples ──────────────────────────────────────────────

export const BASE_SAFETY_RULES: PolicyRule[] = [
  {
    id: "rule_content_no_harm",
    category: "content",
    rule: "Avatars must not generate content that promotes violence, hate speech, illegal activity, or self-harm.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_content_no_impersonation",
    category: "content",
    rule: "Avatars must not impersonate real individuals without explicit consent and identity verification.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_identity_consent_required",
    category: "identity",
    rule: "Custom replica creation requires identity verification and signed consent record.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_voice_consent_required",
    category: "voice",
    rule: "Voice cloning requires explicit consent, identity verification, and clone-specific permission.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_replica_revocation_window",
    category: "replica",
    rule: "Consent revocation triggers replica suspension within 24 hours.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_data_retention_default",
    category: "data",
    rule: "Audio and video data retention defaults to 90 days unless custom policy is approved.",
    enforcement: "warn",
    active: true,
  },
  {
    id: "rule_safety_disclosure",
    category: "safety",
    rule: "All avatar output must be clearly disclosed as AI-generated. No undisclosed deepfakes.",
    enforcement: "block",
    active: true,
  },
  {
    id: "rule_safety_flag_review",
    category: "safety",
    rule: "Automated safety flags require human review within 48 hours.",
    enforcement: "review",
    active: true,
  },
];

export const BASE_ALLOWED_USE_POLICY: AllowedUsePolicy = {
  id: "policy_base_v1",
  name: "Base Allowed-Use Policy",
  version: "1.0",
  effectiveAt: "2025-01-01T00:00:00.000Z",
  rules: BASE_SAFETY_RULES,
  notes:
    "Demo policy. Real policy requires legal review and platform administrator approval.",
};

// ─── Demo governance snapshot ───────────────────────────────────────────────

export const DEMO_GOVERNANCE_SNAPSHOT: GovernanceSnapshot = {
  consentRecords: 0,
  consentActive: 0,
  consentRevoked: 0,
  identityVerificationLevel: "none",
  voiceCloneAllowed: false,
  customReplicasAllowed: false,
  watermarkingMode: "none",
  dataRetention: {
    transcriptionRetention: "days_90",
    audioRetention: "days_90",
    videoRetention: "days_90",
    leadDataRetention: "days_365",
    consentRecordRetention: "indefinite",
    auditLogRetention: "indefinite",
  },
  activePolicies: [BASE_ALLOWED_USE_POLICY],
  pendingTakedowns: 0,
  completedTakedowns: 0,
  totalAuditEvents: 0,
};

// ─── Audit severity ───────────────────────────────────────────────────────

export type AuditSeverity = "info" | "warning" | "error" | "critical";

export const AUDIT_SEVERITY_LABELS: Record<AuditSeverity, string> = {
  info: "Info",
  warning: "Warning",
  error: "Error",
  critical: "Critical",
};

// ─── Audit log filter ─────────────────────────────────────────────────────

export interface AuditLogFilter {
  moduleId?: GovernanceModuleId;
  action?: AuditLogAction;
  actor?: string;
  severity?: AuditSeverity;
  targetType?: string;
  after?: string;
  before?: string;
  search?: string;
}

// ─── Audit log summary ────────────────────────────────────────────────────

export interface AuditLogSummary {
  totalEvents: number;
  byModule: Partial<Record<GovernanceModuleId, number>>;
  byAction: Partial<Record<AuditLogAction, number>>;
  bySeverity: Partial<Record<AuditSeverity, number>>;
  filteredEvents: AuditLogEvent[];
}

// ─── Audit log helper functions ───────────────────────────────────────────

let _seqCounter = 0;

export function createAuditLogEvent(
  action: AuditLogAction,
  actor: string,
  overrides?: Partial<AuditLogEvent>,
): AuditLogEvent {
  _seqCounter += 1;
  const id =
    overrides?.id ?? `audit_evt_${_seqCounter.toString().padStart(6, "0")}`;
  return {
    id,
    moduleId: resolveModuleForAction(action),
    action,
    actor,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function resolveModuleForAction(action: AuditLogAction): GovernanceModuleId {
  if (action.startsWith("consent.")) return "consent_records";
  if (action.startsWith("identity.")) return "identity_verification";
  if (action.startsWith("replica.")) return "replica_revocation";
  if (action.startsWith("voice.")) return "voice_clone_permissions";
  if (action.startsWith("policy.")) return "policy_templates";
  if (action.startsWith("takedown.")) return "takedown_requests";
  if (action.startsWith("retention.")) return "data_retention";
  if (action.startsWith("watermark.")) return "watermarking_c2pa";
  if (action.startsWith("access.")) return "audit_logs";
  if (action.startsWith("safety.")) return "audit_logs";
  return "audit_logs";
}

export function getAuditSeverityLabel(severity: AuditSeverity): string {
  return AUDIT_SEVERITY_LABELS[severity];
}

export function getAuditActionSeverity(action: AuditLogAction): AuditSeverity {
  if (action.endsWith(".revoked")) return "warning";
  if (action.endsWith(".deleted") || action.startsWith("takedown."))
    return "critical";
  if (action.startsWith("safety.flag_raised")) return "warning";
  if (action.endsWith(".failed")) return "error";
  if (action.startsWith("access.") || action.startsWith("policy."))
    return "info";
  return "info";
}

export function filterAuditLogs(
  events: AuditLogEvent[],
  filter: AuditLogFilter,
): AuditLogEvent[] {
  return events.filter((evt) => {
    if (filter.moduleId && evt.moduleId !== filter.moduleId) return false;
    if (filter.action && evt.action !== filter.action) return false;
    if (
      filter.actor &&
      !evt.actor.toLowerCase().includes(filter.actor.toLowerCase())
    )
      return false;
    if (filter.targetType && evt.targetType !== filter.targetType) return false;
    if (filter.after && evt.timestamp < filter.after) return false;
    if (filter.before && evt.timestamp > filter.before) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const searchable =
        `${evt.action} ${evt.actor} ${evt.targetId ?? ""} ${evt.targetType ?? ""}`.toLowerCase();
      if (!searchable.includes(searchLower)) return false;
    }
    return true;
  });
}

export function summarizeAuditLogs(events: AuditLogEvent[]): AuditLogSummary {
  const byModule: Partial<Record<GovernanceModuleId, number>> = {};
  const byAction: Partial<Record<AuditLogAction, number>> = {};
  const bySeverity: Partial<Record<AuditSeverity, number>> = {};

  for (const evt of events) {
    byModule[evt.moduleId] = (byModule[evt.moduleId] ?? 0) + 1;
    byAction[evt.action] = (byAction[evt.action] ?? 0) + 1;
    const sev = getAuditActionSeverity(evt.action);
    bySeverity[sev] = (bySeverity[sev] ?? 0) + 1;
  }

  return {
    totalEvents: events.length,
    byModule,
    byAction,
    bySeverity,
    filteredEvents: events,
  };
}

// ─── Demo audit events ────────────────────────────────────────────────────

export const DEMO_AUDIT_EVENTS: AuditLogEvent[] = [
  {
    id: "audit_evt_000001",
    moduleId: "consent_records",
    action: "consent.signed",
    actor: "system",
    targetId: "sample_ethen_replica",
    targetType: "replica",
    timestamp: "2025-01-15T09:00:00.000Z",
    metadata: { subject: "Upcube Ethen", method: "manual" },
  },
  {
    id: "audit_evt_000002",
    moduleId: "replica_revocation",
    action: "replica.created",
    actor: "system",
    targetId: "sample_ethen_replica",
    targetType: "replica",
    timestamp: "2025-01-15T09:05:00.000Z",
    metadata: { modelType: "browser_glb", status: "active" },
  },
  {
    id: "audit_evt_000003",
    moduleId: "consent_records",
    action: "consent.signed",
    actor: "system",
    targetId: "sample_custom_replica_001",
    targetType: "replica",
    timestamp: "2025-03-10T14:30:00.000Z",
    metadata: {
      subject: "Demo Subject",
      method: "manual",
      status: "pending_verification",
    },
  },
  {
    id: "audit_evt_000004",
    moduleId: "consent_records",
    action: "consent.revoked",
    actor: "admin_demo",
    targetId: "sample_custom_replica_001",
    targetType: "replica",
    timestamp: "2025-04-22T11:15:00.000Z",
    metadata: {
      reason: "Subject requested data deletion",
      previousStatus: "active",
    },
  },
  {
    id: "audit_evt_000005",
    moduleId: "replica_revocation",
    action: "replica.revoked",
    actor: "system",
    targetId: "sample_custom_replica_001",
    targetType: "replica",
    timestamp: "2025-04-22T11:16:00.000Z",
    metadata: {
      reason: "Consent revoked — replica suspended within 24h window",
      triggeredBy: "consent.revoked",
    },
  },
  {
    id: "audit_evt_000006",
    moduleId: "policy_templates",
    action: "policy.updated",
    actor: "admin_demo",
    targetId: "policy_base_v1",
    targetType: "policy",
    timestamp: "2025-04-22T13:00:00.000Z",
    metadata: {
      version: "1.1",
      changes: "Added data retention defaults for leads and audit logs",
    },
  },
  {
    id: "audit_evt_000007",
    moduleId: "data_retention",
    action: "retention.updated",
    actor: "admin_demo",
    targetId: "retention_policy_main",
    targetType: "retention_policy",
    timestamp: "2025-04-22T13:05:00.000Z",
    metadata: {
      transcriptionRetention: "days_90",
      audioRetention: "days_90",
      previous: "days_30",
    },
  },
  {
    id: "audit_evt_000008",
    moduleId: "consent_records",
    action: "consent.signed",
    actor: "system",
    targetId: "sample_website_concierge_replica",
    targetType: "replica",
    timestamp: "2025-05-01T10:00:00.000Z",
    metadata: {
      subject: "Website Concierge Template",
      method: "enterprise_attestation",
      status: "active",
    },
  },
  {
    id: "audit_evt_000009",
    moduleId: "consent_records",
    action: "safety.flag_raised",
    actor: "system",
    targetId: "sample_custom_replica_002",
    targetType: "replica",
    timestamp: "2025-05-10T16:45:00.000Z",
    metadata: {
      reason:
        "Automated similarity check flagged potential unauthorized likeness",
      threshold: "0.92",
    },
  },
  {
    id: "audit_evt_000010",
    moduleId: "audit_logs",
    action: "safety.flag_resolved",
    actor: "admin_demo",
    targetId: "sample_custom_replica_002",
    targetType: "replica",
    timestamp: "2025-05-11T09:30:00.000Z",
    metadata: {
      resolution: "Manual review confirmed authorized use",
      previousFlagId: "audit_evt_000009",
    },
  },
  {
    id: "audit_evt_000011",
    moduleId: "voice_clone_permissions",
    action: "voice.cloned",
    actor: "system",
    targetId: "sample_ethen_voice",
    targetType: "voice",
    timestamp: "2025-05-15T08:00:00.000Z",
    metadata: { provider: "not_configured", language: "en-US" },
  },
  {
    id: "audit_evt_000012",
    moduleId: "policy_templates",
    action: "policy.approved",
    actor: "admin_demo",
    targetId: "policy_base_v1",
    targetType: "policy",
    timestamp: "2025-05-15T08:30:00.000Z",
    metadata: { version: "1.1", approvedFor: "development_preview" },
  },
];
