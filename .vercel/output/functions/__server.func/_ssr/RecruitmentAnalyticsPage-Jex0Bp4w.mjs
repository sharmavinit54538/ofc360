import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as PageHeader } from "./DashboardShell--OmXvVdk.mjs";
import { n as useRecruitment } from "./useRecruitment-B10GKV9T.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { C as Legend, S as Tooltip, _ as PolarRadiusAxis, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, g as PolarAngleAxis, h as Pie, i as RadarChart, l as XAxis, m as Radar, o as BarChart, p as Bar, s as LineChart, v as PolarGrid, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentAnalyticsPage-Jex0Bp4w.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)",
	"oklch(0.62 0.18 320)"
];
function RecruitmentAnalyticsPage() {
	const { candidates, jobs, offers, interviews } = useRecruitment((s) => s);
	const funnel = STAGES.filter((s) => s !== "rejected").map((s) => ({
		stage: STAGE_LABEL[s],
		count: candidates.filter((c) => c.stage === s).length
	}));
	const bySource = Object.entries(candidates.reduce((a, c) => ({
		...a,
		[c.source]: (a[c.source] || 0) + 1
	}), {})).map(([name, value]) => ({
		name,
		value
	}));
	const byDept = Object.entries(jobs.reduce((a, j) => ({
		...a,
		[j.department]: (a[j.department] || 0) + j.applicants
	}), {})).map(([name, value]) => ({
		name,
		value
	}));
	const acceptanceData = [
		{
			name: "Accepted",
			value: offers.filter((o) => o.status === "accepted").length
		},
		{
			name: "Declined",
			value: offers.filter((o) => o.status === "declined").length
		},
		{
			name: "Pending",
			value: offers.filter((o) => o.status === "sent" || o.status === "pending-approval").length
		}
	];
	const totalC = candidates.length;
	const interviewConv = [
		{
			stage: "Screened",
			val: candidates.filter((c) => c.stage !== "applied").length
		},
		{
			stage: "Interview",
			val: candidates.filter((c) => [
				"interview",
				"technical",
				"hr",
				"offer",
				"hired"
			].includes(c.stage)).length
		},
		{
			stage: "Technical",
			val: candidates.filter((c) => [
				"technical",
				"hr",
				"offer",
				"hired"
			].includes(c.stage)).length
		},
		{
			stage: "Offer",
			val: candidates.filter((c) => ["offer", "hired"].includes(c.stage)).length
		},
		{
			stage: "Hired",
			val: candidates.filter((c) => c.stage === "hired").length
		}
	].map((item) => ({
		stage: item.stage,
		value: totalC > 0 ? Math.round(item.val / totalC * 100) : 0
	}));
	const candsWithScores = candidates.filter((c) => c.atsScore !== null || c.jobMatch !== null);
	const avgAts = candsWithScores.length > 0 ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.atsScore ?? 0), 0) / candsWithScores.length) : 0;
	const avgJobMatch = candsWithScores.length > 0 ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.jobMatch ?? 0), 0) / candsWithScores.length) : 0;
	const avgExp = candidates.length > 0 ? Math.min(100, Math.round(candidates.reduce((acc, c) => acc + (c.yearsExperience || 0), 0) / candidates.length * 10)) : 0;
	const feedbackList = candidates.flatMap((c) => c.feedback || []);
	const avgFeedbackRating = feedbackList.length > 0 ? Math.round(feedbackList.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackList.length * 20) : 0;
	const quality = [
		{
			axis: "Skills",
			v: avgAts || 80
		},
		{
			axis: "Experience",
			v: avgExp || 70
		},
		{
			axis: "Culture Fit",
			v: avgFeedbackRating || 85
		},
		{
			axis: "Comm.",
			v: avgFeedbackRating || 75
		},
		{
			axis: "Leadership",
			v: Math.max(0, avgFeedbackRating - 10) || 65
		},
		{
			axis: "Domain",
			v: avgJobMatch || 80
		}
	];
	const interviewerStats = {};
	interviews.forEach((iv) => {
		const name = iv.interviewer || "Unknown";
		if (!interviewerStats[name]) interviewerStats[name] = {
			interviews: 0,
			hired: 0
		};
		interviewerStats[name].interviews += 1;
		const cand = candidates.find((c) => c.id === iv.candidateId);
		if (cand && cand.stage === "hired") interviewerStats[name].hired += 1;
	});
	const recruiterPerf = Object.entries(interviewerStats).map(([name, data]) => ({
		name,
		interviews: data.interviews,
		hired: data.hired
	}));
	if (recruiterPerf.length === 0) recruiterPerf.push({
		name: "Marcus Lee",
		hired: 0,
		interviews: 0
	}, {
		name: "Sara Iqbal",
		hired: 0,
		interviews: 0
	}, {
		name: "Daniel Okafor",
		hired: 0,
		interviews: 0
	});
	const monthlyData = {};
	const monthsOrder = [
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
	candidates.forEach((c) => {
		const date = new Date(c.appliedAt);
		const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
		if (!monthlyData[month]) monthlyData[month] = {
			hires: 0,
			applications: 0
		};
		monthlyData[month].applications += 1;
		if (c.stage === "hired") monthlyData[month].hires += 1;
	});
	const currentMonthIdx = (/* @__PURE__ */ new Date()).getMonth();
	const monthly = Array.from({ length: 6 }, (_, i) => {
		const m = monthsOrder[(currentMonthIdx - 5 + i + 12) % 12];
		const data = monthlyData[m] || {
			hires: 0,
			applications: 0
		};
		return {
			m,
			hires: data.hires,
			cost: data.applications * 1500
		};
	});
	const deptTimeToHire = {};
	candidates.filter((c) => c.stage === "hired").forEach((c) => {
		const dept = jobs.find((j) => j.id === c.jobId)?.department || "General";
		const appTime = new Date(c.appliedAt).getTime();
		const hiredTimeline = c.timeline.find((t) => t.title.toLowerCase().includes("hired") || t.title.toLowerCase().includes("moved to hired"));
		const hiredTime = hiredTimeline ? new Date(hiredTimeline.at).getTime() : (/* @__PURE__ */ new Date()).getTime();
		const diffDays = Math.max(1, Math.round((hiredTime - appTime) / (1e3 * 60 * 60 * 24)));
		if (!deptTimeToHire[dept]) deptTimeToHire[dept] = {
			totalDays: 0,
			count: 0
		};
		deptTimeToHire[dept].totalDays += diffDays;
		deptTimeToHire[dept].count += 1;
	});
	const timeToHire = Object.entries(deptTimeToHire).map(([dept, data]) => ({
		dept,
		days: Math.round(data.totalDays / data.count)
	}));
	if (timeToHire.length === 0) timeToHire.push({
		dept: "Eng",
		days: 0
	}, {
		dept: "Design",
		days: 0
	}, {
		dept: "Marketing",
		days: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Recruitment Analytics",
		description: "Hiring health, performance, and forecasts."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Hiring Funnel",
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: funnel,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "stage",
								className: "text-[10px] text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								radius: [
									8,
									8,
									0,
									0
								],
								children: funnel.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Source of Hire",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: bySource,
							dataKey: "value",
							nameKey: "name",
							cx: "50%",
							cy: "50%",
							outerRadius: 90,
							children: bySource.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--card)",
							border: "1px solid var(--border)",
							borderRadius: 8
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Department Hiring",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: byDept,
						layout: "vertical",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								horizontal: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								dataKey: "name",
								type: "category",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor",
								width: 80
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								fill: COLORS[0],
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Offer Acceptance",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
							data: acceptanceData,
							dataKey: "value",
							nameKey: "name",
							cx: "50%",
							cy: "50%",
							innerRadius: 50,
							outerRadius: 90,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.7 0.18 150)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.65 0.2 25)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.75 0.18 60)" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--card)",
							border: "1px solid var(--border)",
							borderRadius: 8
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Interview Conversion",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: interviewConv,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "stage",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "value",
								stroke: COLORS[0],
								strokeWidth: 2,
								dot: {
									fill: COLORS[0],
									r: 4
								}
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Candidate Quality",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
						data: quality,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "oklch(0.5 0.02 264 / 0.25)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
								dataKey: "axis",
								className: "text-xs text-muted-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
								stroke: "currentColor",
								tick: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
								dataKey: "v",
								stroke: COLORS[0],
								fill: COLORS[0],
								fillOpacity: .35
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Time to Hire (days)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: timeToHire,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "dept",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "days",
								fill: COLORS[3],
								radius: [
									8,
									8,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Recruiter Performance",
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: recruiterPerf,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "interviews",
								fill: COLORS[1],
								radius: [
									6,
									6,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "hired",
								fill: COLORS[2],
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Monthly Hiring & Cost",
				className: "lg:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: monthly,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "m",
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false,
								stroke: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "hires",
								stroke: COLORS[0],
								strokeWidth: 2,
								dot: {
									fill: COLORS[0],
									r: 4
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "cost",
								stroke: COLORS[4],
								strokeWidth: 2,
								dot: {
									fill: COLORS[4],
									r: 4
								}
							})
						]
					})
				})
			})
		]
	})] });
}
function Card({ title, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 font-display text-sm font-semibold",
			children: title
		}), children]
	});
}
//#endregion
export { RecruitmentAnalyticsPage };
