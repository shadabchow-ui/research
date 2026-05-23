import { CTAButton } from "components/ui/cta-button";
import { SectionShell } from "components/ui/section-shell";
import { StatusChip } from "components/ui/status-chip";
import {
  SAMPLE_ETHEN_EMBED_CONFIG,
  createDefaultEmbedConfig,
  validateEmbedConfig,
  getEmbedSnippet,
} from "lib/avatar-cloud";
import type { EmbedBootstrapConfig } from "lib/avatar-cloud/embed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed SDK — Upcube Avatar Cloud",
  description:
    "Embeddable avatar widget SDK foundation for Upcube Avatar Cloud.",
};

const DEMO_BOOTSTRAP: EmbedBootstrapConfig = {
  agentId: "sample_ethen_agent",
  sessionToken: "demo_session_token_placeholder",
  allowedDomains: ["example.com", "upcube.ai"],
  theme: "system",
  position: "bottom-right",
  defaultMode: "text",
  showBranding: true,
  leadCaptureEnabled: false,
};

export default function EmbedPage() {
  const defaultConfig = createDefaultEmbedConfig();
  const validation = validateEmbedConfig(SAMPLE_ETHEN_EMBED_CONFIG);
  const snippet = getEmbedSnippet(DEMO_BOOTSTRAP);

  return (
    <>
      <section className="relative min-h-[40vh] overflow-hidden px-4 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--color-avatar-accent)_0%,_transparent_70%)] opacity-20" />

        <span className="mb-4 inline-flex items-center gap-2">
          <StatusChip label="SDK Foundation" variant="neutral" />
          <StatusChip label="Demo Preview" variant="info" />
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-avatar-text sm:text-5xl">
          Embed SDK
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-avatar-text-muted">
          Embed Upcube avatars on any website with a single script tag. This is
          a demo SDK foundation — not a production CDN release.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <CTAButton href="#snippet" size="md">
            View snippet
          </CTAButton>
          <CTAButton href="#concepts" variant="secondary" size="md">
            Read concepts
          </CTAButton>
        </div>
      </section>

      <SectionShell
        id="concepts"
        title="Embed concepts"
        subtitle="Understand the building blocks before integrating."
      >
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="avatar-panel-hover p-6">
            <h3 className="mb-2 text-lg font-semibold text-avatar-text">
              Embed Config
            </h3>
            <p className="mb-4 text-sm text-avatar-text-muted">
              Controls how your avatar widget appears and behaves. Choose theme,
              position, default mode, and branding visibility.
            </p>
            <div className="rounded-lg bg-avatar-surface/50 p-3">
              <p className="text-xs text-avatar-text-dim">
                Theme: {defaultConfig.theme}
              </p>
              <p className="text-xs text-avatar-text-dim">
                Position: {defaultConfig.position}
              </p>
              <p className="text-xs text-avatar-text-dim">
                Mode: {defaultConfig.defaultMode}
              </p>
            </div>
          </div>

          <div className="avatar-panel-hover p-6">
            <h3 className="mb-2 text-lg font-semibold text-avatar-text">
              Domain Allowlist
            </h3>
            <p className="mb-4 text-sm text-avatar-text-muted">
              Only listed domains can initialize the widget. Protects against
              unauthorized embedding on other sites.
            </p>
            <div className="rounded-lg bg-avatar-surface/50 p-3">
              {SAMPLE_ETHEN_EMBED_CONFIG.allowedDomains.map((domain) => (
                <p
                  key={domain}
                  className="text-xs text-avatar-text-dim font-mono"
                >
                  {domain}
                </p>
              ))}
            </div>
          </div>

          <div className="avatar-panel-hover p-6">
            <h3 className="mb-2 text-lg font-semibold text-avatar-text">
              Session Token
            </h3>
            <p className="mb-4 text-sm text-avatar-text-muted">
              Short-lived token generated server-side. Scoped to one domain and
              one agent. Never exposed to unauthorized clients.
            </p>
            <div className="rounded-lg bg-avatar-accent/10 p-3">
              <p className="text-xs text-avatar-accent font-mono">
                Token: demo_**********_placeholder
              </p>
              <p className="text-xs text-avatar-text-dim">
                Expires: 15 minutes
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-avatar-accent/20 bg-avatar-accent/5 p-6">
          <h3 className="mb-3 text-lg font-semibold text-avatar-text">
            Config validation result
          </h3>
          <p className="mb-2 text-sm text-avatar-text-muted">
            The validateEmbedConfig helper checks for required fields and valid
            enum values.
          </p>
          <div className="flex items-center gap-2">
            <StatusChip
              label={validation.valid ? "Valid" : "Invalid"}
              variant={validation.valid ? "success" : "error"}
            />
            {!validation.valid && (
              <span className="text-sm text-avatar-error">
                {validation.errors.length} error(s)
              </span>
            )}
          </div>
          {!validation.valid &&
            validation.errors.map((e: { field: string; message: string }) => (
              <p key={e.field} className="mt-2 text-xs text-avatar-error">
                <code className="font-mono">{e.field}</code>: {e.message}
              </p>
            ))}
        </div>
      </SectionShell>

      <SectionShell
        id="snippet"
        title="Integration snippet"
        subtitle="Copy this snippet into any HTML page to embed an Upcube avatar. Replace placeholder values with your own configuration."
        className="bg-avatar-surface/30"
      >
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="avatar-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
              <span className="text-sm font-medium text-avatar-text">
                Embed code
              </span>
              <StatusChip label="Demo snippet" variant="neutral" />
            </div>
            <div className="overflow-x-auto p-5">
              <pre className="text-xs text-avatar-text-muted whitespace-pre-wrap font-mono leading-relaxed">
                {snippet}
              </pre>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-avatar-warning/10 p-4 text-center">
            <p className="text-sm text-avatar-warning/80">
              This is a demo SDK foundation scaffold. The embed script (
              <code className="font-mono text-xs">/embed.js</code>) is a static
              placeholder that demonstrates the structure but does not connect
              to any real avatar backend, session manager, or STT/TTS pipeline.
              Do not use in production.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Widget preview"
        subtitle="When integrated, the widget would appear in the configured position on your page."
      >
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border-2 border-dashed border-avatar-border-light bg-avatar-surface/20 p-16 text-center">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-avatar-border-light">
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-lg font-medium text-avatar-text">
              Ethen avatar widget
            </p>
            <p className="mt-2 text-sm text-avatar-text-dim">
              The widget would render here at configured position
            </p>
            <ul className="mt-4 inline-flex flex-wrap justify-center gap-3 text-xs text-avatar-text-dim">
              <li className="rounded-full bg-avatar-surface px-3 py-1">
                Theme: {DEMO_BOOTSTRAP.theme}
              </li>
              <li className="rounded-full bg-avatar-surface px-3 py-1">
                Position: {DEMO_BOOTSTRAP.position}
              </li>
              <li className="rounded-full bg-avatar-surface px-3 py-1">
                Mode: {DEMO_BOOTSTRAP.defaultMode}
              </li>
            </ul>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="architecture"
        title="Architecture"
        subtitle="How the embed SDK fits into the Upcube Avatar Cloud platform."
        className="bg-avatar-surface/30"
      >
        <div className="mx-auto mt-8 max-w-4xl space-y-4">
          <div className="avatar-panel-hover p-5">
            <h3 className="mb-2 text-base font-semibold text-avatar-text">
              1. Site owner configures an agent
            </h3>
            <p className="text-sm text-avatar-text-muted">
              From the Upcube Console, configure a LiveAgent persona, attach an
              EmbedConfig with allowed domains, and generate a short-lived
              session token.
            </p>
          </div>

          <div className="avatar-panel-hover p-5">
            <h3 className="mb-2 text-base font-semibold text-avatar-text">
              2. Site owner adds the script tag
            </h3>
            <p className="text-sm text-avatar-text-muted">
              Copy the generated snippet into any HTML page. The snippet
              includes a config block and references the embed script.
            </p>
          </div>

          <div className="avatar-panel-hover p-5">
            <h3 className="mb-2 text-base font-semibold text-avatar-text">
              3. Widget validates and renders
            </h3>
            <p className="text-sm text-avatar-text-muted">
              The embed script reads the config, validates the origin against
              allowed domains, exchanges the session token server-side, and
              renders the avatar widget in the configured position.
            </p>
          </div>

          <div className="avatar-panel-hover p-5">
            <h3 className="mb-2 text-base font-semibold text-avatar-text">
              4. Visitor interacts with the avatar
            </h3>
            <p className="text-sm text-avatar-text-muted">
              Site visitors see the avatar widget, can type or speak to it, and
              get real-time responses. Events are streamed back to Upcube for
              analytics.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="SDK roadmap"
        subtitle="What's coming for the embed SDK."
      >
        <div className="mx-auto mt-8 max-w-4xl space-y-3">
          {[
            "Production CDN bundle with minified, versioned assets",
            "Iframe-based isolation mode for third-party embeds",
            "Event dispatch API for host-page integration",
            "Customizable widget themes and CSS overrides",
            "Multi-agent switching within a single embed",
            "Offline fallback and reconnection handling",
            "Comprehensive analytics and usage dashboards",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-lg bg-avatar-surface/30 px-4 py-3"
            >
              <StatusChip label="Planned" variant="neutral" dot={false} />
              <span className="text-sm text-avatar-text-muted">{item}</span>
            </div>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
