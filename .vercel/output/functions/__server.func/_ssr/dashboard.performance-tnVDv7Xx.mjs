import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { on as useofc360 } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Hn as Clock, N as Star, S as TrendingUp, Zn as CircleCheck, ar as Check, at as Plus, b as Trophy, cn as Gauge, k as Target, pt as PenLine, rn as GraduationCap, wt as MessageSquare } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { t as Progress } from "./progress-BaJBfUMd.mjs";
import { t as lazyFeaturePage } from "./-lazyFeaturePage-C9nPTQPt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.performance-tnVDv7Xx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_GOALS = [
	{
		id: "g1",
		title: "Complete Frontend Role Separation & Onboarding Enhancements",
		category: "Technical Project",
		dueDate: "Jun 30, 2026",
		progress: 100,
		status: "completed"
	},
	{
		id: "g2",
		title: "Optimize API Performance & Query Response Times < 100ms",
		category: "Performance",
		dueDate: "Jul 15, 2026",
		progress: 85,
		status: "in_progress"
	},
	{
		id: "g3",
		title: "Achieve 95%+ Unit & Integration Test Coverage",
		category: "Quality Assurance",
		dueDate: "Aug 01, 2026",
		progress: 60,
		status: "in_progress"
	},
	{
		id: "g4",
		title: "Complete Advanced AI Assistant Agent Certification",
		category: "Skill Development",
		dueDate: "Aug 31, 2026",
		progress: 40,
		status: "in_progress"
	}
];
function EmployeePerformancePage() {
	const ws = useofc360();
	const [goals, setGoals] = (0, import_react.useState)(INITIAL_GOALS);
	const [newGoalOpen, setNewGoalOpen] = (0, import_react.useState)(false);
	const [goalTitle, setGoalTitle] = (0, import_react.useState)("");
	const [goalCategory, setGoalCategory] = (0, import_react.useState)("Technical");
	const [goalDueDate, setGoalDueDate] = (0, import_react.useState)("31 Jul 2026");
	const [selfReviewOpen, setSelfReviewOpen] = (0, import_react.useState)(false);
	const [selfReviewText, setSelfReviewText] = (0, import_react.useState)("");
	const [isSelfReviewSubmitted, setIsSelfReviewSubmitted] = (0, import_react.useState)(false);
	const employeeName = ws.user?.fullName || "Employee";
	const handleAddGoal = () => {
		if (!goalTitle.trim()) {
			toast.error("Please enter a goal title.");
			return;
		}
		const newG = {
			id: `g_${Date.now()}`,
			title: goalTitle,
			category: goalCategory,
			dueDate: goalDueDate,
			progress: 10,
			status: "in_progress"
		};
		setGoals((prev) => [newG, ...prev]);
		setGoalTitle("");
		setNewGoalOpen(false);
		toast.success("New goal added successfully!");
	};
	const handleToggleComplete = (id) => {
		setGoals((prev) => prev.map((g) => g.id === id ? {
			...g,
			progress: g.status === "completed" ? 50 : 100,
			status: g.status === "completed" ? "in_progress" : "completed"
		} : g));
		toast.success("Goal status updated!");
	};
	const handleSubmitSelfReview = () => {
		if (!selfReviewText.trim()) {
			toast.error("Please write your self-assessment review.");
			return;
		}
		setIsSelfReviewSubmitted(true);
		setSelfReviewOpen(false);
		toast.success("Self-review submitted for Q2 review cycle!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Performance & Goals",
				description: "Track your performance score, quarter OKRs, manager feedback, and skill development."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-5 backdrop-blur-xl space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overall Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-foreground",
								children: "4.8 / 5.0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-emerald-500 font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Exceeds Expectations (+0.3 pts)"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 backdrop-blur-xl space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Goal Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-3xl font-black text-foreground",
								children: [
									goals.filter((g) => g.status === "completed").length,
									" / ",
									goals.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: goals.filter((g) => g.status === "completed").length / goals.length * 100,
								className: "h-1.5"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 backdrop-blur-xl space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Q2 Self Review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-foreground",
								children: isSelfReviewSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), " Submitted"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-400",
									children: "Pending Review"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setSelfReviewOpen(true),
								variant: "outline",
								size: "sm",
								className: "w-full text-xs h-7 mt-1 border-amber-500/30",
								children: isSelfReviewSubmitted ? "Edit Self Review" : "Complete Self Review"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent p-5 backdrop-blur-xl space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skill Badges" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-foreground",
								children: "6 Badges"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Top Performer • Clean Code Champion"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5 text-indigo-400" }), " My Quarterly Goals & OKRs"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Track key result milestones and manage your active personal objectives."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setNewGoalOpen(true),
						size: "sm",
						className: "h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Personal Goal"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 transition-all hover:border-indigo-500/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[240px] flex-1 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground text-sm",
										children: g.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] font-semibold",
										children: g.category
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-indigo-400" }),
											" Target Date: ",
											g.dueDate
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-semibold text-foreground",
										children: [g.progress, "% Complete"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: g.progress,
									className: "h-1.5"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => handleToggleComplete(g.id),
								variant: g.status === "completed" ? "default" : "outline",
								size: "sm",
								className: `h-8 gap-1.5 text-xs font-semibold ${g.status === "completed" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-border hover:border-emerald-500"}`,
								children: g.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Completed"] }) : "Mark Done"
							})
						})]
					}, g.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card/80 p-6 space-y-4 backdrop-blur-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-foreground text-sm flex items-center gap-2 border-b border-border/80 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-indigo-400" }), " Latest Manager Feedback"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: "Q1 2026 Performance Review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Reviewed by Engineering Manager"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground leading-relaxed italic",
								children: [
									"\"",
									employeeName,
									" has demonstrated exceptional code ownership, clean architecture practices, and rapid execution. Great initiative in role-based UI separation and system reliability.\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-[11px] font-bold text-indigo-400 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-indigo-400 text-indigo-400" }), " Rating: 4.8 / 5.0 — Exceeds Expectations"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card/80 p-6 space-y-4 backdrop-blur-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-foreground text-sm flex items-center gap-2 border-b border-border/80 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4 text-purple-400" }), " Skill Development & Courses"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground block",
								children: "Advanced React Query & State Patterns"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Enrolled Course • 80% Complete"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
								children: "In Progress"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground block",
								children: "Python FastAPI Enterprise Microservices"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Completed • Certified"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
								children: "Completed"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: newGoalOpen,
				onOpenChange: setNewGoalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[480px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-indigo-400" }), " Add New Personal Goal"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Goal Title *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: goalTitle,
								onChange: (e) => setGoalTitle(e.target.value),
								placeholder: "e.g. Complete Docker Deployment Architecture",
								className: "mt-1 h-9"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: goalCategory,
									onChange: (e) => setGoalCategory(e.target.value),
									placeholder: "Technical / Quality",
									className: "mt-1 h-9"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Target Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: goalDueDate,
									onChange: (e) => setGoalDueDate(e.target.value),
									placeholder: "31 Jul 2026",
									className: "mt-1 h-9"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setNewGoalOpen(false),
								className: "h-9 text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleAddGoal,
								size: "sm",
								className: "h-9 px-4 bg-indigo-600 text-white font-bold text-xs",
								children: "Add Goal"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: selfReviewOpen,
				onOpenChange: setSelfReviewOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[520px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 text-amber-400" }), " Complete Q2 Self Review"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Describe your key achievements, challenges solved, and focus areas for Q2 *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: selfReviewText,
								onChange: (e) => setSelfReviewText(e.target.value),
								rows: 5,
								placeholder: "In Q2, I successfully led the employee onboarding refactoring, separated admin and employee routes, and improved system reliability...",
								className: "w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelfReviewOpen(false),
								className: "h-9 text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSubmitSelfReview,
								size: "sm",
								className: "h-9 px-4 bg-indigo-600 text-white font-bold text-xs",
								children: "Submit Self Review"
							})]
						})
					]
				})
			})
		]
	});
}
var AdminPerformancePage = lazyFeaturePage(() => import("./PerformancePage-DQk6pBtX.mjs"), "PerformancePage");
function PerformanceRouteComponent() {
	if ((useofc360().user?.role)?.toLowerCase() === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeePerformancePage, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPerformancePage, {});
}
//#endregion
export { PerformanceRouteComponent as component };
