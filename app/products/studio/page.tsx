import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Create avatar-led videos from scripts, URLs, and documents.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-6 text-4xl font-bold">Studio</h1>
      <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
        Create professional avatar-led videos from scripts, PDFs, URLs, and blog
        posts. Generate voiceover, captions, and hosted video pages.
      </p>
      <p className="text-neutral-500">Coming soon. Sign up for early access.</p>
      <div className="mt-6">
        <a
          href="/videos/demo"
          className="inline-flex h-10 items-center rounded-lg border border-neutral-700 px-5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          View demo hosted video page
        </a>
      </div>
    </div>
  );
}
