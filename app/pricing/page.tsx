import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Upcube Avatar Cloud pricing plans.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="mb-6 text-4xl font-bold">Pricing</h1>
      <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
        Flexible pricing for teams of all sizes. Pay-as-you-go, pro, and
        enterprise plans available.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
          <h2 className="mb-2 text-xl font-semibold">Starter</h2>
          <p className="mb-4 text-3xl font-bold">Free</p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>1 avatar agent</li>
            <li>100 interactions/month</li>
            <li>Basic analytics</li>
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
          <h2 className="mb-2 text-xl font-semibold">Pro</h2>
          <p className="mb-4 text-3xl font-bold">Not provided</p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Unlimited agents</li>
            <li>Custom interactions</li>
            <li>Advanced analytics</li>
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
          <h2 className="mb-2 text-xl font-semibold">Enterprise</h2>
          <p className="mb-4 text-3xl font-bold">Custom</p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Dedicated infrastructure</li>
            <li>SLA</li>
            <li>Custom integrations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
