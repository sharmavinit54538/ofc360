import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { K as Search, jn as Download, nt as Printer } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Shared-BY5JB4sY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function StatCard({ label, value, hint, icon: Icon, accent = "brand" }) {
	const accentClass = {
		brand: "from-violet-500/15 via-indigo-500/10 to-transparent text-foreground",
		success: "from-emerald-500/15 via-teal-500/10 to-transparent text-foreground",
		warning: "from-amber-500/15 via-orange-500/10 to-transparent text-foreground",
		danger: "from-rose-500/15 via-red-500/10 to-transparent text-foreground",
		muted: "from-muted via-muted/50 to-transparent text-foreground"
	}[accent];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${accentClass} bg-card/80 p-5 backdrop-blur-xl shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-bold tracking-tight text-foreground",
						children: value
					}),
					hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: hint
					}) : null
				]
			}), Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background/80 text-foreground/80 shadow-xs border border-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}) : null]
		})
	});
}
function StatusBadge({ status, tone }) {
	const cls = {
		success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20 border border-emerald-500/20",
		warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-500/20 border border-amber-500/20",
		danger: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/20 border border-rose-500/20",
		info: "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-500/20 border border-sky-500/20",
		muted: "bg-muted/80 text-muted-foreground ring-border border border-border/50"
	}[tone ?? "muted"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-80" }), status.replace(/-/g, " ")]
	});
}
function SearchBox({ value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full sm:w-72",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder: placeholder ?? "Search…",
			className: "h-9.5 pl-9 text-sm"
		})]
	});
}
function GlassCard({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl shadow-xs ${className}`,
		children
	});
}
function EmptyState({ title, description, icon: Icon, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center",
		children: [
			Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold tracking-tight text-foreground",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed",
				children: description
			}) : null,
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: action
			}) : null
		]
	});
}
function PrintButton({ label = "Export PDF" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		onClick: () => window.print(),
		className: "gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
}
function CsvButton({ rows, filename, label = "Export CSV" }) {
	function onClick() {
		if (!rows.length) return;
		const headers = Object.keys(rows[0]);
		const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		onClick,
		className: "gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
}
function QrTile({ value, size = 128, label }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) import_lib.toCanvas(ref.current, value, {
			width: size,
			margin: 1
		}, () => {});
	}, [value, size]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 shadow-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-[11px] text-muted-foreground",
			children: label ?? value
		})]
	});
}
function Progress({ value, max = 100 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 w-full overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full transition-all duration-300",
			style: {
				width: `${Math.round(value / max * 100)}%`,
				background: "var(--gradient-brand)"
			}
		})
	});
}
function Skeleton({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `animate-pulse rounded-lg bg-muted/70 ${className}` });
}
function useDelayedReady(ms = 250) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setReady(true), ms);
		return () => clearTimeout(t);
	}, [ms]);
	return ready;
}
//#endregion
export { Progress as a, Skeleton as c, useDelayedReady as d, PrintButton as i, StatCard as l, EmptyState as n, QrTile as o, GlassCard as r, SearchBox as s, CsvButton as t, StatusBadge as u };
