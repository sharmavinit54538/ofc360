import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Cr as Briefcase, G as Send, I as Sparkles, In as Cpu, Mr as Award, Pr as ArrowUpRight, Qn as CircleCheck, S as TrendingUp, V as ShieldAlert, Vr as Activity, dr as ChartLine, en as HeartPulse, g as UserMinus, gn as FileText, jn as Download, k as Target, m as UserPlus, n as Zap, pn as Flame, rn as GraduationCap, s as WandSparkles, u as Users, wr as Brain, wt as MessageSquare, x as TriangleAlert, z as Shield, zr as ArrowDownRight } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DLB8_CFF.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
import { C as Legend, S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.ai-insights-FWOxvmoL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KPI = [
	{
		label: "Workforce Health",
		score: 87,
		trend: 4.2,
		hint: "Strong engagement across all departments.",
		icon: HeartPulse
	},
	{
		label: "Employee Satisfaction",
		score: 82,
		trend: 2.1,
		hint: "Q3 pulse survey trending upward.",
		icon: Sparkles
	},
	{
		label: "Attrition Risk",
		score: 14,
		trend: -3.4,
		hint: "5 employees flagged — action recommended.",
		icon: UserMinus,
		invert: true
	},
	{
		label: "Productivity Score",
		score: 91,
		trend: 5.8,
		hint: "Engineering & Sales leading this quarter.",
		icon: Zap
	},
	{
		label: "Attendance Health",
		score: 94,
		trend: 1.6,
		hint: "Late arrivals down 12% MoM.",
		icon: CircleCheck
	},
	{
		label: "Hiring Efficiency",
		score: 76,
		trend: 6.4,
		hint: "Time-to-hire reduced to 18 days.",
		icon: Briefcase
	}
];
var ATTRITION = [
	{
		name: "Aanya Sharma",
		dept: "Engineering",
		risk: 87,
		reason: "Salary below band median, low recent recognition",
		action: "1:1 with manager + comp review"
	},
	{
		name: "Rohan Mehta",
		dept: "Sales",
		risk: 79,
		reason: "Missed promotion cycle, peer departures",
		action: "Career path conversation"
	},
	{
		name: "Liam Carter",
		dept: "Design",
		risk: 71,
		reason: "Long PTO gap, low survey score",
		action: "Workload audit + retention bonus"
	},
	{
		name: "Priya Nair",
		dept: "Support",
		risk: 64,
		reason: "Shift fatigue, declining CSAT contribution",
		action: "Reassign shift + training"
	}
];
var BURNOUT = [
	{
		name: "Kavya Iyer",
		overtime: 38,
		leave: 2,
		score: 88
	},
	{
		name: "Daniel Kim",
		overtime: 31,
		leave: 4,
		score: 79
	},
	{
		name: "Sara Khan",
		overtime: 27,
		leave: 0,
		score: 74
	},
	{
		name: "Marco Rossi",
		overtime: 22,
		leave: 6,
		score: 61
	}
];
var ATTENDANCE_INSIGHTS = [
	{
		title: "Frequent Late Arrivals",
		count: 7,
		tone: "warn",
		note: "Mostly Monday mornings — Engineering team"
	},
	{
		title: "Absence Patterns",
		count: 4,
		tone: "info",
		note: "Recurring Fridays in Support pod"
	},
	{
		title: "Attendance Risks",
		count: 2,
		tone: "crit",
		note: "Unapproved absences > 3 days"
	}
];
var CANDIDATES = [
	{
		name: "Isabella Cruz",
		role: "Senior PM",
		match: 96,
		readiness: 92
	},
	{
		name: "Ethan Patel",
		role: "Staff Engineer",
		match: 93,
		readiness: 88
	},
	{
		name: "Maya Okafor",
		role: "Design Lead",
		match: 89,
		readiness: 81
	},
	{
		name: "Jonas Berg",
		role: "Data Scientist",
		match: 84,
		readiness: 77
	}
];
var PERFORMERS_TOP = [
	{
		name: "Aarav Gupta",
		dept: "Engineering",
		score: 96,
		growth: "High"
	},
	{
		name: "Lin Wei",
		dept: "Product",
		score: 94,
		growth: "High"
	},
	{
		name: "Noah Bennett",
		dept: "Sales",
		score: 92,
		growth: "Medium"
	}
];
var PERFORMERS_SUPPORT = [{
	name: "Olivia Bauer",
	dept: "Marketing",
	score: 58,
	coach: "Mentorship + skill sprint"
}, {
	name: "Hassan Ali",
	dept: "Support",
	score: 62,
	coach: "Coaching on escalation handling"
}];
var PAYROLL_ALERTS = [
	{
		title: "Unusual reimbursement spike",
		who: "Sales team",
		severity: "Critical",
		delta: "+38% vs avg"
	},
	{
		title: "Duplicate vendor payment detected",
		who: "Finance ops",
		severity: "Critical",
		delta: "₹ 1.2L"
	},
	{
		title: "Overtime exceeds policy threshold",
		who: "Support",
		severity: "Medium",
		delta: "12 employees"
	}
];
var HEADCOUNT_FORECAST = [
	{
		month: "Jul",
		current: 320,
		forecast: 320
	},
	{
		month: "Aug",
		current: 328,
		forecast: 332
	},
	{
		month: "Sep",
		current: 335,
		forecast: 346
	},
	{
		month: "Oct",
		current: 0,
		forecast: 358
	},
	{
		month: "Nov",
		current: 0,
		forecast: 372
	},
	{
		month: "Dec",
		current: 0,
		forecast: 385
	}
];
var HIRING_DEMAND = [
	{
		dept: "Engineering",
		open: 8,
		demand: 14
	},
	{
		dept: "Sales",
		open: 5,
		demand: 9
	},
	{
		dept: "Design",
		open: 2,
		demand: 4
	},
	{
		dept: "Support",
		open: 3,
		demand: 6
	},
	{
		dept: "Finance",
		open: 1,
		demand: 2
	}
];
var PAYROLL_TREND = [
	{
		m: "Mar",
		cost: 78
	},
	{
		m: "Apr",
		cost: 80
	},
	{
		m: "May",
		cost: 82
	},
	{
		m: "Jun",
		cost: 81
	},
	{
		m: "Jul",
		cost: 85
	},
	{
		m: "Aug",
		cost: 91
	}
];
var SATISFACTION_TREND = [
	{
		m: "Mar",
		s: 74
	},
	{
		m: "Apr",
		s: 76
	},
	{
		m: "May",
		s: 79
	},
	{
		m: "Jun",
		s: 78
	},
	{
		m: "Jul",
		s: 81
	},
	{
		m: "Aug",
		s: 82
	}
];
var DOCUMENTS = [
	{
		label: "Offer Letter",
		icon: FileText
	},
	{
		label: "Appointment Letter",
		icon: FileText
	},
	{
		label: "Experience Letter",
		icon: FileText
	},
	{
		label: "Warning Letter",
		icon: ShieldAlert
	},
	{
		label: "Promotion Letter",
		icon: Award
	}
];
var ALERTS = [
	{
		title: "High Attrition Risk",
		note: "5 employees in Engineering flagged",
		severity: "Critical",
		icon: UserMinus
	},
	{
		title: "Payroll Anomaly",
		note: "Reimbursement spike in Sales",
		severity: "Critical",
		icon: ShieldAlert
	},
	{
		title: "Burnout Warning",
		note: "4 employees exceed 30h overtime",
		severity: "Medium",
		icon: Flame
	},
	{
		title: "Hiring Delay",
		note: "Staff Engineer role open 42 days",
		severity: "Medium",
		icon: Briefcase
	},
	{
		title: "Compliance Risk",
		note: "PF filing window closes in 3 days",
		severity: "Low",
		icon: Shield
	}
];
var RECOMMENDATIONS = [
	"Sales department may require 2 additional employees within 45 days.",
	"5 employees show signs of burnout. Recommend workload review and PTO nudge.",
	"Payroll cost expected to increase by 12% next month — review variable pay.",
	"Promote Aarav Gupta — consistently top quartile across 3 cycles.",
	"Refresh JD for Staff Engineer role; current match rate below 60%."
];
var CHAT_EXAMPLES = [
	"Which employees are at risk of leaving?",
	"Show attendance issues this month.",
	"Recommend promotions.",
	"Predict next quarter hiring needs.",
	"Generate HR summary report."
];
function AIInsightsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "AI Insights",
			description: "AI-powered workforce intelligence and automation for your organization.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export Report"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-2 h-4 w-4" }), "Ask AI"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "mr-2 h-4 w-4" }), "Generate Insights"] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Overview",
			title: "AI Workforce KPIs",
			icon: Activity
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
			children: KPI.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
				...k,
				delay: i * .04
			}, k.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Workforce",
						title: "AI Workforce Analytics",
						icon: Brain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Attrition Prediction",
								icon: UserMinus,
								accent: "from-rose-500/20 to-orange-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-2 text-left",
												children: "Employee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left",
												children: "Risk"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left",
												children: "Reason"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ATTRITION.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border/60 align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2.5 pr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: a.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: a.dept
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "pr-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskPill, { score: a.risk })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "text-xs text-muted-foreground",
												children: [a.reason, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px] text-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
														" ",
														a.action
													]
												})]
											})
										]
									}, a.name)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Burnout Detection",
								icon: Flame,
								accent: "from-amber-500/20 to-rose-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: BURNOUT.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-background/40 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: b.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: b.score > 80 ? "destructive" : "secondary",
													children: [b.score, " burnout"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Overtime: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-foreground font-medium",
													children: [b.overtime, "h"]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Leave balance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-foreground font-medium",
													children: [b.leave, " days"]
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
												value: b.score,
												className: "mt-2 h-1.5"
											})
										]
									}, b.name))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Attendance Insights",
								icon: CircleCheck,
								accent: "from-sky-500/20 to-indigo-500/10",
								className: "lg:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
									children: ATTENDANCE_INSIGHTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-background/40 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToneDot, { tone: a.tone }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-medium",
													children: a.title
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 font-display text-2xl font-semibold",
												children: a.count
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs text-muted-foreground",
												children: a.note
											})
										]
									}, a.title))
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Hiring",
						title: "AI Recruitment Assistant",
						icon: Briefcase
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Open Positions",
								value: "19",
								hint: "across 5 departments",
								icon: Briefcase
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Recommended Candidates",
								value: "42",
								hint: "match score > 80%",
								icon: UserPlus
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Pipeline Health",
								value: "Strong",
								hint: "conversion +9% MoM",
								icon: ChartLine
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Top Candidate Matches",
								icon: Target,
								accent: "from-violet-500/20 to-fuchsia-500/10",
								className: "lg:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-2 text-left",
												children: "Candidate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left",
												children: "Role"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left",
												children: "Resume Match"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left",
												children: "Interview Readiness"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "text-left" })
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: CANDIDATES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 font-medium",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "text-muted-foreground",
												children: c.role
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "w-48",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarMeter, { value: c.match })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "w-48",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarMeter, {
													value: c.readiness,
													tone: "violet"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												children: "Shortlist"
											}) })
										]
									}, c.name)) })]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Performance",
						title: "AI Performance Insights",
						icon: Award
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Top Performers",
								icon: TrendingUp,
								accent: "from-emerald-500/20 to-teal-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: PERFORMERS_TOP.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: p.dept
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												children: [p.growth, " growth"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-lg font-semibold",
												children: p.score
											})]
										})]
									}, p.name))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Needs Support",
								icon: GraduationCap,
								accent: "from-amber-500/20 to-orange-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: PERFORMERS_SUPPORT.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-xl border border-border/60 bg-background/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: p.dept
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-lg font-semibold",
												children: p.score
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
												" AI coaching: ",
												p.coach
											]
										})]
									}, p.name))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Skill Gap Analysis",
								icon: Cpu,
								accent: "from-indigo-500/20 to-sky-500/10",
								className: "lg:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-56",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: [
												{
													skill: "AI/ML",
													have: 62,
													need: 85
												},
												{
													skill: "Cloud",
													have: 71,
													need: 88
												},
												{
													skill: "Design Sys",
													have: 55,
													need: 70
												},
												{
													skill: "Data",
													have: 68,
													need: 80
												},
												{
													skill: "Security",
													have: 49,
													need: 75
												}
											],
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "hsl(var(--border))",
													opacity: .4
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "skill",
													stroke: "hsl(var(--muted-foreground))",
													fontSize: 12
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													stroke: "hsl(var(--muted-foreground))",
													fontSize: 12
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltip }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "have",
													name: "Current",
													fill: "hsl(var(--primary))",
													radius: [
														6,
														6,
														0,
														0
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "need",
													name: "Target",
													fill: "hsl(var(--muted-foreground))",
													radius: [
														6,
														6,
														0,
														0
													],
													opacity: .5
												})
											]
										})
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Payroll",
						title: "AI Payroll Insights",
						icon: ShieldAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Payroll Health",
								value: "92",
								hint: "No critical issues",
								icon: HeartPulse
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Savings Opportunities",
								value: "₹ 8.4L",
								hint: "vendor + reimb optimization",
								icon: TrendingUp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Anomalies Detected",
								value: "3",
								hint: "2 critical, 1 medium",
								icon: TriangleAlert
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Payroll Alerts",
								icon: ShieldAlert,
								accent: "from-rose-500/20 to-amber-500/10",
								className: "lg:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: PAYROLL_ALERTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												p.who,
												" · ",
												p.delta
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: p.severity })]
									}, p.title))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Payroll Cost Forecast",
								icon: ChartLine,
								accent: "from-sky-500/20 to-indigo-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-44",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
											data: PAYROLL_TREND,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
													id: "cost",
													x1: "0",
													y1: "0",
													x2: "0",
													y2: "1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "0%",
														stopColor: "hsl(var(--primary))",
														stopOpacity: .5
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "100%",
														stopColor: "hsl(var(--primary))",
														stopOpacity: 0
													})]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "hsl(var(--border))",
													opacity: .4
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "m",
													stroke: "hsl(var(--muted-foreground))",
													fontSize: 12
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													stroke: "hsl(var(--muted-foreground))",
													fontSize: 12
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltip }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
													type: "monotone",
													dataKey: "cost",
													stroke: "hsl(var(--primary))",
													fill: "url(#cost)",
													strokeWidth: 2
												})
											]
										})
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Planning",
						title: "AI Workforce Planning",
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Headcount Forecast",
							icon: ChartLine,
							accent: "from-emerald-500/20 to-sky-500/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-56",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: HEADCOUNT_FORECAST,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "hsl(var(--border))",
												opacity: .4
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												stroke: "hsl(var(--muted-foreground))",
												fontSize: 12
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												stroke: "hsl(var(--muted-foreground))",
												fontSize: 12
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltip }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "current",
												name: "Actual",
												stroke: "hsl(var(--foreground))",
												strokeWidth: 2,
												dot: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "forecast",
												name: "AI Forecast",
												stroke: "hsl(var(--primary))",
												strokeWidth: 2,
												strokeDasharray: "5 4",
												dot: false
											})
										]
									})
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Hiring Demand by Dept",
							icon: BarChart3Like,
							accent: "from-violet-500/20 to-fuchsia-500/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-56",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: HIRING_DEMAND,
										layout: "vertical",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "hsl(var(--border))",
												opacity: .4
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												type: "number",
												stroke: "hsl(var(--muted-foreground))",
												fontSize: 12
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												dataKey: "dept",
												type: "category",
												stroke: "hsl(var(--muted-foreground))",
												fontSize: 12,
												width: 90
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltip }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "open",
												name: "Open",
												fill: "hsl(var(--muted-foreground))",
												opacity: .55,
												radius: [
													0,
													6,
													6,
													0
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "demand",
												name: "AI Demand",
												fill: "hsl(var(--primary))",
												radius: [
													0,
													6,
													6,
													0
												]
											})
										]
									})
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						eyebrow: "Generate",
						title: "AI Document Generator",
						icon: FileText
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
						children: DOCUMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-left backdrop-blur-xl transition-all hover:border-foreground/20 hover:shadow-glow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand-foreground",
									style: { background: "var(--gradient-brand)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(d.icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: d.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Auto-fill from employee data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground",
									children: "AI"
								})
							]
						}, d.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Employee Satisfaction Trend",
						icon: Sparkles,
						accent: "from-sky-500/20 to-violet-500/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: SATISFACTION_TREND,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "sat",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "hsl(var(--primary))",
												stopOpacity: .45
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "hsl(var(--primary))",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "hsl(var(--border))",
											opacity: .4
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "m",
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 12,
											domain: [60, 100]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltip }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "s",
											name: "Score",
											stroke: "hsl(var(--primary))",
											fill: "url(#sat)",
											strokeWidth: 2
										})
									]
								})
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatPanel, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "AI Alerts Center",
						icon: TriangleAlert,
						accent: "from-rose-500/20 to-amber-500/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: ALERTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-medium",
											children: a.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: a.severity })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: a.note
									})]
								})]
							}, a.title))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "AI Recommendations",
						icon: Sparkles,
						accent: "from-violet-500/20 to-sky-500/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: RECOMMENDATIONS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2 rounded-xl border border-border/60 bg-background/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground/90",
									children: r
								})]
							}, i))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: "Full conversation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/payroll/copilot",
							className: "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), " Open AI Copilot"]
						})]
					})
				]
			})]
		})
	] });
}
var chartTooltip = {
	background: "hsl(var(--card))",
	border: "1px solid hsl(var(--border))",
	borderRadius: 10,
	fontSize: 12
};
function HeroBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .4 },
		className: "relative mb-6 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 opacity-60",
			style: { background: "radial-gradient(60% 80% at 10% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%), radial-gradient(50% 80% at 90% 100%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "ofc360 Intelligence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg font-semibold",
					children: "12 new insights generated this week"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						icon: CircleCheck,
						children: "3 actioned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						icon: TriangleAlert,
						children: "2 critical alerts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						icon: TrendingUp,
						children: "+4.2 health score"
					})
				]
			})]
		})]
	});
}
function Pill({ icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })]
	});
}
function SectionTitle({ eyebrow, title, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-7 w-7 place-items-center rounded-lg bg-accent text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-base font-semibold tracking-tight",
			children: title
		})] })]
	});
}
function KpiCard({ label, score, trend, hint, icon: Icon, invert, delay = 0 }) {
	const up = trend >= 0;
	const positive = invert ? !up : up;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			delay
		},
		className: "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40",
				style: { background: "var(--gradient-brand)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-3xl font-semibold tracking-tight",
					children: [score, label === "Attrition Risk" ? "%" : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`,
					children: [
						up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }),
						Math.abs(trend),
						"%"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: Math.min(100, score),
				className: "mt-3 h-1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-start gap-1.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hint })]
			})
		]
	});
}
function Panel({ title, icon: Icon, accent, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl ${className}`,
		children: [
			accent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent} opacity-60` }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center gap-2 border-b border-border/60 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative p-4",
				children
			})
		]
	});
}
function MiniStat({ label, value, hint, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-2xl font-semibold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function RiskPill({ score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${score >= 80 ? "bg-rose-500/15 text-rose-500" : score >= 65 ? "bg-amber-500/15 text-amber-500" : "bg-sky-500/15 text-sky-500"}`,
		children: score
	});
}
function ToneDot({ tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${tone === "crit" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-sky-500"}` });
}
function SeverityBadge({ severity }) {
	if (severity === "Critical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-rose-500/15 text-rose-500 hover:bg-rose-500/20",
		children: "Critical"
	});
	if (severity === "Medium") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-amber-500/15 text-amber-500 hover:bg-amber-500/20",
		children: "Medium"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-sky-500/15 text-sky-500 hover:bg-sky-500/20",
		children: "Low"
	});
}
function BarMeter({ value, tone = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full",
				style: {
					width: `${value}%`,
					background: tone === "violet" ? "linear-gradient(90deg,#8b5cf6,#d946ef)" : "var(--gradient-brand)"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "w-9 text-right text-xs font-medium",
			children: [value, "%"]
		})]
	});
}
function BarChart3Like(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { ...props });
}
function AIChatPanel() {
	const [text, setText] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "ai",
		text: "Hi! I’m ofc360 AI. Ask me about attrition, attendance, hiring or payroll."
	}]);
	function send(value) {
		const t = (value ?? text).trim();
		if (!t) return;
		setText("");
		setMessages((m) => [...m, {
			role: "user",
			text: t
		}]);
		setTimeout(() => {
			setMessages((m) => [...m, {
				role: "ai",
				text: mockAnswer(t)
			}]);
		}, 500);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border/60 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-lg text-brand-foreground",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "ofc360 AI Assistant"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "text-[10px]",
					children: "Beta"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-72 space-y-2 overflow-y-auto p-3",
				children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent/70 text-foreground"}`,
						children: m.text
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border/60 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: CHAT_EXAMPLES.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => send(e),
						className: "rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground",
						children: e
					}, e))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "Ask ofc360 AI anything...",
						className: "h-9"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})]
			})
		]
	});
}
function mockAnswer(q) {
	const s = q.toLowerCase();
	if (s.includes("leav") || s.includes("attrition")) return "4 employees are flagged at high attrition risk — Aanya Sharma (87), Rohan Mehta (79), Liam Carter (71), Priya Nair (64). Suggested action: schedule retention 1:1s this week.";
	if (s.includes("attendance")) return "This month: 7 frequent late arrivals (mostly Mondays, Engineering) and 4 recurring Friday absences in Support. 2 employees on attendance risk.";
	if (s.includes("promo")) return "Top promotion candidates: Aarav Gupta (96), Lin Wei (94), Noah Bennett (92). All in top quartile for 3 consecutive cycles.";
	if (s.includes("hiring") || s.includes("hire")) return "Forecasted hiring demand next quarter: Engineering +6, Sales +4, Support +3. Recommend opening Staff Engineer and AE roles within 2 weeks.";
	if (s.includes("report") || s.includes("summary")) return "HR Summary: Headcount 335 (+4.7% YoY), Satisfaction 82, Attrition risk 14%, Payroll health 92. 2 critical alerts open.";
	return "Here’s what I found based on your workforce data. Try asking about attrition, attendance, hiring forecast, or payroll anomalies.";
}
//#endregion
export { AIInsightsPage as component };
