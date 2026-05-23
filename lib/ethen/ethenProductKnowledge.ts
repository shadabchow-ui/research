export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  relatedLinks?: { label: string; href: string }[];
  category: string;
}

export const PRODUCT_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "what-is-upcube",
    keywords: [
      "upcube",
      "avatar cloud",
      "what is upcube",
      "what is avatar cloud",
      "platform",
      "about",
    ],
    question: "What is Upcube Avatar Cloud?",
    answer:
      "Upcube Avatar Cloud is a platform for live AI avatars and studio avatar videos. It combines real-time conversational avatars (like Live Avatar), avatar video creation (Studio), interactive video pages, and a developer API. Ethen is Upcube's flagship AI avatar — a real-time guide that helps users explore the platform, answer questions, and navigate products.",
    category: "platform",
    relatedLinks: [
      { label: "Live Avatar", href: "/products/live-avatar" },
      { label: "Studio", href: "/products/studio" },
      { label: "Interactive Pages", href: "/products/interactive-video-pages" },
    ],
  },
  {
    id: "what-is-ethen",
    keywords: ["ethen", "who is ethen", "ethen avatar", "flagship", "guide"],
    question: "What is Ethen?",
    answer:
      "Ethen is Upcube's own AI avatar guide for upcube.ai. Ethen helps you understand Upcube products, answer questions, recommend the right tools, and navigate the platform. Ethen is designed to be a real-time behavioral presence — with natural idle, listening, thinking, and speaking states — and will eventually support voice conversations. Right now, Ethen can answer your questions through text chat and guide you to the right product or section.",
    category: "ethen",
    relatedLinks: [
      { label: "Live Avatar", href: "/products/live-avatar" },
      { label: "Home", href: "/" },
    ],
  },
  {
    id: "what-is-live-avatar",
    keywords: [
      "live avatar",
      "real-time avatar",
      "conversational avatar",
      "avatar agent",
      "website avatar",
      "talk",
      "listen",
    ],
    question: "What is Live Avatar?",
    answer:
      "Live Avatar lets you deploy real-time conversational AI avatars on your website. Your visitors can talk to an AI avatar that answers questions, qualifies leads, books meetings, and hands off to your team. It's designed for sales, support, education, and visitor engagement. Live Avatar is currently in development — join the waitlist for early access.",
    category: "product",
    relatedLinks: [
      { label: "Live Avatar details", href: "/products/live-avatar" },
      { label: "Join waitlist", href: "/#waitlist" },
    ],
  },
  {
    id: "what-is-studio",
    keywords: [
      "studio",
      "video",
      "avatar video",
      "video generation",
      "script to video",
      "generate video",
    ],
    question: "What is Studio?",
    answer:
      "Studio lets you create professional avatar-led videos from scripts, PDFs, URLs, and blog posts. Generate voiceover, captions, transcripts, and hosted video pages — no recording required. It's perfect for training, product demos, marketing, and internal communications. Studio is currently in development.",
    category: "product",
    relatedLinks: [
      { label: "Studio details", href: "/products/studio" },
      { label: "Join waitlist", href: "/#waitlist" },
    ],
  },
  {
    id: "what-are-interactive-pages",
    keywords: [
      "interactive pages",
      "interactive video",
      "video page",
      "quiz",
      "lead capture",
      "video q&a",
      "interactive",
    ],
    question: "What are Interactive Video Pages?",
    answer:
      "Interactive Video Pages turn avatar-generated videos into interactive experiences. Each video becomes a page with a transcript, quiz, live avatar Q&A, lead capture, and analytics. Passive viewing becomes active engagement — users can watch, ask follow-up questions, take quizzes, submit their contact info, and continue the conversation with a live avatar.",
    category: "product",
    relatedLinks: [
      {
        label: "Interactive Pages details",
        href: "/products/interactive-video-pages",
      },
    ],
  },
  {
    id: "what-is-avatar-api",
    keywords: [
      "api",
      "developer",
      "sdk",
      "embed",
      "avatar api",
      "integration",
      "webhook",
    ],
    question: "What is the Avatar API?",
    answer:
      "The Avatar API lets developers build custom avatar experiences using personas, sessions, streaming, webhooks, and an embed SDK. Integrate AI avatars into your own products, platforms, and applications. The API is currently in development — check the Developers page for updates.",
    category: "product",
    relatedLinks: [
      { label: "Developers", href: "/developers" },
      { label: "Avatar API", href: "/products/avatar-api" },
    ],
  },
  {
    id: "website-concierge",
    keywords: [
      "website concierge",
      "ai sdr",
      "sales agent",
      "sales avatar",
      "lead qualification",
      "concierge",
      "sdr",
      "meeting booking",
      "handoff",
    ],
    question: "Can Ethen or Live Avatar act as a website concierge or AI SDR?",
    answer:
      "Yes. The Website Concierge / AI SDR is a core use case for Live Avatar. An AI avatar can greet visitors, answer product questions, qualify leads, explain pricing, book meetings, collect contact information, and hand off to your human sales or support team. This is one of the first commercial templates planned for Live Avatar.",
    category: "use-case",
    relatedLinks: [
      { label: "Live Avatar", href: "/products/live-avatar" },
      { label: "Join waitlist", href: "/#waitlist" },
    ],
  },
  {
    id: "what-is-console",
    keywords: ["console", "dashboard", "manage", "admin", "settings"],
    question: "What is the Console?",
    answer:
      "The Console is your Upcube Avatar Cloud dashboard. Manage agents, studio projects, and platform settings. Currently in development with more features coming soon.",
    category: "platform",
    relatedLinks: [{ label: "Console", href: "/console" }],
  },
  {
    id: "pricing",
    keywords: [
      "pricing",
      "cost",
      "price",
      "plan",
      "subscription",
      "free",
      "paid",
    ],
    question: "How much does Upcube Avatar Cloud cost?",
    answer:
      "Pricing details are not yet announced. Upcube Avatar Cloud is currently in development. Sign up for the waitlist to get early access and pricing updates when they're available.",
    category: "general",
    relatedLinks: [
      { label: "Pricing page", href: "/pricing" },
      { label: "Join waitlist", href: "/#waitlist" },
    ],
  },
  {
    id: "when-launch",
    keywords: [
      "when",
      "launch",
      "release date",
      "available",
      "beta",
      "early access",
      "release",
    ],
    question: "When will Upcube Avatar Cloud be available?",
    answer:
      "Upcube Avatar Cloud is in active development. Specific launch dates are not yet announced. You can join the waitlist to receive early access updates, preview invitations, and launch notifications.",
    category: "general",
    relatedLinks: [{ label: "Join waitlist", href: "/#waitlist" }],
  },
  {
    id: "what-can-ethen-do-now",
    keywords: [
      "what can ethen do",
      "ethen features",
      "ethen capabilities",
      "can ethen",
      "help",
    ],
    question: "What can Ethen do right now?",
    answer:
      "Right now, Ethen can answer your questions about Upcube Avatar Cloud through text chat. Ethen can explain products, describe use cases, and guide you to the right pages. The avatar shows natural idle, thinking, and speaking states. Voice conversations, listening, and real-time avatar rendering are coming in future updates.",
    category: "ethen",
  },
  {
    id: "off-topic",
    keywords: [],
    question: "I don't understand that question.",
    answer:
      "I'm Ethen, Upcube's AI avatar guide. I can help you learn about Upcube Avatar Cloud — including Live Avatar, Studio, Interactive Video Pages, and the Avatar API. Try asking me about any of our products, or use one of the suggestions above to get started.",
    category: "fallback",
  },
];
