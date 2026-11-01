/**
 * @file exitMappers.ts
 * @description Defensive data mappers normalizing backend /api/v1/exits payloads
 * into strongly-typed UI models. Supports snake_case, camelCase, API envelopes,
 * and graceful fallbacks for partial backend responses.
 */

import type {
  ExitCase,
  ExitCaseListResponse,
  ExitStage,
  ExitStatus,
  FnFStatus,
  DepartmentClearanceItem,
  ClearanceDepartment,
  ClearanceStatus,
  ExitAssetItem,
  FnFSettlement,
  ExitInterview,
  ExitDocumentItem,
  TimelineEvent,
  ExitAnalyticsMetrics,
  NoticePeriodDetails,
  KnowledgeTransferTask,
} from '../types/exit.types';

export const DEFAULT_CLEARANCE_DEPARTMENTS: ClearanceDepartment[] = [
  'MANAGER',
  'IT',
  'FINANCE',
  'ADMIN',
  'HR',
];

export const DEFAULT_DEPARTMENT_CHECKLISTS: Record<ClearanceDepartment, string[]> = {
  MANAGER: [
    'Knowledge Transfer completed and documented',
    'Project handovers and code repositories transferred',
    'Client accounts and responsibilities reassigned',
  ],
  IT: [
    'Laptop and hardware peripherals returned',
    'VPN, Cloud console, and database access revoked',
    'Corporate email and communication tools suspended',
  ],
  FINANCE: [
    'Travel advances and petty cash cleared',
    'Corporate credit card returned and settled',
    'Outstanding loans or salary advances accounted',
  ],
  ADMIN: [
    'Office ID access card and gate pass returned',
    'Cabinet / locker keys returned',
    'Company vehicle or transit pass returned',
  ],
  HR: [
    'Exit interview scheduled and recorded',
    'Benefits, medical insurance, and PF transition explained',
    'Final Relieving and Experience letters verified',
  ],
};

/**
 * Calculates served days and remaining notice days based on resignation date and last working day.
 * Pure date math labelled "calculated".
 */
export const calculateNoticeDays = (
  resignationDateStr?: string,
  lastWorkingDayStr?: string,
  noticePeriodDays = 30
): { servedDays: number; remainingDays: number } => {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let servedDays = 0;
  if (resignationDateStr) {
    const resDate = new Date(resignationDateStr);
    if (!isNaN(resDate.getTime())) {
      const resMs = new Date(resDate.getFullYear(), resDate.getMonth(), resDate.getDate()).getTime();
      const diffDays = Math.floor((todayMs - resMs) / (1000 * 60 * 60 * 24));
      servedDays = Math.max(0, diffDays);
    }
  }

  let remainingDays = 0;
  if (lastWorkingDayStr) {
    const lwdDate = new Date(lastWorkingDayStr);
    if (!isNaN(lwdDate.getTime())) {
      const lwdMs = new Date(lwdDate.getFullYear(), lwdDate.getMonth(), lwdDate.getDate()).getTime();
      const diffDays = Math.ceil((lwdMs - todayMs) / (1000 * 60 * 60 * 24));
      remainingDays = Math.max(0, diffDays);
    }
  } else {
    remainingDays = Math.max(0, noticePeriodDays - servedDays);
  }

  return { servedDays, remainingDays };
};

/**
 * Normalizes any backend response envelope ({ data: ... } or raw payload).
 */
export const unwrapApiResponse = <T>(response: unknown): T => {
  if (response && typeof response === 'object' && 'data' in response && (response as any).data !== undefined) {
    return (response as any).data as T;
  }
  return response as T;
};

/**
 * Maps raw backend clearance items or synthesizes default department clearance items if none are present.
 */
