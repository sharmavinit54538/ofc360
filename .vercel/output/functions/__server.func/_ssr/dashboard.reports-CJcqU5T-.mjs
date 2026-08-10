import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { in as useGetDepartmentReportsQuery, nn as useGetAttendanceReportsQuery, rn as useGetDashboardReportsQuery, tn as useExportReportsMutation } from "./ofc360-store-Dm5opMS0.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Input } from "./input-B8HDFcHP.mjs";
import { $ as RefreshCw, K as Search, _n as FileSpreadsheet, fr as ChartColumn, gn as FileText, x as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./DashboardShell-D7_w2cCT.mjs";
import { t as Button } from "./button-BKVZsq8w.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, s as LineChart, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.reports-CJcqU5T-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHART_COLORS = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#06b6d4",
	"#ec4899",
	"#8b5cf6",
	"#3b82f6"
];
function ReportsPage() {
	const [selectedDepartment, setSelectedDepartment] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [dateRange, setDateRange] = (0, import_react.useState)("30d");
	const filterParams = (0, import_react.useMemo)(() => {
		const params = {};
		if (selectedDepartment && selectedDepartment !== "all") params.departmentId = selectedDepartment;
		if (searchQuery.trim()) params.search = searchQuery.trim();
		return params;
	}, [selectedDepartment, searchQuery]);
	const { data: dashboardReports, isLoading: isDashboardLoading, isError: isDashboardError, refetch: refetchDashboard } = useGetDashboardReportsQuery(filterParams, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true
	});
	const { data: departmentReports = [], isLoading: isDeptLoading, isError: isDeptError, refetch: refetchDepts } = useGetDepartmentReportsQuery(filterParams, { refetchOnMountOrArgChange: true });
	const { data: attendanceReports = [], isLoading: isAttLoading, refetch: refetchAttendance } = useGetAttendanceReportsQuery(filterParams, { refetchOnMountOrArgChange: true });
	const [exportReports, { isLoading: isExporting }] = useExportReportsMutation();
	const isLoading = isDashboardLoading || isDeptLoading || isAttLoading;
	const isError = isDashboardError && isDeptError;
	function handleRefetchAll() {
		refetchDashboard();
		refetchDepts();
		refetchAttendance();
		toast.info("Refetching reports from backend API via RTK Query...");
	}
	async function handleExport(format) {
		try {
			const res = await exportReports({
				reportType: "workforce_analytics",
				format,
				startDate: filterParams.startDate,
				endDate: filterParams.endDate
			}).unwrap();
			if (res.downloadUrl) {
				window.open(res.downloadUrl, "_blank");
				toast.success(`Exported report in ${format.toUpperCase()} format.`);
			} else toast.success(`Export request submitted for ${format.toUpperCase()} report.`);
		} catch (err) {
			toast.error(err?.data?.message || "Failed to trigger report export");
		}
	}
	const headcountTrend = dashboardReports?.headcountTrend || [];
	const departmentDistribution = (0, import_react.useMemo)(() => {
		if (dashboardReports?.departmentDistribution?.length) return dashboardReports.departmentDistribution;
		if (departmentReports.length) return departmentReports.map((d) => ({
			id: d.id,
			name: d.name,
			employeeCount: d.employeeCount
		}));
		return [];
	}, [dashboardReports, departmentReports]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Reports Dashboard",
				description: "Comprehensive workforce analytics, department breakdowns, and headcount trends across your organization.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleRefetchAll,
							disabled: isLoading,
							className: "text-xs h-9 cursor-pointer gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refetch" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleExport("csv"),
							disabled: isLoading || isExporting,
							className: "text-xs h-9 cursor-pointer gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export CSV" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleExport("pdf"),
							disabled: isLoading || isExporting,
							className: "text-xs h-9 cursor-pointer gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export PDF" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								disabled: isLoading,
								placeholder: "Filter by report search query...",
								className: "pl-9 h-9 text-xs border-border bg-card/60 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full sm:w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedDepartment,
								onValueChange: setSelectedDepartment,
								disabled: isLoading,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs rounded-xl border-border bg-card/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Departments" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Departments"
								}), departmentReports.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: dept.id,
									children: dept.name
								}, dept.id))] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full sm:w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: dateRange,
								onValueChange: setDateRange,
								disabled: isLoading,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs rounded-xl border-border bg-card/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "7d",
										children: "Last 7 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "30d",
										children: "Last 30 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "90d",
										children: "Last 90 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "1y",
										children: "Last 1 Year"
									})
								] })]
							})
						})
					]
				})
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsSkeleton, {}),
			!isLoading && isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsErrorState, { onRetry: handleRefetchAll }),
			!isLoading && !isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Headcount Growth Trend",
						className: "lg:col-span-2",
						children: headcountTrend.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: headcountTrend,
									margin: {
										top: 10,
										right: 10,
										left: -10,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											opacity: .15
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 11,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											allowDecimals: false,
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 11,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltipStyle }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "count",
											name: "Headcount",
											stroke: "#6366f1",
											strokeWidth: 2.5,
											dot: { r: 4 }
										})
									]
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyReportState, {
							title: "No Data Available",
							subtitle: "Headcount growth trends will populate as employee records accumulate in your backend."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Department Headcount Distribution",
						children: departmentDistribution.length > 0 && departmentDistribution.some((d) => d.employeeCount > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: departmentDistribution,
										dataKey: "employeeCount",
										nameKey: "name",
										innerRadius: 50,
										outerRadius: 85,
										paddingAngle: 3,
										children: departmentDistribution.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltipStyle }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
								] })
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyReportState, {
							title: "No Reports Available",
							subtitle: "Department distribution will display as soon as department records exist."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Attendance & Work Log Analytics",
						className: "lg:col-span-3",
						children: attendanceReports.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: attendanceReports,
									margin: {
										top: 10,
										right: 10,
										left: -10,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											opacity: .15
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "date",
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 11,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											allowDecimals: false,
											stroke: "hsl(var(--muted-foreground))",
											fontSize: 11,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: chartTooltipStyle }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "present",
											name: "Present",
											fill: "#10b981",
											radius: [
												4,
												4,
												0,
												0
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "absent",
											name: "Absent",
											fill: "#ef4444",
											radius: [
												4,
												4,
												0,
												0
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "late",
											name: "Late",
											fill: "#f59e0b",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyReportState, {
							title: "No Reports Available",
							subtitle: "Attendance analytics will appear once check-in records are registered in backend."
						})
					})
				]
			})
		]
	});
}
var chartTooltipStyle = {
	background: "hsl(var(--card))",
	border: "1px solid hsl(var(--border))",
	borderRadius: 10,
	fontSize: 12
};
function ReportCard({ title, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-bold tracking-tight text-foreground",
			children: title
		}), children]
	});
}
function EmptyReportState({ title = "No Reports Available", subtitle = "Reports will appear once data is available." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-sm font-bold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed",
				children: subtitle
			})
		]
	});
}
function ReportsSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 rounded-2xl border border-border bg-card/40 lg:col-span-2 p-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 rounded-2xl border border-border bg-card/40 p-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 rounded-2xl border border-border bg-card/40 lg:col-span-3 p-6" })
		]
	});
}
function ReportsErrorState({ onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-8 w-8 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-sm font-bold text-destructive",
				children: "Failed to Load Backend Reports"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: "Unable to connect to RTK Query endpoint or backend analytics service."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: onRetry,
				className: "gap-1.5 bg-destructive hover:bg-destructive/90 text-white cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry Fetching Reports"]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
