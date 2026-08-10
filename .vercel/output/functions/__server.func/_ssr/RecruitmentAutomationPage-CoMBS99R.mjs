import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { T as Trash2, Tr as Bot, at as Plus, n as Zap, rt as Power } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentAutomationPage-CoMBS99R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seed = [];
function RecruitmentAutomationPage() {
	const [rules, setRules] = (0, import_react.useState)(seed);
	const [name, setName] = (0, import_react.useState)("");
	function createRule() {
		if (!name.trim()) return;
		setRules((a) => [{
			id: `r-${Date.now()}`,
			name,
			trigger: "Candidate applies",
			action: "Assign recruiter based on job dept",
			enabled: true,
			runs: 0,
			icon: Zap
		}, ...a]);
		setName("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Workflow Automation",
			description: "Trigger-based rules, SLA alerts, and AI-powered auto-actions."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-4",
			children: [
				{
					k: "Active Rules",
					v: rules.filter((r) => r.enabled).length
				},
				{
					k: "Total Runs (30d)",
					v: rules.reduce((a, r) => a + r.runs, 0).toLocaleString()
				},
				{
					k: "Time Saved",
					v: "0h"
				},
				{
					k: "SLA Breaches",
					v: 0
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: s.k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 font-display text-2xl font-semibold",
					children: s.v
				})]
			}, s.k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "New rule name (e.g. Auto-tag senior candidates)",
						value: name,
						onChange: (e) => setName(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: createRule,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add Rule"]
					})]
				}), rules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "No active automation rules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted-foreground",
							children: "Create a workflow rule to automate notifications, candidate updates, and assessments."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: rules.map((r) => {
						const I = r.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium",
												children: r.name
											}), r.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[9px]",
												children: "Active"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px]",
												children: "Paused"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: [
												"When ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: r.trigger
												}),
												" → ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: r.action
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[10px] text-muted-foreground",
											children: [r.runs, " runs · last 30 days"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: r.enabled,
									onCheckedChange: (v) => setRules((a) => a.map((x) => x.id === r.id ? {
										...x,
										enabled: v
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setRules((a) => a.filter((x) => x.id !== r.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						}, r.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-4 w-4" }), " SLA Targets"]
					}), [
						{
							k: "Response to candidate",
							v: "24h",
							current: 0
						},
						{
							k: "Stage move after screening",
							v: "3d",
							current: 0
						},
						{
							k: "Interview feedback",
							v: "48h",
							current: 0
						},
						{
							k: "Offer decision",
							v: "5d",
							current: 0
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border py-1.5 text-xs last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: s.k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								s.current,
								" / ",
								s.v
							]
						})]
					}, s.k))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-sm font-semibold",
						children: "Recipe Library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5 text-xs",
						children: [
							"Stale candidate nudge",
							"Offer reminder cadence",
							"Interviewer reminder 1h before",
							"Reject after 14d inactive",
							"Auto-tag remote-first candidates"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex w-full items-center gap-2 rounded-md border border-border p-2 text-left hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 text-muted-foreground" }), t]
						}, t))
					})]
				})]
			})]
		})
	] });
}
//#endregion
export { RecruitmentAutomationPage };
