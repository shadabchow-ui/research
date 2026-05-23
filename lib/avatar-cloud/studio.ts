import type {
  StudioVideo as BaseStudioVideo,
  VideoScene as BaseVideoScene,
} from "./types";

// ─── Status types ──────────────────────────────────────────────────────────

export type StudioVideoStatus =
  | "draft"
  | "queued"
  | "rendering"
  | "complete"
  | "failed"
  | "hosted";

export type RenderJobStatus =
  | "pending"
  | "scheduled"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type StudioWorkflowType =
  | "script_to_video"
  | "document_to_video"
  | "url_to_video"
  | "training_video"
  | "product_explainer"
  | "multilingual_dub"
  | "interactive_video_page";

// ─── Studio Script ─────────────────────────────────────────────────────────

export interface StudioScriptBlock {
  id: string;
  speakerLabel: string;
  text: string;
  durationEstimateSeconds?: number;
  notes?: string;
}

export interface StudioScript {
  id: string;
  title: string;
  blocks: StudioScriptBlock[];
  totalDurationEstimateSeconds?: number;
  sourceType: StudioWorkflowType;
  sourceUrl?: string;
  sourceContent?: string;
}

// ─── Tracks ────────────────────────────────────────────────────────────────

export interface AvatarTrack {
  id: string;
  personaId: string;
  replicaId: string;
  sceneIds: string[];
}

export interface VoiceTrack {
  id: string;
  voiceId: string;
  provider: string;
  language: string;
  sceneIds: string[];
  speed?: number;
  pitch?: number;
}

export interface CaptionTrack {
  id: string;
  language: string;
  enabled: boolean;
  style: "bottom" | "overlay" | "none";
  fontFamily?: string;
  fontSize?: number;
}

// ─── Caption Segments ──────────────────────────────────────────────────────

export interface CaptionWord {
  word: string;
  startMs: number;
  endMs: number;
}

export interface CaptionSegment {
  id: string;
  index: number;
  startMs: number;
  endMs: number;
  text: string;
  words: CaptionWord[];
}

export interface SceneCaptionResult {
  sceneId: string;
  sceneIndex: number;
  sceneTitle: string;
  durationMs: number;
  segments: CaptionSegment[];
}

// ─── Transcript ────────────────────────────────────────────────────────────

export interface TranscriptBlock {
  speakerLabel: string;
  text: string;
  startMs: number;
  endMs: number;
  sceneIndex: number;
}

export interface TranscriptSpeaker {
  label: string;
  labelShort: string;
}

export type TranscriptExportFormat = "plain_text" | "srt" | "vtt" | "json";

export interface TranscriptData {
  speakers: TranscriptSpeaker[];
  blocks: TranscriptBlock[];
  totalDurationMs: number;
}

// ─── Scene (extended) ──────────────────────────────────────────────────────

export interface StudioScene {
  id: string;
  index: number;
  title: string;
  personaId: string;
  replicaId: string;
  script: string;
  voiceoverId?: string;
  captionTrackId?: string;
  durationSeconds?: number;
  backgroundAsset?: string;
  transitionIn?: SceneTransition;
  transitionOut?: SceneTransition;
}

export interface SceneTransition {
  type: "fade" | "slide" | "none";
  durationMs: number;
}

// ─── Render Job ────────────────────────────────────────────────────────────

export interface RenderJob {
  id: string;
  studioVideoId: string;
  status: RenderJobStatus;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  estimatedDurationSeconds?: number;
  outputUrl?: string;
  outputFormat: "mp4" | "webm";
  errorMessage?: string;
  retryCount: number;
}

// ─── Hosted Video Page ─────────────────────────────────────────────────────

export interface HostedVideoPage {
  id: string;
  studioVideoId: string;
  renderJobId: string;
  videoUrl: string;
  transcriptUrl?: string;
  embedCode?: string;
  interactiveLayers: InteractiveLayer[];
  analyticsEnabled: boolean;
  publishedAt?: string;
  slug: string;
}

