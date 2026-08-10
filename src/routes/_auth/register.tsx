import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export const Route = createFileRoute("/_auth/register")({
  head: () => ({
    meta: [
      { title: "OFC360 | Get Started" },
      { name: "description", content: "Create your OFC360 HRMS workspace and start managing your team with AI." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RegisterPage,
});
