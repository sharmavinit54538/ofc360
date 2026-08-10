import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360 } from "./ofc360-store-XkEEWRxo.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, At as LogOut, B as ShieldCheck, Cr as Briefcase, Dn as ExternalLink, E as Timer, Er as Bookmark, G as Send, Gt as Laptop, Hn as Clock, I as Sparkles, Jn as CircleQuestionMark, Mr as Award, N as Star, Or as BookOpen, Ot as MapPin, Qn as CircleCheck, Qt as History, S as TrendingUp, Vr as Activity, Xt as Info, _ as UserCog, _r as CalendarDays, ar as ChevronDown, f as User, fr as ChartColumn, gn as FileText, hn as FingerprintPattern, in as Globe, jn as Download, jt as LogIn, kr as Bell, mn as Flag, n as Zap, o as Wifi, ot as Play, pr as Camera, r as X, rr as ChevronRight, tr as CircleAlert, tt as QrCode, wr as Brain, wt as MessageSquare, xt as Monitor, z as Shield, zn as Coffee } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-DsmRoS2G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.attendance.checkin-DvPe5q0i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API = {
	checkIn: async () => ({
		success: true,
		time: (/* @__PURE__ */ new Date()).toISOString()
	}),
	checkOut: async () => ({
		success: true,
		time: (/* @__PURE__ */ new Date()).toISOString()
	}),
	breakIn: async () => ({
		success: true,
		time: (/* @__PURE__ */ new Date()).toISOString()
	}),
	breakOut: async () => ({
		success: true,
		time: (/* @__PURE__ */ new Date()).toISOString()
	}),
	getLocation: async () => ({
		lat: 28.6139,
		lng: 77.209,
		accuracy: 15,
		inside: true
	})
};
function fmtHM(sec) {
	const h = Math.floor(sec / 3600);
	const m = Math.floor(sec % 3600 / 60);
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function nowTimeStr() {
	return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}
function nowDateStr() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function SectionHeader({ title, subtitle, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center gap-3",
		children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
			style: { background: "var(--gradient-brand)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-white" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-base font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: subtitle
		})] })]
	});
}
function LiveClock() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const t = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(t);
	}, []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-mono text-sm tabular-nums text-foreground",
		children: "--:--:--"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-mono text-sm tabular-nums text-foreground",
		children: time.toLocaleTimeString("en-IN", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true
		})
	});
}
var STATUS_MAP = {
	present: {
		label: "Present",
		cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30"
	},
	absent: {
		label: "Absent",
		cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30"
	},
	late: {
		label: "Late",
		cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30"
	},
	"half-day": {
		label: "Half Day",
		cls: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-1 ring-sky-500/30"
	},
	"on-leave": {
		label: "On Leave",
		cls: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-1 ring-violet-500/30"
	},
	wfh: {
		label: "Work From Home",
		cls: "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/30"
	}
};
function DayStatusChip({ status }) {
	const s = STATUS_MAP[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), s.label]
	});
}
function AttendBtn({ label, icon: Icon, onClick, disabled, variant, loading }) {
	const cls = {
		primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25",
		success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25",
		warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25",
		danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/25"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled: disabled || loading,
		className: `group flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${cls}`,
		children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function DigitalTimer({ seconds, running }) {
	const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
	const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `absolute inset-0 rounded-full blur-3xl opacity-20 transition-opacity ${running ? "opacity-30" : "opacity-10"}`,
			style: { background: "var(--gradient-brand)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative font-mono text-5xl sm:text-7xl font-bold tracking-widest tabular-nums",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: h
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-muted-foreground ${running ? "animate-pulse" : ""}`,
					children: ":"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: m
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-muted-foreground ${running ? "animate-pulse" : ""}`,
					children: ":"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						background: "var(--gradient-brand)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent"
					},
					children: s
				})
			]
		})]
	});
}
function TimelineItem({ event, isLast }) {
	const Icon = event.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-8 w-8 shrink-0 place-items-center rounded-full ${event.color}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}), !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 w-px flex-1 bg-border" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `pb-4 ${isLast ? "" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: event.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: event.time
			})]
		})]
	});
}
function MiniCalendar() {
	const today = /* @__PURE__ */ new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 1).getDay();
	const statuses = {
		1: "present",
		2: "present",
		3: "present",
		4: "present",
		5: "present",
		7: "weekend",
		8: "present",
		9: "late",
		10: "present",
		11: "present",
		12: "present",
		14: "weekend",
		15: "holiday",
		16: "present",
		17: "present",
		18: "leave",
		19: "present",
		21: "weekend",
		22: "halfday",
		23: "present",
		24: "present",
		25: "present",
		26: "present",
		28: "weekend",
		29: "today"
	};
	const COLOR = {
		present: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
		absent: "bg-rose-500/20 text-rose-600",
		late: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
		leave: "bg-violet-500/20 text-violet-600 dark:text-violet-300",
		holiday: "bg-sky-500/20 text-sky-600 dark:text-sky-300",
		weekend: "text-muted-foreground/50",
		halfday: "bg-blue-500/20 text-blue-600 dark:text-blue-300",
		today: "ring-2 ring-violet-500 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold",
		future: "text-muted-foreground/40"
	};
	const days = [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	];
	const cells = Array(firstDay).fill(null);
	for (let i = 1; i <= daysInMonth; i++) cells.push(i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 text-center text-sm font-semibold",
			children: today.toLocaleDateString("en-IN", {
				month: "long",
				year: "numeric"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-1 text-center",
			children: [days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: d
			}, d)), cells.map((day, i) => {
				if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e-${i}`);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[statuses[day] ?? (day > today.getDate() ? "future" : "absent")] ?? ""}`,
					children: day
				}, day);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [
				{
					color: "bg-emerald-500/20 text-emerald-600",
					label: "Present"
				},
				{
					color: "bg-amber-500/20 text-amber-700",
					label: "Late"
				},
				{
					color: "bg-violet-500/20 text-violet-600",
					label: "Leave"
				},
				{
					color: "bg-rose-500/20 text-rose-600",
					label: "Absent"
				},
				{
					color: "bg-sky-500/20 text-sky-600",
					label: "Holiday"
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${item.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-muted-foreground",
					children: item.label
				})]
			}, item.label))
		})
	] });
}
function AIInsights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					{
						icon: TrendingUp,
						label: "Attendance Score",
						value: "94%",
						trend: "+2%",
						positive: true
					},
					{
						icon: Clock,
						label: "Avg. Check-In",
						value: "09:02 AM",
						trend: "On time",
						positive: true
					},
					{
						icon: Timer,
						label: "Avg. Work Hours",
						value: "8h 42m",
						trend: "+12m",
						positive: true
					},
					{
						icon: Activity,
						label: "Punctuality Rank",
						value: "#3 / 48",
						trend: "Top 10%",
						positive: true
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card/40 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground uppercase tracking-wide",
									children: item.label
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold",
								children: item.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `text-[10px] font-medium ${item.positive ? "text-emerald-500" : "text-rose-500"}`,
								children: item.trend
							})
						]
					}, item.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-violet-500/20 bg-violet-500/5 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 shrink-0 text-violet-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-violet-600 dark:text-violet-300 mb-1",
						children: "AI Recommendation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Your attendance is excellent this month! Try to maintain the same pattern next week — you're on track for the perfect attendance bonus."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-1",
							children: "Weekly Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 mt-2",
							children: [
								"P",
								"P",
								"P",
								"L",
								"P"
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex-1 h-8 rounded text-[9px] flex items-center justify-center font-bold ${s === "P" ? "bg-emerald-500/20 text-emerald-600" : "bg-violet-500/20 text-violet-600"}`,
								children: s
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[10px] text-muted-foreground text-center",
							children: "Mon–Fri"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-1",
							children: "Monthly Score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-2 h-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 rounded-full bg-muted w-full",
									style: { width: "100%" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500",
										style: { width: "94%" }
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-center font-display text-xl font-bold",
							children: ["94", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "/100"
							})]
						})
					]
				})]
			})
		]
	});
}
function NotificationItem({ icon: Icon, title, desc, time, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-7 w-7 shrink-0 place-items-center rounded-full ${color}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground truncate",
					children: desc
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] shrink-0 text-muted-foreground",
				children: time
			})
		]
	});
}
var HISTORY_ROWS = [
	{
		date: "Mon, 28 Jun",
		checkIn: "09:01 AM",
		breakDur: "32m",
		checkOut: "06:28 PM",
		hours: "8h 55m",
		ot: "—",
		status: "Present",
		location: "Office"
	},
	{
		date: "Fri, 27 Jun",
		checkIn: "09:14 AM",
		breakDur: "35m",
		checkOut: "06:15 PM",
		hours: "8h 26m",
		ot: "—",
		status: "Present",
		location: "Office"
	},
	{
		date: "Thu, 26 Jun",
		checkIn: "09:45 AM",
		breakDur: "30m",
		checkOut: "06:30 PM",
		hours: "8h 15m",
		ot: "—",
		status: "Late",
		location: "Office"
	},
	{
		date: "Wed, 25 Jun",
		checkIn: "—",
		breakDur: "—",
		checkOut: "—",
		hours: "—",
		ot: "—",
		status: "Leave",
		location: "—"
	},
	{
		date: "Tue, 24 Jun",
		checkIn: "08:58 AM",
		breakDur: "40m",
		checkOut: "06:55 PM",
		hours: "9h 17m",
		ot: "17m",
		status: "Present",
		location: "WFH"
	},
	{
		date: "Mon, 23 Jun",
		checkIn: "09:03 AM",
		breakDur: "30m",
		checkOut: "06:22 PM",
		hours: "8h 49m",
		ot: "—",
		status: "Present",
		location: "Office"
	}
];
function HistoryTable() {
	const STATUS_TONE = {
		Present: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		Late: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
		Leave: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
		Absent: "bg-rose-500/15 text-rose-600 dark:text-rose-300"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border bg-muted/30 text-left text-[11px] uppercase tracking-wide text-muted-foreground",
				children: [
					"Date",
					"Check In",
					"Break",
					"Check Out",
					"Hours",
					"OT",
					"Status",
					"Location"
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2.5 font-medium",
					children: h
				}, h))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: HISTORY_ROWS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/50 transition-colors hover:bg-accent/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 font-medium text-xs",
						children: r.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-mono",
						children: r.checkIn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.breakDur
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-mono",
						children: r.checkOut
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-semibold",
						children: r.hours
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.ot
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[r.status] ?? "bg-muted text-muted-foreground"}`,
							children: r.status
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.location
					})
				]
			}, i)) })]
		})
	});
}
function CheckInPage() {
	const ws = useofc360();
	const user = ws.user;
	const [status, setStatus] = (0, import_react.useState)("not-checked-in");
	const [dayStatus, setDayStatus] = (0, import_react.useState)("present");
	const [loading, setLoading] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [noteEmp, setNoteEmp] = (0, import_react.useState)("");
	const [workSec, setWorkSec] = (0, import_react.useState)(0);
	const [breakSec, setBreakSec] = (0, import_react.useState)(0);
	const [activeSec, setActiveSec] = (0, import_react.useState)(0);
	const checkInTimeRef = (0, import_react.useRef)(null);
	const breakStartRef = (0, import_react.useRef)(null);
	const [timeline, setTimeline] = (0, import_react.useState)([]);
	const [geo, setGeo] = (0, import_react.useState)(null);
	const [geoLoading, setGeoLoading] = (0, import_react.useState)(false);
	const [notesOpen, setNotesOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			if (status === "checked-in") {
				setWorkSec((s) => s + 1);
				setActiveSec((s) => s + 1);
			} else if (status === "on-break") {
				setWorkSec((s) => s + 1);
				setBreakSec((s) => s + 1);
			}
		}, 1e3);
		return () => clearInterval(t);
	}, [status]);
	function showToast(msg, type = "success") {
		setToast({
			msg,
			type
		});
		setTimeout(() => setToast(null), 4e3);
	}
	function pushTimeline(label, icon, color) {
		setTimeline((prev) => [...prev, {
			id: Math.random().toString(36).slice(2),
			time: nowTimeStr(),
			label,
			icon,
			color
		}]);
	}
	async function handleCheckIn() {
		setLoading("checkin");
		try {
			await API.checkIn();
			checkInTimeRef.current = /* @__PURE__ */ new Date();
			setStatus("checked-in");
			setDayStatus("present");
			pushTimeline("Checked In", LogIn, "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300");
			showToast("✅ Checked in successfully!", "success");
		} catch {
			showToast("Failed to check in. Try again.", "error");
		} finally {
			setLoading(null);
		}
	}
	async function handleBreakIn() {
		setLoading("breakin");
		try {
			await API.breakIn();
			breakStartRef.current = /* @__PURE__ */ new Date();
			setStatus("on-break");
			pushTimeline("Break Started", Coffee, "bg-amber-500/20 text-amber-700 dark:text-amber-300");
			showToast("☕ Break started", "info");
		} catch {
			showToast("Failed to start break.", "error");
		} finally {
			setLoading(null);
		}
	}
	async function handleBreakOut() {
		setLoading("breakout");
		try {
			await API.breakOut();
			setStatus("checked-in");
			pushTimeline("Break Ended", Play, "bg-sky-500/20 text-sky-600 dark:text-sky-300");
			showToast("Break ended. Back to work!", "info");
		} catch {
			showToast("Failed to end break.", "error");
		} finally {
			setLoading(null);
		}
	}
	async function handleCheckOut() {
		setLoading("checkout");
		try {
			await API.checkOut();
			setStatus("checked-out");
			pushTimeline("Checked Out", LogOut, "bg-rose-500/20 text-rose-600 dark:text-rose-300");
			showToast("👋 Checked out. Great work today!", "success");
		} catch {
			showToast("Failed to check out.", "error");
		} finally {
			setLoading(null);
		}
	}
	async function fetchLocation() {
		setGeoLoading(true);
		try {
			setGeo(await API.getLocation());
		} finally {
			setGeoLoading(false);
		}
	}
	const overtimeSec = Math.max(0, workSec - 28800);
	const initials = user?.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "JL";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-24",
		children: [
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-xl ${toast.type === "success" ? "bg-emerald-600 text-white" : toast.type === "error" ? "bg-rose-600 text-white" : "bg-sky-600 text-white"}`,
				children: [toast.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : toast.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), toast.msg]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mb-1 flex items-center gap-1 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dashboard" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Attendance" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-medium",
								children: "Check In"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight",
						children: "Check In / Check Out"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: nowDateStr()
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClock, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayStatusChip, { status: dayStatus }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3.5 w-3.5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Morning Shift"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "09:00 – 18:00"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 xl:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "!p-0 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-full",
								style: { background: "var(--gradient-brand)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white shadow-lg",
													style: { background: "var(--gradient-brand)" },
													children: initials
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${status === "checked-in" ? "bg-emerald-500" : status === "on-break" ? "bg-amber-500" : status === "checked-out" ? "bg-muted-foreground" : "bg-muted-foreground"}` })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
															className: "font-display text-lg font-semibold",
															children: user?.fullName ?? "Jordan Lee"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayStatusChip, { status: dayStatus })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
																	" EMP-",
																	ws.employees[0]?.employeeId ?? "2024001"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3" }),
																	" ",
																	ws.employees[0]?.department ?? "Engineering"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }),
																	" ",
																	ws.employees[0]?.designation ?? "Senior Engineer"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), " Bangalore Office"]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Reports to: ", ws.employees[0]?.managerName ?? "Alex Morgan"] })]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-muted-foreground uppercase tracking-wide",
														children: "Working Today"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-2xl font-bold tabular-nums",
														children: fmtHM(workSec)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-muted-foreground",
														children: "Expected: 9h 00m"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Check In",
												icon: LogIn,
												onClick: handleCheckIn,
												disabled: status !== "not-checked-in",
												variant: "success",
												loading: loading === "checkin"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Break In",
												icon: Coffee,
												onClick: handleBreakIn,
												disabled: status !== "checked-in",
												variant: "warning",
												loading: loading === "breakin"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Break Out",
												icon: Play,
												onClick: handleBreakOut,
												disabled: status !== "on-break",
												variant: "primary",
												loading: loading === "breakout"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Check Out",
												icon: LogOut,
												onClick: handleCheckOut,
												disabled: status !== "checked-in" && status !== "on-break",
												variant: "danger",
												loading: loading === "checkout"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${status === "checked-in" ? "bg-emerald-500 animate-pulse" : status === "on-break" ? "bg-amber-500 animate-pulse" : status === "checked-out" ? "bg-muted-foreground" : "bg-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: status === "not-checked-in" ? "Not Checked In" : status === "checked-in" ? "Currently Working" : status === "on-break" ? "On Break" : "Day Complete"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-4 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Break: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: fmtHM(breakSec)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["OT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: overtimeSec > 0 ? "text-violet-500" : "text-foreground",
													children: fmtHM(overtimeSec)
												})] }),
												false
											]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Live Working Timer",
							icon: Timer
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DigitalTimer, {
								seconds: workSec,
								running: status === "checked-in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 w-full sm:grid-cols-4",
								children: [
									{
										label: "Total Work",
										value: fmtHM(workSec),
										color: "text-emerald-500"
									},
									{
										label: "Active Time",
										value: fmtHM(activeSec),
										color: "text-sky-500"
									},
									{
										label: "Break Time",
										value: fmtHM(breakSec),
										color: "text-amber-500"
									},
									{
										label: "Overtime",
										value: fmtHM(overtimeSec),
										color: "text-violet-500"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-3 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-wide text-muted-foreground",
										children: item.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `font-mono text-lg font-bold tabular-nums ${item.color}`,
										children: item.value
									})]
								}, item.label))
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Today's Summary",
							icon: ChartColumn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Working Hours",
									value: fmtHM(workSec),
									hint: "Expected: 9h 00m",
									icon: Clock,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Break Duration",
									value: fmtHM(breakSec),
									hint: "Max allowed: 1h",
									icon: Coffee,
									accent: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Overtime",
									value: fmtHM(overtimeSec),
									hint: overtimeSec > 0 ? "Eligible for OT pay" : "No overtime",
									icon: Zap,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Late By",
									value: "On Time",
									hint: "Grace: 15 mins",
									icon: CircleAlert,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Early Exit",
									value: "—",
									hint: "Not applicable",
									icon: LogOut,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Attendance Score",
									value: "94%",
									hint: "Top performer",
									icon: Award,
									accent: "success"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Today's Timeline",
								icon: History
							}), timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "No events yet. Check in to start."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: timeline.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineItem, {
									event: ev,
									isLast: i === timeline.length - 1
								}, ev.id))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Shift Information",
								icon: Briefcase
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 text-sm",
								children: [
									{
										label: "Shift Name",
										value: "Morning Shift"
									},
									{
										label: "Timing",
										value: "09:00 AM – 06:00 PM"
									},
									{
										label: "Manager",
										value: ws.employees[0]?.managerName ?? "Alex Morgan"
									},
									{
										label: "Working Days",
										value: "Mon – Fri"
									},
									{
										label: "Expected Hours",
										value: "9h 00m"
									},
									{
										label: "Grace Time",
										value: "15 minutes"
									},
									{
										label: "Weekend",
										value: "Sat, Sun"
									},
									{
										label: "Location",
										value: "Bangalore HQ"
									}
								].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-xs",
										children: row.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-xs",
										children: row.value
									})]
								}, row.label))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
									title: "Geo Location",
									icon: MapPin
								}),
								geo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium w-fit ${geo.inside ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "bg-rose-500/15 text-rose-600"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), geo.inside ? "Inside Office Radius" : "Outside Office Radius"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative h-32 rounded-xl overflow-hidden border border-border bg-muted/40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute inset-0 flex flex-col items-center justify-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-6 w-6 text-violet-500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: "OpenStreetMap view"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: `https://www.openstreetmap.org/#map=16/${geo.lat}/${geo.lng}`,
														target: "_blank",
														rel: "noreferrer",
														className: "flex items-center gap-1 text-[10px] text-violet-500 underline",
														children: ["Open in Maps ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-border p-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground",
														children: "Latitude"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono font-medium",
														children: geo.lat.toFixed(4)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-border p-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground",
														children: "Longitude"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono font-medium",
														children: geo.lng.toFixed(4)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-border p-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground",
														children: "Accuracy"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-mono font-medium",
														children: [
															"±",
															geo.accuracy,
															"m"
														]
													})]
												})
											]
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-6 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mb-3",
										children: "Location not fetched yet."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "mt-3 w-full gap-2",
									onClick: fetchLocation,
									disabled: geoLoading,
									children: [geoLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Refresh Location"]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Face Verification",
								icon: Camera
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-32 rounded-xl border border-dashed border-border bg-muted/20 overflow-hidden flex flex-col items-center justify-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-8 w-8 text-muted-foreground/40" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "Camera preview area"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground/60",
												children: "Live feed will appear here"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-border bg-card/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1 font-medium text-emerald-500",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Verified"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-border bg-card/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground",
													children: "Confidence"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: "97.4%"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-border bg-card/40 p-2 col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground",
													children: "Last Verified"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: nowTimeStr()
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "w-full gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "h-3.5 w-3.5" }), " Verify Face"]
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "QR Attendance",
								icon: QrCode
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-28 w-28 rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-14 w-14 text-muted-foreground/30" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full space-y-2 text-xs",
										children: [
											{
												label: "Scan Result",
												value: "AUR-ATT-29JUN2026"
											},
											{
												label: "Device",
												value: "Chrome Desktop"
											},
											{
												label: "Status",
												value: "Verified",
												ok: true
											}
										].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between rounded-lg px-3 py-1.5 hover:bg-muted/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: row.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-medium ${row.ok ? "text-emerald-500" : ""}`,
												children: row.value
											})]
										}, row.label))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "w-full gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), " Scan QR"]
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Device Information",
								icon: Monitor
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 text-xs",
								children: [
									{
										label: "Device Type",
										value: "Desktop",
										icon: Laptop
									},
									{
										label: "Browser",
										value: "Chrome 126",
										icon: Globe
									},
									{
										label: "OS",
										value: "Windows 11",
										icon: Monitor
									},
									{
										label: "IP Address",
										value: "192.168.1.42",
										icon: Wifi
									},
									{
										label: "Network",
										value: "Corporate WiFi",
										icon: Wifi
									},
									{
										label: "VPN",
										value: "Not Detected",
										icon: Shield
									},
									{
										label: "Device Trust",
										value: "Trusted",
										icon: ShieldCheck
									}
								].map((row) => {
									const Icon = row.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), row.label]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: row.value
										})]
									}, row.label);
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Attendance Rules",
							icon: FileText
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs",
							children: [
								{
									label: "Office Timing",
									value: "09:00 AM – 06:00 PM"
								},
								{
									label: "Grace Period",
									value: "15 minutes"
								},
								{
									label: "Maximum Break",
									value: "60 minutes/day"
								},
								{
									label: "Late Policy",
									value: "3 lates = 1 absent"
								},
								{
									label: "Early Exit",
									value: "Requires manager approval"
								},
								{
									label: "Overtime Rules",
									value: "After 9h, eligible for OT"
								},
								{
									label: "WFH Policy",
									value: "Max 4 days/month"
								},
								{
									label: "Geo-fence Radius",
									value: "500m from office"
								}
							].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border border-border/50 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: row.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: row.value
								})]
							}, row.label))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Notes",
								icon: MessageSquare
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "gap-1 text-xs",
								onClick: () => setNotesOpen((o) => !o),
								children: [notesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }), notesOpen ? "Collapse" : "Expand"]
							})]
						}), notesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: "Employee Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1.5 resize-none text-sm",
									rows: 3,
									placeholder: "Add a note for today's attendance...",
									value: noteEmp,
									onChange: (e) => setNoteEmp(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: "Manager Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 min-h-[72px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground italic",
									children: "No notes from manager yet."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: "HR Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 min-h-[72px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground italic",
									children: "No notes from HR yet."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "gap-2",
									onClick: () => showToast("Note saved successfully!", "success"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Save Note"]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "AI Attendance Insights",
							subtitle: "Powered by ofc360 AI",
							icon: Brain
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIInsights, {})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Monthly Calendar",
							icon: CalendarDays
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCalendar, {})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "!p-0 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-semibold text-sm",
										children: "Recent Attendance History"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "gap-1.5 text-xs h-7",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryTable, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Notifications",
							icon: Bell
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
									icon: CircleCheck,
									title: "Attendance Confirmed",
									desc: "Check-in recorded at 09:01 AM",
									time: "9:01",
									color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
									icon: CircleAlert,
									title: "Break Limit",
									desc: "You've been on break for 28 mins",
									time: "1:33",
									color: "bg-amber-500/15 text-amber-700 dark:text-amber-300"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
									icon: CalendarDays,
									title: "Holiday Tomorrow",
									desc: "Wednesday is a public holiday",
									time: "8:00",
									color: "bg-sky-500/15 text-sky-600 dark:text-sky-300"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
									icon: Bell,
									title: "Shift Change",
									desc: "Your shift timings have been updated",
									time: "Fri",
									color: "bg-violet-500/15 text-violet-600 dark:text-violet-300"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Today's Weather",
								icon: Globe
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-5xl",
									children: "🌤️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-2xl font-bold",
										children: "28°C"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "Partly Cloudy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Bangalore, KA"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-between text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Humidity: 68%" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wind: 14 km/h" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UV: Low" })
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Company Notice",
							icon: Flag
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-amber-700 dark:text-amber-300 mb-1",
									children: "🏖️ Eid Holiday"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Office will remain closed on July 7th (Monday). Apply WFH or enjoy the long weekend!"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sky-600 dark:text-sky-300 mb-1",
									children: "📢 Attendance Policy Update"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "New geo-fencing radius will be 300m from July 1st. Please check the updated HR policy."
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Upcoming Holidays",
							icon: CalendarDays
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: [
								{
									date: "Jul 7",
									name: "Eid al-Adha",
									type: "National"
								},
								{
									date: "Aug 15",
									name: "Independence Day",
									type: "National"
								},
								{
									date: "Aug 26",
									name: "Janmashtami",
									type: "Restricted"
								},
								{
									date: "Oct 2",
									name: "Gandhi Jayanti",
									type: "National"
								}
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: h.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: h.type
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-mono font-semibold",
										children: h.date
									})
								})]
							}, h.date))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Celebrations",
							icon: Star
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl",
									children: "🎂"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-semibold",
										children: "Rahul Kumar's Birthday"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Today · Engineering Team"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl",
									children: "🎉"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-semibold",
										children: "Priya Nair — Work Anniversary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Today · 5 years at ofc360!"
									})]
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Quick Links",
							icon: Bookmark
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								{
									label: "Apply Leave",
									icon: CalendarDays,
									href: "/dashboard/leaves/apply"
								},
								{
									label: "Raise Ticket",
									icon: CircleQuestionMark,
									href: "/dashboard/help/raise-ticket"
								},
								{
									label: "HR Contact",
									icon: UserCog,
									href: "/dashboard/communication/team-directory"
								},
								{
									label: "Regularize",
									icon: FileText,
									href: "/dashboard/attendance/regularization"
								},
								{
									label: "Download Report",
									icon: Download,
									href: "#"
								},
								{
									label: "Policy Docs",
									icon: BookOpen,
									href: "/dashboard/documents/policies"
								}
							].map((ql) => {
								const Icon = ql.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: ql.href,
									className: "flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/60 hover:border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), ql.label]
								}, ql.label);
							})
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingActions, {
				onCheckIn: handleCheckIn,
				onCheckOut: handleCheckOut,
				status
			})
		]
	});
}
function FloatingActions({ onCheckIn, onCheckOut, status }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-2",
		children: [open && [
			{
				label: "Check In",
				icon: LogIn,
				onClick: onCheckIn,
				disabled: status !== "not-checked-in",
				color: "bg-emerald-500 hover:bg-emerald-600"
			},
			{
				label: "Check Out",
				icon: LogOut,
				onClick: onCheckOut,
				disabled: status !== "checked-in" && status !== "on-break",
				color: "bg-rose-500 hover:bg-rose-600"
			},
			{
				label: "Regularize",
				icon: FileText,
				onClick: () => {},
				color: "bg-amber-500 hover:bg-amber-600"
			},
			{
				label: "Download",
				icon: Download,
				onClick: () => {},
				color: "bg-sky-500 hover:bg-sky-600"
			},
			{
				label: "Contact HR",
				icon: MessageSquare,
				onClick: () => {},
				color: "bg-violet-500 hover:bg-violet-600"
			}
		].map((a) => {
			const Icon = a.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					a.onClick();
					setOpen(false);
				},
				disabled: a.disabled,
				className: `flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all ${a.color} disabled:opacity-40 disabled:cursor-not-allowed`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
					" ",
					a.label
				]
			}, a.label);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen((o) => !o),
			className: "grid h-12 w-12 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-110 active:scale-95",
			style: { background: "var(--gradient-brand)" },
			"aria-label": "Quick actions",
			children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" })
		})]
	});
}
//#endregion
export { CheckInPage as component };
