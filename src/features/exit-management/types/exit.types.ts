/**
 * @file exit.types.ts
 * @description Enterprise TypeScript models for Employee Exit Management (14-Stage Workflow).
 * Accommodates real /api/v1/exits/* routes, defensive backend response normalizers,
 * multi-department clearances, separated Exit vs F&F statuses, and full audit timelines.
 */

export type ExitStage =
  | 'RESIGNATION_SUBMITTED'
  | 'MANAGER_REVIEW'
  | 'HR_REVIEW'
  | 'NOTICE_PERIOD'
  | 'KNOWLEDGE_TRANSFER'
  | 'CLEARANCE_PENDING'
  | 'FNF_SETTLEMENT'
  | 'EXIT_INTERVIEW'
  | 'DOCUMENTS_PENDING'
  | 'ACCESS_REVOCATION'
  | 'COMPLETED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ExitStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type FnFStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PAYMENT_PROCESSING'
  | 'PAID'
  | 'ON_HOLD';

export type ExitType =
  | 'RESIGNATION'
  | 'TERMINATION'
  | 'RETIREMENT'
  | 'END_OF_CONTRACT';

export type ExitReason =
  | 'BETTER_CAREER_OPPORTUNITY'
  | 'PERSONAL_REASONS'
  | 'HIGHER_EDUCATION'
  | 'RELOCATION'
  | 'HEALTH_REASONS'
  | 'SALARY_ISSUES'
  | 'WORK_ENVIRONMENT'
  | 'OTHER';

export type ClearanceDepartment =
  | 'MANAGER'
  | 'IT'
  | 'FINANCE'
  | 'ADMIN'
  | 'HR';

export type ClearanceStatus =
  | 'PENDING'
  | 'CLEARED'
  | 'ON_HOLD'
  | 'REJECTED';

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface ApprovalRecord {
  status: ApprovalStatus;
  comments?: string;
  rejectionReason?: string;
  decisionAt?: string;
  decisionBy?: string;
  decisionByName?: string;
}

export interface NoticePeriodDetails {
  resignationDate: string;
  noticeDays: number;
  expectedLastWorkingDay: string;
  actualLastWorkingDay?: string;
  servedDays: number;
  remainingDays: number;
  status: 'ACTIVE' | 'SERVED' | 'WAIVED' | 'BUYOUT';
}

