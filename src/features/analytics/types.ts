/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the Analytics Center Module,
 * capturing executive workforce metrics, department distribution, predictive attrition risk, and trend data.
 */

export type AnalyticsDateRange = 'MONTH' | 'QUARTER' | 'YEAR' | 'CUSTOM';

export type AttritionRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AnalyticsSummary {
  headcountGrowth: number; // percentage vs prior period, e.g. 8.4
  totalHeadcount?: number; // e.g. 842
  attritionRate: number; // percentage, e.g. 3.2
  turnoverRiskScore: number; // 0-100 risk index
  retentionProbability?: number; // percentage, e.g. 96.8
  averageTenure: number; // years, e.g. 2.8
  attendanceRate: number; // percentage, e.g. 95.4
  payrollCostVariance: number; // percentage variance, e.g. -1.4
  totalPayrollBurn?: number; // e.g. 1850000
  currency?: string;
}

export interface DepartmentBreakdown {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  percentageOfTotal?: number;
  budgetUtilization: number; // percentage, e.g. 82.5
  attritionRisk: AttritionRiskLevel;
  allocatedBudget?: number;
}

export interface WorkforceTrend {
  period: string; // e.g. "Jan", "Feb", "Q1 2026"
  headcount: number;
  joiners: number;
  leavers: number;
  projectedCost: number;
}

export interface AIAttritionRiskItem {
  employeeId: string;
  employeeName: string;
  avatarUrl?: string;
  department: string;
  role?: string;
  riskLevel: AttritionRiskLevel;
  riskScore?: number; // 0 - 100
  primaryFactors: string[];
  recommendedAction: string;
  tenureYears?: number;
  lastReviewDate?: string;
}

export interface AnalyticsFilterParams {
  dateRange?: AnalyticsDateRange;
  departmentId?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsReportResponse {
  reportUrl: string;
  generatedAt: string;
  fileName: string;
  format?: 'PDF' | 'CSV' | 'XLSX';
}