export const mapDepartmentClearances = (raw: unknown): DepartmentClearanceItem[] => {
  const existingMap = new Map<ClearanceDepartment, DepartmentClearanceItem>();

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item) continue;
      const rawDept = (item.department || item.dept || item.name || '').toString().toUpperCase();
      let dept: ClearanceDepartment | null = null;
      if (rawDept.includes('MAN') || rawDept === 'MANAGER') dept = 'MANAGER';
      else if (rawDept.includes('IT')) dept = 'IT';
      else if (rawDept.includes('FIN') || rawDept === 'FINANCE') dept = 'FINANCE';
      else if (rawDept.includes('ADM') || rawDept === 'ADMIN') dept = 'ADMIN';
      else if (rawDept.includes('HR')) dept = 'HR';

      if (dept) {
        let status: ClearanceStatus = 'PENDING';
        const rawStatus = (item.status || '').toString().toUpperCase();
        if (rawStatus === 'CLEARED' || rawStatus === 'APPROVED') status = 'CLEARED';
        else if (rawStatus === 'ON_HOLD' || rawStatus === 'HOLD' || rawStatus === 'FLAGGED') status = 'ON_HOLD';
        else if (rawStatus === 'REJECTED') status = 'REJECTED';

        const checklist = Array.isArray(item.checklist)
          ? item.checklist.map((c: any, idx: number) => ({
              id: c.id || `chk-${dept}-${idx}`,
              label: c.label || c.title || `Checklist item ${idx + 1}`,
              completed: Boolean(c.completed || c.is_completed),
            }))
          : DEFAULT_DEPARTMENT_CHECKLISTS[dept].map((label, idx) => ({
              id: `chk-${dept}-${idx}`,
              label,
              completed: status === 'CLEARED',
            }));

        existingMap.set(dept, {
          department: dept,
          status,
          signedBy: item.signed_by || item.signedBy || item.user_id,
          signedByName: item.signed_by_name || item.signedByName || item.author_name,
          signedAt: item.signed_at || item.signedAt || item.updated_at,
          remarks: item.remarks || item.comments || item.notes,
          reason: item.reason || item.rejection_reason || item.hold_reason,
          checklist,
        });
      }
    }
  }

  return DEFAULT_CLEARANCE_DEPARTMENTS.map((dept) => {
    if (existingMap.has(dept)) {
      return existingMap.get(dept)!;
    }
    return {
      department: dept,
      status: 'PENDING',
      checklist: DEFAULT_DEPARTMENT_CHECKLISTS[dept].map((label, idx) => ({
        id: `chk-${dept}-${idx}`,
        label,
        completed: false,
      })),
    };
  });
};

/**
 * Maps assigned assets for exit recovery.
 */
export const mapExitAssets = (raw: unknown): ExitAssetItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any, idx: number) => {
    let status: ExitAssetItem['status'] = 'PENDING';
    const rawStatus = (item.status || '').toString().toUpperCase();
    if (rawStatus === 'RETURNED' || rawStatus === 'CLEARED') status = 'RETURNED';
    else if (rawStatus === 'ASSIGNED') status = 'ASSIGNED';
    else if (rawStatus === 'RECOVERED') status = 'RECOVERED';

    let condition: ExitAssetItem['condition'] = 'GOOD';
    const rawCond = (item.condition || '').toString().toUpperCase();
    if (rawCond === 'FAIR') condition = 'FAIR';
    else if (rawCond === 'DAMAGED') condition = 'DAMAGED';
    else if (rawCond === 'LOST') condition = 'LOST';

    return {
      id: item.id || `exit-asset-${idx}`,
      assetId: item.asset_id || item.assetId || item.id || `AST-${idx}`,
      name: item.name || item.asset_name || item.assetName || 'Company Asset',
      serialNumber: item.serial_number || item.serialNumber || item.serial,
      category: item.category || item.asset_type || item.type || 'Hardware',
      assignedDate: item.assigned_date || item.assignedDate || item.allocated_at,
      returnDate: item.return_date || item.returnDate || item.returned_at,
      condition,
      recoveryAmount: Number(item.recovery_amount || item.recoveryAmount || 0),
      remarks: item.remarks || item.notes || item.comments,
      verifiedBy: item.verified_by || item.verifiedBy,
      status,
    };
  });
};

/**
 * Maps Full & Final settlement details.
 * Never calculates simulated values — displays strictly backend values or 0.
 */
