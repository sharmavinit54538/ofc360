import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, ShieldAlert } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/ofc360/DashboardShell";
import { useofc360 } from "@/lib/ofc360-store";

export const Route = createFileRoute("/dashboard/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — ofc360" }] }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const ws = useofc360();
  const userRole = (ws.user?.role as string)?.toLowerCase();

  if (userRole === "employee") {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground">
          You do not have permission to view audit logs. Please contact your organization administrator.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Audit Logs" description="Every change, by every user — fully traceable." />
      <ComingSoon title="Audit trail" description="Searchable, filterable logs of all admin and user actions across the workspace." icon={ScrollText} />
    </>
  );
}
