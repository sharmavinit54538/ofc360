import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { ft as fetchRecruitmentData } from "./ofc360-store-Dm5opMS0.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, Cr as Briefcase, Hn as Clock, I as Sparkles, Kn as CircleX, Qn as CircleCheck, S as TrendingUp, U as Settings, a as Workflow, bn as FilePenLine, gn as FileText, m as UserPlus, u as Users, un as Folder, v as UserCheck, vr as CalendarClock, wn as FileCheckCorner, wt as MessageSquare } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { s as fmtDate, t as CandidateAvatar } from "./Bits-txylOS1b.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Loader } from "./Loader-Ba6sg6fy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentDashboardPage-B3f2evwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHART_COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)",
	"oklch(0.62 0.18 320)"
];
var SHORTLISTED_STAGES = [
	"assessment",
	"interview",
	"technical",
	"hr"
];
var MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var CHART_TOOLTIP_STYLE = {
	background: "var(--card)",
	border: "1px solid var(--border)",
	borderRadius: 8
};
function ChartCard({ title, subtitle, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex items-end justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold",
				children: title
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			}) : null] })
		}), children]
	});
}
function RecruitmentDashboardCharts({ funnel, byDept }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Hiring Funnel",
			subtitle: "Candidates per stage",
			className: "lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: 280,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: funnel,
					margin: {
						top: 10,
						right: 10,
						left: -10,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "oklch(0.5 0.02 264 / 0.15)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "stage",
							stroke: "currentColor",
							className: "text-[10px] text-muted-foreground",
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "currentColor",
							className: "text-xs text-muted-foreground",
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "count",
							radius: [
								8,
								8,
								0,
								0
							],
							children: funnel.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, index))
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Department Hiring",
			subtitle: "Applicants by department",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: 280,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: byDept,
						dataKey: "value",
						nameKey: "name",
						cx: "50%",
						cy: "50%",
						innerRadius: 50,
						outerRadius: 90,
						paddingAngle: 3,
						children: byDept.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
				] })
			})
		})]
	});
}
function RecruitmentHiringTrendChart({ monthlyHires, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
		title: "Hiring Trend",
		subtitle: "Hires vs offers, last 6 months",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: 260,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: monthlyHires,
				margin: {
					top: 10,
					right: 10,
					left: -10,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "gh",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: CHART_COLORS[0],
							stopOpacity: .5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: CHART_COLORS[0],
							stopOpacity: 0
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "go",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: CHART_COLORS[2],
							stopOpacity: .5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: CHART_COLORS[2],
							stopOpacity: 0
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "oklch(0.5 0.02 264 / 0.15)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "m",
						stroke: "currentColor",
						className: "text-xs text-muted-foreground",
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						stroke: "currentColor",
						className: "text-xs text-muted-foreground",
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "offers",
						stroke: CHART_COLORS[2],
						strokeWidth: 2,
						fill: "url(#go)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "hires",
						stroke: CHART_COLORS[0],
						strokeWidth: 2,
						fill: "url(#gh)"
					})
				]
			})
		})
	});
}
function buildKpiConfigs(stats) {
	return [
		{
			label: "Total Jobs",
			value: stats.totalJobs,
			icon: Briefcase,
			accent: "from-violet-500/20 to-fuchsia-500/10"
		},
		{
			label: "Active Jobs",
			value: stats.activeJobs,
			icon: TrendingUp,
			accent: "from-emerald-500/20 to-teal-500/10"
		},
		{
			label: "Draft Jobs",
			value: stats.draftJobs,
			icon: FileCheckCorner,
			accent: "from-sky-500/20 to-cyan-500/10"
		},
		{
			label: "Closed Jobs",
			value: stats.closedJobs,
			icon: CircleX,
			accent: "from-rose-500/15 to-red-500/10"
		},
		{
			label: "Candidates",
			value: stats.totalCandidates,
			icon: Users,
			accent: "from-indigo-500/20 to-violet-500/10"
		},
		{
			label: "Shortlisted",
			value: stats.shortlisted,
			icon: UserCheck,
			accent: "from-amber-500/20 to-orange-500/10"
		},
		{
			label: "Interviews",
			value: stats.interviewScheduled,
			icon: CalendarClock,
			accent: "from-cyan-500/20 to-sky-500/10"
		},
		{
			label: "Selected",
			value: stats.selected,
			icon: CircleCheck,
			accent: "from-emerald-500/20 to-green-500/10"
		},
		{
			label: "Rejected",
			value: stats.rejected,
			icon: CircleX,
			accent: "from-rose-500/15 to-pink-500/10"
		},
		{
			label: "Offers Sent",
			value: stats.offersSent,
			icon: FileCheckCorner,
			accent: "from-fuchsia-500/20 to-purple-500/10"
		},
		{
			label: "Offers Accepted",
			value: stats.offersAccepted,
			icon: UserPlus,
			accent: "from-emerald-500/20 to-teal-500/10"
		},
		{
			label: "Time to Hire",
			value: stats.timeToHireDays > 0 ? `${stats.timeToHireDays}d` : "—",
			icon: Clock,
			accent: "from-amber-500/20 to-yellow-500/10"
		}
	];
}
function RecruitmentDashboardKpis({ stats }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4",
		children: buildKpiConfigs(stats).map((kpi, index) => {
			const Icon = kpi.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { animation: `fade-in 400ms ease-out ${index * 30}ms both` },
				className: `relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${kpi.accent} p-4 backdrop-blur-xl shadow-sm`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
						children: kpi.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold tracking-tight",
						children: kpi.value
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-background/60 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					})]
				})
			}, kpi.label);
		})
	});
}
function RecruitmentRecentActivity({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold",
				children: "Recent Activity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "Latest pipeline events"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
					name: item.who,
					size: 28
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.who
							}),
							" — ",
							item.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-[11px] text-muted-foreground",
						children: [
							item.jobTitle,
							" · ",
							fmtDate(item.at)
						]
					})]
				})]
			}, item.id))
		})]
	});
}
var RECRUITMENT_MODULES_LIST = [
	{
		id: "requisitions",
		title: "Requisitions",
		description: "Manage open headcount requests, budget allocations, and review pending approval workflows.",
		icon: FilePenLine,
		to: "/dashboard/recruitment/requisitions",
		color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "jobs",
		title: "All Jobs",
		description: "Post, edit, and publish active career listings and track active application pipelines.",
		icon: Briefcase,
		to: "/dashboard/recruitment/jobs",
		color: "from-blue-500/20 to-sky-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "candidates",
		title: "Candidates",
		description: "Track candidate profiles, stage progressions, screening scores, and BGV checks.",
		icon: Users,
		to: "/dashboard/recruitment/candidates",
		color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "interviews",
		title: "Interviews",
		description: "Coordinate scheduler calendars, assign panel members, and manage candidate scorecards.",
		icon: CalendarClock,
		to: "/dashboard/recruitment/interviews",
		color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
	},
	{
		id: "copilot",
		title: "AI Recruiter Copilot",
		description: "Screen resume batches, evaluate candidate scores, and generate inclusive job descriptions with AI.",
		icon: Sparkles,
		to: "/dashboard/recruitment/copilot",
		color: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30"
	},
	{
		id: "offers",
		title: "Offers & Contracts",
		description: "Generate customized offer letters, manage salary models, and track accepts.",
		icon: FileText,
		to: "/dashboard/recruitment/offers",
		color: "from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
	},
	{
		id: "onboarding",
		title: "Onboarding",
		description: "Prepare welcome checklists, verify candidate documentation, and assign onboarding buddies.",
		icon: UserPlus,
		to: "/dashboard/recruitment/onboarding",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "crm",
		title: "Candidate CRM",
		description: "Nurture relationships with email templates, pipeline triggers, and updates.",
		icon: MessageSquare,
		to: "/dashboard/recruitment/crm",
		color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30"
	},
	{
		id: "talent-pool",
		title: "Talent Pool",
		description: "Access secondary candidate profiles, skills inventories, and past applications repository.",
		icon: Folder,
		to: "/dashboard/recruitment/talent-pool",
		color: "from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
	},
	{
		id: "analytics",
		title: "Recruitment Analytics",
		description: "Monitor hiring pipeline conversion statistics, recruitment cost sources, and KPIs.",
		icon: TrendingUp,
		to: "/dashboard/recruitment/analytics",
		color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "automation",
		title: "Automation & Workflows",
		description: "Design trigger rules to auto-generate letters, update stages, and notify managers.",
		icon: Workflow,
		to: "/dashboard/recruitment/automation",
		color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30"
	},
	{
		id: "settings",
		title: "Recruitment Settings",
		description: "Configure candidate pipeline columns, career pages, and feedback templates.",
		icon: Settings,
		to: "/dashboard/recruitment/templates",
		color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
	}
];
function isHiredTimelineEvent(title) {
	const normalized = title.toLowerCase();
	return normalized.includes("hired") || normalized.includes("moved to hired");
}
function findHiredTimestamp(timeline) {
	const hiredEvent = timeline.find((t) => isHiredTimelineEvent(t.title));
	return hiredEvent ? new Date(hiredEvent.at).getTime() : null;
}
function computeAverageTimeToHire(candidates) {
	const hiredCandidates = candidates.filter((c) => c.stage === "hired");
	if (hiredCandidates.length === 0) return 0;
	const totalDays = hiredCandidates.reduce((acc, candidate) => {
		const appliedAt = new Date(candidate.appliedAt).getTime();
		const hiredAt = findHiredTimestamp(candidate.timeline) ?? Date.now();
		return acc + Math.max(1, Math.round((hiredAt - appliedAt) / (1e3 * 60 * 60 * 24)));
	}, 0);
	return Math.round(totalDays / hiredCandidates.length);
}
function computeDashboardStats(jobs, candidates, interviews, offers) {
	return {
		totalJobs: jobs.length,
		activeJobs: jobs.filter((j) => j.status === "active").length,
		draftJobs: jobs.filter((j) => j.status === "draft").length,
		closedJobs: jobs.filter((j) => j.status === "closed").length,
		totalCandidates: candidates.length,
		shortlisted: candidates.filter((c) => SHORTLISTED_STAGES.includes(c.stage)).length,
		interviewScheduled: interviews.filter((i) => i.status === "scheduled").length,
		selected: candidates.filter((c) => c.stage === "hired").length,
		rejected: candidates.filter((c) => c.stage === "rejected").length,
		offersSent: offers.length,
		offersAccepted: offers.filter((o) => o.status === "accepted").length,
		timeToHireDays: computeAverageTimeToHire(candidates)
	};
}
function buildFunnelData(candidates) {
	return STAGES.filter((stage) => stage !== "rejected").map((stage) => ({
		stage: STAGE_LABEL[stage],
		count: candidates.filter((c) => c.stage === stage).length
	}));
}
function buildDepartmentHiringData(jobs) {
	const totals = jobs.reduce((acc, job) => {
		acc[job.department] = (acc[job.department] || 0) + job.applicants;
		return acc;
	}, {});
	return Object.entries(totals).map(([name, value]) => ({
		name,
		value
	}));
}
function buildHiringTrendData(candidates, offers, monthsBack = 6) {
	const data = [];
	for (let i = monthsBack - 1; i >= 0; i--) {
		const date = /* @__PURE__ */ new Date();
		date.setMonth(date.getMonth() - i);
		const monthIndex = date.getMonth();
		const year = date.getFullYear();
		const monthLabel = MONTH_LABELS[monthIndex];
		const hires = candidates.filter((candidate) => {
			if (candidate.stage !== "hired") return false;
			const applied = new Date(candidate.appliedAt);
			return applied.getMonth() === monthIndex && applied.getFullYear() === year;
		}).length;
		const offerCount = offers.filter((offer) => {
			const offerDate = new Date(offer.sentAt || offer.joiningDate);
			return offerDate.getMonth() === monthIndex && offerDate.getFullYear() === year;
		}).length;
		data.push({
			m: monthLabel,
			hires,
			offers: offerCount
		});
	}
	return data;
}
function buildRecentActivity(candidates, limit = 8) {
	return candidates.flatMap((candidate) => candidate.timeline.map((event) => ({
		...event,
		who: candidate.name,
		jobTitle: candidate.appliedPosition
	}))).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, limit);
}
var EMPTY_STATS = {
	totalJobs: 0,
	activeJobs: 0,
	draftJobs: 0,
	closedJobs: 0,
	totalCandidates: 0,
	shortlisted: 0,
	interviewScheduled: 0,
	selected: 0,
	rejected: 0,
	offersSent: 0,
	offersAccepted: 0,
	timeToHireDays: 0
};
function useRecruitmentDashboard() {
	const dispatch = useAppDispatch();
	const { jobs, candidates, interviews, offers, loading, error } = useAppSelector((state) => state.recruitment);
	(0, import_react.useEffect)(() => {
		dispatch(fetchRecruitmentData());
	}, [dispatch]);
	const refetch = (0, import_react.useCallback)(() => {
		dispatch(fetchRecruitmentData());
	}, [dispatch]);
	return {
		...(0, import_react.useMemo)(() => {
			if (loading && jobs.length === 0 && candidates.length === 0) return {
				stats: EMPTY_STATS,
				funnel: [],
				byDept: [],
				monthlyHires: [],
				recent: []
			};
			return {
				stats: computeDashboardStats(jobs, candidates, interviews, offers),
				funnel: buildFunnelData(candidates),
				byDept: buildDepartmentHiringData(jobs),
				monthlyHires: buildHiringTrendData(candidates, offers),
				recent: buildRecentActivity(candidates)
			};
		}, [
			jobs,
			candidates,
			interviews,
			offers,
			loading
		]),
		isLoading: loading,
		isError: !!error,
		error,
		refetch
	};
}
function RecruitmentDashboardPage() {
	const [viewMode, setViewMode] = (0, import_react.useState)("modules");
	const { stats, funnel, byDept, monthlyHires, recent, isLoading, isError, refetch } = useRecruitmentDashboard();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
			variant: "panel",
			label: "Loading recruitment dashboard...",
			skeletonRows: 6
		})]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Could not load dashboard data from the API. Please try again."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-4",
				onClick: () => refetch(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Retry"]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode,
			onRefresh: refetch
		}), viewMode === "modules" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: RECRUITMENT_MODULES_LIST.map((module) => {
					const Icon = module.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: module.to,
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400",
									children: module.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-normal",
									children: module.description
								})]
							})]
						})
					}, module.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 animate-in fade-in duration-300 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboardKpis, { stats }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboardCharts, {
					funnel,
					byDept
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHiringTrendChart, {
						monthlyHires,
						className: "lg:col-span-2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentRecentActivity, { items: recent })]
				})
			]
		})]
	});
}
function RecruitmentHubHeader({ viewMode, onViewModeChange, onRefresh }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold tracking-tight text-foreground",
				children: "Recruitment Hub"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground text-left",
			children: "Manage your hiring pipelines, coordinate schedules, raise requisitions, and review metrics."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: viewMode === "modules" ? "secondary" : "ghost",
					size: "sm",
					onClick: () => onViewModeChange("modules"),
					className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
					children: "Recruitment Hub"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: viewMode === "analytics" ? "secondary" : "ghost",
					size: "sm",
					onClick: () => onViewModeChange("analytics"),
					className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
					children: "Hiring Metrics"
				})]
			}), onRefresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onRefresh,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Refresh"]
			}) : null]
		})]
	});
}
//#endregion
export { RecruitmentDashboardPage };
