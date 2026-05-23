"use client";

import clsx from "clsx";
import { EthenBehaviorState, ETHEN_STATES } from "./ethenBehaviorTypes";
import { useEthenBehavior } from "./useEthenBehavior";
import { EthenAvatar3D } from "./EthenAvatar3D";

function BreathingIndicator({
  intensity,
  reducedMotion,
  size,
}: {
  intensity: number;
  reducedMotion: boolean;
  size: string;
}) {
  if (reducedMotion || intensity === 0) {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`rounded-full bg-gradient-to-br from-avatar-accent/40 to-avatar-accent/10 ${size}`}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={
        {
          "--breath-scale": 1 + intensity * 0.04,
          "--breath-duration": `${3 - intensity * 1.5}s`,
        } as React.CSSProperties
      }
    >
      <div
        className={`ethen-breath rounded-full bg-gradient-to-br from-avatar-accent/40 to-avatar-accent/10 ${size}`}
      />
    </div>
  );
}

function BlinkEye({
  open,
  reducedMotion,
  size,
}: {
  open: boolean;
  reducedMotion: boolean;
  size: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={clsx(
            `${size} rounded-full bg-avatar-text transition-transform duration-150`,
            reducedMotion ? "" : open ? "scale-y-100" : "scale-y-0",
          )}
        />
      ))}
    </div>
  );
}

interface EthenBehaviorPanelProps {
  initialState?: EthenBehaviorState;
  className?: string;
  showDemo?: boolean;
  mouthOpenOverride?: number;
  compact?: boolean;
  render3D?: boolean;
}

export function EthenBehaviorPanel({
  initialState = "idle",
  className,
  showDemo = false,
  mouthOpenOverride,
  compact = false,
  render3D = false,
}: EthenBehaviorPanelProps) {
  const {
    state,
    controls,
    blinkOpen,
    breathingIntensity,
    reducedMotion,
    mouthOpen,
    transitionTo,
  } = useEthenBehavior({ initialState, mouthOpenOverride });

  const panelWidth = compact
    ? "w-full max-w-[22rem]"
    : "w-full max-w-[26rem] sm:max-w-[29rem]";
  const viewportSize = compact
    ? "h-[18rem] w-[18rem]"
    : "h-[21rem] w-[21rem] sm:h-[24rem] sm:w-[24rem]";
  const shellSize = compact
    ? "h-[15.5rem] w-[15.5rem]"
    : "h-[17rem] w-[17rem] sm:h-[18.5rem] sm:w-[18.5rem]";
  const breathSize = compact ? "h-20 w-20" : "h-24 w-24";
  const eyeSize = compact ? "h-3 w-3" : "h-4 w-4";
  const padding = compact ? "p-4" : "p-5 sm:p-7";

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-3 transition-all duration-500 sm:gap-4",
        panelWidth,
        padding,
        className,
      )}
    >
      <div
        className={clsx(
          "relative flex items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(0,0,0,0.12))]",
          viewportSize,
        )}
      >
        <div
          className={clsx(
            "ethen-avatar-shell relative flex items-center justify-center overflow-hidden rounded-full border border-white/8 bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
            shellSize,
            "transition-all duration-500",
          )}
        >
          {render3D ? (
            <EthenAvatar3D
              state={state}
              className="h-full w-full"
              compact
              mouthOpen={mouthOpen}
            />
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <BlinkEye
                  open={blinkOpen}
                  reducedMotion={reducedMotion}
                  size={eyeSize}
                />
                <BreathingIndicator
                  intensity={breathingIntensity}
                  reducedMotion={reducedMotion}
                  size={breathSize}
                />
              </div>

              {state === "speaking" && !reducedMotion && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 transition-all duration-100"
                  style={{
                    width: `${Math.max(24, 12 + mouthOpen * 40)}px`,
                    height: `${Math.max(8, 4 + mouthOpen * 16)}px`,
                  }}
                >
                  <div
                    className="ethen-mouth-wave h-full w-full rounded-full bg-avatar-accent/40"
                    style={{ opacity: 0.2 + mouthOpen * 0.5 }}
                  />
                </div>
              )}

              {state === "thinking" && !reducedMotion && (
                <div className="absolute -right-2 -top-2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="ethen-think-dot h-2 w-2 rounded-full bg-avatar-warning/60"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {reducedMotion && (
        <p className="text-xs text-avatar-text-dim">Reduced motion active</p>
      )}

      {showDemo && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {ETHEN_STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => transitionTo(s)}
              className={clsx(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                state === s
                  ? "bg-avatar-accent text-white"
                  : "bg-avatar-surface text-avatar-text-muted hover:bg-avatar-surface-hover hover:text-avatar-text",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
