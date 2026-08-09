import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { Cn as FileText, Kr as ArrowLeft, Pt as MapPin, Vn as DollarSign, Yn as CloudUpload, dr as ChevronRight, jr as Briefcase, lr as CircleAlert, mr as Check, sr as CircleCheckBig, yt as Paperclip, z as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { t as Route } from "./jobs.apply._ukey-DjJXky9s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs.apply._ukey-CJp1IIB4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JobApplyPage() {
	const { ukey } = Route.useParams();
	const [job, setJob] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [experienceYears, setExperienceYears] = (0, import_react.useState)("");
	const [currentCompany, setCurrentCompany] = (0, import_react.useState)("");
	const [currentDesignation, setCurrentDesignation] = (0, import_react.useState)("");
	const [currentCtc, setCurrentCtc] = (0, import_react.useState)("");
	const [expectedCtc, setExpectedCtc] = (0, import_react.useState)("");
	const [noticePeriod, setNoticePeriod] = (0, import_react.useState)("");
	const [highestQualification, setHighestQualification] = (0, import_react.useState)("");
	const [linkedinUrl, setLinkedinUrl] = (0, import_react.useState)("");
	const [portfolioUrl, setPortfolioUrl] = (0, import_react.useState)("");
	const [coverLetter, setCoverLetter] = (0, import_react.useState)("");
	const [resumeFile, setResumeFile] = (0, import_react.useState)(null);
	const [declarationChecked, setDeclarationChecked] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const PUBLIC_API_URL = "http://127.0.0.1:8000/".replace(/\/$/, "") + "/api/public/careers";
	(0, import_react.useEffect)(() => {
		async function fetchJobDetails() {
			try {
				setLoading(true);
				setError(null);
				const res = await axios.get(`${PUBLIC_API_URL}/apply/${ukey}`);
				if (res.data && res.data.success && res.data.data) setJob(res.data.data);
				else setError("Failed to fetch job details.");
			} catch (err) {
				setError(err.response?.data?.message || err.message || "Job posting not found or link has expired.");
			} finally {
				setLoading(false);
			}
		}
		fetchJobDetails();
	}, [ukey]);
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const ext = file.name.split(".").pop()?.toLowerCase();
			if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
				toast.error("Only PDF, DOC, or DOCX files are allowed.");
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				toast.error("File size cannot exceed 5MB.");
				return;
			}
			setResumeFile(file);
			toast.success(`Resume uploaded: ${file.name}`);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!resumeFile) {
			toast.error("Please upload your resume.");
			return;
		}
		if (!declarationChecked) {
			toast.error("You must accept the candidate declaration.");
			return;
		}
		setSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("resume_file", resumeFile);
			formData.append("first_name", firstName);
			formData.append("last_name", lastName);
			formData.append("email", email);
			formData.append("phone", phone);
			formData.append("city", city);
			formData.append("state", state);
			formData.append("country", country);
			formData.append("experience_years", experienceYears || "0");
			formData.append("declaration_checked", String(declarationChecked));
			if (currentCompany) formData.append("current_company", currentCompany);
			if (currentDesignation) formData.append("current_designation", currentDesignation);
			if (currentCtc) formData.append("current_ctc", currentCtc);
			if (expectedCtc) formData.append("expected_ctc", expectedCtc);
			if (noticePeriod) formData.append("notice_period", noticePeriod);
			if (highestQualification) formData.append("highest_qualification", highestQualification);
			if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);
			if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);
			if (coverLetter) formData.append("cover_letter", coverLetter);
			const res = await axios.post(`${PUBLIC_API_URL}/apply/${ukey}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
			if (res.data && res.data.success) {
				setSuccess(true);
				toast.success("Application submitted successfully!");
			}
		} catch (err) {
			const msg = err.response?.data?.message || err.message || "Failed to submit application.";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-12 w-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-4 border-slate-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-slate-400",
					children: "Loading job detail profile..."
				})]
			})
		]
	});
	if (error || !job) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 text-center sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto rounded-2xl bg-rose-500/10 p-4 text-rose-400 w-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-xl font-bold tracking-tight text-white",
					children: "Job Posting Unavailable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-slate-400 leading-relaxed",
					children: error || "The job posting you are looking for is closed, inactive, or does not exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://google.com",
						className: "inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-750 transition-all active:scale-[0.98]",
						children: "Back to Careers"
					})
				})
			]
		})]
	});
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-lg bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl shadow-emerald-500/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto rounded-full bg-emerald-500/15 p-4 text-emerald-400 w-fit animate-pulse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-16 w-16" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display",
					children: "Application Submitted!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-slate-300 leading-relaxed",
					children: [
						"Thank you for applying to the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-indigo-400",
							children: job.title
						}),
						" position. We have successfully received your credentials."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 inline-block text-left w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
						children: "Next Steps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "text-xs text-slate-400 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"We sent a confirmation email to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-200",
										children: email
									}),
									"."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Our recruitment team will review your resume and skills mapping." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "If matched, we will contact you via email or phone for screening." })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => window.location.reload(),
						variant: "outline",
						className: "border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white",
						children: "Submit Another Application"
					})
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/20",
						children: "A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent",
						children: ["ofc360 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-normal text-indigo-400/90 text-sm tracking-normal ml-1",
							children: "Careers Portal"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5 font-semibold text-xs py-1 px-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2 animate-ping" }), " Live Opening"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-6xl mx-auto px-4 mt-8 md:mt-12 relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://google.com",
							className: "inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" }), " Back to job directory"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 mb-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full",
									children: job.department || "Engineering"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl md:text-4xl font-black tracking-tight text-white mb-3",
								children: job.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-indigo-400/80" }), job.location]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-slate-700" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-indigo-400/80" }), job.employmentType || "Full-time"]
									}),
									job.salaryMin > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-slate-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-indigo-400/80" }),
											(job.salaryMin / 1e3).toFixed(0),
											"k - ",
											(job.salaryMax / 1e3).toFixed(0),
											"k USD"
										]
									})] })
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" }),
								className: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15",
								children: ["Apply to Position ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1.5 h-4 w-4" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-7 space-y-6",
							children: [
								job.jobDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4.5 w-4.5 text-indigo-400" }), " Role Overview"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-300 text-sm leading-relaxed whitespace-pre-line",
										children: job.jobDescription
									})]
								}),
								job.skills && job.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4.5 w-4.5 text-indigo-400" }), " Core Skillsets Needed"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: job.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "bg-slate-850 text-slate-200 border-slate-700/40 hover:bg-slate-800 py-1 px-3 text-xs font-semibold rounded-lg",
											children: skill.skill_name || skill
										}, skill.id || skill))
									})]
								}),
								job.responsibilities && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4.5 w-4.5 text-indigo-400" }), " Key Responsibilities"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-300 text-sm leading-relaxed whitespace-pre-line",
										children: job.responsibilities
									})]
								}),
								job.requirements && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4.5 w-4.5 text-indigo-400" }), " Profile Requirements"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-300 text-sm leading-relaxed whitespace-pre-line",
										children: job.requirements
									})]
								}),
								job.benefits && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4.5 w-4.5 text-indigo-400" }), " Perquisites & Benefits"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-300 text-sm leading-relaxed whitespace-pre-line",
										children: job.benefits
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: "apply-form",
							className: "lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative shadow-indigo-500/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-slate-100 mb-1 flex items-center gap-2",
									children: "Apply For This Position"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 mb-5 leading-normal",
									children: "Provide your details below to sync your profile to our recruitment pipelines."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSubmit,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5",
											children: ["Resume / CV ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative border border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-4 transition-all bg-slate-950/60 text-center flex flex-col items-center justify-center min-h-[110px] group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												id: "resume",
												onChange: handleFileChange,
												accept: ".pdf,.doc,.docx",
												className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
												required: true
											}), resumeFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-7 w-7 text-indigo-400 animate-bounce" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-slate-200 truncate max-w-[240px]",
														children: resumeFile.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-medium text-slate-500",
														children: [(resumeFile.size / (1024 * 1024)).toFixed(2), " MB"]
													})
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-8 w-8 text-slate-550 group-hover:text-indigo-400 transition-colors" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-slate-300",
														children: "Drop resume here or click to browse"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-500 font-medium",
														children: "Accepting PDF, DOCX (Max 5MB)"
													})
												]
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "firstName",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: ["First Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "firstName",
												type: "text",
												required: true,
												value: firstName,
												placeholder: "Jane",
												onChange: (e) => setFirstName(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "lastName",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: ["Last Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "lastName",
												type: "text",
												required: true,
												value: lastName,
												placeholder: "Doe",
												onChange: (e) => setLastName(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "email",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email",
												type: "email",
												required: true,
												value: email,
												placeholder: "jane.doe@example.com",
												onChange: (e) => setEmail(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "phone",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: ["Phone ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "phone",
												type: "tel",
												required: true,
												value: phone,
												placeholder: "+1 555 0199",
												onChange: (e) => setPhone(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "city",
													className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
													children: ["City ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "city",
													type: "text",
													required: true,
													value: city,
													placeholder: "New York",
													onChange: (e) => setCity(e.target.value),
													className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "state",
													className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
													children: ["State ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "state",
													type: "text",
													required: true,
													value: state,
													placeholder: "NY",
													onChange: (e) => setState(e.target.value),
													className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "country",
													className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
													children: ["Country ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "country",
													type: "text",
													required: true,
													value: country,
													placeholder: "USA",
													onChange: (e) => setCountry(e.target.value),
													className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9"
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "exp",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: ["Experience (Years) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "exp",
												type: "number",
												min: "0",
												step: "0.1",
												required: true,
												value: experienceYears,
												placeholder: "3.5",
												onChange: (e) => setExperienceYears(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "highestQual",
												className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
												children: "Qualification"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "highestQual",
												type: "text",
												placeholder: "B.S. Computer Science",
												value: highestQualification,
												onChange: (e) => setHighestQualification(e.target.value),
												className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-slate-800/80 rounded-2xl p-3.5 bg-slate-950/20 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-800/50 pb-1",
													children: "Additional Details (Optional)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Current Company",
														value: currentCompany,
														onChange: (e) => setCurrentCompany(e.target.value),
														className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Current Designation",
														value: currentDesignation,
														onChange: (e) => setCurrentDesignation(e.target.value),
														className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-3 gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															placeholder: "Current CTC",
															value: currentCtc,
															onChange: (e) => setCurrentCtc(e.target.value),
															className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															placeholder: "Expected CTC",
															value: expectedCtc,
															onChange: (e) => setExpectedCtc(e.target.value),
															className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															placeholder: "Notice Period",
															value: noticePeriod,
															onChange: (e) => setNoticePeriod(e.target.value),
															className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "LinkedIn Profile URL",
														type: "url",
														value: linkedinUrl,
														onChange: (e) => setLinkedinUrl(e.target.value),
														className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Portfolio URL",
														type: "url",
														value: portfolioUrl,
														onChange: (e) => setPortfolioUrl(e.target.value),
														className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "coverLetter",
											className: "block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1",
											children: "Cover Letter (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "coverLetter",
											rows: 3,
											placeholder: "Tell us why this role appeals to you...",
											value: coverLetter,
											onChange: (e) => setCoverLetter(e.target.value),
											className: "bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												id: "declaration",
												checked: declarationChecked,
												onCheckedChange: (checked) => setDeclarationChecked(!!checked),
												className: "bg-slate-955 border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mt-0.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "declaration",
												className: "text-[10px] text-slate-450 leading-normal cursor-pointer select-none",
												children: ["I hereby declare that all the information provided by me in this application is true, complete, and accurate to the best of my knowledge. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: submitting,
											className: "w-full bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-550 hover:to-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 active:scale-[0.98] hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-4",
											children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }), "Submitting Application..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Submit Application" })
										})
									]
								})
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { JobApplyPage as component };
