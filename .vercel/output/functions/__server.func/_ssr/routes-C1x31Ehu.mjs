import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Banknote, Cr as Briefcase, Hn as Clock, I as Sparkles, Ir as ArrowRight, fr as ChartColumn, gn as FileText, k as Target, rr as ChevronRight, u as Users, wr as Brain, z as Shield } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DXb73-Yh.mjs";
import { t as CTA } from "./CTA-CBzBpoLp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C1x31Ehu.js
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
		desc: "AI-powered resume screening, candidate ranking, interview copilot, and offer letter generation — end-to-end hiring.",
		to: "/dashboard/recruitment"
	},
	{
		icon: Clock,
		title: "Attendance & Shifts",
		desc: "Geo-fenced check-ins, shift scheduling, roster management, and holiday calendars with anomaly detection.",
		to: "/dashboard/attendance"
	},
	{
		icon: Banknote,
		title: "Payroll Processing",
		desc: "Salary structuring, tax compliance, reimbursements, advances, and AI-driven error detection before every run.",
		to: "/dashboard/payroll"
	},
	{
		icon: Target,
		title: "Performance Management",
		desc: "OKR/KPI generation, 360° feedback, AI performance coaching, and promotion readiness scoring.",
		to: "/dashboard/performance"
	},
	{
		icon: Brain,
		title: "AI Hub — 70+ Agents",
		desc: "Specialized AI agents across recruitment, compliance, payroll, workforce planning, document generation, and more.",
		to: "/ai"
	},
	{
		icon: ChartColumn,
		title: "Reports & Analytics",
		desc: "Executive dashboards, attrition prediction, diversity analytics, hiring funnels, and organization health scores.",
		to: "/dashboard/reports"
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroInteractiveMockup, {})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: "Built for modern organizations seeking intelligent, end-to-end HR automation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-center max-w-3xl mx-auto",
				children: [
					"AI Recruitment & Screening",
					"Geo-Fenced Attendance",
					"Compliant Payroll Run",
					"360° Performance & OKRs"
				].map((capability) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-3 rounded-xl glass border border-border/60 text-xs font-semibold text-foreground/90 shadow-sm",
					children: capability
				}, capability))
			})]
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
							to: m.to,
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
function HeroInteractiveMockup() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("Dashboard");
	const tabs = [
		{
			label: "Dashboard",
			icon: ChartColumn
		},
		{
			label: "Recruitment",
			icon: Briefcase
		},
		{
			label: "Attendance",
			icon: Clock
		},
		{
			label: "Payroll",
			icon: Banknote
		},
		{
			label: "Performance",
			icon: Target
		},
		{
			label: "AI Hub",
			icon: Brain
		},
		{
			label: "Reports",
			icon: FileText
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-16 relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative glass rounded-3xl p-2 shadow-elegant text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card border border-border overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:hidden flex items-center gap-1 overflow-x-auto p-2 border-b border-border bg-secondary/30 scrollbar-none",
					children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.label),
						className: `px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${activeTab === tab.label ? "bg-gradient-brand text-brand-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "h-3 w-3" }), tab.label]
					}, tab.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 min-h-[400px] sm:min-h-[440px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-3 border-r border-border p-3 sm:p-4 hidden md:flex flex-col gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-4 px-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "OFC360 HRMS dashboard logo",
									className: "h-6 w-auto object-contain",
									width: "24",
									height: "24"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "OFC360"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase font-semibold text-muted-foreground px-2 mb-1 tracking-wider",
								children: "Live Demo Preview"
							}),
							tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab(tab.label),
								className: `px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === tab.label ? "bg-gradient-brand text-brand-foreground shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "h-3.5 w-3.5" }), tab.label]
							}, tab.label))
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-12 md:col-span-9 p-4 sm:p-6 flex flex-col justify-between",
						children: [
							activeTab === "Dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Overview"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "HR Dashboard"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground font-medium",
										children: "Live Preview"
									})]
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
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-4 glass",
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
										className: "rounded-xl border border-border p-4 glass",
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
							] }),
							activeTab === "Recruitment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Recruitment Module"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "AI Candidate Pipeline"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium",
										children: "12 Active Jobs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Active Jobs",
											value: "12"
										},
										{
											label: "Applicants",
											value: "184"
										},
										{
											label: "AI Shortlisted",
											value: "42"
										},
										{
											label: "Offers Sent",
											value: "3"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 glass space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium mb-1",
										children: "Top Match Candidate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: "Vikramaditya Sharma"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground text-[11px]",
											children: "Senior Frontend Lead • 6 yrs exp"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-1 rounded-md bg-gradient-brand text-brand-foreground font-bold text-[11px]",
											children: "98% AI Match"
										})]
									})]
								})
							] }),
							activeTab === "Attendance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Attendance & Roster"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "Live Check-in Status"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium",
										children: "Geo-Fencing Active"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Present Today",
											value: "238"
										},
										{
											label: "Remote Check-ins",
											value: "8"
										},
										{
											label: "On Approved Leave",
											value: "2"
										},
										{
											label: "On-Time Rate",
											value: "99.2%"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 glass",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium mb-2",
										children: "Shift Roster Summary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2 text-center text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-secondary/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground text-[10px]",
													children: "Morning Shift"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-foreground",
													children: "140 Members"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-secondary/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground text-[10px]",
													children: "General Shift"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-foreground",
													children: "90 Members"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-secondary/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground text-[10px]",
													children: "Night Shift"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-foreground",
													children: "18 Members"
												})]
											})
										]
									})]
								})
							] }),
							activeTab === "Payroll" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Payroll & Structuring"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "Salary Processing"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium",
										children: "Cycle Ready"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Monthly Payroll",
											value: "₹24.8L"
										},
										{
											label: "TDS / Tax Ded.",
											value: "₹1.8L"
										},
										{
											label: "Reimbursements",
											value: "₹42,000"
										},
										{
											label: "Audit Anomalies",
											value: "0 Errors"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 glass",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-medium mb-2",
											children: "Salary Component Breakdown"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "h-4 rounded-full bg-secondary overflow-hidden flex",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-chart-1",
													style: { width: "70%" },
													title: "Basic Salary (70%)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-chart-2",
													style: { width: "20%" },
													title: "HRA & Allowances (20%)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-chart-3",
													style: { width: "10%" },
													title: "Bonus (10%)"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-[10px] text-muted-foreground mt-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Basic (70%)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HRA & Allowances (20%)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Performance Bonus (10%)" })
											]
										})
									]
								})
							] }),
							activeTab === "Performance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Performance & Growth"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "OKRs & 360° Feedback"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium",
										children: "Q3 Cycle Active"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Active OKRs",
											value: "48"
										},
										{
											label: "Reviews Complete",
											value: "88%"
										},
										{
											label: "High Performers",
											value: "16"
										},
										{
											label: "AI Coach Advice",
											value: "Ready"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 glass",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium mb-2",
										children: "AI Performance Coach Snippet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground italic bg-secondary/40 p-3 rounded-lg border border-border/50",
										children: "\"Engineering team exceeded Q3 velocity goals by 14%. Recommended promotion readiness assessment for 3 senior contributors.\""
									})]
								})
							] }),
							activeTab === "AI Hub" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Autonomous AI Agents"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "OFC360 AI Hub"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium",
										children: "70+ AI Agents"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Autonomous Agents",
											value: "70+"
										},
										{
											label: "Tasks / Day",
											value: "1,420"
										},
										{
											label: "Time Saved",
											value: "120 hrs/wk"
										},
										{
											label: "Precision",
											value: "99.4%"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border glass flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-brand shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: "Resume Screener AI"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Rank candidates in seconds"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border glass flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4 text-brand shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: "Payroll Auditor AI"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Detect tax & salary anomalies"
										})] })]
									})]
								})
							] }),
							activeTab === "Reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-medium",
										children: "Executive Analytics"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg sm:text-xl font-bold",
										children: "Attrition & Growth Reports"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium",
										children: "Org Score: 94/100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5",
									children: [
										{
											label: "Org Health Score",
											value: "94/100"
										},
										{
											label: "Attrition Risk",
											value: "2.1% (Low)"
										},
										{
											label: "Gender Diversity",
											value: "48 / 52"
										},
										{
											label: "Salary Benchmark",
											value: "Optimal"
										}
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 glass",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold mt-0.5",
											children: s.value
										})]
									}, s.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 glass",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium mb-2",
										children: "Predictive Attrition Risk Curve"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end gap-2 h-14",
										children: [
											15,
											12,
											10,
											8,
											6,
											5,
											4,
											3,
											2,
											2,
											2,
											2
										].map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 rounded-sm bg-emerald-400 opacity-80",
											style: { height: `${v * 6}%` }
										}, i))
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground hidden sm:block",
									children: ["Currently previewing: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [activeTab, " Module"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/register",
									className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-brand-foreground text-xs font-medium shadow-glow hover:opacity-90 transition-opacity ml-auto",
									children: [
										"Explore ",
										activeTab,
										" in App ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
									]
								})]
							})
						]
					})]
				})]
			})
		})]
	});
}
//#endregion
export { HomePage as component };
