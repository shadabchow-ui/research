import type { Metadata } from "next";
import { TranscriptQuestionBox } from "components/avatar-cloud/TranscriptQuestionBox";
import { QuizCard } from "components/avatar-cloud/QuizCard";
import { ChecklistCard } from "components/avatar-cloud/ChecklistCard";
import { InteractivePageAnalytics } from "components/avatar-cloud/InteractivePageAnalytics";
import { CTAStack } from "components/avatar-cloud/CTAStack";
import { LeadCaptureCard } from "components/avatar-cloud/LeadCaptureCard";
import { HandoffPreview } from "components/avatar-cloud/HandoffPreview";
import {
  DEMO_ETHEN_QUIZ,
  DEMO_CHECKLIST_WEBSITE_AVATAR,
  DEMO_CHECKLIST_TRAINING_PAGE,
} from "lib/avatar-cloud/interactive-layers";

export const metadata: Metadata = {
  title: "Ethen Platform Overview — Upcube Avatar Cloud",
  description:
    "Demo hosted video page with transcript-aware Q&A, quiz, and checklists. Ethen explains Upcube Avatar Cloud products.",
};

export default function DemoVideoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            demo
          </span>
          <span className="rounded bg-avatar-warning-subtle px-2 py-0.5 text-xs font-medium text-avatar-warning">
            local Q&A
          </span>
          <span className="rounded bg-avatar-info-subtle px-2 py-0.5 text-xs font-medium text-avatar-info">
            quiz
          </span>
          <span className="rounded bg-avatar-success-subtle px-2 py-0.5 text-xs font-medium text-avatar-success">
            checklist
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-avatar-text sm:text-4xl">
          Ethen Platform Overview
        </h1>
        <p className="mt-2 text-lg text-avatar-text-muted">
          A walkthrough of Upcube Avatar Cloud products — Live Avatar, Studio,
          Interactive Video Pages, and the Avatar API. This is a demo page with
          local transcript Q&A, a quiz, and next-step checklists.
        </p>
      </div>

      <div className="mb-10 aspect-video overflow-hidden rounded-2xl border border-avatar-border bg-gradient-to-br from-avatar-accent/20 via-avatar-surface to-avatar-bg">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-3 text-5xl">{">"}</div>
            <p className="text-sm text-avatar-text-dim">
              Video placeholder — render a Studio video here
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-avatar-text">
          Full Transcript
        </h2>
        <div className="space-y-4 rounded-2xl border border-avatar-border bg-avatar-surface/50 p-5">
          {[
            {
              scene: "Introduction",
              text: "Hi, I'm Ethen — Upcube's AI avatar guide. Welcome to Upcube Avatar Cloud. In this video, I'll walk you through what our platform can do, from live avatar agents to interactive video pages.",
            },
            {
              scene: "Live Avatar",
              text: "Live Avatar lets you deploy real-time conversational avatars on your website. These avatars can greet visitors, answer product questions, qualify leads, book meetings, and hand off to your sales or support team when needed. It works entirely through the browser using WebGL and Three.js.",
            },
            {
              scene: "Studio",
              text: "Studio is our avatar video generation tool. You can turn any script, document, or URL into a premium avatar-led video. Each video can include an avatar presenter, voiceover, captions, and scene cards. It works with a simple script-to-scene workflow.",
            },
            {
              scene: "Interactive Video Pages",
              text: "Interactive Video Pages are what make us different. Every generated video gets its own hosted page with a transcript, Q&A, quizzes, lead capture, and analytics. The page keeps working after the video ends — visitors can ask questions, take quizzes, and submit their contact information.",
            },
            {
              scene: "Avatar API",
              text: "For developers, we offer the Avatar API. You can build custom avatar experiences with personas, sessions, streaming, webhooks, and our embed SDK. The API lets you integrate AI avatars into your own products, platforms, and applications.",
            },
            {
              scene: "About Ethen",
              text: "Ethen is Upcube's flagship AI avatar guide. He helps visitors understand our products, answers questions about the platform, and guides users to the right resources. Unlike a chatbot, Ethen has a visual presence — he blinks, breathes, and shows natural speaking and thinking states. He can explain products, describe use cases, and route users to the right pages.",
            },
            {
              scene: "Getting Started",
              text: "Getting started is easy. Choose a product that fits your use case — Live Avatar for real-time conversations, Studio for video generation, or Interactive Video Pages for combined experiences. Each product can be used on its own or together. Visit our console to get started.",
            },
          ].map((section) => (
            <div key={section.scene}>
              <span className="mb-1 block text-xs font-medium text-avatar-accent">
                {section.scene}
              </span>
              <p className="text-sm leading-relaxed text-avatar-text-muted">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <TranscriptQuestionBox />
      </div>

      {/* CTA actions */}
      <div className="mb-8">
        <CTAStack />
      </div>

      {/* Lead capture */}
      <div className="mb-8">
        <LeadCaptureCard
          title="Request more information"
          description="Tell us what you're looking for and our team will follow up."
        />
      </div>

      {/* Handoff actions */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-avatar-text">
            Handoff options
          </h2>
          <span className="rounded bg-avatar-warning-subtle px-2 py-0.5 text-xs font-medium text-avatar-warning">
            Not configured
          </span>
        </div>
        <p className="mb-4 text-xs text-avatar-text-dim">
          These handoff actions are template placeholders. No CRM, booking API,
          or email sending is connected.
        </p>
        <HandoffPreview title="" />
      </div>

      <div className="mb-8">
        <QuizCard quiz={DEMO_ETHEN_QUIZ} />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <ChecklistCard checklist={DEMO_CHECKLIST_WEBSITE_AVATAR} />
        <ChecklistCard checklist={DEMO_CHECKLIST_TRAINING_PAGE} />
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-avatar-text">
            Engagement Analytics
          </h2>
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            demo
          </span>
        </div>
        <InteractivePageAnalytics />
      </div>

      <div className="rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-5">
        <h3 className="mb-2 text-sm font-semibold text-avatar-text-dim">
          About this demo
        </h3>
        <ul className="space-y-1 text-xs text-avatar-text-dim">
          <li>
            • This is a local transcript Q&A, quiz, and checklist demo. No AI,
            embeddings, or vector search is used.
          </li>
          <li>
            • Quiz answers are scored locally. Results are not saved, synced, or
            sent anywhere.
          </li>
          <li>
            • Checklist progress is local only and clears on page refresh.
          </li>
          <li>
            • In production, this would use a proper RAG pipeline, graded
            quizzes, and persistent progress.
          </li>
          <li>• No data is stored or sent to any external service.</li>
        </ul>
      </div>
    </div>
  );
}
