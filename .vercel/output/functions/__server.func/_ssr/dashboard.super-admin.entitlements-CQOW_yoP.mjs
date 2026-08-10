import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, X as Save, n as Zap } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { t as Card } from "./card-BcHXPpmN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DclzLlic.mjs";
import { t as superAdminApi } from "./superAdminApi-CNL9hXkR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.entitlements-CQOW_yoP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALL_MODULES = [
	{
		id: "attendance",
		label: "Attendance"
	},
	{
		id: "payroll",
		label: "Payroll"
	},
	{
		id: "recruitment",
		label: "Recruitment"
	},
	{
		id: "performance",
		label: "Performance"
	},
	{
		id: "documents",
		label: "Documents"
	},
	{
		id: "assets",
		label: "Assets"
	},
	{
		id: "ai_suite",
		label: "AI Suite"
	},
	{
		id: "reports",
		label: "Reports"
	},
	{
		id: "communication",
		label: "Communication"
	}
];
function FeatureEntitlementsPage() {
	const [data, setData] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [savingOrgId, setSavingOrgId] = (0, import_react.useState)(null);
	const fetchEntitlements = async () => {
		setIsLoading(true);
		try {
			setData(await superAdminApi.getEntitlements());
		} catch (err) {
			console.error("Failed to load feature entitlements matrix:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchEntitlements();
	}, []);
	const handleToggleModule = (orgId, moduleId, val) => {
		setData((prev) => prev.map((item) => {
			if (item.organization_id === orgId) return {
				...item,
				entitlements: {
					...item.entitlements,
					[moduleId]: val
				}
			};
			return item;
		}));
	};
	const handleSaveEntitlements = async (item) => {
		setSavingOrgId(item.organization_id);
		try {
			await superAdminApi.updateEntitlements({
				organization_id: item.organization_id,
				enabled_modules: item.entitlements
			});
			alert(`Feature entitlements for ${item.organization_name} persisted in backend!`);
		} catch (err) {
			alert("Failed to save entitlements: " + (err.response?.data?.detail || err.message));
		} finally {
			setSavingOrgId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-bold text-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-amber-400" }), "Backend-Enforced Feature Entitlements Matrix"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Dynamically toggle module access per tenant organization. Changes persist in the backend database."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: fetchEntitlements,
				variant: "outline",
				size: "sm",
				className: "h-8 gap-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh Matrix"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-border bg-card/40 backdrop-blur-xl overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
				className: "bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs",
						children: "Organization"
					}),
					ALL_MODULES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-center",
						children: m.label
					}, m.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs text-right",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: ALL_MODULES.length + 2,
				className: "text-center py-8 text-xs text-muted-foreground",
				children: "Loading feature entitlement matrix..."
			}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: ALL_MODULES.length + 2,
				className: "text-center py-8 text-xs text-muted-foreground",
				children: "No organizations found."
			}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "hover:bg-accent/40 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.organization_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[9px] mt-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
							children: item.status
						})]
					}),
					ALL_MODULES.map((m) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: Boolean(item.entitlements?.[m.id] ?? true),
								onCheckedChange: (val) => handleToggleModule(item.organization_id, m.id, val)
							})
						}, m.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: savingOrgId === item.organization_id,
							onClick: () => handleSaveEntitlements(item),
							size: "sm",
							className: "h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3 w-3" }), savingOrgId === item.organization_id ? "Saving..." : "Save"]
						})
					})
				]
			}, item.organization_id)) })] })
		})]
	});
}
//#endregion
export { FeatureEntitlementsPage as component };
