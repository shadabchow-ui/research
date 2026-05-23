import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Video Pages",
  description:
    "Turn avatar videos into interactive pages with Q&A, quizzes, and lead capture.",
};

export default function InteractiveVideoPagesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-6 text-4xl font-bold">Interactive Video Pages</h1>
      <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
        Transform avatar-generated videos into interactive pages with live Q&A,
        quizzes, lead capture, and analytics.
      </p>
      <p className="text-neutral-500">Coming soon. Sign up for early access.</p>
    </div>
  );
}
