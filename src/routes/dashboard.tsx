import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ofc360" }] }),
  component: DashboardShell,
});
