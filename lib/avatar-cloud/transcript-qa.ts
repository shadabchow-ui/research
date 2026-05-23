export interface TranscriptBlock {
  id: string;
  sceneLabel?: string;
  text: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
}

export interface TranscriptQaResult {
  answer: string;
  matchedBlocks: { sceneLabel?: string; snippet: string }[];
  confidence: "high" | "medium" | "low";
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "it",
  "this",
  "that",
  "of",
  "in",
  "on",
  "for",
  "to",
  "and",
  "or",
  "with",
  "as",
  "at",
  "by",
  "from",
  "what",
  "how",
  "can",
  "do",
  "does",
  "are",
  "am",
  "be",
  "has",
  "have",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "me",
  "my",
  "we",
  "our",
  "us",
  "you",
  "your",
  "about",
  "tell",
  "show",
  "explain",
  "describe",
]);

const QUESTION_WORDS = new Set([
  "what",
  "how",
  "why",
  "where",
  "when",
  "which",
  "who",
]);

export const DEMO_VIDEO_TRANSCRIPT: TranscriptBlock[] = [
  {
    id: "scene_1_intro",
    sceneLabel: "Introduction",
    text: "Hi, I'm Ethen — Upcube's AI avatar guide. Welcome to Upcube Avatar Cloud. In this video, I'll walk you through what our platform can do, from live avatar agents to interactive video pages.",
  },
  {
    id: "scene_2_live_avatar",
    sceneLabel: "Live Avatar",
    text: "Live Avatar lets you deploy real-time conversational avatars on your website. These avatars can greet visitors, answer product questions, qualify leads, book meetings, and hand off to your sales or support team when needed. It works entirely through the browser using WebGL and Three.js.",
  },
  {
    id: "scene_3_studio",
    sceneLabel: "Studio",
    text: "Studio is our avatar video generation tool. You can turn any script, document, or URL into a premium avatar-led video. Each video can include an avatar presenter, voiceover, captions, and scene cards. It works with a simple script-to-scene workflow.",
  },
  {
    id: "scene_4_interactive_pages",
    sceneLabel: "Interactive Video Pages",
    text: "Interactive Video Pages are what make us different. Every generated video gets its own hosted page with a transcript, Q&A, quizzes, lead capture, and analytics. The page keeps working after the video ends — visitors can ask questions, take quizzes, and submit their contact information.",
  },
  {
    id: "scene_5_api",
    sceneLabel: "Avatar API",
    text: "For developers, we offer the Avatar API. You can build custom avatar experiences with personas, sessions, streaming, webhooks, and our embed SDK. The API lets you integrate AI avatars into your own products, platforms, and applications.",
  },
  {
    id: "scene_6_ethen",
    sceneLabel: "About Ethen",
    text: "Ethen is Upcube's flagship AI avatar guide. He helps visitors understand our products, answers questions about the platform, and guides users to the right resources. Unlike a chatbot, Ethen has a visual presence — he blinks, breathes, and shows natural speaking and thinking states. He can explain products, describe use cases, and route users to the right pages.",
  },
  {
    id: "scene_7_getting_started",
    sceneLabel: "Getting Started",
    text: "Getting started is easy. Choose a product that fits your use case — Live Avatar for real-time conversations, Studio for video generation, or Interactive Video Pages for combined experiences. Each product can be used on its own or together. Visit our console to get started.",
  },
];

export const DEMO_QA_SUGGESTIONS: string[] = [
  "What is this video about?",
  "What does Ethen explain?",
  "How can Live Avatar help a website visitor?",
  "What is Studio?",
  "How are Interactive Video Pages different?",
  "What is the Avatar API?",
  "How do I get started?",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function extractKeywords(question: string): string[] {
  const tokens = tokenize(question);
  return tokens.filter((t) => !QUESTION_WORDS.has(t));
}

function scoreBlock(
  block: TranscriptBlock,
  keywords: string[],
  question?: string,
): number {
  const blockTokens = tokenize(block.text);
  const blockText = block.text.toLowerCase();
  let score = 0;

  for (const kw of keywords) {
    const count = blockTokens.filter((t) => t === kw).length;
    if (count > 0) {
      score += count * 2;
    }
    if (blockText.includes(kw)) {
      score += 1;
    }
  }

  return score;
}

function extractSnippet(
  text: string,
  keywords: string[],
  maxChars: number = 200,
): string {
  const lower = text.toLowerCase();
  let bestIdx = 0;

  for (const kw of keywords) {
    const idx = lower.indexOf(kw);
    if (idx >= 0) {
      bestIdx = idx;
      break;
    }
  }

  if (bestIdx === 0) return text.slice(0, maxChars);

  const start = Math.max(0, bestIdx - 60);
  const end = Math.min(text.length, start + maxChars);
  let snippet = text.slice(start, end);

  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

export function findAnswersInTranscript(
  question: string,
  blocks: TranscriptBlock[] = DEMO_VIDEO_TRANSCRIPT,
): TranscriptQaResult {
  const keywords = extractKeywords(question);

  if (keywords.length === 0) {
    return {
      answer:
        "Please ask a more specific question about the video content, such as what Ethen explains or how Live Avatar works.",
      matchedBlocks: [],
      confidence: "low",
    };
  }

  const scored = blocks
    .map((block) => ({
      block,
      score: scoreBlock(block, keywords, question),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      answer:
        "I could not find information about that in this video transcript. Try asking about what Ethen explains, how Live Avatar works, or what Studio can do.",
      matchedBlocks: [],
      confidence: "low",
    };
  }

  const topScore = scored[0]!.score;
  const bestBlocks = scored.filter((s) => s.score >= topScore * 0.5);

  const combined = bestBlocks.map((s) => s.block.text).join(" ");

  const answerText =
    combined.length > 400 ? combined.slice(0, 400) + "..." : combined;

  const matchedBlocks = bestBlocks.map((s) => ({
    sceneLabel: s.block.sceneLabel,
    snippet: extractSnippet(s.block.text, keywords),
  }));

  const confidence: "high" | "medium" | "low" =
    topScore >= 8 ? "high" : topScore >= 4 ? "medium" : "low";

  return {
    answer: answerText,
    matchedBlocks,
    confidence,
  };
}
