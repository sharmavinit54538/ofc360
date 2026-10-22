/**
 * @file hrDashboard.types.ts
 * @description Enterprise TypeScript definitions for HR Admin Dashboard entities,
 * API responses, and dashboard metrics.
 */

export interface EmployeeSummary {
  totalActive: number;
  onProbation: number;
  onNoticePeriod: number;
  onboardedThisWeek: number;
  onboardedThisMonth: number;
  byDepartment: Record<string, number>;
  byEmploymentType: Record<string, number>;
}

export interface AttendanceSummary {
  date: string;
  totalActiveEmployees: number;
  present: number;
  late: number;
  onLeave: number;
  absent: number;
  attendanceRate: number;
  byDepartment: Record<string, { present: number; total: number; rate: number }>;
}

export interface LeaveRequestSummary {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  leaveType: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'COMPENSATORY' | 'OTHER';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedAt: string;
  reason?: string;
}

export interface PendingApprovalsSummary {
  leaves: {
    total: number;
    byType: Record<string, number>;
    items: LeaveRequestSummary[];
  };
  expenses: {
    total: number;
    totalAmount: number;
    items: ExpenseSummary[];
  };
  documents: {
    total: number;
    items: DocumentVerificationSummary[];
  };
  grandTotal: number;
}

export interface ExpenseSummary {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  category: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REIMBURSED';
  submittedAt: string;
  description?: string;
}

export interface DocumentVerificationSummary {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  documentType: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  submittedAt: string;
  expiryDate?: string;
}

export interface PayrollRunSummary {
  id: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PROCESSING' | 'PROCESSED' | 'PAID' | 'FAILED';
  totalEmployees: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  currency: string;
  createdAt: string;
  approvedAt?: string;
  processedAt?: string;
  paidAt?: string;
}

export interface PayrollDashboardSummary {
  activeRun: PayrollRunSummary | null;
  lastCompletedRun: PayrollRunSummary | null;
  upcomingRun: PayrollRunSummary | null;
  totalPendingApproval: number;
  totalProcessedThisMonth: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT' | 'POLICY' | 'EVENT' | 'CELEBRATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetAudience: 'ALL' | 'DEPARTMENT' | 'ROLE' | 'SPECIFIC';
  targetIds?: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  readCount: number;
  totalRecipients: number;
  attachments?: AnnouncementAttachment[];
}

export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UpcomingEvent {
  id: string;
  type: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'CONTRACT_END' | 'PROBATION_END' | 'PERFORMANCE_REVIEW' | 'LEAVE_START' | 'LEAVE_END';
  title: string;
  description?: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  employeeDepartment: string;
  eventDate: string;
  daysUntil: number;
  isToday: boolean;
  isThisWeek: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'ANNOUNCEMENT' | 'AUDIT_LOG' | 'EVENT' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'EMPLOYEE_JOINED' | 'EMPLOYEE_LEFT' | 'PAYROLL_RUN' | 'DOCUMENT_VERIFIED';
  title: string;
  description?: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  actorRole?: string;
  metadata?: Record<string, unknown>;
  groupDate: string;
}

export interface DashboardSummaryResponse {
  employees: EmployeeSummary;
  attendance: AttendanceSummary;
  pendingApprovals: PendingApprovalsSummary;
  payroll: PayrollDashboardSummary;
  recentAnnouncements: Announcement[];
  upcomingEvents: UpcomingEvent[];
  recentAuditLogs: AuditLogEntry[];
}

export interface ApproveLeaveRequest {
  leaveId: string;
  comment?: string;
}

export interface RejectLeaveRequest {
  leaveId: string;
  comment: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errorCode?: string;
  details?: Record<string, string[]>;
}