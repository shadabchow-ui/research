"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import type { InteractiveQuiz } from "lib/avatar-cloud/interactive-layers";
import { scoreQuizLocally } from "lib/avatar-cloud/interactive-layers";

interface QuizCardProps {
  quiz: InteractiveQuiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof scoreQuizLocally
  > | null>(null);

  const selectOption = useCallback(
    (questionId: string, optionId: string) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    const r = scoreQuizLocally(quiz, answers);
    setResult(r);
    setSubmitted(true);
  }, [quiz, answers]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }, []);

  const allAnswered = quiz.questions.every((q) => answers[q.id]);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="rounded-2xl border border-avatar-border bg-avatar-surface">
      <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
        <h3 className="text-sm font-medium text-avatar-text">{quiz.title}</h3>
        <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
          local quiz
        </span>
      </div>

      <div className="space-y-5 px-5 py-4">
        {quiz.questions.map((q) => {
          const selected = answers[q.id];
          const correctId = q.options.find((o) => o.correct)?.id;

          return (
            <div key={q.id}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm text-avatar-text">{q.text}</p>
                {q.sceneLabel && (
                  <span className="shrink-0 rounded bg-avatar-bg px-1.5 py-0.5 text-[10px] text-avatar-text-dim">
                    {q.sceneLabel}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isCorrect = opt.correct;
                  const showResult = submitted && isSelected;
                  const showCorrect =
                    submitted && isCorrect && selected !== opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectOption(q.id, opt.id)}
                      disabled={submitted}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                        showResult
                          ? isCorrect
                            ? "border-avatar-success bg-avatar-success-subtle text-avatar-success"
                            : "border-avatar-error bg-avatar-error-subtle text-avatar-error"
                          : showCorrect
                            ? "border-avatar-success/30 bg-avatar-success/5 text-avatar-success"
                            : isSelected
                              ? "border-avatar-accent bg-avatar-accent-subtle text-avatar-text"
                              : "border-avatar-border bg-avatar-bg text-avatar-text-muted hover:border-avatar-accent/50 hover:text-avatar-text",
                        submitted && "cursor-default",
                      )}
                    >
                      <span
                        className={clsx(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                          showResult
                            ? isCorrect
                              ? "border-avatar-success bg-avatar-success text-white"
                              : "border-avatar-error bg-avatar-error text-white"
                            : showCorrect
                              ? "border-avatar-success bg-avatar-success text-white"
                              : isSelected
                                ? "border-avatar-accent bg-avatar-accent text-white"
                                : "border-avatar-border-light text-avatar-text-dim",
                        )}
                      >
                        {showResult
                          ? isCorrect
                            ? "✓"
                            : "✗"
                          : showCorrect
                            ? "✓"
                            : String.fromCharCode(65 + q.options.indexOf(opt))}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-avatar-border px-5 py-3">
        {!submitted ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-avatar-text-dim">
              {answeredCount} of {quiz.questions.length} answered
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={clsx(
                "rounded-xl px-5 py-2 text-sm font-medium transition-all",
                allAnswered
                  ? "bg-avatar-accent text-white hover:bg-avatar-accent-hover"
                  : "cursor-not-allowed bg-avatar-border text-avatar-text-dim",
              )}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-avatar-text">
              {result && (
                <>
                  Score:{" "}
                  <span className="font-bold text-avatar-accent">
                    {result.score}/{result.total}
                  </span>
                  {result.score === result.total ? (
                    <span className="ml-2 text-xs text-avatar-success">
                      — Perfect!
                    </span>
                  ) : result.score >= Math.ceil(result.total / 2) ? (
                    <span className="ml-2 text-xs text-avatar-warning">
                      — Good effort
                    </span>
                  ) : (
                    <span className="ml-2 text-xs text-avatar-text-dim">
                      — Try again
                    </span>
                  )}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-avatar-surface-hover px-4 py-2 text-sm font-medium text-avatar-text-muted transition-colors hover:text-avatar-text"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-avatar-border-light px-5 py-2">
        <p className="text-[10px] text-avatar-text-dim">
          Quiz results are local only and not saved or sent anywhere.
        </p>
      </div>
    </div>
  );
}
