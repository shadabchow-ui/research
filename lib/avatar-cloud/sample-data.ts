import type {
  Persona,
  Replica,
  Voice,
  LiveAgent,
  ConversationFlowProfile,
  EmbedConfig,
  KnowledgeBase,
} from "./types";

import type {
  StudioProject,
  StudioScript,
  StudioScriptBlock,
  StudioScene,
  AvatarTrack,
  VoiceTrack,
  CaptionTrack,
  RenderJob,
  HostedVideoPage,
  InteractiveLayer,
} from "./studio";

import type { ConsentRecord, ConsentGrant, ConsentAuditEntry } from "./consent";

export const SAMPLE_ETHEN_PERSONA: Persona = {
  id: "sample_ethen_persona",
  name: "Ethen Guide",
  systemPrompt:
    "You are Ethen, Upcube's flagship AI avatar guide. Your role is to help visitors understand Upcube products, answer questions about the platform, and guide users to the right product or app. You are friendly, helpful, and professional. You know about Live Avatar, Studio, Interactive Video Pages, and the Avatar API. You should never make claims about unsupported features or hallucinate capabilities. If asked about anything outside the Upcube platform, politely redirect back to Upcube products.",
  tone: "friendly_professional",
  guardrails: [
    "Do not provide legal, medical, or financial advice",
    "Do not claim unsupported product capabilities",
    "Do not impersonate real people",
    "Disclose that you are an AI avatar when asked",
    "Redirect off-topic conversations back to Upcube products",
  ],
  knowledgeBaseIds: ["sample_upcube_knowledge"],
  tools: [
    {
      name: "route_to_product",
      description:
        "Suggest the best Upcube product or page for the user's need",
    },
    {
      name: "product_knowledge_retrieval",
      description: "Retrieve information about Upcube products and features",
    },
  ],
  defaultVoiceId: "sample_ethen_voice",
  defaultReplicaId: "sample_ethen_replica",
};

export const SAMPLE_ETHEN_REPLICA: Replica = {
  id: "sample_ethen_replica",
  name: "Ethen Browser Avatar",
  modelType: "browser_glb",
  assetUri: "/models/ethen/ethen.glb",
  trainingStatus: "none",
  status: "active",
};

export const SAMPLE_ETHEN_VOICE: Voice = {
  id: "sample_ethen_voice",
  provider: "not_configured",
  externalVoiceId: "",
  language: "en-US",
  isCloned: false,
};

export const SAMPLE_ETHEN_FLOW_PROFILE: ConversationFlowProfile = {
  id: "sample_ethen_flow_profile",
  name: "Ethen Guide Flow",
  turnTakingPatience: "medium",
  interruptibility: "high",
  idleEngagement: "soft",
  backchannelTolerance: "medium",
  voiceIsolation: "near",
};

