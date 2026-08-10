import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({
    meta: [
      { title: "Sign In — OFC360" },
      { name: "description", content: "Sign in to your OFC360 HRMS workspace." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});
