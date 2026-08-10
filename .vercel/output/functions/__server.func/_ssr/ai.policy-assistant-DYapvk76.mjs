import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Ar as Banknote, Cr as Briefcase, K as Send, L as Sparkles, Or as BookOpen, _n as FileText, _r as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as AIHero } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.policy-assistant-DYapvk76.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTIONS = [
	{
		icon: CalendarDays,
		q: "How many casual leaves are allowed per year?"
	},
	{
		icon: Briefcase,
		q: "What's the notice period for senior roles?"
	},
	{
		icon: Banknote,
		q: "When is payroll processed each month?"
	},
	{
		icon: FileText,
		q: "What documents are needed for reimbursement?"
	}
];
function Page() {
	const [msgs, setMsgs] = (0, import_react.useState)([{
		role: "ai",
		text: "Hi! I'm your Policy Assistant. Ask me anything about HR, leave, attendance or payroll policies."
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	function ask(q) {
		if (!q.trim()) return;
		setMsgs((m) => [
			...m,
			{
				role: "user",
				text: q
			},
			{
				role: "ai",
				text: "Based on your company policy: " + q + " — Employees are entitled per the policy handbook (section 4.2). I can fetch the exact clause if you'd like."
			}
		]);
		setInput("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
		icon: BookOpen,
		eyebrow: "AI Policy Assistant",
		title: "Your company knowledge base, on tap",
		description: "Ask questions about HR, leave, attendance, payroll and policy — get instant, sourced answers.",
		lastAnalysis: "Live"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-2 flex h-[520px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 space-y-3 overflow-y-auto p-5",
				children: msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent text-foreground"}`,
						children: m.text
					})
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					ask(input);
				},
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask about leave, payroll, HR policy…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Send"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Try asking"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: SUGGESTIONS.map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => ask(s.q),
						className: "flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-sm hover:border-foreground/20 hover:bg-accent/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.q })]
					}, s.q);
				})
			})]
		})]
	})] });
}
//#endregion
export { Page as component };
