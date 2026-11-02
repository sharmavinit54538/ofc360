import type { UseQueryResult } from '@reduxjs/toolkit/query/react';

export type ReportCategory = 'workforce' | 'recruitment' | 'attendance' | 'payroll' | 'compliance';

export type ReportRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'IT_ADMIN';

export type ChartType = 'bar' | 'stackedBar' | 'line' | 'area' | 'donut' | 'funnel' | 'heatmap' | 'nineBox';

export type KpiFormat = 'number' | 'currency' | 'percent' | 'days';

export type FilterType = 'dateRange' | 'department' | 'location' | 'status' | 'cycle' | 'category' | 'leaveType' | 'shift' | 'custom';

export interface ReportFilterDef {
  key: string;
  label: string;
  type: FilterType;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  dependsOn?: string;
}

export interface KpiDef {
  key: string;
  label: string;
  format: KpiFormat;
  unit?: string;
  trendKey?: string;
  compute: (dataset: ReportDataset) => number | string;
}

export interface ChartSeries {
  name: string;
  data: number[];
  categories?: string[];
  stack?: string;
  color?: string;
}

export interface ChartDef {
  id: string;
  title: string;
  type: ChartType;
  seriesKeys: string[];
  xAxisKey?: string;
  yAxisLabel?: string;
  stacked?: boolean;
  height?: number;
  showLegend?: boolean;
  showDataToggle?: boolean;
}

export interface ColumnDef {
  key: string;
  header: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'date' | 'badge';
  format?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableDef {
  name: string;
  title: string;
  columns: ColumnDef[];
  rowKey: string;
  getRows: (dataset: ReportDataset) => any[];
}

export interface InsightRule {
  id: string;
  severity: 'info' | 'warn' | 'critical';
  compute: (dataset: ReportDataset) => InsightFinding | null;
}

export interface InsightFinding {
  id: string;
  severity: 'info' | 'warn' | 'critical';
  title: string;
  description: string;
  value: number | string;
  relatedChartId?: string;
  relatedTableKey?: string;
}

export interface ReportDataset {
  meta: {
    reportId: string;
    title: string;
    generatedAt: string;
    filters: Record<string, any>;
    currency: string;
  };
  kpis: KpiTile[];
  series: Record<string, ChartSeries>;
  tables: Record<string, DataTableDef>;
  warnings: string[];
}

export interface KpiTile {
  label: string;
  value: number | string;
  unit?: string;
  format: KpiFormat;
  trend?: { value: number; label: string };
  trendUpIsGood?: boolean;
}

export interface XlsxSheetDef {
  name: string;
  getData: (dataset: ReportDataset) => any[][];
  headers?: string[];
  columnWidths?: number[];
  numberFormats?: Record<number, string>;
  totalsRow?: boolean;
}

export interface ReportDefinition {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ReportRole[];
  filters: ReportFilterDef[];
  kpis: KpiDef[];
  charts: ChartDef[];
  tables: DataTableDef[];
  insights: InsightRule[];
  xlsxSheets: XlsxSheetDef[];
  useData: (filters: Record<string, any>) => Promise<ReportDataset>;
  headlineKpiKey?: string;
  defaultDateRange?: string;
}

export interface ReportRegistry {
  reports: ReportDefinition[];
  getById: (id: string) => ReportDefinition | undefined;
  getByRole: (role: ReportRole) => ReportDefinition[];
  getByCategory: (category: ReportCategory) => ReportDefinition[];
}

export type DateRangePreset = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'lastQuarter' | 'fytd' | 'custom';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export function createRegistry(reports: ReportDefinition[]): ReportRegistry {
  return {
    reports,
    getById: (id) => reports.find((r) => r.id === id),
    getByRole: (role) => reports.filter((r) => r.roles.includes(role)),
    getByCategory: (category) => reports.filter((r) => r.category === category),
  };
}