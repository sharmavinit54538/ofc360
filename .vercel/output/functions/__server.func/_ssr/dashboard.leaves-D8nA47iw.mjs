import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { on as useofc360 } from "./ofc360-store-_w51fT7p.mjs";
import { t as api } from "./client-1j6fcGcU.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $n as CircleCheck, Jn as CircleX, V as ShieldCheck, Wn as Clock, et as RefreshCw, hr as Calendar, nr as CircleAlert, ot as Plus, q as Search, u as Users, v as UserCheck } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.leaves-D8nA47iw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LEAVE_TYPES = [
	"Sick Leave",
	"Casual Leave",
	"Vacation Leave"
];
function LeavesPage() {
	const ws = useofc360();
	const userRole = ws.user?.role || "employee";
	const employeesList = ws.employees || [];
	const [activeTab, setActiveTab] = (0, import_react.useState)("my-leaves");
	const [balances, setBalances] = (0, import_react.useState)([]);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [approvals, setApprovals] = (0, import_react.useState)([]);
	const [adminSearch, setAdminSearch] = (0, import_react.useState)("");
	const [selectedAdminEmp, setSelectedAdminEmp] = (0, import_react.useState)(null);
	const [selectedEmpBalances, setSelectedEmpBalances] = (0, import_react.useState)([]);
	const [empBalancesLoading, setEmpBalancesLoading] = (0, import_react.useState)(false);
	const [applyOpen, setApplyOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [leaveType, setLeaveType] = (0, import_react.useState)(LEAVE_TYPES[0]);
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [rejectOpen, setRejectOpen] = (0, import_react.useState)(false);
	const [targetLeave, setTargetLeave] = (0, import_react.useState)(null);
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const formatDateStr = (dateStr) => {
		return new Date(dateStr).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	};
	const calculatedDays = (0, import_react.useMemo)(() => {
		if (!startDate || !endDate) return 0;
		const s = new Date(startDate);
		const diffTime = new Date(endDate).getTime() - s.getTime();
		if (diffTime < 0) return 0;
		return Math.ceil(diffTime / (1e3 * 60 * 60 * 24)) + 1;
	}, [startDate, endDate]);
	const loadBalances = async () => {
		try {
			const res = await api.get("/leaves/balances");
			if (res?.success && res.data) setBalances(res.data);
		} catch (err) {
			console.error("Error loading leave balances", err);
		}
	};
	const loadHistory = async () => {
		try {
			const res = await api.get("/leaves/history");
			if (res?.success && res.data) setHistory(res.data);
		} catch (err) {
			console.error("Error loading leave history", err);
		}
	};
	const loadPendingApprovals = async () => {
		try {
			const res = await api.get("/leaves/pending");
			if (res?.success && res.data) setApprovals(res.data.map((l) => ({
				id: l.id,
				employee_name: l.employee?.fullName || "Employee",
				department: l.employee?.department || "Staff",
				leave_type: l.leave_type,
				start_date: l.start_date,
				end_date: l.end_date,
				total_days: parseFloat(l.total_days),
				reason: l.reason,
				status: l.status.toLowerCase()
			})));
		} catch (err) {
			console.error("Error loading pending leaves", err);
		}
	};
	const handleViewEmployeeBalances = async (emp) => {
		setSelectedAdminEmp(emp);
		setEmpBalancesLoading(true);
		try {
			const res = await api.get(`/leaves/balances/${emp.id}`);
			if (res?.success && res.data) setSelectedEmpBalances(res.data);
			else setSelectedEmpBalances([]);
		} catch (err) {
			console.error("Error fetching employee balances", err);
			toast.error("Failed to load balances for selected employee.");
			setSelectedEmpBalances([]);
		} finally {
			setEmpBalancesLoading(false);
		}
	};
	const filteredEmployees = (0, import_react.useMemo)(() => {
		if (!adminSearch) return employeesList;
		return employeesList.filter((e) => e.fullName.toLowerCase().includes(adminSearch.toLowerCase()) || e.employeeId.toLowerCase().includes(adminSearch.toLowerCase()) || (e.department || "").toLowerCase().includes(adminSearch.toLowerCase()));
	}, [employeesList, adminSearch]);
	(0, import_react.useEffect)(() => {
		if (activeTab === "my-leaves") {
			loadBalances();
			loadHistory();
		} else if (activeTab === "approvals") loadPendingApprovals();
	}, [activeTab]);
	(0, import_react.useEffect)(() => {
		loadBalances();
		loadHistory();
		if (userRole === "admin" || userRole === "manager") loadPendingApprovals();
	}, [userRole]);
	const handleApplySubmit = async (e) => {
		e.preventDefault();
		if (calculatedDays <= 0) {
			toast.error("Invalid dates selected. Start date must be before or equal to End date.");
			return;
		}
		if (!reason.trim() || reason.length < 5) {
			toast.error("Please provide a valid reason (min 5 characters).");
			return;
		}
		setLoading(true);
		try {
			const payload = {
				leave_type: leaveType,
				start_date: startDate,
				end_date: endDate,
				total_days: calculatedDays,
				reason
			};
			if ((await api.post("/leaves/apply", payload))?.success) {
				toast.success("Leave request submitted successfully!");
				setApplyOpen(false);
				setStartDate("");
				setEndDate("");
				setReason("");
				loadBalances();
				loadHistory();
			}
		} catch (err) {
			toast.error(err.message || "Failed to apply leave. Ensure you have enough remaining balance.");
		} finally {
			setLoading(false);
		}
	};
	const handleApprove = async (id) => {
		try {
			if ((await api.post(`/leaves/${id}/review`, { status: "APPROVED" }))?.success) {
				toast.success("Leave request approved.");
				loadPendingApprovals();
			}
		} catch (err) {
			toast.error(err.message || "Failed to approve leave request.");
		}
	};
	const handleRejectConfirm = async () => {
		if (!rejectionReason.trim()) {
			toast.error("Please provide a reason for rejection.");
			return;
		}
		try {
			const id = targetLeave?.id;
			if ((await api.post(`/leaves/${id}/review`, {
				status: "REJECTED",
				rejection_reason: rejectionReason
			}))?.success) {
				toast.info("Leave request sent back.");
				setRejectionReason("");
				setRejectOpen(false);
				setTargetLeave(null);
				loadPendingApprovals();
			}
		} catch (err) {
			toast.error(err.message || "Failed to reject leave request.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: userRole === "admin" ? "Enterprise Leave Dashboard" : userRole === "manager" ? "Team Leaves & Approvals" : "My Leave Applications",
			description: userRole === "admin" ? "Track organizational leaves, adjust balances, and approve time-off requests company-wide." : userRole === "manager" ? "Approve your team's leaves and manage your own time-off records." : "Submit leave requests, view active balances, and track approvals history.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setApplyOpen(true),
					className: "gap-2 bg-indigo-600 hover:bg-indigo-500 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Apply for Leave"]
				})
			})
		}),
		userRole !== "employee" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex border-b border-border bg-muted/20 p-1 rounded-xl max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("my-leaves"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "my-leaves" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: "My Leaves"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("approvals"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "approvals" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: ["Review Requests", approvals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "ml-2 bg-amber-500/20 text-amber-500 border border-amber-500/30",
						children: approvals.length
					})]
				}),
				userRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("employee-balances"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "employee-balances" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: "All Balances"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
			mode: "wait",
			children: [
				activeTab === "my-leaves" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [balances.map((b) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: `border bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-md ${b.leave_type.includes("Sick") ? "from-amber-500/10 to-orange-500/5 text-orange-500 border-orange-500/20" : b.leave_type.includes("Casual") ? "from-sky-500/10 to-blue-500/5 text-sky-500 border-sky-500/20" : "from-emerald-500/10 to-teal-500/5 text-emerald-500 border-emerald-500/20"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
										children: b.leave_type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-3xl font-display font-bold text-foreground mt-1 tabular-nums",
										children: [
											b.remaining_days,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-normal text-muted-foreground",
												children: "days left"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Used: ",
										b.used_days,
										" / Total: ",
										b.total_days,
										" days"
									]
								}) })]
							}, b.leave_type);
						}), balances.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-3 text-center py-4 text-xs text-muted-foreground",
							children: "Initializing leave policies balances..."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground uppercase tracking-wider",
							children: "Leave Applications History"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border border-border bg-card/50 backdrop-blur-md overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
							className: "bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "pl-6 py-4",
									children: "Leave Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Dates Range"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-center py-4",
									children: "Days Claimed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Reason"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "pr-6 py-4" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [history.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "border-b border-border/80 hover:bg-muted/5 transition-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pl-6 py-4 font-semibold text-foreground",
									children: rec.leave_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "py-4 text-muted-foreground",
									children: [
										formatDateStr(rec.start_date),
										" – ",
										formatDateStr(rec.end_date)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-center py-4 font-semibold tabular-nums text-foreground",
									children: [rec.total_days, " d"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-4 text-muted-foreground max-w-[200px] truncate",
									children: rec.reason
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: rec.status === "approved" ? "secondary" : rec.status === "rejected" ? "destructive" : "outline",
										className: `text-xs capitalize ${rec.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""}`,
										children: rec.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pr-6 py-4 text-right",
									children: rec.status === "rejected" && rec.rejection_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-rose-500 flex items-center gap-1.5 justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
											" Reason: ",
											rec.rejection_reason
										]
									})
								})
							]
						}, rec.id)), history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "text-center py-10 text-muted-foreground",
							children: "No leave applications logged yet."
						}) })] })] })
					})] })]
				}, "my-leaves"),
				activeTab === "approvals" && (userRole === "admin" || userRole === "manager") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Review Team Time-Off Requests"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Approve leave filings or request revisions with feedback comments."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-amber-500/20 text-amber-500 border border-amber-500/30",
							children: [approvals.length, " Pending"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [approvals.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border border-border bg-card/60 backdrop-blur-md overflow-hidden hover:shadow-md transition-shadow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-semibold",
												children: req.employee_name?.charAt(0)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [req.employee_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] uppercase font-normal",
													children: req.department
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground font-semibold text-indigo-400 mt-1 flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
													" ",
													req.leave_type,
													" (",
													req.total_days,
													" days)"
												]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground block",
											children: "Requested Dates Range"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-semibold text-foreground",
											children: [
												formatDateStr(req.start_date),
												" to ",
												formatDateStr(req.end_date)
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "max-w-xs md:max-w-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground block",
												children: "Reason for absence"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-foreground mt-0.5 leading-relaxed truncate",
												children: req.reason
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400",
												onClick: () => handleApprove(req.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Approve"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400",
												onClick: () => {
													setTargetLeave(req);
													setRejectOpen(true);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), " Reject"]
											})]
										})
									]
								})
							})
						}, req.id)), approvals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "All caught up!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "There are no pending leave requests for your review."
								})
							]
						})]
					})]
				}, "approvals"),
				activeTab === "employee-balances" && userRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Organizational Leave Allocations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Select any employee to view their detailed leave balances from database."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-[260px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search employees...",
								value: adminSearch,
								onChange: (e) => setAdminSearch(e.target.value),
								className: "pl-9 bg-background/50 border border-border"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border border-border bg-card/50 backdrop-blur-md md:col-span-2 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
								className: "bg-muted/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "pl-6 py-4",
										children: "Employee ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-4",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-4",
										children: "Department"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-4",
										children: "Designation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "pr-6 py-4 text-center" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredEmployees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: `border-b border-border/80 hover:bg-muted/5 transition-all cursor-pointer ${selectedAdminEmp?.id === emp.id ? "bg-indigo-500/5 hover:bg-indigo-500/5 border-l-2 border-l-indigo-500" : ""}`,
								onClick: () => handleViewEmployeeBalances(emp),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "pl-6 py-4 font-mono text-xs",
										children: emp.employeeId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "py-4 font-semibold text-foreground",
										children: emp.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "py-4 text-muted-foreground text-xs",
										children: emp.department || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "py-4 text-muted-foreground text-xs",
										children: emp.designation || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "pr-6 py-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-8 text-indigo-400",
											children: "View Balances"
										})
									})
								]
							}, emp.id)), filteredEmployees.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 5,
								className: "text-center py-8 text-muted-foreground",
								children: "No employees match search."
							}) })] })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border border-border bg-card/40 backdrop-blur-xl h-fit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-indigo-500" }), "Detailed Balances"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: selectedAdminEmp ? `Viewing logs for ${selectedAdminEmp.fullName}` : "Select an employee from the table" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "space-y-4",
								children: selectedAdminEmp ? empBalancesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center py-10 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Fetching records..."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [selectedEmpBalances.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border/80 bg-background/50 rounded-lg p-3 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: b.leave_type
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												className: "font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
												children: [b.remaining_days, " remaining"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground flex justify-between pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Total: ",
												b.total_days,
												" days"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Used: ",
												b.used_days,
												" days"
											] })]
										})]
									}, b.leave_type)), selectedEmpBalances.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground text-center py-4",
										children: "No balances registered for this user."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center py-12 text-center text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-8 w-8 mb-2 stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Select an employee profile to query database balances."
									})]
								})
							})]
						})]
					})]
				}, "employee-balances")
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: applyOpen,
			onOpenChange: setApplyOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-xl font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-indigo-500" }), "Apply for Leave"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Fill in your leave details and submit to your manager for approval."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleApplySubmit,
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Leave Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: leaveType,
								onValueChange: setLeaveType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "bg-background/50 border border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select type" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAVE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: t
								}, t)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "start-date",
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "Start Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "start-date",
									type: "date",
									required: true,
									value: startDate,
									onChange: (e) => setStartDate(e.target.value),
									className: "bg-background/50 border border-border"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "end-date",
									className: "text-xs font-semibold text-muted-foreground uppercase",
									children: "End Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "end-date",
									type: "date",
									required: true,
									value: endDate,
									onChange: (e) => setEndDate(e.target.value),
									className: "bg-background/50 border border-border"
								})]
							})]
						}),
						calculatedDays > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Total Days Claimed:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-indigo-500",
								children: [
									calculatedDays,
									" ",
									calculatedDays === 1 ? "day" : "days"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reason-input",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Reason for absence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "reason-input",
								required: true,
								value: reason,
								onChange: (e) => setReason(e.target.value),
								placeholder: "Describe why you need time off (min 5 characters)...",
								className: "w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setApplyOpen(false),
								className: "text-muted-foreground hover:text-foreground",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading || calculatedDays <= 0,
								className: "bg-indigo-600 hover:bg-indigo-500 text-white",
								children: loading ? "Submitting..." : "Submit Application"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: rejectOpen,
			onOpenChange: setRejectOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-rose-500" }), "Reason for Rejection"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs",
						children: "Provide feedback on why this leave application is being rejected."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "reject-textarea",
							className: "sr-only",
							children: "Rejection Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "reject-textarea",
							value: rejectionReason,
							placeholder: "e.g. Project deliverable schedules are tight during these dates...",
							className: "w-full min-h-[100px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none",
							onChange: (e) => setRejectionReason(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								setRejectOpen(false);
								setTargetLeave(null);
								setRejectionReason("");
							},
							className: "text-muted-foreground hover:text-foreground",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-rose-600 hover:bg-rose-500 text-white",
							onClick: handleRejectConfirm,
							children: "Confirm Rejection"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { LeavesPage as component };
