import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as Sparkles, Lr as ArrowRight, St as Minus, sr as Check } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-Y3jkzoME.mjs";
import { t as CTA } from "./CTA-B3uJBKE1.mjs";
import { t as FAQ } from "./FAQ-Bbw4MKbt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-B-ENJIY1.js
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
var plans = [
	{
		name: "Starter",
		tagline: "For small teams getting started with modern HR.",
		monthly: "₹49",
		yearly: "₹39",
		unit: "/employee/month",
		cta: "Start Free Trial",
		ctaLink: "/register",
		features: [
			"Core HR & employee profiles",
			"Up to 25 employees",
			"Basic attendance tracking",
			"Basic payroll processing",
			"Employee self-service portal",
			"Community support"
		]
	},
	{
		name: "Growth",
		tagline: "For growing teams that need full HR automation.",
		monthly: "₹99",
		yearly: "₹79",
		unit: "/employee/month",
		cta: "Start Free Trial",
		ctaLink: "/register",
		highlight: true,
		features: [
			"Everything in Starter",
			"Unlimited employees",
			"Recruitment module",
			"Performance management",
			"Advanced attendance & shifts",
			"Manager self-service portal",
			"Reports & analytics",
			"Priority support"
		]
	},
	{
		name: "Enterprise",
		tagline: "For large organizations with advanced needs.",
		monthly: "Custom",
		yearly: "Custom",
		unit: "",
		cta: "Contact Sales",
		ctaLink: "/contact",
		features: [
			"Everything in Growth",
			"Full AI Hub (70+ agents)",
			"Custom integrations",
			"Dedicated account manager",
			"SLA & uptime guarantees",
			"Custom compliance setup",
			"SSO / SCIM provisioning",
			"24/7 premium support"
		]
	}
];
var comparison = [
	{
		feature: "Core HR & Profiles",
		starter: "✓",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Employee Self-Service",
		starter: "✓",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Manager Self-Service",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Recruitment Module",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Attendance & Shifts",
		starter: "Basic",
		growth: "Advanced",
		enterprise: "Advanced"
	},
	{
		feature: "Payroll Processing",
		starter: "Basic",
		growth: "Full",
		enterprise: "Full + Custom"
	},
	{
		feature: "Leaves Management",
		starter: "✓",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Performance Management",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "AI Hub Agents",
		starter: "—",
		growth: "—",
		enterprise: "70+ Agents"
	},
	{
		feature: "Documents & Letters",
		starter: "Basic",
		growth: "Full",
		enterprise: "Full + Custom"
	},
	{
		feature: "Reports & Analytics",
		starter: "Basic",
		growth: "Advanced",
		enterprise: "Executive"
	},
	{
		feature: "Onboarding / Offboarding",
		starter: "✓",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Asset Management",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Travel & Expenses",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "SSO / SCIM",
		starter: "—",
		growth: "—",
		enterprise: "✓"
	},
	{
		feature: "Audit Logs",
		starter: "—",
		growth: "✓",
		enterprise: "✓"
	},
	{
		feature: "Support",
		starter: "Community",
		growth: "Priority",
		enterprise: "24/7 Premium"
	}
];
/**
* DRAFT — review these FAQ questions and answers before publishing.
* Adjust wording, add specifics, or remove as needed.
*/
var pricingFaqs = [
	{
		q: "What's included in each plan?",
		a: "Each plan builds on the previous one. Starter includes core HR, basic attendance, and basic payroll. Growth adds recruitment, performance management, advanced reporting, and manager self-service. Enterprise unlocks the full AI Hub with 70+ agents, custom integrations, SSO/SCIM, and dedicated support. [DRAFT — adjust details after confirming final feature sets]"
	},
	{
		q: "Can I switch plans mid-contract?",
		a: "Yes — you can upgrade or downgrade at any time. Changes are pro-rated automatically, so you only pay for what you use. [DRAFT — confirm pro-rating policy]"
	},
	{
		q: "Is there a free trial?",
		a: "Yes. All paid plans come with a free trial period so you can evaluate the full feature set before committing. No credit card required to start. [DRAFT — confirm trial length]"
	},
	{
		q: "How does per-employee pricing work?",
		a: "You're billed based on the number of active employees in your organization. Inactive or offboarded employees are not counted toward your billing. [DRAFT — confirm billing model details]"
	},
	{
		q: "Do you offer discounts for NGOs or educational institutions?",
		a: "Yes — we offer special pricing for verified nonprofits, NGOs, and educational institutions. Contact our sales team to learn more. [DRAFT — confirm discount policy and percentage]"
	}
];
function PricingPage() {
	const [yearly, setYearly] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						eyebrow: "Pricing",
						title: "Simple pricing that grows with your team",
						subtitle: "Start with a free trial. Upgrade when you're ready. No surprises."
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						delay: .1,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-full p-1 inline-flex text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setYearly(false),
									className: cn("px-5 py-2 rounded-full transition-colors", !yearly && "bg-foreground text-background"),
									children: "Monthly"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setYearly(true),
									className: cn("px-5 py-2 rounded-full transition-colors inline-flex items-center gap-2", yearly && "bg-foreground text-background"),
									children: [
										"Yearly",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs px-2 py-0.5 rounded-full bg-gradient-brand text-brand-foreground",
											children: "Save 20%"
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto",
						children: plans.map((p, i) => {
							const price = yearly ? p.yearly : p.monthly;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
								delay: i * .1,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("relative rounded-3xl p-7 flex flex-col h-full", p.highlight ? "bg-gradient-brand text-brand-foreground shadow-glow" : "glass"),
									children: [
										p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs font-medium border border-border",
											children: "Most popular"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-xl font-bold",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-sm mt-1", p.highlight ? "opacity-80" : "text-muted-foreground"),
											children: p.tagline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 mb-2",
											children: price === "Custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-4xl font-bold",
												children: "Custom"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-5xl font-bold",
												children: price
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("ml-1 text-sm", p.highlight ? "opacity-80" : "text-muted-foreground"),
												children: p.unit
											})] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: p.ctaLink,
											className: cn("mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-opacity text-sm", p.highlight ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"),
											children: [p.cta, p.name === "Enterprise" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-7 space-y-3 text-sm flex-1",
											children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-4 w-4 mt-0.5 shrink-0", p.highlight ? "" : "text-brand") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: p.highlight ? "" : "text-muted-foreground",
													children: f
												})]
											}, f))
										})
									]
								})
							}, p.name);
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Compare",
			title: "Feature comparison across plans"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
			delay: .1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 glass rounded-3xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm min-w-[600px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-5 font-medium w-[40%]",
									children: "Feature"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-5 font-medium",
									children: "Starter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-5 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: ["Growth", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-brand text-brand-foreground",
											children: "Popular"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-5 font-medium",
									children: "Enterprise"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: comparison.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: i % 2 ? "bg-secondary/30" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-5 font-medium",
									children: row.feature
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellValue, { value: row.starter })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellValue, { value: row.growth })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellValue, { value: row.enterprise })
								})
							]
						}, row.feature)) })]
					})
				})
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[400px] bg-gradient-brand blur-3xl opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Enterprise"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl sm:text-3xl font-bold tracking-tight",
						children: "Need a custom solution for your organization?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground max-w-xl mx-auto",
						children: "Get custom pricing, dedicated onboarding, SLA guarantees, and access to the full AI Hub with 70+ agents. Let's build something tailored for your team."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						className: "mt-6 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity text-sm",
						children: ["Contact Sales ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			})]
		}) }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {
			items: pricingFaqs,
			title: "Pricing questions",
			subtitle: "Common questions about our plans and billing.",
			eyebrow: "FAQ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {
			title: "Ready to modernize your HR?",
			subtitle: "Start your free trial today and see how OFC360 can transform your team's operations."
		})
	] });
}
function CellValue({ value }) {
	if (value === "✓") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-brand" });
	if (value === "—") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4 text-muted-foreground/40" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground",
		children: value
	});
}
//#endregion
export { PricingPage as component };
