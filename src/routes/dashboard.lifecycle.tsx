import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  UserCheck,
  Archive,
  LogOut,
  ArrowRight,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHrms } from "@/lib/hrms/store";

export const Route = createFileRoute("/dashboard/lifecycle")({
  head: () => ({ meta: [{ title: "Employee Lifecycle — Aurix" }] }),
  component: EmployeeLifecyclePage,
});

function EmployeeLifecyclePage() {
  const navigate = useNavigate();
  const onboardingCount = useHrms((s) => s.onboarding.length);
  const offboardingCount = useHrms((s) => s.offboarding.length);
  const exitCount = useHrms((s) => s.exits.length);

  const modules = [
    {
      id: "onboarding",
      title: "Onboarding",
      subtitle: "New Hire Orientation & Setup",
      description: "Manage welcome checklists, IT asset provisioning, document verifications, and department orientation.",
      icon: UserCheck,
      path: "/dashboard/onboarding-checklist",
      count: onboardingCount,
      gradient: "from-blue-600/20 to-indigo-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      badge: "Active",
      features: [
        "Pre-boarding task automation",
        "Document collection & BGV verification",
        "IT & Laptop asset allocation",
        "Buddy assignment & 30-60-90 plan",
      ],
    },
    {
      id: "offboarding",
      title: "Offboarding",
      subtitle: "Handover & Departure Workflows",
      description: "Streamline employee departure tasks, knowledge transfer logs, company asset returns, and access revocations.",
      icon: Archive,
      path: "/dashboard/offboarding",
      count: offboardingCount,
      gradient: "from-amber-600/20 to-orange-600/20",
      accentBorder: "border-amber-500/30 hover:border-amber-500/60",
      iconColor: "text-amber-500 bg-amber-500/10",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
      badge: "In Progress",
      features: [
        "Knowledge transfer tracking",
        "IT asset & badge return log",
        "System & email account deprecation",
        "Department clearance sign-offs",
      ],
    },
    {
      id: "exit",
      title: "Exit Management",
      subtitle: "Resignations, Notice & Clearances",
      description: "Manage resignation requests, exit interviews, notice period buyouts, final settlement approvals, and alumni network.",
      icon: LogOut,
      path: "/dashboard/exit",
      count: exitCount,
      gradient: "from-rose-600/20 to-pink-600/20",
      accentBorder: "border-rose-500/30 hover:border-rose-500/60",
      iconColor: "text-rose-500 bg-rose-500/10",
      buttonColor: "bg-rose-600 hover:bg-rose-700 text-white",
      badge: "Clearance",
      features: [
        "Resignation approval workflows",
        "AI exit interview sentiment analysis",
        "Full & Final (F&F) settlement calculator",
        "Alumni portal & experience letter issuing",
      ],
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Employee Lifecycle Hub"
        description="Unified portal for managing onboarding, offboarding, and exit clearances."
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Onboardings</div>
            <div className="mt-1 font-display text-2xl font-bold">{onboardingCount}</div>
            <div className="mt-0.5 text-xs text-emerald-500 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> New hires in progress
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Offboardings</div>
            <div className="mt-1 font-display text-2xl font-bold">{offboardingCount}</div>
            <div className="mt-0.5 text-xs text-amber-500 flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" /> Asset returns pending
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Archive className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Exit Cases</div>
            <div className="mt-1 font-display text-2xl font-bold">{exitCount}</div>
            <div className="mt-0.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <ShieldAlert className="h-3 w-3" /> Clearances required
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
            <LogOut className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Lifecycle Modules Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => navigate({ to: mod.path as any })}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${mod.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`}
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${mod.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
              />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${mod.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold px-2.5 py-0.5">
                    {mod.count} Cases
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {mod.title}
                  </h3>
                  <div className="text-xs font-semibold text-muted-foreground mt-0.5">
                    {mod.subtitle}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>
                </div>

                {/* Key features list */}
                <div className="space-y-1.5 pt-2">
                  {mod.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-foreground/80">
                      <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative pt-4 mt-6 border-t border-border/60">
                <Button
                  className={`w-full justify-between rounded-xl font-medium shadow-md transition-all ${mod.buttonColor}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: mod.path as any });
                  }}
                >
                  <span>Manage {mod.title}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
