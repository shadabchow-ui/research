import type { Conversation, TranscriptMessage } from "./types";

export interface DemoConversation {
  id: string;
  liveAgentId: string;
  liveAgentName: string;
  status: "active" | "ended" | "failed";
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  userMessageCount: number;
  avatarMessageCount: number;
  summary: string;
  leadCaptured: boolean;
  leadInfo?: DemoLeadInfo;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  transcript: DemoTranscriptMessage[];
  eventTimeline: DemoEventTimelineEntry[];
}

export interface DemoLeadInfo {
  name: string;
  email: string;
  interest: string;
  capturedAt: string;
}

export interface DemoTranscriptMessage {
  role: "user" | "assistant" | "system";
  speaker: string;
  text: string;
  timestamp: string;
  turnIndex: number;
}

export interface DemoEventTimelineEntry {
  type: string;
  label: string;
  timestamp: string;
}

const ts = (offsetSec: number): string =>
  new Date(Date.now() - offsetSec * 1000).toISOString();

export const DEMO_ETHEN_CONVERSATION: DemoConversation = {
  id: "demo_conv_ethen_001",
  liveAgentId: "sample_ethen_agent",
  liveAgentName: "Ethen Guide",
  status: "ended",
  startedAt: ts(3600),
  endedAt: ts(3500),
  durationSeconds: 64,
  userMessageCount: 3,
  avatarMessageCount: 3,
  summary:
    "User asked about Upcube Avatar Cloud capabilities. Ethen explained Live Avatar, Studio, and Interactive Video Pages. User was interested in pricing and was routed to the pricing page.",
  leadCaptured: false,
  sentiment: "positive",
  transcript: [
    {
      role: "system",
      speaker: "system",
      text: "Conversation started. Ethen Guide (browser_3d) initialized.",
      timestamp: ts(3600),
      turnIndex: 0,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "Hi! I'm trying to understand what Upcube Avatar Cloud can do for my business. Can you give me a quick overview?",
      timestamp: ts(3595),
      turnIndex: 1,
    },
    {
      role: "assistant",
      speaker: "Ethen",
      text: "Hi! Great question. Upcube Avatar Cloud is our platform for live AI avatars and interactive video. It has three main products: Live Avatar — real-time conversational AI avatars for your website; Studio — generate avatar videos from a script; and Interactive Video Pages — turn videos into interactive lead-generation pages. Which one sounds most relevant to you?",
      timestamp: ts(3592),
      turnIndex: 2,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "Live Avatar sounds interesting. How does it compare to something like Tavus?",
      timestamp: ts(3580),
      turnIndex: 3,
    },
    {
      role: "assistant",
      speaker: "Ethen",
      text: "Good question. Both offer browser-rendered avatars, but we focus on building Upcube's own stack. Instead of using a third-party provider per session, we're building an owned browser-rendered avatar that runs in the user's browser using Three.js and WebGL. This avoids per-minute video fees and gives us more control over the experience. Would you like to see a demo?",
      timestamp: ts(3577),
      turnIndex: 4,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "Yes, and can you also tell me about pricing for the Live Avatar product?",
      timestamp: ts(3565),
      turnIndex: 5,
    },
    {
      role: "assistant",
      speaker: "Ethen",
      text: "I'd be happy to show you a demo. As for pricing, we offer several tiers depending on your needs — from a free Starter tier to Enterprise with custom terms. The best way to get accurate pricing is to check our pricing page. I've added a link for you below. In the meantime, let me show you the Live Avatar demo!",
      timestamp: ts(3562),
      turnIndex: 6,
    },
    {
      role: "system",
      speaker: "system",
      text: "User navigated to /pricing. Conversation ended.",
      timestamp: ts(3536),
      turnIndex: 7,
    },
  ],
  eventTimeline: [
    { type: "session.created", label: "Session created", timestamp: ts(3600) },
    { type: "session.started", label: "Session started", timestamp: ts(3600) },
    {
      type: "user.message",
      label: "User asked overview question",
      timestamp: ts(3595),
    },
    { type: "llm.started", label: "LLM started", timestamp: ts(3594) },
    {
      type: "llm.first_token",
      label: "LLM first token",
      timestamp: ts(3593.5),
    },
    {
      type: "llm.completed",
      label: "LLM response complete",
      timestamp: ts(3593),
    },
    { type: "tts.started", label: "TTS started", timestamp: ts(3593) },
    {
      type: "tts.first_audio",
      label: "TTS first audio",
      timestamp: ts(3592.5),
    },
    { type: "tts.completed", label: "TTS audio complete", timestamp: ts(3592) },
    {
      type: "avatar.started_speaking",
      label: "Ethen started speaking",
      timestamp: ts(3593),
    },
    {
      type: "avatar.stopped_speaking",
      label: "Ethen stopped speaking",
      timestamp: ts(3592),
    },
    {
      type: "user.message",
      label: "User asked comparison question",
      timestamp: ts(3580),
    },
    {
      type: "user.message",
      label: "User asked about pricing",
      timestamp: ts(3565),
    },
    { type: "session.ended", label: "Session ended", timestamp: ts(3536) },
  ],
};

