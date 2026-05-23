export interface TemplateGoal {
  id: string;
  label: string;
  description: string;
}

export interface LeadCaptureField {
  name: string;
  type: "email" | "name" | "phone" | "company" | "message" | "text";
  required: boolean;
  placeholder: string;
}

export interface QualificationQuestion {
  id: string;
  question: string;
  intent: "budget" | "timing" | "authority" | "need" | "company_size";
  suggestedResponses: string[];
}

export interface HandoffAction {
  type:
    | "book_demo"
    | "transfer_support"
    | "send_email"
    | "schedule_call"
    | "custom";
  label: string;
  description: string;
  placeholderUrl?: string;
}

export interface ConversationStyle {
  speed: "fast" | "moderate" | "relaxed";
  tone: string;
  formality: "casual" | "professional" | "warm_professional";
  responseLength: "concise" | "detailed" | "adaptive";
}

export interface LiveAgentTemplate {
  id: string;
  name: string;
  description: string;
  category: "sales" | "support" | "education" | "marketing" | "general";
  targetUseCases: string[];
  defaultGreeting: string;
  goals: TemplateGoal[];
  style: ConversationStyle;
  suggestedPromptChips: string[];
  leadCaptureFields: LeadCaptureField[];
  qualificationQuestions: QualificationQuestion[];
  handoffActions: HandoffAction[];
  personaSystemPrompt: string;
  personaId?: string;
  conversationFlowProfileId?: string;
}

export interface CapturedLeadDemo {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  qualification: {
    budgetRange: string;
    timeline: string;
    decisionMaker: string;
    needDescription: string;
  };
  conversationSummary: string;
  handoffNeeded: boolean;
  handoffType?: string;
}

export const WEBSITE_CONCIERGE_GOALS: TemplateGoal[] = [
  {
    id: "gc_1",
    label: "Answer product questions",
    description: "Respond to visitor inquiries about products and services.",
  },
  {
    id: "gc_2",
    label: "Qualify lead",
    description: "Ask targeted questions to assess lead fit and readiness.",
  },
  {
    id: "gc_3",
    label: "Route to pricing",
    description: "Guide interested visitors to the pricing page.",
  },
  {
    id: "gc_4",
    label: "Book demo",
    description: "Offer to schedule a product demonstration.",
  },
  {
    id: "gc_5",
    label: "Collect email",
    description: "Capture visitor contact information for follow-up.",
  },
  {
    id: "gc_6",
    label: "Handoff to sales",
    description: "Transfer hot leads to the human sales team.",
  },
];

export const WEBSITE_CONCIERGE_LEAD_FIELDS: LeadCaptureField[] = [
  { name: "name", type: "name", required: true, placeholder: "Your full name" },
  {
    name: "email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
  },
  {
    name: "phone",
    type: "phone",
    required: false,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "company",
    type: "company",
    required: true,
    placeholder: "Your company",
  },
  {
    name: "interest",
    type: "text",
    required: false,
    placeholder: "What are you interested in?",
  },
];

export const WEBSITE_CONCIERGE_QUALIFICATION: QualificationQuestion[] = [
  {
    id: "q_need",
    question: "What problem are you trying to solve?",
    intent: "need",
    suggestedResponses: [
      "Improve website engagement",
      "Generate more leads",
      "Reduce support load",
      "Scale sales outreach",
    ],
  },
  {
    id: "q_timing",
    question: "When are you looking to get started?",
    intent: "timing",
    suggestedResponses: [
      "Immediately",
      "Within a month",
      "Within 3 months",
      "Just exploring",
    ],
  },
  {
    id: "q_budget",
    question: "What budget range are you considering?",
    intent: "budget",
    suggestedResponses: [
      "Under $500/mo",
      "$500–$2,000/mo",
      "$2,000+/mo",
      "Not sure yet",
    ],
  },
  {
    id: "q_authority",
    question: "Are you the decision maker for this purchase?",
    intent: "authority",
    suggestedResponses: [
      "Yes, I make the final decision",
      "I influence the decision",
      "I'm gathering information",
      "I'm not sure",
    ],
  },
];

export const WEBSITE_CONCIERGE_HANDOFFS: HandoffAction[] = [
  {
    type: "book_demo",
    label: "Book a demo",
    description:
      "Schedule a personalized product walkthrough with a sales representative.",
    placeholderUrl: "not provided",
  },
  {
    type: "transfer_support",
    label: "Talk to support",
    description:
      "Transfer the conversation to the human support team with full context.",
    placeholderUrl: "not provided",
  },
  {
    type: "schedule_call",
    label: "Schedule a call",
    description: "Book a time for a sales or onboarding call.",
    placeholderUrl: "not provided",
  },
  {
    type: "send_email",
    label: "Send me info",
    description: "Receive product information and pricing via email.",
    placeholderUrl: "not provided",
  },
];