export interface InteractiveLayer {
  id: string;
  type: "quiz" | "cta" | "lead_form" | "qa_overlay" | "chapter_marker";
  title: string;
  config: Record<string, unknown>;
  startTimeSeconds: number;
  endTimeSeconds?: number;
}

// ─── Extended Studio Video (full project view) ─────────────────────────────

export interface StudioProject {
  id: string;
  title: string;
  description: string;
  workflowType: StudioWorkflowType;
  status: StudioVideoStatus;
  personaId: string;
  replicaId: string;
  script: StudioScript;
  avatarTracks: AvatarTrack[];
  voiceTracks: VoiceTrack[];
  captionTracks: CaptionTrack[];
  scenes: StudioScene[];
  renderJobs: RenderJob[];
  hostedPages: HostedVideoPage[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags: string[];
}

// ─── Workflow definitions ──────────────────────────────────────────────────

export interface StudioWorkflow {
  type: StudioWorkflowType;
  label: string;
  description: string;
  icon: string;
  inputLabel: string;
  supportsCaptions: boolean;
  supportsInteractive: boolean;
  estimatedMaxDurationMinutes: number;
}

export const STUDIO_WORKFLOWS: Readonly<
  Record<StudioWorkflowType, StudioWorkflow>
> = {
  script_to_video: {
    type: "script_to_video",
    label: "Script to Video",
    description:
      "Write or paste a script and turn it into an avatar-led video with scene cards and voiceover.",
    icon: "script",
    inputLabel: "Write your script",
    supportsCaptions: true,
    supportsInteractive: true,
    estimatedMaxDurationMinutes: 30,
  },
  document_to_video: {
    type: "document_to_video",
    label: "Document to Video",
    description:
      "Upload a PDF, blog post, slide deck, or training manual and transform it into an avatar video.",
    icon: "document",
    inputLabel: "Upload a document",
    supportsCaptions: true,
    supportsInteractive: true,
    estimatedMaxDurationMinutes: 60,
  },
  url_to_video: {
    type: "url_to_video",
    label: "URL to Video",
    description:
      "Paste a URL and let the Studio extract content to build a video from the page.",
    icon: "link",
    inputLabel: "Enter a URL",
    supportsCaptions: true,
    supportsInteractive: false,
    estimatedMaxDurationMinutes: 20,
  },
  training_video: {
    type: "training_video",
    label: "Training Video",
    description:
      "Create structured training content with quizzes, chapter markers, and assessment checkpoints.",
    icon: "training",
    inputLabel: "Describe your training content",
    supportsCaptions: true,
    supportsInteractive: true,
    estimatedMaxDurationMinutes: 45,
  },
  product_explainer: {
    type: "product_explainer",
    label: "Product Explainer",
    description:
      "Turn your product description or feature list into a polished avatar explainer video.",
    icon: "product",
    inputLabel: "Describe your product",
    supportsCaptions: true,
    supportsInteractive: false,
    estimatedMaxDurationMinutes: 10,
  },
  multilingual_dub: {
    type: "multilingual_dub",
    label: "Multilingual Dub",
    description:
      "Create language variants of an existing video by dubbing the avatar voice into multiple languages.",
    icon: "translate",
    inputLabel: "Select source video and target languages",
    supportsCaptions: true,
    supportsInteractive: false,
    estimatedMaxDurationMinutes: 30,
  },
  interactive_video_page: {
    type: "interactive_video_page",
    label: "Interactive Video Page",
    description:
      "Build a hosted interactive video page with Q&A overlay, lead capture, quizzes, and analytics.",
    icon: "interactive",
    inputLabel: "Describe your video and interactions",
    supportsCaptions: true,
    supportsInteractive: true,
    estimatedMaxDurationMinutes: 30,
  },
} as const;

// ─── Status label helpers ──────────────────────────────────────────────────

export const STUDIO_VIDEO_STATUS_LABELS: Record<StudioVideoStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  rendering: "Rendering",
  complete: "Complete",
  failed: "Failed",
  hosted: "Hosted",
};

