import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $n as CircleCheck, S as TrendingUp, _r as CalendarRange, gn as FileText, u as Users, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as AIModulePage } from "./AIModule-C8yWFy-D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.leave-assistant-ZV7K9Y_g.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: FileText,
		eyebrow: "AI Leave Assistant",
		title: "Approve smarter, forecast availability",
		description: "Suggest approvals, flag conflicts and forecast team availability before crunch time.",
		lastAnalysis: "1 hr ago",
		kpis: [
			{
				label: "Pending Requests",
				value: 19,
				trend: -8,
				icon: FileText,
				invert: true
			},
			{
				label: "Approval Suggestions",
				value: 14,
				trend: 4,
				icon: CircleCheck
			},
			{
				label: "Conflicts Detected",
				value: 3,
				trend: -25,
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Team Availability",
				value: "82%",
				trend: 2.3,
				icon: Users
			}
		],
		charts: [{
			type: "area",
			title: "Leave Forecast (next 12 weeks)",
			xKey: "w",
			series: [{
				key: "leaves",
				label: "Forecasted leaves"
			}],
			data: Array.from({ length: 12 }, (_, i) => ({
				w: `W${i + 1}`,
				leaves: 8 + i * 11 % 14
			}))
		}, {
			type: "bar",
			title: "Leave Type Distribution",
			xKey: "t",
			series: [{
				key: "days",
				label: "Days"
			}],
			data: [
				{
					t: "Casual",
					days: 62
				},
				{
					t: "Sick",
					days: 41
				},
				{
					t: "Earned",
					days: 118
				},
				{
					t: "WFH",
					days: 88
				},
				{
					t: "Comp",
					days: 24
				}
			]
		}],
		features: [
			{
				title: "Leave Approval Suggestions",
				description: "AI recommends approve / discuss / decline with rationale.",
				icon: CircleCheck,
				tone: "ok"
			},
			{
				title: "Leave Conflict Detection",
				description: "Flag overlaps in critical roles and small teams.",
				icon: TriangleAlert,
				metric: "3",
				tone: "warn"
			},
			{
				title: "Team Availability Analysis",
				description: "See real-time team capacity by week.",
				icon: Users,
				tone: "info"
			},
			{
				title: "Leave Forecasting",
				description: "Predict leave volume across quarters.",
				icon: TrendingUp,
				tone: "info"
			},
			{
				title: "Leave Trends",
				description: "Historic patterns by team, season and type.",
				icon: CalendarRange,
				tone: "info"
			}
		]
	});
}
//#endregion
export { Page as component };
