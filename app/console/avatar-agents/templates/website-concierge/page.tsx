import type { Metadata } from "next";
import {
  WEBSITE_CONCIERGE_TEMPLATE,
  SAMPLE_CAPTURED_LEAD_DEMO,
} from "lib/avatar-cloud/templates";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";

export const metadata: Metadata = {
  title: "Website Concierge — Upcube Console",
  description: "Website Concierge / AI SDR template for Upcube Live Avatar.",
};

export default function WebsiteConciergeTemplatePage() {
  const t = WEBSITE_CONCIERGE_TEMPLATE;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <StatusChip label="Sample Template" variant="info" />
          <StatusChip label="Sales / Marketing" variant="neutral" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-avatar-text md:text-4xl">
          {t.name}
        </h1>
        <p className="mt-3 text-lg text-avatar-text-muted">{t.description}</p>
      </div>

      {/* Quick actions */}
      <div className="mb-10 flex flex-wrap gap-3">
        <CTAButton href="/products/live-avatar" variant="primary" size="sm">
          Open demo
        </CTAButton>
        <CTAButton href="/console/avatar-agents" variant="secondary" size="sm">
          Back to agents
        </CTAButton>
        <CTAButton href="#" variant="ghost" size="sm" disabled>
          Configure (coming soon)
        </CTAButton>
      </div>

      {/* Use cases */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Target use cases
        </h2>
        <div className="flex flex-wrap gap-2">
          {t.targetUseCases.map((uc) => (
            <StatusChip key={uc} label={uc} variant="neutral" />
          ))}
        </div>
      </section>

      {/* Default greeting */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Default greeting
        </h2>
        <div className="avatar-panel rounded-xl p-5 text-sm leading-relaxed text-avatar-text-muted italic">
          &ldquo;{t.defaultGreeting}&rdquo;
        </div>
      </section>

      {/* Goals */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">Goals</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.goals.map((goal) => (
            <div
              key={goal.id}
              className="avatar-panel flex items-start gap-3 p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-avatar-accent/20 text-xs font-bold text-avatar-accent">
                {goal.id.split("_").pop()}
              </div>
              <div>
                <h3 className="text-sm font-medium text-avatar-text">
                  {goal.label}
                </h3>
                <p className="text-xs text-avatar-text-dim">
                  {goal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested prompts */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Suggested prompts
        </h2>
        <div className="flex flex-wrap gap-2">
          {t.suggestedPromptChips.map((chip) => (
            <span
              key={chip}
              className="rounded-lg border border-avatar-border-light bg-avatar-surface px-3 py-1.5 text-xs text-avatar-text-muted"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Lead capture fields */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Lead capture fields
        </h2>
        <div className="overflow-hidden rounded-xl border border-avatar-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-avatar-border bg-avatar-surface">
                <th className="px-4 py-3 text-left text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Field
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Required
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-avatar-text-dim uppercase tracking-wider">
                  Placeholder
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-avatar-border">
              {t.leadCaptureFields.map((field) => (
                <tr key={field.name} className="bg-avatar-bg/50">
                  <td className="px-4 py-3 font-medium text-avatar-text capitalize">
                    {field.name}
                  </td>
                  <td className="px-4 py-3 text-avatar-text-muted">
                    {field.type}
                  </td>
                  <td className="px-4 py-3">
                    {field.required ? (
                      <span className="text-avatar-success">Required</span>
                    ) : (
                      <span className="text-avatar-text-dim">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-avatar-text-dim">
                    {field.placeholder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Qualification questions */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Qualification questions
        </h2>
        <div className="space-y-3">
          {t.qualificationQuestions.map((q) => (
            <div key={q.id} className="avatar-panel p-4">
              <h3 className="mb-1 text-sm font-medium text-avatar-text">
                {q.question}
              </h3>
              <p className="mb-2 text-xs text-avatar-text-dim capitalize">
                Intent: {q.intent}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {q.suggestedResponses.map((r) => (
                  <span
                    key={r}
                    className="rounded-md bg-avatar-surface-hover px-2 py-1 text-xs text-avatar-text-muted"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Handoff actions */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Handoff actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.handoffActions.map((action) => (
            <div key={action.type} className="avatar-panel p-4">
              <h3 className="mb-1 text-sm font-semibold text-avatar-text">
                {action.label}
              </h3>
              <p className="mb-2 text-xs text-avatar-text-muted">
                {action.description}
              </p>
              <StatusChip
                label={
                  action.placeholderUrl === "not provided"
                    ? "Not configured"
                    : "Ready"
                }
                variant={
                  action.placeholderUrl === "not provided"
                    ? "warning"
                    : "success"
                }
                dot={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Conversation style */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Conversation style
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="avatar-panel flex items-center gap-3 p-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Speed
            </span>
            <span className="text-sm text-avatar-text capitalize">
              {t.style.speed}
            </span>
          </div>
          <div className="avatar-panel flex items-center gap-3 p-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Tone
            </span>
            <span className="text-sm text-avatar-text">{t.style.tone}</span>
          </div>
          <div className="avatar-panel flex items-center gap-3 p-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Formality
            </span>
            <span className="text-sm text-avatar-text capitalize">
              {t.style.formality.replace("_", " ")}
            </span>
          </div>
          <div className="avatar-panel flex items-center gap-3 p-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Response
            </span>
            <span className="text-sm text-avatar-text capitalize">
              {t.style.responseLength}
            </span>
          </div>
        </div>
      </section>

      {/* Demo lead preview */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Sample captured lead (demo)
        </h2>
        <div className="avatar-panel rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <StatusChip label="Demo data" variant="warning" dot={false} />
            <span className="text-xs text-avatar-text-dim">
              Not a real lead. No data stored.
            </span>
          </div>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Name
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.name}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Email
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.email}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Phone
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.phone}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Company
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.company}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Interest
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.interest}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-avatar-text-dim uppercase">
                Handoff needed
              </span>
              <p className="text-sm text-avatar-text">
                {SAMPLE_CAPTURED_LEAD_DEMO.handoffNeeded
                  ? "Yes — book_demo"
                  : "No"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Qualification
            </span>
            <div className="mt-1 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <p className="text-xs text-avatar-text-muted">
                <span className="text-avatar-text-dim">Budget:</span>{" "}
                {SAMPLE_CAPTURED_LEAD_DEMO.qualification.budgetRange}
              </p>
              <p className="text-xs text-avatar-text-muted">
                <span className="text-avatar-text-dim">Timeline:</span>{" "}
                {SAMPLE_CAPTURED_LEAD_DEMO.qualification.timeline}
              </p>
              <p className="text-xs text-avatar-text-muted">
                <span className="text-avatar-text-dim">Decision maker:</span>{" "}
                {SAMPLE_CAPTURED_LEAD_DEMO.qualification.decisionMaker}
              </p>
              <p className="text-xs text-avatar-text-muted">
                <span className="text-avatar-text-dim">Need:</span>{" "}
                {SAMPLE_CAPTURED_LEAD_DEMO.qualification.needDescription}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-avatar-text-dim uppercase">
              Conversation summary
            </span>
            <p className="mt-1 text-sm leading-relaxed text-avatar-text-muted">
              {SAMPLE_CAPTURED_LEAD_DEMO.conversationSummary}
            </p>
          </div>
        </div>
      </section>

      {/* System prompt */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-avatar-text">
          Persona system prompt
        </h2>
        <pre className="avatar-panel overflow-x-auto whitespace-pre-wrap rounded-xl p-5 text-sm leading-relaxed text-avatar-text-muted">
          {t.personaSystemPrompt}
        </pre>
      </section>
    </div>
  );
}
