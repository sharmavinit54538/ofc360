import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { $ as RefreshCw, K as Search, Mt as Lock, p as UserX, v as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as CardContent, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { t as superAdminApi } from "./superAdminApi-Bq4GqCpk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.users-CQNVpl3f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminUsersPage() {
	const [users, setUsers] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [actionLoading, setActionLoading] = (0, import_react.useState)(null);
	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			setUsers(await superAdminApi.getUsers({
				search: search || void 0,
				role: roleFilter !== "all" ? roleFilter : void 0,
				status: statusFilter !== "all" ? statusFilter : void 0
			}));
		} catch (err) {
			console.error("Failed to fetch global users:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchUsers();
	}, [
		search,
		roleFilter,
		statusFilter
	]);
	const handleToggleStatus = async (user) => {
		setActionLoading(user.id);
		try {
			await superAdminApi.updateUserStatus(user.id, {
				is_active: !user.is_active,
				reason: `Super Admin toggle status to ${!user.is_active}`
			});
			await fetchUsers();
		} catch (err) {
			alert(err.response?.data?.detail || "Failed to update user status");
		} finally {
			setActionLoading(null);
		}
	};
	const getRoleBadge = (role) => {
		const r = role.toLowerCase();
		if (r === "super_admin") return "bg-purple-500/20 text-purple-400 border-purple-500/30 font-bold";
		if (r === "company_admin" || r === "admin") return "bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold";
		if (r === "hr_admin" || r === "hr") return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
		if (r === "manager") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
		return "bg-slate-500/20 text-slate-300 border-slate-500/30";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-xs text-indigo-300",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-indigo-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Role Protection Policy:" }), " Super Admin role is immutable and restricted to exactly ONE global account. Tenant users cannot be promoted to SUPER_ADMIN."] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search user name, email, or organization...",
							className: "pl-9 bg-background/50 h-9 text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: roleFilter,
								onValueChange: setRoleFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[140px] h-9 text-xs bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Roles"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "super_admin",
										children: "SUPER_ADMIN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "company_admin",
										children: "COMPANY_ADMIN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "hr_admin",
										children: "HR_ADMIN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "manager",
										children: "MANAGER"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "employee",
										children: "EMPLOYEE"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[130px] h-9 text-xs bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "inactive",
										children: "Inactive"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: fetchUsers,
								variant: "outline",
								size: "sm",
								className: "h-9 px-3 gap-1 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "User Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Email Address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Organization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Last Login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs text-right",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "text-center py-8 text-xs text-muted-foreground",
					children: "Loading global users directory..."
				}) }) : users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "text-center py-8 text-xs text-muted-foreground",
					children: "No users found matching query."
				}) }) : users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "hover:bg-accent/40 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-semibold text-foreground",
							children: u.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: u.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium text-foreground",
							children: u.company_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-[10px] uppercase ${getRoleBadge(u.role)}`,
							children: u.role
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: u.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20",
							children: u.is_active ? "ACTIVE" : "INACTIVE"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: u.role === "super_admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-purple-400 font-bold uppercase tracking-wider",
								children: "Protected Owner"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								disabled: actionLoading === u.id,
								onClick: () => handleToggleStatus(u),
								variant: "ghost",
								size: "sm",
								className: `h-7 px-2 text-xs font-semibold gap-1 ${u.is_active ? "text-rose-400 hover:bg-rose-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`,
								children: [u.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), u.is_active ? "Deactivate" : "Activate"]
							})
						})
					]
				}, u.id)) })] })
			})
		]
	});
}
//#endregion
export { SuperAdminUsersPage as component };
