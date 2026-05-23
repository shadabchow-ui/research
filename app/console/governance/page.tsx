import type { Metadata } from "next";
import { StatusChip } from "components/ui/status-chip";
import { MetricCard } from "components/avatar-cloud/MetricCard";
import {
  GOVERNANCE_MODULES,
  DEMO_GOVERNANCE_SNAPSHOT,
  DEMO_AUDIT_EVENTS,
  BASE_ALLOWED_USE_POLICY,
  DEFAULT_RETENTION_POLICY,
  ZERO_DATA_RETENTION_POLICY,
  CUSTOM_30_DAY_POLICY,
  DEMO_RETENTION_POLICIES,
  DEMO_DELETION_REQUESTS,
  DEMO_EXPORT_REQUESTS,
  RETAINED_DATA_CATEGORIES,
  DURATION_LABELS,
  shouldRetainTranscript,
  shouldRetainAudio,
  shouldRetainVideo,
  describeRetentionDuration,
  type GovernanceModuleDef,
  type GovernanceReadiness,
  type PolicyRule,
  type AuditLogEvent,
  type AuditSeverity,
  type DataRetentionPolicy,
  AUDIT_SEVERITY_LABELS,
  getAuditActionSeverity,
  getAuditSeverityLabel,
} from "lib/avatar-cloud/governance";

import {
  SAMPLE_CONSENT_RECORDS,
  CONSENT_SCOPE_LABELS,
  CONSENT_STATUS_LABELS,
  VERIFICATION_METHOD_LABELS,
  isConsentActive,
  isConsentRevoked,
  getActiveScopes,
} from "lib/avatar-cloud";

export const metadata: Metadata = {
  title: "Governance Center — Console",
  description:
    "Upcube Avatar Cloud Governance Center — consent, identity, revocation, watermarking, audit, and policy controls.",
};

const READINESS_LABELS: Record<GovernanceReadiness, string> = {
  not_configured: "not_configured",
  planned: "planned",
  demo: "demo",
  live: "live",
};

const READINESS_VARIANTS: Record<
  GovernanceReadiness,
  "success" | "warning" | "error" | "info" | "neutral"
> = {
  not_configured: "error",
  planned: "warning",
  demo: "info",
  live: "success",
};

const ENFORCEMENT_LABELS: Record<PolicyRule["enforcement"], string> = {
  block: "block",
  review: "requires review",
  warn: "warn only",
};

const CATEGORY_LABELS: Record<PolicyRule["category"], string> = {
  content: "Content",
  identity: "Identity",
  voice: "Voice",
  replica: "Replica",
  data: "Data",
  safety: "Safety",
};

const DEPENDENCY_NAMES: Record<string, string> = {
  consent_records: "Consent Records",
  identity_verification: "Identity Verification",
  audit_logs: "Audit Logs",
};

