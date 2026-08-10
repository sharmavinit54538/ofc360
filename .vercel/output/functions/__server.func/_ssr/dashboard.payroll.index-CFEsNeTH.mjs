import { cn as useofc360 } from "./ofc360-store-XkEEWRxo.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Banknote, B as ShieldCheck, E as Timer, Fn as CreditCard, I as Sparkles, Ir as ArrowRight, Qn as CircleCheck, U as Settings, Ut as LayoutDashboard, Xn as CirclePlay, Zn as CircleMinus, et as Receipt, fr as ChartColumn, gn as FileText, jn as Download, nn as HandCoins, sn as Gift, ut as Percent } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DLB8_CFF.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as EmployeePayslipsPage } from "./EmployeePayslips-Cg99a724.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.payroll.index-CFEsNeTH.js
var import_jsx_runtime = require_jsx_runtime();
function fmt(n) {
	return new Intl.NumberFormat(void 0, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(n);
}
function PayrollDashboardPage() {
	const ws = useofc360();
	const navigate = useNavigate();
	if ((ws.user?.role)?.toLowerCase() === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeePayslipsPage, {});
	const total = ws.employees.reduce((s, e) => s + 4500 + e.id.length * 137 % 6e3, 0);
	const quickNavCards = [
		{
			title: "AI Payroll Copilot",
			description: "Automated anomaly detection, compliance checks, and intelligent payroll insights.",
			icon: Sparkles,
			path: "/dashboard/payroll/copilot",
			badge: "AI Powered",
			gradient: "from-violet-600/20 to-purple-600/20",
			accentBorder: "border-violet-500/30 hover:border-violet-500/60",
			iconColor: "text-violet-500 bg-violet-500/10",
			buttonColor: "bg-violet-600 hover:bg-violet-700 text-white"
		},
		{
			title: "Salary Processing",
			description: "Run monthly payroll cycles, review calculations, and finalize disbursements.",
			icon: CirclePlay,
			path: "/dashboard/payroll/salary-processing",
			badge: "Execution",
			gradient: "from-blue-600/20 to-indigo-600/20",
			accentBorder: "border-blue-500/30 hover:border-blue-500/60",
			iconColor: "text-blue-500 bg-blue-500/10",
			buttonColor: "bg-blue-600 hover:bg-blue-700 text-white"
		},
		{
			title: "Salary Structure",
			description: "Define base pay, allowances, grade bands, and compensation templates.",
			icon: LayoutDashboard,
			path: "/dashboard/payroll/salary-structure",
			badge: "Structure",
			gradient: "from-emerald-600/20 to-teal-600/20",
			accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
			iconColor: "text-emerald-500 bg-emerald-500/10",
			buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
		},
		{
			title: "Payslips Management",
			description: "Generate, view, and distribute monthly digital payslips to employees.",
			icon: FileText,
			path: "/dashboard/payroll/payslips",
			badge: "Documents",
			gradient: "from-amber-600/20 to-orange-600/20",
			accentBorder: "border-amber-500/30 hover:border-amber-500/60",
			iconColor: "text-amber-500 bg-amber-500/10",
			buttonColor: "bg-amber-600 hover:bg-amber-700 text-white"
		},
		{
			title: "Reimbursements",
			description: "Manage employee expense claims, bill submissions, and reimbursement payouts.",
			icon: Receipt,
			path: "/dashboard/payroll/reimbursements",
			badge: "Expenses",
			gradient: "from-pink-600/20 to-rose-600/20",
			accentBorder: "border-pink-500/30 hover:border-pink-500/60",
			iconColor: "text-pink-500 bg-pink-500/10",
			buttonColor: "bg-pink-600 hover:bg-pink-700 text-white"
		},
		{
			title: "Bonuses & Incentives",
			description: "Configure performance bonuses, commissions, and festival incentives.",
			icon: Gift,
			path: "/dashboard/payroll/bonuses",
			badge: "Rewards",
			gradient: "from-cyan-600/20 to-sky-600/20",
			accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
			iconColor: "text-cyan-500 bg-cyan-500/10",
			buttonColor: "bg-cyan-600 hover:bg-cyan-700 text-white"
		},
		{
			title: "Deductions & Benefits",
			description: "Manage statutory deductions, health insurance premiums, and provident funds.",
			icon: CircleMinus,
			path: "/dashboard/payroll/deductions",
			badge: "Statutory",
			gradient: "from-red-600/20 to-rose-600/20",
			accentBorder: "border-red-500/30 hover:border-red-500/60",
			iconColor: "text-red-500 bg-red-500/10",
			buttonColor: "bg-red-600 hover:bg-red-700 text-white"
		},
		{
			title: "Advances & Loans",
			description: "Track salary advances, company loan disbursemnts, and monthly EMI recoveries.",
			icon: HandCoins,
			path: "/dashboard/payroll/advances",
			badge: "Loans",
			gradient: "from-indigo-600/20 to-blue-600/20",
			accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
			iconColor: "text-indigo-500 bg-indigo-500/10",
			buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white"
		},
		{
			title: "Overtime Payments",
			description: "Process hourly overtime rates, weekend work allowances, and extra logs.",
			icon: Timer,
			path: "/dashboard/payroll/overtime",
			badge: "Overtime",
			gradient: "from-orange-600/20 to-amber-600/20",
			accentBorder: "border-orange-500/30 hover:border-orange-500/60",
			iconColor: "text-orange-500 bg-orange-500/10",
			buttonColor: "bg-orange-600 hover:bg-orange-700 text-white"
		},
		{
			title: "Tax Management",
			description: "Income tax declarations, Form 16 generation, and tax slab compliance.",
			icon: Percent,
			path: "/dashboard/payroll/tax",
			badge: "Taxation",
			gradient: "from-emerald-600/20 to-green-600/20",
			accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
			iconColor: "text-emerald-500 bg-emerald-500/10",
			buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
		},
		{
			title: "Payroll Approvals",
			description: "Multi-tier approval workflows for salary batches and bonus distributions.",
			icon: CircleCheck,
			path: "/dashboard/payroll/approvals",
			badge: "Workflow",
			gradient: "from-teal-600/20 to-emerald-600/20",
			accentBorder: "border-teal-500/30 hover:border-teal-500/60",
			iconColor: "text-teal-500 bg-teal-500/10",
			buttonColor: "bg-teal-600 hover:bg-teal-700 text-white"
		},
		{
			title: "Payroll Reports",
			description: "Comprehensive financial analytics, cost breakdown, and payroll ledgers.",
			icon: ChartColumn,
			path: "/dashboard/payroll/reports",
			badge: "Analytics",
			gradient: "from-purple-600/20 to-indigo-600/20",
			accentBorder: "border-purple-500/30 hover:border-purple-500/60",
			iconColor: "text-purple-500 bg-purple-500/10",
			buttonColor: "bg-purple-600 hover:bg-purple-700 text-white"
		},
		{
			title: "Bank Transfers",
			description: "Generate NACH/direct bank transfer files and payout confirmation logs.",
			icon: Banknote,
			path: "/dashboard/payroll/bank-transfers",
			badge: "Disbursement",
			gradient: "from-blue-600/20 to-cyan-600/20",
			accentBorder: "border-blue-500/30 hover:border-blue-500/60",
			iconColor: "text-blue-500 bg-blue-500/10",
			buttonColor: "bg-blue-600 hover:bg-blue-700 text-white"
		},
		{
			title: "Compliance & Audits",
			description: "Ensure statutory compliance with PF, ESI, LWF, and labor law regulations.",
			icon: ShieldCheck,
			path: "/dashboard/payroll/compliance",
			badge: "Legal",
			gradient: "from-slate-600/20 to-zinc-600/20",
			accentBorder: "border-slate-500/30 hover:border-slate-500/60",
			iconColor: "text-slate-400 bg-slate-500/10",
			buttonColor: "bg-slate-700 hover:bg-slate-800 text-white"
		},
		{
			title: "Payroll Settings",
			description: "Configure pay periods, currency defaults, bank details, and integration rules.",
			icon: Settings,
			path: "/dashboard/payroll/settings",
			badge: "Config",
			gradient: "from-gray-600/20 to-slate-600/20",
			accentBorder: "border-gray-500/30 hover:border-gray-500/60",
			iconColor: "text-gray-400 bg-gray-500/10",
			buttonColor: "bg-gray-700 hover:bg-gray-800 text-white"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Payroll Hub",
				description: "Unified compensation management, processing, statutory compliance, and payouts.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => navigate({ to: "/dashboard/payroll/salary-processing" }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 h-4 w-4" }), "Run Payroll"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Current Cycle",
						value: "Jul 2026",
						subtext: "Scheduled run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Total Payout",
						value: fmt(total),
						subtext: "Gross compensation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Payslips Status",
						value: `${ws.employees.length} / ${ws.employees.length}`,
						subtext: "Ready for distribution"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: "Payroll Modules & Tools"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: quickNavCards.map((card) => {
						const Icon = card.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => navigate({ to: card.path }),
							className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
											children: card.badge
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
										children: card.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted-foreground",
										children: card.description
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative pt-4 mt-4 border-t border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: `w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`,
										onClick: (e) => {
											e.stopPropagation();
											navigate({ to: card.path });
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Module" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
									})
								})
							]
						}, card.title);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "Employee Compensation Overview"
					})
				}), ws.employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-sm text-muted-foreground",
					children: "Add employees to view their compensation breakdown."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Gross"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Net"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ws.employees.map((e) => {
							const gross = 4500 + e.id.length * 137 % 6e3;
							const net = Math.round(gross * .78);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium",
										children: e.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: e.department || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono",
										children: fmt(gross)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono",
										children: fmt(net)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											children: "Ready"
										})
									})
								]
							}, e.id);
						}) })]
					})
				})]
			})
		]
	});
}
function SummaryCard({ label, value, subtext }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-2xl font-semibold tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: subtext
			})
		]
	});
}
//#endregion
export { PayrollDashboardPage as component };
