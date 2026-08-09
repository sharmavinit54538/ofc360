import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/recruitment")({
  head: () => ({ meta: [{ title: "Recruitment — ofc360" }] }),
  component: () => <Outlet />,
});
