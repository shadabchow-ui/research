"use client";

import { useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";
import {
  BUILDER_TEMPLATES,
  BUILDER_REPLICAS,
  BUILDER_VOICES,
  BUILDER_KNOWLEDGE_BASES,
  BUILDER_STEPS,
  createDefaultBuilderState,
  type BuilderState,
  type BuilderTemplate,
} from "lib/avatar-cloud/builder-data";
import type { EmbedBootstrapConfig } from "lib/avatar-cloud/embed";
import { getEmbedSnippet } from "lib/avatar-cloud/embed";

const TONE_LABELS: Record<string, string> = {
  friendly_professional: "Friendly & Professional",
  warm_professional: "Warm & Professional",
  confident_professional: "Confident & Professional",
  patient_helpful: "Patient & Helpful",
  encouraging_instructive: "Encouraging & Instructive",
  enthusiastic_informative: "Enthusiastic & Informative",
  helpful_friendly: "Helpful & Friendly",
};

function StepIndicator({
  steps,
  currentIndex,
  goTo,
}: {
  steps: typeof BUILDER_STEPS;
  currentIndex: number;
  goTo: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isComplete = i < currentIndex;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => goTo(i)}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              isActive
                ? "bg-avatar-accent/10 text-avatar-accent font-medium"
                : isComplete
                  ? "text-avatar-text-muted hover:text-avatar-text"
                  : "text-avatar-text-dim cursor-default",
            )}
          >
            <span
              className={clsx(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium",
                isActive
                  ? "bg-avatar-accent text-white"
                  : isComplete
                    ? "bg-avatar-success/20 text-avatar-success"
                    : "bg-avatar-surface text-avatar-text-dim",
              )}
            >
              {isComplete ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SummaryPanel({ state }: { state: BuilderState }) {
  const template = state.template;
  const replica = BUILDER_REPLICAS.find((r) => r.id === state.replicaId);
  const voice = BUILDER_VOICES.find((v) => v.id === state.voiceId);
  const knowledgeCount = state.knowledgeBaseIds.length;

  return (
    <div className="avatar-panel flex flex-col gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-avatar-text-dim">
        Summary
      </h4>
      <div className="flex flex-col gap-2 text-xs">
        <div>
          <span className="text-avatar-text-dim">Template: </span>
          <span className="text-avatar-text-muted">
            {template?.name ?? "Not selected"}
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Avatar: </span>
          <span className="text-avatar-text-muted">
            {replica?.label ?? "Default"}
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Voice: </span>
          <span className="text-avatar-text-muted">
            {voice?.label ?? "None"}
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Persona: </span>
          <span className="text-avatar-text-muted">
            {template?.personaName ?? "-"}
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Knowledge: </span>
          <span className="text-avatar-text-muted">
            {knowledgeCount} base(s)
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Greeting: </span>
          <span className="text-avatar-text-muted">
            {state.greetingMessage
              ? state.greetingMessage.slice(0, 40) +
                (state.greetingMessage.length > 40 ? "..." : "")
              : "Default"}
          </span>
        </div>
        <div>
          <span className="text-avatar-text-dim">Embed: </span>
          <span className="text-avatar-text-muted">
            {state.embedPosition} · {state.embedTheme}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmbedSnippetSection({ state }: { state: BuilderState }) {
  const config: EmbedBootstrapConfig = {
    agentId: state.template?.id ?? "custom_agent",
    sessionToken: "demo_session_token_replace_in_production",
    allowedDomains: ["upcube.ai"],
    theme: state.embedTheme,
    position: state.embedPosition,
    defaultMode: state.embedDefaultMode,
    showBranding: state.showBranding,
    leadCaptureEnabled: state.leadCaptureEnabled,
  };
  const snippet = getEmbedSnippet(config);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-avatar-bg p-4">
        <pre className="overflow-x-auto text-xs leading-relaxed text-avatar-text-muted">
          <code>{snippet}</code>
        </pre>
      </div>
      <p className="text-xs text-avatar-text-dim">
        This is a demo embed snippet. In production, replace the script URL and
        session token with real values.
      </p>
    </div>
  );
}

function TemplateCard({
  t,
  selected,
  onSelect,
}: {
  t: BuilderTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "avatar-panel w-full cursor-pointer p-5 text-left transition-all",
        selected
          ? "ring-2 ring-avatar-accent border-avatar-accent"
          : "hover:border-avatar-border-light",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-avatar-text">{t.name}</h3>
        <StatusChip
          label={t.status === "available" ? "Available" : "Coming soon"}
          variant={t.status === "available" ? "info" : "warning"}
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-avatar-text-muted">
        {t.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-avatar-text-dim">
        <span>
          Persona:{" "}
          <span className="text-avatar-text-muted">{t.personaName}</span>
        </span>
        <span>
          Tone:{" "}
          <span className="text-avatar-text-muted">
            {TONE_LABELS[t.tone] ?? t.tone}
          </span>
        </span>
      </div>
    </button>
  );
}

export function AgentBuilder() {
  const [state, setState] = useState<BuilderState>(createDefaultBuilderState());
  const [stepIndex, setStepIndex] = useState(0);
  const [showEmbed, setShowEmbed] = useState(false);

  const update = useCallback(
    <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const selectTemplate = useCallback(
    (t: BuilderTemplate) => {
      update("template", t);
      update("greetingMessage", t.defaultGreeting);
    },
    [update],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0) return;
      if (i === 0 && !state.template) return;
      if (i >= BUILDER_STEPS.length) return;
      setStepIndex(i);
    },
    [state.template],
  );

  const step = BUILDER_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === BUILDER_STEPS.length - 1;
  const canGoNext = isFirst ? state.template !== null : true;

  const stepContent = useMemo(() => {
    switch (step?.id) {
      case "template":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Choose a template
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Start from a pre-configured template or build from scratch.
            </p>
            <div className="flex flex-col gap-3">
              {BUILDER_TEMPLATES.filter((t) => t.status === "available").map(
                (t) => (
                  <TemplateCard
                    key={t.id}
                    t={t}
                    selected={state.template?.id === t.id}
                    onSelect={() => selectTemplate(t)}
                  />
                ),
              )}
            </div>
          </div>
        );

      case "avatar":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Choose an avatar
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Select the visual representation for your agent. 3D models are
              placeholder — final assets coming soon.
            </p>
            <div className="flex flex-col gap-3">
              {BUILDER_REPLICAS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => update("replicaId", r.id)}
                  className={clsx(
                    "avatar-panel w-full cursor-pointer p-4 text-left transition-all",
                    state.replicaId === r.id
                      ? "ring-2 ring-avatar-accent border-avatar-accent"
                      : "hover:border-avatar-border-light",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-avatar-accent/30 to-avatar-accent/10">
                      <div className="h-6 w-6 rounded-full border-2 border-avatar-accent/50">
                        {state.replicaId === r.id && (
                          <div className="flex h-full w-full items-center justify-center text-xs text-avatar-accent">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-avatar-text">
                        {r.name}
                      </h3>
                      <p className="text-xs text-avatar-text-dim">{r.label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "voice":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Choose a voice
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Select a voice for your agent. Voices marked with &quot;requires
              API key&quot; will not function until a TTS provider is configured
              in your environment.
            </p>
            <div className="flex flex-col gap-3">
              {BUILDER_VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => update("voiceId", v.id)}
                  className={clsx(
                    "avatar-panel w-full cursor-pointer p-4 text-left transition-all",
                    state.voiceId === v.id
                      ? "ring-2 ring-avatar-accent border-avatar-accent"
                      : "hover:border-avatar-border-light",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-avatar-text">
                        {v.label}
                      </h3>
                      <p className="text-xs text-avatar-text-dim">
                        {v.provider === "not_configured"
                          ? "Demo voice — no TTS required"
                          : `Provider: ${v.provider}`}
                      </p>
                    </div>
                    <StatusChip
                      label={
                        v.provider === "not_configured"
                          ? "No setup"
                          : "External provider"
                      }
                      variant={
                        v.provider === "not_configured" ? "neutral" : "info"
                      }
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "persona": {
        const template = state.template;
        if (!template) {
          return (
            <p className="text-sm text-avatar-text-muted">
              Select a template first.
            </p>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Configure persona
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Review and adjust the persona for your agent.
            </p>
            <div className="avatar-panel flex flex-col gap-4 p-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                  Name
                </label>
                <input
                  type="text"
                  value={template.personaName}
                  readOnly
                  className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text opacity-70"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                  Tone
                </label>
                <input
                  type="text"
                  value={TONE_LABELS[template.tone] ?? template.tone}
                  readOnly
                  className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text opacity-70"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                  System prompt
                </label>
                <textarea
                  value={template.systemPrompt}
                  readOnly
                  rows={5}
                  className="w-full resize-none rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text opacity-70"
                />
              </div>
              <p className="text-xs text-avatar-text-dim">
                Persona editing will be available in a future update. These
                values are pre-configured for the selected template.
              </p>
            </div>
          </div>
        );
      }

      case "knowledge":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Add knowledge
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Select knowledge bases your agent can use to answer questions.
            </p>
            <div className="flex flex-col gap-3">
              {BUILDER_KNOWLEDGE_BASES.map((kb) => {
                const selected = state.knowledgeBaseIds.includes(kb.id);
                return (
                  <button
                    key={kb.id}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? state.knowledgeBaseIds.filter((id) => id !== kb.id)
                        : [...state.knowledgeBaseIds, kb.id];
                      update("knowledgeBaseIds", next);
                    }}
                    className={clsx(
                      "avatar-panel w-full cursor-pointer p-4 text-left transition-all",
                      selected
                        ? "ring-2 ring-avatar-accent border-avatar-accent"
                        : "hover:border-avatar-border-light",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-avatar-text">
                          {kb.name}
                        </h3>
                        <p className="text-xs text-avatar-text-dim">
                          {kb.documentCount} document(s) · {kb.indexType} index
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "flex h-5 w-5 items-center justify-center rounded border text-xs transition-colors",
                          selected
                            ? "bg-avatar-accent border-avatar-accent text-white"
                            : "border-avatar-border text-transparent",
                        )}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-avatar-text-dim">
              Document upload and knowledge base management will be available in
              a future update.
            </p>
          </div>
        );

      case "greeting":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Configure greeting
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Set the message your agent says when a conversation starts.
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                Greeting message
              </label>
              <textarea
                value={state.greetingMessage}
                onChange={(e) => update("greetingMessage", e.target.value)}
                rows={3}
                placeholder="Enter a greeting message..."
                className="w-full resize-none rounded-lg border border-avatar-border bg-avatar-bg px-4 py-3 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (state.template) {
                  update("greetingMessage", state.template.defaultGreeting);
                }
              }}
              className="self-start rounded-lg border border-avatar-border-light px-3 py-1.5 text-xs text-avatar-text-muted transition-colors hover:border-avatar-accent/50 hover:text-avatar-text"
            >
              Reset to template default
            </button>
          </div>
        );

      case "preview":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Preview your agent
            </h2>
            <p className="text-sm text-avatar-text-muted">
              This is a visual preview of how your agent will appear. The live
              Ethen interactive demo is available on the product page.
            </p>
            <div className="avatar-panel flex flex-col items-center gap-5 p-8 text-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-avatar-accent/30 to-avatar-accent/10 ring-2 ring-avatar-accent/30">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-avatar-accent transition-transform" />
                    <div className="h-3 w-3 rounded-full bg-avatar-accent/50 transition-transform" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-avatar-accent/40 to-avatar-accent/10" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-avatar-text">
                  {state.template?.name ?? "Custom Agent"}
                </h3>
                <p className="text-sm text-avatar-text-muted">
                  {state.template?.personaName ?? "AI Avatar Agent"} ·{" "}
                  {state.template
                    ? (TONE_LABELS[state.template.tone] ?? state.template.tone)
                    : "Default"}
                </p>
              </div>
              <div className="rounded-lg bg-avatar-bg px-5 py-3 text-sm italic text-avatar-text-dim">
                &ldquo;{state.greetingMessage || "Hello! How can I help you?"}
                &rdquo;
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusChip label="Demo preview" variant="info" />
                <StatusChip
                  label={
                    BUILDER_VOICES.find((v) => v.id === state.voiceId)
                      ?.provider === "not_configured"
                      ? "No voice"
                      : "Voice selected"
                  }
                  variant={
                    BUILDER_VOICES.find((v) => v.id === state.voiceId)
                      ?.provider === "not_configured"
                      ? "neutral"
                      : "success"
                  }
                />
                <StatusChip
                  label={
                    state.knowledgeBaseIds.length > 0
                      ? `${state.knowledgeBaseIds.length} knowledge base(s)`
                      : "No knowledge"
                  }
                  variant={
                    state.knowledgeBaseIds.length > 0 ? "success" : "warning"
                  }
                />
              </div>
            </div>
            <div>
              <CTAButton
                href="/products/live-avatar"
                variant="secondary"
                size="sm"
              >
                Try the live Ethen demo
              </CTAButton>
            </div>
          </div>
        );

      case "embed":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-avatar-text">
              Embed setup
            </h2>
            <p className="text-sm text-avatar-text-muted">
              Configure how your agent appears on your website. The embed SDK is
              in development — this is a preview of the configuration options.
            </p>
            <div className="avatar-panel flex flex-col gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                    Position
                  </label>
                  <select
                    value={state.embedPosition}
                    onChange={(e) =>
                      update(
                        "embedPosition",
                        e.target.value as BuilderState["embedPosition"],
                      )
                    }
                    className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="inline">Inline</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                    Theme
                  </label>
                  <select
                    value={state.embedTheme}
                    onChange={(e) =>
                      update(
                        "embedTheme",
                        e.target.value as BuilderState["embedTheme"],
                      )
                    }
                    className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-avatar-text-dim">
                    Default mode
                  </label>
                  <select
                    value={state.embedDefaultMode}
                    onChange={(e) =>
                      update(
                        "embedDefaultMode",
                        e.target.value as BuilderState["embedDefaultMode"],
                      )
                    }
                    className="w-full rounded-lg border border-avatar-border bg-avatar-bg px-3 py-2 text-sm text-avatar-text"
                  >
                    <option value="text">Text</option>
                    <option value="voice">Voice</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-avatar-text-muted">
                  <input
                    type="checkbox"
                    checked={state.showBranding}
                    onChange={(e) => update("showBranding", e.target.checked)}
                    className="rounded border-avatar-border bg-avatar-bg"
                  />
                  Show branding
                </label>
                <label className="flex items-center gap-2 text-sm text-avatar-text-muted">
                  <input
                    type="checkbox"
                    checked={state.leadCaptureEnabled}
                    onChange={(e) =>
                      update("leadCaptureEnabled", e.target.checked)
                    }
                    className="rounded border-avatar-border bg-avatar-bg"
                  />
                  Enable lead capture
                </label>
              </div>
            </div>
            <CTAButton
              onClick={() => setShowEmbed(!showEmbed)}
              variant="secondary"
              size="sm"
            >
              {showEmbed ? "Hide embed code" : "Show embed code"}
            </CTAButton>
            {showEmbed && <EmbedSnippetSection state={state} />}
          </div>
        );

      default:
        return (
          <p className="text-sm text-avatar-text-muted">Step not found.</p>
        );
    }
  }, [step, state, selectTemplate, update, showEmbed]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-avatar-text md:text-3xl">
          Build your agent
        </h1>
        <p className="mt-2 text-sm text-avatar-text-muted">
          Step through the configuration to create a new AI avatar agent. No
          data is saved — this is a demo preview of the builder flow.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <div className="flex flex-col gap-4 lg:w-56">
          <StepIndicator
            steps={BUILDER_STEPS}
            currentIndex={stepIndex}
            goTo={goTo}
          />
          <div className="hidden lg:block">
            <SummaryPanel state={state} />
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="avatar-panel p-6">{stepContent}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <CTAButton
              onClick={() => goTo(stepIndex - 1)}
              variant="ghost"
              size="sm"
              disabled={isFirst}
            >
              Previous
            </CTAButton>
            <div className="flex gap-3">
              {isLast ? (
                <CTAButton
                  onClick={() => {
                    setStepIndex(0);
                    setState(createDefaultBuilderState());
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Reset
                </CTAButton>
              ) : (
                <CTAButton
                  onClick={() => goTo(stepIndex + 1)}
                  variant="primary"
                  size="sm"
                  disabled={!canGoNext}
                >
                  Next
                </CTAButton>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <CTAButton
              onClick={() => {}}
              variant="secondary"
              size="sm"
              disabled
            >
              Save draft (not available)
            </CTAButton>
            <CTAButton
              onClick={() => setStepIndex(6)}
              variant="ghost"
              size="sm"
            >
              Preview agent
            </CTAButton>
            <CTAButton
              onClick={() => setStepIndex(7)}
              variant="ghost"
              size="sm"
            >
              Generate embed (preview)
            </CTAButton>
          </div>

          <div className="avatar-panel flex flex-wrap items-center gap-3 p-4 text-xs text-avatar-text-dim">
            <StatusChip label="Demo mode" variant="neutral" />
            <span>No data is saved.</span>
            <span>Real agent creation requires an account and API keys.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
