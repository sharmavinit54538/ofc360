import { createFileRoute } from "@tanstack/react-router";
import { EmployeePayslipsPage } from "@/components/payroll/EmployeePayslips";

export const Route = createFileRoute("/dashboard/payroll/payslips")({
  head: () => ({ meta: [{ title: "My Payslips — OFC360" }] }),
  component: EmployeePayslipsPage,
});
