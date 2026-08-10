import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { jt as rememberStore, pt as getErrorMessage } from "./ofc360-store-_w51fT7p.mjs";
import { t as api } from "./client-1j6fcGcU.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as getPostLoginRoute, r as persistAuthSession } from "./auth-bootstrap-Cccu2Fgg.mjs";
import { Dn as EyeOff, En as Eye, Pt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { Q as stringType, X as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as AuthShell } from "./AuthShell-DbDSmH_T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C43YuCXa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function asRecord(value) {
	return value && typeof value === "object" ? value : null;
}
function normalizeUser(raw) {
	const user = asRecord(raw);
	if (!user || typeof user.email !== "string") return null;
	const combinedName = [typeof user.first_name === "string" ? user.first_name : "", typeof user.last_name === "string" ? user.last_name : ""].filter(Boolean).join(" ");
	return {
		id: typeof user.id === "string" || typeof user.id === "number" ? user.id : "",
		name: String(user.name ?? user.full_name ?? user.fullName ?? combinedName ?? ""),
		email: user.email,
		phone: typeof user.phone === "string" ? user.phone : void 0,
		role: user.role ?? "employee",
		is_verified: Boolean(user.is_verified ?? user.isVerified ?? user.email_verified),
		onboarding_completed: Boolean(user.onboarding_completed ?? user.onboardingCompleted),
		created_at: typeof user.created_at === "string" ? user.created_at : void 0,
		company_id: typeof user.company_id === "string" || typeof user.company_id === "number" ? user.company_id : typeof user.companyId === "string" || typeof user.companyId === "number" ? user.companyId : void 0,
		company_name: typeof user.company_name === "string" ? user.company_name : typeof user.companyName === "string" ? user.companyName : void 0
	};
}
function parseLoginResponse(res) {
	const body = asRecord(res);
	if (!body) return null;
	const nested = asRecord(body.data);
	const tokenSources = [
		asRecord(nested?.tokens),
		nested,
		body
	].filter(Boolean);
	let accessToken;
	let refreshToken;
	for (const source of tokenSources) {
		accessToken ??= source.access_token ?? source.accessToken ?? source.token;
		refreshToken ??= source.refresh_token ?? source.refreshToken;
	}
	const user = normalizeUser(nested?.user ?? body.user ?? (nested && typeof nested.email === "string" && accessToken !== nested.access_token && accessToken !== nested.accessToken ? nested : null));
	if (typeof accessToken !== "string" || typeof refreshToken !== "string" || !user) return null;
	return {
		accessToken,
		refreshToken,
		user
	};
}
function getApiResponseMessage(res, fallback = "Server error") {
	const body = asRecord(res);
	if (!body) return fallback;
	return typeof body.message === "string" && body.message ? body.message : fallback;
}
var schema = objectType({
	email: stringType().email("Enter a valid work email"),
	password: stringType().min(8, "Password must be at least 8 characters")
});
function formatLoginError(message) {
	return message === "Invalid email or password." ? "Invalid email or password" : message;
}
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const savedEmail = rememberStore.get();
		if (savedEmail) {
			setEmail(savedEmail);
			setRemember(true);
		}
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		const r = schema.safeParse({
			email,
			password
		});
		if (!r.success) {
			const fe = {};
			r.error.issues.forEach((i) => fe[i.path[0]] = i.message);
			setErrors(fe);
			return;
		}
		setErrors({});
		setLoading(true);
		try {
			if (remember) rememberStore.set(email);
			else rememberStore.clear();
			const res = await api.post("auth/login", {
				identifier: email,
				password
			});
			const login = parseLoginResponse(res);
			if (login) {
				const { accessToken, refreshToken, user } = login;
				persistAuthSession(user, {
					accessToken,
					refreshToken
				});
				toast.success(`Welcome back, ${user.name}!`);
				navigate({ to: getPostLoginRoute(user) });
				return;
			}
			toast.error(formatLoginError(getApiResponseMessage(res)));
		} catch (err) {
			toast.error(formatLoginError(getErrorMessage(err, "Server error")));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Welcome back",
		subtitle: "Sign in to your ofc360 workspace",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"New to ofc360?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/register",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "Create a workspace"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			noValidate: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Work email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							autoComplete: "email",
							placeholder: "you@company.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							"aria-invalid": !!errors.email
						}),
						errors.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.email
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/forgot-password",
								className: "text-xs text-muted-foreground hover:text-foreground",
								children: "Forgot password?"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: show ? "text" : "password",
								autoComplete: "current-password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								"aria-invalid": !!errors.password
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShow((s) => !s),
								className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground",
								"aria-label": show ? "Hide password" : "Show password",
								children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						errors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.password
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: remember,
						onCheckedChange: (v) => setRemember(Boolean(v))
					}), "Remember me on this device"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Sign in"]
				})
			]
		})
	});
}
var SplitComponent = LoginPage;
//#endregion
export { SplitComponent as component };
