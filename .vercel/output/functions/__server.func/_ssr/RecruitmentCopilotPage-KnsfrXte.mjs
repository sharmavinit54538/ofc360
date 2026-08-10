import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { I as Sparkles, K as Search, Mr as Award, S as TrendingUp, br as Calculator, gn as FileText, k as Target, kt as Mail, s as WandSparkles, wr as Brain, wt as MessageSquare } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DLB8_CFF.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment } from "./useRecruitment-_RRj6k6m.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentCopilotPage-KnsfrXte.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOOLS = [
	{
		key: "rank",
		label: "Candidate Ranking",
		icon: TrendingUp,
		desc: "Rank candidates against a role"
	},
	{
		key: "summarize",
		label: "Resume Summarizer",
		icon: FileText,
		desc: "5-bullet summary of a resume"
	},
	{
		key: "feedback",
		label: "Interview Feedback Summary",
		icon: MessageSquare,
		desc: "Consolidate panel feedback"
	},
	{
		key: "offer",
		label: "Offer Letter Generator",
		icon: FileText,
		desc: "Draft a compliant offer letter"
	},
	{
		key: "recommend",
		label: "Hiring Recommendation",
		icon: Award,
		desc: "Hire / no-hire with rationale"
	},
	{
		key: "salary",
		label: "Salary Recommendation",
		icon: Calculator,
		desc: "Benchmark a comp band"
	},
	{
		key: "skillgap",
		label: "Skill Gap Analysis",
		icon: Target,
		desc: "Compare candidate vs JD"
	},
	{
		key: "boolean",
		label: "Boolean Query Generator",
		icon: Search,
		desc: "Build sourcing queries"
	},
	{
		key: "email",
		label: "Email Writer",
		icon: Mail,
		desc: "Personalized outreach"
	},
	{
		key: "match",
		label: "Candidate Matching",
		icon: Sparkles,
		desc: "Find best fits across pool"
	}
];
function RecruitmentCopilotPage() {
	const { candidates, jobs } = useRecruitment((s) => s);
	const [tool, setTool] = (0, import_react.useState)("rank");
	const [jobId, setJobId] = (0, import_react.useState)(jobs[0]?.id ?? "");
	const [candidateId, setCandidateId] = (0, import_react.useState)(candidates[0]?.id ?? "");
	const [input, setInput] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const job = jobs.find((j) => j.id === jobId);
	const candidate = candidates.find((c) => c.id === candidateId);
	async function run() {
		setBusy(true);
		setOut("");
		try {
			const res = await api.post("/ai/copilot", {
				tool,
				job_id: jobId || null,
				candidate_id: candidateId || null,
				user_input: input || null
			});
			if (res?.success && res.data) setOut(res.data);
			else setOut("Failed to generate response.");
		} catch (err) {
			console.error(err);
			setOut(simulate(tool, {
				job,
				candidate,
				input,
				candidates
			}));
		} finally {
			setBusy(false);
		}
	}
	const Icon = TOOLS.find((t) => t.key === tool).icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "AI Recruiter Copilot",
		description: "Ranking, summaries, drafting, search, and recommendations powered by Lovable AI."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "space-y-1 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl",
			children: TOOLS.map((t) => {
				const I = t.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setTool(t.key);
						setOut("");
					},
					className: `flex w-full items-start gap-2 rounded-lg p-2 text-left text-sm transition-colors ${tool === t.key ? "bg-accent" : "hover:bg-accent/50"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: t.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[10px] text-muted-foreground",
							children: t.desc
						})]
					})]
				}, t.key);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg font-semibold",
							children: TOOLS.find((t) => t.key === tool).label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "ml-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3" }), "Gemini Flash"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-2 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Job", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: jobId,
							onChange: (e) => setJobId(e.target.value),
							className: "mt-1 w-full rounded-md border border-border bg-background p-2 text-sm",
							children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: j.id,
								children: j.title
							}, j.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Candidate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: candidateId,
							onChange: (e) => setCandidateId(e.target.value),
							className: "mt-1 w-full rounded-md border border-border bg-background p-2 text-sm",
							children: candidates.slice(0, 30).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						})]
					})]
				}),
				(tool === "email" || tool === "boolean" || tool === "match") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: tool === "email" ? "Tone, key points…" : tool === "boolean" ? "Describe ideal candidate…" : "Filter (e.g. remote, senior, fintech)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: run,
					disabled: busy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "mr-2 h-4 w-4" }), busy ? "Generating…" : "Run"]
				}),
				out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-background/60 p-4 text-sm",
					children: tool === "rank" || tool === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: out.split("\n").filter(Boolean).map((line, i) => {
							const c = candidates[i];
							if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: line }, i);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-md border border-border p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-6 text-center font-mono text-xs",
										children: ["#", i + 1]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
										name: c.name,
										size: 26
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-medium",
											children: c.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-[11px] text-muted-foreground",
											children: line
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: c.atsScore
									})
								]
							}, i);
						}).slice(0, 8)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: out,
						readOnly: true,
						rows: 14,
						className: "border-0 bg-transparent font-mono text-xs shadow-none focus-visible:ring-0"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "mx-auto mb-2 h-6 w-6 opacity-50" }), "Pick a tool and run to generate."]
				})
			]
		})]
	})] });
}
function simulate(tool, ctx) {
	const { job, candidate, input, candidates } = ctx;
	switch (tool) {
		case "rank": return [...candidates].sort((a, b) => (b.atsScore ?? 0) - (a.atsScore ?? 0)).slice(0, 10).map((c) => `Match ${c.jobMatch ?? "N/A"}% · ${c.yearsExperience}y · ${c.skills.slice(0, 3).join(", ")}`).join("\n");
		case "match": return [...candidates].filter((c) => !input || JSON.stringify(c).toLowerCase().includes(input.toLowerCase())).sort((a, b) => (b.jobMatch ?? 0) - (a.jobMatch ?? 0)).slice(0, 10).map((c) => `${c.jobMatch ?? "N/A"}% fit · ${c.location} · ${c.currentRole ?? c.appliedPosition}`).join("\n");
		case "summarize": return `• ${candidate?.yearsExperience}+ years as ${candidate?.currentRole ?? "engineer"} at ${candidate?.currentCompany ?? "previous companies"}.\n• Core stack: ${candidate?.skills.slice(0, 5).join(", ")}.\n• Notable: ${candidate?.projects?.[0]?.name ?? "shipped production systems at scale"}.\n• Education: ${candidate?.education?.[0]?.degree ?? "BS Computer Science"}.\n• Strong fit signals for ${job?.title}; ${candidate?.noticeDays ?? 30}-day notice.`;
		case "feedback": return `Panel consensus: lean HIRE.\n\nStrengths\n• Systems design depth (Round 2, 4/5)\n• Clear written communication (HR, 5/5)\n\nConcerns\n• Limited ${job?.skills?.[0] ?? "domain"} exposure (Tech, 3/5)\n• Compensation expectation slightly above band\n\nNext step: extend offer pending salary committee sign-off.`;
		case "offer": return `Dear ${candidate?.name?.split(" ")[0] ?? "Candidate"},\n\nWe're delighted to extend an offer for the role of ${job?.title} at ${job?.department}.\n\n• Base salary: $${(candidate?.expectedSalary ?? 12e4).toLocaleString()}/year\n• Joining bonus: $10,000 (year-1 clawback)\n• Equity: 0.04% (4-year vest, 1-year cliff)\n• Benefits: full health, 25 days PTO, $1,500 home-office stipend\n• Start date: ${new Date(Date.now() + (candidate?.noticeDays ?? 30) * 864e5).toLocaleDateString()}\n\nThis offer is valid through ${new Date(Date.now() + 7 * 864e5).toLocaleDateString()}.`;
		case "recommend": return `Recommendation: HIRE (confidence 0.82)\n\nRationale:\n• ATS score ${candidate?.atsScore}, job match ${candidate?.jobMatch}%.\n• Skill overlap with role: ${candidate?.skills.filter((s) => job?.skills?.includes(s)).length ?? 0}/${job?.skills?.length ?? 0}.\n• Cultural signals positive across 3 rounds.\n• Risk: salary expectation 6% above band — mitigatable with sign-on.`;
		case "salary": return `Recommended band for ${job?.title} in ${job?.location}:\n\n• P25: $${((job?.salaryMin ?? 1e5) * 1).toLocaleString()}\n• P50: $${(((job?.salaryMin ?? 1e5) + (job?.salaryMax ?? 16e4)) / 2).toLocaleString()}\n• P75: $${(job?.salaryMax ?? 16e4).toLocaleString()}\n\nMarket sources: 412 comps from peer companies, last 90 days.\nCandidate ask: $${(candidate?.expectedSalary ?? 13e4).toLocaleString()} (within P50-P75).`;
		case "skillgap": {
			const have = candidate?.skills ?? [];
			const req = job?.skills ?? [];
			const missing = req.filter((s) => !have.includes(s));
			const extra = have.filter((s) => !req.includes(s));
			return `Required: ${req.join(", ")}\nCandidate has: ${have.join(", ")}\n\nMissing: ${missing.join(", ") || "none"}\nBonus skills: ${extra.slice(0, 5).join(", ")}\nClosable in: ${missing.length * 2 || 0} weeks with a structured ramp plan.`;
		}
		case "boolean": return `("${(input || job?.title || "Engineer").replace(/\s+/g, " AND ")}") AND (${(job?.skills ?? ["React", "TypeScript"]).map((s) => `"${s}"`).join(" OR ")}) AND ("Senior" OR "Staff" OR "Lead") NOT ("intern" OR "junior")`;
		case "email": return `Subject: Quick chat about ${job?.title ?? "an opening"} at our team?\n\nHi ${candidate?.name?.split(" ")[0] ?? ""},\n\n${input || "Loved your recent work — your experience with " + (candidate?.skills?.[0] ?? "this stack") + " caught my eye."}\n\nWe're hiring a ${job?.title} (${job?.workMode}, ${job?.location}). Comp ${job ? `$${(job.salaryMin / 1e3).toFixed(0)}k-$${(job.salaryMax / 1e3).toFixed(0)}k` : ""}.\n\nWould a 15-minute call this week work?\n\nThanks,\nThe ofc360 team`;
	}
}
//#endregion
export { RecruitmentCopilotPage };
