import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: "Sign in — ofc360" }] }),
  component: LoginPage,
});
