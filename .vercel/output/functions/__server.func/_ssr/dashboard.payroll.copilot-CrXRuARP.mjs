import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { an as useGetHistoryQuery, en as useClearHistoryMutation, sn as useSendChatMessageMutation } from "./ofc360-store-XkEEWRxo.mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as ThumbsUp, G as Send, I as Sparkles, Ln as Copy, O as ThumbsDown, T as Trash2, Tr as Bot, Z as RotateCcw, f as User, or as Check } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.payroll.copilot-CrXRuARP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTIONS = [
	"Show me this month's payroll summary and cost breakdown",
	"Calculate net salary from gross 80,000 with standard deductions",
	"Explain TDS tax slabs for FY 2025-26 under the new tax regime",
	"Draft a payslip breakdown email for an employee",
	"What is the total OT and bonus payout this cycle?"
];
function PayrollCopilotPage() {
	const [input, setInput] = (0, import_react.useState)("");
	const [localMessages, setLocalMessages] = (0, import_react.useState)([]);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [isSendingLocal, setIsSendingLocal] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const { data: historyMessages = [], isLoading: isHistoryLoading } = useGetHistoryQuery();
	const [sendChatMessage, { isLoading: isSendingRtk }] = useSendChatMessageMutation();
	const [clearHistoryMutation, { isLoading: isClearing }] = useClearHistoryMutation();
	const isSending = isSendingRtk || isSendingLocal;
	(0, import_react.useEffect)(() => {
		if (historyMessages.length > 0) setLocalMessages(historyMessages);
	}, [historyMessages]);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [localMessages, isSending]);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	async function submit(text) {
		const prompt = (text ?? input).trim();
		if (!prompt || isSending) return;
		const userMsg = {
			id: `user-${Date.now()}`,
			role: "user",
			content: prompt,
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setLocalMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsSendingLocal(true);
		try {
			const res = await sendChatMessage({ prompt }).unwrap();
			if (res && res.content) {
				setLocalMessages((prev) => [...prev, res]);
				return;
			}
			const directRes = await api.post("payroll/copilot/chat", { prompt });
			if (directRes.success && directRes.data) {
				setLocalMessages((prev) => [...prev, directRes.data]);
				return;
			}
		} catch (err) {
			console.error("Payroll Copilot RTK Query Error, trying direct API:", err);
			try {
				const directRes = await api.post("payroll/copilot/chat", { prompt });
				if (directRes.success && directRes.data) {
					setLocalMessages((prev) => [...prev, directRes.data]);
					return;
				}
			} catch (innerErr) {
				console.error("Direct API Fallback Error:", innerErr);
				toast.error("Failed to connect to backend AI model.");
			}
		} finally {
			setIsSendingLocal(false);
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}
	async function handleClearHistory() {
		try {
			await clearHistoryMutation().unwrap();
			setLocalMessages([]);
			toast.success("Copilot conversation memory cleared.");
		} catch (err) {
			try {
				await api.post("payroll/copilot/clear");
				setLocalMessages([]);
				toast.success("Conversation cleared.");
			} catch {
				setLocalMessages([]);
			}
		}
	}
	function handleCopy(id, text) {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopiedId(null), 2e3);
	}
	function handleFeedback(id, type) {
		setLocalMessages((prev) => prev.map((m) => m.id === id ? {
			...m,
			feedback: m.feedback === type ? void 0 : type
		} : m));
		toast.success(type === "like" ? "Response marked as helpful" : "Feedback recorded");
	}
	function handleRegenerate() {
		const lastUserMsg = [...localMessages].reverse().find((m) => m.role === "user");
		if (lastUserMsg) submit(lastUserMsg.content);
		else toast.info("No previous user message to regenerate.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "AI Payroll Copilot",
			description: "Enterprise AI assistant for salary calculations, tax compliance, and payroll intelligence.",
			actions: localMessages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: handleClearHistory,
				disabled: isClearing,
				className: "text-xs h-9 border-border text-muted-foreground hover:text-destructive cursor-pointer gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Clear"]
			}) : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[calc(100vh-220px)] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollRef,
				className: "flex-1 space-y-4 overflow-y-auto p-4 sm:p-6",
				children: [localMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center text-center p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl text-brand-foreground shadow-glow animate-pulse",
							style: { background: "var(--gradient-brand)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold tracking-tight text-foreground",
							children: "How can I assist with your payroll today?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed",
							children: "Ask me to compute net pay, evaluate tax slabs, review overtime, or draft payslips."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2 text-left",
							children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => submit(s),
								className: "group flex items-start gap-2.5 rounded-xl border border-border bg-background/50 p-3 text-xs text-muted-foreground transition-all hover:border-indigo-500/40 hover:bg-accent/40 hover:text-foreground cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-snug",
									children: s
								})]
							}, s))
						})
					]
				}) : localMessages.map((m) => {
					const isUser = m.role === "user";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex gap-3 ${isUser ? "flex-row-reverse" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${isUser ? "bg-foreground text-background" : "text-brand-foreground shadow-sm"}`,
							style: isUser ? void 0 : { background: "var(--gradient-brand)" },
							children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-foreground text-background" : "bg-accent/70 border border-border/60 text-foreground"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-pre-wrap",
									children: m.content
								}),
								m.metadata?.tableData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 overflow-x-auto rounded-xl border border-border/60 bg-background/50 p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
											className: "border-b border-border/40 text-muted-foreground font-semibold",
											children: m.metadata.tableData.headers.map((h, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2 pt-1 px-2.5",
												children: h
											}, idx))
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/20",
											children: m.metadata.tableData.rows.map((row, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
												className: "hover:bg-accent/30",
												children: row.map((cell, cIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 px-2.5 font-mono text-[11px]",
													children: cell
												}, cIdx))
											}, rIdx))
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex items-center justify-between gap-4 border-t border-border/40 pt-2 text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.timestamp || "Just now" }), !isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleFeedback(m.id, "like"),
												className: `p-1 rounded hover:text-foreground cursor-pointer transition-colors ${m.feedback === "like" ? "text-emerald-500" : ""}`,
												title: "Helpful",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleFeedback(m.id, "dislike"),
												className: `p-1 rounded hover:text-foreground cursor-pointer transition-colors ${m.feedback === "dislike" ? "text-rose-500" : ""}`,
												title: "Not helpful",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleCopy(m.id, m.content),
												className: "inline-flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors pl-1",
												children: copiedId === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-500 font-medium",
													children: "Copied"
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy" })] })
											})
										]
									})]
								})
							]
						})]
					}, m.id);
				}), isSending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-sm text-muted-foreground animate-pulse pl-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-full text-brand-foreground",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generating AI response..." })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border bg-background/40 p-3.5 backdrop-blur-xl space-y-2",
				children: [localMessages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-1 text-[11px] text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleRegenerate,
						disabled: isSending,
						className: "flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Regenerate Response"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						submit();
					},
					className: "flex items-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						ref: inputRef,
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								submit();
							}
						},
						placeholder: "Ask the AI Payroll Copilot anything...",
						rows: 1,
						className: "min-h-[44px] max-h-36 flex-1 resize-none rounded-xl border-border bg-card/60 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-indigo-500"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: isSending || !input.trim(),
						className: "h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md cursor-pointer gap-1.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send" })]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { PayrollCopilotPage as component };
