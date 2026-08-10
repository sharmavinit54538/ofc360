import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as Mail, Nr as AtSign, Tt as MessageSquare, _n as FileText, kr as Bell, sr as CheckCheck, v as UserCheck } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentNotificationsPage-DDLAKzHr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICON = {
	mention: AtSign,
	interview: UserCheck,
	offer: FileText,
	candidate: Bell,
	sla: MessageSquare,
	email: Mail
};
var seed = [];
function RecruitmentNotificationsPage() {
	const [items, setItems] = (0, import_react.useState)(seed);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const list = items.filter((n) => filter === "all" || n.kind === filter);
	const unread = items.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Notification Center",
			description: "Mentions, SLA alerts, candidate activity, hiring manager updates.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => setItems((a) => a.map((x) => ({
					...x,
					read: true
				}))),
				disabled: items.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-2 h-4 w-4" }), "Mark all read"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				children: [unread, " unread"]
			}), [
				"all",
				"mention",
				"interview",
				"offer",
				"candidate",
				"sla",
				"email"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: filter === k ? "default" : "outline",
				className: "h-7 text-[11px] capitalize",
				onClick: () => setFilter(k),
				children: k
			}, k))]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "You're all caught up! Mentions and alert notifications will appear here."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: list.map((n) => {
				const I = ICON[n.kind];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => setItems((a) => a.map((x) => x.id === n.id ? {
						...x,
						read: true
					} : x)),
					className: `flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors ${n.read ? "bg-card/40" : "bg-accent/30"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: n.title
								}), !n.read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-violet-500" }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: n.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[10px] text-muted-foreground",
								children: n.at
							})
						]
					})]
				}, n.id);
			})
		})
	] });
}
//#endregion
export { RecruitmentNotificationsPage };