export const mapFnFSettlement = (raw: unknown): FnFSettlement => {
  const data = (raw && typeof raw === 'object' ? raw : {}) as any;

  let status: FnFStatus = 'DRAFT';
  const rawStatus = (data.status || data.settlement_status || '').toString().toUpperCase();
  if (rawStatus === 'UNDER_REVIEW') status = 'UNDER_REVIEW';
  else if (rawStatus === 'PENDING_APPROVAL' || rawStatus === 'PENDING') status = 'PENDING_APPROVAL';
  else if (rawStatus === 'APPROVED') status = 'APPROVED';
  else if (rawStatus === 'PAYMENT_PROCESSING' || rawStatus === 'PROCESSING') status = 'PAYMENT_PROCESSING';
  else if (rawStatus === 'PAID' || rawStatus === 'SETTLED' || data.is_paid || data.isPaid) status = 'PAID';
  else if (rawStatus === 'ON_HOLD' || rawStatus === 'HOLD') status = 'ON_HOLD';

  const earnings = Array.isArray(data.earnings)
    ? data.earnings.map((e: any, idx: number) => ({
        id: e.id || `earn-${idx}`,
        label: e.label || e.title || e.name || 'Payable Item',
        amount: Number(e.amount || 0),
        type: (e.type || 'PENDING_SALARY') as any,
      }))
    : [
        {
          id: 'earn-salary',
          label: 'Pending Salary Dues',
          amount: Number(data.basic_pay_dues || data.basicPayDues || data.salary_dues || 0),
          type: 'PENDING_SALARY' as const,
        },
        {
          id: 'earn-leave',
          label: 'Leave Encashment',
          amount: Number(data.leave_encashment || data.leaveEncashment || 0),
          type: 'LEAVE_ENCASHMENT' as const,
        },
        {
          id: 'earn-bonus',
          label: 'Bonus / Gratuity',
          amount: Number(data.bonus_gratuity || data.bonusGratuity || data.gratuity || 0),
          type: 'BONUS' as const,
        },
      ].filter((e) => e.amount > 0);

  const deductions = Array.isArray(data.deductions)
    ? data.deductions.map((d: any, idx: number) => ({
        id: d.id || `ded-${idx}`,
        label: d.label || d.title || d.name || 'Deduction Item',
        amount: Number(d.amount || 0),
        type: (d.type || 'OTHER_DEDUCTION') as any,
      }))
    : [
        {
          id: 'ded-standard',
          label: 'Total Deductions',
          amount: Number(data.deductions || 0),
          type: 'OTHER_DEDUCTION' as const,
        },
      ].filter((d) => d.amount > 0);

  const grossEarnings = earnings.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0);
  const netPayable = data.net_payable !== undefined || data.netPayable !== undefined
    ? Number(data.net_payable ?? data.netPayable)
    : Math.max(0, grossEarnings - totalDeductions);

  return {
    status,
    earnings,
    deductions,
    grossEarnings,
    totalDeductions,
    netPayable,
    currency: data.currency || 'INR',
    holdReason: data.hold_reason || data.holdReason,
    transactionId: data.transaction_id || data.transactionId || data.payment_ref || data.paymentRef,
    paidAt: data.paid_at || data.paidAt,
    statementUrl: data.statement_url || data.statementUrl || data.download_url,
    remarks: data.remarks || data.comments,
  };
};

/**
 * Maps Exit Interview feedback.
 */
export const mapExitInterview = (raw: unknown): ExitInterview | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;
  const d = raw as any;
  if (!d.reason_for_leaving && !d.primary_reason && !d.primaryReason && !d.reasonForLeaving && !d.overall_rating && !d.overallRating) {
    return undefined;
  }

  return {
    reasonForLeaving: d.reason_for_leaving || d.primary_reason || d.primaryReason || d.reasonForLeaving || '',
    workEnvironmentRating: Number(d.work_environment_rating || d.culture_rating || d.cultureRating || d.workEnvironmentRating || 4),
    managerBehaviourRating: Number(d.manager_behaviour_rating || d.management_rating || d.managementRating || d.managerBehaviourRating || 4),
    salaryBenefitsRating: Number(d.salary_benefits_rating || d.salaryBenefitsRating || d.overall_rating || d.overallRating || 4),
    careerGrowthRating: Number(d.career_growth_rating || d.careerGrowthRating || 4),
    whatShouldImprove: d.what_should_improve || d.suggestions || d.feedback_comments || d.feedbackComments || '',
    wouldRejoin: Boolean(d.would_rejoin ?? d.would_recommend ?? d.wouldRecommend ?? true),
    additionalComments: d.additional_comments || d.additionalComments || d.comments,
    completedAt: d.completed_at || d.completedAt,
    submittedBy: d.submitted_by || d.submittedBy,
  };
};

