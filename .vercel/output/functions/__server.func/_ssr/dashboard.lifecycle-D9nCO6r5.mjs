import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as LogOut, Br as Archive, Hn as Clock, I as Sparkles, Ir as ArrowRight, Qn as CircleCheck, V as ShieldAlert, v as UserCheck } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DJnL0VlY.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { r as useHrms } from "./store-X_wAidjM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.lifecycle-D9nCO6r5.js
var import_jsx_runtime = require_jsx_runtime();
function EmployeeLifecyclePage() {
	const navigate = useNavigate();
	const onboardingCount = useHrms((s) => s.onboarding.length);
	const offboardingCount = useHrms((s) => s.offboarding.length);
	const exitCount = useHrms((s) => s.exits.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Employee Lifecycle Hub",
				description: "Unified portal for managing onboarding, offboarding, and exit clearances."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Active Onboardings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: onboardingCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-emerald-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " New hires in progress"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Active Offboardings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: offboardingCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-amber-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Asset returns pending"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Pending Exit Cases"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: exitCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-rose-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3 w-3" }), " Clearances required"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6 md:grid-cols-3",
				children: [
					{
						id: "onboarding",
						title: "Onboarding",
						subtitle: "New Hire Orientation & Setup",
						description: "Manage welcome checklists, IT asset provisioning, document verifications, and department orientation.",
						icon: UserCheck,
						path: "/dashboard/onboarding-checklist",
						count: onboardingCount,
						gradient: "from-blue-600/20 to-indigo-600/20",
						accentBorder: "border-blue-500/30 hover:border-blue-500/60",
						iconColor: "text-blue-500 bg-blue-500/10",
						buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
						badge: "Active",
						features: [
							"Pre-boarding task automation",
							"Document collection & BGV verification",
							"IT & Laptop asset allocation",
							"Buddy assignment & 30-60-90 plan"
						]
					},
					{
						id: "offboarding",
						title: "Offboarding",
						subtitle: "Handover & Departure Workflows",
						description: "Streamline employee departure tasks, knowledge transfer logs, company asset returns, and access revocations.",
						icon: Archive,
						path: "/dashboard/offboarding",
						count: offboardingCount,
						gradient: "from-amber-600/20 to-orange-600/20",
						accentBorder: "border-amber-500/30 hover:border-amber-500/60",
						iconColor: "text-amber-500 bg-amber-500/10",
						buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
						badge: "In Progress",
						features: [
							"Knowledge transfer tracking",
							"IT asset & badge return log",
							"System & email account deprecation",
							"Department clearance sign-offs"
						]
					},
					{
						id: "exit",
						title: "Exit Management",
						subtitle: "Resignations, Notice & Clearances",
						description: "Manage resignation requests, exit interviews, notice period buyouts, final settlement approvals, and alumni network.",
						icon: LogOut,
						path: "/dashboard/exit",
						count: exitCount,
						gradient: "from-rose-600/20 to-pink-600/20",
						accentBorder: "border-rose-500/30 hover:border-rose-500/60",
						iconColor: "text-rose-500 bg-rose-500/10",
						buttonColor: "bg-rose-600 hover:bg-rose-700 text-white",
						badge: "Clearance",
						features: [
							"Resignation approval workflows",
							"AI exit interview sentiment analysis",
							"Full & Final (F&F) settlement calculator",
							"Alumni portal & experience letter issuing"
						]
					}
				].map((mod) => {
					const Icon = mod.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigate({ to: mod.path }),
						className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${mod.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${mod.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `grid h-12 w-12 place-items-center rounded-xl ${mod.iconColor}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "text-xs font-bold px-2.5 py-0.5",
											children: [mod.count, " Cases"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
											children: mod.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold text-muted-foreground mt-0.5",
											children: mod.subtitle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs leading-relaxed text-muted-foreground",
											children: mod.description
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 pt-2",
										children: mod.features.map((feat, fIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-foreground/80",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-indigo-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
										}, fIdx))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative pt-4 mt-6 border-t border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: `w-full justify-between rounded-xl font-medium shadow-md transition-all ${mod.buttonColor}`,
									onClick: (e) => {
										e.stopPropagation();
										navigate({ to: mod.path });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Manage ", mod.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
								})
							})
						]
					}, mod.id);
				})
			})
		]
	});
}
//#endregion
export { EmployeeLifecyclePage as component };
