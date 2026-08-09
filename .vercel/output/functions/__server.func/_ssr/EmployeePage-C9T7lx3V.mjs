import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { on as useofc360 } from "./ofc360-store-Cb6xhYOw.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bn as Download, C as TrendingUp, Cn as FileText, Lr as Bell, Nr as Bot, S as TriangleAlert, St as Package, Tr as CalendarDays, Xn as Clock, dr as ChevronRight, n as Zap, nr as CircleUser, or as CircleCheck, r as X, rt as RefreshCw, tn as Info, w as TrendingDown, z as Sparkles } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
import { S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, s as LineChart, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeePage-C9T7lx3V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMP_KPI = [];
var MY_ATTENDANCE = [];
var MY_LEAVES = [];
var LEAVE_QUOTA = [];
var MY_GOALS = [];
var MY_PAYSLIPS = [];
var MY_DOCUMENTS = [];
var MY_ASSETS = [];
var COMPANY_EVENTS = [];
var EMP_NOTIFICATIONS = [];
var MY_ATTENDANCE_TREND = [];
var fadeUp = {
	initial: {
		opacity: 0,
		y: 20
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .35,
		ease: "easeOut"
	}
};
var stagger = (i) => ({
	initial: {
		opacity: 0,
		y: 20
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .35,
		ease: "easeOut",
		delay: i * .06
	}
});
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm p-5 ${className}`,
		children
	});
}
function SectionHeader({ title, subtitle, link, linkLabel = "View More" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: subtitle
		})] }), link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: link,
			className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
			children: [
				linkLabel,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })
			]
		})]
	});
}
var ATTENDANCE_STATUS = {
	present: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
	late: "bg-amber-500/15 text-amber-600 border-amber-200",
	leave: "bg-violet-500/15 text-violet-600 border-violet-200",
	wfh: "bg-blue-500/15 text-blue-600 border-blue-200",
	absent: "bg-rose-500/15 text-rose-600 border-rose-200"
};
var NOTIF_ICON = {
	success: CircleCheck,
	warn: TriangleAlert,
	info: Info
};
var NOTIF_COLOR = {
	success: "bg-emerald-500/10 text-emerald-500",
	warn: "bg-amber-500/10 text-amber-500",
	info: "bg-blue-500/10 text-blue-500"
};
var EVENT_COLOR = {
	meeting: "bg-blue-500/15 text-blue-600 border-blue-200",
	holiday: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
	event: "bg-amber-500/15 text-amber-600 border-amber-200"
};
var EMP_QUICK_ACTIONS = [
	{
		label: "Apply Leave",
		icon: FileText,
		link: "/dashboard/leaves",
		color: "from-amber-600 to-orange-600"
	},
	{
		label: "View Payslip",
		icon: Download,
		link: "/dashboard/payroll/payslips",
		color: "from-green-600 to-emerald-600"
	},
	{
		label: "My Attendance",
		icon: Clock,
		link: "/dashboard/attendance",
		color: "from-teal-600 to-cyan-600"
	},
	{
		label: "My Documents",
		icon: FileText,
		link: "/dashboard/documents",
		color: "from-blue-600 to-indigo-600"
	},
	{
		label: "My Assets",
		icon: Package,
		link: "/dashboard/assets",
		color: "from-slate-600 to-gray-700"
	},
	{
		label: "AI Assistant",
		icon: Bot,
		link: "/ai/chat-assistant",
		color: "from-violet-600 to-purple-600"
	}
];
function EmployeeHeader({ firstName, companyName }) {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: -16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .45,
			ease: "easeOut"
		},
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-lg",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "h-6 w-6 text-white" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: [
						greeting,
						", ",
						firstName,
						" 👋"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [companyName, " · Employee Self-Service Portal"]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ai/chat-assistant",
					className: "flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow transition-all hover:shadow-md hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " AI Assistant"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: EMP_QUICK_ACTIONS.map((a, i) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...stagger(i),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: a.link,
						className: "group flex flex-col items-center gap-2 rounded-xl border border-border bg-background/60 p-3 text-center transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${a.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground",
							children: a.label
						})]
					})
				}, a.label);
			})
		})]
	});
}
function EmployeeKpiCards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
		children: EMP_KPI.map((kpi, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			...stagger(i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: `h-3.5 w-3.5 ${kpi.accent}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-bold tracking-tight",
						children: kpi.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: kpi.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-1.5 flex items-center gap-1 text-[11px] font-medium ${kpi.changeType === "up" ? "text-emerald-500" : kpi.changeType === "down" ? "text-rose-500" : "text-muted-foreground"}`,
						children: [kpi.changeType === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : kpi.changeType === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }) : null, kpi.change]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-8 w-full opacity-60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
								data: kpi.spark,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "v",
									stroke: kpi.accent.includes("emerald") ? "#10b981" : kpi.accent.includes("blue") ? "#3b82f6" : kpi.accent.includes("violet") ? "#8b5cf6" : kpi.accent.includes("amber") ? "#f59e0b" : kpi.accent.includes("green") ? "#22c55e" : "#f43f5e",
									strokeWidth: 2,
									dot: false
								})
							})
						})
					})
				]
			})
		}, kpi.id))
	});
}
function MyAttendance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Attendance",
				subtitle: "Recent check-in / check-out log",
				link: "/dashboard/attendance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 h-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: MY_ATTENDANCE_TREND,
						margin: {
							top: 4,
							right: 8,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.1)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "week",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false,
								domain: [0, 5]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12
								},
								formatter: (v) => [`${v} days`, "Days Present"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "days",
								radius: [
									4,
									4,
									0,
									0
								],
								fill: "#10b981"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: MY_ATTENDANCE.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-20 shrink-0 text-xs text-muted-foreground",
							children: new Date(a.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${ATTENDANCE_STATUS[a.status]}`,
							children: a.status === "wfh" ? "WFH" : a.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 text-xs text-muted-foreground",
							children: a.checkIn ? `${a.checkIn} → ${a.checkOut || "–"}` : "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs font-medium",
							children: a.hours
						})
					]
				}, a.date))
			})
		] })
	});
}
function MyLeaves() {
	const [tab, setTab] = (0, import_react.useState)("history");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Leaves",
				subtitle: "Leave history and balance",
				link: "/dashboard/leaves"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-2",
				children: ["history", "balance"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${tab === t ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`,
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
				mode: "wait",
				children: [tab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: -8
					},
					transition: { duration: .18 },
					className: "space-y-2",
					children: MY_LEAVES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: l.type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: l.status === "approved" ? "default" : l.status === "pending" ? "secondary" : "destructive",
										className: "text-[10px] capitalize",
										children: l.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										l.from,
										" → ",
										l.to,
										" · ",
										l.days,
										" day",
										l.days !== 1 ? "s" : "",
										" · Applied ",
										l.appliedOn
									]
								}),
								l.approvedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-emerald-600",
									children: ["Approved by ", l.approvedBy]
								})
							]
						})
					}, l.id))
				}, "history"), tab === "balance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: -8
					},
					transition: { duration: .18 },
					className: "space-y-3",
					children: LEAVE_QUOTA.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: q.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: q.remaining
								}),
								"/",
								q.total,
								" remaining"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-blue-500 transition-all duration-700",
							style: { width: `${q.remaining / q.total * 100}%` }
						})
					})] }, q.type))
				}, "balance")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard/leaves",
				className: "mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " Apply New Leave"]
			})
		] })
	});
}
function MyPerformance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Performance",
				subtitle: "Goals and self-assessment",
				link: "/dashboard/performance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-4 rounded-xl border border-border bg-background/50 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl font-bold text-violet-500",
						children: "87"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Score"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Performance Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-violet-500",
								children: "87/100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: 87,
							className: "h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-emerald-600",
							children: "+5pts from last quarter · Excellent trajectory"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "My Goals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: MY_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: g.goal
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							"Due ",
							g.due,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [g.progress, "%"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full rounded-full transition-all duration-700 ${g.progress >= 70 ? "bg-emerald-500" : g.progress >= 40 ? "bg-amber-500" : "bg-rose-500"}`,
						style: { width: `${g.progress}%` }
					})
				})] }, g.goal))
			})
		] })
	});
}
function MyPayslips() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Payslips",
			subtitle: "Salary statements",
			link: "/dashboard/payroll/payslips"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: MY_PAYSLIPS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-500/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 text-green-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: p.month
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Gross: ",
								p.gross,
								" · Paid on ",
								p.date
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-emerald-500",
							children: p.net
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							className: "text-[10px]",
							children: "Paid"
						})]
					})
				]
			}, p.month))
		})] })
	});
}
function MyDocuments() {
	const DOC_STATUS_STYLE = {
		verified: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
		pending: "bg-amber-500/10 text-amber-600 border-amber-200",
		rejected: "bg-rose-500/10 text-rose-600 border-rose-200"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Documents",
			subtitle: "Document verification status",
			link: "/dashboard/documents"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: MY_DOCUMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: d.name
						}), d.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-amber-600",
							children: d.dueDate
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${DOC_STATUS_STYLE[d.status]}`,
						children: d.status
					})
				]
			}, d.name))
		})] })
	});
}
function MyAssets() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Assets",
			subtitle: "Assigned company equipment",
			link: "/dashboard/assets"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: MY_ASSETS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Tag: ",
								a.tag,
								" · Since ",
								a.assigned
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "text-[10px]",
						children: a.status
					})
				]
			}, a.tag))
		})] })
	});
}
function EmployeeCalendar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Company Calendar",
			subtitle: "Upcoming events and holidays",
			link: "/dashboard/attendance/holidays"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: COMPANY_EVENTS.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-start gap-3 rounded-xl border px-3 py-2.5 ${EVENT_COLOR[ev.type] ?? "bg-muted/40 border-border"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mt-0.5 h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: ev.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs opacity-70",
							children: [new Date(ev.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							}), ev.time ? ` · ${ev.time}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "shrink-0 capitalize text-[10px] border-current",
						children: ev.type
					})
				]
			}, i))
		})] })
	});
}
function EmployeeNotifications() {
	const [dismissed, setDismissed] = (0, import_react.useState)([]);
	const visible = EMP_NOTIFICATIONS.filter((n) => !dismissed.includes(n.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, { title: "Notifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [visible.map((n) => {
				const Icon = NOTIF_ICON[n.type] ?? Bell;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${NOTIF_COLOR[n.type]}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: n.detail
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: n.time
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDismissed((d) => [...d, n.id]),
								className: "rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})]
						})
					]
				}, n.id);
			}), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-6 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-7 w-7 text-emerald-500" }), "All caught up!"]
			})]
		})] })
	});
}
function EmployeeDashboard() {
	const ws = useofc360();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeHeader, {
				firstName: ws.user?.fullName?.split(" ")[0] ?? "there",
				companyName: ws.company?.name ?? "ofc360 HR"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeKpiCards, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAttendance, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyLeaves, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyPerformance, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyPayslips, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyDocuments, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAssets, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeCalendar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeNotifications, {})]
			})
		]
	});
}
function EmployeePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeDashboard, {});
}
//#endregion
export { EmployeePage };
