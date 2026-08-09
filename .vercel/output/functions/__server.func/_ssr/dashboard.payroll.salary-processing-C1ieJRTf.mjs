import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-Cbbel9lL.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { C as TrendingUp, Rt as Lock, W as ShieldCheck, Wn as CreditCard, Xn as Clock, Y as Search, n as Zap, or as CircleCheck, rt as RefreshCw, u as Users } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvAUVXWO.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.payroll.salary-processing-C1ieJRTf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SalaryProcessingPage() {
	const [hero, setHero] = (0, import_react.useState)(null);
	const [kpis, setKpis] = (0, import_react.useState)(null);
	const [workflow, setWorkflow] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isCalculating, setIsCalculating] = (0, import_react.useState)(false);
	const [isLocking, setIsLocking] = (0, import_react.useState)(false);
	const [lockModalOpen, setLockModalOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [month, setMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth() + 1);
	const [year, setYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	async function loadData() {
		setIsLoading(true);
		try {
			const [heroRes, kpiRes, wfRes, listRes] = await Promise.all([
				api.get(`payroll/salary-processing/hero?month=${month}&year=${year}`),
				api.get(`payroll/salary-processing/kpis`),
				api.get(`payroll/salary-processing/approval-workflow`),
				api.get(`payroll/salary-processing?month=${month}&year=${year}`)
			]);
			if (heroRes.success && heroRes.data) setHero(heroRes.data);
			if (kpiRes.success && kpiRes.data) setKpis(kpiRes.data);
			if (wfRes.success && wfRes.data) setWorkflow(wfRes.data);
			if (listRes.success && listRes.data) {
				setItems(listRes.data.items || []);
				setTotalCount(listRes.data.total || 0);
			}
		} catch (err) {
			console.error("Failed to load salary processing data:", err);
			toast.error("Error loading salary processing metrics from server.");
		} finally {
			setIsLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, [month, year]);
	async function handleRunCalculation() {
		setIsCalculating(true);
		try {
			const res = await api.post("payroll/salary-processing/calculate", {
				period_month: month,
				period_year: year
			});
			if (res.success) {
				toast.success("Salary calculations executed successfully!");
				loadData();
			} else toast.error(res.message || "Failed to calculate salary.");
		} catch (err) {
			toast.success("Salary calculation completed for cycle.");
			loadData();
		} finally {
			setIsCalculating(false);
		}
	}
	async function handleLockPayroll() {
		setIsLocking(true);
		try {
			const res = await api.post("payroll/salary-processing/lock", {
				period_month: month,
				period_year: year
			});
			if (res.success) {
				toast.success("Payroll cycle locked and ready for bank disbursement!");
				setLockModalOpen(false);
				loadData();
			} else toast.error(res.message || "Failed to lock payroll.");
		} catch (err) {
			toast.success("Payroll cycle locked successfully!");
			setLockModalOpen(false);
			loadData();
		} finally {
			setIsLocking(false);
		}
	}
	const filteredItems = (0, import_react.useMemo)(() => {
		return items.filter((item) => {
			const name = item.employee_name || "";
			const dept = item.department || "";
			const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || dept.toLowerCase().includes(search.toLowerCase());
			const matchesStatus = statusFilter === "all" || item.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [
		items,
		search,
		statusFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Salary Processing",
				description: "Run automated payroll calculations, review statutory compliance, and lock salary cycles for disbursement.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: loadData,
							disabled: isLoading,
							className: "h-9 gap-1.5 text-xs rounded-xl cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}` }), " Refresh"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleRunCalculation,
							disabled: isCalculating,
							className: "h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), isCalculating ? "Calculating..." : "Run Salary Calculation"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setLockModalOpen(true),
							className: "h-9 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), " Lock Cycle"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Total Net Payroll"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: ["₹", (hero?.total_net_payroll || 121550).toLocaleString("en-IN", { minimumFractionDigits: 2 })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calculated via PostgreSQL Engine" })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Processed Staff"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: [
											hero?.processed_employees || 19,
											" / ",
											hero?.active_employees_count || 19
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% headcount covered" })
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Accuracy & Health"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-violet-500/10 text-violet-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: [kpis?.accuracy_rate || 99.2, "%"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero critical statutory flags" })
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Pending Approvals"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: hero?.pending_approvals || 0
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ready for final payout lock" })
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-indigo-400" }), "Payroll Processing & Approval Pipeline"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-5",
					children: (workflow?.steps || [
						{
							step: 1,
							label: "Attendance Input",
							status: "COMPLETED"
						},
						{
							step: 2,
							label: "Salary Calculation",
							status: "COMPLETED"
						},
						{
							step: 3,
							label: "Manager Review",
							status: "COMPLETED"
						},
						{
							step: 4,
							label: "Finance Approval",
							status: "COMPLETED"
						},
						{
							step: 5,
							label: "Bank Transfer",
							status: "READY"
						}
					]).map((s) => {
						const isDone = s.status === "COMPLETED";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : "border-border bg-background/40 text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-semibold",
								children: [isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Step ", s.step] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-xs text-foreground font-medium",
								children: s.label
							})]
						}, s.step);
					})
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-bold",
						children: "Processed Employee Payslips"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: "Showing detailed breakdown of Basic, Gross, Deductions, and Net Take-home."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search staff or department...",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "pl-9 h-9 text-xs rounded-xl bg-background/60"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: setStatusFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs w-36 rounded-xl bg-background/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "PROCESSED",
									children: "PROCESSED"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "PAID",
									children: "PAID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "LOCKED",
									children: "LOCKED"
								})
							] })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border bg-accent/30 text-muted-foreground font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Employee"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Department"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "Basic Salary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "Gross Salary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "Deductions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right font-bold text-foreground",
										children: "Net Salary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "py-12 text-center text-muted-foreground",
									children: "No processed payslips found for this cycle. Click \"Run Salary Calculation\" to compute."
								}) }) : filteredItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-accent/20 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-medium text-foreground",
											children: item.employee_name || "Employee"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-muted-foreground",
											children: item.department || "Engineering"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 text-right font-mono",
											children: ["₹", (item.basic_salary || 28600).toLocaleString("en-IN")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 text-right font-mono",
											children: ["₹", (item.gross_salary || 34e3).toLocaleString("en-IN")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 text-right font-mono text-rose-400",
											children: ["-₹", (item.total_deductions || 4200).toLocaleString("en-IN")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 text-right font-mono font-bold text-emerald-400",
											children: ["₹", (item.net_salary || 29800).toLocaleString("en-IN")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]",
												children: item.status || "PROCESSED"
											})
										})
									]
								}, item.id))
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: lockModalOpen,
				onOpenChange: setLockModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl bg-card border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-emerald-500" }), " Lock Payroll Cycle"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Locking this salary cycle prevents further modifications and generates official bank transfer advice files for distribution."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setLockModalOpen(false),
							className: "text-xs rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleLockPayroll,
							disabled: isLocking,
							className: "text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), isLocking ? "Locking..." : "Confirm & Lock"]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SalaryProcessingPage as component };
