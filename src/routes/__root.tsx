import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/redux/store";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { bootstrapAuth } from "../lib/auth-bootstrap";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from "../lib/seo";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../components/site/ThemeProvider";

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data (Organization + WebSite)                    */
/* ------------------------------------------------------------------ */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "EquinoxSphere Technologies",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "AI-powered HRMS platform for modern organizations — recruitment, attendance, payroll, performance, and 70+ AI agents.",
  sameAs: [
    "https://www.instagram.com/ofc360ai/",
    "https://www.linkedin.com/company/ofc360/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@ofc360.com",
    contactType: "sales",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies.",
  publisher: { "@type": "Organization", name: "EquinoxSphere Technologies" },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OFC360 — AI-Powered HRMS Platform" },
      { name: "description", content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies." },
      { name: "author", content: "EquinoxSphere Technologies" },
      { name: "theme-color", content: "#7c3aed" },
      // Open Graph defaults (overridden by child routes)
      { property: "og:title", content: "OFC360 — AI-Powered HRMS Platform" },
      { property: "og:description", content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:url", content: SITE_URL },
      // Twitter Card defaults
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:title", content: "OFC360 — AI-Powered HRMS Platform" },
      { name: "twitter:description", content: "AI-powered HRMS platform for modern organizations by EquinoxSphere Technologies." },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [
      // Favicon
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      // Stylesheet
      { rel: "stylesheet", href: appCss },
      // Preconnect — Razorpay CDN (used for payments)
      { rel: "dns-prefetch", href: "https://checkout.razorpay.com" },
    ],
    scripts: [
      {
        src: "https://checkout.razorpay.com/v1/checkout.js",
        defer: true,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    void bootstrapAuth();
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
