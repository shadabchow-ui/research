"use client";

import { useState } from "react";
import clsx from "clsx";
import { StatusChip } from "components/ui/status-chip";
import { MetricCard } from "components/avatar-cloud/MetricCard";
import {
  DEMO_CONVERSATIONS,
  type DemoConversation,
} from "lib/avatar-cloud/sample-conversations";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function sentimentVariant(
  s: DemoConversation["sentiment"],
): "success" | "warning" | "error" | "info" | "neutral" {
  if (s === "positive") return "success";
  if (s === "negative") return "error";
  if (s === "mixed") return "warning";
  return "info";
}

function statusVariant(
  s: DemoConversation["status"],
): "success" | "warning" | "error" | "neutral" {
  if (s === "active") return "success";
  if (s === "ended") return "neutral";
  return "error";
}

function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: DemoConversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="avatar-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-avatar-border px-5 py-3">
        <h3 className="text-sm font-medium text-avatar-text">
          All Conversations
        </h3>
        <span className="rounded bg-avatar-accent-subtle px-1.5 py-0.5 text-[10px] font-medium text-avatar-accent">
          demo
        </span>
      </div>
      <div className="divide-y divide-avatar-border">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={clsx(
              "flex w-full flex-col gap-1 px-5 py-3 text-left transition-colors hover:bg-avatar-surface-hover",
              selectedId === c.id && "bg-avatar-accent-subtle/30",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-avatar-text">
                {c.liveAgentName}
              </span>
              <StatusChip
                label={c.status}
                variant={statusVariant(c.status)}
                dot={true}
              />
            </div>
            <span className="truncate text-xs text-avatar-text-dim">
              {c.summary.slice(0, 100)}…
            </span>
            <div className="flex items-center gap-3 text-[11px] text-avatar-text-dim">
              <span>{formatDuration(c.durationSeconds)}</span>
              <span>{c.userMessageCount + c.avatarMessageCount} messages</span>
              {c.leadCaptured && (
                <span className="text-avatar-success">lead captured</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TranscriptView({ conversation }: { conversation: DemoConversation }) {
  return (
    <div className="flex flex-col gap-4">
      {conversation.transcript.map((msg, i) => (
        <div
          key={i}
          className={clsx(
            "flex flex-col",
            msg.role === "user" ? "items-end" : "items-start",
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-avatar-text-muted">
              {msg.speaker}
            </span>
            <span className="text-[10px] text-avatar-text-dim">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <div
            className={clsx(
              "max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-avatar-accent text-white"
                : msg.role === "system"
                  ? "bg-avatar-surface text-avatar-text-dim italic"
                  : "bg-avatar-bg text-avatar-text",
            )}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventTimeline({ conversation }: { conversation: DemoConversation }) {
  return (
    <div className="relative flex flex-col gap-3 pl-5">
      {conversation.eventTimeline.map((ev, i) => (
        <div key={i} className="relative flex items-start gap-3">
          <span className="absolute -left-5 top-1.5 h-2 w-2 rounded-full bg-avatar-accent/60" />
          {i < conversation.eventTimeline.length - 1 && (
            <span className="absolute -left-[7px] top-4 h-full w-px bg-avatar-border-light" />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-avatar-text">{ev.label}</span>
            <span className="text-[10px] text-avatar-text-dim">
              {formatTime(ev.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConversationSummary({
  conversation,
}: {
  conversation: DemoConversation;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-avatar-text-muted">
        {conversation.summary}
      </p>
      <div className="flex flex-wrap gap-4 text-xs text-avatar-text-dim">
        <span>
          Messages:{" "}
          {conversation.userMessageCount + conversation.avatarMessageCount}
        </span>
        <span>User: {conversation.userMessageCount}</span>
        <span>Avatar: {conversation.avatarMessageCount}</span>
        <span>Duration: {formatDuration(conversation.durationSeconds)}</span>
      </div>
      <div className="flex gap-2">
        <StatusChip
          label={conversation.sentiment}
          variant={sentimentVariant(conversation.sentiment)}
          dot
        />
        <StatusChip
          label={conversation.status}
          variant={statusVariant(conversation.status)}
          dot
        />
      </div>
    </div>
  );
}

function LeadPreview({ conversation }: { conversation: DemoConversation }) {
  if (!conversation.leadCaptured || !conversation.leadInfo) return null;

  return (
    <div className="rounded-lg border border-avatar-success/30 bg-avatar-success-subtle/20 p-4">
      <h4 className="mb-2 text-sm font-semibold text-avatar-success">
        Lead Captured
      </h4>
      <div className="flex flex-col gap-1.5 text-sm text-avatar-text-muted">
        <div className="flex justify-between">
          <span>Name:</span>
          <span className="text-avatar-text">{conversation.leadInfo.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Email:</span>
          <span className="text-avatar-text">
            {conversation.leadInfo.email}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Interest:</span>
          <span className="text-avatar-text">
            {conversation.leadInfo.interest}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Captured at:</span>
          <span className="text-avatar-text">
            {formatTime(conversation.leadInfo.capturedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState(DEMO_CONVERSATIONS[0]!.id);
  const selected =
    DEMO_CONVERSATIONS.find((c) => c.id === selectedId) ??
    DEMO_CONVERSATIONS[0]!;

  const totalMessages = DEMO_CONVERSATIONS.reduce(
    (s, c) => s + c.userMessageCount + c.avatarMessageCount,
    0,
  );
  const totalDuration = DEMO_CONVERSATIONS.reduce(
    (s, c) => s + c.durationSeconds,
    0,
  );
  const leads = DEMO_CONVERSATIONS.filter((c) => c.leadCaptured).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold text-avatar-text">
            Conversation Logs
          </h1>
          <span className="rounded bg-avatar-accent-subtle px-2 py-0.5 text-xs font-medium text-avatar-accent">
            demo
          </span>
        </div>
        <p className="text-lg text-avatar-text-muted">
          View demo conversation transcripts, event timelines, summaries, and
          lead captures. No real conversations are stored — all data is
          sample/demo.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Conversations"
          value={String(DEMO_CONVERSATIONS.length)}
          demo
        />
        <MetricCard title="Total Messages" value={String(totalMessages)} demo />
        <MetricCard
          title="Total Duration"
          value={formatDuration(totalDuration)}
          demo
        />
        <MetricCard
          title="Leads Captured"
          value={`${leads} / ${DEMO_CONVERSATIONS.length}`}
          demo
        />
      </div>

      {/* Main layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Conversation list */}
        <ConversationList
          conversations={DEMO_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Detail panel */}
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <section className="avatar-panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-avatar-text">
              Summary
            </h2>
            <ConversationSummary conversation={selected} />
          </section>

          {/* Lead preview */}
          <LeadPreview conversation={selected} />

          {/* Transcript */}
          <section className="avatar-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-avatar-text">
                Transcript
              </h2>
              <span className="text-xs text-avatar-text-dim">
                {selected.transcript.length} messages
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <TranscriptView conversation={selected} />
            </div>
          </section>

          {/* Event timeline */}
          <section className="avatar-panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-avatar-text">
              Event Timeline
            </h2>
            <EventTimeline conversation={selected} />
          </section>
        </div>
      </div>

      {/* Privacy / demo notice */}
      <section className="mt-8 rounded-xl border border-avatar-border-light bg-avatar-surface/30 p-5">
        <h3 className="mb-2 text-sm font-semibold text-avatar-text-dim">
          Privacy & Demo Limitations
        </h3>
        <ul className="space-y-1 text-xs text-avatar-text-dim">
          <li>
            • All conversations shown are demo/sample — no real user data is
            stored.
          </li>
          <li>
            • No database, real transcript persistence, audio/video recording,
            or export.
          </li>
          <li>
            • Sentiment labels are manually assigned demo values — no real
            sentiment model.
          </li>
          <li>
            • Lead capture data uses placeholder information — no real PII
            stored.
          </li>
          <li>
            • Event timeline entries are illustrative — not from a real event
            bus.
          </li>
          <li>
            • Data retention, export, and auth controls are future / not
            configured.
          </li>
        </ul>
      </section>
    </div>
  );
}
