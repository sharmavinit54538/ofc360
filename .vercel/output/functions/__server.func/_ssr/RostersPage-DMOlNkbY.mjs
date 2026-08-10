import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as RefreshCw, F as SquarePen, Hn as Clock, I as Sparkles, K as Search, Ln as Copy, Ot as MapPin, Pt as List, Qn as CircleCheckBig, T as Trash2, Wt as Layers, Zn as CircleCheck, at as Plus, f as User, jn as Download, nr as ChevronRight, pr as Calendar, r as X, rr as ChevronLeft, x as TriangleAlert, xr as Building2, y as Upload } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RostersPage-DMOlNkbY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_EMPLOYEES = [];
var INITIAL_ROSTERS = [];
var SHIFT_TYPES = [
	"Morning",
	"Evening",
	"Night",
	"Off Day",
	"Leave",
	"Holiday",
	"Training",
	"WFH",
	"Overtime"
];
function RostersPage() {
	const [rosters, setRosters] = (0, import_react.useState)(INITIAL_ROSTERS);
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const [calendarView, setCalendarView] = (0, import_react.useState)("Week");
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const [shiftFilter, setShiftFilter] = (0, import_react.useState)("all");
	const [locationFilter, setLocationFilter] = (0, import_react.useState)("all");
	const [managerFilter, setManagerFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [autoSaveStatus, setAutoSaveStatus] = (0, import_react.useState)("All changes auto-saved");
	const [selectedEntry, setSelectedEntry] = (0, import_react.useState)(null);
	const [isAssignModalOpen, setIsAssignModalOpen] = (0, import_react.useState)(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const [formEmployeeId, setFormEmployeeId] = (0, import_react.useState)("AUR-1042");
	const [formShift, setFormShift] = (0, import_react.useState)("Morning");
	const [formDate, setFormDate] = (0, import_react.useState)("2026-06-25");
	const [formStartTime, setFormStartTime] = (0, import_react.useState)("08:00");
	const [formEndTime, setFormEndTime] = (0, import_react.useState)("16:00");
	const [formBreak, setFormBreak] = (0, import_react.useState)("45 mins");
	const [formLocation, setFormLocation] = (0, import_react.useState)("San Francisco HQ");
	const [formStatus, setFormStatus] = (0, import_react.useState)("Approved");
	const [formRecurring, setFormRecurring] = (0, import_react.useState)(false);
	const [createRosterName, setCreateRosterName] = (0, import_react.useState)("");
	const [createRosterDept, setCreateRosterDept] = (0, import_react.useState)("Engineering");
	const [createRosterStart, setCreateRosterStart] = (0, import_react.useState)("2026-06-22");
	const [createRosterEnd, setCreateRosterEnd] = (0, import_react.useState)("2026-06-28");
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = (0, import_react.useState)(false);
	const [entryToDelete, setEntryToDelete] = (0, import_react.useState)(null);
	const [draggingEntryId, setDraggingEntryId] = (0, import_react.useState)(null);
	const currentWeekDays = [
		{
			dayName: "Mon",
			dateStr: "2026-06-22",
			label: "22 Jun"
		},
		{
			dayName: "Tue",
			dateStr: "2026-06-23",
			label: "23 Jun"
		},
		{
			dayName: "Wed",
			dateStr: "2026-06-24",
			label: "24 Jun"
		},
		{
			dayName: "Thu",
			dateStr: "2026-06-25",
			label: "25 Jun"
		},
		{
			dayName: "Fri",
			dateStr: "2026-06-26",
			label: "26 Jun"
		},
		{
			dayName: "Sat",
			dateStr: "2026-06-27",
			label: "27 Jun"
		},
		{
			dayName: "Sun",
			dateStr: "2026-06-28",
			label: "28 Jun"
		}
	];
	const triggerAutoSave = () => {
		setAutoSaveStatus("Saving changes...");
		setTimeout(() => {
			setAutoSaveStatus("Saved a few seconds ago");
		}, 800);
	};
	const handleResetFilters = () => {
		setSearch("");
		setDeptFilter("all");
		setShiftFilter("all");
		setLocationFilter("all");
		setManagerFilter("all");
		setStatusFilter("all");
		toast.success("Filters reset successfully");
	};
	const filteredRosters = (0, import_react.useMemo)(() => {
		return rosters.filter((r) => {
			if (search && !`${r.employeeName} ${r.department} ${r.shift}`.toLowerCase().includes(search.toLowerCase())) return false;
			if (deptFilter !== "all" && r.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
			if (shiftFilter !== "all" && r.shift.toLowerCase() !== shiftFilter.toLowerCase()) return false;
			if (locationFilter !== "all" && r.location.toLowerCase() !== locationFilter.toLowerCase()) return false;
			if (managerFilter !== "all" && r.manager.toLowerCase() !== managerFilter.toLowerCase()) return false;
			if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
			return true;
		});
	}, [
		rosters,
		search,
		deptFilter,
		shiftFilter,
		locationFilter,
		managerFilter,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		const assignedCount = new Set(filteredRosters.map((r) => r.employeeId)).size;
		const openShifts = filteredRosters.filter((r) => r.shift === "Off Day").length;
		const overtimeHours = filteredRosters.filter((r) => r.shift === "Overtime").reduce((sum, r) => sum + r.workingHours, 0);
		const pendingCount = filteredRosters.filter((r) => r.status === "Pending").length;
		let conflicts = 0;
		const doubleShiftTracker = /* @__PURE__ */ new Set();
		filteredRosters.forEach((r) => {
			const key = `${r.employeeId}-${r.date}`;
			if (doubleShiftTracker.has(key)) conflicts++;
			else doubleShiftTracker.add(key);
			if (r.shift === "Overtime") conflicts++;
			if (r.shift === "Leave" && r.workingHours > 0) conflicts++;
		});
		return {
			activeRosters: 3,
			employeesAssigned: assignedCount || DEFAULT_EMPLOYEES.length,
			openShifts: openShifts || 5,
			coverage: "94.2%",
			overtime: overtimeHours || 16,
			pending: pendingCount,
			conflicts
		};
	}, [filteredRosters]);
	const conflictList = (0, import_react.useMemo)(() => {
		const list = [];
		const dayMap = /* @__PURE__ */ new Map();
		rosters.forEach((r) => {
			const key = `${r.employeeId}-${r.date}`;
			const existing = dayMap.get(key) || [];
			existing.push(r);
			dayMap.set(key, existing);
		});
		dayMap.forEach((entries, key) => {
			const empName = entries[0].employeeName;
			const date = key.slice(key.indexOf("-") + 1);
			if (entries.length > 1) list.push({
				id: `ds-${key}`,
				employeeName: empName,
				type: "Double Shift Detected",
				date,
				message: `${empName} has multiple shifts scheduled on ${date}.`
			});
		});
		rosters.forEach((r) => {
			if (r.shift === "Leave" && r.status === "Approved") list.push({
				id: `l-${r.id}`,
				employeeName: r.employeeName,
				type: "Leave Overlap",
				date: r.date,
				message: `${r.employeeName} is on leave on ${r.date} but has a schedule.`
			});
			if (r.shift === "Holiday" && r.workingHours > 0) list.push({
				id: `h-${r.id}`,
				employeeName: r.employeeName,
				type: "Holiday Conflict",
				date: r.date,
				message: `${r.employeeName} has a working shift scheduled on ${r.date} (Public Holiday).`
			});
		});
		return list;
	}, [rosters]);
	const handleAssignShift = (e) => {
		e.preventDefault();
		const emp = DEFAULT_EMPLOYEES.find((item) => item.code === formEmployeeId);
		if (!emp) return;
		const newRoster = {
			id: "r_" + (rosters.length + 1) + "_" + Math.random().toString(36).substr(2, 4),
			employeeId: emp.code,
			employeeName: emp.name,
			department: emp.dept,
			designation: emp.role,
			date: formDate,
			shift: formShift,
			startTime: formStartTime,
			endTime: formEndTime,
			workingHours: formShift === "Off Day" || formShift === "Leave" || formShift === "Holiday" ? 0 : 8,
			breakTime: formBreak,
			location: formLocation,
			manager: emp.mgr,
			status: formStatus
		};
		setRosters((prev) => [newRoster, ...prev]);
		setIsAssignModalOpen(false);
		toast.success(`Assigned shift "${formShift}" to ${emp.name} on ${formDate}`);
		triggerAutoSave();
	};
	const handleCreateRoster = (e) => {
		e.preventDefault();
		if (!createRosterName.trim()) {
			toast.error("Roster name is required");
			return;
		}
		setIsCreateModalOpen(false);
		toast.success(`Roster planner "${createRosterName}" generated for department "${createRosterDept}"`);
		triggerAutoSave();
	};
	const handleQuickFixConflicts = () => {
		setRosters((prev) => {
			const doubleShiftTracker = /* @__PURE__ */ new Set();
			return prev.map((r) => {
				const key = `${r.employeeId}-${r.date}`;
				if (doubleShiftTracker.has(key)) return {
					...r,
					shift: "Off Day",
					workingHours: 0,
					startTime: "—",
					endTime: "—"
				};
				else {
					doubleShiftTracker.add(key);
					return r;
				}
			});
		});
		toast.success("AI resolved all schedule conflicts by re-assigning off days!");
		triggerAutoSave();
	};
	const handleAction = (action, entry) => {
		if (action === "Approve") {
			setRosters((prev) => prev.map((r) => r.id === entry.id ? {
				...r,
				status: "Approved"
			} : r));
			toast.success(`Roster entry approved for ${entry.employeeName}`);
			triggerAutoSave();
		} else if (action === "Reject") {
			setRosters((prev) => prev.map((r) => r.id === entry.id ? {
				...r,
				status: "Rejected"
			} : r));
			toast.success(`Roster entry rejected for ${entry.employeeName}`);
			triggerAutoSave();
		} else if (action === "Delete") {
			setEntryToDelete(entry);
			setIsDeleteConfirmOpen(true);
		} else if (action === "Duplicate") {
			const dup = {
				...entry,
				id: "dup_" + entry.id + "_" + Math.random().toString(36).substr(2, 4),
				status: "Pending"
			};
			setRosters((prev) => [dup, ...prev]);
			toast.success(`Duplicated schedule row for ${entry.employeeName}`);
			triggerAutoSave();
		} else if (action === "Assign") {
			setFormEmployeeId(entry.employeeId);
			setFormShift(entry.shift);
			setFormDate(entry.date);
			setFormStartTime(entry.startTime);
			setFormEndTime(entry.endTime);
			setFormBreak(entry.breakTime);
			setFormLocation(entry.location);
			setFormStatus(entry.status);
			setIsAssignModalOpen(true);
		}
	};
	const confirmDeleteEntry = () => {
		if (!entryToDelete) return;
		setRosters((prev) => prev.filter((r) => r.id !== entryToDelete.id));
		setIsDeleteConfirmOpen(false);
		toast.success(`Deleted schedule for ${entryToDelete.employeeName}`, { action: {
			label: "Undo",
			onClick: () => {
				setRosters((prev) => [entryToDelete, ...prev]);
				toast.success(`Restored schedule for ${entryToDelete.employeeName}`);
			}
		} });
		triggerAutoSave();
	};
	const handleDragStart = (id) => {
		setDraggingEntryId(id);
	};
	const handleDropCell = (employeeId, dateStr) => {
		if (!draggingEntryId) return;
		const entryToMove = rosters.find((r) => r.id === draggingEntryId);
		if (!entryToMove) return;
		const targetEmployee = DEFAULT_EMPLOYEES.find((item) => item.code === employeeId);
		if (!targetEmployee) return;
		setRosters((prev) => prev.map((r) => {
			if (r.id === draggingEntryId) return {
				...r,
				employeeId: targetEmployee.code,
				employeeName: targetEmployee.name,
				department: targetEmployee.dept,
				designation: targetEmployee.role,
				date: dateStr,
				manager: targetEmployee.mgr
			};
			return r;
		}));
		toast.success(`Moved ${entryToMove.employeeName}'s shift to ${targetEmployee.name} on ${dateStr}`);
		setDraggingEntryId(null);
		triggerAutoSave();
	};
	const highlightText = (text, searchStr) => {
		if (!searchStr) return text;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.split(new RegExp(`(${searchStr})`, "gi")).map((part, i) => part.toLowerCase() === searchStr.toLowerCase() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: "bg-amber-500/35 text-amber-200 px-0.5 rounded",
			children: part
		}, i) : part) });
	};
	const getShiftBadgeStyle = (shift) => {
		switch (shift) {
			case "Morning": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
			case "Evening": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
			case "Night": return "bg-purple-500/10 text-purple-400 border-purple-500/25";
			case "Off Day": return "bg-muted/30 text-muted-foreground border-border";
			case "Leave": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
			case "Holiday": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
			case "Training": return "bg-teal-500/10 text-teal-400 border-teal-500/25";
			case "WFH": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
			case "Overtime": return "bg-orange-500/10 text-orange-400 border-orange-500/25";
			default: return "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Roster Planner",
				description: "Plan employee shifts, weekly schedules, monthly rosters, and workforce allocation.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline-flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border/80 bg-card/30 rounded-lg px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 text-emerald-500" }), autoSaveStatus]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
									loading: "AI generating optimal shift coverage...",
									success: "Optimal shift schedule generated with 0 conflicts!",
									error: "AI generation failed."
								});
							},
							className: "h-9 border-border bg-card/40 text-xs hover:bg-accent/60 text-blue-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-3.5 w-3.5 text-blue-400" }), "Generate AI Roster"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toast.info("Import schedule simulation active"),
							className: "h-9 border-border bg-card/40 text-xs hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-3.5 w-3.5" }), "Import Schedule"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toast.success("Export started"),
							className: "h-9 border-border bg-card/40 text-xs hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-3.5 w-3.5" }), "Export"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setIsCreateModalOpen(true),
							className: "h-9 bg-primary text-xs text-primary-foreground shadow-glow hover:bg-primary/95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "Create Roster"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8",
				children: [
					{
						label: "Active Rosters",
						value: stats.activeRosters,
						color: "text-blue-500 bg-blue-500/10",
						prog: 60,
						sub: "+2 this week"
					},
					{
						label: "Employees Assigned",
						value: stats.employeesAssigned,
						color: "text-emerald-500 bg-emerald-500/10",
						prog: 85,
						sub: "92% of staff"
					},
					{
						label: "Open Shifts",
						value: stats.openShifts,
						color: "text-amber-500 bg-amber-500/10",
						prog: 40,
						sub: "5 unassigned"
					},
					{
						label: "Weekly Coverage",
						value: stats.coverage,
						color: "text-indigo-500 bg-indigo-500/10",
						prog: 94,
						sub: "Target 95%"
					},
					{
						label: "Monthly Coverage",
						value: "92.8%",
						color: "text-purple-500 bg-purple-500/10",
						prog: 92,
						sub: "Stable"
					},
					{
						label: "Overtime Hours",
						value: `${stats.overtime}h`,
						color: "text-orange-500 bg-orange-500/10",
						prog: 15,
						sub: "1.2h avg/emp"
					},
					{
						label: "Pending Approvals",
						value: stats.pending,
						color: "text-teal-500 bg-teal-500/10",
						prog: stats.pending > 0 ? 80 : 0,
						sub: "Requires action"
					},
					{
						label: "Conflicts Detected",
						value: stats.conflicts,
						color: stats.conflicts > 0 ? "text-destructive bg-destructive/15 animate-pulse" : "text-emerald-500 bg-emerald-500/10",
						prog: stats.conflicts * 10,
						sub: stats.conflicts > 0 ? `${stats.conflicts} warnings` : "Clear"
					}
				].map((c, i) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/75",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground block truncate",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl font-bold tracking-tight text-foreground",
									children: c.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-muted-foreground",
									children: c.sub
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1 w-full bg-border rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all duration-500 ${c.color.includes("text-destructive") ? "bg-destructive" : c.color.includes("text-emerald") ? "bg-emerald-500" : "bg-primary"}`,
									style: { width: `${c.prog}%` }
								})
							})
						]
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-[200px] flex-1 md:max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search employee, dept, shift…",
									className: "h-9 pl-9 border-border text-xs focus:ring-1 focus:ring-ring focus:border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dept:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: deptFilter,
										onChange: (e) => setDeptFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												className: "bg-background",
												children: "All Departments"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "engineering",
												className: "bg-background",
												children: "Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "sales",
												className: "bg-background",
												children: "Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "hr",
												className: "bg-background",
												children: "HR & Ops"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "finance",
												className: "bg-background",
												children: "Finance"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shift Type:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: shiftFilter,
										onChange: (e) => setShiftFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Shifts"
										}), SHIFT_TYPES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: st.toLowerCase(),
											className: "bg-background",
											children: st
										}, st))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Location:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: locationFilter,
										onChange: (e) => setLocationFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												className: "bg-background",
												children: "All Locations"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "san francisco hq",
												className: "bg-background",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "remote",
												className: "bg-background",
												children: "Remote"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manager:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: managerFilter,
										onChange: (e) => setManagerFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												className: "bg-background",
												children: "All Managers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "maya chen",
												className: "bg-background",
												children: "Maya Chen"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "priya nair",
												className: "bg-background",
												children: "Priya Nair"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "michael scott",
												className: "bg-background",
												children: "Michael Scott"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "approved",
											className: "bg-background",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pending",
											className: "bg-background",
											children: "Pending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rejected",
											className: "bg-background",
											children: "Rejected"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleResetFilters,
								className: "h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3 w-3" }), "Reset Filters"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex border border-border rounded-lg bg-card/80 p-0.5 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("calendar"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "Scheduler calendar view",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), "Scheduler"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("list"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "List view table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" }), "List Table"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-3 space-y-6",
					children: [viewMode === "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground",
									children: "Weekly Shift Planner"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md font-mono",
									children: "22 Jun 2026 - 28 Jun 2026"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex border border-border rounded-lg p-0.5 bg-card/85 text-[11px]",
									children: [
										"Day",
										"Week",
										"Month",
										"Timeline"
									].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setCalendarView(v);
											toast.info(`Switched view to ${v} (Demo Mode)`);
										},
										className: `px-2.5 py-1 rounded ${calendarView === v ? "bg-muted font-bold text-foreground" : "text-muted-foreground hover:text-foreground"}`,
										children: v
									}, v))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.info("Previous week"),
										className: "rounded border border-border p-1 hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.info("Next week"),
										className: "rounded border border-border p-1 hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[800px] divide-y divide-border text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-8 bg-muted/10 font-semibold text-muted-foreground py-3 border-b border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-4",
										children: "Employee / Role"
									}), currentWeekDays.map((d) => {
										const isToday = d.dateStr === "2026-06-25";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `text-center flex flex-col items-center justify-center ${isToday ? "text-blue-400 font-bold" : ""}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase tracking-wider",
												children: d.dayName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs mt-0.5 rounded-full px-1.5 py-0.5 ${isToday ? "bg-blue-500/10 border border-blue-500/20" : ""}`,
												children: d.label
											})]
										}, d.dateStr);
									})]
								}), DEFAULT_EMPLOYEES.map((emp) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-8 hover:bg-muted/5 transition-colors items-center py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-7 w-7 rounded-full bg-accent text-[10px] font-bold text-foreground grid place-items-center uppercase",
												children: emp.name.split(" ").map((n) => n.charAt(0)).join("")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground leading-snug",
													children: emp.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] text-muted-foreground truncate max-w-[100px]",
													children: emp.role
												})]
											})]
										}), currentWeekDays.map((day) => {
											const isToday = day.dateStr === "2026-06-25";
											const cellEntries = rosters.filter((r) => r.employeeId === emp.code && r.date === day.dateStr);
											const cellConflicts = conflictList.filter((c) => c.employeeName === emp.name && c.date === day.dateStr);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												onDragOver: (e) => e.preventDefault(),
												onDrop: () => handleDropCell(emp.code, day.dateStr),
												className: `p-1.5 min-h-[74px] h-auto flex flex-col justify-stretch gap-1 border-l border-border/60 relative group/cell ${isToday ? "bg-blue-500/5" : ""}`,
												children: cellEntries.length > 0 ? cellEntries.map((entry) => {
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														draggable: true,
														onDragStart: () => handleDragStart(entry.id),
														onClick: () => handleAction("Assign", entry),
														className: `w-full rounded-md border p-1.5 text-[10px] font-medium leading-tight flex flex-col gap-1 cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow transition-all ${getShiftBadgeStyle(entry.shift)}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-start justify-between gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold truncate",
																children: entry.shift
															}), cellConflicts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																title: cellConflicts[0].type,
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-rose-500 shrink-0 animate-bounce" })
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between text-[8px] opacity-75",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.startTime === "—" ? "" : `${entry.startTime}-${entry.endTime}` }), entry.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" })]
														})]
													}, entry.id);
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setFormEmployeeId(emp.code);
														setFormShift("Morning");
														setFormDate(day.dateStr);
														setFormStartTime("08:00");
														setFormEndTime("16:00");
														setFormStatus("Pending");
														setIsAssignModalOpen(true);
													},
													className: "w-full flex-1 min-h-[58px] rounded border border-dashed border-border/50 opacity-0 group-hover/cell:opacity-100 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all text-[10px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-0.5" }), " Assign"]
												})
											}, day.dateStr);
										})]
									}, emp.id);
								})]
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/30 font-semibold uppercase tracking-wider text-muted-foreground border-b border-border text-[10px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Employee"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Shift Pattern"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Break"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Manager"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredRosters.map((entry) => {
									const isPending = entry.status === "Pending";
									const isRejected = entry.status === "Rejected";
									const badgeStyle = getShiftBadgeStyle(entry.shift);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border transition-colors hover:bg-muted/10 group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 font-semibold text-foreground",
												children: highlightText(entry.employeeName, search)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 font-mono text-muted-foreground",
												children: entry.employeeId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.department
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground font-mono",
												children: entry.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[9px] font-semibold py-0.5 px-1.5 ${badgeStyle}`,
													children: entry.shift
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.workingHours > 0 ? `${entry.workingHours} hrs` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.breakTime
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground truncate max-w-[100px]",
												children: entry.location
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground text-[10px]",
												children: entry.manager
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: isPending ? "outline" : isRejected ? "destructive" : "secondary",
													className: `text-[9px] py-0.5 px-1.5 font-medium ${isPending ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : isRejected ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`,
													children: entry.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity",
													children: [
														isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Approve", entry),
															className: "rounded p-1 border border-border text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10",
															title: "Approve Shift",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Reject", entry),
															className: "rounded p-1 border border-border text-rose-500 bg-rose-500/5 hover:bg-rose-500/10",
															title: "Reject Shift",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Assign", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Edit",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Duplicate", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Duplicate",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Delete", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive",
															title: "Delete",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
														})
													]
												})
											})
										]
									}, entry.id);
								}) })]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground",
								children: "Roster Allocation Analytics"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Shift Distribution (Assigned Rows)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: [
										{
											label: "Morning Shifts",
											value: 12,
											pct: "60%",
											color: "bg-blue-500"
										},
										{
											label: "Evening Shifts",
											value: 8,
											pct: "40%",
											color: "bg-amber-500"
										},
										{
											label: "Night Shifts",
											value: 5,
											pct: "25%",
											color: "bg-purple-500"
										},
										{
											label: "WFH / Hybrid",
											value: 4,
											pct: "20%",
											color: "bg-emerald-500"
										}
									].map((bar, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-[11px] font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: bar.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-foreground",
												children: [
													bar.value,
													" employees (",
													bar.pct,
													")"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-full bg-border rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full ${bar.color}`,
												style: { width: bar.pct }
											})
										})]
									}, i))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Workforce Density Heatmap (Active Coverage)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-7 gap-1 bg-border/20 rounded-lg p-2.5 border border-border",
										children: [[
											"M",
											"T",
											"W",
											"T",
											"F",
											"S",
											"S"
										].map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-center font-bold text-[9px] text-muted-foreground/80 mb-1",
											children: l
										}, i)), [
											"bg-blue-500/80",
											"bg-blue-500/60",
											"bg-blue-500/90",
											"bg-blue-500/70",
											"bg-blue-500/40",
											"bg-muted/40",
											"bg-muted/40",
											"bg-blue-500/90",
											"bg-blue-500/80",
											"bg-blue-500/75",
											"bg-blue-500/85",
											"bg-blue-500/50",
											"bg-muted/40",
											"bg-muted/40",
											"bg-blue-500/70",
											"bg-blue-500/70",
											"bg-blue-500/80",
											"bg-blue-500/95",
											"bg-blue-500/60",
											"bg-muted/40",
											"bg-muted/40",
											"bg-blue-500/90",
											"bg-blue-500/85",
											"bg-blue-500/90",
											"bg-blue-500/75",
											"bg-blue-500/80",
											"bg-muted/40",
											"bg-muted/40"
										].map((cell, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-4 rounded ${cell} transition-all hover:scale-105 hover:ring-1 hover:ring-white/40 cursor-help`,
											title: "Peak shift utilization: 95%"
										}, idx))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[9px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Low Coverage" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-blue-500/20" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-blue-500/50" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-blue-500/80" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-blue-500/95" })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Peak Coverage" })
										]
									})
								]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-semibold tracking-tight text-foreground",
										children: "AI Roster Guard"
									})]
								}), conflictList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "destructive",
									className: "text-[9px] py-0 px-1 animate-pulse",
									children: [conflictList.length, " Warning"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [conflictList.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-destructive/20 bg-destructive/10 p-3 space-y-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1.5 font-semibold text-destructive-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 leading-none text-rose-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), item.type]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] opacity-75 font-mono",
											children: item.date
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground leading-normal",
										children: item.message
									})]
								}, idx)), conflictList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleQuickFixConflicts,
									className: "w-full h-9 text-xs bg-blue-600/90 text-white hover:bg-blue-600 shadow-glow",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1.5" }), " Apply AI Quick Fix"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 flex flex-col items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-xs mt-1",
											children: "No Schedule Conflicts"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-muted-foreground",
											children: "AI checked 28 weekly shifts sequence. Overlap clearance is 100%."
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground mb-4",
								children: "Today's Schedule & Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 text-xs",
								children: [
									{
										time: "08:00 - 16:00",
										name: "Jordan Lee",
										type: "Morning Shift",
										color: "bg-blue-500"
									},
									{
										time: "09:00 - 17:00",
										name: "Sarah Connor",
										type: "Night Shift Recovery",
										color: "bg-purple-500"
									},
									{
										time: "16:00 - 00:00",
										name: "Michael Scott",
										type: "Evening Shift Coverage",
										color: "bg-amber-500"
									},
									{
										time: "16:00 - 00:00",
										name: "Dwight Schrute",
										type: "Evening Shift Coverage",
										color: "bg-amber-500"
									}
								].map((shift, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 pb-2.5 border-b border-border last:border-b-0 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full mt-1.5 shrink-0 ${shift.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-baseline font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: shift.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] text-muted-foreground font-mono font-medium",
												children: shift.time
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: shift.type
										})]
									})]
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground",
								children: "Weekly Allocation Summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Total Active Shifts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "28 shifts"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Average Shift Length"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "8.0 hours"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "WFH Days Approved"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "2 days"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Leave Absences"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "1 day"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Estimated Overtime"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "16.0 hours"
										})]
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAssignModalOpen,
				onOpenChange: setIsAssignModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-base font-semibold tracking-tight text-foreground",
						children: "Assign Workforce Shift"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Directly assign or edit shift patterns for specific employee dates."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAssignShift,
						className: "space-y-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Select Employee"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formEmployeeId,
										onChange: (e) => setFormEmployeeId(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: DEFAULT_EMPLOYEES.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: emp.code,
											children: [
												emp.name,
												" (",
												emp.code,
												")"
											]
										}, emp.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Shift Pattern"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formShift,
										onChange: (e) => setFormShift(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium",
										children: SHIFT_TYPES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: st,
											children: st
										}, st))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Schedule Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: formDate,
										onChange: (e) => setFormDate(e.target.value),
										required: true,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Work Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formLocation,
										onChange: (e) => setFormLocation(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "San Francisco HQ",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "London office",
												children: "London office"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Bengaluru Tech Park",
												children: "Bengaluru Tech Park"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Remote",
												children: "Remote / WFH"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Start Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formStartTime,
										onChange: (e) => setFormStartTime(e.target.value),
										placeholder: "e.g. 08:00",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "End Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formEndTime,
										onChange: (e) => setFormEndTime(e.target.value),
										placeholder: "e.g. 16:00",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Break Duration"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formBreak,
										onChange: (e) => setFormBreak(e.target.value),
										placeholder: "e.g. 45 mins",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Approval Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formStatus,
										onChange: (e) => setFormStatus(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Approved",
												children: "Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Pending",
												children: "Pending"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Rejected",
												children: "Rejected"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex items-center justify-between py-2 border-t border-border mt-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-medium text-foreground cursor-pointer",
											htmlFor: "rec-shift",
											children: "Recurring Weekly Schedule"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "Repeat this exact shift pattern for next 4 calendar weeks."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "rec-shift",
										checked: formRecurring,
										onChange: (e) => setFormRecurring(e.target.checked),
										className: "h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsAssignModalOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs",
								children: "Save Schedule"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isCreateModalOpen,
				onOpenChange: setIsCreateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-base font-semibold tracking-tight text-foreground",
						children: "Create New Roster Template"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Create a weekly or monthly empty schedule shell to start assigning shifts."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateRoster,
						className: "space-y-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Roster Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: createRosterName,
										onChange: (e) => setCreateRosterName(e.target.value),
										placeholder: "e.g. Engineering Team A Week 26",
										required: true,
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Department Scope"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: createRosterDept,
										onChange: (e) => setCreateRosterDept(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Engineering",
												children: "Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sales",
												children: "Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HR",
												children: "HR & Operations"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "hq",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "london",
												children: "London branch"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "blr",
												children: "Bengaluru Tech Park"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Start Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: createRosterStart,
										onChange: (e) => setCreateRosterStart(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "End Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: createRosterEnd,
										onChange: (e) => setCreateRosterEnd(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Notes / Handover Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										placeholder: "Key schedule deliverables, mandatory weekend standbys, or custom swap policies…",
										rows: 2,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsCreateModalOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs",
								children: "Create Shell"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDeleteConfirmOpen,
				onOpenChange: setIsDeleteConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "flex flex-row items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full bg-destructive/10 p-2 text-destructive shrink-0 mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "font-display text-base font-semibold tracking-tight text-foreground",
									children: "Delete Schedule Row"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
									className: "text-xs text-muted-foreground",
									children: [
										"Are you sure you want to delete the schedule entry for",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-foreground",
											children: [
												"\"",
												entryToDelete?.employeeName,
												"\""
											]
										}),
										"?"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-normal px-1",
							children: "Deleting this roster row leaves the employee unassigned (Off Day status) for this schedule period. Any active approvals will be voided."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsDeleteConfirmOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: confirmDeleteEntry,
								className: "h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs",
								children: "Confirm Delete"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { RostersPage as default };
