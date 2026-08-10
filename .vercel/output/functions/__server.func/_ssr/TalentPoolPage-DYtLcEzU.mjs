import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as apiInstance } from "./ofc360-store-XkEEWRxo.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { A as Tag, Er as Bookmark, I as Sparkles, K as Search, N as Star, jn as Download, ln as Funnel, m as UserPlus, y as Upload } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DvuoMluw.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-_RRj6k6m.mjs";
import { o as StageBadge, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AddCandidateDialog } from "./AddCandidateDialog-C_-FNoJi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TalentPoolPage-DYtLcEzU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TalentPoolPage() {
	const { candidates, refreshAll } = useRecruitment();
	const [q, setQ] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)(null);
	const [minScore, setMinScore] = (0, import_react.useState)(0);
	const [showAddModal, setShowAddModal] = (0, import_react.useState)(false);
	const computedSavedSearches = (0, import_react.useMemo)(() => {
		return [
			{
				id: "ss1",
				name: "Senior React Engineers",
				query: "react senior"
			},
			{
				id: "ss2",
				name: "Product Designers — Remote",
				query: "design remote"
			},
			{
				id: "ss3",
				name: "Data Scientists — Python",
				query: "python data"
			},
			{
				id: "ss4",
				name: "Sales Leaders — EMEA",
				query: "sales emea"
			}
		].map((s) => {
			const ql = s.query.toLowerCase().split(" ");
			const count = candidates.filter((c) => {
				const text = `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
				return ql.every((term) => text.includes(term));
			}).length;
			return {
				...s,
				count
			};
		});
	}, [candidates]);
	const allTags = (0, import_react.useMemo)(() => Array.from(new Set(candidates.flatMap((c) => [...c.skills, ...c.tags]))).slice(0, 24), [candidates]);
	const results = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase();
		return candidates.filter((c) => {
			if (minScore && (c.atsScore ?? 0) < minScore) return false;
			if (tag && ![...c.skills, ...c.tags].includes(tag)) return false;
			if (!ql) return true;
			return c.name.toLowerCase().includes(ql) || c.appliedPosition.toLowerCase().includes(ql) || c.location.toLowerCase().includes(ql) || c.skills.join(" ").toLowerCase().includes(ql);
		});
	}, [
		candidates,
		q,
		tag,
		minScore
	]);
	const handleExportCSV = async () => {
		try {
			const response = await apiInstance.get("/candidates/export/csv", { responseType: "blob" });
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "candidates_export.csv");
			document.body.appendChild(link);
			link.click();
			link.remove();
			toast.success("CSV export downloaded successfully!");
		} catch (err) {
			toast.error("Failed to export candidates.");
		}
	};
	const handleImportCSV = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const fileData = new FormData();
		fileData.append("file", file);
		try {
			const response = await apiInstance.post("/candidates/import", fileData, { headers: { "Content-Type": "multipart/form-data" } });
			if (response.data?.success) {
				toast.success(response.data?.message || "Successfully imported candidates!");
				await refreshAll();
			} else toast.error("Import failed");
		} catch (err) {
			toast.error("Failed to import candidates. Make sure the file format is correct.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			id: "csv-import-input",
			accept: ".csv",
			className: "hidden",
			onChange: handleImportCSV
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Talent Pool",
			description: `Searchable database of ${candidates.length} candidates across every requisition.`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => document.getElementById("csv-import-input")?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), "Import CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: handleExportCSV,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowAddModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 h-4 w-4" }), "Add to Pool"]
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4 lg:col-span-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" }), "Saved Searches"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: computedSavedSearches.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setQ(s.query),
								className: "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-accent/40 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "ml-2",
									children: s.count
								})]
							}) }, s.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }), "Skills & Tags"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTag(null),
								className: `rounded-full px-2 py-0.5 text-xs ring-1 ${!tag ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`,
								children: "All"
							}), allTags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTag(t),
								className: `rounded-full px-2 py-0.5 text-xs ring-1 ${tag === t ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`,
								children: t
							}, t))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" }), "Min ATS Score"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 95,
								step: 5,
								value: minScore,
								onChange: (e) => setMinScore(Number(e.target.value)),
								className: "w-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["≥ ", minScore]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 lg:col-span-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Boolean search: skills, role, location…",
								className: "border-0 bg-transparent shadow-none focus-visible:ring-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3" }), "AI Match"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [results.length, " matching candidates"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 md:grid-cols-2",
						children: [results.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/recruitment/candidates/$candidateId",
							params: { candidateId: c.id },
							className: "group block rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, { name: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-semibold group-hover:text-primary transition-colors",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: c.stage })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												c.currentRole || c.appliedPosition,
												" · ",
												c.location
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1",
											children: c.skills.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px]",
												children: s
											}, s))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex items-center justify-between",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 text-xs text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }),
													c.yearsExperience,
													"y · ",
													c.source
												]
											})
										})
									]
								})]
							})
						}, c.id)), !results.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
							children: "No candidates match your filters."
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCandidateDialog, {
			open: showAddModal,
			onOpenChange: setShowAddModal,
			title: "Add Candidate to Pool",
			description: "Create a new candidate profile to include in the talent pool database.",
			successMessage: "Candidate added to Talent Pool successfully.",
			stage: "screening",
			appliedPositionFallback: "Candidate"
		})
	] });
}
//#endregion
export { TalentPoolPage };
