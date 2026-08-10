import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, Archive, Award, Banknote, BarChart3, Bell, BookOpen, Bot, Brain,
  Briefcase, Building2, CalendarDays, CalendarCheck, CheckCircle2, ChevronLeft, ChevronsLeft, ChevronsRight,
  ChevronDown, ClipboardCheck, Clock, CreditCard, Download, FileCheck, FileText, FilePlus2,
  FileSignature, Folder, FolderOpen, Gauge, Gift, Globe, HandCoins, HeartPulse, History,
  Info, Languages, LayoutDashboard, LineChart as LineChartIcon, Lock, LogOut, Mail, Medal,
  Menu, MessageCircle, MessageSquare, Mic, MinusCircle, Moon, Package, Palmtree, PanelLeft, Percent,
  PlayCircle, Plane, Receipt, ScanLine, ScrollText, Search, Settings, ShieldCheck, Sparkles,
  Star, Sun, Target, Timer, TrendingUp, Trophy, UserCheck, UserCog, UserPlus, Users, Video,
  Wallet, Workflow, X, Zap, Clock3, ListTodo, CalendarRange, FileBarChart, Lightbulb,
  ClipboardList, BadgeCheck, Headphones, HelpCircle, TicketCheck, Map, Laptop, Printer,
  Repeat, Wrench, TrendingDown, BrainCircuit, Fingerprint, Coffee, HeartHandshake, GraduationCap,
  BookMarked, PenLine, FileEdit, Landmark, Coins, Building, Hash,
} from "lucide-react";
import { ofc360, useofc360, type Role } from "@/lib/ofc360-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { hasValidAccessToken, setTokens } from "@/api";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/site/ThemeProvider";
import { BackButton } from "./BackButton";

export { BackButton };

// ── Badge type ─────────────────────────────────────────────────
type BadgeKind = "New" | "AI" | "Beta" | "Hot";

type NavLeaf = {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
  roles?: string[];
  badge?: BadgeKind;
  count?: number;
};
type NavParent = {
  label: string;
  icon: any;
  basePath: string;
  children: NavLeaf[];
  roles?: string[];
  badge?: BadgeKind;
  count?: number;
};
type NavItem = NavLeaf | NavParent;
type NavSection = { title?: string; items: NavItem[]; roles?: string[] };

const isParent = (i: NavItem): i is NavParent => "children" in i;

