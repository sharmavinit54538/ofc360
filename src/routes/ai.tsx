import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Hub — ofc360" }] }),
  component: DashboardShell,
});
