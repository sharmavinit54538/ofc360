import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { B as bulkDeleteDepartments, D as addEmployeeToDepartment, Ft as removeEmployeeFromDepartment, Gt as updateDepartment, H as bulkSetDepartmentStatus, K as createDepartment, Nt as promoteDepartmentEmployee, Q as deleteDepartment, T as THEME_COLORS, Ut as transferDepartmentEmployees, _ as OFFICES$1, a as DEFAULT_FILTERS$2, at as fetchDepartments, d as EMPLOYEE_COUNT_RANGES, l as DEPARTMENT_ICONS, ln as useofc360, sn as useMounted, w as STATUS_OPTIONS$1, xt as importDepartments, z as bulkAssignDepartmentManager } from "./ofc360-store-CDoLj5BI.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { $n as CircleCheckBig, B as ShieldCheck, C as TrendingDown, Cr as Briefcase, Fr as ArrowUpDown, Hn as Clock, Jn as CircleQuestionMark, K as Search, Kn as CircleX, Kt as Landmark, Lr as ArrowRightLeft, Mn as DollarSign, Mr as Award, On as Ellipsis, Ot as MapPin, Qn as CircleCheck, S as TrendingUp, Sr as Building2, T as Trash2, Tn as Eye, Vr as Activity, _n as FileSpreadsheet, ar as ChevronDown, at as Plus, cr as ChartPie, dr as ChartLine, er as CircleArrowUp, f as User, fr as ChartColumn, ft as Pen, g as UserMinus, gn as FileText, ir as ChevronLeft, jn as Download, ln as Funnel, mr as Calendar, rr as ChevronRight, t as lucide_react_exports, tr as CircleAlert, u as Users, ur as ChartNoAxesColumnIncreasing, v as UserCheck, xr as Building, y as Upload, yt as Network } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell--OmXvVdk.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-Du1Hn1eb.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, t as Sheet } from "./sheet-C6l-HH22.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, s as LineChart, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DepartmentsPage-D6fmEzKD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useDepartments() {
	const dispatch = useAppDispatch();
	const { departments, loading, error } = useAppSelector((state) => state.departments);
	(0, import_react.useEffect)(() => {
		dispatch(fetchDepartments());
	}, [dispatch]);
	return {
		departments,
		loading,
		error,
		createDepartment: (dept) => dispatch(createDepartment(dept)),
		updateDepartment: (dept) => dispatch(updateDepartment(dept)),
		deleteDepartment: (id) => dispatch(deleteDepartment(id)),
		bulkDelete: (ids) => dispatch(bulkDeleteDepartments(ids)),
		bulkSetStatus: (ids, status) => dispatch(bulkSetDepartmentStatus({
			ids,
			status
		})),
		bulkAssignManager: (ids, managerId, managerName) => dispatch(bulkAssignDepartmentManager({
			ids,
			managerId,
			managerName
		})),
		importDepartments: (imported) => dispatch(importDepartments(imported)),
		addEmployeeToDept: (deptId, employeeId) => dispatch(addEmployeeToDepartment({
			deptId,
			employeeId
		})),
		removeEmployeeFromDept: (deptId, employeeId) => dispatch(removeEmployeeFromDepartment({
			deptId,
			employeeId
		})),
		transferEmployees: (fromDeptId, toDeptId) => dispatch(transferDepartmentEmployees({
			fromDeptId,
			toDeptId
		})),
		promoteEmployee: (employeeId, newDesignation) => dispatch(promoteDepartmentEmployee({
			employeeId,
			newDesignation
		}))
	};
}
function DepartmentStatsCards({ departments }) {
	const ws = useofc360();
	const totalDepartments = departments.length;
	const activeDepartments = departments.filter((d) => d.status === "active").length;
	const totalEmployees = ws.employees.length || 0;
	const totalManagers = ws.managers.length || 0;
	const avgTeamSize = totalManagers > 0 ? Math.round(totalEmployees / totalManagers) : 0;
	const openPositions = departments.reduce((acc, d) => acc + (d.openPositions || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6",
		children: [
			{
				label: "Total Departments",
				value: totalDepartments,
				icon: Building,
				trend: "+12%",
				isPositive: true,
				desc: "2 newly formed this quarter",
				color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20"
			},
			{
				label: "Active Departments",
				value: activeDepartments,
				icon: Activity,
				trend: "100%",
				isPositive: true,
				desc: "All critical divisions operational",
				color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20"
			},
			{
				label: "Total Employees",
				value: totalEmployees,
				icon: Users,
				trend: "+8.4%",
				isPositive: true,
				desc: "Net addition of +5 this month",
				color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20"
			},
			{
				label: "Total Managers",
				value: totalManagers,
				icon: UserCheck,
				trend: "+15%",
				isPositive: true,
				desc: "People managers & leads in tree",
				color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20"
			},
			{
				label: "Average Team Size",
				value: avgTeamSize,
				icon: Landmark,
				trend: "-2.1%",
				isPositive: false,
				desc: "Target: 8-12 reports per lead",
				color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20"
			},
			{
				label: "Open Positions",
				value: openPositions,
				icon: ShieldCheck,
				trend: "+4 open",
				isPositive: true,
				desc: "Hiring across 4 departments",
				color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20"
			}
		].map((stat, i) => {
			const Icon = stat.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col justify-between h-full min-h-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted-foreground line-clamp-1",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br border ${stat.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: stat.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 mt-1",
							children: [
								stat.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3 text-rose-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`,
									children: stat.trend
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-muted-foreground truncate ml-1",
									children: stat.desc
								})
							]
						})]
					})]
				})]
			}, i);
		})
	});
}
function validateDepartmentForm(draft, existingDepartments, isEdit) {
	const errors = {};
	if (!draft.name?.trim()) errors.name = "Department name is required";
	if (!draft.code?.trim()) errors.code = "Department code is required";
	else if (draft.code.trim().length < 2) errors.code = "Code must be at least 2 characters";
	if (!draft.office?.trim()) errors.office = "Office location is required";
	if (!draft.departmentHeadId) errors.departmentHeadId = "Department Head is required";
	if (!draft.reportingManagerName?.trim()) errors.reportingManagerName = "Reporting Manager is required";
	if (draft.budget !== void 0 && draft.budget < 0) errors.budget = "Budget must be a positive number";
	if (draft.employeeCapacity !== void 0 && draft.employeeCapacity < 0) errors.employeeCapacity = "Employee capacity cannot be negative";
	if (draft.name) {
		if (existingDepartments.find((d) => d.name.toLowerCase() === draft.name.toLowerCase() && (!isEdit || d.id !== draft.id))) errors.name = "Department name already exists";
	}
	if (draft.code) {
		if (existingDepartments.find((d) => d.code.toUpperCase() === draft.code.toUpperCase() && (!isEdit || d.id !== draft.id))) errors.code = "Department code already exists";
	}
	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
function applyFilters(departments, query, filters) {
	const q = query.toLowerCase().trim();
	return departments.filter((d) => {
		if (q) {
			if (!(d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.departmentHeadName.toLowerCase().includes(q) || d.reportingManagerName.toLowerCase().includes(q) || d.office.toLowerCase().includes(q))) return false;
		}
		if (filters.status !== "all" && d.status !== filters.status) return false;
		if (filters.office !== "all" && d.office !== filters.office) return false;
		if (filters.managerId !== "all" && d.departmentHeadId !== filters.managerId) return false;
		if (filters.employeeCountRange !== "all") {
			const ec = d.currentEmployeeCount;
			if (filters.employeeCountRange === "0-10" && !(ec >= 0 && ec <= 10)) return false;
			if (filters.employeeCountRange === "11-30" && !(ec >= 11 && ec <= 30)) return false;
			if (filters.employeeCountRange === "31-50" && !(ec >= 31 && ec <= 50)) return false;
			if (filters.employeeCountRange === "50+" && ec <= 50) return false;
		}
		if (filters.createdDateFrom && d.createdDate < filters.createdDateFrom) return false;
		if (filters.createdDateTo && d.createdDate > filters.createdDateTo) return false;
		return true;
	});
}
function applySorting(departments, field, dir) {
	return [...departments].sort((a, b) => {
		let va;
		let vb;
		switch (field) {
			case "name":
				va = a.name;
				vb = b.name;
				break;
			case "code":
				va = a.code;
				vb = b.code;
				break;
			case "departmentHeadName":
				va = a.departmentHeadName;
				vb = b.departmentHeadName;
				break;
			case "currentEmployeeCount":
				va = a.currentEmployeeCount;
				vb = b.currentEmployeeCount;
				break;
			case "openPositions":
				va = a.openPositions;
				vb = b.openPositions;
				break;
			case "budget":
				va = a.budget;
				vb = b.budget;
				break;
			case "createdDate":
				va = a.createdDate;
				vb = b.createdDate;
				break;
			case "status":
				va = a.status;
				vb = b.status;
				break;
			default:
				va = a.name;
				vb = b.name;
		}
		if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va;
		const cmp = String(va).localeCompare(String(vb));
		return dir === "asc" ? cmp : -cmp;
	});
}
function paginate(items, page, perPage) {
	return items.slice((page - 1) * perPage, page * perPage);
}
function buildCSV(departments) {
	const headers = [
		"Department Name",
		"Code",
		"Department Head",
		"Reporting To",
		"Office Location",
		"Budget",
		"Cost Center",
		"Capacity",
		"Employee Count",
		"Open Positions",
		"Status",
		"Created Date"
	];
	const rows = departments.map((d) => [
		d.name,
		d.code,
		d.departmentHeadName,
		d.reportingManagerName,
		d.office,
		d.budget,
		d.costCenter,
		d.employeeCapacity,
		d.currentEmployeeCount,
		d.openPositions,
		d.status,
		d.createdDate
	].map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(","));
	return [headers.join(","), ...rows].join("\n");
}
function fmtBudget(num) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(num);
}
function fmtDate(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("T")[0].split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
function DepartmentsTable({ departments, selectedIds, onSelectAll, onSelectRow, onView, onEdit, onDelete, sortField, sortDir, onSort }) {
	const allSelected = (0, import_react.useMemo)(() => {
		return departments.length > 0 && selectedIds.length === departments.length;
	}, [departments, selectedIds]);
	const isSomeSelected = (0, import_react.useMemo)(() => {
		return selectedIds.length > 0 && selectedIds.length < departments.length;
	}, [departments, selectedIds]);
	const SortHeader = ({ field, children }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			onClick: () => onSort(field),
			className: "-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "ml-1.5 h-3.5 w-3.5" })]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border/80 bg-card/30 overflow-hidden shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto max-h-[600px] overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/10 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-[50px] pl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: allSelected ? true : isSomeSelected ? "indeterminate" : false,
								onCheckedChange: (checked) => onSelectAll(!!checked),
								"aria-label": "Select all departments",
								className: "cursor-pointer"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[220px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "name",
								children: "Department Name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "code",
								children: "Dept Code"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "departmentHeadName",
								children: "Department Head"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Reporting To"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[120px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "currentEmployeeCount",
								children: "Total Employees"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[120px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "openPositions",
								children: "Open Positions"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[120px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "budget",
								children: "Annual Budget"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Office Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "createdDate",
								children: "Created Date"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[110px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "status",
								children: "Status"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-[80px] text-right pr-4",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: departments.map((d) => {
					const isSelected = selectedIds.includes(d.id);
					const statusOpt = STATUS_OPTIONS$1.find((s) => s.value === d.status);
					const IconComponent = lucide_react_exports[d.iconName] || Building2;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: `group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${isSelected ? "bg-muted/10" : ""}`,
						onClick: () => onView(d),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "pl-4 py-3",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: isSelected,
									onCheckedChange: (checked) => onSelectRow(d.id, !!checked),
									"aria-label": `Select ${d.name}`,
									className: "cursor-pointer"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 font-medium text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm flex-shrink-0",
										style: { background: `linear-gradient(135deg, ${d.themeColor}, ${d.themeColor}cc)` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm truncate hover:underline",
											children: d.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground truncate",
											children: ["CC ID: ", d.costCenter || "—"]
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-mono font-bold text-muted-foreground",
								children: d.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-semibold text-foreground",
								children: d.departmentHeadName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: d.reportingManagerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-foreground font-semibold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										d.currentEmployeeCount,
										" /",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [d.employeeCapacity, " Cap"]
										})
									] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-semibold",
								children: d.openPositions > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-2 py-0",
									children: [d.openPositions, " hiring"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60 italic text-[11px]",
									children: "Filled"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-foreground font-semibold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), fmtBudget(d.budget)]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 truncate max-w-[120px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), d.office]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), fmtDate(d.createdDate)]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `px-2 py-0.5 text-[10px] font-semibold border ${statusOpt?.color || "text-slate-500 bg-slate-500/10 border-slate-500/20"}`,
									children: statusOpt?.label || d.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-right pr-4",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "h-8 w-8 p-0 rounded-lg hover:bg-muted/50 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "rounded-xl border-border bg-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onView(d),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-muted-foreground" }), "View Details"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onEdit(d),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Edit Department"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onDelete(d),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Department"]
										})
									]
								})] })
							})
						]
					}, d.id);
				}) })]
			})
		})
	});
}
function mergeManagers(reduxManagers, ofc360Managers) {
	const merged = [...reduxManagers];
	ofc360Managers.forEach((sm) => {
		if (!merged.some((m) => m.email.toLowerCase() === sm.email.toLowerCase())) merged.push({
			id: sm.id,
			managerId: sm.id,
			employeeId: sm.id,
			firstName: sm.fullName.split(" ")[0] || "Manager",
			lastName: sm.fullName.split(" ").slice(1).join(" ") || "",
			fullName: sm.fullName,
			email: sm.email,
			phone: sm.phone,
			dob: "",
			gender: "prefer_not_to_say",
			department: sm.department,
			designation: sm.designation,
			managerRole: "team_lead",
			reportingManagerId: null,
			reportingManagerCode: "",
			reportingManagerName: "",
			office: "",
			workLocation: "on_site",
			joiningDate: "",
			employmentType: "full_time",
			bloodGroup: "O+",
			maritalStatus: "Single",
			shift: sm.shiftStart ?? "General",
			status: "active",
			teamSize: sm.team?.length ?? 0,
			teamIds: sm.team ?? [],
			permissions: {
				canApproveLeave: true,
				canApproveAttendance: true,
				canManageEmployees: true,
				canViewPayroll: false,
				canEditDepartments: false,
				canInviteUsers: false,
				canManageRecruitment: false,
				canManagePerformance: false
			},
			lastActive: (/* @__PURE__ */ new Date()).toISOString(),
			attendanceSummary: {
				present: 0,
				absent: 0,
				late: 0,
				leave: 0
			},
			leaveBalance: {
				annual: 0,
				sick: 0,
				casual: 0
			},
			performanceScore: 0,
			recentActivity: []
		});
	});
	return merged;
}
function useManagersList() {
	const reduxManagers = useAppSelector((state) => state.managers.managers);
	const ws = useofc360();
	return (0, import_react.useMemo)(() => mergeManagers(reduxManagers, ws.managers ?? []), [reduxManagers, ws.managers]);
}
function DepartmentFormDialog({ open, onOpenChange, department, existingDepartments, onSave }) {
	const isEdit = !!department;
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [departmentHeadId, setDepartmentHeadId] = (0, import_react.useState)("");
	const [reportingManagerId, setReportingManagerId] = (0, import_react.useState)("none");
	const [office, setOffice] = (0, import_react.useState)("");
	const [budget, setBudget] = (0, import_react.useState)("");
	const [costCenter, setCostCenter] = (0, import_react.useState)("");
	const [employeeCapacity, setEmployeeCapacity] = (0, import_react.useState)("");
	const [currentEmployeeCount, setCurrentEmployeeCount] = (0, import_react.useState)("0");
	const [extensionNumber, setExtensionNumber] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("active");
	const [themeColor, setThemeColor] = (0, import_react.useState)("#3b82f6");
	const [iconName, setIconName] = (0, import_react.useState)("Code2");
	const [parentId, setParentId] = (0, import_react.useState)("none");
	const [errors, setErrors] = (0, import_react.useState)({});
	const managers = useManagersList();
	const parentDeptOptions = existingDepartments.filter((d) => !department || d.id !== department.id);
	(0, import_react.useEffect)(() => {
		if (open) {
			setErrors({});
			if (department) {
				setName(department.name);
				setCode(department.code);
				setDescription(department.description);
				setDepartmentHeadId(department.departmentHeadId || "");
				setReportingManagerId(department.reportingManagerId || "none");
				setOffice(department.office);
				setBudget(String(department.budget));
				setCostCenter(department.costCenter);
				setEmployeeCapacity(String(department.employeeCapacity));
				setCurrentEmployeeCount(String(department.currentEmployeeCount));
				setExtensionNumber(department.extensionNumber);
				setStatus(department.status);
				setThemeColor(department.themeColor);
				setIconName(department.iconName);
				setParentId(department.parentId || "none");
			} else {
				setName("");
				setCode("");
				setDescription("");
				setDepartmentHeadId(managers[0]?.id || "");
				setReportingManagerId("none");
				setOffice(OFFICES$1[0] || "");
				setBudget("");
				setCostCenter("CC-");
				setEmployeeCapacity("30");
				setCurrentEmployeeCount("0");
				setExtensionNumber("");
				setStatus("active");
				setThemeColor(THEME_COLORS[0]?.hex || "#3b82f6");
				setIconName(DEPARTMENT_ICONS[0]?.name || "Code2");
				setParentId("none");
			}
		}
	}, [
		open,
		department,
		managers
	]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const headManager = managers.find((m) => m.id === departmentHeadId);
		const selectedReport = managers.find((m) => m.id === reportingManagerId);
		const parentDept = parentDeptOptions.find((d) => d.id === parentId);
		const val = validateDepartmentForm({
			id: department?.id,
			name: name.trim(),
			code: code.trim().toUpperCase(),
			description: description.trim(),
			departmentHeadId: departmentHeadId || null,
			departmentHeadName: headManager?.fullName || "Unassigned",
			reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
			reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
			office,
			budget: budget ? parseFloat(budget) : 0,
			costCenter: costCenter.trim(),
			employeeCapacity: employeeCapacity ? parseInt(employeeCapacity) : 30,
			currentEmployeeCount: parseInt(currentEmployeeCount) || 0,
			extensionNumber: extensionNumber.trim(),
			status,
			themeColor,
			iconName,
			parentId: parentId === "none" ? null : parentId,
			parentName: parentId === "none" ? "None" : parentDept?.name || "None"
		}, existingDepartments, isEdit);
		if (!val.valid) {
			setErrors(val.errors);
			toast.error("Please resolve validation errors in the form.");
			return;
		}
		onSave({
			id: department?.id || `dept_${Math.random().toString(36).substr(2, 9)}`,
			name: name.trim(),
			code: code.trim().toUpperCase(),
			description: description.trim(),
			departmentHeadId: departmentHeadId || null,
			departmentHeadName: headManager?.fullName || "Unassigned",
			reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
			reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
			office,
			budget: budget ? parseFloat(budget) : 0,
			costCenter: costCenter.trim(),
			employeeCapacity: employeeCapacity ? parseInt(employeeCapacity) : 30,
			currentEmployeeCount: department?.currentEmployeeCount ?? (parseInt(currentEmployeeCount) || 0),
			extensionNumber: extensionNumber.trim(),
			status,
			themeColor,
			iconName,
			parentId: parentId === "none" ? null : parentId,
			parentName: parentId === "none" ? "None" : parentDept?.name || "None",
			createdDate: department?.createdDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			employeeIds: department?.employeeIds || [],
			openPositions: department?.openPositions ?? (status === "hiring" ? 2 : 0),
			performanceScore: department?.performanceScore ?? 85,
			attendanceScore: department?.attendanceScore ?? 92,
			hiringStatus: department?.hiringStatus ?? (status === "hiring" ? "open" : "closed"),
			recentActivity: department?.recentActivity || [{
				id: `act_${Date.now()}`,
				action: isEdit ? "Updated department specifications" : "Department created",
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}],
			documents: department?.documents || []
		});
		toast.success(isEdit ? "Department Updated Successfully" : "Department Created Successfully");
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl md:max-w-4xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold",
				children: isEdit ? "✏️ Edit Department" : "➕ Add Department"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Basic Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 md:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "name",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Department Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "name",
											value: name,
											onChange: (e) => setName(e.target.value),
											placeholder: "e.g. Frontend Engineering",
											className: errors.name ? "border-rose-500" : ""
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "code",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Department Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "code",
											value: code,
											onChange: (e) => setCode(e.target.value),
											placeholder: "e.g. FE-ENG",
											className: errors.code ? "border-rose-500" : ""
										}),
										errors.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.code
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 md:col-span-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "description",
										children: "Description / Purpose"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "description",
										value: description,
										onChange: (e) => setDescription(e.target.value),
										placeholder: "Summarize the core activities and responsibilities of this department division...",
										rows: 3
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Management & Hierarchy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "departmentHead",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Department Head"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: departmentHeadId,
											onValueChange: (val) => setDepartmentHeadId(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "departmentHead",
												className: errors.departmentHeadId ? "border-rose-500" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Department Head" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: managers.map((mgr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: mgr.id,
												children: [
													mgr.fullName,
													" (",
													mgr.designation || "Manager",
													")"
												]
											}, mgr.id)) })]
										}),
										errors.departmentHeadId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.departmentHeadId
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "reportingManager",
										children: "Reporting Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: reportingManagerId,
										onValueChange: (val) => setReportingManagerId(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "reportingManager",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Reporting Lead" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "None (C-Level / Board)"
										}), managers.map((mgr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: mgr.id,
											children: [
												mgr.fullName,
												" (",
												mgr.designation || "Manager",
												")"
											]
										}, mgr.id))] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "parentDept",
										children: "Parent Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: parentId,
										onValueChange: (val) => setParentId(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "parentDept",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "None" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "None (Top Level Root)"
										}), parentDeptOptions.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: dept.id,
											children: [
												dept.name,
												" (",
												dept.code,
												")"
											]
										}, dept.id))] })]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Location, Budget & capacity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "office",
										className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
										children: "Office Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: office,
										onValueChange: (val) => setOffice(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "office",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Office" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: OFFICES$1.map((off) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: off,
											children: off
										}, off)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "budget",
											children: "Annual Budget (USD)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "budget",
											type: "number",
											value: budget,
											onChange: (e) => setBudget(e.target.value),
											placeholder: "e.g. 250000",
											className: errors.budget ? "border-rose-500" : ""
										}),
										errors.budget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.budget
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "costCenter",
										children: "Cost Center ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "costCenter",
										value: costCenter,
										onChange: (e) => setCostCenter(e.target.value),
										placeholder: "e.g. CC-TECH-100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "employeeCapacity",
											children: "Employee Capacity Limit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "employeeCapacity",
											type: "number",
											value: employeeCapacity,
											onChange: (e) => setEmployeeCapacity(e.target.value),
											placeholder: "e.g. 30",
											className: errors.employeeCapacity ? "border-rose-500" : ""
										}),
										errors.employeeCapacity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.employeeCapacity
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "extensionNumber",
										children: "Phone Extension"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "extensionNumber",
										value: extensionNumber,
										onChange: (e) => setExtensionNumber(e.target.value),
										placeholder: "e.g. 104"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "status",
										children: "Department Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: status,
										onValueChange: (val) => setStatus(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Status" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS$1.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: opt.value,
											children: opt.label
										}, opt.value)) })]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Aesthetics & Theme Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department Theme Color Picker" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2.5 pt-1.5",
									children: THEME_COLORS.map((tc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setThemeColor(tc.hex),
										className: `h-8 w-8 rounded-full border-2 transition-all duration-200 cursor-pointer ${themeColor === tc.hex ? "border-foreground scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"}`,
										style: { backgroundColor: tc.hex },
										title: tc.label
									}, tc.hex))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "iconPicker",
									children: "Department Icon Picker"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: iconName,
									onValueChange: (val) => setIconName(val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "iconPicker",
										className: "h-10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Department Icon" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENT_ICONS.map((di) => {
										const IconComponent = lucide_react_exports[di.name] || CircleQuestionMark;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: di.name,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: di.label })]
											})
										}, di.name);
									}) })]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "mt-6 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							className: "rounded-xl border-border bg-card hover:bg-muted/50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
							style: { background: isEdit ? void 0 : `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` },
							children: isEdit ? "Save Changes" : "Create Department"
						})]
					})
				]
			})]
		})
	});
}
function DepartmentProfileDrawer({ open, onOpenChange, department, departments, onAddEmployee, onRemoveEmployee, onTransferEmployee, onPromoteEmployee, onUpdateDepartment }) {
	const ws = useofc360();
	const [promoteOpen, setPromoteOpen] = (0, import_react.useState)(false);
	const [empToPromote, setEmpToPromote] = (0, import_react.useState)(null);
	const [newDesignation, setNewDesignation] = (0, import_react.useState)("");
	if (!department) return null;
	const IconComponent = lucide_react_exports[department.iconName] || Building2;
	const teamMembers = ws.employees.filter((e) => e.department && e.department.toLowerCase() === department.name.toLowerCase() || department.employeeIds.includes(e.id));
	const addableEmployees = ws.employees.filter((e) => (!e.department || e.department.toLowerCase() !== department.name.toLowerCase()) && !department.employeeIds.includes(e.id));
	const statusColors = {
		active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		inactive: "bg-slate-500/10 text-slate-500 border-slate-500/20",
		hiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		growing: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	};
	const statusLabels = {
		active: "Active",
		inactive: "Inactive",
		hiring: "Hiring",
		growing: "Growing"
	};
	const handleHiringStatusChange = (val) => {
		onUpdateDepartment({
			...department,
			hiringStatus: val,
			openPositions: val === "open" ? Math.max(1, department.openPositions) : 0,
			recentActivity: [{
				id: `act_${Date.now()}`,
				action: `Hiring status updated to ${val.toUpperCase()}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}, ...department.recentActivity]
		});
		toast.success(`Hiring status set to ${val.toUpperCase()}`);
	};
	const handlePromoteClick = (empId, name, currentDesg) => {
		setEmpToPromote({
			id: empId,
			name,
			designation: currentDesg
		});
		setNewDesignation(currentDesg);
		setPromoteOpen(true);
	};
	const handleConfirmPromote = () => {
		if (empToPromote && newDesignation.trim()) {
			onPromoteEmployee(empToPromote.id, newDesignation.trim());
			toast.success(`${empToPromote.name} promoted to ${newDesignation.trim()}`);
			setPromoteOpen(false);
			setEmpToPromote(null);
		}
	};
	const handleAddEmployeeSelect = (empId) => {
		if (department.employeeIds.length >= department.employeeCapacity) {
			toast.warning("Department has reached its maximum employee capacity limit!");
			return;
		}
		onAddEmployee(department.id, empId);
		toast.success("Employee assigned to department successfully");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md md:max-w-xl border-l border-border bg-card/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full z-40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
				className: "p-6 border-b border-border/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm flex-shrink-0",
						style: { background: `linear-gradient(135deg, ${department.themeColor}, ${department.themeColor}cc)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "text-xl font-bold truncate text-foreground flex items-center gap-2",
								children: department.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-mono font-medium text-muted-foreground",
								children: ["Code: ", department.code]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `px-2 py-0.5 text-xs font-semibold ${statusColors[department.status]}`,
									children: statusLabels[department.status]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "px-2 py-0.5 text-xs font-medium",
									children: ["CC ID: ", department.costCenter]
								})]
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "flex-1 p-6 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-foreground/80 bg-muted/10 border border-border/40 p-3 rounded-xl",
								children: department.description || "No description provided."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Dept Head"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: department.departmentHeadName
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Reporting To"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: department.reportingManagerName
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Office Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: department.office
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Annual Budget"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: fmtBudget(department.budget)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Capacity limit"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: [
												teamMembers.length,
												" / ",
												department.employeeCapacity,
												" employees"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Created Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: fmtDate(department.createdDate)
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/60 bg-card p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Performance Score"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "font-bold text-brand bg-brand/5 border-brand/20 text-[10px]",
										children: [department.performanceScore, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: department.performanceScore,
									className: "h-1.5"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/60 bg-card p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Attendance (Avg)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "font-bold text-emerald-500 bg-emerald-500/5 border-emerald-500/10 text-[10px]",
										children: [department.attendanceScore, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: department.attendanceScore,
									className: "h-1.5"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/50 bg-muted/10 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-amber-500" }), " Hiring Status"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-0.5",
									children: "Control job position recruitment state"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: department.hiringStatus,
									onValueChange: (val) => handleHiringStatusChange(val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 w-[110px] text-xs bg-background",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "open",
											children: "Open (Recruit)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "paused",
											children: "Paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "closed",
											children: "Closed"
										})
									] })]
								})]
							}), department.hiringStatus === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-amber-600 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Recruiting for ",
									department.openPositions,
									" active open positions"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										const pos = department.openPositions + 1;
										onUpdateDepartment({
											...department,
											openPositions: pos
										});
										toast.success("Additional open position added");
									},
									className: "h-6 text-[10px] bg-background hover:bg-muted text-foreground border border-border/80 px-2 rounded-md",
									children: "+ Inc Position"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
										" Team Members (",
										teamMembers.length,
										")"
									]
								}), addableEmployees.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									onValueChange: handleAddEmployeeSelect,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
										className: "h-8 w-[160px] text-xs bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 rounded-xl border-none cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), "Add Employee"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: addableEmployees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: e.id,
										children: [
											e.fullName,
											" (",
											e.designation || "No Title",
											")"
										]
									}, e.id)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 max-h-[300px] overflow-y-auto pr-1",
								children: teamMembers.length > 0 ? teamMembers.map((emp) => {
									const initials = emp.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");
									const hue = Array.from(emp.fullName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/15 transition-all duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-inner flex-shrink-0",
												style: { background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))` },
												children: initials
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													onClick: () => toast.info(`Viewing employee profiles: ${emp.fullName}`),
													className: "text-xs font-semibold text-foreground truncate cursor-pointer hover:underline",
													children: emp.fullName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-muted-foreground truncate",
													children: emp.designation
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => handlePromoteClick(emp.id, emp.fullName, emp.designation),
													title: "Promote Employee",
													className: "h-7 w-7 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground hover:text-brand",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "h-4 w-4" })
												}),
												departments.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													onValueChange: (targetDeptId) => {
														onTransferEmployee(department.id, targetDeptId, emp.id);
														const targetDept = departments.find((d) => d.id === targetDeptId);
														toast.success(`Transferred ${emp.fullName} to ${targetDept?.name}`);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-7 w-7 p-0 rounded-lg hover:bg-muted/50 border-none bg-transparent hover:text-foreground text-muted-foreground cursor-pointer justify-center flex",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-4 w-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.filter((d) => d.id !== department.id).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: d.id,
														children: ["Transfer to ", d.name]
													}, d.id)) })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => {
														onRemoveEmployee(department.id, emp.id);
														toast.success(`Removed ${emp.fullName} from ${department.name}`);
													},
													title: "Remove Employee",
													className: "h-7 w-7 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-4 w-4" })
												})
											]
										})]
									}, emp.id);
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground italic p-3 text-center border border-dashed border-border rounded-xl",
									children: "No employees assigned to this department division."
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " Recent Activities"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 relative border-l border-border/80 ml-2 pl-4 py-1",
								children: department.recentActivity && department.recentActivity.length > 0 ? department.recentActivity.map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-card bg-brand" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground leading-tight",
											children: act.action
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												fmtDate(act.timestamp),
												" at ",
												new Date(act.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												})
											]
										})
									]
								}, act.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground italic pl-1",
									children: "No activities logged recently"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " Department Guidelines & Documents"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: department.documents && department.documents.length > 0 ? department.documents.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-all duration-200 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-foreground truncate",
												children: doc.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[9px] text-muted-foreground",
												children: [
													doc.size,
													" • Uploaded ",
													fmtDate(doc.date)
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0",
										children: "Download"
									})]
								}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground italic p-3 text-center border border-dashed border-border rounded-xl",
									children: "No documents uploaded yet."
								})
							})]
						})
					]
				})
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: promoteOpen,
		onOpenChange: setPromoteOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-bold text-lg",
					children: "Promote Employee Designation"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Employee Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: empToPromote?.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Current Designation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground italic",
								children: empToPromote?.designation
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "newDesignation",
								children: "New Corporate Designation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "newDesignation",
								value: newDesignation,
								onChange: (e) => setNewDesignation(e.target.value),
								placeholder: "e.g. Lead Frontend Architect"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex gap-2 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setPromoteOpen(false),
						className: "rounded-xl border-border bg-card",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleConfirmPromote,
						className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
						children: "Promote Employee"
					})]
				})
			]
		})
	})] });
}
function DepartmentHierarchy({ departments, onView }) {
	const treeData = (0, import_react.useMemo)(() => {
		const map = {};
		const roots = [];
		departments.forEach((d) => {
			map[d.id] = {
				id: d.id,
				name: d.name,
				code: d.code,
				headName: d.departmentHeadName,
				themeColor: d.themeColor,
				iconName: d.iconName,
				children: [],
				childrenCount: d.currentEmployeeCount
			};
		});
		departments.forEach((d) => {
			const node = map[d.id];
			if (d.parentId && map[d.parentId]) map[d.parentId].children.push(node);
			else roots.push(node);
		});
		return roots;
	}, [departments]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-sm font-semibold text-foreground flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-brand" }), " Corporate Reporting Structure"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Explore reporting branches from main root business divisions down to agile functional teams."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border border-border/40 rounded-xl bg-background/20 p-5 overflow-x-auto min-h-[300px]",
			children: treeData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4 min-w-[500px]",
				children: treeData.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeNode, {
					node,
					departments,
					onView,
					depth: 0
				}, node.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground italic text-center py-12",
				children: "No department tree matches. Create a department structure to display hierarchy."
			})
		})]
	});
}
function TreeNode({ node, departments, onView, depth }) {
	const [expanded, setExpanded] = (0, import_react.useState)(true);
	const dept = departments.find((d) => d.id === node.id);
	const IconComponent = lucide_react_exports[node.iconName] || Building2;
	const hasChildren = node.children && node.children.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 relative",
			children: [depth > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute border-l border-b border-border/80 rounded-bl-lg",
				style: {
					left: `${(depth - 1) * 32 + 12}px`,
					width: "20px",
					height: "22px",
					top: "-10px"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/10 hover:border-brand/40 shadow-sm transition-all duration-300 w-full max-w-lg cursor-pointer",
				style: { marginLeft: `${depth * 32}px` },
				onClick: () => dept && onView(dept),
				children: [
					hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							setExpanded(!expanded);
						},
						className: "h-5 w-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0",
						children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 flex-shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0",
						style: { backgroundColor: node.themeColor },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground truncate",
								children: node.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground truncate flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
									" ",
									node.headName || "Unassigned"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[9px] font-semibold tracking-wider font-mono",
								children: node.code
							}), dept && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground flex items-center gap-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
									" ",
									dept.currentEmployeeCount
								]
							})]
						})]
					})
				]
			})]
		}), expanded && hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute border-l border-border/80",
				style: {
					left: `${depth * 32 + 12}px`,
					top: "-4px",
					bottom: "16px"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: node.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeNode, {
					node: child,
					departments,
					onView,
					depth: depth + 1
				}, child.id))
			})]
		})]
	});
}
function DepartmentAnalytics({ departments }) {
	const mounted = useMounted();
	const headcountData = departments.map((d) => ({
		name: d.code,
		value: d.currentEmployeeCount,
		color: d.themeColor
	}));
	const budgetData = departments.map((d) => ({
		name: d.code,
		budget: d.budget,
		color: d.themeColor
	}));
	const hiringData = departments.map((d) => ({
		name: d.code,
		current: d.currentEmployeeCount,
		capacity: d.employeeCapacity,
		positions: d.openPositions
	}));
	const metricsData = departments.map((d) => ({
		name: d.code,
		performance: d.performanceScore,
		attendance: d.attendanceScore
	}));
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card/90 p-3 shadow-lg text-xs leading-none backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold mb-2 text-foreground",
				children: label || payload[0].payload.name
			}), payload.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1",
				style: { color: p.color || p.fill },
				children: [
					p.name,
					": ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: p.value.toLocaleString()
					})
				]
			}, idx))]
		});
		return null;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 md:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "h-4 w-4 text-brand" }), " Headcount Distribution"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: headcountData,
								cx: "50%",
								cy: "45%",
								innerRadius: 60,
								outerRadius: 85,
								paddingAngle: 4,
								dataKey: "value",
								children: headcountData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								verticalAlign: "bottom",
								height: 36,
								iconType: "circle",
								wrapperStyle: {
									fontSize: "10px",
									marginTop: "10px"
								}
							})
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-emerald-500" }), " Budget Utilization (Annual USD)"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: budgetData,
							margin: {
								top: 10,
								right: 10,
								left: -10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false,
									tickFormatter: (value) => `$${value / 1e3}k`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "budget",
									radius: [
										6,
										6,
										0,
										0
									],
									name: "Annual Budget",
									children: budgetData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-amber-500" }), " Department Capacity & Open Positions"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: hiringData,
							margin: {
								top: 10,
								right: 10,
								left: -10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "10px" } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "current",
									fill: "#3b82f6",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Current Employees"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "capacity",
									fill: "#e2e8f0",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Total Capacity Limit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "positions",
									fill: "#f59e0b",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Open Job Vacancies"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4 text-rose-500" }), " Performance vs Attendance Scores"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: metricsData,
							margin: {
								top: 10,
								right: 15,
								left: -15,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false,
									domain: [50, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "10px" } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "performance",
									stroke: "#ec4899",
									strokeWidth: 2.5,
									activeDot: { r: 6 },
									name: "Performance Score (%)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "attendance",
									stroke: "#10b981",
									strokeWidth: 2.5,
									activeDot: { r: 6 },
									name: "Attendance Score (%)"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			})
		]
	});
}
function ImportDialog({ open, onOpenChange, existingDepartments, onImport }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [parsedRows, setParsedRows] = (0, import_react.useState)([]);
	const [hasErrors, setHasErrors] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const resetState = () => {
		setFile(null);
		setParsedRows([]);
		setHasErrors(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile && droppedFile.name.endsWith(".csv")) processFile(droppedFile);
		else toast.error("Please upload a CSV template file");
	};
	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) processFile(selectedFile);
	};
	const parseCSVLine = (text) => {
		const result = [];
		let insideQuote = false;
		let entry = "";
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if (char === "\"") insideQuote = !insideQuote;
			else if (char === "," && !insideQuote) {
				result.push(entry.trim());
				entry = "";
			} else entry += char;
		}
		result.push(entry.trim());
		return result;
	};
	const processFile = (file) => {
		setFile(file);
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			if (!text) {
				toast.error("Unreadable or empty file structure");
				return;
			}
			const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
			if (lines.length <= 1) {
				toast.error("CSV must contain a header row and at least one data row");
				return;
			}
			const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, "").toLowerCase().trim());
			const fieldMap = {
				"department name": "name",
				"departmentname": "name",
				"name": "name",
				"code": "code",
				"dept code": "code",
				"deptcode": "code",
				"description": "description",
				"department head": "departmentHeadName",
				"departmenthead": "departmentHeadName",
				"head": "departmentHeadName",
				"reporting to": "reportingManagerName",
				"reportingmanager": "reportingManagerName",
				"office": "office",
				"office location": "office",
				"officelocation": "office",
				"budget": "budget",
				"annual budget": "budget",
				"cost center": "costCenter",
				"costcenter": "costCenter",
				"capacity": "employeeCapacity",
				"capacity limit": "employeeCapacity",
				"status": "status"
			};
			const rows = [];
			let globalError = false;
			for (let i = 1; i < lines.length; i++) {
				const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());
				const raw = {};
				const draft = {};
				headers.forEach((h, idx) => {
					const val = values[idx] || "";
					raw[h] = val;
					const key = fieldMap[h];
					if (key) if (key === "budget") draft.budget = val ? parseFloat(val) : 0;
					else if (key === "employeeCapacity") draft.employeeCapacity = val ? parseInt(val) : 30;
					else draft[key] = val;
				});
				const rowErrors = [];
				const rowWarnings = [];
				if (!draft.name) rowErrors.push("Department name is required");
				if (!draft.code) rowErrors.push("Department code is required");
				if (!draft.office) rowErrors.push("Office location is required");
				if (!draft.departmentHeadName) rowErrors.push("Department head is required");
				if (draft.budget !== void 0 && draft.budget < 0) rowErrors.push("Budget must be positive");
				if (draft.employeeCapacity !== void 0 && draft.employeeCapacity < 0) rowErrors.push("Capacity cannot be negative");
				if (draft.name) {
					const dupLocal = rows.find((r) => r.data.name?.toLowerCase() === draft.name?.toLowerCase());
					const dupDb = existingDepartments.find((d) => d.name.toLowerCase() === draft.name.toLowerCase());
					if (dupLocal || dupDb) rowErrors.push(`Duplicate Name: ${draft.name}`);
				}
				if (draft.code) {
					const dupLocal = rows.find((r) => r.data.code?.toUpperCase() === draft.code?.toUpperCase());
					const dupDb = existingDepartments.find((d) => d.code.toUpperCase() === draft.code.toUpperCase());
					if (dupLocal || dupDb) rowErrors.push(`Duplicate Code: ${draft.code}`);
				}
				if (rowErrors.length > 0) globalError = true;
				rows.push({
					rowNum: i + 1,
					data: draft,
					errors: rowErrors,
					warnings: rowWarnings,
					raw
				});
			}
			setParsedRows(rows);
			setHasErrors(globalError);
			if (globalError) toast.warning("Validation errors found in spreadsheet. Clean columns before importing.");
			else toast.success(`Validated ${rows.length} rows successfully.`);
		};
		reader.readAsText(file);
	};
	const handleImport = () => {
		if (parsedRows.length === 0) {
			toast.error("No valid lines parsed to import");
			return;
		}
		if (hasErrors) {
			toast.error("Cannot import rows with errors. Upload a clean CSV template.");
			return;
		}
		const importedDepartments = parsedRows.map((r, idx) => {
			const d = r.data;
			const office = OFFICES$1.includes(d.office || "") ? d.office : OFFICES$1[0];
			return {
				id: `dept_imported_${Math.random().toString(36).substr(2, 9)}`,
				name: d.name || "Imported Department",
				code: (d.code || "IMP").toUpperCase(),
				description: d.description || "Uploaded via batch importer",
				departmentHeadId: null,
				departmentHeadName: d.departmentHeadName || "Unassigned",
				reportingManagerId: null,
				reportingManagerName: d.reportingManagerName || "None",
				office,
				budget: d.budget || 0,
				costCenter: d.costCenter || `CC-IMP-${idx + 1}`,
				employeeCapacity: d.employeeCapacity || 30,
				currentEmployeeCount: 0,
				extensionNumber: d.extensionNumber || "",
				status: d.status || "active",
				themeColor: "#64748b",
				iconName: "Building2",
				parentId: null,
				parentName: "None",
				createdDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				employeeIds: [],
				openPositions: 0,
				performanceScore: 85,
				attendanceScore: 92,
				hiringStatus: "closed",
				recentActivity: [{
					id: `act_imp_${Date.now()}`,
					action: "Imported via CSV upload",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				}],
				documents: []
			};
		});
		onImport(importedDepartments);
		toast.success(`Batch Import Complete: ${importedDepartments.length} departments added`);
		resetState();
		onOpenChange(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["Department Name,Code,Description,Department Head,Reporting To,Office Location,Budget,Cost Center,Capacity,Status", "\nLogistics & Supply,LSC,Handles supplier pipelines,Ali Hassan,None,Dubai Office,150000,CC-OPS-500,25,active"], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "ofc360_departments_import_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV spreadsheet template downloaded");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (val) => {
			onOpenChange(val);
			if (!val) resetState();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold flex items-center gap-2",
					children: "📂 Import Departments"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Import Departments Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Download the standardized CSV layout, add department specifics, budget ranges, capacity caps, and drop it."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: downloadTemplate,
							className: "text-xs font-semibold rounded-xl border-border bg-card hover:bg-muted",
							children: "📥 Download CSV Template"
						})]
					}), !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: handleDragOver,
						onDrop: handleDrop,
						onClick: () => fileInputRef.current?.click(),
						className: "border-2 border-dashed border-border/80 hover:border-brand/60 rounded-2xl p-8 text-center cursor-pointer bg-card/20 hover:bg-card/40 transition-all duration-300 group flex flex-col items-center justify-center min-h-[180px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								ref: fileInputRef,
								onChange: handleFileChange,
								accept: ".csv",
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-2xl bg-muted group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center text-muted-foreground transition-colors mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-foreground",
								children: ["Drag & drop your departments CSV, or ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand hover:underline",
									children: "browse files"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Supports CSV formats (Max 5MB)"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground truncate max-w-[250px]",
										children: file.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											(file.size / 1024).toFixed(1),
											" KB • ",
											parsedRows.length,
											" departments detected"
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: resetState,
									className: "text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg",
									children: "Remove File"
								})]
							}),
							parsedRows.some((r) => r.errors.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-rose-500 font-semibold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), "Validation Errors Found in Spreadsheet"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
									className: "max-h-[120px] pr-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-xs text-muted-foreground",
										children: parsedRows.map((row) => {
											if (row.errors.length === 0) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-foreground flex-shrink-0",
													children: [
														"Row ",
														row.rowNum,
														":"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: row.errors.join(", ")
												})]
											}, row.rowNum);
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Import Preview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border/80 overflow-hidden bg-card/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
										className: "max-h-[220px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
											className: "bg-muted/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "w-[80px]",
													children: "Row"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Dept Code" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Department Name" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Head Manager" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Budget" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Office" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: parsedRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: row.errors.length > 0 ? "bg-rose-500/5" : "",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-mono text-xs",
													children: row.rowNum
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-mono text-xs",
													children: row.data.code || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-semibold",
													children: row.data.name || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.departmentHeadName || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-semibold",
													children: row.data.budget ? `$${row.data.budget.toLocaleString()}` : "$0"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.office || "Bengaluru HQ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.errors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] px-1 py-0",
													children: "Error"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] px-1 py-0",
													children: "Valid"
												}) })
											]
										}, row.rowNum)) })] })
									})
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4 flex gap-2 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							onOpenChange(false);
							resetState();
						},
						className: "rounded-xl border-border bg-card hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: handleImport,
						disabled: !file || hasErrors,
						className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2" }), "Complete Import"]
					})]
				})
			]
		})
	});
}
function DepartmentsPage() {
	const ws = useofc360();
	const { departments, createDepartment, updateDepartment, deleteDepartment, bulkDelete, bulkSetStatus, bulkAssignManager, importDepartments, addEmployeeToDept, removeEmployeeFromDept, transferEmployees, promoteEmployee } = useDepartments();
	const [activeTab, setActiveTab] = (0, import_react.useState)("directory");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({ ...DEFAULT_FILTERS$2 });
	const [showAdvancedFilters, setShowAdvancedFilters] = (0, import_react.useState)(false);
	const [sortField, setSortField] = (0, import_react.useState)("name");
	const [sortDir, setSortDir] = (0, import_react.useState)("asc");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(10);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [activeDept, setActiveDept] = (0, import_react.useState)(null);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [profileDept, setProfileDept] = (0, import_react.useState)(null);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [bulkAssignManagerOpen, setBulkAssignManagerOpen] = (0, import_react.useState)(false);
	const [bulkManagerId, setBulkManagerId] = (0, import_react.useState)("");
	const [bulkTransferOpen, setBulkTransferOpen] = (0, import_react.useState)(false);
	const [bulkTransferTargetDeptId, setBulkTransferTargetDeptId] = (0, import_react.useState)("");
	const [deleteAlertOpen, setDeleteAlertOpen] = (0, import_react.useState)(false);
	const [deptToDelete, setDeptToDelete] = (0, import_react.useState)(null);
	const [cannotDeleteAlertOpen, setCannotDeleteAlertOpen] = (0, import_react.useState)(false);
	const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = (0, import_react.useState)(false);
	const [cannotBulkDeleteAlertOpen, setCannotBulkDeleteAlertOpen] = (0, import_react.useState)(false);
	const managers = useManagersList();
	const processedDepartments = (0, import_react.useMemo)(() => {
		return applySorting(applyFilters(departments, searchQuery, filters), sortField, sortDir);
	}, [
		departments,
		searchQuery,
		filters,
		sortField,
		sortDir
	]);
	const paginatedDepartments = (0, import_react.useMemo)(() => {
		return paginate(processedDepartments, currentPage, perPage);
	}, [
		processedDepartments,
		currentPage,
		perPage
	]);
	const totalPages = Math.ceil(processedDepartments.length / perPage);
	const handleSort = (field) => {
		if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortDir("asc");
		}
		setCurrentPage(1);
	};
	const handleSelectAll = (checked) => {
		if (checked) setSelectedIds(paginatedDepartments.map((d) => d.id));
		else setSelectedIds([]);
	};
	const handleSelectRow = (id, checked) => {
		if (checked) setSelectedIds((prev) => [...prev, id]);
		else setSelectedIds((prev) => prev.filter((x) => x !== id));
	};
	const handleAddClick = () => {
		setActiveDept(null);
		setFormOpen(true);
	};
	const handleEditClick = (d) => {
		setActiveDept(d);
		setFormOpen(true);
	};
	const handleDeleteClick = (d) => {
		if (ws.employees.filter((e) => e.department && e.department.toLowerCase() === d.name.toLowerCase() || d.employeeIds.includes(e.id)).length > 0) {
			setDeptToDelete(d);
			setCannotDeleteAlertOpen(true);
		} else {
			setDeptToDelete(d);
			setDeleteAlertOpen(true);
		}
	};
	const handleConfirmDelete = () => {
		if (deptToDelete) {
			deleteDepartment(deptToDelete.id);
			setSelectedIds((prev) => prev.filter((id) => id !== deptToDelete.id));
			toast.success("Department Deleted Successfully");
			setDeleteAlertOpen(false);
			setDeptToDelete(null);
		}
	};
	const handleViewClick = (d) => {
		setProfileDept(d);
		setProfileOpen(true);
	};
	const handleSaveDepartment = (d) => {
		if (departments.some((dept) => dept.id === d.id)) {
			updateDepartment(d);
			if (profileDept?.id === d.id) setProfileDept(d);
		} else createDepartment(d);
	};
	const handleBulkDeleteClick = () => {
		if (selectedIds.some((id) => {
			const dept = departments.find((d) => d.id === id);
			if (!dept) return false;
			return ws.employees.filter((e) => e.department && e.department.toLowerCase() === dept.name.toLowerCase() || dept.employeeIds.includes(e.id)).length > 0;
		})) setCannotBulkDeleteAlertOpen(true);
		else setBulkDeleteAlertOpen(true);
	};
	const handleConfirmBulkDelete = () => {
		bulkDelete(selectedIds);
		toast.success(`${selectedIds.length} Departments Deleted Successfully`);
		setSelectedIds([]);
		setBulkDeleteAlertOpen(false);
	};
	const handleBulkStatusChange = (status) => {
		bulkSetStatus(selectedIds, status);
		toast.success(`${selectedIds.length} Departments ${{
			active: "Activated",
			inactive: "Deactivated",
			hiring: "Hired Status Opened",
			growing: "Growing Status Set"
		}[status]} Successfully`);
		setSelectedIds([]);
	};
	const handleBulkAssignManagerClick = () => {
		setBulkManagerId(managers[0]?.id || "");
		setBulkAssignManagerOpen(true);
	};
	const handleConfirmBulkAssignManager = () => {
		const mgr = managers.find((m) => m.id === bulkManagerId);
		if (mgr) {
			bulkAssignManager(selectedIds, mgr.id, mgr.fullName);
			toast.success(`Assigned ${mgr.fullName} as Head Manager of ${selectedIds.length} departments`);
			setSelectedIds([]);
			setBulkAssignManagerOpen(false);
		}
	};
	const handleBulkTransferClick = () => {
		setBulkTransferTargetDeptId(departments.filter((d) => !selectedIds.includes(d.id))[0]?.id || "");
		setBulkTransferOpen(true);
	};
	const handleConfirmBulkTransfer = () => {
		const targetDept = departments.find((d) => d.id === bulkTransferTargetDeptId);
		if (targetDept) {
			selectedIds.forEach((fromId) => {
				transferEmployees(fromId, targetDept.id);
			});
			toast.success(`Transferred employees from selected divisions into ${targetDept.name}`);
			setSelectedIds([]);
			setBulkTransferOpen(false);
		}
	};
	const handleClearFilters = () => {
		setSearchQuery("");
		setFilters({ ...DEFAULT_FILTERS$2 });
		setCurrentPage(1);
		toast.success("Filters Reset Successfully");
	};
	const handleExportCSV = () => {
		const data = selectedIds.length > 0 ? departments.filter((d) => selectedIds.includes(d.id)) : processedDepartments;
		if (data.length === 0) {
			toast.error("No departments available to export");
			return;
		}
		const csvContent = buildCSV(data);
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `ofc360_departments_export_${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV Export Completed Successfully");
	};
	const handleExportExcel = () => {
		handleExportCSV();
	};
	const handleExportPDF = () => {
		const data = selectedIds.length > 0 ? departments.filter((d) => selectedIds.includes(d.id)) : processedDepartments;
		if (data.length === 0) {
			toast.error("No departments available to export");
			return;
		}
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			toast.error("Popup blocked! Enable popups to export as PDF.");
			return;
		}
		const rowsHTML = data.map((d) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${d.code}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${d.name}</td>
        <td style="padding: 10px; font-size: 11px;">${d.departmentHeadName}</td>
        <td style="padding: 10px; font-size: 11px;">${d.office}</td>
        <td style="padding: 10px; font-size: 11px;">${d.currentEmployeeCount} / ${d.employeeCapacity}</td>
        <td style="padding: 10px; font-size: 11px;">$${d.budget.toLocaleString()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.createdDate}</td>
      </tr>
    `).join("");
		printWindow.document.write(`
      <html>
        <head>
          <title>Departments Directory - ofc360 HRMS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            p { font-size: 12px; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Departments Directory</h1>
          <p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()} • Total Records: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Head Manager</th>
                <th>Office Location</th>
                <th>Employees / Cap</th>
                <th>Annual Budget</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          <\/script>
        </body>
      </html>
    `);
		printWindow.document.close();
		toast.success("PDF Printing Triggered");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Departments Manager",
					description: "Design division frameworks, allocate corporate budgets, configure hierarchy trees, and balance employee capacities."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setImportOpen(true),
						variant: "outline",
						className: "rounded-xl border-border bg-card/60 hover:bg-muted text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Import CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleAddClick,
						className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Department"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between border-b border-border/80 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/40 p-1 rounded-xl h-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "directory",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3.5 w-3.5" }), "List Directory"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "hierarchy",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-3.5 w-3.5" }), "Reporting Hierarchy"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "analytics",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, { className: "h-3.5 w-3.5" }), "Charts & Analytics"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "directory",
						className: "space-y-6 mt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentStatsCards, { departments }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-1 items-center gap-2 max-w-lg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Search by department name, code, head, manager or office...",
													value: searchQuery,
													onChange: (e) => {
														setSearchQuery(e.target.value);
														setCurrentPage(1);
													},
													className: "pl-9 pr-4 rounded-xl border-border/80 bg-background/50 h-9 text-xs focus-visible:ring-brand"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setShowAdvancedFilters(!showAdvancedFilters),
												className: `rounded-xl border-border/80 h-9 gap-1.5 text-xs font-medium cursor-pointer ${showAdvancedFilters ? "bg-muted text-foreground" : "bg-background/40 hover:bg-muted/40"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), "Filters"]
											}),
											(searchQuery || Object.values(filters).some((v) => v && v !== "all")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleClearFilters,
												className: "text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer h-9 px-2 rounded-xl",
												children: "Reset"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 justify-end",
										children: [selectedIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground mr-1",
												children: [selectedIds.length, " selected:"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "sm",
													className: "rounded-xl border-border/80 h-9 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer",
													children: "Bulk Actions"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
												align: "end",
												className: "rounded-xl border-border bg-card",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
														className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
														children: "Modify Status"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => handleBulkStatusChange("active"),
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5 text-emerald-500" }), "Activate Departments"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => handleBulkStatusChange("inactive"),
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5 text-rose-500" }), "Deactivate Departments"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-border/60" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
														className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
														children: "Management Scope"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: handleBulkAssignManagerClick,
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-blue-500" }), "Assign Head Manager"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: handleBulkTransferClick,
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-3.5 w-3.5 text-purple-500" }), "Transfer Employees"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-border/60" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: handleBulkDeleteClick,
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Selected"]
													})
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "rounded-xl border-border/80 h-9 gap-1.5 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Export"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "rounded-xl border-border bg-card",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
													className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
													children: "Download Options"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportCSV,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-500" }), "Export CSV"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportExcel,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-600" }), "Export Excel"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportPDF,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-rose-500" }), "Export PDF / Print"]
												})
											]
										})] })]
									})]
								}),
								showAdvancedFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in duration-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.status,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														status: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Statuses" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Statuses"
												}), STATUS_OPTIONS$1.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: opt.value,
													children: opt.label
												}, opt.value))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Office Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.office,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														office: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Locations" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Locations"
												}), OFFICES$1.map((off) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: off,
													children: off
												}, off))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Employee Count"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.employeeCountRange,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														employeeCountRange: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Any Size" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EMPLOYEE_COUNT_RANGES.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: opt.value,
													children: opt.label
												}, opt.value)) })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Department Head"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.managerId,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														managerId: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Managers" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Managers"
												}), managers.map((mgr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: mgr.id,
													children: mgr.fullName
												}, mgr.id))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Created Since"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: filters.createdDateFrom,
												onChange: (e) => {
													setFilters((prev) => ({
														...prev,
														createdDateFrom: e.target.value
													}));
													setCurrentPage(1);
												},
												className: "h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
											})]
										})
									]
								}),
								processedDepartments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-lg text-foreground",
											children: "No Departments Found"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground max-w-sm",
											children: departments.length === 0 ? "Create your first department division to organize your corporate directory hierarchy." : "No corporate divisions match your search query. Try clearing filters."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: departments.length === 0 ? handleAddClick : handleClearFilters,
											className: "mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer",
											children: departments.length === 0 ? "Create Department" : "Reset Filters"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsTable, {
									departments: paginatedDepartments,
									selectedIds,
									onSelectAll: handleSelectAll,
									onSelectRow: handleSelectRow,
									onView: handleViewClick,
									onEdit: handleEditClick,
									onDelete: handleDeleteClick,
									sortField,
									sortDir,
									onSort: handleSort
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row justify-between items-center gap-4 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"Showing ",
												Math.min(processedDepartments.length, (currentPage - 1) * perPage + 1),
												" to",
												" ",
												Math.min(processedDepartments.length, currentPage * perPage),
												" of ",
												processedDepartments.length,
												" entries"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "Per Page:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(perPage),
												onValueChange: (val) => {
													setPerPage(Number(val));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-7 w-[60px] rounded-lg text-xs bg-background px-1 py-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "5",
														children: "5"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "10",
														children: "10"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "25",
														children: "25"
													})
												] })]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
												disabled: currentPage === 1,
												className: "h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
											}),
											Array.from({ length: totalPages }).map((_, i) => {
												const pNum = i + 1;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: currentPage === pNum ? "default" : "outline",
													size: "icon",
													onClick: () => setCurrentPage(pNum),
													className: `h-8 w-8 rounded-lg text-xs font-semibold cursor-pointer ${currentPage === pNum ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90" : "border-border/80 bg-background/50 hover:bg-muted"}`,
													children: pNum
												}, pNum);
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
												disabled: currentPage === totalPages,
												className: "h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
											})
										]
									})]
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "hierarchy",
						className: "mt-0 space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentHierarchy, {
							departments,
							onView: handleViewClick
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "analytics",
						className: "mt-0 space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentAnalytics, { departments })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentFormDialog, {
				open: formOpen,
				onOpenChange: setFormOpen,
				department: activeDept,
				existingDepartments: departments,
				onSave: handleSaveDepartment
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentProfileDrawer, {
				open: profileOpen,
				onOpenChange: setProfileOpen,
				department: profileDept,
				departments,
				onAddEmployee: addEmployeeToDept,
				onRemoveEmployee: removeEmployeeFromDept,
				onTransferEmployee,
				onPromoteEmployee: promoteEmployee,
				onUpdateDepartment: handleSaveDepartment
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, {
				open: importOpen,
				onOpenChange: setImportOpen,
				existingDepartments: departments,
				onImport: importDepartments
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bulkAssignManagerOpen,
				onOpenChange: setBulkAssignManagerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-bold text-lg",
							children: "Assign Department Head Manager"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bulkMgr",
									children: "Select Head Manager"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bulkManagerId,
									onValueChange: setBulkManagerId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "bulkMgr",
										className: "h-10 text-xs bg-background",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Manager" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: managers.map((mgr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: mgr.id,
										children: [
											mgr.fullName,
											" (",
											mgr.designation,
											")"
										]
									}, mgr.id)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground mt-2",
									children: [
										"This will assign the chosen manager as the head lead of all ",
										selectedIds.length,
										" selected divisions."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex gap-2 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setBulkAssignManagerOpen(false),
								className: "rounded-xl border-border bg-card",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleConfirmBulkAssignManager,
								className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
								children: "Assign Manager"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bulkTransferOpen,
				onOpenChange: setBulkTransferOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-bold text-lg",
							children: "Bulk Transfer Employees"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bulkTransferTarget",
									children: "Select Target Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bulkTransferTargetDeptId,
									onValueChange: setBulkTransferTargetDeptId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "bulkTransferTarget",
										className: "h-10 text-xs bg-background",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Division" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.filter((d) => !selectedIds.includes(d.id)).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: d.id,
										children: [
											d.name,
											" (",
											d.code,
											")"
										]
									}, d.id)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-2",
									children: "This will transfer all employees from all selected departments into the chosen target department, leaving the source departments empty."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex gap-2 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setBulkTransferOpen(false),
								className: "rounded-xl border-border bg-card",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleConfirmBulkTransfer,
								className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
								children: "Transfer Employees"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: deleteAlertOpen,
				onOpenChange: setDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg",
						children: "Are you sure you want to delete this department?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"This action is permanent and cannot be undone. This will delete the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: deptToDelete?.name
							}),
							" division from organizational schemas."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							className: "rounded-xl border-border bg-card hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: handleConfirmDelete,
							className: "rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none",
							children: "Delete"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: cannotDeleteAlertOpen,
				onOpenChange: setCannotDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg text-rose-500",
						children: "Cannot Delete Department"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: "This department contains employees. Please transfer them before deleting."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setCannotDeleteAlertOpen(false),
							className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none",
							children: "Acknowledge"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: bulkDeleteAlertOpen,
				onOpenChange: setBulkDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg",
						children: "Confirm Bulk Delete Departments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"Are you sure you want to delete the ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: selectedIds.length
							}),
							" selected departments? This action is irreversible."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							className: "rounded-xl border-border bg-card hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: handleConfirmBulkDelete,
							className: "rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none",
							children: "Delete Selected"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: cannotBulkDeleteAlertOpen,
				onOpenChange: setCannotBulkDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg text-rose-500",
						children: "Cannot Complete Bulk Delete"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: "One or more selected departments contain active employees. Please transfer all employees before attempting deletion."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setCannotBulkDeleteAlertOpen(false),
							className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none",
							children: "Acknowledge"
						})
					})]
				})
			})
		]
	});
	function onTransferEmployee(fromId, toId, empId) {
		const fromDept = departments.find((d) => d.id === fromId);
		const toDept = departments.find((d) => d.id === toId);
		if (fromDept && toDept) addEmployeeToDept(toId, empId);
	}
}
//#endregion
export { DepartmentsPage };
