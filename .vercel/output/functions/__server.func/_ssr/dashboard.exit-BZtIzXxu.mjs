import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { At as LogOut, B as ShieldCheck, Zn as CircleCheck, at as Plus, gn as FileText } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as Progress, i as PrintButton, l as StatCard, r as GlassCard, u as StatusBadge } from "./Shared-DsmRoS2G.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-Bfab2GKW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.exit-BZtIzXxu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"resignation",
	"notice",
	"interview",
	"assets",
	"hr",
	"manager",
	"it",
	"finance",
	"settled"
];
function newExit() {
	return {
		id: newId("ex"),
		employee: "",
		role: "",
		resignedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		noticeDays: 60,
		lastWorkingDay: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
		reason: "",
		stage: "resignation",
		checklist: [
			{
				key: "assets",
				label: "Asset return",
				done: false
			},
			{
				key: "kt",
				label: "Knowledge transfer",
				done: false
			},
			{
				key: "manager",
				label: "Manager approval",
				done: false
			},
			{
				key: "hr",
				label: "HR approval",
				done: false
			},
			{
				key: "it",
				label: "IT clearance",
				done: false
			},
			{
				key: "finance",
				label: "Finance clearance",
				done: false
			}
		],
		documents: [
			{
				name: "Experience Letter",
				issued: false
			},
			{
				name: "Relieving Letter",
				issued: false
			},
			{
				name: "Final Settlement",
				issued: false
			}
		]
	};
}
function ExitPage() {
	const exits = useHrms((s) => s.exits);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(newExit());
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: exits.length,
			inProgress: exits.filter((e) => e.stage !== "settled").length,
			settled: exits.filter((e) => e.stage === "settled").length,
			docsIssued: exits.reduce((s, e) => s + e.documents.filter((d) => d.issued).length, 0)
		};
	}, [exits]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Exit Management",
			description: "Resignations, clearances, and final settlements.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(newExit());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New exit case"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total cases",
					value: stats.total,
					icon: LogOut
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In progress",
					value: stats.inProgress,
					icon: ShieldCheck,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Settled",
					value: stats.settled,
					icon: CircleCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Documents issued",
					value: stats.docsIssued,
					icon: FileText,
					accent: "brand"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: exits.map((e) => {
				const done = e.checklist.filter((c) => c.done).length;
				const pct = Math.round(done / e.checklist.length * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: e.employee
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: e.stage,
									tone: e.stage === "settled" ? "success" : "warning"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									e.role,
									" · LWD ",
									new Date(e.lastWorkingDay).toLocaleDateString()
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Reason: ", e.reason || "—"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Clearance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-lg font-semibold",
								children: [pct, "%"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: "Checklist"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: e.checklist.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: c.done,
										onChange: () => hrms.toggleExitChecklist(e.id, c.key)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: c.done ? "line-through text-muted-foreground" : "",
										children: c.label
									}),
									c.doneAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-[10px] text-muted-foreground",
										children: new Date(c.doneAt).toLocaleDateString()
									}) : null
								]
							}, c.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: e.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: d.issued ? "default" : "outline",
								size: "sm",
								onClick: () => hrms.issueExitDoc(e.id, d.name),
								className: "gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }),
									" ",
									d.issued ? `${d.name} ✓` : `Issue ${d.name}`
								]
							}, d.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => hrms.upsertExit({
									...e,
									stage: s
								}),
								className: `rounded-md px-2 py-1 text-[10px] font-medium uppercase ${e.stage === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent"}`,
								children: s
							}, s))
						})]
					})
				] }, e.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New exit case" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.employee,
							onChange: (e) => setDraft({
								...draft,
								employee: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.role,
							onChange: (e) => setDraft({
								...draft,
								role: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Resigned on" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: draft.resignedAt.slice(0, 10),
							onChange: (e) => setDraft({
								...draft,
								resignedAt: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notice days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: draft.noticeDays,
							onChange: (e) => setDraft({
								...draft,
								noticeDays: Number(e.target.value)
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last working day" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.lastWorkingDay.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									lastWorkingDay: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.reason,
								onChange: (e) => setDraft({
									...draft,
									reason: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (!draft.employee) return;
						hrms.upsertExit(draft);
						setOpen(false);
						setDraft(newExit());
					},
					children: "Create"
				})] })
			] })
		})
	] });
}
//#endregion
export { ExitPage as component };
