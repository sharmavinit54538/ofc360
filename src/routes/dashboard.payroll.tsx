import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payroll")({
  head: () => ({ meta: [{ title: "Payroll — ofc360" }] }),
  component: () => <Outlet />,
});
