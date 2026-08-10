import { createFileRoute } from "@tanstack/react-router";
import { useofc360 } from "@/lib/ofc360-store";
import { lazyFeaturePage } from "./_lib/-lazyFeaturePage";
import { EmployeePerformancePage } from "@/features/portal/employee/pages/EmployeePerformancePage";

const AdminPerformancePage = lazyFeaturePage(
  () => import("@/features/admin/performance/pages/PerformancePage"),
  "PerformancePage",
);

export const Route = createFileRoute("/dashboard/performance")({
  head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
  component: PerformanceRouteComponent,
});

function PerformanceRouteComponent() {
  const ws = useofc360();
  const userRole = (ws.user?.role as string)?.toLowerCase();
  if (userRole === "employee") {
    return <EmployeePerformancePage />;
  }
  return <AdminPerformancePage />;
}
