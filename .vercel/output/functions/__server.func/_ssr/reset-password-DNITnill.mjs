import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-YdrXBLNs.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { En as EyeOff, Nt as LoaderCircle, Tn as Eye } from "../_libs/lucide-react.mjs";
import { l as useLocation, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as AuthShell } from "./AuthShell-BEQNKGwY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-DNITnill.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { email: searchEmail, resetToken: searchResetToken } = useSearch({ strict: false });
	const state = location.state;
	const email = searchEmail || state?.email || "";
	const resetToken = searchResetToken || state?.resetToken || "";
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [validationError, setValidationError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!email || !resetToken) {
			toast.error("Invalid reset session. Please request OTP again.");
			navigate({ to: "/forgot-password" });
		}
	}, [
		email,
		resetToken,
		navigate
	]);
	const validatePassword = () => {
		if (password.length < 8) return "Password must be at least 8 characters long";
		if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
		if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
		if (!/\d/.test(password)) return "Password must contain at least one number";
		if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
		if (password !== confirmPassword) return "Passwords do not match";
		return null;
	};
	async function onSubmit(e) {
		e.preventDefault();
		if (loading) return;
		const err = validatePassword();
		if (err) {
			setValidationError(err);
			return;
		}
		setValidationError(null);
		setLoading(true);
		try {
			const res = await api.post("auth/reset-password", {
				email,
				resetToken,
				new_password: password
			});
			if (res.success) {
				toast.success("Password updated successfully.");
				setTimeout(() => {
					navigate({ to: "/login" });
				}, 2e3);
			} else toast.error(res.message || "Failed to reset password.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to reset password.";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Create new password",
		subtitle: "Choose a secure password with letters, numbers, and symbols.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "new-password",
						children: "New Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "new-password",
							type: show ? "text" : "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							disabled: loading
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShow((s) => !s),
							className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground",
							children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "confirm-password",
						children: "Confirm Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "confirm-password",
						type: show ? "text" : "password",
						value: confirmPassword,
						onChange: (e) => setConfirmPassword(e.target.value),
						placeholder: "••••••••",
						disabled: loading
					})]
				}),
				validationError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive",
					children: validationError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Reset Password"]
				})
			]
		})
	});
}
var SplitComponent = ResetPasswordPage;
//#endregion
export { SplitComponent as component };
