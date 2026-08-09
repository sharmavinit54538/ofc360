import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Cn as FileText, J as Send, Ot as MessageSquare, Rr as Banknote, br as ChartColumn, u as Users, z as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as AIHero } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.chat-assistant-3C4sweEZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTIONS = [
	{
		icon: Users,
		q: "Show employees at risk of leaving."
	},
	{
		icon: ChartColumn,
		q: "Who has the highest overtime this month?"
	},
	{
		icon: FileText,
		q: "Generate attendance report."
	},
	{
		icon: Banknote,
		q: "What's the projected payroll for next month?"
	}
];
function Page() {
	const [msgs, setMsgs] = (0, import_react.useState)([{
		role: "ai",
		text: "Hi 👋 I'm ofc360 AI. Ask me about employees, payroll, attendance, reports or analytics."
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);
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
				text: "Here's what I found for: \"" + q + "\". I queried the latest workforce data and prepared a summary with relevant insights and metrics for you to review."
			}
		]);
		setInput("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
		icon: MessageSquare,
		eyebrow: "AI Chat Assistant",
		title: "Ask anything about your workforce",
		description: "ChatGPT-style assistant for HR, payroll, employees, reports and analytics — grounded in your data.",
		lastAnalysis: "Live"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-3 flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto p-5",
				children: [msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-foreground text-background" : "bg-accent text-foreground"}`,
						children: m.text
					})
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					ask(input);
				},
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask ofc360 AI… (e.g. show top performers in Sales)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Send"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Suggested"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: SUGGESTIONS.map((s) => {
						const Icon = s.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => ask(s.q),
							className: "flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-xs hover:border-foreground/20 hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.q })]
						}, s.q);
					})
				})]
			})
		})]
	})] });
}
//#endregion
export { Page as component };
