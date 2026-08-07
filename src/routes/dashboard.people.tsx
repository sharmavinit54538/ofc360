import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users, UserPlus, Building2, ArrowRight, ShieldCheck, UserCheck, Layers } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/people")({
  head: () => ({ meta: [{ title: "People Hub — Aurix" }] }),
  component: PeopleHubPage,
});

function PeopleHubPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Employees",
      description: "Manage employee directory, profiles, employment status, and team assignments.",
      icon: Users,
      path: "/dashboard/employees",
      badge: "Workforce",
      gradient: "from-blue-600/20 via-indigo-600/20 to-purple-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      features: ["Employee Directory", "Onboarding & Status", "Role Management"],
    },
    {
      title: "Managers",
      description: "Oversee managerial roles, team hierarchies, reporting structures, and permissions.",
      icon: UserPlus,
      path: "/dashboard/managers",
      badge: "Leadership",
      gradient: "from-purple-600/20 via-pink-600/20 to-rose-600/20",
      accentBorder: "border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500 bg-purple-500/10",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      features: ["Managerial Roles", "Team Allocations", "Approval Permissions"],
    },
    {
      title: "Departments",
      description: "Configure organizational departments, department heads, and team capacity.",
      icon: Building2,
      path: "/dashboard/departments",
      badge: "Structure",
      gradient: "from-emerald-600/20 via-teal-600/20 to-cyan-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      features: ["Department Hierarchy", "Head Assignments", "Resource Allocation"],
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="People Hub"
        description="Unified management center for workforce, leadership, and organizational structure."
      />

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate({ to: card.path as any })}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`}
            >
              {/* Background Glow */}
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
              />

              <div className="relative space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-muted/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {card.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                {/* Feature Bullet points */}
                <div className="pt-2 space-y-2">
                  {card.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="relative pt-6 mt-6 border-t border-border/60">
                <Button
                  className={`w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: card.path as any });
                  }}
                >
                  <span>Manage {card.title}</span>
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
