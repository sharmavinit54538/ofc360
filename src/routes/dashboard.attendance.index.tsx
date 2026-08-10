import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Check, Clock, X, ScrollText, Palmtree, ArrowRight, Timer, FileText, Fingerprint } from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useofc360 } from "@/lib/ofc360-store";

export const Route = createFileRoute("/dashboard/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const ws = useofc360();
  const navigate = useNavigate();
  const today = "Thursday, June 25, 2026";

  function statusFor(id: string): "present" | "late" | "absent" | "leave" {
    const x = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 10;
    if (x < 7) return "present";
    if (x < 8) return "late";
    if (x < 9) return "leave";
    return "absent";
  }

  const stats = ws.employees.reduce(
    (acc, e) => {
      acc[statusFor(e.id)]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0, leave: 0 }
  );

  const statCards = [
    { key: "present", label: "Present", color: "text-emerald-500", icon: Check },
    { key: "late", label: "Late", color: "text-amber-500", icon: Clock },
    { key: "leave", label: "On leave", color: "text-blue-500", icon: CalendarDays },
    { key: "absent", label: "Absent", color: "text-destructive", icon: X },
  ] as const;

  const quickNavCards = [
    {
      title: "Check In / Check Out",
      description: "Clock in, log breaks, selfie & geolocation verification, and daily work logs.",
      icon: Fingerprint,
      path: "/dashboard/attendance/checkin",
      gradient: "from-emerald-600/20 to-teal-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      title: "Shifts Management",
      description: "Manage working shifts, timing policies, break schedules, and overtime rules.",
      icon: Clock,
      path: "/dashboard/attendance/shifts",
      gradient: "from-blue-600/20 to-indigo-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      title: "Rosters & Schedules",
      description: "Assign employee work shifts, weekly rosters, and shift rotations.",
      icon: ScrollText,
      path: "/dashboard/attendance/rosters",
      gradient: "from-purple-600/20 to-pink-600/20",
      accentBorder: "border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500 bg-purple-500/10",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      title: "Holidays Calendar",
      description: "Configure company holidays, regional leaves, and annual holiday calendar.",
      icon: Palmtree,
      path: "/dashboard/attendance/holidays",
      gradient: "from-emerald-600/20 to-teal-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      title: "Timesheets",
      description: "Track daily hours logged, project time entries, overtime approvals, and submission logs.",
      icon: Timer,
      path: "/dashboard/timesheets",
      gradient: "from-amber-600/20 to-orange-600/20",
      accentBorder: "border-amber-500/30 hover:border-amber-500/60",
      iconColor: "text-amber-500 bg-amber-500/10",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      title: "Leaves & PTO",
      description: "Review leave balances, employee leave requests, leave approvals, and time-off policies.",
      icon: FileText,
      path: "/dashboard/leaves",
      gradient: "from-cyan-600/20 to-sky-600/20",
      accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
      iconColor: "text-cyan-500 bg-cyan-500/10",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700 text-white",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Attendance & Time Hub" description={today} />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quickNavCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate({ to: card.path as any })}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`}
            >
              <div
                className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
              />

              <div className="relative space-y-3">
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="relative pt-4 mt-4 border-t border-border/60">
                <Button
                  className={`w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: card.path as any });
                  }}
                >
                  <span>Go to {card.title.split(" ")[0]}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{stats[c.key]}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-medium">Today's Attendance Log</h3>
        </div>
        {ws.employees.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No employees to display.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {ws.employees.map((e) => {
                  const s = statusFor(e.id);
                  const checkIn =
                    s === "present" ? "09:0" + (e.id.length % 9) : s === "late" ? "10:1" + (e.id.length % 9) : "—";
                  return (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{e.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{checkIn}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={s === "present" ? "secondary" : s === "absent" ? "destructive" : "outline"}
                          className="capitalize"
                        >
                          {s}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
