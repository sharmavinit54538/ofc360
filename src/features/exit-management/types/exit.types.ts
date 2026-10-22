/**
 * @file exit.types.ts
 * @description Enterprise TypeScript models and interfaces for Employee Exit Management,
 * Resignations, Departmental Clearances, Exit Interviews, and Full-and-Final (FnF) Settlements.
 */

export type ExitStage =
  | 'RESIGNATION_SUBMITTED'
  | 'MANAGER_REVIEW'
  | 'CLEARANCE_PENDING'
  | 'INTERVIEW_PENDING'
  | 'FNF_SETTLEMENT'
  | 'COMPLETED'
  | 'REJECTED';

export type ExitType =
  | 'RESIGNATION'
  | 'TERMINATION'
  | 'RETIREMENT'
  | 'END_OF_CONTRACT';

export type ExitReason =
  | 'BETTER_OPPORTUNITY'
  | 'RELOCATION'
  | 'CAREER_CHANGE'
  | 'COMPENSATION'
  | 'WORK_CULTURE'
  | 'PERSONAL'
  | 'HEALTH'
  | 'PERFORMANCE'
  | 'HIGHER_STUDIES'
  | 'OTHER';

export type ClearanceDepartment = 'IT' | 'HR' | 'FINANCE' | 'ADMIN';

export type ClearanceStatus = 'PENDING' | 'CLEARED' | 'FLAGGED';

export interface ClearanceChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DepartmentClearanceItem {
  department: ClearanceDepartment;
  status: ClearanceStatus;
  signedBy?: string;
  signedAt?: string;
  remarks?: string;
  checklist: ClearanceChecklistItem[];
}

export interface ExitInterviewFeedback {
  primaryReason: string;
  overallRating: number; // 1-5
  managementRating: number; // 1-5
  cultureRating: number; // 1-5
  wouldRecommend: boolean;
  feedbackComments?: string;
  suggestions?: string;
  completedAt?: string;
}

export interface FnFSettlement {
  basicPayDues: number;
  leaveEncashment: number;
  bonusGratuity: number;
  deductions: number;
  netPayable: number;
  currency: string;
  isPaid: boolean;
  paidAt?: string;
  paymentRef?: string;
  remarks?: string;
}

export interface ExitEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation?: string;
  avatarUrl?: string;
  joiningDate?: string;
}

export interface ExitCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employee: ExitEmployee;
  exitType: ExitType;
  reason: ExitReason;
  resignationDate: string;
  noticePeriodDays: number;
  expectedLastWorkingDay: string;
  actualLastWorkingDay?: string;
  stage: ExitStage;
  handoverNotes?: string;
  replacementAssigned?: string;
  clearances: DepartmentClearanceItem[];
  interview?: ExitInterviewFeedback;
  settlement?: FnFSettlement;
  isDeactivated: boolean;
  deactivatedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExitCasePayload {
  employeeId?: string;
  exitType: ExitType;
  reason: ExitReason;
  resignationDate: string;
  expectedLastWorkingDay: string;
  noticePeriodDays?: number;
  handoverNotes?: string;
  notes?: string;
}

export interface UpdateExitStagePayload {
  id: string;
  stage: ExitStage;
  remarks?: string;
  actualLastWorkingDay?: string;
}

export interface SubmitClearancePayload {
  id: string;
  department: ClearanceDepartment;
  status: ClearanceStatus;
  remarks?: string;
  checklist: ClearanceChecklistItem[];
}

export interface SubmitExitInterviewPayload {
  id: string;
  primaryReason: string;
  overallRating: number;
  managementRating: number;
  cultureRating: number;
  wouldRecommend: boolean;
  feedbackComments?: string;
  suggestions?: string;
}

export interface ProcessFnFPayload {
  id: string;
  basicPayDues: number;
  leaveEncashment: number;
  bonusGratuity: number;
  deductions: number;
  paymentRef?: string;
  remarks?: string;
}

export interface RejectExitPayload {
  id: string;
  rejectionReason: string;
}

export interface DeactivateEmployeePayload {
  id: string;
  notes?: string;
  revokeAccessDate?: string;
}

export interface ExitFilters {
  search?: string;
  stage?: ExitStage | 'ALL';
  department?: string | 'ALL';
  exitType?: ExitType | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ExitAnalyticsMetrics {
  totalActiveExits: number;
  pendingManagerReviews: number;
  clearancesPending: number;
  fnfPending: number;
  completedThisMonth: number;
  averageNoticeDays: number;
}

export interface ExitCaseListResponse {
  items: ExitCase[];
  total: number;
  page: number;
  limit: number;
  summary?: ExitAnalyticsMetrics;
}
