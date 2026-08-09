import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Dt as ofc360, Rt as setTokens, St as isAccessTokenExpired, _t as hasValidAccessToken, ht as getTokens } from "./ofc360-store-Cb6xhYOw.mjs";
import { t as api } from "./client-Cbbel9lL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-bootstrap-Dm6LCtAU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var status = "ready";
var bootstrapPromise = null;
var listeners = /* @__PURE__ */ new Set();
function emit() {
	listeners.forEach((listener) => listener());
}
function setStatus(next) {
	status = next;
	emit();
}
function mapAuthUser(data) {
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
			emailVerified: data.is_verified,
			onboardingComplete: data.onboarding_completed ?? false,
			createdAt: data.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
		},
		company: {
			id: companyId,
			name: data.company_name || data.name
		}
	};
}
function persistAuthSession(user, tokens) {
	setTokens(tokens);
	ofc360.set(mapAuthUser(user));
}
function getPostLoginRoute(user) {
	if (!user.is_verified) return "/verify-email";
	if (!user.onboarding_completed) return "/onboarding";
	if (user.role === "manager") return "/dashboard/manager";
	if (user.role === "employee") return "/dashboard/employee";
	return "/dashboard";
}
async function bootstrapAuth() {
	if (typeof window === "undefined") return;
	if (bootstrapPromise) return bootstrapPromise;
	ofc360.set({ isRestoring: false });
	setStatus("ready");
	bootstrapPromise = (async () => {
		const tokens = getTokens();
		const ws = ofc360.get();
		if (!tokens?.accessToken) return;
		if (ws.user && !isAccessTokenExpired(tokens.accessToken)) return;
		try {
			const res = await api.get("auth/me");
			if (res.success && res.data) ofc360.set(mapAuthUser(res.data));
			else if (!hasValidAccessToken()) {
				setTokens(null);
				ofc360.set({
					user: null,
					company: null
				});
			}
		} catch {
			if (!hasValidAccessToken()) {
				setTokens(null);
				ofc360.set({
					user: null,
					company: null
				});
			}
		}
	})();
	return bootstrapPromise;
}
if (typeof window !== "undefined") bootstrapAuth();
function useAuthReady() {
	return (0, import_react.useSyncExternalStore)((listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}, () => status === "ready", () => true);
}
//#endregion
export { useAuthReady as i, getPostLoginRoute as n, persistAuthSession as r, bootstrapAuth as t };
