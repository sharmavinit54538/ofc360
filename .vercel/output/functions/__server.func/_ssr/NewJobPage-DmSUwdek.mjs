import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-1j6fcGcU.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { En as FileCheckCorner, K as Send, L as Sparkles, Ot as Maximize2, Pt as LoaderCircle, R as Smile, Tt as MessageSquare, V as ShieldCheck, et as RefreshCw, j as Tag, kt as MapPin, nr as CircleAlert, ot as Plus, r as X, s as WandSparkles, sr as Check, wr as Briefcase, wt as Minimize2, zn as Copy, zr as ArrowLeft } from "../_libs/lucide-react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-DqihOdMw.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NewJobPage-DmSUwdek.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUGGESTED_SKILLS = [
	"React",
	"TypeScript",
	"FastAPI",
	"PostgreSQL",
	"Docker",
	"Leadership",
	"Excel",
	"Python",
	"Product Design",
	"Figma",
	"AWS",
	"Machine Learning"
];
var SUGGESTED_LOCATIONS = [
	"Remote",
	"Bangalore",
	"Jaipur",
	"Hyderabad",
	"Noida",
	"Pune",
	"Mumbai",
	"San Francisco",
	"London"
];
function MarkdownRenderer({ content }) {
	if (!content) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1 text-muted-foreground prose dark:prose-invert max-w-none",
		dangerouslySetInnerHTML: { __html: content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^# (.*?)$/gm, "<h1 class=\"text-2xl font-display font-bold text-foreground mt-6 mb-3 border-b border-border pb-1.5\">$1</h1>").replace(/^## (.*?)$/gm, "<h2 class=\"text-xl font-display font-bold text-foreground mt-5 mb-2.5\">$1</h2>").replace(/^### (.*?)$/gm, "<h3 class=\"text-lg font-semibold text-foreground mt-4 mb-2\">$1</h3>").replace(/^\- (.*?)$/gm, "<li class=\"ml-5 list-disc text-sm text-muted-foreground my-1\">$1</li>").replace(/^\* (.*?)$/gm, "<li class=\"ml-5 list-disc text-sm text-muted-foreground my-1\">$1</li>").replace(/\*\*(.*?)\*\*/g, "<strong class=\"font-semibold text-foreground\">$1</strong>").replace(/\*(.*?)\*/g, "<em class=\"italic\">$1</em>").split("\n\n").map((p) => {
			const trimmed = p.trim();
			if (trimmed.startsWith("<h") || trimmed.startsWith("<li")) return trimmed;
			return `<p class="text-sm text-muted-foreground leading-relaxed my-3">${trimmed.replace(/\n/g, "<br/>")}</p>`;
		}).join("\n") }
	});
}
function getDepartmentFromTitle(title) {
	const t = title.toLowerCase();
	if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("creative")) return "Design";
	if (t.includes("sales") || t.includes("account executive") || t.includes("sales executive")) return "Sales";
	if (t.includes("marketing") || t.includes("growth") || t.includes("seo") || t.includes("brand")) return "Marketing";
	if (t.includes("hr") || t.includes("recruiter") || t.includes("people") || t.includes("talent")) return "Human Resources";
	if (t.includes("finance") || t.includes("accountant") || t.includes("billing") || t.includes("tax")) return "Finance";
	if (t.includes("support") || t.includes("success") || t.includes("help")) return "Customer Support";
	return "Engineering";
}
function NewJobPage() {
	const navigate = useNavigate();
	const { upsertJob } = useRecruitment();
	const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
	const [role, setRole] = (0, import_react.useState)("");
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [skillInput, setSkillInput] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [locationSearch, setLocationSearch] = (0, import_react.useState)("");
	const [showLocationSuggestions, setShowLocationSuggestions] = (0, import_react.useState)(false);
	const [description, setDescription] = (0, import_react.useState)("");
	const [editorTab, setEditorTab] = (0, import_react.useState)("preview");
	const [loadingMessage, setLoadingMessage] = (0, import_react.useState)("Analyzing role requirements...");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [isRefining, setIsRefining] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [customInstruction, setCustomInstruction] = (0, import_react.useState)("");
	const locationRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationSuggestions(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const filteredLocations = SUGGESTED_LOCATIONS.filter((loc) => loc.toLowerCase().includes(locationSearch.toLowerCase()));
	const handleAddSkill = (skill) => {
		const trimmed = skill.trim();
		if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
		setSkillInput("");
	};
	const handleRemoveSkill = (skillToRemove) => {
		setSkills(skills.filter((s) => s !== skillToRemove));
	};
	const handleGenerateJd = async () => {
		if (!role.trim()) {
			setErrorMsg("Role is required.");
			return;
		}
		if (skills.length === 0) {
			setErrorMsg("Please specify at least one skill.");
			return;
		}
		if (!location.trim()) {
			setErrorMsg("Location is required.");
			return;
		}
		setErrorMsg(null);
		setCurrentStep(1);
		const messages = [
			"Analyzing role requirements...",
			"Drafting professional responsibilities...",
			"Suggesting required and preferred skills...",
			"Structuring the final job description...",
			"Polishing content for candidate engagement..."
		];
		let msgIdx = 0;
		const interval = setInterval(() => {
			msgIdx = (msgIdx + 1) % messages.length;
			setLoadingMessage(messages[msgIdx]);
		}, 2e3);
		try {
			const response = await api.post("/jobs/generate-description", {
				title: role,
				department: getDepartmentFromTitle(role),
				employment_type: "Full-time",
				location,
				skills,
				experience: null
			}, { timeout: 12e4 });
			clearInterval(interval);
			if (response.success && response.data) {
				setDescription(response.data);
				setCurrentStep(2);
				setEditorTab("preview");
				toast.success("Job Description generated successfully!");
			} else throw new Error(response.message || "Failed to generate description");
		} catch (err) {
			clearInterval(interval);
			setErrorMsg(err.message || "Failed to generate description. Please check local Ollama service.");
			setCurrentStep(0);
			toast.error("Generation failed. Make sure your local backend and Ollama are active.");
		}
	};
	const handleModifyJd = async (action, customPrompt) => {
		setIsRefining(true);
		toast.info(`AI is rewriting job description...`);
		try {
			const response = await api.post("/jobs/modify-description", {
				current_description: description,
				action,
				custom_instruction: customPrompt
			}, { timeout: 12e4 });
			if (response.success && response.data) {
				setDescription(response.data);
				if (action === "custom") setCustomInstruction("");
				toast.success(`Job description refined!`);
			} else throw new Error(response.message || "Failed to modify description.");
		} catch (err) {
			toast.error(err.message || "Failed to refine description.");
		} finally {
			setIsRefining(false);
		}
	};
	const handleCopyJd = () => {
		navigator.clipboard.writeText(description);
		setCopied(true);
		toast.success("Job Description copied to clipboard!");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleSubmitJob = async (status) => {
		setIsSubmitting(true);
		setErrorMsg(null);
		const today = (/* @__PURE__ */ new Date()).toISOString();
		const close = /* @__PURE__ */ new Date();
		close.setDate(close.getDate() + 30);
		const workMode = location.toLowerCase().includes("remote") ? "Remote" : "Onsite";
		const jobPayload = {
			id: "",
			title: role,
			department: getDepartmentFromTitle(role),
			employmentType: "Full-time",
			experience: "3-5 yrs",
			skills,
			salaryMin: 0,
			salaryMax: 0,
			currency: "INR",
			vacancies: 1,
			location,
			workMode,
			description,
			responsibilities: [],
			requirements: [],
			benefits: [],
			hiringManager: "",
			recruiter: "",
			status,
			publishedAt: today,
			closingAt: close.toISOString(),
			applicants: 0
		};
		try {
			const response = await upsertJob(jobPayload);
			if (response && response.success && response.data) {
				toast.success(status === "active" ? "Job posted successfully!" : "Job draft saved!");
				navigate({
					to: "/dashboard/recruitment/jobs/$jobId",
					params: { jobId: response.data.id }
				});
			} else throw new Error(response?.message || "Failed to save job posting.");
		} catch (err) {
			console.error(err);
			setErrorMsg(err.message || "Failed to complete job creation flow.");
			toast.error("Save failed. Please check connection and try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Create Job with AI",
				description: "Fill minimal parameters and let ofc360 AI craft a professional recruitment page."
			}),
			currentStep === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-3xl mx-auto mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-3xl border border-border bg-card/45 p-8 shadow-xl backdrop-blur-2xl overflow-hidden transition-all duration-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 -left-10 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-lg font-semibold mb-6 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary animate-pulse" }), "AI Requisition Details"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "role",
											className: "text-sm font-medium text-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-muted-foreground" }),
												"Role Title ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "role",
											value: role,
											onChange: (e) => setRole(e.target.value),
											placeholder: "e.g., Senior Frontend Developer, HR Specialist, Python Developer",
											className: "h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary text-base"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "What position are you hiring for?"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "skills",
											className: "text-sm font-medium text-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-muted-foreground" }),
												"Required Skills ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "skills",
												value: skillInput,
												onChange: (e) => setSkillInput(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddSkill(skillInput);
													}
												},
												placeholder: "Type a skill and press Enter",
												className: "h-11 rounded-xl bg-background/50 border-border/80 text-base"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "secondary",
												onClick: () => handleAddSkill(skillInput),
												className: "h-11 rounded-xl px-4 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add"]
											})]
										}),
										skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2 py-2 px-3 bg-background/30 rounded-2xl border border-border/50",
											children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "py-1 px-3 text-sm rounded-lg flex items-center gap-1 bg-primary/10 text-primary border border-primary/20",
												children: [s, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleRemoveSkill(s),
													className: "hover:text-destructive focus:outline-none transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
												})]
											}, s))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-muted-foreground",
												children: "Suggested popular skills:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: SUGGESTED_SKILLS.map((s) => {
													const exists = skills.includes(s);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => exists ? handleRemoveSkill(s) : handleAddSkill(s),
														className: `text-xs px-2.5 py-1 rounded-lg border transition-all ${exists ? "bg-primary text-primary-foreground border-primary" : "bg-background/40 hover:bg-accent/40 text-muted-foreground border-border/60"}`,
														children: exists ? `✓ ${s}` : `+ ${s}`
													}, s);
												})
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									ref: locationRef,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "location",
											className: "text-sm font-medium text-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-muted-foreground" }),
												"Office Location ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "location",
												value: locationSearch,
												onChange: (e) => {
													setLocationSearch(e.target.value);
													setLocation(e.target.value);
													setShowLocationSuggestions(true);
												},
												onFocus: () => setShowLocationSuggestions(true),
												placeholder: "e.g. Remote, Bangalore, Hyderabad",
												className: "h-11 rounded-xl bg-background/50 border-border/80 text-base"
											}), showLocationSuggestions && filteredLocations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute left-0 right-0 mt-1.5 bg-popover border border-border shadow-xl rounded-xl z-50 overflow-hidden max-h-48 overflow-y-auto backdrop-blur-xl",
												children: filteredLocations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														setLocation(loc);
														setLocationSearch(loc);
														setShowLocationSuggestions(false);
													},
													className: "w-full text-left px-4 py-2.5 text-sm hover:bg-accent/80 transition-colors flex items-center gap-2 border-b border-border/20 last:border-b-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground" }), loc]
												}, loc))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Type \"Remote\" or specify a city."
										})
									]
								})
							]
						}),
						errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleGenerateJd,
								className: "w-full sm:w-auto h-11 px-8 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Generate with ofc360 AI"]
							})
						})
					]
				})
			}),
			currentStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-xl mx-auto mt-16 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card/50 p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 via-violet-500/5 to-fuchsia-500/5 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-primary/20 blur-xl animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-16 w-16 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold font-display text-foreground tracking-tight mb-2",
							children: "ofc360 AI is working"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm max-w-sm animate-pulse",
							children: loadingMessage
						})
					]
				})
			}),
			currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3 flex flex-col space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/65 backdrop-blur-xl shadow-lg overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditorTab("preview"),
									className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${editorTab === "preview" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
									children: "Preview Mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditorTab("write"),
									className: `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${editorTab === "write" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
									children: "Edit Markdown"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-3.5 w-3.5 text-primary" }), "Editable Document"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 min-h-[480px]",
							children: editorTab === "write" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								className: "w-full h-[520px] bg-background/40 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-xl p-4 font-mono text-sm leading-relaxed focus:outline-none resize-none",
								placeholder: "Enter Job Description text..."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border border-transparent px-2 h-[520px] overflow-y-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownRenderer, { content: description })
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-1 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-violet-500 before:via-primary before:to-fuchsia-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold tracking-tight text-foreground mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-1 rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-pulse" })
								}), "Refine with ofc360 AI"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "custom-instruction",
										className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 text-primary" }), "Custom AI Instruction"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: "custom-instruction",
											value: customInstruction,
											onChange: (e) => setCustomInstruction(e.target.value),
											placeholder: "e.g. Add key tech stack (React, Python) or highlight benefits...",
											disabled: isRefining,
											className: "w-full min-h-[85px] bg-background/50 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-xl p-3 text-xs leading-relaxed focus:outline-none resize-none pr-10",
											onKeyDown: (e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													if (customInstruction.trim()) handleModifyJd("custom", customInstruction);
												}
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => {
												if (customInstruction.trim()) handleModifyJd("custom", customInstruction);
											},
											disabled: isRefining || !customInstruction.trim(),
											size: "icon",
											variant: "ghost",
											className: "absolute bottom-2 right-2 h-7.5 w-7.5 rounded-lg text-primary hover:text-primary-foreground hover:bg-primary/90 disabled:text-muted-foreground disabled:bg-transparent",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: [
											"Add remote work policy",
											"List 5 cultural benefits",
											"Add an EEOC statement",
											"Require 3+ years experience"
										].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isRefining,
											onClick: () => setCustomInstruction(preset),
											className: "text-[10px] font-medium bg-muted/65 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2 py-0.5 rounded-full border border-border/40 hover:border-primary/20 transition-all text-left",
											children: ["+", preset]
										}, preset))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border/60 my-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2",
									children: "Structure & Length"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => handleModifyJd("improve"),
											disabled: isRefining,
											variant: "outline",
											className: "w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5 text-indigo-500" }), "Improve Formatting"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => handleModifyJd("expand"),
											disabled: isRefining,
											variant: "outline",
											className: "w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5 text-emerald-500" }), "Expand Content"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => handleModifyJd("shorten"),
											disabled: isRefining,
											variant: "outline",
											className: "w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5 text-rose-500" }), "Shorten JD"]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2",
									children: "Tone Adjustments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => handleModifyJd("professional"),
										disabled: isRefining,
										variant: "outline",
										className: "w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-blue-500" }), "Professional Tone"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => handleModifyJd("casual"),
										disabled: isRefining,
										variant: "outline",
										className: "w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "h-3.5 w-3.5 text-amber-500" }), "Casual Startup Tone"]
									})]
								})] })]
							}),
							isRefining && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/40 rounded-xl text-xs text-muted-foreground animate-pulse border border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-primary shrink-0" }), "ofc360 AI is working..."]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-background/30 p-4 text-xs text-muted-foreground leading-relaxed",
						children: "💡 **Tip:** Switch to the **Edit Markdown** tab if you want to make direct text edits to the document manually."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border px-6 py-4 flex items-center justify-between z-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [currentStep === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setCurrentStep(0),
						disabled: isSubmitting || isRefining,
						className: "rounded-xl border-border/80 hover:bg-accent/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), "Back"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						className: "rounded-xl border-border/80 hover:bg-accent/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/recruitment/jobs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), "Back to Jobs"]
						})
					}), currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: handleGenerateJd,
						disabled: isSubmitting || isRefining,
						className: "rounded-xl text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1.5" }), "Generate Again"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: handleCopyJd,
							disabled: isSubmitting,
							className: "rounded-xl border-border/80 flex items-center gap-1.5 bg-background hover:bg-accent/40",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied ? "Copied" : "Copy JD"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => handleSubmitJob("draft"),
							disabled: isSubmitting,
							className: "rounded-xl font-medium border border-border",
							children: isSubmitting ? "Saving..." : "Save Job"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => handleSubmitJob("active"),
							disabled: isSubmitting,
							className: "rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 flex items-center gap-1.5",
							children: [isSubmitting ? "Publishing..." : "Publish Job", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })]
						})
					] })
				})]
			})
		]
	});
}
//#endregion
export { NewJobPage };
