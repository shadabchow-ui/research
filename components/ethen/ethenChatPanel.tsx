"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { EthenBehaviorPanel } from "./ethen-behavior-panel";
import { CTAButton } from "components/ui/cta-button";
import { useEthenConversationFlow } from "./useEthenConversationFlow";
import { useWebAudioMouthMovement } from "./useWebAudioMouthMovement";
import type { ConversationFlowProfile } from "lib/ethen/ethenConversationFlow";

const SUGGESTIONS = [
  "What is Upcube Avatar Cloud?",
  "What is Ethen?",
  "What is Live Avatar?",
  "What is Studio?",
  "What are Interactive Video Pages?",
  "Website concierge / AI SDR",
];

interface Message {
  role: "user" | "assistant";
  text: string;
  relatedLinks?: { label: string; href: string }[];
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

const FLOW_PROFILE: Partial<ConversationFlowProfile> = {
  interruptibility: "high",
  turnTakingPatience: "medium",
  idleEngagement: "soft",
};

export function EthenChatPanel({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi, I'm Ethen! Ask me anything about Upcube Avatar Cloud — products, use cases, or how to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    phase,
    speechState,
    audioAvailable,
    playbackBlocked,
    retryPlayback,
    isSpeaking,
    isProcessing,
    interrupt,
    submitText,
    audioRef,
  } = useEthenConversationFlow({
    profile: FLOW_PROFILE,
  });

  const { resumeAudioContext } = useWebAudioMouthMovement();

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const handleSubmit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isProcessing || isSpeaking) return;

      setInput("");
      setError(null);

      resumeAudioContext();

      addMessage({ role: "user", text: trimmed });

      const result = await submitText(trimmed);
      if (result) {
        addMessage({
          role: "assistant",
          text: result.text,
          relatedLinks: result.relatedLinks,
        });
      } else {
        addMessage({
          role: "assistant",
          text: "Interrupted. You can ask me something else.",
        });
      }
    },
    [isProcessing, isSpeaking, submitText, addMessage],
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSubmit(text);
    },
    [handleSubmit],
  );

  const handleInterrupt = useCallback(() => {
    interrupt("user_button");
  }, [interrupt]);

  const showInterrupt = isSpeaking || phase === "thinking";

  return (
    <div
      className={clsx(
        "flex flex-col overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(18,18,20,0.98),rgba(10,10,11,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.26)]",
        className,
      )}
    >
      <div className="flex items-center justify-center px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-7">
        <div className="flex flex-col items-center gap-3">
          {!webgl && (
            <span className="rounded-lg border border-avatar-border bg-avatar-bg px-3 py-1.5 text-xs text-avatar-text-muted">
              WebGL unavailable — showing placeholder
            </span>
          )}
          <EthenBehaviorPanel
            key={phase}
            initialState={phase}
            render3D={webgl}
          />
          {!webgl && (
            <p className="text-xs text-avatar-text-dim">
              Your browser does not support WebGL. The avatar panel is shown in
              fallback mode.
            </p>
          )}
        </div>
      </div>

      {messages.length <= 1 && !isProcessing && !isSpeaking && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 pt-1 sm:px-6">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-avatar-text-muted transition-colors hover:bg-white/[0.06] hover:text-avatar-text"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        ref={listRef}
        className="flex flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-6"
        style={{ maxHeight: "min(400px, 45vh)", minHeight: "200px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              "flex flex-col",
              msg.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={clsx(
                "max-w-[90%] rounded-xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[85%]",
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/[0.04] text-avatar-text",
              )}
            >
              {msg.text}
            </div>
            {msg.relatedLinks && msg.relatedLinks.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.relatedLinks.map((link) => (
                  <CTAButton
                    key={link.href}
                    href={link.href}
                    variant="ghost"
                    size="sm"
                  >
                    {link.label}
                  </CTAButton>
                ))}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-xl bg-white/[0.04] px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="ethen-think-dot h-2 w-2 rounded-full bg-avatar-accent/60"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {isSpeaking && !isProcessing && (
          <div className="flex flex-col items-start gap-2">
            <div className="max-w-[85%] rounded-xl bg-white/[0.05] px-4 py-2 text-xs text-avatar-text-muted">
              Ethen is speaking...
            </div>
            <button
              type="button"
              onClick={handleInterrupt}
              className="rounded-lg border border-avatar-error/40 bg-avatar-error/10 px-3 py-1.5 text-xs font-medium text-avatar-error transition-colors hover:bg-avatar-error/20"
            >
              Stop speaking
            </button>
          </div>
        )}

        {playbackBlocked && audioAvailable && (
          <div className="flex items-start">
            <button
              type="button"
              onClick={retryPlayback}
              className="max-w-[85%] rounded-xl bg-avatar-warning/10 px-4 py-3 text-xs text-avatar-warning hover:bg-avatar-warning/20 transition-colors text-left"
            >
              Tap to play Ethen&apos;s voice
            </button>
          </div>
        )}

        {phase === "interrupted" && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-xl bg-avatar-warning/10 px-4 py-2 text-xs text-avatar-warning">
              Interrupted — recovering...
            </div>
          </div>
        )}

        {phase === "recovering" && (
          <div className="flex items-start">
            <div className="max-w-[85%] rounded-xl bg-avatar-info/10 px-4 py-2 text-xs text-avatar-info">
              Recovering — ready for next message
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-avatar-error/30 bg-avatar-error/10 px-4 py-2 text-sm text-avatar-error">
            {error}
          </div>
        )}

        {messages.length <= 1 && !isProcessing && !isSpeaking && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-avatar-text-dim">
              Type a question or pick a topic above
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/6 px-4 py-3 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Ethen about Upcube..."
            disabled={isProcessing}
            className="min-w-0 flex-1 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/10 disabled:opacity-50"
          />
          {showInterrupt ? (
            <button
              type="button"
              onClick={handleInterrupt}
              className="flex items-center gap-2 rounded-xl bg-avatar-error px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-avatar-error/90"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={isProcessing || isSpeaking || !input.trim()}
              className={clsx(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
                isProcessing || isSpeaking || !input.trim()
                  ? "cursor-not-allowed bg-avatar-border text-avatar-text-dim"
                  : "bg-avatar-accent text-white hover:bg-avatar-accent/90",
              )}
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
