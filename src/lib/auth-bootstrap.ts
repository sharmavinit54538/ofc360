import { useSyncExternalStore } from "react";
import { api, getTokens, hasValidAccessToken, isAccessTokenExpired, setTokens } from "@/api";
import type { AuthMeResponse, AuthUserPayload } from "@/api";
import { aurix } from "./aurix-store";

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
  const ws = aurix.get();
  const companyId = data.company_id ? String(data.company_id) : ws.user?.companyId || "workspace";

  return {
    user: {
      id: String(data.id),
      fullName: data.name,
      email: data.email,
      phone: data.phone || "",
      role: data.role,
      companyId,
      emailVerified: data.is_verified,
      onboardingComplete: data.onboarding_completed ?? false,
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
  aurix.set(mapAuthUser(user));
}

export function getPostLoginRoute(user: AuthUserPayload): string {
  if (!user.is_verified) return "/verify-email";
  if (!user.onboarding_completed) return "/onboarding";
  if (user.role === "manager") return "/dashboard/manager";
  if (user.role === "employee") return "/dashboard/employee";
  return "/dashboard";
}

export async function bootstrapAuth(): Promise<void> {
  if (typeof window === "undefined") return;
  if (bootstrapPromise) return bootstrapPromise;

  // Unblock UI immediately so pages render in 0ms without hanging
  aurix.set({ isRestoring: false });
  setStatus("ready");

  bootstrapPromise = (async () => {
    const tokens = getTokens();
    const ws = aurix.get();

    // If no tokens or already cached valid user session, finish immediately
    if (!tokens?.accessToken) {
      return;
    }

    if (ws.user && !isAccessTokenExpired(tokens.accessToken)) {
      return;
    }

    // Silent background revalidation (never blocks UI rendering)
    try {
      const res = await api.get<AuthMeResponse>("auth/me");
      if (res.success && res.data) {
        aurix.set(mapAuthUser(res.data));
      } else if (!hasValidAccessToken()) {
        setTokens(null);
        aurix.set({ user: null, company: null });
      }
    } catch {
      if (!hasValidAccessToken()) {
        setTokens(null);
        aurix.set({ user: null, company: null });
      }
    }
  })();

  return bootstrapPromise;
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
