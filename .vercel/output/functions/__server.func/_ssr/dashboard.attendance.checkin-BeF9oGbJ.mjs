import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { nn as useofc360, w as apiInstance } from "./ofc360-store-BR2yEBkC.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as RefreshCw, $n as CircleCheck, Ar as Bell, At as LogOut, B as ShieldCheck, Dn as ExternalLink, Dr as Bookmark, E as Timer, G as Send, Gt as Laptop, Hn as CloudSun, Hr as Activity, I as Sparkles, N as Star, Nr as Award, Ot as MapPin, Qt as History, S as TrendingUp, Tr as Brain, Un as Clock, Xt as Info, Yn as CircleQuestionMark, _ as UserCog, f as User, gn as FileText, hn as FingerprintPattern, in as Globe, ir as ChevronRight, jn as Download, jt as LogIn, kr as BookOpen, mn as Flag, mr as Camera, n as Zap, nr as CircleAlert, o as Wifi, or as ChevronDown, ot as Play, pr as ChartColumn, r as X, tt as QrCode, vr as CalendarDays, wr as Briefcase, wt as MessageSquare, xt as Monitor, z as Shield, zn as Coffee } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-BY5JB4sY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.attendance.checkin-BeF9oGbJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API = {
	checkIn: async (payload) => {
		return (await apiInstance.post("/attendance/check-in", payload || {})).data;
	},
	checkOut: async (payload) => {
		return (await apiInstance.post("/attendance/check-out", payload || {})).data;
	},
	breakIn: async () => {
		return (await apiInstance.post("/attendance/break-in")).data;
	},
	breakOut: async () => {
		return (await apiInstance.post("/attendance/break-out")).data;
	},
	getLocation: async () => {
		return new Promise((resolve, reject) => {
			if (typeof window === "undefined" || !navigator.geolocation) {
				reject(/* @__PURE__ */ new Error("Geolocation is not supported by your browser"));
				return;
			}
			navigator.geolocation.getCurrentPosition(async (pos) => {
				const { latitude: lat, longitude: lng, accuracy } = pos.coords;
				try {
					const res = await apiInstance.get("/attendance/location", { params: {
						lat,
						lng
					} });
					resolve({
						lat,
						lng,
						accuracy,
						inside: res.data?.data?.inside ?? res.data?.inside ?? true
					});
				} catch {
					resolve({
						lat,
						lng,
						accuracy,
						inside: true
					});
				}
			}, (err) => reject(err), {
				enableHighAccuracy: true,
				timeout: 1e4
			});
		});
	}
};
function getBrowserInfo() {
	if (typeof window === "undefined" || !navigator?.userAgent) return "Browser Desktop";
	const ua = navigator.userAgent;
	if (ua.includes("Firefox/")) return `Firefox ${ua.split("Firefox/")[1]?.split(" ")[0] || ""}`;
	if (ua.includes("Edg/")) return `Edge ${ua.split("Edg/")[1]?.split(" ")[0] || ""}`;
	if (ua.includes("Chrome/")) return `Chrome ${ua.split("Chrome/")[1]?.split(" ")[0] || ""}`;
	if (ua.includes("Safari/")) return `Safari ${ua.split("Version/")[1]?.split(" ")[0] || ""}`;
	return "Browser Desktop";
}
function getOSInfo() {
	if (typeof window === "undefined" || !navigator?.userAgent) return "OS Desktop";
	const ua = navigator.userAgent;
	if (ua.includes("Win")) return "Windows";
	if (ua.includes("Mac")) return "macOS";
	if (ua.includes("Linux")) return "Linux";
	if (ua.includes("Android")) return "Android";
	if (ua.includes("like Mac")) return "iOS";
	return "OS Desktop";
}
function getDeviceType() {
	if (typeof window === "undefined" || !navigator?.userAgent) return "Desktop";
	const ua = navigator.userAgent;
	if (/Mobi|Android/i.test(ua)) return "Mobile";
	if (/Tablet|iPad/i.test(ua)) return "Tablet";
	return "Desktop";
}
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
	const s = STATUS_MAP[status] ?? STATUS_MAP.present;
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
	const Icon = event.icon || Clock;
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
	const [statuses, setStatuses] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchCalendar() {
			setLoading(true);
			try {
				const res = await apiInstance.get("/attendance/calendar", { params: {
					month: month + 1,
					year
				} });
				const data = res.data?.data || res.data;
				if (active && data && typeof data === "object") setStatuses(data);
			} catch {} finally {
				if (active) setLoading(false);
			}
		}
		fetchCalendar();
		return () => {
			active = false;
		};
	}, [month, year]);
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between text-sm font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: today.toLocaleDateString("en-IN", {
				month: "long",
				year: "numeric"
			}) }), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-1 text-center",
			children: [days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: d
			}, d)), cells.map((day, i) => {
				if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e-${i}`);
				const defaultStatus = day === today.getDate() ? "today" : day > today.getDate() ? "future" : "weekend";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[statuses[day] ?? defaultStatus] ?? ""}`,
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
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchInsights() {
			setLoading(true);
			try {
				const res = await apiInstance.get("/attendance/insights");
				const resData = res.data?.data || res.data;
				if (active && resData) setData(resData);
			} catch {} finally {
				if (active) setLoading(false);
			}
		}
		fetchInsights();
		return () => {
			active = false;
		};
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), " Loading AI Insights..."]
	});
	if (!data || !data.score && !data.recommendation) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-6 text-center text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No AI attendance insights available for this period."]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					{
						icon: TrendingUp,
						label: "Attendance Score",
						value: data.score || "—",
						positive: true
					},
					{
						icon: Clock,
						label: "Avg. Check-In",
						value: data.avgCheckIn || "—",
						positive: true
					},
					{
						icon: Timer,
						label: "Avg. Work Hours",
						value: data.avgHours || "—",
						positive: true
					},
					{
						icon: Activity,
						label: "Punctuality Rank",
						value: data.rank || "—",
						positive: true
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card/40 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground uppercase tracking-wide",
								children: item.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg font-semibold",
							children: item.value
						})]
					}, item.label);
				})
			}),
			data.recommendation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-violet-500/20 bg-violet-500/5 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 shrink-0 text-violet-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-violet-600 dark:text-violet-300 mb-1",
						children: "AI Recommendation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: data.recommendation
					})] })]
				})
			}),
			data.weeklySummary && data.weeklySummary.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							children: data.weeklySummary.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex-1 h-8 rounded text-[9px] flex items-center justify-center font-bold ${s === "P" ? "bg-emerald-500/20 text-emerald-600" : "bg-violet-500/20 text-violet-600"}`,
								children: s
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[10px] text-muted-foreground text-center",
							children: "Mon–Fri"
						})
					]
				}), typeof data.monthlyScore === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-1",
							children: "Monthly Score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-2 h-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 flex items-center w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 rounded-full bg-muted w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500",
										style: { width: `${Math.min(100, Math.max(0, data.monthlyScore))}%` }
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-center font-display text-xl font-bold",
							children: [data.monthlyScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
function HistoryTable() {
	const [history, setHistory] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchHistory() {
			setLoading(true);
			try {
				const res = await apiInstance.get("/attendance/history", { params: { limit: 10 } });
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setHistory(list);
			} catch {} finally {
				if (active) setLoading(false);
			}
		}
		fetchHistory();
		return () => {
			active = false;
		};
	}, []);
	const STATUS_TONE = {
		Present: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		Late: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
		Leave: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
		Absent: "bg-rose-500/15 text-rose-600 dark:text-rose-300"
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), " Loading attendance history..."]
	});
	if (history.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-10 text-center text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No attendance records found."]
	});
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
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: history.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/50 transition-colors hover:bg-accent/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 font-medium text-xs",
						children: r.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-mono",
						children: r.checkIn || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.breakDur || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-mono",
						children: r.checkOut || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs font-semibold",
						children: r.hours || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.ot || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[r.status] ?? "bg-muted text-muted-foreground"}`,
							children: r.status || "—"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-xs text-muted-foreground",
						children: r.location || "—"
					})
				]
			}, r.id || i)) })]
		})
	});
}
function CheckInPage() {
	const ws = useofc360();
	const user = ws.user;
	const [status, setStatus] = (0, import_react.useState)("not-checked-in");
	const [dayStatus, setDayStatus] = (0, import_react.useState)("present");
	const [loading, setLoading] = (0, import_react.useState)(null);
	const [initialLoading, setInitialLoading] = (0, import_react.useState)(true);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [noteEmp, setNoteEmp] = (0, import_react.useState)("");
	const [workSec, setWorkSec] = (0, import_react.useState)(0);
	const [breakSec, setBreakSec] = (0, import_react.useState)(0);
	const [activeSec, setActiveSec] = (0, import_react.useState)(0);
	const checkInTimeRef = (0, import_react.useRef)(null);
	const [timeline, setTimeline] = (0, import_react.useState)([]);
	const [geo, setGeo] = (0, import_react.useState)(null);
	const [geoLoading, setGeoLoading] = (0, import_react.useState)(false);
	const [shiftInfo, setShiftInfo] = (0, import_react.useState)(null);
	const [shiftLoading, setShiftLoading] = (0, import_react.useState)(true);
	const [rules, setRules] = (0, import_react.useState)([]);
	const [rulesLoading, setRulesLoading] = (0, import_react.useState)(true);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [notifLoading, setNotifLoading] = (0, import_react.useState)(true);
	const [notices, setNotices] = (0, import_react.useState)([]);
	const [noticesLoading, setNoticesLoading] = (0, import_react.useState)(true);
	const [holidays, setHolidays] = (0, import_react.useState)([]);
	const [holidaysLoading, setHolidaysLoading] = (0, import_react.useState)(true);
	const [celebrations, setCelebrations] = (0, import_react.useState)([]);
	const [celebLoading, setCelebLoading] = (0, import_react.useState)(true);
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [clientIp, setClientIp] = (0, import_react.useState)("Client IP");
	const [notesOpen, setNotesOpen] = (0, import_react.useState)(false);
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
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchTodayAttendance() {
			setInitialLoading(true);
			try {
				const res = await apiInstance.get("/attendance/today");
				const data = res.data?.data || res.data;
				if (active && data) {
					if (data.status) setStatus(data.status);
					if (data.dayStatus) setDayStatus(data.dayStatus);
					if (typeof data.workSec === "number") setWorkSec(data.workSec);
					if (typeof data.breakSec === "number") setBreakSec(data.breakSec);
					if (typeof data.activeSec === "number") setActiveSec(data.activeSec);
					if (Array.isArray(data.timeline)) setTimeline(data.timeline);
					if (data.checkInTime) checkInTimeRef.current = new Date(data.checkInTime);
				}
			} catch {} finally {
				if (active) setInitialLoading(false);
			}
		}
		fetchTodayAttendance();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchShift() {
			setShiftLoading(true);
			try {
				const res = await apiInstance.get("/attendance/shift");
				const data = res.data?.data || res.data;
				if (active && data) setShiftInfo(data);
			} catch {} finally {
				if (active) setShiftLoading(false);
			}
		}
		fetchShift();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchRules() {
			setRulesLoading(true);
			try {
				const res = await apiInstance.get("/attendance/rules");
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setRules(list);
			} catch {} finally {
				if (active) setRulesLoading(false);
			}
		}
		fetchRules();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchSidebarData() {
			apiInstance.get("/attendance/notifications").then((res) => {
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setNotifications(list);
			}).catch(() => {}).finally(() => active && setNotifLoading(false));
			apiInstance.get("/company/notices").then((res) => {
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setNotices(list);
			}).catch(() => {}).finally(() => active && setNoticesLoading(false));
			apiInstance.get("/attendance/holidays").then((res) => {
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setHolidays(list);
			}).catch(() => {}).finally(() => active && setHolidaysLoading(false));
			apiInstance.get("/employees/celebrations").then((res) => {
				const list = res.data?.data || res.data;
				if (active && Array.isArray(list)) setCelebrations(list);
			}).catch(() => {}).finally(() => active && setCelebLoading(false));
			apiInstance.get("/attendance/device-info").then((res) => {
				const ip = res.data?.data?.ip || res.data?.ip;
				if (active && ip) setClientIp(ip);
			}).catch(() => {});
		}
		fetchSidebarData();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchWeather() {
			try {
				const lat = geo?.lat || 12.9716;
				const lng = geo?.lng || 77.5946;
				const data = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)).json();
				if (active && data?.current_weather) setWeather({
					temp: `${Math.round(data.current_weather.temperature)}°C`,
					condition: data.current_weather.weathercode <= 3 ? "Clear / Partly Cloudy" : "Cloudy",
					location: geo ? `Office (${geo.lat.toFixed(2)}, ${geo.lng.toFixed(2)})` : "Current Location",
					humidity: "Standard",
					wind: `${data.current_weather.windspeed} km/h`,
					uv: "Moderate"
				});
			} catch {}
		}
		fetchWeather();
		return () => {
			active = false;
		};
	}, [geo]);
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
			showToast("Location updated successfully!", "success");
		} catch (err) {
			showToast(err.message || "Failed to fetch geolocation.", "error");
		} finally {
			setGeoLoading(false);
		}
	}
	const overtimeSec = Math.max(0, workSec - 28800);
	let lateBy = 0;
	if (checkInTimeRef.current && shiftInfo?.startTime) {
		const [hStr, mStr] = shiftInfo.startTime.split(":");
		if (hStr && mStr) {
			const shiftStart = new Date(checkInTimeRef.current);
			shiftStart.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
			const graceMs = (shiftInfo.graceMinutes || 0) * 60 * 1e3;
			const diffSec = Math.floor((checkInTimeRef.current.getTime() - (shiftStart.getTime() + graceMs)) / 1e3);
			if (diffSec > 0) lateBy = diffSec;
		}
	}
	const empRecord = ws.employees[0];
	const userFullName = user?.fullName || (empRecord ? `${empRecord.firstName} ${empRecord.lastName}` : "—");
	const empId = empRecord?.employeeId || "—";
	const departmentName = empRecord?.department || "—";
	const designationName = empRecord?.designation || "—";
	const officeLocation = shiftInfo?.location || empRecord?.officeLocation || "—";
	const managerName = shiftInfo?.managerName || empRecord?.managerName || "—";
	const initials = userFullName !== "—" ? userFullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "—";
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
									children: shiftInfo?.name || "Shift Assigned"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: shiftInfo ? `${shiftInfo.startTime} – ${shiftInfo.endTime}` : "—"
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
															children: userFullName
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayStatusChip, { status: dayStatus })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
																	" EMP: ",
																	empId
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3" }),
																	" Dept: ",
																	departmentName
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }),
																	" Title: ",
																	designationName
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
																	" ",
																	officeLocation
																]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Reports to: ", managerName] })]
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
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-muted-foreground",
														children: ["Expected: ", shiftInfo?.expectedHours || "8h 00m"]
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
												lateBy > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Late by: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-amber-500",
													children: fmtHM(lateBy)
												})] })
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
									hint: `Expected: ${shiftInfo?.expectedHours || "8h 00m"}`,
									icon: Clock,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Break Duration",
									value: fmtHM(breakSec),
									hint: "Recorded Break",
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
									value: lateBy > 0 ? fmtHM(lateBy) : "On Time",
									hint: `Grace: ${shiftInfo?.graceMinutes ?? 15} mins`,
									icon: CircleAlert,
									accent: lateBy > 0 ? "danger" : "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Early Exit",
									value: "—",
									hint: "Not applicable",
									icon: LogOut,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Status",
									value: STATUS_MAP[dayStatus]?.label || "Present",
									hint: "Daily status",
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
							}), shiftLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), " Loading shift details..."]
							}) : shiftInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 text-sm",
								children: [
									{
										label: "Shift Name",
										value: shiftInfo.name
									},
									{
										label: "Timing",
										value: `${shiftInfo.startTime} – ${shiftInfo.endTime}`
									},
									{
										label: "Manager",
										value: shiftInfo.managerName || managerName
									},
									{
										label: "Working Days",
										value: shiftInfo.workingDays
									},
									{
										label: "Expected Hours",
										value: shiftInfo.expectedHours
									},
									{
										label: "Grace Time",
										value: `${shiftInfo.graceMinutes} minutes`
									},
									{
										label: "Weekend",
										value: shiftInfo.weekend
									},
									{
										label: "Location",
										value: shiftInfo.location
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
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-10 text-center text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No shift assigned for today."]
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
												children: "Camera integration"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground/60",
												children: "Not configured"
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
													className: "flex items-center gap-1 font-medium text-amber-500",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" }), " Not Available"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-border bg-card/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground",
													children: "Confidence"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: "N/A"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-border bg-card/40 p-2 col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground",
													children: "Last Verified"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: "Never"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "w-full gap-2",
										disabled: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "h-3.5 w-3.5" }), " Feature Not Configured"]
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
												value: "—"
											},
											{
												label: "Device",
												value: getBrowserInfo()
											},
											{
												label: "Status",
												value: "Pending Scan",
												ok: false
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
										onClick: () => showToast("QR scanner ready. Waiting for scan.", "info"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), " Scan QR Code"]
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
										value: getDeviceType(),
										icon: Laptop
									},
									{
										label: "Browser",
										value: getBrowserInfo(),
										icon: Globe
									},
									{
										label: "OS",
										value: getOSInfo(),
										icon: Monitor
									},
									{
										label: "IP Address",
										value: clientIp,
										icon: Wifi
									},
									{
										label: "Network",
										value: "Standard Network",
										icon: Wifi
									},
									{
										label: "VPN",
										value: "Not Detected",
										icon: Shield
									},
									{
										label: "Device Access",
										value: "Verified Client",
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
						}), rulesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), " Loading attendance policy rules..."]
						}) : rules.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs",
							children: rules.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border border-border/50 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: row.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: row.value
								})]
							}, row.label))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No custom attendance policies loaded. Standard office rules apply."]
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
									onClick: () => showToast("Exporting attendance history...", "info"),
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
						}), notifLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Loading notifications..."]
						}) : notifications.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
								icon: n.type === "warning" ? CircleAlert : n.type === "success" ? CircleCheck : Bell,
								title: n.title,
								desc: n.desc,
								time: n.time,
								color: n.color || "bg-violet-500/15 text-violet-600 dark:text-violet-300"
							}, n.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No recent notifications."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Today's Weather",
							icon: Globe
						}), weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-5xl",
								children: "🌤️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl font-bold",
									children: weather.temp
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: weather.condition
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: weather.location
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Humidity: ", weather.humidity] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Wind: ", weather.wind] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["UV: ", weather.uv] })
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "Weather information unavailable."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Company Notice",
							icon: Flag
						}), noticesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Loading announcements..."]
						}) : notices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: notices.map((nc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-lg border p-3 text-xs ${nc.variant === "warning" ? "border-amber-500/20 bg-amber-500/5" : "border-sky-500/20 bg-sky-500/5"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `font-semibold mb-1 ${nc.variant === "warning" ? "text-amber-700 dark:text-amber-300" : "text-sky-600 dark:text-sky-300"}`,
									children: nc.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: nc.content
								})]
							}, nc.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No active company notices."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Upcoming Holidays",
							icon: CalendarDays
						}), holidaysLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Loading holidays..."]
						}) : holidays.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: holidays.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							}, h.id || h.date))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No upcoming holidays scheduled."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Celebrations",
							icon: Star
						}), celebLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Loading celebrations..."]
						}) : celebrations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: celebrations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl",
									children: c.type === "birthday" ? "🎂" : "🎉"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-semibold",
										children: c.personName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: c.subtitle
									})]
								})]
							}, c.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mx-auto mb-2 h-7 w-7 opacity-40" }), "No celebrations today."]
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