// ── Badge color map ────────────────────────────────────────────
const BADGE_STYLES: Record<BadgeKind, string> = {
  New: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  AI: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  Beta: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Hot: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

function NavBadge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLES[kind]}`}>
      {kind}
    </span>
  );
}

function NavCount({ count }: { count: number }) {
  return (
    <span className="ml-auto shrink-0 min-w-[18px] rounded-full bg-destructive/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── All nav sections ───────────────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    // ── Admin / HR / Manager sections ────────────────────────
    items: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, roles: ["company_admin", "admin", "hr"] },
      { to: "/dashboard/manager", label: "Manager Dashboard", icon: UserCog, roles: ["manager"] },
      { to: "/ai", label: "AI Suite", icon: Sparkles, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/people", label: "People", icon: Users, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/attendance", label: "Attendance", icon: CalendarDays, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/payroll", label: "Payroll", icon: CreditCard, roles: ["company_admin", "admin", "hr"] },
      { to: "/dashboard/performance", label: "Performance", icon: Gauge, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/documents", label: "Documents", icon: Folder, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/assets", label: "Assets", icon: Package, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/recruitment", label: "Recruitment", icon: Briefcase, exact: true, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["company_admin", "admin", "hr", "manager"] },
      { to: "/dashboard/communication", label: "Communication", icon: MessageSquare, roles: ["company_admin", "admin", "hr", "manager"] },
    ],
  },


  // ══════════════════════════════════════════════════════════════
  // EMPLOYEE-ONLY SECTIONS
  // ══════════════════════════════════════════════════════════════
  {
    roles: ["employee"],
    items: [
      { to: "/dashboard/employee", label: "My Dashboard", icon: LayoutDashboard, exact: true, roles: ["employee"] },
      { to: "/dashboard/attendance", label: "Attendance", icon: CalendarDays, roles: ["employee"] },
      { to: "/dashboard/payroll", label: "Payroll", icon: CreditCard, roles: ["employee"] },
      { to: "/dashboard/performance", label: "Performance", icon: Gauge, roles: ["employee"] },
      { to: "/dashboard/documents", label: "Documents", icon: Folder, roles: ["employee"] },
      { to: "/dashboard/assets", label: "My Assets", icon: Package, roles: ["employee"] },
      { to: "/dashboard/expenses", label: "Expenses", icon: Receipt, roles: ["employee"] },
      { to: "/dashboard/travel", label: "Travel Claims", icon: Plane, roles: ["employee"] },
      { to: "/ai/chat-assistant", label: "AI HR Assistant", icon: Bot, badge: "AI", roles: ["employee"] },
      { to: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["employee"] },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // HR Operations
  // ══════════════════════════════════════════════════════════════
  {
    items: [
      { to: "/dashboard/hr-ops", label: "Operations", icon: Activity, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/lifecycle", label: "Employee Lifecycle", icon: UserCheck, roles: ["admin", "hr", "manager"] },
    ],
  },

  {
    items: [
      { to: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["company_admin", "admin", "hr", "manager"] },
    ],
  },
];

// ── Role-based nav filter ─────────────────────────────────────
function filterNavForRole(sections: NavSection[], role: Role): NavSection[] {
  const allowed = (roles?: string[]) => !roles || roles.includes(role as string);

  return sections
    .filter((s) => allowed(s.roles))
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => allowed(item.roles))
        .map((item) => {
          if (isParent(item)) {
            return {
              ...item,
              children: item.children.filter((c) => allowed(c.roles)),
            };
          }
          return item;
        })
        .filter((item) => {
          if (isParent(item)) return item.children.length > 0;
          return true;
        }),
    }))
    .filter((s) => s.items.length > 0);
}

// ── Demo Mode Banner ──────────────────────────────────────────
function DemoBanner({ role, onDismiss }: { role: Role; onDismiss: () => void }) {
  const roleLabel = role === "manager" ? "Manager" : "Employee";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-400/30 bg-amber-500/10 px-4 py-2">
      <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>
          <span className="font-semibold">Demo Mode</span> — Viewing Sample Enterprise Data as{" "}
          <span className="font-semibold">{roleLabel}</span>. All data is illustrative only.
        </span>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss demo banner"
        className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function DashboardShell() {
  const ws = useofc360();
  const authReady = useAuthReady();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle: toggleTheme } = useTheme();

  const role = (ws.user?.role ?? "admin").toString().toLowerCase();
  const isDemo = Boolean(ws.isDemoUser) && !demoDismissed;

  // ── Auth & Role guard ────────────────────────────────────────
  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!ws.user) {
      navigate({ to: "/login" });
      return;
    }
    if (!ws.user.emailVerified) {
      navigate({ to: "/verify-email" });
      return;
    }
    if (!ws.user.onboardingComplete) {
      navigate({ to: "/onboarding" });
      return;
    }

    const isSuperAdminUser = (role as string)?.toLowerCase() === "super_admin";

    if (isSuperAdminUser && (pathname === "/dashboard" || pathname === "/onboarding")) {
      navigate({ to: "/dashboard/super-admin", replace: true });
      return;
    }

    const isAdminOrHr = role === "admin" || role === "hr";

    // ── Direct access guard & redirection ──
    if (pathname === "/dashboard") {
      if (role === "manager") {
        navigate({ to: "/dashboard/manager" });
        return;
      }
      if (role === "employee") {
        navigate({ to: "/dashboard/employee" });
        return;
      }
    }

    if (pathname === "/dashboard/manager" && role !== "manager") {
      navigate({ to: isAdminOrHr ? "/dashboard" : "/dashboard/employee" });
      return;
    }

    // Employees cannot access Admin/Manager pages
    if (role === "employee") {
      const adminOnlyPaths = [
        "/dashboard/employees",
        "/dashboard/hr",
        "/dashboard/managers",
        "/dashboard/departments",
        "/dashboard/recruitment",
        "/dashboard/reports",
        "/dashboard/hr-ops",
        "/dashboard/timeline",
        "/dashboard/visitors",
        "/dashboard/onboarding-checklist",
        "/dashboard/offboarding",
        "/dashboard/exit",
        "/dashboard/roles",
        "/dashboard/audit-logs",
        "/dashboard/billing",
        "/dashboard/super-admin",
      ];
      const isTryingToAccessAdminOnly = adminOnlyPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
      if (isTryingToAccessAdminOnly) {
        navigate({ to: "/dashboard/employee" });
      }
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, role, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isSuperAdminUser = (role as string)?.toLowerCase() === "super_admin";

  const visibleNav = useMemo(() => {
    if (isSuperAdminUser && !ws.tenantModeCompany) {
      return [
        {
          title: "OWNER CONTROL CENTER",
          items: [
            { to: "/dashboard/super-admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
            { to: "/dashboard/super-admin/organizations", label: "Organizations", icon: Building2 },
            { to: "/dashboard/super-admin/users", label: "Users & Access", icon: Users },
            { to: "/dashboard/super-admin/plans", label: "Plans & Subscriptions", icon: Package },
            { to: "/dashboard/super-admin/entitlements", label: "Feature Entitlements", icon: Zap },
            { to: "/dashboard/super-admin/billing", label: "Billing", icon: CreditCard },
            { to: "/dashboard/super-admin/ai-usage", label: "AI Usage", icon: Sparkles },
            { to: "/dashboard/super-admin/analytics", label: "Platform Analytics", icon: BarChart3 },
            { to: "/dashboard/super-admin/audit-logs", label: "Audit Logs", icon: History },
            { to: "/dashboard/super-admin/security", label: "Security", icon: ShieldCheck },
            { to: "/dashboard/super-admin/system-health", label: "System Health", icon: Activity },
            { to: "/dashboard/super-admin/announcements", label: "Announcements", icon: Bell },
            { to: "/dashboard/super-admin/settings", label: "Settings", icon: Settings },
          ],
        },
      ];
    }

    if (isSuperAdminUser && ws.tenantModeCompany) {
      // In Tenant Management Mode: Include Exit button section + HR modules
      return [
        {
          title: `TENANT VIEW: ${ws.tenantModeCompany.name}`,
          items: [
            { to: "/dashboard/super-admin/organizations", label: "← Back to Owner Center", icon: ShieldCheck },
          ],
        },
        ...filterNavForRole(NAV_SECTIONS, "admin" as any),
      ];
    }

    return filterNavForRole(NAV_SECTIONS, role as any);
  }, [role, isSuperAdminUser, ws.tenantModeCompany]);


  if (!authReady || ws.isRestoring || !ws.user) {
    return <AuthLoadingScreen />;
  }

  function logout() {
    setTokens(null);
    ofc360.reset();
    navigate({ to: "/login" });
  }

  const initials = ws.user.fullName?.split(" ").map((p: string) => p[0]).slice(0, 2).join("") || "A";

  // ── Sidebar home link per role ──────────────────────────────
  const homeLink = isSuperAdminUser
    ? "/dashboard/super-admin"
    : role === "manager"
      ? "/dashboard/manager"
      : role === "employee"
        ? "/dashboard/employee"
        : "/dashboard";

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
      {/* Demo Mode Banner */}
      {isDemo && (
        <DemoBanner
          role={role as Role}
          onDismiss={() => setDemoDismissed(true)}
        />
      )}

      {/* Tenant Management Mode Banner */}
      {ws.tenantModeCompany && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-400 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>SUPER ADMIN TENANT MODE — Viewing: <strong className="text-white font-bold">{ws.tenantModeCompany.name}</strong></span>
          </div>
          <button
            onClick={() => ofc360.set({ tenantModeCompany: null })}
            className="rounded bg-amber-500/20 px-3 py-1 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            Exit Tenant View Mode
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1">

        {/* Fixed Full Height Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-2xl transition-all duration-200 ${collapsed ? "w-[68px]" : "w-64"
            } ${mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link to={homeLink as any} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-4 w-4" />
              </span>
              {!collapsed ? <span className="font-display text-lg font-semibold tracking-tight">OFC360</span> : null}
            </Link>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4.5 w-4.5" />
            </button>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto p-2">
            {visibleNav.map((section, sIdx) => (
              <div key={sIdx} className="space-y-0.5">
                {section.title && !collapsed ? (
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {section.title}
                  </div>
                ) : null}
                {section.title && collapsed ? (
                  <div className="mx-2 my-2 border-t border-border" />
                ) : null}
                {section.items.map((item) => {
                  if (isParent(item)) {
                    return (
                      <NavGroup
                        key={item.basePath}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                      />
                    );
                  }
                  const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                      {!collapsed ? (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && <NavBadge kind={item.badge} />}
                          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
                        </>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="border-t border-border/80 p-3 bg-card/40">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs">
                {initials}
              </div>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">{ws.user?.fullName}</div>
                  <div className="truncate text-xs capitalize text-muted-foreground">{ws.user?.role?.replace("_", " ")}</div>
                </div>
              ) : null}
              {!collapsed ? (
                <button onClick={logout} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-md transition-opacity lg:hidden"
          />
        ) : null}

        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-200 ${
            collapsed ? "lg:pl-[68px]" : "lg:pl-64"
          }`}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input placeholder="Search employees, departments, requests…" className="h-9.5 pl-9 text-sm" />
            </div>

            {/* Global Back Button */}
            <BackButton />

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs sm:flex">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{ws.company?.name || "Workspace"}</span>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavGroup({ item, pathname, collapsed }: { item: NavParent; pathname: string; collapsed: boolean }) {
  const isActive = item.children.some((c) => (c.exact ? pathname === c.to : pathname === c.to || pathname.startsWith(c.to + "/"))) || pathname === item.basePath || pathname.startsWith(item.basePath + "/");
  const [open, setOpen] = useState(isActive);
  useEffect(() => { if (isActive) setOpen(true); }, [isActive]);
  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        to={item.basePath as any}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          }`}
        aria-label={item.label}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
        <Icon className="h-4 w-4 shrink-0" />
      </Link>
    );
  }

  return (
    <div>
      <div
        className={`group relative flex w-full items-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          }`}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
        <Link
          to={item.basePath as any}
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && !item.count && <NavBadge kind={item.badge} />}
          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
        </Link>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
          aria-label={open ? "Collapse" : "Expand"}
          className="mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open ? (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
          {item.children.map((child) => {
            const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.to}
                to={child.to as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
              >
                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1">{child.label}</span>
                {child.badge && <NavBadge kind={child.badge} />}
                {child.count !== undefined && !child.badge && <NavCount count={child.count} />}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRecruitmentSubPage =
    pathname.startsWith("/dashboard/recruitment/") &&
    pathname !== "/dashboard/recruitment" &&
    pathname !== "/dashboard/recruitment/";
  const isPayrollSubPage =
    pathname.startsWith("/dashboard/payroll/") &&
    pathname !== "/dashboard/payroll" &&
    pathname !== "/dashboard/payroll/";

  return (
    <div className="mb-6 flex flex-col min-w-0 gap-2 text-left">
      {isRecruitmentSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/recruitment"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to Recruitment Hub
          </Link>
        </div>
      )}
      {isPayrollSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/payroll"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to Payroll Hub
          </Link>
        </div>
      )}
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function ComingSoon({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
