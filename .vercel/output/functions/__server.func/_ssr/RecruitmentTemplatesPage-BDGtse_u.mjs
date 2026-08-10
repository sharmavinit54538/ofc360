import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { k as apiInstance } from "./ofc360-store-_w51fT7p.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { At as Mail, E as Trash2, L as Sparkles, Rn as Copy, ot as Plus } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-k8Iuy1Df.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFyKr2aS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentTemplatesPage-BDGtse_u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seed = [
	{
		id: "t_outreach_1",
		name: "Outreach - Initial Contact",
		category: "Outreach",
		subject: "Opportunities at ofc360 - {{candidate.first_name}}",
		body: "Hi {{candidate.first_name}},\n\nI came across your profile and was really impressed by your background in software engineering. We are looking for talented people to join our team at ofc360.\n\nWould you be open to a quick 15-minute introductory call this week to discuss potential opportunities?\n\nBest regards,\nRecruitment Team, ofc360",
		usage: 14
	},
	{
		id: "t_interview_1",
		name: "Interview - Schedule Confirmation",
		category: "Interview",
		subject: "Interview Scheduled with ofc360 - {{candidate.first_name}}",
		body: "Hi {{candidate.first_name}},\n\nThank you for scheduling your interview round. Here are the details of your upcoming slot:\n\n- Date/Time: {{interview.date}} at {{interview.time}}\n- Meeting Link: {{interview.meeting_url}}\n\nIf you have any questions or need to reschedule, please let us know at least 24 hours in advance.\n\nLooking forward to speaking with you!\n\nBest regards,\nRecruitment Team, ofc360",
		usage: 32
	},
	{
		id: "t_offer_1",
		name: "Offer - Formal Offer Letter",
		category: "Offer",
		subject: "Job Offer from ofc360 - {{candidate.first_name}}",
		body: "Dear {{candidate.first_name}},\n\nWe are absolutely thrilled to offer you the position of {{job.title}} at ofc360! The entire team was incredibly impressed by your interviews, and we believe you will be a fantastic addition.\n\nAttached is the formal offer letter specifying your compensation details and target joining date.\n\nPlease review and sign the document to confirm your acceptance.\n\nWarm regards,\nRecruitment Team, ofc360",
		usage: 5
	},
	{
		id: "t_rejection_1",
		name: "Rejection - Application Outcome",
		category: "Rejection",
		subject: "Update on your application with ofc360",
		body: "Dear {{candidate.first_name}},\n\nThank you for taking the time to apply and interview for the {{job.title}} role at ofc360. We truly appreciate the opportunity to review your qualifications.\n\nWhile our team was impressed by your skills, we have decided to move forward with another candidate whose experience matches the position's requirements more closely at this time.\n\nWe will keep your profile in our Talent Pool and reach out if other matching roles open up in the future. We wish you the very best in your search.\n\nSincerely,\nRecruitment Team, ofc360",
		usage: 21
	},
	{
		id: "t_onboarding_1",
		name: "Onboarding - Welcome Day 1",
		category: "Onboarding",
		subject: "Welcome to ofc360! Day 1 Prep & Details - {{candidate.first_name}}",
		body: "Hi {{candidate.first_name}},\n\nWelcome to ofc360! We are excited to have you join us next week.\n\nTo help you prepare for Day 1, here is some key information:\n\n- Start Time: 9:30 AM\n- Location: Bengaluru HQ Office\n- Dress Code: Smart Casual\n\nYour laptop and IT accounts have been set up and will be handed over to you during your onboarding session. Let us know if you need any assistance beforehand!\n\nWelcome aboard!\n\nBest regards,\nHR Operations Team, ofc360",
		usage: 8
	}
];
var CAT_TONE = {
	Outreach: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
	Interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
	Offer: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
	Rejection: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
	Onboarding: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300"
};
function RecruitmentTemplatesPage() {
	const [items, setItems] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem("ofc360.recruitment.templates");
			if (raw) try {
				return JSON.parse(raw);
			} catch {}
		}
		return seed;
	});
	const [active, setActive] = (0, import_react.useState)("t_outreach_1");
	const current = items.find((t) => t.id === active) ?? items[0] ?? null;
	const [showAiModal, setShowAiModal] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [aiForm, setAiForm] = (0, import_react.useState)({
		name: "AI Generated Template",
		category: "Outreach",
		prompt: "Write a warm, engaging initial outreach email inviting the candidate to chat about open software engineer roles."
	});
	const saveItems = (newItems) => {
		setItems(newItems);
		if (typeof window !== "undefined") window.localStorage.setItem("ofc360.recruitment.templates", JSON.stringify(newItems));
	};
	const update = (patch) => {
		if (!current) return;
		saveItems(items.map((t) => t.id === current.id ? {
			...t,
			...patch
		} : t));
	};
	const handleDuplicate = () => {
		if (!current) return;
		const newTId = `t_${Date.now()}`;
		const newT = {
			...current,
			id: newTId,
			name: `${current.name} (Copy)`,
			usage: 0
		};
		saveItems([...items, newT]);
		setActive(newTId);
		toast.success("Template duplicated successfully!");
	};
	const handleDelete = () => {
		if (!current) return;
		const next = items.filter((t) => t.id !== current.id);
		saveItems(next);
		setActive(next[0]?.id || "");
		toast.success("Template deleted successfully!");
	};
	function createTemplate() {
		const newTId = `t_${Date.now()}`;
		const newT = {
			id: newTId,
			name: "New Email Template",
			category: "Outreach",
			subject: "Greetings {{candidate.first_name}}",
			body: "Hi {{candidate.first_name}},\n\n",
			usage: 0
		};
		saveItems([...items, newT]);
		setActive(newTId);
		toast.success("New template created!");
	}
	const handleAiDraftSubmit = async (e) => {
		e.preventDefault();
		if (!aiForm.prompt) {
			toast.error("Please enter a prompt or instruction.");
			return;
		}
		setGenerating(true);
		try {
			const text = (await apiInstance.post("/ai/copilot", {
				tool: "email",
				user_input: `${aiForm.prompt} (Format the response as: Subject: [Subject Line] followed by the Body content)`
			})).data?.data || "";
			if (text) {
				let subject = `Opportunities at ofc360`;
				let body = text;
				const subjectMatch = text.match(/Subject:\s*(.*)/i);
				if (subjectMatch) {
					subject = subjectMatch[1].trim();
					body = text.replace(/Subject:\s*(.*)/i, "").trim();
				}
				const newTId = `t_${Date.now()}`;
				const newT = {
					id: newTId,
					name: aiForm.name,
					category: aiForm.category,
					subject,
					body,
					usage: 0
				};
				saveItems([...items, newT]);
				setActive(newTId);
				toast.success("AI draft generated and added to templates!");
				setShowAiModal(false);
			} else toast.error("AI returned an empty response.");
		} catch (err) {
			toast.error("Failed to generate AI draft. Please try again.");
		} finally {
			setGenerating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Email Templates",
			description: "Reusable, branded messages used across the hiring pipeline.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => setShowAiModal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), "AI Draft"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: createTemplate,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Template"]
			})] })
		}),
		items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No email templates available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Create standard message templates for outreach, interviews, and offers."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: createTemplate,
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Create Template"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 lg:col-span-1",
				children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActive(t.id),
					className: `flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all backdrop-blur-xl cursor-pointer ${current && current.id === t.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium text-foreground",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] ring-1 ${CAT_TONE[t.category]}`,
									children: t.category
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 truncate text-xs text-muted-foreground",
								children: t.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-[10px] text-muted-foreground",
								children: [
									"Used ",
									t.usage,
									" times"
								]
							})
						]
					})]
				}, t.id))
			}), current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: current.name,
						onChange: (e) => update({ name: e.target.value }),
						className: "max-w-md text-base font-semibold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: handleDuplicate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3.5 w-3.5" }), "Duplicate"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: handleDelete,
							className: "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), "Delete"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: current.category,
							onChange: (e) => update({ category: e.target.value }),
							className: "mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Outreach",
									className: "bg-background text-foreground",
									children: "Outreach"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Interview",
									className: "bg-background text-foreground",
									children: "Interview"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Offer",
									className: "bg-background text-foreground",
									children: "Offer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Rejection",
									className: "bg-background text-foreground",
									children: "Rejection"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Onboarding",
									className: "bg-background text-foreground",
									children: "Onboarding"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Subject Line"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: current.subject,
							onChange: (e) => update({ subject: e.target.value }),
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Email Body"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: current.body,
							onChange: (e) => update({ body: e.target.value }),
							className: "mt-1 min-h-[250px] font-mono text-sm leading-relaxed"
						})] })
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showAiModal,
			onOpenChange: setShowAiModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "AI Email Template Generator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Draft professional templates using the AI recruiting assistant copilot." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleAiDraftSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ai-name",
								children: "Template Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ai-name",
								value: aiForm.name,
								onChange: (e) => setAiForm({
									...aiForm,
									name: e.target.value
								}),
								placeholder: "e.g. Outreach - Senior Frontend",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ai-category",
								children: "Category *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "ai-category",
								value: aiForm.category,
								onChange: (e) => setAiForm({
									...aiForm,
									category: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								required: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Outreach",
										children: "Outreach"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Interview",
										children: "Interview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Offer",
										children: "Offer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Rejection",
										children: "Rejection"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Onboarding",
										children: "Onboarding"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ai-prompt",
								children: "Instructions for AI *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "ai-prompt",
								value: aiForm.prompt,
								onChange: (e) => setAiForm({
									...aiForm,
									prompt: e.target.value
								}),
								placeholder: "Describe what the email should say and its tone...",
								rows: 4,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowAiModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: generating,
								children: generating ? "Drafting with AI..." : "Generate Template"
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { RecruitmentTemplatesPage };
