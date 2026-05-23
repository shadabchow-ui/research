"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EthenBehaviorState, STATE_CONTROLS } from "./ethenBehaviorTypes";
import { useEthenSpeech, SpeechState } from "./useEthenSpeech";
import { useEthenMicrophone, MicState } from "./useEthenMicrophone";
import { EthenAvatar3D } from "./EthenAvatar3D";

interface PromptEntry {
  text: string;
  response: string;
}

const PROMPTS: PromptEntry[] = [
  {
    text: "What can you build with avatars?",
    response:
      "You can build live AI avatar agents for your website, generate avatar-led videos from scripts or documents, create interactive video pages with quizzes and lead capture, or use our developer API to build custom avatar experiences.",
  },
  {
    text: "Show me the platform",
    response:
      "Upcube Avatar Cloud has four products: Live Avatar for real-time conversational agents, Studio for generating avatar videos, Interactive Pages for turning videos into engaging experiences, and the Avatar API for developers.",
  },
  {
    text: "How does Ethen work?",
    response:
      "I am Ethen, Upcube's flagship AI avatar guide. I can explain products, answer questions, and help you navigate the Upcube ecosystem. In the future, I will also listen through your microphone for natural conversation.",
  },
  {
    text: "Tell me about pricing",
    response:
      "Upcube Avatar Cloud is still in development. We will offer a Free plan for testing, Creator and Business plans for production use, a Developer plan with API access, and Enterprise plans with SSO and custom controls.",
  },
];

const PROMPT_RESPONSES: Record<string, string> = {};
for (const p of PROMPTS) {
  PROMPT_RESPONSES[p.text] = p.response;
}

const INITIAL_MESSAGE =
  "Hi, I am Ethen, Upcube's AI avatar guide. Ask me anything about the platform.";

function mapSpeechToBehavior(speechState: SpeechState): EthenBehaviorState {
  switch (speechState) {
    case "loading":
      return "thinking";
    case "speaking":
      return "speaking";
    default:
      return "idle";
  }
}

function mapMicToBehavior(micState: MicState): EthenBehaviorState {
  switch (micState) {
    case "requesting_permission":
      return "thinking";
    case "listening":
      return "listening";
    case "user_speaking":
      return "user_speaking";
    case "error":
      return "error";
    default:
      return "idle";
  }
}

function micStateLabel(state: MicState): string {
  switch (state) {
    case "idle":
      return "Mic off";
    case "requesting_permission":
      return "Requesting...";
    case "listening":
      return "Listening";
    case "user_speaking":
      return "User speaking";
    case "error":
      return "Mic error";
  }
}

