import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { gn as FileText, tn as HardDrive } from "../_libs/lucide-react.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-xVPC106M.mjs";
import { t as superAdminApi } from "./superAdminApi-Cvx6D9f6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.analytics-BlCuTzYF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminAnalyticsPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		superAdminApi.getAnalytics().then(setData).catch(console.error).finally(() => setIsLoading(false));
	}, []);
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-xs text-muted-foreground animate-pulse",
		children: "Loading platform analytics..."
	});
	const { module_usage, storage } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-foreground",
					children: "Platform Engagement & Module Usage Analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Across-tenant operational feature usage rates and platform resource allocations."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cloud Storage Usage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4 text-cyan-400" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold font-display text-cyan-400",
						children: [storage.total_used_gb, " GB"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: [
							"Out of ",
							storage.total_allocated_gb,
							" GB allocated across tenants"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Documents Vault Storage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-indigo-400" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold font-display text-indigo-400",
						children: [storage.documents_count.toLocaleString(), " Docs"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: "Verified HR & Employee uploads"
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-foreground",
					children: "Module Adoption & Active Usage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: module_usage.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.module }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									m.active_users,
									" active users (",
									m.percentage,
									"%)"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full rounded-full bg-muted/40 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500",
								style: { width: `${m.percentage}%` }
							})
						})]
					}, m.module))
				})]
			})
		]
	});
}
//#endregion
export { SuperAdminAnalyticsPage as component };
