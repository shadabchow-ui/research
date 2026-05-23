import { SectionShell } from "components/ui/section-shell";
import { PlatformCard } from "components/ui/platform-card";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";
import { EthenChatPanel } from "components/ethen/ethenChatPanel";
import { PRODUCTS, PLATFORM } from "lib/constants";

export const metadata = {
  title: `${PLATFORM.name} — ${PLATFORM.tagline}`,
  description: PLATFORM.description,
  openGraph: {
    type: "website" as const,
  },
};

const USE_CASES = [
  {
    title: "Website Concierge",
    description:
      "Greet visitors, answer questions, qualify leads, and book meetings with a live AI avatar on your site.",
  },
  {
    title: "AI Sales Agent",
    description:
      "Engage prospects, explain products, handle objections, and route hot leads to your team.",
  },
  {
    title: "Training Coach",
    description:
      "Deliver interactive training, quiz learners, and track completion through avatar-led sessions.",
  },
  {
    title: "Product Demos",
    description:
      "Showcase your product with a live avatar that answers buyer questions in real time.",
  },
  {
    title: "Support Agent",
    description:
      "Resolve common issues, guide users through troubleshooting, and escalate to humans.",
  },
  {
    title: "Ecommerce Assistant",
    description:
      "Recommend products, compare options, and help shoppers find what they need.",
  },
];