export const SAMPLE_ETHEN_EMBED_CONFIG: EmbedConfig = {
  id: "sample_ethen_embed",
  liveAgentId: "sample_ethen_agent",
  allowedDomains: ["upcube.ai"],
  theme: "system",
  position: "bottom-right",
  defaultMode: "text",
  showBranding: true,
  leadCaptureEnabled: false,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

export const SAMPLE_ETHEN_AGENT: LiveAgent = {
  id: "sample_ethen_agent",
  name: "Ethen Guide",
  personaId: "sample_ethen_persona",
  replicaId: "sample_ethen_replica",
  voiceId: "sample_ethen_voice",
  knowledgeBaseIds: ["sample_upcube_knowledge"],
  embedConfigId: "sample_ethen_embed",
  conversationFlowProfileId: "sample_ethen_flow_profile",
  status: "published",
};

export const SAMPLE_WEBSITE_CONCIERGE_PERSONA: Persona = {
  id: "sample_website_concierge_persona",
  name: "Website Concierge",
  systemPrompt:
    "You are a friendly website concierge AI avatar. Greet visitors, answer questions about the company and its products, qualify leads by asking about their needs, and offer to book meetings or hand off to a human team member. Keep responses concise and helpful. Collect relevant contact information when the user is interested in learning more.",
  tone: "warm_professional",
  guardrails: [
    "Do not provide legal, medical, or financial advice",
    "Do not make unverified product claims",
    "Protect user privacy",
    "Do not push sales too aggressively",
    "Disclose that you are an AI avatar",
  ],
  knowledgeBaseIds: ["sample_upcube_knowledge"],
  tools: [
    {
      name: "collect_lead",
      description: "Collect visitor contact information for follow-up",
    },
    {
      name: "book_meeting",
      description: "Schedule a meeting or demo with a human team member",
    },
    {
      name: "product_knowledge_retrieval",
      description: "Retrieve information about company products and features",
    },
  ],
  defaultVoiceId: "sample_ethen_voice",
  defaultReplicaId: "sample_ethen_replica",
};

export const SAMPLE_WEBSITE_CONCIERGE_FLOW_PROFILE: ConversationFlowProfile = {
  id: "sample_concierge_flow_profile",
  name: "Website Concierge Flow",
  turnTakingPatience: "medium",
  interruptibility: "medium",
  idleEngagement: "eager",
  backchannelTolerance: "low",
  voiceIsolation: "near",
};

export const SAMPLE_WEBSITE_CONCIERGE_TEMPLATE: LiveAgent = {
  id: "sample_website_concierge_template",
  name: "Website Concierge",
  personaId: "sample_website_concierge_persona",
  replicaId: "sample_ethen_replica",
  voiceId: "sample_ethen_voice",
  knowledgeBaseIds: ["sample_upcube_knowledge"],
  embedConfigId: "",
  conversationFlowProfileId: "sample_concierge_flow_profile",
  status: "draft",
};

export const SAMPLE_UPCUBE_KNOWLEDGE_BASE: KnowledgeBase = {
  id: "sample_upcube_knowledge",
  name: "Upcube Platform Knowledge",
  indexType: "static",
  documentCount: 1,
  lastUpdated: "2025-01-01T00:00:00.000Z",
};

export const SAMPLE_LIVE_AGENTS: LiveAgent[] = [
  SAMPLE_ETHEN_AGENT,
  SAMPLE_WEBSITE_CONCIERGE_TEMPLATE,
];

export const SAMPLE_PERSONAS: Persona[] = [
  SAMPLE_ETHEN_PERSONA,
  SAMPLE_WEBSITE_CONCIERGE_PERSONA,
];

export function getSampleLiveAgents(): LiveAgent[] {
  return SAMPLE_LIVE_AGENTS;
}

export function getEthenAgent(): LiveAgent {
  return SAMPLE_ETHEN_AGENT;
}

// ─── Studio sample data ────────────────────────────────────────────────────

const STUDIO_ETHEN_SCRIPT_BLOCKS: StudioScriptBlock[] = [
  {
    id: "block_ethen_01",
    speakerLabel: "Ethen",
    text: "Hi, I'm Ethen, Upcube's flagship AI avatar. Today, I'm going to show you how Upcube Avatar Cloud works.",
    durationEstimateSeconds: 8,
  },
  {
    id: "block_ethen_02",
    speakerLabel: "Ethen",
    text: "Upcube Avatar Cloud lets you build live AI avatar agents for your website, create avatar-led videos from scripts or documents, and build interactive video pages that keep working after the video ends.",
    durationEstimateSeconds: 15,
  },
  {
    id: "block_ethen_03",
    speakerLabel: "Ethen",
    text: "With Live Avatar, you can deploy real-time conversational avatars that greet visitors, answer questions, qualify leads, and book meetings — all without any coding.",
    durationEstimateSeconds: 12,
  },
  {
    id: "block_ethen_04",
    speakerLabel: "Ethen",
    text: "With Studio, you can generate professional avatar videos from any content — scripts, PDFs, URLs, or blog posts. Just choose your avatar, write your script, and the Studio handles the rest.",
    durationEstimateSeconds: 13,
  },
  {
    id: "block_ethen_05",
    speakerLabel: "Ethen",
    text: "Ready to build with AI avatars? Join the waitlist and be the first to know when the platform launches. Thanks for watching!",
    durationEstimateSeconds: 9,
  },
];

const STUDIO_ETHEN_SCRIPT: StudioScript = {
  id: "script_sample_ethen_explainer",
  title: "Ethen Product Explainer Script",
  blocks: STUDIO_ETHEN_SCRIPT_BLOCKS,
  totalDurationEstimateSeconds: 57,
  sourceType: "product_explainer",
};

const STUDIO_ETHEN_SCENES: StudioScene[] = [
  {
    id: "scene_ethen_01",
    index: 0,
    title: "Introduction",
    personaId: "sample_ethen_persona",
    replicaId: "sample_ethen_replica",
    script: STUDIO_ETHEN_SCRIPT_BLOCKS[0]!.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: 8,
    transitionIn: { type: "fade", durationMs: 500 },
    transitionOut: { type: "fade", durationMs: 300 },
  },
  {
    id: "scene_ethen_02",
    index: 1,
    title: "Platform overview",
    personaId: "sample_ethen_persona",
    replicaId: "sample_ethen_replica",
    script: STUDIO_ETHEN_SCRIPT_BLOCKS[1]!.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: 15,
    transitionIn: { type: "fade", durationMs: 300 },
    transitionOut: { type: "slide", durationMs: 400 },
  },
  {
    id: "scene_ethen_03",
    index: 2,
    title: "Live Avatar feature",
    personaId: "sample_ethen_persona",
    replicaId: "sample_ethen_replica",
    script: STUDIO_ETHEN_SCRIPT_BLOCKS[2]!.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: 12,
    transitionIn: { type: "slide", durationMs: 400 },
    transitionOut: { type: "fade", durationMs: 300 },
  },
  {
    id: "scene_ethen_04",
    index: 3,
    title: "Studio feature",
    personaId: "sample_ethen_persona",
    replicaId: "sample_ethen_replica",
    script: STUDIO_ETHEN_SCRIPT_BLOCKS[3]!.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: 13,
    transitionIn: { type: "fade", durationMs: 300 },
    transitionOut: { type: "fade", durationMs: 300 },
  },
  {
    id: "scene_ethen_05",
    index: 4,
    title: "Call to action",
    personaId: "sample_ethen_persona",
    replicaId: "sample_ethen_replica",
    script: STUDIO_ETHEN_SCRIPT_BLOCKS[4]!.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: 9,
    transitionIn: { type: "fade", durationMs: 300 },
  },
];

export const SAMPLE_ETHEN_PRODUCT_EXPLAINER: StudioProject = {
  id: "project_ethen_explainer",
  title: "Ethen Product Explainer",
  description:
    "An avatar-led explainer video introducing Upcube Avatar Cloud, featuring Ethen as the presenter.",
  workflowType: "product_explainer",
  status: "draft",
  personaId: "sample_ethen_persona",
  replicaId: "sample_ethen_replica",
  script: STUDIO_ETHEN_SCRIPT,
  avatarTracks: [
    {
      id: "avatar_track_ethen",
      personaId: "sample_ethen_persona",
      replicaId: "sample_ethen_replica",
      sceneIds: STUDIO_ETHEN_SCENES.map((s) => s.id),
    },
  ],
  voiceTracks: [
    {
      id: "voice_track_ethen",
      voiceId: "sample_ethen_voice",
      provider: "not_configured",
      language: "en-US",
      sceneIds: STUDIO_ETHEN_SCENES.map((s) => s.id),
    },
  ],
  captionTracks: [
    {
      id: "caption_track_en",
      language: "en-US",
      enabled: true,
      style: "bottom",
      fontFamily: "system-ui",
      fontSize: 18,
    },
  ],
  scenes: STUDIO_ETHEN_SCENES,
  renderJobs: [
    {
      id: "render_sample_ethen_01",
      studioVideoId: "project_ethen_explainer",
      status: "pending",
      progressPercent: 0,
      outputFormat: "mp4",
      retryCount: 0,
    },
  ],
  hostedPages: [],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-15T00:00:00.000Z",
  tags: ["explainer", "ethen", "product"],
};

const STUDIO_CONCIERGE_TRAINING_BLOCKS: StudioScriptBlock[] = [
  {
    id: "block_concierge_01",
    speakerLabel: "Ethen",
    text: "Welcome to your Website Concierge training. In this video, we'll set up your first AI avatar concierge agent.",
    durationEstimateSeconds: 8,
  },
  {
    id: "block_concierge_02",
    speakerLabel: "Ethen",
    text: "The Website Concierge template greets visitors, answers product questions, qualifies leads, and books meetings — right on your website.",
    durationEstimateSeconds: 10,
  },
  {
    id: "block_concierge_03",
    speakerLabel: "Ethen",
    text: "Start by selecting the Website Concierge template from your Console. Then, customize the greeting message and add your company's product knowledge.",
    durationEstimateSeconds: 10,
  },
  {
    id: "block_concierge_04",
    speakerLabel: "Ethen",
    text: "Configure the lead capture form with the fields you need — email, name, company, and any custom questions. Then set up where leads are sent.",
    durationEstimateSeconds: 10,
  },
  {
    id: "block_concierge_05",
    speakerLabel: "Ethen",
    text: "Finally, embed the widget on your website and test it. Your concierge is now live and ready to help visitors 24/7.",
    durationEstimateSeconds: 8,
  },
];

const STUDIO_CONCIERGE_SCRIPT: StudioScript = {
  id: "script_sample_concierge_training",
  title: "Website Concierge Training Script",
  blocks: STUDIO_CONCIERGE_TRAINING_BLOCKS,
  totalDurationEstimateSeconds: 46,
  sourceType: "training_video",
};

const STUDIO_CONCIERGE_SCENES: StudioScene[] =
  STUDIO_CONCIERGE_TRAINING_BLOCKS.map((block, index) => ({
    id: `scene_concierge_0${index + 1}`,
    index,
    title: `Scene ${index + 1}`,
    personaId: "sample_website_concierge_persona",
    replicaId: "sample_ethen_replica",
    script: block.text,
    voiceoverId: "sample_ethen_voice",
    durationSeconds: block.durationEstimateSeconds,
    transitionIn: { type: "fade" as const, durationMs: 400 },
    transitionOut:
      index < STUDIO_CONCIERGE_TRAINING_BLOCKS.length - 1
        ? ({ type: "fade" as const, durationMs: 400 } as const)
        : undefined,
  }));

export const SAMPLE_WEBSITE_CONCIERGE_TRAINING: StudioProject = {
  id: "project_concierge_training",
  title: "Website Concierge Setup Training",
  description:
    "A training video that walks new users through setting up their first Website Concierge avatar agent.",
  workflowType: "training_video",
  status: "draft",
  personaId: "sample_website_concierge_persona",
  replicaId: "sample_ethen_replica",
  script: STUDIO_CONCIERGE_SCRIPT,
  avatarTracks: [
    {
      id: "avatar_track_concierge",
      personaId: "sample_website_concierge_persona",
      replicaId: "sample_ethen_replica",
      sceneIds: STUDIO_CONCIERGE_SCENES.map((s) => s.id),
    },
  ],
  voiceTracks: [
    {
      id: "voice_track_concierge",
      voiceId: "sample_ethen_voice",
      provider: "not_configured",
      language: "en-US",
      sceneIds: STUDIO_CONCIERGE_SCENES.map((s) => s.id),
    },
  ],
  captionTracks: [
    {
      id: "caption_track_en",
      language: "en-US",
      enabled: true,
      style: "bottom",
    },
  ],
  scenes: STUDIO_CONCIERGE_SCENES,
  renderJobs: [],
  hostedPages: [],
  createdAt: "2025-02-01T00:00:00.000Z",
  updatedAt: "2025-02-01T00:00:00.000Z",
  tags: ["training", "concierge", "onboarding"],
};

const INTERACTIVE_LAYERS: InteractiveLayer[] = [
  {
    id: "layer_quiz_01",
    type: "quiz",
    title: "Quick Check",
    config: {
      question:
        "Which product lets you deploy real-time conversational avatars?",
      options: ["Studio", "Live Avatar", "Interactive Pages", "Avatar API"],
      correctIndex: 1,
    },
    startTimeSeconds: 35,
  },
  {
    id: "layer_cta_01",
    type: "cta",
    title: "Join Waitlist",
    config: {
      buttonText: "Join the waitlist",
      buttonUrl: "#waitlist",
    },
    startTimeSeconds: 55,
  },
  {
    id: "layer_lead_01",
    type: "lead_form",
    title: "Learn More",
    config: {
      fields: ["email", "name"],
      heading: "Want to learn more?",
    },
    startTimeSeconds: 50,
    endTimeSeconds: 70,
  },
];

export const SAMPLE_INTERACTIVE_DEMO_PAGE: StudioProject = {
  id: "project_interactive_demo",
  title: "Interactive Demo Video Page",
  description:
    "A hosted interactive video page with quiz, CTA, and lead capture layers. Demonstrates the Interactive Video Pages product.",
  workflowType: "interactive_video_page",
  status: "draft",
  personaId: "sample_ethen_persona",
  replicaId: "sample_ethen_replica",
  script: STUDIO_ETHEN_SCRIPT,
  avatarTracks: [
    {
      id: "avatar_track_interactive",
      personaId: "sample_ethen_persona",
      replicaId: "sample_ethen_replica",
      sceneIds: STUDIO_ETHEN_SCENES.map((s) => s.id),
    },
  ],
  voiceTracks: [
    {
      id: "voice_track_interactive",
      voiceId: "sample_ethen_voice",
      provider: "not_configured",
      language: "en-US",
      sceneIds: STUDIO_ETHEN_SCENES.map((s) => s.id),
    },
  ],
  captionTracks: [
    {
      id: "caption_track_en",
      language: "en-US",
      enabled: true,
      style: "bottom",
    },
  ],
  scenes: STUDIO_ETHEN_SCENES,
  renderJobs: [
    {
      id: "render_sample_interactive_01",
      studioVideoId: "project_interactive_demo",
      status: "pending",
      progressPercent: 0,
      outputFormat: "mp4",
      retryCount: 0,
    },
  ],
  hostedPages: [
    {
      id: "hosted_sample_interactive_01",
      studioVideoId: "project_interactive_demo",
      renderJobId: "render_sample_interactive_01",
      videoUrl: "#demo-video-placeholder",
      slug: "interactive-demo-video-page",
      interactiveLayers: INTERACTIVE_LAYERS,
      analyticsEnabled: true,
    },
  ],
  createdAt: "2025-03-01T00:00:00.000Z",
  updatedAt: "2025-03-10T00:00:00.000Z",
  tags: ["interactive", "demo", "ethen"],
};

export const SAMPLE_STUDIO_PROJECTS: StudioProject[] = [
  SAMPLE_ETHEN_PRODUCT_EXPLAINER,
  SAMPLE_WEBSITE_CONCIERGE_TRAINING,
  SAMPLE_INTERACTIVE_DEMO_PAGE,
];

export function getSampleStudioVideos(): StudioProject[] {
  return SAMPLE_STUDIO_PROJECTS;
}

// ─── Consent / governance sample data ──────────────────────────────────────

const ETHEN_CONSENT_GRANTS: ConsentGrant[] = [
  {
    id: "grant_ethen_visual",
    scope: "avatar_visual_replica",
    grantedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "grant_ethen_studio",
    scope: "studio_video_use",
    grantedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "grant_ethen_live",
    scope: "live_agent_use",
    grantedAt: "2025-01-01T00:00:00.000Z",
  },
];

const ETHEN_AUDIT_TRAIL: ConsentAuditEntry[] = [
  {
    id: "audit_ethen_created",
    consentRecordId: "consent_ethen_internal",
    action: "granted",
    timestamp: "2025-01-01T00:00:00.000Z",
    performedBy: "Upcube governance team",
    reason: "Internal Upcube-owned asset — authorized for public use",
    newStatus: "active",
  },
];

export const SAMPLE_ETHEN_CONSENT: ConsentRecord = {
  id: "consent_ethen_internal",
  ownerId: "upcube_inc",
  replicaId: "sample_ethen_replica",
  subjectId: "subject_ethen",
  subjectName: "Ethen (Upcube-owned)",
  consentTextVersion: "v1.0-internal",
  signedAt: "2025-01-01T00:00:00.000Z",
  revocationStatus: "active",
  scopes: ETHEN_CONSENT_GRANTS,
  customReplicaEnabled: true,
  customVoiceEnabled: false,
  verificationMethod: "enterprise_attestation",
  auditTrail: ETHEN_AUDIT_TRAIL,
  notes:
    "Ethen is an Upcube-owned flagship avatar. Internal consent record for demo purposes. No real user consent required.",
};

const CUSTOM_REPLICA_GRANTS: ConsentGrant[] = [
  {
    id: "grant_custom_replica_visual",
    scope: "avatar_visual_replica",
    grantedAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "grant_custom_replica_voice",
    scope: "voice_clone",
    grantedAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "grant_custom_replica_live",
    scope: "live_agent_use",
    grantedAt: "2025-03-01T00:00:00.000Z",
  },
];

const CUSTOM_REPLICA_AUDIT: ConsentAuditEntry[] = [
  {
    id: "audit_custom_replica_pending",
    consentRecordId: "consent_custom_replica_example",
    action: "granted",
    timestamp: "2025-03-01T00:00:00.000Z",
    performedBy: "system",
    reason: "User submitted consent form — pending verification",
    newStatus: "pending",
  },
];

export const SAMPLE_CUSTOM_REPLICA_CONSENT_PENDING: ConsentRecord = {
  id: "consent_custom_replica_example",
  ownerId: "demo_user_01",
  replicaId: "",
  subjectId: "subject_demo_user_01",
  subjectName: "Jane Demo (custom replica)",
  consentTextVersion: "v1.0",
  signedAt: "2025-03-01T00:00:00.000Z",
  revocationStatus: "pending",
  scopes: CUSTOM_REPLICA_GRANTS,
  customReplicaEnabled: false,
  customVoiceEnabled: false,
  verificationMethod: "manual",
  auditTrail: CUSTOM_REPLICA_AUDIT,
  notes:
    "Custom replica consent pending manual review. Replica and voice remain disabled until verification completes.",
};

const REVOKED_REPLICA_GRANTS: ConsentGrant[] = [
  {
    id: "grant_revoked_visual",
    scope: "avatar_visual_replica",
    grantedAt: "2024-06-01T00:00:00.000Z",
  },
  {
    id: "grant_revoked_voice",
    scope: "voice_clone",
    grantedAt: "2024-06-01T00:00:00.000Z",
  },
];

const REVOKED_REPLICA_AUDIT: ConsentAuditEntry[] = [
  {
    id: "audit_revoked_granted",
    consentRecordId: "consent_revoked_example",
    action: "granted",
    timestamp: "2024-06-01T00:00:00.000Z",
    performedBy: "system",
    reason: "Consent capture completed",
    newStatus: "active",
  },
  {
    id: "audit_revoked_revoke",
    consentRecordId: "consent_revoked_example",
    action: "revoked",
    timestamp: "2024-09-15T00:00:00.000Z",
    performedBy: "support_team",
    reason: "Subject requested data deletion and consent withdrawal",
    previousStatus: "active",
    newStatus: "revoked",
  },
];

export const SAMPLE_REVOKED_CONSENT: ConsentRecord = {
  id: "consent_revoked_example",
  ownerId: "demo_user_02",
  replicaId: "old_replica_02",
  subjectId: "subject_demo_user_02",
  subjectName: "John Demo (revoked)",
  consentTextVersion: "v1.0",
  signedAt: "2024-06-01T00:00:00.000Z",
  revokedAt: "2024-09-15T00:00:00.000Z",
  revocationStatus: "revoked",
  scopes: REVOKED_REPLICA_GRANTS,
  customReplicaEnabled: false,
  customVoiceEnabled: false,
  verificationMethod: "manual",
  auditTrail: REVOKED_REPLICA_AUDIT,
  notes:
    "Consent was revoked by subject request. All replica assets and voice clones have been deleted. Audit trail preserved for compliance.",
};

export const SAMPLE_CONSENT_RECORDS: ConsentRecord[] = [
  SAMPLE_ETHEN_CONSENT,
  SAMPLE_CUSTOM_REPLICA_CONSENT_PENDING,
  SAMPLE_REVOKED_CONSENT,
];

export function getSampleConsentRecords(): ConsentRecord[] {
  return SAMPLE_CONSENT_RECORDS;
}
