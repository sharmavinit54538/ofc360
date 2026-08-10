import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { k as apiInstance } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as RefreshCw, B as ShieldCheck, Cr as Brain, Dr as BookOpen, Fr as ArrowRight, Ft as ListTodo, Hn as Clock, I as Sparkles, K as Search, N as Star, Sr as Briefcase, V as ShieldAlert, Xt as Info, Z as RotateCcw, Zn as CircleCheck, bn as FilePenLine, cn as Gauge, en as HeartPulse, gn as FileText, jr as Award, k as Target, kr as Banknote, l as Video, n as Zap, ot as Play, pr as Calendar, u as Users, ur as ChartLine, wt as MessageSquare, x as TriangleAlert, yn as FilePlusCorner } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { a as CardHeader, i as CardFooter, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.index-BpVsQxj_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AI_CATEGORIES = [
	{
		id: "recruitment",
		label: "Recruitment AI",
		icon: Briefcase
	},
	{
		id: "employee",
		label: "Employee AI",
		icon: Users
	},
	{
		id: "workforce",
		label: "Workforce AI",
		icon: Target
	},
	{
		id: "performance",
		label: "Performance AI",
		icon: Gauge
	},
	{
		id: "payroll",
		label: "Payroll AI",
		icon: Banknote
	},
	{
		id: "compliance",
		label: "Compliance AI",
		icon: ShieldCheck
	},
	{
		id: "document",
		label: "Document AI",
		icon: FilePlusCorner
	},
	{
		id: "meeting",
		label: "Meeting Intelligence",
		icon: Video
	},
	{
		id: "analytics",
		label: "Analytics AI",
		icon: ChartLine
	},
	{
		id: "knowledge",
		label: "Knowledge AI (RAG)",
		icon: BookOpen
	}
];
var AI_TOOLS = [
	{
		id: "rec-screen",
		category: "recruitment",
		name: "AI Resume Screening",
		description: "Automated batch ranking of candidate profiles.",
		icon: Briefcase,
		defaultPrompt: "Assess compliance scoring of 5 senior engineer resumes.",
		simulatePlaceholder: "Paste resume markdown..."
	},
	{
		id: "rec-rank",
		category: "recruitment",
		name: "AI Candidate Ranking",
		description: "Skill gap matching analytics.",
		icon: Award
	},
	{
		id: "rec-parser",
		category: "recruitment",
		name: "AI Resume Parser",
		description: "Converts PDF resumes into JSON profiles.",
		icon: FileText
	},
	{
		id: "rec-jd",
		category: "recruitment",
		name: "AI Job Description Generator",
		description: "Creates inclusive, brand-aligned job descriptions.",
		icon: FileEdit,
		defaultPrompt: "Write a Job Description for Senior React Developer in Bengaluru.",
		simulatePlaceholder: "Job title and requirements..."
	},
	{
		id: "rec-questions",
		category: "recruitment",
		name: "AI Interview Question Generator",
		description: "Custom behavioral & technical interview questions.",
		icon: MessageSquare
	},
	{
		id: "rec-copilot",
		category: "recruitment",
		name: "AI Interview Copilot",
		description: "Live question prompts and answers logger.",
		icon: Brain
	},
	{
		id: "rec-match",
		category: "recruitment",
		name: "AI Candidate Match Score",
		description: "Calculates match percentage against dynamic JDs.",
		icon: Target
	},
	{
		id: "rec-offer",
		category: "recruitment",
		name: "AI Offer Letter Generator",
		description: "Creates custom tailored salary and perk offers.",
		icon: FilePlusCorner
	},
	{
		id: "rec-summary",
		category: "recruitment",
		name: "AI Candidate Summary",
		description: "Outputs highlights and areas of concern.",
		icon: Info
	},
	{
		id: "rec-skill",
		category: "recruitment",
		name: "AI Skill Gap Analysis",
		description: "Analyzes skills tests against requirements.",
		icon: Target
	},
	{
		id: "emp-hr-chat",
		category: "employee",
		name: "AI HR Chat Assistant",
		description: "Answers employees' HR policy queries in real-time.",
		icon: MessageSquare,
		defaultPrompt: "What is the maternity leave policy for India branches?",
		simulatePlaceholder: "Ask policy question..."
	},
	{
		id: "emp-assistant",
		category: "employee",
		name: "AI Employee Assistant",
		description: "Productivity bot for task tracking and calendar scheduling.",
		icon: Users
	},
	{
		id: "emp-career",
		category: "employee",
		name: "AI Career Advisor",
		description: "Career growth pathing matching capabilities.",
		icon: Award
	},
	{
		id: "emp-learning",
		category: "employee",
		name: "AI Learning Recommendations",
		description: "Suggests courses from Udemy/Coursera.",
		icon: BookOpen
	},
	{
		id: "emp-promotion",
		category: "employee",
		name: "AI Promotion Suggestions",
		description: "Identifies employees ready for grade increases.",
		icon: Zap
	},
	{
		id: "emp-sentiment",
		category: "employee",
		name: "AI Employee Sentiment Analysis",
		description: "Processes Slack logs/feedback for sentiment scores.",
		icon: HeartPulse
	},
	{
		id: "emp-summary",
		category: "employee",
		name: "AI Employee Summary",
		description: "Generates performance & history brief dashboards.",
		icon: Info
	},
	{
		id: "emp-profile",
		category: "employee",
		name: "AI Employee Profile Generator",
		description: "Autofills profile files from resumes.",
		icon: Users
	},
	{
		id: "wf-planning",
		category: "workforce",
		name: "Workforce Planning",
		description: "Identifies staffing models & team allocations.",
		icon: Target
	},
	{
		id: "wf-headcount",
		category: "workforce",
		name: "Headcount Forecast",
		description: "Predictive headcount targets by department.",
		icon: ChartLine
	},
	{
		id: "wf-shift",
		category: "workforce",
		name: "Shift Optimization",
		description: "Schedules shifts based on load forecasts.",
		icon: Clock
	},
	{
		id: "wf-anomaly",
		category: "workforce",
		name: "Attendance Anomaly Detection",
		description: "Flags unusual clock-in and absence streaks.",
		icon: ShieldAlert
	},
	{
		id: "wf-leave",
		category: "workforce",
		name: "Leave Pattern Analysis",
		description: "Predicts leave requests using historical trends.",
		icon: Calendar
	},
	{
		id: "wf-overtime",
		category: "workforce",
		name: "Overtime Analysis",
		description: "Tracks burnout risks from overtime tracking.",
		icon: Clock
	},
	{
		id: "wf-productivity",
		category: "workforce",
		name: "Productivity Insights",
		description: "Compares engineering sprint releases to HR files.",
		icon: Zap
	},
	{
		id: "wf-cost",
		category: "workforce",
		name: "Workforce Cost Prediction",
		description: "Forecasts budget costs.",
		icon: Banknote
	},
	{
		id: "perf-coach",
		category: "performance",
		name: "AI Performance Coach",
		description: "Provides personalized advice for managers.",
		icon: Gauge
	},
	{
		id: "perf-kpi",
		category: "performance",
		name: "AI KPI Generator",
		description: "Creates SMART metrics based on designations.",
		icon: Target
	},
	{
		id: "perf-okr",
		category: "performance",
		name: "AI OKR Generator",
		description: "Drafts alignment plans for engineering targets.",
		icon: Target
	},
	{
		id: "perf-review",
		category: "performance",
		name: "AI Review Writer",
		description: "Helps structure annual appraisal feedback drafts.",
		icon: FileEdit
	},
	{
		id: "perf-360",
		category: "performance",
		name: "AI 360 Feedback Analyzer",
		description: "Extracts key insights from peer review logs.",
		icon: Brain
	},
	{
		id: "perf-high",
		category: "performance",
		name: "AI High Performer Detection",
		description: "Flags top 5% talent based on OKR rates.",
		icon: Award
	},
	{
		id: "perf-promo-rec",
		category: "performance",
		name: "AI Promotion Recommendation",
		description: "Evaluates candidates against senior criteria.",
		icon: Zap
	},
	{
		id: "pay-insights",
		category: "payroll",
		name: "Payroll Insights",
		description: "Flags payment variations month over month.",
		icon: Banknote
	},
	{
		id: "pay-bench",
		category: "payroll",
		name: "Salary Benchmarking",
		description: "Matches payroll values to local market rates.",
		icon: ChartLine
	},
	{
		id: "pay-error",
		category: "payroll",
		name: "Payroll Error Detection",
		description: "Pre-audit verification scanner for taxes & deductions.",
		icon: ShieldAlert
	},
	{
		id: "pay-forecast",
		category: "payroll",
		name: "Payroll Forecast",
		description: "Predicts salary totals for upcoming quarters.",
		icon: Banknote
	},
	{
		id: "pay-comp",
		category: "payroll",
		name: "Compensation Recommendation",
		description: "Suggests pay raise brackets to retain talent.",
		icon: Zap
	},
	{
		id: "comp-monitor",
		category: "compliance",
		name: "Compliance Monitor",
		description: "Scans statutory declarations and audit gaps.",
		icon: ShieldCheck
	},
	{
		id: "comp-policy",
		category: "compliance",
		name: "HR Policy Assistant",
		description: "Audits contract drafts against current handbooks.",
		icon: BookOpen
	},
	{
		id: "comp-law",
		category: "compliance",
		name: "Labour Law Assistant",
		description: "Checks regulations across 5 states of operations.",
		icon: ShieldCheck
	},
	{
		id: "comp-doc",
		category: "compliance",
		name: "Document Compliance Checker",
		description: "Checks for valid BGV and passport signatures.",
		icon: FileText
	},
	{
		id: "comp-audit",
		category: "compliance",
		name: "Audit Assistant",
		description: "Logs compliance scores for internal SOC-2 checkups.",
		icon: ShieldCheck
	},
	{
		id: "comp-risk",
		category: "compliance",
		name: "Risk Detection",
		description: "Identifies compliance violation patterns.",
		icon: ShieldAlert
	},
	{
		id: "doc-gen",
		category: "document",
		name: "Document Generator",
		description: "Custom letter wizard with smart placeholders.",
		icon: FilePlusCorner
	},
	{
		id: "doc-offer",
		category: "document",
		name: "Offer Letter Generator",
		description: "Drafts official job offers.",
		icon: FilePenLine
	},
	{
		id: "doc-appointment",
		category: "document",
		name: "Appointment Letter Generator",
		description: "Drafts joining contracts.",
		icon: FilePenLine
	},
	{
		id: "doc-exp",
		category: "document",
		name: "Experience Letter Generator",
		description: "Drafts experience certifications.",
		icon: FileText
	},
	{
		id: "doc-relieving",
		category: "document",
		name: "Relieving Letter Generator",
		description: "Drafts offboarding approvals.",
		icon: FileText
	},
	{
		id: "doc-warning",
		category: "document",
		name: "Warning Letter Generator",
		description: "Drafts disciplinary warnings.",
		icon: ShieldAlert
	},
	{
		id: "doc-promo",
		category: "document",
		name: "Promotion Letter Generator",
		description: "Drafts title promotion updates.",
		icon: Zap
	},
	{
		id: "doc-policy-gen",
		category: "document",
		name: "HR Policy Generator",
		description: "Drafts handbook templates.",
		icon: BookOpen
	},
	{
		id: "doc-nda",
		category: "document",
		name: "NDA Generator",
		description: "Creates custom non-disclosure agreements.",
		icon: ShieldCheck
	},
	{
		id: "doc-contract",
		category: "document",
		name: "Contract Generator",
		description: "Drafts commercial terms.",
		icon: FilePenLine
	},
	{
		id: "meet-summary",
		category: "meeting",
		name: "Meeting Summary",
		description: "Extracts bulleted meeting summaries from video calls.",
		icon: Video
	},
	{
		id: "meet-actions",
		category: "meeting",
		name: "Action Items",
		description: "Auto-assigns checklist steps to team members.",
		icon: ListTodo
	},
	{
		id: "meet-decisions",
		category: "meeting",
		name: "Decision Extraction",
		description: "Saves design decisions to the team knowledge base.",
		icon: Target
	},
	{
		id: "meet-transcript",
		category: "meeting",
		name: "Transcript Analyzer",
		description: "Sentiment analysis on live discussion transcripts.",
		icon: Brain
	},
	{
		id: "meet-followup",
		category: "meeting",
		name: "Meeting Follow-up Generator",
		description: "Emails summaries directly to participants.",
		icon: FileText
	},
	{
		id: "an-exec",
		category: "analytics",
		name: "Executive Dashboard",
		description: "Provides summaries for board reviews.",
		icon: ChartLine
	},
	{
		id: "an-attrition",
		category: "analytics",
		name: "Attrition Prediction",
		description: "Highlights employees with high departure risk indices.",
		icon: ChartLine
	},
	{
		id: "an-div",
		category: "analytics",
		name: "Diversity Analytics",
		description: "Monitors diversity metrics.",
		icon: Users
	},
	{
		id: "an-hiring",
		category: "analytics",
		name: "Hiring Analytics",
		description: "Visualizes hiring pipeline funnels.",
		icon: Briefcase
	},
	{
		id: "an-lifecycle",
		category: "analytics",
		name: "Employee Lifecycle Analytics",
		description: "Tracks lifecycle progression stats.",
		icon: Target
	},
	{
		id: "an-health",
		category: "analytics",
		name: "Organization Health Score",
		description: "Aggregates performance, turnover, and engagement metrics.",
		icon: HeartPulse
	},
	{
		id: "an-insights",
		category: "analytics",
		name: "AI Insights Center",
		description: "Generates custom data summaries.",
		icon: Brain
	},
	{
		id: "rag-kb",
		category: "knowledge",
		name: "AI Knowledge Base (RAG)",
		description: "Semantic search across shared drive files.",
		icon: BookOpen
	},
	{
		id: "rag-policy",
		category: "knowledge",
		name: "Company Policy Q&A",
		description: "Finds answers from the compliance handbook.",
		icon: BookOpen
	},
	{
		id: "rag-handbook",
		category: "knowledge",
		name: "Employee Handbook Assistant",
		description: "Resolves employee questions.",
		icon: MessageSquare
	},
	{
		id: "rag-sop",
		category: "knowledge",
		name: "HR SOP Assistant",
		description: "Guides operations step by step.",
		icon: FileText
	},
	{
		id: "rag-search",
		category: "knowledge",
		name: "Smart Enterprise Search",
		description: "Google-like query answers from internal files.",
		icon: Search
	}
];
function FileEdit(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { ...props });
}
function AIHubDashboard() {
	const [favorites, setFavorites] = (0, import_react.useState)([
		"rec-screen",
		"emp-hr-chat",
		"rag-policy"
	]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [activeTool, setActiveTool] = (0, import_react.useState)(null);
	const [simInput, setSimInput] = (0, import_react.useState)("");
	const [simLoading, setSimLoading] = (0, import_react.useState)(false);
	const [simResult, setSimResult] = (0, import_react.useState)(null);
	const toggleFavorite = (id, e) => {
		e.stopPropagation();
		e.preventDefault();
		if (favorites.includes(id)) {
			setFavorites(favorites.filter((x) => x !== id));
			toast.info("Removed from favorites");
		} else {
			setFavorites([...favorites, id]);
			toast.success("Added to favorites");
		}
	};
	const handleRunSimulation = async (e) => {
		e.preventDefault();
		if (!simInput.trim()) {
			toast.error("Please enter prompt context for inference.");
			return;
		}
		setSimLoading(true);
		setSimResult(null);
		const startTime = performance.now();
		try {
			const response = await apiInstance.post("/ai/chat", {
				query: simInput.trim(),
				role: "admin"
			});
			const elapsedMs = Math.round(performance.now() - startTime);
			const resData = response.data;
			if (resData?.success && resData?.data) {
				const data = resData.data;
				setSimResult({
					success: true,
					answer: typeof data === "string" ? data : data.answer || data.message || JSON.stringify(data, null, 2),
					latencyMs: elapsedMs,
					statusCode: 200
				});
				toast.success(`AI inference complete (${elapsedMs}ms)`);
			} else throw new Error(resData?.message || "Invalid response format from AI service");
		} catch (err) {
			const elapsedMs = Math.round(performance.now() - startTime);
			console.error("Backend AI Inference call failed:", err);
			const status = err?.response?.status || 500;
			const errorData = err?.response?.data?.detail || err?.response?.data?.error || {};
			let errCode = `HTTP_${status}`;
			let errMessage = err?.message || "AI Inference request failed";
			if (typeof errorData === "object" && errorData !== null) {
				errCode = errorData.code || errCode;
				errMessage = errorData.message || errMessage;
			} else if (typeof errorData === "string") errMessage = errorData;
			setSimResult({
				success: false,
				statusCode: status,
				errorCode: errCode,
				errorMessage: errMessage,
				latencyMs: elapsedMs
			});
			toast.error(`AI Inference Failed (${errCode})`);
		} finally {
			setSimLoading(false);
		}
	};
	const filteredTools = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return AI_TOOLS;
		const query = searchQuery.toLowerCase();
		return AI_TOOLS.filter((tool) => tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query) || tool.category.toLowerCase().includes(query));
	}, [searchQuery]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 text-left pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
						children: "AI Tools Workspace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground",
						children: "Access and run specialized enterprise AI models across recruitment, compliance, payroll, documents, and workforce intelligence."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search 71 AI models by name, category, or workflow (e.g. resume screening, payroll, OKR)...",
							className: "pl-10 h-11 border-border bg-card/60 rounded-xl text-xs sm:text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground shrink-0 font-medium",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: filteredTools.length
							}),
							" of ",
							AI_TOOLS.length,
							" AI Models"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: filteredTools.map((tool) => {
						const Icon = tool.icon || Sparkles;
						const isFav = favorites.includes(tool.id);
						const catLabel = AI_CATEGORIES.find((c) => c.id === tool.category)?.label || tool.category;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							onClick: () => {
								setActiveTool(tool);
								setSimInput(tool.defaultPrompt || "");
								setSimResult(null);
							},
							className: "group relative border-border bg-card/40 hover:bg-accent/20 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between text-left overflow-hidden rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-5 pb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] font-medium border-border/60 bg-muted/20",
												children: catLabel
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: (e) => toggleFavorite(tool.id, e),
												className: "text-muted-foreground hover:text-amber-500 cursor-pointer p-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}` })
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-bold mt-4 leading-snug group-hover:text-primary transition-colors",
										children: tool.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs mt-1.5 leading-relaxed line-clamp-2",
										children: tool.description
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
								className: "p-4 pt-3 border-t border-border/40 bg-muted/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "w-full text-xs justify-between group-hover:bg-gradient-brand group-hover:text-brand-foreground cursor-pointer rounded-xl font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Model Sandbox" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })]
								})
							})]
						}, tool.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeTool,
				onOpenChange: (open) => !open && setActiveTool(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display font-bold text-lg flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-indigo-500 fill-indigo-500/10" }),
								activeTool?.name,
								" Sandbox"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: activeTool?.description
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRunSimulation,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "AI Input Prompt Context"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: simInput,
									onChange: (e) => setSimInput(e.target.value),
									placeholder: activeTool?.simulatePlaceholder || "Enter your prompt context or operational input...",
									className: "min-h-[100px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-[10px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: simResult ? simResult.success ? "text-emerald-400 font-semibold" : "text-destructive font-semibold" : "text-emerald-400 font-semibold",
									children: simResult ? simResult.success ? "200 OK" : `Error ${simResult.statusCode}` : "Ready"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Model Gate: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "OFC360 Enterprise AI" })] })]
							}),
							simLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 p-4 rounded-xl border border-border/80 bg-muted/20 animate-pulse",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Executing LLM Inference..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-muted rounded-full w-full" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-muted rounded-full w-5/6" })
								]
							}),
							simResult && simResult.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs font-semibold text-emerald-500 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Real LLM Output"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: [
											"Latency: ",
											simResult.latencyMs,
											"ms"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-black/35 rounded-xl border border-emerald-500/20 p-4 text-slate-100 dark:text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto",
									children: simResult.answer
								})]
							}),
							simResult && !simResult.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-left space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-destructive font-semibold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Inference Failed" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: [simResult.latencyMs, "ms"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-destructive/90 font-mono leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Reason:" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "bg-destructive/20 px-1 py-0.5 rounded text-[10px]",
											children: simResult.errorCode
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Message:" }),
											" ",
											simResult.errorMessage
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border/40 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setActiveTool(null),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Close Sandbox"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [simResult && !simResult.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										disabled: simLoading,
										variant: "secondary",
										className: "h-9 cursor-pointer gap-1.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Retry"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										disabled: simLoading,
										className: "h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer gap-1.5",
										children: [simLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), "Run Model Inference"]
									})]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AIHubDashboard as component };
