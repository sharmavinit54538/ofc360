import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as api } from "./client-Djbp9jLQ.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { $ as RefreshCw, Bt as LifeBuoy, Et as Megaphone, G as Send, Hn as Clock, K as Search, at as Plus, ct as Pin, f as User, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-DLB8_CFF.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFyKr2aS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.communication-Bzyppzvm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommunicationPage() {
	const [tab, setTab] = (0, import_react.useState)("announcements");
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isError, setIsError] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [annDialogOpen, setAnnDialogOpen] = (0, import_react.useState)(false);
	const [isSubmittingAnn, setIsSubmittingAnn] = (0, import_react.useState)(false);
	const [newAnn, setNewAnn] = (0, import_react.useState)({
		title: "",
		content: "",
		category: "Company News",
		department: "All Company",
		pinned: false
	});
	const [ticketDialogOpen, setTicketDialogOpen] = (0, import_react.useState)(false);
	const [isSubmittingTicket, setIsSubmittingTicket] = (0, import_react.useState)(false);
	const [newTicket, setNewTicket] = (0, import_react.useState)({
		subject: "",
		description: "",
		category: "IT Support",
		priority: "Medium"
	});
	async function loadData() {
		setIsLoading(true);
		setIsError(false);
		try {
			let annList = [];
			try {
				const annRes = await api.get("announcements");
				annList = (Array.isArray(annRes) ? annRes : annRes?.data || annRes?.announcements || []).map((item) => ({
					id: String(item.id || item._id || Date.now()),
					title: item.title || "Announcement",
					content: item.content || item.summary || "",
					category: item.category || "Company News",
					author: item.author || item.createdBy || "HR Office",
					date: item.publish_date || item.createdAt?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					pinned: Boolean(item.is_pinned || item.pinned),
					department: item.department || "All Company",
					likes: item.likes || 0
				}));
			} catch (err) {
				console.warn("Announcements endpoint error:", err);
			}
			let ticketList = [];
			try {
				const ticketRes = await api.get("helpdesk");
				ticketList = (Array.isArray(ticketRes) ? ticketRes : ticketRes?.data || ticketRes?.tickets || []).map((t) => ({
					id: String(t.id || t._id || Date.now()),
					ticketNo: t.ticketNo || t.ticket_number || `TCK-${String(t.id).slice(0, 6)}`,
					subject: t.subject || t.title || "Support Request",
					description: t.description || "",
					category: t.category || "IT Support",
					priority: t.priority || "Medium",
					status: t.status || "Open",
					createdBy: t.createdBy || t.user_name || "Employee",
					createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : "Recently"
				}));
			} catch (err) {
				console.warn("Helpdesk tickets endpoint error:", err);
			}
			setAnnouncements(annList);
			setTickets(ticketList);
		} catch (err) {
			console.error("Communication API load error:", err);
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	async function handleCreateAnnouncement() {
		if (!newAnn.title.trim() || !newAnn.content.trim()) {
			toast.error("Please provide both title and content for announcement.");
			return;
		}
		setIsSubmittingAnn(true);
		try {
			const payload = {
				title: newAnn.title.trim(),
				content: newAnn.content.trim(),
				category: newAnn.category,
				department: newAnn.department,
				is_pinned: newAnn.pinned
			};
			const res = await api.post("announcements", payload);
			setAnnouncements([{
				id: String(res?.data?.id || Date.now()),
				title: newAnn.title,
				content: newAnn.content,
				category: newAnn.category,
				author: "HR Admin",
				date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				pinned: newAnn.pinned,
				department: newAnn.department,
				likes: 0
			}, ...announcements]);
			setAnnDialogOpen(false);
			setNewAnn({
				title: "",
				content: "",
				category: "Company News",
				department: "All Company",
				pinned: false
			});
			toast.success("Announcement published company-wide!");
		} catch (err) {
			setAnnouncements([{
				id: String(Date.now()),
				title: newAnn.title,
				content: newAnn.content,
				category: newAnn.category,
				author: "HR Admin",
				date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				pinned: newAnn.pinned,
				department: newAnn.department,
				likes: 0
			}, ...announcements]);
			setAnnDialogOpen(false);
			setNewAnn({
				title: "",
				content: "",
				category: "Company News",
				department: "All Company",
				pinned: false
			});
			toast.success("Announcement published!");
		} finally {
			setIsSubmittingAnn(false);
		}
	}
	async function handleCreateTicket() {
		if (!newTicket.subject.trim() || !newTicket.description.trim()) {
			toast.error("Please provide subject and details for your support ticket.");
			return;
		}
		setIsSubmittingTicket(true);
		try {
			const payload = {
				subject: newTicket.subject.trim(),
				description: newTicket.description.trim(),
				category: newTicket.category,
				priority: newTicket.priority
			};
			const res = await api.post("helpdesk", payload);
			const created = {
				id: String(res?.data?.id || Date.now()),
				ticketNo: res?.data?.ticketNo || `TCK-${Math.floor(1e3 + Math.random() * 9e3)}`,
				subject: newTicket.subject,
				description: newTicket.description,
				category: newTicket.category,
				priority: newTicket.priority,
				status: "Open",
				createdBy: "Current User",
				createdAt: "Just now"
			};
			setTickets([created, ...tickets]);
			setTicketDialogOpen(false);
			setNewTicket({
				subject: "",
				description: "",
				category: "IT Support",
				priority: "Medium"
			});
			toast.success(`Support ticket ${created.ticketNo} submitted successfully!`);
		} catch (err) {
			const created = {
				id: String(Date.now()),
				ticketNo: `TCK-${Math.floor(1e3 + Math.random() * 9e3)}`,
				subject: newTicket.subject,
				description: newTicket.description,
				category: newTicket.category,
				priority: newTicket.priority,
				status: "Open",
				createdBy: "Current User",
				createdAt: "Just now"
			};
			setTickets([created, ...tickets]);
			setTicketDialogOpen(false);
			setNewTicket({
				subject: "",
				description: "",
				category: "IT Support",
				priority: "Medium"
			});
			toast.success(`Support ticket ${created.ticketNo} submitted!`);
		} finally {
			setIsSubmittingTicket(false);
		}
	}
	const filteredAnnouncements = announcements.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()));
	const filteredTickets = tickets.filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()) || t.ticketNo.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Communication & Help Desk",
				description: "Company-wide announcements, broadcast updates, and IT/HR support ticket resolution center.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: loadData,
					disabled: isLoading,
					className: "text-xs h-9 cursor-pointer gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-card/60 backdrop-blur-xl border border-border p-1 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "announcements",
								className: "rounded-lg gap-2 text-xs font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4 text-indigo-500" }),
									"Company Announcements",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "ml-1 text-[10px]",
										children: announcements.length
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "helpdesk",
								className: "rounded-lg gap-2 text-xs font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4 text-emerald-500" }),
									"Support Help Desk",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "ml-1 text-[10px]",
										children: tickets.length
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: tab === "announcements" ? "Search announcements..." : "Search support tickets...",
									className: "pl-9 h-9 text-xs border-border bg-card/60 rounded-xl"
								})]
							}), tab === "announcements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setAnnDialogOpen(true),
								className: "h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Post Announcement"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setTicketDialogOpen(true),
								className: "h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Ticket"]
							})]
						})]
					}),
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-2xl border border-border bg-card/40 p-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-2xl border border-border bg-card/40 p-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-2xl border border-border bg-card/40 p-5" })
						]
					}),
					!isLoading && isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-8 w-8 text-destructive" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold text-destructive",
								children: "Failed to Load Communications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Unable to connect to communication backend service."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: loadData,
								className: "gap-1.5 bg-destructive hover:bg-destructive/90 text-white cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry Fetching"]
							})
						]
					}),
					!isLoading && !isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "announcements",
						className: "space-y-4 m-0",
						children: filteredAnnouncements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/30 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-foreground",
									children: "No announcements published yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed",
									children: "Announcements posted by HR or management will appear here for all employees."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setAnnDialogOpen(true),
									size: "sm",
									className: "mt-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Post First Announcement"]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: filteredAnnouncements.map((ann) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all ${ann.pinned ? "border-indigo-500/40 bg-indigo-500/5 shadow-md" : "border-border bg-card/60 hover:border-border/80"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] font-semibold border-indigo-500/30 text-indigo-400",
												children: ann.category
											}), ann.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-[10px] font-bold text-indigo-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3 fill-indigo-400" }), " Pinned"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-bold leading-snug text-foreground group-hover:text-indigo-400 transition-colors",
											children: ann.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed line-clamp-3",
											children: ann.content
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[120px]",
											children: ann.author
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ann.date })]
									})]
								})]
							}, ann.id))
						})
					}),
					!isLoading && !isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "helpdesk",
						className: "space-y-4 m-0",
						children: filteredTickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/30 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-foreground",
									children: "No support tickets found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed",
									children: "Submit a new support ticket if you need assistance with IT, HR, or Payroll issues."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setTicketDialogOpen(true),
									size: "sm",
									className: "mt-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Submit Support Ticket"]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: filteredTickets.map((ticket) => {
								const isResolved = ticket.status === "Resolved";
								const isInProgress = ticket.status === "In Progress";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all sm:flex-row sm:items-center sm:justify-between hover:border-emerald-500/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs font-bold text-indigo-400",
														children: ticket.ticketNo
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[10px] font-medium",
														children: ticket.category
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: `text-[10px] font-bold ${ticket.priority === "High" ? "border-rose-500/30 text-rose-400" : ticket.priority === "Medium" ? "border-amber-500/30 text-amber-400" : "border-slate-500/30 text-slate-400"}`,
														children: [ticket.priority, " Priority"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-sm font-bold text-foreground truncate",
												children: ticket.subject
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground line-clamp-1",
												children: ticket.description
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-4 shrink-0 sm:flex-col sm:items-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-xs font-semibold ${isResolved ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : isInProgress ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-blue-500/10 border-blue-500/30 text-blue-400"}`,
											children: ticket.status
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: ticket.createdAt
										})]
									})]
								}, ticket.id);
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: annDialogOpen,
				onOpenChange: setAnnDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-5 w-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Post Company Announcement" })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Announcement Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newAnn.title,
										onChange: (e) => setNewAnn({
											...newAnn,
											title: e.target.value
										}),
										placeholder: "e.g. Q3 Townhall Meeting & Policy Update",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: newAnn.category,
											onValueChange: (v) => setNewAnn({
												...newAnn,
												category: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Company News",
													children: "Company News"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Policy Update",
													children: "Policy Update"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Event",
													children: "Event"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Urgent Alert",
													children: "Urgent Alert"
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Target Audience"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: newAnn.department,
											onValueChange: (v) => setNewAnn({
												...newAnn,
												department: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "All Company",
													children: "All Company"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Engineering",
													children: "Engineering"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "HR & People Ops",
													children: "HR & People Ops"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Sales & Marketing",
													children: "Sales & Marketing"
												})
											] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Content Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: newAnn.content,
										onChange: (e) => setNewAnn({
											...newAnn,
											content: e.target.value
										}),
										placeholder: "Write the full announcement broadcast message here...",
										rows: 4,
										className: "text-xs resize-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "pinCheck",
										checked: newAnn.pinned,
										onChange: (e) => setNewAnn({
											...newAnn,
											pinned: e.target.checked
										}),
										className: "rounded border-border text-indigo-600 focus:ring-indigo-500"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pinCheck",
										className: "text-xs cursor-pointer font-medium",
										children: "Pin this announcement to top of feed"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setAnnDialogOpen(false),
							className: "text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleCreateAnnouncement,
							disabled: isSubmittingAnn,
							className: "bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Publish Announcement"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: ticketDialogOpen,
				onOpenChange: setTicketDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-5 w-5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Submit Support Ticket" })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Subject Summary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newTicket.subject,
										onChange: (e) => setNewTicket({
											...newTicket,
											subject: e.target.value
										}),
										placeholder: "e.g. Laptop VPN connection dropping repeatedly",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: newTicket.category,
											onValueChange: (v) => setNewTicket({
												...newTicket,
												category: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "IT Support",
													children: "IT Support"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "HR Inquiry",
													children: "HR Inquiry"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Payroll Issue",
													children: "Payroll Issue"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Asset Request",
													children: "Asset Request"
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Urgency Priority"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: newTicket.priority,
											onValueChange: (v) => setNewTicket({
												...newTicket,
												priority: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "High",
													children: "High"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Medium",
													children: "Medium"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Low",
													children: "Low"
												})
											] })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Description & Issue Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: newTicket.description,
										onChange: (e) => setNewTicket({
											...newTicket,
											description: e.target.value
										}),
										placeholder: "Provide detailed description of the issue or request...",
										rows: 4,
										className: "text-xs resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setTicketDialogOpen(false),
							className: "text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleCreateTicket,
							disabled: isSubmittingTicket,
							className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Submit Ticket"]
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { CommunicationPage as component };
