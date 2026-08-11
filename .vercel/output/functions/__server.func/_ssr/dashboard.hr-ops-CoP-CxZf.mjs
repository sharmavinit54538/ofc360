import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as Sparkles, Ir as ArrowRight, Vr as Activity, et as Receipt, st as Plane, u as Users } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-BxC1t09N.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { r as useHrms } from "./store-Bfab2GKW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.hr-ops-CoP-CxZf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#06b6d4",
	"#8b5cf6"
];
function OperationsHubPage() {
	const navigate = useNavigate();
	const s = useHrms((x) => x);
	const timelineCount = s.timeline.length;
	const visitorsCount = s.visitors.length;
	const todayVisitors = (0, import_react.useMemo)(() => s.visitors.filter((v) => new Date(v.createdAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()).length, [s.visitors]);
	const expenseCount = s.expenses.length;
	const travelCount = s.travel.length;
	const expenseStatus = (0, import_react.useMemo)(() => {
		const counts = {};
		s.expenses.forEach((e) => {
			counts[e.status] = (counts[e.status] ?? 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({
			name,
			value
		}));
	}, [s.expenses]);
	const travelStatus = (0, import_react.useMemo)(() => {
		const counts = {};
		s.travel.forEach((t) => {
			counts[t.status] = (counts[t.status] ?? 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({
			name,
			value
		}));
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
			highlights: [
				"Promotions & Grade updates",
				"Department transfers",
				"Performance reviews log"
			]
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
			highlights: [
				"Host instant SMS/Email alert",
				"Digital badge scanning",
				"Visitor log archives"
			]
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
			highlights: [
				"Receipt photo attachment",
				"Automated policy check",
				"Batch payout export"
			]
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
			highlights: [
				"Itinerary approval flow",
				"Per-diem allowance auto-calc",
				"Corporate rate discounts"
			]
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Operations Hub",
				description: "Centralized portal for managing employee timelines, visitor check-ins, expense claims, and corporate travel requests."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Timeline Events"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: timelineCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-blue-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), " System activity logged"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Visitors Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: todayVisitors
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-purple-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " Checked in at reception"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Expense Claims"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: expenseCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-emerald-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3 w-3" }), " Claims processing"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Travel Requests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl font-bold",
								children: travelCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-amber-500 flex items-center gap-1 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "h-3 w-3" }), " Trips requested"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "h-5 w-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: modules.map((mod) => {
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
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-xs font-bold px-2.5 py-0.5",
											children: mod.count
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
											children: mod.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold text-muted-foreground mt-0.5",
											children: mod.subtitle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3",
											children: mod.description
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 pt-2",
										children: mod.highlights.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-foreground/80",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-indigo-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item
											})]
										}, idx))
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Open ", mod.title.split(" ")[0]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
								})
							})
						]
					}, mod.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							children: "Expense Status Breakdown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs font-normal",
							children: "Reimbursements"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: expenseStatus,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .15
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										fontSize: 12,
										stroke: "hsl(var(--muted-foreground))"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										fontSize: 12,
										stroke: "hsl(var(--muted-foreground))"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										radius: [
											6,
											6,
											0,
											0
										],
										fill: "#10b981"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							children: "Travel Requests Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs font-normal",
							children: "Corporate Trips"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: travelStatus,
								dataKey: "value",
								nameKey: "name",
								outerRadius: 85,
								label: true,
								children: travelStatus.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: 8
							} })] })
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { OperationsHubPage as component };
