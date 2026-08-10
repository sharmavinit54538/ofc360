import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { q as ScrollText } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { t as superAdminApi } from "./superAdminApi-Cvx6D9f6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.audit-logs-BY_yW1EM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlobalAuditLogsPage() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const fetchLogs = async () => {
		setIsLoading(true);
		try {
			setLogs(await superAdminApi.getGlobalAuditLogs());
		} catch (err) {
			console.error("Failed to fetch global audit logs:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border bg-card/40 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-3 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-sm font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-4 w-4 text-indigo-400" }), "Immutable Super Admin Audit Trail"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
					className: "text-xs text-muted-foreground",
					children: "Complete security audit record tracking every privileged grant, extension, suspension, cancellation, and plan change action across all tenants."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-xs text-muted-foreground",
					children: "Loading global audit log entries..."
				}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-xs text-muted-foreground italic",
					children: "No audit events recorded in database yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
						className: "bg-muted/10 border-b border-border text-[10px] uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "px-4 py-3",
								children: "Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "px-4 py-3",
								children: "Performed By"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "px-4 py-3",
								children: "Organization"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "px-4 py-3",
								children: "Details & Justification"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "px-4 py-3 text-right",
								children: "Timestamp"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "border-t border-border hover:bg-accent/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-indigo-500/30 text-indigo-400 font-bold text-[10px]",
									children: log.action
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "px-4 py-3 font-semibold text-foreground",
								children: log.actor_email || log.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "px-4 py-3 text-muted-foreground",
								children: log.company_name || "Global / System"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "px-4 py-3 text-muted-foreground leading-relaxed",
								children: log.details
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "px-4 py-3 text-right text-muted-foreground font-mono text-[11px]",
								children: (log.timestamp || log.created_at || "").replace("T", " ").substring(0, 19)
							})
						]
					}, log.id)) })]
				})
			})]
		})
	});
}
//#endregion
export { GlobalAuditLogsPage as component };
