import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360 } from "./ofc360-store-Dm5opMS0.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as ShieldCheck, Gt as Laptop, Pn as Crown, R as SlidersVertical, Sr as Building2, V as ShieldAlert, _ as UserCog, dr as ChartLine, u as Users } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-B2l-r5gn.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.roles-qrDQLWqn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_ROLES = [
	{
		id: "r1",
		key: "admin",
		title: "HR Admin",
		icon: Crown,
		badge: "Super Admin",
		badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
		description: "Highest level admin with full access to company settings, payroll, employee profiles, and system configurations.",
		membersCount: 3,
		permissions: [
			{
				name: "Full System & Workspace Admin",
				description: "Manage company settings, security, and subscription billing",
				enabled: true
			},
			{
				name: "Run & Approve Payroll",
				description: "Execute monthly salary payouts, tax compliance, and bank transfers",
				enabled: true
			},
			{
				name: "Manage Employee Directory",
				description: "Add, edit, promote, or terminate employee accounts",
				enabled: true
			},
			{
				name: "HR Policies & Global Settings",
				description: "Configure leave policies, attendance rules, and audit logs",
				enabled: true
			}
		]
	},
	{
		id: "r2",
		key: "it_admin",
		title: "IT Admin",
		icon: Laptop,
		badge: "Tech Admin",
		badgeColor: "bg-blue-500/15 text-blue-500 border-blue-500/30",
		description: "Manages hardware assets, laptop allocations, software licensing, system security, and technical helpdesk tickets.",
		membersCount: 5,
		permissions: [
			{
				name: "Asset & Hardware Management",
				description: "Assign, return, transfer, and audit IT equipment",
				enabled: true
			},
			{
				name: "IT Helpdesk Resolution",
				description: "Manage and resolve technical support tickets",
				enabled: true
			},
			{
				name: "System Access & Audit Security",
				description: "Inspect active sessions, API keys, and device logs",
				enabled: true
			},
			{
				name: "Run Payroll Payouts",
				description: "Execute monthly payroll calculations and tax filing",
				enabled: false
			}
		]
	},
	{
		id: "r3",
		key: "executive",
		title: "Executive",
		icon: ChartLine,
		badge: "Leadership",
		badgeColor: "bg-purple-500/15 text-purple-500 border-purple-500/30",
		description: "C-level executive role with organization-wide analytics, financial reports, headcount forecasting, and AI workforce insights.",
		membersCount: 4,
		permissions: [
			{
				name: "Executive AI Analytics & Reports",
				description: "View company-wide turnover, payroll expenses, and AI health scores",
				enabled: true
			},
			{
				name: "Headcount & Hiring Demand Forecast",
				description: "Inspect strategic hiring projections and attrition risk alerts",
				enabled: true
			},
			{
				name: "View Salary & Financial Summaries",
				description: "High-level review of department budgets and variable pay",
				enabled: true
			},
			{
				name: "Edit Employee Data",
				description: "Modify personal records or perform payroll calculations",
				enabled: false
			}
		]
	},
	{
		id: "r4",
		key: "manager",
		title: "Manager",
		icon: UserCog,
		badge: "Team Lead",
		badgeColor: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
		description: "Department managers with oversight over direct reports, leave approvals, timesheet reviews, and performance appraisals.",
		membersCount: 18,
		permissions: [
			{
				name: "Approve Team Leaves & Timesheets",
				description: "Review and approve leave applications and weekly timesheets",
				enabled: true
			},
			{
				name: "Conduct Performance Reviews",
				description: "Evaluate team goals, OKRs, and promotion recommendations",
				enabled: true
			},
			{
				name: "View Team Member Directory",
				description: "Access contact details and skill profiles of direct reports",
				enabled: true
			},
			{
				name: "Company Billing & License Admin",
				description: "Modify workspace subscription plans and invoices",
				enabled: false
			}
		]
	},
	{
		id: "r5",
		key: "employee",
		title: "Employee",
		icon: Users,
		badge: "Standard",
		badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
		description: "Standard workforce member role for self-service attendance check-ins, leave requests, payslip access, and helpdesk queries.",
		membersCount: 142,
		permissions: [
			{
				name: "Attendance & Self Check-in",
				description: "Clock in/out, log work hours, and view shift schedules",
				enabled: true
			},
			{
				name: "Submit Leave & Expense Claims",
				description: "Apply for leaves and upload reimbursement receipts",
				enabled: true
			},
			{
				name: "Download Payslips & Form 16",
				description: "Access personal salary slips and tax documents",
				enabled: true
			},
			{
				name: "View Other Salaries",
				description: "Access compensation details of peers or executives",
				enabled: false
			}
		]
	}
];
function RolesPage() {
	if ((useofc360().user?.role)?.toLowerCase() === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-foreground",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "You do not have permission to view or manage role configurations. Please contact your organization administrator."
			})
		]
	});
	const [roles, setRoles] = (0, import_react.useState)(INITIAL_ROLES);
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(null);
	function togglePermission(roleId, permIdx) {
		setRoles((prev) => prev.map((r) => {
			if (r.id !== roleId) return r;
			const newPerms = [...r.permissions];
			newPerms[permIdx] = {
				...newPerms[permIdx],
				enabled: !newPerms[permIdx].enabled
			};
			return {
				...r,
				permissions: newPerms
			};
		}));
		toast.success("Permissions updated for role");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Roles & Permissions",
				description: "Structured role-based access control (RBAC) across the organization."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4.5 w-4.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Organization Role Hierarchy" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-card px-5 py-2 font-display text-sm font-bold shadow-md",
							children: "Organization Workspace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-0.5 bg-border my-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 font-bold text-amber-500 shadow-glow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👑 HR Admin (Super Administrator)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-0.5 bg-border my-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-4xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 font-semibold text-xs text-blue-400 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4" }), " 💻 IT Admin"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 font-semibold text-xs text-purple-400 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4" }), " 📊 Executive"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 font-semibold text-xs text-indigo-400 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }), " 👨‍💼 Manager"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-semibold text-xs text-emerald-400 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " 👤 Employee"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold tracking-tight text-foreground",
						children: [
							"Configured Roles (",
							roles.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-normal",
						children: "RBAC Enforced"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: roles.map((role) => {
						const Icon = role.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-bold text-foreground",
												children: role.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [role.membersCount, " Users Assigned"]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] font-bold ${role.badgeColor}`,
											children: role.badge
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs leading-relaxed text-muted-foreground",
										children: role.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-2 border-t border-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground block",
											children: "Core Access Capabilities"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: role.permissions.map((perm, pIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: perm.enabled ? "text-foreground font-medium" : "text-muted-foreground line-through",
													children: perm.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													checked: perm.enabled,
													onCheckedChange: () => togglePermission(role.id, pIdx)
												})]
											}, pIdx))
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 mt-4 border-t border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "w-full text-xs h-9 justify-between cursor-pointer",
									onClick: () => setSelectedRole(role),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Role Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-3.5 w-3.5" })]
								})
							})]
						}, role.id);
					})
				})]
			}),
			selectedRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedRole,
				onOpenChange: () => setSelectedRole(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [selectedRole.title, " Configuration"] })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: selectedRole.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-3 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground font-bold block",
										children: "Assigned Member Count"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-indigo-400 font-mono font-bold text-sm",
										children: [selectedRole.membersCount, " Active Accounts"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground font-bold block",
										children: "Granular Permission Rules"
									}), selectedRole.permissions.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border/60 p-2.5 space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: p.enabled ? "default" : "secondary",
												className: "text-[9px]",
												children: p.enabled ? "Granted" : "Denied"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: p.description
										})]
									}, idx))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setSelectedRole(null),
							className: "w-full",
							children: "Close Configuration"
						}) })
					]
				})
			})
		]
	});
}
//#endregion
export { RolesPage as component };
