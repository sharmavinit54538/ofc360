import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Bt as setTokens, cn as useofc360, j as apiInstance, kt as ofc360 } from "./ofc360-store-XkEEWRxo.mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Dr as BookOpen, Fn as CreditCard, Fr as ArrowRight, I as Sparkles, Mt as Lock, Nt as LoaderCircle, Sr as Briefcase, T as Trash2, Zn as CircleCheck, ar as Check, er as CircleAlert, f as User, jr as Award, y as Upload } from "../_libs/lucide-react.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as motion } from "../_libs/framer-motion.mjs";
import { t as Route } from "./onboarding-B5mGmWdZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-D3iuT7o9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Stepper({ steps, current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-wrap items-center gap-2 sm:gap-3",
		children: steps.map((label, i) => {
			const isDone = i < current;
			const isActive = i === current;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2 sm:gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					layout: true,
					className: `flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${isActive ? "border-transparent text-brand-foreground shadow-glow" : isDone ? "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-border bg-card/40 text-muted-foreground"}`,
					style: isActive ? { background: "var(--gradient-brand)" } : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-5 w-5 place-items-center rounded-full text-[10px] ${isDone ? "bg-emerald-500 text-white" : isActive ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"}`,
						children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: label
					})]
				}), i < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden h-px w-6 bg-border sm:inline-block" }) : null]
			}, label);
		})
	});
}
var ADMIN_STEPS = [
	"Company",
	"Admin Profile",
	"HR Settings",
	"Departments & Designations",
	"Invite Employees",
	"Complete"
];
var INDUSTRIES = [
	"Software",
	"Finance",
	"Healthcare",
	"Retail",
	"Manufacturing",
	"Education",
	"Other"
];
var SIZES = [
	"1–10",
	"11–50",
	"51–200",
	"201–500",
	"501–1000",
	"1000+"
];
var TIMEZONES = [
	"UTC",
	"America/New_York",
	"America/Los_Angeles",
	"Europe/London",
	"Europe/Berlin",
	"Asia/Kolkata",
	"Asia/Singapore",
	"Australia/Sydney"
];
function backendStepToUiIndex(backendStep) {
	return Math.max(0, Math.min(5, backendStep - 1));
}
async function syncDeptsAndDesignations(ws) {
	const depts = Array.from(new Set([
		"Management",
		...ws.hrs.map((h) => h.department),
		...ws.employees.map((e) => e.department),
		...ws.managers.map((m) => m.department)
	].filter(Boolean))).map((d, index) => ({
		department_code: d.substring(0, 3).toUpperCase() + "_" + (10 + index),
		department_name: d,
		description: `Department for ${d}`
	}));
	await api.post("onboarding/departments", { departments: depts });
	const designations = Array.from(new Set([
		"Company Owner",
		...ws.hrs.map((h) => h.designation),
		...ws.employees.map((e) => e.designation),
		...ws.managers.map((m) => m.designation)
	].filter(Boolean)));
	await api.post("onboarding/designations", { designations });
}
async function syncInvites(ws) {
	const allInvites = [
		...ws.hrs.map((h) => {
			const parts = h.fullName.split(" ");
			return {
				first_name: parts[0] || "HR",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: h.email,
				phone: h.phone || "9876543210",
				department: h.department || "Human Resources",
				designation: h.designation || "HR Specialist"
			};
		}),
		...ws.employees.map((e) => {
			const parts = e.fullName.split(" ");
			return {
				first_name: parts[0] || "Employee",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: e.email,
				phone: e.phone || "9876543210",
				department: e.department || "Engineering",
				designation: e.designation || "Software Engineer"
			};
		}),
		...ws.managers.map((m) => {
			const parts = m.fullName.split(" ");
			return {
				first_name: parts[0] || "Manager",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: m.email,
				phone: m.phone || "9876543210",
				department: m.department || "Management",
				designation: m.designation || "Team Manager"
			};
		})
	].filter((x) => x.personal_email && x.first_name);
	allInvites.forEach((inv) => {
		const cleanPhone = inv.phone.replace(/\D/g, "");
		inv.phone = cleanPhone.length >= 10 ? cleanPhone.substring(0, 10) : "9876543210";
	});
	if (allInvites.length > 0) await api.post("onboarding/invite-employees", {
		employees: allInvites,
		skip: false
	});
	else await api.post("onboarding/invite-employees", {
		employees: [],
		skip: true
	});
}
function OnboardingPage() {
	const navigate = useNavigate();
	const ws = useofc360();
	const { token } = Route.useSearch();
	const userRole = (ws.user?.role)?.toLowerCase();
	(0, import_react.useEffect)(() => {
		if (token) return;
		if (ws.isRestoring) return;
		if (!ws.user) {
			navigate({ to: "/register" });
			return;
		}
		if (!ws.user.emailVerified) {
			navigate({ to: "/verify-email" });
			return;
		}
		if (userRole === "super_admin") {
			navigate({
				to: "/dashboard/super-admin",
				replace: true
			});
			return;
		}
		if (ws.user.onboardingComplete) {
			navigate({
				to: userRole === "employee" ? "/dashboard/employee" : userRole === "manager" ? "/dashboard/manager" : "/dashboard",
				replace: true
			});
			return;
		}
	}, [
		ws.user,
		ws.isRestoring,
		navigate,
		token,
		userRole
	]);
	if (token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenActivationOnboarding, { token });
	if (ws.isRestoring || !ws.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	if (userRole === "company_admin" || userRole === "admin" || userRole === "owner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyAdminOnboarding, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeOnboarding, {});
}
function TokenActivationOnboarding({ token }) {
	const navigate = useNavigate();
	const [tokenLoading, setTokenLoading] = (0, import_react.useState)(true);
	const [tokenError, setTokenError] = (0, import_react.useState)(null);
	const [empData, setEmpData] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [acceptPolicies, setAcceptPolicies] = (0, import_react.useState)(false);
	const [activating, setActivating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTokenLoading(true);
		setTokenError(null);
		api.get(`onboarding/validate?token=${token}`).then((res) => {
			if (res.success) {
				setEmpData(res.data);
				setPhone(res.data.phone || "");
			} else setTokenError(res.message || "Invitation expired or invalid.");
		}).catch((err) => {
			setTokenError(err.message || "Invitation expired or invalid.");
		}).finally(() => setTokenLoading(false));
	}, [token]);
	const handleActivate = async (e) => {
		e.preventDefault();
		if (!password || password.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}
		if (!acceptPolicies) {
			toast.error("Please accept the company terms and policies.");
			return;
		}
		setActivating(true);
		try {
			const res = await api.post("onboarding/activate", {
				token,
				password,
				phone,
				profile_photo: "",
				emergency_contact_name: "",
				emergency_contact_phone: "",
				accept_policies: true
			});
			if (res.success && res.data?.tokens) {
				setTokens(res.data.tokens);
				ofc360.set({
					user: {
						id: res.data.user.id,
						fullName: res.data.user.name,
						email: res.data.user.email,
						phone: res.data.user.phone || phone,
						role: res.data.user.role,
						companyId: String(res.data.user.company_id),
						emailVerified: true,
						onboardingComplete: false,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					},
					company: {
						id: String(res.data.user.company_id),
						name: res.data.user.company_name || "Company Workspace"
					}
				});
				toast.success("Account activated! Let's complete your onboarding.");
				navigate({
					to: "/onboarding",
					replace: true
				});
			}
		} catch (err) {
			toast.error(err.message || "Failed to activate account");
		} finally {
			setActivating(false);
		}
	};
	if (tokenLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	if (tokenError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-10 w-10 text-rose-500 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-foreground",
					children: "Invalid or Expired Invitation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-2",
					children: tokenError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "mt-6 inline-block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "h-9 text-xs",
						children: "Back to Login"
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sm:mx-auto sm:w-full sm:max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Official Onboarding Invitation"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold font-display text-foreground",
					children: "Activate Your Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Welcome to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: empData?.company_name || "your organization"
						}),
						"! Set up your password to begin."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 sm:mx-auto sm:w-full sm:max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border py-8 px-6 shadow-xl rounded-2xl sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleActivate,
					className: "space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-muted-foreground text-xs font-semibold",
							children: "Full Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: empData?.employee_name || "",
							disabled: true,
							className: "mt-1 bg-muted/20 h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-muted-foreground text-xs font-semibold",
							children: "Work Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: empData?.email || "",
							disabled: true,
							className: "mt-1 bg-muted/20 h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-muted-foreground text-xs font-semibold",
							children: "Create Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "At least 8 characters",
							required: true,
							className: "mt-1 h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-muted-foreground text-xs font-semibold",
							children: "Confirm Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							placeholder: "Repeat password",
							required: true,
							className: "mt-1 h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-muted-foreground text-xs font-semibold",
							children: "Mobile Phone Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "+91 98765 43210",
							required: true,
							className: "mt-1 h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "policy",
								checked: acceptPolicies,
								onCheckedChange: (val) => setAcceptPolicies(Boolean(val))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "policy",
								className: "text-[11px] text-muted-foreground leading-snug cursor-pointer",
								children: "I agree to the company code of conduct, employment policies, and terms of service."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: activating,
							className: "w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold mt-4 gap-2 text-xs",
							children: [activating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Activate Account & Continue"]
						})
					]
				})
			})
		})]
	});
}
var EMPLOYEE_STEPS = [
	"Welcome",
	"Personal Info",
	"Identity Proof",
	"Employment",
	"Education & Exp",
	"Bank & Tax",
	"Upload Docs",
	"Policies",
	"Final Review"
];
function EmployeeOnboarding() {
	const navigate = useNavigate();
	const ws = useofc360();
	const [currentStepIndex, setCurrentStepIndex] = (0, import_react.useState)(0);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [statusData, setStatusData] = (0, import_react.useState)(null);
	const [progressData, setProgressData] = (0, import_react.useState)(null);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [dob, setDob] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("MALE");
	const [maritalStatus, setMaritalStatus] = (0, import_react.useState)("SINGLE");
	const [personalEmail, setPersonalEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [nationality, setNationality] = (0, import_react.useState)("Indian");
	const [currentAddress, setCurrentAddress] = (0, import_react.useState)("");
	const [permanentAddress, setPermanentAddress] = (0, import_react.useState)("");
	const [emergencyName, setEmergencyName] = (0, import_react.useState)("");
	const [emergencyRelation, setEmergencyRelation] = (0, import_react.useState)("");
	const [emergencyPhone, setEmergencyPhone] = (0, import_react.useState)("");
	const [aadhaar, setAadhaar] = (0, import_react.useState)("");
	const [pan, setPan] = (0, import_react.useState)("");
	const [passport, setPassport] = (0, import_react.useState)("");
	const [passportExpiry, setPassportExpiry] = (0, import_react.useState)("");
	const [degree, setDegree] = (0, import_react.useState)("B.Tech / Bachelor's");
	const [institution, setInstitution] = (0, import_react.useState)("");
	const [gradYear, setGradYear] = (0, import_react.useState)("2022");
	const [priorCompany, setPriorCompany] = (0, import_react.useState)("");
	const [priorRole, setPriorRole] = (0, import_react.useState)("");
	const [expYears, setExpYears] = (0, import_react.useState)("2");
	const [accountNumber, setAccountNumber] = (0, import_react.useState)("");
	const [ifsc, setIfsc] = (0, import_react.useState)("");
	const [bankName, setBankName] = (0, import_react.useState)("");
	const [accountHolder, setAccountHolder] = (0, import_react.useState)("");
	const [taxRegime, setTaxRegime] = (0, import_react.useState)("NEW");
	const [pfNumber, setPfNumber] = (0, import_react.useState)("");
	const [uanNumber, setUanNumber] = (0, import_react.useState)("");
	const [nomineeName, setNomineeName] = (0, import_react.useState)("");
	const [nomineeRelation, setNomineeRelation] = (0, import_react.useState)("");
	const [uploadedDocs, setUploadedDocs] = (0, import_react.useState)([]);
	const [uploadingType, setUploadingType] = (0, import_react.useState)(null);
	const [ackHandbook, setAckHandbook] = (0, import_react.useState)(false);
	const [ackNda, setAckNda] = (0, import_react.useState)(false);
	const [ackLeave, setAckLeave] = (0, import_react.useState)(false);
	const fetchStatusAndProgress = async () => {
		setIsLoading(true);
		try {
			const [statusRes, progressRes] = await Promise.all([api.get("employee-onboarding/status"), api.get("employee-onboarding/progress")]);
			if (statusRes.success && statusRes.data) {
				setStatusData(statusRes.data);
				const stepNum = statusRes.current_step || 1;
				setCurrentStepIndex(Math.max(0, Math.min(EMPLOYEE_STEPS.length - 1, stepNum - 1)));
			}
			if (progressRes.success && progressRes.data) {
				const p = progressRes.data;
				setProgressData(p);
				if (p.personal_info) {
					setFirstName(p.personal_info.first_name || ws.user?.fullName.split(" ")[0] || "");
					setLastName(p.personal_info.last_name || ws.user?.fullName.split(" ")[1] || "");
					setDob(p.personal_info.date_of_birth || "");
					setGender(p.personal_info.gender || "MALE");
					setMaritalStatus(p.personal_info.marital_status || "SINGLE");
					setPersonalEmail(p.personal_info.personal_email || ws.user?.email || "");
					setPhone(p.personal_info.phone || ws.user?.phone || "");
					setNationality(p.personal_info.nationality || "Indian");
					setCurrentAddress(p.personal_info.current_address || "");
					setPermanentAddress(p.personal_info.permanent_address || "");
					setEmergencyName(p.personal_info.emergency_contact_name || "");
					setEmergencyRelation(p.personal_info.emergency_contact_relation || "");
					setEmergencyPhone(p.personal_info.emergency_contact_phone || "");
				} else {
					setFirstName(ws.user?.fullName.split(" ")[0] || "");
					setLastName(ws.user?.fullName.split(" ")[1] || "");
					setPersonalEmail(ws.user?.email || "");
					setPhone(ws.user?.phone || "");
				}
				if (p.identity) {
					setAadhaar(p.identity.aadhaar_number || "");
					setPan(p.identity.pan_number || "");
					setPassport(p.identity.passport_number || "");
					setPassportExpiry(p.identity.passport_expiry || "");
				}
				if (p.education && p.education.length > 0) {
					setDegree(p.education[0].degree || "B.Tech / Bachelor's");
					setInstitution(p.education[0].institution || "");
					setGradYear(String(p.education[0].completion_year || "2022"));
				}
				if (p.experience && p.experience.length > 0) {
					setPriorCompany(p.experience[0].company_name || "");
					setPriorRole(p.experience[0].designation || "");
					setExpYears(String(p.experience[0].total_years || "2"));
				}
				if (p.bank_details) {
					setAccountNumber(p.bank_details.account_number || "");
					setIfsc(p.bank_details.ifsc_code || "");
					setBankName(p.bank_details.bank_name || "");
					setAccountHolder(p.bank_details.account_holder_name || ws.user?.fullName || "");
				}
				if (p.tax_payroll) {
					setTaxRegime(p.tax_payroll.tax_regime || "NEW");
					setPfNumber(p.tax_payroll.pf_number || "");
					setUanNumber(p.tax_payroll.uan_number || "");
					setNomineeName(p.tax_payroll.nominee_name || "");
					setNomineeRelation(p.tax_payroll.nominee_relation || "");
				}
				if (p.documents) setUploadedDocs(p.documents);
				if (p.policies && p.policies.length > 0) {
					setAckHandbook(true);
					setAckNda(true);
					setAckLeave(true);
				}
			}
		} catch (err) {
			console.error("Failed to load employee onboarding status:", err);
			toast.error(err.message || "Failed to load onboarding status");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchStatusAndProgress();
	}, []);
	const handleSaveStep1 = async () => {
		if (!firstName || !phone || !currentAddress || !nationality) {
			toast.error("Please fill in all required personal information fields including nationality.");
			return;
		}
		setIsSubmitting(true);
		try {
			await api.put("employee-onboarding/step/1", {
				first_name: firstName,
				last_name: lastName,
				date_of_birth: dob || "1998-01-01",
				gender,
				marital_status: maritalStatus,
				nationality,
				personal_email: personalEmail,
				phone,
				current_address: currentAddress,
				permanent_address: permanentAddress || currentAddress,
				emergency_contact_name: emergencyName,
				emergency_contact_relation: emergencyRelation,
				emergency_contact_phone: emergencyPhone
			});
			toast.success("Personal information saved.");
			setCurrentStepIndex(2);
		} catch (err) {
			toast.error(err.message || "Failed to save personal info");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSaveStep2 = async () => {
		if (!pan) {
			toast.error("PAN Card number is required for statutory verification.");
			return;
		}
		setIsSubmitting(true);
		try {
			await api.put("employee-onboarding/step/2", {
				aadhaar_number: aadhaar,
				pan_number: pan,
				passport_number: passport || void 0,
				passport_expiry: passportExpiry || void 0
			});
			toast.success("Identity verification saved.");
			setCurrentStepIndex(3);
		} catch (err) {
			toast.error(err.message || "Failed to save identity proof");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSaveStep4 = async () => {
		setIsSubmitting(true);
		const endYr = parseInt(gradYear) || 2022;
		const startYr = endYr - 4;
		try {
			await api.put("employee-onboarding/step/4", { education_records: [{
				degree,
				institution: institution || "University",
				start_year: startYr,
				end_year: endYr,
				completion_year: endYr
			}] });
			await api.put("employee-onboarding/step/5", { experience_records: priorCompany ? [{
				company_name: priorCompany,
				designation: priorRole || "Engineer",
				start_date: "2020-01-01",
				total_years: parseFloat(expYears) || 2
			}] : [] });
			toast.success("Education & background saved.");
			setCurrentStepIndex(5);
		} catch (err) {
			toast.error(err.message || "Failed to save education/experience");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSaveStep5 = async () => {
		if (!accountNumber || !ifsc) {
			toast.error("Bank Account Number and IFSC Code are required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await api.put("employee-onboarding/step/6", {
				account_number: accountNumber,
				ifsc_code: ifsc,
				bank_name: bankName || "HDFC Bank",
				branch_name: "Main Branch",
				account_holder_name: accountHolder || ws.user?.fullName || "Employee"
			});
			await api.put("employee-onboarding/step/7", {
				tax_regime: taxRegime,
				pf_number: pfNumber || void 0,
				uan_number: uanNumber || void 0,
				nominee_name: nomineeName || "Family Member",
				nominee_relation: nomineeRelation || "Spouse/Parent"
			});
			toast.success("Bank details & tax regime saved.");
			setCurrentStepIndex(6);
		} catch (err) {
			toast.error(err.message || "Failed to save bank/tax details");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleFileUpload = async (e, docType) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingType(docType);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("document_type", docType);
			if ((await apiInstance.post("/employee-onboarding/step/8/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })).data?.success) {
				toast.success(`${docType} uploaded successfully!`);
				fetchStatusAndProgress();
			}
		} catch (err) {
			toast.error(err.response?.data?.detail || err.message || "Document upload failed");
		} finally {
			setUploadingType(null);
		}
	};
	const handleDeleteDoc = async (docId) => {
		try {
			await api.delete(`employee-onboarding/step/8/document/${docId}`);
			toast.success("Document removed.");
			fetchStatusAndProgress();
		} catch (err) {
			toast.error(err.message || "Failed to delete document");
		}
	};
	const handleSaveStep6Docs = async () => {
		setIsSubmitting(true);
		try {
			await api.put("employee-onboarding/step/8", {});
			toast.success("Documents finalized.");
			setCurrentStepIndex(7);
		} catch (err) {
			toast.error(err.message || "Failed to finalize documents");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSaveStep7Policies = async () => {
		if (!ackHandbook || !ackNda || !ackLeave) {
			toast.error("Please read and acknowledge all required employment policies.");
			return;
		}
		setIsSubmitting(true);
		try {
			await api.put("employee-onboarding/step/9", { acceptances: [
				{
					policy_name: "EMPLOYEE_HANDBOOK",
					accepted: true
				},
				{
					policy_name: "DATA_SECURITY_NDA",
					accepted: true
				},
				{
					policy_name: "LEAVE_ATTENDANCE_POLICY",
					accepted: true
				}
			] });
			toast.success("Company policies acknowledged.");
			setCurrentStepIndex(8);
		} catch (err) {
			toast.error(err.message || "Failed to accept policies");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleCompleteOnboarding = async () => {
		setIsSubmitting(true);
		try {
			if ((await api.post("employee-onboarding/complete")).success) {
				toast.success("Congratulations! Your employee onboarding is complete.");
				if (ws.user) ofc360.set({ user: {
					...ws.user,
					onboardingComplete: true
				} });
				navigate({
					to: "/dashboard/employee",
					replace: true
				});
			}
		} catch (err) {
			toast.error(err.message || "Failed to complete onboarding");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	const empDetails = progressData?.employment || {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex flex-col justify-between p-4 md:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto w-full space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] uppercase font-bold",
								children: "Employee Self-Service Onboarding"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-xl font-bold font-display text-foreground mt-1",
							children: [
								"Welcome, ",
								ws.user?.fullName || "Employee",
								"!"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Organization: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: ws.company?.name || "Company Workspace"
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({ to: "/dashboard/employee" }),
						variant: "ghost",
						size: "sm",
						className: "h-8 text-xs text-muted-foreground hover:text-foreground",
						children: "Skip to Dashboard"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto scrollbar-none py-2 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
						steps: EMPLOYEE_STEPS,
						current: currentStepIndex
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6",
					children: [
						currentStepIndex === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-10 w-10 text-indigo-400 mx-auto animate-pulse" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-bold text-foreground",
											children: "Welcome to the Team!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed",
											children: [
												"We are excited to have you onboard at ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ws.company?.name }),
												". Please complete the quick verification steps below to finalize your HR records, statutory tax setup, and payroll enrollment."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-indigo-400" }), " Confirmed Employment Offer Details"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-xl bg-muted/20 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground block font-medium",
													children: "Designation"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground mt-0.5 block",
													children: empDetails.designation || "Software Engineer"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-xl bg-muted/20 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground block font-medium",
													children: "Department"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground mt-0.5 block",
													children: empDetails.department || "Engineering"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-xl bg-muted/20 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground block font-medium",
													children: "Employee Code"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-indigo-400 mt-0.5 block",
													children: empDetails.employee_id || "EMP-001"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-xl bg-muted/20 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground block font-medium",
													children: "Joining Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground mt-0.5 block",
													children: empDetails.joining_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setCurrentStepIndex(1),
										className: "h-9 px-5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold",
										children: ["Begin Onboarding ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})
							]
						}),
						currentStepIndex === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between border-b border-border pb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-indigo-400" }), " Personal Information"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Provide your contact info and personal contact details."
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "First Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: firstName,
											onChange: (e) => setFirstName(e.target.value),
											className: "mt-1 h-9",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Last Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: lastName,
											onChange: (e) => setLastName(e.target.value),
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Date of Birth *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: dob,
											onChange: (e) => setDob(e.target.value),
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: gender,
											onValueChange: setGender,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "MALE",
													children: "Male"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "FEMALE",
													children: "Female"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "OTHER",
													children: "Other"
												})
											] })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Personal Email *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: personalEmail,
											onChange: (e) => setPersonalEmail(e.target.value),
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Mobile Phone *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Nationality *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: nationality,
											onChange: (e) => setNationality(e.target.value),
											placeholder: "e.g. Indian",
											className: "mt-1 h-9",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Current Residence Address *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: currentAddress,
												onChange: (e) => setCurrentAddress(e.target.value),
												rows: 2,
												className: "mt-1"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground",
										children: "Emergency Contact Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Contact Person Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: emergencyName,
												onChange: (e) => setEmergencyName(e.target.value),
												placeholder: "e.g. Parent / Spouse",
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Relationship"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: emergencyRelation,
												onChange: (e) => setEmergencyRelation(e.target.value),
												placeholder: "Father / Spouse",
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Emergency Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: emergencyPhone,
												onChange: (e) => setEmergencyPhone(e.target.value),
												placeholder: "+91 98765 43210",
												className: "mt-1 h-9"
											})] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(0),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep1,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Save & Continue",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-indigo-400" }), " Identity & Statutory Verification"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Enter government-issued identification numbers for statutory payroll processing."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "PAN Card Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: pan,
											onChange: (e) => setPan(e.target.value.toUpperCase()),
											placeholder: "ABCDE1234F",
											className: "mt-1 h-9 font-mono uppercase",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Aadhaar Card Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: aadhaar,
											onChange: (e) => setAadhaar(e.target.value),
											placeholder: "1234 5678 9012",
											className: "mt-1 h-9 font-mono"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Passport Number (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: passport,
											onChange: (e) => setPassport(e.target.value.toUpperCase()),
											placeholder: "A1234567",
											className: "mt-1 h-9 font-mono"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Passport Expiry Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: passportExpiry,
											onChange: (e) => setPassportExpiry(e.target.value),
											className: "mt-1 h-9"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(1),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep2,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Save & Continue",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-indigo-400" }), " Company Employment Details"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "These company-managed records are pre-assigned by your HR administrator."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Company Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-foreground mt-1 block",
												children: ws.company?.name || "Workspace"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Employee Code"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-indigo-400 mt-1 block",
												children: empDetails.employee_id || "EMP-001"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Work Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground mt-1 block",
												children: empDetails.work_location || "Headquarters"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Designation"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground mt-1 block",
												children: empDetails.designation || "Software Engineer"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Department"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground mt-1 block",
												children: empDetails.department || "Engineering"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase font-bold block",
												children: "Employment Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "border-emerald-500/30 text-emerald-400 mt-1 text-[10px]",
												children: empDetails.employment_type || "FULL_TIME"
											})] })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(2),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setCurrentStepIndex(4),
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Confirm & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						currentStepIndex === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-indigo-400" }), " Educational & Work Background"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Provide details regarding your highest qualification and previous employment."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground",
										children: "Highest Educational Qualification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Degree / Diploma"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: degree,
												onChange: (e) => setDegree(e.target.value),
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "University / Institution"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: institution,
												onChange: (e) => setInstitution(e.target.value),
												placeholder: "e.g. State University",
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Graduation Year"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: gradYear,
												onChange: (e) => setGradYear(e.target.value),
												className: "mt-1 h-9"
											})] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground",
										children: "Previous Work Experience (If applicable)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Previous Company"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: priorCompany,
												onChange: (e) => setPriorCompany(e.target.value),
												placeholder: "Previous employer name",
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Designation"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: priorRole,
												onChange: (e) => setPriorRole(e.target.value),
												placeholder: "e.g. Junior Developer",
												className: "mt-1 h-9"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] text-muted-foreground",
												children: "Total Experience (Years)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: expYears,
												onChange: (e) => setExpYears(e.target.value),
												className: "mt-1 h-9"
											})] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(3),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep4,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Save & Continue",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-indigo-400" }), " Salary Bank Account & Tax Declaration"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Configure direct deposit bank details and select your statutory tax regime."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Bank Account Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: accountNumber,
											onChange: (e) => setAccountNumber(e.target.value),
											className: "mt-1 h-9 font-mono",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "IFSC Code *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: ifsc,
											onChange: (e) => setIfsc(e.target.value.toUpperCase()),
											placeholder: "HDFC0001234",
											className: "mt-1 h-9 font-mono uppercase",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Bank Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: bankName,
											onChange: (e) => setBankName(e.target.value),
											placeholder: "e.g. HDFC Bank",
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Account Holder Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: accountHolder,
											onChange: (e) => setAccountHolder(e.target.value),
											className: "mt-1 h-9"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground",
										children: "Income Tax Regime Selection"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setTaxRegime("NEW"),
											className: `p-3 rounded-xl border text-left transition-all cursor-pointer ${taxRegime === "NEW" ? "border-indigo-500 bg-indigo-500/10 font-bold" : "border-border bg-card/40"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-foreground",
												children: "New Tax Regime"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "Lower slab rates, lower deductions"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setTaxRegime("OLD"),
											className: `p-3 rounded-xl border text-left transition-all cursor-pointer ${taxRegime === "OLD" ? "border-indigo-500 bg-indigo-500/10 font-bold" : "border-border bg-card/40"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-foreground",
												children: "Old Tax Regime"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "Exemptions 80C, 80D, HRA allowed"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground",
										children: "PF & Gratuity Nominee Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px] text-muted-foreground",
											children: "Nominee Full Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: nomineeName,
											onChange: (e) => setNomineeName(e.target.value),
											placeholder: "e.g. Parent / Spouse Name",
											className: "mt-1 h-9"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px] text-muted-foreground",
											children: "Nominee Relationship *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: nomineeRelation,
											onChange: (e) => setNomineeRelation(e.target.value),
											placeholder: "Father / Spouse / Mother",
											className: "mt-1 h-9"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(4),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep5,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Save & Continue",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 text-indigo-400" }), " Onboarding Document Uploads"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Upload required identity, bank, and educational verification documents (PDF or JPG)."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										{
											type: "AADHAAR",
											label: "Aadhaar Card (Front/Back)"
										},
										{
											type: "PAN",
											label: "PAN Card"
										},
										{
											type: "CANCELLED_CHEQUE",
											label: "Bank Passbook / Cancelled Cheque"
										},
										{
											type: "DEGREE",
											label: "Highest Educational Marksheet"
										},
										{
											type: "PHOTO",
											label: "Passport Photograph"
										},
										{
											type: "RESUME",
											label: "Resume / CV"
										}
									].map((docItem) => {
										const existingDoc = uploadedDocs.find((d) => d.document_type === docItem.type && !d.is_deleted);
										const isUploading = uploadingType === docItem.type;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-border bg-muted/10 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: docItem.label
												}), existingDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Uploaded"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-amber-400 border-amber-500/20 text-[9px]",
													children: "Required"
												})]
											}), existingDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground font-mono truncate max-w-[200px]",
													children: existingDoc.file_name || "Document.pdf"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: () => handleDeleteDoc(existingDoc.id),
													variant: "ghost",
													size: "sm",
													className: "h-7 text-rose-400 hover:bg-rose-500/10 px-2 text-[10px] gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Remove"]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-indigo-500 bg-background/50 cursor-pointer text-muted-foreground hover:text-foreground transition-all",
												children: [
													isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-indigo-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 text-indigo-400" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isUploading ? "Uploading..." : "Click to Upload File" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														onChange: (e) => handleFileUpload(e, docItem.type),
														className: "hidden",
														accept: ".pdf,.jpg,.jpeg,.png,.webp"
													})
												]
											})]
										}, docItem.type);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(5),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep6Docs,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Finalize Documents",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 7 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-indigo-400" }), " Employment Policies & Code of Conduct"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Please read and acknowledge the mandatory company policies and employment terms."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												id: "hbook",
												checked: ackHandbook,
												onCheckedChange: (v) => setAckHandbook(Boolean(v)),
												className: "mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "hbook",
												className: "cursor-pointer space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground block",
													children: "1. Employee Handbook & Code of Conduct"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground block leading-relaxed",
													children: "I acknowledge receipt of the employee handbook and agree to comply with all work standards, workplace ethics, and operational guidelines."
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												id: "nda",
												checked: ackNda,
												onCheckedChange: (v) => setAckNda(Boolean(v)),
												className: "mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "nda",
												className: "cursor-pointer space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground block",
													children: "2. Data Confidentiality & Intellectual Property NDA"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground block leading-relaxed",
													children: "I agree to maintain strict confidentiality regarding all proprietary source code, customer records, and internal business assets."
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-border bg-muted/10 flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												id: "leave",
												checked: ackLeave,
												onCheckedChange: (v) => setAckLeave(Boolean(v)),
												className: "mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "leave",
												className: "cursor-pointer space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground block",
													children: "3. Leave Policy & Attendance Standards"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground block leading-relaxed",
													children: "I understand the company leave quota, check-in requirements, and notice period policies."
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(6),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveStep7Policies,
										disabled: isSubmitting,
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: [
											isSubmitting ? "Saving..." : "Accept Policies",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									})]
								})
							]
						}),
						currentStepIndex === 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 text-xs text-center py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-emerald-400" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl font-bold font-display text-foreground",
										children: "Onboarding Ready for Final Submission"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground max-w-md mx-auto",
										children: "All statutory details, bank accounts, identity documents, and policy acknowledgements have been verified. Click below to complete your onboarding."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-md mx-auto border border-border rounded-xl p-4 bg-muted/10 text-left space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Personal Profile:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Completed"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Identity & Statutory PAN:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Verified"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Direct Deposit Bank Details:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Configured"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Documents Uploaded:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Finalized"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employment Policies:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Signed"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-center gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setCurrentStepIndex(7),
										variant: "outline",
										className: "h-9 text-xs",
										children: "Review Steps"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleCompleteOnboarding,
										disabled: isSubmitting,
										className: "h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-lg",
										children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Complete Onboarding & Enter Dashboard"]
									})]
								})
							]
						})
					]
				})
			]
		})
	});
}
function CompanyAdminOnboarding() {
	const navigate = useNavigate();
	const ws = useofc360();
	const [step, setStep] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [resuming, setResuming] = (0, import_react.useState)(true);
	const [companyName, setCompanyName] = (0, import_react.useState)(ws.company?.name || "");
	const [logo, setLogo] = (0, import_react.useState)(ws.company?.logoDataUrl);
	const [industry, setIndustry] = (0, import_react.useState)(ws.company?.industry || INDUSTRIES[0]);
	const [companySize, setCompanySize] = (0, import_react.useState)(ws.company?.size || SIZES[1]);
	const [country, setCountry] = (0, import_react.useState)(ws.company?.country || "India");
	const [state, setState] = (0, import_react.useState)(ws.company?.state || "Maharashtra");
	const [city, setCity] = (0, import_react.useState)(ws.company?.city || "Mumbai");
	const [timezone, setTimezone] = (0, import_react.useState)(ws.company?.timezone || "Asia/Kolkata");
	const [fullName, setFullName] = (0, import_react.useState)(ws.user?.fullName || "");
	const [adminPhone, setAdminPhone] = (0, import_react.useState)(ws.user?.phone || "");
	const [avatar, setAvatar] = (0, import_react.useState)();
	const [termsAccepted, setTermsAccepted] = (0, import_react.useState)(true);
	const [workDays, setWorkDays] = (0, import_react.useState)([
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri"
	]);
	const [standardHours, setStandardHours] = (0, import_react.useState)(8);
	const [workModel, setWorkModel] = (0, import_react.useState)("hybrid");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const statusRes = await api.get("onboarding/status");
				const backendStep = statusRes?.current_step ?? statusRes?.data?.current_step ?? 1;
				if ((statusRes?.onboarding_completed ?? statusRes?.data?.onboarding_completed ?? false) || backendStep >= 7) {
					if (ws.user) ofc360.set({ user: {
						...ws.user,
						onboardingComplete: true
					} });
					navigate({
						to: "/dashboard",
						replace: true
					});
					return;
				}
				const progress = (await api.get("onboarding/progress"))?.data;
				if (progress && !cancelled) {
					if (progress.company_profile) {
						setCompanyName(progress.company_profile.company_name || "");
						setIndustry(progress.company_profile.industry || INDUSTRIES[0]);
						setCompanySize(progress.company_profile.company_size || SIZES[1]);
						setCountry(progress.company_profile.country || "India");
						setState(progress.company_profile.state || "Maharashtra");
						setCity(progress.company_profile.city || "Mumbai");
						setTimezone(progress.company_profile.timezone || "Asia/Kolkata");
					}
					if (progress.admin_profile) {
						setFullName(progress.admin_profile.full_name || ws.user?.fullName || "");
						setAdminPhone(progress.admin_profile.phone || ws.user?.phone || "");
					}
				}
				if (!cancelled) setStep(backendStepToUiIndex(backendStep));
			} catch (err) {
				if (!cancelled) setStep(0);
			} finally {
				if (!cancelled) setResuming(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ws.user, navigate]);
	function next() {
		setStep((s) => Math.min(ADMIN_STEPS.length - 1, s + 1));
	}
	function back() {
		setStep((s) => Math.max(0, s - 1));
	}
	async function finish() {
		setLoading(true);
		try {
			await api.post("onboarding/complete", {});
			if (ws.user) ofc360.set({ user: {
				...ws.user,
				onboardingComplete: true
			} });
			toast.success("Workspace setup completed!");
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (err) {
			toast.error(err.message || "Failed to finalize onboarding");
		} finally {
			setLoading(false);
		}
	}
	if (resuming) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex flex-col justify-between p-4 md:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto w-full space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] uppercase font-bold",
						children: "Organization Admin Onboarding"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold font-display text-foreground mt-1",
						children: "Set Up Your Company Workspace"
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto scrollbar-none py-2 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
						steps: ADMIN_STEPS,
						current: step
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6",
					children: [
						step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "Company Details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Company Name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: companyName,
												onChange: (e) => setCompanyName(e.target.value),
												className: "mt-1 h-9",
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Industry"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: industry,
											onValueChange: setIndustry,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: INDUSTRIES.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: i,
												children: i
											}, i)) })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Company Size"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: companySize,
											onValueChange: setCompanySize,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												children: s
											}, s)) })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "City"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: city,
											onChange: (e) => setCity(e.target.value),
											className: "mt-1 h-9"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Timezone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: timezone,
											onValueChange: setTimezone,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TIMEZONES.map((tz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: tz,
												children: tz
											}, tz)) })]
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: async () => {
											if (!companyName) {
												toast.error("Company name is required.");
												return;
											}
											await api.post("onboarding/company", {
												company_name: companyName,
												industry,
												company_size: companySize,
												city,
												timezone
											});
											next();
										},
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Save & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})
							]
						}),
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "Admin Profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Full Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fullName,
										onChange: (e) => setFullName(e.target.value),
										className: "mt-1 h-9"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: adminPhone,
										onChange: (e) => setAdminPhone(e.target.value),
										className: "mt-1 h-9"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: back,
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: async () => {
											await api.post("onboarding/admin-profile", {
												full_name: fullName,
												phone: adminPhone
											});
											next();
										},
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Save & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "HR & Work Settings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Standard Working Hours Per Day"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: standardHours,
										onChange: (e) => setStandardHours(parseInt(e.target.value) || 8),
										className: "h-9 w-32"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: back,
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: async () => {
											await api.post("onboarding/hr-settings", { standard_hours: standardHours });
											next();
										},
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Save & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "Departments & Designations"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Standard departments (Engineering, HR, Management, Sales) will be created automatically."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: back,
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: async () => {
											await syncDeptsAndDesignations(ws);
											next();
										},
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Confirm & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "Invite Initial Team Members"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "You can invite employees now or skip to add them later from the dashboard."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: back,
										variant: "outline",
										className: "h-9 text-xs",
										children: "Back"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: async () => {
											await syncInvites(ws);
											next();
										},
										className: "h-9 px-5 bg-indigo-600 text-white font-semibold text-xs gap-1.5",
										children: ["Continue to Complete ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								})
							]
						}),
						step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 text-xs text-center py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10 text-emerald-400 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold font-display text-foreground",
									children: "Company Setup Ready"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-md mx-auto",
									children: "Your workspace configuration is complete. Click below to launch your HR dashboard."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: finish,
										disabled: loading,
										className: "h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2",
										children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Launch Dashboard"]
									})
								})
							]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { OnboardingPage as component };