export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold text-avatar-text">
            Governance Center
          </h1>
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            spec
          </span>
        </div>
        <p className="text-lg text-avatar-text-muted">
          Manage consent, identity verification, voice clone permissions,
          replica revocation, watermarking, audit, policies, takedowns, and data
          retention. All controls are in specification / planning stage — not
          yet active in production.
        </p>
      </div>

      {/* Snapshot */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Governance Snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Consent Records"
            value="0 active"
            subtitle={`${DEMO_GOVERNANCE_SNAPSHOT.consentRevoked} revoked`}
            demo={true}
          />
          <MetricCard
            title="Identity Verification"
            value={
              DEMO_GOVERNANCE_SNAPSHOT.identityVerificationLevel === "none"
                ? "not configured"
                : DEMO_GOVERNANCE_SNAPSHOT.identityVerificationLevel
            }
            subtitle="custom replicas blocked"
            demo={true}
          />
          <MetricCard
            title="Watermarking"
            value={
              DEMO_GOVERNANCE_SNAPSHOT.watermarkingMode === "none"
                ? "not configured"
                : DEMO_GOVERNANCE_SNAPSHOT.watermarkingMode
            }
            subtitle="C2PA not ready"
            demo={true}
          />
          <MetricCard
            title="Audit Events"
            value={String(DEMO_AUDIT_EVENTS.length)}
            subtitle={`${DEMO_GOVERNANCE_SNAPSHOT.pendingTakedowns} pending takedowns`}
            demo={true}
          />
        </div>
      </div>

      {/* Safety-critical banner */}
      <div className="mb-10 rounded-xl border border-avatar-error/30 bg-avatar-error-subtle/20 p-5">
        <div className="mb-2 flex items-center gap-2">
          <StatusChip label="Safety Lock" variant="error" />
          <span className="text-sm font-semibold text-avatar-error">
            Custom features disabled until governance is active.
          </span>
        </div>
        <p className="text-sm leading-relaxed text-avatar-text-muted">
          User-created replicas and voice cloning are disabled until consent
          records, identity verification, and approval workflows are fully
          configured and tested. Avatar output must be clearly disclosed as
          AI-generated. All unimplemented controls below reflect the product
          planning roadmap — none are active in production.
        </p>
      </div>

      {/* Module cards */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Governance Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOVERNANCE_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="avatar-panel-hover flex flex-col gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-avatar-text">
                  {mod.title}
                </h3>
                <StatusChip
                  label={READINESS_LABELS[mod.readiness]}
                  variant={READINESS_VARIANTS[mod.readiness]}
                  dot={mod.readiness === "live"}
                />
              </div>
              <p className="text-xs leading-relaxed text-avatar-text-muted">
                {mod.description}
              </p>
              {mod.warning && (
                <p className="rounded-lg border border-avatar-warning/20 bg-avatar-warning-subtle/10 px-3 py-2 text-xs font-medium text-avatar-warning">
                  {mod.warning}
                </p>
              )}
              {mod.dependencies.length > 0 && (
                <div className="text-[10px] text-avatar-text-dim">
                  Depends on:{" "}
                  {mod.dependencies
                    .map((d) => DEPENDENCY_NAMES[d] ?? d)
                    .join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Consent records */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Consent Records
        </h2>
        <p className="mb-4 text-sm text-avatar-text-muted">
          Each custom replica or voice clone requires an active consent record.
          Records transition through pending, active, and revoked states.
          Revocation immediately disables the associated replica and voice.
        </p>
        <div className="space-y-4">
          {SAMPLE_CONSENT_RECORDS.map((record) => {
            const active = isConsentActive(record);
            const revoked = isConsentRevoked(record);
            const scopes = getActiveScopes(record);

            return (
              <div key={record.id} className="avatar-panel overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-avatar-border px-5 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-avatar-text">
                      {record.subjectName}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-avatar-text-dim font-mono">
                      {record.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusChip
                      label={CONSENT_STATUS_LABELS[record.revocationStatus]}
                      variant={
                        active ? "success" : revoked ? "error" : "warning"
                      }
                    />
                    <StatusChip
                      label={
                        record.customReplicaEnabled
                          ? "Replica on"
                          : "Replica off"
                      }
                      variant={
                        record.customReplicaEnabled ? "success" : "neutral"
                      }
                    />
                    <StatusChip
                      label={
                        record.customVoiceEnabled ? "Voice on" : "Voice off"
                      }
                      variant={
                        record.customVoiceEnabled ? "success" : "neutral"
                      }
                    />
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="mb-3 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-avatar-text-dim">
                        Verification
                      </span>
                      <p className="text-avatar-text">
                        {VERIFICATION_METHOD_LABELS[record.verificationMethod]}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-avatar-text-dim">
                        Signed
                      </span>
                      <p className="text-avatar-text">
                        {new Date(record.signedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-avatar-text-dim">
                        Version
                      </span>
                      <p className="text-avatar-text">
                        {record.consentTextVersion}
                      </p>
                    </div>
                    {revoked && (
                      <div>
                        <span className="text-xs text-avatar-text-dim">
                          Revoked
                        </span>
                        <p className="text-avatar-error">
                          {new Date(record.revokedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="text-xs text-avatar-text-dim">
                      Scopes ({scopes.length})
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {scopes.length === 0 ? (
                        <span className="text-xs text-avatar-text-dim/60 italic">
                          No active scopes
                        </span>
                      ) : (
                        scopes.map((scope) => (
                          <span
                            key={scope}
                            className="rounded-full bg-avatar-accent-subtle px-2.5 py-0.5 text-[11px] font-medium text-avatar-accent"
                          >
                            {CONSENT_SCOPE_LABELS[scope]}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {record.notes && (
                    <div className="rounded-lg bg-avatar-surface/50 px-4 py-2.5">
                      <p className="text-xs text-avatar-text-muted">
                        {record.notes}
                      </p>
                    </div>
                  )}

                  {record.auditTrail.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-avatar-text-dim hover:text-avatar-text">
                        Audit trail ({record.auditTrail.length} entries)
                      </summary>
                      <div className="mt-2 space-y-1.5">
                        {record.auditTrail.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded bg-avatar-bg px-3 py-1.5 text-[11px]"
                          >
                            <div>
                              <span className="font-medium text-avatar-text">
                                {entry.action}
                              </span>
                              <span className="ml-2 text-avatar-text-dim">
                                by {entry.performedBy}
                              </span>
                              <span className="ml-2 text-avatar-text-dim/60">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <StatusChip
                                label={entry.newStatus}
                                variant={
                                  entry.newStatus === "active"
                                    ? "success"
                                    : entry.newStatus === "revoked"
                                      ? "error"
                                      : "warning"
                                }
                                dot={false}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-avatar-warning/30 bg-avatar-warning/10 p-4">
          <p className="text-sm text-avatar-warning/80">
            Custom replicas and voice cloning remain disabled until production
            consent verification (liveness check, document verification, or
            enterprise attestation) exists. No e-signature, identity
            verification, or legal automation is active. These are demo/static
            records for specification purposes only.
          </p>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Audit Logs
        </h2>
        <p className="mb-4 text-sm text-avatar-text-muted">
          Governance audit trail for consent, identity, replica lifecycle,
          takedowns, policy changes, and safety flags. All events shown are
          demo/static — no real audit persistence, tamper-proof storage, or
          production enforcement exists.
        </p>

        <div className="avatar-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
            <div>
              <span className="text-sm font-medium text-avatar-text">
                Audit Events
              </span>
              <span className="ml-2 text-xs text-avatar-text-dim">
                {DEMO_AUDIT_EVENTS.length} demo events
              </span>
            </div>
            <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
              demo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-avatar-border">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim">
                    Event
                  </th>
                  <th className="hidden px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim sm:table-cell">
                    Module
                  </th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim">
                    Severity
                  </th>
                  <th className="hidden px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim lg:table-cell">
                    Actor
                  </th>
                  <th className="hidden px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim md:table-cell">
                    Target
                  </th>
                  <th className="hidden whitespace-nowrap px-5 py-3 font-medium uppercase tracking-wider text-avatar-text-dim lg:table-cell">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-avatar-border">
                {DEMO_AUDIT_EVENTS.map((event) => {
                  const severity = getAuditActionSeverity(event.action);
                  const moduleLabel =
                    GOVERNANCE_MODULES.find((m) => m.id === event.moduleId)
                      ?.title ?? event.moduleId;

                  return (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-avatar-surface-hover"
                    >
                      <td className="px-5 py-3">
                        <span className="font-medium text-avatar-text">
                          {event.action}
                        </span>
                        {event.metadata &&
                          Object.keys(event.metadata).length > 0 && (
                            <div className="mt-0.5 text-[10px] text-avatar-text-dim">
                              {JSON.stringify(event.metadata).slice(0, 60)}
                            </div>
                          )}
                      </td>
                      <td className="hidden px-5 py-3 text-avatar-text-muted sm:table-cell">
                        {moduleLabel}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            severity === "critical"
                              ? "bg-avatar-error/10 text-avatar-error"
                              : severity === "error"
                                ? "bg-avatar-error/10 text-avatar-error"
                                : severity === "warning"
                                  ? "bg-avatar-warning/10 text-avatar-warning"
                                  : "bg-avatar-info/10 text-avatar-info"
                          }`}
                        >
                          {getAuditSeverityLabel(severity)}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3 text-avatar-text-muted lg:table-cell">
                        {event.actor}
                      </td>
                      <td className="hidden max-w-40 truncate px-5 py-3 text-avatar-text-muted md:table-cell">
                        {event.targetId ? (
                          <span>
                            <span className="text-avatar-text-dim">
                              {event.targetType}:
                            </span>{" "}
                            {event.targetId.slice(0, 24)}
                          </span>
                        ) : (
                          <span className="text-avatar-text-dim/50">—</span>
                        )}
                      </td>
                      <td className="hidden whitespace-nowrap px-5 py-3 tabular-nums text-avatar-text-dim lg:table-cell">
                        {new Date(event.timestamp).toLocaleDateString()}{" "}
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-4">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-[10px] font-medium text-avatar-accent">
              demo
            </span>
            <span className="rounded bg-avatar-warning-subtle px-2 py-0.5 text-[10px] font-medium text-avatar-warning">
              not tamper-proof
            </span>
            <span className="rounded bg-avatar-info-subtle px-2 py-0.5 text-[10px] font-medium text-avatar-info">
              no external SIEM
            </span>
          </div>
          <p className="text-xs text-avatar-text-dim leading-relaxed">
            All audit events above are static demo records. In production, audit
            logs must be stored in an append-only, tamper-proof storage system
            with cryptographic integrity verification. Real audit logs will
            record actor identity (authenticated user), IP address, user agent,
            and a cryptographically verifiable chain. No compliance
            certifications are claimed at this stage.
          </p>
        </div>
      </div>

      {/* Allowed-use policy table */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Allowed-Use Policy
        </h2>
        <div className="avatar-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
            <div>
              <span className="text-sm font-medium text-avatar-text">
                {BASE_ALLOWED_USE_POLICY.name}
              </span>
              <span className="ml-2 text-xs text-avatar-text-dim">
                v{BASE_ALLOWED_USE_POLICY.version} — demo only
              </span>
            </div>
            <StatusChip label="demo" variant="info" dot={false} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-avatar-border">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
                    Category
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
                    Rule
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
                    Enforcement
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-avatar-text-dim">
                    Active
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-avatar-border">
                {BASE_ALLOWED_USE_POLICY.rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="transition-colors hover:bg-avatar-surface-hover"
                  >
                    <td className="px-5 py-3">
                      <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs text-avatar-accent">
                        {CATEGORY_LABELS[rule.category]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs leading-relaxed text-avatar-text-muted">
                      {rule.rule}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-avatar-text">
                        {ENFORCEMENT_LABELS[rule.enforcement]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusChip
                        label={rule.active ? "active" : "inactive"}
                        variant={rule.active ? "success" : "neutral"}
                        dot={rule.active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Data Retention Controls */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Data Retention Controls
        </h2>

        {/* Enforcement warning */}
        <div className="mb-6 rounded-xl border border-avatar-warning/30 bg-avatar-warning-subtle/10 p-4">
          <div className="mb-1 flex items-center gap-2">
            <StatusChip label="Specification only" variant="warning" />
            <span className="text-xs text-avatar-text-dim">
              Not production enforcement yet
            </span>
          </div>
          <p className="text-xs text-avatar-text-dim">
            All retention policies below are specification / demo only. No
            automated purge, deletion, or export pipeline exists. Policies
            require backend persistence, scheduled jobs, and a workflow engine
            before production enforcement.
          </p>
        </div>

        {/* Retention policies */}
        <h3 className="mb-3 text-sm font-semibold text-avatar-text-muted">
          Policies
        </h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_RETENTION_POLICIES.map((policy) => (
            <div
              key={policy.id}
              className="avatar-panel flex flex-col gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-avatar-text">
                  {policy.name}
                </h4>
                <StatusChip label="planned" variant="warning" dot={false} />
              </div>
              <p className="text-xs leading-relaxed text-avatar-text-muted">
                {policy.description}
              </p>
              <div className="space-y-1">
                {RETAINED_DATA_CATEGORIES.map((cat) => (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-avatar-text-dim">{cat.label}</span>
                    <span className="font-medium text-avatar-text">
                      {describeRetentionDuration(
                        policy.mode[cat.retentionField],
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {policy.notes && (
                <p className="rounded-lg bg-avatar-surface/50 px-3 py-2 text-[10px] text-avatar-text-dim">
                  {policy.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Default policy table */}
        <h3 className="mb-3 text-sm font-semibold text-avatar-text-muted">
          Default retention (applied to all sessions)
        </h3>
        <div className="mb-6 overflow-hidden rounded-xl border border-avatar-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-avatar-border bg-avatar-surface">
                <th className="px-4 py-3 text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Data category
                </th>
                <th className="px-4 py-3 text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Retention
                </th>
                <th className="px-4 py-3 text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Can retain
                </th>
                <th className="px-4 py-3 text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Exportable
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-avatar-border">
              {RETAINED_DATA_CATEGORIES.map((cat) => {
                const mode = DEFAULT_RETENTION_POLICY.mode;
                const field = cat.retentionField;
                const canRetain = (() => {
                  switch (cat.key) {
                    case "transcription":
                      return shouldRetainTranscript(mode);
                    case "audio_recording":
                      return shouldRetainAudio(mode);
                    case "video_output":
                      return shouldRetainVideo(mode);
                    default:
                      return true;
                  }
                })();
                return (
                  <tr
                    key={cat.key}
                    className="bg-avatar-bg/50 hover:bg-avatar-surface-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-avatar-text">
                      {cat.label}
                    </td>
                    <td className="px-4 py-3 text-xs text-avatar-text">
                      {describeRetentionDuration(mode[field])}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip
                        label={canRetain ? "Yes" : "No"}
                        variant={canRetain ? "success" : "error"}
                        dot={false}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-avatar-text-muted">
                        Planned
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Demo deletion requests */}
        <h3 className="mb-3 text-sm font-semibold text-avatar-text-muted">
          Deletion / export requests (demo)
        </h3>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="avatar-panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-avatar-text-dim">
                Deletion requests
              </span>
              <span className="text-xs text-avatar-text">
                {DEMO_DELETION_REQUESTS.length} pending
              </span>
            </div>
            {DEMO_DELETION_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="mb-2 rounded-lg bg-avatar-surface/50 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-avatar-text">
                      {req.targetCategory.replace("_", " ")}
                    </span>
                    <p className="text-[10px] text-avatar-text-dim">
                      {req.reason}
                    </p>
                  </div>
                  <StatusChip
                    label={req.status}
                    variant="warning"
                    dot={false}
                  />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-avatar-text-dim italic">
              All requests are demo/pending — no actual deletion pipeline
              exists.
            </p>
          </div>

          <div className="avatar-panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-avatar-text-dim">
                Export requests
              </span>
              <span className="text-xs text-avatar-text">
                {DEMO_EXPORT_REQUESTS.length} pending
              </span>
            </div>
            {DEMO_EXPORT_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="mb-2 rounded-lg bg-avatar-surface/50 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-avatar-text">
                      {req.targetCategory.replace("_", " ")} ({req.format})
                    </span>
                    <p className="text-[10px] text-avatar-text-dim">
                      Requested by {req.requestedBy}
                    </p>
                  </div>
                  <StatusChip
                    label={req.status}
                    variant="warning"
                    dot={false}
                  />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-avatar-text-dim italic">
              All requests are demo/pending — no actual export pipeline exists.
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-avatar-text-dim">
          All retention periods, deletion requests, and export requests are
          specification / demo only. No automated purge pipeline, scheduled
          deletion jobs, or data export service is active. Real enforcement
          requires backend persistence, legal review, and workflow automation.
        </p>
      </div>

      {/* Implementation notes */}
      <section className="rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-5">
        <h3 className="mb-2 text-sm font-semibold text-avatar-text-dim">
          Governance Center — Implementation Notes
        </h3>
        <ul className="space-y-1 text-xs text-avatar-text-dim">
          <li>
            • This is a specification and static surface only. No governance
            controls are active in production.
          </li>
          <li>
            • Consent records, identity verification, and audit logs are not yet
            implemented.
          </li>
          <li>
            • Watermarking and C2PA content credentials are planned — not
            configured.
          </li>
          <li>
            • Voice cloning and custom replica creation are disabled until
            governance is fully configured.
          </li>
          <li>
            • Takedown request workflow is demo-only — legal team integration
            required before activation.
          </li>
          <li>
            • No compliance certifications are claimed — all modules show their
            current readiness status.
          </li>
          <li>
            • Real enforcement requires backend persistence, auth, and workflow
            engine — all deferred.
          </li>
        </ul>
      </section>
    </div>
  );
}
