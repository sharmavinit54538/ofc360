import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Cr as CalendarX, G as ShieldAlert, O as Timer, S as TriangleAlert, Xn as Clock, or as CircleCheck, p as UserX } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-C20JwVPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.attendance-monitor-BIWmeQpu.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: Clock,
		eyebrow: "AI Attendance Monitor",
		title: "Anomalies detected before they become problems",
		description: "Spot attendance anomalies, late arrivals and absence patterns automatically.",
		lastAnalysis: "5 min ago",
		kpis: [
			{
				label: "Attendance Health",
				value: 94,
				trend: 1.6,
				icon: CircleCheck
			},
			{
				label: "Anomalies",
				value: 12,
				trend: -8.2,
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Late Arrivals",
				value: 18,
				trend: -4,
				icon: Clock,
				invert: true
			},
			{
				label: "OT Hours",
				value: 312,
				trend: 6.3,
				icon: Timer
			}
		],
		charts: [{
			type: "area",
			title: "Attendance Trend",
			xKey: "d",
			series: [{
				key: "present",
				label: "Present %"
			}],
			data: [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat",
				"Sun"
			].map((d, i) => ({
				d,
				present: 92 + i * 5 % 6
			}))
		}, {
			type: "bar",
			title: "Late Arrivals by Day",
			xKey: "d",
			series: [{
				key: "late",
				label: "Late"
			}],
			data: [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri"
			].map((d, i) => ({
				d,
				late: 4 + i * 7 % 8
			}))
		}],
		features: [
			{
				title: "Attendance Anomalies",
				description: "Detect unusual punches, missed swipes and outliers.",
				icon: TriangleAlert,
				metric: "12",
				tone: "warn"
			},
			{
				title: "Late Arrival Detection",
				description: "Spot recurring late arrivals by employee and team.",
				icon: Clock,
				tone: "warn"
			},
			{
				title: "Absence Pattern Analysis",
				description: "Find suspicious Friday/Monday absence patterns.",
				icon: CalendarX,
				tone: "info"
			},
			{
				title: "Overtime Tracking",
				description: "Monitor OT trends and budget impact.",
				icon: Timer,
				metric: "+12%",
				tone: "info"
			},
			{
				title: "Shift Violations",
				description: "Detect missed shifts and policy breaches.",
				icon: ShieldAlert,
				tone: "crit"
			},
			{
				title: "Attendance Health Score",
				description: "Composite score across punctuality and presence.",
				icon: CircleCheck,
				metric: "94",
				progress: 94,
				tone: "ok"
			},
			{
				title: "Absentee Watchlist",
				description: "Employees trending toward chronic absence.",
				icon: UserX,
				metric: "3",
				tone: "warn"
			}
		]
	});
}
//#endregion
export { Page as component };
