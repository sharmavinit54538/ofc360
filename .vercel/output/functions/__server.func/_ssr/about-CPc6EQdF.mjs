import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $t as Heart, Cr as Brain, Mt as Lock, Q as Rocket, Tn as Eye, k as Target, u as Users } from "../_libs/lucide-react.mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DXb73-Yh.mjs";
import { t as CTA } from "./CTA-CBzBpoLp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CPc6EQdF.js
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
/**
* PLACEHOLDER — replace with real team member names, titles, and bios.
* Do NOT go live with these placeholder entries.
*/
var teamPlaceholders = Array.from({ length: 6 }).map((_, i) => ({
	id: i,
	name: `[Team Member ${i + 1}]`,
	role: "[Title / Designation]",
	bio: "[Brief bio — 1-2 sentences about background and expertise]"
}));
/**
* PLACEHOLDER — replace with real milestones.
* These are structural placeholders only.
*/
var timelinePlaceholders = [
	{
		year: "[Year]",
		title: "[Milestone Title]",
		desc: "[Brief description of what happened at this milestone]"
	},
	{
		year: "[Year]",
		title: "[Milestone Title]",
		desc: "[Brief description of what happened at this milestone]"
	},
	{
		year: "[Year]",
		title: "[Milestone Title]",
		desc: "[Brief description of what happened at this milestone]"
	},
	{
		year: "[Year]",
		title: "[Milestone Title]",
		desc: "[Brief description of what happened at this milestone]"
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
								children: "EquinoxSphere Technologies is on a mission to make HR technology intelligent, accessible, and genuinely helpful — so teams can focus on what matters most: their people."
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-2 gap-5",
			children: [{
				icon: Target,
				title: "Mission",
				text: "Build an intelligent HRMS that turns complex HR workflows into effortless experiences — empowering organizations of every size to manage their people with clarity and confidence."
			}, {
				icon: Eye,
				title: "Vision",
				text: "A world where HR technology adapts to people, not the other way around — where AI handles the operational burden so teams can invest in culture, growth, and well-being."
			}].map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
				delay: i * .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-3xl p-10 h-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(block.icon, { className: "h-5 w-5 text-brand-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold mb-3",
							children: block.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground leading-relaxed",
							children: block.text
						})
					]
				})
			}, block.title))
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-brand font-medium",
							children: "PLACEHOLDER — insert real company story below"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "[Insert the founding story of EquinoxSphere Technologies here — when and where the company was started, who the founders are, and what problem they set out to solve in the HR technology space.]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "[Describe the early product journey — the first version of OFC360, initial customers, key learnings, and the evolution from MVP to the full-featured platform it is today.]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "[Close with where the company is today — team size, customer base, key achievements, and a forward-looking statement about the future vision.]" })
					]
				})
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Values",
				title: "What guides us",
				subtitle: "These principles shape how we build, how we hire, and how we serve our customers."
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2",
				children: "Draft copy — review and edit before publishing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Team",
				title: "The people behind OFC360",
				subtitle: "We're a small, focused team building something we believe in."
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2",
				children: "Placeholder — replace with real team members"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
				children: teamPlaceholders.map((member, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
					delay: i * .06,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6",
						title: "PLACEHOLDER — replace with real team member",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-lg mb-4 opacity-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-muted-foreground",
								children: member.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-brand/60 mb-2",
								children: member.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground/60 italic",
								children: member.bio
							})
						]
					})
				}, member.id))
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Milestones",
				title: "Our journey so far"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2",
				children: "Placeholder — replace with real milestones"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 max-w-3xl mx-auto relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" }), timelinePlaceholders.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
					delay: i * .1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 mb-10 ${i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-brand shadow-glow" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:pl-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-brand/60 font-medium",
										children: t.year
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-xl font-bold mt-1 text-muted-foreground",
										children: t.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground/60 mt-1 italic",
										children: t.desc
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
						]
					})
				}, i))]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {
			title: "Join the journey",
			subtitle: "We're building the future of HR technology. Come see what OFC360 can do for your team."
		})
	] });
}
//#endregion
export { AboutPage as component };