export const DEMO_CONCIERGE_CONVERSATION: DemoConversation = {
  id: "demo_conv_concierge_001",
  liveAgentId: "sample_website_concierge_template",
  liveAgentName: "Website Concierge",
  status: "ended",
  startedAt: ts(7200),
  endedAt: ts(7060),
  durationSeconds: 140,
  userMessageCount: 5,
  avatarMessageCount: 5,
  summary:
    "Visitor engaged by Website Concierge avatar. Expressed interest in live avatar technology for their SaaS company. Asked about pricing, integration timeline, and security. Provided email and name for follow-up. Lead captured successfully.",
  leadCaptured: true,
  leadInfo: {
    name: "Alex Chen",
    email: "alex@example-saas.co",
    interest: "Live Avatar for B2B SaaS website",
    capturedAt: ts(7100),
  },
  sentiment: "positive",
  transcript: [
    {
      role: "system",
      speaker: "system",
      text: "Conversation started. Website Concierge engaged via embed widget.",
      timestamp: ts(7200),
      turnIndex: 0,
    },
    {
      role: "assistant",
      speaker: "Concierge",
      text: "Hi there! Welcome to Upcube. I'm your website concierge. How can I help you today? Are you exploring avatar solutions for your business?",
      timestamp: ts(7197),
      turnIndex: 1,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "Hi! Yes, I'm evaluating avatar platforms for my company's website. We're a B2B SaaS company and I think a live avatar could really help with demos and lead gen.",
      timestamp: ts(7190),
      turnIndex: 2,
    },
    {
      role: "assistant",
      speaker: "Concierge",
      text: "That's a great use case! Many B2B SaaS companies use our Live Avatar product for exactly that — demoing features, answering questions in real time, and capturing qualified leads. What's the approximate size of your website traffic?",
      timestamp: ts(7187),
      turnIndex: 3,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "We get about 50k monthly visitors. What would the pricing look like for that volume? And how quick is the integration?",
      timestamp: ts(7175),
      turnIndex: 4,
    },
    {
      role: "assistant",
      speaker: "Concierge",
      text: "For 50k monthly visitors, our Growth plan would be a great fit. It includes live avatar sessions, embed SDK, and analytics dashboard. Integration can be as fast as adding a script tag to your site. I'd love to connect you with our team for a custom walkthrough. Can I grab your name and email so someone reaches out?",
      timestamp: ts(7172),
      turnIndex: 5,
    },
    {
      role: "user",
      speaker: "Visitor",
      text: "Sure, I'm Alex Chen from Example SaaS. My email is alex@example-saas.co. We're particularly interested in the lead capture features and how the avatar handles product demos.",
      timestamp: ts(7160),
      turnIndex: 6,
    },
    {
      role: "assistant",
      speaker: "Concierge",
      text: "Thanks Alex! I've noted your details. Our lead capture system can collect visitor information, qualify interest level, and route hot leads to your sales team. The avatar can walk users through your product features interactively. I'll have our team reach out with a personalized demo. Thanks for your interest!",
      timestamp: ts(7157),
      turnIndex: 7,
    },
    {
      role: "system",
      speaker: "system",
      text: "Lead captured. Routing to sales queue. Conversation ended.",
      timestamp: ts(7060),
      turnIndex: 8,
    },
  ],
  eventTimeline: [
    { type: "session.created", label: "Session created", timestamp: ts(7200) },
    {
      type: "user.started_speaking",
      label: "User started speaking",
      timestamp: ts(7190),
    },
    {
      type: "avatar.started_speaking",
      label: "Concierge responded",
      timestamp: ts(7187),
    },
    {
      type: "user.started_speaking",
      label: "User asked about pricing",
      timestamp: ts(7175),
    },
    { type: "lead", label: "Lead captured (Alex Chen)", timestamp: ts(7160) },
    { type: "session.ended", label: "Session ended", timestamp: ts(7060) },
  ],
};

export const DEMO_SUPPORT_CONVERSATION: DemoConversation = {
  id: "demo_conv_support_001",
  liveAgentId: "template_support_draft",
  liveAgentName: "Support Agent",
  status: "active",
  startedAt: ts(600),
  durationSeconds: 32,
  userMessageCount: 2,
  avatarMessageCount: 1,
  summary:
    "User asked about embedding avatar on custom domain. Support Agent provided setup instructions but the response was cut short. Conversation still in progress.",
  leadCaptured: false,
  sentiment: "neutral",
  transcript: [
    {
      role: "system",
      speaker: "system",
      text: "Conversation started. Support Agent initialized.",
      timestamp: ts(600),
      turnIndex: 0,
    },
    {
      role: "user",
      speaker: "User",
      text: "I'm trying to embed the avatar on my custom domain but I'm getting a cross-origin error. What domains need to be allowlisted?",
      timestamp: ts(590),
      turnIndex: 1,
    },
    {
      role: "assistant",
      speaker: "Support",
      text: "Hi! To embed on a custom domain, you need to add your domain to the Embed Config allowedDomains list and generate a session token scoped to that domain. The error you're seeing is likely because your domain isn't allowlisted yet. You can manage this in the Console under Embed Settings.",
      timestamp: ts(587),
      turnIndex: 2,
    },
  ],
  eventTimeline: [
    { type: "session.created", label: "Session created", timestamp: ts(600) },
    {
      type: "user.message",
      label: "User reported embed issue",
      timestamp: ts(590),
    },
    { type: "llm.started", label: "LLM started", timestamp: ts(589) },
    {
      type: "avatar.started_speaking",
      label: "Support started responding",
      timestamp: ts(587),
    },
  ],
};

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  DEMO_ETHEN_CONVERSATION,
  DEMO_CONCIERGE_CONVERSATION,
  DEMO_SUPPORT_CONVERSATION,
];
