import { KnowledgeEntry, PRODUCT_KNOWLEDGE } from "./ethenProductKnowledge";

export interface GuideResponse {
  text: string;
  relatedLinks?: { label: string; href: string }[];
  entryId: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function scoreEntry(input: string, entry: KnowledgeEntry): number {
  const normalized = normalize(input);
  if (entry.keywords.length === 0) return 0;
  let score = 0;
  for (const keyword of entry.keywords) {
    const kw = keyword.toLowerCase();
    if (normalized === kw) {
      score += 10;
    } else if (normalized.includes(kw)) {
      score += 3;
    } else if (
      kw.split(" ").some((word) => word.length > 2 && normalized.includes(word))
    ) {
      score += 1;
    }
  }
  return score;
}

export function getGuideResponse(input: string): GuideResponse {
  if (!input || input.trim().length === 0) {
    return {
      text: "Hi, I'm Ethen! Ask me anything about Upcube Avatar Cloud — products, use cases, or how to get started.",
      entryId: "greeting",
    };
  }

  const scored = PRODUCT_KNOWLEDGE.map((entry) => ({
    entry,
    score: scoreEntry(input, entry),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score === 0) {
    const fallback = PRODUCT_KNOWLEDGE.find((e) => e.id === "off-topic");
    return {
      text:
        fallback?.answer ??
        "I'm not sure how to answer that. Try asking about Live Avatar, Studio, or Interactive Video Pages.",
      entryId: "off-topic",
      relatedLinks: fallback?.relatedLinks,
    };
  }

  return {
    text: best.entry.answer,
    relatedLinks: best.entry.relatedLinks,
    entryId: best.entry.id,
  };
}
