import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://www.ofc360.com";

const robotsTxt = `# OFC360 — robots.txt
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
Disallow: /admin
Disallow: /admin/
Disallow: /super-admin
Disallow: /super-admin/
Disallow: /employee
Disallow: /employee/
Disallow: /settings
Disallow: /settings/
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
Sitemap: ${BASE_URL}/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(robotsTxt, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
          },
        });
      },
    },
  },
});
