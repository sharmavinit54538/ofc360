import { cn as useofc360 } from "./ofc360-store-Dm5opMS0.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as Timer, Hn as Clock, Ir as ArrowRight, _r as CalendarDays, gn as FileText, hn as FingerprintPattern, or as Check, q as ScrollText, r as X, w as TreePalm } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-D7_w2cCT.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.attendance.index-eEtWkNP-.js
var import_jsx_runtime = require_jsx_runtime();
function AttendancePage() {
	const ws = useofc360();
	const navigate = useNavigate();
	const today = "Thursday, June 25, 2026";
	function statusFor(id) {
		const x = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 10;
		if (x < 7) return "present";
		if (x < 8) return "late";
		if (x < 9) return "leave";
		return "absent";
	}
	const stats = ws.employees.reduce((acc, e) => {
		acc[statusFor(e.id)]++;
		return acc;
	}, {
		present: 0,
		late: 0,
		absent: 0,
		leave: 0
	});
	const statCards = [
		{
			key: "present",
			label: "Present",
			color: "text-emerald-500",
			icon: Check
		},
		{
			key: "late",
			label: "Late",
			color: "text-amber-500",
			icon: Clock
		},
		{
			key: "leave",
			label: "On leave",
			color: "text-blue-500",
			icon: CalendarDays
		},
		{
			key: "absent",
			label: "Absent",
			color: "text-destructive",
			icon: X
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Attendance & Time Hub",
				description: today
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					{
						title: "Check In / Check Out",
						description: "Clock in, log breaks, selfie & geolocation verification, and daily work logs.",
						icon: FingerprintPattern,
						path: "/dashboard/attendance/checkin",
						gradient: "from-emerald-600/20 to-teal-600/20",
						accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
						iconColor: "text-emerald-500 bg-emerald-500/10",
						buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
					},
					{
						title: "Shifts Management",
						description: "Manage working shifts, timing policies, break schedules, and overtime rules.",
						icon: Clock,
						path: "/dashboard/attendance/shifts",
						gradient: "from-blue-600/20 to-indigo-600/20",
						accentBorder: "border-blue-500/30 hover:border-blue-500/60",
						iconColor: "text-blue-500 bg-blue-500/10",
						buttonColor: "bg-blue-600 hover:bg-blue-700 text-white"
					},
					{
						title: "Rosters & Schedules",
						description: "Assign employee work shifts, weekly rosters, and shift rotations.",
						icon: ScrollText,
						path: "/dashboard/attendance/rosters",
						gradient: "from-purple-600/20 to-pink-600/20",
						accentBorder: "border-purple-500/30 hover:border-purple-500/60",
						iconColor: "text-purple-500 bg-purple-500/10",
						buttonColor: "bg-purple-600 hover:bg-purple-700 text-white"
					},
					{
						title: "Holidays Calendar",
						description: "Configure company holidays, regional leaves, and annual holiday calendar.",
						icon: TreePalm,
						path: "/dashboard/attendance/holidays",
						gradient: "from-emerald-600/20 to-teal-600/20",
						accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
						iconColor: "text-emerald-500 bg-emerald-500/10",
						buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
					},
					{
						title: "Timesheets",
						description: "Track daily hours logged, project time entries, overtime approvals, and submission logs.",
						icon: Timer,
						path: "/dashboard/timesheets",
						gradient: "from-amber-600/20 to-orange-600/20",
						accentBorder: "border-amber-500/30 hover:border-amber-500/60",
						iconColor: "text-amber-500 bg-amber-500/10",
						buttonColor: "bg-amber-600 hover:bg-amber-700 text-white"
					},
					{
						title: "Leaves & PTO",
						description: "Review leave balances, employee leave requests, leave approvals, and time-off policies.",
						icon: FileText,
						path: "/dashboard/leaves",
						gradient: "from-cyan-600/20 to-sky-600/20",
						accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
						iconColor: "text-cyan-500 bg-cyan-500/10",
						buttonColor: "bg-cyan-600 hover:bg-cyan-700 text-white"
					}
				].map((card) => {
					const Icon = card.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigate({ to: card.path }),
						className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
									children: card.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
									children: card.description
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative pt-4 mt-4 border-t border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: `w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`,
									onClick: (e) => {
										e.stopPropagation();
										navigate({ to: card.path });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Go to ", card.title.split(" ")[0]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
								})
							})
						]
					}, card.title);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: statCards.map((c) => {
					const Icon = c.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: c.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${c.color}` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 font-display text-3xl font-semibold tracking-tight",
							children: stats[c.key]
						})]
					}, c.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "Today's Attendance Log"
					})
				}), ws.employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-sm text-muted-foreground",
					children: "No employees to display."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Check-in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ws.employees.map((e) => {
							const s = statusFor(e.id);
							const checkIn = s === "present" ? "09:0" + e.id.length % 9 : s === "late" ? "10:1" + e.id.length % 9 : "—";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium",
										children: e.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: e.department || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: checkIn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: s === "present" ? "secondary" : s === "absent" ? "destructive" : "outline",
											className: "capitalize",
											children: s
										})
									})
								]
							}, e.id);
						}) })]
					})
				})]
			})
		]
	});
}
//#endregion
export { AttendancePage as component };
