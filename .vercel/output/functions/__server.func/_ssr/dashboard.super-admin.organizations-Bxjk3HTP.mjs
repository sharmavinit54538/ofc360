import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Dt as ofc360 } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { I as Sparkles, K as Search, Tn as Eye, xr as Building2 } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as CardContent, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { t as superAdminApi } from "./superAdminApi-BvPFpOrt.mjs";
import { a as ReactivateAccessModal, i as GrantAccessModal, n as ChangePlanModal, o as SuspendAccessModal, r as ExtendAccessModal, t as CancelAccessModal } from "./AdminActionModals-BA3L7WW5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.organizations-Bxjk3HTP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrganizationsControlPage() {
	const [organizations, setOrganizations] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [accessFilter, setAccessFilter] = (0, import_react.useState)("all");
	const [paymentFilter, setPaymentFilter] = (0, import_react.useState)("all");
	const [planFilter, setPlanFilter] = (0, import_react.useState)("all");
	const [selectedOrg, setSelectedOrg] = (0, import_react.useState)(null);
	const [grantOpen, setGrantOpen] = (0, import_react.useState)(false);
	const [extendOpen, setExtendOpen] = (0, import_react.useState)(false);
	const [suspendOpen, setSuspendOpen] = (0, import_react.useState)(false);
	const [cancelOpen, setCancelOpen] = (0, import_react.useState)(false);
	const [reactivateOpen, setReactivateOpen] = (0, import_react.useState)(false);
	const [changePlanOpen, setChangePlanOpen] = (0, import_react.useState)(false);
	const fetchOrganizations = async () => {
		setIsLoading(true);
		try {
			setOrganizations(await superAdminApi.getOrganizations({
				search: search || void 0,
				access_status: accessFilter !== "all" ? accessFilter : void 0,
				payment_status: paymentFilter !== "all" ? paymentFilter : void 0,
				plan: planFilter !== "all" ? planFilter : void 0
			}));
		} catch (err) {
			console.error("Failed to fetch organizations:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchOrganizations();
	}, [
		search,
		accessFilter,
		paymentFilter,
		planFilter
	]);
	const getAccessBadgeClass = (status) => {
		const s = status.toUpperCase();
		if (s.includes("PAID")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
		if (s.includes("COMPLIMENTARY")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
		if (s.includes("FREE")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
		if (s.includes("TRIAL")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
		if (s.includes("SUSPENDED")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
		if (s.includes("CANCELLED")) return "bg-rose-900/20 text-rose-300 border-rose-800/30";
		if (s.includes("EXPIRED")) return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
		return "bg-muted text-muted-foreground";
	};
	const getPaymentBadgeClass = (status) => {
		const s = status.toUpperCase();
		if (s === "PAID") return "bg-emerald-500/10 text-emerald-400 border-none font-semibold";
		if (s === "UNPAID") return "bg-amber-500/10 text-amber-500 border-none font-semibold";
		if (s === "FAILED") return "bg-rose-500/10 text-rose-500 border-none font-semibold";
		return "bg-muted text-muted-foreground border-none";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search by organization, owner name, email...",
							className: "pl-9 h-9 bg-background/50 border-border text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: accessFilter,
								onValueChange: setAccessFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[150px] bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Access Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Access States"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ACTIVE_COMPLIMENTARY",
										children: "Complimentary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ACTIVE_PAID",
										children: "Paid Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "TRIAL",
										children: "Trial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ACTIVE_FREE",
										children: "Free"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "SUSPENDED",
										children: "Suspended"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "CANCELLED",
										children: "Cancelled"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "EXPIRED",
										children: "Expired"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: paymentFilter,
								onValueChange: setPaymentFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[140px] bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Payment Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Payments"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "PAID",
										children: "Paid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "UNPAID",
										children: "Unpaid"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "FAILED",
										children: "Failed"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: planFilter,
								onValueChange: setPlanFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[130px] bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Plan" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Plans"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Basic",
										children: "Basic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Professional",
										children: "Professional"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Enterprise",
										children: "Enterprise"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custom",
										children: "Custom"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									setSelectedOrg(organizations[0] || null);
									setGrantOpen(true);
								},
								className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Grant Access"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-16 text-center text-xs text-muted-foreground",
						children: "Loading organizations from backend database..."
					}) : organizations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-16 text-center text-xs text-muted-foreground",
						children: "No organizations found matching search criteria."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							className: "min-w-[1000px] border-collapse text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
								className: "bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Organization & Owner"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-center",
										children: "Users / Emps"
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
										children: "Payment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Expiry"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-right",
										children: "MRR"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: organizations.map((org) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "border-t border-border hover:bg-accent/20 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: `/dashboard/super-admin/organizations/${org.id}`,
											className: "font-bold text-foreground hover:text-indigo-400 transition-colors flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-indigo-400" }), org.name]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[11px] font-normal text-muted-foreground mt-0.5",
											children: [
												org.owner?.name,
												" • ",
												org.owner?.email
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "px-4 py-3 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: org.user_count
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [" / ", org.employee_count]
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
											className: `${getAccessBadgeClass(org.access_status)} text-[10px] font-semibold uppercase`,
											children: org.access_status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${getPaymentBadgeClass(org.payment_status)} text-[10px]`,
											children: org.payment_status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: org.access_expires_at ? org.access_expires_at.split("T")[0] : "Lifetime"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "px-4 py-3 text-right font-mono font-semibold text-foreground",
										children: ["₹", org.mrr.toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: async () => {
														try {
															await superAdminApi.enterTenantMode(org.id);
															ofc360.set({ tenantModeCompany: {
																id: org.id,
																name: org.name
															} });
															window.location.href = "/dashboard";
														} catch (err) {
															alert("Failed to enter tenant mode: " + (err.message || "Error"));
														}
													},
													className: "rounded px-2 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[10px] font-bold cursor-pointer flex items-center gap-1",
													title: "Open Organization in Tenant Management Mode",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " Open Org"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: `/dashboard/super-admin/organizations/${org.id}`,
													className: "rounded px-2 py-1 bg-accent/60 hover:bg-accent text-[10px] font-semibold text-foreground cursor-pointer",
													title: "View Full Detail",
													children: "Detail"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setSelectedOrg(org);
														setGrantOpen(true);
													},
													className: "rounded px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-semibold cursor-pointer",
													title: "Grant Access",
													children: "Grant"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setSelectedOrg(org);
														setExtendOpen(true);
													},
													className: "rounded px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-semibold cursor-pointer",
													title: "Extend Access",
													children: "Extend"
												}),
												org.access_status === "SUSPENDED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setSelectedOrg(org);
														setReactivateOpen(true);
													},
													className: "rounded px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-semibold cursor-pointer",
													title: "Reactivate",
													children: "Reactivate"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setSelectedOrg(org);
														setSuspendOpen(true);
													},
													className: "rounded px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-semibold cursor-pointer",
													title: "Suspend",
													children: "Suspend"
												})
											]
										})
									})
								]
							}, org.id)) })]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrantAccessModal, {
				open: grantOpen,
				onOpenChange: setGrantOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendAccessModal, {
				open: extendOpen,
				onOpenChange: setExtendOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspendAccessModal, {
				open: suspendOpen,
				onOpenChange: setSuspendOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelAccessModal, {
				open: cancelOpen,
				onOpenChange: setCancelOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactivateAccessModal, {
				open: reactivateOpen,
				onOpenChange: setReactivateOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePlanModal, {
				open: changePlanOpen,
				onOpenChange: setChangePlanOpen,
				org: selectedOrg,
				onSuccess: fetchOrganizations
			})
		]
	});
}
//#endregion
export { OrganizationsControlPage as component };
