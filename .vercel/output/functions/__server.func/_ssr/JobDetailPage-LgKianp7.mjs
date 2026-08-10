import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { cn as useofc360, n as BASE_URL, t as API_HOST_URL } from "./ofc360-store-CCKqL5hS.mjs";
import { t as api } from "./client-CGy3i_7n.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Dn as ExternalLink, Dr as BookOpen, Fr as ArrowRight, K as Search, Ln as Copy, Lr as ArrowLeft, Mn as DollarSign, Ot as MapPin, Sr as Briefcase, T as Trash2, X as Save, _r as CalendarClock, br as Building, dt as Pencil, er as CircleAlert, in as Globe, jn as Download, jr as Award, m as UserPlus, mt as Pause, nt as Printer, ot as Play, pr as Calendar, r as X, tt as QrCode, u as Users, wt as MessageSquare, zr as Archive } from "../_libs/lucide-react.mjs";
import { _ as Link, b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment } from "./useRecruitment-BjMJh5Mt.mjs";
import { c as fmtMoney, s as fmtDate, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JobDetailPage-LgKianp7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHART_COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)"
];
var INITIAL_DISTRIBUTION = [
	{
		key: "linkedin",
		label: "LinkedIn Jobs",
		desc: "Reach active professionals worldwide",
		status: "Connected",
		sync: "2 hours ago",
		active: true,
		url: "https://www.linkedin.com/jobs"
	},
	{
		key: "indeed",
		label: "Indeed",
		desc: "The world's #1 job site",
		status: "Connected",
		sync: "4 hours ago",
		active: true,
		url: "https://www.indeed.com"
	},
	{
		key: "naukri",
		label: "Naukri",
		desc: "India's largest employment platform",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.naukri.com"
	},
	{
		key: "foundit",
		label: "Foundit",
		desc: "Monster India newly upgraded board",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.foundit.in"
	},
	{
		key: "glassdoor",
		label: "Glassdoor",
		desc: "Employer branding & job distribution",
		status: "Connected",
		sync: "1 day ago",
		active: true,
		url: "https://www.glassdoor.com"
	},
	{
		key: "wellfound",
		label: "Wellfound",
		desc: "Reach top startup talent",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://wellfound.com"
	},
	{
		key: "monster",
		label: "Monster Jobs",
		desc: "Global premium candidate database",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.monster.com"
	},
	{
		key: "ziprecruiter",
		label: "ZipRecruiter",
		desc: "Direct distribution to 100+ job boards",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.ziprecruiter.com"
	},
	{
		key: "google",
		label: "Google Jobs",
		desc: "Index directly in Google Search index",
		status: "Connected",
		sync: "1 hour ago",
		active: true,
		url: "https://google.com/search?q=jobs"
	},
	{
		key: "shine",
		label: "Shine",
		desc: "India's premium resume database search",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.shine.com"
	},
	{
		key: "career_page",
		label: "Company Career Page",
		desc: "Host on your custom career website",
		status: "Connected",
		sync: "Real-time",
		active: true,
		url: "/careers"
	},
	{
		key: "referral",
		label: "Employee Referral Portal",
		desc: "Internal employee sourcing portal",
		status: "Connected",
		sync: "Real-time",
		active: true,
		url: "/referrals"
	}
];
function JobDetailPage() {
	const { jobId } = useParams({ from: "/dashboard/recruitment/jobs/$jobId" });
	const navigate = useNavigate();
	const [job, setJob] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const { candidates: allCandidates, getJob, upsertJob } = useRecruitment();
	const applicants = (0, import_react.useMemo)(() => allCandidates.filter((c) => c.jobId === jobId), [allCandidates, jobId]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selectedCandidates, setSelectedCandidates] = (0, import_react.useState)([]);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(null);
	const [showQr, setShowQr] = (0, import_react.useState)(false);
	const [commentText, setCommentText] = (0, import_react.useState)("");
	const [notesList, setNotesList] = (0, import_react.useState)([{
		author: "Hiring Manager",
		at: "2026-06-29T10:00:00Z",
		text: "Approved budget allocation for hiring this quarter."
	}, {
		author: "HR Recruiter",
		at: "2026-06-29T14:30:00Z",
		text: "Synced job posting details across LinkedIn and Glassdoor."
	}]);
	const [channels, setChannels] = (0, import_react.useState)(INITIAL_DISTRIBUTION);
	const userRole = useofc360().user?.role || "employee";
	const [showPublishModal, setShowPublishModal] = (0, import_react.useState)(false);
	const [showQrModal, setShowQrModal] = (0, import_react.useState)(false);
	const [showExportModal, setShowExportModal] = (0, import_react.useState)(false);
	const [showDuplicateModal, setShowDuplicateModal] = (0, import_react.useState)(false);
	const [showCloseDialog, setShowCloseDialog] = (0, import_react.useState)(false);
	const [publishChannels, setPublishChannels] = (0, import_react.useState)([]);
	const [loadingChannels, setLoadingChannels] = (0, import_react.useState)(false);
	const [qrData, setQrData] = (0, import_react.useState)(null);
	const [loadingQr, setLoadingQr] = (0, import_react.useState)(false);
	const [exportFormat, setExportFormat] = (0, import_react.useState)("csv");
	const [exportFilter, setExportFilter] = (0, import_react.useState)("all");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [dupTitle, setDupTitle] = (0, import_react.useState)("");
	const [dupLocation, setDupLocation] = (0, import_react.useState)("");
	const [dupVacancies, setDupVacancies] = (0, import_react.useState)(1);
	const [dupMinSalary, setDupMinSalary] = (0, import_react.useState)("0");
	const [dupMaxSalary, setDupMaxSalary] = (0, import_react.useState)("0");
	const [duplicating, setDuplicating] = (0, import_react.useState)(false);
	const [closing, setClosing] = (0, import_react.useState)(false);
	const [isCopyingLink, setIsCopyingLink] = (0, import_react.useState)(false);
	const fetchPublishChannels = async () => {
		setLoadingChannels(true);
		try {
			const res = await api.get(`/jobs/${jobId}/publish`);
			if (res.success && res.data) setPublishChannels(res.data);
		} catch (err) {
			toast.error(err.message || "Failed to load publish channels.");
		} finally {
			setLoadingChannels(false);
		}
	};
	const handleFetchQr = async () => {
		setLoadingQr(true);
		try {
			const res = await api.get(`/jobs/${jobId}/qr`);
			if (res) setQrData(res);
		} catch (err) {
			toast.error(err.message || "Failed to load QR code.");
		} finally {
			setLoadingQr(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (showPublishModal) fetchPublishChannels();
	}, [showPublishModal]);
	(0, import_react.useEffect)(() => {
		if (showQrModal) handleFetchQr();
	}, [showQrModal]);
	(0, import_react.useEffect)(() => {
		if (showDuplicateModal && job) {
			setDupTitle(job.title + " (Copy)");
			setDupLocation(job.location);
			setDupVacancies(job.vacancies || 1);
			setDupMinSalary(job.salaryMin ? String(job.salaryMin) : "0");
			setDupMaxSalary(job.salaryMax ? String(job.salaryMax) : "0");
		}
	}, [showDuplicateModal, job]);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchJob() {
			setLoading(true);
			setError(null);
			try {
				const data = await getJob(jobId);
				if (active) setJob(data);
			} catch (err) {
				if (active) setError(err.message || "Failed to load job details.");
			} finally {
				if (active) setLoading(false);
			}
		}
		fetchJob();
		return () => {
			active = false;
		};
	}, [jobId]);
	const filteredApplicants = (0, import_react.useMemo)(() => {
		return applicants.filter((c) => {
			const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
			const matchStatus = statusFilter === "all" || c.stage.toLowerCase() === statusFilter.toLowerCase();
			return matchSearch && matchStatus;
		});
	}, [
		applicants,
		search,
		statusFilter
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Loading job details..."
		})]
	});
	if (error || !job) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-4 h-12 w-12 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold",
				children: "Job Posting Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: error || "The requested job posting could not be found."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/recruitment/jobs",
					children: "Back to Jobs List"
				})
			})
		]
	});
	function startEdit() {
		setDraft({ ...job });
		setEditing(true);
	}
	function cancelEdit() {
		setDraft(null);
		setEditing(false);
	}
	async function save() {
		if (draft) try {
			await upsertJob(draft);
			setJob(draft);
			setEditing(false);
		} catch (err) {
			alert("Failed to save job changes: " + (err.message || err));
		}
	}
	const handleToggleChannel = async (channelName, currentStatus) => {
		try {
			const newStatus = !currentStatus;
			const res = await api.post(`/jobs/${jobId}/publish`, {
				channel_name: channelName,
				is_active: newStatus
			});
			if (res.success && res.data) {
				setPublishChannels((prev) => {
					const updated = prev.map((c) => c.channel_name === channelName ? res.data : c);
					const anyActive = updated.some((c) => c.is_active);
					if (job) setJob({
						...job,
						status: anyActive ? "published" : "draft"
					});
					return updated;
				});
				toast.success(`${channelName.replace("_", " ").toUpperCase()} ${newStatus ? "published" : "unpublished"} successfully!`);
			}
		} catch (err) {
			toast.error(err.message || "Failed to update channel status.");
		}
	};
	const handleCopySourcingLink = async () => {
		setIsCopyingLink(true);
		try {
			const res = await api.get(`/jobs/${jobId}/sourcing-link`);
			if (res && res.url) {
				await navigator.clipboard.writeText(res.url);
				toast.success("Sourcing link copied successfully!");
			} else throw new Error("No link found.");
		} catch (err) {
			toast.error(err.message || "Failed to retrieve sourcing link.");
		} finally {
			setIsCopyingLink(false);
		}
	};
	const handlePrintQr = () => {
		if (!qrData) return;
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${job?.title}</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
              img { width: 300px; height: 300px; }
              h1 { margin-bottom: 5px; }
              p { color: #666; margin-top: 5px; }
            </style>
          </head>
          <body>
            <h1>${job?.title}</h1>
            <img src="${API_HOST_URL}${qrData.qr_png_url}" onload="window.print(); window.close();" />
            <p>Scan to apply</p>
          </body>
        </html>
      `);
			printWindow.document.close();
		}
	};
	const handleExportApplicants = async () => {
		setExporting(true);
		try {
			const token = localStorage.getItem("access_token") || "";
			const url = `${BASE_URL}/jobs/${jobId}/applicants/export?format=${exportFormat}&filter=${exportFilter}`;
			const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
			if (!response.ok) throw new Error("Export failed.");
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			const ext = exportFormat === "excel" ? "xlsx" : exportFormat;
			link.setAttribute("download", `job_${jobId}_applicants_${exportFilter}.${ext}`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
			toast.success("Applicants exported successfully!");
			setShowExportModal(false);
		} catch (err) {
			toast.error(err.message || "Failed to export applicants.");
		} finally {
			setExporting(false);
		}
	};
	const handleCreateDuplicate = async () => {
		setDuplicating(true);
		try {
			const res = await api.post(`/jobs/${jobId}/duplicate`, {
				title: dupTitle,
				location: dupLocation,
				vacancies: dupVacancies,
				min_salary: parseFloat(dupMinSalary) || 0,
				max_salary: parseFloat(dupMaxSalary) || 0
			});
			if (res.success && res.data) {
				toast.success("Job duplicated successfully!");
				setShowDuplicateModal(false);
				navigate({ to: `/dashboard/recruitment/jobs/${res.data.id}` });
			} else throw new Error(res.message || "Duplication failed.");
		} catch (err) {
			toast.error(err.message || "Failed to duplicate job.");
		} finally {
			setDuplicating(false);
		}
	};
	const handleSync = (key) => {
		setChannels((prev) => prev.map((c) => c.key === key ? {
			...c,
			sync: "Just now"
		} : c));
	};
	const handleTogglePlatform = (key) => {
		setChannels((prev) => prev.map((c) => c.key === key ? {
			...c,
			active: !c.active,
			status: c.active ? "Not Connected" : "Connected",
			sync: c.active ? "Never" : "Just now"
		} : c));
	};
	const handleConfirmCloseJob = async () => {
		setClosing(true);
		try {
			const res = await api.post(`/jobs/${jobId}/close`);
			if (res.success) {
				setJob((prev) => prev ? {
					...prev,
					status: "closed"
				} : null);
				toast.success("Job closed successfully!");
				setShowCloseDialog(false);
			} else throw new Error(res.message || "Failed to close job.");
		} catch (err) {
			toast.error(err.message || "Failed to close job.");
		} finally {
			setClosing(false);
		}
	};
	const togglePause = async () => {
		if (!job) return;
		const isPublished = job.status.toLowerCase() === "published";
		try {
			if (isPublished) {
				const res = await api.post(`/jobs/${jobId}/draft`);
				if (res.success && res.data) {
					setJob(res.data);
					toast.success("Job paused and set to Draft.");
				}
			} else if ((await api.post(`/jobs/${jobId}/publish`, {
				channel_name: "career_site",
				is_active: true
			})).success) {
				setJob(await getJob(jobId));
				toast.success("Job published on Career Site.");
			}
		} catch (err) {
			toast.error(err.message || "Failed to update job status.");
		}
	};
	const remove = async () => {
		if (!job) return;
		if (confirm("Delete this job? This cannot be undone.")) try {
			const res = await api.delete(`/jobs/${jobId}`);
			if (res.success) {
				toast.success("Job deleted successfully!");
				navigate({ to: "/dashboard/recruitment/jobs" });
			} else throw new Error(res.message || "Delete failed.");
		} catch (err) {
			toast.error(err.message || "Failed to delete job.");
		}
	};
	function copyToClipboard(txt, label) {
		navigator.clipboard.writeText(txt);
		setCopiedLink(label);
		setTimeout(() => setCopiedLink(null), 2e3);
	}
	function handleAddNote() {
		if (!commentText.trim()) return;
		setNotesList([{
			author: "You",
			at: (/* @__PURE__ */ new Date()).toISOString(),
			text: commentText.trim()
		}, ...notesList]);
		setCommentText("");
	}
	const totalViews = 384;
	const shortlistedCount = applicants.filter((c) => [
		"assessment",
		"interview",
		"technical",
		"hr"
	].includes(c.stage)).length;
	const interviewedCount = applicants.filter((c) => ["interview", "technical"].includes(c.stage)).length;
	const offersSent = 2;
	const hiredCount = applicants.filter((c) => c.stage === "hired").length;
	applicants.filter((c) => c.stage === "rejected").length;
	const conversionRate = applicants.length ? (hiredCount / applicants.length * 100).toFixed(0) : "0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/recruitment/jobs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), "All Jobs"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mb-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-foreground",
								children: editing ? "Editing Details" : job.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `capitalize font-semibold border ${job.status === "active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : job.status === "draft" ? "border-sky-500/30 bg-sky-500/10 text-sky-500" : "border-muted bg-muted/40 text-muted-foreground"}`,
								children: job.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "mr-1.5 h-3.5 w-3.5" }), job.department]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 h-3.5 w-3.5" }),
										job.location,
										" (",
										job.workMode,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-1.5 h-3.5 w-3.5" }), job.employmentType]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "mr-1.5 h-3.5 w-3.5" }),
										fmtMoney(job.salaryMin, "INR"),
										" – ",
										fmtMoney(job.salaryMax, "INR")
									]
								})
							]
						}),
						!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 pt-2 md:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Hiring Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.hiringManager || "HM Team"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Recruiter"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.recruiter || "Talent Team"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Open Positions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.vacancies
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Total Applicants"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: applicants.length
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 md:self-start",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: cancelEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1.5 h-4 w-4" }), "Cancel"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: save,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), "Save Details"]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: startEdit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1.5 h-4 w-4" }), "Edit"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowDuplicateModal(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-4 w-4" }), "Duplicate"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: togglePause,
							children: [job.status.toLowerCase() === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-1.5 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1.5 h-4 w-4" }), job.status.toLowerCase() === "published" ? "Pause" : "Activate"]
						}),
						job.status.toLowerCase() !== "closed" && userRole !== "recruiter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowCloseDialog(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-1.5 h-4 w-4" }), "Close Job"]
						}),
						userRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: remove,
							className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), "Delete"]
						})
					] })
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex border-b border-border",
			children: [
				{
					key: "overview",
					label: "Overview"
				},
				{
					key: "applicants",
					label: `Applicants (${applicants.length})`
				},
				{
					key: "publish",
					label: "Publish Channels"
				},
				{
					key: "links",
					label: "Job Links"
				},
				{
					key: "analytics",
					label: "Analytics"
				},
				{
					key: "activity",
					label: "Activity Logs"
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(t.key),
				className: `px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
				children: t.label
			}, t.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
										label: "Title",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.title,
											onChange: (e) => setDraft({
												...draft,
												title: e.target.value
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
										label: "Department",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.department,
											onChange: (e) => setDraft({
												...draft,
												department: e.target.value
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
									label: "Description",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 6,
										value: draft.description,
										onChange: (e) => setDraft({
											...draft,
											description: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Min Salary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.salaryMin,
												onChange: (e) => setDraft({
													...draft,
													salaryMin: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Max Salary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.salaryMax,
												onChange: (e) => setDraft({
													...draft,
													salaryMax: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Vacancies",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.vacancies,
												onChange: (e) => setDraft({
													...draft,
													vacancies: Number(e.target.value)
												})
											})
										})
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Company Info",
									icon: Building,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: "ofc360 Inc. is a high-growth HR Technology platforms enterprise. This job role resides in our main operations product division."
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Expectations & Joining",
									icon: Calendar,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Joining Date:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Immediate / Within 30 days"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Required Docs:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Resume, Portfolio, Degree Certificate"
											})]
										})]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Job Description",
								icon: Briefcase,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-line",
									children: job.description
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Key Responsibilities",
									icon: Award,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: job.responsibilities || [
										"Architect, develop, and maintain clean scalable web applications.",
										"Coordinate closely with product designers and business units.",
										"Perform thorough peer reviews and integration tests."
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Qualifications & Requirements",
									icon: BookOpen,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: job.requirements || [
										"3+ years experience with React, TypeScript, and modern frameworks.",
										"Strong experience building and testing responsive user interfaces.",
										"Excellent problem solving and communication skills."
									] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Interview Stages & Pipeline",
								icon: CalendarClock,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-3",
									children: [
										{
											step: 1,
											name: "Screening",
											desc: "CV shortlisting & initial HR screening"
										},
										{
											step: 2,
											name: "Technical Assessment",
											desc: "Take-home coding task or algorithmic challenge"
										},
										{
											step: 3,
											name: "Technical Interview",
											desc: "Live coding and system architecture review"
										},
										{
											step: 4,
											name: "HR & Culture Round",
											desc: "Value alignment and comp band negotiation"
										}
									].map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 rounded-lg bg-background/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-6 w-6 shrink-0 place-items-center rounded bg-primary/10 text-xs font-semibold text-primary",
											children: stage.step
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold block",
											children: stage.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: stage.desc
										})] })]
									}, stage.step))
								})
							})
						] })
					}),
					activeTab === "applicants" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/25 p-3 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-2 max-w-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search candidate by name or email...",
									className: "h-8 border-border text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "h-8 rounded-lg border border-border bg-background px-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Stages"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "applied",
											children: "Applied"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "screening",
											children: "Screening"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "assessment",
											children: "Assessment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "interview",
											children: "Interview"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "hired",
											children: "Hired"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rejected",
											children: "Rejected"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setExportFormat("csv");
										setShowExportModal(true);
									},
									className: "h-8 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export CSV"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-xl",
							children: filteredApplicants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center p-12 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-4 h-12 w-12 text-muted-foreground/30 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm",
										children: "No Applicants Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground max-w-xs mt-1",
										children: "No applications match the active filters or search criteria."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left border-collapse text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 w-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: selectedCandidates.length === filteredApplicants.length,
													onChange: (e) => {
														if (e.target.checked) setSelectedCandidates(filteredApplicants.map((c) => c.id));
														else setSelectedCandidates([]);
													},
													className: "rounded border-border"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Candidate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Contact"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Experience"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Current Company"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Applied"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Stage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-right",
												children: "Actions"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredApplicants.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border/60 hover:bg-accent/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: selectedCandidates.includes(c.id),
													onChange: (e) => {
														if (e.target.checked) setSelectedCandidates([...selectedCandidates, c.id]);
														else setSelectedCandidates(selectedCandidates.filter((id) => id !== c.id));
													},
													className: "rounded border-border"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
														name: c.name,
														size: 30
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/dashboard/recruitment/candidates/$candidateId",
														params: { candidateId: c.id },
														className: "font-semibold text-foreground hover:underline",
														children: c.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-muted-foreground block mt-0.5",
														children: [
															"ATS: ",
															c.atsScore,
															"/100"
														]
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3 space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block",
													children: c.email
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block",
													children: c.phone
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3",
												children: [c.yearsExperience, " yrs"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: c.currentCompany || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: fmtDate(c.appliedAt)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "capitalize text-[10px]",
													children: c.stage
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center justify-end gap-1.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "h-7 w-7",
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/dashboard/recruitment/candidates/$candidateId",
															params: { candidateId: c.id },
															title: "View Profile",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
														})
													})
												})
											})
										]
									}, c.id)) })]
								})
							})
						})]
					}),
					activeTab === "publish" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Job Distribution Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Distribute and synchronize this role across international boards."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: channels.map((chan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-xl border border-border bg-card/50 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: chan.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "font-semibold text-sm hover:text-primary transition-colors inline-flex items-center gap-1",
										children: [chan.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 opacity-60 hover:opacity-100 transition-opacity" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-[10px] ${chan.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground"}`,
										children: chan.status
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: chan.desc
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-t border-border/60 pt-3 mt-4 text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sync: ", chan.sync] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: chan.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												asChild: true,
												className: "h-7 px-2 text-[10px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: chan.url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " Visit"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => handleSync(chan.key),
												className: "h-7 px-2 text-[10px]",
												children: "Sync"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleTogglePlatform(chan.key),
												className: "h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10",
												children: "Disconnect"
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											asChild: true,
											className: "h-7 px-3 text-[10px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/dashboard/recruitment/jobs/$jobId/publish",
												params: { jobId: job.id },
												children: "Publish Channel"
											})
										})
									})]
								})]
							}, chan.key))
						})]
					}),
					activeTab === "links" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Promotional & Sourcing Links"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Copy pre-configured referral, outreach, or public board URLs."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [[
								{
									label: "Public Career Site URL",
									url: `https://careers.ofc360.com/jobs/${jobId}`
								},
								{
									label: "Internal Employee Referral Link",
									url: `https://ofc360.com/portal/referrals?job=${jobId}`
								},
								{
									label: "Campus Sourcing URL",
									url: `https://careers.ofc360.com/campus/sourcing?tag=uni-${jobId}`
								}
							].map((linkItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-2",
									children: linkItem.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: linkItem.url,
										readOnly: true,
										className: "h-9 text-xs bg-background/50 border-border"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-9 px-3 shrink-0",
										onClick: () => copyToClipboard(linkItem.url, linkItem.label),
										children: copiedLink === linkItem.label ? "Copied!" : "Copy"
									})]
								})]
							}, linkItem.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold block",
										children: "QR Code Sourcing Asset"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: "Generate printable asset for campus or office placement."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setShowQr(!showQr),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-1.5 h-4 w-4" }), showQr ? "Hide Asset" : "Generate QR"]
									})]
								}), showQr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center p-6 bg-background/40 mt-4 rounded-xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-36 w-36 place-items-center bg-white p-2.5 rounded-lg shadow-lg border border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											className: "h-full w-full text-slate-800",
											viewBox: "0 0 100 100",
											fill: "currentColor",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 0h30v30H0zm40 0h20v20H40zm30 0h30v30H70zm-70 40h20v20H0zm30 0h40v40H30zm50 0h20v20H80zm-80 30h30v30H0zm80 10h20v20H80z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M10 10h10v10H10zm60 0h10v10H70zm-60 60h10v10H10z",
												fill: "none",
												stroke: "white",
												strokeWidth: "2"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-3",
										children: "Scan to apply directly via mobile."
									})]
								})]
							})]
						})]
					}),
					activeTab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: [
								{
									label: "Job Views",
									value: totalViews,
									suffix: "",
									icon: Globe
								},
								{
									label: "Applications",
									value: applicants.length,
									suffix: "",
									icon: Users
								},
								{
									label: "Interviewed",
									value: interviewedCount,
									suffix: "",
									icon: CalendarClock
								},
								{
									label: "Hired Rate",
									value: conversionRate,
									suffix: "%",
									icon: UserPlus
								}
							].map((k) => {
								const I = k.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/60 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: k.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4 text-muted-foreground/50" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl font-bold text-foreground",
										children: [k.value, k.suffix]
									})]
								}, k.label);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-4",
									children: "Daily Application Flow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
											data: [
												{
													name: "Mon",
													apps: 3
												},
												{
													name: "Tue",
													apps: 7
												},
												{
													name: "Wed",
													apps: 5
												},
												{
													name: "Thu",
													apps: applicants.length
												},
												{
													name: "Fri",
													apps: 4
												},
												{
													name: "Sat",
													apps: 2
												},
												{
													name: "Sun",
													apps: 1
												}
											],
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
													id: "colorApps",
													x1: "0",
													y1: "0",
													x2: "0",
													y2: "1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "5%",
														stopColor: "var(--color-primary, oklch(0.65 0.22 285))",
														stopOpacity: .4
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "95%",
														stopColor: "var(--color-primary, oklch(0.65 0.22 285))",
														stopOpacity: 0
													})]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "oklch(0.2 0.05 240 / 0.3)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "name",
													stroke: "oklch(0.5 0.05 240)",
													fontSize: 10
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													stroke: "oklch(0.5 0.05 240)",
													fontSize: 10
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
													type: "monotone",
													dataKey: "apps",
													stroke: "var(--color-primary, oklch(0.65 0.22 285))",
													fillOpacity: 1,
													fill: "url(#colorApps)"
												})
											]
										})
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-4",
									children: "Sourcing Channels Breakdown"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
												data: [
													{
														name: "LinkedIn",
														value: 45
													},
													{
														name: "Indeed",
														value: 30
													},
													{
														name: "Glassdoor",
														value: 15
													},
													{
														name: "Direct Referral",
														value: 10
													}
												],
												cx: "50%",
												cy: "50%",
												innerRadius: 60,
												outerRadius: 80,
												paddingAngle: 5,
												dataKey: "value",
												children: CHART_COLORS.map((color, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: color }, `cell-${index}`))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												verticalAlign: "bottom",
												height: 36,
												iconSize: 10,
												fontSize: 10
											})
										] })
									})
								})]
							})]
						})]
					}),
					activeTab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block",
									children: "Add Notes / Comments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: commentText,
									onChange: (e) => setCommentText(e.target.value),
									placeholder: "Type an internal update, tag recruiter...",
									rows: 3,
									className: "text-xs bg-background/50 border-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: handleAddNote,
										className: "h-8 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1.5 h-3.5 w-3.5" }), "Submit Comment"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: notesList.map((n, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 rounded-xl border border-border bg-card/40 p-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary",
									children: n.author.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: n.author
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: fmtDate(n.at)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: n.text
									})]
								})]
							}, idx))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4 lg:sticky lg:top-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold block",
						children: "Quick Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowPublishModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "mr-2 h-4 w-4" }), "Publish Channels"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: handleCopySourcingLink,
								disabled: isCopyingLink,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), isCopyingLink ? "Fetching..." : "Copy Sourcing Link"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowQrModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-2 h-4 w-4" }), "Generate Job QR Code"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowExportModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export Applicants"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowDuplicateModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Duplicate Role"]
							}),
							userRole !== "recruiter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start text-destructive hover:bg-destructive/15",
								onClick: () => setShowCloseDialog(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 h-4 w-4" }), "Close Position"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-3",
						children: "Pipeline Health"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shortlisted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: shortlistedCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interviewed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: interviewedCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Offers Sent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: offersSent
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hires Count" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: hiredCount
								})]
							})
						]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showPublishModal,
			onOpenChange: setShowPublishModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 text-primary animate-pulse" }), "Publish Channels"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Control where your job posting is active. Generating a channel automatically registers a unique applicant-facing link." })] }),
					loadingChannels ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-8 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Fetching publish channels..."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 py-2",
						children: [
							"career_site",
							"public_link",
							"internal_portal"
						].map((chanName) => {
							const chanObj = publishChannels.find((c) => c.channel_name === chanName) || {
								channel_name: chanName,
								is_active: false,
								published_at: null,
								last_updated: null,
								url: ""
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-background/50 p-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold text-foreground block",
										children: chanName === "career_site" ? "Company Career Site" : chanName === "public_link" ? "Public Apply Link" : "Internal Hiring Portal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: chanName === "career_site" ? "Publish to public careers directory." : chanName === "public_link" ? "Create a shareable url for job boards." : "Internal portal for employee referrals."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: chanObj.is_active,
										onCheckedChange: () => handleToggleChannel(chanName, chanObj.is_active)
									})]
								}), chanObj.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border/50 flex flex-col gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-emerald-500 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" }), "Active"]
											})]
										}),
										chanObj.published_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Published At:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(chanObj.published_at).toLocaleDateString() })]
										}),
										chanObj.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[200px] text-primary underline text-[10px]",
												children: chanObj.url
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-6 w-6 text-muted-foreground",
													onClick: () => {
														navigator.clipboard.writeText(chanObj.url);
														toast.success("Link copied!");
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-6 text-[10px] px-2",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: chanObj.url,
														target: "_blank",
														rel: "noreferrer",
														children: "Visit"
													})
												})]
											})]
										})
									]
								})]
							}, chanName);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setShowPublishModal(false),
						children: "Close"
					}) })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showQrModal,
			onOpenChange: setShowQrModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm bg-card/90 backdrop-blur-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-primary" }), "Generate Job QR Code"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Generate printable and shareable QR codes linking directly to the job apply page." })] }), loadingQr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center p-8 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Generating QR assets..."
					})]
				}) : qrData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-white p-3 shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: `${API_HOST_URL}${qrData.qr_png_url}`,
							alt: "Job Apply QR Code",
							className: "w-48 h-48 rounded-lg"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1 text-xs",
									onClick: () => window.open(`${API_HOST_URL}${qrData.qr_png_url}`, "_blank"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "PNG"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1 text-xs",
									onClick: () => window.open(`${API_HOST_URL}${qrData.qr_svg_url}`, "_blank"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "SVG"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs",
								onClick: () => {
									navigator.clipboard.writeText(qrData.apply_url);
									toast.success("Apply URL copied!");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-3.5 w-3.5" }), "Copy Apply Link"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "default",
								className: "w-full text-xs",
								onClick: handlePrintQr,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1.5 h-3.5 w-3.5" }), "Print QR Code"]
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-4 text-xs text-muted-foreground",
					children: "Failed to load QR asset."
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showExportModal,
			onOpenChange: setShowExportModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5 text-primary" }), "Export Applicants"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Export candidate applications. Select your desired format and filtering criteria." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Format"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: exportFormat,
								onValueChange: (val) => setExportFormat(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select format" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "csv",
										children: "CSV Spreadsheet (.csv)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "excel",
										children: "Excel Document (.xlsx)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "pdf",
										children: "PDF Document (.pdf)"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Pipeline Stage Filter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: exportFilter,
								onValueChange: (val) => setExportFilter(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select stage" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Applicants"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "shortlisted",
										children: "Shortlisted Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "interviewed",
										children: "Interviewed Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "rejected",
										children: "Rejected Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "selected",
										children: "Selected/Hired Candidates"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowExportModal(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: handleExportApplicants,
						disabled: exporting,
						children: exporting ? "Exporting..." : "Download Export"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showDuplicateModal,
			onOpenChange: setShowDuplicateModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-5 w-5 text-primary" }), "Duplicate Role"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Copy settings and fields of this role to a new job posting. Edit fields to customize." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Job Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: dupTitle,
									onChange: (e) => setDupTitle(e.target.value),
									placeholder: "e.g. Frontend Developer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: dupLocation,
									onChange: (e) => setDupLocation(e.target.value),
									placeholder: "e.g. Bangalore, Jaipur, Remote"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Openings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											value: dupVacancies,
											onChange: (e) => setDupVacancies(parseInt(e.target.value) || 1)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Min Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: dupMinSalary,
											onChange: (e) => setDupMinSalary(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Max Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: dupMaxSalary,
											onChange: (e) => setDupMaxSalary(e.target.value)
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowDuplicateModal(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: handleCreateDuplicate,
						disabled: duplicating,
						children: duplicating ? "Duplicating..." : "Create Duplicate"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showCloseDialog,
			onOpenChange: setShowCloseDialog,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm bg-card/90 backdrop-blur-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-5 w-5" }), "Close Position?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Are you sure you want to close this position? This will deactivate all active publish channels and prevent any new applications." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowCloseDialog(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: handleConfirmCloseJob,
						disabled: closing,
						children: closing ? "Closing..." : "Close Position"
					})]
				})]
			})
		})
	] });
}
function Section({ title, children, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-3 font-display text-sm font-semibold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" }), title]
		}), children]
	});
}
function Bullets({ items }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1.5 text-xs text-muted-foreground",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it })]
		}, i))
	});
}
function FieldRow({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), children] });
}
//#endregion
export { JobDetailPage };
