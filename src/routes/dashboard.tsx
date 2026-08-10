import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OFC360" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardShell,
});
