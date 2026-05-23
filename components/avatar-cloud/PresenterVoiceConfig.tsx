"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import { StatusChip } from "components/ui/status-chip";

export interface PresenterOption {
  id: string;
  name: string;
  replicaId: string;
  voiceStatus: "not_configured" | "preview_only";
  voiceLabel: string;
}

export const DEMO_PRESENTERS: PresenterOption[] = [
  {
    id: "ethen_guide",
    name: "Ethen Guide",
    replicaId: "sample_ethen_replica",
    voiceStatus: "not_configured",
    voiceLabel: "not_configured",
  },
  {
    id: "website_concierge",
    name: "Website Concierge",
    replicaId: "sample_website_concierge_replica",
    voiceStatus: "not_configured",
    voiceLabel: "not_configured",
  },
  {
    id: "training_coach",
    name: "Training Coach",
    replicaId: "sample_training_coach_replica",
    voiceStatus: "not_configured",
    voiceLabel: "not_configured",
  },
];

function estimateReadSeconds(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 3.3);
}

interface PreviewVoiceoverButtonProps {
  text: string;
}

function PreviewVoiceoverButton({ text }: PreviewVoiceoverButtonProps) {
  const [previewState, setPreviewState] = useState<
    "idle" | "loading" | "playing" | "unavailable"
  >("idle");

  const handlePreview = useCallback(async () => {
    if (!text.trim()) return;
    setPreviewState("loading");
    try {
      const res = await fetch("/api/ethen/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 500) }),
      });
      const data = await res.json();
      if (!data.audioAvailable) {
        setPreviewState("unavailable");
        return;
      }
      const binary = atob(data.audioBase64 as string);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.contentType as string });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPreviewState("idle");
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPreviewState("unavailable");
        URL.revokeObjectURL(url);
      };
      setPreviewState("playing");
      await audio.play();
    } catch {
      setPreviewState("unavailable");
    }
  }, [text]);

  if (previewState === "unavailable") {
    return (
      <div className="flex items-center gap-2">
        <StatusChip
          label="Voiceover unavailable"
          variant="warning"
          dot={false}
        />
        <span className="text-[11px] text-avatar-text-dim">
          Configure a TTS provider in your environment variables.
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePreview}
      disabled={previewState === "loading" || !text.trim()}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        previewState === "playing"
          ? "bg-avatar-accent text-white"
          : "border border-avatar-border-light bg-avatar-surface text-avatar-text-muted hover:border-avatar-accent/50 hover:text-avatar-text",
      )}
    >
      {previewState === "loading" && "Loading..."}
      {previewState === "playing" && "Playing..."}
      {previewState === "idle" && "Preview voiceover"}
    </button>
  );
}

interface PresenterVoiceConfigProps {
  sceneIndex: number;
  sceneText: string;
  selectedPresenterId: string;
  onPresenterChange: (presenterId: string) => void;
}

export function PresenterVoiceConfig({
  sceneIndex,
  sceneText,
  selectedPresenterId,
  onPresenterChange,
}: PresenterVoiceConfigProps) {
  const selected =
    DEMO_PRESENTERS.find((p) => p.id === selectedPresenterId) ??
    DEMO_PRESENTERS[0]!;
  const readTime = estimateReadSeconds(sceneText);

  return (
    <div className="border-t border-avatar-border/50 bg-avatar-bg/30 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">
        {/* Presenter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium text-avatar-text-dim">
            Presenter
          </label>
          <select
            value={selectedPresenterId}
            onChange={(e) => onPresenterChange(e.target.value)}
            className="rounded-lg border border-avatar-border-light bg-avatar-surface px-2.5 py-1 text-xs text-avatar-text outline-hidden focus:border-avatar-accent"
          >
            {DEMO_PRESENTERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Voice */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-avatar-text-dim">
            Voice
          </span>
          <StatusChip
            label={selected.voiceLabel}
            variant={
              selected.voiceStatus === "not_configured" ? "warning" : "success"
            }
            dot={selected.voiceStatus !== "not_configured"}
          />
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-avatar-text-dim">
            Duration
          </span>
          <span className="text-xs text-avatar-text-muted tabular-nums">
            ~{readTime}s
          </span>
        </div>

        {/* Preview */}
        <div className="ml-auto">
          {sceneText.trim() && <PreviewVoiceoverButton text={sceneText} />}
        </div>
      </div>
    </div>
  );
}
