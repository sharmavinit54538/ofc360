import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({ meta: [{ title: "OFC360 | Forgot Password" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ForgotPasswordPage,
});
