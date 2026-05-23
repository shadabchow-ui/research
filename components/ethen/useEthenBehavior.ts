"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EthenBehaviorConfig,
  EthenBehaviorState,
  STATE_CONTROLS,
  STATE_TRANSITIONS,
} from "./ethenBehaviorTypes";

const DEFAULT_CONFIG: EthenBehaviorConfig = {
  blinkIntervalMs: 4000,
  idleSwayIntensity: 0.3,
  transitionSpeedMs: 400,
  reducedMotion: false,
};

interface UseEthenBehaviorOptions {
  initialState?: EthenBehaviorState;
  config?: Partial<EthenBehaviorConfig>;
  mouthOpenOverride?: number;
}

export function useEthenBehavior({
  initialState = "idle",
  config: configOverride,
  mouthOpenOverride,
}: UseEthenBehaviorOptions = {}) {
  const config = { ...DEFAULT_CONFIG, ...configOverride };
  const [state, setState] = useState<EthenBehaviorState>(initialState);
  const [blinkOpen, setBlinkOpen] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const blinkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const startBlinkLoop = useCallback(() => {
    if (blinkTimer.current) clearInterval(blinkTimer.current);
    if (reducedMotion) {
      setBlinkOpen(true);
      return;
    }
    const blink = () => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 150);
    };
    const jitter = () => Math.random() * 2000 - 1000;
    blink();
    blinkTimer.current = setInterval(blink, config.blinkIntervalMs + jitter());
  }, [reducedMotion, config.blinkIntervalMs]);

  useEffect(() => {
    startBlinkLoop();
    return () => {
      if (blinkTimer.current) clearInterval(blinkTimer.current);
    };
  }, [startBlinkLoop]);

  const transitionTo = useCallback(
    (nextState: EthenBehaviorState) => {
      const allowed = STATE_TRANSITIONS[state];
      if (allowed && !allowed.includes(nextState)) return;

      if (transitionTimer.current) clearTimeout(transitionTimer.current);

      transitionTimer.current = setTimeout(
        () => {
          setState(nextState);
        },
        reducedMotion ? 0 : config.transitionSpeedMs,
      );
    },
    [state, reducedMotion, config.transitionSpeedMs],
  );

  const controls = STATE_CONTROLS[state];
  const effectiveBreathing = reducedMotion ? 0 : controls.breathingIntensity;
  const effectiveMouthOpen =
    mouthOpenOverride !== undefined && state === "speaking"
      ? mouthOpenOverride
      : controls.mouthOpen;

  return {
    state,
    controls,
    blinkOpen,
    breathingIntensity: effectiveBreathing,
    mouthOpen: effectiveMouthOpen,
    reducedMotion,
    transitionTo,
    config,
  };
}
