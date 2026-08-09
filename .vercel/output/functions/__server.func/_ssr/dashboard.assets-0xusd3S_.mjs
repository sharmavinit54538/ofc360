import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { on as useofc360 } from "./ofc360-store-Cb6xhYOw.mjs";
import { t as api } from "./client-Cbbel9lL.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Bn as Download, D as Trash2, R as SquarePen, St as Package, W as ShieldCheck, Y as Search, at as QrCode, f as User, lr as CircleAlert, lt as Plus, ot as Printer, tn as Info } from "../_libs/lucide-react.mjs";
import { u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DvAUVXWO.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-C6l-HH22.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as newId } from "./store-Bfab2GKW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.assets-0xusd3S_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		value: "laptop",
		label: "Laptops"
	},
	{
		value: "desktop",
		label: "Desktops"
	},
	{
		value: "monitor",
		label: "Monitors"
	},
	{
		value: "phone",
		label: "Phones"
	},
	{
		value: "accessory",
		label: "Accessories"
	},
	{
		value: "vehicle",
		label: "Vehicles"
	},
	{
		value: "other",
		label: "Other Equipment"
	}
];
var STATUSES = [
	{
		value: "available",
		label: "Available",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10"
	},
	{
		value: "assigned",
		label: "Assigned",
		color: "text-blue-500",
		bg: "bg-blue-500/10"
	},
	{
		value: "under-repair",
		label: "Under Repair",
		color: "text-amber-500",
		bg: "bg-amber-500/10"
	},
	{
		value: "lost",
		label: "Lost",
		color: "text-rose-500",
		bg: "bg-rose-500/10"
	},
	{
		value: "expired",
		label: "Expired/Retired",
		color: "text-neutral-500",
		bg: "bg-neutral-500/10"
	},
	{
		value: "retired",
		label: "Retired",
		color: "text-purple-500",
		bg: "bg-purple-500/10"
	}
];
var COLORS = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#3b82f6",
	"#6b7280"
];
function AssetsPage() {
	const authWs = useofc360();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 8;
	const [detailAsset, setDetailAsset] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [assignOpen, setAssignOpen] = (0, import_react.useState)(false);
	const [transferOpen, setTransferOpen] = (0, import_react.useState)(false);
	const [repairOpen, setRepairOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [qrOpen, setQrOpen] = (0, import_react.useState)(false);
	const [scanOpen, setScanOpen] = (0, import_react.useState)(false);
	const [targetAsset, setTargetAsset] = (0, import_react.useState)(null);
	const [scannedAssetTag, setScannedAssetTag] = (0, import_react.useState)("");
	const [assetName, setAssetName] = (0, import_react.useState)("");
	const [assetCategory, setAssetCategory] = (0, import_react.useState)("laptop");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [serial, setSerial] = (0, import_react.useState)("");
	const [purchaseDate, setPurchaseDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [purchaseCost, setPurchaseCost] = (0, import_react.useState)("1200");
	const [vendor, setVendor] = (0, import_react.useState)("");
	const [warrantyUntil, setWarrantyUntil] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [assignEmpId, setAssignEmpId] = (0, import_react.useState)("");
	const [assignReturnDate, setAssignReturnDate] = (0, import_react.useState)("");
	const [assignNotes, setAssignNotes] = (0, import_react.useState)("");
	const [transferEmpId, setTransferEmpId] = (0, import_react.useState)("");
	const [transferNotes, setTransferNotes] = (0, import_react.useState)("");
	const [repairVendor, setRepairVendor] = (0, import_react.useState)("");
	const [repairCost, setRepairCost] = (0, import_react.useState)("150");
	const [repairNotes, setRepairNotes] = (0, import_react.useState)("");
	const { data: listData, isLoading } = useQuery({
		queryKey: [
			"assets",
			q,
			statusFilter
		],
		queryFn: () => {
			const params = new URLSearchParams();
			if (q) params.set("search", q);
			if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
			params.set("limit", "100");
			return api.get(`assets?${params.toString()}`);
		}
	});
	const { data: analyticsData } = useQuery({
		queryKey: ["assets-analytics"],
		queryFn: () => api.get("assets/analytics")
	});
	const assets = listData?.data?.items || [];
	const apiStats = analyticsData?.data || {
		total_assets: 0,
		available_assets: 0,
		assigned_assets: 0,
		under_repair_assets: 0,
		lost_assets: 0,
		expiring_warranty_assets: 0
	};
	const searchParams = useRouterState({ select: (s) => s.location.search });
	(0, import_react.useEffect)(() => {
		if (searchParams && searchParams.scan && assets.length > 0) {
			const matched = assets.find((a) => a.id === searchParams.scan || a.tag === searchParams.scan);
			if (matched) {
				setDetailAsset(matched);
				toast.success(`Scanned QR Code for asset: ${matched.tag} (${matched.name})`);
				navigate({
					to: "/dashboard/assets",
					search: {},
					replace: true
				});
			}
		}
	}, [
		searchParams,
		assets,
		navigate
	]);
	const showApiError = (err, fallback) => {
		let msg = err.message || fallback;
		if (err.data && err.data.detail && Array.isArray(err.data.detail)) msg = `Validation error: ${err.data.detail.map((d) => `${d.loc.slice(1).join(".")} : ${d.msg}`).join(", ")}`;
		else if (err.data && err.data.errors && Array.isArray(err.data.errors)) msg = err.data.errors.map((e) => e.message).join(", ");
		toast.error(msg);
	};
	const createMutation = useMutation({
		mutationFn: (newAsset) => api.post("assets", newAsset),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success("Asset created successfully!");
			setAddOpen(false);
			setAssetName("");
			setBrand("");
			setModel("");
			setSerial("");
			setPurchaseCost("1200");
			setVendor("");
			setNotes("");
			setLocation("");
		},
		onError: (err) => {
			showApiError(err, "Failed to create asset");
		}
	});
	const editMutation = useMutation({
		mutationFn: ({ id, payload }) => api.put(`assets/${id}`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success("Asset specifications updated successfully.");
			setEditOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to update asset specifications");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => api.delete(`assets/${id}`),
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.error("Asset record deleted successfully.");
			setDeleteOpen(false);
			if (detailAsset?.id === targetAsset?.id) setDetailAsset(null);
		},
		onError: (err) => {
			showApiError(err, "Failed to delete asset");
		}
	});
	const assignMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/assign`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Asset assigned successfully!`);
			setAssignOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to assign asset");
		}
	});
	const returnMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/return`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Asset returned and checked back in.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to return asset");
		}
	});
	const transferMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/transfer`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Transferred asset successfully!`);
			setTransferOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to transfer asset");
		}
	});
	const lostMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/lost`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.warning(`Asset has been flagged as lost.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to mark asset as lost");
		}
	});
	const retiredMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/retired`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.info(`Asset decommissioned and retired.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to retire asset");
		}
	});
	const repairMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/maintenance`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.info(`Asset status set to Under Repair`);
			setRepairOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to send asset for repair");
		}
	});
	const handleAddSubmit = (e) => {
		e.preventDefault();
		if (!assetName || !serial || !brand) {
			toast.error("Please fill in Asset Name, Brand, and Serial Number.");
			return;
		}
		const assetTag = `${{
			laptop: "LAP",
			desktop: "DKT",
			monitor: "MON",
			phone: "PHN",
			accessory: "ACC",
			vehicle: "VEH",
			other: "AST"
		}[assetCategory] || "AST"}-${Math.floor(1e3 + Math.random() * 9e3)}`;
		const costNum = parseFloat(purchaseCost) || 0;
		createMutation.mutate({
			tag: assetTag,
			name: assetName,
			category: assetCategory,
			serial,
			vendor: vendor || "Unknown Vendor",
			purchase_date: purchaseDate,
			warranty_until: warrantyUntil || new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)).toISOString().split("T")[0],
			brand,
			model,
			purchase_cost: costNum,
			location: location || "HQ IT Desk",
			notes
		});
	};
	const handleEditOpen = (asset) => {
		setTargetAsset(asset);
		setAssetName(asset.name);
		setAssetCategory(asset.category);
		setBrand(asset.brand || "");
		setModel(asset.model || "");
		setSerial(asset.serial);
		setPurchaseDate(asset.purchaseDate);
		setPurchaseCost(asset.purchaseCost?.toString() || "");
		setVendor(asset.vendor);
		setWarrantyUntil(asset.warrantyUntil);
		setLocation(asset.location || "");
		setNotes(asset.notes || "");
		setEditOpen(true);
	};
	const handleEditSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset) return;
		editMutation.mutate({
			id: targetAsset.id,
			payload: {
				name: assetName,
				category: assetCategory,
				brand,
				model,
				serial,
				purchase_date: purchaseDate,
				purchase_cost: parseFloat(purchaseCost) || 0,
				vendor,
				warranty_until: warrantyUntil,
				location,
				notes
			}
		});
	};
	const handleDeleteSubmit = () => {
		if (!targetAsset) return;
		deleteMutation.mutate(targetAsset.id);
	};
	const handleAssignOpen = (asset) => {
		setTargetAsset(asset);
		setAssignNotes("");
		setAssignReturnDate("");
		if (authWs.employees.length > 0) setAssignEmpId(authWs.employees[0].fullName);
		setAssignOpen(true);
	};
	const handleAssignSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset || !assignEmpId) return;
		const emp = authWs.employees.find((x) => x.fullName === assignEmpId) || {
			fullName: assignEmpId,
			department: "General Operations"
		};
		assignMutation.mutate({
			id: targetAsset.id,
			payload: {
				employee_name: emp.fullName,
				department: emp.department,
				expected_return_date: assignReturnDate || null,
				notes: assignNotes
			}
		});
	};
	const handleReturnAsset = (asset) => {
		returnMutation.mutate(asset.id);
	};
	const handleTransferOpen = (asset) => {
		setTargetAsset(asset);
		setTransferNotes("");
		if (authWs.employees.length > 0) setTransferEmpId(authWs.employees[0].fullName);
		setTransferOpen(true);
	};
	const handleTransferSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset || !transferEmpId) return;
		const emp = authWs.employees.find((x) => x.fullName === transferEmpId) || {
			fullName: transferEmpId,
			department: "Operations"
		};
		transferMutation.mutate({
			id: targetAsset.id,
			payload: {
				employee_name: emp.fullName,
				department: emp.department,
				notes: transferNotes
			}
		});
	};
	const handleMarkLost = (asset) => {
		lostMutation.mutate(asset.id);
	};
	const handleMarkRetired = (asset) => {
		retiredMutation.mutate(asset.id);
	};
	const handleRepairOpen = (asset) => {
		setTargetAsset(asset);
		setRepairVendor("");
		setRepairCost("150");
		setRepairNotes("");
		setRepairOpen(true);
	};
	const handleRepairSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset) return;
		repairMutation.mutate({
			id: targetAsset.id,
			payload: {
				vendor: repairVendor || "Authorized Service Partner",
				cost: parseFloat(repairCost) || 0,
				notes: repairNotes
			}
		});
	};
	const handleScanSimulation = () => {
		if (!scannedAssetTag) return;
		const matched = assets.find((a) => a.tag === scannedAssetTag || a.id === scannedAssetTag);
		if (matched) {
			setDetailAsset(matched);
			setScanOpen(false);
			toast.success(`Scanned QR tag: ${matched.tag}`);
		} else toast.error("No asset matching this scanned tag found.");
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: apiStats.total_assets ?? 0,
			available: apiStats.available_assets ?? 0,
			assigned: apiStats.assigned_assets ?? 0,
			repair: apiStats.under_repair_assets ?? 0,
			lost: apiStats.lost_assets ?? 0,
			expiring: apiStats.expiring_warranty_assets ?? 0
		};
	}, [apiStats]);
	const notifications = (0, import_react.useMemo)(() => {
		const alerts = [];
		const mockNow = (/* @__PURE__ */ new Date("2026-06-28")).getTime();
		const thirtyDaysLimit = mockNow + 720 * 60 * 60 * 1e3;
		assets.forEach((a) => {
			if (a.warrantyUntil) {
				const wTime = new Date(a.warrantyUntil).getTime();
				if (wTime > 0 && wTime < mockNow) alerts.push({
					id: `war_exp_${a.id}`,
					type: "error",
					message: `Warranty expired for ${a.tag} (${a.name}) on ${a.warrantyUntil}.`,
					asset: a
				});
				else if (wTime >= mockNow && wTime <= thirtyDaysLimit) alerts.push({
					id: `war_soon_${a.id}`,
					type: "warning",
					message: `Warranty expiring soon for ${a.tag} on ${a.warrantyUntil}.`,
					asset: a
				});
			}
			if (a.status === "lost") alerts.push({
				id: `lost_${a.id}`,
				type: "error",
				message: `Audit flagged: Asset ${a.tag} is lost. Pending replacement.`,
				asset: a
			});
			if (a.status === "under-repair") alerts.push({
				id: `rep_${a.id}`,
				type: "info",
				message: `${a.tag} is currently in repair at vendor.`,
				asset: a
			});
		});
		return alerts;
	}, [assets]);
	const filteredAssets = (0, import_react.useMemo)(() => {
		return assets.filter((a) => {
			const matchQ = !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.tag.toLowerCase().includes(q.toLowerCase()) || a.serial.toLowerCase().includes(q.toLowerCase()) || a.brand && a.brand.toLowerCase().includes(q.toLowerCase()) || a.assignedTo && a.assignedTo.toLowerCase().includes(q.toLowerCase());
			let matchStatus = true;
			if (statusFilter !== "all") if (statusFilter === "retired") matchStatus = a.status === "retired" || a.status === "expired";
			else matchStatus = a.status === statusFilter;
			return matchQ && matchStatus;
		});
	}, [
		assets,
		q,
		statusFilter
	]);
	const paginatedAssets = (0, import_react.useMemo)(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return filteredAssets.slice(startIdx, startIdx + itemsPerPage);
	}, [filteredAssets, currentPage]);
	const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
	const categoryChartData = (0, import_react.useMemo)(() => {
		return apiStats.category_distribution || [];
	}, [apiStats]);
	const repairCostChartData = (0, import_react.useMemo)(() => {
		return apiStats.repair_costs_by_category || [];
	}, [apiStats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Asset Management",
				description: "Monitor configurations, assignments, QR codes, and maintenance records of company hardware.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setScanOpen(true),
							className: "h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" }), "Scan QR Code"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								const headers = [
									"Asset Tag",
									"Asset Name",
									"Category",
									"Brand",
									"Model",
									"Serial",
									"Purchase Cost",
									"Purchase Date",
									"Status",
									"Assigned Employee"
								];
								const rows = assets.map((a) => [
									a.tag,
									a.name,
									a.category,
									a.brand || "",
									a.model || "",
									a.serial,
									(a.purchaseCost || 0).toString(),
									a.purchaseDate,
									a.status,
									a.assignedTo || "Unassigned"
								].map((v) => `"${v.replace(/"/g, "\"\"")}"`).join(","));
								const csv = [headers.join(","), ...rows].join("\n");
								const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
								const link = document.createElement("a");
								link.href = url;
								link.download = `ofc360_Assets_Inventory_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
								link.click();
								URL.revokeObjectURL(url);
								toast.success("Inventory exported as CSV");
							},
							className: "h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setAddOpen(true),
							className: "h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Asset"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6",
				children: [
					{
						key: "total",
						title: "Total Assets",
						count: stats.total,
						color: "text-blue-500",
						bg: "bg-blue-500/10"
					},
					{
						key: "available",
						title: "Available Assets",
						count: stats.available,
						color: "text-emerald-500",
						bg: "bg-emerald-500/10"
					},
					{
						key: "assigned",
						title: "Assigned Assets",
						count: stats.assigned,
						color: "text-indigo-500",
						bg: "bg-indigo-500/10"
					},
					{
						key: "repair",
						title: "Under Repair",
						count: stats.repair,
						color: "text-amber-500",
						bg: "bg-amber-500/10"
					},
					{
						key: "lost",
						title: "Lost Assets",
						count: stats.lost,
						color: "text-rose-500",
						bg: "bg-rose-500/10"
					},
					{
						key: "expiring",
						title: "Expiring Warranty",
						count: stats.expiring,
						color: "text-purple-500",
						bg: "bg-purple-500/10"
					}
				].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-muted-foreground truncate leading-none",
								children: card.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-7 w-7 place-items-center rounded-lg ${card.bg}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: `h-3.5 w-3.5 ${card.color}` })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 flex items-baseline gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-bold font-display tracking-tight leading-none",
								children: card.count
							})
						})]
					})
				}, card.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "inventory",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border p-1 rounded-xl h-10 w-fit shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "inventory",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Assets Inventory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "reports",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Analytics & Reports"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "inventory",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 lg:col-span-3",
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
													placeholder: "Search by ID, name, brand, employee...",
													className: "h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 overflow-x-auto py-1 scrollbar-none",
												children: [
													{
														id: "all",
														label: "All Assets"
													},
													{
														id: "available",
														label: "Available"
													},
													{
														id: "assigned",
														label: "Assigned"
													},
													{
														id: "under-repair",
														label: "In Repair"
													},
													{
														id: "lost",
														label: "Lost"
													},
													{
														id: "retired",
														label: "Decommissioned"
													}
												].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setStatusFilter(tab.id);
														setCurrentPage(1);
													},
													className: `shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === tab.id ? "bg-foreground text-background border-foreground" : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"}`,
													children: tab.label
												}, tab.id))
											})]
										}),
										paginatedAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center justify-center py-16 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground",
													children: "No assets found"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 max-w-sm text-sm text-muted-foreground",
													children: "No records match the current filters. Adjust your search or register a new asset."
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "overflow-x-auto",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
												className: "min-w-[1000px] border-collapse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
													className: "bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
														className: "hover:bg-transparent",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3 w-[80px] text-center",
																children: "QR Code"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Asset ID / Tag"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Asset Name"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Category"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Brand & Model"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Serial Number"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Assigned To"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Department"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Warranty Expiry"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3 text-center",
																children: "Status"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-4 py-3 text-right" })
														]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedAssets.map((asset) => {
													const statusInfo = STATUSES.find((s) => s.value === asset.status) || STATUSES[0];
													const isWSoon = asset.warrantyUntil && new Date(asset.warrantyUntil).getTime() <= (/* @__PURE__ */ new Date("2026-06-28")).getTime() + 720 * 60 * 60 * 1e3;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
														className: "group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer",
														onClick: () => setDetailAsset(asset),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-2 text-center",
																onClick: (e) => {
																	e.stopPropagation();
																	setTargetAsset(asset);
																	setQrOpen(true);
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "grid place-items-center h-8 w-8 rounded border border-border bg-white cursor-pointer hover:scale-105 transition-transform",
																	title: "Click to view full sticker",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-slate-800" })
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 font-semibold font-mono text-xs text-foreground/90",
																children: asset.tag
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "font-semibold text-foreground truncate max-w-[150px]",
																	children: asset.name
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-xs text-muted-foreground capitalize",
																	children: asset.category
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
																className: "px-4 py-3 text-xs text-foreground/80",
																children: [
																	asset.brand,
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "text-muted-foreground",
																		children: [
																			"(",
																			asset.model || "—",
																			")"
																		]
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 font-mono text-xs text-muted-foreground",
																children: asset.serial
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs font-semibold text-foreground/90",
																children: asset.assignedTo || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground/40 font-normal italic",
																	children: "Unassigned"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs text-muted-foreground",
																children: asset.assignedTo ? authWs.employees.find((x) => x.fullName === asset.assignedTo)?.department || "Operations" : "—"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: isWSoon ? "text-purple-500 font-semibold" : "text-muted-foreground",
																	children: asset.warrantyUntil || "—"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-center",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	className: `${statusInfo.bg} ${statusInfo.color} border-none shadow-none text-xs font-semibold capitalize`,
																	children: statusInfo.label
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-right",
																onClick: (e) => e.stopPropagation(),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex justify-end gap-1 opacity-80 group-hover:opacity-100",
																	children: [
																		asset.status === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleAssignOpen(asset),
																			className: "h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/65",
																			children: "Assign"
																		}),
																		asset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleReturnAsset(asset),
																			className: "h-7 text-[10px] px-2 text-emerald-600 border-border cursor-pointer hover:bg-emerald-500/10",
																			children: "Return"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleTransferOpen(asset),
																			className: "h-7 text-[10px] px-2 text-indigo-500 border-border cursor-pointer hover:bg-indigo-500/10",
																			children: "Transfer"
																		})] }),
																		asset.status !== "under-repair" && asset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleRepairOpen(asset),
																			className: "h-7 text-[10px] px-2 text-amber-600 border-border cursor-pointer hover:bg-amber-500/10",
																			children: "Repair"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			onClick: () => handleEditOpen(asset),
																			className: "h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" })
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			onClick: () => {
																				setTargetAsset(asset);
																				setDeleteOpen(true);
																			},
																			className: "h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																		})
																	]
																})
															})
														]
													}, asset.id);
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
												className: "flex gap-1",
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 lg:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4 text-indigo-500" }), "Mobile QR Scanner"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs text-muted-foreground",
											children: "Simulate scanning asset labels"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground leading-relaxed",
											children: "Type or select an asset ID/Tag, then simulate scanning using a mobile device layout."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: scannedAssetTag,
												onValueChange: setScannedAssetTag,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 text-xs bg-background/50 border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Asset" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: a.tag,
													children: [
														a.tag,
														" (",
														a.brand,
														")"
													]
												}, a.id)) })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												onClick: handleScanSimulation,
												disabled: !scannedAssetTag,
												className: "h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer",
												children: "Scan"
											})]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-500 animate-pulse" }), "Alerts & Notifications"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs text-muted-foreground",
											children: "Asset events needing attention"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "space-y-3",
										children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground text-center py-4 italic",
											children: "All assets compliant with warranty and returns!"
										}) : notifications.slice(0, 4).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${alert.type === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" : alert.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold leading-relaxed",
													children: alert.message
												}), alert.asset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setDetailAsset(alert.asset),
													className: "mt-1 text-[10px] underline font-bold uppercase cursor-pointer",
													children: "View Asset Details"
												})]
											})]
										}, alert.id))
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "reports",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Category Allocation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Count of assets by category classification"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "h-[250px] flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
													data: categoryChartData,
													cx: "50%",
													cy: "50%",
													innerRadius: 60,
													outerRadius: 80,
													paddingAngle: 4,
													dataKey: "value",
													children: categoryChartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
											] })
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Maintenance Repair Costs ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Accumulated service and parts expenditure by category"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "h-[250px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: repairCostChartData,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "3 3",
														opacity: .1
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "category",
														style: { fontSize: 9 }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { style: { fontSize: 9 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "Total Repair Cost ($)",
														fill: "#6366f1",
														radius: [
															4,
															4,
															0,
															0
														]
													})
												]
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl lg:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Asset Financial Summary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Capital expenditures and maintenance records per asset item"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
											className: "text-xs border-collapse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
												className: "bg-muted/10 border-b border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Asset"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Category"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Owner"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Purchase Date"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Purchase Cost"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Repair Cost"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Total Lifetime Cost"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: assets.map((a) => {
												const repCost = (a.maintenanceHistory || []).reduce((sum, r) => sum + r.cost, 0);
												const lifeCost = (a.purchaseCost || 0) + repCost;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border hover:bg-accent/15",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 font-medium",
															children: [
																a.tag,
																" • ",
																a.name
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2 capitalize text-muted-foreground",
															children: a.category
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2",
															children: a.assignedTo || "Available"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2 text-muted-foreground",
															children: a.purchaseDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right",
															children: ["$", a.purchaseCost || 0]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right text-amber-500",
															children: ["$", repCost]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right font-semibold",
															children: ["$", lifeCost]
														})
													]
												}, a.id);
											}) })]
										})
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-lg",
						children: "Register New Asset"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSubmit,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: assetName,
										onChange: (e) => setAssetName(e.target.value),
										placeholder: "e.g. MacBook Pro M3",
										className: "bg-background/50 border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assetCategory,
										onValueChange: (val) => setAssetCategory(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.value,
											children: c.label
										}, c.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Serial Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: serial,
										onChange: (e) => setSerial(e.target.value),
										placeholder: "C02XJ192",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: brand,
										onChange: (e) => setBrand(e.target.value),
										placeholder: "e.g. Apple",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Model Specification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: model,
										onChange: (e) => setModel(e.target.value),
										placeholder: "e.g. Pro 14 M3 16GB",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Vendor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: vendor,
										onChange: (e) => setVendor(e.target.value),
										placeholder: "e.g. Apple Authorized Reseller",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Cost ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: purchaseCost,
										onChange: (e) => setPurchaseCost(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: purchaseDate,
										onChange: (e) => setPurchaseDate(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Warranty Expiry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: warrantyUntil,
										onChange: (e) => setWarrantyUntil(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Current Location / Room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: location,
										onChange: (e) => setLocation(e.target.value),
										placeholder: "e.g. Bangalore Floor 3 Store Room",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Description Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										placeholder: "Condition, initial checks, setup requirements...",
										className: "min-h-[60px] bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Image Upload"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center border border-dashed border-border bg-background/30 rounded-xl p-4 text-center text-[10px] text-muted-foreground",
										children: "Click or Drag mockup photograph to upload (Optional)"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setAddOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer",
								children: "Generate ID & Save"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-lg",
						children: "Edit Asset Specifications"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEditSubmit,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: assetName,
										onChange: (e) => setAssetName(e.target.value),
										className: "bg-background/50 border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assetCategory,
										onValueChange: (val) => setAssetCategory(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.value,
											children: c.label
										}, c.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Serial Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: serial,
										onChange: (e) => setSerial(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: brand,
										onChange: (e) => setBrand(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Model Specification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: model,
										onChange: (e) => setModel(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Vendor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: vendor,
										onChange: (e) => setVendor(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Cost ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: purchaseCost,
										onChange: (e) => setPurchaseCost(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: purchaseDate,
										onChange: (e) => setPurchaseDate(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Warranty Expiry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: warrantyUntil,
										onChange: (e) => setWarrantyUntil(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Current Location / Room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: location,
										onChange: (e) => setLocation(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Description Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										className: "min-h-[60px] bg-background/50 border-border text-xs"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer",
								children: "Save Changes"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: assignOpen,
				onOpenChange: setAssignOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Assign Asset: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAssignSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Employee Assignee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assignEmpId,
									onValueChange: setAssignEmpId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: authWs.employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: emp.fullName,
										children: [
											emp.fullName,
											" (",
											emp.employeeId,
											")"
										]
									}, emp.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Expected Return Date (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: assignReturnDate,
									onChange: (e) => setAssignReturnDate(e.target.value),
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Assignment Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: assignNotes,
									onChange: (e) => setAssignNotes(e.target.value),
									placeholder: "State check-in parameters, initial hardware checklist checks...",
									className: "min-h-[70px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setAssignOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer",
									children: "Assign Asset"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: transferOpen,
				onOpenChange: setTransferOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Transfer Asset: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleTransferSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3 text-xs text-indigo-600 dark:text-indigo-400",
								children: ["Transferring asset currently assigned to: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: targetAsset?.assignedTo })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "New Employee Assignee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: transferEmpId,
									onValueChange: setTransferEmpId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: authWs.employees.filter((emp) => emp.fullName !== targetAsset?.assignedTo).map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: emp.fullName,
										children: emp.fullName
									}, emp.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Transfer Reason / Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: transferNotes,
									onChange: (e) => setTransferNotes(e.target.value),
									placeholder: "State justification or ticket reference...",
									className: "min-h-[70px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setTransferOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer",
									children: "Transfer Asset"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: repairOpen,
				onOpenChange: setRepairOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Log Repair Request: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRepairSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Service Vendor / Shop Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: repairVendor,
									onChange: (e) => setRepairVendor(e.target.value),
									placeholder: "e.g. Dell Authorized Service Center",
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Estimated Repair Cost ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: repairCost,
									onChange: (e) => setRepairCost(e.target.value),
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Fault Description / Service Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: repairNotes,
									onChange: (e) => setRepairNotes(e.target.value),
									placeholder: "e.g. Sticky keyboard keys, battery swelling, screen flickering...",
									className: "min-h-[80px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRepairOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer",
									children: "Log to Maintenance"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deleteOpen,
				onOpenChange: setDeleteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold text-rose-500",
							children: "Delete Asset Record"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"Are you sure you want to permanently erase the record for asset ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "font-semibold text-foreground",
									children: [
										targetAsset?.tag,
										" (",
										targetAsset?.name,
										")"
									]
								}),
								"? This will clear all historical timelines."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDeleteOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleDeleteSubmit,
								className: "h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer",
								children: "Delete Record"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: qrOpen,
				onOpenChange: setQrOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xs bg-background border-border text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-center",
						children: "Asset QR Sticker Label"
					}) }), targetAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-3 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-300 bg-white p-4 shadow-md w-[220px] flex flex-col items-center select-none text-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold tracking-widest text-slate-500 uppercase",
									children: "ofc360 HRMS ASSET"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 w-full text-center",
									children: targetAsset.tag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-3 p-1.5 border border-slate-100 bg-white rounded shadow-inner flex flex-col items-center justify-center",
									children: [targetAsset.qrCodeData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: targetAsset.qrCodeData,
										width: 130,
										height: 130,
										className: "w-[130px] h-[130px]",
										alt: "Asset QR Code"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-[130px] h-[130px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-400",
										children: "Generating QR..."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] text-slate-500 mt-1.5",
										children: targetAsset.serial ?? targetAsset.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-semibold text-slate-700 truncate max-w-full",
									children: targetAsset.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[8px] text-slate-400 italic",
									children: "Company: ofc360 Talent Labs"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 w-full pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									toast.success("Regenerated QR Code successfully.");
									({ ...targetAsset }), [...targetAsset.timeline || [], (newId("tl"), authWs.user?.fullName, (/* @__PURE__ */ new Date()).toISOString())];
									editMutation.mutate({
										id: targetAsset.id,
										payload: { notes: (targetAsset.notes || "") + "\nRegenerated unique QR signature check." }
									});
									setQrOpen(false);
								},
								className: "flex-1 h-9 text-xs border-border bg-transparent cursor-pointer",
								children: "Regenerate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									toast.success(`Sticker sent to printer queue.`);
									setQrOpen(false);
								},
								className: "flex-1 h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), "Print Label"]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: scanOpen,
				onOpenChange: setScanOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold",
							children: "QR / Barcode Scanner"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: "Simulate scanning a physical QR code label on a laptop/device using a mobile phone. Select an asset sticker from the checklist."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Select Sticker to Scan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: scannedAssetTag,
									onValueChange: setScannedAssetTag,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose asset tag" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: a.tag,
										children: [
											a.tag,
											" • ",
											a.name
										]
									}, a.id)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setScanOpen(false),
							className: "h-9 border-border bg-transparent cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleScanSimulation,
							disabled: !scannedAssetTag,
							className: "h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer",
							children: "Confirm Mock Scan"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!detailAsset,
				onOpenChange: (open) => !open && setDetailAsset(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl",
					children: detailAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "p-5 border-b border-border bg-muted/10 shrink-0 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] uppercase font-bold text-muted-foreground border-border",
										children: detailAsset.category
									}), STATUSES.map((stat) => {
										if (stat.value !== detailAsset.status) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${stat.bg} ${stat.color} border-none shadow-none text-xs font-bold capitalize`,
											children: stat.label
										}, stat.value);
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
									className: "font-display text-base font-bold text-foreground mt-2 truncate text-left",
									title: detailAsset.name,
									children: [
										detailAsset.tag,
										" • ",
										detailAsset.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground text-left mt-0.5",
									children: [
										"Serial Number: ",
										detailAsset.serial,
										" • Warranty Expiration: ",
										detailAsset.warrantyUntil || "None"
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
											children: "Asset QR Sticker Identification"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded bg-white p-2 border border-slate-200 flex flex-col items-center justify-center",
												children: [detailAsset.qrCodeData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: detailAsset.qrCodeData,
													width: 110,
													height: 110,
													className: "w-[110px] h-[110px]",
													alt: "Asset QR Code"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-[110px] h-[110px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-400",
													children: "Generating QR..."
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-[10px] text-slate-500 mt-1",
													children: detailAsset.serial ?? detailAsset.id
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-left space-y-2 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-foreground",
														children: "Scannable QR Label"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground leading-relaxed",
														children: "Scan this label with any mobile device to open the asset record page."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => {
																setTargetAsset(detailAsset);
																setQrOpen(true);
															},
															className: "h-8 text-[10px] border-border bg-transparent cursor-pointer",
															children: "Print Sticker"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => {
																toast.success("Regenerating QR parameters...");
																const updated = {
																	...detailAsset,
																	timeline: [...detailAsset.timeline || [], {
																		id: newId("tl"),
																		event: "Created",
																		performedBy: authWs.user?.fullName || "HR",
																		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
																		notes: "QR checksum regenerated."
																	}]
																};
																editMutation.mutate({
																	id: detailAsset.id,
																	payload: { notes: (detailAsset.notes || "") + "\nQR checksum regenerated." }
																});
																setDetailAsset(updated);
															},
															className: "h-8 text-[10px] border-border bg-transparent cursor-pointer",
															children: "Regenerate"
														})]
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Hardware Specifications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Brand / Manufacturer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.brand || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Model Specification"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.model || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Purchase Cost"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
													className: "text-foreground mt-0.5 block",
													children: ["$", detailAsset.purchaseCost || 0]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Current Location Room"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.location || "General HQ"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Vendor Info"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: detailAsset.vendor
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Warranty Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: detailAsset.warrantyUntil ? new Date(detailAsset.warrantyUntil).getTime() < (/* @__PURE__ */ new Date("2026-06-28")).getTime() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-rose-500",
															children: [
																"Warranty Expired (",
																detailAsset.warrantyUntil,
																")"
															]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-emerald-500",
															children: [
																"Warranty Active (Expires: ",
																detailAsset.warrantyUntil,
																")"
															]
														}) : "No Warranty Data"
													})]
												})
											]
										})]
									}),
									detailAsset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), "Current Assignment:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Employee:" }),
													" ",
													detailAsset.assignedTo
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dept:" }),
													" ",
													authWs.employees.find((x) => x.fullName === detailAsset.assignedTo)?.department || "Operations"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "col-span-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Assigned At:" }),
														" ",
														detailAsset.assignedAt ? new Date(detailAsset.assignedAt).toLocaleDateString() : "—"
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Asset Timeline Audit Logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card/40 p-4 space-y-3.5",
											children: (detailAsset.timeline || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground italic",
												children: "No timelines logged for this asset."
											}) : (detailAsset.timeline || []).map((tl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex gap-3 text-xs relative ${idx < (detailAsset.timeline || []).length - 1 ? "before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `grid h-4 w-4 place-items-center rounded-full shrink-0 ${tl.event === "Created" ? "bg-blue-500 text-white" : tl.event === "Assigned" ? "bg-indigo-500 text-white" : tl.event === "Returned" ? "bg-emerald-500 text-white" : tl.event === "Repaired" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-2 w-2" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-foreground capitalize",
														children: tl.event
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: [
															"By ",
															tl.performedBy,
															" on ",
															new Date(tl.timestamp).toLocaleString()
														]
													}),
													tl.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-foreground/80 mt-1",
														children: tl.notes
													})
												] })]
											}, tl.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Assignment History Logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card/40 p-0 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
												className: "text-[11px] border-collapse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
													className: "bg-muted/10 border-b border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 w-[120px]",
															children: "Employee"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Department"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Assign Date"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Return Date"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailAsset.assignmentHistory || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													colSpan: 4,
													className: "text-center py-4 text-muted-foreground italic",
													children: "No allocation logs recorded."
												}) }) : (detailAsset.assignmentHistory || []).map((hist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 font-semibold",
															children: hist.employee
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: hist.department
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: hist.assignDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2",
															children: hist.actualReturnDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-emerald-500",
																children: hist.actualReturnDate
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-amber-500 font-semibold",
																children: "Active"
															})
														})
													]
												}, hist.id)) })]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Maintenance Repair logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card/40 p-0 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
												className: "text-[11px] border-collapse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
													className: "bg-muted/10 border-b border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 w-[100px]",
															children: "Service Date"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Vendor Partner"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 text-right",
															children: "Cost"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Issues / Notes"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailAsset.maintenanceHistory || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													colSpan: 4,
													className: "text-center py-4 text-muted-foreground italic",
													children: "No maintenance history logs found."
												}) }) : (detailAsset.maintenanceHistory || []).map((mr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 font-mono",
															children: mr.serviceDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: mr.vendor
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-3 py-2 text-right text-amber-500 font-semibold",
															children: ["$", mr.cost]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground truncate max-w-[120px]",
															title: mr.notes,
															children: mr.notes || "—"
														})
													]
												}, mr.id)) })]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
											className: "font-bold flex items-center gap-1 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-indigo-500" }), "Decommissioning & Auditing Protocols"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] leading-relaxed text-muted-foreground",
											children: "Asset tag tracks automatic check-ins linked directly with offboarding exit task structures. Supports mobile barcode scanner simulation natively."
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end",
							children: [
								detailAsset.status === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => handleAssignOpen(detailAsset),
									className: "h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer",
									children: "Assign Asset"
								}),
								detailAsset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleReturnAsset(detailAsset),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-emerald-600",
									children: "Return Asset"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleTransferOpen(detailAsset),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-indigo-500",
									children: "Transfer"
								})] }),
								detailAsset.status !== "under-repair" && detailAsset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleRepairOpen(detailAsset),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-amber-600",
									children: "Log Fault"
								}),
								detailAsset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleMarkRetired(detailAsset),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-purple-600",
									children: "Decommission"
								}),
								detailAsset.status !== "lost" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleMarkLost(detailAsset),
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-rose-500",
									children: "Flag Lost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										setTargetAsset(detailAsset);
										setQrOpen(true);
									},
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), "QR Sticker"]
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
export { AssetsPage as component };
