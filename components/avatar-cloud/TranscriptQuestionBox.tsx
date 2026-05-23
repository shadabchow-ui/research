"use client";

import { useState, useCallback, useRef } from "react";
import clsx from "clsx";
import {
  DEMO_VIDEO_TRANSCRIPT,
  DEMO_QA_SUGGESTIONS,
  findAnswersInTranscript,
  type TranscriptQaResult,
  type TranscriptBlock,
} from "lib/avatar-cloud/transcript-qa";

interface TranscriptQuestionBoxProps {
  transcript?: TranscriptBlock[];
  suggestions?: string[];
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: TranscriptQaResult["confidence"];
}) {
  const colors = {
    high: "bg-avatar-success-subtle text-avatar-success",
    medium: "bg-avatar-warning-subtle text-avatar-warning",
    low: "bg-avatar-text-dim/20 text-avatar-text-dim",
  };
  const labels = { high: "Matched", medium: "Partial", low: "Weak" };

  return (
    <span
      className={clsx(
        "rounded px-1.5 py-0.5 text-[10px] font-medium",
        colors[confidence],
      )}
    >
      {labels[confidence]}
    </span>
  );
}

export function TranscriptQuestionBox({
  transcript = DEMO_VIDEO_TRANSCRIPT,
  suggestions = DEMO_QA_SUGGESTIONS,
}: TranscriptQuestionBoxProps) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<TranscriptQaResult | null>(null);
  const [asked, setAsked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setError(null);
      setAsked(true);

      try {
        const qaResult = findAnswersInTranscript(trimmed, transcript);
        setResult(qaResult);
      } catch {
        setError("Something went wrong processing your question.");
        setResult(null);
      }
    },
    [transcript],
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      setQuestion(text);
      handleSubmit(text);
    },
    [handleSubmit],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(question);
    },
    [handleSubmit, question],
  );

  return (
    <div className="rounded-2xl border border-avatar-border bg-avatar-surface">
      <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
        <h3 className="text-sm font-medium text-avatar-text">
          Ask about this video
        </h3>
        <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
          local transcript
        </span>
      </div>

      {!asked && (
        <div className="flex flex-wrap gap-2 border-b border-avatar-border px-5 py-3">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="rounded-lg border border-avatar-border-light bg-avatar-bg px-3 py-1.5 text-xs text-avatar-text-muted transition-colors hover:border-avatar-accent/50 hover:text-avatar-text"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {asked && result && (
        <div ref={listRef} className="space-y-3 px-5 py-4">
          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-avatar-text-dim">
                  Question
                </span>
              </div>
              <div className="rounded-xl bg-avatar-bg px-4 py-2.5 text-sm text-avatar-text">
                {question}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-avatar-text-dim">
                  Answer
                </span>
                <ConfidenceBadge confidence={result.confidence} />
              </div>
              <div className="rounded-xl bg-avatar-accent-subtle/30 px-4 py-2.5 text-sm leading-relaxed text-avatar-text">
                {result.answer}
              </div>
            </div>
          </div>

          {result.matchedBlocks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-avatar-text-dim">
                Source scenes
              </span>
              {result.matchedBlocks.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-avatar-border bg-avatar-bg/50 px-3 py-2"
                >
                  {m.sceneLabel && (
                    <span className="mb-1 block text-[11px] font-medium text-avatar-accent">
                      {m.sceneLabel}
                    </span>
                  )}
                  <p className="text-xs leading-relaxed text-avatar-text-muted">
                    {m.snippet}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {asked && error && (
        <div className="px-5 py-4">
          <div className="rounded-lg border border-avatar-error/30 bg-avatar-error/10 px-4 py-2 text-sm text-avatar-error">
            {error}
          </div>
        </div>
      )}

      <div className="border-t border-avatar-border px-5 py-3">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setAsked(false);
              setResult(null);
            }}
            placeholder="Ask a question about this video..."
            className="min-w-0 flex-1 rounded-xl border border-avatar-border bg-avatar-bg px-4 py-2.5 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden transition-colors focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className={clsx(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
              question.trim()
                ? "bg-avatar-accent text-white hover:bg-avatar-accent-hover"
                : "cursor-not-allowed bg-avatar-border text-avatar-text-dim",
            )}
          >
            Ask
          </button>
        </form>
        <p className="mt-2 text-[11px] text-avatar-text-dim">
          Answers are based on the video transcript only. Only questions covered
          in the transcript can be answered.
        </p>
      </div>
    </div>
  );
}
