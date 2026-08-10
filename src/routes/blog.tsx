import { createFileRoute, Outlet } from "@tanstack/react-router";
import { buildMeta, buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: buildMeta({
      title: "OFC360 | Blog — Insights on HR, AI & Future of Work",
      description: "Stories, product updates, and ideas from the OFC360 team.",
      url: "/blog",
    }),
    links: buildCanonical("/blog"),
  }),
  component: () => <Outlet />,
});