export interface KnowledgeTransferTask {
  id: string;
  title: string;
  category:
    | 'PROJECT'
    | 'CODE_REPOSITORY'
    | 'DOCUMENTATION'
    | 'CLIENT'
    | 'PENDING_TASKS'
    | 'NEW_EMPLOYEE_TRAINING'
    | 'FINAL_VERIFICATION';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'REJECTED';
  assigneeId?: string;
  assigneeName?: string;
  completedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface ExitAssetItem {
  id: string;
  assetId: string;
  name: string;
  serialNumber?: string;
  category?: string;
  assignedDate?: string;
  returnDate?: string;
  condition?: 'GOOD' | 'FAIR' | 'DAMAGED' | 'LOST';
  recoveryAmount?: number;
  remarks?: string;
  verifiedBy?: string;
  status: 'ASSIGNED' | 'RETURNED' | 'PENDING' | 'RECOVERED';
}

export interface ClearanceChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DepartmentClearanceItem {
  department: ClearanceDepartment;
  status: ClearanceStatus;
  signedBy?: string;
  signedByName?: string;
  signedAt?: string;
  remarks?: string;
  reason?: string;
  checklist: ClearanceChecklistItem[];
}

export type FnFEarningType =
  | 'PENDING_SALARY'
  | 'LEAVE_ENCASHMENT'
  | 'BONUS'
  | 'INCENTIVES'
  | 'REIMBURSEMENTS'
  | 'GRATUITY'
  | 'OTHER_PAYABLE';

export type FnFDeductionType =
  | 'ADVANCE'
  | 'LOAN'
  | 'NOTICE_BUYOUT'
  | 'ASSET_RECOVERY'
  | 'TAX_STATUTORY'
  | 'OTHER_DEDUCTION';

export interface FnFEarningItem {
  id: string;
  label: string;
  amount: number;
  type: FnFEarningType;
}

export interface FnFDeductionItem {
  id: string;
  label: string;
  amount: number;
  type: FnFDeductionType;
}

export interface FnFSettlement {
  status: FnFStatus;
  earnings: FnFEarningItem[];
  deductions: FnFDeductionItem[];
  grossEarnings: number;
  totalDeductions: number;
  netPayable: number;
  currency: string;
  holdReason?: string;
  transactionId?: string;
  paidAt?: string;
  statementUrl?: string;
  remarks?: string;
}

export interface ExitInterview {
  reasonForLeaving: string;
  workEnvironmentRating: number;
  managerBehaviourRating: number;
  salaryBenefitsRating: number;
  careerGrowthRating: number;
  whatShouldImprove: string;
  wouldRejoin: boolean;
  additionalComments?: string;
  completedAt?: string;
  submittedBy?: string;
}

export interface ExitDocumentItem {
  id: string;
  title: string;
  documentNumber: string;
  type:
    | 'RESIGNATION_ACCEPTANCE'
    | 'RELIEVING_LETTER'
    | 'EXPERIENCE_LETTER'
    | 'FNF_STATEMENT'
    | 'NO_DUES_CERTIFICATE'
    | 'EXIT_CONFIRMATION';
  issueDate: string;
  status: 'DRAFT' | 'GENERATED' | 'ISSUED' | 'DOWNLOADED';
  fileUrl?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  actorId?: string;
  actorName: string;
  actorRole?: string;
  timestamp: string;
  stage?: ExitStage;
}

export interface ExitCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatarUrl?: string;
  department: string;
  designation: string;
  joiningDate: string;
  managerId?: string;
  managerName: string;
  resignationDate: string;
  noticeDays: number;
  expectedLastWorkingDay: string;
  actualLastWorkingDay?: string;
  reason: ExitReason | string;
  comments?: string;
  stage: ExitStage;
  exitStatus: ExitStatus;
  fnfStatus: FnFStatus;
  managerApproval: ApprovalRecord;
  hrApproval: ApprovalRecord;
  clearances: DepartmentClearanceItem[];
  ktStatus: boolean;
  ktTasks: KnowledgeTransferTask[];
  assignedAssets: ExitAssetItem[];
  settlement: FnFSettlement;
  interview?: ExitInterview;
  documents: ExitDocumentItem[];
  timeline: TimelineEvent[];
  isCompleted: boolean;
  completedAt?: string;
  isDeactivated: boolean;
  deactivatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// API Request & Query Payloads
// ==========================================

export interface ResignPayload {
  reason: string;
  comments: string;
  proposedLastWorkingDay: string;
  resignationDate?: string;
  noticePeriodDays?: number;
}

export interface ManagerApprovePayload {
  id: string;
  comments?: string;
}

export interface ManagerRejectPayload {
  id: string;
  rejectionReason: string;
}

export interface HrApprovePayload {
  id: string;
  comments?: string;
  lastWorkingDay?: string;
}

export interface HrRejectPayload {
  id: string;
  rejectionReason: string;
}

export interface StartNoticePeriodPayload {
  id: string;
  lastWorkingDay?: string;
  remarks?: string;
}

export interface KtCompletePayload {
  id: string;
  remarks?: string;
}

export interface AssetReturnPayload {
  id: string;
  assetId: string;
  condition?: 'GOOD' | 'FAIR' | 'DAMAGED' | 'LOST';
  recoveryAmount?: number;
  remarks?: string;
}

export interface ClearanceSignoffPayload {
  id: string;
  department: ClearanceDepartment;
  status: ClearanceStatus;
  remarks?: string;
  reason?: string;
}

export interface FnFUpdatePayload {
  id: string;
  status?: FnFStatus;
  earnings?: FnFEarningItem[];
  deductions?: FnFDeductionItem[];
  holdReason?: string;
  transactionId?: string;
  remarks?: string;
}

export interface ExitInterviewPayload {
  id: string;
  reasonForLeaving: string;
  workEnvironmentRating: number;
  managerBehaviourRating: number;
  salaryBenefitsRating: number;
  careerGrowthRating: number;
  whatShouldImprove: string;
  wouldRejoin: boolean;
  additionalComments?: string;
}

export interface GenerateDocumentsPayload {
  id: string;
  documentTypes?: string[];
}

export interface CompleteExitPayload {
  id: string;
  remarks?: string;
}

export interface ExitFilters {
  search?: string;
  stage?: ExitStage | 'ALL';
  department?: string | 'ALL';
  exitStatus?: ExitStatus | 'ALL';
  fnfStatus?: FnFStatus | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ExitAnalyticsMetrics {
  totalExits: number;
  activeExits: number;
  pendingManagerReviews: number;
  pendingHrReviews: number;
  pendingClearances: number;
  pendingFnF: number;
  completedThisMonth: number;
  averageNoticeDays: number;
  attritionRate?: number;
}

export interface ExitCaseListResponse {
  items: ExitCase[];
  total: number;
  page: number;
  limit: number;
  summary?: ExitAnalyticsMetrics;
}