export const SAMPLE_AI_SDR_GOALS: TemplateGoal[] = [
  {
    id: "asdr_1",
    label: "Engage prospects",
    description: "Initiate conversations with high-intent website visitors.",
  },
  {
    id: "asdr_2",
    label: "Handle objections",
    description: "Address common sales objections with product knowledge.",
  },
  {
    id: "asdr_3",
    label: "Qualify inbound leads",
    description: "Score leads based on fit, intent, and buying authority.",
  },
  {
    id: "asdr_4",
    label: "Route hot leads",
    description:
      "Escalate qualified leads to the human sales team immediately.",
  },
  {
    id: "asdr_5",
    label: "Book meetings",
    description: "Schedule sales calls or demos without human intervention.",
  },
  {
    id: "asdr_6",
    label: "Capture lead data",
    description: "Collect and structure prospect data for CRM entry.",
  },
];

export const SAMPLE_AI_SDR_LEAD_FIELDS: LeadCaptureField[] = [
  { name: "name", type: "name", required: true, placeholder: "Full name" },
  {
    name: "email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
  },
  {
    name: "phone",
    type: "phone",
    required: true,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "company",
    type: "company",
    required: true,
    placeholder: "Company name",
  },
  {
    name: "role",
    type: "text",
    required: false,
    placeholder: "Your role / title",
  },
  { name: "teamSize", type: "text", required: false, placeholder: "Team size" },
];

export const WEBSITE_CONCIERGE_TEMPLATE: LiveAgentTemplate = {
  id: "template_website_concierge",
  name: "Website Concierge",
  description:
    "Greet website visitors, answer product questions, qualify leads, and book meetings — all through a live AI avatar. The first commercial template designed for revenue teams.",
  category: "sales",
  targetUseCases: [
    "Lead generation",
    "Product education",
    "Demo scheduling",
    "Visitor engagement",
    "Sales handoff",
  ],
  defaultGreeting:
    "Hi there! Welcome to our site. I'm your AI assistant — happy to answer questions about our products, help you find what you need, or connect you with our team. What brings you here today?",
  goals: WEBSITE_CONCIERGE_GOALS,
  style: {
    speed: "fast",
    tone: "helpful and sales-friendly",
    formality: "warm_professional",
    responseLength: "concise",
  },
  suggestedPromptChips: [
    "What can you help me with?",
    "Tell me about your product",
    "How much does it cost?",
    "I want to talk to sales",
    "Book a demo",
  ],
  leadCaptureFields: WEBSITE_CONCIERGE_LEAD_FIELDS,
  qualificationQuestions: WEBSITE_CONCIERGE_QUALIFICATION,
  handoffActions: WEBSITE_CONCIERGE_HANDOFFS,
  personaSystemPrompt:
    "You are a friendly website concierge AI avatar. Greet visitors, answer questions about the company and its products, qualify leads by asking about their needs, and offer to book meetings or hand off to a human team member. Keep responses concise and helpful. Collect relevant contact information when the user is interested in learning more.",
};

export const AI_SDR_TEMPLATE: LiveAgentTemplate = {
  id: "template_ai_sdr",
  name: "AI SDR",
  description:
    "An outbound and inbound sales development representative. Engage prospects, handle objections, qualify inbound leads, and route hot leads to your human sales team. Designed for revenue acceleration.",
  category: "sales",
  targetUseCases: [
    "Inbound lead qualification",
    "Outbound prospect engagement",
    "Sales objection handling",
    "Meeting booking",
    "CRM handoff",
  ],
  defaultGreeting:
    "Hey there! I'm an AI sales assistant. Looks like you're checking out our product — I'd love to help you find the right fit. Mind if I ask a few quick questions?",
  goals: SAMPLE_AI_SDR_GOALS,
  style: {
    speed: "fast",
    tone: "confident and professional",
    formality: "professional",
    responseLength: "concise",
  },
  suggestedPromptChips: [
    "Tell me about your pricing",
    "How do you compare to competitors?",
    "I need a demo",
    "What's the onboarding process?",
    "I'm ready to buy",
  ],
  leadCaptureFields: SAMPLE_AI_SDR_LEAD_FIELDS,
  qualificationQuestions: WEBSITE_CONCIERGE_QUALIFICATION,
  handoffActions: WEBSITE_CONCIERGE_HANDOFFS,
  personaSystemPrompt:
    "You are a confident and professional AI sales development representative. Your goal is to engage prospects, qualify leads by asking about needs, budget, and timing, handle common objections with product knowledge, and book meetings or transfer hot leads to the human sales team. Be concise, persuasive, and helpful. Collect structured lead data for CRM entry.",
};

export const SAMPLE_TEMPLATES: LiveAgentTemplate[] = [
  WEBSITE_CONCIERGE_TEMPLATE,
  AI_SDR_TEMPLATE,
];

export const SAMPLE_CAPTURED_LEAD_DEMO: CapturedLeadDemo = {
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 (555) 987-6543",
  company: "Acme Corp",
  interest: "Live Avatar for website lead generation",
  qualification: {
    budgetRange: "$500–$2,000/mo",
    timeline: "Within a month",
    decisionMaker: "Yes, I make the final decision",
    needDescription:
      "Looking to automate initial sales qualification on our website to reduce response time from hours to seconds.",
  },
  conversationSummary:
    "Alex visited the pricing page, clicked on the Live Avatar product, and engaged with the Website Concierge avatar. They asked about pricing, features, and integration options. After qualification, they expressed strong interest in a demo and have authority to make purchasing decisions.",
  handoffNeeded: true,
  handoffType: "book_demo",
};
