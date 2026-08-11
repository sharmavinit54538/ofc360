import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { $ as fetchEmployees, At as resetEmployeePassword, B as createEmployee, K as deleteEmployee, Mt as resolveDepartmentValue, W as deactivateEmployee, kt as resendEmployeeInvite, rt as fetchOrgChart, y as activateEmployee, zt as updateEmployee } from "./ofc360-store-BR2yEBkC.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { K as Search, Nt as LoaderCircle, Pt as List, Rt as Link2, Sr as Building2, T as Trash2, Tn as Eye, ar as ChevronDown, at as Plus, g as UserMinus, jn as Download, kn as EllipsisVertical, kt as Mail, qt as Key, r as X, rr as ChevronRight, u as Users, v as UserCheck, yt as Network } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DJnL0VlY.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { t as Card } from "./card-BcHXPpmN.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { t as DepartmentSelectContent } from "./DepartmentSelectContent-DgsxWSLU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeesPage-DlUtnDfP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeesFilters({ search, department, onSearchChange, onDepartmentChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 border-b border-border p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex-1 min-w-[200px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (e) => onSearchChange(e.target.value),
				placeholder: "Search by name, email, or ID",
				className: "h-9 pl-9"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: department,
			onValueChange: onDepartmentChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-9 w-48",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All departments" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentSelectContent, { includeAllOption: true })]
		})]
	});
}
function getEmployeeStatusDetails(emp) {
	const status = emp.status?.toUpperCase() || "INVITED";
	if ((status === "INVITED" || status === "CREATED") && emp.activationTokenExpiresAt) {
		const expires = new Date(emp.activationTokenExpiresAt);
		if (/* @__PURE__ */ new Date() > expires) return {
			text: "EXPIRED",
			variant: "destructive",
			isExpired: true
		};
	}
	switch (status) {
		case "ACTIVE": return {
			text: "ACTIVE",
			variant: "default",
			isExpired: false
		};
		case "PENDING": return {
			text: "PENDING",
			variant: "secondary",
			isExpired: false
		};
		case "DISABLED":
		case "INACTIVE": return {
			text: "DISABLED",
			variant: "destructive",
			isExpired: false
		};
		default: return {
			text: "INVITED",
			variant: "secondary",
			isExpired: false
		};
	}
}
function exportEmployeesCsv(employees) {
	const headers = [
		"Employee ID",
		"Full Name",
		"Email",
		"Phone",
		"Department",
		"Designation",
		"Joining Date",
		"Shift"
	];
	const rows = employees.map((e) => [
		e.employeeId,
		e.fullName,
		e.email,
		e.phone,
		e.department,
		e.designation,
		e.joiningDate,
		e.shift
	].map((v) => `"${(v ?? "").toString().replace(/"/g, "\"\"")}"`).join(","));
	const csv = [headers.join(","), ...rows].join("\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = "employees.csv";
	a.click();
	URL.revokeObjectURL(url);
}
function createEmptyEmployee() {
	return {
		id: "",
		employeeId: "",
		firstName: "",
		lastName: "",
		fullName: "",
		email: "",
		companyEmail: "",
		phone: "",
		alternatePhone: "",
		department: "",
		designation: "",
		employmentType: "FULL_TIME",
		joiningDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		profilePhotoUrl: "",
		gender: "",
		dateOfBirth: "",
		bloodGroup: "",
		maritalStatus: "",
		team: "",
		managerId: "",
		managerName: "",
		branch: "",
		workLocation: "",
		probationPeriodMonths: 3,
		shift: "General",
		employeeCapacity: 100,
		costCenterId: "",
		ctc: 0,
		basicSalary: 0,
		hra: 0,
		bonus: 0,
		pf: 0,
		esi: 0,
		professionalTax: 0,
		role: "employee",
		leaveGroup: "",
		roleMetadata: {},
		addresses: [],
		documents: [],
		education: [],
		experience: [],
		skills: [],
		emergencyContacts: [],
		bankAccounts: []
	};
}
function EmployeesTable({ employees, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete, onViewReports }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						children: "Designation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Reports To"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Joined"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Shift"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: employees.map((employee) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeRow, {
				employee,
				allEmployees: employees,
				onEdit,
				onResendInvite,
				onResetPassword,
				onDeactivate,
				onActivate,
				onDelete,
				onViewReports
			}, employee.id)) })]
		})
	});
}
function EmployeeRow({ employee, allEmployees, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete, onViewReports }) {
	const status = getEmployeeStatusDetails(employee);
	const isInvited = status.text === "INVITED" || status.text === "EXPIRED";
	const isActive = status.text === "ACTIVE";
	const isDisabled = status.text === "DISABLED";
	const hasDirectReports = allEmployees.some((e) => e.managerId === employee.id);
	function copyInviteLink() {
		const link = window.location.origin + "/onboarding?token=" + (employee.activationToken || "");
		navigator.clipboard.writeText(link);
		toast.success("Invitation link copied to clipboard");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border transition-colors hover:bg-accent/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background",
						children: employee.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: employee.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: employee.email
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: employee.department || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: employee.designation || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: employee.managerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1 text-xs font-medium text-foreground",
					children: employee.managerName
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "—"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-muted-foreground",
				children: employee.joiningDate || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: employee.shift
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeStatusBadge, { status })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-52 bg-card border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onEdit(employee),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View / Edit Profile" })]
						}),
						hasDirectReports && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onViewReports?.(employee.id, employee.fullName),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Direct Reports" })]
						}),
						isInvited && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onResendInvite(employee.id),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Resend Invitation" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: copyInviteLink,
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy Invite Link" })]
						})] }),
						isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onResetPassword(employee.id),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset Password" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onDeactivate(employee.id),
							className: "cursor-pointer gap-2 text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deactivate Employee" })]
						})] }),
						isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onActivate(employee.id),
							className: "cursor-pointer gap-2 text-emerald-500 focus:text-emerald-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Activate Employee" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "border-t border-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onDelete(employee.id),
							className: "cursor-pointer gap-2 text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete Employee" })]
						})
					]
				})] })
			})
		]
	});
}
function EmployeeStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status.variant,
		className: status.text === "ACTIVE" ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : status.text === "PENDING" ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : void 0,
		children: status.text
	});
}
function EmployeesListContent({ loading, error, employees, onRetry, onAdd, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete, onViewReports }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading employees..."]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: [
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-muted/30 animate-pulse rounded-lg" }, i))
		})]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-destructive font-medium",
				children: "Failed to load employees"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Please verify backend connection details."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onRetry,
				className: "mt-4",
				children: "Retry"
			})
		]
	});
	if (employees.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "No employees found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Register your first employee or import records to populate your workforce dashboard."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onAdd,
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add employee"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesTable, {
		employees,
		onEdit,
		onResendInvite,
		onResetPassword,
		onDeactivate,
		onActivate,
		onDelete,
		onViewReports
	});
}
function RepeatableFieldList({ title, items = [], emptyText = "No items added yet.", defaultItem, onItemsChange, renderItem }) {
	function addItem() {
		onItemsChange([...items, { ...defaultItem }]);
	}
	function removeItem(index) {
		onItemsChange(items.filter((_, i) => i !== index));
	}
	function updateItem(index, patch) {
		onItemsChange(items.map((item, i) => i === index ? {
			...item,
			...patch
		} : item));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: [
					title,
					" (",
					items.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: addItem,
				className: "h-8 text-xs gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }),
					" Add ",
					title.replace(/s$/, "") || "Item"
				]
			})]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border/80 bg-card/30 p-6 text-center text-xs text-muted-foreground",
			children: emptyText
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-xl border border-border/80 bg-card/40 p-4 pt-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => removeItem(idx),
					className: "absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer",
					title: "Remove item",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
				}), renderItem(item, idx, (patch) => updateItem(idx, patch))]
			}, idx))
		})]
	});
}
var SHIFT_OPTIONS = [
	"General",
	"Morning",
	"Evening",
	"Night"
];
var EMPLOYMENT_TYPES = [
	{
		value: "FULL_TIME",
		label: "Full Time"
	},
	{
		value: "PART_TIME",
		label: "Part Time"
	},
	{
		value: "CONTRACT",
		label: "Contract"
	},
	{
		value: "INTERN",
		label: "Intern"
	}
];
var GENDER_OPTIONS = [
	"Male",
	"Female",
	"Other",
	"Prefer not to say"
];
var BLOOD_GROUPS = [
	"A+",
	"A-",
	"B+",
	"B-",
	"O+",
	"O-",
	"AB+",
	"AB-"
];
var MARITAL_STATUSES = [
	"Single",
	"Married",
	"Divorced",
	"Widowed"
];
var ROLES = [
	"employee",
	"manager",
	"hr",
	"admin"
];
var PROFICIENCY_LEVELS = [
	"Beginner",
	"Intermediate",
	"Advanced",
	"Expert"
];
function EmployeeFormDialog({ open, onOpenChange, draft, onDraftChange, submitting, onSave, allEmployees = [] }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("basic");
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (open) {
			setActiveTab("basic");
			setErrors({});
		}
	}, [open]);
	if (!draft) return null;
	const departmentValue = resolveDepartmentValue(draft.department);
	const managerOptions = allEmployees.filter((e) => e.id && e.id !== draft.id);
	function validate() {
		const errs = {};
		const firstName = draft?.firstName || draft?.fullName?.split(" ")[0] || "";
		const lastName = draft?.lastName || draft?.fullName?.split(" ").slice(1).join(" ") || "";
		if (!firstName.trim()) errs.firstName = "First name is required";
		if (!lastName.trim()) errs.lastName = "Last name is required";
		if (!draft?.employeeId?.trim()) errs.employeeId = "Employee ID is required";
		if (!draft?.email?.trim()) errs.email = "Personal email is required";
		if (!draft?.phone?.trim()) errs.phone = "Phone number is required";
		if (!draft?.department?.trim()) errs.department = "Department is required";
		if (!draft?.designation?.trim()) errs.designation = "Designation is required";
		if (!draft?.employmentType) errs.employmentType = "Employment type is required";
		if (!draft?.joiningDate) errs.joiningDate = "Joining date is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	}
	function handleSave() {
		if (validate()) onSave();
		else if (errors.firstName || errors.lastName || errors.employeeId) setActiveTab("basic");
		else if (errors.email || errors.phone) setActiveTab("contact");
		else if (errors.department || errors.designation || errors.employmentType || errors.joiningDate) setActiveTab("job");
	}
	const hasBasicErr = Boolean(errors.firstName || errors.lastName || errors.employeeId);
	const hasContactErr = Boolean(errors.email || errors.phone);
	const hasJobErr = Boolean(errors.department || errors.designation || errors.employmentType || errors.joiningDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "pb-2 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-xl font-bold",
						children: draft.id !== "" ? "Edit Employee Profile" : "Add New Employee"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: activeTab,
					onValueChange: setActiveTab,
					className: "flex-1 flex flex-col min-h-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto pb-2 pt-1 border-b border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/40 h-auto p-1 inline-flex gap-1 min-w-full sm:min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "basic",
									className: "text-xs px-3 py-1.5 gap-1.5",
									children: ["Basic Info ", hasBasicErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-destructive" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "contact",
									className: "text-xs px-3 py-1.5 gap-1.5",
									children: ["Contact ", hasContactErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-destructive" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "job",
									className: "text-xs px-3 py-1.5 gap-1.5",
									children: ["Job Details ", hasJobErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-destructive" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "comp",
									className: "text-xs px-3 py-1.5",
									children: "Compensation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "addresses",
									className: "text-xs px-3 py-1.5",
									children: [
										"Addresses (",
										draft.addresses?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "documents",
									className: "text-xs px-3 py-1.5",
									children: [
										"Documents (",
										draft.documents?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "education",
									className: "text-xs px-3 py-1.5",
									children: [
										"Education (",
										draft.education?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "experience",
									className: "text-xs px-3 py-1.5",
									children: [
										"Experience (",
										draft.experience?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "skills",
									className: "text-xs px-3 py-1.5",
									children: [
										"Skills (",
										draft.skills?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "emergency",
									className: "text-xs px-3 py-1.5",
									children: [
										"Emergency (",
										draft.emergencyContacts?.length || 0,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "bank",
									className: "text-xs px-3 py-1.5",
									children: [
										"Bank (",
										draft.bankAccounts?.length || 0,
										")"
									]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto py-4 px-1 pr-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "basic",
								className: "mt-0 space-y-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "First Name *",
											error: errors.firstName,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.firstName || draft.fullName?.split(" ")[0] || "",
												onChange: (e) => {
													const fn = e.target.value;
													const ln = draft.lastName || draft.fullName?.split(" ").slice(1).join(" ") || "";
													onDraftChange({
														...draft,
														firstName: fn,
														fullName: `${fn} ${ln}`.trim()
													});
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Last Name *",
											error: errors.lastName,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.lastName || draft.fullName?.split(" ").slice(1).join(" ") || "",
												onChange: (e) => {
													const ln = e.target.value;
													const fn = draft.firstName || draft.fullName?.split(" ")[0] || "";
													onDraftChange({
														...draft,
														lastName: ln,
														fullName: `${fn} ${ln}`.trim()
													});
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Employee ID *",
											error: errors.employeeId,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.employeeId,
												onChange: (e) => onDraftChange({
													...draft,
													employeeId: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Gender",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.gender || "",
												onValueChange: (v) => onDraftChange({
													...draft,
													gender: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select gender" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: GENDER_OPTIONS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: g,
													children: g
												}, g)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Date of Birth",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: draft.dateOfBirth || "",
												onChange: (e) => onDraftChange({
													...draft,
													dateOfBirth: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Blood Group",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.bloodGroup || "",
												onValueChange: (v) => onDraftChange({
													...draft,
													bloodGroup: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select blood group" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: BLOOD_GROUPS.map((bg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: bg,
													children: bg
												}, bg)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Marital Status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.maritalStatus || "",
												onValueChange: (v) => onDraftChange({
													...draft,
													maritalStatus: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MARITAL_STATUSES.map((ms) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: ms,
													children: ms
												}, ms)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Profile Photo URL",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.profilePhotoUrl || "",
												onChange: (e) => onDraftChange({
													...draft,
													profilePhotoUrl: e.target.value
												}),
												placeholder: "https://..."
											})
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "contact",
								className: "mt-0 space-y-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Personal Email *",
											error: errors.email,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												value: draft.email,
												onChange: (e) => onDraftChange({
													...draft,
													email: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Company Email",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												value: draft.companyEmail || "",
												onChange: (e) => onDraftChange({
													...draft,
													companyEmail: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Phone Number *",
											error: errors.phone,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.phone,
												onChange: (e) => onDraftChange({
													...draft,
													phone: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Alternate Phone",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.alternatePhone || "",
												onChange: (e) => onDraftChange({
													...draft,
													alternatePhone: e.target.value
												})
											})
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "job",
								className: "mt-0 space-y-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Department *",
											error: errors.department,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: departmentValue,
												onValueChange: (v) => onDraftChange({
													...draft,
													department: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select department" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentSelectContent, {
													selectedValue: departmentValue,
													extraValues: draft.department ? [draft.department] : []
												}, draft.id || "new")]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Designation *",
											error: errors.designation,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.designation,
												onChange: (e) => onDraftChange({
													...draft,
													designation: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Employment Type *",
											error: errors.employmentType,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.employmentType || "FULL_TIME",
												onValueChange: (v) => onDraftChange({
													...draft,
													employmentType: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EMPLOYMENT_TYPES.map((et) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: et.value,
													children: et.label
												}, et.value)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Joining Date *",
											error: errors.joiningDate,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: draft.joiningDate || "",
												onChange: (e) => onDraftChange({
													...draft,
													joiningDate: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Reporting Manager",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.managerId || "none",
												onValueChange: (val) => {
													const m = managerOptions.find((opt) => opt.id === val);
													onDraftChange({
														...draft,
														managerId: val === "none" ? void 0 : val,
														managerName: val === "none" ? void 0 : m?.fullName
													});
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select reporting manager" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "none",
													children: "No manager (Top level)"
												}), managerOptions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: m.id,
													children: [
														m.fullName,
														" ",
														m.designation ? `— ${m.designation}` : ""
													]
												}, m.id))] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Shift",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.shift || "General",
												onValueChange: (v) => onDraftChange({
													...draft,
													shift: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SHIFT_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: s,
													children: s
												}, s)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Team",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.team || "",
												onChange: (e) => onDraftChange({
													...draft,
													team: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Branch",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.branch || "",
												onChange: (e) => onDraftChange({
													...draft,
													branch: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Work Location",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.workLocation || "",
												onChange: (e) => onDraftChange({
													...draft,
													workLocation: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Probation (Months)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.probationPeriodMonths ?? 3,
												onChange: (e) => onDraftChange({
													...draft,
													probationPeriodMonths: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Employee Capacity (%)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.employeeCapacity ?? 100,
												onChange: (e) => onDraftChange({
													...draft,
													employeeCapacity: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Cost Center ID",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.costCenterId || "",
												onChange: (e) => onDraftChange({
													...draft,
													costCenterId: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Portal Role",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: draft.role || "employee",
												onValueChange: (v) => onDraftChange({
													...draft,
													role: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: r,
													children: r
												}, r)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Leave Group",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: draft.leaveGroup || "",
												onChange: (e) => onDraftChange({
													...draft,
													leaveGroup: e.target.value
												})
											})
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "comp",
								className: "mt-0 space-y-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "CTC (Annual)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.ctc ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													ctc: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Basic Salary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.basicSalary ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													basicSalary: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "HRA",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.hra ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													hra: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Bonus",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.bonus ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													bonus: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "PF Deduction",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.pf ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													pf: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "ESI Deduction",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.esi ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													esi: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Professional Tax",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.professionalTax ?? 0,
												onChange: (e) => onDraftChange({
													...draft,
													professionalTax: Number(e.target.value)
												})
											})
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "addresses",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Addresses",
									items: draft.addresses || [],
									emptyText: "No address records added.",
									defaultItem: {
										address_type: "PRESENT",
										address_line_1: "",
										address_line_2: "",
										city: "",
										state: "",
										country: "India",
										pincode: "",
										is_same_as_current: false
									},
									onItemsChange: (addresses) => onDraftChange({
										...draft,
										addresses
									}),
									renderItem: (addr, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Address Type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: addr.address_type,
													onValueChange: (v) => update({ address_type: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "PRESENT",
															children: "Present"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "PERMANENT",
															children: "Permanent"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "OFFICE",
															children: "Office"
														})
													] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Pincode",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.pincode,
													onChange: (e) => update({ pincode: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Address Line 1",
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.address_line_1,
													onChange: (e) => update({ address_line_1: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Address Line 2",
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.address_line_2 || "",
													onChange: (e) => update({ address_line_2: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "City",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.city,
													onChange: (e) => update({ city: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "State",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.state,
													onChange: (e) => update({ state: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Country",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: addr.country,
													onChange: (e) => update({ country: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 pt-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													id: "same_curr",
													checked: addr.is_same_as_current,
													onCheckedChange: (v) => update({ is_same_as_current: Boolean(v) })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "same_curr",
													className: "text-xs",
													children: "Same as current address"
												})]
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "documents",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Documents",
									items: draft.documents || [],
									emptyText: "No documents attached.",
									defaultItem: {
										document_type: "AADHAAR",
										document_number: "",
										document_url: "",
										expiry_date: ""
									},
									onItemsChange: (documents) => onDraftChange({
										...draft,
										documents
									}),
									renderItem: (doc, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Document Type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: doc.document_type,
													onValueChange: (v) => update({ document_type: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "PAN",
															children: "PAN Card"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "AADHAAR",
															children: "Aadhaar Card"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "PASSPORT",
															children: "Passport"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "VOTER_ID",
															children: "Voter ID"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "OTHER",
															children: "Other"
														})
													] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Document Number",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: doc.document_number,
													onChange: (e) => update({ document_number: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Document URL",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: doc.document_url || "",
													onChange: (e) => update({ document_url: e.target.value }),
													placeholder: "https://..."
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Expiry Date",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: doc.expiry_date || "",
													onChange: (e) => update({ expiry_date: e.target.value })
												})
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "education",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Education",
									items: draft.education || [],
									emptyText: "No education records added.",
									defaultItem: {
										degree: "",
										institution: "",
										field_of_study: "",
										start_year: 2018,
										end_year: 2022,
										grade: "",
										certificate_url: ""
									},
									onItemsChange: (education) => onDraftChange({
										...draft,
										education
									}),
									renderItem: (edu, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Degree / Qualification",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: edu.degree,
													onChange: (e) => update({ degree: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Institution / University",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: edu.institution,
													onChange: (e) => update({ institution: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Field of Study",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: edu.field_of_study || "",
													onChange: (e) => update({ field_of_study: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Grade / Score",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: edu.grade || "",
													onChange: (e) => update({ grade: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Start Year",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: edu.start_year ?? 2018,
													onChange: (e) => update({ start_year: Number(e.target.value) })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "End Year",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: edu.end_year ?? 2022,
													onChange: (e) => update({ end_year: Number(e.target.value) })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Certificate URL",
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: edu.certificate_url || "",
													onChange: (e) => update({ certificate_url: e.target.value }),
													placeholder: "https://..."
												})
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "experience",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Work Experience",
									items: draft.experience || [],
									emptyText: "No prior work experience added.",
									defaultItem: {
										company_name: "",
										designation: "",
										employment_type: "FULL_TIME",
										start_date: "",
										end_date: "",
										is_current: false,
										description: ""
									},
									onItemsChange: (experience) => onDraftChange({
										...draft,
										experience
									}),
									renderItem: (exp, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Company Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: exp.company_name,
													onChange: (e) => update({ company_name: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Designation",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: exp.designation,
													onChange: (e) => update({ designation: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Employment Type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: exp.employment_type || "FULL_TIME",
													onValueChange: (v) => update({ employment_type: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EMPLOYMENT_TYPES.map((et) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: et.value,
														children: et.label
													}, et.value)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Start Date",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: exp.start_date || "",
													onChange: (e) => update({ start_date: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "End Date",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													disabled: exp.is_current,
													value: exp.end_date || "",
													onChange: (e) => update({ end_date: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 pt-2 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													id: `curr_job_${exp.company_name}`,
													checked: exp.is_current,
													onCheckedChange: (v) => update({ is_current: Boolean(v) })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `curr_job_${exp.company_name}`,
													className: "text-xs",
													children: "Currently working here"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Description",
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: exp.description || "",
													onChange: (e) => update({ description: e.target.value }),
													className: "h-20"
												})
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "skills",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Skills",
									items: draft.skills || [],
									emptyText: "No skills added.",
									defaultItem: {
										skill_name: "",
										proficiency: "Intermediate",
										years_of_experience: 2
									},
									onItemsChange: (skills) => onDraftChange({
										...draft,
										skills
									}),
									renderItem: (skill, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Skill Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: skill.skill_name,
													onChange: (e) => update({ skill_name: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Proficiency",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: skill.proficiency,
													onValueChange: (v) => update({ proficiency: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PROFICIENCY_LEVELS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: p,
														children: p
													}, p)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Years of Exp",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: skill.years_of_experience ?? 1,
													onChange: (e) => update({ years_of_experience: Number(e.target.value) })
												})
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "emergency",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Emergency Contacts",
									items: draft.emergencyContacts || [],
									emptyText: "No emergency contacts added.",
									defaultItem: {
										name: "",
										relation: "Spouse",
										phone: "",
										alternate_phone: "",
										email: "",
										address: ""
									},
									onItemsChange: (emergencyContacts) => onDraftChange({
										...draft,
										emergencyContacts
									}),
									renderItem: (ec, _, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Contact Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: ec.name,
													onChange: (e) => update({ name: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Relation",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: ec.relation,
													onChange: (e) => update({ relation: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Phone Number",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: ec.phone,
													onChange: (e) => update({ phone: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Alternate Phone",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: ec.alternate_phone || "",
													onChange: (e) => update({ alternate_phone: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Email",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "email",
													value: ec.email || "",
													onChange: (e) => update({ email: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Address",
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: ec.address || "",
													onChange: (e) => update({ address: e.target.value })
												})
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "bank",
								className: "mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatableFieldList, {
									title: "Bank Accounts",
									items: draft.bankAccounts || [],
									emptyText: "No bank accounts added.",
									defaultItem: {
										bank_name: "",
										account_holder_name: "",
										account_number: "",
										ifsc_code: "",
										account_type: "SAVINGS",
										is_primary: true
									},
									onItemsChange: (bankAccounts) => onDraftChange({
										...draft,
										bankAccounts
									}),
									renderItem: (bank, index, update) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Bank Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: bank.bank_name,
													onChange: (e) => update({ bank_name: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Account Holder Name",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: bank.account_holder_name,
													onChange: (e) => update({ account_holder_name: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Account Number",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: bank.account_number,
													onChange: (e) => update({ account_number: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "IFSC Code",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: bank.ifsc_code,
													onChange: (e) => update({ ifsc_code: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
												label: "Account Type",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: bank.account_type,
													onValueChange: (v) => update({ account_type: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "SAVINGS",
														children: "Savings Account"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "CURRENT",
														children: "Current Account"
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 pt-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													id: `pri_bank_${index}`,
													checked: bank.is_primary,
													onCheckedChange: (v) => {
														if (Boolean(v)) {
															const updated = (draft.bankAccounts || []).map((b, i) => ({
																...b,
																is_primary: i === index
															}));
															onDraftChange({
																...draft,
																bankAccounts: updated
															});
														} else update({ is_primary: false });
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: `pri_bank_${index}`,
													className: "text-xs font-semibold",
													children: "Primary Salary Account"
												})]
											})
										]
									})
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "pt-3 border-t border-border flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground hidden sm:block",
						children: "* Required ground-truth fields"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleSave,
							disabled: submitting,
							children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save Employee Profile"]
						})]
					})]
				})
			]
		})
	});
}
function FormField({ label, children, wide, error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${wide ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs font-medium flex items-center gap-1",
			children: [label, error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-destructive font-normal text-[11px]",
				children: ["— ", error]
			})]
		}), children]
	});
}
function OrgChartView({ nodes, onSelectEmployee }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [expandedIds, setExpandedIds] = (0, import_react.useState)({});
	function toggleExpand(id) {
		setExpandedIds((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	}
	function expandAll() {
		const all = {};
		function walk(n) {
			all[n.id] = true;
			n.directReports?.forEach(walk);
		}
		nodes.forEach(walk);
		setExpandedIds(all);
	}
	function collapseAll() {
		setExpandedIds({});
	}
	const filteredNodes = search.trim() ? filterOrgTree(nodes, search.trim().toLowerCase()) : nodes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search hierarchy by name, role or department…",
					className: "h-9.5 pl-9 text-sm"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: expandAll,
					className: "text-xs",
					children: "Expand All"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: collapseAll,
					className: "text-xs",
					children: "Collapse All"
				})]
			})]
		}), filteredNodes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground/60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children: "No org chart nodes found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: search ? "No matching employees found in org tree." : "Add employees and assign reporting managers to populate the chart."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: filteredNodes.map((rootNode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgTreeNodeCard, {
				node: rootNode,
				level: 0,
				expandedIds,
				onToggleExpand: toggleExpand,
				onSelectEmployee
			}, rootNode.id))
		})]
	});
}
function OrgTreeNodeCard({ node, level, expandedIds, onToggleExpand, onSelectEmployee }) {
	const hasReports = Boolean(node.directReports && node.directReports.length > 0);
	const isExpanded = expandedIds[node.id] ?? level < 2;
	const initials = node.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: `group relative transition-all duration-200 hover:border-primary/40 hover:shadow-md ${level === 0 ? "border-primary/20 bg-primary/5" : "bg-card/70"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5 min-w-0",
					children: [
						hasReports ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onToggleExpand(node.id),
							className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
							"aria-label": isExpanded ? "Collapse branch" : "Expand branch",
							children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-7 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${level === 0 ? "bg-primary text-primary-foreground shadow-glow" : "bg-foreground text-background"}`,
							children: initials
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									onClick: () => onSelectEmployee?.(node.id),
									className: "font-display font-semibold text-sm hover:text-primary transition-colors cursor-pointer truncate",
									children: node.fullName
								}), level === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "default",
									className: "text-[10px] uppercase tracking-wider",
									children: "Executive / Top Level"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: node.designation || "Employee" }), node.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), node.department]
								})] })]
							})]
						})
					]
				}), hasReports ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "gap-1.5 px-3 py-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							node.directReports.length,
							" direct report",
							node.directReports.length === 1 ? "" : "s"
						] })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground shrink-0",
					children: "Individual Contributor"
				})]
			})
		}), hasReports && isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ml-6 sm:ml-8 border-l-2 border-primary/20 pl-4 space-y-3 pt-1",
			children: node.directReports.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgTreeNodeCard, {
				node: child,
				level: level + 1,
				expandedIds,
				onToggleExpand,
				onSelectEmployee
			}, child.id))
		})]
	});
}
function filterOrgTree(nodes, query) {
	const result = [];
	for (const node of nodes) {
		const matches = node.fullName.toLowerCase().includes(query) || node.designation.toLowerCase().includes(query) || node.department && node.department.toLowerCase().includes(query);
		const filteredChildren = filterOrgTree(node.directReports || [], query);
		if (matches || filteredChildren.length > 0) result.push({
			...node,
			directReports: filteredChildren
		});
	}
	return result;
}
function EmployeesPage() {
	const dispatch = useAppDispatch();
	const { employees, orgChart, loading, submitting, error } = useAppSelector((state) => state.employees);
	const [activeTab, setActiveTab] = (0, import_react.useState)("list");
	const [q, setQ] = (0, import_react.useState)("");
	const [dept, setDept] = (0, import_react.useState)("all");
	const [managerFilter, setManagerFilter] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployees({
			search: q,
			department: dept,
			managerId: managerFilter?.id
		}));
	}, [
		dispatch,
		q,
		dept,
		managerFilter
	]);
	(0, import_react.useEffect)(() => {
		if (activeTab === "org-chart") dispatch(fetchOrgChart());
	}, [dispatch, activeTab]);
	const departments = (0, import_react.useMemo)(() => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))), [employees]);
	function refetch() {
		dispatch(fetchEmployees({
			search: q,
			department: dept,
			managerId: managerFilter?.id
		}));
	}
	async function resendInvite(id) {
		const result = await dispatch(resendEmployeeInvite(id));
		if (resendEmployeeInvite.fulfilled.match(result)) toast.success("Invitation email resent successfully");
		else toast.error(parseErrorMessage(result.payload, "Failed to resend invitation"));
	}
	async function deactivateEmployeeAction(id) {
		if (!confirm("Are you sure you want to deactivate this employee account? They will lose access to the portal.")) return;
		const result = await dispatch(deactivateEmployee(id));
		if (deactivateEmployee.fulfilled.match(result)) {
			toast.success("Employee account deactivated successfully");
			refetch();
		} else toast.error(parseErrorMessage(result.payload, "Failed to deactivate employee"));
	}
	function parseErrorMessage(payload, fallback) {
		if (typeof payload === "string") return payload;
		if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") return payload.message;
		return fallback;
	}
	async function activateEmployeeAction(id) {
		const result = await dispatch(activateEmployee(id));
		if (activateEmployee.fulfilled.match(result)) {
			toast.success("Employee account activated successfully");
			refetch();
		} else toast.error(parseErrorMessage(result.payload, "Failed to activate employee"));
	}
	async function resetPassword(id) {
		if (!confirm("Are you sure you want to reset this employee's password? A temporary password will be sent to their email.")) return;
		const result = await dispatch(resetEmployeePassword(id));
		if (resetEmployeePassword.fulfilled.match(result)) toast.success("Employee password reset email sent successfully");
		else toast.error(parseErrorMessage(result.payload, "Failed to reset password"));
	}
	function openNew() {
		setDraft(createEmptyEmployee());
		setOpen(true);
	}
	function openEdit(employee) {
		setDraft(employee);
		setOpen(true);
	}
	function handleViewReports(managerId, managerName) {
		setManagerFilter({
			id: managerId,
			name: managerName
		});
		setActiveTab("list");
	}
	function buildPayloadFromDraft(emp) {
		const names = (emp.fullName || "").trim().split(/\s+/);
		return {
			first_name: emp.firstName || names[0] || "",
			last_name: emp.lastName || names.slice(1).join(" ") || " ",
			personal_email: emp.email,
			company_email: emp.companyEmail || emp.email,
			phone: emp.phone,
			alternate_phone: emp.alternatePhone || void 0,
			employee_id: emp.employeeId || `EMP-${Math.floor(1e5 + Math.random() * 9e5)}`,
			department: emp.department,
			designation: emp.designation,
			employment_type: emp.employmentType || "FULL_TIME",
			joining_date: emp.joiningDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			profile_photo_url: emp.profilePhotoUrl || void 0,
			gender: emp.gender || void 0,
			date_of_birth: emp.dateOfBirth || void 0,
			blood_group: emp.bloodGroup || void 0,
			marital_status: emp.maritalStatus || void 0,
			team: emp.team || void 0,
			reporting_manager_id: emp.managerId || void 0,
			branch: emp.branch || void 0,
			work_location: emp.workLocation || void 0,
			probation_period_months: emp.probationPeriodMonths ?? 3,
			shift: emp.shift || "General",
			employee_capacity: emp.employeeCapacity ?? 100,
			cost_center_id: emp.costCenterId || void 0,
			ctc: emp.ctc ?? 0,
			basic_salary: emp.basicSalary ?? 0,
			hra: emp.hra ?? 0,
			bonus: emp.bonus ?? 0,
			pf: emp.pf ?? 0,
			esi: emp.esi ?? 0,
			professional_tax: emp.professionalTax ?? 0,
			role: emp.role || "employee",
			leave_group: emp.leaveGroup || void 0,
			role_metadata: emp.roleMetadata || {},
			addresses: emp.addresses || [],
			documents: emp.documents || [],
			education: emp.education || [],
			experience: emp.experience || [],
			skills: emp.skills || [],
			emergency_contacts: emp.emergencyContacts || [],
			bank_accounts: emp.bankAccounts || [],
			employment_status: "PROBATION"
		};
	}
	async function save() {
		if (!draft) return;
		if (!draft.email) return toast.error("Personal email is required");
		const payload = buildPayloadFromDraft(draft);
		if (draft.id !== "") {
			const result = await dispatch(updateEmployee({
				id: draft.id,
				payload
			}));
			if (updateEmployee.fulfilled.match(result)) {
				toast.success("Employee updated successfully");
				setOpen(false);
				refetch();
			} else toast.error(parseErrorMessage(result.payload, "Failed to update employee"));
		} else {
			const result = await dispatch(createEmployee(payload));
			if (createEmployee.fulfilled.match(result)) {
				toast.success("Employee added successfully");
				setOpen(false);
				refetch();
			} else toast.error(parseErrorMessage(result.payload, "Failed to add employee"));
		}
	}
	async function remove(id) {
		if (!confirm("Are you sure you want to remove this employee?")) return;
		const result = await dispatch(deleteEmployee(id));
		if (deleteEmployee.fulfilled.match(result)) toast.success("Employee removed successfully");
		else toast.error(parseErrorMessage(result.payload, "Failed to remove employee"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employees",
			description: `${employees.length} people across ${departments.length || 0} departments`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => exportEmployeesCsv(employees),
				disabled: employees.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: openNew,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add employee"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: (v) => setActiveTab(v),
			className: "w-full space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/80 border border-border p-1 rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "list",
							className: "gap-2 rounded-lg text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-4 w-4" }), " List View"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "org-chart",
							className: "gap-2 rounded-lg text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-4 w-4" }), " Org Chart View"]
						})]
					}), managerFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs text-primary font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Direct reports of: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: managerFilter.name })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setManagerFilter(null),
							className: "rounded p-0.5 hover:bg-primary/20 transition-colors cursor-pointer",
							"aria-label": "Clear manager filter",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "list",
					className: "mt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesFilters, {
							search: q,
							department: dept,
							onSearchChange: setQ,
							onDepartmentChange: setDept
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesListContent, {
							loading,
							error,
							employees,
							onRetry: refetch,
							onAdd: openNew,
							onEdit: openEdit,
							onResendInvite: resendInvite,
							onResetPassword: resetPassword,
							onDeactivate: deactivateEmployeeAction,
							onActivate: activateEmployeeAction,
							onDelete: remove,
							onViewReports: handleViewReports
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "org-chart",
					className: "mt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgChartView, { nodes: orgChart })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFormDialog, {
			open,
			onOpenChange: setOpen,
			draft,
			onDraftChange: setDraft,
			submitting,
			onSave: save,
			allEmployees: employees
		})
	] });
}
//#endregion
export { EmployeesPage };
