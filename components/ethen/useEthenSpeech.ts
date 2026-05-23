"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechState = "idle" | "loading" | "speaking" | "error";

export interface PlaybackDebug {
  timestamp: string;
  providerAvailable: boolean;
  audioAvailable: boolean;
  audioBase64Length: number;
  contentType: string;
  playbackResult: "success" | "blocked" | "error" | "not_requested";
  errorMessage: string | null;
}

interface UseEthenSpeechOptions {
  onStateChange?: (state: SpeechState) => void;
}

interface UseEthenSpeechReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  speechState: SpeechState;
  audioAvailable: boolean;
  playbackBlocked: boolean;
  retryPlayback: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  lastDebug: PlaybackDebug | null;
}

export function useEthenSpeech({
  onStateChange,
}: UseEthenSpeechOptions = {}): UseEthenSpeechReturn {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [lastDebug, setLastDebug] = useState<PlaybackDebug | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSrcRef = useRef<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const cleanupObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => {
      cleanupObjectUrl();
      setSpeechState("idle");
      setPlaybackBlocked(false);
      onStateChangeRef.current?.("idle");
    };

    const handleError = () => {
      cleanupObjectUrl();
      setSpeechState("idle");
      setPlaybackBlocked(false);
      onStateChangeRef.current?.("idle");
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      cleanupObjectUrl();
      audioRef.current = null;
    };
  }, [cleanupObjectUrl]);

  const playAudio = useCallback(
    async (audio: HTMLAudioElement): Promise<boolean> => {
      try {
        audio.muted = false;
        audio.volume = 1;
        await audio.play();
        setPlaybackBlocked(false);
        setSpeechState("speaking");
        onStateChangeRef.current?.("speaking");
        return true;
      } catch (playErr) {
        if (
          playErr instanceof DOMException &&
          playErr.name === "NotAllowedError"
        ) {
          setPlaybackBlocked(true);
          setSpeechState("idle");
          onStateChangeRef.current?.("idle");
          return false;
        }
        setSpeechState("idle");
        onStateChangeRef.current?.("idle");
        return false;
      }
    },
    [],
  );

  const speak = useCallback(
    async (text: string) => {
      if (!text) return;

      setSpeechState("loading");
      setPlaybackBlocked(false);
      onStateChangeRef.current?.("loading");

      let debug: PlaybackDebug = {
        timestamp: new Date().toISOString(),
        providerAvailable: false,
        audioAvailable: false,
        audioBase64Length: 0,
        contentType: "",
        playbackResult: "not_requested",
        errorMessage: null,
      };

      try {
        const response = await fetch("/api/ethen/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          debug.errorMessage = `API returned ${response.status}`;
          setLastDebug(debug);
          setAudioAvailable(false);
          setSpeechState("idle");
          onStateChangeRef.current?.("idle");
          return;
        }

        const data = await response.json();
        debug.providerAvailable = data.audioAvailable;
        debug.audioAvailable = data.audioAvailable;
        debug.audioBase64Length = data.audioBase64?.length ?? 0;
        debug.contentType = data.contentType ?? "";

        if (!data.audioAvailable) {
          debug.errorMessage = data.reason ?? "Provider not configured";
          setLastDebug(debug);
          setAudioAvailable(false);
          setSpeechState("idle");
          onStateChangeRef.current?.("idle");
          return;
        }

        setAudioAvailable(true);

        const audio = audioRef.current;
        if (!audio) {
          debug.errorMessage = "Audio element not available";
          setLastDebug(debug);
          return;
        }

        cleanupObjectUrl();

        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.contentType });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        audio.src = url;
        audio.load();

        const played = await playAudio(audio);
        if (played) {
          debug.playbackResult = "success";
          pendingSrcRef.current = null;
        } else if (playbackBlocked) {
          debug.playbackResult = "blocked";
          pendingSrcRef.current = url;
        } else {
          debug.playbackResult = "error";
          debug.errorMessage = "Playback failed";
          cleanupObjectUrl();
        }
      } catch (err) {
        debug.errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        debug.playbackResult = "error";
        setAudioAvailable(false);
        setSpeechState("idle");
        onStateChangeRef.current?.("idle");
      }

      setLastDebug(debug);
    },
    [playbackBlocked, cleanupObjectUrl, playAudio],
  );

  const retryPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (pendingSrcRef.current && audio.src !== pendingSrcRef.current) {
      audio.src = pendingSrcRef.current;
      audio.load();
    }

    setPlaybackBlocked(false);
    audio.currentTime = 0;
    playAudio(audio);
  }, [playAudio]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    cleanupObjectUrl();
    pendingSrcRef.current = null;
    setSpeechState("idle");
    setPlaybackBlocked(false);
    onStateChangeRef.current?.("idle");
  }, [cleanupObjectUrl]);

  return {
    speak,
    stop,
    speechState,
    audioAvailable,
    playbackBlocked,
    retryPlayback,
    audioRef,
    lastDebug,
  };
}

export type { SpeechState };
