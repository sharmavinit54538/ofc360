import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Building2, Cn as FileText, M as Target, Mr as Brain, Rr as Banknote, U as Shield, Wr as ArrowRight, Xn as Clock, br as ChartColumn, dr as ChevronRight, jr as Briefcase, u as Users, z as Sparkles } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-B-h92JZf.mjs";
import { t as CTA } from "./CTA-D43BfVU-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BN6pRjPl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fadeUp = {
	hidden: {
		opacity: 0,
		y: 32
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: .6,
			ease: [
				.25,
				.4,
				.25,
				1
			]
		}
	}
};
function AnimateIn({ children, className, delay = 0 }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-60px"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref,
		initial: "hidden",
		animate: inView ? "visible" : "hidden",
		variants: {
			...fadeUp,
			visible: {
				...fadeUp.visible,
				transition: {
					...fadeUp.visible.transition,
					delay
				}
			}
		},
		className,
		children
	});
}
var modules = [
	{
		icon: Briefcase,
		title: "Recruitment",
		desc: "AI-powered resume screening, candidate ranking, interview copilot, and offer letter generation — end-to-end hiring."
	},
	{
		icon: Clock,
		title: "Attendance & Shifts",
		desc: "Geo-fenced check-ins, shift scheduling, roster management, and holiday calendars with anomaly detection."
	},
	{
		icon: Banknote,
		title: "Payroll Processing",
		desc: "Salary structuring, tax compliance, reimbursements, advances, and AI-driven error detection before every run."
	},
	{
		icon: Target,
		title: "Performance Management",
		desc: "OKR/KPI generation, 360° feedback, AI performance coaching, and promotion readiness scoring."
	},
	{
		icon: Brain,
		title: "AI Hub — 70+ Agents",
		desc: "Specialized AI agents across recruitment, compliance, payroll, workforce planning, document generation, and more."
	},
	{
		icon: ChartColumn,
		title: "Reports & Analytics",
		desc: "Executive dashboards, attrition prediction, diversity analytics, hiring funnels, and organization health scores."
	}
];
var aiCategories = [
	{
		icon: Briefcase,
		label: "Recruitment AI",
		count: "10 agents"
	},
	{
		icon: Users,
		label: "Employee AI",
		count: "8 agents"
	},
	{
		icon: Target,
		label: "Workforce AI",
		count: "8 agents"
	},
	{
		icon: Shield,
		label: "Compliance AI",
		count: "6 agents"
	},
	{
		icon: FileText,
		label: "Document AI",
		count: "10 agents"
	}
];
var steps = [
	{
		num: "01",
		title: "Set Up Your Organization",
		desc: "Define your company structure, departments, roles, and policies in minutes."
	},
	{
		num: "02",
		title: "Onboard Your Team",
		desc: "Digital onboarding checklists, document collection, and automated welcome workflows."
	},
	{
		num: "03",
		title: "Automate with AI",
		desc: "Let 70+ AI agents handle recruitment screening, payroll validation, compliance checks, and more."
	},
	{
		num: "04",
		title: "Gain Real-Time Insights",
		desc: "Executive dashboards, attrition prediction, and organization health scores — always up to date."
	}
];
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-glow" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-[0.07] blur-[120px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-brand opacity-[0.05] blur-[100px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					className: "relative text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " OFC360 — AI-Powered HRMS"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]",
								children: [
									"The intelligent HRMS that works as hard as",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "your people"
									}),
									"."
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .2,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
								children: "Recruitment, attendance, payroll, performance, and 70+ specialized AI agents — unified in one platform built for modern HR teams."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .3,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/register",
									className: "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity text-sm",
									children: ["Get Started Free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass font-medium hover:bg-secondary transition-colors text-sm",
									children: "Book a Demo"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .45,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-16 relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative glass rounded-3xl p-2 shadow-elegant",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-2xl bg-card border border-border overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-12 min-h-[380px] sm:min-h-[440px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-3 border-r border-border p-3 sm:p-4 hidden md:flex flex-col gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 mb-4 px-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-6 w-6 rounded-md bg-gradient-brand grid place-items-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-brand-foreground" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-semibold",
														children: "OFC360"
													})]
												}), [
													{
														label: "Dashboard",
														active: true
													},
													{ label: "Recruitment" },
													{ label: "Attendance" },
													{ label: "Payroll" },
													{ label: "Performance" },
													{ label: "AI Hub" },
													{ label: "Reports" }
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `px-3 py-2 rounded-lg text-xs ${item.active ? "bg-secondary font-medium" : "text-muted-foreground"}`,
													children: item.label
												}, item.label))]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-12 md:col-span-9 p-4 sm:p-6",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between mb-5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs text-muted-foreground",
															children: "Overview"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-display text-lg sm:text-xl font-bold",
															children: "HR Dashboard"
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-24 rounded-lg bg-gradient-brand opacity-80" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
														children: [
															{
																label: "Total Employees",
																value: "248"
															},
															{
																label: "Open Positions",
																value: "12"
															},
															{
																label: "Attendance Rate",
																value: "96%"
															},
															{
																label: "AI Tasks Today",
																value: "34"
															}
														].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-xl border border-border p-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground",
																children: stat.label
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-lg font-bold mt-0.5",
																children: stat.value
															})]
														}, stat.label))
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid sm:grid-cols-2 gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-xl border border-border p-4",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-xs font-medium mb-3",
																children: "Hiring Pipeline"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex items-end gap-1.5 h-16",
																children: [
																	40,
																	65,
																	45,
																	80,
																	55,
																	70,
																	90,
																	60,
																	75,
																	85,
																	50,
																	95
																].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "flex-1 rounded-sm bg-gradient-brand opacity-70",
																	style: { height: `${h}%` }
																}, i))
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-xl border border-border p-4",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-xs font-medium mb-3",
																children: "Department Distribution"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex items-end gap-1.5 h-16",
																children: [
																	{
																		h: 80,
																		color: "bg-chart-1"
																	},
																	{
																		h: 60,
																		color: "bg-chart-2"
																	},
																	{
																		h: 45,
																		color: "bg-chart-3"
																	},
																	{
																		h: 70,
																		color: "bg-chart-4"
																	},
																	{
																		h: 35,
																		color: "bg-chart-5"
																	}
																].map((bar, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `flex-1 rounded-sm ${bar.color} opacity-80`,
																	style: { height: `${bar.h}%` }
																}, i))
															})]
														})]
													})
												]
											})]
										})
									})
								})]
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Trusted by ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: "[PLACEHOLDER STAT — confirm real number]"
						}),
						" organizations worldwide"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center opacity-40",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center",
						title: "PLACEHOLDER — replace with real client logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-20 sm:w-24 rounded-lg bg-muted-foreground/20 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-muted-foreground/50" })
						})
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[10px] text-muted-foreground/50 uppercase tracking-widest",
					children: "PLACEHOLDER — replace with real client logos"
				})
			]
		}) }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Platform",
			title: "Everything your HR team needs — in one place",
			subtitle: "From hiring to retiring, ofc360 AI covers the full employee lifecycle with intelligent automation."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid md:grid-cols-2 gap-5",
			children: modules.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .08,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group glass rounded-3xl p-8 hover:shadow-elegant transition-all relative overflow-hidden h-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.06] blur-3xl group-hover:opacity-20 transition-opacity" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-5 w-5 text-brand-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold mb-2",
							children: m.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground leading-relaxed text-sm",
							children: m.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/features",
							className: "mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline",
							children: ["Learn more ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
						})
					]
				})
			}, m.title))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				className: "relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-2 gap-12 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3 w-3" }), " AI Hub"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
							children: [
								"70+ specialized AI agents,",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "one command center"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-muted-foreground leading-relaxed",
							children: "From resume screening to compliance monitoring, payroll validation to performance coaching — OFC360's AI Hub gives your HR team superhuman capabilities across every workflow."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/features",
							className: "mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline",
							children: ["Explore all AI agents ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						delay: .15,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [aiCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-5 hover:shadow-elegant transition-all group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-3 group-hover:scale-105 transition-transform",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(cat.icon, { className: "h-4 w-4 text-brand-foreground" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-sm",
										children: cat.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-1",
										children: cat.count
									})
								]
							}, cat.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-5 flex flex-col justify-center items-center text-center sm:col-span-2 lg:col-span-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-3xl font-bold text-gradient",
										children: "70+"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Total AI Agents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "across 10 categories"
									})
								]
							})]
						})
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "How it works",
			title: "Up and running in four steps",
			subtitle: "From setup to insights, OFC360 gets your HR operations running smoothly — fast."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid md:grid-cols-4 gap-5",
			children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative glass rounded-2xl p-6 h-full",
					children: [
						i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-3xl font-bold text-gradient mb-4",
							children: step.num
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold mb-2",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed",
							children: step.desc
						})
					]
				})
			}, step.num))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {
			title: "Ready to transform your HR operations?",
			subtitle: "Join forward-thinking organizations using OFC360 to hire smarter, manage better, and grow faster."
		})
	] });
}
//#endregion
export { HomePage as component };