export function EthenDemoPanel() {
  const [behaviorState, setBehaviorState] =
    useState<EthenBehaviorState>("idle");
  const [responseText, setResponseText] = useState<string | null>(
    INITIAL_MESSAGE,
  );
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [sttStatus, setSttStatus] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(true);

  const handleSpeechStateChange = useCallback((speechState: SpeechState) => {
    setBehaviorState(mapSpeechToBehavior(speechState));
  }, []);

  const { speak, stop, speechState, audioAvailable } = useEthenSpeech({
    onStateChange: handleSpeechStateChange,
  });

  const ttsActive = speechState === "loading" || speechState === "speaking";

  const handleMicStateChange = useCallback(
    (micState: MicState) => {
      if (!ttsActive || micState === "error") {
        setBehaviorState(mapMicToBehavior(micState));
      }
    },
    [ttsActive],
  );

  const {
    micState,
    audioLevel,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
  } = useEthenMicrophone({
    onStateChange: handleMicStateChange,
  });

  useEffect(() => {
    if (!micEnabled) {
      if (micState !== "idle" && micState !== "error") {
        stopListening();
      }
    }
  }, [micEnabled, micState, stopListening]);

  const handlePromptClick = useCallback(
    async (promptText: string) => {
      const response = PROMPT_RESPONSES[promptText];
      if (!response) return;

      setBehaviorState("thinking");
      setResponseText(null);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setResponseText(response);

      if (voiceEnabled && speechState !== "speaking") {
        try {
          await speak(response);
        } catch {
          if (audioAvailable) {
            setBehaviorState("idle");
          }
        }
      }
    },
    [voiceEnabled, speechState, speak, audioAvailable],
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) {
        stop();
      }
      return !prev;
    });
  }, [stop]);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => {
      if (prev) {
        stopListening();
        setSttStatus(null);
        setLastTranscript(null);
      } else {
        startListening();
      }
      return !prev;
    });
  }, [stopListening, startListening]);

  const displayState = useMemo((): EthenBehaviorState => {
    if (ttsActive) return behaviorState;
    if (micEnabled && micState !== "idle") {
      return mapMicToBehavior(micState);
    }
    return behaviorState;
  }, [ttsActive, behaviorState, micEnabled, micState]);

  const current = STATE_CONTROLS[displayState];

  return (
    <div className="w-full max-w-lg rounded-2xl border border-avatar-border bg-avatar-surface/30 backdrop-blur-sm avatar-glow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-avatar-border px-5 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-avatar-accent-subtle px-3 py-1 text-xs font-medium text-avatar-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-avatar-accent" />
          Try Ethen
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMic}
            disabled={!isSupported || micState === "requesting_permission"}
            title={
              !isSupported
                ? "Microphone not supported in this browser"
                : "Enable microphone for voice input"
            }
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              micEnabled
                ? "bg-avatar-accent text-white"
                : "bg-avatar-surface text-avatar-text-dim hover:text-avatar-text hover:bg-avatar-surface-hover",
              !isSupported && "opacity-50 cursor-not-allowed",
            )}
          >
            {micEnabled ? "Mic on" : "Mic off"}
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            disabled={!audioAvailable && speechState === "idle"}
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              voiceEnabled
                ? "bg-avatar-accent text-white"
                : "bg-avatar-surface text-avatar-text-dim hover:text-avatar-text hover:bg-avatar-surface-hover",
              !audioAvailable &&
                speechState === "idle" &&
                "opacity-50 cursor-not-allowed",
            )}
            title={
              audioAvailable
                ? "Toggle voice"
                : "No TTS provider configured - voice unavailable"
            }
          >
            {voiceEnabled ? "Voice" : "Voice"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center px-5 py-8">
        <div
          className={clsx(
            "mb-4 flex h-44 w-44 items-center justify-center rounded-full border-2 transition-all duration-500 overflow-hidden",
            current.glowIntensity === "strong"
              ? "border-avatar-accent/50 shadow-lg shadow-avatar-accent/20"
              : current.glowIntensity === "medium"
                ? "border-avatar-border-light shadow-md shadow-avatar-glow"
                : "border-avatar-border",
          )}
        >
          {webgl ? (
            <EthenAvatar3D
              state={displayState}
              className="h-full w-full"
              compact
            />
          ) : (
            <div className="text-center">
              <div className="mb-2 text-4xl">
                {displayState === "speaking"
                  ? "💬"
                  : displayState === "thinking"
                    ? "💭"
                    : displayState === "listening" ||
                        displayState === "user_speaking"
                      ? "🎙️"
                      : "👤"}
              </div>
              <p className="text-xs text-avatar-text-dim">Ethen 3D avatar</p>
              <p className="text-[10px] text-avatar-text-dim/60">
                WebGL unavailable
              </p>
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span
            className={clsx(
              "h-2 w-2 rounded-full transition-colors duration-300",
              displayState === "idle" && "bg-neutral-500",
              displayState === "listening" && "bg-avatar-info",
              displayState === "user_speaking" && "bg-avatar-accent",
              displayState === "thinking" && "bg-avatar-warning",
              displayState === "speaking" && "bg-avatar-accent",
              displayState === "error" && "bg-avatar-error",
            )}
          />
          <span className="text-sm font-medium text-avatar-text">
            {micEnabled && micState !== "idle"
              ? micStateLabel(micState)
              : current.statusLabel}
          </span>

          {micEnabled && micState !== "idle" && micState !== "error" && (
            <span className="text-[11px] text-avatar-text-dim">
              audio: {Math.round(audioLevel * 100)}%
            </span>
          )}
        </div>

        {micEnabled && micState !== "idle" && micState !== "error" && (
          <div className="mb-4 w-full max-w-sm">
            <div className="h-1 w-full rounded-full bg-avatar-border">
              <div
                className="h-1 rounded-full bg-avatar-accent transition-all duration-100"
                style={{ width: `${Math.min(100, audioLevel * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-5 min-h-[4rem] w-full max-w-sm rounded-lg bg-avatar-surface/50 p-3">
          {responseText ? (
            <p className="text-sm text-avatar-text leading-relaxed">
              {responseText}
            </p>
          ) : (
            <p className="text-sm text-avatar-text-dim/60 italic">
              {displayState === "thinking"
                ? "Thinking..."
                : displayState === "listening"
                  ? "Listening..."
                  : displayState === "user_speaking"
                    ? "I hear you..."
                    : "Select a prompt below to ask Ethen a question."}
            </p>
          )}
        </div>

        {lastTranscript && (
          <div className="mb-4 w-full max-w-sm rounded-lg border border-dashed border-avatar-border bg-avatar-surface/30 px-3 py-2">
            <p className="text-xs text-avatar-text-dim">Transcript:</p>
            <p className="text-sm text-avatar-text">{lastTranscript}</p>
          </div>
        )}

        {speechState === "speaking" && (
          <div className="mb-4">
            <button
              type="button"
              onClick={stop}
              className="rounded-full bg-avatar-error/20 px-3 py-1 text-xs font-medium text-avatar-error hover:bg-avatar-error/30 transition-colors"
            >
              Stop speaking
            </button>
          </div>
        )}

        <div className="mb-4 grid w-full grid-cols-2 gap-2">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              type="button"
              onClick={() => handlePromptClick(prompt.text)}
              disabled={speechState === "loading"}
              className={clsx(
                "rounded-lg border border-avatar-border bg-avatar-surface/50 px-3 py-2.5 text-xs text-avatar-text-dim text-left transition-colors",
                "hover:border-avatar-accent/50 hover:text-avatar-text hover:bg-avatar-surface",
                speechState === "loading" && "opacity-50 cursor-wait",
              )}
            >
              {prompt.text}
            </button>
          ))}
        </div>

        {micEnabled && micState !== "idle" && (
          <div className="mb-4 w-full max-w-sm rounded-lg bg-avatar-warning/10 px-4 py-2.5 text-xs text-avatar-warning/80 text-center">
            Audio is being captured locally. Real-time speech-to-text is not yet
            configured — no STT provider API key set. In the next update, spoken
            transcripts will appear here.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 w-full max-w-sm rounded-lg bg-avatar-error/10 px-4 py-2.5 text-xs text-avatar-error/80 text-center">
            {errorMessage}
          </div>
        )}

        {!audioAvailable && voiceEnabled && (
          <div className="rounded-lg bg-avatar-warning/10 px-4 py-2.5 text-xs text-avatar-warning/80 text-center">
            Voice output is not available because no TTS provider is configured.
            Text responses will still appear. Set a TTS provider API key in your
            environment to enable speech.
          </div>
        )}
      </div>
    </div>
  );
}
