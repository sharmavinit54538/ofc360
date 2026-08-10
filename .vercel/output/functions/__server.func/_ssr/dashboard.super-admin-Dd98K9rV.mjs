import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { At as ofc360 } from "./ofc360-store-DqGLmdH1.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as ShieldCheck, Fn as CreditCard, I as Sparkles, Qt as History, Sr as Building2, U as Settings, Ut as LayoutDashboard, Vr as Activity, fr as ChartColumn, kr as Bell, n as Zap, u as Users, vt as Package, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { _ as Link, p as Outlet, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-ZkVmiFuO.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Card } from "./card-BcHXPpmN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin-Dd98K9rV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const ws = (0, import_react.useSyncExternalStore)(ofc360.subscribe, ofc360.get, ofc360.get);
	if (ws.user?.role?.toLowerCase() !== "super_admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 max-w-md mx-auto my-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-rose-500/20 bg-rose-500/5 p-6 text-center shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mx-auto h-10 w-10 text-rose-500 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-foreground",
					children: "403 Forbidden — Super Admin Privileges Required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-2",
					children: [
						"Access Denied: Your account role (",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ws.user?.role || "UNAUTHORIZED" }),
						") is strictly forbidden from accessing the SaaS Owner Control Center."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "default",
							className: "h-8 text-xs px-4",
							children: "Return to Workspace Dashboard"
						})
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "SaaS Owner Control Center",
				description: "Global multi-tenant platform control, user permissions, feature entitlements, system telemetry, and billing engine.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-400 font-semibold shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-indigo-400 animate-pulse" }), "Global Platform Owner"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 border-b border-border pb-1 overflow-x-auto scrollbar-none",
				children: [
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
						label: "Entitlements",
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
						label: "Analytics",
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
				].map((tab) => {
					const isActive = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to) && (tab.to !== "/dashboard/super-admin" || pathname === "/dashboard/super-admin");
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive ? "bg-foreground text-background shadow-xs font-bold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		]
	});
}
//#endregion
export { SuperAdminLayout as component };