export const RENDER_JOB_STATUS_LABELS: Record<RenderJobStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

// ─── Helper functions ──────────────────────────────────────────────────────

export function createDraftStudioProject(
  overrides?: Partial<StudioProject>,
): StudioProject {
  const now = new Date().toISOString();
  return {
    id: `project_${Date.now()}`,
    title: "Untitled Project",
    description: "",
    workflowType: "script_to_video",
    status: "draft",
    personaId: "",
    replicaId: "",
    script: {
      id: `script_${Date.now()}`,
      title: "Untitled Script",
      blocks: [],
      sourceType: "script_to_video",
    },
    avatarTracks: [],
    voiceTracks: [],
    captionTracks: [],
    scenes: [],
    renderJobs: [],
    hostedPages: [],
    createdAt: now,
    updatedAt: now,
    tags: [],
    ...overrides,
  };
}

export function createDraftRenderJob(
  studioVideoId: string,
  format: "mp4" | "webm" = "mp4",
): RenderJob {
  return {
    id: `render_${Date.now()}`,
    studioVideoId,
    status: "pending",
    progressPercent: 0,
    outputFormat: format,
    retryCount: 0,
  };
}

export function createHostedVideoPage(
  studioVideoId: string,
  renderJobId: string,
  videoUrl: string,
  overrides?: Partial<HostedVideoPage> & { title?: string },
): HostedVideoPage {
  const slug = overrides?.title
    ? overrides.title.toLowerCase().replace(/\s+/g, "-")
    : `video-${studioVideoId.slice(-8)}`;
  return {
    id: `hosted_${Date.now()}`,
    studioVideoId,
    renderJobId,
    videoUrl,
    slug,
    interactiveLayers: [],
    analyticsEnabled: true,
    ...overrides,
  };
}

// ─── Caption/Transcript helpers ─────────────────────────────────────────────

const DEFAULT_WPM = 180;
const WORDS_PER_SECOND = DEFAULT_WPM / 60;
const CHARS_PER_SECOND = 15;

export interface EstimateTimingOptions {
  wpm?: number;
  pauseBetweenScenesMs?: number;
}

export function estimateSceneDurationMs(
  text: string,
  options?: EstimateTimingOptions,
): number {
  const wpm = options?.wpm ?? DEFAULT_WPM;
  const words = text.split(/\s+/).filter(Boolean).length;
  const seconds = Math.ceil((words / wpm) * 60);
  return Math.max(seconds * 1000, 1000);
}

export function estimateCaptionTimings(
  text: string,
  options?: EstimateTimingOptions,
): CaptionSegment[] {
  const wpm = options?.wpm ?? DEFAULT_WPM;
  const words = text.split(/\s+/).filter(Boolean);
  const totalMs = estimateSceneDurationMs(text, { wpm });
  const msPerWord = words.length > 0 ? totalMs / words.length : 0;
  let currentMs = 0;

  return words.map((word, i) => {
    const wordMs = Math.round(msPerWord);
    const segment: CaptionSegment = {
      id: `cap_seg_${i}`,
      index: i,
      startMs: currentMs,
      endMs: currentMs + wordMs,
      text: word,
      words: [
        {
          word,
          startMs: currentMs,
          endMs: currentMs + wordMs,
        },
      ],
    };
    currentMs += wordMs;
    return segment;
  });
}

export interface CaptionFromScenesOptions {
  wpm?: number;
  speakerLabel?: string;
  pauseBetweenScenesMs?: number;
}

