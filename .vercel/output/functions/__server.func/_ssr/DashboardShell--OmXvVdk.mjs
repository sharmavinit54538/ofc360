import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { At as ofc360, Vt as setTokens, bt as hasValidAccessToken, ln as useofc360 } from "./ofc360-store-CDoLj5BI.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { i as useAuthReady } from "./auth-bootstrap-C6U64DXJ.mjs";
import { At as LogOut, B as ShieldCheck, Cr as Briefcase, Fn as CreditCard, I as Sparkles, K as Search, Qt as History, Rr as ArrowLeft, Sr as Building2, Tr as Bot, Tt as Menu, U as Settings, Ut as LayoutDashboard, Vr as Activity, Xt as Info, _ as UserCog, _r as CalendarDays, ar as ChevronDown, bt as Moon, cn as Gauge, et as Receipt, fr as ChartColumn, gt as PanelLeft, ir as ChevronLeft, j as Sun, kr as Bell, n as Zap, r as X, st as Plane, u as Users, un as Folder, v as UserCheck, vt as Package, wt as MessageSquare } from "../_libs/lucide-react.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { n as useTheme } from "./ThemeProvider-6IpgR288.mjs";
import { _ as Link, p as Outlet, u as useRouterState, v as useNavigate, z as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell--OmXvVdk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BackButton({ fallbackUrl = "/dashboard", className = "", showText = true }) {
	const router = useRouter();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.startsWith("/auth") || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return null;
	const handleBack = () => {
		if (typeof window !== "undefined" && window.history.length > 1) try {
			router.history.back();
		} catch {
			navigate({ to: fallbackUrl });
		}
		else navigate({ to: fallbackUrl });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: handleBack,
		className: `group inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border/80 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs ${className}`,
		"aria-label": "Go back to previous page",
		title: "Go back",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" }), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back" })]
	});
}
var isParent = (i) => "children" in i;
var BADGE_STYLES = {
	New: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
	AI: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
	Beta: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
	Hot: "bg-rose-500/20 text-rose-400 border border-rose-500/30"
};
function NavBadge({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLES[kind]}`,
		children: kind
	});
}
function NavCount({ count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ml-auto shrink-0 min-w-[18px] rounded-full bg-destructive/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-white",
		children: count > 99 ? "99+" : count
	});
}
var NAV_SECTIONS = [
	{ items: [
		{
			to: "/dashboard",
			label: "Overview",
			icon: LayoutDashboard,
			exact: true,
			roles: [
				"company_admin",
				"admin",
				"hr"
			]
		},
		{
			to: "/dashboard/manager",
			label: "Manager Dashboard",
			icon: UserCog,
			roles: ["manager"]
		},
		{
			to: "/ai",
			label: "AI Suite",
			icon: Sparkles,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/people",
			label: "People",
			icon: Users,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/attendance",
			label: "Attendance",
			icon: CalendarDays,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/payroll",
			label: "Payroll",
			icon: CreditCard,
			roles: [
				"company_admin",
				"admin",
				"hr"
			]
		},
		{
			to: "/dashboard/performance",
			label: "Performance",
			icon: Gauge,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/documents",
			label: "Documents",
			icon: Folder,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/assets",
			label: "Assets",
			icon: Package,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/recruitment",
			label: "Recruitment",
			icon: Briefcase,
			exact: true,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/reports",
			label: "Reports",
			icon: ChartColumn,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/communication",
			label: "Communication",
			icon: MessageSquare,
			roles: [
				"company_admin",
				"admin",
				"hr",
				"manager"
			]
		}
	] },
	{
		roles: ["employee"],
		items: [
			{
				to: "/dashboard/employee",
				label: "My Dashboard",
				icon: LayoutDashboard,
				exact: true,
				roles: ["employee"]
			},
			{
				to: "/dashboard/attendance",
				label: "Attendance",
				icon: CalendarDays,
				roles: ["employee"]
			},
			{
				to: "/dashboard/payroll",
				label: "Payroll",
				icon: CreditCard,
				roles: ["employee"]
			},
			{
				to: "/dashboard/performance",
				label: "Performance",
				icon: Gauge,
				roles: ["employee"]
			},
			{
				to: "/dashboard/documents",
				label: "Documents",
				icon: Folder,
				roles: ["employee"]
			},
			{
				to: "/dashboard/assets",
				label: "My Assets",
				icon: Package,
				roles: ["employee"]
			},
			{
				to: "/dashboard/expenses",
				label: "Expenses",
				icon: Receipt,
				roles: ["employee"]
			},
			{
				to: "/dashboard/travel",
				label: "Travel Claims",
				icon: Plane,
				roles: ["employee"]
			},
			{
				to: "/ai/chat-assistant",
				label: "AI HR Assistant",
				icon: Bot,
				badge: "AI",
				roles: ["employee"]
			},
			{
				to: "/dashboard/settings",
				label: "Settings",
				icon: Settings,
				roles: ["employee"]
			}
		]
	},
	{ items: [{
		to: "/dashboard/hr-ops",
		label: "Operations",
		icon: Activity,
		roles: [
			"admin",
			"hr",
			"manager"
		]
	}, {
		to: "/dashboard/lifecycle",
		label: "Employee Lifecycle",
		icon: UserCheck,
		roles: [
			"admin",
			"hr",
			"manager"
		]
	}] },
	{ items: [{
		to: "/dashboard/settings",
		label: "Settings",
		icon: Settings,
		roles: [
			"company_admin",
			"admin",
			"hr",
			"manager"
		]
	}] }
];
function filterNavForRole(sections, role) {
	const allowed = (roles) => !roles || roles.includes(role);
	return sections.filter((s) => allowed(s.roles)).map((section) => ({
		...section,
		items: section.items.filter((item) => allowed(item.roles)).map((item) => {
			if (isParent(item)) return {
				...item,
				children: item.children.filter((c) => allowed(c.roles))
			};
			return item;
		}).filter((item) => {
			if (isParent(item)) return item.children.length > 0;
			return true;
		})
	})).filter((s) => s.items.length > 0);
}
function DemoBanner({ role, onDismiss }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-b border-amber-400/30 bg-amber-500/10 px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "Demo Mode"
				}),
				" — Viewing Sample Enterprise Data as",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: role === "manager" ? "Manager" : "Employee"
				}),
				". All data is illustrative only."
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onDismiss,
			"aria-label": "Dismiss demo banner",
			className: "shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
		})]
	});
}
function DashboardShell() {
	const ws = useofc360();
	const authReady = useAuthReady();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [demoDismissed, setDemoDismissed] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { theme, toggle: toggleTheme } = useTheme();
	const role = (ws.user?.role ?? "admin").toString().toLowerCase();
	const isDemo = Boolean(ws.isDemoUser) && !demoDismissed;
	(0, import_react.useEffect)(() => {
		if (!authReady || ws.isRestoring) return;
		if (!ws.user && !hasValidAccessToken()) {
			navigate({ to: "/login" });
			return;
		}
		if (!ws.user) return;
		if (!ws.user.emailVerified) {
			navigate({ to: "/verify-email" });
			return;
		}
		if (!ws.user.onboardingComplete) {
			navigate({ to: "/onboarding" });
			return;
		}
		if (role?.toLowerCase() === "super_admin" && (pathname === "/dashboard" || pathname === "/onboarding")) {
			navigate({
				to: "/dashboard/super-admin",
				replace: true
			});
			return;
		}
		const isAdminOrHr = role === "admin" || role === "hr";
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
		if (role === "employee") {
			if ([
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
				"/dashboard/super-admin"
			].some((p) => pathname === p || pathname.startsWith(`${p}/`))) navigate({ to: "/dashboard/employee" });
		}
	}, [
		authReady,
		ws.isRestoring,
		ws.user,
		pathname,
		role,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	const isSuperAdminUser = role?.toLowerCase() === "super_admin";
	const visibleNav = (0, import_react.useMemo)(() => {
		if (isSuperAdminUser && !ws.tenantModeCompany) return [{
			title: "OWNER CONTROL CENTER",
			items: [
				{
					to: "/dashboard/super-admin",
					label: "Dashboard",
					icon: LayoutDashboard,
					exact: true
				},
				{
					to: "/dashboard/super-admin/organizations",
					label: "Organizations",
					icon: Building2
				},
				{
					to: "/dashboard/super-admin/users",
					label: "Users & Access",
					icon: Users
				},
				{
					to: "/dashboard/super-admin/plans",
					label: "Plans & Subscriptions",
					icon: Package
				},
				{
					to: "/dashboard/super-admin/entitlements",
					label: "Feature Entitlements",
					icon: Zap
				},
				{
					to: "/dashboard/super-admin/billing",
					label: "Billing",
					icon: CreditCard
				},
				{
					to: "/dashboard/super-admin/ai-usage",
					label: "AI Usage",
					icon: Sparkles
				},
				{
					to: "/dashboard/super-admin/analytics",
					label: "Platform Analytics",
					icon: ChartColumn
				},
				{
					to: "/dashboard/super-admin/audit-logs",
					label: "Audit Logs",
					icon: History
				},
				{
					to: "/dashboard/super-admin/security",
					label: "Security",
					icon: ShieldCheck
				},
				{
					to: "/dashboard/super-admin/system-health",
					label: "System Health",
					icon: Activity
				},
				{
					to: "/dashboard/super-admin/announcements",
					label: "Announcements",
					icon: Bell
				},
				{
					to: "/dashboard/super-admin/settings",
					label: "Settings",
					icon: Settings
				}
			]
		}];
		if (isSuperAdminUser && ws.tenantModeCompany) return [{
			title: `TENANT VIEW: ${ws.tenantModeCompany.name}`,
			items: [{
				to: "/dashboard/super-admin/organizations",
				label: "← Back to Owner Center",
				icon: ShieldCheck
			}]
		}, ...filterNavForRole(NAV_SECTIONS, "admin")];
		return filterNavForRole(NAV_SECTIONS, role);
	}, [
		role,
		isSuperAdminUser,
		ws.tenantModeCompany
	]);
	if (!authReady || ws.isRestoring || !ws.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	function logout() {
		setTokens(null);
		ofc360.reset();
		navigate({ to: "/login" });
	}
	const initials = ws.user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A";
	const homeLink = isSuperAdminUser ? "/dashboard/super-admin" : role === "manager" ? "/dashboard/manager" : role === "employee" ? "/dashboard/employee" : "/dashboard";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground",
		children: [
			isDemo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {
				role,
				onDismiss: () => setDemoDismissed(true)
			}),
			ws.tenantModeCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-400 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-amber-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SUPER ADMIN TENANT MODE — Viewing: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-white font-bold",
						children: ws.tenantModeCompany.name
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => ofc360.set({ tenantModeCompany: null }),
					className: "rounded bg-amber-500/20 px-3 py-1 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer",
					children: "Exit Tenant View Mode"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: `fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-2xl transition-all duration-200 ${collapsed ? "w-[68px]" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-16 items-center justify-between border-b border-border px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: homeLink,
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow",
										style: { background: "var(--gradient-brand)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
									}), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-semibold tracking-tight",
										children: "ofc360"
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCollapsed((c) => !c),
									className: "hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors",
									"aria-label": "Toggle sidebar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "h-4.5 w-4.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex-1 space-y-3 overflow-y-auto p-2",
								children: visibleNav.map((section, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [
										section.title && !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70",
											children: section.title
										}) : null,
										section.title && collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 my-2 border-t border-border" }) : null,
										section.items.map((item) => {
											if (isParent(item)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
												item,
												pathname,
												collapsed
											}, item.basePath);
											const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
											const Icon = item.icon;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: item.to,
												className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${active ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}` }), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1 truncate",
														children: item.label
													}),
													item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
													item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
												] }) : null]
											}, item.to);
										})
									]
								}, sIdx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border/80 p-3 bg-card/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-3 ${collapsed ? "justify-center" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs",
											children: initials
										}),
										!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-sm font-semibold text-foreground",
												children: ws.user?.fullName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs capitalize text-muted-foreground",
												children: ws.user?.role?.replace("_", " ")
											})]
										}) : null,
										!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: logout,
											className: "rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer",
											"aria-label": "Sign out",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
										}) : null
									]
								})
							})
						]
					}),
					mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onClick: () => setMobileOpen(false),
						className: "fixed inset-0 z-30 bg-background/80 backdrop-blur-md transition-opacity lg:hidden"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-200 ${collapsed ? "lg:pl-[68px]" : "lg:pl-64"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl sm:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMobileOpen(true),
									className: "rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative max-w-md flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Search employees, departments, requests…",
										className: "h-9.5 pl-9 text-sm"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleTheme,
									className: "rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
									"aria-label": "Toggle theme",
									children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-slate-700" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
									"aria-label": "Notifications",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: ws.company?.name || "Workspace"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							className: "min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						})]
					})
				]
			})
		]
	});
}
function NavGroup({ item, pathname, collapsed }) {
	const isActive = item.children.some((c) => c.exact ? pathname === c.to : pathname === c.to || pathname.startsWith(c.to + "/")) || pathname === item.basePath || pathname.startsWith(item.basePath + "/");
	const [open, setOpen] = (0, import_react.useState)(isActive);
	(0, import_react.useEffect)(() => {
		if (isActive) setOpen(true);
	}, [isActive]);
	const Icon = item.icon;
	if (collapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.basePath,
		className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		"aria-label": item.label,
		children: [isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group relative flex w-full items-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		children: [
			isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.basePath,
				onClick: () => setOpen(true),
				className: "flex flex-1 items-center gap-3 rounded-lg px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-left",
						children: item.label
					}),
					item.badge && !item.count && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
					item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen((o) => !o);
				},
				"aria-label": open ? "Collapse" : "Expand",
				className: "mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}` })
			})
		]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ml-4 mt-1 space-y-0.5 border-l border-border pl-2",
		children: item.children.map((child) => {
			const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
			const ChildIcon = child.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: child.to,
				className: `flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildIcon, { className: "h-3.5 w-3.5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: child.label
					}),
					child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: child.badge }),
					child.count !== void 0 && !child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: child.count })
				]
			}, child.to);
		})
	}) : null] });
}
function PageHeader({ title, description, actions }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isRecruitmentSubPage = pathname.startsWith("/dashboard/recruitment/") && pathname !== "/dashboard/recruitment" && pathname !== "/dashboard/recruitment/";
	const isPayrollSubPage = pathname.startsWith("/dashboard/payroll/") && pathname !== "/dashboard/payroll" && pathname !== "/dashboard/payroll/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col min-w-0 gap-2 text-left",
		children: [
			isRecruitmentSubPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/recruitment",
					className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" }), "Back to Recruitment Hub"]
				})
			}),
			isPayrollSubPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/payroll",
					className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" }), "Back to Payroll Hub"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight",
						children: title
					}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: description
					}) : null]
				}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 flex-wrap gap-2",
					children: actions
				}) : null]
			})
		]
	});
}
function ComingSoon({ title, description, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { DashboardShell as n, PageHeader as r, ComingSoon as t };
