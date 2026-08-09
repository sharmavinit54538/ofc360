import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/compliance")({
  head: () => ({ meta: [{ title: "Compliance — ofc360" }] }),
  component: () => (
    <>
      <PageHeader title="Compliance" description="Stay compliant with statutory and regulatory requirements." />
      <ComingSoon title="Compliance" description="Track PF, ESI, PT, LWF, and gratuity filings with deadline reminders." icon={ShieldCheck} />
    </>
  ),
});
