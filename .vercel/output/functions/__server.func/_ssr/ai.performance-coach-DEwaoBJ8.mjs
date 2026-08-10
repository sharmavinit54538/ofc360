import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Mr as Award, S as TrendingUp, cn as Gauge, k as Target, rn as GraduationCap, zt as Lightbulb } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-C8yWFy-D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.performance-coach-DEwaoBJ8.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: Gauge,
		eyebrow: "AI Performance Coach",
		title: "Personal coaching at organizational scale",
		description: "Track KPIs, spot skill gaps, recommend promotions and generate coaching nudges.",
		lastAnalysis: "3 hr ago",
		kpis: [
			{
				label: "Avg Performance",
				value: 84,
				trend: 2.4,
				icon: Gauge
			},
			{
				label: "Top Performers",
				value: 42,
				trend: 6,
				icon: Award
			},
			{
				label: "Skill Gaps",
				value: 17,
				trend: -10,
				icon: GraduationCap,
				invert: true
			},
			{
				label: "Promotion Picks",
				value: 9,
				trend: 12.5,
				icon: TrendingUp
			}
		],
		charts: [{
			type: "line",
			title: "Performance Trend",
			xKey: "q",
			series: [{
				key: "team",
				label: "Team avg"
			}, {
				key: "top",
				label: "Top quartile"
			}],
			data: [
				"Q1",
				"Q2",
				"Q3",
				"Q4",
				"Q1",
				"Q2"
			].map((q, i) => ({
				q,
				team: 78 + i,
				top: 88 + i % 3
			}))
		}, {
			type: "bar",
			title: "KPI Attainment by Function",
			xKey: "f",
			series: [{
				key: "att",
				label: "Attainment %"
			}],
			data: [
				{
					f: "Eng",
					att: 92
				},
				{
					f: "Sales",
					att: 81
				},
				{
					f: "Design",
					att: 88
				},
				{
					f: "Ops",
					att: 84
				},
				{
					f: "Support",
					att: 79
				}
			]
		}],
		features: [
			{
				title: "Employee Performance Score",
				description: "Composite quarterly score per employee.",
				icon: Gauge,
				metric: "84",
				progress: 84,
				tone: "ok"
			},
			{
				title: "KPI Analysis",
				description: "Drill into attainment vs. targets by team.",
				icon: Target,
				tone: "info"
			},
			{
				title: "Promotion Recommendations",
				description: "AI surfaces ready-for-promotion candidates.",
				icon: Award,
				metric: "9",
				tone: "ok"
			},
			{
				title: "Skill Gap Analysis",
				description: "Identify org-wide and individual skill gaps.",
				icon: GraduationCap,
				metric: "17",
				tone: "warn"
			},
			{
				title: "Performance Trends",
				description: "Multi-quarter performance trajectory.",
				icon: TrendingUp,
				tone: "info"
			},
			{
				title: "Coaching Suggestions",
				description: "Personalized nudges for managers and ICs.",
				icon: Lightbulb,
				tone: "info"
			}
		]
	});
}
//#endregion
export { Page as component };
