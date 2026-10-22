/**
 * @file onboarding.types.ts
 * @description Enterprise TypeScript models for Employee Onboarding, Task Checklists,
 * Document Uploads, Compliance Verifications, and HR Admin Reviews.
 */

export type OnboardingTaskCategory =
  | 'PERSONAL_INFO'
  | 'DOCUMENTS'
  | 'IT_SETUP'
  | 'COMPLIANCE'
  | 'PAYROLL_TAX'
  | 'ORIENTATION';

export type OnboardingTaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'REJECTED';

export type OnboardingTaskType =
  | 'FORM'
  | 'DOCUMENT_UPLOAD'
  | 'ACKNOWLEDGEMENT'
  | 'IT_ASSET'
  | 'MEETING';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: OnboardingTaskCategory;
  taskType: OnboardingTaskType;
  status: OnboardingTaskStatus;
  isRequired: boolean;
  dueDate?: string;
  completedAt?: string;
  documentUrl?: string;
  documentName?: string;
  documentSize?: number;
  submittedData?: Record<string, any>;
  adminFeedback?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface OnboardingEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  avatarUrl?: string;
  managerName?: string;
}

export interface OnboardingProgress {
  totalTasks: number;
  completedTasks: number;
  pendingVerificationTasks: number;
  percentage: number;
  targetCompletionDate: string;
  isCompleted: boolean;
}

export interface OnboardingChecklistResponse {
  employee: OnboardingEmployee;
  progress: OnboardingProgress;
  tasks: OnboardingTask[];
}

export interface UpdateTaskStatusPayload {
  taskId: string;
  employeeId?: string;
  status: OnboardingTaskStatus;
  submittedData?: Record<string, any>;
}

export interface VerifyOnboardingItemPayload {
  taskId: string;
  employeeId: string;
  status: 'VERIFIED' | 'REJECTED';
  feedback?: string;
}

export interface UploadDocumentResponse {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface NewHireListItem {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  percentage: number;
  pendingVerifications: number;
  status: 'ON_TRACK' | 'BEHIND' | 'COMPLETED';
}

export interface OnboardingFilters {
  category?: OnboardingTaskCategory | 'ALL';
  status?: OnboardingTaskStatus | 'ALL';
  search?: string;
  employeeId?: string;
}
