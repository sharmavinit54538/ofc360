import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as LogOut, Cr as Briefcase, I as Sparkles, Mr as Award, S as TrendingUp, V as ShieldAlert, _ as UserCog, bn as FilePenLine, c as Wallet, rn as GraduationCap, st as Plane, v as UserCheck, yr as CalendarCheck } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DLB8_CFF.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { c as Skeleton, d as useDelayedReady, i as PrintButton, r as GlassCard, s as SearchBox, u as StatusBadge } from "./Shared-DsmRoS2G.mjs";
import { r as useHrms } from "./store-Bfab2GKW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.timeline-_u4ehOmJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_META = {
	joining: {
		icon: UserCheck,
		tone: "success",
		label: "Joining"
	},
	promotion: {
		icon: TrendingUp,
		tone: "success",
		label: "Promotion"
	},
	"department-change": {
		icon: UserCog,
		tone: "info",
		label: "Department"
	},
	"salary-revision": {
		icon: Wallet,
		tone: "info",
		label: "Salary"
	},
	attendance: {
		icon: CalendarCheck,
		tone: "muted",
		label: "Attendance"
	},
	leave: {
		icon: Plane,
		tone: "warning",
		label: "Leave"
	},
	performance: {
		icon: Sparkles,
		tone: "info",
		label: "Performance"
	},
	training: {
		icon: GraduationCap,
		tone: "info",
		label: "Training"
	},
	certification: {
		icon: FilePenLine,
		tone: "success",
		label: "Certification"
	},
	award: {
		icon: Award,
		tone: "success",
		label: "Award"
	},
	warning: {
		icon: ShieldAlert,
		tone: "danger",
		label: "Warning"
	},
	project: {
		icon: Briefcase,
		tone: "info",
		label: "Project"
	},
	exit: {
		icon: LogOut,
		tone: "danger",
		label: "Exit"
	}
};
var ALL_KINDS = Object.keys(KIND_META);
function TimelinePage() {
	const events = useHrms((s) => s.timeline);
	const ready = useDelayedReady(150);
	const [query, setQuery] = (0, import_react.useState)("");
	const [employee, setEmployee] = (0, import_react.useState)("all");
	const [active, setActive] = (0, import_react.useState)(ALL_KINDS);
	const employees = (0, import_react.useMemo)(() => Array.from(new Set(events.map((e) => e.employeeName))), [events]);
	const filtered = (0, import_react.useMemo)(() => {
		return events.filter((e) => employee === "all" ? true : e.employeeName === employee).filter((e) => active.includes(e.kind)).filter((e) => query.trim() === "" ? true : `${e.title} ${e.description ?? ""} ${e.employeeName}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => +new Date(b.date) - +new Date(a.date));
	}, [
		events,
		employee,
		active,
		query
	]);
	function toggle(k) {
		setActive((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employee Timeline",
			description: "Complete activity history across the employee lifecycle.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
					value: query,
					onChange: setQuery,
					placeholder: "Search events…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: employee,
					onChange: (e) => setEmployee(e.target.value),
					className: "h-9 rounded-md border border-border bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All employees"
					}), employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e }, e))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setActive(ALL_KINDS),
					className: "justify-self-start sm:justify-self-end",
					children: "Reset filters"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-2",
			children: ALL_KINDS.map((k) => {
				const { icon: Icon, label, tone } = KIND_META[k];
				const on = active.includes(k);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => toggle(k),
					className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${on ? "border-foreground/20 bg-accent text-foreground" : "border-border bg-card/40 text-muted-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
						label,
						on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: "on",
							tone
						}) : null
					]
				}, k);
			})
		}),
		!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }, i))
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "No events match your filters."
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { events: filtered })
	] });
}
function Timeline({ events }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative ml-3 border-l border-border",
		children: events.map((e) => {
			const meta = KIND_META[e.kind];
			const Icon = meta.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "mb-6 ml-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -left-3 grid h-6 w-6 place-items-center rounded-full ring-4 ring-background",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3 text-brand-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: e.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: meta.label,
								tone: meta.tone
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								e.employeeName,
								" · ",
								new Date(e.date).toLocaleDateString("en-US", { dateStyle: "medium" })
							]
						}),
						e.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: e.description
						}) : null
					] })
				}) })]
			}, e.id);
		})
	});
}
//#endregion
export { TimelinePage as component };
