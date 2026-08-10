import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Banknote, Cr as Briefcase, I as Sparkles, cn as Gauge, dr as ChartLine, fr as ChartColumn, wr as Brain } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.analytics-center-CsQTNHQ9.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: ChartLine,
		eyebrow: "AI Analytics Center",
		title: "The executive intelligence dashboard",
		description: "Executive, predictive, hiring, payroll and performance intelligence — unified.",
		lastAnalysis: "Today",
		kpis: [
			{
				label: "Insights generated",
				value: "4.8k",
				trend: 14,
				icon: Sparkles
			},
			{
				label: "Predictive models",
				value: 18,
				trend: 6,
				icon: Brain
			},
			{
				label: "Dashboards",
				value: 26,
				icon: ChartColumn
			},
			{
				label: "Avg accuracy",
				value: "93%",
				trend: 1.2,
				icon: Gauge
			}
		],
		charts: [{
			type: "area",
			title: "Workforce Intelligence Index",
			xKey: "m",
			series: [{
				key: "idx",
				label: "Index"
			}],
			data: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug"
			].map((m, i) => ({
				m,
				idx: 70 + i * 2 + i * 3 % 5
			}))
		}, {
			type: "bar",
			title: "Module Usage",
			xKey: "mod",
			series: [{
				key: "u",
				label: "Usage"
			}],
			data: [
				{
					mod: "Workforce",
					u: 88
				},
				{
					mod: "Recruiter",
					u: 74
				},
				{
					mod: "Payroll",
					u: 69
				},
				{
					mod: "Performance",
					u: 62
				},
				{
					mod: "Compliance",
					u: 54
				}
			]
		}],
		features: [
			{
				title: "Executive Dashboard",
				description: "Board-ready KPIs across the org.",
				icon: ChartColumn,
				tone: "info"
			},
			{
				title: "Predictive Analytics",
				description: "Forecasts for attrition, hiring and payroll.",
				icon: Brain,
				tone: "info"
			},
			{
				title: "Workforce Intelligence",
				description: "Cross-cuts health, productivity, risk.",
				icon: ChartLine,
				tone: "info"
			},
			{
				title: "Hiring Intelligence",
				description: "Funnel quality, source ROI, time-to-fill.",
				icon: Briefcase,
				tone: "info"
			},
			{
				title: "Payroll Intelligence",
				description: "Cost trends, anomalies and forecasts.",
				icon: Banknote,
				tone: "info"
			},
			{
				title: "Performance Intelligence",
				description: "Calibration, ranking and trajectory.",
				icon: Gauge,
				tone: "info"
			}
		]
	});
}
//#endregion
export { Page as component };
