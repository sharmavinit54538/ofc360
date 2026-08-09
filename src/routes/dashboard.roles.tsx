import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  Building2,
  Laptop,
  LineChart,
  Crown,
  Lock,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — ofc360" }] }),
  component: RolesPage,
});

export interface RoleDefinition {
  id: string;
  key: "admin" | "it_admin" | "executive" | "manager" | "employee";
  title: string;
  icon: any;
  badge: string;
  badgeColor: string;
  description: string;
  membersCount: number;
  permissions: {
    name: string;
    description: string;
    enabled: boolean;
  }[];
}

const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: "r1",
    key: "admin",
    title: "HR Admin",
    icon: Crown,
    badge: "Super Admin",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    description: "Highest level admin with full access to company settings, payroll, employee profiles, and system configurations.",
    membersCount: 3,
    permissions: [
      { name: "Full System & Workspace Admin", description: "Manage company settings, security, and subscription billing", enabled: true },
      { name: "Run & Approve Payroll", description: "Execute monthly salary payouts, tax compliance, and bank transfers", enabled: true },
      { name: "Manage Employee Directory", description: "Add, edit, promote, or terminate employee accounts", enabled: true },
      { name: "HR Policies & Global Settings", description: "Configure leave policies, attendance rules, and audit logs", enabled: true },
    ],
  },
  {
    id: "r2",
    key: "it_admin",
    title: "IT Admin",
    icon: Laptop,
    badge: "Tech Admin",
    badgeColor: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    description: "Manages hardware assets, laptop allocations, software licensing, system security, and technical helpdesk tickets.",
    membersCount: 5,
    permissions: [
      { name: "Asset & Hardware Management", description: "Assign, return, transfer, and audit IT equipment", enabled: true },
      { name: "IT Helpdesk Resolution", description: "Manage and resolve technical support tickets", enabled: true },
      { name: "System Access & Audit Security", description: "Inspect active sessions, API keys, and device logs", enabled: true },
      { name: "Run Payroll Payouts", description: "Execute monthly payroll calculations and tax filing", enabled: false },
    ],
  },
  {
    id: "r3",
    key: "executive",
    title: "Executive",
    icon: LineChart,
    badge: "Leadership",
    badgeColor: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    description: "C-level executive role with organization-wide analytics, financial reports, headcount forecasting, and AI workforce insights.",
    membersCount: 4,
    permissions: [
      { name: "Executive AI Analytics & Reports", description: "View company-wide turnover, payroll expenses, and AI health scores", enabled: true },
      { name: "Headcount & Hiring Demand Forecast", description: "Inspect strategic hiring projections and attrition risk alerts", enabled: true },
      { name: "View Salary & Financial Summaries", description: "High-level review of department budgets and variable pay", enabled: true },
      { name: "Edit Employee Data", description: "Modify personal records or perform payroll calculations", enabled: false },
    ],
  },
  {
    id: "r4",
    key: "manager",
    title: "Manager",
    icon: UserCog,
    badge: "Team Lead",
    badgeColor: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
    description: "Department managers with oversight over direct reports, leave approvals, timesheet reviews, and performance appraisals.",
    membersCount: 18,
    permissions: [
      { name: "Approve Team Leaves & Timesheets", description: "Review and approve leave applications and weekly timesheets", enabled: true },
      { name: "Conduct Performance Reviews", description: "Evaluate team goals, OKRs, and promotion recommendations", enabled: true },
      { name: "View Team Member Directory", description: "Access contact details and skill profiles of direct reports", enabled: true },
      { name: "Company Billing & License Admin", description: "Modify workspace subscription plans and invoices", enabled: false },
    ],
  },
  {
    id: "r5",
    key: "employee",
    title: "Employee",
    icon: Users,
    badge: "Standard",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    description: "Standard workforce member role for self-service attendance check-ins, leave requests, payslip access, and helpdesk queries.",
    membersCount: 142,
    permissions: [
      { name: "Attendance & Self Check-in", description: "Clock in/out, log work hours, and view shift schedules", enabled: true },
      { name: "Submit Leave & Expense Claims", description: "Apply for leaves and upload reimbursement receipts", enabled: true },
      { name: "Download Payslips & Form 16", description: "Access personal salary slips and tax documents", enabled: true },
      { name: "View Other Salaries", description: "Access compensation details of peers or executives", enabled: false },
    ],
  },
];

function RolesPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

  function togglePermission(roleId: string, permIdx: number) {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        const newPerms = [...r.permissions];
        newPerms[permIdx] = {
          ...newPerms[permIdx],
          enabled: !newPerms[permIdx].enabled,
        };
        return { ...r, permissions: newPerms };
      })
    );
    toast.success("Permissions updated for role");
  }

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Roles & Permissions"
        description="Structured role-based access control (RBAC) across the organization."
      />

      {/* Organization Role Tree Visual */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Building2 className="h-4.5 w-4.5 text-indigo-500" />
          <span>Organization Role Hierarchy</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          {/* Top Level: Organization */}
          <div className="rounded-xl border border-border bg-card px-5 py-2 font-display text-sm font-bold shadow-md">
            Organization Workspace
          </div>

          <div className="h-6 w-0.5 bg-border my-1" />

          {/* Root Level: HR Admin */}
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 font-bold text-amber-500 shadow-glow">
            <Crown className="h-4 w-4" />
            <span>👑 HR Admin (Super Administrator)</span>
          </div>

          <div className="h-6 w-0.5 bg-border my-1" />

          {/* Branch Level: 4 Roles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-4xl text-center">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 font-semibold text-xs text-blue-400 flex items-center justify-center gap-1.5">
              <Laptop className="h-4 w-4" /> 💻 IT Admin
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 font-semibold text-xs text-purple-400 flex items-center justify-center gap-1.5">
              <LineChart className="h-4 w-4" /> 📊 Executive
            </div>
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 font-semibold text-xs text-indigo-400 flex items-center justify-center gap-1.5">
              <UserCog className="h-4 w-4" /> 👨‍💼 Manager
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-semibold text-xs text-emerald-400 flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4" /> 👤 Employee
            </div>
          </div>
        </div>
      </div>

      {/* 5 Organizational Role Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Configured Roles ({roles.length})</h2>
          <Badge variant="outline" className="text-xs font-normal">
            RBAC Enforced
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{role.title}</h3>
                        <span className="text-xs text-muted-foreground">{role.membersCount} Users Assigned</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold ${role.badgeColor}`}>
                      {role.badge}
                    </Badge>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>

                  {/* Permissions Checklist */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Core Access Capabilities
                    </span>
                    <div className="space-y-2">
                      {role.permissions.map((perm, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between text-xs py-1">
                          <span className={perm.enabled ? "text-foreground font-medium" : "text-muted-foreground line-through"}>
                            {perm.name}
                          </span>
                          <Switch
                            checked={perm.enabled}
                            onCheckedChange={() => togglePermission(role.id, pIdx)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-9 justify-between cursor-pointer"
                    onClick={() => setSelectedRole(role)}
                  >
                    <span>View Role Details</span>
                    <Sliders className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Details Modal */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="sm:max-w-md text-left">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <span>{selectedRole.title} Configuration</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <p className="text-muted-foreground">{selectedRole.description}</p>

              <div className="rounded-xl border border-border bg-card/40 p-3 space-y-2">
                <strong className="text-foreground font-bold block">Assigned Member Count</strong>
                <span className="text-indigo-400 font-mono font-bold text-sm">
                  {selectedRole.membersCount} Active Accounts
                </span>
              </div>

              <div className="space-y-2">
                <strong className="text-foreground font-bold block">Granular Permission Rules</strong>
                {selectedRole.permissions.map((p, idx) => (
                  <div key={idx} className="rounded-lg border border-border/60 p-2.5 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{p.name}</span>
                      <Badge variant={p.enabled ? "default" : "secondary"} className="text-[9px]">
                        {p.enabled ? "Granted" : "Denied"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedRole(null)} className="w-full">
                Close Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
