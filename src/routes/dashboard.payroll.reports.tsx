import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/ofc360/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/reports")({
  head: () => ({ meta: [{ title: "Payroll Reports — OFC360" }] }),
  component: () => (
    <>
      <PageHeader title="Payroll Reports" description="Salary registers, statutory reports, and analytics." />
      <ComingSoon title="Payroll reports" description="Export salary registers, PF/ESI returns, and bank advice statements." icon={BarChart3} />
    </>
  ),
});
