"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebAudioMouthMovementOptions {
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  enabled?: boolean;
  demoMode?: boolean;
}

interface UseWebAudioMouthMovementResult {
  mouthLevel: number;
  isActive: boolean;
  connectAudio: (audioElement: HTMLAudioElement) => void;
  disconnectAudio: () => void;
  resumeAudioContext: () => Promise<void>;
}

const SMOOTH_FACTOR = 0.3;
const RMS_SCALE = 2.5;
const DECAY_RATE = 0.85;
const DECAY_FLOOR = 0.01;

export function useWebAudioMouthMovement({
  audioRef,
  enabled = true,
  demoMode = false,
}: UseWebAudioMouthMovementOptions = {}): UseWebAudioMouthMovementResult {
  const [mouthLevel, setMouthLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef(0);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const smoothRef = useRef(0);
  const activeRef = useRef(false);
  const demoRafRef = useRef(0);
  const demoTimerRef = useRef(0);
  const playHandlerRef = useRef<(() => void) | null>(null);

  const resumeAudioContext = useCallback(async (): Promise<void> => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // context already closed or blocked
      }
    }
  }, []);

  const getAudioContext = useCallback(() => {
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      return ctxRef.current;
    }
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (demoRafRef.current) {
      cancelAnimationFrame(demoRafRef.current);
      demoRafRef.current = 0;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopLoop();

    if (playHandlerRef.current) {
      const el = audioElRef.current;
      if (el) {
        el.removeEventListener("play", playHandlerRef.current);
      }
      playHandlerRef.current = null;
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {
        // already disconnected
      }
      sourceRef.current = null;
    }
    audioElRef.current = null;
    analyserRef.current = null;
    smoothRef.current = 0;
    activeRef.current = false;
    setMouthLevel(0);
    setIsActive(false);
  }, [stopLoop]);

  const startLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    activeRef.current = true;
    setIsActive(true);

    const tick = () => {
      if (!activeRef.current) return;

      const audio = audioElRef.current;
      if (!audio || audio.ended || audio.paused) {
        smoothRef.current *= DECAY_RATE;
        if (smoothRef.current < DECAY_FLOOR) {
          smoothRef.current = 0;
          activeRef.current = false;
          setIsActive(false);
        }
        setMouthLevel(smoothRef.current);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const sample = dataArray[i] as number;
        const v = (sample - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / bufferLength);
      const amplitude = Math.min(rms * RMS_SCALE, 1);

      smoothRef.current += (amplitude - smoothRef.current) * SMOOTH_FACTOR;
      setMouthLevel(smoothRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const connectAudio = useCallback(
    (audio: HTMLAudioElement) => {
      if (!audio) return;

      cleanup();

      const ctx = getAudioContext();
      if (!ctx) return;

      ctxRef.current = ctx;
      audioElRef.current = audio;

      try {
        const source = ctx.createMediaElementSource(audio);
        const analyser = analyserRef.current;
        if (!analyser) {
          cleanup();
          return;
        }
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      } catch {
        cleanup();
        return;
      }

      const onPlay = () => {
        resumeAudioContext();
      };
      playHandlerRef.current = onPlay;
      audio.addEventListener("play", onPlay);

      startLoop();
    },
    [cleanup, getAudioContext, startLoop, resumeAudioContext],
  );

  const disconnectAudio = useCallback(() => {
    cleanup();
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, [cleanup]);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    if (demoMode) {
      activeRef.current = true;
      setIsActive(true);
      const demoAnim = () => {
        demoTimerRef.current += 0.05;
        const raw =
          Math.sin(demoTimerRef.current * 3) * 0.5 +
          Math.sin(demoTimerRef.current * 7) * 0.3 +
          Math.sin(demoTimerRef.current * 11) * 0.2;
        const clamped = Math.max(0, Math.min(1, (raw + 0.7) * 0.5));
        smoothRef.current =
          smoothRef.current + (clamped - smoothRef.current) * SMOOTH_FACTOR;
        setMouthLevel(smoothRef.current);
        demoRafRef.current = requestAnimationFrame(demoAnim);
      };
      demoAnim();
      return cleanup;
    }

    if (audioRef?.current) {
      connectAudio(audioRef.current);
    }

    return () => {
      disconnectAudio();
    };
  }, [enabled, demoMode, audioRef, connectAudio, disconnectAudio, cleanup]);

  return {
    mouthLevel,
    isActive,
    connectAudio,
    disconnectAudio,
    resumeAudioContext,
  };
}
