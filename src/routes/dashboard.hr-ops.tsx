import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  Users,
  Receipt,
  Plane,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHrms } from "@/lib/hrms/store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard/hr-ops")({
  head: () => ({ meta: [{ title: "Operations — ofc360" }] }),
  component: OperationsHubPage,
});

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

function OperationsHubPage() {
  const navigate = useNavigate();
  const s = useHrms((x) => x);

  const timelineCount = s.timeline.length;
  const visitorsCount = s.visitors.length;
  const todayVisitors = useMemo(
    () => s.visitors.filter((v) => new Date(v.createdAt).toDateString() === new Date().toDateString()).length,
    [s.visitors]
  );
  const expenseCount = s.expenses.length;
  const travelCount = s.travel.length;

  const expenseStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    s.expenses.forEach((e) => {
      counts[e.status] = (counts[e.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [s.expenses]);

  const travelStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    s.travel.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [s.travel]);

  const modules = [
    {
      id: "timeline",
      title: "Employee Timeline",
      subtitle: "Workforce History & Milestones",
      description: "Track career changes, department transfers, promotions, commendations, and key employee milestone events.",
      icon: Activity,
      path: "/dashboard/timeline",
      count: timelineCount,
      gradient: "from-blue-600/20 to-cyan-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      badge: "Real-time",
      highlights: ["Promotions & Grade updates", "Department transfers", "Performance reviews log"],
    },
    {
      id: "visitors",
      title: "Visitor Management",
      subtitle: "Guest Passes & Office Security",
      description: "Log guest check-ins, issue digital visitor passes, notify hosts, and manage security clearances across offices.",
      icon: Users,
      path: "/dashboard/visitors",
      count: todayVisitors > 0 ? `${todayVisitors} Today` : `${visitorsCount} Total`,
      gradient: "from-purple-600/20 to-pink-600/20",
      accentBorder: "border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500 bg-purple-500/10",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      badge: "Gatekeeper",
      highlights: ["Host instant SMS/Email alert", "Digital badge scanning", "Visitor log archives"],
    },
    {
      id: "expenses",
      title: "Expense Claims",
      subtitle: "Reimbursements & Bill Scanning",
      description: "Manage employee expense claims, OCR receipt processing, policy compliance audits, and payout approvals.",
      icon: Receipt,
      path: "/dashboard/expenses",
      count: expenseCount,
      gradient: "from-emerald-600/20 to-teal-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      badge: "Reimbursements",
      highlights: ["Receipt photo attachment", "Automated policy check", "Batch payout export"],
    },
    {
      id: "travel",
      title: "Travel Requests",
      subtitle: "Corporate Trips & Per-diems",
      description: "Streamline domestic & international business travel requests, flight/hotel bookings, and allowance approvals.",
      icon: Plane,
      path: "/dashboard/travel",
      count: travelCount,
      gradient: "from-amber-600/20 to-orange-600/20",
      accentBorder: "border-amber-500/30 hover:border-amber-500/60",
      iconColor: "text-amber-500 bg-amber-500/10",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
      badge: "Bookings",
      highlights: ["Itinerary approval flow", "Per-diem allowance auto-calc", "Corporate rate discounts"],
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Operations Hub"
        description="Centralized portal for managing employee timelines, visitor check-ins, expense claims, and corporate travel requests."
      />

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline Events</div>
            <div className="mt-1 font-display text-2xl font-bold">{timelineCount}</div>
            <div className="mt-0.5 text-xs text-blue-500 flex items-center gap-1 font-medium">
              <Activity className="h-3 w-3" /> System activity logged
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visitors Today</div>
            <div className="mt-1 font-display text-2xl font-bold">{todayVisitors}</div>
            <div className="mt-0.5 text-xs text-purple-500 flex items-center gap-1 font-medium">
              <Users className="h-3 w-3" /> Checked in at reception
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expense Claims</div>
            <div className="mt-1 font-display text-2xl font-bold">{expenseCount}</div>
            <div className="mt-0.5 text-xs text-emerald-500 flex items-center gap-1 font-medium">
              <Receipt className="h-3 w-3" /> Claims processing
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travel Requests</div>
            <div className="mt-1 font-display text-2xl font-bold">{travelCount}</div>
            <div className="mt-0.5 text-xs text-amber-500 flex items-center gap-1 font-medium">
              <Plane className="h-3 w-3" /> Trips requested
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Plane className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Operations Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    {mod.count}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {mod.title}
                  </h3>
                  <div className="text-xs font-semibold text-muted-foreground mt-0.5">
                    {mod.subtitle}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="space-y-1.5 pt-2">
                  {mod.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                      <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{item}</span>
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
                  <span>Open {mod.title.split(" ")[0]}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Expense Status Breakdown</h3>
            <Badge variant="outline" className="text-xs font-normal">Reimbursements</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseStatus}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Travel Requests Status</h3>
            <Badge variant="outline" className="text-xs font-normal">Corporate Trips</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={travelStatus} dataKey="value" nameKey="name" outerRadius={85} label>
                  {travelStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
