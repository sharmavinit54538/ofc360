import { o as __toESM } from "../_runtime.mjs";
import { a as streamText, i as stepCountIs, o as require_react, r as convertToModelMessages } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as Provider_default } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { Vt as store } from "./ofc360-store-XkEEWRxo.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as bootstrapAuth } from "./auth-bootstrap-DNBAvcKr.mjs";
import { t as ThemeProvider } from "./ThemeProvider-6IpgR288.mjs";
import { M as redirect, _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, z as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { r as getAgent } from "./agents-Cctfc2QQ.mjs";
import { J as enumType, K as anyType, Q as stringType, V as tool, X as objectType, Y as numberType, Z as recordType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { n as posts } from "./blog-data-DcYz3eWl.mjs";
import { a as TWITTER_HANDLE, i as SITE_URL, n as Route$142, o as buildCanonical, r as SITE_NAME, s as buildMeta, t as DEFAULT_OG_IMAGE } from "./blog._slug-DES9n6s3.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$143 } from "./jobs.apply._ukey-BxFPRsmR.mjs";
import { t as Route$144 } from "./onboarding-B5mGmWdZ.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C4jRjmB4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GA_MEASUREMENT_ID = typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_BASE_URL": "https://api.ofc360.com",
	"VITE_API_URL": "https://api.ofc360.com",
	"VITE_GA_MEASUREMENT_ID": "G-JENH25KMTQ",
	"VITE_RAZORPAY_KEY_ID": "rzp_test_TNY7mS8PhHloDn"
} ? "G-JENH25KMTQ" : void 0;
var isInitialized = false;
/**
* List of path prefixes that should NOT be tracked in Analytics
* to protect sensitive user & company operational data.
*/
var PRIVATE_PATH_PREFIXES = [
	"/dashboard",
	"/onboarding",
	"/api",
	"/_auth",
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
	"/verify-reset-otp"
];
/**
* Returns true if the given path is a public page eligible for analytics tracking.
*/
function isPublicRoute(pathname) {
	if (!pathname) return false;
	return !PRIVATE_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || prefix !== "/" && pathname.startsWith(prefix));
}
/**
* Initializes GA4 script and dataLayer if not already initialized.
*/
function initGA() {
	if (typeof window === "undefined") return;
	if (isInitialized) return;
	if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.trim() === "") return;
	const trimmedId = GA_MEASUREMENT_ID.trim();
	const scriptId = "ga4-script";
	if (!document.getElementById(scriptId)) {
		const script = document.createElement("script");
		script.id = scriptId;
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trimmedId)}`;
		document.head.appendChild(script);
	}
	window.dataLayer = window.dataLayer || [];
	if (!window.gtag) window.gtag = function gtag() {
		window.dataLayer.push(arguments);
	};
	window.gtag("js", /* @__PURE__ */ new Date());
	window.gtag("config", trimmedId, {
		send_page_view: false,
		anonymize_ip: true
	});
	isInitialized = true;
}
/**
* Tracks a page view for public SPA route navigation.
*/
function trackPageView(pathname, title) {
	if (typeof window === "undefined") return;
	if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.trim() === "") return;
	if (!isPublicRoute(pathname)) return;
	initGA();
	if (window.gtag) {
		const pageLocation = window.location.origin + pathname;
		const pageTitle = title || document.title || "OFC360";
		window.gtag("event", "page_view", {
			page_title: pageTitle,
			page_location: pageLocation,
			page_path: pathname
		});
	}
}
var styles_default = "/assets/styles-DbNzFLbr.css";
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
var organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: SITE_NAME,
	legalName: "EquinoxSphere Technologies",
	url: SITE_URL,
	logo: `${SITE_URL}/logo.png`,
	description: "AI-powered HRMS platform for modern organizations — recruitment, attendance, payroll, performance, and 70+ AI agents.",
	sameAs: ["https://www.instagram.com/ofc360ai/", "https://www.linkedin.com/company/ofc360/"],
	contactPoint: {
		"@type": "ContactPoint",
		email: "info@ofc360.com",
		contactType: "sales",
		availableLanguage: ["English", "Hindi"]
	}
};
var websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE_NAME,
	url: SITE_URL,
	description: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies.",
	publisher: {
		"@type": "Organization",
		name: "EquinoxSphere Technologies"
	}
};
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
var Route$141 = createRootRouteWithContext()({
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
				name: "theme-color",
				content: "#7c3aed"
			},
			{
				property: "og:title",
				content: "OFC360 — AI-Powered HRMS Platform"
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
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				property: "og:site_name",
				content: SITE_NAME
			},
			{
				property: "og:url",
				content: SITE_URL
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: TWITTER_HANDLE
			},
			{
				name: "twitter:title",
				content: "OFC360 — AI-Powered HRMS Platform"
			},
			{
				name: "twitter:description",
				content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies."
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "dns-prefetch",
				href: "https://checkout.razorpay.com"
			}
		],
		scripts: [{
			src: "https://checkout.razorpay.com/v1/checkout.js",
			defer: true
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()` } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(organizationJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(websiteJsonLd) }
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function AnalyticsTracker() {
	const location = useLocation();
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			trackPageView(location.pathname, document.title);
		}, 0);
		return () => clearTimeout(timer);
	}, [location.pathname]);
	return null;
}
function RootComponent() {
	const { queryClient } = Route$141.useRouteContext();
	(0, import_react.useEffect)(() => {
		bootstrapAuth();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider_default, {
		store,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsTracker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					richColors: true,
					position: "top-right"
				})
			]
		})
	}) });
}
var $$splitComponentImporter$136 = () => import("./terms--s2EOHdK.mjs");
var Route$140 = createFileRoute("/terms")({
	head: () => ({
		meta: buildMeta({
			title: "Terms & Conditions — OFC360",
			description: "The terms that govern your use of OFC360 by EquinoxSphere Technologies.",
			url: "/terms"
		}),
		links: buildCanonical("/terms")
	}),
	component: lazyRouteComponent($$splitComponentImporter$136, "component")
});
var BASE_URL = "https://www.ofc360.com";
var today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
var Route$139 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const staticRoutes = [
		{
			path: "/",
			priority: "1.0",
			changefreq: "weekly"
		},
		{
			path: "/features",
			priority: "0.8",
			changefreq: "monthly"
		},
		{
			path: "/pricing",
			priority: "0.8",
			changefreq: "monthly"
		},
		{
			path: "/about",
			priority: "0.7",
			changefreq: "monthly"
		},
		{
			path: "/ai",
			priority: "0.7",
			changefreq: "weekly"
		},
		{
			path: "/blog",
			priority: "0.7",
			changefreq: "weekly"
		},
		{
			path: "/faq",
			priority: "0.6",
			changefreq: "monthly"
		},
		{
			path: "/contact",
			priority: "0.6",
			changefreq: "monthly"
		},
		{
			path: "/privacy",
			priority: "0.3",
			changefreq: "yearly"
		},
		{
			path: "/terms",
			priority: "0.3",
			changefreq: "yearly"
		}
	];
	const blogRoutes = posts.map((p) => ({
		path: `/blog/${p.slug}`,
		priority: "0.6",
		changefreq: "monthly"
	}));
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticRoutes, ...blogRoutes].map((r) => `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600, s-maxage=86400"
	} });
} } } });
var robotsTxt = `# OFC360 — robots.txt
# https://www.ofc360.com

User-agent: *
Allow: /

# Public pages
Allow: /features
Allow: /pricing
Allow: /about
Allow: /blog
Allow: /faq
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /ai

# Private / app routes — do not index
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /onboarding
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /verify-email
Disallow: /verify-reset-otp
Disallow: /jobs/

# Sitemap
Sitemap: https://www.ofc360.com/sitemap.xml
`;
var Route$138 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async () => {
	return new Response(robotsTxt, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=86400, s-maxage=604800"
	} });
} } } });
var $$splitComponentImporter$135 = () => import("./privacy-Zq_nQ8VJ.mjs");
var Route$137 = createFileRoute("/privacy")({
	head: () => ({
		meta: buildMeta({
			title: "Privacy Policy — OFC360",
			description: "How EquinoxSphere Technologies collects, uses, and protects your data on OFC360.",
			url: "/privacy"
		}),
		links: buildCanonical("/privacy")
	}),
	component: lazyRouteComponent($$splitComponentImporter$135, "component")
});
var $$splitComponentImporter$134 = () => import("./pricing-DUvKTvIM.mjs");
var Route$136 = createFileRoute("/pricing")({
	head: () => ({
		meta: buildMeta({
			title: "Pricing — OFC360 HRMS Plans",
			description: "Simple, transparent pricing for OFC360 HRMS. Choose the plan that fits your team. Start with a free trial.",
			url: "/pricing"
		}),
		links: buildCanonical("/pricing")
	}),
	component: lazyRouteComponent($$splitComponentImporter$134, "component")
});
/**
* DRAFT — review these FAQ questions and answers before publishing.
* Adjust wording, add specifics, or remove as needed.
*/
var $$splitComponentImporter$133 = () => import("./features-CQKq2I91.mjs");
var Route$135 = createFileRoute("/features")({
	head: () => ({
		meta: buildMeta({
			title: "Features — OFC360 AI-Powered HRMS",
			description: "Explore OFC360 features — recruitment AI, attendance, payroll, performance management, analytics, integrations, and 70+ AI agents.",
			url: "/features"
		}),
		links: buildCanonical("/features")
	}),
	component: lazyRouteComponent($$splitComponentImporter$133, "component")
});
var $$splitComponentImporter$132 = () => import("./faq-DFS-6lYL.mjs");
var faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "What is OFC360?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "OFC360 is an AI-powered HRMS platform — combining recruitment, attendance, payroll, performance, and 70+ AI agents in one unified interface."
			}
		},
		{
			"@type": "Question",
			name: "What platforms does it run on?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We have native web, mobile, and desktop experiences that run anywhere."
			}
		},
		{
			"@type": "Question",
			name: "Is there a free plan?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes. Our Free plan supports up to 10 members and is generous enough for most early-stage teams."
			}
		},
		{
			"@type": "Question",
			name: "Is OFC360 SOC 2 certified?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "We are SOC 2 Type II compliant and undergo regular security audits."
			}
		},
		{
			"@type": "Question",
			name: "Does OFC360 integrate with existing tools?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes — bi-directional sync with popular calendar, payroll, and identity providers."
			}
		},
		{
			"@type": "Question",
			name: "Do you have a public API?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Yes — fully documented REST and GraphQL APIs, plus webhooks for every event."
			}
		}
	]
};
var Route$134 = createFileRoute("/faq")({
	head: () => ({
		meta: buildMeta({
			title: "FAQ — OFC360 HRMS Platform",
			description: "Answers to common questions about OFC360 — product, pricing, security, integrations, and more.",
			url: "/faq"
		}),
		links: buildCanonical("/faq"),
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(faqJsonLd)
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$132, "component")
});
var $$splitComponentImporter$131 = () => import("./dashboard-Fpiy_nsl.mjs");
var Route$133 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — OFC360" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$131, "component")
});
var $$splitComponentImporter$130 = () => import("./contact-CQeM_T_m.mjs");
var Route$132 = createFileRoute("/contact")({
	head: () => ({
		meta: buildMeta({
			title: "Contact OFC360 — Get in Touch",
			description: "Get in touch with the OFC360 team. Book a demo, request pricing, or ask a question. We respond within one business day.",
			url: "/contact"
		}),
		links: buildCanonical("/contact")
	}),
	component: lazyRouteComponent($$splitComponentImporter$130, "component")
});
var $$splitComponentImporter$129 = () => import("./blog-GHsbigBI.mjs");
var Route$131 = createFileRoute("/blog")({
	head: () => ({
		meta: buildMeta({
			title: "Blog — OFC360",
			description: "Stories, product updates, and ideas from the OFC360 team.",
			url: "/blog"
		}),
		links: buildCanonical("/blog")
	}),
	component: lazyRouteComponent($$splitComponentImporter$129, "component")
});
var $$splitComponentImporter$128 = () => import("./ai-DrlW2yuT.mjs");
var Route$130 = createFileRoute("/ai")({
	head: () => ({ meta: [{ title: "AI Hub — OFC360" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$128, "component")
});
var $$splitComponentImporter$127 = () => import("./about-DhAwTjR4.mjs");
var Route$129 = createFileRoute("/about")({
	head: () => ({
		meta: buildMeta({
			title: "About OFC360 — EquinoxSphere Technologies",
			description: "Learn about EquinoxSphere Technologies and the team building OFC360 — the AI-powered HRMS platform for modern organizations.",
			url: "/about"
		}),
		links: buildCanonical("/about")
	}),
	component: lazyRouteComponent($$splitComponentImporter$127, "component")
});
/**
* DRAFT COPY — review and edit before publishing.
* These values are suggested for an HR-tech / AI company.
* Replace or adjust wording as needed.
*/
var $$splitComponentImporter$126 = () => import("./routes-C748pYpR.mjs");
var homeJsonLd = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: SITE_NAME,
	applicationCategory: "BusinessApplication",
	operatingSystem: "Web",
	description: "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance management, and 70+ AI agents — all in one platform.",
	url: SITE_URL,
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "INR",
		description: "Free plan available"
	},
	publisher: {
		"@type": "Organization",
		name: "EquinoxSphere Technologies"
	}
};
var Route$128 = createFileRoute("/")({
	head: () => ({
		meta: buildMeta({
			title: "OFC360 — AI-Powered HRMS Platform",
			description: "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance management, and 70+ AI agents — all in one platform.",
			url: "/"
		}),
		links: buildCanonical("/"),
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(homeJsonLd)
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$126, "component")
});
var $$splitComponentImporter$125 = () => import("./dashboard.index-BJQboQZ5.mjs");
var Route$127 = createFileRoute("/dashboard/")({
	head: () => ({ meta: [
		{ title: "Executive Command Center — OFC360" },
		{
			name: "description",
			content: "OFC360 HR Enterprise Executive Dashboard — a world-class HR operating system command center with real-time KPIs, approvals, analytics, recruitment, payroll, attendance, and more."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$125, "component")
});
var $$splitComponentImporter$124 = () => import("./blog.index-D5pyS9lG.mjs");
var Route$126 = createFileRoute("/blog/")({
	head: () => ({
		meta: buildMeta({
			title: "Blog — OFC360 HRMS Insights",
			description: "Stories, product updates, and HR technology insights from the OFC360 team.",
			url: "/blog"
		}),
		links: buildCanonical("/blog")
	}),
	component: lazyRouteComponent($$splitComponentImporter$124, "component")
});
var $$splitComponentImporter$123 = () => import("./ai.index-CZsG30e-.mjs");
var Route$125 = createFileRoute("/ai/")({
	head: () => ({ meta: [{ title: "AI Tools Workspace — OFC360" }, {
		name: "description",
		content: "Access all 71 enterprise AI models for human resource workflows, recruitment, compliance, payroll, and analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$123, "component")
});
var $$splitComponentImporter$122 = () => import("./dashboard.visitors-k66e4RdJ.mjs");
var Route$124 = createFileRoute("/dashboard/visitors")({
	head: () => ({ meta: [{ title: "Visitor Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$122, "component")
});
var $$splitComponentImporter$121 = () => import("./dashboard.travel-BTMxqKLv.mjs");
var Route$123 = createFileRoute("/dashboard/travel")({
	head: () => ({ meta: [{ title: "Travel Requests — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$121, "component")
});
var $$splitComponentImporter$120 = () => import("./dashboard.timesheets-T35nvmBX.mjs");
var Route$122 = createFileRoute("/dashboard/timesheets")({
	head: () => ({ meta: [{ title: "Timesheets — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$120, "component")
});
var $$splitComponentImporter$119 = () => import("./dashboard.timeline-_u4ehOmJ.mjs");
var Route$121 = createFileRoute("/dashboard/timeline")({
	head: () => ({ meta: [{ title: "Employee Timeline — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$119, "component")
});
var $$splitComponentImporter$118 = () => import("./dashboard.super-admin-D6Ti2iI9.mjs");
var Route$120 = createFileRoute("/dashboard/super-admin")({
	head: () => ({ meta: [{ title: "SaaS Owner Control Center — OFC HR" }] }),
	component: lazyRouteComponent($$splitComponentImporter$118, "component")
});
var $$splitComponentImporter$117 = () => import("./dashboard.settings-BxgE8wiM.mjs");
var Route$119 = createFileRoute("/dashboard/settings")({
	head: () => ({ meta: [{ title: "Settings — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$117, "component")
});
var $$splitComponentImporter$116 = () => import("./dashboard.roles-9eWpyOKy.mjs");
var Route$118 = createFileRoute("/dashboard/roles")({
	head: () => ({ meta: [{ title: "Roles & Permissions — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$116, "component")
});
var $$splitComponentImporter$115 = () => import("./dashboard.reports-DbjLGf9w.mjs");
var Route$117 = createFileRoute("/dashboard/reports")({
	head: () => ({ meta: [{ title: "Reports Dashboard — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$115, "component")
});
var $$splitComponentImporter$114 = () => import("./recruitment-DvVQnCRS.mjs");
var Route$116 = createFileRoute("/dashboard/recruitment")({
	head: () => ({ meta: [{ title: "Recruitment — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$114, "component")
});
var $$splitComponentImporter$113 = () => import("./dashboard.performance-Ca876b0w.mjs");
var Route$115 = createFileRoute("/dashboard/performance")({
	head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$113, "component")
});
var $$splitComponentImporter$112 = () => import("./dashboard.people-D2a0yDGr.mjs");
var Route$114 = createFileRoute("/dashboard/people")({
	head: () => ({ meta: [{ title: "People Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$112, "component")
});
var $$splitComponentImporter$111 = () => import("./dashboard.payroll-Bck0gYz0.mjs");
var Route$113 = createFileRoute("/dashboard/payroll")({
	head: () => ({ meta: [{ title: "Payroll — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$111, "component")
});
var $$splitComponentImporter$110 = () => import("./dashboard.onboarding-checklist-D42aREL0.mjs");
var Route$112 = createFileRoute("/dashboard/onboarding-checklist")({
	head: () => ({ meta: [{ title: "Onboarding Checklist — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$110, "component")
});
var $$splitComponentImporter$109 = () => import("./dashboard.offboarding-B9cqu3_M.mjs");
var Route$111 = createFileRoute("/dashboard/offboarding")({
	head: () => ({ meta: [{ title: "Offboarding Automation — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$109, "component")
});
var $$splitComponentImporter$108 = () => import("./dashboard.managers-B568SOO5.mjs");
var Route$110 = createFileRoute("/dashboard/managers")({
	head: () => ({ meta: [{ title: "Managers — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$108, "component")
});
var $$splitComponentImporter$107 = () => import("./dashboard.manager-B5KQd0OQ.mjs");
var Route$109 = createFileRoute("/dashboard/manager")({
	head: () => ({ meta: [{ title: "Manager Dashboard — OFC360 HR" }, {
		name: "description",
		content: "ofc360 HR Manager Dashboard — manage your team's attendance, leave, performance, assets, recruitment and more from one place."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$107, "component")
});
var $$splitComponentImporter$106 = () => import("./dashboard.lifecycle-CVigttrx.mjs");
var Route$108 = createFileRoute("/dashboard/lifecycle")({
	head: () => ({ meta: [{ title: "Employee Lifecycle — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$106, "component")
});
var $$splitComponentImporter$105 = () => import("./dashboard.leaves-Dp7wcyEC.mjs");
var Route$107 = createFileRoute("/dashboard/leaves")({
	head: () => ({ meta: [{ title: "Leaves — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$105, "component")
});
var $$splitComponentImporter$104 = () => import("./dashboard.hr-ops-UZgmqeU7.mjs");
var Route$106 = createFileRoute("/dashboard/hr-ops")({
	head: () => ({ meta: [{ title: "Operations — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$104, "component")
});
var $$splitComponentImporter$103 = () => import("./dashboard.hr-Ds91CrMS.mjs");
var Route$105 = createFileRoute("/dashboard/hr")({
	head: () => ({ meta: [{ title: "HR Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$103, "component")
});
var $$splitComponentImporter$102 = () => import("./dashboard.expenses-E85-_teW.mjs");
var Route$104 = createFileRoute("/dashboard/expenses")({
	head: () => ({ meta: [{ title: "Expense Claims — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$102, "component")
});
var $$splitComponentImporter$101 = () => import("./dashboard.exit-management-PVPjFRBS.mjs");
var Route$103 = createFileRoute("/dashboard/exit-management")({
	head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$101, "component")
});
var $$splitComponentImporter$100 = () => import("./dashboard.exit-jPWwDdT_.mjs");
var Route$102 = createFileRoute("/dashboard/exit")({
	head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$100, "component")
});
var $$splitComponentImporter$99 = () => import("./dashboard.employees-YdFUiqKw.mjs");
var Route$101 = createFileRoute("/dashboard/employees")({
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
	head: () => ({ meta: [{ title: "Employees — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$99, "component")
});
var $$splitComponentImporter$98 = () => import("./dashboard.employee-BeeoqyY3.mjs");
var Route$100 = createFileRoute("/dashboard/employee")({
	head: () => ({ meta: [{ title: "My Dashboard — OFC360 HR" }, {
		name: "description",
		content: "ofc360 HR Employee Self-Service Dashboard — manage your attendance, leaves, payslips, performance goals, documents, and assets."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$98, "component")
});
var $$splitComponentImporter$97 = () => import("./dashboard.documents-C-Df4YoB.mjs");
var Route$99 = createFileRoute("/dashboard/documents")({
	head: () => ({ meta: [{ title: "Documents — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$97, "component")
});
var $$splitComponentImporter$96 = () => import("./dashboard.departments-CU3jSjx2.mjs");
var Route$98 = createFileRoute("/dashboard/departments")({
	head: () => ({ meta: [{ title: "Departments — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$96, "component")
});
var $$splitComponentImporter$95 = () => import("./dashboard.communication-Bzyppzvm.mjs");
var Route$97 = createFileRoute("/dashboard/communication")({
	head: () => ({ meta: [{ title: "Communication & Help Desk — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$95, "component")
});
var $$splitComponentImporter$94 = () => import("./dashboard.billing-CO-nmdxE.mjs");
var Route$96 = createFileRoute("/dashboard/billing")({
	head: () => ({ meta: [{ title: "Billing & Subscriptions — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$94, "component")
});
var $$splitComponentImporter$93 = () => import("./dashboard.audit-logs-Bh4ZN9At.mjs");
var Route$95 = createFileRoute("/dashboard/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$93, "component")
});
var $$splitComponentImporter$92 = () => import("./dashboard.attendance-DzTAMzyy.mjs");
var Route$94 = createFileRoute("/dashboard/attendance")({
	head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$92, "component")
});
var $$splitComponentImporter$91 = () => import("./dashboard.assets-EmFa-80L.mjs");
var Route$93 = createFileRoute("/dashboard/assets")({
	head: () => ({ meta: [{ title: "Asset Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$91, "component")
});
var $$splitComponentImporter$90 = () => import("./dashboard.asset-management-BI7pg9lU.mjs");
var Route$92 = createFileRoute("/dashboard/asset-management")({
	beforeLoad: () => {
		throw redirect({
			to: "/dashboard/assets",
			replace: true
		});
	},
	head: () => ({ meta: [{ title: "Asset Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
var $$splitComponentImporter$89 = () => import("./dashboard.ai-insights-FWOxvmoL.mjs");
var Route$91 = createFileRoute("/dashboard/ai-insights")({
	head: () => ({ meta: [{ title: "AI Insights — OFC360" }, {
		name: "description",
		content: "AI-powered workforce intelligence and automation for your organization."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$89, "component")
});
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable-ai-gateway",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: { "Lovable-API-Key": apiKey }
	});
}
var Route$90 = createFileRoute("/api/payroll-copilot")({ server: { handlers: { POST: async ({ request }) => {
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
var Route$89 = createFileRoute("/api/ai-brain")({ server: { handlers: { POST: async ({ request }) => {
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
var $$splitComponentImporter$88 = () => import("./ai.workforce-planning-CVMjTCLo.mjs");
var Route$88 = createFileRoute("/ai/workforce-planning")({
	head: () => ({ meta: [{ title: "AI Workforce Planning — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$88, "component")
});
var $$splitComponentImporter$87 = () => import("./ai.workforce-insights-De6S8Y9t.mjs");
var Route$87 = createFileRoute("/ai/workforce-insights")({
	head: () => ({ meta: [{ title: "AI Workforce Insights — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
var $$splitComponentImporter$86 = () => import("./ai.recruiter-tVS7MDYv.mjs");
var Route$86 = createFileRoute("/ai/recruiter")({
	head: () => ({ meta: [{ title: "AI Recruiter — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$86, "component")
});
var $$splitComponentImporter$85 = () => import("./ai.policy-assistant-DYapvk76.mjs");
var Route$85 = createFileRoute("/ai/policy-assistant")({
	head: () => ({ meta: [{ title: "AI Policy Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$85, "component")
});
var $$splitComponentImporter$84 = () => import("./ai.performance-coach-DuZ3ygeH.mjs");
var Route$84 = createFileRoute("/ai/performance-coach")({
	head: () => ({ meta: [{ title: "AI Performance Coach — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$84, "component")
});
var $$splitComponentImporter$83 = () => import("./ai.payroll-insights-C3Jun1bL.mjs");
var Route$83 = createFileRoute("/ai/payroll-insights")({
	head: () => ({ meta: [{ title: "AI Payroll Insights — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$83, "component")
});
var $$splitComponentImporter$82 = () => import("./ai.meeting-intelligence-CUNlFpp_.mjs");
var Route$82 = createFileRoute("/ai/meeting-intelligence")({
	head: () => ({ meta: [{ title: "AI Meeting Intelligence — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$82, "component")
});
var $$splitComponentImporter$81 = () => import("./ai.leave-assistant-BGdeFAr0.mjs");
var Route$81 = createFileRoute("/ai/leave-assistant")({
	head: () => ({ meta: [{ title: "AI Leave Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$81, "component")
});
var $$splitComponentImporter$80 = () => import("./ai.employee-health-BG5ThCOy.mjs");
var Route$80 = createFileRoute("/ai/employee-health")({
	head: () => ({ meta: [{ title: "AI Employee Health — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$80, "component")
});
var $$splitComponentImporter$79 = () => import("./ai.document-generator-65EyCM-G.mjs");
var Route$79 = createFileRoute("/ai/document-generator")({
	head: () => ({ meta: [{ title: "AI Document Generator — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("./ai.compliance-monitor-B--t49Kd.mjs");
var Route$78 = createFileRoute("/ai/compliance-monitor")({
	head: () => ({ meta: [{ title: "AI Compliance Monitor — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("./ai.chat-assistant-B6MQC0PL.mjs");
var Route$77 = createFileRoute("/ai/chat-assistant")({
	head: () => ({ meta: [{ title: "AI Chat Assistant — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$77, "component")
});
var $$splitComponentImporter$76 = () => import("./ai.brain-BuG0CrCj.mjs");
var Route$76 = createFileRoute("/ai/brain")({
	head: () => ({ meta: [{ title: "AI Insight 2.0 — Autonomous HR Brain | ofc360" }, {
		name: "description",
		content: "An autonomous AI HR brain: 15+ specialist agents that recruit, evaluate, predict attrition, run payroll, draft letters and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$76, "component")
});
var $$splitComponentImporter$75 = () => import("./ai.attendance-monitor-BIWmeQpu.mjs");
var Route$75 = createFileRoute("/ai/attendance-monitor")({
	head: () => ({ meta: [{ title: "AI Attendance Monitor — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("./ai.analytics-center-CsQTNHQ9.mjs");
var Route$74 = createFileRoute("/ai/analytics-center")({
	head: () => ({ meta: [{ title: "AI Analytics Center — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
var $$splitComponentImporter$73 = () => import("./verify-reset-otp-_iecq_UI.mjs");
var Route$73 = createFileRoute("/_auth/verify-reset-otp")({
	validateSearch: objectType({ email: stringType().optional() }),
	head: () => ({ meta: [{ title: "Verify OTP — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$73, "component")
});
var $$splitComponentImporter$72 = () => import("./verify-email-BFVHdol4.mjs");
var Route$72 = createFileRoute("/_auth/verify-email")({
	head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$72, "component")
});
var $$splitComponentImporter$71 = () => import("./reset-password-B2IOBYPk.mjs");
var Route$71 = createFileRoute("/_auth/reset-password")({
	validateSearch: objectType({
		email: stringType().optional(),
		resetToken: stringType().optional()
	}),
	head: () => ({ meta: [{ title: "Set new password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
var $$splitComponentImporter$70 = () => import("./register-TtIa74Gy.mjs");
var Route$70 = createFileRoute("/_auth/register")({
	head: () => ({ meta: [
		{ title: "Create Your Workspace — OFC360" },
		{
			name: "description",
			content: "Create your OFC360 HRMS workspace and start managing your team with AI."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$70, "component")
});
var $$splitComponentImporter$69 = () => import("./login-DcAY_20X.mjs");
var Route$69 = createFileRoute("/_auth/login")({
	head: () => ({ meta: [
		{ title: "Sign In — OFC360" },
		{
			name: "description",
			content: "Sign in to your OFC360 HRMS workspace."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
var $$splitComponentImporter$68 = () => import("./forgot-password-CjIbVdU9.mjs");
var Route$68 = createFileRoute("/_auth/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
var $$splitComponentImporter$67 = () => import("./dashboard.super-admin.index-DZ4jjcqu.mjs");
var Route$67 = createFileRoute("/dashboard/super-admin/")({
	head: () => ({ meta: [{ title: "Overview — Super Admin Control Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("./recruitment-C63sE5br.mjs");
var Route$66 = createFileRoute("/dashboard/recruitment/")({
	head: () => ({ meta: [{ title: "Recruitment Workspace — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$66, "component")
});
var $$splitComponentImporter$65 = () => import("./dashboard.payroll.index-CFEsNeTH.mjs");
var Route$65 = createFileRoute("/dashboard/payroll/")({
	head: () => ({ meta: [{ title: "Payroll Hub — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("./dashboard.attendance.index-BaP17WHw.mjs");
var Route$64 = createFileRoute("/dashboard/attendance/")({
	head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$64, "component")
});
var $$splitComponentImporter$63 = () => import("./dashboard.super-admin.users-3qCPHk0F.mjs");
var Route$63 = createFileRoute("/dashboard/super-admin/users")({
	head: () => ({ meta: [{ title: "Users & Access — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
var $$splitComponentImporter$62 = () => import("./dashboard.super-admin.unpaid-active-vIAB0afU.mjs");
var Route$62 = createFileRoute("/dashboard/super-admin/unpaid-active")({
	head: () => ({ meta: [{ title: "Unpaid Active Customers — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./dashboard.super-admin.system-health-bR0EsJog.mjs");
var Route$61 = createFileRoute("/dashboard/super-admin/system-health")({
	head: () => ({ meta: [{ title: "System Health — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
var $$splitComponentImporter$60 = () => import("./dashboard.super-admin.settings-C8eJixzI.mjs");
var Route$60 = createFileRoute("/dashboard/super-admin/settings")({
	head: () => ({ meta: [{ title: "Platform Settings — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("./dashboard.super-admin.security-BWDt7k2Q.mjs");
var Route$59 = createFileRoute("/dashboard/super-admin/security")({
	head: () => ({ meta: [{ title: "Platform Security — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
var $$splitComponentImporter$58 = () => import("./dashboard.super-admin.plans-CI4l7eV0.mjs");
var Route$58 = createFileRoute("/dashboard/super-admin/plans")({
	head: () => ({ meta: [{ title: "Plans & Subscriptions — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
var $$splitComponentImporter$57 = () => import("./dashboard.super-admin.payments-DqSRP1Mc.mjs");
var Route$57 = createFileRoute("/dashboard/super-admin/payments")({
	head: () => ({ meta: [{ title: "Payments & Revenue — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("./dashboard.super-admin.organizations-DqNOLBYL.mjs");
var Route$56 = createFileRoute("/dashboard/super-admin/organizations")({
	head: () => ({ meta: [{ title: "Organizations Control — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("./dashboard.super-admin.entitlements-w-J7ow8K.mjs");
var Route$55 = createFileRoute("/dashboard/super-admin/entitlements")({
	head: () => ({ meta: [{ title: "Feature Entitlements — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("./dashboard.super-admin.billing-DbP3cT8O.mjs");
var Route$54 = createFileRoute("/dashboard/super-admin/billing")({
	head: () => ({ meta: [{ title: "Billing & Revenue — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./dashboard.super-admin.audit-logs-BY_yW1EM.mjs");
var Route$53 = createFileRoute("/dashboard/super-admin/audit-logs")({
	head: () => ({ meta: [{ title: "Global Audit History — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./dashboard.super-admin.announcements-B23UcxsX.mjs");
var Route$52 = createFileRoute("/dashboard/super-admin/announcements")({
	head: () => ({ meta: [{ title: "Announcements — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./dashboard.super-admin.analytics-BlCuTzYF.mjs");
var Route$51 = createFileRoute("/dashboard/super-admin/analytics")({
	head: () => ({ meta: [{ title: "Platform Analytics — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./dashboard.super-admin.ai-usage-BzBYd0IH.mjs");
var Route$50 = createFileRoute("/dashboard/super-admin/ai-usage")({
	head: () => ({ meta: [{ title: "AI Usage & Costs — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./vendors-DM_630Jw.mjs");
var Route$49 = createFileRoute("/dashboard/recruitment/vendors")({
	head: () => ({ meta: [{ title: "Vendors — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./templates-9sZn0UA_.mjs");
var Route$48 = createFileRoute("/dashboard/recruitment/templates")({
	head: () => ({ meta: [{ title: "Templates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./talent-pool-CQj-f5gm.mjs");
var Route$47 = createFileRoute("/dashboard/recruitment/talent-pool")({
	head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./search-BtRy6D4v.mjs");
var Route$46 = createFileRoute("/dashboard/recruitment/search")({
	head: () => ({ meta: [{ title: "Search — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./scorecards-ClFKIgUc.mjs");
var Route$45 = createFileRoute("/dashboard/recruitment/scorecards")({
	head: () => ({ meta: [{ title: "Scorecards — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./resume-intelligence-CIPIyhSM.mjs");
var Route$44 = createFileRoute("/dashboard/recruitment/resume-intelligence")({
	head: () => ({ meta: [{ title: "Resume Intelligence — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./requisitions-Bxz93WI3.mjs");
var Route$43 = createFileRoute("/dashboard/recruitment/requisitions")({
	head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./reports-BNYdDnDD.mjs");
var Route$42 = createFileRoute("/dashboard/recruitment/reports")({
	head: () => ({ meta: [{ title: "Reports — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./referrals-xFfw-o86.mjs");
var Route$41 = createFileRoute("/dashboard/recruitment/referrals")({
	head: () => ({ meta: [{ title: "Referrals — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./pipeline-B1ohZ5ai.mjs");
var Route$40 = createFileRoute("/dashboard/recruitment/pipeline")({
	head: () => ({ meta: [{ title: "Pipeline — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./onboarding-BJesjfey.mjs");
var Route$39 = createFileRoute("/dashboard/recruitment/onboarding")({
	head: () => ({ meta: [{ title: "Onboarding — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./offers-Bgo6UO8A.mjs");
var Route$38 = createFileRoute("/dashboard/recruitment/offers")({
	head: () => ({ meta: [{ title: "Offers — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./notifications-WxXGPa55.mjs");
var Route$37 = createFileRoute("/dashboard/recruitment/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./interviews-DBEZMMCz.mjs");
var Route$36 = createFileRoute("/dashboard/recruitment/interviews")({
	head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./import-export-B2lhdElt.mjs");
var Route$35 = createFileRoute("/dashboard/recruitment/import-export")({
	head: () => ({ meta: [{ title: "Import / Export — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./crm-BmMHGyH-.mjs");
var Route$34 = createFileRoute("/dashboard/recruitment/crm")({
	head: () => ({ meta: [{ title: "CRM — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./copilot-DsHTuOKb.mjs");
var Route$33 = createFileRoute("/dashboard/recruitment/copilot")({
	head: () => ({ meta: [{ title: "Copilot — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./compliance-DDOEU509.mjs");
var Route$32 = createFileRoute("/dashboard/recruitment/compliance")({
	head: () => ({ meta: [{ title: "Compliance — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./career-site-Drrg4AJ7.mjs");
var Route$31 = createFileRoute("/dashboard/recruitment/career-site")({
	head: () => ({ meta: [{ title: "Career Site — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./candidates-W3Aoi1q8.mjs");
var Route$30 = createFileRoute("/dashboard/recruitment/candidates")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./calendar-CIqTxVsa.mjs");
var Route$29 = createFileRoute("/dashboard/recruitment/calendar")({
	head: () => ({ meta: [{ title: "Calendar — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./automation-KDOJUuup.mjs");
var Route$28 = createFileRoute("/dashboard/recruitment/automation")({
	head: () => ({ meta: [{ title: "Automation — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./analytics-CDb8WPy-.mjs");
var Route$27 = createFileRoute("/dashboard/recruitment/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./ai-CBhkvZb-.mjs");
var Route$26 = createFileRoute("/dashboard/recruitment/ai")({
	head: () => ({ meta: [{ title: "AI — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./dashboard.payroll.tax-BtaOABU5.mjs");
var Route$25 = createFileRoute("/dashboard/payroll/tax")({
	head: () => ({ meta: [{ title: "Tax Management — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./dashboard.payroll.settings-PHwkaqBv.mjs");
var Route$24 = createFileRoute("/dashboard/payroll/settings")({
	head: () => ({ meta: [{ title: "Payroll Settings — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./dashboard.payroll.salary-structure-Db7ePsRA.mjs");
var Route$23 = createFileRoute("/dashboard/payroll/salary-structure")({
	head: () => ({ meta: [{ title: "Salary Structure — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./dashboard.payroll.salary-processing-C2fiFJFt.mjs");
var Route$22 = createFileRoute("/dashboard/payroll/salary-processing")({
	head: () => ({ meta: [{ title: "Salary Processing — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./dashboard.payroll.reports-D0a_T_XK.mjs");
var Route$21 = createFileRoute("/dashboard/payroll/reports")({
	head: () => ({ meta: [{ title: "Payroll Reports — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./dashboard.payroll.reimbursements-bs1wwtW_.mjs");
var Route$20 = createFileRoute("/dashboard/payroll/reimbursements")({
	head: () => ({ meta: [{ title: "Reimbursements — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./dashboard.payroll.payslips-DK5jrcNO.mjs");
var Route$19 = createFileRoute("/dashboard/payroll/payslips")({
	head: () => ({ meta: [{ title: "My Payslips — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./dashboard.payroll.overtime-4kwYmgS3.mjs");
var Route$18 = createFileRoute("/dashboard/payroll/overtime")({
	head: () => ({ meta: [{ title: "Overtime Payments — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./dashboard.payroll.deductions-D5ZYy1Z4.mjs");
var Route$17 = createFileRoute("/dashboard/payroll/deductions")({
	head: () => ({ meta: [{ title: "Deductions — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./dashboard.payroll.copilot-CnAcBW5_.mjs");
var Route$16 = createFileRoute("/dashboard/payroll/copilot")({
	head: () => ({ meta: [{ title: "AI Payroll Copilot — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard.payroll.compliance-BA-ZYQpL.mjs");
var Route$15 = createFileRoute("/dashboard/payroll/compliance")({
	head: () => ({ meta: [{ title: "Compliance — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./dashboard.payroll.bonuses-Da4sb_ae.mjs");
var Route$14 = createFileRoute("/dashboard/payroll/bonuses")({
	head: () => ({ meta: [{ title: "Bonuses & Incentives — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./dashboard.payroll.bank-transfers-DkN87yte.mjs");
var Route$13 = createFileRoute("/dashboard/payroll/bank-transfers")({
	head: () => ({ meta: [{ title: "Bank Transfers — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./dashboard.payroll.approvals-BWTYqWbz.mjs");
var Route$12 = createFileRoute("/dashboard/payroll/approvals")({
	head: () => ({ meta: [{ title: "Payroll Approvals — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./dashboard.payroll.advances-4wTfdw-N.mjs");
var Route$11 = createFileRoute("/dashboard/payroll/advances")({
	head: () => ({ meta: [{ title: "Advances & Loans — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard.attendance.shifts-Cv5dJapi.mjs");
var Route$10 = createFileRoute("/dashboard/attendance/shifts")({
	head: () => ({ meta: [{ title: "Shifts — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./dashboard.attendance.rosters-Bz18cXFV.mjs");
var Route$9 = createFileRoute("/dashboard/attendance/rosters")({
	head: () => ({ meta: [{ title: "Rosters — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./dashboard.attendance.holidays-BgvkVTUk.mjs");
var Route$8 = createFileRoute("/dashboard/attendance/holidays")({
	head: () => ({ meta: [{ title: "Holidays — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard.attendance.checkin-DvPe5q0i.mjs");
var Route$7 = createFileRoute("/dashboard/attendance/checkin")({
	head: () => ({ meta: [{ title: "Check In / Check Out — OFC360" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./jobs-DQ_XES12.mjs");
var Route$6 = createFileRoute("/dashboard/recruitment/jobs/")({
	head: () => ({ meta: [{ title: "Jobs — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./candidates-idRK7u1l.mjs");
var Route$5 = createFileRoute("/dashboard/recruitment/candidates/")({
	head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard.super-admin.organizations._id-B9wn4Lge.mjs");
var Route$4 = createFileRoute("/dashboard/super-admin/organizations/$id")({
	head: () => ({ meta: [{ title: "Organization Detail — Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./new-C67wwbwp.mjs");
var Route$3 = createFileRoute("/dashboard/recruitment/jobs/new")({
	head: () => ({ meta: [{ title: "New Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_jobId-KKdYLQAu.mjs");
var Route$2 = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
	head: () => ({ meta: [{ title: "Job Detail — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_candidateId-CC_LyQre.mjs");
var Route$1 = createFileRoute("/dashboard/recruitment/candidates/$candidateId")({
	head: () => ({ meta: [{ title: "Candidate Profile — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./publish-DJ1hTgvq.mjs");
var Route = createFileRoute("/dashboard/recruitment/jobs/$jobId/publish")({
	head: () => ({ meta: [{ title: "Publish Job — Recruitment" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TermsRoute = Route$140.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$141
});
var SitemapDotxmlRoute = Route$139.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$141
});
var RobotsDottxtRoute = Route$138.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$141
});
var PrivacyRoute = Route$137.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$141
});
var PricingRoute = Route$136.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$141
});
var OnboardingRoute = Route$144.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$141
});
var FeaturesRoute = Route$135.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => Route$141
});
var FaqRoute = Route$134.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$141
});
var DashboardRoute = Route$133.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$141
});
var ContactRoute = Route$132.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$141
});
var BlogRoute = Route$131.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$141
});
var AiRoute = Route$130.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$141
});
var AboutRoute = Route$129.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$141
});
var IndexRoute = Route$128.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$141
});
var DashboardIndexRoute = Route$127.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var BlogIndexRoute = Route$126.update({
	id: "/",
	path: "/",
	getParentRoute: () => BlogRoute
});
var AiIndexRoute = Route$125.update({
	id: "/",
	path: "/",
	getParentRoute: () => AiRoute
});
var DashboardVisitorsRoute = Route$124.update({
	id: "/visitors",
	path: "/visitors",
	getParentRoute: () => DashboardRoute
});
var DashboardTravelRoute = Route$123.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => DashboardRoute
});
var DashboardTimesheetsRoute = Route$122.update({
	id: "/timesheets",
	path: "/timesheets",
	getParentRoute: () => DashboardRoute
});
var DashboardTimelineRoute = Route$121.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => DashboardRoute
});
var DashboardSuperAdminRoute = Route$120.update({
	id: "/super-admin",
	path: "/super-admin",
	getParentRoute: () => DashboardRoute
});
var DashboardSettingsRoute = Route$119.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardRoute
});
var DashboardRolesRoute = Route$118.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => DashboardRoute
});
var DashboardReportsRoute = Route$117.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRoute
});
var DashboardRecruitmentRoute = Route$116.update({
	id: "/recruitment",
	path: "/recruitment",
	getParentRoute: () => DashboardRoute
});
var DashboardPerformanceRoute = Route$115.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => DashboardRoute
});
var DashboardPeopleRoute = Route$114.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => DashboardRoute
});
var DashboardPayrollRoute = Route$113.update({
	id: "/payroll",
	path: "/payroll",
	getParentRoute: () => DashboardRoute
});
var DashboardOnboardingChecklistRoute = Route$112.update({
	id: "/onboarding-checklist",
	path: "/onboarding-checklist",
	getParentRoute: () => DashboardRoute
});
var DashboardOffboardingRoute = Route$111.update({
	id: "/offboarding",
	path: "/offboarding",
	getParentRoute: () => DashboardRoute
});
var DashboardManagersRoute = Route$110.update({
	id: "/managers",
	path: "/managers",
	getParentRoute: () => DashboardRoute
});
var DashboardManagerRoute = Route$109.update({
	id: "/manager",
	path: "/manager",
	getParentRoute: () => DashboardRoute
});
var DashboardLifecycleRoute = Route$108.update({
	id: "/lifecycle",
	path: "/lifecycle",
	getParentRoute: () => DashboardRoute
});
var DashboardLeavesRoute = Route$107.update({
	id: "/leaves",
	path: "/leaves",
	getParentRoute: () => DashboardRoute
});
var DashboardHrOpsRoute = Route$106.update({
	id: "/hr-ops",
	path: "/hr-ops",
	getParentRoute: () => DashboardRoute
});
var DashboardHrRoute = Route$105.update({
	id: "/hr",
	path: "/hr",
	getParentRoute: () => DashboardRoute
});
var DashboardExpensesRoute = Route$104.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => DashboardRoute
});
var DashboardExitManagementRoute = Route$103.update({
	id: "/exit-management",
	path: "/exit-management",
	getParentRoute: () => DashboardRoute
});
var DashboardExitRoute = Route$102.update({
	id: "/exit",
	path: "/exit",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeesRoute = Route$101.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => DashboardRoute
});
var DashboardEmployeeRoute = Route$100.update({
	id: "/employee",
	path: "/employee",
	getParentRoute: () => DashboardRoute
});
var DashboardDocumentsRoute = Route$99.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => DashboardRoute
});
var DashboardDepartmentsRoute = Route$98.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DashboardRoute
});
var DashboardCommunicationRoute = Route$97.update({
	id: "/communication",
	path: "/communication",
	getParentRoute: () => DashboardRoute
});
var DashboardBillingRoute = Route$96.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardRoute
});
var DashboardAuditLogsRoute = Route$95.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardRoute
});
var DashboardAttendanceRoute = Route$94.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetsRoute = Route$93.update({
	id: "/assets",
	path: "/assets",
	getParentRoute: () => DashboardRoute
});
var DashboardAssetManagementRoute = Route$92.update({
	id: "/asset-management",
	path: "/asset-management",
	getParentRoute: () => DashboardRoute
});
var DashboardAiInsightsRoute = Route$91.update({
	id: "/ai-insights",
	path: "/ai-insights",
	getParentRoute: () => DashboardRoute
});
var BlogSlugRoute = Route$142.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var ApiPayrollCopilotRoute = Route$90.update({
	id: "/api/payroll-copilot",
	path: "/api/payroll-copilot",
	getParentRoute: () => Route$141
});
var ApiAiBrainRoute = Route$89.update({
	id: "/api/ai-brain",
	path: "/api/ai-brain",
	getParentRoute: () => Route$141
});
var AiWorkforcePlanningRoute = Route$88.update({
	id: "/workforce-planning",
	path: "/workforce-planning",
	getParentRoute: () => AiRoute
});
var AiWorkforceInsightsRoute = Route$87.update({
	id: "/workforce-insights",
	path: "/workforce-insights",
	getParentRoute: () => AiRoute
});
var AiRecruiterRoute = Route$86.update({
	id: "/recruiter",
	path: "/recruiter",
	getParentRoute: () => AiRoute
});
var AiPolicyAssistantRoute = Route$85.update({
	id: "/policy-assistant",
	path: "/policy-assistant",
	getParentRoute: () => AiRoute
});
var AiPerformanceCoachRoute = Route$84.update({
	id: "/performance-coach",
	path: "/performance-coach",
	getParentRoute: () => AiRoute
});
var AiPayrollInsightsRoute = Route$83.update({
	id: "/payroll-insights",
	path: "/payroll-insights",
	getParentRoute: () => AiRoute
});
var AiMeetingIntelligenceRoute = Route$82.update({
	id: "/meeting-intelligence",
	path: "/meeting-intelligence",
	getParentRoute: () => AiRoute
});
var AiLeaveAssistantRoute = Route$81.update({
	id: "/leave-assistant",
	path: "/leave-assistant",
	getParentRoute: () => AiRoute
});
var AiEmployeeHealthRoute = Route$80.update({
	id: "/employee-health",
	path: "/employee-health",
	getParentRoute: () => AiRoute
});
var AiDocumentGeneratorRoute = Route$79.update({
	id: "/document-generator",
	path: "/document-generator",
	getParentRoute: () => AiRoute
});
var AiComplianceMonitorRoute = Route$78.update({
	id: "/compliance-monitor",
	path: "/compliance-monitor",
	getParentRoute: () => AiRoute
});
var AiChatAssistantRoute = Route$77.update({
	id: "/chat-assistant",
	path: "/chat-assistant",
	getParentRoute: () => AiRoute
});
var AiBrainRoute = Route$76.update({
	id: "/brain",
	path: "/brain",
	getParentRoute: () => AiRoute
});
var AiAttendanceMonitorRoute = Route$75.update({
	id: "/attendance-monitor",
	path: "/attendance-monitor",
	getParentRoute: () => AiRoute
});
var AiAnalyticsCenterRoute = Route$74.update({
	id: "/analytics-center",
	path: "/analytics-center",
	getParentRoute: () => AiRoute
});
var AuthVerifyResetOtpRoute = Route$73.update({
	id: "/_auth/verify-reset-otp",
	path: "/verify-reset-otp",
	getParentRoute: () => Route$141
});
var AuthVerifyEmailRoute = Route$72.update({
	id: "/_auth/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$141
});
var AuthResetPasswordRoute = Route$71.update({
	id: "/_auth/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$141
});
var AuthRegisterRoute = Route$70.update({
	id: "/_auth/register",
	path: "/register",
	getParentRoute: () => Route$141
});
var AuthLoginRoute = Route$69.update({
	id: "/_auth/login",
	path: "/login",
	getParentRoute: () => Route$141
});
var AuthForgotPasswordRoute = Route$68.update({
	id: "/_auth/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$141
});
var DashboardSuperAdminIndexRoute = Route$67.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardRecruitmentIndexRoute = Route$66.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPayrollIndexRoute = Route$65.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardAttendanceIndexRoute = Route$64.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardAttendanceRoute
});
var JobsApplyUkeyRoute = Route$143.update({
	id: "/jobs/apply/$ukey",
	path: "/jobs/apply/$ukey",
	getParentRoute: () => Route$141
});
var DashboardSuperAdminUsersRoute = Route$63.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminUnpaidActiveRoute = Route$62.update({
	id: "/unpaid-active",
	path: "/unpaid-active",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminSystemHealthRoute = Route$61.update({
	id: "/system-health",
	path: "/system-health",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminSettingsRoute = Route$60.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminSecurityRoute = Route$59.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminPlansRoute = Route$58.update({
	id: "/plans",
	path: "/plans",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminPaymentsRoute = Route$57.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminOrganizationsRoute = Route$56.update({
	id: "/organizations",
	path: "/organizations",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminEntitlementsRoute = Route$55.update({
	id: "/entitlements",
	path: "/entitlements",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminBillingRoute = Route$54.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAuditLogsRoute = Route$53.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAnnouncementsRoute = Route$52.update({
	id: "/announcements",
	path: "/announcements",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAnalyticsRoute = Route$51.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardSuperAdminAiUsageRoute = Route$50.update({
	id: "/ai-usage",
	path: "/ai-usage",
	getParentRoute: () => DashboardSuperAdminRoute
});
var DashboardRecruitmentVendorsRoute = Route$49.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTemplatesRoute = Route$48.update({
	id: "/templates",
	path: "/templates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentTalentPoolRoute = Route$47.update({
	id: "/talent-pool",
	path: "/talent-pool",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentSearchRoute = Route$46.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentScorecardsRoute = Route$45.update({
	id: "/scorecards",
	path: "/scorecards",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentResumeIntelligenceRoute = Route$44.update({
	id: "/resume-intelligence",
	path: "/resume-intelligence",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentRequisitionsRoute = Route$43.update({
	id: "/requisitions",
	path: "/requisitions",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReportsRoute = Route$42.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentReferralsRoute = Route$41.update({
	id: "/referrals",
	path: "/referrals",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentPipelineRoute = Route$40.update({
	id: "/pipeline",
	path: "/pipeline",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOnboardingRoute = Route$39.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentOffersRoute = Route$38.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentNotificationsRoute = Route$37.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentInterviewsRoute = Route$36.update({
	id: "/interviews",
	path: "/interviews",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentImportExportRoute = Route$35.update({
	id: "/import-export",
	path: "/import-export",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCrmRoute = Route$34.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCopilotRoute = Route$33.update({
	id: "/copilot",
	path: "/copilot",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentComplianceRoute = Route$32.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCareerSiteRoute = Route$31.update({
	id: "/career-site",
	path: "/career-site",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesRoute = Route$30.update({
	id: "/candidates",
	path: "/candidates",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCalendarRoute = Route$29.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAutomationRoute = Route$28.update({
	id: "/automation",
	path: "/automation",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAnalyticsRoute = Route$27.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentAiRoute = Route$26.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardPayrollTaxRoute = Route$25.update({
	id: "/tax",
	path: "/tax",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSettingsRoute = Route$24.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSalaryStructureRoute = Route$23.update({
	id: "/salary-structure",
	path: "/salary-structure",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollSalaryProcessingRoute = Route$22.update({
	id: "/salary-processing",
	path: "/salary-processing",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollReportsRoute = Route$21.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollReimbursementsRoute = Route$20.update({
	id: "/reimbursements",
	path: "/reimbursements",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollPayslipsRoute = Route$19.update({
	id: "/payslips",
	path: "/payslips",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollOvertimeRoute = Route$18.update({
	id: "/overtime",
	path: "/overtime",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollDeductionsRoute = Route$17.update({
	id: "/deductions",
	path: "/deductions",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollCopilotRoute = Route$16.update({
	id: "/copilot",
	path: "/copilot",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollComplianceRoute = Route$15.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollBonusesRoute = Route$14.update({
	id: "/bonuses",
	path: "/bonuses",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollBankTransfersRoute = Route$13.update({
	id: "/bank-transfers",
	path: "/bank-transfers",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollApprovalsRoute = Route$12.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardPayrollAdvancesRoute = Route$11.update({
	id: "/advances",
	path: "/advances",
	getParentRoute: () => DashboardPayrollRoute
});
var DashboardAttendanceShiftsRoute = Route$10.update({
	id: "/shifts",
	path: "/shifts",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceRostersRoute = Route$9.update({
	id: "/rosters",
	path: "/rosters",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceHolidaysRoute = Route$8.update({
	id: "/holidays",
	path: "/holidays",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardAttendanceCheckinRoute = Route$7.update({
	id: "/checkin",
	path: "/checkin",
	getParentRoute: () => DashboardAttendanceRoute
});
var DashboardRecruitmentJobsIndexRoute = Route$6.update({
	id: "/jobs/",
	path: "/jobs/",
	getParentRoute: () => DashboardRecruitmentRoute
});
var DashboardRecruitmentCandidatesIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRecruitmentCandidatesRoute
});
var DashboardSuperAdminOrganizationsIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DashboardSuperAdminOrganizationsRoute
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
var DashboardRecruitmentRouteWithChildren = DashboardRecruitmentRoute._addFileChildren(DashboardRecruitmentRouteChildren);
var DashboardSuperAdminOrganizationsRouteChildren = { DashboardSuperAdminOrganizationsIdRoute };
var DashboardSuperAdminRouteChildren = {
	DashboardSuperAdminAiUsageRoute,
	DashboardSuperAdminAnalyticsRoute,
	DashboardSuperAdminAnnouncementsRoute,
	DashboardSuperAdminAuditLogsRoute,
	DashboardSuperAdminBillingRoute,
	DashboardSuperAdminEntitlementsRoute,
	DashboardSuperAdminOrganizationsRoute: DashboardSuperAdminOrganizationsRoute._addFileChildren(DashboardSuperAdminOrganizationsRouteChildren),
	DashboardSuperAdminPaymentsRoute,
	DashboardSuperAdminPlansRoute,
	DashboardSuperAdminSecurityRoute,
	DashboardSuperAdminSettingsRoute,
	DashboardSuperAdminSystemHealthRoute,
	DashboardSuperAdminUnpaidActiveRoute,
	DashboardSuperAdminUsersRoute,
	DashboardSuperAdminIndexRoute
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
	DashboardRecruitmentRoute: DashboardRecruitmentRouteWithChildren,
	DashboardReportsRoute,
	DashboardRolesRoute,
	DashboardSettingsRoute,
	DashboardSuperAdminRoute: DashboardSuperAdminRoute._addFileChildren(DashboardSuperAdminRouteChildren),
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
	RobotsDottxtRoute,
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
var routeTree = Route$141._addFileChildren(rootRouteChildren)._addFileTypes();
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