/**
 * Maps generated exit documents.
 */
export const mapExitDocuments = (raw: unknown): ExitDocumentItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any, idx: number) => {
    let type: ExitDocumentItem['type'] = 'RELIEVING_LETTER';
    const rawType = (item.type || item.document_type || item.title || '').toString().toUpperCase();
    if (rawType.includes('ACCEPT')) type = 'RESIGNATION_ACCEPTANCE';
    else if (rawType.includes('RELIEV')) type = 'RELIEVING_LETTER';
    else if (rawType.includes('EXPER')) type = 'EXPERIENCE_LETTER';
    else if (rawType.includes('FNF') || rawType.includes('SETTLEMENT')) type = 'FNF_STATEMENT';
    else if (rawType.includes('DUES') || rawType.includes('NO_DUES')) type = 'NO_DUES_CERTIFICATE';
    else if (rawType.includes('CONFIRM')) type = 'EXIT_CONFIRMATION';

    let status: ExitDocumentItem['status'] = 'GENERATED';
    const rawStatus = (item.status || '').toString().toUpperCase();
    if (rawStatus === 'DRAFT') status = 'DRAFT';
    else if (rawStatus === 'ISSUED') status = 'ISSUED';
    else if (rawStatus === 'DOWNLOADED') status = 'DOWNLOADED';

    return {
      id: item.id || `doc-${idx}`,
      title: item.title || item.name || type.replace(/_/g, ' '),
      documentNumber: item.document_number || item.documentNumber || `DOC-${item.id || idx + 100}`,
      type,
      issueDate: item.issue_date || item.issueDate || item.created_at || new Date().toISOString(),
      status,
      fileUrl: item.file_url || item.fileUrl || item.download_url,
    };
  });
};

/**
 * Maps audit timeline events.
 */
export const mapTimelineEvents = (raw: unknown): TimelineEvent[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any, idx: number) => ({
    id: item.id || `timeline-${idx}`,
    title: item.title || item.action || item.event || 'Exit Event Recorded',
    description: item.description || item.details || item.comments || item.notes,
    actorId: item.actor_id || item.actorId || item.user_id,
    actorName: item.actor_name || item.actorName || item.user_name || 'System Operator',
    actorRole: item.actor_role || item.actorRole || item.role,
    timestamp: item.timestamp || item.created_at || item.createdAt || new Date().toISOString(),
    stage: item.stage as ExitStage | undefined,
  }));
};

/**
 * Maps knowledge transfer tasks.
 */
export const mapKtTasks = (raw: unknown): KnowledgeTransferTask[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any, idx: number) => ({
    id: item.id || `kt-task-${idx}`,
    title: item.title || item.name || `Knowledge Transfer Task ${idx + 1}`,
    category: (item.category || 'PROJECT') as any,
    status: (item.status || 'NOT_STARTED') as any,
    assigneeId: item.assignee_id || item.assigneeId,
    assigneeName: item.assignee_name || item.assigneeName,
    completedAt: item.completed_at || item.completedAt,
    verifiedBy: item.verified_by || item.verifiedBy,
    notes: item.notes || item.remarks,
  }));
};

/**
 * Primary mapper: turns a raw backend exit record into a strongly-typed ExitCase.
 */
