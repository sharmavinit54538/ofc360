import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Bt as setTokens, kt as ofc360, vt as getTokens, wt as isAccessTokenExpired } from "./ofc360-store-Dm5opMS0.mjs";
import { t as api } from "./client-DZR8fCuj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-bootstrap-BOWZmKtQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var status = "ready";
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
			emailVerified: data.is_verified ?? true,
			onboardingComplete: data.onboarding_completed ?? true,
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
	setStatus("ready");
}
function getPostLoginRoute(user) {
	if (user.is_verified === false) return "/verify-email";
	if (user.onboarding_completed === false) return "/onboarding";
	const r = user.role?.toLowerCase();
	if (r === "super_admin") return "/dashboard/super-admin";
	if (r === "manager") return "/dashboard/manager";
	if (r === "employee") return "/dashboard/employee";
	return "/dashboard";
}
async function bootstrapAuth() {
	if (typeof window === "undefined") return;
	ofc360.set({ isRestoring: false });
	setStatus("ready");
	const tokens = getTokens();
	const ws = ofc360.get();
	if (!tokens?.accessToken) {
		if (ws.user) ofc360.set({
			user: null,
			company: null
		});
		return;
	}
	if (ws.user && !isAccessTokenExpired(tokens.accessToken)) return;
	try {
		const res = await api.get("auth/me");
		if (res.success && res.data) ofc360.set(mapAuthUser(res.data));
	} catch {}
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
