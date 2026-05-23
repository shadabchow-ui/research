import type { Replica, Voice, KnowledgeBase } from "./types";

export interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  personaName: string;
  tone: string;
  systemPrompt: string;
  status: "available" | "coming_soon";
  defaultGreeting: string;
}

export const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "ethen_guide",
    name: "Ethen Guide",
    description:
      "Upcube's flagship AI avatar guide. Explains products, answers questions, and routes users across the ecosystem.",
    personaName: "Ethen Guide",
    tone: "friendly_professional",
    systemPrompt:
      "You are Ethen, Upcube's flagship AI avatar guide. Your role is to help visitors understand Upcube products, answer questions about the platform, and guide users to the right product or app. You are friendly, helpful, and professional.",
    status: "available",
    defaultGreeting:
      "Hi, I'm Ethen! Ask me anything about Upcube Avatar Cloud.",
  },
  {
    id: "website_concierge",
    name: "Website Concierge",
    description:
      "Greet visitors, answer product questions, qualify leads, and book meetings. The first commercial template.",
    personaName: "Website Concierge",
    tone: "warm_professional",
    systemPrompt:
      "You are a friendly website concierge AI avatar. Greet visitors, answer questions about the company and its products, qualify leads by asking about their needs, and offer to book meetings or hand off to a human team member.",
    status: "available",
    defaultGreeting:
      "Welcome! I'm your website concierge. How can I help you today?",
  },
  {
    id: "ai_sdr",
    name: "AI SDR",
    description:
      "Engage prospects, explain your product, handle objections, and route hot leads to your sales team.",
    personaName: "AI SDR",
    tone: "confident_professional",
    systemPrompt:
      "You are an AI sales development representative. Your role is to engage website visitors, understand their needs, explain how the product solves their problems, handle objections professionally, and qualify leads for the sales team.",
    status: "available",
    defaultGreeting:
      "Hi there! I'm here to help you find the right solution. What brings you here today?",
  },
  {
    id: "support_agent",
    name: "Support Agent",
    description:
      "Resolve common support issues, guide users through troubleshooting, and escalate with full context.",
    personaName: "Support Agent",
    tone: "patient_helpful",
    systemPrompt:
      "You are a helpful support agent AI avatar. Your role is to resolve common support issues, guide users through troubleshooting steps, and escalate complex issues to human agents with full conversation context.",
    status: "available",
    defaultGreeting:
      "Thanks for reaching out. I'm here to help! Can you describe the issue you're experiencing?",
  },
  {
    id: "training_coach",
    name: "Training Coach",
    description:
      "Deliver interactive training sessions, quiz learners, and track completion rates.",
    personaName: "Training Coach",
    tone: "encouraging_instructive",
    systemPrompt:
      "You are an AI training coach. Your role is to deliver interactive training sessions, explain concepts clearly, quiz learners to reinforce understanding, and provide feedback to help them improve.",
    status: "available",
    defaultGreeting:
      "Ready to learn? I'll guide you through the material step by step.",
  },
  {
    id: "product_demo_agent",
    name: "Product Demo Agent",
    description:
      "Demo your product, answer buyer questions in real time, and recommend next steps.",
    personaName: "Product Demo Agent",
    tone: "enthusiastic_informative",
    systemPrompt:
      "You are a product demo AI avatar. Your role is to demonstrate product features, answer prospective buyer questions in real time, highlight key benefits, and guide visitors toward the next step in their buyer journey.",
    status: "coming_soon",
    defaultGreeting:
      "Welcome to the demo! I'll walk you through everything you need to know.",
  },
  {
    id: "ecommerce_assistant",
    name: "Ecommerce Assistant",
    description:
      "Recommend products, compare options, answer shipping questions, and upsell relevant bundles.",
    personaName: "Shopping Assistant",
    tone: "helpful_friendly",
    systemPrompt:
      "You are an AI ecommerce shopping assistant. Your role is to help customers find products, compare options, answer questions about shipping and returns, recommend complementary items, and create a pleasant shopping experience.",
    status: "coming_soon",
    defaultGreeting:
      "Welcome! Looking for something specific? I can help you find the perfect product.",
  },
];

