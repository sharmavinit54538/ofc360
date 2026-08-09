import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { Dt as ofc360, Rt as setTokens, _t as hasValidAccessToken, on as useofc360 } from "./ofc360-store-Cb6xhYOw.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { i as useAuthReady } from "./auth-bootstrap-Dm6LCtAU.mjs";
import { $n as ClipboardCheck, $t as Landmark, Ar as Building2, Br as Award, C as TrendingUp, Cn as FileText, Dn as FilePen, Dr as CalendarCheck, En as FilePlusCorner, I as Star, Ir as BookOpen, It as LogOut, Jn as Coffee, Lr as Bell, M as Target, Nn as FileChartColumnIncreasing, Nt as Map, O as Timer, On as FilePenLine, Ot as MessageSquare, P as Sun, Qn as ClipboardList, Qt as Languages, Rt as Lock, Sn as FingerprintPattern, St as Package, T as TreePalm, Tr as CalendarDays, Vt as ListTodo, W as ShieldCheck, Wn as CreditCard, X as ScrollText, Xn as Clock, Y as Search, Yr as Activity, Yt as LayoutDashboard, Zt as Laptop, _ as UserCog, _n as Folder, _t as PenLine, br as ChartColumn, bt as PanelLeft, c as Wallet, cn as HandCoins, dt as Plane, fr as ChevronLeft, hn as Gauge, i as Wrench, it as Receipt, jn as FileCheck, jr as Briefcase, jt as Medal, k as TicketCheck, kr as Building, kt as Menu, l as Video, ln as GraduationCap, lr as CircleAlert, mn as Gift, mt as Percent, n as Zap, nt as Repeat, on as HeartHandshake, or as CircleCheck, pr as ChevronDown, q as Settings, qn as Coins, r as X, rn as History, rr as CircleQuestionMark, sn as Headphones, tn as Info, u as Users, v as UserCheck, vn as FolderOpen, wr as CalendarRange, wt as Moon, x as Trophy, yr as ChartLine, z as Sparkles, zr as BadgeCheck } from "../_libs/lucide-react.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { n as useTheme } from "./ThemeProvider-DWJ3wvub.mjs";
import { _ as Link, p as Outlet, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-DvAUVXWO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var isParent = (i) => "children" in i;
var BADGE_STYLES = {
	New: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
	AI: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
	Beta: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
	Hot: "bg-rose-500/20 text-rose-400 border border-rose-500/30"
};
function NavBadge({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLES[kind]}`,
		children: kind
	});
}
function NavCount({ count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ml-auto shrink-0 min-w-[18px] rounded-full bg-destructive/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-white",
		children: count > 99 ? "99+" : count
	});
}
var NAV_SECTIONS = [
	{ items: [
		{
			to: "/dashboard",
			label: "Overview",
			icon: LayoutDashboard,
			exact: true,
			roles: ["admin", "hr"]
		},
		{
			to: "/dashboard/manager",
			label: "Manager Dashboard",
			icon: UserCog,
			roles: ["manager"]
		},
		{
			to: "/ai",
			label: "AI Suite",
			icon: Sparkles,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/people",
			label: "People",
			icon: Users,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/attendance",
			label: "Attendance",
			icon: CalendarDays,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/payroll",
			label: "Payroll",
			icon: CreditCard,
			roles: ["admin", "hr"]
		},
		{
			to: "/dashboard/performance",
			label: "Performance",
			icon: Gauge,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/documents",
			label: "Documents",
			icon: Folder,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/assets",
			label: "Assets",
			icon: Package,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/recruitment",
			label: "Recruitment",
			icon: Briefcase,
			exact: true,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/reports",
			label: "Reports",
			icon: ChartColumn,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		},
		{
			to: "/dashboard/communication",
			label: "Communication",
			icon: MessageSquare,
			roles: [
				"admin",
				"hr",
				"manager"
			]
		}
	] },
	{
		roles: ["employee"],
		items: [{
			to: "/dashboard/employee",
			label: "My Dashboard",
			icon: LayoutDashboard,
			exact: true,
			roles: ["employee"]
		}]
	},
	{
		title: "Attendance",
		roles: ["employee"],
		items: [{
			label: "Attendance",
			icon: CalendarDays,
			basePath: "/dashboard/attendance",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/attendance",
					label: "Dashboard",
					icon: LayoutDashboard,
					exact: true
				},
				{
					to: "/dashboard/attendance/checkin",
					label: "Check In / Check Out",
					icon: FingerprintPattern,
					badge: "New"
				},
				{
					to: "/dashboard/attendance/history",
					label: "Attendance History",
					icon: History
				},
				{
					to: "/dashboard/attendance/calendar",
					label: "Monthly Calendar",
					icon: CalendarRange
				},
				{
					to: "/dashboard/attendance/shifts",
					label: "Shift Details",
					icon: Clock
				},
				{
					to: "/dashboard/attendance/overtime",
					label: "Overtime",
					icon: Timer
				},
				{
					to: "/dashboard/attendance/regularization",
					label: "Attendance Regularization",
					icon: FilePen
				},
				{
					to: "/dashboard/attendance/break-time",
					label: "Break Time",
					icon: Coffee
				},
				{
					to: "/dashboard/attendance/reports",
					label: "Attendance Reports",
					icon: FileChartColumnIncreasing
				}
			]
		}]
	},
	{
		title: "Timesheets",
		roles: ["employee"],
		items: [{
			label: "Timesheets",
			icon: Timer,
			basePath: "/dashboard/timesheets",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/timesheets",
					label: "My Timesheets",
					icon: ListTodo,
					exact: true
				},
				{
					to: "/dashboard/timesheets/daily",
					label: "Daily Timesheet",
					icon: CalendarDays
				},
				{
					to: "/dashboard/timesheets/weekly",
					label: "Weekly Timesheet",
					icon: CalendarRange
				},
				{
					to: "/dashboard/timesheets/project-hours",
					label: "Project Hours",
					icon: Briefcase
				},
				{
					to: "/dashboard/timesheets/task-hours",
					label: "Task Hours",
					icon: ClipboardList
				},
				{
					to: "/dashboard/timesheets/submit",
					label: "Submit Timesheet",
					icon: FilePlusCorner
				},
				{
					to: "/dashboard/timesheets/approval-status",
					label: "Approval Status",
					icon: CircleCheck
				},
				{
					to: "/dashboard/timesheets/history",
					label: "History",
					icon: History
				}
			]
		}]
	},
	{
		title: "Leaves",
		roles: ["employee"],
		items: [{
			label: "Leaves",
			icon: TreePalm,
			basePath: "/dashboard/leaves",
			roles: ["employee"],
			count: 3,
			children: [
				{
					to: "/dashboard/leaves/apply",
					label: "Apply Leave",
					icon: FilePlusCorner
				},
				{
					to: "/dashboard/leaves/balance",
					label: "Leave Balance",
					icon: Wallet
				},
				{
					to: "/dashboard/leaves/calendar",
					label: "Leave Calendar",
					icon: CalendarDays
				},
				{
					to: "/dashboard/leaves/history",
					label: "Leave History",
					icon: History
				},
				{
					to: "/dashboard/leaves/holidays",
					label: "Holiday Calendar",
					icon: CalendarCheck
				},
				{
					to: "/dashboard/leaves/comp-off",
					label: "Comp Off",
					icon: Repeat
				},
				{
					to: "/dashboard/leaves/wfh",
					label: "Work From Home",
					icon: Laptop
				},
				{
					to: "/dashboard/leaves/approvals",
					label: "Leave Approvals",
					icon: CircleCheck,
					count: 3
				}
			]
		}]
	},
	{
		title: "Payroll",
		roles: ["employee"],
		items: [{
			label: "Payroll",
			icon: CreditCard,
			basePath: "/dashboard/payroll",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/payroll/payslips",
					label: "Salary Slips",
					icon: FileText
				},
				{
					to: "/dashboard/payroll/salary-structure",
					label: "Salary Structure",
					icon: LayoutDashboard
				},
				{
					to: "/dashboard/payroll/history",
					label: "Payroll History",
					icon: History
				},
				{
					to: "/dashboard/payroll/tax",
					label: "Tax Details",
					icon: Percent
				},
				{
					to: "/dashboard/payroll/form16",
					label: "Form 16",
					icon: FileCheck
				},
				{
					to: "/dashboard/payroll/reimbursements",
					label: "Reimbursements",
					icon: Receipt
				},
				{
					to: "/dashboard/payroll/bonuses",
					label: "Bonuses",
					icon: Gift
				},
				{
					to: "/dashboard/payroll/incentives",
					label: "Incentives",
					icon: TrendingUp
				},
				{
					to: "/dashboard/payroll/bank-details",
					label: "Bank Details",
					icon: Landmark
				},
				{
					to: "/dashboard/payroll/pf",
					label: "PF",
					icon: Coins
				},
				{
					to: "/dashboard/payroll/esi",
					label: "ESI",
					icon: HeartHandshake
				},
				{
					to: "/dashboard/payroll/tds",
					label: "TDS",
					icon: Building
				}
			]
		}]
	},
	{
		title: "Performance",
		roles: ["employee"],
		items: [{
			label: "Performance",
			icon: Gauge,
			basePath: "/dashboard/performance",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/performance/goals",
					label: "My Goals",
					icon: Target
				},
				{
					to: "/dashboard/performance/okrs",
					label: "OKRs",
					icon: CircleCheck
				},
				{
					to: "/dashboard/performance/kpis",
					label: "KPIs",
					icon: ChartLine
				},
				{
					to: "/dashboard/performance/self-review",
					label: "Self Review",
					icon: PenLine
				},
				{
					to: "/dashboard/performance/feedback",
					label: "Manager Feedback",
					icon: MessageSquare
				},
				{
					to: "/dashboard/performance/appraisals",
					label: "Appraisals",
					icon: Award
				},
				{
					to: "/dashboard/performance/promotions",
					label: "Promotions",
					icon: TrendingUp
				},
				{
					to: "/dashboard/performance/achievements",
					label: "Achievements",
					icon: Trophy
				},
				{
					to: "/dashboard/performance/skills",
					label: "Skill Development",
					icon: GraduationCap
				}
			]
		}]
	},
	{
		title: "Documents",
		roles: ["employee"],
		items: [{
			label: "Documents",
			icon: Folder,
			basePath: "/dashboard/documents",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/documents",
					label: "My Documents",
					icon: FolderOpen,
					exact: true
				},
				{
					to: "/dashboard/documents/offer-letter",
					label: "Offer Letter",
					icon: FileText
				},
				{
					to: "/dashboard/documents/appointment-letter",
					label: "Appointment Letter",
					icon: FilePenLine
				},
				{
					to: "/dashboard/documents/salary-slips",
					label: "Salary Slips",
					icon: ScrollText
				},
				{
					to: "/dashboard/documents/experience-letter",
					label: "Experience Letter",
					icon: FileCheck
				},
				{
					to: "/dashboard/documents/policies",
					label: "Company Policies",
					icon: BookOpen
				},
				{
					to: "/dashboard/documents/nda",
					label: "NDA",
					icon: Lock
				},
				{
					to: "/dashboard/documents/tax-documents",
					label: "Tax Documents",
					icon: Percent
				},
				{
					to: "/dashboard/documents/upload",
					label: "Upload Documents",
					icon: FilePlusCorner
				}
			]
		}]
	},
	{
		title: "Assets",
		roles: ["employee"],
		items: [{
			label: "Assets",
			icon: Package,
			basePath: "/dashboard/assets",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/assets",
					label: "My Assets",
					icon: Package,
					exact: true
				},
				{
					to: "/dashboard/assets/assigned",
					label: "Assigned Assets",
					icon: Laptop
				},
				{
					to: "/dashboard/assets/details",
					label: "Asset Details",
					icon: Info
				},
				{
					to: "/dashboard/assets/warranty",
					label: "Asset Warranty",
					icon: ShieldCheck
				},
				{
					to: "/dashboard/assets/return",
					label: "Return Asset",
					icon: Repeat
				},
				{
					to: "/dashboard/assets/repair",
					label: "Repair Request",
					icon: Wrench
				},
				{
					to: "/dashboard/assets/history",
					label: "Asset History",
					icon: History
				}
			]
		}]
	},
	{
		title: "Expenses",
		roles: ["employee"],
		items: [{
			label: "Expenses",
			icon: Receipt,
			basePath: "/dashboard/expenses",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/expenses/submit",
					label: "Submit Expense",
					icon: FilePlusCorner
				},
				{
					to: "/dashboard/expenses/reimbursements",
					label: "Reimbursements",
					icon: HandCoins
				},
				{
					to: "/dashboard/expenses/travel-claims",
					label: "Travel Claims",
					icon: Plane
				},
				{
					to: "/dashboard/expenses/history",
					label: "Expense History",
					icon: History
				}
			]
		}]
	},
	{
		title: "Learning",
		roles: ["employee"],
		items: [{
			label: "Learning",
			icon: GraduationCap,
			basePath: "/dashboard/learning",
			roles: ["employee"],
			badge: "New",
			children: [
				{
					to: "/dashboard/learning/courses",
					label: "Courses",
					icon: BookOpen
				},
				{
					to: "/dashboard/learning/programs",
					label: "Training Programs",
					icon: Zap
				},
				{
					to: "/dashboard/learning/certifications",
					label: "Certifications",
					icon: BadgeCheck
				},
				{
					to: "/dashboard/learning/assessments",
					label: "Assessments",
					icon: ClipboardCheck
				},
				{
					to: "/dashboard/learning/progress",
					label: "Learning Progress",
					icon: TrendingUp
				}
			]
		}]
	},
	{
		title: "Career",
		roles: ["employee"],
		items: [{
			label: "Career",
			icon: Map,
			basePath: "/dashboard/career",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/career/openings",
					label: "Internal Job Openings",
					icon: Briefcase
				},
				{
					to: "/dashboard/career/referrals",
					label: "Referral Program",
					icon: Gift
				},
				{
					to: "/dashboard/career/growth",
					label: "Career Growth",
					icon: TrendingUp
				},
				{
					to: "/dashboard/career/promotions",
					label: "Promotion History",
					icon: Award
				}
			]
		}]
	},
	{
		title: "Communication",
		roles: ["employee"],
		items: [{
			to: "/dashboard/communication",
			label: "Communication",
			icon: MessageSquare,
			roles: ["employee"]
		}]
	},
	{
		title: "Calendar",
		roles: ["employee"],
		items: [{
			label: "Calendar",
			icon: CalendarDays,
			basePath: "/dashboard/calendar",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/calendar/company",
					label: "Company Calendar",
					icon: CalendarDays
				},
				{
					to: "/dashboard/calendar/holidays",
					label: "Holidays",
					icon: TreePalm
				},
				{
					to: "/dashboard/calendar/events",
					label: "Events",
					icon: Star
				},
				{
					to: "/dashboard/calendar/meetings",
					label: "Meetings",
					icon: Video
				}
			]
		}]
	},
	{
		title: "Rewards",
		roles: ["employee"],
		items: [{
			label: "Rewards",
			icon: Trophy,
			basePath: "/dashboard/rewards",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/rewards",
					label: "Rewards",
					icon: Trophy,
					exact: true
				},
				{
					to: "/dashboard/rewards/recognition",
					label: "Recognition",
					icon: Star
				},
				{
					to: "/dashboard/rewards/badges",
					label: "Badges",
					icon: Medal
				},
				{
					to: "/dashboard/rewards/achievements",
					label: "Achievements",
					icon: Award
				}
			]
		}]
	},
	{
		title: "Help Center",
		roles: ["employee"],
		items: [{
			label: "Help Center",
			icon: Headphones,
			basePath: "/dashboard/help",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/help/desk",
					label: "Help Desk",
					icon: Headphones
				},
				{
					to: "/dashboard/help/raise-ticket",
					label: "Raise Ticket",
					icon: TicketCheck
				},
				{
					to: "/dashboard/help/support",
					label: "Support Requests",
					icon: HeartHandshake
				},
				{
					to: "/dashboard/help/faqs",
					label: "FAQs",
					icon: CircleQuestionMark
				}
			]
		}]
	},
	{
		title: "Settings",
		roles: ["employee"],
		items: [{
			label: "Settings",
			icon: Settings,
			basePath: "/dashboard/settings",
			roles: ["employee"],
			children: [
				{
					to: "/dashboard/settings/profile",
					label: "My Profile",
					icon: UserCheck
				},
				{
					to: "/dashboard/settings/personal",
					label: "Personal Information",
					icon: UserCog
				},
				{
					to: "/dashboard/settings/emergency-contacts",
					label: "Emergency Contacts",
					icon: CircleAlert
				},
				{
					to: "/dashboard/settings/bank-details",
					label: "Bank Details",
					icon: Landmark
				},
				{
					to: "/dashboard/settings/security",
					label: "Password & Security",
					icon: Lock
				},
				{
					to: "/dashboard/settings/notifications",
					label: "Notification Settings",
					icon: Bell
				},
				{
					to: "/dashboard/settings/language",
					label: "Language",
					icon: Languages
				},
				{
					to: "/dashboard/settings/privacy",
					label: "Privacy Settings",
					icon: ShieldCheck
				}
			]
		}]
	},
	{ items: [{
		to: "/dashboard/hr-ops",
		label: "Operations",
		icon: Activity,
		roles: [
			"admin",
			"hr",
			"manager"
		]
	}, {
		to: "/dashboard/lifecycle",
		label: "Employee Lifecycle",
		icon: UserCheck,
		roles: [
			"admin",
			"hr",
			"manager"
		]
	}] },
	{ items: [{
		to: "/dashboard/settings",
		label: "Settings",
		icon: Settings
	}] }
];
function filterNavForRole(sections, role) {
	const allowed = (roles) => !roles || roles.includes(role);
	return sections.filter((s) => allowed(s.roles)).map((section) => ({
		...section,
		items: section.items.filter((item) => allowed(item.roles)).map((item) => {
			if (isParent(item)) return {
				...item,
				children: item.children.filter((c) => allowed(c.roles))
			};
			return item;
		}).filter((item) => {
			if (isParent(item)) return item.children.length > 0;
			return true;
		})
	})).filter((s) => s.items.length > 0);
}
function DemoBanner({ role, onDismiss }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-b border-amber-400/30 bg-amber-500/10 px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "Demo Mode"
				}),
				" — Viewing Sample Enterprise Data as",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: role === "manager" ? "Manager" : "Employee"
				}),
				". All data is illustrative only."
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onDismiss,
			"aria-label": "Dismiss demo banner",
			className: "shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
		})]
	});
}
function DashboardShell() {
	const ws = useofc360();
	const authReady = useAuthReady();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [demoDismissed, setDemoDismissed] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { theme, toggle: toggleTheme } = useTheme();
	const role = ws.user?.role ?? "admin";
	const isDemo = Boolean(ws.isDemoUser) && !demoDismissed;
	(0, import_react.useEffect)(() => {
		if (!authReady || ws.isRestoring) return;
		if (!ws.user && !hasValidAccessToken()) {
			navigate({ to: "/login" });
			return;
		}
		if (!ws.user) return;
		if (!ws.user.emailVerified) {
			navigate({ to: "/verify-email" });
			return;
		}
		if (!ws.user.onboardingComplete) {
			navigate({ to: "/onboarding" });
			return;
		}
		const isAdminOrHr = role === "admin" || role === "hr";
		if (pathname === "/dashboard") {
			if (role === "manager") {
				navigate({ to: "/dashboard/manager" });
				return;
			}
			if (role === "employee") {
				navigate({ to: "/dashboard/employee" });
				return;
			}
		}
		if (pathname === "/dashboard/manager" && role !== "manager") {
			navigate({ to: isAdminOrHr ? "/dashboard" : "/dashboard/employee" });
			return;
		}
		if (role === "employee") {
			if ([
				"/dashboard/employees",
				"/dashboard/hr",
				"/dashboard/managers",
				"/dashboard/departments",
				"/dashboard/timesheets",
				"/dashboard/payroll",
				"/dashboard/performance",
				"/dashboard/documents",
				"/dashboard/assets",
				"/dashboard/recruitment",
				"/dashboard/reports",
				"/dashboard/hr-ops",
				"/dashboard/timeline",
				"/dashboard/visitors",
				"/dashboard/onboarding-checklist",
				"/dashboard/offboarding",
				"/dashboard/exit",
				"/dashboard/roles",
				"/dashboard/audit-logs",
				"/dashboard/billing",
				"/ai"
			].some((p) => pathname.startsWith(p))) navigate({ to: "/dashboard/employee" });
		}
	}, [
		authReady,
		ws.isRestoring,
		ws.user,
		pathname,
		role,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	const visibleNav = (0, import_react.useMemo)(() => filterNavForRole(NAV_SECTIONS, role), [role]);
	if (!authReady || ws.isRestoring || !ws.user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	function logout() {
		setTokens(null);
		ofc360.reset();
		navigate({ to: "/login" });
	}
	const initials = ws.user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground",
		children: [isDemo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {
			role,
			onDismiss: () => setDemoDismissed(true)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-2xl transition-all duration-200 ${collapsed ? "w-[68px]" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-16 items-center justify-between border-b border-border px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: role === "manager" ? "/dashboard/manager" : role === "employee" ? "/dashboard/employee" : "/dashboard",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow",
									style: { background: "var(--gradient-brand)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
								}), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg font-semibold tracking-tight",
									children: "ofc360"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCollapsed((c) => !c),
								className: "hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors",
								"aria-label": "Toggle sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "h-4.5 w-4.5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 space-y-3 overflow-y-auto p-2",
							children: visibleNav.map((section, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [
									section.title && !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70",
										children: section.title
									}) : null,
									section.title && collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 my-2 border-t border-border" }) : null,
									section.items.map((item) => {
										if (isParent(item)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
											item,
											pathname,
											collapsed
										}, item.basePath);
										const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
										const Icon = item.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
											children: [
												active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
												!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1",
														children: item.label
													}),
													item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
													item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
												] }) : null
											]
										}, item.to);
									})
								]
							}, sIdx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center gap-3 ${collapsed ? "justify-center" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background",
										children: initials
									}),
									!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-medium",
											children: ws.user?.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs capitalize text-muted-foreground",
											children: ws.user?.role
										})]
									}) : null,
									!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: logout,
										className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
										"aria-label": "Sign out",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
									}) : null
								]
							})
						})
					]
				}),
				mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: () => setMobileOpen(false),
					className: "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-200 ${collapsed ? "lg:pl-[68px]" : "lg:pl-64"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen(true),
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative max-w-md flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search employees, departments, requests…",
									className: "h-9 pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleTheme,
								className: "rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
								"aria-label": "Toggle theme",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
								"aria-label": "Notifications",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: ws.company?.name || "Workspace"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})]
				})
			]
		})]
	});
}
function NavGroup({ item, pathname, collapsed }) {
	const isActive = item.children.some((c) => c.exact ? pathname === c.to : pathname === c.to || pathname.startsWith(c.to + "/")) || pathname === item.basePath || pathname.startsWith(item.basePath + "/");
	const [open, setOpen] = (0, import_react.useState)(isActive);
	(0, import_react.useEffect)(() => {
		if (isActive) setOpen(true);
	}, [isActive]);
	const Icon = item.icon;
	if (collapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.basePath,
		className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		"aria-label": item.label,
		children: [isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group relative flex w-full items-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		children: [
			isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.basePath,
				onClick: () => setOpen(true),
				className: "flex flex-1 items-center gap-3 rounded-lg px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-left",
						children: item.label
					}),
					item.badge && !item.count && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
					item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen((o) => !o);
				},
				"aria-label": open ? "Collapse" : "Expand",
				className: "mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}` })
			})
		]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ml-4 mt-1 space-y-0.5 border-l border-border pl-2",
		children: item.children.map((child) => {
			const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
			const ChildIcon = child.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: child.to,
				className: `flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildIcon, { className: "h-3.5 w-3.5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: child.label
					}),
					child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: child.badge }),
					child.count !== void 0 && !child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: child.count })
				]
			}, child.to);
		})
	}) : null] });
}
function PageHeader({ title, description, actions }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isRecruitmentSubPage = pathname.startsWith("/dashboard/recruitment/") && pathname !== "/dashboard/recruitment" && pathname !== "/dashboard/recruitment/";
	const isPayrollSubPage = pathname.startsWith("/dashboard/payroll/") && pathname !== "/dashboard/payroll" && pathname !== "/dashboard/payroll/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col min-w-0 gap-2 text-left",
		children: [
			isRecruitmentSubPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/recruitment",
					className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" }), "Back to Recruitment Hub"]
				})
			}),
			isPayrollSubPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/payroll",
					className: "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" }), "Back to Payroll Hub"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight",
						children: title
					}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: description
					}) : null]
				}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 flex-wrap gap-2",
					children: actions
				}) : null]
			})
		]
	});
}
function ComingSoon({ title, description, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { DashboardShell as n, PageHeader as r, ComingSoon as t };
