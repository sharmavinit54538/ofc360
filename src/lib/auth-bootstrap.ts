import { useSyncExternalStore } from "react";
import { api, getTokens, hasValidAccessToken, isAccessTokenExpired, setTokens } from "@/api";
import type { AuthMeResponse, AuthUserPayload } from "@/api";
import { ofc360 } from "./ofc360-store";

type AuthStatus = "loading" | "ready";

let status: AuthStatus = "ready";
let bootstrapPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStatus(next: AuthStatus) {
  status = next;
  emit();
}

function mapAuthUser(data: AuthUserPayload) {
  const ws = ofc360.get();
  const companyId = data.company_id ? String(data.company_id) : ws.user?.companyId || "workspace";

  return {
    user: {
      id: String(data.id),
      fullName: data.name,
      email: data.email,
      phone: data.phone || "",
      role: data.role,
      companyId,
      emailVerified: data.is_verified ?? true,
      onboardingComplete: data.onboarding_completed ?? true,
      createdAt: data.created_at ?? new Date().toISOString(),
    },
    company: {
      id: companyId,
      name: data.company_name || data.name,
    },
  };
}

export function persistAuthSession(
  user: AuthUserPayload,
  tokens: { accessToken: string; refreshToken: string },
) {
  setTokens(tokens);
  ofc360.set(mapAuthUser(user));
  setStatus("ready");
}

export function getPostLoginRoute(user: AuthUserPayload): string {
  if (user.is_verified === false) return "/verify-email";
  if (user.onboarding_completed === false) return "/onboarding";

  const r = (user.role as string)?.toLowerCase();
  if (r === "super_admin") return "/dashboard/super-admin";
  if (r === "manager") return "/dashboard/manager";
  if (r === "employee") return "/dashboard/employee";
  return "/dashboard";
}

export async function bootstrapAuth(): Promise<void> {
  if (typeof window === "undefined") return;

  // Unblock UI immediately so pages render in 0ms without hanging
  ofc360.set({ isRestoring: false });
  setStatus("ready");

  const tokens = getTokens();
  const ws = ofc360.get();

  // If no tokens present at all, clear user state
  if (!tokens?.accessToken) {
    if (ws.user) {
      ofc360.set({ user: null, company: null });
    }
    return;
  }

  if (ws.user && !isAccessTokenExpired(tokens.accessToken)) {
    return;
  }

  // Silent background revalidation (never blocks UI rendering)
  try {
    const res = await api.get<AuthMeResponse>("auth/me");
    if (res.success && res.data) {
      ofc360.set(mapAuthUser(res.data));
    }
  } catch {
    // Keep local session if background revalidation fails due to network/server errors
  }
}

if (typeof window !== "undefined") {
  void bootstrapAuth();
}

export function useAuthReady(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => status === "ready",
    () => true,
  );
}
