import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $n as CircleCheck, Kt as Laptop, m as UserPlus, ot as Plus, v as UserCheck, vn as FileText } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-DqihOdMw.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OnboardingPage-zv6ipoLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATE = [
	{
		label: "Offer letter signed",
		group: "Docs"
	},
	{
		label: "NDA signed",
		group: "Docs"
	},
	{
		label: "Tax forms (W-4 / equivalent)",
		group: "Docs"
	},
	{
		label: "ID & address verification",
		group: "Docs"
	},
	{
		label: "Laptop provisioned",
		group: "Equipment"
	},
	{
		label: "Monitor / accessories shipped",
		group: "Equipment"
	},
	{
		label: "Email & SSO account",
		group: "IT"
	},
	{
		label: "Slack / Teams workspace",
		group: "IT"
	},
	{
		label: "Access to repos / tools",
		group: "IT"
	},
	{
		label: "Welcome kit shipped",
		group: "Welcome"
	},
	{
		label: "Buddy assigned",
		group: "Welcome"
	},
	{
		label: "Day-1 calendar set up",
		group: "Welcome"
	}
];
var GROUP_ICON = {
	Docs: FileText,
	IT: Laptop,
	Equipment: Laptop,
	Welcome: UserCheck
};
function OnboardingPage() {
	const candidates = useRecruitment((s) => s.candidates);
	const hired = (0, import_react.useMemo)(() => candidates.filter((c) => c.stage === "hired" || c.stage === "offer"), [candidates]);
	const [tasks, setTasks] = (0, import_react.useState)(() => Object.fromEntries(hired.map((c) => [c.id, TEMPLATE.map((t, i) => ({
		id: `${c.id}-${i}`,
		done: i % 3 !== 0,
		...t
	}))])));
	const [activeId, setActiveId] = (0, import_react.useState)(hired[0]?.id ?? "");
	const active = hired.find((c) => c.id === activeId);
	const list = active ? tasks[active.id] ?? [] : [];
	function toggle(id) {
		if (!active) return;
		setTasks((m) => ({
			...m,
			[active.id]: list.map((t) => t.id === id ? {
				...t,
				done: !t.done
			} : t)
		}));
	}
	const pct = (arr) => arr.length ? Math.round(arr.filter((t) => t.done).length / arr.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employee Onboarding",
			description: "Bridge from offer accepted to day-one productivity.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Onboarding"] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-4",
			children: [
				{
					k: "In Onboarding",
					v: hired.length,
					icon: UserPlus
				},
				{
					k: "Completed (30d)",
					v: 12,
					icon: CircleCheck
				},
				{
					k: "Avg Time to Productive",
					v: "14d",
					icon: UserCheck
				},
				{
					k: "Pending Tasks",
					v: Object.values(tasks).flat().filter((t) => !t.done).length,
					icon: FileText
				}
			].map((s) => {
				const I = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold",
						children: s.v
					})]
				}, s.k);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-1.5 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl",
				children: [hired.map((c) => {
					const p = pct(tasks[c.id] ?? []);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveId(c.id),
						className: `w-full rounded-lg p-2 text-left transition-colors ${activeId === c.id ? "bg-accent" : "hover:bg-accent/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
									name: c.name,
									size: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[10px] text-muted-foreground",
										children: c.appliedPosition
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold",
									children: [p, "%"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: p,
							className: "mt-1.5 h-1"
						})]
					}, c.id);
				}), hired.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-center text-xs text-muted-foreground",
					children: "No hires yet."
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
								name: active.name,
								size: 48
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg font-semibold",
									children: active.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [active.appliedPosition, " · joining soon"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Buddy: Sara Iqbal"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: pct(list),
							className: "h-2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [pct(list), "% complete"]
						})]
					}),
					[
						"Docs",
						"Equipment",
						"IT",
						"Welcome"
					].map((g) => {
						const I = GROUP_ICON[g];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-3.5 w-3.5" }),
									" ",
									g
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: list.filter((t) => t.group === g).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: t.done,
										onChange: () => toggle(t.id)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: t.done ? "line-through opacity-60" : "",
										children: t.label
									})]
								}, t.id))
							})]
						}, g);
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Select a new hire to manage onboarding."
				})
			})]
		})
	] });
}
//#endregion
export { OnboardingPage };
