import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Dt as ofc360, k as apiInstance, on as useofc360 } from "./ofc360-store-_w51fT7p.mjs";
import { t as api } from "./client-1j6fcGcU.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $n as CircleCheckBig, B as Shield, In as CreditCard, Ir as ArrowRight, J as ScrollText, Kt as Laptop, M as Sun, Pt as LoaderCircle, Sr as Building2, V as ShieldCheck, Yt as KeyRound, Z as Save, f as User, jt as LogOut, kr as Bell, vt as Palette, xt as Moon } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings-Cj4J7icG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	if (((useofc360().user?.role)?.toLowerCase() || "employee") === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeSettingsPage, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSettingsPage, {});
}
function EmployeeSettingsPage() {
	const ws = useofc360();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("profile");
	const [fullName, setFullName] = (0, import_react.useState)(ws.user?.fullName || "");
	const [email, setEmail] = (0, import_react.useState)(ws.user?.email || "");
	const [phone, setPhone] = (0, import_react.useState)(ws.user?.phone || "");
	const [bio, setBio] = (0, import_react.useState)("");
	const [emergencyContactName, setEmergencyContactName] = (0, import_react.useState)("");
	const [emergencyContactPhone, setEmergencyContactPhone] = (0, import_react.useState)("");
	const [isSavingProfile, setIsSavingProfile] = (0, import_react.useState)(false);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [isUpdatingPassword, setIsUpdatingPassword] = (0, import_react.useState)(false);
	const [notifs, setNotifs] = (0, import_react.useState)({
		attendanceAlerts: true,
		leaveAlerts: true,
		payrollAlerts: true,
		hrAnnouncements: true,
		emailDigest: true
	});
	const [isSavingNotifs, setIsSavingNotifs] = (0, import_react.useState)(false);
	const [themeMode, setThemeMode] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				const profRes = await api.get("/settings/profile").catch(() => null);
				if (profRes?.data) {
					if (profRes.data.fullName) setFullName(profRes.data.fullName);
					if (profRes.data.email) setEmail(profRes.data.email);
					if (profRes.data.phone) setPhone(profRes.data.phone);
					if (profRes.data.bio) setBio(profRes.data.bio);
				}
				const notifRes = await api.get("/settings/employee/notifications").catch(() => null);
				if (notifRes?.data) setNotifs((prev) => ({
					...prev,
					...notifRes.data
				}));
			} catch (err) {
				console.error("Failed to load settings from server:", err);
			}
		}
		loadData();
	}, []);
	const handleSaveProfile = async (e) => {
		e.preventDefault();
		setIsSavingProfile(true);
		try {
			await apiInstance.put("/settings/profile", {
				fullName,
				email,
				phone,
				bio
			});
			if (ws.user) ofc360.set({ user: {
				...ws.user,
				fullName,
				email,
				phone
			} });
			toast.success("Personal profile updated successfully!");
		} catch (err) {
			console.error("Save profile error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to update profile.");
		} finally {
			setIsSavingProfile(false);
		}
	};
	const handleChangePassword = async (e) => {
		e.preventDefault();
		if (!currentPassword) {
			toast.error("Please enter your current password.");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("New password must be at least 6 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New password and confirmation do not match.");
			return;
		}
		setIsUpdatingPassword(true);
		try {
			await apiInstance.post("/settings/employee/change-password", {
				currentPassword,
				newPassword
			});
			toast.success("Password updated successfully!");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			console.error("Password update error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to update password.");
		} finally {
			setIsUpdatingPassword(false);
		}
	};
	const handleSaveNotifications = async () => {
		setIsSavingNotifs(true);
		try {
			await apiInstance.put("/settings/employee/notifications", notifs);
			toast.success("Notification preferences saved!");
		} catch (err) {
			console.error("Save notifications error:", err);
			toast.error(err.response?.data?.message || err.message || "Failed to save notifications.");
		} finally {
			setIsSavingNotifs(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-0.5",
						children: "Employee Portal"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "My Settings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your personal profile, notification preferences, security, and app appearance."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "space-y-1",
				children: [
					{
						id: "profile",
						label: "My Profile",
						icon: User
					},
					{
						id: "security",
						label: "Security & Account",
						icon: Shield
					},
					{
						id: "notifications",
						label: "Notification Preferences",
						icon: Bell
					},
					{
						id: "preferences",
						label: "Appearance",
						icon: Palette
					}
				].map((t) => {
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab(t.id),
						className: `flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${tab === t.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), t.label]
					}, t.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl shadow-sm",
				children: [
					tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveProfile,
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground",
								children: "Personal Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Update your contact details and bio visible to your team."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: fullName,
											onChange: (e) => setFullName(e.target.value),
											placeholder: "Enter your full name",
											className: "h-9 text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Personal / Contact Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											placeholder: "name@company.com",
											className: "h-9 text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Phone Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											placeholder: "+91 98765 43210",
											className: "h-9 text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Designation (Read-only)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: ws.user?.role?.toUpperCase() || "EMPLOYEE",
											disabled: true,
											className: "h-9 text-xs bg-muted/50 cursor-not-allowed font-medium text-muted-foreground"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "About Me / Bio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: bio,
									onChange: (e) => setBio(e.target.value),
									placeholder: "Share a short bio or summary with your workspace...",
									className: "text-xs h-24"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border/60 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground",
									children: "Emergency Contact Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Emergency Contact Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: emergencyContactName,
											onChange: (e) => setEmergencyContactName(e.target.value),
											placeholder: "Primary contact person",
											className: "h-9 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Emergency Contact Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: emergencyContactPhone,
											onChange: (e) => setEmergencyContactPhone(e.target.value),
											placeholder: "Emergency phone number",
											className: "h-9 text-xs"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: isSavingProfile,
									className: "bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer",
									children: [isSavingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), "Save Profile"]
								})
							})
						]
					}),
					tab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground",
								children: "Security & Credentials"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Update your password and manage active login sessions."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleChangePassword,
								className: "space-y-4 border-b border-border/60 pb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground",
										children: "Change Password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Current Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "password",
													value: currentPassword,
													onChange: (e) => setCurrentPassword(e.target.value),
													placeholder: "••••••••",
													className: "h-9 text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "New Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "password",
													value: newPassword,
													onChange: (e) => setNewPassword(e.target.value),
													placeholder: "At least 6 characters",
													className: "h-9 text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Confirm New Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "password",
													value: confirmPassword,
													onChange: (e) => setConfirmPassword(e.target.value),
													placeholder: "Repeat new password",
													className: "h-9 text-xs"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: isUpdatingPassword,
											className: "bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer",
											children: [isUpdatingPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), "Update Password"]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground",
									children: "Active Session"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl border border-border bg-card/40 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Current Active Device"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Logged in from current web browser"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]",
										children: "Active Now"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 border-t border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "destructive",
									onClick: () => {
										ofc360.reset();
										navigate({ to: "/login" });
										toast.info("Logged out successfully.");
									},
									className: "h-9 text-xs gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), "Sign Out of Account"]
								})
							})
						]
					}),
					tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground",
								children: "Notification Preferences"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Choose which alerts and email summaries you receive."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Attendance Notifications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Check-in reminders and shift notifications"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: notifs.attendanceAlerts,
											onCheckedChange: (val) => setNotifs({
												...notifs,
												attendanceAlerts: val
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Leave Approval Updates"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Receive alerts when your leave request is approved or rejected"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: notifs.leaveAlerts,
											onCheckedChange: (val) => setNotifs({
												...notifs,
												leaveAlerts: val
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Payroll & Payslip Alerts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Get notified as soon as monthly salary slips are generated"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: notifs.payrollAlerts,
											onCheckedChange: (val) => setNotifs({
												...notifs,
												payrollAlerts: val
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "HR Announcements"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Company-wide policy updates and organizational news"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: notifs.hrAnnouncements,
											onCheckedChange: (val) => setNotifs({
												...notifs,
												hrAnnouncements: val
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "Weekly Activity Digest"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: "Summary email of upcoming holidays and workplace events"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: notifs.emailDigest,
											onCheckedChange: (val) => setNotifs({
												...notifs,
												emailDigest: val
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleSaveNotifications,
									disabled: isSavingNotifs,
									className: "bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 px-4 text-xs cursor-pointer",
									children: [isSavingNotifs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), "Save Preferences"]
								})
							})
						]
					}),
					tab === "preferences" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-foreground",
							children: "App Appearance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Customize theme display preferences for your account."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setThemeMode("dark"),
									className: `p-4 rounded-xl border text-center transition-all cursor-pointer ${themeMode === "dark" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-6 w-6 mx-auto mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Dark Mode"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setThemeMode("light"),
									className: `p-4 rounded-xl border text-center transition-all cursor-pointer ${themeMode === "light" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-6 w-6 mx-auto mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Light Mode"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setThemeMode("system"),
									className: `p-4 rounded-xl border text-center transition-all cursor-pointer ${themeMode === "system" ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-border bg-card/40 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-6 w-6 mx-auto mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "System Default"
									})]
								})
							]
						})]
					})
				]
			})]
		})]
	});
}
function AdminSettingsPage() {
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
