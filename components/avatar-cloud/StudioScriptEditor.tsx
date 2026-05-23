"use client";

import { useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import { StatusChip } from "components/ui/status-chip";
import { CTAButton } from "components/ui/cta-button";
import { splitScriptIntoScenes } from "lib/avatar-cloud/studio-scene";
import {
  createCaptionsFromScenes,
  createTranscriptFromScenes,
  formatTranscriptAsPlainText,
  formatCaptionsAsSRT,
} from "lib/avatar-cloud/studio";
import type {
  SceneCaptionResult,
  TranscriptData,
} from "lib/avatar-cloud/studio";
import {
  PresenterVoiceConfig,
  DEMO_PRESENTERS,
} from "components/avatar-cloud/PresenterVoiceConfig";

const DEFAULT_SCRIPT = `Welcome to Upcube Avatar Cloud.

In this demo, you will learn how to create avatar-led videos using Studio Lite.

First, write your script as paragraphs. Each paragraph becomes a scene card.

You can edit each scene individually. The editor is fully client-side.

Rendering, voiceover, captions, and publishing will be added in later updates.`;

function formatDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `~${mins}m`;
  return `~${mins}m ${secs}s`;
}

export function StudioScriptEditor() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sceneEdits, setSceneEdits] = useState<Record<number, string>>({});
  const [scenePresenters, setScenePresenters] = useState<
    Record<number, string>
  >({});

  const getPresenterId = useCallback(
    (index: number): string => scenePresenters[index] ?? DEMO_PRESENTERS[0]!.id,
    [scenePresenters],
  );

  const handlePresenterChange = useCallback(
    (index: number, presenterId: string) => {
      setScenePresenters((prev) => ({ ...prev, [index]: presenterId }));
    },
    [],
  );

  const splitResult = useMemo(() => splitScriptIntoScenes(script), [script]);

  const handleScriptChange = useCallback((value: string) => {
    setScript(value);
    setSceneEdits({});
    setEditingIndex(null);
  }, []);

  const handleSceneEdit = useCallback((index: number, value: string) => {
    setSceneEdits((prev) => ({ ...prev, [index]: value }));
  }, []);

  const getSceneText = useCallback(
    (index: number): string => {
      const original = splitResult.scenes[index];
      if (original === undefined) return "";
      return sceneEdits[index] ?? original;
    },
    [splitResult.scenes, sceneEdits],
  );

  const totalWords = useMemo(() => {
    return splitResult.scenes.reduce((sum, _, i) => {
      return sum + getSceneText(i).split(/\s+/).filter(Boolean).length;
    }, 0);
  }, [splitResult.scenes, getSceneText]);

  const readSeconds = useMemo(() => Math.ceil(totalWords / 3.3), [totalWords]);

  const [showCaptions, setShowCaptions] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const sceneData = useMemo(() => {
    return splitResult.scenes.map((_, i) => ({
      id: `scene_${i}`,
      index: i,
      title: `Scene ${i + 1}`,
      script: getSceneText(i),
    }));
  }, [splitResult.scenes, getSceneText]);

  const captionsResult: SceneCaptionResult[] = useMemo(
    () => (sceneData.length > 0 ? createCaptionsFromScenes(sceneData) : []),
    [sceneData],
  );

  const transcriptData: TranscriptData = useMemo(
    () =>
      sceneData.length > 0
        ? createTranscriptFromScenes(sceneData)
        : { speakers: [], blocks: [], totalDurationMs: 0 },
    [sceneData],
  );

  const hasBeenEdited = Object.keys(sceneEdits).length > 0;
  const outputJson = useMemo(() => {
    return {
      scenes: splitResult.scenes.map((_, i) => ({
        index: i,
        script: getSceneText(i),
        presenterId: getPresenterId(i),
        presenterName:
          DEMO_PRESENTERS.find((p) => p.id === getPresenterId(i))?.name ?? "",
        durationEstimateSeconds: Math.ceil(
          getSceneText(i).split(/\s+/).filter(Boolean).length / 3.3,
        ),
      })),
      totalScenes: splitResult.scenes.length,
      totalWords,
      estimatedReadSeconds: readSeconds,
    };
  }, [
    splitResult.scenes,
    getSceneText,
    totalWords,
    readSeconds,
    getPresenterId,
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Script input */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-avatar-text">Script</h2>
          <span className="text-xs text-avatar-text-dim">
            {splitResult.scenes.length === 0
              ? "No scenes"
              : `${splitResult.scenes.length} scene${splitResult.scenes.length > 1 ? "s" : ""}`}
          </span>
        </div>
        <textarea
          value={script}
          onChange={(e) => handleScriptChange(e.target.value)}
          placeholder="Paste or write your script here. Use blank lines between scenes..."
          rows={10}
          className="w-full resize-y rounded-xl border border-avatar-border bg-avatar-bg px-4 py-3 text-sm text-avatar-text placeholder-avatar-text-dim outline-hidden transition-colors focus:border-avatar-accent focus:ring-1 focus:ring-avatar-accent"
        />
        <p className="mt-1.5 text-xs text-avatar-text-dim">
          Separate scenes with a blank line.
        </p>
      </section>

      {/* Scene cards */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-avatar-text">
            Scene cards
          </h2>
          <div className="flex items-center gap-3 text-xs text-avatar-text-dim">
            <span>{totalWords} words</span>
            <span>{formatDuration(readSeconds)} read</span>
            <StatusChip
              label={
                splitResult.scenes.length === 0
                  ? "Empty"
                  : `${splitResult.scenes.length} scenes`
              }
              variant={splitResult.scenes.length === 0 ? "error" : "success"}
            />
          </div>
        </div>

        {splitResult.scenes.length === 0 && (
          <div className="rounded-xl border border-dashed border-avatar-border-light bg-avatar-surface/30 px-5 py-8 text-center">
            <p className="text-sm text-avatar-text-dim">
              Write or paste a script above to see scene cards.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {splitResult.scenes.map((_, i) => {
            const sceneText = getSceneText(i);
            const wordCount = sceneText.split(/\s+/).filter(Boolean).length;
            const isEditing = editingIndex === i;

            return (
              <div
                key={i}
                className={clsx(
                  "rounded-xl border bg-avatar-surface/50 transition-colors",
                  isEditing
                    ? "border-avatar-accent/50"
                    : "border-avatar-border",
                )}
              >
                <div className="flex items-center justify-between border-b border-avatar-border/50 px-4 py-2.5">
                  <span className="text-xs font-medium text-avatar-accent">
                    Scene {i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-avatar-text-dim">
                      {wordCount} words
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(isEditing ? null : i)}
                      className="text-xs font-medium text-avatar-text-muted hover:text-avatar-accent transition-colors"
                    >
                      {isEditing ? "Done" : "Edit"}
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={sceneText}
                    onChange={(e) => handleSceneEdit(i, e.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-b-xl bg-transparent px-4 py-3 text-sm text-avatar-text outline-hidden"
                    autoFocus
                  />
                ) : (
                  <div className="px-4 py-3">
                    <p className="text-sm text-avatar-text leading-relaxed whitespace-pre-wrap">
                      {sceneText}
                    </p>
                  </div>
                )}

                <PresenterVoiceConfig
                  sceneIndex={i}
                  sceneText={sceneText}
                  selectedPresenterId={getPresenterId(i)}
                  onPresenterChange={(id) => handlePresenterChange(i, id)}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Output preview */}
      {splitResult.scenes.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-avatar-text-muted">
              Scene data preview
            </h2>
            {hasBeenEdited && (
              <span className="text-xs text-avatar-warning">Edited</span>
            )}
          </div>
          <pre className="overflow-x-auto rounded-xl border border-avatar-border bg-avatar-bg px-4 py-3 text-xs text-avatar-text-dim">
            {JSON.stringify(outputJson, null, 2)}
          </pre>
        </section>
      )}

      {/* Captions / Transcript */}
      {splitResult.scenes.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-avatar-text">
              Captions &amp; Transcript
            </h2>
            <StatusChip label="Timing estimated" variant="warning" />
          </div>
          <p className="mb-4 text-xs text-avatar-text-dim">
            Caption timing is estimated from text length only. Not audio-synced.
            Timing may shift when real voiceover is rendered.
          </p>

          {/* Captions preview toggle */}
          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className="mb-2 flex w-full items-center justify-between rounded-lg border border-avatar-border bg-avatar-surface/50 px-4 py-2.5 text-left transition-colors hover:border-avatar-border-light"
          >
            <span className="text-sm font-medium text-avatar-text">
              Caption segments
            </span>
            <span className="text-xs text-avatar-text-dim">
              {showCaptions ? "Hide" : "Show"} ({captionsResult.length} scenes,{" "}
              {captionsResult.reduce((s, c) => s + c.segments.length, 0)}{" "}
              segments)
            </span>
          </button>

          {showCaptions && (
            <div className="mb-4 space-y-4">
              {captionsResult.map((scene) => (
                <div
                  key={scene.sceneId}
                  className="rounded-xl border border-avatar-border bg-avatar-surface/30 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-avatar-accent">
                      {scene.sceneTitle}
                    </span>
                    <span className="text-xs text-avatar-text-dim">
                      {(scene.durationMs / 1000).toFixed(1)}s estimated
                    </span>
                  </div>
                  {scene.segments.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {scene.segments.map((seg) => (
                        <span
                          key={seg.id}
                          className="rounded bg-avatar-surface-hover px-1.5 py-0.5 text-xs text-avatar-text-muted"
                          title={`${(seg.startMs / 1000).toFixed(1)}s – ${(seg.endMs / 1000).toFixed(1)}s`}
                        >
                          {seg.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-avatar-text-dim">No words</p>
                  )}
                </div>
              ))}

              <div className="rounded-lg bg-avatar-surface/30 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-avatar-text-muted">
                    SRT preview
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        formatCaptionsAsSRT(captionsResult),
                      );
                    }}
                    className="text-xs text-avatar-accent hover:text-avatar-accent/80 transition-colors"
                  >
                    Copy SRT
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded bg-avatar-bg px-3 py-2 text-xs text-avatar-text-dim">
                  {formatCaptionsAsSRT(captionsResult).slice(0, 500)}
                  {formatCaptionsAsSRT(captionsResult).length > 500 && (
                    <span className="text-avatar-warning">
                      {"\n"}… truncated
                    </span>
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* Transcript preview toggle */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="mb-2 flex w-full items-center justify-between rounded-lg border border-avatar-border bg-avatar-surface/50 px-4 py-2.5 text-left transition-colors hover:border-avatar-border-light"
          >
            <span className="text-sm font-medium text-avatar-text">
              Transcript
            </span>
            <span className="text-xs text-avatar-text-dim">
              {showTranscript ? "Hide" : "Show"} ({transcriptData.blocks.length}{" "}
              blocks, {(transcriptData.totalDurationMs / 1000).toFixed(0)}s
              total estimated)
            </span>
          </button>

          {showTranscript && (
            <div className="space-y-3">
              {transcriptData.blocks.map((block, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-avatar-border bg-avatar-surface/30 p-4"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-avatar-accent">
                      {block.speakerLabel}
                    </span>
                    <span className="text-xs text-avatar-text-dim">
                      Scene {block.sceneIndex + 1}
                    </span>
                    <span className="text-xs text-avatar-text-dim">
                      {(block.startMs / 1000).toFixed(1)}s –{" "}
                      {(block.endMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-sm text-avatar-text leading-relaxed">
                    {block.text}
                  </p>
                </div>
              ))}

              <div className="rounded-lg bg-avatar-surface/30 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-avatar-text-muted">
                    Plain text preview
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        formatTranscriptAsPlainText(transcriptData),
                      );
                    }}
                    className="text-xs text-avatar-accent hover:text-avatar-accent/80 transition-colors"
                  >
                    Copy transcript
                  </button>
                </div>
                <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded bg-avatar-bg px-3 py-2 text-xs text-avatar-text-dim">
                  {formatTranscriptAsPlainText(transcriptData)}
                </pre>
              </div>
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between rounded-xl border border-avatar-border bg-avatar-surface/30 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-avatar-text-dim">
          <StatusChip label="Local editor demo" variant="info" />
          <span>
            No rendering or publishing yet. Voiceover preview via configured TTS
            provider.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-avatar-text-dim">
            Video rendering comes later
          </span>
          <CTAButton href="#" variant="secondary" size="sm" disabled>
            Render (coming soon)
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
