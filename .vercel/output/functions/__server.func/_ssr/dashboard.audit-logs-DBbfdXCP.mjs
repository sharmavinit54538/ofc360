import { ln as useofc360 } from "./ofc360-store-CDoLj5BI.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { V as ShieldAlert, q as ScrollText } from "../_libs/lucide-react.mjs";
import { r as PageHeader, t as ComingSoon } from "./DashboardShell--OmXvVdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.audit-logs-DBbfdXCP.js
var import_jsx_runtime = require_jsx_runtime();
function AuditLogsPage() {
	if ((useofc360().user?.role)?.toLowerCase() === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-foreground",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "You do not have permission to view audit logs. Please contact your organization administrator."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Audit Logs",
		description: "Every change, by every user — fully traceable."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComingSoon, {
		title: "Audit trail",
		description: "Searchable, filterable logs of all admin and user actions across the workspace.",
		icon: ScrollText
	})] });
}
//#endregion
export { AuditLogsPage as component };