const FAQ = [
  {
    q: "What is Upcube Avatar Cloud?",
    a: "Upcube Avatar Cloud is a platform for creating and deploying AI avatars that talk, listen, and guide. Use them on your website, in training, for sales, and in support.",
  },
  {
    q: "Can I use my own avatar model?",
    a: "Yes. Upcube supports custom GLB/VRM avatar models. You can create your own branded avatar character and deploy it through the platform.",
  },
  {
    q: "How does voice work?",
    a: "Ethen supports text-to-speech through OpenAI and ElevenLabs. Configure your API key, and Ethen will speak responses aloud. Text chat works without any provider configuration.",
  },
  {
    q: "Is this ready for production?",
    a: "Upcube Avatar Cloud is in active development. Ethen is functional — chat and TTS work. Studio, Interactive Pages, and the full platform are in preview.",
  },
  {
    q: "Do I need to host anything?",
    a: "No. Upcube Avatar Cloud is a fully managed platform. You embed a script on your site, and your avatar appears. We handle hosting, streaming, and scaling.",
  },
  {
    q: "What about data and privacy?",
    a: "Upcube is building with privacy and governance in mind. Consent records, data retention controls, and audit logs are part of the platform architecture.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="z-10 mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-upcube-border bg-upcube-surface px-3 py-1 text-xs font-medium text-upcube-text-muted">
            Platform Preview
          </span>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-upcube-text sm:text-5xl md:text-6xl lg:text-7xl">
            AI avatars that speak,
            <br />
            listen, and guide.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-upcube-text-muted md:text-xl">
            Create and deploy AI avatars for your website, training, product
            demos, and support. Fully managed. No code required.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <CTAButton href="/products/live-avatar" size="lg">
              Try Ethen
            </CTAButton>
            <CTAButton href="#products" variant="secondary" size="lg">
              Explore platform
            </CTAButton>
          </div>

          <div className="mt-4 text-sm text-upcube-text-dim">
            No credit card. Works in your browser.
          </div>
        </div>

        <div className="mt-16 w-full max-w-xl">
          <EthenChatPanel />
        </div>
      </section>

      {/* What you can build */}
      <SectionShell
        title="What you can build"
        subtitle="From customer-facing avatars to internal training coaches — one platform."
        className="border-t border-upcube-border"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl border border-upcube-border bg-upcube-surface p-5"
            >
              <h3 className="text-sm font-semibold text-upcube-text">
                {uc.title}
              </h3>
              <p className="mt-2 text-sm text-upcube-text-muted">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Platform modules */}
      <SectionShell
        id="products"
        title="One platform, four products"
        subtitle="Choose the avatar experience that fits your use case — or use them all together."
        className="border-t border-upcube-border"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <PlatformCard key={product.id} className="flex flex-col">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-upcube-text">
                  {product.title}
                </h3>
                <StatusChip
                  label={
                    product.status === "preview"
                      ? "Preview"
                      : product.status === "coming-soon"
                        ? "Soon"
                        : "Live"
                  }
                  variant={product.status === "preview" ? "success" : "neutral"}
                />
              </div>
              <p className="mb-2 text-sm font-medium text-upcube-text-muted">
                {product.tagline}
              </p>
              <p className="flex-1 text-sm text-upcube-text-muted">
                {product.description}
              </p>
              <div className="mt-6">
                <CTAButton
                  href={product.href}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Learn more
                </CTAButton>
              </div>
            </PlatformCard>
          ))}
        </div>
      </SectionShell>

      {/* Live Avatar preview */}
      <SectionShell
        title="Live Avatar"
        subtitle="Real-time AI avatar agents that talk, listen, and guide your visitors. Try Ethen — Upcube's flagship avatar — at the top of this page."
        className="border-t border-upcube-border"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-upcube-text-muted">
            <span className="rounded-lg border border-upcube-border bg-upcube-surface px-3 py-1.5">
              Text chat
            </span>
            <span className="rounded-lg border border-upcube-border bg-upcube-surface px-3 py-1.5">
              TTS voice
            </span>
            <span className="rounded-lg border border-upcube-border bg-upcube-surface px-3 py-1.5">
              3D avatar
            </span>
            <span className="rounded-lg border border-upcube-border bg-upcube-surface px-3 py-1.5">
              Embed ready
            </span>
          </div>
          <div className="mt-6">
            <CTAButton href="/products/live-avatar" variant="secondary">
              Try Ethen on product page
            </CTAButton>
          </div>
        </div>
      </SectionShell>

      {/* Studio preview */}
      <SectionShell
        title="Studio"
        subtitle="Turn scripts, PDFs, URLs, and blog posts into avatar-led videos. Script to scene editor available now."
        className="border-t border-upcube-border"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="grid gap-4 sm:grid-cols-3">
            {["Script to Video", "Document to Video", "URL to Video"].map(
              (w) => (
                <div
                  key={w}
                  className="rounded-xl border border-upcube-border bg-upcube-surface p-5 text-sm text-upcube-text-muted"
                >
                  {w}
                </div>
              ),
            )}
          </div>
          <div className="mt-6">
            <CTAButton href="/console/studio" variant="secondary">
              Open Studio Lite
            </CTAButton>
          </div>
        </div>
      </SectionShell>

      {/* Developers */}
      <SectionShell
        title="Developers"
        subtitle="API keys, embed SDK, session tokens, and webhooks. Integrate AI avatars into your own products."
        className="border-t border-upcube-border"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="grid gap-4 sm:grid-cols-3">
            {["Avatar API", "Embed SDK", "Webhooks"].map((d) => (
              <div
                key={d}
                className="rounded-xl border border-upcube-border bg-upcube-surface p-5 text-sm text-upcube-text-muted"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CTAButton href="/developers" variant="secondary">
              Developer docs
            </CTAButton>
          </div>
        </div>
      </SectionShell>

      {/* Responsible by design */}
      <SectionShell
        title="Responsible by design"
        subtitle="Consent records, identity verification, data retention controls, and audit logs — built into the platform from day one."
        className="border-t border-upcube-border"
      >
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Consent & verification",
              "Data retention controls",
              "Audit logs",
              "Content moderation",
            ].map((g) => (
              <div
                key={g}
                className="rounded-xl border border-upcube-border bg-upcube-surface p-4 text-sm text-upcube-text-muted"
              >
                {g}
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell
        title="Frequently asked questions"
        className="border-t border-upcube-border"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-upcube-border bg-upcube-surface"
            >
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-upcube-text">
                {item.q}
              </summary>
              <p className="px-5 pb-4 text-sm text-upcube-text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </SectionShell>

      {/* Final CTA */}
      <section className="border-t border-upcube-border py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold tracking-tight text-upcube-text md:text-4xl">
            Ready to build with AI avatars?
          </h2>
          <p className="mt-4 text-lg text-upcube-text-muted">
            Try Ethen today. No sign-up required. Studio, Interactive Pages, and
            the full platform are coming soon.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <CTAButton href="/products/live-avatar" size="lg">
              Try Ethen
            </CTAButton>
            <CTAButton href="#waitlist" variant="secondary" size="lg">
              Join the waitlist
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
