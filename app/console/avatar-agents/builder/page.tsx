import type { Metadata } from "next";
import { AgentBuilder } from "components/avatar-cloud/agent-builder";

export const metadata: Metadata = {
  title: "Build Agent — Upcube Console",
  description: "Create a new AI avatar agent for your website.",
};

export default function BuilderPage() {
  return <AgentBuilder />;
}
