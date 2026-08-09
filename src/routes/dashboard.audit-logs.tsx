import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/dashboard/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — ofc360" }] }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <>
      <PageHeader title="Audit Logs" description="Every change, by every user — fully traceable." />
      <ComingSoon title="Audit trail" description="Searchable, filterable logs of all admin and user actions across the workspace." icon={ScrollText} />
    </>
  );
}