export const BUILDER_REPLICAS: (Replica & { label: string })[] = [
  {
    id: "sample_ethen_replica",
    name: "Ethen Browser Avatar",
    modelType: "browser_glb",
    assetUri: "/models/ethen/ethen.glb",
    trainingStatus: "none",
    status: "active",
    label: "Ethen — 3D browser avatar",
  },
  {
    id: "stock_professional",
    name: "Stock Professional",
    modelType: "browser_glb",
    assetUri: "/models/stock/professional.glb",
    trainingStatus: "none",
    status: "active",
    label: "Stock — Professional (GLB)",
  },
  {
    id: "stock_friendly",
    name: "Stock Friendly",
    modelType: "browser_glb",
    assetUri: "/models/stock/friendly.glb",
    trainingStatus: "none",
    status: "active",
    label: "Stock — Friendly (GLB)",
  },
];

export const BUILDER_VOICES: (Voice & { label: string })[] = [
  {
    id: "sample_ethen_voice",
    provider: "not_configured",
    externalVoiceId: "",
    language: "en-US",
    isCloned: false,
    label: "Ethen default voice (not configured)",
  },
  {
    id: "premium_male",
    provider: "elevenlabs",
    externalVoiceId: "21m00Tcm4TlvDq8ikWAM",
    language: "en-US",
    isCloned: false,
    label: "Premium Male (ElevenLabs — requires API key)",
  },
  {
    id: "premium_female",
    provider: "elevenlabs",
    externalVoiceId: "EXAVITQu4vrRV2FYbx",
    language: "en-US",
    isCloned: false,
    label: "Premium Female (ElevenLabs — requires API key)",
  },
  {
    id: "cartesia_sonic",
    provider: "cartesia",
    externalVoiceId: "79f1258e-747d-43e5-ae23-dd612ad1a37c",
    language: "en-US",
    isCloned: false,
    label: "Cartesia Sonic (requires API key)",
  },
];

export const BUILDER_KNOWLEDGE_BASES: (KnowledgeBase & { label: string })[] = [
  {
    id: "sample_upcube_knowledge",
    name: "Upcube Platform Knowledge",
    indexType: "static",
    documentCount: 1,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    label: "Upcube Platform Knowledge (demo)",
  },
  {
    id: "empty_knowledge",
    name: "Empty Knowledge Base",
    indexType: "static",
    documentCount: 0,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    label: "No documents",
  },
];

export interface BuilderState {
  template: BuilderTemplate | null;
  replicaId: string;
  voiceId: string;
  knowledgeBaseIds: string[];
  greetingMessage: string;
  embedTheme: "light" | "dark" | "system";
  embedPosition: "bottom-right" | "bottom-left" | "inline";
  embedDefaultMode: "text" | "voice" | "video";
  showBranding: boolean;
  leadCaptureEnabled: boolean;
}

export function createDefaultBuilderState(): BuilderState {
  return {
    template: null,
    replicaId: "sample_ethen_replica",
    voiceId: "sample_ethen_voice",
    knowledgeBaseIds: ["sample_upcube_knowledge"],
    greetingMessage: "",
    embedTheme: "system",
    embedPosition: "bottom-right",
    embedDefaultMode: "text",
    showBranding: true,
    leadCaptureEnabled: false,
  };
}

export interface BuilderStep {
  id: string;
  label: string;
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: "template", label: "Template" },
  { id: "avatar", label: "Avatar" },
  { id: "voice", label: "Voice" },
  { id: "persona", label: "Persona" },
  { id: "knowledge", label: "Knowledge" },
  { id: "greeting", label: "Greeting" },
  { id: "preview", label: "Preview" },
  { id: "embed", label: "Embed" },
];
