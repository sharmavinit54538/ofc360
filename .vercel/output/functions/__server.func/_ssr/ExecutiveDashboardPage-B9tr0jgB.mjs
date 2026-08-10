import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360 } from "./ofc360-store-XkEEWRxo.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, At as LogOut, C as TrendingDown, Cn as FileCheck, Cr as Briefcase, Fn as CreditCard, Hn as Clock, I as Sparkles, Mr as Award, Qn as CircleCheck, S as TrendingUp, Tr as Bot, Wn as ClipboardCheck, _r as CalendarDays, gn as FileText, i as Wrench, jn as Download, m as UserPlus, n as Zap, r as X, rr as ChevronRight, v as UserCheck, vt as Package, wt as MessageSquare, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExecutiveDashboardPage-B9tr0jgB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KPI_CARDS = [];
var APPROVAL_DATA = {
	Leave: [],
	Attendance: [],
	Recruitment: [],
	Onboarding: [],
	Exit: [],
	Assets: [],
	Documents: [],
	Expenses: []
};
var PIPELINE_STAGES = [];
var ACTIVE_JOBS = [];
var INTERVIEWS_TODAY = [];
var WEEKLY_ATTENDANCE = [];
var DEPT_ATTENDANCE = [];
var MONTHLY_PAYROLL = [];
var PAYROLL_STATUS = [];
var ASSET_STATS = [];
var ONBOARDING_STAGES = [];
var EXIT_STAGES = [];
var AI_FEATURES = [
	{
		title: "HR Copilot",
		desc: "AI-powered HR Q&A and policy guidance",
		link: "/ai/chat-assistant",
		color: "from-violet-600 to-purple-700"
	},
	{
		title: "Resume Screening",
		desc: "Automated resume parsing & scoring",
		link: "/ai/recruiter",
		color: "from-blue-600 to-indigo-700"
	},
	{
		title: "Interview Copilot",
		desc: "Real-time interview assistance",
		link: "/dashboard/recruitment/copilot",
		color: "from-cyan-600 to-blue-700"
	},
	{
		title: "AI Analytics",
		desc: "Predictive workforce intelligence",
		link: "/ai/analytics-center",
		color: "from-emerald-600 to-teal-700"
	},
	{
		title: "Policy Assistant",
		desc: "Instant policy answers & summaries",
		link: "/ai/policy-assistant",
		color: "from-amber-600 to-orange-700"
	},
	{
		title: "AI Chat",
		desc: "Multi-modal HR assistant",
		link: "/ai/chat-assistant",
		color: "from-rose-600 to-pink-700"
	}
];
var AI_METRICS = [];
var AI_RECENT = [];
var HEADCOUNT_GROWTH = [];
var ATTRITION_RATE = [];
var SALARY_DISTRIBUTION = [];
var GENDER_DIVERSITY = [];
var DEPT_DISTRIBUTION = [];
var CALENDAR_EVENTS = [];
var ACTIVITY_FEED = [];
var NOTIFICATIONS = [];
var DEPT_PERFORMANCE = [];
var REPORT_BUTTONS = [
	{
		label: "Attendance",
		link: "/dashboard/attendance",
		color: "from-teal-600 to-cyan-600"
	},
	{
		label: "Payroll",
		link: "/dashboard/payroll/reports",
		color: "from-green-600 to-emerald-600"
	},
	{
		label: "Recruitment",
		link: "/dashboard/recruitment/reports",
		color: "from-indigo-600 to-blue-600"
	},
	{
		label: "Assets",
		link: "/dashboard/assets",
		color: "from-slate-600 to-gray-600"
	},
	{
		label: "Leave",
		link: "/dashboard/leaves",
		color: "from-amber-600 to-orange-600"
	},
	{
		label: "Exit",
		link: "/dashboard/exit",
		color: "from-rose-600 to-red-600"
	},
	{
		label: "Analytics",
		link: "/dashboard/recruitment/analytics",
		color: "from-violet-600 to-purple-600"
	}
];
var WIDGET_SCORES = [];
var WORLD_CLOCKS = [];
var fadeUp = {
	initial: {
		opacity: 0,
		y: 24
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .4,
		ease: "easeOut"
	}
};
var stagger = (i) => ({
	initial: {
		opacity: 0,
		y: 24
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .4,
		ease: "easeOut",
		delay: i * .06
	}
});
function Card({ children, className = "", noPad = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm ${noPad ? "" : "p-5"} ${className}`,
		children
	});
}
function SectionHeader({ title, subtitle, link, linkLabel = "View More", action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: subtitle
		})] }), action || link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: link,
			className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
			children: [
				linkLabel,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })
			]
		})]
	});
}
var ICON_MAP = {
	Package,
	UserCheck,
	CheckCircle2: CircleCheck,
	AlertTriangle: TriangleAlert,
	Clock,
	Wrench,
	UserPlus,
	Briefcase,
	FileText,
	CreditCard,
	MessageSquare,
	ClipboardCheck,
	LogOut,
	FileCheck,
	Award
};
function LiveClock() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const t = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(t);
	}, []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-right hidden sm:block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold tabular-nums",
			children: "--:--:--"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "Loading..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-right hidden sm:block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold tabular-nums",
			children: time.toLocaleTimeString("en-IN", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: time.toLocaleDateString("en-IN", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			})
		})]
	});
}
var QUICK_ACTIONS = [
	{
		label: "Add Employee",
		icon: UserPlus,
		link: "/dashboard/employees",
		color: "from-emerald-600 to-teal-600"
	},
	{
		label: "Create Job",
		icon: Briefcase,
		link: "/dashboard/recruitment/jobs/new",
		color: "from-blue-600 to-indigo-600"
	},
	{
		label: "Run Payroll",
		icon: CreditCard,
		link: "/dashboard/payroll",
		color: "from-green-600 to-emerald-600"
	},
	{
		label: "Start Onboarding",
		icon: UserCheck,
		link: "/dashboard/onboarding-checklist",
		color: "from-violet-600 to-purple-600"
	},
	{
		label: "Approve Leave",
		icon: FileText,
		link: "/dashboard/leaves",
		color: "from-amber-600 to-orange-600"
	},
	{
		label: "Assign Asset",
		icon: Package,
		link: "/dashboard/assets",
		color: "from-slate-600 to-gray-700"
	},
	{
		label: "Generate Report",
		icon: Download,
		link: "/dashboard/reports",
		color: "from-cyan-600 to-blue-600"
	},
	{
		label: "AI Copilot",
		icon: Bot,
		link: "/ai/chat-assistant",
		color: "from-pink-600 to-rose-600"
	}
];
function QuickActions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8",
			children: QUICK_ACTIONS.map((a, i) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...stagger(i),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: a.link,
						className: "group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 text-center transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${a.color} shadow-sm`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground",
							children: a.label
						})]
					})
				}, a.label);
			})
		})
	});
}
function KpiCards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
		children: KPI_CARDS.map((kpi, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			...stagger(i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: kpi.link,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: `h-4 w-4 ${kpi.accent}` })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl font-bold tracking-tight",
							children: kpi.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: kpi.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mt-2 flex items-center gap-1 text-xs font-medium ${kpi.changeType === "up" ? "text-emerald-500" : kpi.changeType === "down" ? "text-rose-500" : "text-muted-foreground"}`,
							children: [kpi.changeType === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : kpi.changeType === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }) : null, kpi.change]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-10 w-full opacity-60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
									data: kpi.spark,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "v",
										stroke: kpi.accent.includes("emerald") ? "#10b981" : kpi.accent.includes("blue") ? "#3b82f6" : kpi.accent.includes("violet") ? "#8b5cf6" : kpi.accent.includes("amber") ? "#f59e0b" : kpi.accent.includes("rose") ? "#f43f5e" : kpi.accent.includes("cyan") ? "#06b6d4" : kpi.accent.includes("indigo") ? "#6366f1" : kpi.accent.includes("teal") ? "#14b8a6" : kpi.accent.includes("orange") ? "#f97316" : kpi.accent.includes("green") ? "#22c55e" : kpi.accent.includes("slate") ? "#64748b" : "#6366f1",
										strokeWidth: 2,
										dot: false
									})
								})
							})
						})
					]
				})
			})
		}, kpi.id))
	});
}
var APPROVAL_TABS = [
	"Leave",
	"Attendance",
	"Recruitment",
	"Onboarding",
	"Exit",
	"Assets",
	"Documents",
	"Expenses"
];
function ApprovalCenter() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("Leave");
	const items = APPROVAL_DATA[activeTab] ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "HR Operations Center",
				subtitle: "Unified approval hub across all modules",
				link: "/dashboard/hr-ops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-1.5 overflow-x-auto pb-1",
				children: APPROVAL_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab),
					className: `shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === tab ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`,
					children: [tab, APPROVAL_DATA[tab].length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`,
						children: APPROVAL_DATA[tab].length
					})]
				}, tab))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 10
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: -10
					},
					transition: { duration: .2 },
					className: "space-y-2",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: item.name
									}), item.urgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "h-4 px-1.5 text-[10px]",
										children: "Urgent"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex items-center gap-2 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.department }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.type }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.detail })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground shrink-0",
								children: item.requestedAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Approve"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Reject"]
								})]
							})
						]
					}, item.id))
				}, activeTab)
			})
		] })
	});
}
function RecruitmentDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Recruitment Dashboard",
			subtitle: "Hiring pipeline and active roles",
			link: "/dashboard/recruitment"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Candidate Pipeline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: PIPELINE_STAGES,
						layout: "vertical",
						margin: {
							left: 0,
							right: 16,
							top: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.1)",
								horizontal: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "stage",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false,
								width: 64
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								radius: [
									0,
									6,
									6,
									0
								],
								children: PIPELINE_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.color }, s.stage))
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Active Jobs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: ACTIVE_JOBS.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: job.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								job.dept,
								" · ",
								job.posted
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-xs",
								children: [job.applicants, " applicants"]
							})
						})]
					}, job.title))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Interviews Today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: INTERVIEWS_TODAY.map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4 text-indigo-500" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: iv.candidate
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										iv.role,
										" · ",
										iv.type
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-xs font-medium text-muted-foreground",
								children: iv.time
							})
						]
					}, iv.candidate))
				})] })]
			})]
		})] })
	});
}
function AttendanceAnalytics() {
	const COLORS = [
		"#6366f1",
		"#f59e0b",
		"#10b981",
		"#06b6d4",
		"#ec4899",
		"#f97316"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Attendance Analytics",
			subtitle: "Weekly trends and department breakdown",
			link: "/dashboard/attendance"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Daily Attendance — This Week"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: WEEKLY_ATTENDANCE,
						margin: {
							top: 6,
							right: 8,
							left: -16,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "attGrad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#10b981",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#10b981",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.1)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "present",
								stroke: "#10b981",
								strokeWidth: 2,
								fill: "url(#attGrad)",
								name: "Present"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "late",
								stroke: "#f59e0b",
								strokeWidth: 1.5,
								fill: "transparent",
								name: "Late"
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Dept Attendance %"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: DEPT_ATTENDANCE,
						margin: {
							top: 6,
							right: 8,
							left: -16,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.1)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: { fontSize: 10 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false,
								domain: [80, 100]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12
								},
								formatter: (v) => [`${v}%`, "Attendance"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								radius: [
									6,
									6,
									0,
									0
								],
								children: DEPT_ATTENDANCE.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[idx % COLORS.length] }, idx))
							})
						]
					})
				})
			})] })]
		})] })
	});
}
function PayrollOverview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Payroll Overview",
			subtitle: "Monthly salary cost & status",
			link: "/dashboard/payroll"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: "Payroll Status"
					}),
					PAYROLL_STATUS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-2 text-sm font-medium ${s.color}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${s.bg.replace("/10", "")}` }), s.label]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-semibold",
							children: s.value
						})]
					}, s.label)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-background/50 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total Cost This Month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl font-bold text-emerald-500",
							children: "₹42.8L"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Monthly Salary Cost (Lakhs ₹)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: MONTHLY_PAYROLL,
							margin: {
								top: 6,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "payGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#10b981",
										stopOpacity: .9
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#10b981",
										stopOpacity: .5
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false,
									domain: [35, 45]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8,
										fontSize: 12
									},
									formatter: (v) => [`₹${v}L`, "Payroll"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "amount",
									radius: [
										6,
										6,
										0,
										0
									],
									fill: "url(#payGrad)"
								})
							]
						})
					})
				})]
			})]
		})] })
	});
}
function AssetOverview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Asset Management",
			subtitle: "Company asset inventory at a glance",
			link: "/dashboard/assets"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
			children: ASSET_STATS.map((a) => {
				const Icon = ICON_MAP[a.icon] ?? Package;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex flex-col items-center gap-2 rounded-xl border border-border ${a.bg} p-4 text-center`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-9 w-9 place-items-center rounded-full bg-background/60 ${a.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `font-display text-2xl font-bold ${a.color}`,
							children: a.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground",
							children: a.label
						})
					]
				}, a.label);
			})
		})] })
	});
}
function OnboardingCenter() {
	const total = ONBOARDING_STAGES.reduce((s, o) => s + o.count, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Onboarding Center",
			subtitle: "New employee journey tracking",
			link: "/dashboard/onboarding-checklist"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: ONBOARDING_STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-background/50 p-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `font-display text-3xl font-bold ${s.textColor}`,
						children: s.count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full rounded-full ${s.color}`,
								style: { width: `${s.count / total * 100}%` }
							})
						})
					})
				]
			}, s.label))
		})] })
	});
}
function ExitManagement() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Exit Management",
			subtitle: "Offboarding pipeline status",
			link: "/dashboard/exit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: EXIT_STAGES.map((s) => {
				const Icon = ICON_MAP[s.icon] ?? Clock;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border border-border ${s.bg} p-4 text-center`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-background/60 ${s.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `font-display text-2xl font-bold ${s.color}`,
							children: s.count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: s.label
						})
					]
				}, s.label);
			})
		})] })
	});
}
function DocumentsCenter() {
	const docs = useofc360().documents ?? [];
	const pending = docs.filter((d) => d.status === "Pending");
	const missing = docs.filter((d) => d.status === "Rejected");
	const expiring = docs.filter((d) => {
		if (!d.expiryDate) return false;
		const diff = (new Date(d.expiryDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24);
		return diff < 60 && diff > 0;
	});
	const recent = [...docs].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Documents Center",
				subtitle: "Document status and verifications",
				link: "/dashboard/documents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4",
				children: [
					{
						label: "Missing/Rejected",
						value: missing.length,
						color: "text-rose-500",
						bg: "bg-rose-500/10"
					},
					{
						label: "Pending Review",
						value: pending.length,
						color: "text-amber-500",
						bg: "bg-amber-500/10"
					},
					{
						label: "Expiring Soon",
						value: expiring.length,
						color: "text-orange-500",
						bg: "bg-orange-500/10"
					},
					{
						label: "Total Documents",
						value: docs.length,
						color: "text-blue-500",
						bg: "bg-blue-500/10"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border border-border ${s.bg} p-4 text-center`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `font-display text-2xl font-bold ${s.color}`,
						children: s.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: s.label
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Recent Uploads"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: recent.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: d.uploadDate
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: d.status === "Verified" ? "default" : d.status === "Pending" ? "secondary" : "destructive",
							className: "shrink-0 text-[10px]",
							children: d.status
						})
					]
				}, d.id))
			})
		] })
	});
}
function AICommandCenter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "AI Command Center",
				subtitle: "Powered by ofc360 AI",
				link: "/ai"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: AI_METRICS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-background/50 p-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `font-display text-xl font-bold ${m.color}`,
							children: m.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: m.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-1 text-[10px] font-medium ${m.color}`,
							children: m.change
						})
					]
				}, m.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
				children: AI_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: f.link,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `group flex flex-col gap-2 rounded-xl bg-gradient-to-br ${f.color} p-3 transition-all hover:shadow-md hover:-translate-y-0.5`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5 text-white/80" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-white",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-white/70 leading-snug",
								children: f.desc
							})
						]
					})
				}, f.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Recent AI Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: AI_RECENT.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-violet-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium",
								children: [r.action, ": "]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: r.detail
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: r.time
						})
					]
				}, i))
			})
		] })
	});
}
function ExecutiveAnalytics() {
	GENDER_DIVERSITY.map((d) => d.fill);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Executive Analytics",
			subtitle: "Key workforce metrics and trends",
			link: "/dashboard/reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Headcount Growth"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: HEADCOUNT_GROWTH,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "hcGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "#6366f1",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "#6366f1",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false,
									domain: [230, 295]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 11
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "headcount",
									stroke: "#6366f1",
									strokeWidth: 2,
									fill: "url(#hcGrad)"
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Attrition Rate (%)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: ATTRITION_RATE,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false,
									domain: [2, 5]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8,
										fontSize: 11
									},
									formatter: (v) => [`${v}%`, "Attrition"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "rate",
									stroke: "#f43f5e",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Gender Diversity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: GENDER_DIVERSITY,
								cx: "50%",
								cy: "50%",
								innerRadius: 40,
								outerRadius: 65,
								dataKey: "value",
								paddingAngle: 3,
								children: GENDER_DIVERSITY.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								fontSize: 11
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconSize: 10,
								wrapperStyle: { fontSize: 11 }
							})
						] })
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Salary Distribution"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: SALARY_DISTRIBUTION,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "band",
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 11
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "employees",
									radius: [
										4,
										4,
										0,
										0
									],
									fill: "#f59e0b"
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: "Department Distribution"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: DEPT_DISTRIBUTION,
								margin: {
									top: 4,
									right: 8,
									left: -16,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(0.5 0.02 264 / 0.1)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "dept",
										tick: { fontSize: 10 },
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 10 },
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8,
										fontSize: 11
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "employees",
										radius: [
											4,
											4,
											0,
											0
										],
										children: DEPT_DISTRIBUTION.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, i))
									})
								]
							})
						})
					})]
				})
			]
		})] })
	});
}
var EVENT_COLOR = {
	meeting: "bg-blue-500/15 text-blue-600 border-blue-200",
	holiday: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
	birthday: "bg-pink-500/15 text-pink-600 border-pink-200",
	interview: "bg-violet-500/15 text-violet-600 border-violet-200",
	payroll: "bg-green-500/15 text-green-600 border-green-200",
	event: "bg-amber-500/15 text-amber-600 border-amber-200"
};
function CompanyCalendar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Company Calendar",
			subtitle: "Upcoming meetings, holidays & key dates",
			link: "/dashboard/attendance/holidays"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
			children: CALENDAR_EVENTS.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-start gap-3 rounded-xl border px-3 py-2.5 ${EVENT_COLOR[ev.type]}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mt-0.5 h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium truncate",
							children: ev.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs opacity-75",
							children: [new Date(ev.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							}), ev.time ? ` · ${ev.time}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "ml-auto shrink-0 capitalize text-[10px] border-current",
						children: ev.type
					})
				]
			}, ev.id))
		})] })
	});
}
function ActivityFeed() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Live Activity Feed",
			subtitle: "Real-time HR system activity",
			link: "/dashboard/timeline"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 max-h-96 overflow-y-auto pr-1",
			children: ACTIVITY_FEED.map((a) => {
				const Icon = ICON_MAP[a.icon] ?? Zap;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: -12
					},
					animate: {
						opacity: 1,
						x: 0
					},
					className: "flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${a.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: a.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: a.user
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: a.time
						})
					]
				}, a.id);
			})
		})] })
	});
}
var NOTIF_COLORS = {
	critical: "border-rose-500/30 bg-rose-500/5",
	warn: "border-amber-500/30 bg-amber-500/5",
	info: "border-blue-500/30 bg-blue-500/5"
};
var NOTIF_ICON_COLORS = {
	critical: "text-rose-500",
	warn: "text-amber-500",
	info: "text-blue-500"
};
function NotificationCenter() {
	const [dismissed, setDismissed] = (0, import_react.useState)([]);
	const visible = NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Smart Notification Center",
			subtitle: "Alerts, compliance & AI suggestions"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [visible.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-start gap-3 rounded-xl border px-3 py-2.5 ${NOTIF_COLORS[n.severity]}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: `mt-0.5 h-4 w-4 shrink-0 ${NOTIF_ICON_COLORS[n.severity]}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "shrink-0 text-[10px] capitalize",
								children: n.category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: n.detail
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: n.time
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDismissed((d) => [...d, n.id]),
							className: "rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})]
					})
				]
			}, n.id)), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-8 w-8 text-emerald-500" }), "All caught up! No active notifications."]
			})]
		})] })
	});
}
function DepartmentPerformance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Department Performance",
			subtitle: "Workforce metrics by department",
			link: "/dashboard/departments"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: DEPT_PERFORMANCE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				...stagger(i),
				className: `rounded-xl border border-border ${d.bgColor} p-4`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-sm font-semibold ${d.color}`,
						children: d.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: `text-[10px] border-current ${d.color}`,
						children: [d.headcount, " employees"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Attendance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [d.attendance, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: d.attendance,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Productivity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [d.productivity, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: d.productivity,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Open Positions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-semibold ${d.color}`,
								children: [d.openPositions, " open"]
							})]
						})
					]
				})]
			}, d.name))
		})] })
	});
}
function ReportsCenter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Reports Center",
			subtitle: "One-click report generation",
			link: "/dashboard/reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7",
			children: REPORT_BUTTONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: r.link,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `group flex flex-col items-center gap-2.5 rounded-xl bg-gradient-to-br ${r.color} p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5 text-white/90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-white",
						children: r.label
					})]
				})
			}, r.label))
		})] })
	});
}
function WorldClock() {
	const [clocks, setClocks] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		function update() {
			setClocks(WORLD_CLOCKS.map((wc) => ({
				city: wc.city,
				flag: wc.flag,
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
					timeZone: wc.tz,
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				})
			})));
		}
		update();
		const t = setInterval(update, 1e3);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, { title: "World Clock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: clocks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg",
				children: c.flag
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: c.city
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-base font-semibold tabular-nums",
				children: c.time
			})] })]
		}, c.city))
	})] });
}
function ScoreWidgets() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: "Company Scores",
		subtitle: "Health, Satisfaction & Productivity"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: WIDGET_SCORES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: w.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold",
					style: { color: w.color },
					children: [
						w.value,
						"/",
						w.max
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 w-full overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full transition-all duration-700",
					style: {
						width: `${w.value / w.max * 100}%`,
						background: w.color
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[10px] text-muted-foreground",
				children: w.description
			})
		] }, w.label))
	})] });
}
function ExecutiveDashboard() {
	const ws = useofc360();
	const firstName = ws.user?.fullName?.split(" ")[0] ?? "there";
	const companyName = ws.company?.name ?? "Your Workspace";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: -16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "rounded-2xl border border-border bg-gradient-to-r from-card/80 via-card/60 to-card/40 p-5 backdrop-blur-xl",
				style: { background: "linear-gradient(135deg, var(--card) 0%, oklch(0.6 0.2 285 / 0.04) 100%)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-lg",
							style: { background: "var(--gradient-brand)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-xl font-semibold tracking-tight",
							children: [
								"Good ",
								(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 17 ? "afternoon" : "evening",
								",",
								" ",
								firstName,
								" 👋"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [companyName, " · Executive Command Center"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClock, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export"]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickActions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCenter, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityFeed, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenter, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentPerformance, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceAnalytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayrollOverview, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingCenter, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExitManagement, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetOverview, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsCenter, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldClock, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreWidgets, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICommandCenter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveAnalytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyCalendar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsCenter, {})]
			})
		]
	});
}
function ExecutiveDashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveDashboard, {});
}
//#endregion
export { ExecutiveDashboardPage };
