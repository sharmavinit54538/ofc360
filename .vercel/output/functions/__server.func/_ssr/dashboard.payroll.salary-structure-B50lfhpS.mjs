import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as RefreshCw, Hn as Clock, K as Search, Ln as Copy, T as Trash2, Tn as Eye, Wt as Layers, Yn as CirclePlus, Zn as CircleMinus, at as Plus, ft as Pen, r as X, tr as CircleAlert, u as Users } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.payroll.salary-structure-B50lfhpS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_EARNINGS = [
	{
		id: "e1",
		name: "Basic Salary",
		calc_type: "FIXED",
		value: 35e3
	},
	{
		id: "e2",
		name: "House Rent Allowance (HRA)",
		calc_type: "PERCENT_BASIC",
		value: 40
	},
	{
		id: "e3",
		name: "Special Allowance",
		calc_type: "FIXED",
		value: 15e3
	}
];
var DEFAULT_DEDUCTIONS = [
	{
		id: "d1",
		name: "Provident Fund (PF)",
		calc_type: "PERCENT_BASIC",
		value: 12
	},
	{
		id: "d2",
		name: "Professional Tax (PT)",
		calc_type: "FIXED",
		value: 200
	},
	{
		id: "d3",
		name: "Tax Deducted at Source (TDS)",
		calc_type: "FIXED",
		value: 1500
	}
];
function SalaryStructurePage() {
	const [templates, setTemplates] = (0, import_react.useState)([]);
	const [hero, setHero] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [gradeFilter, setGradeFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [editingTemplate, setEditingTemplate] = (0, import_react.useState)(null);
	const [viewingTemplate, setViewingTemplate] = (0, import_react.useState)(null);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formGrade, setFormGrade] = (0, import_react.useState)("L2");
	const [formEffectiveDate, setFormEffectiveDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [formMinCtc, setFormMinCtc] = (0, import_react.useState)(6e5);
	const [formMaxCtc, setFormMaxCtc] = (0, import_react.useState)(12e5);
	const [formStatus, setFormStatus] = (0, import_react.useState)("ACTIVE");
	const [formEarnings, setFormEarnings] = (0, import_react.useState)(DEFAULT_EARNINGS);
	const [formDeductions, setFormDeductions] = (0, import_react.useState)(DEFAULT_DEDUCTIONS);
	async function loadData() {
		setIsLoading(true);
		try {
			const res = await api.get("payroll/salary-structure");
			if (res && res.success !== false) {
				const data = res.data || res;
				setTemplates(data.templates || data.items || (Array.isArray(data) ? data : []));
				setHero(data.hero || data.metrics || null);
			}
		} catch (err) {
			console.error("Failed to load salary structures:", err);
			toast.error(err?.message || "Failed to load salary structures from server.");
		} finally {
			setIsLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	function openCreateDialog() {
		setEditingTemplate(null);
		setFormName("");
		setFormGrade("L2");
		setFormEffectiveDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setFormMinCtc(6e5);
		setFormMaxCtc(12e5);
		setFormStatus("ACTIVE");
		setFormEarnings(DEFAULT_EARNINGS);
		setFormDeductions(DEFAULT_DEDUCTIONS);
		setIsDialogOpen(true);
	}
	function openEditDialog(template) {
		setEditingTemplate(template);
		setFormName(template.name);
		setFormGrade(template.grade);
		setFormEffectiveDate(template.effective_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setFormMinCtc(template.min_ctc || 0);
		setFormMaxCtc(template.max_ctc || 0);
		setFormStatus(template.status || "ACTIVE");
		setFormEarnings(template.earnings && template.earnings.length > 0 ? template.earnings : DEFAULT_EARNINGS);
		setFormDeductions(template.deductions && template.deductions.length > 0 ? template.deductions : DEFAULT_DEDUCTIONS);
		setIsDialogOpen(true);
	}
	async function handleSaveTemplate() {
		if (!formName.trim()) {
			toast.error("Template name is required.");
			return;
		}
		setIsSaving(true);
		try {
			const payload = {
				name: formName,
				grade: formGrade,
				effective_date: formEffectiveDate,
				min_ctc: Number(formMinCtc) || 0,
				max_ctc: Number(formMaxCtc) || 0,
				status: formStatus,
				earnings: formEarnings,
				deductions: formDeductions
			};
			if (editingTemplate) {
				const res = await api.put(`payroll/salary-structure/${editingTemplate.id}`, payload);
				if (res && res.success !== false) {
					toast.success("Salary structure updated successfully!");
					setIsDialogOpen(false);
					setEditingTemplate(null);
					loadData();
				} else toast.error(res?.message || "Failed to update salary structure.");
			} else {
				const res = await api.post("payroll/salary-structure", payload);
				if (res && res.success !== false) {
					toast.success("Salary structure created successfully!");
					setIsDialogOpen(false);
					loadData();
				} else toast.error(res?.message || "Failed to create salary structure.");
			}
		} catch (err) {
			console.error("Error saving salary structure:", err);
			toast.error(err?.message || "Error saving salary structure to server.");
		} finally {
			setIsSaving(false);
		}
	}
	async function handleDuplicateTemplate(template) {
		try {
			const payload = {
				name: `${template.name} (Copy)`,
				grade: template.grade,
				min_ctc: template.min_ctc,
				max_ctc: template.max_ctc,
				status: "DRAFT",
				earnings: template.earnings,
				deductions: template.deductions
			};
			const res = await api.post("payroll/salary-structure", payload);
			if (res && res.success !== false) {
				toast.success("Salary structure duplicated!");
				loadData();
			} else toast.error(res?.message || "Failed to duplicate template.");
		} catch (err) {
			console.error("Duplicate template error:", err);
			toast.error(err?.message || "Failed to duplicate template.");
		}
	}
	async function handleDeleteTemplate() {
		if (!deletingId) return;
		setIsDeleting(true);
		try {
			const res = await api.delete(`payroll/salary-structure/${deletingId}`);
			if (res && res.success !== false) {
				toast.success("Salary structure deleted successfully!");
				setDeletingId(null);
				loadData();
			} else toast.error(res?.message || "Failed to delete salary structure.");
		} catch (err) {
			console.error("Delete template error:", err);
			toast.error(err?.message || "Failed to delete salary structure.");
		} finally {
			setIsDeleting(false);
		}
	}
	function addEarningRow() {
		setFormEarnings((prev) => [...prev, {
			id: `e_${Date.now()}`,
			name: "New Allowance",
			calc_type: "FIXED",
			value: 0
		}]);
	}
	function removeEarningRow(id) {
		setFormEarnings((prev) => prev.filter((r) => r.id !== id));
	}
	function updateEarningRow(id, field, val) {
		setFormEarnings((prev) => prev.map((r) => r.id === id ? {
			...r,
			[field]: val
		} : r));
	}
	function addDeductionRow() {
		setFormDeductions((prev) => [...prev, {
			id: `d_${Date.now()}`,
			name: "New Deduction",
			calc_type: "FIXED",
			value: 0
		}]);
	}
	function removeDeductionRow(id) {
		setFormDeductions((prev) => prev.filter((r) => r.id !== id));
	}
	function updateDeductionRow(id, field, val) {
		setFormDeductions((prev) => prev.map((r) => r.id === id ? {
			...r,
			[field]: val
		} : r));
	}
	const liveBreakup = (0, import_react.useMemo)(() => {
		const basicRow = formEarnings.find((e) => e.name.toLowerCase().includes("basic"));
		const basicVal = basicRow ? Number(basicRow.value) || 0 : 35e3;
		const gross = formEarnings.reduce((sum, row) => {
			const v = Number(row.value) || 0;
			if (row.calc_type === "FIXED") return sum + v;
			if (row.calc_type === "PERCENT_BASIC") return sum + basicVal * v / 100;
			return sum + v;
		}, 0);
		const deductionsTotal = formDeductions.reduce((sum, row) => {
			const v = Number(row.value) || 0;
			if (row.calc_type === "FIXED") return sum + v;
			if (row.calc_type === "PERCENT_BASIC") return sum + basicVal * v / 100;
			return sum + v;
		}, 0);
		return {
			gross,
			deductionsTotal,
			net: Math.max(0, gross - deductionsTotal),
			annual: gross * 12
		};
	}, [formEarnings, formDeductions]);
	const filteredTemplates = (0, import_react.useMemo)(() => {
		return templates.filter((t) => {
			const matchesSearch = !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.grade?.toLowerCase().includes(search.toLowerCase());
			const matchesGrade = gradeFilter === "all" || t.grade === gradeFilter;
			const matchesStatus = statusFilter === "all" || t.status === statusFilter;
			return matchesSearch && matchesGrade && matchesStatus;
		});
	}, [
		templates,
		search,
		gradeFilter,
		statusFilter
	]);
	const uniqueGrades = (0, import_react.useMemo)(() => {
		const grades = new Set(templates.map((t) => t.grade).filter(Boolean));
		return Array.from(grades);
	}, [templates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Salary Structure",
				description: "Define pay components, grades, earnings, deductions, and CTC breakup templates.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadData,
						disabled: isLoading,
						className: "h-9 gap-1.5 text-xs rounded-xl cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}` }), " Refresh"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openCreateDialog,
						className: "h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Create Structure"]
					})]
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
										children: "Total Structures"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: hero?.total_templates ?? templates.length
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active & draft pay grades" })
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
										children: "Mapped Employees"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: hero?.mapped_employees ?? templates.reduce((acc, t) => acc + (t.assigned_employees_count || 0), 0)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assigned to a valid structure" })
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
										children: "Unmapped Staff"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold tracking-tight text-foreground font-mono",
										children: hero?.unmapped_employees ?? 0
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending structure assignment" })
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
										children: "Last Revision Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-xl bg-violet-500/10 text-violet-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold tracking-tight text-foreground font-mono",
										children: hero?.last_updated || "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[11px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Latest template update" })
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-bold",
						children: "Salary Structure Templates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: "List of configured pay scale templates with CTC ranges, earnings, and deductions."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 w-full sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search template or grade...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "pl-9 h-9 text-xs rounded-xl bg-background/60"
								})]
							}),
							uniqueGrades.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: gradeFilter,
								onValueChange: setGradeFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs w-32 rounded-xl bg-background/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Grade" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Grades"
								}), uniqueGrades.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: g,
									children: g
								}, g))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs w-32 rounded-xl bg-background/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ACTIVE",
										children: "ACTIVE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "DRAFT",
										children: "DRAFT"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ARCHIVED",
										children: "ARCHIVED"
									})
								] })]
							})
						]
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
										children: "Template Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Grade / Level"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "CTC Range (Min - Max)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center",
										children: "Assigned Staff"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "py-12 text-center text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading salary structures..." })]
									})
								}) }) : filteredTemplates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "py-12 text-center text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-8 w-8 text-muted-foreground/40 mb-1" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground text-sm",
												children: "No salary structures found"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs max-w-sm mb-3",
												children: search || gradeFilter !== "all" || statusFilter !== "all" ? "No templates match your search or filter parameters." : "Get started by defining your organization's first salary structure template."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: openCreateDialog,
												className: "h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Create your first salary structure"]
											})
										]
									})
								}) }) : filteredTemplates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-accent/20 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-4 font-medium text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t.name || "—" }), t.effective_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: ["Effective: ", t.effective_date]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] font-mono",
												children: t.grade || "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-right font-mono",
											children: t.min_ctc != null && t.max_ctc != null ? `₹${t.min_ctc.toLocaleString("en-IN")} - ₹${t.max_ctc.toLocaleString("en-IN")}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-center font-mono font-medium",
											children: t.assigned_employees_count ?? 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: t.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]" : t.status === "DRAFT" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]" : "bg-slate-500/10 text-slate-400 border-slate-500/20 text-[10px]",
												children: t.status || "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														title: "View Breakup",
														onClick: () => setViewingTemplate(t),
														className: "h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														title: "Edit Template",
														onClick: () => openEditDialog(t),
														className: "h-7 w-7 text-muted-foreground hover:text-indigo-400 rounded-lg",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														title: "Duplicate Template",
														onClick: () => handleDuplicateTemplate(t),
														className: "h-7 w-7 text-muted-foreground hover:text-emerald-400 rounded-lg",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														title: "Delete Template",
														onClick: () => setDeletingId(t.id),
														className: "h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})
										})
									]
								}, t.id))
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-4xl rounded-2xl bg-card border-border max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-foreground text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5 text-indigo-400" }), editingTemplate ? "Edit Salary Structure Template" : "Create Salary Structure Template"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Define pay components, calculation rules, and CTC ranges for this structure template."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Template Name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "e.g. Senior Software Engineer Pay Scale",
												value: formName,
												onChange: (e) => setFormName(e.target.value),
												className: "h-9 text-xs rounded-xl bg-background/60"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Grade / Level"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "e.g. L3 / Senior",
												value: formGrade,
												onChange: (e) => setFormGrade(e.target.value),
												className: "h-9 text-xs rounded-xl bg-background/60"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: formStatus,
												onValueChange: (v) => setFormStatus(v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-9 text-xs rounded-xl bg-background/60",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "ACTIVE",
														children: "ACTIVE"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "DRAFT",
														children: "DRAFT"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "ARCHIVED",
														children: "ARCHIVED"
													})
												] })]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Effective Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: formEffectiveDate,
												onChange: (e) => setFormEffectiveDate(e.target.value),
												className: "h-9 text-xs rounded-xl bg-background/60"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Min Annual CTC (₹)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "600000",
												value: formMinCtc,
												onChange: (e) => setFormMinCtc(e.target.value),
												className: "h-9 text-xs rounded-xl bg-background/60 font-mono"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Max Annual CTC (₹)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "1200000",
												value: formMaxCtc,
												onChange: (e) => setFormMaxCtc(e.target.value),
												className: "h-9 text-xs rounded-xl bg-background/60 font-mono"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 p-4 rounded-2xl border border-border bg-background/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-xs font-bold text-emerald-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Earnings Components" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: addEarningRow,
												className: "h-7 text-[11px] gap-1 rounded-lg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add Earning"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2 max-h-60 overflow-y-auto pr-1",
											children: formEarnings.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-12 gap-1.5 items-center bg-card/60 p-2 rounded-xl border border-border/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Name",
														value: row.name,
														onChange: (e) => updateEarningRow(row.id, "name", e.target.value),
														className: "col-span-5 h-8 text-[11px] rounded-lg"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: row.calc_type,
														onValueChange: (v) => updateEarningRow(row.id, "calc_type", v),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "col-span-4 h-8 text-[11px] rounded-lg",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "FIXED",
																children: "Fixed ₹"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "PERCENT_BASIC",
																children: "% Basic"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "PERCENT_CTC",
																children: "% CTC"
															})
														] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														placeholder: "Val",
														value: row.value,
														onChange: (e) => updateEarningRow(row.id, "value", Number(e.target.value)),
														className: "col-span-2 h-8 text-[11px] rounded-lg font-mono"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														onClick: () => removeEarningRow(row.id),
														className: "col-span-1 h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg justify-self-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})
												]
											}, row.id))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 p-4 rounded-2xl border border-border bg-background/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-xs font-bold text-rose-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMinus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deduction Components" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: addDeductionRow,
												className: "h-7 text-[11px] gap-1 rounded-lg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add Deduction"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2 max-h-60 overflow-y-auto pr-1",
											children: formDeductions.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-12 gap-1.5 items-center bg-card/60 p-2 rounded-xl border border-border/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Name",
														value: row.name,
														onChange: (e) => updateDeductionRow(row.id, "name", e.target.value),
														className: "col-span-5 h-8 text-[11px] rounded-lg"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: row.calc_type,
														onValueChange: (v) => updateDeductionRow(row.id, "calc_type", v),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "col-span-4 h-8 text-[11px] rounded-lg",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "FIXED",
																children: "Fixed ₹"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "PERCENT_BASIC",
																children: "% Basic"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "PERCENT_CTC",
																children: "% CTC"
															})
														] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														placeholder: "Val",
														value: row.value,
														onChange: (e) => updateDeductionRow(row.id, "value", Number(e.target.value)),
														className: "col-span-2 h-8 text-[11px] rounded-lg font-mono"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														onClick: () => removeDeductionRow(row.id),
														className: "col-span-1 h-7 w-7 text-muted-foreground hover:text-rose-400 rounded-lg justify-self-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})
												]
											}, row.id))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium uppercase",
											children: "Est. Monthly Gross"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-base font-bold font-mono text-emerald-400 mt-0.5",
											children: ["₹", liveBreakup.gross.toLocaleString("en-IN")]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium uppercase",
											children: "Est. Deductions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-base font-bold font-mono text-rose-400 mt-0.5",
											children: ["-₹", liveBreakup.deductionsTotal.toLocaleString("en-IN")]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium uppercase",
											children: "Est. Net Take-Home"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-base font-bold font-mono text-indigo-400 mt-0.5",
											children: ["₹", liveBreakup.net.toLocaleString("en-IN")]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground font-medium uppercase",
											children: "Est. Annual CTC"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-base font-bold font-mono text-foreground mt-0.5",
											children: ["₹", liveBreakup.annual.toLocaleString("en-IN")]
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setIsDialogOpen(false),
								className: "text-xs rounded-xl",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleSaveTemplate,
								disabled: isSaving,
								className: "text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5",
								children: isSaving ? "Saving..." : editingTemplate ? "Update Structure" : "Create Structure"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewingTemplate,
				onOpenChange: (open) => !open && setViewingTemplate(null),
				children: viewingTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-2xl rounded-2xl bg-card border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center justify-between text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5 text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: viewingTemplate.name })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-xs font-mono",
								children: ["Grade: ", viewingTemplate.grade]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Full earnings and deductions breakdown for this template."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 p-3 rounded-xl border border-border bg-background/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-emerald-400 border-b border-border/40 pb-2",
									children: "Earnings Components"
								}), !viewingTemplate.earnings || viewingTemplate.earnings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground py-4 text-center",
									children: "No earnings configured."
								}) : viewingTemplate.earnings.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground",
										children: e.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: e.calc_type === "FIXED" ? "Fixed Amount" : e.calc_type === "PERCENT_BASIC" ? "% of Basic" : "% of CTC"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-semibold",
										children: e.calc_type === "FIXED" ? `₹${Number(e.value).toLocaleString("en-IN")}` : `${e.value}%`
									})]
								}, e.id))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 p-3 rounded-xl border border-border bg-background/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-rose-400 border-b border-border/40 pb-2",
									children: "Deductions Components"
								}), !viewingTemplate.deductions || viewingTemplate.deductions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground py-4 text-center",
									children: "No deductions configured."
								}) : viewingTemplate.deductions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground",
										children: d.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: d.calc_type === "FIXED" ? "Fixed Amount" : d.calc_type === "PERCENT_BASIC" ? "% of Basic" : "% of CTC"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-semibold text-rose-400",
										children: d.calc_type === "FIXED" ? `₹${Number(d.value).toLocaleString("en-IN")}` : `${d.value}%`
									})]
								}, d.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "CTC Range: "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-foreground",
								children: [
									"₹",
									viewingTemplate.min_ctc?.toLocaleString("en-IN") || "0",
									" - ₹",
									viewingTemplate.max_ctc?.toLocaleString("en-IN") || "0"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Assigned Staff: "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-indigo-400",
								children: viewingTemplate.assigned_employees_count || 0
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setViewingTemplate(null),
								className: "text-xs rounded-xl",
								children: "Close"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deletingId,
				onOpenChange: (open) => !open && setDeletingId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl bg-card border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5 text-rose-500" }), " Delete Salary Structure"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Are you sure you want to delete this salary structure template? This action cannot be undone."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setDeletingId(null),
							className: "text-xs rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleDeleteTemplate,
							disabled: isDeleting,
							className: "text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), isDeleting ? "Deleting..." : "Confirm Delete"]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SalaryStructurePage as component };
