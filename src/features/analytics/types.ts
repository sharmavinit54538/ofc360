/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the Analytics Center Module,
 * capturing executive workforce metrics, department distribution, predictive attrition risk,
 * trend data, and deep analytical reports for all 8 core HRMS reporting modules.
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
  employmentType?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsReportResponse {
  reportUrl: string;
  generatedAt: string;
  fileName: string;
  format?: 'PDF' | 'CSV' | 'XLSX';
}

/* =========================================================================
 * AI EXECUTIVE INSIGHT MODEL
 * ========================================================================= */

export interface AIExecutiveInsight {
  id: string;
  type: 'ANOMALY' | 'RISK' | 'OPTIMIZATION' | 'RECOMMENDATION';
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  metricHighlight?: string;
  actionLabel?: string;
  actionType?: string;
}

/* =========================================================================
 * 1. PAYROLL VARIANCE & COMPENSATION REPORT
 * ========================================================================= */

export interface PayrollVarianceReportData {
  kpis: {
    totalPayrollCost: number;
    totalPayrollCostFormatted: string;
    momVariancePercent: number;
    averageCtc: number;
    averageCtcFormatted: string;
    pendingAdjustmentsCount: number;
    pendingAdjustmentsAmount: number;
    pendingAdjustmentsFormatted: string;
  };
  momVarianceTrend: Array<{
    month: string;
    grossPayroll: number; // in Lakhs
    budget: number; // in Lakhs
    variancePercent: number;
  }>;
  departmentCompensation: Array<{
    department: string;
    basicPay: number;
    allowances: number;
    incentives: number;
    overtime: number;
    total: number;
  }>;
  salaryComponents: Array<{
    name: string;
    value: number; // percentage
    amountFormatted: string;
    color: string;
  }>;
  highVarianceDepartments: Array<{
    department: string;
    headcount: number;
    previousSpend: string;
    currentSpend: string;
    variancePercent: number;
    varianceType: 'INCREASE' | 'DECREASE';
    primaryReason: string;
    status: 'Flagged' | 'Approved' | 'Review Required';
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 2. LEAVE BALANCES & ABSENCE LIABILITY REPORT
 * ========================================================================= */

export interface LeaveLiabilityReportData {
  kpis: {
    totalEncashableLiability: number;
    totalEncashableLiabilityFormatted: string;
    avgLeaveBalancePerEmployee: number;
    unplannedAbsenteeismRate: number;
    pendingApprovalsCount: number;
  };
  monthlyAbsenceTrend: Array<{
    month: string;
    plannedDays: number;
    unplannedDays: number;
    ratePercent: number;
  }>;
  leaveTypeDistribution: Array<{
    name: string;
    days: number;
    percentage: number;
    color: string;
  }>;
  departmentLiability: Array<{
    department: string;
    liabilityAmount: number;
    liabilityFormatted: string;
    avgDays: number;
    employeeCount: number;
  }>;
  highLiabilityEmployees: Array<{
    employeeId: string;
    name: string;
    department: string;
    designation: string;
    balanceDays: number;
    encashableDays: number;
    liabilityAmountFormatted: string;
    lapseRiskDate: string;
    actionNeeded: string;
  }>;
  peakAbsenteeismAlert: {
    peakMonths: string[];
    riskSeverity: 'MEDIUM' | 'HIGH';
    warningNote: string;
  };
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 3. PERFORMANCE & 9-BOX TALENT GRID REPORT
 * ========================================================================= */

export interface TalentGridEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  rating: number; // e.g. 4.6
  potentialScore: number; // e.g. 4.8
  flightRisk: AttritionRiskLevel;
}

export interface NineBoxCell {
  id: string;
  boxKey: string; // e.g. 'high-high', 'med-high'
  performance: 'LOW' | 'MEDIUM' | 'HIGH';
  potential: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  shortDesc: string;
  count: number;
  percentage: number;
  color: string;
  badgeBg: string;
  employees: TalentGridEmployee[];
}

export interface PerformanceTalentReportData {
  kpis: {
    appraisalCompletionRate: number;
    highPerformersCount: number;
    highPerformersPercent: number;
    topFlightRiskTalentCount: number;
    avgGoalProgress: number;
  };
  nineBoxGrid: NineBoxCell[];
  ratingDistribution: Array<{
    rating: string;
    actualCount: number;
    actualPercent: number;
    targetPercent: number;
  }>;
  departmentGoalCompletion: Array<{
    department: string;
    completionRate: number;
    goalsOnTrack: number;
    totalGoals: number;
    avgPerformanceScore: number;
  }>;
  successionPlanHighlights: Array<{
    keyRole: string;
    incumbent: string;
    readinessStatus: 'Ready Now' | 'Ready in 1-2 Yrs' | 'High Risk (No Successor)';
    designatedSuccessor: string;
    department: string;
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 4. TRAVEL & EXPENSE SPENDING AUDIT REPORT
 * ========================================================================= */

export interface TravelExpenseAuditReportData {
  kpis: {
    totalSpend: number;
    totalSpendFormatted: string;
    budgetVariancePercent: number;
    policyViolationFlagsCount: number;
    violationAmountFormatted: string;
    avgClaimTurnaroundDays: number;
  };
  categorySplit: Array<{
    name: string;
    amount: number;
    amountFormatted: string;
    percentage: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    travelSpend: number;
    expenseSpend: number;
    budget: number;
  }>;
  topSpendingDepartments: Array<{
    department: string;
    spendAmount: number;
    spendFormatted: string;
    budget: number;
    utilizationPercent: number;
    claimsCount: number;
  }>;
  outOfPolicyClaims: Array<{
    claimId: string;
    employeeName: string;
    department: string;
    date: string;
    category: string;
    amountFormatted: string;
    policyViolation: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'Flagged' | 'Under Audit' | 'Justified' | 'Rejected';
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 5. ASSET INVENTORY & DEPRECIATION REPORT
 * ========================================================================= */

export interface AssetInventoryReportData {
  kpis: {
    totalAssetValue: number;
    totalAssetValueFormatted: string;
    depreciatedBookValue: number;
    depreciatedBookValueFormatted: string;
    assetUtilizationRate: number;
    underRepairLostCount: number;
    underRepairCount: number;
    lostCount: number;
  };
  categoryDistribution: Array<{
    name: string;
    count: number;
    totalValueFormatted: string;
    percentage: number;
    color: string;
  }>;
  depreciationSchedule: Array<{
    year: string;
    bookValueLakhs: number;
    accumulatedDepreciationLakhs: number;
    straightLineValue: number;
  }>;
  assignedVsAvailable: Array<{
    category: string;
    assigned: number;
    available: number;
    inMaintenance: number;
  }>;
  warrantyAlerts: Array<{
    assetTag: string;
    model: string;
    assignedTo: string;
    department: string;
    purchaseDate: string;
    warrantyExpiryDate: string;
    daysRemaining: number;
    status: 'Expiring Soon' | 'Expired' | 'Active';
    replacementEstCost: string;
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 6. STATUTORY REGISTERS & AUDIT EXPORTS REPORT
 * ========================================================================= */

export interface StatutoryComplianceReportData {
  kpis: {
    complianceScore: number;
    totalPfContributionFormatted: string;
    ptTdsDeductedFormatted: string;
    auditReadyRegistersCount: number;
    totalRegistersCount: number;
  };
  monthlyContributions: Array<{
    month: string;
    epf: number;
    esi: number;
    pt: number;
    tds: number;
    lwf: number;
    total: number;
  }>;
  filingTimeline: Array<{
    registerName: string;
    period: string;
    statutoryDueDate: string;
    filedDate: string;
    challanAckNo: string;
    status: 'FILED_ON_TIME' | 'DUE_SOON' | 'DELAYED' | 'EXEMPT';
    totalAmountFormatted: string;
  }>;
  exportableRegisters: Array<{
    id: string;
    name: string;
    code: string;
    description: string;
    frequency: string;
    formats: Array<'CSV' | 'PDF' | 'XLSX'>;
  }>;
  complianceGaps: Array<{
    employeeId: string;
    employeeName: string;
    department: string;
    missingRequirement: string;
    severity: 'CRITICAL' | 'WARNING';
    actionRequired: string;
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 7. RECRUITMENT FUNNEL & SOURCING REPORT
 * ========================================================================= */

export interface RecruitmentFunnelReportData {
  kpis: {
    openPositions: number;
    avgTimeToHireDays: number;
    costPerHireFormatted: string;
    offerAcceptanceRate: number;
  };
  funnelStages: Array<{
    stage: string;
    count: number;
    conversionPercent: number;
    dropOffCount: number;
    dropOffPercent: number;
    fillColor: string;
  }>;
  sourcingChannels: Array<{
    channel: string;
    candidates: number;
    hires: number;
    hireRate: number;
    costPerHire: number;
    qualityScore: number;
  }>;
  departmentRequisitions: Array<{
    department: string;
    openCount: number;
    inProgress: number;
    offered: number;
    avgDaysOpen: number;
  }>;
  funnelBottlenecks: Array<{
    stage: string;
    issueTitle: string;
    dropRate: string;
    primaryCause: string;
    recommendedRemedy: string;
  }>;
  aiInsights: AIExecutiveInsight[];
}

/* =========================================================================
 * 8. ATTENDANCE & SHIFT UTILIZATION REPORT
 * ========================================================================= */

export interface AttendanceShiftReportData {
  kpis: {
    avgDailyAttendanceRate: number;
    lateMarkRate: number;
    overtimeHoursTotal: number;
    shiftRosterAdherence: number;
  };
  shiftUtilization: Array<{
    shiftName: string;
    scheduled: number;
    present: number;
    utilizationPercent: number;
    overtimeHours: number;
  }>;
  attendanceTrend: Array<{
    date: string;
    attendancePercent: number;
    lateArrivalsCount: number;
    earlyDeparturesCount: number;
  }>;
  checkInMethodSplit: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  chronicLateComers: Array<{
    employeeId: string;
    name: string;
    department: string;
    lateOccurrencesMonth: number;
    avgMinutesLate: number;
    shift: string;
    status: 'Notice Sent' | 'Warning Due' | 'Counseling Scheduled';
  }>;
  shiftRebalanceAdvice: {
    overburdenedShift: string;
    underutilizedShift: string;
    recommendation: string;
  };
  aiInsights: AIExecutiveInsight[];
}

export type ReportModuleId =
  | 'workforce-analytics'
  | 'payroll-reports'
  | 'leave-liability'
  | 'performance-matrix'
  | 'expenses-travel'
  | 'asset-audit'
  | 'statutory-compliance'
  | 'recruitment-reports'
  | 'attendance-reports';
