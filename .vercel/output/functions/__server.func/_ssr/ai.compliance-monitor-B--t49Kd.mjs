import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $n as ClipboardCheck, An as FileExclamationPoint, Q as Scale, S as TriangleAlert, W as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.compliance-monitor-B--t49Kd.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: ShieldCheck,
		eyebrow: "AI Compliance Monitor",
		title: "Stay audit-ready, automatically",
		description: "Monitor labor law compliance, missing documents, risk and audit readiness.",
		lastAnalysis: "4 hr ago",
		kpis: [
			{
				label: "Compliance Score",
				value: 96,
				trend: 1.2,
				icon: ShieldCheck
			},
			{
				label: "Open Risks",
				value: 4,
				trend: -33,
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Missing Docs",
				value: 11,
				trend: -20,
				icon: FileExclamationPoint,
				invert: true
			},
			{
				label: "Audit Readiness",
				value: "92%",
				trend: 3.4,
				icon: ClipboardCheck
			}
		],
		charts: [{
			type: "area",
			title: "Compliance Trend",
			xKey: "m",
			series: [{
				key: "score",
				label: "Score"
			}],
			data: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun"
			].map((m, i) => ({
				m,
				score: 88 + i + i * 3 % 4
			}))
		}, {
			type: "bar",
			title: "Risks by Category",
			xKey: "c",
			series: [{
				key: "n",
				label: "Open risks"
			}],
			data: [
				{
					c: "Labor",
					n: 2
				},
				{
					c: "Tax",
					n: 1
				},
				{
					c: "Safety",
					n: 1
				},
				{
					c: "Data",
					n: 0
				},
				{
					c: "Hiring",
					n: 0
				}
			]
		}],
		features: [
			{
				title: "Compliance Checks",
				description: "Continuous checks across HR and payroll workflows.",
				icon: ShieldCheck,
				metric: "96",
				progress: 96,
				tone: "ok"
			},
			{
				title: "Labor Law Monitoring",
				description: "Stay aligned with applicable jurisdiction rules.",
				icon: Scale,
				tone: "info"
			},
			{
				title: "Missing Documents",
				description: "Detect missing or expired employee docs.",
				icon: FileExclamationPoint,
				metric: "11",
				tone: "warn"
			},
			{
				title: "Risk Detection",
				description: "Predictive risk scores across compliance domains.",
				icon: TriangleAlert,
				metric: "4",
				tone: "warn"
			},
			{
				title: "Audit Readiness",
				description: "One-click prep with full evidence trail.",
				icon: ClipboardCheck,
				metric: "92%",
				progress: 92,
				tone: "ok"
			}
		]
	});
}
//#endregion
export { Page as component };
