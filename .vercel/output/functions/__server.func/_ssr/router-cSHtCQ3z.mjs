import { o as __toESM } from "../_runtime.mjs";
import { a as streamText, i as stepCountIs, o as require_react, r as convertToModelMessages } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as Provider_default } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { zt as store } from "./ofc360-store-Cb6xhYOw.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as bootstrapAuth } from "./auth-bootstrap-Dm6LCtAU.mjs";
import { t as ThemeProvider } from "./ThemeProvider-DWJ3wvub.mjs";
import { M as redirect, _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts, z as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { r as getAgent } from "./agents-Cctfc2QQ.mjs";
import { J as enumType, K as anyType, Q as stringType, V as tool, X as objectType, Y as numberType, Z as recordType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { n as posts } from "./blog-data-DcYz3eWl.mjs";
import { t as Route$124 } from "./blog._slug-CsVGCCRM.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$125 } from "./jobs.apply._ukey-DjJXky9s.mjs";
import { t as Route$126 } from "./onboarding-B7Dyisgj.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-cSHtCQ3z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BLjY4oQ6.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$123 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "OFC360 — AI-Powered HRMS Platform" },
			{
				name: "description",
				content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies."
			},
			{
				name: "author",
				content: "EquinoxSphere Technologies"
			},
			{
				property: "og:title",
				content: "OFC360"
			},
			{
				property: "og:description",
				content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@OFC360"
			}
		],
		links: [{
			rel: "icon",
			type: "image/svg+xml",
			href: "/favicon.svg"
		}, {
			rel: "stylesheet",
			href: styles_default
		}],
		scripts: [{
			src: "https://checkout.razorpay.com/v1/checkout.js",
			async: true
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$123.useRouteContext();
	(0, import_react.useEffect)(() => {
		bootstrapAuth();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider_default, {
		store,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				position: "top-right"
			})]
		})
	}) });
}
var $$splitComponentImporter$119 = () => import("./terms-BfAb8LYz.mjs");
var Route$122 = createFileRoute("/terms")({
	head: () => ({
		meta: [
			{ title: "Terms & Conditions — OFC360" },
			{
				name: "description",
				content: "The terms that govern your use of OFC360 by EquinoxSphere Technologies."
			},
			{
				property: "og:title",
				content: "Terms & Conditions — OFC360"
			},
			{
				property: "og:url",
				content: "/terms"
			}
		],
		links: [{
			rel: "canonical",
			href: "/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$119, "component")
});
var BASE_URL = "";
var Route$121 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const staticPaths = [
		"/",
		"/features",
		"/pricing",
		"/about",
		"/blog",
		"/faq",
		"/contact",
		"/privacy",
		"/terms"
	];
	const blogPaths = posts.map((p) => `/blog/${p.slug}`);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticPaths, ...blogPaths].map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$118 = () => import("./privacy-ChTj-Yk9.mjs");
var Route$120 = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy — OFC360" },
			{
				name: "description",
				content: "How EquinoxSphere Technologies collects, uses, and protects your data on OFC360."
			},
			{
				property: "og:title",
				content: "Privacy Policy — OFC360"
			},
			{
				property: "og:url",
				content: "/privacy"
			}
		],
		links: [{
			rel: "canonical",
			href: "/privacy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$118, "component")
});
var $$splitComponentImporter$117 = () => import("./pricing-J7-7Mcvi.mjs");
var Route$119 = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Pricing — OFC360" },
			{
				name: "description",
				content: "Simple, transparent pricing for OFC360 HRMS. Choose the plan that fits your team. Start with a free trial."
			},
			{
				property: "og:title",
				content: "Pricing — OFC360"
			},
			{
				property: "og:description",
				content: "Simple, transparent HRMS pricing for every team size."
			},
			{
				property: "og:url",
				content: "/pricing"
			}
		],
		links: [{
			rel: "canonical",
			href: "/pricing"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$117, "component")
});
/**
* DRAFT — review these FAQ questions and answers before publishing.
* Adjust wording, add specifics, or remove as needed.
*/
var $$splitComponentImporter$116 = () => import("./features-Cw4vzg3M.mjs");
var Route$118 = createFileRoute("/features")({
	head: () => ({
		meta: [
			{ title: "Features — OFC360" },
			{
				name: "description",
				content: "Explore everything OFC360 can do — planning, AI, analytics, integrations, and more."
			},
			{
				property: "og:title",
				content: "Features — OFC360"
			},
			{
				property: "og:description",
				content: "Every capability OFC360 offers, in detail."
			},
			{
				property: "og:url",
				content: "/features"
			}
		],
		links: [{
			rel: "canonical",
			href: "/features"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$116, "component")
});
var $$splitComponentImporter$115 = () => import("./faq-CDIonDg3.mjs");
var Route$117 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: "FAQ — OFC360" },
			{
				name: "description",
				content: "Answers to common questions about OFC360 — product, pricing, security, and more."
			},
			{
				property: "og:title",
				content: "FAQ — OFC360"
			},
			{
				property: "og:description",
				content: "Everything you need to know about OFC360."
			},
			{
				property: "og:url",
				content: "/faq"
			}
		],
		links: [{
			rel: "canonical",
			href: "/faq"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$115, "component")
});
var $$splitComponentImporter$114 = () => import("./dashboard-BmPkBKqG.mjs");
var Route$116 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$114, "component")
});
var $$splitComponentImporter$113 = () => import("./contact-BnaV5rv0.mjs");
var Route$115 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact — OFC360" },
			{
				name: "description",
				content: "Get in touch with the OFC360 team. We respond within one business day."
			},
			{
				property: "og:title",
				content: "Contact — OFC360"
			},
			{
				property: "og:description",
				content: "Talk to the OFC360 team."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$113, "component")
});
var $$splitComponentImporter$112 = () => import("./blog-GHsbigBI.mjs");
var Route$114 = createFileRoute("/blog")({
	head: () => ({
		meta: [
			{ title: "Blog — ofc360" },
			{
				name: "description",
				content: "Stories, product updates, and ideas from the ofc360 team."
			},
			{
				property: "og:title",
				content: "Blog — ofc360"
			},
			{
				property: "og:description",
				content: "Stories and ideas from the team building ofc360."
			},
			{
				property: "og:url",
				content: "/blog"
			}
		],
		links: [{
			rel: "canonical",
			href: "/blog"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$112, "component")
});
var $$splitComponentImporter$111 = () => import("./ai-Cl-_Gsl1.mjs");
var Route$113 = createFileRoute("/ai")({
	head: () => ({ meta: [{ title: "AI Hub — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$111, "component")
});
var $$splitComponentImporter$110 = () => import("./about-z96SeulO.mjs");
var Route$112 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About OFC360 — EquinoxSphere Technologies" },
			{
				name: "description",
				content: "Learn about EquinoxSphere Technologies and the team building OFC360 — the AI-powered HRMS platform for modern organizations."
			},
			{
				property: "og:title",
				content: "About OFC360 — EquinoxSphere Technologies"
			},
			{
				property: "og:description",
				content: "Our mission, our story, and the team building OFC360."
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$110, "component")
});
/**
* DRAFT COPY — review and edit before publishing.
* These values are suggested for an HR-tech / AI company.
* Replace or adjust wording as needed.
*/
/**
* PLACEHOLDER — replace with real team member names, titles, and bios.
* Do NOT go live with these placeholder entries.
*/
/**
* PLACEHOLDER — replace with real milestones.
* These are structural placeholders only.
*/
var $$splitComponentImporter$109 = () => import("./routes-BN6pRjPl.mjs");
var Route$111 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "OFC360 — AI-Powered HRMS Platform by EquinoxSphere Technologies" },
			{
				name: "description",
				content: "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance management, and 70+ AI agents — all in one platform."
			},
			{
				property: "og:title",
				content: "OFC360 — AI-Powered HRMS Platform"
			},
			{
				property: "og:description",
				content: "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance, and 70+ AI agents — all in one platform."
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$109, "component")
});
var $$splitComponentImporter$108 = () => import("./dashboard.index-BnXTVCX7.mjs");
var Route$110 = createFileRoute("/dashboard/")({
	head: () => ({ meta: [{ title: "Executive Command Center — ofc360 HR" }, {
		name: "description",
		content: "ofc360 HR Enterprise Executive Dashboard — a world-class HR operating system command center with real-time KPIs, approvals, analytics, recruitment, payroll, attendance, and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$108, "component")
});
var $$splitComponentImporter$107 = () => import("./blog.index-DBYsksp1.mjs");
var Route$109 = createFileRoute("/blog/")({
	head: () => ({
		meta: [
			{ title: "Blog — OFC360" },
			{
				name: "description",
				content: "Stories, product updates, and ideas from the OFC360 team."
			},
			{
				property: "og:title",
				content: "Blog — OFC360"
			},
			{
				property: "og:description",
				content: "Stories and ideas from the team building OFC360."
			},
			{
				property: "og:url",
				content: "/blog"
			}
		],
		links: [{
			rel: "canonical",
			href: "/blog"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$107, "component")
});
var $$splitComponentImporter$106 = () => import("./ai.index-B2GKbPAC.mjs");
var Route$108 = createFileRoute("/ai/")({
	head: () => ({ meta: [{ title: "Enterprise AI Workspace — ofc360" }, {
		name: "description",
		content: "Upgraded enterprise-grade AI hub operating system for human resource workflows."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$106, "component")
});
var $$splitComponentImporter$105 = () => import("./dashboard.visitors-VBDhkR_N.mjs");
var Route$107 = createFileRoute("/dashboard/visitors")({
	head: () => ({ meta: [{ title: "Visitor Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$105, "component")
});
var $$splitComponentImporter$104 = () => import("./dashboard.travel-GPP4yu3l.mjs");
var Route$106 = createFileRoute("/dashboard/travel")({
	head: () => ({ meta: [{ title: "Travel Requests — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$104, "component")
});
var $$splitComponentImporter$103 = () => import("./dashboard.timesheets-Dj4VkerE.mjs");
var Route$105 = createFileRoute("/dashboard/timesheets")({
	head: () => ({ meta: [{ title: "Timesheets — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$103, "component")
});
var $$splitComponentImporter$102 = () => import("./dashboard.timeline-CGpWqASx.mjs");
var Route$104 = createFileRoute("/dashboard/timeline")({
	head: () => ({ meta: [{ title: "Employee Timeline — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$102, "component")
});
var $$splitComponentImporter$101 = () => import("./dashboard.settings-jWaC19jL.mjs");
var Route$103 = createFileRoute("/dashboard/settings")({
	head: () => ({ meta: [{ title: "Settings & Administration — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$101, "component")
});
var $$splitComponentImporter$100 = () => import("./dashboard.roles-VyWGUVUf.mjs");
var Route$102 = createFileRoute("/dashboard/roles")({
	head: () => ({ meta: [{ title: "Roles & Permissions — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$100, "component")
});
var $$splitComponentImporter$99 = () => import("./dashboard.reports-Bhi_6ngp.mjs");
var Route$101 = createFileRoute("/dashboard/reports")({
	head: () => ({ meta: [{ title: "Reports Dashboard — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$99, "component")
});
var $$splitComponentImporter$98 = () => import("./recruitment-DvVQnCRS.mjs");
var Route$100 = createFileRoute("/dashboard/recruitment")({
	head: () => ({ meta: [{ title: "Recruitment — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$98, "component")
});
var $$splitComponentImporter$97 = () => import("./dashboard.performance-BqvBcpMH.mjs");
var Route$99 = createFileRoute("/dashboard/performance")({
	head: () => ({ meta: [{ title: "Performance — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$97, "component")
});
var $$splitComponentImporter$96 = () => import("./dashboard.people-B0ZgVmTj.mjs");
var Route$98 = createFileRoute("/dashboard/people")({
	head: () => ({ meta: [{ title: "People Hub — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$96, "component")
});
var $$splitComponentImporter$95 = () => import("./dashboard.payroll-Bck0gYz0.mjs");
var Route$97 = createFileRoute("/dashboard/payroll")({
	head: () => ({ meta: [{ title: "Payroll — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$95, "component")
});
var $$splitComponentImporter$94 = () => import("./dashboard.onboarding-checklist-DO6k5rXr.mjs");
var Route$96 = createFileRoute("/dashboard/onboarding-checklist")({
	head: () => ({ meta: [{ title: "Onboarding Checklist — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$94, "component")
});
var $$splitComponentImporter$93 = () => import("./dashboard.offboarding-CnJl0K0k.mjs");
var Route$95 = createFileRoute("/dashboard/offboarding")({
	head: () => ({ meta: [{ title: "Offboarding Automation — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$93, "component")
});
var $$splitComponentImporter$92 = () => import("./dashboard.managers-BHnrOHmq.mjs");
var Route$94 = createFileRoute("/dashboard/managers")({
	head: () => ({ meta: [{ title: "Managers — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$92, "component")
});
var $$splitComponentImporter$91 = () => import("./dashboard.manager-DoFVdeDm.mjs");
var Route$93 = createFileRoute("/dashboard/manager")({
	head: () => ({ meta: [{ title: "Manager Dashboard — ofc360 HR" }, {
		name: "description",
		content: "ofc360 HR Manager Dashboard — manage your team's attendance, leave, performance, assets, recruitment and more from one place."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$91, "component")
});
var $$splitComponentImporter$90 = () => import("./dashboard.lifecycle-CudX2D89.mjs");
var Route$92 = createFileRoute("/dashboard/lifecycle")({
	head: () => ({ meta: [{ title: "Employee Lifecycle — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
var $$splitComponentImporter$89 = () => import("./dashboard.leaves-ygFhqxo0.mjs");
var Route$91 = createFileRoute("/dashboard/leaves")({
	head: () => ({ meta: [{ title: "Leaves — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$89, "component")
});
var $$splitComponentImporter$88 = () => import("./dashboard.hr-ops-DoFpAI6q.mjs");
var Route$90 = createFileRoute("/dashboard/hr-ops")({
	head: () => ({ meta: [{ title: "Operations — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$88, "component")
});
var $$splitComponentImporter$87 = () => import("./dashboard.hr-D6Mqx1hq.mjs");
var Route$89 = createFileRoute("/dashboard/hr")({
	head: () => ({ meta: [{ title: "HR Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
var $$splitComponentImporter$86 = () => import("./dashboard.expenses-D5NvWAGM.mjs");
var Route$88 = createFileRoute("/dashboard/expenses")({
	head: () => ({ meta: [{ title: "Expense Claims — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$86, "component")
});
var $$splitComponentImporter$85 = () => import("./dashboard.exit-management-8zD7hbnY.mjs");
var Route$87 = createFileRoute("/dashboard/exit-management")({
	head: () => ({ meta: [{ title: "Exit Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$85, "component")
});
var $$splitComponentImporter$84 = () => import("./dashboard.exit-CaW8CCUh.mjs");
var Route$86 = createFileRoute("/dashboard/exit")({
	head: () => ({ meta: [{ title: "Exit Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$84, "component")
});
var $$splitComponentImporter$83 = () => import("./dashboard.employees-ymT8th78.mjs");
var Route$85 = createFileRoute("/dashboard/employees")({
	validateSearch: (search) => {
		return {
			page: search.page ? Number(search.page) : void 0,
			limit: search.limit ? Number(search.limit) : void 0,
			search: search.search ? String(search.search) : void 0,
			department: search.department ? String(search.department) : void 0,
			designation: search.designation ? String(search.designation) : void 0,
			shift: search.shift ? String(search.shift) : void 0,
			status: search.status ? String(search.status) : void 0,
			sort: search.sort ? String(search.sort) : void 0,
			order: search.order === "asc" || search.order === "desc" ? search.order : void 0
		};
	},
	head: () => ({ meta: [{ title: "Employees — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$83, "component")
});
var $$splitComponentImporter$82 = () => import("./dashboard.employee-B4qg0TF9.mjs");
var Route$84 = createFileRoute("/dashboard/employee")({
	head: () => ({ meta: [{ title: "My Dashboard — ofc360 HR" }, {
		name: "description",
		content: "ofc360 HR Employee Self-Service Dashboard — manage your attendance, leaves, payslips, performance goals, documents, and assets."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$82, "component")
});
var $$splitComponentImporter$81 = () => import("./dashboard.documents-Bv0rZGAR.mjs");
var Route$83 = createFileRoute("/dashboard/documents")({
	head: () => ({ meta: [{ title: "Documents — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$81, "component")
});
var $$splitComponentImporter$80 = () => import("./dashboard.departments-DBqXcdEU.mjs");
var Route$82 = createFileRoute("/dashboard/departments")({
	head: () => ({ meta: [{ title: "Departments — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$80, "component")
});
var $$splitComponentImporter$79 = () => import("./dashboard.communication-Dsed1_cq.mjs");
var Route$81 = createFileRoute("/dashboard/communication")({
	head: () => ({ meta: [{ title: "Communication & Help Desk — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("./dashboard.billing-BhApX7xi.mjs");
var Route$80 = createFileRoute("/dashboard/billing")({
	head: () => ({ meta: [{ title: "Billing & Subscriptions — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("./dashboard.audit-logs-BAfa0Ql6.mjs");
var Route$79 = createFileRoute("/dashboard/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$77, "component")
});
var $$splitComponentImporter$76 = () => import("./dashboard.attendance-DzTAMzyy.mjs");
var Route$78 = createFileRoute("/dashboard/attendance")({
	head: () => ({ meta: [{ title: "Attendance — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$76, "component")
});
var $$splitComponentImporter$75 = () => import("./dashboard.assets-0xusd3S_.mjs");
var Route$77 = createFileRoute("/dashboard/assets")({
	head: () => ({ meta: [{ title: "Asset Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("./dashboard.asset-management-B_FxegHS.mjs");
var Route$76 = createFileRoute("/dashboard/asset-management")({
	beforeLoad: () => {
		throw redirect({
			to: "/dashboard/assets",
			replace: true
		});
	},
	head: () => ({ meta: [{ title: "Asset Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
var $$splitComponentImporter$73 = () => import("./dashboard.ai-insights-Cy4yvx1h.mjs");
var Route$75 = createFileRoute("/dashboard/ai-insights")({
	head: () => ({ meta: [{ title: "AI Insights — ofc360" }, {
		name: "description",
		content: "AI-powered workforce intelligence and automation for your organization."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$73, "component")
});
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable-ai-gateway",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: { "Lovable-API-Key": apiKey }
	});
}
var Route$74 = createFileRoute("/api/payroll-copilot")({ server: { handlers: { POST: async ({ request }) => {
	const { messages } = await request.json();
	if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });
	const key = process.env.LOVABLE_API_KEY;
	if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
	return streamText({
		model: createLovableAiGatewayProvider(key)("google/gemini-3-flash-preview"),
		system: "You are ofc360 Payroll Copilot, an expert AI assistant for HR & payroll teams. Help with salary processing, payslips, deductions, tax (PF, ESI, TDS, income tax), bonuses, reimbursements, compliance, bank transfers, and payroll reports. Be concise, use bullet points and tables when useful, and ask for missing details when needed.",
		messages: await convertToModelMessages(messages)
	}).toUIMessageStreamResponse({ originalMessages: messages });
} } } });
/**
* Server-side HR tool catalog exposed to AI Brain agents.
*
* Phase 1: in-process demo data so agents can demonstrate the full
* loop (tool call → tool result → narrated answer) without a DB.
* Swap these implementations for real DB / service calls in later phases —
* the tool signatures are the public contract.
*/
var DEMO_EMPLOYEES = [
	{
		id: "E-1001",
		name: "Priya Singh",
		email: "priya.singh@ofc360.io",
		department: "Engineering",
		role: "Senior Engineer",
		manager: "Anita Rao",
		joinedOn: "2021-03-14",
		ctcLpa: 28,
		performance: 88,
		attendancePct: 97,
		unplannedAbsencesMtd: 0,
		trainingCompletionPct: 100,
		riskScore: 18,
		leaveBalance: {
			casual: 4,
			sick: 6,
			earned: 11
		}
	},
	{
		id: "E-1002",
		name: "Rahul Mehta",
		email: "rahul.mehta@ofc360.io",
		department: "Engineering",
		role: "Engineer II",
		manager: "Anita Rao",
		joinedOn: "2022-07-01",
		ctcLpa: 18,
		performance: 62,
		attendancePct: 82,
		unplannedAbsencesMtd: 4,
		trainingCompletionPct: 40,
		riskScore: 71,
		leaveBalance: {
			casual: 2,
			sick: 5,
			earned: 6
		}
	},
	{
		id: "E-1003",
		name: "Anita Rao",
		email: "anita.rao@ofc360.io",
		department: "Engineering",
		role: "Engineering Manager",
		manager: "Vikram Shah",
		joinedOn: "2019-01-10",
		ctcLpa: 46,
		performance: 91,
		attendancePct: 96,
		unplannedAbsencesMtd: 1,
		trainingCompletionPct: 90,
		riskScore: 22,
		leaveBalance: {
			casual: 5,
			sick: 7,
			earned: 14
		}
	},
	{
		id: "E-1004",
		name: "Maya Iyer",
		email: "maya.iyer@ofc360.io",
		department: "Design",
		role: "Senior Designer",
		manager: "Karan Verma",
		joinedOn: "2020-11-22",
		ctcLpa: 24,
		performance: 84,
		attendancePct: 94,
		unplannedAbsencesMtd: 1,
		trainingCompletionPct: 80,
		riskScore: 34,
		leaveBalance: {
			casual: 3,
			sick: 6,
			earned: 9
		}
	},
	{
		id: "E-1005",
		name: "Vikram Shah",
		email: "vikram.shah@ofc360.io",
		department: "Leadership",
		role: "VP Engineering",
		manager: "CEO",
		joinedOn: "2017-05-02",
		ctcLpa: 78,
		performance: 93,
		attendancePct: 98,
		unplannedAbsencesMtd: 0,
		trainingCompletionPct: 100,
		riskScore: 12,
		leaveBalance: {
			casual: 6,
			sick: 8,
			earned: 18
		}
	},
	{
		id: "E-1006",
		name: "Karan Verma",
		email: "karan.verma@ofc360.io",
		department: "Design",
		role: "Design Lead",
		manager: "Vikram Shah",
		joinedOn: "2019-09-15",
		ctcLpa: 38,
		performance: 80,
		attendancePct: 92,
		unplannedAbsencesMtd: 2,
		trainingCompletionPct: 70,
		riskScore: 41,
		leaveBalance: {
			casual: 4,
			sick: 6,
			earned: 10
		}
	},
	{
		id: "E-1007",
		name: "Neha Kapoor",
		email: "neha.kapoor@ofc360.io",
		department: "Sales",
		role: "Account Executive",
		manager: "Sandeep Roy",
		joinedOn: "2023-02-01",
		ctcLpa: 14,
		performance: 58,
		attendancePct: 78,
		unplannedAbsencesMtd: 5,
		trainingCompletionPct: 25,
		riskScore: 82,
		leaveBalance: {
			casual: 1,
			sick: 4,
			earned: 3
		}
	},
	{
		id: "E-1008",
		name: "Sandeep Roy",
		email: "sandeep.roy@ofc360.io",
		department: "Sales",
		role: "Sales Manager",
		manager: "Vikram Shah",
		joinedOn: "2018-04-19",
		ctcLpa: 42,
		performance: 76,
		attendancePct: 88,
		unplannedAbsencesMtd: 2,
		trainingCompletionPct: 60,
		riskScore: 48,
		leaveBalance: {
			casual: 3,
			sick: 5,
			earned: 8
		}
	}
];
var DEMO_POLICIES = [
	{
		id: "POL-LEAVE-001",
		title: "Leave Policy",
		section: "3.2 Casual Leave",
		content: "Each full-time employee accrues 12 casual leave days per calendar year, credited monthly. Unused casual leave does not carry over."
	},
	{
		id: "POL-LEAVE-002",
		title: "Leave Policy",
		section: "3.5 Paternity Leave",
		content: "Eligible employees are entitled to 15 working days of paid paternity leave, to be availed within 6 months of the child's birth."
	},
	{
		id: "POL-LEAVE-003",
		title: "Leave Policy",
		section: "3.4 Maternity Leave",
		content: "26 weeks of paid maternity leave as per the Maternity Benefit Act, 2017, with optional work-from-home for up to 12 weeks after returning."
	},
	{
		id: "POL-WFH-001",
		title: "Remote Work Policy",
		section: "2.1 Eligibility",
		content: "Confirmed employees may work remotely up to 3 days per week subject to manager approval. Fully remote roles are evaluated case-by-case."
	},
	{
		id: "POL-POSH-001",
		title: "PoSH Policy",
		section: "5 Complaint Process",
		content: "Complaints can be raised confidentially via posh@ofc360.io or to any IC member. Inquiry must complete within 90 days under the PoSH Act, 2013."
	},
	{
		id: "POL-PAY-001",
		title: "Payroll Policy",
		section: "4 Salary Cycle",
		content: "Salaries are credited on the last working day of each month. Payslips are available in the employee portal by the 1st of the following month."
	},
	{
		id: "POL-EXP-001",
		title: "Reimbursement Policy",
		section: "2 WFH Internet",
		content: "Up to ₹1,500 / month is reimbursable for home internet on production of an invoice in the employee's name."
	}
];
var hrTools = {
	searchEmployees: tool({
		description: "Search the employee directory by name fragment, department, role, or manager. Returns up to 20 matching employees with summary fields.",
		inputSchema: objectType({
			query: stringType().optional().describe("Free-text fragment to match against name, email, role, or department"),
			department: stringType().optional(),
			manager: stringType().optional(),
			minRiskScore: numberType().min(0).max(100).optional().describe("Only return employees with attrition risk at or above this score"),
			limit: numberType().min(1).max(50).optional().default(20)
		}),
		execute: async ({ query, department, manager, minRiskScore, limit = 20 }) => {
			const q = (query ?? "").toLowerCase();
			const results = DEMO_EMPLOYEES.filter((e) => {
				if (q && !`${e.name} ${e.email} ${e.role} ${e.department}`.toLowerCase().includes(q)) return false;
				if (department && e.department.toLowerCase() !== department.toLowerCase()) return false;
				if (manager && !e.manager.toLowerCase().includes(manager.toLowerCase())) return false;
				if (minRiskScore !== void 0 && e.riskScore < minRiskScore) return false;
				return true;
			}).slice(0, limit);
			return {
				count: results.length,
				employees: results
			};
		}
	}),
	getEmployee: tool({
		description: "Fetch a full employee profile by employee id (e.g. E-1001) or exact name.",
		inputSchema: objectType({ idOrName: stringType() }),
		execute: async ({ idOrName }) => {
			const needle = idOrName.toLowerCase().trim();
			const match = DEMO_EMPLOYEES.find((e) => e.id.toLowerCase() === needle || e.name.toLowerCase() === needle);
			if (!match) return {
				found: false,
				idOrName
			};
			return {
				found: true,
				employee: match
			};
		}
	}),
	getLeaveBalance: tool({
		description: "Return leave balance (casual, sick, earned) for an employee id or name. Defaults to the demo signed-in user E-1001 if no id provided.",
		inputSchema: objectType({ employeeId: stringType().optional() }),
		execute: async ({ employeeId }) => {
			const target = employeeId ? DEMO_EMPLOYEES.find((e) => e.id.toLowerCase() === employeeId.toLowerCase() || e.name.toLowerCase() === employeeId.toLowerCase()) : DEMO_EMPLOYEES[0];
			if (!target) return {
				found: false,
				employeeId
			};
			return {
				found: true,
				employee: {
					id: target.id,
					name: target.name
				},
				leaveBalance: target.leaveBalance,
				asOf: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			};
		}
	}),
	attritionRiskList: tool({
		description: "Return the top-N employees by predicted attrition risk, optionally scoped to a department.",
		inputSchema: objectType({
			department: stringType().optional(),
			topN: numberType().min(1).max(50).optional().default(10)
		}),
		execute: async ({ department, topN = 10 }) => {
			const ranked = [...department ? DEMO_EMPLOYEES.filter((e) => e.department.toLowerCase() === department.toLowerCase()) : DEMO_EMPLOYEES].sort((a, b) => b.riskScore - a.riskScore).slice(0, topN).map((e) => ({
				id: e.id,
				name: e.name,
				department: e.department,
				role: e.role,
				riskScore: e.riskScore,
				performance: e.performance,
				attendancePct: e.attendancePct,
				manager: e.manager
			}));
			return {
				count: ranked.length,
				scope: department ?? "company",
				employees: ranked
			};
		}
	}),
	searchPolicies: tool({
		description: "Retrieval over the indexed company policies & SOP knowledge base. Returns the top matching policy snippets with section citations.",
		inputSchema: objectType({
			query: stringType().describe("Natural-language question or topic, e.g. 'paternity leave' or 'WFH internet reimbursement'"),
			topK: numberType().min(1).max(5).optional().default(3)
		}),
		execute: async ({ query, topK = 3 }) => {
			const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
			const scored = DEMO_POLICIES.map((p) => {
				const hay = `${p.title} ${p.section} ${p.content}`.toLowerCase();
				return {
					policy: p,
					score: terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0)
				};
			}).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, topK).map((s) => s.policy);
			return {
				count: scored.length,
				query,
				results: scored
			};
		}
	}),
	proposeAction: tool({
		description: "Stage an action that requires human approval before execution (e.g. apply leave, send email, generate offer letter, approve reimbursement). Returns a structured proposal — DOES NOT execute the action.",
		inputSchema: objectType({
			kind: enumType([
				"apply_leave",
				"send_email",
				"generate_letter",
				"approve_request",
				"reject_request",
				"reimburse_expense",
				"create_employee",
				"schedule_interview",
				"trigger_workflow"
			]),
			summary: stringType().describe("One-sentence human-readable summary"),
			payload: recordType(stringType(), anyType()).describe("Structured fields the executor would consume"),
			requiresApprovalFrom: stringType().optional().describe("Role that must approve, e.g. 'manager', 'hr_admin', 'finance'")
		}),
		execute: async (input) => ({
			status: "pending_approval",
			proposalId: `prop_${Math.random().toString(36).slice(2, 10)}`,
			proposedAt: (/* @__PURE__ */ new Date()).toISOString(),
			...input
		})
	})
};
var ALLOWED_MODELS = /* @__PURE__ */ new Set([
	"google/gemini-3-flash-preview",
	"google/gemini-2.5-flash",
	"google/gemini-2.5-pro",
	"openai/gpt-5",
	"openai/gpt-5-mini"
]);
var Route$73 = createFileRoute("/api/ai-brain")({ server: { handlers: { POST: async ({ request }) => {
	const { messages, agentId, model: modelOverride } = await request.json();
	if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });
	const key = process.env.LOVABLE_API_KEY;
	if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
	const agent = getAgent(agentId);
	const modelName = modelOverride && ALLOWED_MODELS.has(modelOverride) ? modelOverride : "google/gemini-3-flash-preview";
	const gateway = createLovableAiGatewayProvider(key);
	try {
		return streamText({
			model: gateway(modelName),
			system: agent.system,
			messages: await convertToModelMessages(messages),
			tools: hrTools,
			stopWhen: stepCountIs(50)
		}).toUIMessageStreamResponse({
			originalMessages: messages,
			headers: {
				"X-ofc360-Agent": agent.id,
				"X-ofc360-Model": modelName
			}
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return new Response(JSON.stringify({
			error: "AI Brain stream failed",
			detail: message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var $$splitComponentImporter$72 = () => import("./ai.workforce-planning-CVMjTCLo.mjs");
var Route$72 = createFileRoute("/ai/workforce-planning")({
	head: () => ({ meta: [{ title: "AI Workforce Planning — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$72, "component")
});
var $$splitComponentImporter$71 = () => import("./ai.workforce-insights-De6S8Y9t.mjs");
var Route$71 = createFileRoute("/ai/workforce-insights")({
	head: () => ({ meta: [{ title: "AI Workforce Insights — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
var $$splitComponentImporter$70 = () => import("./ai.recruiter-tVS7MDYv.mjs");
var Route$70 = createFileRoute("/ai/recruiter")({
	head: () => ({ meta: [{ title: "AI Recruiter — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$70, "component")
});
var $$splitComponentImporter$69 = () => import("./ai.policy-assistant-DYapvk76.mjs");
var Route$69 = createFileRoute("/ai/policy-assistant")({
	head: () => ({ meta: [{ title: "AI Policy Assistant — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
var $$splitComponentImporter$68 = () => import("./ai.performance-coach-DuZ3ygeH.mjs");
var Route$68 = createFileRoute("/ai/performance-coach")({
	head: () => ({ meta: [{ title: "AI Performance Coach — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
var $$splitComponentImporter$67 = () => import("./ai.payroll-insights-C3Jun1bL.mjs");
var Route$67 = createFileRoute("/ai/payroll-insights")({
	head: () => ({ meta: [{ title: "AI Payroll Insights — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("./ai.meeting-intelligence-CUNlFpp_.mjs");
var Route$66 = createFileRoute("/ai/meeting-intelligence")({
	head: () => ({ meta: [{ title: "AI Meeting Intelligence — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$66, "component")
});
var $$splitComponentImporter$65 = () => import("./ai.leave-assistant-BGdeFAr0.mjs");
var Route$65 = createFileRoute("/ai/leave-assistant")({
	head: () => ({ meta: [{ title: "AI Leave Assistant — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("./ai.employee-health-BG5ThCOy.mjs");
var Route$64 = createFileRoute("/ai/employee-health")({
	head: () => ({ meta: [{ title: "AI Employee Health — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$64, "component")
});
var $$splitComponentImporter$63 = () => import("./ai.document-generator-B9_krUBs.mjs");
var Route$63 = createFileRoute("/ai/document-generator")({
	head: () => ({ meta: [{ title: "AI Document Generator — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
var $$splitComponentImporter$62 = () => import("./ai.compliance-monitor-B--t49Kd.mjs");
var Route$62 = createFileRoute("/ai/compliance-monitor")({
	head: () => ({ meta: [{ title: "AI Compliance Monitor — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./ai.chat-assistant-3C4sweEZ.mjs");
var Route$61 = createFileRoute("/ai/chat-assistant")({
	head: () => ({ meta: [{ title: "AI Chat Assistant — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
var $$splitComponentImporter$60 = () => import("./ai.brain-BuG0CrCj.mjs");
var Route$60 = createFileRoute("/ai/brain")({
	head: () => ({ meta: [{ title: "AI Insight 2.0 — Autonomous HR Brain | ofc360" }, {
		name: "description",
		content: "An autonomous AI HR brain: 15+ specialist agents that recruit, evaluate, predict attrition, run payroll, draft letters and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("./ai.attendance-monitor-BIWmeQpu.mjs");
var Route$59 = createFileRoute("/ai/attendance-monitor")({
	head: () => ({ meta: [{ title: "AI Attendance Monitor — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
var $$splitComponentImporter$58 = () => import("./ai.analytics-center-CsQTNHQ9.mjs");
var Route$58 = createFileRoute("/ai/analytics-center")({
	head: () => ({ meta: [{ title: "AI Analytics Center — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
var $$splitComponentImporter$57 = () => import("./verify-reset-otp-DFntHfN5.mjs");
var Route$57 = createFileRoute("/_auth/verify-reset-otp")({
	validateSearch: objectType({ email: stringType().optional() }),
	head: () => ({ meta: [{ title: "Verify OTP — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("./verify-email-RvCT6Mjy.mjs");
var Route$56 = createFileRoute("/_auth/verify-email")({
	head: () => ({ meta: [{ title: "Verify your email — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("./reset-password-B_UyI4eV.mjs");
var Route$55 = createFileRoute("/_auth/reset-password")({
	validateSearch: objectType({
		email: stringType().optional(),
		resetToken: stringType().optional()
	}),
	head: () => ({ meta: [{ title: "Set new password — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("./register-CdZ4ZdBi.mjs");
var Route$54 = createFileRoute("/_auth/register")({
	head: () => ({ meta: [{ title: "Create your workspace — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./login-nGfzUvKs.mjs");
var Route$53 = createFileRoute("/_auth/login")({
	head: () => ({ meta: [{ title: "Sign in — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./forgot-password-D5uwxY22.mjs");
var Route$52 = createFileRoute("/_auth/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./recruitment-DTKdkOFs.mjs");
var Route$51 = createFileRoute("/dashboard/recruitment/")({
	head: () => ({ meta: [{ title: "Recruitment Workspace — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./dashboard.payroll.index-Bp_W9nZf.mjs");
var Route$50 = createFileRoute("/dashboard/payroll/")({
	head: () => ({ meta: [{ title: "Payroll Hub — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./dashboard.attendance.index-DqrG4gxh.mjs");
var Route$49 = createFileRoute("/dashboard/attendance/")({
	head: () => ({ meta: [{ title: "Attendance — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./vendors-bv-CIcGU.mjs");
var Route$48 = createFileRoute("/dashboard/recruitment/vendors")({
	head: () => ({ meta: [{ title: "Vendors — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./templates-DIKgiNDV.mjs");
var Route$47 = createFileRoute("/dashboard/recruitment/templates")({
	head: () => ({ meta: [{ title: "Templates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./talent-pool-CqiGrPu6.mjs");
var Route$46 = createFileRoute("/dashboard/recruitment/talent-pool")({
	head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./search-Bc9ML57s.mjs");
var Route$45 = createFileRoute("/dashboard/recruitment/search")({
	head: () => ({ meta: [{ title: "Search — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./scorecards-BHPRjmtJ.mjs");
var Route$44 = createFileRoute("/dashboard/recruitment/scorecards")({
	head: () => ({ meta: [{ title: "Scorecards — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./resume-intelligence-Cj4ArdPA.mjs");
var Route$43 = createFileRoute("/dashboard/recruitment/resume-intelligence")({
	head: () => ({ meta: [{ title: "Resume Intelligence — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./requisitions-d0jHpUnJ.mjs");
var Route$42 = createFileRoute("/dashboard/recruitment/requisitions")({
	head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./reports-CAb_zOwD.mjs");
var Route$41 = createFileRoute("/dashboard/recruitment/reports")({
	head: () => ({ meta: [{ title: "Reports — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./referrals-CR6x0WNa.mjs");
var Route$40 = createFileRoute("/dashboard/recruitment/referrals")({
	head: () => ({ meta: [{ title: "Referrals — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./pipeline-C4NS5aB5.mjs");
var Route$39 = createFileRoute("/dashboard/recruitment/pipeline")({
	head: () => ({ meta: [{ title: "Pipeline — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./onboarding-CudnXd8h.mjs");
var Route$38 = createFileRoute("/dashboard/recruitment/onboarding")({
	head: () => ({ meta: [{ title: "Onboarding — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./offers-DBkvBK9M.mjs");
var Route$37 = createFileRoute("/dashboard/recruitment/offers")({
	head: () => ({ meta: [{ title: "Offers — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./notifications-Pe1lmDhU.mjs");
var Route$36 = createFileRoute("/dashboard/recruitment/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./interviews-Cw7eyH_G.mjs");
var Route$35 = createFileRoute("/dashboard/recruitment/interviews")({
	head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./import-export-CGgVM_tP.mjs");
var Route$34 = createFileRoute("/dashboard/recruitment/import-export")({
	head: () => ({ meta: [{ title: "Import / Export — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./crm-DarqSRlq.mjs");
var Route$33 = createFileRoute("/dashboard/recruitment/crm")({
	head: () => ({ meta: [{ title: "CRM — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./copilot-DdEn_OB7.mjs");
var Route$32 = createFileRoute("/dashboard/recruitment/copilot")({
	head: () => ({ meta: [{ title: "Copilot — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./compliance-BoTw0G-1.mjs");
var Route$31 = createFileRoute("/dashboard/recruitment/compliance")({
	head: () => ({ meta: [{ title: "Compliance — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./career-site-B-dMU3MP.mjs");
var Route$30 = createFileRoute("/dashboard/recruitment/career-site")({
	head: () => ({ meta: [{ title: "Career Site — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./candidates-W3Aoi1q8.mjs");
var Route$29 = createFileRoute("/dashboard/recruitment/candidates")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./calendar-DpdNJwtO.mjs");
var Route$28 = createFileRoute("/dashboard/recruitment/calendar")({
	head: () => ({ meta: [{ title: "Calendar — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./automation-CjRlN5sV.mjs");
var Route$27 = createFileRoute("/dashboard/recruitment/automation")({
	head: () => ({ meta: [{ title: "Automation — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./analytics-B8BU3Lc6.mjs");
var Route$26 = createFileRoute("/dashboard/recruitment/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./ai-CyEfizKo.mjs");
var Route$25 = createFileRoute("/dashboard/recruitment/ai")({
	head: () => ({ meta: [{ title: "AI — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./dashboard.payroll.tax-DYIJByJ4.mjs");
var Route$24 = createFileRoute("/dashboard/payroll/tax")({
	head: () => ({ meta: [{ title: "Tax Management — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./dashboard.payroll.settings-DD2SOP_j.mjs");
var Route$23 = createFileRoute("/dashboard/payroll/settings")({
	head: () => ({ meta: [{ title: "Payroll Settings — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./dashboard.payroll.salary-structure-CPFP-5f-.mjs");
var Route$22 = createFileRoute("/dashboard/payroll/salary-structure")({
	head: () => ({ meta: [{ title: "Salary Structure — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./dashboard.payroll.salary-processing-C1ieJRTf.mjs");
var Route$21 = createFileRoute("/dashboard/payroll/salary-processing")({
	head: () => ({ meta: [{ title: "Salary Processing — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./dashboard.payroll.reports-DZhw3GRa.mjs");
var Route$20 = createFileRoute("/dashboard/payroll/reports")({
	head: () => ({ meta: [{ title: "Payroll Reports — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./dashboard.payroll.reimbursements-6HnNE74O.mjs");
var Route$19 = createFileRoute("/dashboard/payroll/reimbursements")({
	head: () => ({ meta: [{ title: "Reimbursements — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./dashboard.payroll.payslips-BBqU16EK.mjs");
var Route$18 = createFileRoute("/dashboard/payroll/payslips")({
	head: () => ({ meta: [{ title: "Payslips — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./dashboard.payroll.overtime-CJonZQhK.mjs");
var Route$17 = createFileRoute("/dashboard/payroll/overtime")({
	head: () => ({ meta: [{ title: "Overtime Payments — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./dashboard.payroll.deductions-4c9YeV93.mjs");
var Route$16 = createFileRoute("/dashboard/payroll/deductions")({
	head: () => ({ meta: [{ title: "Deductions — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard.payroll.copilot-DTV4pmyB.mjs");
var Route$15 = createFileRoute("/dashboard/payroll/copilot")({
	head: () => ({ meta: [{ title: "AI Payroll Copilot — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./dashboard.payroll.compliance-g8WrS50-.mjs");
var Route$14 = createFileRoute("/dashboard/payroll/compliance")({
	head: () => ({ meta: [{ title: "Compliance — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./dashboard.payroll.bonuses-Czu08Shq.mjs");
var Route$13 = createFileRoute("/dashboard/payroll/bonuses")({
	head: () => ({ meta: [{ title: "Bonuses & Incentives — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./dashboard.payroll.bank-transfers-BbhUypOz.mjs");
var Route$12 = createFileRoute("/dashboard/payroll/bank-transfers")({
	head: () => ({ meta: [{ title: "Bank Transfers — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./dashboard.payroll.approvals-8u5yUYwD.mjs");
var Route$11 = createFileRoute("/dashboard/payroll/approvals")({
	head: () => ({ meta: [{ title: "Payroll Approvals — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard.payroll.advances-BunKBaVQ.mjs");
var Route$10 = createFileRoute("/dashboard/payroll/advances")({
	head: () => ({ meta: [{ title: "Advances & Loans — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./dashboard.attendance.shifts-BYCI7IFk.mjs");
var Route$9 = createFileRoute("/dashboard/attendance/shifts")({
	head: () => ({ meta: [{ title: "Shifts — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./dashboard.attendance.rosters-Bc_fWsjl.mjs");
var Route$8 = createFileRoute("/dashboard/attendance/rosters")({
	head: () => ({ meta: [{ title: "Rosters — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard.attendance.holidays-DVroT0iG.mjs");
var Route$7 = createFileRoute("/dashboard/attendance/holidays")({
	head: () => ({ meta: [{ title: "Holidays — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard.attendance.checkin-DnWOqQa5.mjs");
var Route$6 = createFileRoute("/dashboard/attendance/checkin")({
	head: () => ({ meta: [{ title: "Check In / Check Out — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./jobs-BaFpN8bC.mjs");
var Route$5 = createFileRoute("/dashboard/recruitment/jobs/")({
	head: () => ({ meta: [{ title: "Jobs — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./candidates-D6J4ivQ2.mjs");
var Route$4 = createFileRoute("/dashboard/recruitment/candidates/")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./new-CkORwBb_.mjs");
var Route$3 = createFileRoute("/dashboard/recruitment/jobs/new")({
	head: () => ({ meta: [{ title: "New Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_jobId-BJUeMCVD.mjs");
var Route$2 = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
	head: () => ({ meta: [{ title: "Job Detail — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_candidateId-CXTnft0n.mjs");
var Route$1 = createFileRoute("/dashboard/recruitment/candidates/$candidateId")({
	head: () => ({ meta: [{ title: "Candidate Profile — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./publish-BSjkr3wM.mjs");
var Route = createFileRoute("/dashboard/recruitment/jobs/$jobId/publish")({
	head: () => ({ meta: [{ title: "Publish Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TermsRoute = Route$122.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$123
});
var SitemapDotxmlRoute = Route$121.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$123
});
var PrivacyRoute = Route$120.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$123
});
var PricingRoute = Route$119.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$123
});
var OnboardingRoute = Route$126.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$123
});
var FeaturesRoute = Route$118.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => Route$123
});
var FaqRoute = Route$117.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$123
});
var DashboardRoute = Route$116.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$123
});
var ContactRoute = Route$115.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$123
});
var BlogRoute = Route$114.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$123
});
var AiRoute = Route$113.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$123
});
var AboutRoute = Route$112.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$123
});
var IndexRoute = Route$111.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$123
});
var DashboardIndexRoute = Route$110.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var BlogIndexRoute = Route$109.update({
	id: "/",
	path: "/",
	getParentRoute: () => BlogRoute
});
var AiIndexRoute = Route$108.update({
	id: "/",
	path: "/",
	getParentRoute: () => AiRoute
});
var DashboardVisitorsRoute = Route$107.update({
	id: "/visitors",
	path: "/visitors",
	getParentRoute: () => DashboardRoute
});
var DashboardTravelRoute = Route$106.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => DashboardRoute
});
var DashboardTimesheetsRoute = Route$105.update({
	id: "/timesheets",
	path: "/timesheets",
	getParentRoute: () => DashboardRoute
});
var DashboardTimelineRoute = Route$104.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => DashboardRoute
});
var DashboardSettingsRoute = Route$103.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardRoute
});
var DashboardRolesRoute = Route$102.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => DashboardRoute
});
var DashboardReportsRoute = Route$101.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRoute
});
var DashboardRecruitmentRoute = Route$100.update({
	id: "/recruitment",
	path: "/recruitment",
	getParentRoute: () => DashboardRoute
});
var DashboardPerformanceRoute = Route$99.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => DashboardRoute
});
var DashboardPeopleRoute = Route$98.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => DashboardRoute
});
var DashboardPayrollRoute = Route$97.update({
	id: "/payroll",
	path: "/payroll",
	getParentRoute: () => DashboardRoute
});
var DashboardOnboardingChecklistRoute = Route$96.update({
	id: "/onboarding-checklist",
	path: "/onboarding-checklist",
	getParentRoute: () => DashboardRoute
});
var DashboardOffboardingRoute = Route$95.update({
	id: "/offboarding",
	path: "/offboarding",
	getParentRoute: () => DashboardRoute
});
var DashboardManagersRoute = Route$94.update({
	id: "/managers",
	path: "/managers",
	getParentRoute: () => DashboardRoute
});
var DashboardManagerRoute = Route$93.update({
	id: "/manager",
	path: "/manager",
	getParentRoute: () => DashboardRoute
});
var DashboardLifecycleRoute = Route$92.update({
	id: "/lifecycle",
	path: "/lifecycle",
	getParentRoute: () => DashboardRoute
});
var DashboardLeavesRoute = Route$91.update({
	id: "/leaves",
	path: "/leaves",
	getParentRoute: () => DashboardRoute
});
var DashboardHrOpsRoute = Route$90.update({
	id: "/hr-ops",
	path: "/hr-ops",
	getParentRoute: () => DashboardRoute
});
var DashboardHrRoute = Route$89.update({
	id: "/hr",
	path: "/hr",
	getParentRoute: () => DashboardRoute
});
var DashboardExpensesRoute = Route$88.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => DashboardRoute
});
var DashboardExitManagementRoute = Route$87.update({
	id: "/exit-management",
	path: "/exit-management",
	getParentRoute: () => DashboardRoute
});
var DashboardExitRoute = Route$86.update({
	id: "/exit",
	path: "/exit",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeesRoute = Route$85.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeeRoute = Route$84.update({
	id: "/employee",
	path: "/employee",
	getParentRoute: () => DashboardRoute
});
var DashboardDocumentsRoute = Route$83.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => DashboardRoute
});
var DashboardDepartmentsRoute = Route$82.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DashboardRoute
});
var DashboardCommunicationRoute = Route$81.update({
	id: "/communication",
	path: "/communication",
	getParentRoute: () => DashboardRoute
});
var DashboardBillingRoute = Route$80.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardRoute
});
var DashboardAuditLogsRoute = Route$79.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardRoute
});
var DashboardAttendanceRoute = Route$78.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetsRoute = Route$77.update({
	id: "/assets",
	path: "/assets",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetManagementRoute = Route$76.update({
	id: "/asset-management",
	path: "/asset-management",
	getParentRoute: () => DashboardRoute
});
var DashboardAiInsightsRoute = Route$75.update({
	id: "/ai-insights",
	path: "/ai-insights",
	getParentRoute: () => DashboardRoute
});
var BlogSlugRoute = Route$124.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var ApiPayrollCopilotRoute = Route$74.update({
	id: "/api/payroll-copilot",
	path: "/api/payroll-copilot",
	getParentRoute: () => Route$123
});
var ApiAiBrainRoute = Route$73.update({
	id: "/api/ai-brain",
	path: "/api/ai-brain",
	getParentRoute: () => Route$123
});
var AiWorkforcePlanningRoute = Route$72.update({
	id: "/workforce-planning",
	path: "/workforce-planning",
	getParentRoute: () => AiRoute
});
var AiWorkforceInsightsRoute = Route$71.update({
	id: "/workforce-insights",
	path: "/workforce-insights",
	getParentRoute: () => AiRoute
});
var AiRecruiterRoute = Route$70.update({
	id: "/recruiter",
	path: "/recruiter",
	getParentRoute: () => AiRoute
});
var AiPolicyAssistantRoute = Route$69.update({
	id: "/policy-assistant",
	path: "/policy-assistant",
	getParentRoute: () => AiRoute
});
var AiPerformanceCoachRoute = Route$68.update({
	id: "/performance-coach",
	path: "/performance-coach",
	getParentRoute: () => AiRoute
});
var AiPayrollInsightsRoute = Route$67.update({
	id: "/payroll-insights",
	path: "/payroll-insights",
	getParentRoute: () => AiRoute
});
var AiMeetingIntelligenceRoute = Route$66.update({
	id: "/meeting-intelligence",
	path: "/meeting-intelligence",
	getParentRoute: () => AiRoute
});
var AiLeaveAssistantRoute = Route$65.update({
	id: "/leave-assistant",
	path: "/leave-assistant",
	getParentRoute: () => AiRoute
});
var AiEmployeeHealthRoute = Route$64.update({
	id: "/employee-health",
	path: "/employee-health",
	getParentRoute: () => AiRoute
});
var AiDocumentGeneratorRoute = Route$63.update({
	id: "/document-generator",
	path: "/document-generator",
	getParentRoute: () => AiRoute
});
var AiComplianceMonitorRoute = Route$62.update({
	id: "/compliance-monitor",
	path: "/compliance-monitor",
	getParentRoute: () => AiRoute
});
var AiChatAssistantRoute = Route$61.update({
	id: "/chat-assistant",
	path: "/chat-assistant",
	getParentRoute: () => AiRoute
});
var AiBrainRoute = Route$60.update({
	id: "/brain",
	path: "/brain",
	getParentRoute: () => AiRoute
});
var AiAttendanceMonitorRoute = Route$59.update({
	id: "/attendance-monitor",
	path: "/attendance-monitor",
	getParentRoute: () => AiRoute
});
var AiAnalyticsCenterRoute = Route$58.update({
	id: "/analytics-center",
	path: "/analytics-center",
	getParentRoute: () => AiRoute
});
var AuthVerifyResetOtpRoute = Route$57.update({
	id: "/_auth/verify-reset-otp",
	path: "/verify-reset-otp",
	getParentRoute: () => Route$123
});
var AuthVerifyEmailRoute = Route$56.update({
	id: "/_auth/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$123
});
var AuthResetPasswordRoute = Route$55.update({
	id: "/_auth/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$123
});
var AuthRegisterRoute = Route$54.update({
	id: "/_auth/register",
	path: "/register",
	getParentRoute: () => Route$123
});
var AuthLoginRoute = Route$53.update({
	id: "/_auth/login",
	path: "/login",
	getParentRoute: () => Route$123
});
var AuthForgotPasswordRoute = Route$52.update({
	id: "/_auth/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$123
});
var DashboardRecruitmentIndexRoute = Route$51.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPayrollIndexRoute = Route$50.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardAttendanceIndexRoute = Route$49.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardAttendanceRoute
});
var JobsApplyUkeyRoute = Route$125.update({
	id: "/jobs/apply/$ukey",
	path: "/jobs/apply/$ukey",
	getParentRoute: () => Route$123
});
var DashboardRecruitmentVendorsRoute = Route$48.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTemplatesRoute = Route$47.update({
	id: "/templates",
	path: "/templates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTalentPoolRoute = Route$46.update({
	id: "/talent-pool",
	path: "/talent-pool",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentSearchRoute = Route$45.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentScorecardsRoute = Route$44.update({
	id: "/scorecards",
	path: "/scorecards",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentResumeIntelligenceRoute = Route$43.update({
	id: "/resume-intelligence",
	path: "/resume-intelligence",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentRequisitionsRoute = Route$42.update({
	id: "/requisitions",
	path: "/requisitions",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReportsRoute = Route$41.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReferralsRoute = Route$40.update({
	id: "/referrals",
	path: "/referrals",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentPipelineRoute = Route$39.update({
	id: "/pipeline",
	path: "/pipeline",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOnboardingRoute = Route$38.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOffersRoute = Route$37.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentNotificationsRoute = Route$36.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentInterviewsRoute = Route$35.update({
	id: "/interviews",
	path: "/interviews",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentImportExportRoute = Route$34.update({
	id: "/import-export",
	path: "/import-export",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCrmRoute = Route$33.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCopilotRoute = Route$32.update({
	id: "/copilot",
	path: "/copilot",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentComplianceRoute = Route$31.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCareerSiteRoute = Route$30.update({
	id: "/career-site",
	path: "/career-site",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesRoute = Route$29.update({
	id: "/candidates",
	path: "/candidates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCalendarRoute = Route$28.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAutomationRoute = Route$27.update({
	id: "/automation",
	path: "/automation",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAnalyticsRoute = Route$26.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAiRoute = Route$25.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPayrollTaxRoute = Route$24.update({
	id: "/tax",
	path: "/tax",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSettingsRoute = Route$23.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSalaryStructureRoute = Route$22.update({
	id: "/salary-structure",
	path: "/salary-structure",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSalaryProcessingRoute = Route$21.update({
	id: "/salary-processing",
	path: "/salary-processing",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollReportsRoute = Route$20.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollReimbursementsRoute = Route$19.update({
	id: "/reimbursements",
	path: "/reimbursements",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollPayslipsRoute = Route$18.update({
	id: "/payslips",
	path: "/payslips",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollOvertimeRoute = Route$17.update({
	id: "/overtime",
	path: "/overtime",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollDeductionsRoute = Route$16.update({
	id: "/deductions",
	path: "/deductions",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollCopilotRoute = Route$15.update({
	id: "/copilot",
	path: "/copilot",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollComplianceRoute = Route$14.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollBonusesRoute = Route$13.update({
	id: "/bonuses",
	path: "/bonuses",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollBankTransfersRoute = Route$12.update({
	id: "/bank-transfers",
	path: "/bank-transfers",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollApprovalsRoute = Route$11.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollAdvancesRoute = Route$10.update({
	id: "/advances",
	path: "/advances",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardAttendanceShiftsRoute = Route$9.update({
	id: "/shifts",
	path: "/shifts",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceRostersRoute = Route$8.update({
	id: "/rosters",
	path: "/rosters",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceHolidaysRoute = Route$7.update({
	id: "/holidays",
	path: "/holidays",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceCheckinRoute = Route$6.update({
	id: "/checkin",
	path: "/checkin",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardRecruitmentJobsIndexRoute = Route$5.update({
	id: "/jobs/",
	path: "/jobs/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentCandidatesRoute
});
var DashboardRecruitmentJobsNewRoute = Route$3.update({
	id: "/jobs/new",
	path: "/jobs/new",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentJobsJobIdRoute = Route$2.update({
	id: "/jobs/$jobId",
	path: "/jobs/$jobId",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesCandidateIdRoute = Route$1.update({
	id: "/$candidateId",
	path: "/$candidateId",
	getParentRoute: () => DashboardRecruitmentCandidatesRoute
});
var DashboardRecruitmentJobsJobIdPublishRoute = Route.update({
	id: "/publish",
	path: "/publish",
	getParentRoute: () => DashboardRecruitmentJobsJobIdRoute
});
var AiRouteChildren = {
	AiAnalyticsCenterRoute,
	AiAttendanceMonitorRoute,
	AiBrainRoute,
	AiChatAssistantRoute,
	AiComplianceMonitorRoute,
	AiDocumentGeneratorRoute,
	AiEmployeeHealthRoute,
	AiLeaveAssistantRoute,
	AiMeetingIntelligenceRoute,
	AiPayrollInsightsRoute,
	AiPerformanceCoachRoute,
	AiPolicyAssistantRoute,
	AiRecruiterRoute,
	AiWorkforceInsightsRoute,
	AiWorkforcePlanningRoute,
	AiIndexRoute
};
var AiRouteWithChildren = AiRoute._addFileChildren(AiRouteChildren);
var BlogRouteChildren = {
	BlogSlugRoute,
	BlogIndexRoute
};
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var DashboardAttendanceRouteChildren = {
	DashboardAttendanceCheckinRoute,
	DashboardAttendanceHolidaysRoute,
	DashboardAttendanceRostersRoute,
	DashboardAttendanceShiftsRoute,
	DashboardAttendanceIndexRoute
};
var DashboardAttendanceRouteWithChildren = DashboardAttendanceRoute._addFileChildren(DashboardAttendanceRouteChildren);
var DashboardPayrollRouteChildren = {
	DashboardPayrollAdvancesRoute,
	DashboardPayrollApprovalsRoute,
	DashboardPayrollBankTransfersRoute,
	DashboardPayrollBonusesRoute,
	DashboardPayrollComplianceRoute,
	DashboardPayrollCopilotRoute,
	DashboardPayrollDeductionsRoute,
	DashboardPayrollOvertimeRoute,
	DashboardPayrollPayslipsRoute,
	DashboardPayrollReimbursementsRoute,
	DashboardPayrollReportsRoute,
	DashboardPayrollSalaryProcessingRoute,
	DashboardPayrollSalaryStructureRoute,
	DashboardPayrollSettingsRoute,
	DashboardPayrollTaxRoute,
	DashboardPayrollIndexRoute
};
var DashboardPayrollRouteWithChildren = DashboardPayrollRoute._addFileChildren(DashboardPayrollRouteChildren);
var DashboardRecruitmentCandidatesRouteChildren = {
	DashboardRecruitmentCandidatesCandidateIdRoute,
	DashboardRecruitmentCandidatesIndexRoute
};
var DashboardRecruitmentCandidatesRouteWithChildren = DashboardRecruitmentCandidatesRoute._addFileChildren(DashboardRecruitmentCandidatesRouteChildren);
var DashboardRecruitmentJobsJobIdRouteChildren = { DashboardRecruitmentJobsJobIdPublishRoute };
var DashboardRecruitmentRouteChildren = {
	DashboardRecruitmentAiRoute,
	DashboardRecruitmentAnalyticsRoute,
	DashboardRecruitmentAutomationRoute,
	DashboardRecruitmentCalendarRoute,
	DashboardRecruitmentCandidatesRoute: DashboardRecruitmentCandidatesRouteWithChildren,
	DashboardRecruitmentCareerSiteRoute,
	DashboardRecruitmentComplianceRoute,
	DashboardRecruitmentCopilotRoute,
	DashboardRecruitmentCrmRoute,
	DashboardRecruitmentImportExportRoute,
	DashboardRecruitmentInterviewsRoute,
	DashboardRecruitmentNotificationsRoute,
	DashboardRecruitmentOffersRoute,
	DashboardRecruitmentOnboardingRoute,
	DashboardRecruitmentPipelineRoute,
	DashboardRecruitmentReferralsRoute,
	DashboardRecruitmentReportsRoute,
	DashboardRecruitmentRequisitionsRoute,
	DashboardRecruitmentResumeIntelligenceRoute,
	DashboardRecruitmentScorecardsRoute,
	DashboardRecruitmentSearchRoute,
	DashboardRecruitmentTalentPoolRoute,
	DashboardRecruitmentTemplatesRoute,
	DashboardRecruitmentVendorsRoute,
	DashboardRecruitmentIndexRoute,
	DashboardRecruitmentJobsJobIdRoute: DashboardRecruitmentJobsJobIdRoute._addFileChildren(DashboardRecruitmentJobsJobIdRouteChildren),
	DashboardRecruitmentJobsNewRoute,
	DashboardRecruitmentJobsIndexRoute
};
var DashboardRouteChildren = {
	DashboardAiInsightsRoute,
	DashboardAssetManagementRoute,
	DashboardAssetsRoute,
	DashboardAttendanceRoute: DashboardAttendanceRouteWithChildren,
	DashboardAuditLogsRoute,
	DashboardBillingRoute,
	DashboardCommunicationRoute,
	DashboardDepartmentsRoute,
	DashboardDocumentsRoute,
	DashboardEmployeeRoute,
	DashboardEmployeesRoute,
	DashboardExitRoute,
	DashboardExitManagementRoute,
	DashboardExpensesRoute,
	DashboardHrRoute,
	DashboardHrOpsRoute,
	DashboardLeavesRoute,
	DashboardLifecycleRoute,
	DashboardManagerRoute,
	DashboardManagersRoute,
	DashboardOffboardingRoute,
	DashboardOnboardingChecklistRoute,
	DashboardPayrollRoute: DashboardPayrollRouteWithChildren,
	DashboardPeopleRoute,
	DashboardPerformanceRoute,
	DashboardRecruitmentRoute: DashboardRecruitmentRoute._addFileChildren(DashboardRecruitmentRouteChildren),
	DashboardReportsRoute,
	DashboardRolesRoute,
	DashboardSettingsRoute,
	DashboardTimelineRoute,
	DashboardTimesheetsRoute,
	DashboardTravelRoute,
	DashboardVisitorsRoute,
	DashboardIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AiRoute: AiRouteWithChildren,
	BlogRoute: BlogRouteWithChildren,
	ContactRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	FaqRoute,
	FeaturesRoute,
	OnboardingRoute,
	PricingRoute,
	PrivacyRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	AuthForgotPasswordRoute,
	AuthLoginRoute,
	AuthRegisterRoute,
	AuthResetPasswordRoute,
	AuthVerifyEmailRoute,
	AuthVerifyResetOtpRoute,
	ApiAiBrainRoute,
	ApiPayrollCopilotRoute,
	JobsApplyUkeyRoute
};
var routeTree = Route$123._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
