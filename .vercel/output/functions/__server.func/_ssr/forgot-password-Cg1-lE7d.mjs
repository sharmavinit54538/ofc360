import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-DZR8fCuj.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { Nt as LoaderCircle, Rr as ArrowLeft, kt as Mail } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { Q as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as AuthShell } from "./AuthShell-DRy0z4Ke.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-Cg1-lE7d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (loading) return;
		if (!stringType().email().safeParse(email).success) return setError("Enter a valid email address");
		setError(null);
		setLoading(true);
		try {
			const res = await api.post("auth/forgot-password", { email });
			if (res?.success !== false) {
				setSubmitted(true);
				toast.success(res?.message || "Password reset email sent.");
			} else toast.error(res?.message || "Failed to process password reset.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to send reset email. Check server connection.";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		title: "Check your email",
		subtitle: "We've sent a password reset link to your inbox.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/login",
			className: "inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to sign in"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-foreground",
					children: "Reset Link Delivered"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: [
						"If an account exists for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: email
						}),
						", a password reset link has been sent. Please check your inbox and spam folder."
					]
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-2 text-center text-xs text-muted-foreground",
			children: [
				"Didn't receive the email?",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSubmitted(false),
					className: "font-medium text-primary hover:underline",
					children: "Try another email address"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Reset your password",
		subtitle: "Enter the email tied to your workspace and we'll send a password reset link.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "font-medium text-foreground underline-offset-4 hover:underline",
			children: "Back to sign in"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			noValidate: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "forgot-email",
						children: "Work email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "forgot-email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@company.com",
						"aria-invalid": !!error,
						disabled: loading
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: error
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "w-full",
				disabled: loading || !email.trim(),
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Send Reset Link"]
			})]
		})
	});
}
var SplitComponent = ForgotPasswordPage;
//#endregion
export { SplitComponent as component };
