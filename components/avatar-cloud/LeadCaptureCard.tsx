"use client";

import { useState, useCallback } from "react";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";
import {
  INTENT_OPTIONS,
  createLeadCaptureSubmission,
  formatLeadSummary,
} from "lib/avatar-cloud/lead-capture";
import type { LeadCaptureSubmission } from "lib/avatar-cloud/lead-capture";

interface LeadCaptureCardProps {
  title?: string;
  description?: string;
}

export function LeadCaptureCard({
  title = "Get in touch",
  description = "Submit your information and we'll follow up.",
}: LeadCaptureCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [intent, setIntent] = useState("general");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] =
    useState<LeadCaptureSubmission | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;

      const submission = createLeadCaptureSubmission({
        name: name.trim() || undefined,
        email: email.trim(),
        company: company.trim() || undefined,
        intent: intent as LeadCaptureSubmission["intent"],
        interest: interest.trim() || undefined,
        message: message.trim() || undefined,
      });

      setLastSubmission(submission);
      setSubmitted(true);
    },
    [name, email, company, intent, interest, message],
  );

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setLastSubmission(null);
    setName("");
    setEmail("");
    setCompany("");
    setIntent("general");
    setInterest("");
    setMessage("");
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-avatar-border">
      <div className="flex items-center justify-between border-b border-avatar-border bg-avatar-surface px-5 py-3">
        <h3 className="text-sm font-semibold text-avatar-text">{title}</h3>
        <StatusChip label="Demo — local only" variant="warning" dot={false} />
      </div>

      {submitted && lastSubmission ? (
        <div className="px-5 py-6">
          <div className="mb-4 rounded-xl border border-avatar-success/20 bg-avatar-success-subtle px-4 py-3">
            <p className="text-sm font-medium text-avatar-success">
              Thanks! Demo submission received.
            </p>
            <p className="mt-1 text-xs text-avatar-text-dim">
              This is a local demo. No data was stored or sent.
            </p>
          </div>
          <div className="mb-4">
            <span className="mb-1 block text-xs font-medium text-avatar-text-dim uppercase">
              Captured data
            </span>
            <pre className="rounded-lg bg-avatar-bg px-3 py-2 text-xs text-avatar-text-muted whitespace-pre-wrap">
              {formatLeadSummary(lastSubmission)}
            </pre>
          </div>
          <CTAButton onClick={handleReset} variant="secondary" size="sm">
            Reset form
          </CTAButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-avatar-text-dim">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-avatar-text-dim">
                Email <span className="text-avatar-error">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-avatar-text-dim">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company"
                className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-avatar-text-dim">
                Intent
              </label>
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              >
                {INTENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-avatar-text-dim">
              Interest / Use case
            </label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="What are you interested in?"
              className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-avatar-text-dim">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="w-full resize-y rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!email.trim()}
              className="rounded-xl bg-avatar-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-avatar-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit (demo)
            </button>
            <span className="text-xs text-avatar-text-dim">
              No data stored. Local demo only.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
