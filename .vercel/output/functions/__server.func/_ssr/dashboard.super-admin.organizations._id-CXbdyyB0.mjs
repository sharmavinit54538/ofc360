import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, B as ShieldCheck, Hn as Clock, I as Sparkles, Rr as ArrowLeft, V as ShieldAlert, jr as Ban, n as Zap, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { _ as Link, b as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { t as superAdminApi } from "./superAdminApi-Bq4GqCpk.mjs";
import { a as ReactivateAccessModal, i as GrantAccessModal, n as ChangePlanModal, o as SuspendAccessModal, r as ExtendAccessModal, t as CancelAccessModal } from "./AdminActionModals-Dy4gndwW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.organizations._id-CXbdyyB0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrganizationDetailPage() {
	const { id } = useParams({ from: "/dashboard/super-admin/organizations/$id" });
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [grantOpen, setGrantOpen] = (0, import_react.useState)(false);
	const [extendOpen, setExtendOpen] = (0, import_react.useState)(false);
	const [suspendOpen, setSuspendOpen] = (0, import_react.useState)(false);
	const [cancelOpen, setCancelOpen] = (0, import_react.useState)(false);
	const [reactivateOpen, setReactivateOpen] = (0, import_react.useState)(false);
	const [changePlanOpen, setChangePlanOpen] = (0, import_react.useState)(false);
	const fetchDetail = async () => {
		setIsLoading(true);
		setError(null);
		try {
			setDetail(await superAdminApi.getOrganizationDetail(id));
		} catch (err) {
			console.error("Failed to load organization detail:", err);
			setError(err.response?.data?.detail || err.message || "Failed to load detail");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (id) fetchDetail();
	}, [id]);
	const handleRemoveComplimentary = async () => {
		if (!detail) return;
		const reason = prompt("Enter reason for removing complimentary access:");
		if (!reason || !reason.trim()) return;
		try {
			await superAdminApi.removeComplimentary(detail.id, { reason });
			toast.success("Removed complimentary access.");
			fetchDetail();
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Failed to remove complimentary status");
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-2xl bg-card/40 border border-border animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 rounded-2xl bg-card/40 border border-border animate-pulse" })]
	});
	if (error || !detail) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-rose-500/20 bg-rose-500/5 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mx-auto h-8 w-8 text-rose-500 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-foreground",
				children: "Organization Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard/super-admin/organizations",
				className: "mt-4 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-8 text-xs",
					children: "Back to Organizations"
				})
			})
		]
	});
	const { subscription, owner, stats } = detail;
	const isComplimentary = subscription.access_status === "ACTIVE_COMPLIMENTARY";
	const isSuspended = subscription.access_status === "SUSPENDED";
	const orgSummary = {
		id: detail.id,
		name: detail.name,
		owner: {
			name: owner.name,
			email: owner.email
		},
		user_count: stats.user_count,
		employee_count: stats.employee_count,
		plan: subscription.plan,
		access_status: subscription.access_status,
		access_type: subscription.access_type,
		payment_status: subscription.payment_status,
		access_source: subscription.access_source,
		access_granted_by: subscription.access_granted_by,
		access_expires_at: subscription.access_expires_at,
		access_grant_reason: subscription.access_grant_reason,
		mrr: subscription.mrr,
		created_at: detail.created_at
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/super-admin/organizations",
					className: "text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to Organizations"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400",
						children: detail.name.substring(0, 2).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-xl font-bold text-foreground flex items-center gap-2",
						children: [detail.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-indigo-500/30 text-indigo-400 text-xs",
							children: subscription.plan
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Owner: ",
							owner.name,
							" • ",
							owner.email,
							" • Created: ",
							detail.created_at ? detail.created_at.split("T")[0] : "—"
						]
					})] })]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setGrantOpen(true),
							className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Grant Access"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setExtendOpen(true),
							variant: "outline",
							className: "h-9 text-xs border-border gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-blue-500" }), " Extend Access"]
						}),
						isSuspended ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setReactivateOpen(true),
							className: "h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Reactivate"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setSuspendOpen(true),
							variant: "outline",
							className: "h-9 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), " Suspend"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "access",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/40 border border-border p-1 overflow-x-auto scrollbar-none flex gap-1 h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								className: "text-xs py-1.5 px-3",
								children: "Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "access",
								className: "text-xs py-1.5 px-3 font-bold text-indigo-400",
								children: "Access Control"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "users",
								className: "text-xs py-1.5 px-3",
								children: [
									"Users (",
									stats.user_count,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "employees",
								className: "text-xs py-1.5 px-3",
								children: [
									"Employees (",
									stats.employee_count,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "subscription",
								className: "text-xs py-1.5 px-3",
								children: "Subscription"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "payments",
								className: "text-xs py-1.5 px-3",
								children: [
									"Payments (",
									detail.payments.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "invoices",
								className: "text-xs py-1.5 px-3",
								children: "Invoices"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "usage",
								className: "text-xs py-1.5 px-3",
								children: "Usage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "activity",
								className: "text-xs py-1.5 px-3",
								children: "Activity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "audit",
								className: "text-xs py-1.5 px-3",
								children: [
									"Audit Logs (",
									detail.audit_logs.length,
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "overview",
						className: "space-y-4 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "pb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-xs text-muted-foreground uppercase",
											children: "Organization Profile"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Name:" }),
												" ",
												detail.name
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Owner:" }),
												" ",
												owner.name
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Email:" }),
												" ",
												owner.email
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Phone:" }),
												" ",
												owner.phone || "N/A"
											] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "pb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-xs text-muted-foreground uppercase",
											children: "Subscription & Billing"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Plan:" }),
												" ",
												subscription.plan
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Access Status:" }),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: subscription.access_status })
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payment Status:" }),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													children: subscription.payment_status
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Total Spent:" }),
												" ₹",
												stats.total_spent.toLocaleString()
											] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "pb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-xs text-muted-foreground uppercase",
											children: "Usage Metrics"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Total Users:" }),
												" ",
												stats.user_count
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Total Employees:" }),
												" ",
												stats.employee_count
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Access Source:" }),
												" ",
												subscription.access_source
											] })
										]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "access",
						className: "space-y-6 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-base font-bold text-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-indigo-400" }), "Manual Access Control Center"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs text-muted-foreground",
								children: "View and override access parameters directly in the backend database."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-border bg-card/60 p-4 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Current Access"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "mt-1 bg-indigo-500/20 text-indigo-300 font-bold border-none text-xs",
												children: subscription.access_status
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Access Source"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 font-semibold text-foreground block",
												children: subscription.access_source
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Current Plan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 font-semibold text-indigo-400 block",
												children: subscription.plan
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Payment Required"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 font-semibold text-foreground block",
												children: subscription.payment_status === "PAID" ? "NO" : "NO (Complimentary Override)"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Granted By"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 text-foreground block",
												children: subscription.access_granted_by || "Super Admin"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Start / Granted Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 text-foreground block",
												children: subscription.access_granted_at ? subscription.access_granted_at.split("T")[0] : "—"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Expiration Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 font-bold text-foreground block",
												children: subscription.access_expires_at ? subscription.access_expires_at.split("T")[0] : "Lifetime (Never)"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[10px] uppercase font-bold block",
												children: "Payment Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "mt-1 border-amber-500/30 text-amber-400",
												children: subscription.payment_status
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/60 p-4 space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Grant Reason:" }),
												" ",
												subscription.access_grant_reason || "None specified"
											] }),
											subscription.internal_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Internal Note:" }),
												" ",
												subscription.internal_note
											] }),
											subscription.suspension_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-rose-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Suspension Reason:" }),
													" ",
													subscription.suspension_reason
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3",
											children: "Super Admin Management Actions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setGrantOpen(true),
													className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " [Grant Access]"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setExtendOpen(true),
													variant: "outline",
													className: "h-9 text-xs border-border gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-blue-400" }), " [Extend Access]"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setChangePlanOpen(true),
													variant: "outline",
													className: "h-9 text-xs border-border gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-amber-400" }), " [Change Plan]"]
												}),
												isSuspended ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setReactivateOpen(true),
													className: "h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " [Reactivate Access]"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setSuspendOpen(true),
													variant: "outline",
													className: "h-9 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), " [Suspend Access]"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => setCancelOpen(true),
													variant: "outline",
													className: "h-9 text-xs border-rose-800/40 text-rose-300 hover:bg-rose-900/20 gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }), " [Cancel Access]"]
												}),
												isComplimentary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: handleRemoveComplimentary,
													variant: "outline",
													className: "h-9 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-1.5 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " [Remove Complimentary Access]"]
												})
											]
										})]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "users",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
										className: "bg-muted/10 border-b border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Role"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Last Login"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: detail.users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 font-semibold text-foreground",
												children: u.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-muted-foreground",
												children: u.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 uppercase font-semibold text-indigo-400",
												children: u.role
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: u.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
													children: u.is_active ? "Active" : "Disabled"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-muted-foreground",
												children: u.last_login_at ? u.last_login_at.split("T")[0] : "Never"
											})
										]
									}, u.id)) })]
								})
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "employees",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border bg-card/40 p-6 text-xs text-muted-foreground",
							children: [
								"Total active employees in this tenant database: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stats.employee_count }),
								"."
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "subscription",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border bg-card/40 p-6 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Plan Name:" }),
									" ",
									subscription.plan
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Monthly Price (MRR):" }),
									" ₹",
									subscription.mrr
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Access Source:" }),
									" ",
									subscription.access_source
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Expiry:" }),
									" ",
									subscription.access_expires_at || "Lifetime"
								] })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "payments",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0",
								children: detail.payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 text-center text-xs text-muted-foreground italic",
									children: "No payment records found for this organization."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
										className: "bg-muted/10 border-b border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Invoice #"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Amount"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Gateway"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Date"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: detail.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 font-mono font-semibold",
												children: p.invoice_number
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "px-4 py-3 font-semibold text-emerald-400",
												children: ["₹", p.amount]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3",
												children: p.gateway
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400",
													children: p.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-muted-foreground",
												children: p.payment_date.split("T")[0]
											})
										]
									}, p.id)) })]
								})
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "invoices",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40 p-6 text-xs text-muted-foreground",
							children: "Invoices automatically generated for paid subscription orders."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "usage",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40 p-6 text-xs text-muted-foreground",
							children: "Tenant storage, API quota, and active session metrics."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "activity",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40 p-6 text-xs text-muted-foreground",
							children: "Real-time user logins and system event activity stream."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "audit",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border bg-card/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0",
								children: detail.audit_logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 text-center text-xs text-muted-foreground italic",
									children: "No audit logs recorded yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
										className: "bg-muted/10 border-b border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Action"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Performed By"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Details"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3",
												children: "Timestamp"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: detail.audit_logs.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "border-indigo-500/30 text-indigo-400 font-bold text-[10px]",
													children: a.action
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-foreground",
												children: a.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-muted-foreground max-w-[350px]",
												children: a.details
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-muted-foreground",
												children: a.created_at.replace("T", " ").substring(0, 19)
											})
										]
									}, a.id)) })]
								})
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrantAccessModal, {
				open: grantOpen,
				onOpenChange: setGrantOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendAccessModal, {
				open: extendOpen,
				onOpenChange: setExtendOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspendAccessModal, {
				open: suspendOpen,
				onOpenChange: setSuspendOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelAccessModal, {
				open: cancelOpen,
				onOpenChange: setCancelOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactivateAccessModal, {
				open: reactivateOpen,
				onOpenChange: setReactivateOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePlanModal, {
				open: changePlanOpen,
				onOpenChange: setChangePlanOpen,
				org: orgSummary,
				onSuccess: fetchDetail
			})
		]
	});
}
//#endregion
export { OrganizationDetailPage as component };
