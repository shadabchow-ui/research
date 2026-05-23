import { EthenChatPanel } from "components/ethen/ethenChatPanel";
import { CTAButton } from "components/ui/cta-button";
import { PlatformCard } from "components/ui/platform-card";
import { SectionShell } from "components/ui/section-shell";
import { StatusChip } from "components/ui/status-chip";
import { PRODUCTS, PLATFORM } from "lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Avatar — Upcube Avatar Cloud",
  description:
    "Try Ethen, Upcube's live AI avatar guide. Deploy real-time avatar agents that talk, listen, and guide your visitors.",
};

const USE_CASES = [
  {
    title: "Website Concierge",
    description:
      "Greet visitors, answer product questions, qualify leads, and book meetings — all through a live AI avatar.",
  },
  {
    title: "AI SDR",
    description:
      "Engage prospects on your site, explain your product, handle objections, and route hot leads to your sales team.",
  },
  {
    title: "Support Agent",
    description:
      "Resolve common support issues, guide users through troubleshooting, and escalate to humans with full context.",
  },
  {
    title: "Training Coach",
    description:
      "Deliver interactive training sessions, quiz learners on the material, and track completion rates.",
  },
  {
    title: "Product Demo Agent",
    description:
      "Demo your product to website visitors, answer buyer questions in real time, and recommend next steps.",
  },
  {
    title: "Ecommerce Shopping Assistant",
    description:
      "Recommend products, compare options, answer shipping questions, and upsell relevant bundles.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "Avatar",
    description:
      "Choose or create an AI avatar identity. Ethen is the flagship guide, but you can deploy any persona.",
  },
  {
    title: "Voice",
    description:
      "Select a premium voice or clone a custom voice. Ethen responds with natural speech and timing.",
  },
  {
    title: "Persona",
    description:
      "Define what your avatar knows, how it behaves, and what it can do. Set instructions, tone, and guardrails.",
  },
  {
    title: "Knowledge",
    description:
      "Upload docs, URLs, or product pages. Your avatar answers from its knowledge base, not generic AI.",
  },
  {
    title: "Conversation",
    description:
      "Every interaction is captured. Review transcripts, track sentiment, and improve your avatar over time.",
  },
] as const;

export default function LiveAvatarPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--color-avatar-accent)_0%,_transparent_70%)] opacity-20" />
        <div className="avatar-glow-strong pointer-events-none absolute -inset-40 -z-10 rounded-full opacity-30" />

        <div className="mb-4 inline-flex items-center gap-2">
          <StatusChip label="Live Demo" variant="success" />
          <StatusChip label="Text Chat Active" variant="info" />
        </div>

        <h1 className="max-w-4xl text-center text-4xl font-bold tracking-tight text-avatar-text sm:text-5xl md:text-6xl">
          Talk to <span className="avatar-gradient-text">Ethen</span>
          <br />
          Upcube&apos;s live AI avatar
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg text-avatar-text-muted md:text-xl">
          Ethen is a real-time AI avatar guide. Ask him anything about Upcube
          Avatar Cloud — products, use cases, or how to get started. Type your
          question below and watch Ethen think, respond, and guide you.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <CTAButton href="#demo" size="lg">
            Try Ethen now
          </CTAButton>
          <CTAButton href="#how-it-works" variant="secondary" size="lg">
            How it works
          </CTAButton>
        </div>

        <div className="mt-16 w-full max-w-[calc(100vw-32px)] sm:max-w-[580px] lg:max-w-[620px]">
          <EthenChatPanel />
        </div>

        <div className="mt-6 text-xs text-avatar-text-dim">
          No microphone needed. TTS voice available when a provider is
          configured.
        </div>
      </section>

      {/* Use Cases */}
      <SectionShell
        title="What can you build with Live Avatar?"
        subtitle="From website concierges to training coaches — avatars that work for your business."
        className="bg-avatar-surface/30"
      >
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="avatar-panel-hover p-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-avatar-text">
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed text-avatar-text-muted">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* How It Works */}
      <SectionShell
        id="how-it-works"
        title="How it works"
        subtitle="Five components that make up every live AI avatar."
      >
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-5">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-avatar-accent text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-avatar-text">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-avatar-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Platform Preview */}
      <SectionShell
        title="Part of the Upcube platform"
        subtitle="Live Avatar is one product in the Upcube Avatar Cloud ecosystem."
        className="bg-avatar-surface/30"
      >
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.filter((p) => p.id !== "live-avatar").map((product) => (
            <PlatformCard
              key={product.id}
              glow={product.gradientBorder}
              className="flex flex-col"
            >
              <h3 className="mb-2 text-base font-semibold text-avatar-text">
                {product.title}
              </h3>
              <p className="flex-1 text-sm text-avatar-text-muted">
                {product.tagline}
              </p>
              <div className="mt-4">
                <CTAButton href={product.href} variant="ghost" size="sm">
                  Learn more
                </CTAButton>
              </div>
            </PlatformCard>
          ))}
        </div>
      </SectionShell>

      {/* CTA */}
      <SectionShell
        id="waitlist"
        title="Ready to deploy your own avatar?"
        subtitle={`${PLATFORM.name} ${PLATFORM.tagline} is in development. Join the waitlist for early access.`}
      >
        <div className="mx-auto mt-8 max-w-md">
          <div className="avatar-panel flex flex-col items-center gap-6 p-8 text-center">
            <p className="text-sm text-avatar-text-muted">
              No spam. We&apos;ll notify you when the platform is ready for
              testing.
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 rounded-xl border border-avatar-border bg-avatar-surface px-4 py-3 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
              />
              <CTAButton size="md">Subscribe</CTAButton>
            </div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