export function createCaptionsFromScenes(
  scenes: { id: string; index: number; title?: string; script: string }[],
  options?: CaptionFromScenesOptions,
): SceneCaptionResult[] {
  const pauseMs = options?.pauseBetweenScenesMs ?? 500;
  let globalOffsetMs = 0;

  return scenes.map((scene) => {
    const sceneMs = estimateSceneDurationMs(scene.script, options);
    const segments = estimateCaptionTimings(scene.script, options);
    const adjusted = segments.map((seg) => ({
      ...seg,
      startMs: seg.startMs + globalOffsetMs,
      endMs: seg.endMs + globalOffsetMs,
      words: seg.words.map((w) => ({
        ...w,
        startMs: w.startMs + globalOffsetMs,
        endMs: w.endMs + globalOffsetMs,
      })),
    }));

    const result: SceneCaptionResult = {
      sceneId: scene.id,
      sceneIndex: scene.index,
      sceneTitle: scene.title ?? `Scene ${scene.index + 1}`,
      durationMs: sceneMs,
      segments: adjusted,
    };

    globalOffsetMs += sceneMs + pauseMs;
    return result;
  });
}

export function createTranscriptFromScenes(
  scenes: { id: string; index: number; title?: string; script: string }[],
  captions?: SceneCaptionResult[],
  options?: CaptionFromScenesOptions,
): TranscriptData {
  const speakers: TranscriptSpeaker[] = [{ label: "Avatar", labelShort: "AV" }];
  const pauseMs = options?.pauseBetweenScenesMs ?? 500;
  let globalOffsetMs = 0;
  const blocks: TranscriptBlock[] = [];

  for (const scene of scenes) {
    const sceneMs = estimateSceneDurationMs(scene.script, options);
    blocks.push({
      speakerLabel: "Avatar",
      text: scene.script,
      startMs: globalOffsetMs,
      endMs: globalOffsetMs + sceneMs,
      sceneIndex: scene.index,
    });
    globalOffsetMs += sceneMs + pauseMs;
  }

  return {
    speakers,
    blocks,
    totalDurationMs: Math.max(0, globalOffsetMs - pauseMs),
  };
}

export function formatTranscriptAsPlainText(
  transcript: TranscriptData,
): string {
  return transcript.blocks
    .map((b) => `[${b.speakerLabel}] ${b.text}`)
    .join("\n\n");
}

function msToSrtTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const millis = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

export function formatCaptionsAsSRT(
  sceneResults: SceneCaptionResult[],
): string {
  let output = "";
  let segCounter = 1;

  for (const scene of sceneResults) {
    for (const seg of scene.segments) {
      output += `${segCounter}\n`;
      output += `${msToSrtTime(seg.startMs)} --> ${msToSrtTime(seg.endMs)}\n`;
      output += `${seg.text}\n\n`;
      segCounter++;
    }
  }

  return output.trim();
}

export function formatCaptionsAsVTT(
  sceneResults: SceneCaptionResult[],
): string {
  let output = "WEBVTT\n\n";

  for (const scene of sceneResults) {
    for (const seg of scene.segments) {
      output += `${msToSrtTime(seg.startMs)} --> ${msToSrtTime(seg.endMs)}\n`;
      output += `${seg.text}\n\n`;
    }
  }

  return output.trim();
}

export function formatTranscriptAsJson(transcript: TranscriptData): string {
  return JSON.stringify(transcript, null, 2);
}

export function getStudioWorkflows(): StudioWorkflow[] {
  return Object.values(STUDIO_WORKFLOWS);
}

export function getStudioWorkflow(type: StudioWorkflowType): StudioWorkflow {
  return STUDIO_WORKFLOWS[type];
}

export function getStudioVideoStatusLabel(status: StudioVideoStatus): string {
  return STUDIO_VIDEO_STATUS_LABELS[status];
}

export function getRenderJobStatusLabel(status: RenderJobStatus): string {
  return RENDER_JOB_STATUS_LABELS[status];
}

export function isStudioVideoTerminal(status: StudioVideoStatus): boolean {
  return status === "complete" || status === "failed" || status === "hosted";
}

export function isRenderJobTerminal(status: RenderJobStatus): boolean {
  return (
    status === "completed" || status === "failed" || status === "cancelled"
  );
}
