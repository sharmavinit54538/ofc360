import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, Bn as Cloud, Br as Activity, Fn as CreditCard, In as Cpu, Nn as Database, W as Server, kt as Mail } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Card } from "./card-xVPC106M.mjs";
import { t as superAdminApi } from "./superAdminApi-Cvx6D9f6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.system-health-bR0EsJog.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminSystemHealthPage() {
	const [health, setHealth] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const fetchHealth = async () => {
		setIsLoading(true);
		try {
			setHealth(await superAdminApi.getSystemHealth());
		} catch (err) {
			console.error("Failed to fetch system health:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchHealth();
	}, []);
	if (isLoading || !health) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-xs text-muted-foreground animate-pulse",
		children: "Running infrastructure diagnostics..."
	});
	const getServiceIcon = (name) => {
		const n = name.toLowerCase();
		if (n.includes("fastapi")) return Server;
		if (n.includes("postgre")) return Database;
		if (n.includes("ollama")) return Cpu;
		if (n.includes("storage")) return Cloud;
		if (n.includes("smtp")) return Mail;
		if (n.includes("razorpay")) return CreditCard;
		return Activity;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-bold text-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-emerald-400" }), "Infrastructure Real-Time Health & Service Telemetry"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Live ping and operational status across API, Database, AI Engine, CDN, and Mail services."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: fetchHealth,
				variant: "outline",
				size: "sm",
				className: "h-8 text-xs gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Re-run Diagnostics"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
			children: health.services.map((svc) => {
				const Icon = getServiceIcon(svc.name);
				const isOnline = svc.status === "ONLINE";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl p-4 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded-lg bg-muted/40 text-indigo-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-xs text-foreground",
								children: svc.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground",
								children: [
									"Latency: ",
									svc.latency_ms,
									" ms"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: isOnline ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20",
							children: svc.status
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: svc.uptime ? `Uptime: ${svc.uptime}` : svc.model ? `Model: ${svc.model}` : svc.provider ? `Provider: ${svc.provider}` : "Operational" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-emerald-400 font-semibold",
							children: "100% Responsive"
						})]
					})]
				}, svc.name);
			})
		})]
	});
}
//#endregion
export { SuperAdminSystemHealthPage as component };
