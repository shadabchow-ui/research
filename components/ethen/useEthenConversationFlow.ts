"use client";

import { useCallback, useRef, useState } from "react";
import type { EthenBehaviorState as ConversationPhase } from "./ethenBehaviorTypes";
import {
  useEthenSpeech,
  type SpeechState,
  type PlaybackDebug,
} from "./useEthenSpeech";
import { useEthenMicrophone, type MicState } from "./useEthenMicrophone";
import type {
  ConversationFlowEvent,
  ConversationFlowProfile,
  InterruptResult,
  InterruptSource,
} from "lib/ethen/ethenConversationFlow";
import { DEFAULT_FLOW_PROFILE } from "lib/ethen/ethenConversationFlow";

const RECOVERING_DURATION_MS = 600;

export interface UseEthenConversationFlowOptions {
  profile?: Partial<ConversationFlowProfile>;
  onFlowEvent?: (event: ConversationFlowEvent) => void;
  speechOptions?: { onStateChange?: (state: SpeechState) => void };
  micOptions?: {
    onAudioLevel?: (level: number) => void;
    onStateChange?: (state: MicState) => void;
    onAudioChunk?: (base64Chunk: string) => void;
    speechThreshold?: number;
    silenceTimeoutMs?: number;
  };
}

export interface UseEthenConversationFlowReturn {
  phase: ConversationPhase;
  speechState: SpeechState;
  audioAvailable: boolean;
  playbackBlocked: boolean;
  retryPlayback: () => void;
  lastDebug: PlaybackDebug | null;
  speakText: (text: string) => Promise<void>;
  micState: MicState;
  audioLevel: number;
  micError: string | null;
  micSupported: boolean;
  interrupt: (source?: InterruptSource) => InterruptResult;
  submitText: (
    text: string,
  ) => Promise<
    | { text: string; relatedLinks?: { label: string; href: string }[] }
    | undefined
  >;
  startListening: () => Promise<void>;
  stopListening: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  reset: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  transitionTo: (next: ConversationPhase, source?: InterruptSource) => void;
}

