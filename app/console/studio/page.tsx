import type { Metadata } from "next";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";
import { StudioScriptEditor } from "components/avatar-cloud/StudioScriptEditor";

export const metadata: Metadata = {
  title: "Studio Lite — Console",
  description:
    "Upcube Studio Lite — a local script-to-scene editor demo. No rendering or publishing yet.",
};

const WORKFLOWS = [
  {
    id: "script-to-video",
    title: "Script to Video",
    description:
      "Write or paste a script and split it into editable scene cards. The first workflow available in Studio Lite.",
    status: "active" as const,
  },
  {
    id: "document-to-video",
    title: "Document to Video",
    description:
      "Convert PDFs, docs, or blog posts into avatar-led video scenes. Coming in a later update.",
    status: "coming-soon" as const,
  },
  {
    id: "url-to-video",
    title: "URL to Video",
    description:
      "Turn any webpage into an avatar-led video script automatically. Coming in a later update.",
    status: "coming-soon" as const,
  },
  {
    id: "training-video",
    title: "Training Video",
    description:
      "Create structured training videos with quizzes, captions, and completion tracking. Coming in a later update.",
    status: "coming-soon" as const,
  },
  {
    id: "product-explainer",
    title: "Product Explainer",
    description:
      "Generate product demo videos from specs, features, and screenshots. Coming in a later update.",
    status: "coming-soon" as const,
  },
  {
    id: "interactive-page",
    title: "Interactive Video Page",
    description:
      "Publish your video as an interactive page with transcript, quiz, and lead capture. Coming in a later update.",
    status: "coming-soon" as const,
  },
];

export default function StudioLitePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-avatar-text md:text-4xl">
            Studio Lite
          </h1>
          <StatusChip label="Preview" variant="info" />
        </div>
        <p className="mt-3 max-w-2xl text-lg text-avatar-text-muted">
          Turn scripts into scene cards. This is a local-only editor preview.
          Rendering, voiceover, captions, and publishing will be added in later
          updates.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusChip label="Client-side only" variant="neutral" />
          <StatusChip label="No rendering yet" variant="warning" />
          <StatusChip label="No backend save" variant="neutral" />
        </div>
      </div>

      {/* Workflow cards */}
      <div className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-avatar-text">
          Workflows
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOWS.map((wf) => (
            <div
              key={wf.id}
              className="rounded-xl border border-avatar-border bg-avatar-surface/30 p-5 transition-colors hover:border-avatar-border-light"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-avatar-text">
                  {wf.title}
                </h3>
                <StatusChip
                  label={wf.status === "active" ? "Active" : "Soon"}
                  variant={wf.status === "active" ? "success" : "neutral"}
                />
              </div>
              <p className="text-xs text-avatar-text-muted leading-relaxed">
                {wf.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Script Editor */}
      <div className="avatar-panel p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-avatar-text">
            Script to Scene
          </h2>
          <p className="mt-1 text-sm text-avatar-text-dim">
            Paste a script below and watch it split into scene cards. Each card
            is editable. All processing happens locally in your browser.
          </p>
        </div>
        <StudioScriptEditor />
      </div>

      {/* Footer */}
      <div className="mt-10 rounded-xl border border-dashed border-avatar-border-light px-5 py-6 text-center">
        <p className="text-sm text-avatar-text-dim">
          Studio Lite preview. Rendering, voiceover, captions, and publishing
          workflows will be added in subsequent updates.
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <CTAButton href="/products/studio" variant="ghost" size="sm">
            Product page
          </CTAButton>
          <CTAButton href="/console" variant="ghost" size="sm">
            Back to console
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
