import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  Users,
  Building2,
  CalendarDays,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  PieChart as PieIcon,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetDashboardReportsQuery,
  useGetDepartmentReportsQuery,
  useGetAttendanceReportsQuery,
  useExportReportsMutation,
  type ReportFilterParams,
} from "@/services/reportsApi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports Dashboard — Aurix" }] }),
  component: ReportsPage,
});

const CHART_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
];

function ReportsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("30d");

  // Build RTK Query Filter Parameters
  const filterParams: ReportFilterParams = useMemo(() => {
    const params: ReportFilterParams = {};
    if (selectedDepartment && selectedDepartment !== "all") {
      params.departmentId = selectedDepartment;
    }
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    return params;
  }, [selectedDepartment, searchQuery]);

  // 1. RTK Query: Dashboard Overview Reports
  const {
    data: dashboardReports,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useGetDashboardReportsQuery(filterParams, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 2. RTK Query: Department Reports
  const {
    data: departmentReports = [],
    isLoading: isDeptLoading,
    isError: isDeptError,
    refetch: refetchDepts,
  } = useGetDepartmentReportsQuery(filterParams, {
    refetchOnMountOrArgChange: true,
  });

  // 3. RTK Query: Attendance Reports
  const {
    data: attendanceReports = [],
    isLoading: isAttLoading,
    refetch: refetchAttendance,
  } = useGetAttendanceReportsQuery(filterParams, {
    refetchOnMountOrArgChange: true,
  });

  // 4. RTK Query Mutation: Export Report
  const [exportReports, { isLoading: isExporting }] = useExportReportsMutation();

  const isLoading = isDashboardLoading || isDeptLoading || isAttLoading;
  const isError = isDashboardError && isDeptError;

  function handleRefetchAll() {
    refetchDashboard();
    refetchDepts();
    refetchAttendance();
    toast.info("Refetching reports from backend API via RTK Query...");
  }

  async function handleExport(format: "pdf" | "csv" | "excel") {
    try {
      const res = await exportReports({
        reportType: "workforce_analytics",
        format,
        startDate: filterParams.startDate,
        endDate: filterParams.endDate,
      }).unwrap();

      if (res.downloadUrl) {
        window.open(res.downloadUrl, "_blank");
        toast.success(`Exported report in ${format.toUpperCase()} format.`);
      } else {
        toast.success(`Export request submitted for ${format.toUpperCase()} report.`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to trigger report export");
    }
  }

  // Pure Backend Derived Data
  const headcountTrend = dashboardReports?.headcountTrend || [];
  const departmentDistribution = useMemo(() => {
    if (dashboardReports?.departmentDistribution?.length) {
      return dashboardReports.departmentDistribution;
    }
    if (departmentReports.length) {
      return departmentReports.map((d) => ({
        id: d.id,
        name: d.name,
        employeeCount: d.employeeCount,
      }));
    }
    return [];
  }, [dashboardReports, departmentReports]);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Reports Dashboard"
        description="Comprehensive workforce analytics, department breakdowns, and headcount trends across your organization."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefetchAll}
              disabled={isLoading}
              className="text-xs h-9 cursor-pointer gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refetch</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              disabled={isLoading || isExporting}
              className="text-xs h-9 cursor-pointer gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              disabled={isLoading || isExporting}
              className="text-xs h-9 cursor-pointer gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-rose-500" />
              <span>Export PDF</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Filter by report search query..."
              className="pl-9 h-9 text-xs border-border bg-card/60 rounded-xl"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card/60">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentReports.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-36">
            <Select
              value={dateRange}
              onValueChange={setDateRange}
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-card/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last 1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


      </div>

      {/* Loading Skeleton */}
      {isLoading && <ReportsSkeleton />}

      {/* Error State */}
      {!isLoading && isError && <ReportsErrorState onRetry={handleRefetchAll} />}

      {/* Main Reports Visual Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 1. Headcount Over Time Chart */}
          <ReportCard title="Headcount Growth Trend" className="lg:col-span-2">
            {headcountTrend.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={headcountTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line type="monotone" dataKey="count" name="Headcount" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyReportState
                title="No Data Available"
                subtitle="Headcount growth trends will populate as employee records accumulate in your backend."
              />
            )}
          </ReportCard>

          {/* 2. Department Distribution Pie Chart */}
          <ReportCard title="Department Headcount Distribution">
            {departmentDistribution.length > 0 && departmentDistribution.some((d) => d.employeeCount > 0) ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      dataKey="employeeCount"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {departmentDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyReportState
                title="No Reports Available"
                subtitle="Department distribution will display as soon as department records exist."
              />
            )}
          </ReportCard>

          {/* 3. Attendance Analytics Bar Chart */}
          <ReportCard title="Attendance & Work Log Analytics" className="lg:col-span-3">
            {attendanceReports.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceReports} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyReportState
                title="No Reports Available"
                subtitle="Attendance analytics will appear once check-in records are registered in backend."
              />
            )}
          </ReportCard>
        </div>
      )}
    </div>
  );
}

// ---------------- Helpers & Sub-components ----------------
const chartTooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
};

function ReportCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4 ${className}`}>
      <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function EmptyReportState({
  title = "No Reports Available",
  subtitle = "Reports will appear once data is available.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 p-6 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
        <BarChart3 className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
      <div className="h-72 rounded-2xl border border-border bg-card/40 lg:col-span-2 p-6" />
      <div className="h-72 rounded-2xl border border-border bg-card/40 p-6" />
      <div className="h-72 rounded-2xl border border-border bg-card/40 lg:col-span-3 p-6" />
    </div>
  );
}

function ReportsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div>
        <h4 className="text-sm font-bold text-destructive">Failed to Load Backend Reports</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Unable to connect to RTK Query endpoint or backend analytics service.
        </p>
      </div>
      <Button size="sm" onClick={onRetry} className="gap-1.5 bg-destructive hover:bg-destructive/90 text-white cursor-pointer">
        <RefreshCw className="h-3.5 w-3.5" /> Retry Fetching Reports
      </Button>
    </div>
  );
}