export const mapExitCase = (raw: unknown): ExitCase => {
  const d = (raw && typeof raw === 'object' ? raw : {}) as any;
  const id = String(d.id || d._id || d.exit_id || '');

  // Extract nested employee object if available
  const emp = d.employee || {};
  const employeeId = String(d.employee_id || d.employeeId || emp.id || '');
  const employeeName = d.employee_name || d.employeeName || emp.name || emp.full_name || 'Unknown Employee';
  const employeeEmail = d.employee_email || d.employeeEmail || emp.email || '';
  const employeeAvatarUrl = d.employee_avatar || d.avatar_url || emp.avatar_url;
  const designation = d.designation || d.job_title || emp.designation || 'Employee';
  const department = d.department || emp.department || 'General';
  const joiningDate = d.joining_date || d.joiningDate || emp.joining_date || '';

  // Extract manager details
  const mgr = d.manager || {};
  const managerId = d.manager_id || d.managerId || mgr.id;
  const managerName = d.manager_name || d.managerName || mgr.name || 'Direct Manager';

  // Dates and Notice Period
  const resignationDate = d.resigned_at || d.resignation_date || d.resignationDate || d.created_at || new Date().toISOString();
  const noticeDays = Number(d.notice_days || d.notice_period_days || d.noticePeriodDays || 30);
  const expectedLastWorkingDay = d.last_working_day || d.expected_last_working_day || d.expectedLastWorkingDay || resignationDate;
  const actualLastWorkingDay = d.actual_last_working_day || d.actualLastWorkingDay;

  // Stages and Statuses
  let stage: ExitStage = 'RESIGNATION_SUBMITTED';
  const rawStage = (d.stage || d.exit_stage || d.current_stage || '').toString().toUpperCase();
  if (rawStage.includes('MANAGER')) stage = 'MANAGER_REVIEW';
  else if (rawStage.includes('HR_REVIEW') || rawStage === 'HR_APPROVAL') stage = 'HR_REVIEW';
  else if (rawStage.includes('NOTICE')) stage = 'NOTICE_PERIOD';
  else if (rawStage.includes('KT') || rawStage.includes('TRANSFER')) stage = 'KNOWLEDGE_TRANSFER';
  else if (rawStage.includes('CLEARANCE')) stage = 'CLEARANCE_PENDING';
  else if (rawStage.includes('FNF') || rawStage.includes('SETTLEMENT')) stage = 'FNF_SETTLEMENT';
  else if (rawStage.includes('INTERVIEW')) stage = 'EXIT_INTERVIEW';
  else if (rawStage.includes('DOCUMENT')) stage = 'DOCUMENTS_PENDING';
  else if (rawStage.includes('REVOC') || rawStage.includes('ACCESS')) stage = 'ACCESS_REVOCATION';
  else if (rawStage.includes('COMPLET')) stage = 'COMPLETED';
  else if (rawStage.includes('REJECT')) stage = 'REJECTED';
  else if (rawStage.includes('WITHDRAW')) stage = 'WITHDRAWN';

  let exitStatus: ExitStatus = 'IN_PROGRESS';
  const rawStatus = (d.exit_status || d.status || '').toString().toUpperCase();
  if (rawStatus === 'PENDING') exitStatus = 'PENDING';
  else if (rawStatus === 'COMPLETED' || stage === 'COMPLETED') exitStatus = 'COMPLETED';
  else if (rawStatus === 'REJECTED' || stage === 'REJECTED') exitStatus = 'REJECTED';
  else if (rawStatus === 'WITHDRAWN' || stage === 'WITHDRAWN') exitStatus = 'WITHDRAWN';

  // Manager Approval Record
  const mgrApprovalRaw = d.manager_approval || {};
  const mgrStatusRaw = (d.manager_approval_status || mgrApprovalRaw.status || '').toString().toUpperCase();
  const managerApproval = {
    status: mgrStatusRaw === 'APPROVED' ? ('APPROVED' as const) : mgrStatusRaw === 'REJECTED' ? ('REJECTED' as const) : ('PENDING' as const),
    comments: d.manager_comments || mgrApprovalRaw.comments,
    rejectionReason: d.manager_rejection_reason || mgrApprovalRaw.rejection_reason,
    decisionAt: d.manager_approved_at || mgrApprovalRaw.decision_at,
    decisionBy: managerId,
    decisionByName: managerName,
  };

  // HR Approval Record
  const hrApprovalRaw = d.hr_approval || {};
  const hrStatusRaw = (d.hr_approval_status || hrApprovalRaw.status || '').toString().toUpperCase();
  const hrApproval = {
    status: hrStatusRaw === 'APPROVED' ? ('APPROVED' as const) : hrStatusRaw === 'REJECTED' ? ('REJECTED' as const) : ('PENDING' as const),
    comments: d.hr_comments || hrApprovalRaw.comments,
    rejectionReason: d.hr_rejection_reason || hrApprovalRaw.rejection_reason,
    decisionAt: d.hr_approved_at || hrApprovalRaw.decision_at,
    decisionBy: d.hr_approved_by || hrApprovalRaw.decision_by,
    decisionByName: d.hr_approved_by_name || hrApprovalRaw.decision_by_name,
  };

  const clearances = mapDepartmentClearances(d.clearance_workflow || d.clearances);
  const assignedAssets = mapExitAssets(d.assigned_assets || d.assets);
  const settlement = mapFnFSettlement(d.settlement_details || d.settlement || d.fnf);
  const interview = mapExitInterview(d.interview_details || d.interview);
  const documents = mapExitDocuments(d.documents || d.generated_documents);
  const timeline = mapTimelineEvents(d.timeline || d.audit_trail || d.history);
  const ktTasks = mapKtTasks(d.kt_tasks || d.knowledge_transfer_tasks);
  const ktStatus = Boolean(d.knowledge_transfer_complete || d.kt_complete || d.kt_status);

  return {
    id,
    caseNumber: d.case_number || d.caseNumber || (id ? `EXIT-${id.slice(0, 6).toUpperCase()}` : 'EXIT-NEW'),
    employeeId,
    employeeName,
    employeeEmail,
    employeeAvatarUrl,
    department,
    designation,
    joiningDate,
    managerId,
    managerName,
    resignationDate,
    noticeDays,
    expectedLastWorkingDay,
    actualLastWorkingDay,
    reason: d.reason || d.exit_reason || 'Other',
    comments: d.comments || d.notes || d.detailed_comments,
    stage,
    exitStatus,
    fnfStatus: settlement.status,
    managerApproval,
    hrApproval,
    clearances,
    ktStatus,
    ktTasks,
    assignedAssets,
    settlement,
    interview,
    documents,
    timeline,
    isCompleted: exitStatus === 'COMPLETED' || stage === 'COMPLETED',
    completedAt: d.completed_at || d.completedAt,
    isDeactivated: Boolean(d.is_deactivated || d.isDeactivated),
    deactivatedAt: d.deactivated_at || d.deactivatedAt,
    createdAt: d.created_at || d.createdAt || resignationDate,
    updatedAt: d.updated_at || d.updatedAt || resignationDate,
  };
};

