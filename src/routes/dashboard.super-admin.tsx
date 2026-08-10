import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { ofc360 } from "@/lib/ofc360-store";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, LayoutDashboard, Building2, CreditCard, ScrollText, Users,
  Zap, Package, Sparkles, BarChart3, History, Activity, Bell, Settings, AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin")({
  head: () => ({ meta: [{ title: "SaaS Owner Control Center — OFC HR" }] }),
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ws = useSyncExternalStore(ofc360.subscribe, ofc360.get, ofc360.get);
  const userRole = ws.user?.role?.toLowerCase();

  if (userRole !== "super_admin") {
    return (
      <div className="p-8 max-w-md mx-auto my-12">
        <Card className="border-rose-500/20 bg-rose-500/5 p-6 text-center shadow-xl">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
          <h2 className="text-base font-bold text-foreground">403 Forbidden — Super Admin Privileges Required</h2>
          <p className="text-xs text-muted-foreground mt-2">
            Access Denied: Your account role (<strong>{ws.user?.role || "UNAUTHORIZED"}</strong>) is strictly forbidden from accessing the SaaS Owner Control Center.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/dashboard">
              <Button variant="default" className="h-8 text-xs px-4">
                Return to Workspace Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    { to: "/dashboard/super-admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/super-admin/organizations", label: "Organizations", icon: Building2 },
    { to: "/dashboard/super-admin/users", label: "Users & Access", icon: Users },
    { to: "/dashboard/super-admin/plans", label: "Plans & Subscriptions", icon: Package },
    { to: "/dashboard/super-admin/entitlements", label: "Entitlements", icon: Zap },
    { to: "/dashboard/super-admin/billing", label: "Billing", icon: CreditCard },
    { to: "/dashboard/super-admin/ai-usage", label: "AI Usage", icon: Sparkles },
    { to: "/dashboard/super-admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard/super-admin/audit-logs", label: "Audit Logs", icon: History },
    { to: "/dashboard/super-admin/security", label: "Security", icon: ShieldCheck },
    { to: "/dashboard/super-admin/system-health", label: "System Health", icon: Activity },
    { to: "/dashboard/super-admin/announcements", label: "Announcements", icon: Bell },
    { to: "/dashboard/super-admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SaaS Owner Control Center"
        description="Global multi-tenant platform control, user permissions, feature entitlements, system telemetry, and billing engine."
        actions={
          <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-400 font-semibold shadow-xs">
            <ShieldCheck className="h-4 w-4 text-indigo-400 animate-pulse" />
            Global Platform Owner
          </div>
        }
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.to
            : pathname.startsWith(tab.to) && (tab.to !== "/dashboard/super-admin" || pathname === "/dashboard/super-admin");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to as any}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}

