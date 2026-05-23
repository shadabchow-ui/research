export type LeadIntent =
  | "product_inquiry"
  | "demo_request"
  | "pricing"
  | "support"
  | "partnership"
  | "general";

export interface LeadCaptureSubmission {
  name: string;
  email: string;
  company: string;
  intent: LeadIntent;
  interest: string;
  message: string;
  submittedAt: string;
}

export interface CTAAction {
  id: string;
  label: string;
  description: string;
  href?: string;
  disabled?: boolean;
  icon: string;
}

export const DEMO_CTA_ACTIONS: CTAAction[] = [
  {
    id: "try_ethen",
    label: "Try Ethen",
    description: "Chat with Upcube's flagship AI avatar guide.",
    href: "/products/live-avatar",
    icon: "💬",
  },
  {
    id: "book_demo",
    label: "Book a demo",
    description: "Schedule a personalized product walkthrough.",
    disabled: true,
    icon: "📅",
  },
  {
    id: "create_concierge",
    label: "Create a website concierge",
    description: "Deploy an AI avatar for your website.",
    href: "/console/avatar-agents",
    icon: "🌐",
  },
  {
    id: "explore_studio",
    label: "Explore Studio",
    description: "Create avatar-led videos from scripts.",
    href: "/console/studio",
    icon: "🎬",
  },
  {
    id: "talk_to_sales",
    label: "Talk to sales",
    description: "Speak with a human about enterprise plans.",
    disabled: true,
    icon: "📞",
  },
  {
    id: "view_pricing",
    label: "View pricing",
    description: "See plan options and estimated costs.",
    href: "/pricing",
    icon: "💰",
  },
];

export const INTENT_OPTIONS: { value: LeadIntent; label: string }[] = [
  { value: "product_inquiry", label: "Product inquiry" },
  { value: "demo_request", label: "Request a demo" },
  { value: "pricing", label: "Pricing question" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "general", label: "General" },
];

export function createLeadCaptureSubmission(fields: {
  name?: string;
  email: string;
  company?: string;
  intent?: LeadIntent;
  interest?: string;
  message?: string;
}): LeadCaptureSubmission {
  return {
    name: fields.name ?? "",
    email: fields.email,
    company: fields.company ?? "",
    intent: fields.intent ?? "general",
    interest: fields.interest ?? "",
    message: fields.message ?? "",
    submittedAt: new Date().toISOString(),
  };
}

export function formatLeadSummary(submission: LeadCaptureSubmission): string {
  const lines: string[] = [
    `Name: ${submission.name || "Not provided"}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || "Not provided"}`,
    `Intent: ${submission.intent}`,
    `Interest: ${submission.interest || "Not provided"}`,
    `Message: ${submission.message || "Not provided"}`,
    `Submitted: ${submission.submittedAt}`,
  ];
  return lines.join("\n");
}

export const DEMO_CAPTURED_LEAD = createLeadCaptureSubmission({
  name: "Alex Morgan",
  email: "alex@acmecorp.com",
  company: "Acme Corp",
  intent: "demo_request",
  interest: "Live Avatar for website lead generation",
  message:
    "Interested in deploying an AI sales avatar on our main product page.",
});