/**
 * Maps paginated backend exit case list response.
 */
export const mapExitCaseListResponse = (response: unknown): ExitCaseListResponse => {
  const unwrapped = unwrapApiResponse<any>(response);

  if (Array.isArray(unwrapped)) {
    const items = unwrapped.map(mapExitCase);
    return {
      items,
      total: items.length,
      page: 1,
      limit: items.length,
    };
  }

  const rawItems = unwrapped.items || unwrapped.cases || unwrapped.data || [];
  const items = Array.isArray(rawItems) ? rawItems.map(mapExitCase) : [];

  return {
    items,
    total: Number(unwrapped.total ?? unwrapped.count ?? items.length),
    page: Number(unwrapped.page ?? 1),
    limit: Number(unwrapped.limit ?? 20),
    summary: unwrapped.summary ? mapExitAnalyticsMetrics(unwrapped.summary) : undefined,
  };
};

/**
 * Maps backend exit analytics metrics.
 */
export const mapExitAnalyticsMetrics = (raw: unknown): ExitAnalyticsMetrics => {
  const unwrapped = unwrapApiResponse<any>(raw);
  const d = (unwrapped && typeof unwrapped === 'object' ? unwrapped : {}) as any;

  return {
    totalExits: Number(d.total_exits ?? d.totalExits ?? 0),
    activeExits: Number(d.active_exits ?? d.activeExits ?? d.total_active_exits ?? 0),
    pendingManagerReviews: Number(d.pending_manager_reviews ?? d.pendingManagerReviews ?? 0),
    pendingHrReviews: Number(d.pending_hr_reviews ?? d.pendingHrReviews ?? 0),
    pendingClearances: Number(d.pending_clearances ?? d.pendingClearances ?? d.clearances_pending ?? 0),
    pendingFnF: Number(d.pending_fnf ?? d.pendingFnF ?? d.fnf_pending ?? 0),
    completedThisMonth: Number(d.completed_this_month ?? d.completedThisMonth ?? 0),
    averageNoticeDays: Number(d.average_notice_days ?? d.averageNoticeDays ?? 30),
    attritionRate: d.attrition_rate !== undefined ? Number(d.attrition_rate) : undefined,
  };
};
