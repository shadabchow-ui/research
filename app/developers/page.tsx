import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers",
  description: "Upcube Avatar Cloud developer platform, API, and SDK.",
};

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-6 text-4xl font-bold">Developers</h1>
      <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
        Build with the Upcube Avatar Cloud API. Integrate real-time avatars,
        avatar video generation, and interactive pages into your own
        applications.
      </p>
      <h2 className="mb-3 mt-10 text-2xl font-semibold">API Reference</h2>
      <p className="text-neutral-500">
        Documentation coming soon. Join the developer waitlist.
      </p>
      <h2 className="mb-3 mt-10 text-2xl font-semibold">SDK &amp; Libraries</h2>
      <p className="text-neutral-500">
        JavaScript, Python, and REST API SDKs coming soon.
      </p>
    </div>
  );
}
