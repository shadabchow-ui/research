// Interactive Page Analytics v1
// Local/demo analytics model for hosted video pages. No production tracking.

export type InteractivePageEventType =
  | "page.viewed"
  | "video.started"
  | "video.completed"
  | "transcript.question_asked"
  | "quiz.started"
  | "quiz.completed"
  | "quiz.question_answered"
  | "checklist.item_checked"
  | "checklist.completed"
  | "cta.clicked"
  | "lead.submitted";

export const INTERACTIVE_PAGE_EVENT_TYPES: InteractivePageEventType[] = [
  "page.viewed",
  "video.started",
  "video.completed",
  "transcript.question_asked",
  "quiz.started",
  "quiz.completed",
  "quiz.question_answered",
  "checklist.item_checked",
  "checklist.completed",
  "cta.clicked",
  "lead.submitted",
];

export type FunnelStage =
  | "page_view"
  | "video_start"
  | "video_complete"
  | "qa_engaged"
  | "quiz_start"
  | "quiz_complete"
  | "cta_click"
  | "lead_submit";

export const FUNNEL_STAGES: FunnelStage[] = [
  "page_view",
  "video_start",
  "video_complete",
  "qa_engaged",
  "quiz_start",
  "quiz_complete",
  "cta_click",
  "lead_submit",
];

export const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  page_view: "Page Views",
  video_start: "Video Starts",
  video_complete: "Video Completes",
  qa_engaged: "Q&A Engaged",
  quiz_start: "Quiz Starts",
  quiz_complete: "Quiz Completes",
  cta_click: "CTA Clicks",
  lead_submit: "Lead Submits",
};

export interface InteractivePageMetric {
  label: string;
  value: number;
  unit?: string;
  changePercent?: number;
  isSample: boolean;
}

export interface InteractivePageEvent {
  id: string;
  pageId: string;
  type: InteractivePageEventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
}

export interface FunnelStep {
  stage: FunnelStage;
  count: number;
  conversionRate: number;
}

export interface InteractivePageAnalyticsSummary {
  pageId: string;
  pageTitle: string;
  totalViews: number;
  uniqueSessions: number;
  avgWatchSeconds: number;
  completionRate: number;
  totalQuestionsAsked: number;
  quizCompletionRate: number;
  checklistCompletionRate: number;
  leadConversionRate: number;
  ctaClickRate: number;
  funnel: FunnelStep[];
  recentEvents: InteractivePageEvent[];
  isSample: boolean;
}

// ─── Sample Data ──────────────────────────────────────────────────────────

export const SAMPLE_PAGE_ANALYTICS: InteractivePageAnalyticsSummary = {
  pageId: "demo_ethen_product_overview",
  pageTitle: "Ethen Platform Overview",
  totalViews: 1247,
  uniqueSessions: 892,
  avgWatchSeconds: 142,
  completionRate: 0.38,
  totalQuestionsAsked: 213,
  quizCompletionRate: 0.72,
  checklistCompletionRate: 0.65,
  leadConversionRate: 0.084,
  ctaClickRate: 0.12,
  funnel: [
    { stage: "page_view", count: 1247, conversionRate: 1.0 },
    { stage: "video_start", count: 984, conversionRate: 0.79 },
    { stage: "video_complete", count: 474, conversionRate: 0.38 },
    { stage: "qa_engaged", count: 213, conversionRate: 0.17 },
    { stage: "quiz_start", count: 156, conversionRate: 0.13 },
    { stage: "quiz_complete", count: 112, conversionRate: 0.09 },
    { stage: "cta_click", count: 150, conversionRate: 0.12 },
    { stage: "lead_submit", count: 105, conversionRate: 0.084 },
  ],
  recentEvents: [
    {
      id: "evt_001",
      pageId: "demo_ethen_product_overview",
      type: "page.viewed",
      timestamp: "2025-05-23T10:15:00.000Z",
      sessionId: "sess_001",
    },
    {
      id: "evt_002",
      pageId: "demo_ethen_product_overview",
      type: "video.started",
      timestamp: "2025-05-23T10:15:05.000Z",
      sessionId: "sess_001",
    },
    {
      id: "evt_003",
      pageId: "demo_ethen_product_overview",
      type: "transcript.question_asked",
      timestamp: "2025-05-23T10:16:30.000Z",
      sessionId: "sess_001",
      metadata: { question: "What is Live Avatar?" },
    },
    {
      id: "evt_004",
      pageId: "demo_ethen_product_overview",
      type: "video.completed",
      timestamp: "2025-05-23T10:18:12.000Z",
      sessionId: "sess_001",
    },
    {
      id: "evt_005",
      pageId: "demo_ethen_product_overview",
      type: "cta.clicked",
      timestamp: "2025-05-23T10:18:30.000Z",
      sessionId: "sess_001",
      metadata: { ctaLabel: "Open Studio Lite" },
    },
  ],
  isSample: true,
};

export const SAMPLE_FUNNEL_METRICS: InteractivePageMetric[] = [
  { label: "Total Views", value: 1247, isSample: true },
  { label: "Unique Sessions", value: 892, isSample: true },
  { label: "Avg Watch Time", value: 142, unit: "s", isSample: true },
  { label: "Completion Rate", value: 38, unit: "%", isSample: true },
  { label: "Q&A Engagements", value: 213, isSample: true },
  { label: "CTA Clicks", value: 150, isSample: true },
  { label: "Leads Captured", value: 105, isSample: true },
  { label: "Quiz Completion", value: 72, unit: "%", isSample: true },
];

// ─── Helper Functions ─────────────────────────────────────────────────────

export function calculateConversionRate(
  from: number,
  to: number,
  decimals: number = 4,
): number {
  if (from <= 0) return 0;
  return Number(((to / from) * 100).toFixed(decimals));
}

export function calculateLeadConversionRate(
  leads: number,
  totalViews: number,
): number {
  return calculateConversionRate(totalViews, leads, 1);
}

export function calculateQuizCompletionRate(
  completed: number,
  started: number,
): number {
  return calculateConversionRate(started, completed, 1);
}

export function calculateWatchCompletionRate(
  completed: number,
  started: number,
): number {
  return calculateConversionRate(started, completed, 1);
}

export function buildFunnelStep(
  stage: FunnelStage,
  count: number,
  previousCount: number,
): FunnelStep {
  return {
    stage,
    count,
    conversionRate:
      previousCount > 0
        ? Number(((count / previousCount) * 100).toFixed(1))
        : 0,
  };
}

export function calculateChecklistCompletionRate(
  completed: number,
  total: number,
): number {
  return calculateConversionRate(total, completed, 1);
}
