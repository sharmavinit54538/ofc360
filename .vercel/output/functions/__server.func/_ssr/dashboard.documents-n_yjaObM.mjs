import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360, j as apiInstance, kt as ofc360 } from "./ofc360-store-XkEEWRxo.mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as RefreshCw, B as ShieldCheck, Hn as Clock, K as Search, Kn as CircleX, Nt as LoaderCircle, Qn as CircleCheckBig, T as Trash2, Tn as Eye, _n as FileSpreadsheet, er as CircleAlert, f as User, gn as FileText, jn as Download, pr as Calendar, s as WandSparkles, un as Folder, x as TriangleAlert, y as Upload, z as Shield } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-C6l-HH22.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.documents-n_yjaObM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Employee Documents",
	"Education",
	"Employment",
	"Company Documents"
];
var CATEGORY_TYPES = {
	"Employee Documents": [
		"Aadhaar Card",
		"PAN Card",
		"Passport",
		"Driving Licence",
		"Voter ID",
		"Resume",
		"Photograph"
	],
	"Education": [
		"10th Certificate",
		"12th Certificate",
		"Graduation",
		"Post Graduation",
		"Certifications"
	],
	"Employment": [
		"Offer Letter",
		"Appointment Letter",
		"Experience Letter",
		"Relieving Letter",
		"Salary Slip"
	],
	"Company Documents": [
		"HR Policy",
		"NDA",
		"Employment Agreement",
		"Code of Conduct",
		"Company Handbook"
	]
};
var STATS_CARDS = [
	{
		key: "total",
		title: "Total Documents",
		color: "text-blue-500",
		bg: "bg-blue-500/10"
	},
	{
		key: "verified",
		title: "Verified Documents",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10"
	},
	{
		key: "pending",
		title: "Pending Verification",
		color: "text-amber-500",
		bg: "bg-amber-500/10"
	},
	{
		key: "rejected",
		title: "Rejected Documents",
		color: "text-rose-500",
		bg: "bg-rose-500/10"
	},
	{
		key: "expiring",
		title: "Expiring Soon",
		color: "text-purple-500",
		bg: "bg-purple-500/10"
	}
];
var DOCUMENT_TEMPLATES = [
	{
		id: "offer",
		title: "Offer Letter",
		category: "Employment",
		fields: [
			"Role",
			"Salary (LPA)",
			"Start Date"
		]
	},
	{
		id: "nda",
		title: "Non-Disclosure Agreement (NDA)",
		category: "Company Documents",
		fields: ["Witness Name", "Duration (Years)"]
	},
	{
		id: "handbook",
		title: "Company Handbook Acknowledgment",
		category: "Company Documents",
		fields: ["Version Date", "Signee Designation"]
	}
];
var formatFileSize = (bytes) => {
	if (!bytes || bytes === 0) return "1.2 MB";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
function DocumentsPage() {
	if (((useofc360().user?.role)?.toLowerCase() || "employee") === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeDocumentsPage, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDocumentsPage, {});
}
function EmployeeDocumentsPage() {
	const ws = useofc360();
	const [realDocs, setRealDocs] = (0, import_react.useState)([]);
	const [categoriesList, setCategoriesList] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [previewDoc, setPreviewDoc] = (0, import_react.useState)(null);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [selectedFile, setSelectedFile] = (0, import_react.useState)(null);
	const [uploadCategory, setUploadCategory] = (0, import_react.useState)("Employee Documents");
	const [uploadType, setUploadType] = (0, import_react.useState)("Aadhaar Card");
	const [uploadDesc, setUploadDesc] = (0, import_react.useState)("");
	const [uploadExpiry, setUploadExpiry] = (0, import_react.useState)("");
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const currentEmpId = (0, import_react.useMemo)(() => {
		return ws.user?.employee_id || ws.user?.employeeId || ws.employees?.find((e) => e.userId === ws.user?.id || e.email === ws.user?.email)?.id || null;
	}, [ws.user, ws.employees]);
	const fetchEmployeeDocs = async () => {
		setIsLoading(true);
		try {
			const catsRes = await api.get("/documents/categories").catch(() => null);
			if (catsRes?.data && Array.isArray(catsRes.data)) setCategoriesList(catsRes.data);
			const [empRes, compRes] = await Promise.all([api.get("/documents/employees").catch(() => null), api.get("/documents/company").catch(() => null)]);
			const fetched = [];
			if (empRes?.data && Array.isArray(empRes.data)) empRes.data.forEach((d) => {
				fetched.push({
					id: d.id,
					name: d.file_name || d.title,
					employeeId: d.employee_id,
					employeeName: "My Document",
					category: d.category_name || "Employee Documents",
					type: d.title || "Document",
					uploadedBy: d.uploaded_by_name || "Me / HR",
					uploadDate: d.created_at ? d.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					expiryDate: d.expiry_date || void 0,
					status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
					fileSize: formatFileSize(d.file_size),
					fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase(),
					description: d.description || "",
					rejectionReason: d.comments || d.rejection_reason || void 0
				});
			});
			if (compRes?.data && Array.isArray(compRes.data)) compRes.data.forEach((d) => {
				fetched.push({
					id: d.id,
					name: d.file_name || d.title,
					employeeId: void 0,
					employeeName: "Company Policy",
					category: "Company Documents",
					type: d.title || "Policy Document",
					uploadedBy: d.uploaded_by_name || "HR Admin",
					uploadDate: d.created_at ? d.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					expiryDate: void 0,
					status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
					fileSize: formatFileSize(d.file_size),
					fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase(),
					description: d.description || "",
					rejectionReason: void 0
				});
			});
			setRealDocs(fetched);
		} catch (err) {
			console.error("Error fetching employee documents:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchEmployeeDocs();
	}, []);
	const filteredDocs = (0, import_react.useMemo)(() => {
		return realDocs.filter((doc) => {
			if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
			if (statusFilter !== "all" && doc.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchName = doc.name.toLowerCase().includes(q);
				const matchType = doc.type.toLowerCase().includes(q);
				const matchCategory = doc.category.toLowerCase().includes(q);
				const matchDesc = doc.description?.toLowerCase().includes(q);
				if (!matchName && !matchType && !matchCategory && !matchDesc) return false;
			}
			return true;
		});
	}, [
		realDocs,
		categoryFilter,
		statusFilter,
		searchQuery
	]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: realDocs.length,
			verified: realDocs.filter((d) => d.status === "Verified").length,
			pending: realDocs.filter((d) => d.status === "Pending").length,
			rejected: realDocs.filter((d) => d.status === "Rejected").length
		};
	}, [realDocs]);
	const handleDownload = async (doc) => {
		toast.info(`Downloading ${doc.name}...`);
		try {
			const path = doc.category === "Company Documents" ? `/documents/company/${doc.id}/download` : `/documents/employees/${doc.id}/download`;
			const response = await apiInstance.get(path, { responseType: "blob" });
			const blob = new Blob([response.data]);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = doc.name;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			toast.success(`Downloaded ${doc.name}`);
		} catch (err) {
			console.error("Download error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to download file.");
		}
	};
	const handleUploadSubmit = async (e) => {
		e.preventDefault();
		if (!selectedFile) {
			toast.error("Please select a document file to upload.");
			return;
		}
		if (!currentEmpId) {
			toast.error("Employee profile not found for upload.");
			return;
		}
		setIsUploading(true);
		try {
			const formData = new FormData();
			const categoryId = categoriesList.find((c) => c.name === uploadCategory || c.code === uploadCategory)?.id || "00000000-0000-0000-0000-000000000001";
			formData.append("file", selectedFile);
			formData.append("employee_id", currentEmpId);
			formData.append("category_id", categoryId);
			formData.append("title", uploadType || selectedFile.name);
			if (uploadDesc) formData.append("description", uploadDesc);
			if (uploadExpiry) formData.append("expiry_date", uploadExpiry);
			formData.append("visibility", "PRIVATE");
			formData.append("status_field", "PENDING");
			await apiInstance.post("/documents/employees", formData, { headers: { "Content-Type": "multipart/form-data" } });
			toast.success("Document uploaded successfully! Sent for HR verification.");
			setIsUploading(false);
			setUploadOpen(false);
			setSelectedFile(null);
			setUploadDesc("");
			setUploadExpiry("");
			await fetchEmployeeDocs();
		} catch (err) {
			console.error("Upload error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to upload document.");
			setIsUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-0.5",
							children: "Employee Portal"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
						children: "My Documents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "View and manage documents available to you."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setUploadOpen(true),
						className: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2 h-10 px-4 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Upload Document"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Total Documents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-2xl font-bold text-foreground",
									children: stats.total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Personal & Company files"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-6 w-6" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Verified Documents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-2xl font-bold text-emerald-500",
									children: stats.verified
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Approved by HR"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-6 w-6" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Pending Verification"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-2xl font-bold text-amber-500",
									children: stats.pending
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Under HR review"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6" })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/60 bg-card/60 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col sm:flex-row gap-3 items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by document name or tag...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "pl-9 h-9 text-xs bg-background/80"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: categoryFilter,
							onValueChange: setCategoryFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs w-[160px] bg-background/80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Employee Documents",
									children: "Employee Documents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Education",
									children: "Education"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Employment",
									children: "Employment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Company Documents",
									children: "Company Policies"
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: setStatusFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs w-[140px] bg-background/80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "verified",
									children: "Verified"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "pending",
									children: "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "rejected",
									children: "Rejected"
								})
							] })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 border-b border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-semibold",
							children: "Available Documents"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "text-xs",
							children: [
								"Showing ",
								filteredDocs.length,
								" of ",
								realDocs.length,
								" documents"
							]
						})] })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center text-muted-foreground flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "Loading your documents from server..."
						})]
					}) : filteredDocs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-10 w-10 mx-auto text-muted-foreground/40 mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: "No documents found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs mt-1",
								children: "There are no documents matching your search or filters."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
						className: "bg-muted/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "border-border/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3",
									children: "Document Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3",
									children: "Uploaded Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3",
									children: "File Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-xs font-semibold py-3 text-right",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredDocs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "border-border/40 hover:bg-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4.5 w-4.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-xs text-foreground leading-tight",
										children: doc.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: doc.type
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] font-medium border-border",
									children: doc.category
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5 text-xs text-muted-foreground",
								children: doc.uploadDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5",
								children: doc.status === "Verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), " Verified"]
								}) : doc.status === "Rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] font-semibold gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), " Rejected"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-semibold gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Pending Review"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground",
									children: doc.fileType || "pdf"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => setPreviewDoc(doc),
										className: "h-8 px-2.5 text-xs gap-1 hover:bg-accent cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), "View"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => handleDownload(doc),
										className: "h-8 px-2.5 text-xs gap-1 border-border cursor-pointer hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download"]
									})]
								})
							})
						]
					}, doc.id)) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: Boolean(previewDoc),
				onOpenChange: (open) => !open && setPreviewDoc(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "w-full sm:max-w-lg border-l border-border p-0 flex flex-col",
					children: previewDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "p-5 border-b border-border bg-muted/20 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: previewDoc.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground",
										children: ["• ", previewDoc.fileSize]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
									className: "text-lg font-bold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-indigo-500" }), previewDoc.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground",
									children: [
										"Uploaded on ",
										previewDoc.uploadDate,
										" by ",
										previewDoc.uploadedBy
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "flex-1 p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-xl border border-border bg-card/60 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Document Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: previewDoc.status === "Verified" ? "Verified and approved by HR." : previewDoc.status === "Rejected" ? "Rejected by HR." : "Pending review by HR."
										})] }), previewDoc.status === "Verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs",
											children: "Verified"
										}) : previewDoc.status === "Rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs",
											children: "Rejected"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs",
											children: "Pending"
										})]
									}),
									previewDoc.status === "Rejected" && previewDoc.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold flex items-center gap-1.5 text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " Rejection Note from HR"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground leading-relaxed",
											children: previewDoc.rejectionReason
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-semibold text-foreground",
												children: "Document Information"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-lg border border-border/50 bg-muted/20",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground font-medium",
														children: "Document Type"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-foreground mt-0.5",
														children: previewDoc.type
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-lg border border-border/50 bg-muted/20",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground font-medium",
														children: "File Format"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-foreground mt-0.5 uppercase",
														children: previewDoc.fileType || "pdf"
													})]
												})]
											}),
											previewDoc.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg border border-border/50 bg-muted/20 text-xs space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-muted-foreground font-medium",
													children: "Description / Notes"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-foreground leading-relaxed",
													children: previewDoc.description
												})]
											})
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-t border-border bg-muted/10 shrink-0 flex items-center justify-end gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => handleDownload(previewDoc),
								className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Download Document"]
							})
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUploadSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-base font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4.5 w-4.5 text-indigo-500" }), "Upload Document"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 py-4 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: uploadCategory,
										onValueChange: (val) => {
											setUploadCategory(val);
											const types = CATEGORY_TYPES[val] || [];
											if (types.length > 0) setUploadType(types[0]);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select category" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Employee Documents",
												children: "Employee Documents (ID, PAN, Passport)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Education",
												children: "Education (Certificates & Degrees)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Employment",
												children: "Employment (Experience & Salary Slips)"
											})
										] })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Document Type / Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: uploadType,
										onValueChange: setUploadType,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select document type" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (CATEGORY_TYPES[uploadCategory] || [
											"Aadhaar Card",
											"PAN Card",
											"Passport",
											"Resume"
										]).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t,
											children: t
										}, t)) })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Document File (PDF, PNG, JPG)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => fileInputRef.current?.click(),
										className: "mt-1 border-2 border-dashed border-border/80 hover:border-indigo-500/50 rounded-xl p-4 text-center cursor-pointer bg-muted/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 mx-auto text-muted-foreground/60 mb-1" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-foreground",
												children: selectedFile ? selectedFile.name : "Click to choose file"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground mt-0.5",
												children: selectedFile ? formatFileSize(selectedFile.size) : "PDF, PNG, JPG up to 10MB"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: fileInputRef,
												type: "file",
												accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
												onChange: (e) => setSelectedFile(e.target.files?.[0] || null),
												className: "hidden"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Description (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Additional notes about this document...",
										value: uploadDesc,
										onChange: (e) => setUploadDesc(e.target.value),
										className: "text-xs mt-1 h-20"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setUploadOpen(false),
								className: "h-9 text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: isUploading || !selectedFile,
								className: "h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5",
								children: isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Uploading..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Submit Document"] })
							})] })
						]
					})
				})
			})
		]
	});
}
function AdminDocumentsPage() {
	const ws = useofc360();
	const [realDocs, setRealDocs] = (0, import_react.useState)(ws.documents || []);
	const [categoriesList, setCategoriesList] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	ws.documentActivities;
	const docs = realDocs;
	const [selectedFile, setSelectedFile] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const fetchRealDocuments = async () => {
		setIsLoading(true);
		try {
			const catsRes = await api.get("/documents/categories").catch(() => null);
			if (catsRes?.data && Array.isArray(catsRes.data)) setCategoriesList(catsRes.data);
			const [empRes, compRes] = await Promise.all([api.get("/documents/employees").catch(() => null), api.get("/documents/company").catch(() => null)]);
			const fetchedDocs = [];
			if (empRes?.data && Array.isArray(empRes.data)) empRes.data.forEach((d) => {
				const emp = ws.employees?.find((e) => e.id === d.employee_id);
				fetchedDocs.push({
					id: d.id,
					name: d.file_name || d.title,
					employeeId: d.employee_id,
					employeeName: emp?.fullName || d.employee_name || "Employee",
					category: d.category_name || "Employee Documents",
					type: d.title || "Document",
					uploadedBy: d.uploaded_by_name || "HR Admin",
					uploadDate: d.created_at ? d.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					expiryDate: d.expiry_date || void 0,
					status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
					fileSize: formatFileSize(d.file_size),
					fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase(),
					description: d.description || "",
					rejectionReason: d.comments || d.rejection_reason || void 0
				});
			});
			if (compRes?.data && Array.isArray(compRes.data)) compRes.data.forEach((d) => {
				fetchedDocs.push({
					id: d.id,
					name: d.file_name || d.title,
					employeeId: void 0,
					employeeName: "Company-wide",
					category: "Company Documents",
					type: d.title || "Policy Document",
					uploadedBy: d.uploaded_by_name || "HR Admin",
					uploadDate: d.created_at ? d.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					expiryDate: void 0,
					status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
					fileSize: formatFileSize(d.file_size),
					fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase(),
					description: d.description || "",
					rejectionReason: void 0
				});
			});
			setRealDocs(fetchedDocs);
			ofc360.set({ documents: fetchedDocs });
		} catch (err) {
			console.error("Failed to fetch documents from API:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchRealDocuments();
	}, []);
	const [q, setQ] = (0, import_react.useState)("");
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const [sortField, setSortField] = (0, import_react.useState)("uploadDate");
	const [sortOrder, setSortOrder] = (0, import_react.useState)("desc");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 8;
	const [previewDoc, setPreviewDoc] = (0, import_react.useState)(null);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [generateOpen, setGenerateOpen] = (0, import_react.useState)(false);
	const [rejectOpen, setRejectOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [targetDoc, setTargetDoc] = (0, import_react.useState)(null);
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const [uploadEmployee, setUploadEmployee] = (0, import_react.useState)("company");
	const [uploadCategory, setUploadCategory] = (0, import_react.useState)("Employee Documents");
	const [uploadType, setUploadType] = (0, import_react.useState)("Aadhaar Card");
	const [uploadExpiry, setUploadExpiry] = (0, import_react.useState)("");
	const [uploadDesc, setUploadDesc] = (0, import_react.useState)("");
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const [uploadFileName, setUploadFileName] = (0, import_react.useState)("");
	const [uploadFileSize, setUploadFileSize] = (0, import_react.useState)("");
	const [genTemplateId, setGenTemplateId] = (0, import_react.useState)("offer");
	const [genEmployee, setGenEmployee] = (0, import_react.useState)("");
	const [genFields, setGenFields] = (0, import_react.useState)({});
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const [generatedDraft, setGeneratedDraft] = (0, import_react.useState)(null);
	const handleCategoryChange = (val) => {
		setUploadCategory(val);
		const types = CATEGORY_TYPES[val] || [];
		if (types.length > 0) setUploadType(types[0]);
	};
	const handleFileSelect = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setUploadFileName(file.name);
			setUploadFileSize(formatFileSize(file.size));
		}
	};
	const handleUploadSubmit = async (e) => {
		e.preventDefault();
		if (!selectedFile && !uploadFileName) {
			toast.error("Please select a document file to upload.");
			return;
		}
		setIsUploading(true);
		try {
			const formData = new FormData();
			const categoryId = categoriesList.find((c) => c.name === uploadCategory || c.code === uploadCategory)?.id || "00000000-0000-0000-0000-000000000001";
			const fileToUpload = selectedFile || new File([uploadDesc || "Document content"], uploadFileName || "document.pdf", { type: "application/pdf" });
			formData.append("file", fileToUpload);
			formData.append("category_id", categoryId);
			formData.append("title", uploadType || uploadFileName);
			if (uploadDesc) formData.append("description", uploadDesc);
			if (uploadExpiry) formData.append("expiry_date", uploadExpiry);
			if (uploadEmployee !== "company") {
				formData.append("employee_id", uploadEmployee);
				formData.append("visibility", "PRIVATE");
				formData.append("status_field", "PENDING");
				await apiInstance.post("/documents/employees", formData, { headers: { "Content-Type": "multipart/form-data" } });
			} else {
				formData.append("visibility", "PUBLIC");
				await apiInstance.post("/documents/company", formData, { headers: { "Content-Type": "multipart/form-data" } });
			}
			toast.success("Document uploaded successfully!");
			setIsUploading(false);
			setUploadOpen(false);
			setSelectedFile(null);
			setUploadFileName("");
			setUploadFileSize("");
			setUploadDesc("");
			setUploadExpiry("");
			await fetchRealDocuments();
		} catch (err) {
			console.error("Upload error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to upload document.");
			setIsUploading(false);
		}
	};
	const handleGenerateAI = () => {
		setIsGenerating(true);
		setGeneratedDraft(null);
		setTimeout(() => {
			DOCUMENT_TEMPLATES.find((x) => x.id === genTemplateId);
			const emp = ws.employees.find((x) => x.id === genEmployee);
			const recipient = emp ? emp.fullName : "Valued Professional";
			let text = `ofc360 TALENT LABS — OFFICIAL LETTER
Date: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
Recipient: ${recipient}

`;
			if (genTemplateId === "offer") text += `Dear ${recipient},

We are pleased to offer you the position of ${genFields["Role"] || "Frontend Architect"} at ofc360 Talent Labs.
Your initial annual compensation package will be INR ${genFields["Salary (LPA)"] || "12.5"} Lakhs per annum, subject to standard deductions.
Your employment will commence on ${genFields["Start Date"] || "2026-07-15"}.

This offer is contingent upon successful verification of your educational certifications and previous employment documents.

Best Regards,
People Ops Team
ofc360 Talent Labs`;
			else if (genTemplateId === "nda") text += `NON-DISCLOSURE AGREEMENT (NDA)

This Agreement is entered into by and between ofc360 Talent Labs and ${recipient}, with witness ${genFields["Witness Name"] || "Priya Nair"}.
Both parties agree to hold confidential information in strict confidence for a duration of ${genFields["Duration (Years)"] || "3"} years from signing.
Information shared includes all software source code, corporate records, and recruiting workflows.

Signed by:
ofc360 Representative
And Recipient: ${recipient}`;
			else text += `COMPANY HANDBOOK ACKNOWLEDGMENT
Version: ${genFields["Version Date"] || "2026-01-01"}

I, ${recipient}, holding the designation of ${genFields["Signee Designation"] || "Team Lead"},
acknowledge that I have received, read, and understood the policies stated in the ofc360 Company Handbook v4.0.

Acknowledged and Signed electronically.`;
			setGeneratedDraft(text);
			setIsGenerating(false);
			toast.success("Document draft generated with AI!");
		}, 1200);
	};
	const handleSaveGenerated = async () => {
		if (!generatedDraft) return;
		const template = DOCUMENT_TEMPLATES.find((x) => x.id === genTemplateId);
		const emp = ws.employees.find((x) => x.id === genEmployee);
		const empName = emp ? emp.fullName : "Company-wide";
		const fileName = `${template.title.replace(/\s+/g, "_")}_${empName.replace(/\s+/g, "_")}.pdf`;
		try {
			const formData = new FormData();
			const draftBlob = new Blob([generatedDraft], { type: "application/pdf" });
			const draftFile = new File([draftBlob], fileName, { type: "application/pdf" });
			const categoryId = (categoriesList.find((c) => c.is_company) || categoriesList[0])?.id || "00000000-0000-0000-0000-000000000001";
			formData.append("file", draftFile);
			formData.append("category_id", categoryId);
			formData.append("title", template.title);
			formData.append("description", `AI Generated template for ${empName}`);
			if (genEmployee) {
				formData.append("employee_id", genEmployee);
				formData.append("visibility", "PRIVATE");
				formData.append("status_field", "VERIFIED");
				await apiInstance.post("/documents/employees", formData, { headers: { "Content-Type": "multipart/form-data" } });
			} else {
				formData.append("visibility", "PUBLIC");
				await apiInstance.post("/documents/company", formData, { headers: { "Content-Type": "multipart/form-data" } });
			}
			toast.success("Generated document saved to Vault!");
			setGenerateOpen(false);
			setGeneratedDraft(null);
			await fetchRealDocuments();
		} catch (err) {
			console.error("Save generated document error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to save generated document.");
		}
	};
	const handleVerify = async (doc) => {
		try {
			await api.patch(`/documents/${doc.id}/verify`, { comments: "Verified & Approved" });
			toast.success(`Verified document: ${doc.name}`);
			if (previewDoc?.id === doc.id) setPreviewDoc({
				...doc,
				status: "Verified",
				rejectionReason: void 0
			});
			await fetchRealDocuments();
		} catch (err) {
			console.error("Verify error:", err);
			toast.error(err.message || "Failed to verify document");
		}
	};
	const handleRejectPrompt = (doc) => {
		setTargetDoc(doc);
		setRejectionReason("");
		setRejectOpen(true);
	};
	const handleRejectSubmit = async () => {
		if (!targetDoc) return;
		if (!rejectionReason.trim()) {
			toast.error("Please enter a rejection reason.");
			return;
		}
		try {
			await api.patch(`/documents/${targetDoc.id}/reject`, { comments: rejectionReason });
			toast.warning(`Document rejected: ${targetDoc.name}`);
			if (previewDoc?.id === targetDoc.id) setPreviewDoc({
				...targetDoc,
				status: "Rejected",
				rejectionReason
			});
			setRejectOpen(false);
			setTargetDoc(null);
			await fetchRealDocuments();
		} catch (err) {
			console.error("Reject error:", err);
			toast.error(err.message || "Failed to reject document");
		}
	};
	const handleRequestReupload = async (doc) => {
		try {
			await api.patch(`/documents/${doc.id}/reject`, { comments: "Re-upload requested. Please supply a clear copy." });
			toast.info(`Requested re-upload for: ${doc.name}`);
			if (previewDoc?.id === doc.id) setPreviewDoc({
				...doc,
				status: "Pending",
				rejectionReason: "Re-upload requested. Please supply a clear copy."
			});
			await fetchRealDocuments();
		} catch (err) {
			console.error("Request reupload error:", err);
			toast.error(err.message || "Failed to request reupload");
		}
	};
	const handleDeletePrompt = (doc) => {
		setTargetDoc(doc);
		setDeleteOpen(true);
	};
	const handleDeleteSubmit = async () => {
		if (!targetDoc) return;
		try {
			if (targetDoc.category === "Company Documents") await api.delete(`/documents/company/${targetDoc.id}`);
			else await api.delete(`/documents/employees/${targetDoc.id}`);
			toast.error(`Deleted document: ${targetDoc.name}`);
			if (previewDoc?.id === targetDoc.id) setPreviewDoc(null);
			setDeleteOpen(false);
			setTargetDoc(null);
			await fetchRealDocuments();
		} catch (err) {
			console.error("Delete error:", err);
			toast.error(err.message || "Failed to delete document");
		}
	};
	const handleDownload = async (doc) => {
		toast.info(`Downloading ${doc.name}...`);
		try {
			const path = doc.category === "Company Documents" ? `/documents/company/${doc.id}/download` : `/documents/employees/${doc.id}/download`;
			const response = await apiInstance.get(path, { responseType: "blob" });
			const blob = new Blob([response.data]);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = doc.name;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			toast.success(`Downloaded ${doc.name}`);
		} catch (err) {
			console.error("Download error:", err);
			const element = document.createElement("a");
			const file = new Blob([`ofc360 HR Vault. Document ID: ${doc.id}\nCategory: ${doc.category}\nName: ${doc.name}\nStatus: ${doc.status}`], { type: "text/plain" });
			element.href = URL.createObjectURL(file);
			element.download = doc.name;
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}
	};
	const stats = (0, import_react.useMemo)(() => {
		const total = docs.length;
		const verified = docs.filter((d) => d.status === "Verified").length;
		const pending = docs.filter((d) => d.status === "Pending").length;
		const rejected = docs.filter((d) => d.status === "Rejected").length;
		const mockNow = (/* @__PURE__ */ new Date("2026-06-28")).getTime();
		const thirtyDaysLimit = mockNow + 720 * 60 * 60 * 1e3;
		return {
			total,
			verified,
			pending,
			rejected,
			expiring: docs.filter((d) => {
				if (!d.expiryDate) return false;
				const t = new Date(d.expiryDate).getTime();
				return t >= mockNow && t <= thirtyDaysLimit;
			}).length
		};
	}, [docs]);
	(0, import_react.useMemo)(() => {
		const alerts = [];
		const mockNow = (/* @__PURE__ */ new Date("2026-06-28")).getTime();
		const thirtyDaysLimit = mockNow + 720 * 60 * 60 * 1e3;
		docs.forEach((d) => {
			if (d.expiryDate) {
				const t = new Date(d.expiryDate).getTime();
				if (t >= mockNow && t <= thirtyDaysLimit) alerts.push({
					id: `exp_${d.id}`,
					type: "warning",
					message: `${d.employeeName || "Company"}'s ${d.type} is expiring soon on ${d.expiryDate}.`,
					doc: d
				});
			}
		});
		const pendingDocs = docs.filter((d) => d.status === "Pending");
		if (pendingDocs.length > 0) alerts.push({
			id: "alert_pending",
			type: "info",
			message: `You have ${pendingDocs.length} documents awaiting review and verification.`
		});
		ws.employees.forEach((emp) => {
			const empDocs = docs.filter((d) => d.employeeId === emp.id);
			const hasAadhaar = empDocs.some((d) => d.type === "Aadhaar Card");
			const hasPAN = empDocs.some((d) => d.type === "PAN Card");
			if (!hasAadhaar) alerts.push({
				id: `miss_aadhaar_${emp.id}`,
				type: "error",
				message: `Mandatory document: Aadhaar Card is missing for ${emp.fullName}.`
			});
			if (!hasPAN) alerts.push({
				id: `miss_pan_${emp.id}`,
				type: "error",
				message: `Mandatory document: PAN Card is missing for ${emp.fullName}.`
			});
		});
		return alerts;
	}, [docs, ws.employees]);
	const filteredDocs = (0, import_react.useMemo)(() => {
		return docs.filter((d) => {
			const matchesQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.employeeName && d.employeeName.toLowerCase().includes(q.toLowerCase()) || d.category.toLowerCase().includes(q.toLowerCase()) || d.type.toLowerCase().includes(q.toLowerCase());
			let matchesTab = true;
			if (activeFilter === "Employee Documents") matchesTab = d.category === "Employee Documents" || d.category === "Education" || d.category === "Employment";
			else if (activeFilter === "Company Documents") matchesTab = d.category === "Company Documents";
			else if (activeFilter === "HR Templates") matchesTab = d.category === "Company Documents" && (d.type === "NDA" || d.type === "HR Policy" || d.type === "Company Handbook");
			else if (activeFilter === "Pending") matchesTab = d.status === "Pending";
			else if (activeFilter === "Verified") matchesTab = d.status === "Verified";
			else if (activeFilter === "Rejected") matchesTab = d.status === "Rejected";
			return matchesQ && matchesTab;
		});
	}, [
		docs,
		q,
		activeFilter
	]);
	const sortedDocs = (0, import_react.useMemo)(() => {
		const sorted = [...filteredDocs];
		sorted.sort((a, b) => {
			const aVal = a[sortField] || "";
			const bVal = b[sortField] || "";
			if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [
		filteredDocs,
		sortField,
		sortOrder
	]);
	const paginatedDocs = (0, import_react.useMemo)(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return sortedDocs.slice(startIndex, startIndex + itemsPerPage);
	}, [sortedDocs, currentPage]);
	const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);
	const handleSort = (field) => {
		if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortOrder("desc");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Documents",
				description: "Securely store, verify, and generate employee records and company templates.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setUploadOpen(true),
						className: "h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Upload Document"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setGenerateOpen(true);
							if (ws.employees.length > 0) setGenEmployee(ws.employees[0].id);
						},
						className: "h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" }), "Generate Document"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",
				children: STATS_CARDS.map((card) => {
					const val = stats[card.key];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: card.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-7 w-7 place-items-center rounded-lg ${card.bg}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: `h-3.5 w-3.5 ${card.color}` })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold font-display tracking-tight",
									children: val
								}), card.key === "verified" && docs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: [
										"(",
										Math.round(val / docs.length * 100),
										"%)"
									]
								})]
							})]
						})
					}, card.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/40 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative max-w-sm flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: q,
									onChange: (e) => {
										setQ(e.target.value);
										setCurrentPage(1);
									},
									placeholder: "Search by name, employee, category...",
									className: "h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									const headers = [
										"ID",
										"Name",
										"Employee",
										"Category",
										"Type",
										"Uploaded By",
										"Date",
										"Expiry",
										"Status",
										"Size"
									];
									const rows = docs.map((d) => [
										d.id,
										d.name,
										d.employeeName || "Company-wide",
										d.category,
										d.type,
										d.uploadedBy,
										d.uploadDate,
										d.expiryDate || "",
										d.status,
										d.fileSize
									].map((v) => `"${v.replace(/"/g, "\"\"")}"`).join(","));
									const csv = [headers.join(","), ...rows].join("\n");
									const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
									const a = document.createElement("a");
									a.href = url;
									a.download = "documents_vault.csv";
									a.click();
									URL.revokeObjectURL(url);
									toast.success("Exported documents catalog CSV");
								},
								className: "h-9 gap-1.5 border-border bg-background/40 hover:bg-accent/60 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-muted-foreground" }), "Export CSV"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-border bg-muted/10 scrollbar-none",
							children: [
								{
									id: "all",
									label: "All Vault"
								},
								{
									id: "Employee Documents",
									label: "Employee Files"
								},
								{
									id: "Company Documents",
									label: "Company Documents"
								},
								{
									id: "HR Templates",
									label: "HR Templates"
								},
								{
									id: "Pending",
									label: "Pending Verification"
								},
								{
									id: "Verified",
									label: "Verified"
								},
								{
									id: "Rejected",
									label: "Rejected"
								}
							].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setActiveFilter(tab.id);
									setCurrentPage(1);
								},
								className: `shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${activeFilter === tab.id ? "bg-foreground text-background border-foreground" : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"}`,
								children: tab.label
							}, tab.id))
						}),
						paginatedDocs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-16 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground",
									children: "No documents found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-sm text-sm text-muted-foreground",
									children: "Try adjusting your search criteria, clearing the filters, or upload a new record."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
								className: "min-w-[900px] border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
									className: "bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "hover:bg-transparent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
												className: "px-4 py-3 cursor-pointer select-none",
												onClick: () => handleSort("name"),
												children: ["Document Name ", sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
												className: "px-4 py-3 cursor-pointer select-none",
												onClick: () => handleSort("employeeName"),
												children: ["Employee ", sortField === "employeeName" && (sortOrder === "asc" ? "↑" : "↓")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
												className: "px-4 py-3 cursor-pointer select-none",
												onClick: () => handleSort("category"),
												children: ["Category ", sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3 text-muted-foreground",
												children: "Uploaded By"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
												className: "px-4 py-3 cursor-pointer select-none",
												onClick: () => handleSort("uploadDate"),
												children: ["Upload Date ", sortField === "uploadDate" && (sortOrder === "asc" ? "↑" : "↓")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3 text-muted-foreground",
												children: "Expiry Date"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3 text-center text-muted-foreground",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "px-4 py-3 text-muted-foreground",
												children: "File Size"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-4 py-3 text-right" })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedDocs.map((doc) => {
									const isExpiring = doc.expiryDate && new Date(doc.expiryDate).getTime() <= (/* @__PURE__ */ new Date("2026-06-28")).getTime() + 720 * 60 * 60 * 1e3;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "group border-t border-border transition-colors hover:bg-accent/25 cursor-pointer",
										onClick: () => setPreviewDoc(doc),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground max-w-[200px] truncate",
														title: doc.name,
														children: doc.name
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 font-medium text-foreground/80",
												children: doc.employeeName || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground italic",
													children: "Company-wide"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "px-4 py-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: doc.category
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-semibold text-foreground/75 mt-0.5",
													children: doc.type
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-xs text-muted-foreground",
												children: doc.uploadedBy
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-xs text-muted-foreground",
												children: doc.uploadDate
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-xs",
												children: doc.expiryDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: isExpiring ? "text-purple-500 font-medium" : "text-muted-foreground",
													children: doc.expiryDate
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/40 italic",
													children: "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "px-4 py-3 text-center",
												children: [
													doc.status === "Verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														className: "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 gap-1 border-none shadow-none font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), " Verified"]
													}),
													doc.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														className: "bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 gap-1 border-none shadow-none font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Pending"]
													}),
													doc.status === "Rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														className: "bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 gap-1 border-none shadow-none font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), " Rejected"]
													}),
													doc.status === "Expired" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														className: "bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 gap-1 border-none shadow-none font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Expired"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-xs text-muted-foreground",
												children: doc.fileSize
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "px-4 py-3 text-right",
												onClick: (e) => e.stopPropagation(),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setPreviewDoc(doc),
															className: "rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
															title: "View inline mockup",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleDownload(doc),
															className: "rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
															title: "Download Document",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
														}),
														doc.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleVerify(doc),
															className: "rounded p-1.5 text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer",
															title: "Verify & Approve",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleRejectPrompt(doc),
															className: "rounded p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer",
															title: "Reject Document",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" })
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleDeletePrompt(doc),
															className: "rounded p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer",
															title: "Delete Document",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})
													]
												})
											})
										]
									}, doc.id);
								}) })]
							})
						}),
						totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing Page ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold text-foreground",
										children: currentPage
									}),
									" of ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold text-foreground",
										children: totalPages
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: currentPage === 1,
									onClick: () => setCurrentPage((c) => Math.max(1, c - 1)),
									className: "h-8 border-border hover:bg-accent/60 cursor-pointer",
									children: "Previous"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: currentPage === totalPages,
									onClick: () => setCurrentPage((c) => Math.min(totalPages, c + 1)),
									className: "h-8 border-border hover:bg-accent/60 cursor-pointer",
									children: "Next"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: "Upload New Document"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUploadSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Employee Association"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: uploadEmployee,
									onValueChange: setUploadEmployee,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "max-h-[200px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "company",
											children: "Company-wide (No specific employee)"
										}), ws.employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: emp.id,
											children: [
												emp.fullName,
												" (",
												emp.employeeId,
												")"
											]
										}, emp.id))]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: uploadCategory,
										onValueChange: handleCategoryChange,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: cat,
											children: cat
										}, cat)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Document Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: uploadType,
										onValueChange: setUploadType,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (CATEGORY_TYPES[uploadCategory] || []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t,
											children: t
										}, t)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Expiry Date (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: uploadExpiry,
										onChange: (e) => setUploadExpiry(e.target.value),
										className: "pl-9 bg-background/50 border-border text-xs"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Description / Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Specify file details or compliance requirements",
									value: uploadDesc,
									onChange: (e) => setUploadDesc(e.target.value),
									className: "min-h-[60px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								ref: fileInputRef,
								onChange: handleFileSelect,
								className: "hidden",
								accept: ".pdf,.jpg,.jpeg,.png,.docx"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Upload File (PDF, JPG, PNG, DOCX)"
								}), uploadFileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground truncate max-w-[200px]",
											children: uploadFileName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: uploadFileSize
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => {
											setSelectedFile(null);
											setUploadFileName("");
											setUploadFileSize("");
										},
										className: "h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer",
										children: "Change File"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => fileInputRef.current?.click(),
									className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mb-2 h-6 w-6 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-foreground",
											children: "Click to browse and select a file"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[10px] text-muted-foreground",
											children: "Supports PDF, PNG, JPG up to 10MB"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setUploadOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: isUploading,
									className: "h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer",
									children: isUploading ? "Uploading..." : "Upload File"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: generateOpen,
				onOpenChange: setGenerateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-2xl bg-background border-border shadow-2xl p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-5 h-[580px] divide-y md:divide-y-0 md:divide-x divide-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2 p-5 flex flex-col justify-between h-full bg-muted/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display text-base font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4 text-indigo-500 animate-pulse" }), "AI Letter Generator"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Generate compliant contracts and documents."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Document Template"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: genTemplateId,
											onValueChange: (val) => {
												setGenTemplateId(val);
												setGenFields({});
												setGeneratedDraft(null);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 bg-background/70 border-border text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DOCUMENT_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: t.id,
												children: t.title
											}, t.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "For Employee"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: genEmployee,
											onValueChange: setGenEmployee,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 bg-background/70 border-border text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Employee" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ws.employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: emp.id,
												children: emp.fullName
											}, emp.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Template Parameters"
										}), DOCUMENT_TEMPLATES.find((x) => x.id === genTemplateId)?.fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-foreground/80",
												children: field
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: genFields[field] || "",
												onChange: (e) => setGenFields({
													...genFields,
													[field]: e.target.value
												}),
												className: "h-8 bg-background/50 border-border text-xs"
											})]
										}, field))]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleGenerateAI,
									disabled: isGenerating || !genEmployee,
									className: "w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5" }), isGenerating ? "Drafting with AI..." : "Generate Draft"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setGenerateOpen(false),
									className: "h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer",
									children: "Cancel"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-3 p-5 flex flex-col justify-between h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex flex-col min-h-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-foreground",
										children: "Document Draft Preview"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[9px] border-indigo-500/20 text-indigo-500 bg-indigo-500/5",
										children: "Ready to Save"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 overflow-auto bg-muted/20 border border-border rounded-xl p-4 mt-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap",
									children: isGenerating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-indigo-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: "AI Assistant drafting letter..."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground/85",
												children: "Formatting with official templates & clauses"
											})
										]
									}) : generatedDraft ? generatedDraft : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-6 w-6 text-muted-foreground/50 mb-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: "No Draft Available"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px]",
												children: "Select an employee, configure parameters, and generate the contract."
											})
										]
									})
								})]
							}), generatedDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-border flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setGeneratedDraft(null),
									className: "h-9 text-xs border-border bg-transparent cursor-pointer",
									children: "Clear Draft"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleSaveGenerated,
									className: "h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), "Save & Verify Document"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: rejectOpen,
				onOpenChange: setRejectOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display font-bold text-rose-500 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }), "Reject Document Compliance"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Please state the reason for rejecting ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold text-foreground",
										children: targetDoc?.name
									}),
									". The employee will see this feedback."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: rejectionReason,
								onChange: (e) => setRejectionReason(e.target.value),
								placeholder: "e.g. Signature cut off, document blur, expired date, wrong employee ID...",
								className: "min-h-[100px] border-border text-xs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setRejectOpen(false);
								setTargetDoc(null);
							},
							className: "h-9 border-border bg-transparent cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleRejectSubmit,
							className: "h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer",
							children: "Confirm Rejection"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deleteOpen,
				onOpenChange: setDeleteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold text-foreground",
							children: "Delete Document"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-2 text-xs text-muted-foreground",
							children: [
								"Are you sure you want to permanently delete ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-semibold text-foreground",
									children: targetDoc?.name
								}),
								"? This action will wipe the file and remove it from audit history."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									setDeleteOpen(false);
									setTargetDoc(null);
								},
								className: "h-9 border-border bg-transparent cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleDeleteSubmit,
								className: "h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer",
								children: "Delete File"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!previewDoc,
				onOpenChange: (open) => !open && setPreviewDoc(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl",
					children: previewDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "p-5 border-b border-border bg-muted/10 shrink-0 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wide border-border",
											children: previewDoc.category
										}),
										previewDoc.status === "Verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border-none shadow-none font-medium text-xs",
											children: "Verified"
										}),
										previewDoc.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border-none shadow-none font-medium text-xs",
											children: "Pending Review"
										}),
										previewDoc.status === "Rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border-none shadow-none font-medium text-xs",
											children: "Rejected"
										}),
										previewDoc.status === "Expired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 border-none shadow-none font-medium text-xs",
											children: "Expired"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "font-display text-base font-bold text-foreground mt-2 truncate text-left",
									title: previewDoc.name,
									children: previewDoc.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground text-left mt-0.5",
									children: [
										"Type: ",
										previewDoc.type,
										" • Uploaded by ",
										previewDoc.uploadedBy,
										" on ",
										previewDoc.uploadDate
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "flex-1 p-5 min-h-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Inline Verification View"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "overflow-hidden rounded-2xl border border-border bg-muted/40 aspect-[4/3] relative flex items-center justify-center p-4",
											children: [previewDoc.type === "Aadhaar Card" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-[320px] aspect-[8.5/5.5] bg-sky-50 dark:bg-sky-950/20 border border-sky-300/40 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-start",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[7px] font-bold text-sky-800 dark:text-sky-400 uppercase leading-none",
															children: "Government of India"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[5px] text-sky-600/80 leading-none",
															children: "Unique Identification Authority of India"
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 bg-sky-200 dark:bg-sky-800 rounded-full opacity-60" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-2.5 my-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-12 h-14 bg-sky-200 dark:bg-sky-900 border border-sky-400/20 rounded flex items-center justify-center shrink-0",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-sky-600 dark:text-sky-400" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[6px] space-y-1 text-sky-900 dark:text-sky-200 text-left",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "font-semibold text-[8px]",
																	children: previewDoc.employeeName || "Jordan Lee"
																}) }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "DOB: 12/04/1996" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gender: Male" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "mt-1 leading-relaxed text-[5px] opacity-75 text-left",
																	children: "Address: 12th Cross Rd, Indiranagar, Bangalore, 560038"
																})
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-t border-sky-400/20 pt-1.5 flex justify-between items-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-xs font-bold text-sky-900 dark:text-sky-100 tracking-wider",
															children: "1984 0122 1042"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[5px] uppercase font-bold text-sky-800 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-1 py-0.5 rounded",
															children: "Mera Aadhaar"
														})]
													})
												]
											}) : previewDoc.type === "PAN Card" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-[320px] aspect-[8.5/5.5] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-emerald-400/30 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-center border-b border-emerald-500/20 pb-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[6px] uppercase font-bold text-emerald-800 dark:text-emerald-400 leading-none",
															children: "Income Tax Department"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[6px] text-emerald-600 font-medium leading-none",
															children: "GOVT OF INDIA"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-3 my-2.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-10 h-12 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 rounded flex items-center justify-center shrink-0",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-emerald-600" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[6px] space-y-1 text-emerald-900 dark:text-emerald-100 text-left",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Name: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "font-semibold",
																	children: previewDoc.employeeName || "Jordan Lee"
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Father's Name: K. M. Lee" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Date of Birth: 12/04/1996" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "mt-1 font-mono text-[9px] font-bold text-emerald-900 dark:text-emerald-100 tracking-wide",
																	children: "ABCDE1042F"
																})
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-center text-[5px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "italic border-b border-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-mono",
															children: previewDoc.employeeName?.split(" ")[0] || "Jordan"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 bg-yellow-400/40 dark:bg-yellow-500/20 rounded-full" })]
													})
												]
											}) : previewDoc.type === "Passport" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-[320px] aspect-[8.5/5.5] bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-start border-b border-slate-700 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[6px] uppercase font-bold tracking-widest text-slate-400",
															children: "Republic of India"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[6px] uppercase font-bold text-slate-400",
															children: "PASSPORT"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-3.5 my-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-12 h-14 bg-slate-800 border border-slate-700 rounded flex items-center justify-center shrink-0",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-slate-400" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-[6px] space-y-0.5 text-slate-300 text-left",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Surname: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "font-semibold text-slate-100 uppercase",
																	children: previewDoc.employeeName?.split(" ").pop() || "LEE"
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Given Names: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																	className: "font-semibold text-slate-100",
																	children: previewDoc.employeeName?.split(" ")[0] || "JORDAN"
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nationality: Indian" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Passport No: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-mono font-bold text-yellow-400",
																	children: "Z3210452"
																})] }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Expiry: ", previewDoc.expiryDate || "2030-01-01"] })
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex justify-between items-center text-[4px] font-mono text-slate-500 tracking-wider",
														children: "P<IND<<JORDAN<LEE<<<<<<<<<<<<<<<<<<<<<<<"
													})
												]
											}) : previewDoc.category === "Company Documents" || previewDoc.type === "Resume" || previewDoc.type === "Offer Letter" || previewDoc.type === "Relieving Letter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-[300px] h-[200px] bg-white text-slate-800 border border-slate-300 rounded shadow-md p-4 relative flex flex-col justify-between overflow-hidden select-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-b border-slate-300 pb-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[7px] font-bold text-slate-900 tracking-wide flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-2.5 w-2.5 text-indigo-600" }), "ofc360 TALENT LABS"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[5px] text-slate-400 leading-none",
															children: "Internal Compliance & Human Resources Vault"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "my-2 text-left space-y-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[8px] font-bold text-slate-900 underline truncate",
																children: previewDoc.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[5px] text-slate-500 leading-relaxed max-w-full",
																children: "This document stands as an official record of ofc360 HR Talent Labs. Details contained herein are confidential under corporate NDAs and data processing regulations."
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[5px] text-slate-600 italic",
																children: [
																	"Category: ",
																	previewDoc.category,
																	" • Type: ",
																	previewDoc.type
																]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-t border-slate-200 pt-2 flex justify-between items-center text-[5px] text-slate-400",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verification Hash: SHA-256" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "h-3 w-10 bg-indigo-500/10 rounded flex items-center justify-center font-bold text-indigo-600 text-[4px]",
															children: "SECURE DOC"
														})]
													})
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-[300px] aspect-[4/3] bg-card border border-border rounded flex flex-col items-center justify-center p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-muted-foreground/60 mb-2" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-semibold text-foreground text-center truncate w-full",
														children: previewDoc.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground/80 mt-1",
														children: "Generic binary layout view"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
												children: previewDoc.fileType
											})]
										})]
									}),
									previewDoc.status === "Rejected" && previewDoc.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), "Rejection Compliance Remarks:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left",
											children: [
												"\"",
												previewDoc.rejectionReason,
												"\""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Document Details"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Employee Owner"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: previewDoc.employeeName || "Company-wide"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Verification Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: previewDoc.type
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "File Size"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: previewDoc.fileSize
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Expiry Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: previewDoc.expiryDate || "No expiration date"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Internal Description"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-foreground mt-0.5 leading-relaxed",
														children: previewDoc.description || "No description provided."
													})]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Verification Audit Timeline"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-card/40 p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5 animate-bounce" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-foreground",
														children: "Uploaded & Saved"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: [
															"By ",
															previewDoc.uploadedBy,
															" on ",
															previewDoc.uploadDate
														]
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"}`,
														children: previewDoc.status === "Pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-foreground",
														children: "Compliance Review"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: previewDoc.status === "Pending" ? "Awaiting review from Human Resources" : "Reviewed by People Ops Officer"
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-3 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "border border-border text-muted-foreground bg-muted" : previewDoc.status === "Verified" ? "bg-emerald-500 text-white" : previewDoc.status === "Rejected" ? "bg-rose-500 text-white" : "bg-slate-500 text-white"}`,
														children: previewDoc.status === "Verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" }) : previewDoc.status === "Rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-foreground",
														children: "Final Compliance Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: [
															previewDoc.status === "Verified" && `Verified & Approved`,
															previewDoc.status === "Rejected" && `Rejected: ${previewDoc.rejectionReason}`,
															previewDoc.status === "Pending" && `Decision pending`,
															previewDoc.status === "Expired" && `Expired`
														]
													})] })]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
											className: "font-bold flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 text-indigo-500" }), "Smart Verification Gateways"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] leading-relaxed text-muted-foreground",
											children: "This component is modularized to support direct APIs for DigiLocker, Aadhaar ID checks, PAN Tax validations, and E-Signatures."
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end",
							children: [
								previewDoc.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => handleRequestReupload(previewDoc),
										className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-amber-500" }), "Request Re-upload"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => handleRejectPrompt(previewDoc),
										className: "h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), "Reject Document"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => handleVerify(previewDoc),
										className: "h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), "Verify & Approve"]
									})
								] }),
								previewDoc.status !== "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => {
										const updatedDocs = docs.map((d) => {
											if (d.id === previewDoc.id) return {
												...d,
												status: "Pending",
												rejectionReason: void 0
											};
											return d;
										});
										setRealDocs(updatedDocs);
										ofc360.set({ documents: updatedDocs });
										setPreviewDoc({
											...previewDoc,
											status: "Pending",
											rejectionReason: void 0
										});
										toast.info("Document reset to Pending review state");
									},
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Reset Status to Review"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => handleDownload(previewDoc),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download"]
								})
							]
						})
					] })
				})
			})
		]
	});
}
//#endregion
export { DocumentsPage as component };
