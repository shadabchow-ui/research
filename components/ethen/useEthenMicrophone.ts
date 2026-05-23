"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MicState =
  | "idle"
  | "requesting_permission"
  | "listening"
  | "user_speaking"
  | "error";

interface UseEthenMicrophoneOptions {
  onAudioLevel?: (level: number) => void;
  onStateChange?: (state: MicState) => void;
  onAudioChunk?: (base64Chunk: string) => void;
  speechThreshold?: number;
  silenceTimeoutMs?: number;
}

interface UseEthenMicrophoneReturn {
  micState: MicState;
  audioLevel: number;
  errorMessage: string | null;
  isSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

const DEFAULT_SPEECH_THRESHOLD = 0.03;
const DEFAULT_SILENCE_TIMEOUT = 1500;

export function useEthenMicrophone({
  onAudioLevel,
  onStateChange,
  onAudioChunk,
  speechThreshold = DEFAULT_SPEECH_THRESHOLD,
  silenceTimeoutMs = DEFAULT_SILENCE_TIMEOUT,
}: UseEthenMicrophoneOptions = {}): UseEthenMicrophoneReturn {
  const [micState, setMicState] = useState<MicState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<MicState>("idle");

  const setStateRefAndCb = useCallback(
    (next: MicState) => {
      stateRef.current = next;
      setMicState(next);
      onStateChange?.(next);
    },
    [onStateChange],
  );

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recorderRef.current?.state !== "inactive") {
      try {
        recorderRef.current!.stop();
      } catch {
        // recorder already stopped
      }
    }
    recorderRef.current = null;

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (ctxRef.current) {
      if (ctxRef.current.state !== "closed") {
        ctxRef.current.close().catch(() => {});
      }
      ctxRef.current = null;
    }

    analyserRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    setAudioLevel(0);
    silenceTimerRef.current = null;
  }, []);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" && !!navigator?.mediaDevices?.getUserMedia,
    );

    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startListening = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !navigator?.mediaDevices?.getUserMedia
    ) {
      setErrorMessage("Microphone not supported in this browser.");
      setStateRefAndCb("error");
      return;
    }

    cleanup();

    setErrorMessage(null);
    setStateRefAndCb("requesting_permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setStateRefAndCb("listening");

      let chunks: Blob[] = [];

      try {
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
        });

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (chunks.length > 0 && onAudioChunk) {
            const blob = new Blob(chunks, { type: recorder.mimeType });
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(",")[1];
              if (base64) {
                onAudioChunk(base64);
              }
            };
            reader.readAsDataURL(blob);
          }
          chunks = [];
        };

        recorderRef.current = recorder;
        recorder.start(1000);
      } catch {
        // MediaRecorder unsupported — audio level still works
      }

      const tick = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] ?? 0;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / bufferLength);
        const level = Math.min(1, rms / 128);

        setAudioLevel(level);
        onAudioLevel?.(level);

        const isSpeaking = level > speechThreshold;

        if (isSpeaking) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          if (stateRef.current !== "user_speaking") {
            setStateRefAndCb("user_speaking");
          }
        } else {
          if (
            !silenceTimerRef.current &&
            stateRef.current === "user_speaking"
          ) {
            silenceTimerRef.current = setTimeout(() => {
              if (stateRef.current !== "error") {
                setStateRefAndCb("listening");
              }
            }, silenceTimeoutMs);
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (err) {
      const domErr = err as DOMException;

      if (domErr?.name === "NotAllowedError") {
        setErrorMessage(
          "Microphone permission was denied. Allow microphone access in browser settings to use voice.",
        );
      } else if (domErr?.name === "NotFoundError") {
        setErrorMessage(
          "No microphone found. Please connect a microphone and try again.",
        );
      } else {
        setErrorMessage(
          "Could not access microphone. Please check your browser settings.",
        );
      }

      cleanup();
      setStateRefAndCb("error");
    }
  }, [
    cleanup,
    onAudioLevel,
    onAudioChunk,
    setStateRefAndCb,
    speechThreshold,
    silenceTimeoutMs,
  ]);

  const stopListening = useCallback(() => {
    cleanup();
    setErrorMessage(null);
    setStateRefAndCb("idle");
  }, [cleanup, setStateRefAndCb]);

  return {
    micState,
    audioLevel,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
  };
}
