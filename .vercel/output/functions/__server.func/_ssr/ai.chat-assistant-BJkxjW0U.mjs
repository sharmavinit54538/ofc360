import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { k as apiInstance } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { G as Send, I as Sparkles, Nt as LoaderCircle, dr as ChartColumn, gn as FileText, kr as Banknote, u as Users, wt as MessageSquare } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as AIHero } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.chat-assistant-BJkxjW0U.js
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
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [conversationId, setConversationId] = (0, import_react.useState)(null);
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);
	const ask = (0, import_react.useCallback)(async (q) => {
		const trimmed = q.trim();
		if (!trimmed || isSubmitting) return;
		setIsSubmitting(true);
		setInput("");
		setMsgs((prev) => [
			...prev,
			{
				role: "user",
				text: trimmed
			},
			{
				role: "ai",
				text: "AI is thinking…",
				loading: true
			}
		]);
		try {
			const resData = (await apiInstance.post("/ai/chat", {
				query: trimmed,
				...conversationId ? { conversation_id: conversationId } : {}
			})).data;
			if (resData?.success && resData?.data) {
				const data = resData.data;
				const answerText = typeof data === "string" ? data : data.answer || data.message || JSON.stringify(data, null, 2);
				const newConvId = data.conversationId || data.conversation_id;
				if (newConvId) setConversationId(newConvId);
				setMsgs((prev) => [...prev.slice(0, -1), {
					role: "ai",
					text: answerText
				}]);
			} else throw new Error(resData?.message || "Invalid response from AI service");
		} catch (err) {
			const status = err?.response?.status;
			const errorData = err?.response?.data?.detail || err?.response?.data?.error || {};
			let errMessage = "AI service is temporarily unavailable. Please try again.";
			if (status === 422) errMessage = "Please enter a valid question.";
			else if (status === 504) errMessage = "The AI model took too long to respond. Please try a shorter question.";
			else if (status === 503) errMessage = "AI service is temporarily unavailable. Please try again in a moment.";
			else if (typeof errorData === "object" && errorData?.message) errMessage = errorData.message;
			else if (typeof errorData === "string") errMessage = errorData;
			setMsgs((prev) => [...prev.slice(0, -1), {
				role: "ai",
				text: `⚠️ ${errMessage}`,
				error: true
			}]);
		} finally {
			setIsSubmitting(false);
		}
	}, [isSubmitting, conversationId]);
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
						className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-foreground text-background" : m.error ? "bg-destructive/10 text-destructive border border-destructive/20" : m.loading ? "bg-accent text-muted-foreground animate-pulse" : "bg-accent text-foreground"}`,
						children: m.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "AI is thinking…"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-pre-wrap",
							children: m.text
						})
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
					placeholder: "Ask ofc360 AI… (e.g. show top performers in Sales)",
					disabled: isSubmitting
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: isSubmitting || !input.trim(),
					className: "gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90",
					children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Send"]
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
							disabled: isSubmitting,
							className: "flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-xs hover:border-foreground/20 hover:bg-accent/60 disabled:opacity-50 disabled:cursor-not-allowed",
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
