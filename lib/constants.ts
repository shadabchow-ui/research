export const PLATFORM = {
  name: "Upcube",
  tagline: "Avatar Cloud",
  description:
    "Live AI avatars and studio avatar videos for websites, training, sales, education, support, and creators.",
  url: "https://upcube.ai",
};

export const PRODUCTS = [
  {
    id: "live-avatar",
    title: "Live Avatar",
    tagline: "Real-time AI avatar agents that talk, listen, and guide.",
    description:
      "Deploy real-time conversational avatars on your website. Your visitors can talk to an AI avatar that answers questions, qualifies leads, books meetings, and hands off to your team.",
    href: "/products/live-avatar",
    status: "preview" as const,
    gradientBorder: true,
  },
  {
    id: "studio",
    title: "Studio",
    tagline: "Generate avatar-led videos from scripts, docs, or URLs.",
    description:
      "Turn any content into a premium avatar video. Script, scene cards, captions, transcript, and hosted video pages — no recording required.",
    href: "/products/studio",
    status: "coming-soon" as const,
    gradientBorder: false,
  },
  {
    id: "interactive-pages",
    title: "Interactive Pages",
    tagline: "Video pages that keep working after the video ends.",
    description:
      "Each video becomes an interactive page with transcript, quiz, live avatar Q&A, lead capture, and analytics. Passive viewing becomes active engagement.",
    href: "/products/interactive-video-pages",
    status: "coming-soon" as const,
    gradientBorder: false,
  },
  {
    id: "avatar-api",
    title: "Avatar API",
    tagline: "Build custom avatar experiences with our developer API.",
    description:
      "Personas, sessions, streaming, webhooks, and embed SDK. Integrate AI avatars into your own products and platforms.",
    href: "/developers",
    status: "coming-soon" as const,
    gradientBorder: false,
  },
] as const;

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";

export interface Metric {
  value: string;
  label: string;
  accent?: boolean;
}

export const METRICS: Metric[] = [
  { value: "<500ms", label: "Response latency" },
  { value: "99.9%", label: "Uptime" },
  { value: "12+", label: "Languages" },
  { value: "1M+", label: "Sessions (coming soon)", accent: true },
];

export const AVATAR_CLOUD_NAV = [
  { title: "Live Avatar", path: "/products/live-avatar" },
  { title: "Studio", path: "/products/studio" },
  { title: "Interactive Pages", path: "/products/interactive-video-pages" },
  { title: "Developers", path: "/developers" },
  { title: "Console", path: "/console" },
];

export const NAV_ITEMS = [
  { title: "Live Avatar", path: "/products/live-avatar" },
  { title: "Studio", path: "/products/studio" },
  { title: "Interactive Pages", path: "/products/interactive-video-pages" },
  { title: "Developers", path: "/developers" },
  { title: "Console", path: "/console" },
] as const;

export const FOOTER_SECTIONS = [
  {
    title: "Products",
    links: [
      { title: "Live Avatar", path: "/products/live-avatar" },
      { title: "Studio", path: "/products/studio" },
      { title: "Interactive Pages", path: "/products/interactive-video-pages" },
      { title: "Avatar API", path: "/developers" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { title: "Website Concierge", path: "#" },
      { title: "AI Sales Agent", path: "#" },
      { title: "Training Coach", path: "#" },
      { title: "Product Demo", path: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", path: "#" },
      { title: "Blog", path: "#" },
      { title: "Pricing", path: "/pricing" },
      { title: "Contact", path: "#" },
    ],
  },
] as const;
