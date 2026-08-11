import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $t as Heart, Mt as Lock, Q as Rocket, Tn as Eye, k as Target, u as Users, wr as Brain } from "../_libs/lucide-react.mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-Y3jkzoME.mjs";
import { t as CTA } from "./CTA-B3uJBKE1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Cv6azJA2.js
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
		margin: "-20px"
	});
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref,
		initial: "hidden",
		animate: mounted && !inView ? "hidden" : "visible",
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
/**
* DRAFT COPY — review and edit before publishing.
* These values are suggested for an HR-tech / AI company.
* Replace or adjust wording as needed.
*/
var values = [
	{
		icon: Heart,
		title: "Employee-First",
		desc: "Every product decision starts with the question: does this make life better for the people using it?"
	},
	{
		icon: Brain,
		title: "AI Responsibly",
		desc: "Transparent, explainable AI that augments human judgment — never replaces it. We build trust by design."
	},
	{
		icon: Lock,
		title: "Data Security",
		desc: "Enterprise-grade encryption, role-based access, and compliance-first architecture. Your data is yours."
	},
	{
		icon: Rocket,
		title: "Continuous Innovation",
		desc: "We ship fast, learn faster, and obsess over making every release meaningfully better than the last."
	}
];
var teamMembers = [{
	id: 1,
	name: "Banoth Siddharth",
	role: "Co-Owner & Founder",
	bio: "Co-owner and founder of OFC360, driving overall platform vision, enterprise architecture, and AI automation strategy."
}, {
	id: 2,
	name: "Vinit Sharma",
	role: "Co-Owner & Founder",
	bio: "Co-owner and founder of OFC360, leading product development, engineering execution, and operational strategy."
}];
var timelineMilestones = [
	{
		year: "Phase 1",
		title: "Core HR Operating System",
		desc: "Launched unified recruitment pipeline, employee lifecycle, and geo-fenced attendance tracking."
	},
	{
		year: "Phase 2",
		title: "Automated Payroll & Tax Compliance",
		desc: "Integrated multi-component salary structuring, automated tax deductions, and bank payout processing."
	},
	{
		year: "Phase 3",
		title: "OFC360 Autonomous AI Hub",
		desc: "Deployed 70+ specialized AI agents across candidate screening, leave assistance, compliance auditing, and workforce insights."
	}
];
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-glow" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-brand opacity-[0.06] blur-[100px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					className: "relative text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-gradient-brand" }), "About OFC360"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]",
								children: [
									"Building the future of work,",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "one team at a time"
									}),
									"."
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							delay: .2,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
								children: "OFC360 is owned by Banoth Siddharth and Vinit Sharma. Built under EquinoxSphere Technologies to make HR operations seamless, intelligent, and human-centric."
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-3xl p-8 sm:p-10 h-full relative overflow-hidden group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.08] blur-3xl group-hover:opacity-20 transition-opacity" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5 text-brand-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold mb-3",
						children: "Our Mission"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed",
						children: "To empower organizations with an intelligent HR operating system that automates repetitive administrative chores and unlocks strategic human potential."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-3xl p-8 sm:p-10 h-full relative overflow-hidden group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.08] blur-3xl group-hover:opacity-20 transition-opacity" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5 text-brand-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold mb-3",
							children: "Our Vision"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground leading-relaxed",
							children: "A world where HR management is frictionless, transparent, and predictive — enabling leaders to make data-driven decisions while fostering employee growth."
						})
					]
				})
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Our story",
			title: "The journey behind OFC360"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
			delay: .1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 max-w-3xl mx-auto glass rounded-3xl p-8 sm:p-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "OFC360 is owned by Banoth Siddharth and Vinit Sharma. Built under EquinoxSphere Technologies with a mission to eliminate friction from enterprise HR operations." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Traditional organizations often rely on disjointed software for recruitment, attendance, payroll, and performance management. OFC360 unifies these pillars into a single intelligent platform powered by autonomous AI capabilities." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "From AI candidate ranking and instant offer letter generation to real-time roster scheduling, automated payroll runs, and predictive attrition modeling — OFC360 delivers complete operational clarity for modern HR teams." })
					]
				})
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Values",
			title: "What guides us",
			subtitle: "These principles shape how we build, how we innovate, and how we serve our customers."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5",
			children: values.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .08,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 h-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(v.icon, { className: "h-5 w-5 text-brand-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold mb-2",
							children: v.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed",
							children: v.desc
						})
					]
				})
			}, v.title))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Leadership & Ownership",
			title: "The people behind OFC360",
			subtitle: "OFC360 is owned by Banoth Siddharth and Vinit Sharma."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto",
			children: teamMembers.map((member, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .06,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-lg mb-4 opacity-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-foreground",
							children: member.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-brand mb-2",
							children: member.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: member.bio
						})
					]
				})
			}, member.id))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Milestones",
			title: "Our journey so far"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-16 max-w-3xl mx-auto relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" }), timelineMilestones.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 mb-10 ${i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-brand shadow-glow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:pl-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-brand font-semibold uppercase tracking-wider",
									children: t.year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold mt-1 text-foreground",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-sm mt-1",
									children: t.desc
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
					]
				})
			}, i))]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {
			title: "Join the journey",
			subtitle: "We're building the future of HR technology. Come see what OFC360 can do for your team."
		})
	] });
}
//#endregion
export { AboutPage as component };
