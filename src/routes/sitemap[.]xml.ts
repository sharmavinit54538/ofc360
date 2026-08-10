import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { posts } from "@/lib/blog-data";

const BASE_URL = "https://www.ofc360.com";

const today = new Date().toISOString().split("T")[0];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticRoutes = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/features", priority: "0.8", changefreq: "monthly" },
          { path: "/pricing", priority: "0.8", changefreq: "monthly" },
          { path: "/about", priority: "0.7", changefreq: "monthly" },
          { path: "/ai", priority: "0.7", changefreq: "weekly" },
          { path: "/blog", priority: "0.7", changefreq: "weekly" },
          { path: "/faq", priority: "0.6", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
        ];

        const blogRoutes = posts.map((p) => ({
          path: `/blog/${p.slug}`,
          priority: "0.6",
          changefreq: "monthly" as const,
        }));

        const allRoutes = [...staticRoutes, ...blogRoutes];

        const urls = allRoutes
          .map(
            (r) =>
              `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
