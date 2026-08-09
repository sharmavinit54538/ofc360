import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Dt as ofc360, on as useofc360 } from "./ofc360-store-Cb6xhYOw.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as Save, Ar as Building2, It as LogOut, U as Shield, W as ShieldCheck, Wn as CreditCard, Wr as ArrowRight, X as ScrollText, f as User } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DvAUVXWO.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings-jWaC19jL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const ws = useofc360();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("company");
	const [company, setCompany] = (0, import_react.useState)(ws.company ?? {
		id: "",
		name: ""
	});
	const [user, setUser] = (0, import_react.useState)(ws.user);
	function saveCompany() {
		ofc360.set({ company });
		toast.success("Company settings updated successfully");
	}
	function saveProfile() {
		if (user) {
			ofc360.set({ user });
			toast.success("Profile updated successfully");
		}
	}
	function reset() {
		ofc360.reset();
		navigate({ to: "/login" });
	}
	const adminCards = [
		{
			title: "Roles & Permissions",
			description: "Define user roles, access control levels, and system permissions.",
			icon: ShieldCheck,
			path: "/dashboard/roles",
			gradient: "from-blue-600/20 to-indigo-600/20",
			accentBorder: "border-blue-500/30 hover:border-blue-500/60",
			iconColor: "text-blue-500 bg-blue-500/10",
			buttonColor: "bg-blue-600 hover:bg-blue-700 text-white"
		},
		{
			title: "Audit Logs",
			description: "Track system activity, security events, user logins, and data modifications.",
			icon: ScrollText,
			path: "/dashboard/audit-logs",
			gradient: "from-purple-600/20 to-pink-600/20",
			accentBorder: "border-purple-500/30 hover:border-purple-500/60",
			iconColor: "text-purple-500 bg-purple-500/10",
			buttonColor: "bg-purple-600 hover:bg-purple-700 text-white"
		},
		{
			title: "Billing & Subscriptions",
			description: "Manage subscription plans, invoices, payment methods, and seat usage.",
			icon: CreditCard,
			path: "/dashboard/billing",
			gradient: "from-emerald-600/20 to-teal-600/20",
			accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
			iconColor: "text-emerald-500 bg-emerald-500/10",
			buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
		}
	];
	const tabs = [
		{
			id: "company",
			label: "Company",
			icon: Building2
		},
		{
			id: "profile",
			label: "Profile",
			icon: User
		},
		{
			id: "security",
			label: "Security",
			icon: Shield
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Settings & Administration",
				description: "Centralized management center for workspace settings, roles & permissions, billing, and security."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: "Administration Modules"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-6 md:grid-cols-3",
					children: adminCards.map((card) => {
						const Icon = card.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => navigate({ to: card.path }),
							className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${card.accentBorder} bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-60 transition-opacity group-hover:opacity-100` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-12 w-12 place-items-center rounded-xl ${card.iconColor}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
										children: card.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted-foreground",
										children: card.description
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative pt-4 mt-4 border-t border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: `w-full justify-between rounded-xl font-medium shadow-md transition-all ${card.buttonColor}`,
										onClick: (e) => {
											e.stopPropagation();
											navigate({ to: card.path });
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Open ", card.title.split(" ")[0]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
									})
								})
							]
						}, card.title);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: "General Configuration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "space-y-1",
						children: tabs.map((t) => {
							const Icon = t.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTab(t.id),
								className: `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), t.label]
							}, t.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl",
						children: [
							tab === "company" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Company Name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.name,
											onChange: (e) => setCompany({
												...company,
												name: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Email",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.email ?? "",
											onChange: (e) => setCompany({
												...company,
												email: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Phone",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.phone ?? "",
											onChange: (e) => setCompany({
												...company,
												phone: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.website ?? "",
											onChange: (e) => setCompany({
												...company,
												website: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "City",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.city ?? "",
											onChange: (e) => setCompany({
												...company,
												city: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Country",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: company.country ?? "",
											onChange: (e) => setCompany({
												...company,
												country: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2 flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: saveCompany,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), "Save Changes"]
										})
									})
								]
							}) : null,
							tab === "profile" && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Full Name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: user.fullName,
											onChange: (e) => setUser({
												...user,
												fullName: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Email",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: user.email,
											onChange: (e) => setUser({
												...user,
												email: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Phone",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: user.phone,
											onChange: (e) => setUser({
												...user,
												phone: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Role",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: user.role,
											disabled: true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2 flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: saveProfile,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), "Save Profile"]
										})
									})
								]
							}) : null,
							tab === "security" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-medium",
										children: "Password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Use a strong unique password to keep your workspace secure."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												placeholder: "Current password"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												placeholder: "New password"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												placeholder: "Confirm new password"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "mt-3",
										onClick: () => toast.success("Password updated"),
										children: "Update Password"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-medium text-destructive",
											children: "Danger Zone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Sign out of this workspace and clear local session data."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "destructive",
											className: "mt-3",
											onClick: reset,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), "Sign Out and Reset Workspace"]
										})
									]
								})]
							}) : null
						]
					})]
				})]
			})
		]
	});
}
function F({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
//#endregion
export { SettingsPage as component };
