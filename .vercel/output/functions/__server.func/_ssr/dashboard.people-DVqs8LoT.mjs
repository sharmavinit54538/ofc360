import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Fr as ArrowRight, m as UserPlus, u as Users, v as UserCheck, xr as Building2 } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-B-wJDcuP.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.people-DVqs8LoT.js
var import_jsx_runtime = require_jsx_runtime();
function PeopleHubPage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "People Hub",
			description: "Unified management center for workforce, leadership, and organizational structure."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-6 md:grid-cols-3",
			children: [
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
					features: [
						"Employee Directory",
						"Onboarding & Status",
						"Role Management"
					]
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
					features: [
						"Managerial Roles",
						"Team Allocations",
						"Approval Permissions"
					]
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
					features: [
						"Department Hierarchy",
						"Head Assignments",
						"Resource Allocation"
					]
				}
			].map((card) => {
				const Icon = card.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigate({ to: card.path }),
					className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-muted/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
										children: card.badge
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
									children: card.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: card.description
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2 space-y-2",
									children: card.features.map((feat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-medium text-foreground/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
									}, feat))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative pt-6 mt-6 border-t border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: `w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`,
								onClick: (e) => {
									e.stopPropagation();
									navigate({ to: card.path });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Manage ", card.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
							})
						})
					]
				}, card.title);
			})
		})]
	});
}
//#endregion
export { PeopleHubPage as component };
