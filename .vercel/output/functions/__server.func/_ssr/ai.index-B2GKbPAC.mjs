import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as Save, B as Sparkle, Br as Award, Cn as FileText, Dn as FilePen, E as Trash, En as FilePlusCorner, G as ShieldAlert, Gn as Cpu, H as SlidersVertical, Hn as Database, I as Star, Ir as BookOpen, M as Target, Mr as Brain, On as FilePenLine, Ot as MessageSquare, Rr as Banknote, S as TriangleAlert, Sr as Calendar, Vt as ListTodo, W as ShieldCheck, Wr as ArrowRight, Xn as Clock, Y as Search, Yr as Activity, Zn as Clock3, an as HeartPulse, hn as Gauge, jr as Briefcase, l as Video, lt as Plus, n as Zap, or as CircleCheck, rt as RefreshCw, tn as Info, u as Users, ut as Play, yr as ChartLine, z as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-xVPC106M.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.index-B2GKbPAC.js
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
		icon: FilePen,
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
		icon: FilePen
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
var INITIAL_AGENTS = [];
var INITIAL_WORKFLOWS = [];
var INITIAL_LOGS = [];
var INITIAL_MARKETPLACE = [];
function AIHubDashboard() {
	const [favorites, setFavorites] = (0, import_react.useState)([
		"rec-screen",
		"emp-hr-chat",
		"rag-policy"
	]);
	const [recentTools, setRecentTools] = (0, import_react.useState)([
		"rec-screen",
		"emp-hr-chat",
		"comp-monitor",
		"pay-bench"
	]);
	const [workflows, setWorkflows] = (0, import_react.useState)(INITIAL_WORKFLOWS);
	const [agents, setAgents] = (0, import_react.useState)(INITIAL_AGENTS);
	const [marketplace, setMarketplace] = (0, import_react.useState)(INITIAL_MARKETPLACE);
	const [auditLogs, setAuditLogs] = (0, import_react.useState)(INITIAL_LOGS);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [provider, setProvider] = (0, import_react.useState)("anthropic");
	const [apiKey, setApiKey] = (0, import_react.useState)("••••••••••••••••••••••••••••");
	const [modelName, setModelName] = (0, import_react.useState)("claude-3-5-sonnet");
	const [temperature, setTemperature] = (0, import_react.useState)(.7);
	const [maxTokens, setMaxTokens] = (0, import_react.useState)(4096);
	const [sysPrompt, setSysPrompt] = (0, import_react.useState)("You are Antigravity, the enterprise HR assistant at ofc360 HR.");
	const [vectorDb, setVectorDb] = (0, import_react.useState)("pinecone");
	const [embedModel, setEmbedModel] = (0, import_react.useState)("text-embedding-3-small");
	const [activeTool, setActiveTool] = (0, import_react.useState)(null);
	const [simInput, setSimInput] = (0, import_react.useState)("");
	const [simLoading, setSimLoading] = (0, import_react.useState)(false);
	const [simResponse, setSimResponse] = (0, import_react.useState)(null);
	const [newWfOpen, setNewWfOpen] = (0, import_react.useState)(false);
	const [newWfName, setNewWfName] = (0, import_react.useState)("");
	const [newWfTrigger, setNewWfTrigger] = (0, import_react.useState)("New employee onboarding checklist");
	const [newWfAction, setNewWfAction] = (0, import_react.useState)("Auto generate Relieving Letter");
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
	const handleRunSimulation = (e) => {
		e.preventDefault();
		if (!simInput.trim()) return;
		setSimLoading(true);
		setSimResponse(null);
		setTimeout(() => {
			setSimLoading(false);
			let answer = "";
			if (activeTool?.id === "rec-screen") answer = `ofc360 AI RESUME SCREENER — RESULTS:
1. Karan Singh (Score: 92/100) — Match matches SDE-2 backend requirements. Strong Node.js & Go capabilities.
2. Priya Mehta (Score: 88/100) — Excellent design portfolio, fits UI designer roles.
3. Aarav Sharma (Score: 65/100) — Missing cloud scaling references.

Recommendation: Advance Karan Singh directly to technical rounds.`;
			else if (activeTool?.id === "rec-jd") answer = `JOB DESCRIPTION: Senior React Developer
Department: Engineering | Location: Bengaluru / Remote

Responsibilities:
• Develop state-of-the-art UI architectures using React, TanStack, and Tailwind.
• Partner with backend engineering teams to configure API endpoints.
• Improve performance benchmarks of core product modules.

Requirements:
• 5+ years building production applications.
• Strong TypeScript, Next.js, and CSS fundamentals.`;
			else if (activeTool?.id === "emp-hr-chat") answer = `ofc360 POLICY HELPER:
For India offices, employees are entitled to 26 weeks (182 days) of fully paid maternity leave.
This applies to employees who have worked at least 80 days in the 12 months preceding the delivery date.

Please coordinate with HR BP Priya Nair to log this under your benefits tracker.`;
			else answer = `ofc360 ENTERPRISE AI COMPILER:
Task successfully processed using ${modelName}.
Tokens consumed: 1,450.
Duration: 1.8 seconds.
Inference Result: Validated parameters match compliance profiles. Checklist completed.`;
			setSimResponse(answer);
			setAuditLogs([{
				id: `l-${Math.floor(100 + Math.random() * 900)}`,
				tool: activeTool?.name || "AI Tool",
				user: "HR Administrator",
				department: "Operations",
				requestTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 16),
				duration: "1.8s",
				status: "success",
				modelUsed: modelName,
				tokensUsed: 1450
			}, ...auditLogs]);
			if (activeTool) setRecentTools((prev) => [activeTool.id, ...prev.filter((x) => x !== activeTool.id)].slice(0, 5));
		}, 1500);
	};
	const handleRunAgent = (id) => {
		setAgents((prev) => prev.map((a) => {
			if (a.id === id) return {
				...a,
				status: "running",
				lastActivity: "Just now",
				logs: [
					"User triggered manual run.",
					"Evaluating rules.",
					...a.logs
				]
			};
			return a;
		}));
		toast.loading("Invoking AI Agent workspace...", { duration: 1e3 });
		setTimeout(() => {
			setAgents((prev) => prev.map((a) => {
				if (a.id === id) return {
					...a,
					status: "idle",
					logs: [
						"Work completed.",
						"Status returned to idle.",
						...a.logs
					]
				};
				return a;
			}));
			toast.success("AI Agent run completed successfully.");
		}, 2e3);
	};
	const filteredTools = (0, import_react.useMemo)(() => {
		return AI_TOOLS.filter((tool) => {
			const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchCat = selectedCategory === "all" || tool.category === selectedCategory;
			return matchSearch && matchCat;
		});
	}, [searchQuery, selectedCategory]);
	const toolCountsByCategory = (0, import_react.useMemo)(() => {
		const counts = {};
		AI_TOOLS.forEach((t) => {
			counts[t.category] = (counts[t.category] || 0) + 1;
		});
		return counts;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "AI Workspace & Hub"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground text-left",
					children: "Configure LLMs, manage autonomous multi-agent systems, write workflow automations, and run specialized intelligence tools."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, { className: "h-3 w-3 fill-indigo-500 animate-pulse" }), "V2.0 Active"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "LLM Gateway Connected"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8",
				children: [
					{
						label: "AI Usage Today",
						value: "84.2k tokens",
						icon: Cpu,
						accent: "text-blue-500"
					},
					{
						label: "Total AI Requests",
						value: "1,249",
						icon: Activity,
						accent: "text-indigo-500"
					},
					{
						label: "Active AI Agents",
						value: "11 Agents",
						icon: Sparkles,
						accent: "text-fuchsia-500"
					},
					{
						label: "Docs Generated",
						value: "482 Letters",
						icon: FileText,
						accent: "text-amber-500"
					},
					{
						label: "AI Time Saved",
						value: "340 Hours",
						icon: Clock3,
						accent: "text-emerald-500"
					},
					{
						label: "AI Health Score",
						value: "99.8%",
						icon: ShieldCheck,
						accent: "text-teal-500"
					},
					{
						label: "Settings Provider",
						value: "Claude 3.5",
						icon: SlidersVertical,
						accent: "text-purple-500"
					},
					{
						label: "Vector Database",
						value: "Pinecone",
						icon: Database,
						accent: "text-rose-500"
					}
				].map((stat, idx) => {
					const Icon = stat.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase leading-none truncate max-w-[80px]",
									title: stat.label,
									children: stat.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${stat.accent}` })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-sm font-bold truncate leading-none font-display text-left",
								children: stat.value
							})]
						})
					}, idx);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "dashboard",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border bg-card/40 p-1 rounded-xl w-fit flex overflow-x-auto scrollbar-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-transparent border-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "dashboard",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "AI Dashboard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "tools",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "AI Tools Workspace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "agents",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "Autonomous Agents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "automations",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "Automation Center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "logs",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "Audit Logs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "settings",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "Settings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "marketplace",
									className: "text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer",
									children: "Marketplace"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "dashboard",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 lg:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: searchQuery,
													onChange: (e) => setSearchQuery(e.target.value),
													placeholder: "Search AI sub-tools across categories (e.g. screening, parsing, law...)",
													className: "pl-9 h-10 border-border bg-card/60"
												})]
											}), searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												onClick: () => setSearchQuery(""),
												className: "h-10 text-xs border border-border bg-card/30",
												children: "Clear"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 text-amber-500 fill-amber-500" }), "Pinned Favorite AI Tools"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
											children: favorites.map((favId) => {
												const tool = AI_TOOLS.find((t) => t.id === favId);
												if (!tool) return null;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
													onClick: () => {
														setActiveTool(tool);
														setSimInput(tool.defaultPrompt || "");
														setSimResponse(null);
													},
													className: "border-border bg-card/60 hover:bg-accent/40 cursor-pointer transition-all hover:-translate-y-0.5 group text-left",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
														className: "p-3 flex items-start gap-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tool.icon || Sparkles, { className: "h-4 w-4" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex-1 min-w-0",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
																	className: "text-xs font-bold text-foreground truncate",
																	children: tool.name
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-[10px] text-muted-foreground line-clamp-1 mt-0.5",
																	children: tool.description
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: (e) => toggleFavorite(tool.id, e),
																className: "text-amber-500 hover:text-muted-foreground cursor-pointer",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-current" })
															})
														]
													})
												}, favId);
											})
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-indigo-500" }), "Recently Used tools"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: recentTools.map((recId) => {
											const tool = AI_TOOLS.find((t) => t.id === recId);
											if (!tool) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
												onClick: () => {
													setActiveTool(tool);
													setSimInput(tool.defaultPrompt || "");
													setSimResponse(null);
												},
												className: "border-border bg-card/60 hover:bg-accent/40 cursor-pointer transition-all group text-left",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
													className: "p-3.5 flex items-center gap-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tool.icon || Sparkles, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex-1",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
																className: "text-xs font-bold text-foreground",
																children: tool.name
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
													]
												})
											}, recId);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "border-border bg-card/40 backdrop-blur-xl text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
											className: "pb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
												className: "text-sm font-bold",
												children: "AI Token Allocation Trends"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
												className: "text-xs",
												children: "Aggregate token volume consumed over the past hours"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "h-[200px] p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
													data: [
														{
															hour: "09:00",
															tokens: 12e3
														},
														{
															hour: "10:00",
															tokens: 35e3
														},
														{
															hour: "11:00",
															tokens: 48e3
														},
														{
															hour: "12:00",
															tokens: 28e3
														},
														{
															hour: "13:00",
															tokens: 19e3
														},
														{
															hour: "14:00",
															tokens: 84200
														}
													],
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
															id: "colorTokens",
															x1: "0",
															y1: "0",
															x2: "0",
															y2: "1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
																offset: "5%",
																stopColor: "#6366f1",
																stopOpacity: .3
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
																offset: "95%",
																stopColor: "#6366f1",
																stopOpacity: 0
															})]
														}) }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
															strokeDasharray: "3 3",
															opacity: .05
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
															dataKey: "hour",
															style: { fontSize: 9 }
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { style: { fontSize: 9 } }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 10 } }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
															type: "monotone",
															dataKey: "tokens",
															stroke: "#6366f1",
															fillOpacity: 1,
															fill: "url(#colorTokens)"
														})
													]
												})
											})
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 lg:col-span-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm font-bold flex items-center gap-1.5 text-indigo-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), "AI Agent Status Tracker"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs",
											children: "Quick review of running worker bots"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "p-0 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
												className: "text-xs border-collapse",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: agents.slice(0, 6).map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border/60 hover:bg-accent/20",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2.5 font-bold",
															children: agent.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2.5 text-muted-foreground text-[10px]",
															children: agent.model
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2.5 text-right",
															children: agent.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																className: "bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-bold animate-pulse",
																children: "Running"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																className: "bg-muted text-muted-foreground border-none text-[9px] font-bold",
																children: "Idle"
															})
														})
													]
												}, agent.id)) })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
											className: "pt-2 pb-3 flex justify-center border-t border-border/40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "All agents responsive under SLA guidelines."
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card/40 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "pb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-rose-500" }), "AI System Notifications"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-3 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-lg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: "Claude API Key Warning"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-[10px]",
												children: "Token limits approaching 85% of monthly sandbox tier."
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: "Model Optimization"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-[10px]",
												children: "Switched HR Copilot agent to Claude-3-5-sonnet for faster parsing."
											})] })]
										})]
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "tools",
						className: "space-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-foreground",
									children: "AI Domains & Categories"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Select an AI domain card to filter available specialized models"
								})] }), selectedCategory !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setSelectedCategory("all"),
									className: "text-xs h-8",
									children: [
										"Show All Domains (",
										AI_TOOLS.length,
										")"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setSelectedCategory("all"),
									className: `group relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 backdrop-blur-xl transition-all cursor-pointer ${selectedCategory === "all" ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card/40 hover:border-primary/50 hover:bg-accent/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px] font-bold",
											children: AI_TOOLS.length
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold truncate",
											children: "All Models"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Complete Catalog"
										})]
									})]
								}), AI_CATEGORIES.map((cat) => {
									const count = toolCountsByCategory[cat.id] || 0;
									const Icon = cat.icon || Sparkles;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => setSelectedCategory(cat.id),
										className: `group relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 backdrop-blur-xl transition-all cursor-pointer ${selectedCategory === cat.id ? "border-indigo-500 bg-indigo-500/10 shadow-glow" : "border-border bg-card/40 hover:border-indigo-500/50 hover:bg-accent/40"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] font-bold border-none",
												children: count
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-bold truncate",
												children: cat.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: [count, " Specialized Tools"]
											})]
										})]
									}, cat.id);
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										placeholder: "Search AI models, generators, assistants, and parsers...",
										className: "pl-9 h-10 border-border bg-card/60 rounded-xl"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground shrink-0 font-medium",
									children: [
										"Showing ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: filteredTools.length
										}),
										" AI Models"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
								children: filteredTools.map((tool) => {
									const Icon = tool.icon || Sparkles;
									const isFav = favorites.includes(tool.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										onClick: () => {
											setActiveTool(tool);
											setSimInput(tool.defaultPrompt || "");
											setSimResponse(null);
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
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: (e) => toggleFavorite(tool.id, e),
														className: "text-muted-foreground hover:text-amber-500 cursor-pointer p-1",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}` })
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
												className: "w-full text-xs justify-between group-hover:bg-primary group-hover:text-primary-foreground cursor-pointer rounded-xl font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Tool Sandbox" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })]
											})
										})]
									}, tool.id);
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "agents",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-6 md:grid-cols-3",
							children: agents.map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card/40 backdrop-blur-xl flex flex-col justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
										className: "pb-3 text-left",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-start",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
												className: "text-sm font-bold flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4 text-indigo-500" }), agent.name]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
												className: "text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider",
												children: agent.role
											})] }), agent.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-bold animate-pulse",
												children: "Active"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-muted text-muted-foreground border-none text-[9px] font-bold",
												children: "Idle"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-3.5 text-xs text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 bg-muted/20 p-2.5 rounded-lg border border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[9px]",
												children: "Model Target"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground block",
												children: agent.model
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[9px]",
												children: "SLA Response"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground block",
												children: agent.responseTime
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold text-muted-foreground uppercase",
												children: "Agent Logs"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-lg bg-black/30 border border-border p-2 font-mono text-[9px] text-slate-300 h-24 overflow-y-auto",
												children: agent.logs.map((log, lIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "leading-relaxed",
													children: ["> ", log]
												}, lIdx))
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
										className: "pt-2 pb-3 border-t border-border/40 flex justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => {
												toast.info(`Opened configuration sheet for: ${agent.name}`);
											},
											className: "h-8 text-xs border-border flex-1 bg-transparent cursor-pointer",
											children: "Configure"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => handleRunAgent(agent.id),
											className: "h-8 text-xs bg-indigo-600 hover:bg-indigo-750 text-white flex-1 cursor-pointer gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3" }), " Run Now"]
										})]
									})
								]
							}, agent.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "automations",
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base font-bold",
								children: "Automation Center Rules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Trigger autonomous workflows based on HR lifecycle events."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setNewWfOpen(true),
								className: "h-9 gap-1.5 bg-gradient-brand text-brand-foreground cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create Rule"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
								className: "text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
									className: "bg-muted/10 border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Rule Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Event Trigger"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "AI Action Pipeline"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3 text-center",
											children: "Active Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-4 py-3 text-right" })
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: workflows.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "border-t border-border hover:bg-accent/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 font-bold",
											children: rule.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-muted-foreground",
											children: rule.trigger
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 font-mono text-[11px] text-indigo-500",
											children: rule.action
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: rule.active,
												onCheckedChange: (checked) => {
													setWorkflows((prev) => prev.map((w) => {
														if (w.id === rule.id) return {
															...w,
															active: checked
														};
														return w;
													}));
													toast.success(`Workflow "${rule.name}" set to ${checked ? "Active" : "Inactive"}`);
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												onClick: () => {
													setWorkflows((prev) => prev.filter((w) => w.id !== rule.id));
													toast.error("Workflow rule deleted");
												},
												className: "h-7 w-7 text-muted-foreground hover:text-rose-500 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "h-3.5 w-3.5" })
											})
										})
									]
								}, rule.id)) })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "logs",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
								className: "text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
									className: "bg-muted/10 border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "AI Tool"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Operator"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Timestamp"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3",
											children: "Duration"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3 text-center",
											children: "Inference Model"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "px-4 py-3 text-right",
											children: "Tokens Used"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: auditLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "border-t border-border hover:bg-accent/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 font-bold",
											children: log.tool
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-foreground/80",
											children: log.user
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-muted-foreground",
											children: log.department
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-muted-foreground",
											children: log.requestTime
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 font-mono text-[10px]",
											children: log.duration
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-center font-semibold text-indigo-500",
											children: log.modelUsed
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "px-4 py-3.5 text-right font-mono font-bold text-foreground",
											children: log.tokensUsed.toLocaleString()
										})
									]
								}, log.id)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "settings",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 md:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card/40 backdrop-blur-xl md:col-span-2 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-sm font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4" }), "Primary LLM Credentials"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Configure the default API provider for the workspace"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs font-semibold text-muted-foreground",
														children: "LLM Provider"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: provider,
														onValueChange: (val) => setProvider(val),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "w-full bg-background border-border text-xs",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "openai",
																children: "OpenAI (GPT-4o)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "anthropic",
																children: "Anthropic (Claude 3.5)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "gemini",
																children: "Google Gemini (Pro 1.5)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "ollama",
																children: "Ollama (Llama-3 Local)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "azure",
																children: "Azure OpenAI"
															})
														] })]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs font-semibold text-muted-foreground",
														children: "Model Target"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: modelName,
														onChange: (e) => setModelName(e.target.value),
														className: "bg-background border-border text-xs h-9"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs font-semibold text-muted-foreground",
													children: "API Credentials Key"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "password",
													value: apiKey,
													onChange: (e) => setApiKey(e.target.value),
													className: "bg-background border-border text-xs h-9"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "text-xs font-semibold text-muted-foreground",
														children: [
															"Temperature (",
															temperature,
															")"
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "range",
														min: "0",
														max: "1",
														step: "0.1",
														value: temperature,
														onChange: (e) => setTemperature(parseFloat(e.target.value)),
														className: "w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs font-semibold text-muted-foreground",
														children: "Max Tokens Payout"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														value: maxTokens,
														onChange: (e) => setMaxTokens(parseInt(e.target.value) || 4096),
														className: "bg-background border-border text-xs h-9"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs font-semibold text-muted-foreground",
													children: "System Directive Prompt"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: sysPrompt,
													onChange: (e) => setSysPrompt(e.target.value),
													className: "min-h-[80px] bg-background border-border text-xs"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
										className: "pt-2 border-t border-border/40 flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => {
												toast.success("LLM Gateway configuration updated successfully.");
											},
											className: "h-9 bg-gradient-brand text-brand-foreground cursor-pointer gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Configuration"]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card/40 backdrop-blur-xl text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-bold flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }), "Vector Database (RAG)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
									className: "text-xs",
									children: "Manage smart policy document index search databases"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-4 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Vector DB Provider"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: vectorDb,
												onValueChange: setVectorDb,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-full bg-background border-border text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "pinecone",
														children: "Pinecone Cloud"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "qdrant",
														children: "Qdrant Server"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "milvus",
														children: "Milvus DB"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "chroma",
														children: "Chroma DB (Local In-Memory)"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Embedding Model"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: embedModel,
												onValueChange: setEmbedModel,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-full bg-background border-border text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "text-embedding-3-small",
														children: "text-embedding-3-small (OpenAI)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "text-embedding-3-large",
														children: "text-embedding-3-large (OpenAI)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "bge-large-en-v1.5",
														children: "BGE-Large-EN (HuggingFace)"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-2.5 space-y-1.5 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-indigo-400 block text-[10px] uppercase font-bold",
												children: "RAG Document Source Files"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
												className: "space-y-1 text-[10px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• India_Leave_Policy_2025.pdf (182 KB)" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Employee_Handbook_v4.pdf (1.2 MB)" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• NDA_Template_Corporate_Global.docx (45 KB)" })
												]
											})]
										})
									]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "marketplace",
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base font-bold",
								children: "AI Marketplace Addons"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Install future HR or corporate AI modules with one click."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: marketplace.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card/40 backdrop-blur-xl flex flex-col justify-between text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
											className: "text-sm font-bold",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: item.cost
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs mt-1.5",
										children: item.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
									className: "pt-2 pb-3 border-t border-border/40",
									children: item.installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										disabled: true,
										className: "w-full text-xs h-8 bg-muted text-muted-foreground cursor-not-allowed",
										children: "Module Installed"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											setMarketplace((prev) => prev.map((m) => {
												if (m.id === item.id) return {
													...m,
													installed: true
												};
												return m;
											}));
											toast.success(`${item.name} integrated successfully!`);
										},
										className: "w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer",
										children: "Install Module"
									})
								})]
							}, item.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeTool,
				onOpenChange: (open) => !open && setActiveTool(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display font-bold text-lg flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-indigo-500 fill-indigo-500/10 animate-pulse" }),
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
									placeholder: activeTool?.simulatePlaceholder || "State your prompt requirements...",
									className: "min-h-[100px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-[10px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Model Gate: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: modelName })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Temp: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: temperature })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Max Tokens: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: maxTokens })] })
								]
							}),
							simLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 p-4 rounded-xl border border-border/80 bg-muted/20 animate-pulse",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-muted rounded-full w-1/3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-muted rounded-full w-full" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-muted rounded-full w-5/6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-muted rounded-full w-4/5" })
								]
							}),
							simResponse && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Inference Output"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-black/35 rounded-xl border border-border p-4 text-slate-100 dark:text-slate-100 font-mono text-[10px] leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto",
									children: simResponse
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setActiveTool(null),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Close Sandbox"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: simLoading,
									className: "h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer gap-1.5",
									children: [simLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), "Run Inference"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: newWfOpen,
				onOpenChange: setNewWfOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "font-display font-bold",
								children: "Create Custom Workflow Rule"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs",
								children: "Setup automated AI response chains on HR triggers."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Rule Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newWfName,
										onChange: (e) => setNewWfName(e.target.value),
										placeholder: "e.g. Auto screen incoming applications",
										className: "bg-background border-border text-xs h-9"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Event Trigger"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newWfTrigger,
										onValueChange: setNewWfTrigger,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-full bg-background border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Candidate applies on careers site",
												children: "Candidate applies on careers site"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "New employee onboarding checklist",
												children: "New employee onboarding checklist"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Exit request approved",
												children: "Exit request approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Daily attendance logs compiled",
												children: "Daily attendance logs compiled"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "AI Action Pipeline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newWfAction,
										onValueChange: setNewWfAction,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-full bg-background border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Run AI Resume screening & match score assessment",
												children: "Run AI Resume screening & match score assessment"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Auto generate Relieving Letter",
												children: "Auto generate Relieving Letter"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Verify compliance and check signatures",
												children: "Verify compliance and check signatures"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Flag late arrival patterns and alert manager",
												children: "Flag late arrival patterns and alert manager"
											})
										] })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setNewWfOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									if (!newWfName) {
										toast.error("Please enter a rule name.");
										return;
									}
									const newRule = {
										id: `wf-${Date.now()}`,
										name: newWfName,
										trigger: newWfTrigger,
										action: newWfAction,
										active: true
									};
									setWorkflows([...workflows, newRule]);
									toast.success("Workflow rule created successfully.");
									setNewWfOpen(false);
									setNewWfName("");
								},
								className: "h-9 bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer",
								children: "Create Rule"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AIHubDashboard as component };
