import React from "react";
import { Building, Activity, Users, UserCheck, ShieldCheck, HelpCircle, Landmark, TrendingUp, TrendingDown } from "lucide-react";
import type { Department } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { useofc360 } from "@/lib/ofc360-store";

interface DepartmentStatsCardsProps {
  departments: Department[];
}

export function DepartmentStatsCards({ departments }: DepartmentStatsCardsProps) {
  const ws = useofc360();

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.status === "active").length;

  // Total employees and managers from store
  const totalEmployees = ws.employees.length || 0;
  const totalManagers = ws.managers.length || 0;

  // Avg. Team Size
  const avgTeamSize = totalManagers > 0 ? Math.round(totalEmployees / totalManagers) : 0;

  // Open Positions
  const openPositions = departments.reduce((acc, d) => acc + (d.openPositions || 0), 0);
  const hiringDeptsCount = departments.filter((d) => (d.openPositions || 0) > 0).length;
  const activePct = totalDepartments > 0 ? Math.round((activeDepartments / totalDepartments) * 100) : 0;

  const stats = [
    {
      label: "Total Departments",
      value: totalDepartments,
      icon: Building,
      trend: `${activeDepartments} active`,
      isPositive: true,
      desc: "Total organization divisions",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20",
    },
    {
      label: "Active Departments",
      value: activeDepartments,
      icon: Activity,
      trend: `${activePct}%`,
      isPositive: activePct > 0,
      desc: "Operational ratio",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20",
    },
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      trend: `${totalEmployees} total`,
      isPositive: totalEmployees > 0,
      desc: "Workspace team size",
      color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20",
    },
    {
      label: "Total Managers",
      value: totalManagers,
      icon: UserCheck,
      trend: `${totalManagers} leads`,
      isPositive: totalManagers > 0,
      desc: "Department heads & leads",
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
    },
    {
      label: "Average Team Size",
      value: avgTeamSize,
      icon: Landmark,
      trend: `${avgTeamSize} avg`,
      isPositive: true,
      desc: "Reports per manager",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20",
    },
    {
      label: "Open Positions",
      value: openPositions,
      icon: ShieldCheck,
      trend: `${openPositions} open`,
      isPositive: openPositions > 0,
      desc: hiringDeptsCount > 0 ? `Across ${hiringDeptsCount} departments` : "No open vacancies",
      color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
            <CardContent className="p-4 flex flex-col justify-between h-full min-h-[120px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground line-clamp-1">{stat.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-rose-500" />
                  )}
                  <span className={`text-[10px] font-bold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                    {stat.trend}
                  </span>
                  <span className="text-[9px] text-muted-foreground truncate ml-1">{stat.desc}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
