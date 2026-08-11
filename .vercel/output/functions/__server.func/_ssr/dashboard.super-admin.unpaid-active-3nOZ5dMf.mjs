import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as Sparkles, Tn as Eye } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { t as superAdminApi } from "./superAdminApi-DqdsLjRi.mjs";
import { o as SuspendAccessModal, r as ExtendAccessModal } from "./AdminActionModals-Biv8hN9V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.unpaid-active-3nOZ5dMf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UnpaidActivePage() {
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [selectedOrg, setSelectedOrg] = (0, import_react.useState)(null);
	const [grantOpen, setGrantOpen] = (0, import_react.useState)(false);
	const [extendOpen, setExtendOpen] = (0, import_react.useState)(false);
	const [suspendOpen, setSuspendOpen] = (0, import_react.useState)(false);
	const fetchUnpaidActive = async () => {
		setIsLoading(true);
		try {
			setCustomers(await superAdminApi.getUnpaidActive());
		} catch (err) {
			console.error("Failed to fetch unpaid active customers:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchUnpaidActive();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-indigo-400 animate-pulse" }), "\"Who is Using Without Payment?\" — Complimentary & Trial Directory"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
					className: "text-xs text-muted-foreground",
					children: "Complete list of active customer organizations currently operating with complimentary, promotional, trial, or unpaid access grants."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0 border-t border-border",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-xs text-muted-foreground",
						children: "Loading directory..."
					}) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-xs text-muted-foreground italic",
						children: "No unpaid active customers found. All active tenants are fully paid."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
							className: "bg-muted/10 border-b border-border uppercase text-[10px]",
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
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "px-4 py-3",
									children: "Granted By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "px-4 py-3",
									children: "Granted Date"
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "border-t border-border hover:bg-accent/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/dashboard/super-admin/organizations/${c.id}`,
										className: "font-bold text-foreground hover:text-indigo-400",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[10px] text-muted-foreground",
										children: c.owner_email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-indigo-500/30 text-indigo-400 text-[10px]",
										children: c.plan
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-indigo-500/10 text-indigo-400 font-semibold text-[10px] border-none",
										children: c.access_status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-amber-500/10 text-amber-500 font-semibold text-[10px] border-none",
										children: c.payment_status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-muted-foreground",
									children: c.granted_by
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-muted-foreground",
									children: c.granted_at ? c.granted_at.split("T")[0] : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 font-semibold text-foreground",
									children: c.expires_at ? c.expires_at.split("T")[0] : "Lifetime"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-muted-foreground max-w-[200px] truncate",
									title: c.reason,
									children: c.reason
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: `/dashboard/super-admin/organizations/${c.id}`,
											className: "rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent",
											title: "View Detail",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setSelectedOrg({
													id: c.id,
													name: c.name,
													owner: {
														name: c.owner_name,
														email: c.owner_email
													},
													user_count: 0,
													employee_count: 0,
													plan: c.plan,
													access_status: c.access_status,
													access_type: c.access_type,
													payment_status: c.payment_status,
													access_source: "SUPER_ADMIN",
													access_granted_by: c.granted_by,
													access_expires_at: c.expires_at,
													access_grant_reason: c.reason,
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
						}, c.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtendAccessModal, {
				open: extendOpen,
				onOpenChange: setExtendOpen,
				org: selectedOrg,
				onSuccess: fetchUnpaidActive
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspendAccessModal, {
				open: suspendOpen,
				onOpenChange: setSuspendOpen,
				org: selectedOrg,
				onSuccess: fetchUnpaidActive
			})
		]
	});
}
//#endregion
export { UnpaidActivePage as component };
