import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { G as createEmployee, It as resolveDepartmentValue, Nt as resendEmployeeInvite, Pt as resetEmployeePassword, Ut as updateEmployee, Y as deactivateEmployee, Z as deleteEmployee, it as fetchEmployees, w as activateEmployee } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { At as Mail, Dn as Eye, E as Trash2, Jt as Key, Nn as Download, Pt as LoaderCircle, g as UserMinus, jn as EllipsisVertical, ot as Plus, q as Search, u as Users, v as UserCheck, zt as Link2 } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { t as DepartmentSelectContent } from "./DepartmentSelectContent-DAKHkmGL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeesPage-dnhov2pq.js
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
		fullName: "",
		email: "",
		phone: "",
		department: "",
		designation: "",
		joiningDate: "",
		managerName: "",
		shift: "General"
	};
}
function EmployeesTable({ employees, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
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
				onEdit,
				onResendInvite,
				onResetPassword,
				onDeactivate,
				onActivate,
				onDelete
			}, employee.id)) })]
		})
	});
}
function EmployeeRow({ employee, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
	const status = getEmployeeStatusDetails(employee);
	const isInvited = status.text === "INVITED" || status.text === "EXPIRED";
	const isActive = status.text === "ACTIVE";
	const isDisabled = status.text === "DISABLED";
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
					className: "w-48 bg-card border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onEdit(employee),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View / Edit Profile" })]
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
function EmployeesListContent({ loading, error, employees, onRetry, onAdd, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
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
		onDelete
	});
}
var SHIFT_OPTIONS = [
	"General",
	"Morning",
	"Evening",
	"Night"
];
function EmployeeFormDialog({ open, onOpenChange, draft, onDraftChange, submitting, onSave }) {
	const departmentValue = resolveDepartmentValue(draft?.department);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: draft && draft.id !== "" ? "Edit employee" : "Add employee" }) }),
				draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Shift",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.shift,
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
							label: "Full name",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.fullName,
								onChange: (e) => onDraftChange({
									...draft,
									fullName: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Email",
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
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.phone,
								onChange: (e) => onDraftChange({
									...draft,
									phone: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Department",
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
							label: "Designation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.designation,
								onChange: (e) => onDraftChange({
									...draft,
									designation: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Joining date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.joiningDate,
								onChange: (e) => onDraftChange({
									...draft,
									joiningDate: e.target.value
								})
							})
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onSave,
					disabled: submitting,
					children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save"]
				})] })
			]
		})
	});
}
function FormField({ label, children, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${wide ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function EmployeesPage() {
	const dispatch = useAppDispatch();
	const { employees, loading, submitting, error } = useAppSelector((state) => state.employees);
	const [q, setQ] = (0, import_react.useState)("");
	const [dept, setDept] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployees({
			search: q,
			department: dept
		}));
	}, [
		dispatch,
		q,
		dept
	]);
	const departments = (0, import_react.useMemo)(() => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))), [employees]);
	function refetch() {
		dispatch(fetchEmployees({
			search: q,
			department: dept
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
	async function save() {
		if (!draft) return;
		if (!draft.fullName || !draft.email) return toast.error("Name and email required");
		const names = draft.fullName.trim().split(/\s+/);
		const first_name = names[0] || "";
		const last_name = names.slice(1).join(" ") || " ";
		if (draft.id !== "") {
			const result = await dispatch(updateEmployee({
				id: draft.id,
				payload: {
					first_name,
					last_name,
					personal_email: draft.email,
					phone: draft.phone || void 0,
					department: draft.department,
					designation: draft.designation,
					joining_date: draft.joiningDate || void 0,
					shift: draft.shift
				}
			}));
			if (updateEmployee.fulfilled.match(result)) {
				toast.success("Employee updated successfully");
				setOpen(false);
				refetch();
			} else toast.error(parseErrorMessage(result.payload, "Failed to update employee"));
		} else {
			const result = await dispatch(createEmployee({
				first_name,
				last_name,
				personal_email: draft.email,
				company_email: draft.email,
				phone: draft.phone || "9876543210",
				department: draft.department || "Engineering",
				designation: draft.designation || "Engineer",
				joining_date: draft.joiningDate,
				employee_id: draft.employeeId || `EMP-${Math.floor(1e5 + Math.random() * 9e5)}`,
				employment_type: "FULL_TIME",
				employment_status: "PROBATION",
				role: "employee",
				shift: draft.shift || "General"
			}));
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				onDelete: remove
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFormDialog, {
			open,
			onOpenChange: setOpen,
			draft,
			onDraftChange: setDraft,
			submitting,
			onSave: save
		})
	] });
}
//#endregion
export { EmployeesPage };
