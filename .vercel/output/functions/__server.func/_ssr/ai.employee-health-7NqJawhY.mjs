import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as Timer, L as Smile, Vr as Activity, en as HeartPulse, pn as Flame, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-DOaV6JDJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.employee-health-7NqJawhY.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: HeartPulse,
		eyebrow: "AI Employee Health",
		title: "Spot burnout before it spreads",
		description: "Detect burnout, analyze workload, monitor overtime and surface wellbeing risks.",
		lastAnalysis: "Today",
		kpis: [
			{
				label: "Wellbeing Score",
				value: 81,
				trend: 1.4,
				icon: Smile
			},
			{
				label: "Burnout Risk",
				value: 7,
				trend: -22,
				icon: Flame,
				invert: true
			},
			{
				label: "Avg Workload",
				value: "38h",
				trend: -3,
				icon: Activity,
				invert: true
			},
			{
				label: "OT Hours",
				value: 218,
				trend: -6,
				icon: Timer,
				invert: true
			}
		],
		charts: [{
			type: "area",
			title: "Burnout Risk Trend",
			xKey: "w",
			series: [{
				key: "risk",
				label: "Risk index"
			}],
			data: Array.from({ length: 8 }, (_, i) => ({
				w: `W${i + 1}`,
				risk: 22 - i % 4 + i * 3 % 5
			}))
		}, {
			type: "bar",
			title: "Overtime by Team (hrs)",
			xKey: "t",
			series: [{
				key: "ot",
				label: "OT hrs"
			}],
			data: [
				{
					t: "Eng",
					ot: 88
				},
				{
					t: "Support",
					ot: 54
				},
				{
					t: "Ops",
					ot: 42
				},
				{
					t: "Sales",
					ot: 26
				}
			]
		}],
		features: [
			{
				title: "Burnout Detection",
				description: "Composite model of overtime, leave gaps and pulse signals.",
				icon: Flame,
				metric: "7",
				tone: "warn"
			},
			{
				title: "Workload Analysis",
				description: "Per-employee weekly load with anomaly bands.",
				icon: Activity,
				tone: "info"
			},
			{
				title: "Stress Indicators",
				description: "Aggregated signals from surveys and behavior.",
				icon: TriangleAlert,
				tone: "warn"
			},
			{
				title: "Overtime Monitoring",
				description: "Trends, top contributors and budget impact.",
				icon: Timer,
				tone: "info"
			},
			{
				title: "Wellbeing Score",
				description: "Single org score with team breakdowns.",
				icon: Smile,
				metric: "81",
				progress: 81,
				tone: "ok"
			}
		]
	});
}
//#endregion
export { Page as component };
