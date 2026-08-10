import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Ut as uid, cn as useofc360 } from "./ofc360-store-Dm5opMS0.mjs";
import { t as api } from "./client-DZR8fCuj.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { $ as RefreshCw, B as ShieldCheck, G as Send, Hn as Clock, I as Sparkles, Kn as CircleX, Qn as CircleCheck, T as Trash2, X as Save, at as Plus, gn as FileText, ir as ChevronLeft, lr as ChartNoAxesColumn, mr as Calendar, rr as ChevronRight, tr as CircleAlert, v as UserCheck } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-B2l-r5gn.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.timesheets-BTyDMaAz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AVAILABLE_PROJECTS = [
	{
		id: "proj_ofc360_core",
		name: "ofc360 AI Core Engine"
	},
	{
		id: "proj_recruitment",
		name: "Enterprise Recruitment Bot"
	},
	{
		id: "proj_compensation",
		name: "Compensation Analytics"
	},
	{
		id: "proj_internal",
		name: "Internal Admin Operations"
	},
	{
		id: "proj_client_x",
		name: "Acme Corp Web Portal"
	}
];
function TimesheetsPage() {
	const userRole = useofc360().user?.role || "employee";
	const [activeTab, setActiveTab] = (0, import_react.useState)("my-timesheet");
	const [weekOffset, setWeekOffset] = (0, import_react.useState)(0);
	const [rows, setRows] = (0, import_react.useState)([{
		id: "row_1",
		projectId: "proj_ofc360_core",
		hours: [
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		description: ""
	}]);
	const [timesheetStatus, setTimesheetStatus] = (0, import_react.useState)("draft");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [aiAutofillOpen, setAiAutofillOpen] = (0, import_react.useState)(false);
	const [aiLoading, setAiLoading] = (0, import_react.useState)(false);
	const [aiLogSource, setAiLogSource] = (0, import_react.useState)("all");
	const [approvals, setApprovals] = (0, import_react.useState)([]);
	const [historyRecords, setHistoryRecords] = (0, import_react.useState)([]);
	const [selectedApproval, setSelectedApproval] = (0, import_react.useState)(null);
	const [rejectReasonOpen, setRejectReasonOpen] = (0, import_react.useState)(false);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const getLocalDateString = (d) => {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	};
	const startOfWeekDate = (0, import_react.useMemo)(() => {
		const today = /* @__PURE__ */ new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1) + weekOffset * 7;
		const start = new Date(today);
		start.setDate(diff);
		start.setHours(0, 0, 0, 0);
		return start;
	}, [weekOffset]);
	const formatDateRange = (startOfWeek) => {
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		const format = (d) => d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
		return `${format(startOfWeek)} – ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`;
	};
	const weekRangeLabel = (0, import_react.useMemo)(() => {
		return formatDateRange(startOfWeekDate);
	}, [startOfWeekDate]);
	const dateHeaders = (0, import_react.useMemo)(() => {
		return Array.from({ length: 7 }).map((_, i) => {
			const d = new Date(startOfWeekDate);
			d.setDate(startOfWeekDate.getDate() + i);
			return {
				dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
				dateStr: d.getDate().toString().padStart(2, "0")
			};
		});
	}, [startOfWeekDate]);
	const totalHours = (0, import_react.useMemo)(() => {
		return rows.reduce((sum, r) => sum + r.hours.reduce((a, b) => a + b, 0), 0);
	}, [rows]);
	const billableHours = (0, import_react.useMemo)(() => {
		return rows.filter((r) => r.projectId !== "proj_internal").reduce((sum, r) => sum + r.hours.reduce((a, b) => a + b, 0), 0);
	}, [rows]);
	const utilizationRate = (0, import_react.useMemo)(() => {
		if (totalHours === 0) return 0;
		return Math.round(billableHours / totalHours * 100);
	}, [totalHours, billableHours]);
	const dailyTotals = (0, import_react.useMemo)(() => {
		const totals = [
			0,
			0,
			0,
			0,
			0,
			0,
			0
		];
		rows.forEach((r) => {
			r.hours.forEach((h, idx) => {
				totals[idx] += h;
			});
		});
		return totals;
	}, [rows]);
	const isDailyOverlogged = (0, import_react.useMemo)(() => {
		return dailyTotals.some((t) => t > 24);
	}, [dailyTotals]);
	const loadTimesheet = async () => {
		setLoading(true);
		try {
			const formattedDate = getLocalDateString(startOfWeekDate);
			const res = await api.get(`/timesheets/weekly?week_start_date=${formattedDate}`);
			if (res?.success && res.data) {
				setTimesheetStatus(res.data.status.toLowerCase());
				if (res.data.entries && res.data.entries.length > 0) setRows(res.data.entries.map((e) => ({
					id: e.id,
					projectId: e.project_id,
					hours: [
						parseFloat(e.monday_hours) || 0,
						parseFloat(e.tuesday_hours) || 0,
						parseFloat(e.wednesday_hours) || 0,
						parseFloat(e.thursday_hours) || 0,
						parseFloat(e.friday_hours) || 0,
						parseFloat(e.saturday_hours) || 0,
						parseFloat(e.sunday_hours) || 0
					],
					description: e.description || ""
				})));
				else setRows([{
					id: uid("row"),
					projectId: AVAILABLE_PROJECTS[0].id,
					hours: [
						0,
						0,
						0,
						0,
						0,
						0,
						0
					],
					description: ""
				}]);
			}
		} catch (err) {
			console.error("Error loading timesheet", err);
			toast.error(err.message || "Failed to load timesheet from server.");
		} finally {
			setLoading(false);
		}
	};
	const loadHistory = async () => {
		try {
			const res = await api.get("/timesheets/history");
			if (res?.success && res.data) setHistoryRecords(res.data.map((t) => ({
				id: t.id,
				weekRange: formatDateRange(new Date(t.week_start_date)),
				totalHours: t.entries.reduce((sum, e) => sum + (parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) + parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) + parseFloat(e.sunday_hours)), 0),
				status: t.status.toLowerCase(),
				submittedOn: t.submitted_at ? new Date(t.submitted_at).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric"
				}) : "—",
				approvedBy: t.approved_by_id ? "Manager" : "—",
				rejectionReason: t.rejection_reason
			})));
		} catch (err) {
			console.error("Error loading timesheet history", err);
		}
	};
	const loadPendingApprovals = async () => {
		try {
			const res = await api.get("/timesheets/pending");
			if (res?.success && res.data) setApprovals(res.data.map((t) => ({
				id: t.id,
				employeeName: t.employee?.fullName || "Employee",
				department: t.employee?.department || "Operations",
				weekRange: formatDateRange(new Date(t.week_start_date)),
				totalHours: t.entries.reduce((sum, e) => sum + (parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) + parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) + parseFloat(e.sunday_hours)), 0),
				status: t.status.toLowerCase(),
				details: t.entries.map((e) => ({
					project: AVAILABLE_PROJECTS.find((p) => p.id === e.project_id)?.name || e.project_id,
					hours: parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) + parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) + parseFloat(e.sunday_hours),
					desc: e.description
				}))
			})));
		} catch (err) {
			console.error("Error loading pending approvals", err);
		}
	};
	(0, import_react.useEffect)(() => {
		loadTimesheet();
		loadHistory();
		if (userRole === "admin" || userRole === "manager" || activeTab === "approvals") loadPendingApprovals();
	}, [weekOffset, activeTab]);
	const handleHoursChange = (rowId, dayIdx, val) => {
		const numVal = parseFloat(val) || 0;
		if (numVal < 0 || numVal > 24) {
			toast.error("Hours per day must be between 0 and 24");
			return;
		}
		setRows((prev) => prev.map((r) => {
			if (r.id === rowId) {
				const newHours = [...r.hours];
				newHours[dayIdx] = numVal;
				return {
					...r,
					hours: newHours
				};
			}
			return r;
		}));
	};
	const handleDescChange = (rowId, val) => {
		setRows((prev) => prev.map((r) => {
			if (r.id === rowId) return {
				...r,
				description: val
			};
			return r;
		}));
	};
	const handleProjectChange = (rowId, projectId) => {
		setRows((prev) => prev.map((r) => {
			if (r.id === rowId) return {
				...r,
				projectId
			};
			return r;
		}));
	};
	const addRow = () => {
		setRows((prev) => [...prev, {
			id: uid("row"),
			projectId: AVAILABLE_PROJECTS[0].id,
			hours: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			description: ""
		}]);
	};
	const deleteRow = (rowId) => {
		if (rows.length === 1) {
			toast.warning("You must log time to at least one project");
			return;
		}
		setRows((prev) => prev.filter((r) => r.id !== rowId));
	};
	const handleSaveDraft = async () => {
		try {
			const formattedDate = getLocalDateString(startOfWeekDate);
			const entries = rows.map((r) => ({
				project_id: r.projectId,
				monday_hours: r.hours[0],
				tuesday_hours: r.hours[1],
				wednesday_hours: r.hours[2],
				thursday_hours: r.hours[3],
				friday_hours: r.hours[4],
				saturday_hours: r.hours[5],
				sunday_hours: r.hours[6],
				description: r.description
			}));
			if ((await api.post(`/timesheets/weekly?week_start_date=${formattedDate}`, entries))?.success) {
				setTimesheetStatus("draft");
				toast.success("Timesheet saved as draft");
				loadHistory();
			}
		} catch (err) {
			toast.error(err.message || "Failed to save timesheet draft");
		}
	};
	const handleSubmitTimesheet = async () => {
		if (isDailyOverlogged) {
			toast.error("Cannot submit: Daily logged hours cannot exceed 24 hours.");
			return;
		}
		if (totalHours === 0) {
			toast.error("Cannot submit an empty timesheet.");
			return;
		}
		try {
			const formattedDate = getLocalDateString(startOfWeekDate);
			const entries = rows.map((r) => ({
				project_id: r.projectId,
				monday_hours: r.hours[0],
				tuesday_hours: r.hours[1],
				wednesday_hours: r.hours[2],
				thursday_hours: r.hours[3],
				friday_hours: r.hours[4],
				saturday_hours: r.hours[5],
				sunday_hours: r.hours[6],
				description: r.description
			}));
			await api.post(`/timesheets/weekly?week_start_date=${formattedDate}`, entries);
			if ((await api.post(`/timesheets/weekly/submit?week_start_date=${formattedDate}`))?.success) {
				setTimesheetStatus("pending");
				toast.success("Timesheet successfully submitted for approval!");
				loadHistory();
			}
		} catch (err) {
			toast.error(err.message || "Failed to submit timesheet");
		}
	};
	const triggerAiAutofill = () => {
		setAiLoading(true);
		setTimeout(async () => {
			const autofilledRows = [
				{
					id: uid("row"),
					projectId: "proj_ofc360_core",
					hours: [
						7.5,
						8,
						7,
						8.5,
						6,
						0,
						0
					],
					description: "Implemented security tokens parser, fixed hydration mismatches in checkin and live clock panels"
				},
				{
					id: uid("row"),
					projectId: "proj_recruitment",
					hours: [
						0,
						.5,
						1.5,
						0,
						2,
						0,
						0
					],
					description: "Candidate CRM profile reviews and interview feedback panel updates"
				},
				{
					id: uid("row"),
					projectId: "proj_internal",
					hours: [
						1,
						.5,
						1,
						.5,
						.5,
						0,
						0
					],
					description: "Daily Standup sync, Jira review & platform retrospectives"
				}
			];
			setRows(autofilledRows);
			setAiLoading(false);
			setAiAutofillOpen(false);
			setTimesheetStatus("draft");
			try {
				const formattedDate = getLocalDateString(startOfWeekDate);
				const entries = autofilledRows.map((r) => ({
					project_id: r.projectId,
					monday_hours: r.hours[0],
					tuesday_hours: r.hours[1],
					wednesday_hours: r.hours[2],
					thursday_hours: r.hours[3],
					friday_hours: r.hours[4],
					saturday_hours: r.hours[5],
					sunday_hours: r.hours[6],
					description: r.description
				}));
				await api.post(`/timesheets/weekly?week_start_date=${formattedDate}`, entries);
				toast.success("AI pre-filled timesheet and saved it to backend draft!");
				loadHistory();
			} catch (err) {
				toast.warning("AI generated entries locally but failed to auto-save to database draft.");
			}
		}, 1800);
	};
	const handleApproveTimesheet = async (id) => {
		try {
			if ((await api.post(`/timesheets/${id}/review`, { status: "APPROVED" }))?.success) {
				toast.success("Timesheet approved successfully.");
				loadPendingApprovals();
				setSelectedApproval(null);
			}
		} catch (err) {
			toast.error(err.message || "Failed to approve timesheet");
		}
	};
	const handleRejectTimesheet = async () => {
		if (!rejectReason.trim()) {
			toast.error("Please provide a reason for rejection.");
			return;
		}
		try {
			const id = selectedApproval?.id;
			if ((await api.post(`/timesheets/${id}/review`, {
				status: "REJECTED",
				rejection_reason: rejectReason
			}))?.success) {
				toast.info("Timesheet sent back for revision.");
				setRejectReason("");
				setRejectReasonOpen(false);
				loadPendingApprovals();
				setSelectedApproval(null);
			}
		} catch (err) {
			toast.error(err.message || "Failed to reject timesheet");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Timesheets",
			description: "Log your daily work hours, categorize by projects, and track approval processes.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [userRole !== "admin" && userRole !== "manager" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "gap-2 border-dashed border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400",
					onClick: () => {
						toast.info("Switched view to simulated Manager context.");
						setActiveTab(activeTab === "approvals" ? "my-timesheet" : "approvals");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin-slow" }), activeTab === "approvals" ? "Show Employee Grid" : "Simulate Manager Approvals"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAiAutofillOpen(true),
					disabled: timesheetStatus === "pending" || timesheetStatus === "approved",
					className: "gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-lg shadow-pink-500/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-pink-200 animate-pulse" }), "AI Copilot Autofill"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex border-b border-border bg-muted/20 p-1 rounded-xl max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("my-timesheet"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "my-timesheet" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: "My Timesheet"
				}),
				(userRole === "admin" || userRole === "manager" || activeTab === "approvals") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("approvals"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "approvals" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: ["Team Approvals", approvals.filter((a) => a.status === "pending").length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "ml-2 bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20",
						children: approvals.filter((a) => a.status === "pending").length
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("history"),
					className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === "history" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
					children: "History Logs"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
			mode: "wait",
			children: [
				activeTab === "my-timesheet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-3 top-3 rounded-xl bg-indigo-500/10 p-2 text-indigo-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
											children: "Total Hours"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-3xl font-display font-bold text-foreground tabular-nums",
											children: [totalHours, " hrs"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Logged this week"
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-3 top-3 rounded-xl bg-emerald-500/10 p-2 text-emerald-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
											children: "Billable Hours"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-3xl font-display font-bold text-foreground tabular-nums",
											children: [billableHours, " hrs"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Assigned to client projects"
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-3 top-3 rounded-xl bg-violet-500/10 p-2 text-violet-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
											children: "Utilization Rate"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-3xl font-display font-bold text-foreground tabular-nums",
											children: [utilizationRate, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 h-2 w-full rounded-full bg-muted overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full",
											style: { width: `${utilizationRate}%` }
										})
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute right-3 top-3 rounded-xl bg-amber-500/10 p-2 text-amber-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-2xl font-display font-bold text-foreground mt-1 capitalize",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: timesheetStatus === "approved" ? "secondary" : timesheetStatus === "rejected" ? "destructive" : timesheetStatus === "pending" ? "outline" : "default",
												className: `text-xs px-2 py-0.5 ${timesheetStatus === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""}`,
												children: timesheetStatus === "pending" ? "Pending Approval" : timesheetStatus
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											timesheetStatus === "draft" && "Ready to save or submit",
											timesheetStatus === "pending" && "Sent to Rohan Varma",
											timesheetStatus === "approved" && "Processed for Payroll integration",
											timesheetStatus === "rejected" && "Requires changes"
										]
									}) })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border border-border bg-card/50 backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border/80 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-lg font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-indigo-500" }), "Weekly Hours Allocation"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Select project and add log details for each day." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-muted-foreground hover:text-foreground",
											onClick: () => setWeekOffset((prev) => prev - 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold px-2 min-w-[170px] text-center",
											children: weekRangeLabel
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-muted-foreground hover:text-foreground",
											disabled: weekOffset === 0,
											onClick: () => setWeekOffset((prev) => prev + 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0 overflow-x-auto",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center py-20 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Syncing timesheet with database..."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
									className: "min-w-[800px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
										className: "bg-muted/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "w-[240px] pl-6 py-4",
												children: "Project"
											}),
											dateHeaders.map((dh, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
												className: "text-center w-[75px] py-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground font-medium",
													children: dh.dayName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-semibold text-foreground mt-0.5",
													children: dh.dateStr
												})]
											}, i)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "text-center w-[85px] py-4",
												children: "Total"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "pl-4 py-4",
												children: "Description / Deliverables"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-[60px] pr-6 text-center py-4" })
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((row) => {
										const rowTotal = row.hours.reduce((a, b) => a + b, 0);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "border-b border-border/80 hover:bg-muted/5 transition-all",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "pl-6 py-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: row.projectId,
														onValueChange: (val) => handleProjectChange(row.id, val),
														disabled: timesheetStatus === "pending" || timesheetStatus === "approved",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "w-full bg-background/50 border border-border",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select project" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: AVAILABLE_PROJECTS.map((proj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: proj.id,
															children: proj.name
														}, proj.id)) })]
													})
												}),
												row.hours.map((hoursVal, dayIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "p-2 py-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														step: "0.5",
														min: "0",
														max: "24",
														className: "h-9 w-[64px] mx-auto text-center tabular-nums bg-background/50 border border-border focus:ring-1 focus:ring-indigo-500",
														value: hoursVal === 0 ? "" : hoursVal,
														placeholder: "0",
														onChange: (e) => handleHoursChange(row.id, dayIdx, e.target.value),
														disabled: timesheetStatus === "pending" || timesheetStatus === "approved"
													})
												}, dayIdx)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
													className: "text-center font-bold tabular-nums text-foreground py-4",
													children: [rowTotal, "h"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "pl-4 py-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: row.description,
														placeholder: "Describe your work this week...",
														className: "w-full bg-background/50 border border-border",
														onChange: (e) => handleDescChange(row.id, e.target.value),
														disabled: timesheetStatus === "pending" || timesheetStatus === "approved"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "pr-6 text-center py-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "h-8 w-8 text-muted-foreground hover:text-rose-500 transition-colors",
														onClick: () => deleteRow(row.id),
														disabled: timesheetStatus === "pending" || timesheetStatus === "approved",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})
												})
											]
										}, row.id);
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "bg-muted/10 font-semibold border-b border-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "pl-6 py-4 text-foreground font-bold",
												children: "Daily Totals"
											}),
											dailyTotals.map((tot, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-center py-4 tabular-nums",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: tot > 24 ? "text-rose-500 font-bold" : "text-foreground",
													children: [tot, "h"]
												})
											}, idx)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "text-center font-bold tabular-nums text-indigo-500 py-4",
												children: [totalHours, "h"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "pl-4 py-4 text-xs text-muted-foreground font-normal",
												children: isDailyOverlogged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-rose-500 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), " Limit exceeded (Max 24h/day)"]
												}) : "Standard working hours check passed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { className: "pr-6 py-4" })
										]
									})] })]
								})
							}),
							timesheetStatus !== "pending" && timesheetStatus !== "approved" && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-muted/5 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "w-full sm:w-auto gap-2 border-border hover:bg-muted",
									onClick: addRow,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Row"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										className: "flex-1 sm:flex-initial gap-2 text-muted-foreground hover:text-foreground",
										onClick: handleSaveDraft,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Draft"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "flex-1 sm:flex-initial gap-2 bg-indigo-600 hover:bg-indigo-500 text-white",
										onClick: handleSubmitTimesheet,
										disabled: isDailyOverlogged || totalHours === 0,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Submit for Approval"]
									})]
								})]
							})
						]
					})]
				}, "my-timesheet"),
				activeTab === "approvals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
							children: "Team Timesheets Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Approve or request revisions for employee timesheet filings."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-amber-500/20 text-amber-500 border border-amber-500/30",
							children: [approvals.filter((a) => a.status === "pending").length, " Pending"]
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
												className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold",
												children: req.employeeName.charAt(0)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [req.employeeName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] uppercase font-normal",
													children: req.department
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground flex items-center gap-1.5 mt-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
													" Week: ",
													req.weekRange
												]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left md:text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-semibold text-foreground tabular-nums",
													children: [req.totalHours, " hrs"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: "Total hours logged"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-left md:text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-semibold capitalize",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: req.status === "approved" ? "secondary" : req.status === "rejected" ? "destructive" : "outline",
														className: req.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : "",
														children: req.status
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground mt-1",
													children: "Status"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 md:self-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-1 text-muted-foreground hover:text-foreground",
												onClick: () => setSelectedApproval(req),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " View Details"]
											}), req.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400",
												onClick: () => handleApproveTimesheet(req.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Approve"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400",
												onClick: () => {
													setSelectedApproval(req);
													setRejectReasonOpen(true);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), " Reject"]
											})] })]
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
									children: "There are no pending timesheets for your approval right now."
								})
							]
						})]
					})]
				}, "approvals"),
				activeTab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-foreground",
						children: "Submission Log Archive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Historical records of your timesheets submissions and payroll transitions."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border border-border bg-card/50 backdrop-blur-md overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
							className: "bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "pl-6 py-4",
									children: "Week Range"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Submitted Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-center py-4",
									children: "Hours Logged"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Approved By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "py-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "pr-6 py-4" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [historyRecords.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "border-b border-border/80 hover:bg-muted/5 transition-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pl-6 py-4 font-semibold text-foreground",
									children: rec.weekRange
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-4 text-muted-foreground",
									children: rec.submittedOn
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-center py-4 font-semibold tabular-nums text-foreground",
									children: [rec.totalHours, " hrs"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-4 text-muted-foreground",
									children: rec.approvedBy || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: rec.status === "approved" ? "secondary" : rec.status === "rejected" ? "destructive" : "outline",
										className: `text-xs ${rec.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""}`,
										children: rec.status === "pending" ? "Pending Approval" : rec.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pr-6 py-4 text-right",
									children: rec.status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-rose-500 flex items-center gap-1.5 justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
											" Reason: ",
											rec.rejectionReason
										]
									})
								})
							]
						}, rec.id)), historyRecords.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "text-center py-8 text-muted-foreground",
							children: "No historical records found."
						}) })] })] })
					})]
				}, "history")
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: aiAutofillOpen,
			onOpenChange: setAiAutofillOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-xl font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-pink-500 animate-pulse" }), "AI Copilot Timesheet Autofill"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: "ofc360 AI can analyze your git repository commits, local workspace project updates, and calendar events to automatically write descriptions and estimate daily hours."
					})] }),
					aiLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-12 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "absolute h-5 w-5 text-pink-500 animate-ping" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Analyzing developer footprint..."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Reading local standups & commits logs"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "source",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Autofill Data Source"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: aiLogSource,
								onValueChange: setAiLogSource,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "bg-background/50 border border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Data Sources" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "GitHub, Standups, and Jira Task Logs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "commits",
										children: "Only Git Repository Commits"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "calendar",
										children: "Only Calendar & Slack Standups"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-pink-500/5 border border-pink-500/10 p-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-pink-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacy Note:" }), " Log analyses are processed locally on your client machine and never saved to training pipelines."]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setAiAutofillOpen(false),
							disabled: aiLoading,
							className: "text-muted-foreground hover:text-foreground",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: triggerAiAutofill,
							disabled: aiLoading,
							className: "bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white",
							children: "Generate Timesheet"
						})]
					})
				]
			})
		}),
		selectedApproval && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!selectedApproval,
			onOpenChange: (open) => !open && setSelectedApproval(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg border border-border bg-card/95 backdrop-blur-2xl text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-lg font-bold",
						children: ["Timesheet Details: ", selectedApproval.employeeName]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Review details for week of ",
						selectedApproval.weekRange,
						"."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-sm bg-muted/20 p-3 rounded-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground block",
								children: "Employee Department"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: selectedApproval.department
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground block",
								children: "Total Hours Claimed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-indigo-500",
								children: [selectedApproval.totalHours, " hrs"]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Project Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 max-h-[220px] overflow-y-auto pr-1",
								children: selectedApproval.details.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-border/80 bg-background/50 rounded-lg p-3 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: d.project
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "font-mono text-[10px] tabular-nums",
											children: [d.hours, "h"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed mt-1",
										children: d.desc || "No description provided."
									})]
								}, i))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setSelectedApproval(null),
							className: "text-muted-foreground hover:text-foreground",
							children: "Close"
						}), selectedApproval.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400",
							onClick: () => setRejectReasonOpen(true),
							children: "Reject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-emerald-600 hover:bg-emerald-500 text-white",
							onClick: () => handleApproveTimesheet(selectedApproval.id),
							children: "Approve Timesheet"
						})] })]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: rejectReasonOpen,
			onOpenChange: setRejectReasonOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-base font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-rose-500" }), "Reason for Rejection"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs",
						children: "Provide feedback to the employee on why this timesheet is being sent back for revision."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "reason-textarea",
							className: "sr-only",
							children: "Rejection Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "reason-textarea",
							value: rejectReason,
							placeholder: "e.g. Please clarify project hours allocation for Acme Corp Web Portal...",
							className: "w-full min-h-[100px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none",
							onChange: (e) => setRejectReason(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setRejectReasonOpen(false),
							className: "text-muted-foreground hover:text-foreground",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "bg-rose-600 hover:bg-rose-500 text-white",
							onClick: handleRejectTimesheet,
							children: "Confirm Rejection"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { TimesheetsPage as component };
