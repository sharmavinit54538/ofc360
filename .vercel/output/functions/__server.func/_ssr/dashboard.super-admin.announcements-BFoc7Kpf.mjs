import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { Ar as Bell, Et as Megaphone, G as Send } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as Badge } from "./badge-CIlo-S9O.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { t as Card } from "./card-BcHXPpmN.mjs";
import { t as superAdminApi } from "./superAdminApi-DqdsLjRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.announcements-BFoc7Kpf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminAnnouncementsPage() {
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [isPublishing, setIsPublishing] = (0, import_react.useState)(false);
	const fetchAnnouncements = async () => {
		setIsLoading(true);
		try {
			setAnnouncements(await superAdminApi.getAnnouncements());
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchAnnouncements();
	}, []);
	const handlePublish = async (e) => {
		e.preventDefault();
		if (!title || !content) return;
		setIsPublishing(true);
		try {
			await superAdminApi.createAnnouncement({
				title,
				content,
				target_audience: "ALL"
			});
			setTitle("");
			setContent("");
			await fetchAnnouncements();
			alert("Platform announcement broadcasted to all organizations!");
		} catch (err) {
			alert(err.message || "Failed to publish announcement");
		} finally {
			setIsPublishing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5 text-indigo-400" }), "Global Platform Broadcasts & Announcements"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Broadcast system updates, maintenance windows, and feature releases to tenant admins and users."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/40 backdrop-blur-xl p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handlePublish,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4 text-amber-400" }), "Publish Platform Announcement"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Announcement title (e.g., Scheduled Maintenance / Feature Update)",
							className: "bg-background/50 h-9 text-xs",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: content,
							onChange: (e) => setContent(e.target.value),
							placeholder: "Write announcement body message...",
							className: "bg-background/50 text-xs h-24",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								disabled: isPublishing,
								type: "submit",
								size: "sm",
								className: "h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), isPublishing ? "Publishing..." : "Broadcast Announcement"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-foreground",
					children: "Recent System Announcements"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground animate-pulse",
					children: "Loading announcements..."
				}) : announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border bg-card/40 backdrop-blur-xl p-4 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold text-foreground",
							children: a.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[9px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
							children: new Date(a.created_at).toLocaleDateString()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: a.content
					})]
				}, a.id))]
			})
		]
	});
}
//#endregion
export { SuperAdminAnnouncementsPage as component };
