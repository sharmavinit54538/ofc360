import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  LogOut,
  Save,
  Shield,
  User,
  ShieldCheck,
  ScrollText,
  CreditCard,
  ArrowRight,
  Settings as SettingsIcon,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aurix, useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings & Administration — Aurix" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const ws = useAurix();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"company" | "profile" | "security">("company");
  const [company, setCompany] = useState(ws.company ?? { id: "", name: "" });
  const [user, setUser] = useState(ws.user);

  function saveCompany() {
    aurix.set({ company });
    toast.success("Company settings updated successfully");
  }

  function saveProfile() {
    if (user) {
      aurix.set({ user });
      toast.success("Profile updated successfully");
    }
  }

  function reset() {
    aurix.reset();
    navigate({ to: "/login" });
  }

  const adminCards = [
    {
      title: "Roles & Permissions",
      description: "Define user roles, access control levels, and system permissions.",
      icon: ShieldCheck,
      path: "/dashboard/roles",
      gradient: "from-blue-600/20 to-indigo-600/20",
      accentBorder: "border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500 bg-blue-500/10",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      title: "Audit Logs",
      description: "Track system activity, security events, user logins, and data modifications.",
      icon: ScrollText,
      path: "/dashboard/audit-logs",
      gradient: "from-purple-600/20 to-pink-600/20",
      accentBorder: "border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500 bg-purple-500/10",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      title: "Billing & Subscriptions",
      description: "Manage subscription plans, invoices, payment methods, and seat usage.",
      icon: CreditCard,
      path: "/dashboard/billing",
      gradient: "from-emerald-600/20 to-teal-600/20",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500 bg-emerald-500/10",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  ];

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Administration"
        description="Centralized management center for workspace settings, roles & permissions, billing, and security."
      />

      {/* Administration Quick Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Administration Modules</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {adminCards.map((card) => {
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
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
                    <span>Open {card.title.split(" ")[0]}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspace & Account Configuration */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">General Configuration</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </aside>

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {tab === "company" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Company Name">
                  <Input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </F>
                <F label="Email">
                  <Input
                    value={company.email ?? ""}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </F>
                <F label="Phone">
                  <Input
                    value={company.phone ?? ""}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </F>
                <F label="Website">
                  <Input
                    value={company.website ?? ""}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  />
                </F>
                <F label="City">
                  <Input
                    value={company.city ?? ""}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                  />
                </F>
                <F label="Country">
                  <Input
                    value={company.country ?? ""}
                    onChange={(e) => setCompany({ ...company, country: e.target.value })}
                  />
                </F>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveCompany}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "profile" && user ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Full Name">
                  <Input
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  />
                </F>
                <F label="Email">
                  <Input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </F>
                <F label="Phone">
                  <Input
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </F>
                <F label="Role">
                  <Input value={user.role} disabled />
                </F>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "security" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-xs text-muted-foreground">
                    Use a strong unique password to keep your workspace secure.
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-3" onClick={() => toast.success("Password updated")}>
                    Update Password
                  </Button>
                </div>
                <div className="border-t border-border pt-6">
                  <h3 className="font-medium text-destructive">Danger Zone</h3>
                  <p className="text-xs text-muted-foreground">
                    Sign out of this workspace and clear local session data.
                  </p>
                  <Button variant="destructive" className="mt-3" onClick={reset}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out and Reset Workspace
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