export function useEthenConversationFlow({
  profile: profileOverride,
  onFlowEvent,
  speechOptions,
  micOptions,
}: UseEthenConversationFlowOptions = {}): UseEthenConversationFlowReturn {
  const profile = { ...DEFAULT_FLOW_PROFILE, ...profileOverride };

  const [phase, setPhase] = useState<ConversationPhase>("idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const phaseRef = useRef<ConversationPhase>("idle");
  const flowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSpeakRef = useRef(false);

  const {
    speak,
    stop: stopSpeech,
    speechState,
    audioAvailable,
    playbackBlocked,
    retryPlayback,
    audioRef,
    lastDebug,
  } = useEthenSpeech({
    onStateChange: (s) => {
      if (s === "speaking") {
        setPhase("speaking");
        phaseRef.current = "speaking";
        emitEvent("speaking");
      }
      if (s === "idle") {
        handleSpeechEnded();
      }
    },
    ...speechOptions,
  });

  const {
    micState,
    audioLevel,
    errorMessage: micError,
    isSupported: micSupported,
    startListening: startMic,
    stopListening: stopMic,
  } = useEthenMicrophone(micOptions);

  const emitEvent = useCallback(
    (to: ConversationPhase, source?: InterruptSource) => {
      const event: ConversationFlowEvent = {
        type: "phase_change",
        from: phaseRef.current,
        to,
        timestamp: Date.now(),
        source,
      };
      onFlowEvent?.(event);
    },
    [onFlowEvent],
  );

  const clearFlowTimer = useCallback(() => {
    if (flowTimerRef.current) {
      clearTimeout(flowTimerRef.current);
      flowTimerRef.current = null;
    }
  }, []);

  const transitionTo = useCallback(
    (next: ConversationPhase, source?: InterruptSource) => {
      phaseRef.current = next;
      setPhase(next);
      emitEvent(next, source);
    },
    [emitEvent],
  );

  const handleSpeechEnded = useCallback(() => {
    if (pendingSpeakRef.current) return;
    if (phaseRef.current === "interrupted" || phaseRef.current === "recovering")
      return;

    if (micState === "listening" || micState === "user_speaking") {
      transitionTo("listening");
    } else {
      transitionTo("idle");
    }
  }, [micState, transitionTo]);

  const interrupt = useCallback(
    (source: InterruptSource = "user_button"): InterruptResult => {
      const prev = phaseRef.current;
      clearFlowTimer();

      stopSpeech();
      pendingSpeakRef.current = false;

      if (micState === "listening" || micState === "user_speaking") {
        stopMic();
      }

      const wasInterrupted =
        prev === "speaking" ||
        prev === "thinking" ||
        speechState === "speaking" ||
        speechState === "loading";

      transitionTo("interrupted", source);

      flowTimerRef.current = setTimeout(() => {
        transitionTo("recovering");

        flowTimerRef.current = setTimeout(() => {
          if (micState === "listening" || micState === "user_speaking") {
            transitionTo("listening");
          } else {
            transitionTo("idle");
          }
        }, RECOVERING_DURATION_MS);
      }, 400);

      return { wasInterrupted, source, previousPhase: prev };
    },
    [clearFlowTimer, stopSpeech, stopMic, micState, speechState, transitionTo],
  );

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (
        phaseRef.current === "speaking" &&
        (profile.interruptibility === "high" ||
          profile.interruptibility === "medium")
      ) {
        interrupt("user_speech");
      }

      if (phaseRef.current === "thinking") {
        interrupt("user_speech");
      }

      setIsProcessing(true);
      transitionTo("thinking");

      const audio = audioRef.current;
      if (audio) {
        audio.muted = true;
        audio.play().catch(() => {});
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      try {
        const { getGuideResponse } = await import("lib/ethen/ethenGuide");
        const response = getGuideResponse(trimmed);

        if (phaseRef.current === "interrupted") {
          setIsProcessing(false);
          return;
        }

        transitionTo("idle");
        setIsProcessing(false);

        pendingSpeakRef.current = true;
        await speak(response.text);
        pendingSpeakRef.current = false;

        return response;
      } catch {
        transitionTo("error");
        setIsProcessing(false);

        flowTimerRef.current = setTimeout(() => {
          transitionTo("idle");
        }, 2000);
      }
    },
    [interrupt, profile.interruptibility, transitionTo, speak],
  );

  const startListening = useCallback(async () => {
    if (phaseRef.current === "speaking") {
      interrupt("user_speech");
    }
    transitionTo("listening");
    await startMic();
  }, [interrupt, transitionTo, startMic]);

  const stopListeningLocal = useCallback(() => {
    stopMic();
    if (
      phaseRef.current === "listening" ||
      phaseRef.current === "user_speaking"
    ) {
      transitionTo("idle");
    }
  }, [stopMic, transitionTo]);

  const reset = useCallback(() => {
    clearFlowTimer();
    stopSpeech();
    stopMic();
    pendingSpeakRef.current = false;
    setIsProcessing(false);
    transitionTo("idle", "reset");
  }, [clearFlowTimer, stopSpeech, stopMic, transitionTo]);

  return {
    phase,
    speechState,
    audioAvailable,
    playbackBlocked,
    retryPlayback,
    lastDebug,
    speakText: speak,
    micState,
    audioLevel,
    micError,
    micSupported,
    interrupt,
    submitText,
    startListening,
    stopListening: stopListeningLocal,
    isSpeaking: phase === "speaking" || speechState === "speaking",
    isListening: micState === "listening" || micState === "user_speaking",
    isProcessing,
    reset,
    audioRef,
    transitionTo,
  };
}

export type { ConversationPhase, SpeechState, MicState };
