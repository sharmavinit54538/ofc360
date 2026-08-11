import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, I as Sparkles, Ir as ArrowRight, Mn as DollarSign, S as TrendingUp, Sr as Building2, Tn as Eye, u as Users, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as superAdminApi } from "./superAdminApi-DqdsLjRi.mjs";
import { a as ReactivateAccessModal, i as GrantAccessModal, o as SuspendAccessModal, r as ExtendAccessModal } from "./AdminActionModals-Biv8hN9V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.index-CaXxEOUR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminOverviewPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [selectedOrg, setSelectedOrg] = (0, import_react.useState)(null);
	const [grantOpen, setGrantOpen] = (0, import_react.useState)(false);
	const [extendOpen, setExtendOpen] = (0, import_react.useState)(false);
	const [suspendOpen, setSuspendOpen] = (0, import_react.useState)(false);
	const [reactivateOpen, setReactivateOpen] = (0, import_react.useState)(false);
	const fetchDashboard = async () => {
		setIsLoading(true);
		setError(null);
		try {
			setData(await superAdminApi.getDashboard());
		} catch (err) {
			console.error("Super admin dashboard load error:", err);
			setError(err.response?.data?.detail || err.message || "Failed to load super admin metrics");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchDashboard();
	}, []);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-2xl bg-card/40 border border-border animate-pulse" }, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-2xl bg-card/40 border border-border animate-pulse" })]
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-rose-500/20 bg-rose-500/5 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mx-auto h-8 w-8 text-rose-500 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-foreground",
				children: "Failed to Load Control Center Data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: error || "Backend connection issue."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: fetchDashboard,
				variant: "outline",
				className: "mt-4 h-8 text-xs gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry Request"]
			})
		]
	});
	const { kpis, financials, unpaid_active_customers, charts } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8",
				children: [
					{
						title: "Total Orgs",
						value: kpis.total_organizations,
						color: "text-blue-500",
						bg: "bg-blue-500/10"
					},
					{
						title: "Active Orgs",
						value: kpis.active_organizations,
						color: "text-emerald-500",
						bg: "bg-emerald-500/10"
					},
					{
						title: "Paid Orgs",
						value: kpis.paid_organizations,
						color: "text-teal-500",
						bg: "bg-teal-500/10"
					},
					{
						title: "Complimentary",
						value: kpis.complimentary_organizations,
						color: "text-indigo-500",
						bg: "bg-indigo-500/10"
					},
					{
						title: "Free Orgs",
						value: kpis.free_organizations,
						color: "text-cyan-500",
						bg: "bg-cyan-500/10"
					},
					{
						title: "Trial Orgs",
						value: kpis.trial_organizations,
						color: "text-amber-500",
						bg: "bg-amber-500/10"
					},
					{
						title: "Suspended Orgs",
						value: kpis.suspended_organizations,
						color: "text-rose-500",
						bg: "bg-rose-500/10"
					},
					{
						title: "Expired Orgs",
						value: kpis.expired_organizations,
						color: "text-neutral-500",
						bg: "bg-neutral-500/10"
					}
				].map((card, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] font-bold uppercase tracking-wider block text-muted-foreground`,
							children: card.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-1 font-display text-xl font-bold ${card.color}`,
							children: card.value
						})]
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Revenue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-emerald-500" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-2xl font-bold text-emerald-500",
							children: ["₹", financials.total_revenue.toLocaleString()]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: "Real collected payment transactions"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Recurring (MRR)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-indigo-500" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-2xl font-bold text-indigo-400",
							children: ["₹", financials.mrr.toLocaleString()]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: ["ARR: ₹", financials.arr.toLocaleString()]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total SaaS Users" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-blue-500" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl font-bold text-foreground",
							children: kpis.total_users.toLocaleString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: [
								"DAU: ",
								kpis.dau,
								" • MAU: ",
								kpis.mau
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Employee Records" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-cyan-500" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl font-bold text-cyan-400",
							children: kpis.total_employees.toLocaleString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: "Across all tenant databases"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-bold",
							children: "Revenue Growth Trend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Actual collected SaaS subscription payments over time"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[240px] pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: charts.revenue_trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										style: { fontSize: 10 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { style: { fontSize: 10 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "revenue",
										fill: "#10b981",
										radius: [
											4,
											4,
											0,
											0
										],
										name: "Collected Revenue (₹)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-bold",
							children: "Access Status Distribution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs",
							children: "Breakdown of active, complimentary, and suspended tenants"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[240px] flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: charts.status_distribution,
									cx: "50%",
									cy: "50%",
									innerRadius: 55,
									outerRadius: 75,
									paddingAngle: 4,
									dataKey: "value",
									children: charts.status_distribution.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 10 } })
							] })
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-indigo-500/20 bg-card/40 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-3 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-indigo-400 animate-pulse" }), "Complimentary / Unpaid Active Customers"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: "Dedicated tracking widget for organizations with active application access without payment."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/super-admin/unpaid-active",
						className: "text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer",
						children: [
							"View All (",
							unpaid_active_customers.length,
							") ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: unpaid_active_customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-xs text-muted-foreground italic",
						children: "No unpaid active customers found. All active tenants have paid subscriptions."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							className: "min-w-[900px] border-collapse text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
								className: "bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Organization"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Plan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-center",
										children: "Access Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-center",
										children: "Payment Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Granted By"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Expiry Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Reason"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: unpaid_active_customers.slice(0, 5).map((org) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "border-t border-border hover:bg-accent/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "px-4 py-3 font-semibold text-foreground",
										children: [org.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[10px] font-normal text-muted-foreground",
											children: org.owner_email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-indigo-500/30 text-indigo-400 text-[10px]",
											children: org.plan
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-indigo-500/10 text-indigo-400 border-none font-semibold text-[10px]",
											children: org.access_status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-amber-500/10 text-amber-500 border-none font-semibold text-[10px]",
											children: org.payment_status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: org.granted_by
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: org.expires_at ? org.expires_at.split("T")[0] : "Lifetime"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground max-w-[200px] truncate",
										title: org.reason,
										children: org.reason
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: `/dashboard/super-admin/organizations/${org.id}`,
												className: "rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer",
												title: "View Customer Detail",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setSelectedOrg({
														id: org.id,
														name: org.name,
														owner: {
															name: org.owner_name,
															email: org.owner_email
														},
														user_count: 0,
														employee_count: 0,
														plan: org.plan,
														access_status: org.access_status,
														access_type: org.access_type,
														payment_status: org.payment_status,
														access_source: "SUPER_ADMIN",
														access_granted_by: org.granted_by,
														access_expires_at: org.expires_at,
														access_grant_reason: org.reason,
														mrr: 0,
														created_at: null
													});
													setExtendOpen(true);
												},
												className: "rounded px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-semibold cursor-pointer",
												children: "Extend"
											})]
										})
									})
								]
							}, org.id)) })]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrantAccessModal, {
				open: grantOpen,
				onOpenChange: setGrantOpen,
				org: selectedOrg,
				onSuccess: fetchDashboard
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendAccessModal, {
				open: extendOpen,
				onOpenChange: setExtendOpen,
				org: selectedOrg,
				onSuccess: fetchDashboard
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspendAccessModal, {
				open: suspendOpen,
				onOpenChange: setSuspendOpen,
				org: selectedOrg,
				onSuccess: fetchDashboard
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactivateAccessModal, {
				open: reactivateOpen,
				onOpenChange: setReactivateOpen,
				org: selectedOrg,
				onSuccess: fetchDashboard
			})
		]
	});
}
//#endregion
export { SuperAdminOverviewPage as component };
