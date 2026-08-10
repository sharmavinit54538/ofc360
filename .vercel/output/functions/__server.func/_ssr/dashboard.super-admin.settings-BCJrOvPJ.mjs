import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { U as Settings, X as Save } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { t as Card } from "./card-xVPC106M.mjs";
import { t as superAdminApi } from "./superAdminApi-snn_gfBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.settings-BCJrOvPJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminSettingsPage() {
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		superAdminApi.getSettings().then(setSettings).catch(console.error).finally(() => setIsLoading(false));
	}, []);
	const handleSave = async () => {
		if (!settings) return;
		setIsSaving(true);
		try {
			await superAdminApi.updateSettings(settings);
			alert("Platform settings updated successfully!");
		} catch (err) {
			alert("Failed to save settings: " + (err.message || "Unknown error"));
		} finally {
			setIsSaving(false);
		}
	};
	if (isLoading || !settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-xs text-muted-foreground animate-pulse",
		children: "Loading platform configuration..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-bold text-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5 text-indigo-400" }), "Global SaaS Multi-Tenant Platform Configuration"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Manage global registration defaults, security rules, and AI engine defaults."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: isSaving,
				onClick: handleSave,
				size: "sm",
				className: "h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }),
					" ",
					isSaving ? "Saving..." : "Save Settings"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-border bg-card/40 backdrop-blur-xl p-6 space-y-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-foreground",
							children: "Platform Application Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.app_name,
							onChange: (e) => setSettings({
								...settings,
								app_name: e.target.value
							}),
							className: "bg-background/50 h-9 text-xs max-w-md"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Allow Self-Service Tenant Registration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground",
							children: "New companies can sign up without manual Super Admin invite"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.allow_public_registrations,
							onCheckedChange: (val) => setSettings({
								...settings,
								allow_public_registrations: val
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Enforce Single Super Admin Database Constraint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground",
							children: "Rejects any attempt to create or promote secondary Super Admin accounts"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.enforce_single_super_admin,
							disabled: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Enable Platform AI Suite Engine"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground",
							children: "Activates Ollama local LLM processing across recruitment, attendance, and documents"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.enable_ai_suite,
							onCheckedChange: (val) => setSettings({
								...settings,
								enable_ai_suite: val
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-foreground",
							children: "Platform Maintenance Mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-rose-400 font-semibold",
							children: "Temporarily restricts tenant user logins while performing system upgrades"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.maintenance_mode,
							onCheckedChange: (val) => setSettings({
								...settings,
								maintenance_mode: val
							})
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { SuperAdminSettingsPage as component };
